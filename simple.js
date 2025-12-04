
```path/to/prolly last/vera-ventures/simple.js
const http = require('http');
const url = require('url');

// In-memory storage
const users = new Map();
const sessions = new Map();

// Configuration
const PORT = process.env.PORT || 3000;

// Create session
function createSession(userId) {
  const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(sessionId, { userId, expiresAt });
  return sessionId;
}

// Validate session
function validateSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

// Get session from request
function getSessionFromRequest(req) {
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/session=([^;]+)/);
  if (!sessionMatch) return null;
  return validateSession(sessionMatch[1]);
}

// Create simple HTML page
function createPage(title, body, isLoggedIn) {
  const loggedIn = isLoggedIn ? true : false;

  let html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + title + ' - Vera Ventures</title>';
  html += '<style>* { margin: 0; padding: 0; box-sizing: border-box; }';
  html += 'body { background-color: #000; color: #fff; font-family: Arial, sans-serif; line-height: 1.6; }';
  html += '.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }';
  html += 'header { padding: 20px 0; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); }';
  html += '.logo { font-size: 24px; font-weight: bold; }';
  html += 'nav { display: flex; gap: 20px; }';
  html += 'nav a { color: #a855f7; text-decoration: none; }';
  html += 'nav a:hover { color: #c084fc; }';
  html += 'main { min-height: calc(100vh - 100px); padding: 40px 0; }';
  html += 'h1 { font-size: 32px; margin-bottom: 20px; }';
  html += 'h2 { font-size: 24px; margin-bottom: 15px; }';
  html += 'p { margin-bottom: 15px; }';
  html += '.auth-form { max-width: 400px; margin: 0 auto; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 8px; }';
  html += '.form-group { margin-bottom: 20px; }';
  html += 'label { display: block; margin-bottom: 8px; font-weight: bold; }';
  html += 'input { width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; font-size: 16px; }';
  html += 'button { background: #7c3aed; color: #fff; border: none; padding: 12px 20px; border-radius: 4px; font-size: 16px; cursor: pointer; width: 100%; }';
  html += 'button:hover { background: #6d28d9; }';
  html += '.error { color: #ef4444; background: rgba(239,68,68,0.1); padding: 10px; border-radius: 4px; margin-bottom: 15px; }';
  html += '.success { color: #10b981; background: rgba(16,185,129,0.1); padding: 10px; border-radius: 4px; margin-bottom: 15px; }';
  html += '.auth-footer { text-align: center; margin-top: 20px; }';
  html += '.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 40px 0; }';
  html += '.feature { padding: 30px; background: rgba(255,255,255,0.05); border-radius: 8px; }';
  html += '.cta { text-align: center; padding: 40px 0; }';
  html += 'footer { padding: 20px 0; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); }';
  html += '</style></head><body>';
  html += '<header><div class="container"><div class="logo">Vera Ventures</div><nav>';
  html += '<a href="/">Home</a><a href="/landing">About</a>';
  html += loggedIn ? '<a href="/auth/logout">Sign Out</a>' : '<a href="/auth/login">Sign In</a>';
  html += '</nav></div></header>';
  html += '<main><div class="container">' + body + '</div></main>';
  html += '<footer><div class="container"><p>&copy; 2023 Vera Ventures. All rights reserved.</p></div></footer>';
  html += '</body></html>';
  return html;
}

// Send HTML response
function sendHtml(res, statusCode, title, body, isLoggedIn) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(createPage(title, body, isLoggedIn));
}

// Send JSON response
function sendJson(res, statusCode, obj) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// Redirect
function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

// Parse POST body
function parseBody(req, callback) {
  let body = '';
  req.on('data', function(chunk) {
    body += chunk.toString();
  });
  req.on('end', function() {
    const params = new URLSearchParams(body);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    callback(result);
  });
}

// Routes
const routes = {
  // Home page
  '/': function(req, res) {
    const session = getSessionFromRequest(req);
    const isLoggedIn = session ? true : false;

    let body = '<h1>Welcome to Vera Ventures</h1><p>The Community for Ambitious Founders</p>';
    body += '<div class="features">';
    body += '<div class="feature"><h2>Connect</h2><p>Network with like-minded founders and investors.</p></div>';
    body += '<div class="feature"><h2>Learn</h2><p>Access resources and mentorship from experts.</p></div>';
    body += '<div class="feature"><h2>Grow</h2><p>Get funding opportunities for your startup.</p></div>';
    body += '</div>';
    body += '<div class="cta">';
    body += isLoggedIn ? '<p>Welcome back! You are signed in.</p>' : '<a href="/auth/signup"><button>Sign Up Now</button></a>';
    body += '</div>';

    sendHtml(res, 200, 'Home', body, isLoggedIn);
  },

  // Landing page
  '/landing': function(req, res) {
    const session = getSessionFromRequest(req);
    const isLoggedIn = session ? true : false;

    let body = '<h1>The Community for Ambitious Founders</h1><p>Welcome to Vera Ventures, where innovation meets opportunity.</p>';
    body += '<div class="cta">';
    body += '<h2>Ready to Build Future?</h2><p>Join our community and access resources you need.</p>';
    body += isLoggedIn ? '<button>Go to Dashboard</button>' : '<a href="/auth/signup"><button>Sign Up Now</button></a>';
    body += '</div>';

    sendHtml(res, 200, 'About', body, isLoggedIn);
  },

  // Login page
  '/auth/login': function(req, res) {
    const session = getSessionFromRequest(req);
    if (session) {
      return redirect(res, '/');
    }

    let body = '<h1>Sign In</h1><div id="msg"></div>';
    body += '<form id="loginForm">';
    body += '<div class="form-group"><label>Email</label><input type="email" name="email" required></div>';
    body += '<div class="form-group"><label>Password</label><input type="password" name="password" required></div>';
    body += '<button type="submit">Sign In</button>';
    body += '</form>';
    body += '<div class="auth-footer"><p>Don\'t have an account? <a href="/auth/signup">Sign Up</a></p>';
    body += '<p><a href="/auth/forgot-password">Forgot Password?</a></p></div>';

    body += '<script>';
    body += 'document.getElementById("loginForm").addEventListener("submit", async function(e) {';
    body += 'e.preventDefault(); const email = document.querySelector("input[name=email]").value;';
    body += 'const password = document.querySelector("input[name=password]").value;';
    body += 'try { const response = await fetch("/api/auth/login", {method: "POST",';
    body += 'headers: {"Content-Type": "application/x-www-form-urlencoded"},';
    body += 'body: "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password)});';
    body += 'const data = await response.json();';
    body += 'if (response.ok) { window.location.href = "/"; } else {';
    body += 'document.getElementById("msg").innerHTML = "<div class=\\"error\\">" + data.error + "</div>";';
    body += '} } catch (error) { document.getElementById("msg").innerHTML = "<div class=\\"error\\">Network error</div>"; } });';
    body += '</script>';

    sendHtml(res, 200, 'Sign In', body, false);
  },

  // Signup page
  '/auth/signup': function(req, res) {
    const session = getSessionFromRequest(req);
    if (session) {
      return redirect(res, '/');
    }

    let body = '<h1>Sign Up</h1><div id="msg"></div>';
    body += '<form id="signupForm">';
    body += '<div class="form-group"><label>Name</label><input type="text" name="name" required></div>';
    body += '<div class="form-group"><label>Email</label><input type="email" name="email" required></div>';
    body += '<div class="form-group"><label>Password</label><input type="password" name="password" required></div>';
    body += '<div class="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" required></div>';
    body += '<button type="submit">Create Account</button>';
    body += '</form>';
    body += '<div class="auth-footer"><p>Already have an account? <a href="/auth/login">Sign In</a></p></div>';

    body += '<script>';
    body += 'document.getElementById("signupForm").addEventListener("submit", async function(e) {';
    body += 'e.preventDefault(); const name = document.querySelector("input[name=name]").value;';
    body += 'const email = document.querySelector("input[name=email]").value;';
    body += 'const password = document.querySelector("input[name=password]").value;';
    body += 'const confirmPassword = document.querySelector("input[name=confirmPassword]").value;';
    body += 'const msg = document.getElementById("msg");';
    body += 'if (password.length < 6) { msg.innerHTML = "<div class=\\"error\\">Password must be at least 6 characters</div>"; return; }';
    body += 'if (password !== confirmPassword) { msg.innerHTML = "<div class=\\"error\\">Passwords do not match</div>"; return; }';
    body += 'try { const response = await fetch("/api/auth/signup", {method: "POST",';
    body += 'headers: {"Content-Type": "application/x-www-form-urlencoded"},';
    body += 'body: "name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password)});';
    body += 'const data = await response.json();';
    body += 'if (response.ok) { msg.innerHTML = "<div class=\\"success\\">Account created! Redirecting...</div>"; setTimeout(() => window.location.href = "/auth/login", 2000); } else {';
    body += 'msg.innerHTML = "<div class=\\"error\\">" + data.error + "</div>";';
    body += '} } catch (error) { msg.innerHTML = "<div class=\\"error\\">Network error</div>"; } });';
    body += '</script>';

    sendHtml(res, 200, 'Sign Up', body, false);
  },

  // Forgot password page
  '/auth/forgot-password': function(req, res) {
    const session = getSessionFromRequest(req);
    if (session) {
      return redirect(res, '/');
    }

    let body = '<h1>Reset Password</h1><div id="msg"></div>';
    body += '<form id="forgotForm">';
    body += '<div class="form-group"><label>Email</label><input type="email" name="email" required></div>';
    body += '<button type="submit">Send Reset Link</button>';
    body += '</form>';
    body += '<div class="auth-footer"><p>Remember your password? <a href="/auth/login">Sign In</a></p></div>';

    body += '<script>';
    body += 'document.getElementById("forgotForm").addEventListener("submit", async function(e) {';
    body += 'e.preventDefault(); const email = document.querySelector("input[name=email]").value;';
    body += 'const msg = document.getElementById("msg");';
    body += 'try { const response = await fetch("/api/auth/forgot-password", {method: "POST",';
    body += 'headers: {"Content-Type": "application/x-www-form-urlencoded"},';
    body += 'body: "email=" + encodeURIComponent(email)});';
    body += 'const data = await response.json();';
    body += 'if (response.ok) { msg.innerHTML = "<div class=\\"success\\">Reset link sent to your email</div>"; } else {';
    body += 'msg.innerHTML = "<div class=\\"error\\">" + data.error + "</div>";';
    body += '} } catch (error) { msg.innerHTML = "<div class=\\"error\\">Network error</div>"; } });';
    body += '</script>';

    sendHtml(res, 200, 'Reset Password', body, false);
  },

  // Logout
  '/auth/logout': function(req, res) {
    const session = getSessionFromRequest(req);
    if (!session) {
      return redirect(res, '/auth/login');
    }

    res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    redirect(res, '/auth/login');
  },

  // API: Login
  '/api/auth/login': function(req, res) {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    parseBody(req, function(data) {
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

  // API: Signup
  '/api/auth/signup': function(req, res) {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    parseBody(req, function(data) {
      const name = data.name;
      const email = data.email;
      const password = data.password;

      if (!name || !email || !password) {
        return sendJson(res, 400, { error: 'All fields are required' });
      }

      if (password.length < 6) {
        return sendJson(res, 400, { error: 'Password must be at least 6 characters' });
      }

      // Check if user exists
      const existingUser = Array.from(users.values()).find(u => u.email === email);
      if (existingUser) {
        return sendJson(res, 400, { error: 'User with this email already exists' });
      }

      // Create user
      const userId = Math.random().toString(36).substring(2, 15);
      users.set(userId, { id: userId, name, email, password });

      sendJson(res, 201, { success: true, message: 'Account created successfully' });
    });
  },

  // API: Forgot password
  '/api/auth/forgot-password': function(req, res) {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    parseBody(req, function(data) {
      const email = data.email;

      if (!email) {
        return sendJson(res, 400, { error: 'Email is required' });
      }

      // Check if user exists
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
}

// Create server
const server = http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(req.method + ' ' + pathname);

  if (routes[pathname]) {
    return routes[pathname](req, res);
  }

  // 404 page
  const body = '<h1>Page Not Found</h1><p><a href="/">Return to home</a></p>';
  sendHtml(res, 404, 'Not Found', body, false);
});

// Start server
server.listen(PORT, function() {
  console.log('Server running at http://localhost:' + PORT);
  console.log('Press Ctrl+C to stop');
});
