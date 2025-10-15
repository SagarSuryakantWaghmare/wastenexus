# 🌱 Waste Nexus - Gamified Waste Management Platform# 🌱 Waste Nexus - Gamified Waste Management Platform



A modern, full-stack waste management application built with Next.js 15, featuring **AI-powered waste classification**, **real-time leaderboards**, and **community-driven** waste collection events.A modern, full-stack waste management platform that gamifies recycling and waste collection. Built with Next.js 15, MongoDB, and a clean green-themed UI.



## ✨ New Features Added## 🚀 Features



### 🤖 AI-Powered Features### For Clients (Users)

- **Google Gemini AI Integration**: Automatic waste type classification from uploaded images- **Waste Reporting**: Submit waste collection reports with type and weight

- **Smart Waste Detection**: AI analyzes images and provides confidence scores, descriptions, and recycling suggestions- **Points System**: Earn points based on waste type and weight (verified by Champions)

- **Intelligent Insights**: AI-generated recommendations based on your waste patterns- **Live Leaderboard**: Compete with other users and track your rank

- **Rewards & Badges**: Unlock tiers (Beginner, Bronze, Silver, Gold, Platinum, Diamond)

### 📸 Image Upload & Management- **Event Discovery**: View and join upcoming community waste collection events

- **Cloudinary Integration**: Secure cloud storage for waste report images- **Dashboard**: Track all your submissions and their verification status

- **Visual Verification**: Champions can review actual images before approving reports

- **Image Preview**: Real-time preview before submission### For Champions (Admins)

- **Report Verification**: Review and verify/reject client submissions

### 🗺️ Location Services- **Event Management**: Create and organize waste collection campaigns

- **Google Maps Integration**: Interactive map for selecting exact waste locations- **Analytics Dashboard**: View pending reports, total events, and participant counts

- **Auto-Location Detection**: One-click "Use Current Location" feature- **Real-time Processing**: Instant point allocation upon verification

- **Geocoding**: Automatic address resolution from coordinates

- **Event Location Mapping**: Visual location picker for creating events## 🛠️ Tech Stack



## 🎯 Complete Feature Set### Frontend

- **Next.js 15** (App Router, Server Components, API Routes)

### For Clients (Users)- **React 19** with TypeScript

- 📸 Upload waste images for AI classification- **Tailwind CSS 4** for styling

- 📍 Pin-point waste locations on interactive map- **Shadcn UI** for components

- 🏆 Earn points based on waste type and weight- **Lucide React** for icons

- 🎖️ Unlock achievement badges (6 tiers)

- 📊 Personal dashboard with stats### Backend

- 📅 Browse upcoming waste collection events- **Next.js API Routes** (serverless functions)

- 🌟 Real-time leaderboard rankings- **MongoDB** with Mongoose ODM

- **JWT** for authentication

### For Champions (Officials)- **bcryptjs** for password hashing

- ✅ Review reports with photo evidence

- 🗺️ Create events with map-based location picker### Key Features

- 📈 Monitor pending verifications- Server-side rendering (SSR)

- 👥 Track event participation- Client-side state management with React Context

- 🎯 Dashboard analytics- RESTful API design

- Role-based access control

## 🛠️ Technology Stack- Real-time data updates



### Core Technologies## 📦 Installation

- **Next.js 15** + **React 19** - Latest framework features

- **TypeScript** - Type-safe development### Prerequisites

- **Tailwind CSS 4** - Modern styling- Node.js 18+ and npm

- **Shadcn UI** - Beautiful components- MongoDB (local or Atlas cloud)



### AI & Cloud Services### Setup Steps

- **Google Gemini AI** - Waste classification & insights

- **Cloudinary** - Image upload & management1. **Clone the repository**

- **Google Maps API** - Location services   ```bash

   git clone https://github.com/yourusername/wastenexus.git

### Database & Auth   cd wastenexus

- **MongoDB Atlas** - Cloud database   ```

- **Mongoose** - ODM

- **JWT** + **Bcrypt** - Secure authentication2. **Install dependencies**

   ```bash

## 🚀 Quick Start   npm install

   ```

