// backend/routes/userRoutes.js
import express from 'express';
import userAuth, { adminAuth, superAdminAuth } from '../middleware/userAuth.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication and admin privileges
router.use(userAuth, adminAuth);

// Routes
router.get('/', getAllUsers);           // GET /api/users - Get all users
router.get('/:id', getUserById);        // GET /api/users/:id - Get single user
router.put('/:id', updateUser);         // PUT /api/users/:id - Update user
router.delete('/:id', deleteUser);      // DELETE /api/users/:id - Delete user

export default router;