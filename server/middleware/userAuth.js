// backend/middleware/userAuth.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE ===");
  
  let token;
  
  // 1. Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log("Token from Authorization header");
  }
  // 2. Check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token from cookies");
  }
  
  if (!token) {
    console.log("❌ No token found");
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login."
    });
  }

  console.log("Token found, verifying...");
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    console.log("User role from token:", decoded.role);
    
    // Get full user document to ensure role is current
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again."
      });
    }
    
    // Attach user info to request
    req.userId = decoded.id;
    req.user = user;
    req.userRole = user.role;
    
    console.log("✅ Authentication successful, user:", user.email, "Role:", user.role);
    next();
    
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again."
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Not authorized."
    });
  }
};

// Regular admin authorization middleware
export const adminAuth = (req, res, next) => {
  console.log("=== ADMIN CHECK ===");
  console.log("User role:", req.user?.role);
  
  if (!req.user) {
    console.log("❌ No user in request");
    return res.status(401).json({
      success: false,
      message: "Not authorized."
    });
  }
  
  // ✅ Allow both 'admin' and 'super_admin' to access admin routes
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    console.log("❌ User is not admin:", req.user.email, "Role:", req.user.role);
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }
  
  console.log("✅ Admin authorization granted for:", req.user.email);
  next();
};

// ✅ NEW: Super admin only middleware
export const superAdminAuth = (req, res, next) => {
  console.log("=== SUPER ADMIN CHECK ===");
  console.log("User role:", req.user?.role);
  
  if (!req.user) {
    console.log("❌ No user in request");
    return res.status(401).json({
      success: false,
      message: "Not authorized."
    });
  }
  
  if (req.user.role !== 'super_admin') {
    console.log("❌ Super admin access denied for:", req.user.email, "Role:", req.user.role);
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin privileges required."
    });
  }
  
  console.log("✅ Super admin authorization granted for:", req.user.email);
  next();
};

// ✅ NEW: Dealer authorization middleware (verified dealers only)
export const dealerAuth = (req, res, next) => {
  console.log("=== DEALER CHECK ===");
  console.log("User role:", req.user?.role, "Dealer status:", req.user?.dealerStatus);

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized." });
  }

  if (req.user.role !== 'dealer') {
    console.log("❌ Not a dealer:", req.user.email);
    return res.status(403).json({
      success: false,
      message: "Access denied. Dealer account required."
    });
  }

  if (req.user.dealerStatus !== 'verified') {
    console.log("❌ Dealer not verified:", req.user.email, "Status:", req.user.dealerStatus);
    return res.status(403).json({
      success: false,
      message: `Your dealer account is ${req.user.dealerStatus || 'pending'}. You cannot manage cars until an admin verifies your account.`
    });
  }

  console.log("✅ Dealer authorization granted for:", req.user.email);
  next();
};

// ✅ NEW: Allows verified dealers OR admins/super_admins through
// Use this on routes both roles should reach (e.g. car create/update/delete),
// and do ownership checks inside the controller.
export const dealerOrAdminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized." });
  }

  const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
  const isVerifiedDealer = req.user.role === 'dealer' && req.user.dealerStatus === 'verified';

  if (!isAdmin && !isVerifiedDealer) {
    return res.status(403).json({
      success: false,
      message: isAdmin === false && req.user.role === 'dealer'
        ? `Your dealer account is ${req.user.dealerStatus || 'pending'}.`
        : "Access denied. Verified dealer or admin privileges required."
    });
  }

  next();
};
export default userAuth;