# 🌱 WasteNexus - Smart Waste Management Platform# 🌱 Waste Nexus - Gamified Waste Management Platform# 🌱 Waste Nexus - Gamified Waste Management Platform



<div align="center">



**A comprehensive platform connecting communities for sustainable waste management**A modern, full-stack waste management application built with Next.js 15, featuring **AI-powered waste classification**, **real-time leaderboards**, and **community-driven** waste collection events.A modern, full-stack waste management platform that gamifies recycling and waste collection. Built with Next.js 15, MongoDB, and a clean green-themed UI.



[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org/)

[![React](https://img.shields.io/badge/React-19.0-blue?style=flat&logo=react)](https://react.dev/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)## ✨ New Features Added## 🚀 Features

[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=flat&logo=mongodb)](https://www.mongodb.com/)

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)



[Features](#-features) • [Demo](#-user-roles) • [Installation](#-installation) • [Documentation](#-api-documentation) • [Contributing](#-contributing)### 🤖 AI-Powered Features### For Clients (Users)



</div>- **Google Gemini AI Integration**: Automatic waste type classification from uploaded images- **Waste Reporting**: Submit waste collection reports with type and weight



---- **Smart Waste Detection**: AI analyzes images and provides confidence scores, descriptions, and recycling suggestions- **Points System**: Earn points based on waste type and weight (verified by Champions)



## 📋 Table of Contents- **Intelligent Insights**: AI-generated recommendations based on your waste patterns- **Live Leaderboard**: Compete with other users and track your rank



- [Overview](#-overview)- **Rewards & Badges**: Unlock tiers (Beginner, Bronze, Silver, Gold, Platinum, Diamond)

- [Features](#-features)

- [User Roles](#-user-roles)### 📸 Image Upload & Management- **Event Discovery**: View and join upcoming community waste collection events

- [Tech Stack](#-tech-stack)

- [Installation](#-installation)- **Cloudinary Integration**: Secure cloud storage for waste report images- **Dashboard**: Track all your submissions and their verification status

- [Environment Configuration](#-environment-configuration)

- [Application Architecture](#-application-architecture)- **Visual Verification**: Champions can review actual images before approving reports

- [Database Models](#-database-models)

- [API Documentation](#-api-documentation)- **Image Preview**: Real-time preview before submission### For Champions (Admins)

- [Rewards System](#-rewards--points-system)

- [Security](#-security)- **Report Verification**: Review and verify/reject client submissions

- [Deployment](#-deployment)

- [Contributing](#-contributing)### 🗺️ Location Services- **Event Management**: Create and organize waste collection campaigns

- [License](#-license)

- **Google Maps Integration**: Interactive map for selecting exact waste locations- **Analytics Dashboard**: View pending reports, total events, and participant counts

---

- **Auto-Location Detection**: One-click "Use Current Location" feature- **Real-time Processing**: Instant point allocation upon verification

## 🌍 Overview

- **Geocoding**: Automatic address resolution from coordinates

**WasteNexus** is a modern, full-stack web application designed to revolutionize waste management by connecting citizens, waste workers, environmental champions, and administrators on a unified platform. The system gamifies waste management through a comprehensive points-based rewards system, making sustainable practices engaging and rewarding.

- **Event Location Mapping**: Visual location picker for creating events## 🛠️ Tech Stack

### Why WasteNexus?



- 🤖 **AI-Powered**: Leverages Google Gemini AI for accurate waste classification

- 🗺️ **Location Intelligence**: Real-time Google Maps integration## 🎯 Complete Feature Set### Frontend

- 🏆 **Gamification**: Comprehensive rewards system with 300+ points across activities

- 📱 **Responsive**: Mobile-first design with dark mode support- **Next.js 15** (App Router, Server Components, API Routes)

- ⚡ **Real-time**: Instant notifications and status updates

- 🔒 **Secure**: JWT-based authentication with role-based access control### For Clients (Users)- **React 19** with TypeScript



---- 📸 Upload waste images for AI classification- **Tailwind CSS 4** for styling



## ✨ Features- 📍 Pin-point waste locations on interactive map- **Shadcn UI** for components



### Core Functionality- 🏆 Earn points based on waste type and weight- **Lucide React** for icons



#### 🗑️ Waste Management- 🎖️ Unlock achievement badges (6 tiers)

- **Smart Waste Reporting**: Submit waste reports with AI-powered image classification

- **Location Tracking**: Interactive Google Maps for precise location marking- 📊 Personal dashboard with stats### Backend

- **Real-time Verification**: Admin verification system with instant feedback

- **Image Upload**: Cloudinary integration for secure image storage- 📅 Browse upcoming waste collection events- **Next.js API Routes** (serverless functions)



#### 🏢 Job Management System- 🌟 Real-time leaderboard rankings- **MongoDB** with Mongoose ODM

- **Job Posting**: Clients can post waste collection jobs with details

- **Admin Verification**: Admin approval workflow for job postings- **JWT** for authentication

- **Worker Assignment**: Assign verified jobs to workers

- **Status Tracking**: Track job progress from pending to completed### For Champions (Officials)- **bcryptjs** for password hashing



#### 🎉 Events System- ✅ Review reports with photo evidence

- **Community Events**: Champions create and manage waste collection events

- **Event Discovery**: Browse and join upcoming environmental events- 🗺️ Create events with map-based location picker### Key Features

- **Participant Management**: Track event participants and engagement

- **Location-based Events**: Map integration for event locations- 📈 Monitor pending verifications- Server-side rendering (SSR)



#### 🛒 Marketplace- 👥 Track event participation- Client-side state management with React Context

- **Sustainable Shopping**: Buy/sell recycled and upcycled items

- **Admin Approval**: Quality control through admin verification- 🎯 Dashboard analytics- RESTful API design

- **Transaction Tracking**: Complete buyer-seller connection

- **Favorites System**: Save items for later purchase- Role-based access control



#### 📊 Analytics & Leaderboard## 🛠️ Technology Stack- Real-time data updates

- **Real-time Rankings**: Dynamic leaderboard based on points

- **User Statistics**: Comprehensive dashboards for all roles

- **Performance Tracking**: Monitor waste collection metrics

- **Achievement Badges**: 6-tier reward system (Beginner to Diamond)### Core Technologies## 📦 Installation



---- **Next.js 15** + **React 19** - Latest framework features



## 👥 User Roles- **TypeScript** - Type-safe development### Prerequisites



### 1. 🧑‍💼 Client (General Users)- **Tailwind CSS 4** - Modern styling- Node.js 18+ and npm



**Primary Functions:**- **Shadcn UI** - Beautiful components- MongoDB (local or Atlas cloud)

- Report waste with location and images

- Post waste collection jobs

- Purchase marketplace items

- Join community events### AI & Cloud Services### Setup Steps

- View personal dashboard and statistics

- **Google Gemini AI** - Waste classification & insights

**Dashboard Features:**

- Total points and rank- **Cloudinary** - Image upload & management1. **Clone the repository**

- Active reports and jobs

- Rewards breakdown- **Google Maps API** - Location services   ```bash

- Event participation history

   git clone https://github.com/yourusername/wastenexus.git

### 2. 🦸 Champion (Community Leaders)

### Database & Auth   cd wastenexus

**Primary Functions:**

- Create and manage environmental events- **MongoDB Atlas** - Cloud database   ```

- Organize community cleanup drives

- Track event participation- **Mongoose** - ODM

- Earn bonus points for event creation

- **JWT** + **Bcrypt** - Secure authentication2. **Install dependencies**

**Dashboard Features:**

- Event management panel   ```bash

- Participant tracking

- Event analytics## 🚀 Quick Start   npm install

- Community engagement metrics

   ```

### 3. 👷 Worker (Waste Collection Workers)

### Prerequisites

**Primary Functions:**

- View assigned collection tasksAll API keys and services are already configured in your `.env.local`:3. **Configure environment variables**

- Complete waste collection jobs

- Mark reports as collected- ✅ MongoDB Atlas (Connected)   ```bash

- Track earnings and points

- ✅ Cloudinary (Ready)   cp .env.example .env.local

**Dashboard Features:**

- Task assignment list- ✅ Google Gemini AI (Configured)   ```

- Collection history

- Points earned from collections- ✅ Google Maps API (Active)

- Performance metrics

   Edit `.env.local` with your configuration:

**Special Features:**

- Worker application system with Aadhaar verification### Installation   ```env

- Photo ID upload requirement

- Admin approval workflow   MONGODB_URI=mongodb://localhost:27017/wastenexus



### 4. 🔐 Admin (System Administrators)```bash   NEXTAUTH_URL=http://localhost:3000



**Primary Functions:**# Install dependencies   NEXTAUTH_SECRET=your-super-secret-key-change-this

- Verify/reject waste reports

- Approve/reject job postingsnpm install   JWT_SECRET=your-jwt-secret-change-this

- Manage marketplace listings

- Verify events and workers   ```

- Monitor platform analytics

# Run development server

**Dashboard Features:**

- Comprehensive analytics dashboardnpm run dev4. **Start MongoDB** (if using local)

- User management panel

- Report verification queue```   ```bash

- Job approval system

- Marketplace moderation   mongod

- Worker application reviews

- Platform-wide statisticsVisit **http://localhost:3000** 🎉   ```



---



## 🛠 Tech Stack### First Time Usage5. **Run the development server**



### Frontend   ```bash

| Technology | Version | Purpose |

|------------|---------|---------|1. **Create a Client Account**   npm run dev

| Next.js | 15.0 | React framework with App Router |

| React | 19.0 | UI library |   - Email: `test@client.com`   ```

| TypeScript | 5.0 | Type-safe development |

| Tailwind CSS | 4.0 | Utility-first CSS framework |   - Password: `password123`

| Shadcn UI | Latest | Component library |

| Framer Motion | 11.x | Animations |   - Role: **Client**6. **Open your browser**

| Lucide React | Latest | Icon system |

   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend

| Technology | Version | Purpose |2. **Submit Your First Report**

|------------|---------|---------|

| Next.js API Routes | 15.0 | Serverless API endpoints |   - Upload a waste image## 📁 Project Structure

| MongoDB | 7.0 | NoSQL database |

| Mongoose | 8.x | MongoDB ODM |   - AI will auto-classify it

| JWT | 9.x | Authentication tokens |

| bcryptjs | 2.x | Password hashing |   - Select location on map```



### External Services   - Enter weightwastenexus/

| Service | Purpose |

|---------|---------|   - Submit!├── app/

| Google Gemini AI | Waste classification and insights |

| Cloudinary | Image upload and storage |│   ├── api/                    # API Routes

| Google Maps API | Location services and geocoding |

| Resend | Email notifications |3. **Create a Champion Account**│   │   ├── auth/              # Authentication endpoints



### Development Tools   - Email: `test@champion.com`│   │   ├── reports/           # Report CRUD & verification

- ESLint for code linting

- Prettier for code formatting   - Password: `password123`│   │   ├── events/            # Event management

- TypeScript for type checking

   - Role: **Champion**│   │   ├── leaderboard/       # Leaderboard data

---

│   │   └── user/              # User profile

## 📦 Installation

4. **Verify the Report**│   ├── dashboard/

### Prerequisites

   - Review the image│   │   ├── client/            # Client dashboard

- **Node.js**: Version 18.0 or higher

- **npm**: Version 9.0 or higher   - Check AI classification│   │   └── champion/          # Champion dashboard

- **MongoDB**: Local installation or MongoDB Atlas account

- **Git**: For version control   - Approve or reject│   ├── layout.tsx             # Root layout with AuthProvider



### Step-by-Step Setup   - Points awarded automatically!│   ├── page.tsx               # Landing page with auth



1. **Clone the Repository**│   └── globals.css            # Global styles

   ```bash

   git clone https://github.com/yourusername/wastenexus.git## 📊 Point System├── components/

   cd wastenexus

   ```│   ├── ui/                    # Shadcn UI components



2. **Install Dependencies**| Waste Type | Points/kg | Best For |│   └── Navbar.tsx             # Navigation component

   ```bash

   npm install|-----------|-----------|----------|├── contexts/

   ```

| E-Waste 🖥️ | 20 | Electronics, batteries |│   └── AuthContext.tsx        # Authentication context

3. **Set Up Environment Variables**

   ```bash| Plastic 🥤 | 15 | Bottles, containers |├── hooks/

   cp .env.example .env.local

   ```| Metal 🔩 | 13 | Cans, wires |│   └── useApi.ts              # API call hook

   

   Edit `.env.local` with your configuration (see [Environment Configuration](#-environment-configuration))| Glass 🍾 | 12 | Bottles, jars |├── lib/



4. **Start MongoDB** (if using local MongoDB)| Cardboard 📦 | 10 | Boxes, packaging |│   ├── mongodb.ts             # Database connection

   ```bash

   mongod| Paper 📄 | 10 | Documents, newspapers |│   ├── auth.ts                # Auth utilities

   ```

| Organic 🍃 | 8 | Food waste, leaves |│   ├── helpers.ts             # Helper functions

5. **Run Development Server**

   ```bash│   └── utils.ts               # Utility functions

   npm run dev

   ```## 🏆 Achievement System├── models/



6. **Open Browser**│   ├── User.ts                # User schema

   Navigate to [http://localhost:3000](http://localhost:3000)

Progress through 6 reward tiers:│   ├── Report.ts              # Report schema

### Build for Production

│   └── Event.ts               # Event schema

```bash

npm run build```└── .env.local                 # Environment variables

npm run start

```🌱 Beginner    →    0-499 pts```



---🥉 Bronze      →    500-999 pts



## 🔧 Environment Configuration🥈 Silver      →    1,000-2,499 pts## 🔑 API Endpoints



Create a `.env.local` file in the root directory with the following variables:🥇 Gold        →    2,500-4,999 pts



```env🏆 Platinum    →    5,000-9,999 pts### Authentication

# Database

MONGODB_URI=mongodb://localhost:27017/wastenexus💎 Diamond     →    10,000+ pts- `POST /api/auth/signup` - Register new user

# Or for MongoDB Atlas:

# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wastenexus```- `POST /api/auth/login` - User login



# Authentication

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

NEXTAUTH_SECRET=your-nextauth-secret-key-change-this## 🔌 API Documentation### Reports

NEXTAUTH_URL=http://localhost:3000

- `POST /api/reports` - Submit new report (Client)

# Google Gemini AI (Optional - for waste classification)

GEMINI_API_KEY=your-gemini-api-key### Upload & AI Classification- `GET /api/reports` - Get reports (filtered by role)



# Cloudinary (Optional - for image uploads)```typescript- `PUT /api/reports/[id]/verify` - Verify/reject report (Champion)

CLOUDINARY_CLOUD_NAME=your-cloud-name

CLOUDINARY_API_KEY=your-api-keyPOST /api/upload

CLOUDINARY_API_SECRET=your-api-secret

Content-Type: multipart/form-data### Events

# Google Maps API (Optional - for location services)

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-keyAuthorization: Bearer <token>- `POST /api/events` - Create event (Champion)



# Email Service (Optional - for notifications)- `GET /api/events` - Get all events

RESEND_API_KEY=your-resend-api-key

EMAIL_FROM=noreply@wastenexus.comBody: { image: File }

```

### Leaderboard

### Obtaining API Keys

Response: {- `GET /api/leaderboard` - Get top users

**Google Gemini AI:**

- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)  imageUrl: string;

- Create a new API key

- Add to `GEMINI_API_KEY`  classification: {### User



**Cloudinary:**    type: string;- `GET /api/user` - Get current user profile

- Sign up at [Cloudinary](https://cloudinary.com/)

- Get credentials from Dashboard    confidence: number;

- Add Cloud Name, API Key, and API Secret

    description: string;## 🎮 Usage

**Google Maps API:**

- Visit [Google Cloud Console](https://console.cloud.google.com/)    recyclable: boolean;

- Enable Maps JavaScript API and Geocoding API

- Create API key and add to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`    suggestions: string[];### Creating a Client Account



**Resend:**  }1. Navigate to the homepage

- Sign up at [Resend](https://resend.com/)

- Get API key from dashboard}2. Click "Sign Up"

- Add to `RESEND_API_KEY`

```3. Select "Client" role

---

4. Fill in your details

## 🏗 Application Architecture

### Submit Report with Image & Location5. Submit waste reports and earn points!

### Project Structure

```typescript

```

wastenexus/POST /api/reports### Creating a Champion Account

├── app/                        # Next.js App Router

│   ├── api/                    # API Routes (Backend)Authorization: Bearer <token>1. Navigate to the homepage

│   │   ├── auth/               # Authentication

│   │   ├── reports/            # Waste reports2. Click "Sign Up"

│   │   ├── jobs/               # Job management

│   │   ├── events/             # Events systemBody: {3. Select "Champion" role

│   │   ├── marketplace/        # Marketplace

│   │   ├── admin/              # Admin endpoints  type: string;4. Fill in your details

│   │   ├── worker/             # Worker endpoints

│   │   ├── client/             # Client endpoints  weightKg: number;5. Verify reports and create events!

│   │   ├── leaderboard/        # Rankings

│   │   ├── user/               # User profile  imageUrl?: string;

│   │   ├── upload/             # File uploads

│   │   └── worker-applications/  aiClassification?: object;### Points System

│   │

│   ├── dashboard/              # Role-based dashboards  location?: {- Plastic: 15 points/kg

│   │   ├── client/             # Client dashboard

│   │   ├── champion/           # Champion dashboard    latitude: number;- E-Waste: 20 points/kg

│   │   ├── worker/             # Worker dashboard

│   │   └── admin/              # Admin dashboard    longitude: number;- Metal: 13 points/kg

│   │

│   ├── auth/                   # Auth pages    address: string;- Glass: 12 points/kg

│   ├── marketplace/            # Public marketplace

│   ├── layout.tsx              # Root layout  }- Cardboard: 10 points/kg

│   ├── page.tsx                # Landing page

│   └── globals.css             # Global styles}- Paper: 10 points/kg

│

├── components/                 # React components```- Organic: 8 points/kg

│   ├── ui/                     # Shadcn UI components

│   ├── Home/                   # Landing page components

│   ├── admin/                  # Admin components

│   ├── champion/               # Champion components### Create Event with Location### Reward Tiers

│   ├── Marketplace/            # Marketplace components

│   ├── Navbar.tsx```typescript- 🌱 Beginner: 0-499 points

│   ├── Footer.tsx

│   ├── AppLoader.tsxPOST /api/events- 🥉 Bronze: 500-999 points

│   ├── LoaderOne.tsx

│   ├── LocationPicker.tsxAuthorization: Bearer <token>- 🥈 Silver: 1,000-2,499 points

│   ├── WasteReportForm.tsx

│   ├── RewardsBreakdown.tsx- 🥇 Gold: 2,500-4,999 points

│   ├── ProfileModal.tsx

│   └── UserAvatar.tsxBody: {- 🏆 Platinum: 5,000-9,999 points

│

├── lib/                        # Utilities  title: string;- 💎 Diamond: 10,000+ points

│   ├── mongodb.ts

│   ├── auth.ts  description: string;

│   ├── cloudinary.ts

│   ├── gemini.ts  location: string;## 🔒 Security Features

│   ├── email.ts

│   ├── helpers.ts  coordinates?: {

│   ├── marketplace.ts

│   └── utils.ts    latitude: number;- Password hashing with bcryptjs

│

├── models/                     # Mongoose schemas    longitude: number;- JWT token-based authentication

│   ├── User.ts

│   ├── Report.ts  };- Role-based access control

│   ├── Job.ts

│   ├── Event.ts  date: Date;- Protected API routes

│   ├── MarketplaceItem.ts

│   ├── WorkerApplication.ts}- Client-side route protection

│   ├── WorkerTask.ts

│   └── index.ts```- Input validation and sanitization

│

├── public/                     # Static assets

├── .env.local                  # Environment variables

└── package.json                # Dependencies## 📱 Screenshots & Features## 🎨 Design Philosophy

```



---

### Client Dashboard- **Green Theme**: Consistent eco-friendly color palette

## 🗄 Database Models

- ✅ AI-powered waste report form with image upload- **Clean UI**: Modern, minimalist interface

### User Model

```typescript- ✅ Interactive Google Maps location picker- **Responsive**: Mobile-first design approach

{

  _id: ObjectId,- ✅ Visual report history with thumbnails- **Accessible**: WCAG-compliant components

  name: string,

  email: string (unique),- ✅ Real-time points and leaderboard- **Fast**: Optimized performance with Next.js 15

  password: string (hashed),

  role: 'client' | 'champion' | 'admin' | 'worker',- ✅ Upcoming events with locations

  profileImage?: string,

  totalPoints: number (default: 0),## 🚀 Deployment

  createdAt: Date,

  updatedAt: Date### Champion Dashboard

}

```- ✅ Pending reports with photo evidence### Vercel (Recommended)



### Report Model- ✅ One-click verify/reject actions1. Push your code to GitHub

```typescript

{- ✅ Event creation with map picker2. Import project to Vercel

  _id: ObjectId,

  userId: ObjectId (ref: User),- ✅ Analytics and statistics3. Add environment variables

  type: 'plastic' | 'cardboard' | 'e-waste' | 'metal' | 'glass' | 'organic' | 'paper',

  weightKg: number,4. Deploy!

  status: 'pending' | 'verified' | 'rejected',

  pointsAwarded: number,## 🔒 Security

  imageUrl?: string,

  aiClassification?: {### Other Platforms

    type: string,

    confidence: number,- ✅ Password hashing (bcrypt with 10 rounds)The app can be deployed to any platform that supports Next.js:

    description: string

  },- ✅ JWT authentication (7-day expiry)- Netlify

  location?: {

    latitude: number,- ✅ Protected API routes- Railway

    longitude: number,

    address: string- ✅ Role-based authorization- AWS Amplify

  },

  date: Date,- ✅ Input validation & sanitization- DigitalOcean App Platform

  createdAt: Date,

  updatedAt: Date- ✅ Secure image uploads (Cloudinary)

}

```## 📊 Database Schema



### Job Model## 🎨 Design System

```typescript

{### Users Collection

  _id: ObjectId,

  clientId: ObjectId (ref: User),### Color Palette```typescript

  title: string,

  description: string,- **Primary**: Green (#10b981 - #047857){

  category: 'industry' | 'home' | 'other',

  location: {- **Success**: Bright green  name: string;

    address: string,

    coordinates?: { lat: number, lng: number }- **Warning**: Orange  email: string (unique);

  },

  wasteType: string[],- **Error**: Red  password: string (hashed);

  estimatedWeight?: number,

  status: 'pending' | 'verified' | 'rejected' | 'assigned' | 'in-progress' | 'completed',- **Neutral**: Gray scale  role: 'client' | 'champion';

  assignedWorkerId?: ObjectId,

  budget?: number,  totalPoints: number;

  urgency: 'low' | 'medium' | 'high',

  scheduledDate?: Date,### Components  createdAt: Date;

  adminNotes?: string,

  clientContact?: {All components use **Shadcn UI** for consistency:  updatedAt: Date;

    name: string,

    phone: string,- Button, Card, Input, Label}

    email: string

  },- Table, Badge, Dialog```

  images?: string[],

  createdAt: Date,- Tabs, Select, Textarea

  updatedAt: Date

}- Form components with validation### Reports Collection

```

```typescript

### Event Model

```typescript## 📦 Project Structure{

{

  _id: ObjectId,  userId: ObjectId (ref: User);

  championId: ObjectId (ref: User),

  title: string,```  type: string;

  description: string,

  location: string,wastenexus/  weightKg: number;

  coordinates?: {

    latitude: number,├── app/  status: 'pending' | 'verified' | 'rejected';

    longitude: number

  },│   ├── api/              # API routes  pointsAwarded: number;

  date: Date,

  images?: string[],│   │   ├── auth/         # Authentication  date: Date;

  participants: ObjectId[],

  status: 'upcoming' | 'ongoing' | 'completed',│   │   ├── reports/      # Waste reports  createdAt: Date;

  createdAt: Date,

  updatedAt: Date│   │   ├── events/       # Events management  updatedAt: Date;

}

```│   │   ├── upload/       # Image upload & AI}



### MarketplaceItem Model│   │   ├── leaderboard/  # Rankings```

```typescript

{│   │   └── user/         # User profile

  _id: ObjectId,

  title: string,│   ├── dashboard/### Events Collection

  description: string,

  category: string,│   │   ├── client/       # Client dashboard```typescript

  condition: 'Like New' | 'Good' | 'Fair' | 'Needs Repair',

  price: number,│   │   └── champion/     # Champion dashboard{

  images: string[],

  seller: ObjectId (ref: User),│   ├── layout.tsx        # Root layout with AuthProvider  championId: ObjectId (ref: User);

  status: 'pending' | 'approved' | 'rejected' | 'sold',

  buyer?: ObjectId,│   └── page.tsx          # Landing/auth page  title: string;

  location: {

    address: string,├── components/  description: string;

    city: string,

    state: string│   ├── ui/               # Shadcn components  location: string;

  },

  views: number,│   ├── Navbar.tsx        # Navigation  date: Date;

  favorites: ObjectId[],

  isNegotiable: boolean,│   ├── WasteReportForm.tsx  # AI-powered form  participants: ObjectId[];

  createdAt: Date,

  updatedAt: Date│   └── LocationPicker.tsx   # Google Maps picker  status: 'upcoming' | 'ongoing' | 'completed';

}

```├── contexts/  createdAt: Date;



---│   └── AuthContext.tsx   # Auth state  updatedAt: Date;



## 📡 API Documentation├── hooks/}



### Authentication│   └── useApi.ts         # API hook```



#### POST `/api/auth/signup`├── lib/

Register new user

│   ├── mongodb.ts        # Database connection## 🤝 Contributing

**Request:**

```json│   ├── auth.ts           # Auth utilities

{

  "name": "John Doe",│   ├── cloudinary.ts     # Image uploadContributions are welcome! Please feel free to submit a Pull Request.

  "email": "john@example.com",

  "password": "password123",│   ├── gemini.ts         # AI classification

  "role": "client"

}│   └── helpers.ts        # Utilities## 📝 License

```

└── models/

**Response:**

```json    ├── User.ts           # User schemaThis project is licensed under the MIT License.

{

  "message": "User created successfully",    ├── Report.ts         # Report schema (with image & location)

  "token": "jwt-token",

  "user": { "id": "...", "name": "John Doe", "role": "client" }    └── Event.ts          # Event schema (with coordinates)## 🙏 Acknowledgments

}

``````



#### POST `/api/auth/login`- Next.js team for the amazing framework

User login

## 🚀 Deployment- Shadcn for the beautiful UI components

**Request:**

```json- MongoDB for the database solution

{

  "email": "john@example.com",### Vercel (Recommended)- Vercel for hosting platform

  "password": "password123"

}```bash

```

# Push to GitHub## 📧 Contact

### Reports

git push origin main

#### POST `/api/reports`

Submit waste report (Client)For questions or feedback, please open an issue on GitHub.



**Headers:** `Authorization: Bearer <token>`# Deploy to Vercel



**Request:**vercel --prod---

```json

{```

  "type": "plastic",

  "weightKg": 5.5,**Built with ♻️ for a sustainable future**

  "imageUrl": "https://...",

  "location": {Environment variables are already configured in `.env.local`

    "latitude": 19.0760,

    "longitude": 72.8777,### MongoDB Atlas

    "address": "Mumbai"✅ Already connected to cloud database

  }- Cluster: WasteNexus

}- Database: wastenexus

```- Collections: users, reports, events



#### PUT `/api/reports/[id]/verify`## 📈 Performance

Verify report (Admin)

- ✅ Server-side rendering (SSR)

**Request:**- ✅ Optimized images (Next.js Image)

```json- ✅ API route caching

{- ✅ MongoDB indexing

  "action": "verify"- ✅ Lazy loading components

}- ✅ Code splitting

```

## 🧪 Testing

**Response:**

```json```bash

{# Type checking

  "message": "Report verified successfully",npm run lint

  "pointsAwarded": 82

}# Build check

```npm run build



### Jobs# Run tests (when added)

npm test

#### POST `/api/jobs````

Create job (Client)

## 🎓 Learn More

**Request:**

```json### Documentation Files

{- `QUICKSTART.md` - 5-minute setup guide

  "title": "Large Plastic Collection",- `DEVELOPMENT_ROADMAP.md` - Architecture details

  "description": "50kg plastic waste",- `IMPLEMENTATION_SUMMARY.md` - Feature checklist

  "category": "industry",

  "location": { "address": "Mumbai" },### External Resources

  "wasteType": ["plastic"],- [Next.js Docs](https://nextjs.org/docs)

  "urgency": "high"- [Gemini AI API](https://ai.google.dev/docs)

}- [Google Maps API](https://developers.google.com/maps)

```- [Cloudinary Docs](https://cloudinary.com/documentation)



#### PUT `/api/admin/jobs`## 🤝 Contributing

Verify job (Admin)

Contributions welcome! Please:

**Request:**1. Fork the repository

```json2. Create a feature branch

{3. Submit a pull request

  "jobId": "...",

  "status": "verified",## 📝 License

  "adminNotes": "Approved"

}MIT License - feel free to use for your projects!

```

## 👨‍💻 Developer

**Response:** Awards 25 points to client

**Sagar Suryakant Waghmare**

### Events- GitHub: [@SagarSuryakantWaghmare](https://github.com/SagarSuryakantWaghmare)

- Repository: [wastenexus](https://github.com/SagarSuryakantWaghmare/wastenexus)

#### POST `/api/events`

Create event (Champion)## 🌟 Key Highlights



**Request:**✨ **Production-Ready** - Fully functional with real database

```json🤖 **AI-Powered** - Google Gemini for smart classification

{📸 **Image Support** - Cloudinary for secure storage

  "title": "Beach Cleanup",🗺️ **Location Aware** - Google Maps integration

  "description": "Community cleanup drive",🏆 **Gamified** - Points, badges, and leaderboards

  "location": "Juhu Beach",🔒 **Secure** - Industry-standard authentication

  "date": "2025-02-15"📱 **Responsive** - Works on all devices

}♻️ **Eco-Friendly** - Making recycling fun!

```

---

**Response:** Awards 50 points to champion

**Built with ❤️ for a sustainable future** 🌍♻️

#### POST `/api/events/[id]/join`

Join event**Ready to make a difference? Start now!** 🚀


**Response:** Awards 20 points to user

### Marketplace

#### POST `/api/marketplace`
List item

**Request:**
```json
{
  "title": "Used Laptop",
  "category": "Electronics",
  "condition": "Good",
  "price": 15000,
  "images": ["https://..."]
}
```

#### PUT `/api/admin/marketplace/[id]/verify`
Approve item (Admin)

**Response:** Awards 30 points to seller

#### POST `/api/marketplace/[id]/buy`
Purchase item

**Response:** Awards 15 points to seller, 10 points to buyer

### Worker

#### POST `/api/worker/complete-report`
Complete collection (Worker)

**Request:**
```json
{
  "reportId": "..."
}
```

**Response:** Awards 15 points to worker

### Admin

#### GET `/api/admin/dashboard-stats`
Platform analytics

**Response:**
```json
{
  "totalUsers": 150,
  "totalReports": 500,
  "pendingVerifications": 25,
  "totalPoints": 45000
}
```

### Leaderboard

#### GET `/api/leaderboard`
Get top users

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "John Doe",
      "totalPoints": 1250
    }
  ]
}
```

---

## 🏆 Rewards & Points System

### Point Allocation

| Activity | Points | Description |
|----------|--------|-------------|
| **Waste Report Verified** | 10/kg × multiplier | Based on waste type |
| **Marketplace Approval** | 30 pts | When admin approves listing |
| **Marketplace Sale** | 15 pts (seller) | When item sells |
| **Marketplace Purchase** | 10 pts (buyer) | Sustainable shopping reward |
| **Job Verification** | 25 pts | When admin verifies job |
| **Event Creation** | 50 pts | Champion creates event |
| **Event Completion** | 40 pts | Admin marks event complete |
| **Join Event** | 20 pts | Participate in event |
| **Waste Collection** | 15 pts | Worker completes collection |
| **Worker Task** | 35 pts | Complete assigned task |
| **Worker Job** | 40 pts | Complete job assignment |

### Waste Type Multipliers

```typescript
{
  'e-waste': 2.0,      // 20 points/kg
  'plastic': 1.5,      // 15 points/kg
  'metal': 1.3,        // 13 points/kg
  'glass': 1.2,        // 12 points/kg
  'cardboard': 1.0,    // 10 points/kg
  'paper': 1.0,        // 10 points/kg
  'organic': 0.8       // 8 points/kg
}
```

### Reward Tiers

| Tier | Badge | Points | Benefits |
|------|-------|--------|----------|
| 🌱 Beginner | Seedling | 0-499 | Starting journey |
| 🥉 Bronze | Medal | 500-999 | Contributor |
| 🥈 Silver | Medal | 1,000-2,499 | Active participant |
| 🥇 Gold | Medal | 2,500-4,999 | Champion |
| 🏆 Platinum | Trophy | 5,000-9,999 | Elite |
| 💎 Diamond | Gem | 10,000+ | Leader |

---

## 🔒 Security

### Authentication
- JWT tokens with 7-day expiry
- bcrypt password hashing (10 rounds)
- Role-based access control
- Protected API routes

### Data Security
- MongoDB authentication
- Environment variable secrets
- Input validation
- XSS prevention
- Secure image uploads

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment for Production
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret
NEXTAUTH_URL=https://your-domain.com
```

### Other Platforms
- Netlify
- Railway
- DigitalOcean
- AWS

---

## 🐛 Troubleshooting

### Database Connection Error
- Check MONGODB_URI
- Verify MongoDB is running
- Whitelist IP in Atlas

### JWT Invalid
- Check JWT_SECRET matches
- Verify token in Authorization header

### Image Upload Failed
- Verify Cloudinary credentials
- Check file size (<10MB)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Commit Convention
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting
- `refactor:` code refactor

---

## 📚 Additional Docs

- [JOBS_SYSTEM_DOCUMENTATION.md](./JOBS_SYSTEM_DOCUMENTATION.md)
- [UI_UX_IMPROVEMENTS.md](./UI_UX_IMPROVEMENTS.md)
- [WORKER_EMAIL_QUICK_REFERENCE.md](./WORKER_EMAIL_QUICK_REFERENCE.md)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Google Gemini AI](https://ai.google.dev/)

---

## 📧 Contact

**Maintainer:** Sagar Suryakant Waghmare  
**GitHub:** [@SagarSuryakantWaghmare](https://github.com/SagarSuryakantWaghmare)

---

<div align="center">

## ⭐ Star Us!

If you find WasteNexus useful, give us a star!

**Built with 💚 for a sustainable future** 🌍♻️

**Making waste management accessible, engaging, and rewarding for everyone.**

[⬆ Back to Top](#-wastenexus---smart-waste-management-platform)

</div>
