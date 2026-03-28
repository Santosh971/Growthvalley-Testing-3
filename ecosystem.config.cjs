/**
 * PM2 Ecosystem Configuration for Growth Valley
 * Use this file to manage the Next.js application with PM2 on cPanel
 *
 * Installation:
 *   npm install -g pm2
 *
 * Start:
 *   pm2 start ecosystem.config.cjs --env production
 *
 * Save for auto-start on reboot:
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'growthvalley-frontend',
      script: 'server.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging configuration
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,

      // Restart on crash
      restart_delay: 3000,
      max_restarts: 10,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,

      // Environment variables for production
      // Uncomment and set these in production
      // env_production: {
      //   NODE_ENV: 'production',
      //   PORT: 3000,
      //   NEXT_PUBLIC_API_URL: 'https://api.yourdomain.com',
      // },
    },
  ],
};