
<file_path>
prolly last/vera-ventures/simple-site/api/auth/signup.js
</file_path>

<edit_description>
Create signup API endpoint
</edit_description>

```prolly last/vera-ventures/simple-site/api/auth/signup.js
const http = require('http');

const PORT = process.env.PORT || 3002;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Handle signup endpoint
  if (req.url.includes('/api/auth/signup')) {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Simple validation
        if (!data.email || !data.password) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Email and password are required' }));
          return;
        }

        // Simulate successful signup
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          message: 'Account created successfully!',
          user: { email: data.email }
        }));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  // Default response
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Auth API running at http://localhost:${PORT}`);
});
```

<file_path>
prolly last/vera-ventures/simple-site/api/auth/forgot-password.js
</file_path>

<edit_description>
Create forgot password API endpoint
</edit_description>

```prolly last/vera-ventures/simple-site/api/auth/forgot-password.js
const http = require('http');

const PORT = process.env.PORT || 3003;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Only handle POST requests
  if (req.method !== 'POST') {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Handle forgot password endpoint
  if (req.url.includes('/api/auth/forgot-password')) {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        // Simple validation
        if (!data.email) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Email is required' }));
          return;
        }

        // Simulate successful password reset
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          message: 'Password reset link sent to your email'
        }));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }

  // Default response
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Auth API running at http://localhost:${PORT}`);
});
```

<file_path>
prolly last/vera-ventures/simple-site/run.sh
</file_path>

<edit_description>
Create run script
</edit_description>

```prolly last/vera-ventures/simple-site/run.sh
#!/bin/bash
echo "Starting Vera Ventures website..."
echo "Main website will be available at http://localhost:8000"
echo "Authentication APIs:"
echo "- Login API: http://localhost:3001"
echo "- Signup API: http://localhost:3002"
echo "- Forgot Password API: http://localhost:3003"
echo ""
echo "Press Ctrl+C to stop all servers"

# Start the authentication API servers in the background
node api/auth/login.js &
LOGIN_PID=$!
node api/auth/signup.js &
SIGNUP_PID=$!
node api/auth/forgot-password.js &
FORGOT_PID=$!

# Start the main website server
python3 -m http.server 8000 --directory . &
WEB_PID=$!

# Handle graceful shutdown
trap "echo 'Stopping servers...'; kill $LOGIN_PID $SIGNUP_PID $FORGOT_PID $WEB_PID 2>/dev/null; exit 0" INT TERM

