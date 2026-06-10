import './env.js'; // ← Must be first — loads .env before all other imports

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import zoneRoutes from './routes/zoneRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import clusterRoutes from './routes/clusterRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://delivery-clustering.vercel.app' 
    : 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting: max 200 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Trust proxy for Render load balancers (required for HTTPS callbacks & secure cookies)
app.set('trust proxy', 1);

// Session (required for Passport OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'smartzone_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Smart Delivery Zone Clustering API is running',
    version: '1.0.0',
    status: 'OK',
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
