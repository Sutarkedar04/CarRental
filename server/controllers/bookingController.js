import Booking from '../models/bookingModel.js';
import Car from '../models/carModel.js';
import mongoose from 'mongoose';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    console.log("=== CREATE BOOKING REQUEST ===");
    console.log("User:", req.user.email);
    console.log("Request body:", req.body);
    
    const { carId, startDate, endDate, driverDetails, specialRequests } = req.body;

    // Validate required fields
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Car ID, start date, and end date are required."
      });
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    // Validate dates
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid booking dates.'
      });
    }

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past."
      });
    }
    
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date."
      });
    }
    
    // Calculate total days
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (totalDays < 1) {
      return res.status(400).json({
        success: false,
        message: "Booking must be for at least 1 day."
      });
    }

    // Find the car
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found."
      });
    }

    // Calculate pricing
    const dailyRate = car.dailyRate;
    const securityDeposit = car.securityDeposit;
    const totalAmount = (dailyRate * totalDays) + securityDeposit;

    const booking = new Booking({
      _id: new mongoose.Types.ObjectId(),
      user: req.userId,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      dailyRate,
      securityDeposit,
      totalAmount,
      driverDetails: driverDetails || {},
      specialRequests: specialRequests || '',
      pickupLocation: car.location.pickupAddress,
      dropoffLocation: car.location.pickupAddress // Same as pickup for now
    });

    const reservedCar = await Car.findOneAndUpdate(
      {
        _id: carId,
        isActive: true,
        isAvailable: true,
        bookedDates: {
          $not: {
            $elemMatch: {
              startDate: { $lte: end },
              endDate: { $gte: start }
            }
          }
        }
      },
      {
        $push: {
          bookedDates: {
            startDate: start,
            endDate: end,
            bookingId: booking._id
          }
        }
      },
      { new: true }
    );

    if (!reservedCar) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for the selected dates.'
      });
    }

    try {
      await booking.save();
    } catch (bookingError) {
      await Car.updateOne(
        { _id: carId },
        { $pull: { bookedDates: { bookingId: booking._id } } }
      );
      throw bookingError;
    }

    console.log("✅ Booking created successfully:", booking._id);
    
    res.status(201).json({
      success: true,
      message: "Booking created successfully. Please complete payment to confirm.",
      data: booking
    });

  } catch (error) {
    console.error("❌ Create booking error:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate booking detected."
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while creating booking."
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    console.log("=== GET MY BOOKINGS REQUEST ===");
    console.log("User:", req.user.email);
    
    const bookings = await Booking.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('car', 'make model year images dailyRate location');
    
    console.log(`✅ Found ${bookings.length} bookings for user`);
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error("❌ Get bookings error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings."
    });
  }
};

// @desc    Get bookings for cars owned by the logged-in dealer
// @route   GET /api/bookings/dealer
// @access  Private/Verified dealer
export const getDealerBookings = async (req, res) => {
  try {
    const cars = await Car.find({ addedBy: req.userId }).select('_id');
    const carIds = cars.map((car) => car._id);
    const bookings = await Booking.find({ car: { $in: carIds } })
      .sort({ createdAt: -1 })
      .populate('car', 'make model year images dailyRate location')
      .populate('user', 'name email phone');

    return res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get dealer bookings error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching dealer bookings.'
    });
  }
};

