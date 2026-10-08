// backend/scripts/createSuperAdmin.js
// Run with: node scripts/createSuperAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const superAdminEmail = 'superadmin@carrental.com';

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ email: superAdminEmail });

    if (existingSuperAdmin) {
      console.log('Super admin already exists!');
      process.exit(0);
    }

    // Create super admin — password is hashed by the userModel pre('save') hook
    const superAdmin = await User.create({
      name: 'System Super Admin',
      email: superAdminEmail,
      password: 'SuperSecurePass123!',   // ✅ plaintext; hook hashes it
      phone: '+1 (555) 000-0000',
      role: 'super_admin',
      department: 'Management',
      isVerified: true,
      address: {
        street: '123 Admin St',
        city: 'System City',
        state: 'SC',
        zipCode: '12345'
      }
    });

    console.log('✅ Super Admin created successfully!');
    console.log('Email:', superAdminEmail);
    console.log('Password: SuperSecurePass123!');
    console.log('Please change the password after first login!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();