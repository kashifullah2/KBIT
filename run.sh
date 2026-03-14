#!/bin/bash

# ==============================================================================
# Brain Half One-Click Deployment Script for AWS EC2 (Ubuntu/Debian)
# This script automates complete installation, setup, and deployment
# ==============================================================================

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Strict error handling with trap
set -euo pipefail
trap 'echo -e "${RED}❌ Script failed at line $LINENO${NC}"; exit 1' ERR

# Setup variables
DB_NAME="user_db"
DB_USER="${DB_USER:-brainhalf_user}"
DB_PASS="${DB_PASS:-$(openssl rand -base64 12 | tr -d '\n')}"
GROQ_API_KEY="${GROQ_API_KEY:-}"
OPENROUTER_API_KEY="${OPENROUTER_API_KEY:-}"

APP_DIR=$(pwd)
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
ACTUAL_USER=${SUDO_USER:-$(whoami)}
ABS_BACKEND_DIR=$(readlink -f $BACKEND_DIR)

# Display welcome banner
clear
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                Brain Half Auto-Deploy                     ║"
echo "║          Complete Installation & Deployment              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Database User: $DB_USER"
echo "   Database Name: $DB_NAME"
echo "   App Directory: $APP_DIR"
echo ""

#--------------------------------------------------
# Helper function for error handling
#--------------------------------------------------
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}❌ $1 not found${NC}"
        return 1
    fi
}

