/**
 * Reset Admin Password Script
 * Run once and then delete this file
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin credentials to set
const ADMIN_EMAIL = 'admin@growthvalley.com';
const NEW_PASSWORD = 'admin@123';

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://santoshshimpankar61_db_user:1P5ckPjwLsocWExN@cluster0.tioxubx.mongodb.net/';

// Admin Schema (same as model)
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function resetPassword() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    // Update the admin password
    const result = await Admin.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { password: hashedPassword },
      { new: true }
    );

    if (result) {
      console.log('\n✅ SUCCESS! Password updated.');
      console.log('-----------------------------------');
      console.log('Email:', ADMIN_EMAIL);
      console.log('New Password:', NEW_PASSWORD);
      console.log('-----------------------------------');
    } else {
      console.log('\n❌ Admin not found with email:', ADMIN_EMAIL);
      console.log('Creating new admin account...');

      const newAdmin = new Admin({
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD,
        name: 'Admin',
        role: 'admin'
      });

      await newAdmin.save();
      console.log('\n✅ Admin created successfully!');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Password:', NEW_PASSWORD);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
}

resetPassword();