### Prerequisites

All API keys and services are already configured in your `.env.local`:3. **Configure environment variables**

- ✅ MongoDB Atlas (Connected)   ```bash

- ✅ Cloudinary (Ready)   cp .env.example .env.local

- ✅ Google Gemini AI (Configured)   ```

- ✅ Google Maps API (Active)

   Edit `.env.local` with your configuration:

### Installation   ```env

   MONGODB_URI=mongodb://localhost:27017/wastenexus

```bash   NEXTAUTH_URL=http://localhost:3000

# Install dependencies   NEXTAUTH_SECRET=your-super-secret-key-change-this

npm install   JWT_SECRET=your-jwt-secret-change-this

   ```

# Run development server

npm run dev4. **Start MongoDB** (if using local)

```   ```bash

   mongod

Visit **http://localhost:3000** 🎉   ```



### First Time Usage5. **Run the development server**

   ```bash

1. **Create a Client Account**   npm run dev

   - Email: `test@client.com`   ```

   - Password: `password123`

   - Role: **Client**6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

2. **Submit Your First Report**

   - Upload a waste image## 📁 Project Structure

   - AI will auto-classify it

   - Select location on map```

   - Enter weightwastenexus/

   - Submit!├── app/

│   ├── api/                    # API Routes

3. **Create a Champion Account**│   │   ├── auth/              # Authentication endpoints

   - Email: `test@champion.com`│   │   ├── reports/           # Report CRUD & verification

   - Password: `password123`│   │   ├── events/            # Event management

   - Role: **Champion**│   │   ├── leaderboard/       # Leaderboard data

│   │   └── user/              # User profile

4. **Verify the Report**│   ├── dashboard/

   - Review the image│   │   ├── client/            # Client dashboard

   - Check AI classification│   │   └── champion/          # Champion dashboard

   - Approve or reject│   ├── layout.tsx             # Root layout with AuthProvider

   - Points awarded automatically!│   ├── page.tsx               # Landing page with auth

│   └── globals.css            # Global styles

## 📊 Point System├── components/

│   ├── ui/                    # Shadcn UI components

| Waste Type | Points/kg | Best For |│   └── Navbar.tsx             # Navigation component

|-----------|-----------|----------|├── contexts/

| E-Waste 🖥️ | 20 | Electronics, batteries |│   └── AuthContext.tsx        # Authentication context

| Plastic 🥤 | 15 | Bottles, containers |├── hooks/

| Metal 🔩 | 13 | Cans, wires |│   └── useApi.ts              # API call hook

| Glass 🍾 | 12 | Bottles, jars |├── lib/

| Cardboard 📦 | 10 | Boxes, packaging |│   ├── mongodb.ts             # Database connection

| Paper 📄 | 10 | Documents, newspapers |│   ├── auth.ts                # Auth utilities

| Organic 🍃 | 8 | Food waste, leaves |│   ├── helpers.ts             # Helper functions

│   └── utils.ts               # Utility functions

## 🏆 Achievement System├── models/

│   ├── User.ts                # User schema

Progress through 6 reward tiers:│   ├── Report.ts              # Report schema

│   └── Event.ts               # Event schema

```└── .env.local                 # Environment variables

🌱 Beginner    →    0-499 pts```

🥉 Bronze      →    500-999 pts

🥈 Silver      →    1,000-2,499 pts## 🔑 API Endpoints

🥇 Gold        →    2,500-4,999 pts

🏆 Platinum    →    5,000-9,999 pts### Authentication

💎 Diamond     →    10,000+ pts- `POST /api/auth/signup` - Register new user

```- `POST /api/auth/login` - User login



## 🔌 API Documentation### Reports

- `POST /api/reports` - Submit new report (Client)

### Upload & AI Classification- `GET /api/reports` - Get reports (filtered by role)

