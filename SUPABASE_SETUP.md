# Supabase Configuration for Vera Ventures

## 1. Environment Variables

To configure your application with your new Supabase project, create a `.env.local` file in the root directory of your project with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual credentials.

## 2. Finding Your Supabase Credentials

1. Go to your Supabase dashboard
2. Select your project
3. Navigate to Settings > API
4. Find the Project URL and anon public key

## 3. Database Setup

The application uses Supabase Auth for user authentication. No additional database tables are needed for basic functionality.

## 4. Restart Development Server

After configuring your environment variables, restart your development server:

```bash
npm run dev
```

## 5. Test Authentication

You can now test the authentication flow:

1. Navigate to `/auth/signup` to create a new account
2. Check your email for the verification link
3. Navigate to `/auth/login` to sign in
4. Test the forgot password functionality

## Troubleshooting

If you encounter issues:

1. Make sure your Supabase URL and Anon Key are correct
2. Check that your Supabase project is active
3. Ensure Auth is enabled in your Supabase project settings
4. Verify the redirect URLs in your Supabase Auth settings include your domain

## Additional Configuration

If you want to enable additional features like social authentication, update your Supabase Auth settings to configure the providers you want to support.