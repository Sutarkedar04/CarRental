 import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const calculateBookingTotal = (dailyRate, totalDays, securityDeposit) => {
  const subtotal = dailyRate * totalDays;
  const total = subtotal + securityDeposit;
  return { subtotal, total };
};

const checkDateAvailability = (bookedDates, startDate, endDate) => {
  // Logic to check if dates overlap with existing bookings
  // We'll implement this when we create booking controller
};

export { 
  generateToken, 
  calculateBookingTotal, 
  checkDateAvailability 
};