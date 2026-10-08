// backend/routes/authRoutes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  checkAdmin,
  createAdmin,
  getAllAdmins,
  removeAdmin,
  updateProfile,
  getPendingDealers,
  verifyDealer
} from '../controllers/authController.js';
import userAuth, { adminAuth, superAdminAuth } from '../middleware/userAuth.js';

const authRouter = express.Router();

// Stricter limit on credential endpoints — prevents brute-force / credential stuffing.
// skipSuccessfulRequests: true means only *failed* attempts count toward the bucket,
// so a legitimate user logging in from multiple devices never gets locked out.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // 20 failed attempts per IP per window
  message: { success: false, message: 'Too many attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Public routes (rate-limited — these are credential-guessing vectors)
authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);
authRouter.post('/logout', logout);                          // logout is idempotent, no limit needed
authRouter.post('/forgot-password', authLimiter, forgotPassword);
authRouter.post('/reset-password/:token', authLimiter, resetPassword);

// Protected routes
authRouter.get('/me', userAuth, getMe);
authRouter.get('/check-admin', userAuth, checkAdmin);
authRouter.put('/profile', userAuth, updateProfile);

// ✅ Super Admin only routes
authRouter.post('/create-admin', userAuth, superAdminAuth, createAdmin);
authRouter.get('/admins', userAuth, superAdminAuth, getAllAdmins);
authRouter.delete('/admins/:id', userAuth, superAdminAuth, removeAdmin);

// ✅ Admin routes (dealer verification)
authRouter.get('/dealers/pending', userAuth, adminAuth, getPendingDealers);
authRouter.patch('/dealers/:id/verify', userAuth, adminAuth, verifyDealer);

export default authRouter;