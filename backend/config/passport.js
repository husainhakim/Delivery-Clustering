import '../env.js';  // Ensure dotenv runs first (safe to import multiple times)
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://delivery-clustering.onrender.com/api/auth/google/callback',
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value?.toLowerCase() || '';
        
        // Check if the email is in the comma-separated ADMIN_EMAIL list
        const allowedAdmins = process.env.ADMIN_EMAIL 
          ? process.env.ADMIN_EMAIL.split(',').map(e => e.trim().toLowerCase())
          : [];

        if (!allowedAdmins.includes(email)) {
          console.warn(`Unauthorized login attempt from Google account: ${email}`);
          // Passing false as the user rejects the login
          return done(null, false, { message: 'Unauthorized. Your email is not whitelisted as an admin.' });
        }

        const user = {
          googleId: profile.id,
          email: email,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value || '',
          role: 'admin',
        };
        return done(null, user);
      }
    )
  );
  console.log('✅ Google OAuth strategy registered');
} else {
  console.log('⚠️  Google OAuth not configured — add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env');
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
