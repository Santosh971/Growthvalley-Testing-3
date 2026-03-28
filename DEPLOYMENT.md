# 🚀 Growth Valley Deployment Guide for cPanel

This guide provides step-by-step instructions for deploying the Next.js frontend on cPanel hosting.

---

## ⚠️ BEFORE YOU BEGIN

### Important Changes Made

1. **`next.config.mjs`** - Added `output: 'standalone'` for self-hosted deployment
2. **`server.js`** - Created custom production server
3. **`public/.htaccess`** - Added Apache configuration for cPanel
4. **`ecosystem.config.cjs`** - PM2 process manager configuration

---

## 📋 Prerequisites

- Node.js 18+ installed on cPanel (via "Setup Node.js App" or SSH)
- PM2 process manager (for production)
- Domain/subdomain pointing to your cPanel account

---

## 🔧 Method 1: Full Deployment (Recommended)

### Step 1: Build Locally

```bash
# Clean previous build
rm -rf .next out

# Install dependencies
npm ci

# Build for production (creates .next folder)
npm run build
```

### Step 2: Prepare Files for Upload

Create a deployment folder with these files:

```
deploy/
├── .next/                      # Build output (CRITICAL!)
│   ├── static/                 # Static chunks (CRITICAL!)
│   ├── server/                 # Server files for standalone
│   └── ...
├── public/                     # Static assets
│   └── .htaccess              # Apache config
├── package.json               # Dependencies
├── package-lock.json          # Lock file
├── next.config.mjs            # Next.js config
├── server.js                  # Custom server
└── ecosystem.config.cjs       # PM2 config
```

### Step 3: Upload to cPanel

**Option A: Using File Manager**
1. Log into cPanel
2. Open File Manager
3. Navigate to your domain's root (e.g., `public_html` or subdomain folder)
4. Upload and extract the deployment files

**Option B: Using FTP/SFTP**
1. Connect via FTP client (FileZilla, WinSCP)
2. Upload all deployment files to your domain's root

### Step 4: Install Dependencies on Server

SSH into your server:

```bash
cd /home/youruser/public_html   # Adjust path as needed
npm ci --production              # Install only production dependencies
```

### Step 5: Start with PM2

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Create logs directory
mkdir -p logs

# Start the application
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Configure PM2 to start on reboot
pm2 startup
```

### Step 6: Configure cPanel Node.js App (Alternative)

If your cPanel has "Setup Node.js App":

1. Go to cPanel > "Setup Node.js App"
2. Create new application:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/youruser/public_html`
   - **Application URL**: Your domain
   - **Application startup file**: `server.js`
3. Click "Create"
4. Restart the application

---

## 🔧 Method 2: Quick Deploy (If Node.js is Pre-configured)

If you already have Node.js running:

```bash
# On your server
cd /path/to/your/app

# Pull latest changes
git pull origin main

# Install and build
npm ci
npm run build

# Restart PM2
pm2 restart growthvalley-frontend
```

---

## 🌐 Configure Domain (Apache Proxy)

If Next.js runs on port 3000, configure Apache to proxy requests:

### Create `.htaccess` in your domain root:

```apache
# Proxy all requests to Node.js
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</IfModule>
```

### Or use cPanel "Apache Handlers":

1. Go to cPanel > "Apache Handlers"
2. Add handler for `.js` files if needed

---

## ✅ Verify Deployment

### Check if app is running:

```bash
pm2 status
pm2 logs growthvalley-frontend
```

### Check chunks are accessible:

```bash
# Should return 200 OK
curl -I https://yourdomain.com/_next/static/chunks/webpack.js
```

### Check application logs:

```bash
tail -f logs/out.log
tail -f logs/error.log
```

---

## 🔄 Update/Redeploy

```bash
# SSH into server
cd /path/to/app

# Pull changes
git pull origin main

# Install dependencies
npm ci --production

# Rebuild (if needed)
npm run build

# Restart PM2
pm2 restart growthvalley-frontend
```

---

## 🐛 Troubleshooting

### Chunk 404 Errors

**Symptom:** `GET /_next/static/chunks/... 404`

**Causes & Fixes:**

| Cause | Solution |
|-------|----------|
| Missing `.next` folder | Upload `.next` folder completely |
| Incomplete build | Rebuild: `npm run build` |
| Old cache | Clear browser cache & rebuild |
| Apache serving static files | Configure proxy to Node.js |
| Wrong `output` mode | Use `output: 'standalone'` |

### App Won't Start

```bash
# Check Node.js version (must be 18+)
node -v

# Check if port is in use
lsof -i :3000

# Check PM2 logs
pm2 logs growthvalley-frontend
```

### Memory Issues

```bash
# Increase Node.js memory
pm2 start ecosystem.config.cjs --env production --node-args="--max-old-space-size=1024"
```

---

## 📁 File Checklist

Before deployment, ensure these exist:

- [ ] `.next/` folder (from `npm run build`)
- [ ] `public/.htaccess`
- [ ] `server.js`
- [ ] `ecosystem.config.cjs`
- [ ] `package.json` and `package-lock.json`
- [ ] `next.config.mjs` with `output: 'standalone'`

---

## 🔐 Environment Variables

Create `.env.local` or set in cPanel:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📞 Support

If issues persist after following this guide:

1. Check PM2 logs: `pm2 logs growthvalley-frontend`
2. Check Apache error logs: `/usr/local/apache/logs/error_log`
3. Verify Node.js version: `node -v` (must be 18+)
4. Verify all files uploaded: Check `.next/static/` exists

---

## 🎯 Quick Commands Reference

```bash
# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs --env production

# Restart
pm2 restart growthvalley-frontend

# Stop
pm2 stop growthvalley-frontend

# View logs
pm2 logs growthvalley-frontend

# Status
pm2 status
```