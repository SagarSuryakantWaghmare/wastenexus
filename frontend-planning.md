# 🎨 WasteNexus Frontend Planning - SIH25060

## 🚀 **Frontend-First Development Strategy**
*Build a stunning, fully functional frontend with mock data, then integrate with backend APIs*

---

## 🎯 **Frontend Architecture Overview**

### **🔧 Tech Stack**
```
Frontend Core:
├── Next.js 14 (App Router + TypeScript)
├── Tailwind CSS + Shadcn/UI
├── Framer Motion (Animations)
├── React Hook Form (Forms)
├── Zustand (State Management)
├── React Query (Data Fetching)
└── Recharts (Analytics Charts)

UI/UX Libraries:
├── Lucide React (Icons)
├── React Hot Toast (Notifications)
├── React Dropzone (File Upload)
├── React Leaflet (Maps)
├── Lottie React (Animations)
└── React Confetti (Celebrations)

---

## 📱 **Application Structure**

### **🌐 Web Application Pages**
```
├── Landing Page (/)
├── Authentication (/sign-in, /sign-up)
├── Citizen Dashboard (/citizen)
│   ├── Training Modules (/citizen/training)
│   ├── Waste Reporting (/citizen/report)
│   ├── Green Credits (/citizen/credits)
│   ├── Certificates (/citizen/certificates)
│   └── Profile (/citizen/profile)
├── Worker Dashboard (/worker)
│   ├── Route Optimization (/worker/routes)
│   ├── Collection Tasks (/worker/collections)
│   ├── Safety Checklist (/worker/safety)
│   └── Performance (/worker/performance)
├── Admin Dashboard (/admin)
│   ├── Analytics (/admin/analytics)
│   ├── User Management (/admin/users)
│   ├── Reports (/admin/reports)
│   └── Settings (/admin/settings)
├── Green Champions (/champions)
│   ├── Area Monitoring (/champions/areas)
│   ├── Compliance Check (/champions/compliance)
│   └── Community (/champions/community)
└── Government Portal (/government)
    ├── City Overview (/government/overview)
    ├── Policy Tools (/government/policy)
    └── Audit Reports (/government/audit)
```

---

## 🎨 **Design System & Components**

### **🎭 Brand Identity**
```javascript
// Brand Colors
const brandColors = {
  primary: {
    50: '#f0fdf4',
    500: '#22c55e', // Main Green
    600: '#16a34a',
    900: '#14532d'
  },
  secondary: {
    50: '#eff6ff',
    500: '#3b82f6', // Main Blue
    600: '#2563eb',
    900: '#1e3a8a'
  },
  accent: {
    orange: '#f97316',
    yellow: '#eab308',
    purple: '#a855f7'
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4'
  }
};

// Typography
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  }
};
```

### **🧩 Component Library**

#### **1. Core Components**
```
├── ui/
│   ├── Button.tsx (Primary, Secondary, Outline, Ghost)
│   ├── Input.tsx (Text, Email, Phone, Search)
│   ├── Card.tsx (Default, Hover, Interactive)
│   ├── Badge.tsx (Status, Role, Achievement)
│   ├── Avatar.tsx (User, Initials, Image)
│   ├── Modal.tsx (Confirmation, Form, Gallery)
│   ├── Toast.tsx (Success, Error, Warning, Info)
│   ├── Loader.tsx (Spinner, Skeleton, Progress)
│   └── Dropdown.tsx (Menu, Select, Filter)
```

#### **2. Layout Components**
```
├── layout/
│   ├── Navbar.tsx (Fixed, Transparent, Authenticated)
│   ├── Sidebar.tsx (Collapsible, Role-based)
│   ├── Footer.tsx (Links, Social, Newsletter)
│   ├── Container.tsx (Max-width, Padding)
│   └── Grid.tsx (Responsive, Auto-fit)
```

#### **3. Feature Components**
```
├── features/
│   ├── TrainingCard.tsx
│   ├── WasteTypeSelector.tsx
│   ├── LocationPicker.tsx
│   ├── PhotoUpload.tsx
│   ├── ProgressBar.tsx
│   ├── ScoreDisplay.tsx
│   ├── MapView.tsx
│   ├── ChatBot.tsx
│   └── Gamification.tsx
```

---

## 📅 **14-Day Frontend Development Plan**

### **🚀 Phase 1: Foundation (Days 1-3)**

#### **Day 1: Project Setup & Design System**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up Tailwind CSS and Shadcn/UI
- [ ] Create design tokens and theme configuration
- [ ] Set up component library structure
- [ ] Implement responsive layout system

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#22c55e',
          secondary: '#3b82f6',
          accent: '#f97316'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
```

