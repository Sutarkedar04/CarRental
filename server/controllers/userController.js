// backend/controllers/userController.js
import User from '../models/userModel.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    console.log("=== GET ALL USERS REQUEST (Admin) ===");
    console.log("Admin:", req.user.email);
    
    // Get all users, exclude password field
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${users.length} users`);
    
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
    
  } catch (error) {
    console.error("❌ Get users error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching users"
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isVerified, isSuspended, department } = req.body;
    const userId = req.params.id;

    console.log("=== UPDATE USER REQUEST ===");
    console.log("User ID:", userId);
    console.log("Update data:", req.body);
    console.log("Admin:", req.user.email);
    console.log("Admin Role:", req.user.role);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isSuperAdmin = req.user.role === 'super_admin';
    const isSelf = userId === req.user._id.toString();

    // No one edits a super_admin's account through this route except themselves
    if (user.role === 'super_admin' && !isSelf) {
      return res.status(403).json({
        success: false,
        message: "Cannot modify a Super Admin account"
      });
    }

    // ✅ name / email / phone / role / department are Super Admin only, PERIOD —
    // regardless of the target user's current role (customer, dealer, admin, etc.)
    const touchingLockedFields =
      name !== undefined ||
      email !== undefined ||
      phone !== undefined ||
      role !== undefined ||
      department !== undefined;

    if (touchingLockedFields && !isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can edit name, email, phone, role, or department"
      });
    }

    // Prevent admin from changing their own role away from admin/super_admin
    if (isSelf && role && role !== 'admin' && role !== 'super_admin') {
      return res.status(400).json({
        success: false,
        message: "Cannot change your own admin role"
      });
    }

    // Block assigning/removing super_admin role through this generic route
    if (role === 'super_admin' || (user.role === 'super_admin' && role && role !== 'super_admin')) {
      return res.status(403).json({
        success: false,
        message: "Cannot assign or remove Super Admin role here"
      });
    }

    // Apply Super-Admin-only fields
    if (isSuperAdmin) {
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (phone !== undefined) user.phone = phone;
      if (role !== undefined) user.role = role;

      if (department !== undefined) {
        if (user.role === 'admin' || role === 'admin') {
          user.department = department || null;
          console.log("✅ Updating department to:", department);
        } else {
          user.department = null;
        }
      }
    }

    // ✅ Verification — any admin (or super admin) can change
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
    }

    // ✅ Suspension — any admin can suspend customers/dealers;
    // only super_admin can suspend an admin; no self-suspension.
    if (isSuspended !== undefined) {
      if (isSelf) {
        return res.status(400).json({
          success: false,
          message: "You cannot suspend your own account"
        });
      }
      if (user.role === 'admin' && !isSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: "Only Super Admin can suspend an Admin"
        });
      }
      user.isSuspended = isSuspended;
      console.log(`✅ ${isSuspended ? 'Suspending' : 'Reactivating'} user:`, user.email);
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log("✅ User updated successfully");

    return res.json({
      success: true,
      message: "User updated successfully",
      data: userResponse
    });

  } catch (error) {
    console.error("❌ Update user error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error updating user"
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    console.log("=== DELETE USER REQUEST ===");
    console.log("User ID to delete:", userId);
    console.log("Admin:", req.user.email);
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account"
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (['admin', 'super_admin'].includes(user.role) && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only a super admin can delete administrator accounts.'
      });
    }
    
    await User.findByIdAndDelete(userId);
    
    console.log("✅ User deleted successfully");
    
    return res.json({
      success: true,
      message: "User deleted successfully"
    });
    
  } catch (error) {
    console.error("❌ Delete user error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting user"
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    console.log("=== GET USER BY ID REQUEST ===");
    console.log("User ID:", userId);
    console.log("Admin:", req.user.email);
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    console.log("✅ User found:", user.email);
    
    return res.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error("❌ Get user error:", error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error fetching user"
    });
  }
};
