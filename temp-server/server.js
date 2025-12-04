
```prolly last/vera-ventures/temp-server/server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3001;

// Content types mapping
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to serve static files
function serveStaticFile(filePath, res) {
  const extname = path.extname(filePath);
  const contentType = contentTypes[extname] || 'text/html';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Page Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// API route handlers
const apiRoutes = {
  '/api/auth/login': (req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (!data.email || !data.password) {
          return res.end(JSON.stringify({ error: 'Email and password are required' }));
        }

        // Simulate successful login
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Login successful!',
          user: { email: data.email }
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  },

  '/api/auth/signup': (req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (!data.email || !data.password) {
          return res.end(JSON.stringify({ error: 'Email and password are required' }));
        }

        // Simulate successful signup
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Account created successfully!',
          user: { email: data.email }
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  },

  '/api/auth/logout': (req, res) => {
    // Simulate successful logout
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Logout successful'
    }));
  },

  '/api/auth/forgot-password': (req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (!data.email) {
          return res.end(JSON.stringify({ error: 'Email is required' }));
        }

        // Simulate sending reset email
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Password reset link sent to your email'
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  }
};

// Main server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  console.log(req.method + " " + pathname);

  // Handle API routes
  if (apiRoutes[pathname] && req.method === 'POST') {
    return apiRoutes[pathname](req, res);
  }

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Try to serve static file
  const filePath = path.join(__dirname, 'public', pathname);

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveStaticFile(filePath, res);
    } else {
      // 404 for non-existent files
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Page Not Found</h1>');
    }
  });
});

server.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
  console.log('Press Ctrl+C to stop the server');
});
