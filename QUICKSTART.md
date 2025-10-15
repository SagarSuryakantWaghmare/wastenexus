# ⚡ Quick Start Guide - Waste Nexus

Get up and running with Waste Nexus in 5 minutes!

## 🚀 Fast Setup (For Development)

### 1. Clone & Install (2 minutes)
```bash
# Clone the repository
git clone https://github.com/yourusername/wastenexus.git
cd wastenexus

# Install dependencies
npm install
```

### 2. Setup Database (1 minute)

#### Option A: Local MongoDB
```bash
# Install MongoDB (if not installed)
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Use in `.env.local`

### 3. Configure Environment (1 minute)
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values
# For quick testing, the example values work with local MongoDB
```

**Minimum `.env.local` for local development:**
```env
MONGODB_URI=mongodb://localhost:27017/wastenexus
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test-secret-key
JWT_SECRET=test-jwt-secret
```

### 4. Run the App (1 minute)
```bash
# Start development server
npm run dev

# Open browser
# Visit: http://localhost:3000
```

---

## 🎯 First Steps After Running

### Create Your First Accounts

#### 1. Create a Client Account
1. Click "Sign Up" on the home page
2. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Role: **Client**
3. Click "Sign Up"
4. You'll be redirected to the Client Dashboard

#### 2. Create a Champion Account
1. Logout (button in navbar)
2. Click "Sign Up" again
3. Fill in:
   - Name: `Jane Champion`
   - Email: `jane@example.com`
   - Password: `password123`
   - Role: **Champion**
4. Click "Sign Up"
5. You'll be redirected to the Champion Dashboard

### Test the Full Flow

#### As Client:
1. **Submit a Report:**
   - Type: `Plastic`
   - Weight: `2.5` kg
   - Click "Submit Report"
   - Status: **Pending** (yellow badge)

2. **Check Leaderboard:**
   - You'll see your name with 0 points (not verified yet)

#### As Champion:
1. **Verify the Report:**
   - See the pending report from John Doe
   - Click "Verify" button
   - Report status changes to **Verified** (green badge)

2. **Create an Event:**
   - Click "Create Event" button
   - Fill in:
     - Title: `Beach Cleanup 2024`
     - Description: `Join us for a community beach cleanup`
     - Location: `Santa Monica Beach`
     - Date: Select a future date
   - Click "Create Event"

#### Back to Client:
1. Logout and login as John (john@example.com)
2. **See Updated Points:**
   - Total Points: 38 (2.5 kg × 15 pts/kg)
   - Rank updated on leaderboard
3. **See New Event:**
   - Event appears in "Upcoming Events" section

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Or check your MONGODB_URI in .env.local
```

### Issue 2: Port 3000 Already in Use
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill the process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue 3: JWT Token Invalid
**Error:** `Invalid token` or `Authentication required`

**Solution:**
- Logout and login again
- Clear browser localStorage:
  ```javascript
  // In browser console
  localStorage.clear();
  ```
- Refresh the page

### Issue 4: Module Not Found
**Error:** `Module not found: Can't resolve '@/...'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Testing the Application

### Test Data Generation Script

Create test users and data quickly:

```typescript
// scripts/seed-data.ts (create this file)
// Run with: npx ts-node scripts/seed-data.ts

import mongoose from 'mongoose';
import User from './models/User';
import Report from './models/Report';
import { hashPassword } from './lib/auth';

async function seedData() {
  await mongoose.connect('mongodb://localhost:27017/wastenexus');
  
  // Create 10 client users
  for (let i = 1; i <= 10; i++) {
    const hashedPassword = await hashPassword('password123');
    await User.create({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      role: 'client',
      totalPoints: Math.floor(Math.random() * 5000),
    });
  }
  
  console.log('✅ Data seeded successfully!');
  process.exit(0);
}

seedData();
```

---

## 🔍 Useful Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting errors

# Type Checking
npx tsc --noEmit        # Check TypeScript errors
```

---

## 📱 Test on Different Devices

### Local Network Testing
```bash
# Find your local IP (Windows)
ipconfig

# Find your local IP (Mac/Linux)
ifconfig | grep "inet "

# Access from phone/tablet
# http://YOUR_LOCAL_IP:3000
# Example: http://192.168.1.100:3000
```

---

## 🎓 Learning the Codebase

### File Reading Order (Recommended)
1. **Start Here:**
   - `README.md` - Overview
   - `DEVELOPMENT_ROADMAP.md` - Architecture

2. **Backend:**
   - `models/User.ts` - Database schema
   - `lib/mongodb.ts` - DB connection
   - `app/api/auth/login/route.ts` - API example
   - `lib/helpers.ts` - Business logic

3. **Frontend:**
   - `contexts/AuthContext.tsx` - State management
   - `app/page.tsx` - Landing page
   - `app/dashboard/client/page.tsx` - Client UI
   - `components/Navbar.tsx` - Shared component

### Key Concepts to Understand
1. **Next.js App Router** - File-based routing
2. **Server Components vs Client Components** - 'use client' directive
3. **API Routes** - Serverless functions
4. **Mongoose Models** - Database schemas
5. **JWT Authentication** - Token-based auth
6. **React Context** - Global state

---

## 🎯 What to Build Next?

### Easy Additions (Beginner)
- [ ] Add user profile edit page
- [ ] Add sorting/filtering to reports
- [ ] Add more reward badges
- [ ] Add dark mode toggle

### Intermediate Features
- [ ] Email verification
- [ ] Password reset flow
- [ ] Export reports to CSV
- [ ] Search functionality

### Advanced Features
- [ ] Real-time updates with WebSockets
- [ ] Image upload for reports
- [ ] Advanced analytics dashboard
- [ ] Admin panel

---

## 📞 Need Help?

### Resources
- **Next.js Docs:** https://nextjs.org/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Shadcn UI:** https://ui.shadcn.com

### Community
- Open an issue on GitHub
- Check existing issues first
- Provide error messages and screenshots

---

## ✅ Checklist for New Developers

Before you start coding:
- [ ] Read README.md
- [ ] Set up development environment
- [ ] Create test accounts (Client & Champion)
- [ ] Test the complete user flow
- [ ] Explore the codebase structure
- [ ] Run the app successfully
- [ ] Make a small change and see it live
- [ ] Check DEVELOPMENT_ROADMAP.md for architecture

---

**You're now ready to develop with Waste Nexus! Happy coding! 🚀**