```typescript- `PUT /api/reports/[id]/verify` - Verify/reject report (Champion)

POST /api/upload

Content-Type: multipart/form-data### Events

Authorization: Bearer <token>- `POST /api/events` - Create event (Champion)

- `GET /api/events` - Get all events

Body: { image: File }

### Leaderboard

Response: {- `GET /api/leaderboard` - Get top users

  imageUrl: string;

  classification: {### User

    type: string;- `GET /api/user` - Get current user profile

    confidence: number;

    description: string;## 🎮 Usage

    recyclable: boolean;

    suggestions: string[];### Creating a Client Account

  }1. Navigate to the homepage

}2. Click "Sign Up"

```3. Select "Client" role

4. Fill in your details

### Submit Report with Image & Location5. Submit waste reports and earn points!

```typescript

POST /api/reports### Creating a Champion Account

Authorization: Bearer <token>1. Navigate to the homepage

2. Click "Sign Up"

Body: {3. Select "Champion" role

  type: string;4. Fill in your details

  weightKg: number;5. Verify reports and create events!

  imageUrl?: string;

  aiClassification?: object;### Points System

  location?: {- Plastic: 15 points/kg

    latitude: number;- E-Waste: 20 points/kg

    longitude: number;- Metal: 13 points/kg

    address: string;- Glass: 12 points/kg

  }- Cardboard: 10 points/kg

}- Paper: 10 points/kg

```- Organic: 8 points/kg



### Create Event with Location### Reward Tiers

```typescript- 🌱 Beginner: 0-499 points

POST /api/events- 🥉 Bronze: 500-999 points

Authorization: Bearer <token>- 🥈 Silver: 1,000-2,499 points

- 🥇 Gold: 2,500-4,999 points

Body: {- 🏆 Platinum: 5,000-9,999 points

  title: string;- 💎 Diamond: 10,000+ points

  description: string;

  location: string;## 🔒 Security Features

  coordinates?: {

    latitude: number;- Password hashing with bcryptjs

    longitude: number;- JWT token-based authentication

  };- Role-based access control

  date: Date;- Protected API routes

}- Client-side route protection

```- Input validation and sanitization



## 📱 Screenshots & Features## 🎨 Design Philosophy



### Client Dashboard- **Green Theme**: Consistent eco-friendly color palette

- ✅ AI-powered waste report form with image upload- **Clean UI**: Modern, minimalist interface

- ✅ Interactive Google Maps location picker- **Responsive**: Mobile-first design approach

- ✅ Visual report history with thumbnails- **Accessible**: WCAG-compliant components

- ✅ Real-time points and leaderboard- **Fast**: Optimized performance with Next.js 15

- ✅ Upcoming events with locations

## 🚀 Deployment

### Champion Dashboard

- ✅ Pending reports with photo evidence### Vercel (Recommended)

- ✅ One-click verify/reject actions1. Push your code to GitHub

- ✅ Event creation with map picker2. Import project to Vercel

- ✅ Analytics and statistics3. Add environment variables

4. Deploy!

## 🔒 Security

### Other Platforms

- ✅ Password hashing (bcrypt with 10 rounds)The app can be deployed to any platform that supports Next.js:

- ✅ JWT authentication (7-day expiry)- Netlify

- ✅ Protected API routes- Railway

- ✅ Role-based authorization- AWS Amplify

- ✅ Input validation & sanitization- DigitalOcean App Platform

- ✅ Secure image uploads (Cloudinary)

## 📊 Database Schema

## 🎨 Design System

### Users Collection

### Color Palette```typescript

- **Primary**: Green (#10b981 - #047857){

- **Success**: Bright green  name: string;

- **Warning**: Orange  email: string (unique);

- **Error**: Red  password: string (hashed);

- **Neutral**: Gray scale  role: 'client' | 'champion';

  totalPoints: number;

### Components  createdAt: Date;

All components use **Shadcn UI** for consistency:  updatedAt: Date;

- Button, Card, Input, Label}

- Table, Badge, Dialog```

- Tabs, Select, Textarea

- Form components with validation### Reports Collection

```typescript

## 📦 Project Structure{

  userId: ObjectId (ref: User);

