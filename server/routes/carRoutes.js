import express from 'express';
import {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  getCarsForAdmin,
  checkCarAvailability,
  getPopularCars,
  getFeaturedCars,
  getMyCars
} from '../controllers/carController.js';
import userAuth, { adminAuth, dealerOrAdminAuth } from '../middleware/userAuth.js';
import Booking from '../models/bookingModel.js'; // adjust path if needed
const router = express.Router();

// Public routes
router.get('/', getAllCars);
router.get('/popular', getPopularCars);
router.get('/featured', getFeaturedCars);
router.get('/admin/all', userAuth, adminAuth, getCarsForAdmin);
router.get('/mine', userAuth, dealerOrAdminAuth, getMyCars);
// GET /api/cars/:id/unavailable-dates
router.get('/:id/unavailable-dates', async (req, res) => {
  try {
    const bookings = await Booking.find({
      car: req.params.id,
      status: { $in: ['pending', 'confirmed'] } // exclude cancelled/rejected bookings
    }).select('startDate endDate -_id');

    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error('Error fetching unavailable dates:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch unavailable dates' });
  }
});
router.get('/:id', getCarById);
router.get('/:id/availability', checkCarAvailability);

// Protected: dealers manage their own cars, admins manage any car
router.post('/', userAuth, dealerOrAdminAuth, createCar);
router.put('/:id', userAuth, dealerOrAdminAuth, updateCar);
router.delete('/:id', userAuth, dealerOrAdminAuth, deleteCar);



export default router;