/**
 * Growth Valley - Production Server
 * Custom Next.js server for cPanel/PM2 deployment
 *
 * Usage:
 *   - Development: npm run dev (uses Next.js dev server)
 *   - Production: node server.js (uses this custom server)
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

// Create Next.js app instance
const app = next({
  dev,
  hostname,
  port,
  dir: __dirname,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      // Let Next.js handle all requests
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
│                                                            │
│   🚀 Growth Valley Frontend Server                         │
│                                                            │
│   Port: ${port}                                              │
│   Hostname: ${hostname}                                      │
│   Environment: ${dev ? 'development' : 'production'}                              │
│   Ready on: http://${hostname}:${port}                       │
│                                                            │
╚════════════════════════════════════════════════════════════╝
      `);
    });
});