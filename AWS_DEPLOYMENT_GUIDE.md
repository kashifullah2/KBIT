# AWS EC2 Deployment Guide

Your application has been dockerized and is ready to be deployed to AWS! Because your AWS CLI isn't configured with credentials locally, the most straightforward (and free tier eligible) way to deploy is through the AWS Management Console.

## Step 1: Push your code to GitHub (or another Git provider)
This is the easiest way to transfer your code to the EC2 instance.
```bash
git init
git add .
git commit -m "Dockerized for AWS deployment"
# Follow GitHub instructions to push your code to a new remote repository
```

## Step 2: Launch an EC2 Instance
1. Log into your **AWS Management Console**.
2. Search for **EC2** and click **Launch Instance**.
3. **Name**: `KBIT-Server`
4. **OS**: Select **Ubuntu** (Ubuntu 24.04 LTS is fine, free-tier eligible).
5. **Instance Type**: `t2.micro` (free-tier eligible).
6. **Key Pair**: Click "Create new key pair", name it `kbit-key`, and download the `.pem` file. **Keep this safe!**
7. **Network Settings**:
   - Check **Allow SSH traffic**
   - Check **Allow HTTP traffic from the internet** (Crucial for the web app)
   - Check **Allow HTTPS traffic...** (If you plan to set up a domain later)
8. Click **Launch Instance**.

## Step 3: Connect to your Instance & Install Docker
Wait for the instance to show "Running". Click on the Instance ID, go to the **Connect** tab, and use **EC2 Instance Connect** (browser-based SSH) OR use your downloaded `.pem` key to connect via your terminal.

Once connected to the Ubuntu terminal on AWS, run these exact commands to install Docker and Git:
```bash
# Update packages
sudo apt update -y

# Install Docker and Git
sudo apt install docker.io docker-compose git -y

# Start Docker and ensure it runs on boot
sudo systemctl start docker
sudo systemctl enable docker

# Allow your ubuntu user to run docker commands without sudo
sudo usermod -aG docker ubuntu
```
*(You may need to log out and log back in, or restart your SSH session, for the docker permissions to apply).*

## Step 4: Clone Your Code and Run It
Inside the EC2 instance terminal:
```bash
# Clone your repository (replace with your actual repo link)
git clone https://github.com/yourusername/KBIT.git
cd KBIT

# Create the environment variables the backend needs
# (You might need to Nano/Vim this file to add your actual GROQ API keys)
echo "GROQ_API_KEY=your_key_here" > .env
echo "FRONTEND_URL=*" >> .env
# For production frontend URL, put the public IP of your EC2 instance if you want to restrict CORS
```

Now, build and start your application:
```bash
# The build arg VITE_API_URL helps React talk to the right server endpoint
# If you leave it as http://localhost:8000, it works locally for development.
# IMPORTANT: For AWS, you MUST pass your EC2 Public IP for the frontend to know where the API is.
# Example: export EC2_IP=http://12.34.56.78:8000
docker-compose build --build-arg VITE_API_URL=http://<YOUR_EC2_PUBLIC_IP>:8000
docker-compose up -d
```

## Step 5: Access Your App
Go to your browser and type in your EC2 instance's **Public IPv4 address** (e.g., `http://12.34.56.78`). You should see your frontend!

Also, test that your backend API is alive by going to `http://12.34.56.78:8000/docs`.

### Troubleshooting
- If the frontend fails to load, ensure port 80 is open in the AWS Security Group.
- If the API calls from the frontend fail, ensure port 8000 is open in the AWS Security Group, and that `VITE_API_URL` was correctly passed during `docker-compose build`.
