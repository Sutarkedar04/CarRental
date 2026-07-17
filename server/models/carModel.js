import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  // Basic Information
  make: {
    type: String,
    required: [true, 'Car make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Manufacturing year is required'],
    min: [2000, 'Car year must be 2000 or later']
  },
  
  // Car Specifications
  type: {
    type: String,
    enum: ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Minivan', 'Truck'],
    required: true,
    default: 'Sedan'
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'],
    default: 'Automatic'
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    default: 'Petrol'
  },
  seatingCapacity: {
    type: Number,
    min: 2,
    max: 12,
    default: 5
  },
  mileage: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Features
  features: [{
    type: String,
    enum: ['AC', 'GPS', 'Bluetooth', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Parking Sensors', 'Leather Seats']
  }],
  
  // Pricing
  dailyRate: {
    type: Number,
    required: [true, 'Daily rate is required'],
    min: [0, 'Daily rate must be positive']
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Security deposit is required'],
    min: [0, 'Security deposit must be positive']
  },
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  
  // Location
  location: {
    pickupAddress: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Availability - UPDATED: Simplified
  isAvailable: {
    type: Boolean,
    default: true
  },
  bookedDates: [{
    startDate: Date,
    endDate: Date,
    bookingId: mongoose.Schema.Types.ObjectId  // Simplified
  }],
  
  // Car Condition & Maintenance
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Needs Maintenance'],
    default: 'Good'
  },
  lastMaintenance: Date,
  nextMaintenance: Date,
  
  // Admin Fields
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
carSchema.index({ make: 1, model: 1 });
carSchema.index({ 'location.city': 1, 'location.state': 1 });
carSchema.index({ dailyRate: 1 });
carSchema.index({ isAvailable: 1 });

// ========== CUSTOM METHODS ==========

// Method to check if car is available for given dates
carSchema.methods.isAvailableForDates = function(startDate, endDate) {
  // Convert to Date objects
  const requestedStart = new Date(startDate);
  const requestedEnd = new Date(endDate);
  
  // Check if car is active and available
  if (!this.isAvailable || !this.isActive) {
    console.log('Car is not available or not active');
    return false;
  }
  
  // Check for date conflicts with existing bookings
  const hasConflict = this.bookedDates.some(booking => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
    return (
      requestedStart <= bookingEnd && 
      requestedEnd >= bookingStart
    );
  });
  
  if (hasConflict) {
    console.log('Date conflict found with existing booking');
  }
  
  return !hasConflict;
};

// Method to add booking dates to car (when booking is confirmed)
carSchema.methods.addBookingDates = async function(startDate, endDate, bookingId) {
  try {
    console.log('=== ADD BOOKING DATES ===');
    console.log('Car:', this.make, this.model);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Booking ID:', bookingId);
    console.log('Current bookedDates before:', this.bookedDates);
    
    // Convert to Date objects
    const bookingStart = new Date(startDate);
    const bookingEnd = new Date(endDate);
    
    // Add to bookedDates array
    this.bookedDates.push({
      startDate: bookingStart,
      endDate: bookingEnd,
      bookingId: bookingId
    });
    
    console.log('BookedDates after push:', this.bookedDates);
    
    // Save the car
    const savedCar = await this.save();
    console.log('✅ Car saved successfully');
    console.log('Saved car bookedDates:', savedCar.bookedDates);
    
    return savedCar;
  } catch (error) {
    console.error('❌ Error adding booking dates:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// Method to remove booking dates from car (when booking is cancelled)
carSchema.methods.removeBookingDates = async function(bookingId) {
  try {
    // Filter out the booking
    const initialLength = this.bookedDates.length;
    this.bookedDates = this.bookedDates.filter(
      booking => booking.bookingId.toString() !== bookingId.toString()
    );
    
    if (this.bookedDates.length < initialLength) {
      await this.save();
      console.log(`✅ Booking dates removed from car: ${this.make} ${this.model}`);
    }
    
    return this;
  } catch (error) {
    console.error('Error removing booking dates:', error);
    throw error;
  }
};

// Method to check upcoming bookings
carSchema.methods.getUpcomingBookings = function() {
  const now = new Date();
  return this.bookedDates.filter(booking => 
    new Date(booking.endDate) >= now
  );
};

// Method to check if car has any active bookings
carSchema.methods.hasActiveBookings = function() {
  const now = new Date();
  return this.bookedDates.some(booking => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return start <= now && end >= now;
  });
};

// UPDATED: Check if model already exists
const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

export default Car;