#### **Day 2: Core Components & Layout**
- [ ] Build reusable UI components
- [ ] Create responsive navigation system
- [ ] Implement authentication layouts
- [ ] Set up routing structure
- [ ] Add loading states and error boundaries

```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';
  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-green-600 focus:ring-green-500',
    secondary: 'bg-brand-secondary text-white hover:bg-blue-600 focus:ring-blue-500',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-green-50',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
      {children}
    </button>
  );
};
```

#### **Day 3: State Management & Mock Data**
- [ ] Set up Zustand for global state
- [ ] Create mock data for all features
- [ ] Implement React Query for data fetching
- [ ] Set up form validation with React Hook Form
- [ ] Create custom hooks for common functionality

```typescript
// store/useStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'worker' | 'admin' | 'green_champion';
  trainingProgress: number;
  greenCredits: number;
}

interface Store {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  addNotification: (notification: Notification) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  isAuthenticated: false,
  theme: 'light',
  notifications: [],
  
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  addNotification: (notification) => set((state) => ({ 
    notifications: [...state.notifications, notification] 
  }))
}));
```

### **🎓 Phase 2: User Interfaces (Days 4-8)**

#### **Day 4: Landing Page & Authentication**
- [ ] Build stunning hero section with animations
- [ ] Create feature showcase with interactive cards
- [ ] Implement problem/solution sections
- [ ] Add testimonials and statistics
- [ ] Build sign-in/sign-up flows with validation

```typescript
// pages/index.tsx - Landing Page
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

// components/HeroSection.tsx
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-50 to-blue-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 text-center"
      >
        <h1 className="text-6xl font-bold mb-6">
          Transform India with{' '}
          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Smart Waste Management
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          AI-powered waste management system ensuring 100% citizen training, 
          complete transparency, and environmental sustainability.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Start Training</Button>
          <Button variant="outline" size="lg">Watch Demo</Button>
        </div>
      </motion.div>
    </section>
  );
};
```

#### **Day 5: Citizen Dashboard & Training**
- [ ] Build citizen dashboard with cards
- [ ] Create training module interface
- [ ] Implement interactive quiz components
- [ ] Add progress tracking and achievements
- [ ] Build certificate display system

```typescript
// pages/citizen/dashboard.tsx
const CitizenDashboard = () => {
  const mockUser = {
    name: "Rahul Sharma",
    trainingProgress: 75,
    greenCredits: 450,
    nextCollection: "Tomorrow, 9:00 AM",
    certificates: 3,
    recentActivity: []
  };

  return (
    <div className="p-6 space-y-6">
      <WelcomeCard user={mockUser} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Training Progress" 
          value={`${mockUser.trainingProgress}%`}
          icon={<GraduationCap />}
          color="green"
        />
        <StatCard 
          title="Green Credits" 
          value={mockUser.greenCredits}
          icon={<Coins />}
          color="yellow"
        />
        <StatCard 
          title="Certificates" 
          value={mockUser.certificates}
          icon={<Award />}
          color="blue"
        />
        <StatCard 
          title="Next Collection" 
          value={mockUser.nextCollection}
          icon={<Truck />}
          color="purple"
        />
      </div>
      <QuickActions />
      <RecentActivity activities={mockUser.recentActivity} />
    </div>
  );
};
```

