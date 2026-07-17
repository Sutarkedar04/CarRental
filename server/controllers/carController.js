import Car from '../models/carModel.js';

// @desc    Create a new car (Admin only)
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res) => {
  try {
    console.log("=== CREATE CAR REQUEST ===");
    console.log("Request body:", req.body);
    console.log("User ID from auth:", req.userId);
    
    const {
      make, model, year, type, transmission, fuelType,
      seatingCapacity, mileage, dailyRate, securityDeposit,
      condition, description, isAvailable, location, features, images
    } = req.body;

    // Required fields validation - REMOVED location from required
    if (!make || !model || !year || !dailyRate || !securityDeposit) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: make, model, year, dailyRate, securityDeposit"
      });
    }
    // ✅ ADD: require location.city too, since your whole marketplace pivots on city search
if (!location?.city?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Please provide the car's city so customers can find it."
  });
}
    const carLocation = {
  pickupAddress: location?.pickupAddress?.trim() || '',
  city: location.city.trim(),
  state: location?.state?.trim() || '',
  coordinates: location?.coordinates
};

    const car = await Car.create({
      make,
      model,
      year,
      type: type || 'Sedan',
      transmission: transmission || 'Automatic',
      fuelType: fuelType || 'Petrol',
      seatingCapacity: seatingCapacity || 5,
      mileage: mileage || 0,
      dailyRate,
      securityDeposit,
      condition: condition || 'Good',
      description: description || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      location: carLocation,
      features: features || [],
      images: images || [],
      addedBy: req.userId
    });

    console.log("✅ Car created successfully:", car._id);
    
    res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: car
    });

  } catch (error) {
    console.error("❌ Create car error:", error.message);
    console.error("Full error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while creating car"
    });
  }
};


