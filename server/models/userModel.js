// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ['customer', 'dealer', 'admin', 'super_admin'],  // ✅ Added super_admin
    default: 'customer'
  },
  phone: {
  type: String,
  required: false,  // ← was: required: [true, ...]
  default: ''
},
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  driverLicense: {
    number: String,
    expiryDate: Date,
    imageUrl: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  department: {
  type: String,
  enum: ['Operations', 'Management', 'Customer Service', 'Fleet Management', 'Finance', 'IT Support', 'Marketing'],
  required: false,  // ← was: required: function() { return this.role === 'admin'... }
  default: null
},
  createdBy: {  // ✅ Track who created this admin
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dealerStatus: {
  type: String,
  enum: ['pending', 'verified', 'rejected'],
  default: undefined  // stays unset for non-dealers
},
dealerProfile: {
  businessName: String,
  city: String,           // primary operating city, useful for search/filtering later
  documentsUrl: String     // ID/business proof upload, optional for now
},
// models/User.js
isSuspended: {
  type: Boolean,
  default: false,
},
}, {
  timestamps: true
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
