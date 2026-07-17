import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";

// @desc   Register user
// @route  POST /api/auth/register
// @access Public
// @desc   Register user with role
// @route  POST /api/auth/register
// @access Public
export const register = async (req, res) => {
  console.log("=== REGISTRATION REQUEST ===");
  console.log("Request Body:", req.body);
  
  try {
    const { name, email, password, phone, address, role, dealerProfile } = req.body; // ✅ added dealerProfile

    console.log("Validating fields...");

    if (!name || !email || !password || !phone) {
      console.log("Missing fields:", { name, email, password, phone });
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and phone are required."
      });
    }

    const allowedPublicRoles = ['customer', 'dealer'];
    const finalRole = allowedPublicRoles.includes(role) ? role : 'customer';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email."
      });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    console.log("Creating new user...");
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      address: address || {},
      role: finalRole
    };

    if (finalRole === 'dealer') {
      userData.dealerStatus = 'pending';
      userData.dealerProfile = dealerProfile || {};
      userData.isVerified = false;
    }

    // ✅ removed the two stray console.log(user...) lines that were here

    const user = await User.create(userData);
    console.log("User created successfully:", user._id);
    console.log("User role:", user.role);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Setting cookie...");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      dealerStatus: user.dealerStatus,
      address: user.address
    };

    const message = finalRole === 'dealer'
      ? "Dealer application submitted. Your account will be reviewed by an admin before you can list cars."
      : `User registered successfully as ${user.role}`;

    return res.status(201).json({ success: true, message, token, user: userResponse });

  } catch (error) {
    console.error("=== REGISTRATION ERROR ===");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message || "Unknown error"}`
    });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res) => {
  console.log("=== LOGIN REQUEST ===");
  console.log("Request Body:", req.body);
  
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Find user
    console.log("Finding user with email:", email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response with role
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      dealerStatus: user.dealerStatus,
      address: user.address
    };

    console.log("Login successful. User role:", user.role);
    return res.json({
      success: true,
      message: `Login successful as ${user.role}`,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
};

// @desc   Get current user profile with role
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // ✅ add this
    if (user.isSuspended) {
      return res.status(403).json({ success: false, message: "Your account has been suspended." });
    }

    return res.json({ success: true, user, role: user.role });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// @desc   Check if user is admin
// @route  GET /api/auth/check-admin
// @access Private
export const checkAdmin = async (req, res) => {
  console.log("=== CHECK ADMIN REQUEST ===");
  console.log("User:", req.user?.email, "Role:", req.user?.role);
  
  try {
    const isAdmin = req.user?.role === 'admin';
    
    return res.json({
      success: true,
      isAdmin,
      role: req.user?.role || null
    });

  } catch (error) {
    console.error("❌ Check admin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
};

// @desc   Logout user
// @route  POST /api/auth/logout
// @access Public
export const logout = (req, res) => {
  // Clear the cookie
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
  });

  return res.json({
    success: true,
    message: "Logged out successfully."
  });
};

// @desc   Send a password reset link
// @route  POST /api/auth/forgot-password
// @access Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.'
      });
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) {
      return res.status(503).json({
        success: false,
        message: 'Password reset email is not configured yet.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: 'Reset your CarRental password',
          text: `Reset your password by opening this link: ${resetUrl}\n\nThis link expires in 15 minutes.`,
          html: `<p>Reset your CarRental password by opening the link below.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 15 minutes.</p>`
        });
      } catch (emailError) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw emailError;
      }
    }

    return res.json({
      success: true,
      message: 'If an account uses that email address, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to send a password reset email. Please try again later.'
    });
  }
};

// @desc   Reset a password with a valid reset token
// @route  POST /api/auth/reset-password/:token
// @access Public
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const passwordResetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This password reset link is invalid or has expired.'
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now sign in.'
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to reset password. Please try again later.'
    });
  }
};

// backend/controllers/authController.js - ADD THESE NEW FUNCTIONS

// @desc   Create new admin (Super Admin only)
// @route  POST /api/auth/create-admin
// @access Private/Super Admin
export const createAdmin = async (req, res) => {
  console.log("=== CREATE ADMIN REQUEST (Super Admin Only) ===");
  console.log("Request Body:", req.body);
  console.log("Creator:", req.user.email, "Role:", req.user.role);
  
  try {
    // ✅ Verify super admin role
    if (req.user.role !== 'super_admin') {
      console.log("❌ Non-super admin attempted to create admin");
      return res.status(403).json({
        success: false,
        message: "Only super admins can create new admin accounts."
      });
    }
    
    const { name, email, password, phone, department, role = 'admin' } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !department) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, phone, and department are required."
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      role: 'admin',  // Force role to admin (can't create super_admin)
      isVerified: true,
      createdBy: req.userId  // Track who created this admin
    });
    
    console.log("✅ Admin created successfully by super admin:", newAdmin._id);

    // Send response (without sensitive data)
    const adminResponse = {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
      role: newAdmin.role,
      department: newAdmin.department,
      createdBy: req.user.email
    };

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: adminResponse
    });

  } catch (error) {
    console.error("=== CREATE ADMIN ERROR ===");
    console.error("Error:", error.message);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
    
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message || "Unknown error"}`
    });
  }
};

