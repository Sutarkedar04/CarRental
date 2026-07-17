import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // User who made the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Car being booked
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  
  // Booking dates
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Pricing
  dailyRate: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded'],
    default: 'pending'
  },
  
  // Driver details
  driverDetails: {
    name: String,
    age: Number,
    licenseNumber: String
  },
  
  // Location details
  pickupLocation: String,
  dropoffLocation: String,
  
  // Additional info
  specialRequests: String,
  cancellationReason: String,
  cancelledAt: Date,
  
  // Admin notes (internal use)
  adminNotes: String,
  
  // Payment info (for payment integration later)
  paymentId: String,
  paymentMethod: String
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ car: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1 });

// Virtual for checking if booking is active
bookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now && this.status === 'confirmed';
});

// Virtual for checking if booking is upcoming
bookingSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.startDate > now && this.status === 'confirmed';
});

// Virtual for checking if booking is completed
bookingSchema.virtual('isCompleted').get(function() {
  const now = new Date();
  return this.endDate < now && this.status === 'confirmed';
});

// Set virtuals to true
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// IMPORTANT: Check if model already exists to prevent overwrite
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;