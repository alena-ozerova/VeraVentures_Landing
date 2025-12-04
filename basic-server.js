// Simple Node.js server for Vera Ventures with authentication
const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Configuration
const PORT = process.env.PORT || 3001;

// In-memory "database" for demo purposes
const users = new Map();
const sessions = new Map();

// Helper function to create session
function createSession(userId) {
  const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(sessionId, { userId, expiresAt });
  return sessionId;
}

// Helper function to validate session
function validateSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

// Helper function to get session from request
function getSessionFromRequest(req) {
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/session=([^;]+)/);
  if (!sessionMatch) return null;
  return validateSession(sessionMatch[1]);
}

// Helper function to set session cookie
function setSessionCookie(res, sessionId) {
  res.setHeader('Set-Cookie', 'session=' + sessionId + '; HttpOnly; Path=/; Max-Age=86400');
}

// Helper function to clear session cookie
function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
}

// Helper function to send response
function sendResponse(res, statusCode, contentType, content) {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(content);
}

// Helper function to send HTML response
function sendHtmlResponse(res, statusCode, title, body, isLoggedIn) {
  const loggedIn = isLoggedIn ? true : false;

  const html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + title + ' - Vera Ventures</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; line-height: 1.6; } .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; } header { padding: 20px 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); } .logo { font-size: 24px; font-weight: 700; } nav { display: flex; gap: 20px; } nav a { color: #a855f7; text-decoration: none; transition: color 0.2s; } nav a:hover { color: #c084fc; } main { min-height: calc(100vh - 100px); padding: 40px 0; } h1 { font-size: 36px; margin-bottom: 10px; } h2 { font-size: 28px; margin-bottom: 20px; } p { margin-bottom: 20px; color: rgba(255, 255, 255, 0.8); } .auth-container { max-width: 400px; margin: 0 auto; padding: 30px; background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); } .form-group { margin-bottom: 20px; } label { display: block; margin-bottom: 8px; font-weight: 500; } input { width: 100%; padding: 12px; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; color: white; font-size: 16px; } input:focus { outline: none; border-color: #a855f7; } button { background: linear-gradient(135deg, #a855f7, #7c3aed); color: white; border: none; padding: 12px 24px; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; } button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(168, 85, 247, 0.3); } button:active { transform: translateY(0); } .btn-block { width: 100%; margin-top: 10px; } .error { color: #ef4444; margin-bottom: 15px; padding: 10px; background-color: rgba(239, 68, 68, 0.1); border-radius: 4px; } .success { color: #10b981; margin-bottom: 15px; padding: 10px; background-color: rgba(16, 185, 129, 0.1); border-radius: 4px; } .auth-footer { text-align: center; margin-top: 20px; color: rgba(255, 255, 255, 0.6); } .auth-footer a { color: #a855f7; } .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 40px 0; } .feature { padding: 30px; background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; } .feature h3 { margin-bottom: 15px; color: #a855f7; } .cta { text-align: center; padding: 40px 0; } .cta button { font-size: 18px; padding: 15px 30px; } footer { padding: 20px 0; text-align: center; color: rgba(255, 255, 255, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.1); }</style></head><body><header><div class="container"><div class="logo">Vera Ventures</div><nav><a href="/">Home</a><a href="/landing">About</a>' + (loggedIn ? '<a href="/auth/logout">Sign Out</a>' : '<a href="/auth/login">Sign In</a>') + '</nav></div></header><main><div class="container">' + body + '</div></main><footer><div class="container"><p>&copy; 2023 Vera Ventures. All rights reserved.</p></div></footer></body></html>';

  sendResponse(res, statusCode, 'text/html', html);
}

// Helper function to send JSON response
function sendJsonResponse(res, statusCode, data) {
  sendResponse(res, statusCode, 'application/json', JSON.stringify(data));
}

// Helper function to send redirect response
function sendRedirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

// Helper function to parse form data
function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', function(chunk) {
    body += chunk.toString();
  });
  req.on('end', function() {
    callback(querystring.parse(body));
  });
}