// @desc   Get all admins (Super Admin only)
// @route  GET /api/auth/admins
// @access Private/Super Admin
export const getAllAdmins = async (req, res) => {
  console.log("=== GET ALL ADMINS REQUEST ===");
  console.log("Requester:", req.user.email, "Role:", req.user.role);
  
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Only super admins can view admin list."
      });
    }
    
    const admins = await User.find({ 
      role: { $in: ['admin', 'super_admin'] } 
    }).select('-password').populate('createdBy', 'name email');
    
    console.log(`✅ Found ${admins.length} admins`);
    
    return res.json({
      success: true,
      count: admins.length,
      data: admins
    });
    
  } catch (error) {
    console.error("❌ Get admins error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching admins"
    });
  }
};

// @desc   Remove admin (Super Admin only)
// @route  DELETE /api/auth/admins/:id
// @access Private/Super Admin
export const removeAdmin = async (req, res) => {
  console.log("=== REMOVE ADMIN REQUEST ===");
  console.log("Admin ID to remove:", req.params.id);
  console.log("Requester:", req.user.email, "Role:", req.user.role);
  
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: "Only super admins can remove admin accounts."
      });
    }
    
    const adminToRemove = await User.findById(req.params.id);
    
    if (!adminToRemove) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (adminToRemove.role === 'super_admin') {
      return res.status(400).json({
        success: false,
        message: "Cannot remove super admin account."
      });
    }
    
    if (adminToRemove.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: "User is not an admin."
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    console.log("✅ Admin removed successfully");
    
    return res.json({
      success: true,
      message: "Admin account removed successfully"
    });
    
  } catch (error) {
    console.error("❌ Remove admin error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error removing admin"
    });
  }
};

// Add this function to your existing authController.js file

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
// In your updateProfile / PUT /auth/profile handler, add department:
// backend/controllers/authController.js - Update the updateProfile function

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, driverLicense, dealerProfile } = req.body;
    const userId = req.userId;
    
    console.log("=== UPDATE PROFILE REQUEST ===");
    console.log("User ID:", userId);
    console.log("Update data:", req.body);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Basic fields anyone can update
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (driverLicense !== undefined) user.driverLicense = driverLicense;
    if (dealerProfile !== undefined && user.role === 'dealer') {
      user.dealerProfile = dealerProfile;
    }
    
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    console.log("✅ Profile updated successfully");
    
    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse
    });
    
  } catch (error) {
    console.error("❌ Update profile error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server error updating profile: " + error.message 
    });
  }
};

// @desc   List pending dealer applications
// @route  GET /api/auth/dealers/pending
// @access Private/Admin
export const getPendingDealers = async (req, res) => {
  console.log("=== GET PENDING DEALERS ===");
  try {
    const dealers = await User.find({ role: 'dealer', dealerStatus: 'pending' })
      .select('-password');
    console.log(`✅ Found ${dealers.length} pending dealers`);
    return res.json({ success: true, count: dealers.length, data: dealers });
  } catch (error) {
    console.error("❌ Get pending dealers error:", error.message);
    return res.status(500).json({ success: false, message: "Server error fetching dealers" });
  }
};

// @desc   Approve or reject a dealer application
// @route  PATCH /api/auth/dealers/:id/verify
// @access Private/Admin
export const verifyDealer = async (req, res) => {
  console.log("=== VERIFY DEALER ===", req.params.id, req.body);
  try {
    const { decision } = req.body; // 'verified' | 'rejected'
    if (!['verified', 'rejected'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "decision must be 'verified' or 'rejected'"
      });
    }

    const dealer = await User.findById(req.params.id);
    if (!dealer || dealer.role !== 'dealer') {
      return res.status(404).json({ success: false, message: "Dealer not found" });
    }

    dealer.dealerStatus = decision;
    dealer.isVerified = decision === 'verified';
    await dealer.save();

    console.log(`✅ Dealer ${decision}:`, dealer.email);
    return res.json({
      success: true,
      message: `Dealer ${decision}`,
      data: { id: dealer._id, email: dealer.email, dealerStatus: dealer.dealerStatus }
    });
  } catch (error) {
    console.error("❌ Verify dealer error:", error.message);
    return res.status(500).json({ success: false, message: "Server error updating dealer status" });
  }
};

