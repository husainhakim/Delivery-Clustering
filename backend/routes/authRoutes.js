import express from 'express';
import passport from 'passport';
import { sendOtp, verifyOtp, loginWithPassword, googleCallback, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// OTP login flow
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Password login flow
router.post('/login-password', loginWithPassword);

// Google OAuth — initiates the OAuth flow
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      if (err) {
        console.error('OAuth Error:', err);
        return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
      }
      
      if (!user) {
        // User was rejected by our custom passport logic (e.g. not whitelisted)
        return res.redirect(`${frontendUrl}/login?error=unauthorized`);
      }
      
      // If success, attach user to req and call our googleCallback controller
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);

// Get current admin (protected)
router.get('/me', protect, getMe);

export default router;
