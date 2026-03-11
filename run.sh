#!/bin/bash

# ==============================================================================
# KBIT Single-Node Deployment Script for AWS EC2 (Ubuntu/Debian)
# This script installs all dependencies, sets up the database, and configures
# Nginx and Gunicorn to serve the FastAPI backend and React frontend.
# ==============================================================================

# Exit immediately if a command exits with a non-zero status
set -e

# Setup variables
DB_USER="kashif"
DB_PASS="1234"
DB_NAME="user_db"
APP_DIR=$(pwd)
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "========================================"
echo " Starting KBIT Deployment Script"
echo "========================================"

#--------------------------------------------------
# 1. Update System & Install Dependencies
#--------------------------------------------------
echo ">>> Updating system and installing dependencies..."
sudo apt update -y
sudo apt upgrade -y

# Install Nginx, PostgreSQL, Python 3 venv, Node.js, and OCR dependencies
sudo apt install -y nginx postgresql postgresql-contrib python3 python3-venv python3-pip curl jq git lsof tesseract-ocr libtesseract-dev

# Install Node.js (Using NodeSource for latest LTS)
if ! command -v node &> /dev/null; then
    echo ">>> Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo ">>> Node.js is already installed."
fi

# Install pm2 globally (useful for managing node apps if needed in the future, 
# although we will use Nginx for static serving of the frontend)
sudo npm install -g pm2

#--------------------------------------------------
# 2. Setup PostgreSQL Database & PgBouncer
#--------------------------------------------------
echo ">>> Configuring PostgreSQL Database and Connection Pooling..."
sudo apt install -y pgbouncer
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create Database and User if they don't exist
sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

# Configure PgBouncer
echo ">>> Configuring PgBouncer for optimal connection pooling..."
# Use MD5 password hashed natively by Postgres for PgBouncer auth
MD5_PASS=$(sudo -u postgres psql -t -c "SELECT concat('\"', rolname, '\" \"', rolpassword, '\"') FROM pg_authid WHERE rolname='$DB_USER';")

sudo bash -c "echo '$MD5_PASS' > /etc/pgbouncer/userlist.txt"

sudo bash -c "cat > /etc/pgbouncer/pgbouncer.ini" <<EOF
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

sudo systemctl restart pgbouncer
sudo systemctl enable pgbouncer

#--------------------------------------------------
# 3. Setup Backend (FastAPI + Gunicorn)
#--------------------------------------------------
echo ">>> Setting up Backend environment..."
cd $BACKEND_DIR

# Remove existing venv if clean install is desired (Optional, commenting out for safety)
# rm -rf venv

# Create python virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn uvicorn  # Ensure Gunicorn and Uvicorn are installed

# Generate .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ">>> Creating a placeholder .env file in backend..."
    cat <<EOF > .env
# DB_URL points to PgBouncer connection pooler on port 6432 instead of native Postgres 5432
DB_URL=postgresql://$DB_USER:$DB_PASS@localhost:6432/$DB_NAME
# Replace these with your actual keys
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=*
EOF
    echo "⚠️  WARNING: Please edit $BACKEND_DIR/.env with your actual API keys."
fi

# Deactivate venv
deactivate

# Setup Systemd Service for Gunicorn to manage the FastAPI App efficiently (Handles multiple users)
SERVICE_FILE="/etc/systemd/system/kbit-backend.service"
echo ">>> Configuring systemd service for Backend at $SERVICE_FILE..."

# Get dynamic number of workers based on CPU cores for optimization
WORKERS=$(( $(nproc) * 2 + 1 ))

# Use SUDO_USER if available, otherwise fallback to root (happens if script runs natively as root)
ACTUAL_USER=${SUDO_USER:-root}

# Ensure the backend directory is absolutely resolved
ABS_BACKEND_DIR=$(readlink -f $BACKEND_DIR)

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=Gunicorn instance to serve KBIT FastAPI Backend
After=network.target

[Service]
User=$ACTUAL_USER
Group=www-data
WorkingDirectory=$ABS_BACKEND_DIR
Environment="PATH=$ABS_BACKEND_DIR/venv/bin"
# Using Uvicorn worker class with Gunicorn. Binding to localhost:8000
# Tuning parameters:
# --max-requests 100: Restarts a worker after 100 requests to prevent memory leaks over time (crucial for 4GB RAM)
# --max-requests-jitter 10: Prevents all workers from restarting at the exact same time
# --timeout 120: Gives heavy OCR tasks up to 2 minutes to finish before the worker is killed and restarted
ExecStart=$ABS_BACKEND_DIR/venv/bin/gunicorn main:app --workers $WORKERS --worker-class uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000 --max-requests 100 --max-requests-jitter 10 --timeout 120

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl start kbit-backend
sudo systemctl enable kbit-backend

#--------------------------------------------------
# 4. Setup Frontend (React build)
#--------------------------------------------------
echo ">>> Setting up Frontend App..."
cd $FRONTEND_DIR

# Ensure .env exists in frontend to point to the correct production API endpoint 
# Assuming standard backend path handling via Nginx /api/
echo ">>> Building React frontend..."
npm install
# Setting environment variable during build so Vite proxy is not used in production, and API calls go to relative paths
export VITE_API_URL="/" 
npm run build

#--------------------------------------------------
# 5. Configure Nginx (Reverse Proxy & Static Files)
#--------------------------------------------------
echo ">>> Configuring Nginx..."

NGINX_CONF="/etc/nginx/sites-available/kbit"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name _; 

    # Serve React Frontend Build
    root $FRONTEND_DIR/dist;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Reverse proxy for FastAPI backend
    # This matches requests going to /api/ or similar. 
    # If the frontend makes requests directly to root paths (e.g. /login), we need to proxy them directly or prefix them.
    # Note: Many react apps use an /api/ prefix. Assuming the frontend handles its own routing correctly.
    # We will route all backend routes explicitly to gunicorn.

    location ~ ^/(signup|token|users/me|cv/save|cv/load|cv/improve|analyze|ocr|upload) {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the Nginx site
# Remove default config if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Link our new config
if [ ! -L /etc/nginx/sites-enabled/kbit ]; then
    sudo ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

# Verify Nginx configuration and restart
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# FIX: Nginx needs permission to read the frontend user directory
echo ">>> Fixing frontend permissions for Nginx..."
# Ensure the home directory itself is traversable by Nginx (+x)
sudo chmod o+x /home/$ACTUAL_USER
sudo chown -R $ACTUAL_USER:www-data $FRONTEND_DIR/dist
sudo chmod -R 755 $APP_DIR
sudo usermod -a -G $ACTUAL_USER www-data

echo "========================================"
echo " Deployment Successfully Completed!"
echo "========================================"
echo "-> The frontend is running via Nginx on port 80"
echo "-> The backend is running via Gunicorn on localhost:8000, proxied by Nginx"
echo "-> Ensure your AWS Security Group allows inbound traffic on Port 80."
echo "-> Do not forget to configure your API keys in $BACKEND_DIR/.env"
echo "========================================"