// Route handlers
const routes = {
  // Home page
  '/': function(req, res) {
    const session = getSessionFromRequest(req);
    const isLoggedIn = session ? true : false;

    let body = '<h1>Welcome to Vera Ventures</h1><p>The Community for Ambitious Founders</p><p>Join our community of entrepreneurs and builders who are shaping the future.</p><div class="features"><div class="feature"><h3>Connect</h3><p>Network with like-minded founders and investors in our exclusive community.</p></div><div class="feature"><h3>Learn</h3><p>Access resources, mentorship, and insights from industry experts.</p></div><div class="feature"><h3>Grow</h3><p>Get funding opportunities and support to scale your startup.</p></div></div><div class="cta">' + (isLoggedIn ? '<p>Welcome back! You are already signed in.</p>' : '<h2>Ready to get started?</h2><button class="btn-block" onclick="window.location.href=\'/auth/signup\'">Sign Up Now</button>') + '</div>';

    sendHtmlResponse(res, 200, 'Home', body, isLoggedIn);
  },

  // Landing page
  '/landing': function(req, res) {
    const session = getSessionFromRequest(req);
    const isLoggedIn = session ? true : false;

    let body = '<h1>The Community for Ambitious Founders</h1><p>Welcome to Vera Ventures, where innovation meets opportunity. Join our community of entrepreneurs and builders who are shaping the future.</p><div class="features"><div class="feature"><h3>Connect with Founders</h3><p>Network with ambitious founders who share your vision and drive.</p></div><div class="feature"><h3>Access Resources</h3><p>Get exclusive access to funding opportunities, mentorship, and industry insights.</p></div><div class="feature"><h3>Build Your Future</h3><p>Join events, workshops, and programs designed to accelerate your growth.</p></div></div><div class="cta"><h2>Ready to Build the Future?</h2><p>Join our community of ambitious founders and access the resources you need to succeed.</p>' + (isLoggedIn ? '<button class="btn-block" onclick="window.location.href=\'/\'">Go to Dashboard</button>' : '<button class="btn-block" onclick="window.location.href=\'/auth/signup\'">Sign Up Now</button>') + '</div>';

    sendHtmlResponse(res, 200, 'About', body, isLoggedIn);
  },

  // Login page
  '/auth/login': function(req, res) {
    const session = getSessionFromRequest(req);
    if (session) {
      return sendRedirect(res, '/');
    }

    let body = '<div class="auth-container"><h1>Welcome Back</h1><p>Sign in to your Vera Ventures account</p><div id="message"></div><form id="loginForm"><div class="form-group"><label for="email">Email</label><input type="email" id="email" name="email" required></div><div class="form-group"><label for="password">Password</label><input type="password" id="password" name="password" required></div><button type="submit" class="btn-block">Sign In</button></form><div class="auth-footer"><p>Don\'t have an account? <a href="/auth/signup">Sign up</a></p><p><a href="/auth/forgot-password">Forgot password?</a></p></div></div><script>document.getElementById(\'loginForm\').addEventListener(\'submit\', async function(e) {e.preventDefault();const email = document.getElementById(\'email\').value;const password = document.getElementById(\'password\').value;try {const response = await fetch(\'/api/auth/login\', {method: \'POST\',headers: {\'Content-Type\': \'application/x-www-form-urlencoded\',},body: new URLSearchParams({email: email,password: password}).toString(),});const data = await response.json();if (response.ok) {window.location.href = \'/\';} else {document.getElementById(\'message\').innerHTML = \'<div class="error">\' + data.error + \'</div>\';}} catch (error) {document.getElementById(\'message\').innerHTML = \'<div class="error">Network error. Please try again.</div>\';}});</script>';

    sendHtmlResponse(res, 200, 'Sign In', body, false);
  },

  // Signup page
  '/auth/signup': function(req, res) {
    const session = getSessionFromRequest(req);
    if (session) {
      return sendRedirect(res, '/');
    }

    let body = '<div class="auth-container"><h1>Create Account</h1><p>Join Vera Ventures community</p><div id="message"></div><form id="signupForm"><div class="form-group"><label for="name">Full Name</label><input type="text" id="name" name="name" required></div><div class="form-group"><label for="email">Email</label><input type="email" id="email" name="email" required></div><div class="form-group"><label for="password">Password</label><input type="password" id="password" name="password" required></div><div class="form-group"><label for="confirmPassword">Confirm Password</label><input type="password" id="confirmPassword" name="confirmPassword" required></div><button type="submit" class="btn-block">Create Account</button></form><div class="auth-footer"><p>Already have an account? <a href="/auth/login">Sign in</a></p></div></div><script>document.getElementById(\'signupForm\').addEventListener(\'submit\', async function(e) {e.preventDefault();const name = document.getElementById(\'name\').value;const email = document.getElementById(\'email\').value;const password = document.getElementById(\'password\').value;const confirmPassword = document.getElementById(\'confirmPassword\').value;const messageDiv = document.getElementById(\'message\');if (password.length < 6) {messageDiv.innerHTML = \'<div class="error">Password must be at least 6 characters long.</div>\';return;}if (password !== confirmPassword) {messageDiv.innerHTML = \'<div class="error">Passwords do not match.</div>\';return;}try {const response = await fetch(\'/api/auth/signup\', {method: \'POST\',headers: {\'Content-Type\': \'application/x-www-form-urlencoded\',},body: new URLSearchParams({name: name,email: email,password: password}).toString(),});const data = await response.json();if (response.ok) {messageDiv.innerHTML = \'<div class="success">Account created successfully! Redirecting to login...</div>\';setTimeout(function() {window.location.href = \'/auth/login\';},2000);} else {messageDiv.innerHTML = \'<div class="error">\' + data.error + \'</div>\';}} catch (error) {messageDiv.innerHTML = \'<div class="error">Network error. Please try again.</div>\';}});</script>';

    sendHtmlResponse(res, 200, 'Sign Up', body, false);
  },

  // Forgot password page
  '/auth/forgot-password': function(req, res) {
    const session = getSessionFromRequest(req);
    if (session) {
      return sendRedirect(res, '/');
    }

    let body = '<div class="auth-container"><h1>Reset Password</h1><p>Enter your email to receive a password reset link</p><div id="message"></div><form id="forgotForm"><div class="form-group"><label for="email">Email</label><input type="email" id="email" name="email" required></div><button type="submit" class="btn-block">Send Reset Link</button></form><div class="auth-footer"><p>Remember your password? <a href="/auth/login">Sign in</a></p></div></div><script>document.getElementById(\'forgotForm\').addEventListener(\'submit\', async function(e) {e.preventDefault();const email = document.getElementById(\'email\').value;const messageDiv = document.getElementById(\'message\');try {const response = await fetch(\'/api/auth/forgot-password\', {method: \'POST\',headers: {\'Content-Type\': \'application/x-www-form-urlencoded\',},body: new URLSearchParams({email: email}).toString(),});const data = await response.json();if (response.ok) {messageDiv.innerHTML = \'<div class="success">Password reset link sent to your email!</div>\';} else {messageDiv.innerHTML = \'<div class="error">\' + data.error + \'</div>\';}} catch (error) {messageDiv.innerHTML = \'<div class="error">Network error. Please try again.</div>\';}});</script>';

    sendHtmlResponse(res, 200, 'Reset Password', body, false);
  },

  // Logout
  '/auth/logout': function(req, res) {
    clearSessionCookie(res);
    sendRedirect(res, '/auth/login');
  },

  // API routes
  '/api/auth/login': function(req, res) {
    if (req.method !== 'POST') {
      return sendJsonResponse(res, 405, { error: 'Method not allowed' });
    }

    parseRequestBody(req, function(data) {
      const email = data.email;
      const password = data.password;

      if (!email || !password) {
        return sendJsonResponse(res, 400, { error: 'Email and password are required' });
      }

      // Check if user exists and password matches
      const user = Array.from(users.values()).find(u => u.email === email);
      if (!user) {
        return sendJsonResponse(res, 401, { error: 'Invalid email or password' });
      }

      // In a real app, you would hash password and compare
      if (user.password !== password) {
        return sendJsonResponse(res, 401, { error: 'Invalid email or password' });
      }

      // Create session
      const sessionId = createSession(user.id);
      setSessionCookie(res, sessionId);

      sendJsonResponse(res, 200, { success: true, user: { email: user.email, name: user.name } });
    });
  },

  '/api/auth/signup': function(req, res) {
    if (req.method !== 'POST') {
      return sendJsonResponse(res, 405, { error: 'Method not allowed' });
    }

    parseRequestBody(req, function(data) {
      const name = data.name;
      const email = data.email;
      const password = data.password;

      if (!name || !email || !password) {
        return sendJsonResponse(res, 400, { error: 'All fields are required' });
      }

      if (password.length < 6) {
        return sendJsonResponse(res, 400, { error: 'Password must be at least 6 characters' });
      }

      // Check if user already exists
      const existingUser = Array.from(users.values()).find(u => u.email === email);
      if (existingUser) {
        return sendJsonResponse(res, 400, { error: 'User with this email already exists' });
      }

      // Create new user
      const userId = Math.random().toString(36).substring(2, 15);
      users.set(userId, {
        id: userId,
        name,
        email,
        password // In a real app, you would hash this password
      });

      sendJsonResponse(res, 201, { success: true, message: 'Account created successfully' });
    });
  },

  '/api/auth/forgot-password': function(req, res) {
    if (req.method !== 'POST') {
      return sendJsonResponse(res, 405, { error: 'Method not allowed' });
    }

    parseRequestBody(req, function(data) {
      const email = data.email;

      if (!email) {
        return sendJsonResponse(res, 400, { error: 'Email is required' });
      }

      // In a real app, you would:
      // 1. Generate a reset token
      // 2. Store it with an expiration time
      // 3. Send an email with a link containing the token

      // For demo purposes, we'll just check if user exists
      const user = Array.from(users.values()).find(u => u.email === email);
      if (!user) {
        // Don't reveal that user doesn't exist
        return sendJsonResponse(res, 200, { success: true, message: 'Password reset link sent if email exists' });
      }

      sendJsonResponse(res, 200, { success: true, message: 'Password reset link sent to your email' });
    });
  }
};

// Create server
const server = http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(req.method + ' ' + pathname);

  // Handle routes
  if (routes[pathname]) {
    return routes[pathname](req, res);
  }

  // Handle 404
  let body = '<h1>Page Not Found</h1><p>The page you are looking for doesn\'t exist.</p><p><a href="/">Return to home</a></p>';

  sendHtmlResponse(res, 404, 'Page Not Found', body, false);
});

// Start server
server.listen(PORT, '0.0.0.0', function() {
  console.log('Server running at http://localhost:' + PORT);
  console.log('Press Ctrl+C to stop the server');
});
