// backend/routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  checkAdmin,
  createAdmin,        // ✅ Add this
  getAllAdmins,       // ✅ Add this
  removeAdmin,
  updateProfile ,
  getPendingDealers,
   verifyDealer        // ✅ Add this
} from '../controllers/authController.js';
import userAuth, { adminAuth, superAdminAuth } from '../middleware/userAuth.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

// Protected routes
authRouter.get('/me', userAuth, getMe);
authRouter.get('/check-admin', userAuth, checkAdmin);
// Add this route after the other protected routes
authRouter.put('/profile', userAuth, updateProfile);

// ✅ Super Admin only routes
authRouter.post('/create-admin', userAuth, superAdminAuth, createAdmin);
authRouter.get('/admins', userAuth, superAdminAuth, getAllAdmins);
authRouter.delete('/admins/:id', userAuth, superAdminAuth, removeAdmin);
authRouter.get('/dealers/pending', userAuth, adminAuth,getPendingDealers);
authRouter.patch('/dealers/:id/verify', userAuth, adminAuth, verifyDealer);

export default authRouter;
