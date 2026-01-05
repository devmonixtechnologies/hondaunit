import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

// Load environment variables
dotenv.config();
dotenv.config({ path: new URL('./.env', import.meta.url) });

const createAdmin = async () => {
  try {
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hondaunit';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete existing admin if exists
    const existingAdmin = await User.findOne({ email: 'admin@hondaunit.com' });
    if (existingAdmin) {
      console.log('Removing existing admin user...');
      await User.deleteOne({ email: 'admin@hondaunit.com' });
    }

    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({
      name: 'HondaUnit Admin',
      email: 'admin@hondaunit.com',
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@hondaunit.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
