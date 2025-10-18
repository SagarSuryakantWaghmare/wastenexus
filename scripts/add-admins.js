/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to add admin users to the database
 * Run with: node scripts/add-admins.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Admin users to add
const adminUsers = [
  {
    name: 'Akash Sonar',
    email: 'akashsonar.9113@gmail.com',
    password: 'Akash@123',
    role: 'admin',
  },
  {
    name: 'Soham',
    email: 'soham6218@gmail.com',
    password: 'Soham@123',
    role: 'admin',
  },
];

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['client', 'champion', 'worker', 'admin'],
    default: 'client',
  },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function addAdmins() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    // Process each admin user
    for (const adminData of adminUsers) {
      console.log(`📝 Processing: ${adminData.email}`);

      // Check if user already exists
      const existingUser = await User.findOne({ email: adminData.email });

      if (existingUser) {
        // Update existing user to admin
        console.log(`   ⚠️  User already exists with role: ${existingUser.role}`);
        
        if (existingUser.role !== 'admin') {
          existingUser.role = 'admin';
          await existingUser.save();
          console.log(`   ✅ Updated ${adminData.email} to admin role`);
        } else {
          console.log(`   ℹ️  User is already an admin`);
        }
      } else {
        // Create new admin user
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        
        const newAdmin = await User.create({
          name: adminData.name,
          email: adminData.email,
          password: hashedPassword,
          role: 'admin',
          points: 0,
        });

        console.log(`   ✅ Created new admin user: ${adminData.email}`);
        console.log(`   📧 Email: ${newAdmin.email}`);
        console.log(`   👤 Name: ${newAdmin.name}`);
        console.log(`   🔑 Role: ${newAdmin.role}`);
      }
      console.log('');
    }

    // Display summary
    console.log('📊 Summary:');
    console.log('═══════════════════════════════════════');
    
    const allAdmins = await User.find({ role: 'admin' });
    console.log(`Total admin users in database: ${allAdmins.length}\n`);
    
    console.log('Admin Users:');
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (${admin.email})`);
    });
    console.log('');

    console.log('✅ Script completed successfully!');
    console.log('\n🔐 Admin Login Credentials:');
    console.log('═══════════════════════════════════════');
    adminUsers.forEach((admin) => {
      console.log(`Email: ${admin.email}`);
      console.log(`Password: ${admin.password}`);
      console.log('─────────────────────────────────────');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
console.log('🚀 Starting admin user creation script...\n');
addAdmins();