#### **Day 6: Waste Reporting & Collection**
- [ ] Build waste reporting form with photo upload
- [ ] Create location picker with map integration
- [ ] Implement waste type selector
- [ ] Add collection scheduling interface
- [ ] Build tracking and status display

```typescript
// components/WasteReporting.tsx
const WasteReportingForm = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Report Waste Issue</h2>
      
      <form className="space-y-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Photos</label>
          <PhotoUploadZone 
            photos={photos}
            onPhotosChange={setPhotos}
            maxFiles={5}
          />
        </div>

        {/* Location Picker */}
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <LocationPicker 
            location={location}
            onLocationChange={setLocation}
          />
        </div>

        {/* Waste Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Waste Types</label>
          <WasteTypeSelector 
            selectedTypes={wasteTypes}
            onTypesChange={setWasteTypes}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea 
            className="w-full p-3 border rounded-lg"
            rows={4}
            placeholder="Describe the waste issue..."
          />
        </div>

        <Button className="w-full" size="lg">
          Submit Report
        </Button>
      </form>
    </Card>
  );
};
```

#### **Day 7: Worker Dashboard & Route Management**
- [ ] Build worker dashboard with today's tasks
- [ ] Create route optimization display
- [ ] Implement collection checklist
- [ ] Add safety protocol interface
- [ ] Build performance metrics display

#### **Day 8: Admin Dashboard & Analytics**
- [ ] Build comprehensive admin dashboard
- [ ] Create real-time monitoring interface
- [ ] Implement analytics charts and graphs
- [ ] Add user management interface
- [ ] Build report generation tools

### **📊 Phase 3: Advanced Features (Days 9-11)**

#### **Day 9: Green Champions & Community**
- [ ] Build community features interface
- [ ] Create area monitoring tools
- [ ] Implement leaderboards and rankings
- [ ] Add social features and challenges
- [ ] Build compliance checking tools

#### **Day 10: Government Portal & Reporting**
- [ ] Build government overview dashboard
- [ ] Create policy management interface
- [ ] Implement audit and compliance tools
- [ ] Add city-wide analytics
- [ ] Build export and reporting features

#### **Day 11: Gamification & Rewards**
- [ ] Implement achievement system
- [ ] Create interactive reward interface
- [ ] Build social sharing features
- [ ] Add celebration animations
- [ ] Implement progress visualization

### **📱 Phase 4: Mobile & Polish (Days 12-14)**

#### **Day 12: Mobile App Development**
- [ ] Set up React Native project
- [ ] Create mobile navigation
- [ ] Build key mobile screens
- [ ] Implement camera integration
- [ ] Add push notification setup

#### **Day 13: Animations & Interactions**
- [ ] Add Framer Motion animations
- [ ] Implement micro-interactions
- [ ] Create loading animations
- [ ] Add success celebrations
- [ ] Polish user experience

#### **Day 14: Testing & Optimization**
- [ ] Test all user flows
- [ ] Optimize performance
- [ ] Add error handling
- [ ] Test responsive design
- [ ] Prepare for demo

---

## 🎨 **UI/UX Design Principles**

### **🎯 User Experience Guidelines**
```javascript
const uxPrinciples = {
  accessibility: 'WCAG 2.1 AA compliance',
  performance: 'Core Web Vitals optimization',
  mobile: 'Mobile-first responsive design',
  intuitive: 'Maximum 3 clicks to any feature',
  feedback: 'Immediate visual feedback for all actions',
  consistency: 'Unified design language across all interfaces'
};
```

### **🎨 Visual Design Rules**
- **Color Psychology**: Green for success/environment, Blue for trust/technology
- **Typography**: Clear hierarchy with Inter font family
- **Spacing**: 8px grid system for consistent layouts
- **Icons**: Lucide React for consistent iconography
- **Animations**: Subtle, purposeful motion design
- **Images**: High-quality, diverse, relatable imagery

