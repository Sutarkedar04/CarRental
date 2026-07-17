import express from 'express';
import {
  createBooking,
  getMyBookings,
  getDealerBookings,
  dealerUpdateBookingStatus,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';
import userAuth, { adminAuth, dealerAuth } from '../middleware/userAuth.js';

const router = express.Router();

// User routes
router.post('/', userAuth, createBooking);
router.get('/my-bookings', userAuth, getMyBookings);
router.get('/dealer', userAuth, dealerAuth, getDealerBookings);
router.put('/:id/dealer-decision', userAuth, dealerAuth, dealerUpdateBookingStatus);
router.get('/:id', userAuth, getBookingById);
router.put('/:id/cancel', userAuth, cancelBooking);

// Admin routes
router.get('/', userAuth, adminAuth, getAllBookings);
router.put('/:id/status', userAuth, adminAuth, updateBookingStatus);

export default router;