// @desc    Accept or decline a pending booking for the dealer's own car
// @route   PUT /api/bookings/:id/dealer-decision
// @access  Private/Verified dealer
export const dealerUpdateBookingStatus = async (req, res) => {
  try {
    const { decision } = req.body;
    const status = decision === 'accept' ? 'confirmed' : decision === 'decline' ? 'cancelled' : null;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Decision must be either 'accept' or 'decline'."
      });
    }

    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking || !booking.car) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.car.addedBy?.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only manage bookings for your own cars.'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This booking has already been ${booking.status}.`
      });
    }

    booking.status = status;
    if (status === 'cancelled') {
      booking.cancellationReason = 'Declined by the rental dealer.';
      booking.cancelledAt = new Date();
      await booking.car.removeBookingDates(booking._id);
    }

    await booking.save();
    const updatedBooking = await Booking.findById(booking._id)
      .populate('car', 'make model year images dailyRate location')
      .populate('user', 'name email phone');

    return res.json({
      success: true,
      message: status === 'confirmed' ? 'Booking accepted.' : 'Booking declined and dates released.',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Dealer booking decision error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating the booking.'
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    console.log("=== GET BOOKING BY ID REQUEST ===");
    console.log("Booking ID from params:", req.params.id);
    console.log("User ID:", req.userId);
    console.log("User role:", req.user?.role);

    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('car', 'make model year type images dailyRate securityDeposit location fuelType transmission seatingCapacity mileage licensePlate')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // ✅ FIX: check if user is still populated (not null/deleted)
    const isAdmin = req.user?.role === 'admin' || req.user?.role === 'super_admin';

    // If user ref is null (deleted user), only admin can view
    if (!booking.user) {
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this booking."
        });
      }
      // Admin can still view even if user is deleted
      return res.json({ success: true, data: booking });
    }

    // ✅ FIX: safe access now that we know booking.user is not null
    const isOwner = booking.user._id.toString() === req.userId.toString();

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking."
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error("❌ Get booking error:", error.message);
    console.error("Error name:", error.name);
    console.error("Error stack:", error.stack);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format."
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching booking."
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    console.log("=== CANCEL BOOKING REQUEST ===");
    console.log("Booking ID:", req.params.id);
    console.log("User:", req.user.email);
    
    const { cancellationReason } = req.body;
    
    const booking = await Booking.findById(req.params.id)
      .populate('car');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }
    
    // Check if user owns the booking or is admin
    const isAdmin = req.user?.role === 'admin' || req.user?.role === 'super_admin';
if (booking.user.toString() !== req.userId.toString() && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking."
      });
    }
    
    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled."
      });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: "Completed bookings cannot be cancelled."
      });
    }
    
    const now = new Date();
    const startDate = new Date(booking.startDate);
    
    // Check if booking starts within 24 hours (no cancellation)
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilStart < 24 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: "Bookings cannot be cancelled within 24 hours of start time."
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason || 'User cancelled';
    booking.cancelledAt = now;
    
    // Remove booking dates from car
    if (booking.car) {
      await booking.car.removeBookingDates(booking._id);
    }
    
    await booking.save();
    
    console.log("✅ Booking cancelled successfully");
    
    res.json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking
    });

  } catch (error) {
    console.error("❌ Cancel booking error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling booking."
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    console.log("=== GET ALL BOOKINGS REQUEST (Admin) ===");
    console.log("Admin:", req.user.email);
    
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('car', 'make model year')
      .populate('user', 'name email phone');
    
    console.log(`✅ Found ${bookings.length} total bookings`);
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error("❌ Get all bookings error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings."
    });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    console.log("=== UPDATE BOOKING STATUS REQUEST ===");
    console.log("Booking ID:", req.params.id);
    console.log("Admin:", req.user.email);
    console.log("Admin ID:", req.userId);
    console.log("Request body:", req.body);
    
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      console.log("❌ Invalid status:", status);
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    console.log("Finding booking...");
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }
    
    console.log("✅ Booking found. Current status:", booking.status);
    console.log("Car ID:", booking.car);
    
    // Update status
    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes;
    
    console.log("Attempting to save booking with new status:", status);
    
    // If cancelling, remove dates from car
    if (status === 'cancelled') {
      console.log("Cancellation requested - removing dates from car");
      try {
        const car = await Car.findById(booking.car);
        if (car) {
          console.log("Car found for date removal:", car.make, car.model);
          await car.removeBookingDates(booking._id);
          console.log("✅ Booking dates removed from car");
        } else {
          console.log("⚠️ Car not found for booking");
        }
      } catch (carError) {
        console.error("❌ Error removing booking dates:", carError.message);
      }
    }
    
    // Save the booking
    await booking.save();
    console.log("✅ Booking saved successfully");
    console.log("New booking status:", booking.status);
    
    // Populate and return updated booking
    const updatedBooking = await Booking.findById(req.params.id)
      .populate('car', 'make model year')
      .populate('user', 'name email phone');
    
    console.log("✅ Booking status updated to:", status);
    
    res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      data: updatedBooking
    });

  } catch (error) {
    console.error("❌ Update booking status error:", error.message);
    console.error("Error name:", error.name);
    console.error("Error stack:", error.stack);
    
    // Check for specific error types
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${Object.values(error.errors).map(err => err.message).join(', ')}`
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID."
      });
    }
    
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};
