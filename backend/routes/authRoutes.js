import express from 'express';
import passport from 'passport';
import { sendOtp, verifyOtp, googleCallback, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// OTP login flow
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Google OAuth — initiates the OAuth flow
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

// Get current admin (protected)
router.get('/me', protect, getMe);

export default router;
