#!/bin/bash

# Growth Valley Deployment Script for cPanel
# Run this script on your server after uploading files

set -e  # Exit on error

echo "=========================================="
echo "🚀 Growth Valley Deployment Script"
echo "=========================================="

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version must be 18 or higher"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check if .next folder exists
if [ ! -d ".next" ]; then
    echo "❌ Error: .next folder not found!"
    echo "   Please run 'npm run build' locally and upload .next folder"
    exit 1
fi
echo "✅ .next folder found"

# Check if static chunks exist
if [ ! -d ".next/static" ]; then
    echo "❌ Error: .next/static folder not found!"
    echo "   Build may be incomplete"
    exit 1
fi
echo "✅ .next/static folder found"

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

# Install dependencies
echo ""
echo "📦 Installing production dependencies..."
npm ci --production --ignore-scripts

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo ""
    echo "📥 Installing PM2 globally..."
    npm install -g pm2
fi

# Stop existing PM2 process if running
echo ""
echo "🔄 Stopping existing process..."
pm2 stop growthvalley-frontend 2>/dev/null || true

# Start with PM2
echo ""
echo "🚀 Starting application..."
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "📝 Commands:"
echo "   pm2 status              - Check status"
echo "   pm2 logs growthvalley   - View logs"
echo "   pm2 restart growthvalley - Restart app"
echo ""
echo "🌐 Make sure Apache is configured to proxy to port 3000"
echo "   See DEPLOYMENT.md for Apache configuration"
echo ""