log_step() {
    echo -e "${BLUE}>>> $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

#--------------------------------------------------
# 1. System Update & Dependencies
#--------------------------------------------------
log_step "Step 1: Updating system and installing dependencies..."

sudo apt update -y > /dev/null 2>&1
sudo apt upgrade -y > /dev/null 2>&1

# Install system dependencies
sudo apt install -y \
    nginx postgresql postgresql-contrib python3 python3-venv python3-pip \
    curl jq git lsof tesseract-ocr libtesseract-dev certbot python3-certbot-nginx \
    build-essential libssl-dev libffi-dev > /dev/null 2>&1

log_success "System dependencies installed"

# Install Node.js if needed
if ! check_command node; then
    log_step "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null 2>&1
    sudo apt install -y nodejs > /dev/null 2>&1
    log_success "Node.js installed"
else
    log_success "Node.js already installed ($(node -v))"
fi

# Install/Update npm packages
sudo npm install -g pm2 > /dev/null 2>&1
log_success "NPM global packages installed"

#--------------------------------------------------
# 2. PostgreSQL & PgBouncer Setup
#--------------------------------------------------
log_step "Step 2: Configuring PostgreSQL and PgBouncer..."

sudo apt install -y pgbouncer > /dev/null 2>&1

# Start PostgreSQL
sudo systemctl start postgresql > /dev/null 2>&1
sudo systemctl enable postgresql > /dev/null 2>&1

# Create database user and database (idempotent)
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASS';" > /dev/null 2>&1

sudo -u postgres psql -c "ALTER USER \"$DB_USER\" CREATEDB;" > /dev/null 2>&1

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER \"$DB_USER\";" > /dev/null 2>&1

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO \"$DB_USER\";" > /dev/null 2>&1

# Configure PgBouncer
MD5_PASS=$(sudo -u postgres psql --no-align --tuples-only -c "SELECT '\"' || rolname || '\" \"' || rolpassword FROM pg_authid WHERE rolname='$DB_USER';" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

echo "$MD5_PASS" | sudo tee /etc/pgbouncer/userlist.txt > /dev/null

cat << EOF | sudo tee /etc/pgbouncer/pgbouncer.ini > /dev/null
[databases]
$DB_NAME = host=127.0.0.1 port=5432 dbname=$DB_NAME

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 500
default_pool_size = 20
EOF

sudo systemctl restart pgbouncer > /dev/null 2>&1 || sudo systemctl start pgbouncer > /dev/null 2>&1
sudo systemctl enable pgbouncer > /dev/null 2>&1

log_success "PostgreSQL and PgBouncer configured"

#--------------------------------------------------
# 3. Backend Setup
#--------------------------------------------------
log_step "Step 3: Setting up FastAPI backend..."

cd "$BACKEND_DIR"

# Create virtual environment if needed
if [ ! -d "venv" ]; then
    python3 -m venv venv > /dev/null 2>&1
    log_success "Virtual environment created"
fi

# Activate and install dependencies
source venv/bin/activate

pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1
pip install gunicorn uvicorn > /dev/null 2>&1

log_success "Backend dependencies installed"

# Setup .env file with database credentials
if [ ! -f ".env" ]; then
    log_step "Creating .env file..."
    cat > .env << EOF
DB_URL=postgresql://$DB_USER:$DB_PASS@localhost:6432/$DB_NAME
GROQ_API_KEY=${GROQ_API_KEY:-your_groq_api_key_here}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-your_openrouter_api_key_here}
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=*
EOF
    log_success ".env file created"
else
    log_success ".env file already exists"
fi

# Get worker count
WORKERS=$(( $(nproc) * 2 + 1 ))

# Create systemd service
SERVICE_FILE="/etc/systemd/system/brainhalf-backend.service"
log_step "Creating systemd service..."

cat << EOF | sudo tee $SERVICE_FILE > /dev/null
[Unit]
Description=Brain Half FastAPI Backend with Gunicorn
After=network.target postgresql.service pgbouncer.service

[Service]
Type=simple
User=$ACTUAL_USER
WorkingDirectory=$ABS_BACKEND_DIR
Environment="PATH=$ABS_BACKEND_DIR/venv/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=$ABS_BACKEND_DIR/venv/bin/gunicorn main:app \\
    --workers $WORKERS \\
    --worker-class uvicorn.workers.UvicornWorker \\
    --bind 127.0.0.1:8000 \\
    --max-requests 100 \\
    --max-requests-jitter 10 \\
    --timeout 120 \\
    --access-logfile - \\
    --error-logfile -
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

# Start backend service
if systemctl is-active --quiet brainhalf-backend; then
    sudo systemctl restart brainhalf-backend
    log_success "Backend service restarted"
else
    sudo systemctl start brainhalf-backend
    sleep 2
    if systemctl is-active --quiet brainhalf-backend; then
        log_success "Backend service started"
    else
        log_error "Failed to start backend service"
        echo -e "${YELLOW}🔍 Inspecting recent logs:${NC}"
        sudo journalctl -u brainhalf-backend -n 20 --no-pager
        exit 1
    fi
fi

sudo systemctl enable brainhalf-backend > /dev/null 2>&1

deactivate

#--------------------------------------------------
# 4. Frontend Setup
#--------------------------------------------------
log_step "Step 4: Building React frontend..."

cd "$FRONTEND_DIR"

# Install dependencies
npm install > /dev/null 2>&1
log_success "Frontend dependencies installed"

# Build frontend
export VITE_API_URL="/"
npm run build > /dev/null 2>&1
log_success "Frontend built successfully"

#--------------------------------------------------
# 5. Nginx Configuration
#--------------------------------------------------
log_step "Step 5: Configuring Nginx..."

NGINX_CONF="/etc/nginx/sites-available/brainhalf"

cat << EOF | sudo tee $NGINX_CONF > /dev/null
server {
    listen 80;
    server_name _;

    # Serve React Frontend
    root $FRONTEND_DIR/dist;
    index index.html index.htm;

    # Client upload size limit
    client_max_body_size 100M;

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # API Routes - proxy to backend
    location ~ ^/(chat|upload|ocr|extract|improve|signup|token|users|cv|download) {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeouts for long-running requests (OCR, PDF processing)
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Remove default Nginx config
if [ -L /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Enable Brain Half Nginx config
if [ ! -L /etc/nginx/sites-enabled/brainhalf ]; then
    sudo ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

# Verify and restart Nginx
if sudo nginx -t > /dev/null 2>&1; then
    sudo systemctl restart nginx > /dev/null 2>&1
    sudo systemctl enable nginx > /dev/null 2>&1
    log_success "Nginx configured and started"
else
    log_error "Nginx configuration test failed"
    sudo nginx -t
    exit 1
fi

#--------------------------------------------------
# 6. Permissions & Optimization
#--------------------------------------------------
log_step "Step 6: Setting permissions and optimizing..."

sudo chmod o+x /home/$ACTUAL_USER
sudo chown -R $ACTUAL_USER:www-data $FRONTEND_DIR/dist
sudo chmod -R 755 $APP_DIR
sudo usermod -a -G www-data $ACTUAL_USER 2>/dev/null || true

# Add swap for low-RAM systems
if [ ! -f /swapfile ]; then
    log_step "Adding 1GB swap for low-RAM systems..."
    sudo fallocate -l 1G /swapfile > /dev/null 2>&1
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile > /dev/null 2>&1
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
    log_success "Swap file configured"
fi

#--------------------------------------------------
# 7. Verify Services
#--------------------------------------------------
log_step "Step 7: Verifying all services..."

sleep 2

# Check PostgreSQL
if sudo systemctl is-active --quiet postgresql; then
    log_success "PostgreSQL running"
else
    log_error "PostgreSQL not running"
fi

# Check PgBouncer
if sudo systemctl is-active --quiet pgbouncer; then
    log_success "PgBouncer running"
else
    log_error "PgBouncer not running"
fi

# Check Backend
if systemctl is-active --quiet brainhalf-backend; then
    log_success "Backend service running"
else
    log_error "Backend service not running"
fi

# Check Nginx
if sudo systemctl is-active --quiet nginx; then
    log_success "Nginx running"
else
    log_error "Nginx not running"
fi

#--------------------------------------------------
# 8. Get Server Info
#--------------------------------------------------
SERVER_IP=$(hostname -I | awk '{print $1}')
[ -z "$SERVER_IP" ] && SERVER_IP="localhost"

#--------------------------------------------------
# 9. Summary & Next Steps
#--------------------------------------------------
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Brain Half Deployment Completed Successfully!        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Access Your Application:${NC}"
echo "   URL: http://$SERVER_IP"
echo "   Dashboard: http://$SERVER_IP/cv-builder"
echo "   AI Assistant: http://$SERVER_IP (chat interface)"
echo ""
echo -e "${BLUE}🔧 Service Status:${NC}"
echo "   Backend: http://$SERVER_IP/health"
echo "   Nginx: Running on port 80/443"
echo ""
echo -e "${BLUE}📄 Configuration Files:${NC}"
echo "   Backend Config: $BACKEND_DIR/.env"
echo "   Nginx Config: /etc/nginx/sites-available/brainhalf"
echo "   Backend Service: /etc/systemd/system/brainhalf-backend.service"
echo ""
echo -e "${YELLOW}⚠️  Required Setup:${NC}"
echo "   1. Update API Keys in $BACKEND_DIR/.env:"
echo "      - GROQ_API_KEY"
echo "      - OPENROUTER_API_KEY"
echo ""
echo "   2. Restart backend after updating .env:"
echo "      sudo systemctl restart brainhalf-backend"
echo ""
echo -e "${YELLOW}📱 Useful Commands:${NC}"
echo "   View Logs:     sudo journalctl -u brainhalf-backend -f"
echo "   Restart App:   sudo systemctl restart brainhalf-backend"
echo "   Check Status:  sudo systemctl status brainhalf-backend"
echo "   Nginx Logs:    sudo tail -f /var/log/nginx/access.log"
echo ""

# Optional: Setup HTTPS
echo -e "${BLUE}🔐 HTTPS Setup (Optional):${NC}"
read -p "   Enter domain for HTTPS (or press Enter to skip): " DOMAIN

if [ -n "$DOMAIN" ]; then
    echo "   Setting up Let's Encrypt SSL..."
    if sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN > /dev/null 2>&1; then
        log_success "HTTPS configured for $DOMAIN"
        echo "   Access: https://$DOMAIN"
    else
        log_error "HTTPS setup failed - continuing with HTTP only"
    fi
fi

echo ""
echo -e "${GREEN}🚀 Your Brain Half application is now live!${NC}"
echo "   Monitor logs: sudo journalctl -u brainhalf-backend -f"
echo ""

