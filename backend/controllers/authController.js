import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// In-memory store for OTPs. In production, use Redis or DB with an expiration TTL.
// Structure: Map<email, { otp, expiresAt }>
const otpStore = new Map();

// Helper to create a nodemailer transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to another provider if needed
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 5000, // Fail fast if Render blocks the port
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    // Check if the email is in the comma-separated ADMIN_EMAIL list
    const allowedAdmins = process.env.ADMIN_EMAIL 
      ? process.env.ADMIN_EMAIL.split(',').map(e => e.trim().toLowerCase())
      : [];

    if (!allowedAdmins.includes(email.toLowerCase())) {
      console.warn(`Unauthorized OTP request from: ${email}`);
      return res.status(403).json({ success: false, message: 'Unauthorized. Your email is not whitelisted as an admin.' });
    }

    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP with a 5-minute expiration
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Check if SMTP credentials are provided, else fallback to a simulated "sent" for local testing
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      const transporter = getTransporter();
      
      const mailOptions = {
        from: `"SmartZone DSU" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Your Login OTP - SmartZone DSU',
        text: `Your One-Time Password (OTP) to login is: ${otp}\n\nThis OTP is valid for 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>SmartZone DSU Login</h2>
            <p>Your One-Time Password (OTP) to access the dashboard is:</p>
            <h1 style="color: #6366f1; letter-spacing: 4px; margin: 20px 0;">${otp}</h1>
            <p style="color: #64748b; font-size: 0.9em;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✉️ OTP email sent to ${email}`);
    } else {
      console.warn(`⚠️ SMTP credentials not found in .env. Simulated sending OTP ${otp} to ${email}`);
    }

    res.status(200).json({ success: true, message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email. Please verify SMTP settings.', error: error.message });
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new one.' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP matches! Delete it so it can't be reused
    otpStore.delete(email);

    // Issue JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: { email, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Google OAuth callback — issues JWT and redirects to frontend
// @route   GET /api/auth/google/callback  (called by Passport internally)
// @access  Public
const googleCallback = (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { email: user.email, name: user.name, avatar: user.avatar, role: 'admin', provider: 'google' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Redirect to frontend with token as query param (frontend will pick it up)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/google/success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(user.avatar || '')}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};

// @desc    Verify token / Get current admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

// @desc    Verify password and Login
// @route   POST /api/auth/login-password
// @access  Public
const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check if the email is in the comma-separated ADMIN_EMAIL list
    const allowedAdmins = process.env.ADMIN_EMAIL 
      ? process.env.ADMIN_EMAIL.split(',').map(e => e.trim().toLowerCase())
      : [];

    if (!allowedAdmins.includes(email.toLowerCase())) {
      console.warn(`Unauthorized password login attempt from: ${email}`);
      return res.status(403).json({ success: false, message: 'Unauthorized. Your email is not whitelisted as an admin.' });
    }

    // Check password against the environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Issue JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: { email, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export { sendOtp, verifyOtp, loginWithPassword, googleCallback, getMe };
