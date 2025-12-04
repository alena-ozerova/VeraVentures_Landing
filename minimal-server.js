
```path/to/prolly last/vera-ventures/minimal-server.js
const http = require('http');
const url = require('url');

// In-memory storage
const users = new Map();
const sessions = new Map();

// Configuration
const PORT = process.env.PORT || 3000;

// Helper to generate session ID
function createSession(userId) {
  const sessionId = Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(sessionId, { userId, expiresAt });
  return sessionId;
}

// Helper to validate session
function validateSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

// Helper to get session from request
function getSessionFromRequest(req) {
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/session=([^;]+)/);
  if (!sessionMatch) return null;
  return validateSession(sessionMatch[1]);
}

// Helper to send response
function send(res, status, contentType, content) {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(content);
}

// Helper to send HTML
function sendHtml(res, status, content) {
  send(res, status, 'text/html', content);
}

// Helper to send JSON
function sendJson(res, status, obj) {
  send(res, status, 'application/json', JSON.stringify(obj));
}

// Helper to redirect
function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

// Helper to parse POST body
function parsePostBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const params = new URLSearchParams(body);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    callback(result);
  });
}

// Helper to create HTML page
function createPage(title, body, isLoggedIn = false) {

}

// Routes
const routes = {
  // Home page
  '/': (req, res) => {
    const session = getSessionFromRequest(req);
    const isLoggedIn = !!session;

    const content = `
      <h1>Welcome to Vera Ventures</h1>
      <p>The Community for Ambitious Founders</p>
      <div class="features">
        <div class="feature">
          <h2>Connect</h2>
          <p>Network with like-minded founders and investors.</p>
        </div>
        <div class="feature">
          <h2>Learn</h2>
          <p>Access resources and mentorship from experts.</p>
        </div>
        <div class="feature">
          <h2>Grow</h2>
          <p>Get funding opportunities for your startup.</p>
        </div>
      </div>
      <div class="cta">
        ${isLoggedIn
          ? '<p>Welcome back! You are signed in.</p>'
          : '<a href="/auth/signup"><button>Sign Up Now</button></a>'}
      </div>
    `;

    sendHtml(res, 200, createPage('Home', content, isLoggedIn));
  },

  // Landing page
  '/landing': (req, res) => {
    const session = getSessionFromRequest(req);
    const isLoggedIn = !!session;

    const content = `
      <h1>The Community for Ambitious Founders</h1>
      <p>Welcome to Vera Ventures, where innovation meets opportunity.</p>
      <div class="cta">
        ${isLoggedIn
          ? '<p>Welcome back! You are already signed in.</p>'
          : '<a href="/auth/signup"><button>Sign Up Now</button></a>'}
      </div>
    `;

    sendHtml(res, 200, createPage('About', content, isLoggedIn));
  },

  // Login page
  '/auth/login': (req, res) => {
    const session = getSessionFromRequest(req);
    if (session) {
      return redirect(res, '/');
    }

    const content = `
      <div class="auth-form">
        <h1>Sign In</h1>
        <div id="message"></div>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">Sign In</button>
        </form>
        <div class="auth-footer">
          <p>Don't have an account? <a href="/auth/signup">Sign Up</a></p>
          <p><a href="/auth/forgot-password">Forgot Password?</a></p>
        </div>
      </div>

      <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const message = document.getElementById('message');

          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              body: 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
            });

            const data = await response.json();

            if (response.ok) {
              window.location.href = '/';
            } else {
              message.innerHTML = '<div class="error">' + data.error + '</div>';
            }
          } catch (error) {
            message.innerHTML = '<div class="error">Network error. Please try again.</div>';
          }
        });
      </script>
    `;

    sendHtml(res, 200, createPage('Sign In', content, false));
  },

  // Signup page
  '/auth/signup': (req, res) => {
    const session = getSessionFromRequest(req);
    if (session) {
      return redirect(res, '/');
    }

    const content = `
      <div class="auth-form">
        <h1>Sign Up</h1>
        <div id="message"></div>
        <form id="signupForm">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div class="auth-footer">
          <p>Already have an account? <a href="/auth/login">Sign In</a></p>
        </div>
      </div>

      <script>
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          const message = document.getElementById('message');

          if (password.length < 6) {
            message.innerHTML = '<div class="error">Password must be at least 6 characters.</div>';
            return;
          }

          if (password !== confirmPassword) {
            message.innerHTML = '<div class="error">Passwords do not match.</div>';
            return;
          }

          try {
            const response = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              body: 'name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password)
            });

            const data = await response.json();

            if (response.ok) {
              message.innerHTML = '<div class="success">Account created! Redirecting to login...</div>';
              setTimeout(() => window.location.href = '/auth/login', 2000);
            } else {
              message.innerHTML = '<div class="error">' + data.error + '</div>';
            }
          } catch (error) {
            message.innerHTML = '<div class="error">Network error. Please try again.</div>';
          }
        });
      </script>
    `;

    sendHtml(res, 200, createPage('Sign Up', content, false));
  },

  // Forgot password page
  '/auth/forgot-password': (req, res) => {
    const session = getSessionFromRequest(req);
    if (session) {
      return redirect(res, '/');
    }

    const content = `
      <div class="auth-form">
        <h1>Reset Password</h1>
        <p>Enter your email to receive a password reset link</p>
        <div id="message"></div>
        <form id="forgotForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
        <div class="auth-footer">
          <p>Remember your password? <a href="/auth/login">Sign In</a></p>
        </div>
      </div>

      <script>
        document.getElementById('forgotForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const message = document.getElementById('message');

          try {
            const response = await fetch('/api/auth/forgot-password', {
              method: 'POST',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              body: 'email=' + encodeURIComponent(email)
            });

            const data = await response.json();

            if (response.ok) {
              message.innerHTML = '<div class="success">Password reset link sent to your email!</div>';
            } else {
              message.innerHTML = '<div class="error">' + data.error + '</div>';
            }
          } catch (error) {
            message.innerHTML = '<div class="error">Network error. Please try again.</div>';
          }
        });
      </script>
    `;

    sendHtml(res, 200, createPage('Reset Password', content, false));
  },

  // Logout
  '/auth/logout': (req, res) => {
    const session = getSessionFromRequest(req);
    if (session) {
      res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    }
    redirect(res, '/auth/login');
  },

  // API routes
  '/api/auth/login': (req, res) => {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    parsePostBody(req, data => {
      const email = data.email;
      const password = data.password;

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email and password are required' });
      }

      // Find user
      const user = Array.from(users.values()).find(u => u.email === email);
      if (!user || user.password !== password) {
        return sendJson(res, 401, { error: 'Invalid email or password' });
      }

      // Create session
      const sessionId = createSession(user.id);
      res.setHeader('Set-Cookie', 'session=' + sessionId + '; HttpOnly; Path=/; Max-Age=86400');

      sendJson(res, 200, { success: true });
    });
  },

  '/api/auth/signup': (req, res) => {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    parsePostBody(req, data => {
      const name = data.name;
      const email = data.email;
      const password = data.password;

      if (!name || !email || !password) {
        return sendJson(res, 400, { error: 'All fields are required' });
      }

      if (password.length < 6) {
        return sendJson(res, 400, { error: 'Password must be at least 6 characters' });
      }

      // Check if user already exists
      const existingUser = Array.from(users.values()).find(u => u.email === email);
      if (existingUser) {
        return sendJson(res, 400, { error: 'User with this email already exists' });
      }

      // Create user
      const userId = Math.random().toString(36).substring(2, 15);
      users.set(userId, {
        id: userId,
        name,
        email,
        password
      });

      sendJson(res, 201, { success: true, message: 'Account created successfully' });
    });
  },

  '/api/auth/forgot-password': (req, res) => {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    parsePostBody(req, data => {
      const email = data.email;

      if (!email) {
        return sendJson(res, 400, { error: 'Email is required' });
      }

      // In a real app, you would send an email with reset link
      const user = Array.from(users.values()).find(u => u.email === email);
      if (user) {
        // User exists, send reset link (simulated)
        sendJson(res, 200, { success: true, message: 'Password reset link sent to your email' });
      } else {
        // Don't reveal if user doesn't exist
        sendJson(res, 200, { success: true, message: 'Password reset link sent if email exists' });
      }
    });
  }
};

// Create server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(req.method + ' ' + pathname);

  if (routes[pathname]) {
    return routes[pathname](req, res);
  }

  // 404
  const content = '<h1>Page Not Found</h1><p><a href="/">Return to home</a></p>';
  sendHtml(res, 404, createPage('Not Found', content, false));
});

// Start server
server.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
  console.log('Press Ctrl+C to stop the server');
});