---

## 📱 **Mobile App Screens**

### **Citizen App**
```
├── Onboarding (3 screens)
├── Authentication
├── Dashboard
├── Training Modules
├── Waste Reporting
├── Camera Integration
├── Location Services
├── Green Credits Wallet
├── Achievements
├── Community Features
├── Notifications
└── Profile Management
```

### **Worker App**
```
├── Login/Authentication
├── Daily Dashboard
├── Route Navigation
├── Collection Tasks
├── Safety Checklist
├── Photo Documentation
├── Status Updates
├── Performance Metrics
├── Emergency Features
└── Communication Tools
```

---

## 🔧 **Development Tools & Setup**

### **Development Environment**
```bash
# Project initialization
npx create-next-app@latest wastenexus-frontend --typescript --tailwind --app
cd wastenexus-frontend

# Core dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install lucide-react react-hook-form @hookform/resolvers/zod zod
npm install framer-motion zustand @tanstack/react-query
npm install react-hot-toast react-dropzone leaflet react-leaflet

# Development dependencies
npm install -D @types/leaflet prettier eslint-config-prettier
npm install -D husky lint-staged @typescript-eslint/eslint-plugin
```

### **Project Structure**
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── citizen/           # Citizen dashboard
│   ├── worker/            # Worker interface
│   ├── admin/             # Admin panel
│   └── government/        # Government portal
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── features/         # Feature-specific components
│   └── forms/            # Form components
├── lib/                  # Utilities and configurations
├── hooks/               # Custom React hooks
├── store/               # Zustand store
├── types/               # TypeScript type definitions
├── data/                # Mock data for development
└── styles/              # Global styles
```

---

## 🚀 **Mock Data Strategy**

### **Sample Data Structure**
```typescript
// data/mockData.ts
export const mockUsers = {
  citizen: {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    role: 'citizen',
    trainingProgress: 75,
    greenCredits: 450,
    certificatesEarned: 3,
    address: {
      street: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    }
  }
};

export const mockTrainingModules = [
  {
    id: '1',
    title: 'Waste Segregation Basics',
    description: 'Learn the fundamentals of proper waste segregation',
    duration: 30,
    progress: 100,
    status: 'completed',
    lessons: [
      { id: '1', title: 'Introduction to Waste Types', type: 'video', duration: 5 },
      { id: '2', title: 'Segregation Techniques', type: 'interactive', duration: 10 },
      { id: '3', title: 'Common Mistakes', type: 'quiz', duration: 5 }
    ]
  }
];

export const mockWasteReports = [
  {
    id: '1',
    location: { lat: 12.9716, lng: 77.5946 },
    photos: ['/mock-waste-1.jpg'],
    wasteTypes: ['plastic', 'organic'],
    description: 'Overflowing bins near bus stop',
    status: 'reported',
    reportedAt: new Date(),
    citizenId: '1'
  }
];
```

---

## 🎯 **Demo Preparation Strategy**

### **Demo Flow for SIH Judges**
1. **Landing Page**: Show impressive design and features
2. **Citizen Registration**: Demonstrate easy onboarding
3. **Training Module**: Interactive learning experience
4. **Waste Reporting**: Photo upload and AI classification
5. **Worker Dashboard**: Route optimization display
6. **Admin Analytics**: Real-time monitoring and insights
7. **Mobile App**: Cross-platform functionality

### **Key Demo Features**
- Smooth animations and transitions
- Responsive design on multiple devices
- Interactive elements and feedback
- Real-time data visualization
- Professional UI/UX design
- Government-grade functionality

---

This comprehensive frontend planning ensures we build a stunning, fully functional interface that will impress SIH judges before integrating any backend! 🏆

Ready to start building? Let's begin with Day 1! 🚀