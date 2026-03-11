# AWS EC2 Deployment Guide

Your application is designed to be easily deployed on an AWS EC2 instance without relying on Docker. This avoids large image downloads and preserves disk space, making it highly optimized for production environments like AWS EC2.

## Step 1: Push your code to GitHub (or another Git provider)
This is the easiest way to transfer your code to the EC2 instance.
```bash
git init
git add .
git commit -m "Prepare for AWS deployment"
# Push your code to your GitHub remote repository
```

## Step 2: Launch an EC2 Instance
1. Log into your **AWS Management Console**.
2. Search for **EC2** and click **Launch Instance**.
3. **Name**: `KBIT-Server`
4. **OS**: Select **Ubuntu** (Ubuntu 24.04 LTS or 22.04 LTS is recommended).
5. **Instance Type**: `t2.micro` or slightly larger depending on your user load.
6. **Key Pair**: Click "Create new key pair", name it `kbit-key`, and download the `.pem` file. **Keep this safe!**
7. **Network Settings**:
   - Check **Allow SSH traffic**
   - Check **Allow HTTP traffic from the internet** (Crucial, as Nginx will serve the app on port 80).
8. Click **Launch Instance**.

## Step 3: Connect to your Instance & Clone Code
Wait for the instance to show "Running". Click on the Instance ID, go to the **Connect** tab, and use **EC2 Instance Connect** (browser-based SSH) OR use your downloaded `.pem` key to connect via your terminal.

Once connected to the Ubuntu terminal on AWS, run these exact commands:
```bash
# Clone your repository (replace with your actual repo link)
git clone https://github.com/yourusername/KBIT.git
cd KBIT
```

## Step 4: Run the Deployment Script
We have provided a single deployment script (`run.sh`) that installs EVERYTHING automatically (Nginx, Node, Python, and PostgreSQL).

```bash
# Execute the automated deployment script
sudo ./run.sh
```

**Note:** If you get a "Permission denied" error, make sure the script is executable first:
```bash
chmod +x run.sh
sudo ./run.sh
```

## Step 5: Configure Environment Variables
After the script successfully completes, the backend is running but it needs your API keys.

1. Edit the `.env` file in the backend directory:
   ```bash
   nano backend/.env
   ```
2. Replace the placeholder values with your actual Groq and OpenRouter keys:
   ```env
   GROQ_API_KEY=your_real_groq_key_here
   OPENROUTER_API_KEY=your_real_openrouter_key_here
   ```
3. Restart the backend service to apply the keys:
   ```bash
   sudo systemctl restart kbit-backend
   ```

## Step 6: Access Your App
Go to your browser and type in your EC2 instance's **Public IPv4 address** (e.g., `http://12.34.56.78`). You should see your frontend! 

Nginx is automatically reverse-proxying API calls like `/login` or `/signup` internally to your FastAPI Gunicorn backend running on port 8000.

### Troubleshooting
- **Website not loading at all:** Ensure **Port 80** is open in the AWS Security Group for your EC2 instance.
- **Backend errors (502 Bad Gateway):** Fast API might have crashed or isn't running. Check the logs:
  ```bash
  sudo journalctl -u kbit-backend -f
  ```
- **Nginx configuration errors:** Check the Nginx logs:
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