# Wait for all processes
wait
```

<file_path>
prolly last/vera-ventures/simple-site/auth/login.html
</file_path>

<edit_description>
Update login HTML to use our new API
</edit_description>

```prolly last/vera-ventures/simple-site/auth/login.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Vera Ventures</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #000;
            color: #fff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .wave-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(45deg, #000000 0%, #111111 100%);
            overflow: hidden;
        }
        .wave {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
            animation: wave 15s linear infinite;
        }
        .wave:nth-child(2) {
            animation-delay: -5s;
            background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        }
        .wave:nth-child(3) {
            animation-delay: -10s;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
        }
        @keyframes wave {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .auth-container {
            max-width: 400px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            font-size: 28px;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .tagline {
            text-align: center;
            color: #ccc;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: #ccc;
            font-size: 14px;
        }
        .form-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        .form-input:focus {
            outline: none;
            border-color: #a855f7;
        }
        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        .checkbox-label {
            display: flex;
            align-items: center;
            color: #ccc;
            font-size: 14px;
        }
        .checkbox {
            margin-right: 8px;
        }
        .forgot-link {
            color: #a855f7;
            text-decoration: none;
            font-size: 14px;
        }
        .forgot-link:hover {
            text-decoration: underline;
        }
        .submit-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .submit-btn:hover {
            background: linear-gradient(to right, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4));
            border-color: rgba(168, 85, 247, 0.4);
            transform: translateY(-2px);
        }
        .signup-link {
            text-align: center;
            margin-top: 20px;
            color: #ccc;
            font-size: 14px;
        }
        .signup-link a {
            color: #a855f7;
            text-decoration: none;
            font-weight: 600;
        }
        .signup-link a:hover {
            text-decoration: underline;
        }
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
            color: #fca5a5;
            font-size: 14px;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="wave-bg">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
    </div>

    <div class="container">
        <div class="auth-container">
            <div class="logo">
                <h1>Vera Ventures</h1>
            </div>
            <div class="tagline">Sign in to your Vera Ventures account</div>

            <div id="error-message" class="error-message" style="display: none;"></div>

            <form id="login-form">
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-input" placeholder="your@email.com" required>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" class="form-input" placeholder="•••••••" required>
                </div>

                <div class="form-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="remember" class="checkbox">
                        Remember me
                    </label>
                    <a href="forgot-password.html" class="forgot-link">Forgot password?</a>
                </div>

                <button type="submit" class="submit-btn" id="login-btn">Sign In</button>
            </form>

            <div class="signup-link">
                Don't have an account? <a href="signup.html">Sign up</a>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            const submitBtn = document.getElementById('login-btn');

            // Reset error message
            errorDiv.style.display = 'none';

            // Show loading state
            submitBtn.innerHTML = '<div class="loading"><div class="spinner"></div>Signing in...</div>';
            submitBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:3001', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Simulate login success - redirect to landing page
                    window.location.href = '../index.html';
                } else {
                    // Show error message
                    errorDiv.textContent = data.error || 'Login failed. Please try again.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                // Show error message
                errorDiv.textContent = 'Network error. Please try again.';
                errorDiv.style.display = 'block';
            } finally {
                // Reset button state
                submitBtn.innerHTML = 'Sign In';
                submitBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
```

<file_path>
prolly last/vera-ventures/simple-site/auth/signup.html
</file_path>

<edit_description>
Update signup HTML to use our new API
</edit_description>

```prolly last/vera-ventures/simple-site/auth/signup.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Vera Ventures</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #000;
            color: #fff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .wave-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(45deg, #000000 0%, #111111 100%);
            overflow: hidden;
        }
        .wave {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
            animation: wave 15s linear infinite;
        }
        .wave:nth-child(2) {
            animation-delay: -5s;
            background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        }
        .wave:nth-child(3) {
            animation-delay: -10s;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
        }
        @keyframes wave {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .auth-container {
            max-width: 400px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            font-size: 28px;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .tagline {
            text-align: center;
            color: #ccc;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: #ccc;
            font-size: 14px;
        }
        .form-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        .form-input:focus {
            outline: none;
            border-color: #a855f7;
        }
        .terms-group {
            margin-bottom: 25px;
        }
        .checkbox-label {
            display: flex;
            align-items: flex-start;
            color: #ccc;
            font-size: 14px;
            line-height: 1.4;
        }
        .checkbox {
            margin-right: 8px;
            margin-top: 3px;
        }
        .terms-link {
            color: #a855f7;
            text-decoration: none;
        }
        .terms-link:hover {
            text-decoration: underline;
        }
        .submit-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .submit-btn:hover {
            background: linear-gradient(to right, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4));
            border-color: rgba(168, 85, 247, 0.4);
            transform: translateY(-2px);
        }
        .login-link {
            text-align: center;
            margin-top: 20px;
            color: #ccc;
            font-size: 14px;
        }
        .login-link a {
            color: #a855f7;
            text-decoration: none;
            font-weight: 600;
        }
        .login-link a:hover {
            text-decoration: underline;
        }
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
            color: #fca5a5;
            font-size: 14px;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="wave-bg">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
    </div>

    <div class="container">
        <div class="auth-container">
            <div class="logo">
                <h1>Vera Ventures</h1>
            </div>
            <div class="tagline">Join the Vera Ventures community</div>

            <div id="error-message" class="error-message" style="display: none;"></div>

            <form id="signup-form">
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-input" placeholder="your@email.com" required>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" class="form-input" placeholder="•••••" required>
                </div>

                <div class="form-group">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <input type="password" id="confirm-password" class="form-input" placeholder="•••••" required>
                </div>

                <div class="terms-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="terms" class="checkbox" required>
                        I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
                    </label>
                </div>

                <button type="submit" class="submit-btn" id="signup-btn">Create Account</button>
            </form>

            <div class="login-link">
                Already have an account? <a href="login.html">Sign in</a>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            const errorDiv = document.getElementById('error-message');
            const submitBtn = document.getElementById('signup-btn');

            // Reset error message
            errorDiv.style.display = 'none';

            // Validation
            if (password.length < 6) {
                errorDiv.textContent = 'Password must be at least 6 characters long.';
                errorDiv.style.display = 'block';
                return;
            }

            if (password !== confirmPassword) {
                errorDiv.textContent = 'Passwords do not match.';
                errorDiv.style.display = 'block';
                return;
            }

            if (!termsAccepted) {
                errorDiv.textContent = 'You must accept the terms of service and privacy policy.';
                errorDiv.style.display = 'block';
                return;
            }

            // Show loading state
            submitBtn.innerHTML = '<div class="loading"><div class="spinner"></div>Creating account...</div>';
            submitBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:3002', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Simulate signup success - redirect to landing page
                    window.location.href = '../index.html';
                } else {
                    // Show error message
                    errorDiv.textContent = data.error || 'Sign up failed. Please try again.';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                // Show error message
                errorDiv.textContent = 'Network error. Please try again.';
                errorDiv.style.display = 'block';
            } finally {
                // Reset button state
                submitBtn.innerHTML = 'Create Account';
                submitBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
```

<file_path>
prolly last/vera-ventures/simple-site/auth/forgot-password.html
</file_path>

<edit_description>
Update forgot password HTML to use our new API
</edit_description>

```prolly last/vera-ventures/simple-site/auth/forgot-password.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Vera Ventures</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #000;
            color: #fff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .wave-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(45deg, #000000 0%, #111111 100%);
            overflow: hidden;
        }
        .wave {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
            animation: wave 15s linear infinite;
        }
        .wave:nth-child(2) {
            animation-delay: -5s;
            background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        }
        .wave:nth-child(3) {
            animation-delay: -10s;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
        }
        @keyframes wave {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .auth-container {
            max-width: 400px;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            font-size: 28px;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .tagline {
            text-align: center;
            color: #ccc;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: #ccc;
            font-size: 14px;
        }
        .form-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        .form-input:focus {
            outline: none;
            border-color: #a855f7;
        }
        .submit-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .submit-btn:hover {
            background: linear-gradient(to right, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4));
            border-color: rgba(168, 85, 247, 0.4);
            transform: translateY(-2px);
        }
        .back-link {
            text-align: center;
            margin-top: 20px;
            color: #ccc;
            font-size: 14px;
        }
        .back-link a {
            color: #a855f7;
            text-decoration: none;
            font-weight: 600;
        }
        .back-link a:hover {
            text-decoration: underline;
        }
        .message {
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
        }
        .success-message {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #22c55e;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="wave-bg">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
    </div>

    <div class="container">
        <div class="auth-container">
            <div class="logo">
                <h1>Vera Ventures</h1>
            </div>
            <div class="tagline">Enter your email to receive a password reset link</div>

            <div id="message" class="message" style="display: none;"></div>

            <form id="reset-form">
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-input" placeholder="your@email.com" required>
                </div>

                <button type="submit" class="submit-btn" id="reset-btn">Send Reset Link</button>
            </form>

            <div class="back-link">
                Remember your password? <a href="login.html">Sign in</a>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('reset-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const messageDiv = document.getElementById('message');
            const submitBtn = document.getElementById('reset-btn');

            // Reset message
            messageDiv.style.display = 'none';
            messageDiv.className = 'message';

            // Show loading state
            submitBtn.innerHTML = '<div class="loading"><div class="spinner"></div>Sending reset link...</div>';
            submitBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:3003', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (data.success) {
                    // Show success message
                    messageDiv.textContent = data.message || 'Password reset link sent to your email';
                    messageDiv.className = 'message success-message';
                    messageDiv.style.display = 'block';
                } else {
                    // Show error message
                    messageDiv.textContent = data.error || 'Failed to send reset link. Please try again.';
                    messageDiv.className = 'message error-message';
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                // Show error message
                messageDiv.textContent = 'Network error. Please try again.';
                messageDiv.className = 'message error-message';
                messageDiv.style.display = 'block';
            } finally {
                // Reset button state
                submitBtn.innerHTML = 'Send Reset Link';
                submitBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
```

<file_path>
prolly last/vera-ventures/simple-site/index.html
</file_path>

<edit_description>
Update landing page to fix navigation
</edit_description>

```prolly last/vera-ventures/simple-site/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vera Ventures - The Community for Ambitious Founders</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #000;
            color: #fff;
            overflow-x: hidden;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        header {
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 10;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        nav button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 16px;
            margin-left: 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        nav button:hover {
            background: rgba(168, 85, 247, 0.2);
            border-color: rgba(168, 85, 247, 0.4);
            transform: translateY(-2px);
        }
        .hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 80px 0;
            background: radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
            position: relative;
            z-index: 1;
        }
        .hero h1 {
            font-size: 48px;
            line-height: 1.2;
            margin-bottom: 20px;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            max-width: 900px;
        }
        .hero p {
            font-size: 20px;
            color: #ccc;
            margin-bottom: 30px;
            max-width: 600px;
        }
        .cta-buttons {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .cta-button {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            border: none;
            font-size: 16px;
        }
        .cta-button.primary {
            background: linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
        }
        .cta-button.primary:hover {
            background: linear-gradient(to right, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4));
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(168, 85, 247, 0.25);
        }
        .cta-button.secondary {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
        }
        .cta-button.secondary:hover {
            background: rgba(0, 0, 0, 0.5);
            transform: translateY(-3px);
        }
        .social-proof {
            margin-top: 30px;
            font-size: 14px;
            color: #999;
        }
        .features {
            padding: 80px 0;
            position: relative;
            z-index: 1;
        }
        .features h2 {
            font-size: 40px;
            margin-bottom: 50px;
            text-align: center;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 60px;
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 30px;
            height: 100%;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.2);
        }
        .feature-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 20px;
            color: #a855f7;
        }
        .feature-card h3 {
            font-size: 24px;
            margin-bottom: 15px;
        }
        .feature-card p {
            color: #ccc;
            line-height: 1.5;
        }
        .cta-section {
            padding: 80px 0;
            text-align: center;
            position: relative;
            z-index: 1;
        }
        .cta-card {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 60px 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        .cta-section h2 {
            font-size: 40px;
            margin-bottom: 20px;
            background: linear-gradient(to right, #fff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .cta-section p {
            font-size: 20px;
            color: #ccc;
            margin-bottom: 30px;
            max-width: 700px;
        }
        .footer {
            padding: 40px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            position: relative;
            z-index: 1;
        }
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
        }
        .footer-links a {
            color: #999;
            text-decoration: none;
        }
        .footer-links a:hover {
            color: #fff;
        }
        .copyright {
            color: #666;
            font-size: 14px;
        }
        .wave-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            background: linear-gradient(45deg, #000000 0%, #111111 100%);
            overflow: hidden;
        }
        .wave {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
            animation: wave 15s linear infinite;
        }
        .wave:nth-child(2) {
            animation-delay: -5s;
            background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        }
        .wave:nth-child(3) {
            animation-delay: -10s;
            background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
        }
        @keyframes wave {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 36px;
            }
            .hero p {
                font-size: 18px;
            }
            .features h2 {
                font-size: 32px;
            }
            .cta-section h2 {
                font-size: 32px;
            }
            .cta-card {
                padding: 40px 20px;
            }
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
            .cta-button {
                width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="wave-bg">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
    </div>

    <div class="container">
        <header>
            <div class="logo">Vera Ventures</div>
            <nav>
                <button onclick="location.href='auth/signup.html'">Sign Up</button>
                <button onclick="location.href='auth/login.html'">Sign In</button>
            </nav>
        </header>

        <section class="hero">
            <h1>The Community for Ambitious Founders</h1>
            <p>Connect with peers, access expert resources, and scale your venture faster.</p>
            <div class="cta-buttons">
                <button class="cta-button primary" onclick="location.href='auth/signup.html'">Join Community</button>
                <button class="cta-button secondary" onclick="location.href='auth/login.html'">Member Login</button>
            </div>
            <div class="social-proof">Join over 500+ founders who are already building the future with us</div>
        </section>

        <section class="features">
            <h2>Why Join?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3>Expert Network</h3>
                    <p>Connect with industry leaders, experienced founders, and potential investors who can accelerate your journey.</p>
                </div>
                <div class="feature-card">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3>Exclusive Resources</h3>
                    <p>Access premium tools, templates, and content designed specifically for early-stage startups.</p>
                </div>
                <div class="feature-card">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <h3>Private Events</h3>
                    <p>Join exclusive workshops, pitch sessions, and networking events unavailable to general public.</p>
                </div>
            </div>
        </section>

        <section class="cta-section">
            <div class="cta-card">
                <h2>Ready to Build the Future?</h2>
                <p>Join our community of ambitious founders and access the resources you need to succeed.</p>
                <div class="cta-buttons">
                    <button class="cta-button primary" onclick="location.href='auth/signup.html'">Start Your Journey</button>
                    <button class="cta-button secondary" onclick="location.href='auth/login.html'">Member Login</button>
                </div>
                <div class="social-proof">Join 500+ founders already scaling their ventures with us</div>
            </div>
        </section>

        <footer class="footer">
            <div class="footer-links">
                <a href="#">Terms</a>
                <a href="#">Privacy</a>
            </div>
            <div class="copyright">&copy; 2025 Vera Ventures. All rights reserved.</div>
        </footer>
    </div>
</body>
</html>
```

<file_path>
prolly last/vera-ventures/simple-site/README.md
</file_path>

<edit_description>
Create README for the simple site
</edit_description>

```prolly last/vera-ventures/simple-site/README.md
# Vera Ventures Website

This is a simplified, standalone version of the Vera Ventures website that works without Next.js or Supabase.

## How to Run

1. Make sure you have Node.js and Python 3 installed
2. Navigate to this directory in your terminal
3. Run the start script:
   ```bash
   chmod +x run.sh
   ./run.sh
   ```

## What It Includes

- Landing page with dynamic wave background
- Login, signup, and forgot password pages
- Working authentication API endpoints
- Responsive design with modern UI
- Demo mode functionality (no backend required)

## File Structure

```
simple-site/
├── index.html           # Main landing page
├── auth/
│   ├── login.html      # Login form
│   ├── signup.html     # Signup form
│   └── forgot-password.html  # Forgot password form
├── api/
│   └── auth/
│       ├── login.js           # Login API endpoint (port 3001)
│       ├── signup.js          # Signup API endpoint (port 3002)
│       └── forgot-password.js  # Forgot password API endpoint (port 3003)
└── run.sh              # Script to start all servers
```

## How It Works

1. The main website runs on port 8000 using Python's built-in HTTP server
2. Authentication API endpoints run on ports 3001-3003 using Node.js
3. All authentication forms communicate with their respective API endpoints
4. The system simulates successful authentication without requiring a real backend

## Features

- Modern UI with gradient text effects
- Animated wave background
- Glass morphism effects
- Form validation and error handling
- Loading states during form submission
- Responsive design
- Hover animations and micro-interactions
```

Now let me make the run script executable and run it:
<tool_call>terminal
<arg_key>command</arg_key>
<arg_value>chmod +x "/Users/alenaozerova/Desktop/Landing Page/prolly last/vera-ventures/simple-site/run.sh"</arg_value>
<arg_key>cd</arg_key>
<arg_value>/Users/alenaozerova/Desktop/Landing Page/prolly last/vera-ventures/simple-site</arg_value>
</tool_call>
