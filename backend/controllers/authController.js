import jwt from 'jsonwebtoken';

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@delivery.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: { email: adminEmail, role: 'admin' },
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
    res.redirect(`${frontendUrl}/auth/google/success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
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

export { login, googleCallback, getMe };