// @desc    Get all cars with search, filter, and pagination
// @route   GET /api/cars
// @access  Public
export const getAllCars = async (req, res) => {
  try {
    console.log("=== GET ALL CARS WITH FILTERS ===");
    console.log("Query params:", req.query);
    
    // Destructure query parameters
    const { 
      search,           // General search (make/model)
      type,             // Car type
      transmission,     // Transmission type
      fuelType,         // Fuel type
      minSeats,         // Minimum seating
      maxSeats,         // Maximum seating
      minPrice,         // Minimum daily rate
      maxPrice,         // Maximum daily rate
      location,         // City or state
      startDate,        // Availability start date
      endDate,          // Availability end date
      sort = '-createdAt', // Sort field (- for descending)
      page = 1,         // Page number
      limit = 10,       // Items per page
      available = 'true' // Show available cars only
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Only show available and active cars by default
    if (available === 'true') {
      filter.isAvailable = true;
      filter.isActive = true;
    }
    
    const searchConditions = [];

    // Text search (make or model)
    if (search) {
      searchConditions.push({ $or: [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ] });
    }
    
    // Filter by car type
    if (type) filter.type = type;
    
    // Filter by transmission
    if (transmission) filter.transmission = transmission;
    
    // Filter by fuel type
    if (fuelType) filter.fuelType = fuelType;
    
    // Filter by seating capacity
    if (minSeats || maxSeats) {
      filter.seatingCapacity = {};
      if (minSeats) filter.seatingCapacity.$gte = Number(minSeats);
      if (maxSeats) filter.seatingCapacity.$lte = Number(maxSeats);
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.dailyRate = {};
      if (minPrice) filter.dailyRate.$gte = Number(minPrice);
      if (maxPrice) filter.dailyRate.$lte = Number(maxPrice);
    }
    
    // Filter by location
    if (location) {
      searchConditions.push({ $or: [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } }
      ] });
    }

    if (searchConditions.length > 0) {
      filter.$and = searchConditions;
    }
    
    console.log("Basic filters:", JSON.stringify(filter, null, 2));
    
    // === SIMPLIFIED DATE FILTERING ===
    // First, get all cars matching basic filters
    let cars = await Car.find(filter)
      .select('-bookedDates -addedBy -isActive');
    
    console.log(`Found ${cars.length} cars before date filtering`);
    
    // If dates are provided, filter by availability in JavaScript
    if (startDate && endDate) {
      const requestedStart = new Date(startDate);
      const requestedEnd = new Date(endDate);
      
      console.log("Filtering by dates:", requestedStart, "to", requestedEnd);
      
      // Get car IDs
      const carIds = cars.map(car => car._id);
      
      // Get these cars with their bookedDates
      const carsWithBookings = await Car.find({ _id: { $in: carIds } })
        .select('bookedDates');
      
      // Create availability map
      const availabilityMap = {};
      carsWithBookings.forEach(car => {
        const isAvailable = !car.bookedDates.some(booking => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);
          return requestedStart <= bookingEnd && requestedEnd >= bookingStart;
        });
        availabilityMap[car._id.toString()] = isAvailable;
      });
      
      // Filter cars
      cars = cars.filter(car => availabilityMap[car._id.toString()]);
      
      console.log(`After date filtering: ${cars.length} cars available`);
    }
    
    // Apply sorting
    const sortBy = {};
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortBy[sortField] = sortOrder;
    }
    
    // Apply pagination
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const skip = (currentPage - 1) * itemsPerPage;
    const total = cars.length;
    
    // Sort and paginate
    cars = cars
      .sort((a, b) => {
        for (const field in sortBy) {
          if (a[field] < b[field]) return -sortBy[field];
          if (a[field] > b[field]) return sortBy[field];
        }
        return 0;
      })
      .slice(skip, skip + itemsPerPage);
    
    console.log(`✅ Final: ${cars.length} cars (Page ${currentPage}/${Math.ceil(total/itemsPerPage)})`);
    
    // Build response
    const response = {
      success: true,
      count: cars.length,
      pagination: {
        total,
        page: currentPage,
        pages: Math.ceil(total / itemsPerPage),
        limit: itemsPerPage
      },
      data: cars
    };
    
    res.json(response);

  } catch (error) {
    console.error("❌ Get all cars error:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

// @desc    Check car availability for specific dates
// @route   GET /api/cars/:id/availability
// @access  Public
export const checkCarAvailability = async (req, res) => {
  try {
    console.log("=== CHECK CAR AVAILABILITY ===");
    console.log("Car ID:", req.params.id);
    console.log("Query:", req.query);
    
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide both startDate and endDate query parameters"
      });
    }
    
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }
    
    // Check availability using car method
    const isAvailable = car.isAvailableForDates(startDate, endDate);
    
    // Calculate pricing if available
    let pricing = null;
    if (isAvailable) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      pricing = {
        dailyRate: car.dailyRate,
        securityDeposit: car.securityDeposit,
        totalDays,
        subtotal: car.dailyRate * totalDays,
        totalAmount: (car.dailyRate * totalDays) + car.securityDeposit
      };
    }
    
    res.json({
      success: true,
      available: isAvailable,
      car: {
        id: car._id,
        make: car.make,
        model: car.model,
        year: car.year,
        type: car.type,
        dailyRate: car.dailyRate,
        securityDeposit: car.securityDeposit
      },
      dates: {
        startDate,
        endDate
      },
      pricing
    });

  } catch (error) {
    console.error("❌ Check availability error:", error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while checking availability"
    });
  }
};

// @desc    Get popular/most booked cars
// @route   GET /api/cars/popular
// @access  Public
export const getPopularCars = async (req, res) => {
  try {
    console.log("=== GET POPULAR CARS ===");
    
    const { limit = 6 } = req.query;
    
    // Get cars with most bookings
    const popularCars = await Car.find({
      isAvailable: true,
      isActive: true
    })
      .sort({ 'bookedDates': -1 }) // Sort by number of bookings (length of bookedDates array)
      .limit(parseInt(limit))
      .select('-bookedDates -addedBy -isActive');
    
    console.log(`✅ Found ${popularCars.length} popular cars`);
    
    res.json({
      success: true,
      count: popularCars.length,
      data: popularCars
    });

  } catch (error) {
    console.error("❌ Get popular cars error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching popular cars"
    });
  }
};