```  type: string;

wastenexus/  weightKg: number;

├── app/  status: 'pending' | 'verified' | 'rejected';

│   ├── api/              # API routes  pointsAwarded: number;

│   │   ├── auth/         # Authentication  date: Date;

│   │   ├── reports/      # Waste reports  createdAt: Date;

│   │   ├── events/       # Events management  updatedAt: Date;

│   │   ├── upload/       # Image upload & AI}

│   │   ├── leaderboard/  # Rankings```

│   │   └── user/         # User profile

│   ├── dashboard/### Events Collection

│   │   ├── client/       # Client dashboard```typescript

│   │   └── champion/     # Champion dashboard{

│   ├── layout.tsx        # Root layout with AuthProvider  championId: ObjectId (ref: User);

│   └── page.tsx          # Landing/auth page  title: string;

├── components/  description: string;

│   ├── ui/               # Shadcn components  location: string;

│   ├── Navbar.tsx        # Navigation  date: Date;

│   ├── WasteReportForm.tsx  # AI-powered form  participants: ObjectId[];

│   └── LocationPicker.tsx   # Google Maps picker  status: 'upcoming' | 'ongoing' | 'completed';

├── contexts/  createdAt: Date;

│   └── AuthContext.tsx   # Auth state  updatedAt: Date;

├── hooks/}

│   └── useApi.ts         # API hook```

├── lib/

│   ├── mongodb.ts        # Database connection## 🤝 Contributing

│   ├── auth.ts           # Auth utilities

│   ├── cloudinary.ts     # Image uploadContributions are welcome! Please feel free to submit a Pull Request.

│   ├── gemini.ts         # AI classification

│   └── helpers.ts        # Utilities## 📝 License

└── models/

    ├── User.ts           # User schemaThis project is licensed under the MIT License.

    ├── Report.ts         # Report schema (with image & location)

    └── Event.ts          # Event schema (with coordinates)## 🙏 Acknowledgments

```

- Next.js team for the amazing framework

## 🚀 Deployment- Shadcn for the beautiful UI components

- MongoDB for the database solution

### Vercel (Recommended)- Vercel for hosting platform

```bash

# Push to GitHub## 📧 Contact

git push origin main

For questions or feedback, please open an issue on GitHub.

# Deploy to Vercel

vercel --prod---

```

**Built with ♻️ for a sustainable future**

Environment variables are already configured in `.env.local`

### MongoDB Atlas
✅ Already connected to cloud database
- Cluster: WasteNexus
- Database: wastenexus
- Collections: users, reports, events

## 📈 Performance

- ✅ Server-side rendering (SSR)
- ✅ Optimized images (Next.js Image)
- ✅ API route caching
- ✅ MongoDB indexing
- ✅ Lazy loading components
- ✅ Code splitting

## 🧪 Testing

```bash
# Type checking
npm run lint

# Build check
npm run build

# Run tests (when added)
npm test
```

## 🎓 Learn More

### Documentation Files
- `QUICKSTART.md` - 5-minute setup guide
- `DEVELOPMENT_ROADMAP.md` - Architecture details
- `IMPLEMENTATION_SUMMARY.md` - Feature checklist

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Gemini AI API](https://ai.google.dev/docs)
- [Google Maps API](https://developers.google.com/maps)
- [Cloudinary Docs](https://cloudinary.com/documentation)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📝 License

MIT License - feel free to use for your projects!

## 👨‍💻 Developer

**Sagar Suryakant Waghmare**
- GitHub: [@SagarSuryakantWaghmare](https://github.com/SagarSuryakantWaghmare)
- Repository: [wastenexus](https://github.com/SagarSuryakantWaghmare/wastenexus)

## 🌟 Key Highlights

✨ **Production-Ready** - Fully functional with real database
🤖 **AI-Powered** - Google Gemini for smart classification
📸 **Image Support** - Cloudinary for secure storage
🗺️ **Location Aware** - Google Maps integration
🏆 **Gamified** - Points, badges, and leaderboards
🔒 **Secure** - Industry-standard authentication
📱 **Responsive** - Works on all devices
♻️ **Eco-Friendly** - Making recycling fun!

---

**Built with ❤️ for a sustainable future** 🌍♻️

**Ready to make a difference? Start now!** 🚀