// @desc    Get featured cars (cars with specific features)
// @route   GET /api/cars/featured
// @access  Public
export const getFeaturedCars = async (req, res) => {
  try {
    console.log("=== GET FEATURED CARS ===");
    
    const { limit = 4 } = req.query;
    
    // Get cars with premium features
    const featuredCars = await Car.find({
      isAvailable: true,
      isActive: true,
      $or: [
        { features: { $in: ['GPS', 'Sunroof', 'Leather Seats'] } },
        { condition: 'Excellent' },
        { type: { $in: ['SUV', 'Convertible'] } }
      ]
    })
      .sort({ dailyRate: -1 }) // Most expensive first (usually premium)
      .limit(parseInt(limit))
      .select('-bookedDates -addedBy -isActive');
    
    console.log(`✅ Found ${featuredCars.length} featured cars`);
    
    res.json({
      success: true,
      count: featuredCars.length,
      data: featuredCars
    });

  } catch (error) {
    console.error("❌ Get featured cars error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured cars"
    });
  }
};
// @desc    Get single car by ID (Public)
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    console.log("=== GET CAR BY ID REQUEST ===");
    console.log("Car ID:", req.params.id);
    
    const car = await Car.findById(req.params.id)
      .select('-bookedDates -addedBy -isActive'); // Exclude sensitive fields
    
    if (!car) {
      console.log("❌ Car not found");
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }
    
    console.log("✅ Car found:", car.make, car.model);
    
    res.json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error("❌ Get car by ID error:", error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while fetching car"
    });
  }
};

// @desc    Update car (Owner dealer or Admin)
// @route   PUT /api/cars/:id
// @access  Private/Dealer(own car) or Admin
export const updateCar = async (req, res) => {
  try {
    console.log("=== UPDATE CAR REQUEST ===");
    console.log("Car ID:", req.params.id);
    console.log("User ID from auth:", req.userId, "Role:", req.user?.role);

    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // ✅ Ownership check: dealers can only edit their own cars; admins can edit any
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    const isOwner = car.addedBy && car.addedBy.toString() === req.userId;

    if (!isAdmin && !isOwner) {
      console.log("❌ Not owner or admin — blocking update");
      return res.status(403).json({
        success: false,
        message: "You can only edit cars you added yourself."
      });
    }

    // Prevent a dealer from reassigning a car to someone else via body injection
    const updateData = { ...req.body };
    delete updateData.addedBy;

    car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    console.log("✅ Car updated successfully");
    res.json({ success: true, message: "Car updated successfully", data: car });

  } catch (error) {
    console.error("❌ Update car error:", error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: `Validation error: ${messages.join(', ')}` });
    }
    res.status(500).json({ success: false, message: "Server error while updating car" });
  }
};

// @desc    Delete car (Owner dealer or Admin)
// @route   DELETE /api/cars/:id
// @access  Private/Dealer(own car) or Admin
export const deleteCar = async (req, res) => {
  try {
    console.log("=== DELETE CAR REQUEST ===");
    console.log("Car ID:", req.params.id);
    console.log("Requester:", req.user.email, "Role:", req.user.role);

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    const isOwner = car.addedBy && car.addedBy.toString() === req.userId;

    if (!isAdmin && !isOwner) {
      console.log("❌ Not owner or admin — blocking delete");
      return res.status(403).json({
        success: false,
        message: "You can only delete cars you added yourself."
      });
    }

    // Soft delete
    car.isActive = false;
    await car.save();

    console.log("✅ Car soft-deleted successfully");
    res.json({ success: true, message: "Car deleted successfully" });

  } catch (error) {
    console.error("❌ Delete car error:", error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid car ID" });
    }
    res.status(500).json({ success: false, message: "Server error while deleting car" });
  }
};

// @desc    Get cars belonging to the logged-in dealer
// @route   GET /api/cars/mine
// @access  Private/Dealer
export const getMyCars = async (req, res) => {
  try {
    console.log("=== GET MY CARS (dealer) ===", req.user.email);

    const cars = await Car.find({ addedBy: req.userId })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${cars.length} cars for dealer ${req.user.email}`);
    res.json({ success: true, count: cars.length, data: cars });

  } catch (error) {
    console.error("❌ Get my cars error:", error.message);
    res.status(500).json({ success: false, message: "Server error fetching your cars" });
  }
};
// Add this to your carController.js

// @desc    Get all cars for admin (with more details)
// @route   GET /api/cars/admin/all
// @access  Private/Admin
export const getCarsForAdmin = async (req, res) => {
  try {
    console.log("=== GET ALL CARS FOR ADMIN ===");
    console.log("Admin:", req.user.email);

    // ✅ Exclude soft-deleted cars by default; pass ?includeDeleted=true to see them
    const { includeDeleted } = req.query;
    const filter = includeDeleted === 'true' ? {} : { isActive: true };

    const cars = await Car.find(filter)
      .sort({ createdAt: -1 })
      .populate('addedBy', 'name email');

    console.log(`✅ Found ${cars.length} cars for admin`);

    res.json({
      success: true,
      count: cars.length,
      data: cars
    });

  } catch (error) {
    console.error("❌ Get cars for admin error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching cars"
    });
  }
};