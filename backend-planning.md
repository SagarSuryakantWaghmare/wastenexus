# 🔧 WasteNexus Backend Planning - SIH25060 (Convex)

## 🚀 **Backend-First Development Strategy**
*Build a robust, scalable backend with Convex for real-time data, authentication, and seamless frontend integration*

---

## 🎯 **Backend Architecture Overview**

### **🔧 Tech Stack**
```
Backend Core:
├── Convex (Real-time Database + Functions)
├── TypeScript (Type Safety)
├── Convex Auth (Authentication)
├── File Storage (Convex File Storage)
├── Real-time Subscriptions
├── Scheduled Functions (Cron Jobs)
└── Server-side Validation (Zod)

Integrations:
├── AI/ML APIs (Waste Classification)
├── Maps API (Google Maps/MapBox)
├── SMS/Email Services (Twilio/SendGrid)
├── Push Notifications (Firebase)
├── Payment Gateway (Razorpay)
├── Government APIs
└── Weather API

External Services:
├── Image Processing (Cloudinary)
├── PDF Generation (Puppeteer)
├── Analytics (Custom Dashboard)
├── Monitoring (Convex Dashboard)
├── Backup & Recovery (Convex)
└── Security (Rate Limiting, Validation)
```

### **🏗️ Convex Project Structure**
```
convex/
├── schema.ts                 # Database schema definitions
├── auth.config.ts           # Authentication configuration
├── _generated/              # Auto-generated types
├── functions/               # Server functions
│   ├── users.ts            # User management
│   ├── training.ts         # Training modules
│   ├── reports.ts          # Waste reports
│   ├── collections.ts      # Collection management
│   ├── analytics.ts        # Analytics & insights
│   ├── notifications.ts    # Push notifications
│   ├── payments.ts         # Payment processing
│   └── admin.ts            # Admin functions
├── mutations/               # Data mutations
├── queries/                # Data queries
├── actions/                # External API calls
├── crons/                  # Scheduled functions
├── lib/                    # Utility functions
└── validators/             # Input validation
```

---

## 📊 **Database Schema Design**

### **🗃️ Core Tables Schema**
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - Central user management
  users: defineTable({
    // Basic Info
    clerkId: v.string(), // Clerk authentication ID
    email: v.string(),
    phone: v.optional(v.string()),
    name: v.string(),
    avatar: v.optional(v.string()),
    
    // Role & Status
    role: v.union(
      v.literal("citizen"),
      v.literal("worker"), 
      v.literal("green_champion"),
      v.literal("admin"),
      v.literal("government")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("pending"),
      v.literal("suspended"),
      v.literal("blocked")
    ),
    
    // Location
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      coordinates: v.object({
        lat: v.number(),
        lng: v.number()
      })
    }),
    
    // Progress & Achievements
    trainingProgress: v.number(), // Percentage completed
    greenCredits: v.number(),
    totalPoints: v.number(),
    level: v.number(),
    badges: v.array(v.string()), // Badge IDs
    certificates: v.array(v.string()), // Certificate IDs
    
    // Settings
    preferences: v.object({
      notifications: v.object({
        email: v.boolean(),
        sms: v.boolean(),
        push: v.boolean()
      }),
      language: v.string(),
      theme: v.union(v.literal("light"), v.literal("dark"))
    }),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    onboardingCompleted: v.boolean()
  })
  .index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"])
  .index("by_role", ["role"])
  .index("by_status", ["status"])
  .index("by_city", ["address.city"]),

  // Training Modules
  trainingModules: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "basic", "advanced", "specialized"
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    duration: v.number(), // minutes
    order: v.number(), // Display order
    
    // Content
    lessons: v.array(v.object({
      id: v.string(),
      title: v.string(),
      type: v.union(v.literal("video"), v.literal("text"), v.literal("quiz"), v.literal("interactive")),
      content: v.string(), // URL or content
      duration: v.number(),
      order: v.number()
    })),
    
    // Requirements & Rewards
    prerequisites: v.array(v.string()), // Module IDs
    completionCriteria: v.object({
      minScore: v.number(),
      requiredLessons: v.array(v.string())
    }),
    rewards: v.object({
      points: v.number(),
      credits: v.number(),
      badge: v.optional(v.string()),
      certificate: v.optional(v.string())
    }),
    
    // Metadata
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(), // Admin user ID
    
    // Analytics
    totalEnrollments: v.number(),
    completionRate: v.number(),
    averageScore: v.number()
  })
  .index("by_category", ["category"])
  .index("by_difficulty", ["difficulty"])
  .index("by_order", ["order"]),

  // User Training Progress
  userTrainingProgress: defineTable({
    userId: v.id("users"),
    moduleId: v.id("trainingModules"),
    
    // Progress Tracking
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"), 
      v.literal("completed"),
      v.literal("failed")
    ),
    progressPercentage: v.number(),
    currentLesson: v.optional(v.string()),
    
    // Lesson Progress
    lessonProgress: v.array(v.object({
      lessonId: v.string(),
      status: v.union(v.literal("completed"), v.literal("in_progress"), v.literal("locked")),
      score: v.optional(v.number()),
      attempts: v.number(),
      timeSpent: v.number(), // seconds
      completedAt: v.optional(v.number())
    })),
    
    // Completion Data
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    finalScore: v.optional(v.number()),
    attempts: v.number(),
    totalTimeSpent: v.number(), // seconds
    
    // Rewards Claimed
    pointsEarned: v.number(),
    creditsEarned: v.number(),
    badgeEarned: v.optional(v.string()),
    certificateEarned: v.optional(v.string())
  })
  .index("by_user", ["userId"])
  .index("by_module", ["moduleId"])
  .index("by_user_module", ["userId", "moduleId"])
  .index("by_status", ["status"]),

  // Waste Reports
  wasteReports: defineTable({
    // Reporter Info
    reporterId: v.id("users"),
    reporterName: v.string(),
    reporterPhone: v.string(),
    
    // Location Data
    location: v.object({
      coordinates: v.object({
        lat: v.number(),
        lng: v.number()
      }),
      address: v.string(),
      landmark: v.optional(v.string()),
      ward: v.optional(v.string()),
      zone: v.optional(v.string())
    }),
    
    // Waste Details
    wasteTypes: v.array(v.string()), // ["plastic", "organic", "electronic", etc.]
    quantity: v.object({
      estimate: v.string(), // "small", "medium", "large", "very_large"
      weight: v.optional(v.number()) // kg
    }),
    description: v.string(),
    urgency: v.union(
      v.literal("low"),
      v.literal("medium"), 
      v.literal("high"),
      v.literal("critical")
    ),
    
    // Media
    photos: v.array(v.string()), // File storage IDs
    videos: v.optional(v.array(v.string())),
    
    // AI Classification
    aiClassification: v.optional(v.object({
      detectedTypes: v.array(v.string()),
      confidence: v.number(),
      processedAt: v.number(),
      model: v.string()
    })),
    
    // Status & Assignment
    status: v.union(
      v.literal("reported"),
      v.literal("verified"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("collected"),
      v.literal("resolved"),
      v.literal("cancelled")
    ),
    assignedWorker: v.optional(v.id("users")),
    assignedAt: v.optional(v.number()),
    
    // Collection Details
    scheduledCollection: v.optional(v.object({
      date: v.number(),
      timeSlot: v.string(),
      workerId: v.id("users"),
      vehicleId: v.optional(v.string())
    })),
    
    // Completion Data
    collectionData: v.optional(v.object({
      collectedAt: v.number(),
      collectedBy: v.id("users"),
      actualWeight: v.number(),
      condition: v.string(),
      photos: v.array(v.string()),
      notes: v.string()
    })),
    
    // Feedback & Rating
    feedback: v.optional(v.object({
      rating: v.number(), // 1-5
      comment: v.string(),
      submittedAt: v.number(),
      photoProof: v.optional(v.array(v.string()))
    })),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    resolvedAt: v.optional(v.number()),
    
    // Analytics
    responseTime: v.optional(v.number()), // Time to first response
    resolutionTime: v.optional(v.number()), // Time to resolution
    satisfactionScore: v.optional(v.number())
  })
  .index("by_reporter", ["reporterId"])
  .index("by_status", ["status"])
  .index("by_assigned_worker", ["assignedWorker"])
  .index("by_location", ["location.ward"])
  .index("by_urgency", ["urgency"])
  .index("by_created_at", ["createdAt"])
  .index("by_waste_types", ["wasteTypes"]),

  // Collection Schedules & Routes
  collections: defineTable({
    // Basic Info
    workerId: v.id("users"),
    vehicleId: v.string(),
    date: v.number(),
    shift: v.union(v.literal("morning"), v.literal("afternoon"), v.literal("evening")),
    
    // Route Optimization
    route: v.object({
      startLocation: v.object({
        lat: v.number(),
        lng: v.number(),
        address: v.string()
      }),
      endLocation: v.object({
        lat: v.number(),
        lng: v.number(),
        address: v.string()
      }),
      waypoints: v.array(v.object({
        reportId: v.id("wasteReports"),
        coordinates: v.object({
          lat: v.number(),
          lng: v.number()
        }),
        estimatedArrival: v.number(),
        priority: v.number(),
        status: v.union(
          v.literal("pending"),
          v.literal("completed"),
          v.literal("skipped")
        )
      })),
      optimizedDistance: v.number(), // km
      estimatedDuration: v.number(), // minutes
      actualDistance: v.optional(v.number()),
      actualDuration: v.optional(v.number())
    }),
    
    // Status & Progress
    status: v.union(
      v.literal("scheduled"),
      v.literal("started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    
    // Collection Summary
    summary: v.optional(v.object({
      totalReports: v.number(),
      completedReports: v.number(),
      skippedReports: v.number(),
      totalWeight: v.number(), // kg
      wasteTypes: v.object({
        organic: v.number(),
        plastic: v.number(),
        paper: v.number(),
        metal: v.number(),
        electronic: v.number(),
        hazardous: v.number(),
        other: v.number()
      }),
      fuelConsumed: v.optional(v.number()),
      carbonFootprint: v.optional(v.number())
    })),
    
    // Performance Metrics
    efficiency: v.optional(v.object({
      onTimePercentage: v.number(),
      routeDeviationScore: v.number(),
      customerSatisfaction: v.number(),
      safetyScore: v.number()
    })),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string() // System or Admin ID
  })
  .index("by_worker", ["workerId"])
  .index("by_date", ["date"])
  .index("by_status", ["status"])
  .index("by_shift", ["shift"]),

  // Notifications
  notifications: defineTable({
    // Target & Type
    userId: v.id("users"),
    type: v.union(
      v.literal("training_reminder"),
      v.literal("report_update"),
      v.literal("collection_scheduled"),
      v.literal("achievement_unlocked"),
      v.literal("system_alert"),
      v.literal("payment_received"),
      v.literal("compliance_warning")
    ),
    
    // Content
    title: v.string(),
    message: v.string(),
    actionUrl: v.optional(v.string()),
    actionText: v.optional(v.string()),
    
    // Priority & Status
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    status: v.union(v.literal("sent"), v.literal("delivered"), v.literal("read"), v.literal("clicked")),
    
    // Delivery Channels
    channels: v.object({
      push: v.boolean(),
      email: v.boolean(),
      sms: v.boolean(),
      inApp: v.boolean()
    }),
    
    // Related Data
    relatedId: v.optional(v.string()), // Related report, training, etc.
    relatedType: v.optional(v.string()),
    
    // Metadata
    createdAt: v.number(),
    deliveredAt: v.optional(v.number()),
    readAt: v.optional(v.number()),
    clickedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number())
  })
  .index("by_user", ["userId"])
  .index("by_type", ["type"])
  .index("by_status", ["status"])
  .index("by_priority", ["priority"])
  .index("by_created_at", ["createdAt"]),

  // Green Credits & Transactions
  transactions: defineTable({
    // User & Type
    userId: v.id("users"),
    type: v.union(
      v.literal("earned"),
      v.literal("redeemed"),
      v.literal("bonus"),
      v.literal("penalty"),
      v.literal("transfer")
    ),
    
    // Transaction Details
    amount: v.number(),
    description: v.string(),
    category: v.string(), // "training", "reporting", "collection", "referral", etc.
    
    // Source/Reference
    sourceType: v.optional(v.string()), // "training_completion", "waste_report", etc.
    sourceId: v.optional(v.string()), // Related ID
    
    // Reward/Redemption Details
    rewardDetails: v.optional(v.object({
      itemName: v.string(),
      itemCategory: v.string(),
      vendor: v.optional(v.string()),
      deliveryAddress: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled")
      )
    })),
    
    // Status & Metadata
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("cancelled")),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
    
    // Balance Tracking
    previousBalance: v.number(),
    newBalance: v.number()
  })
  .index("by_user", ["userId"])
  .index("by_type", ["type"])
  .index("by_status", ["status"])
  .index("by_category", ["category"])
  .index("by_created_at", ["createdAt"]),

  // System Analytics & Metrics
  analytics: defineTable({
    // Time Period
    date: v.number(), // Daily aggregation
    period: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
    
    // Geographic Scope
    scope: v.union(v.literal("city"), v.literal("ward"), v.literal("zone"), v.literal("national")),
    scopeId: v.string(), // City name, ward number, etc.
    
    // User Metrics
    userMetrics: v.object({
      totalUsers: v.number(),
      newRegistrations: v.number(),
      activeUsers: v.number(),
      trainingCompletions: v.number(),
      averageEngagement: v.number()
    }),
    
    // Waste Management Metrics
    wasteMetrics: v.object({
      totalReports: v.number(),
      resolvedReports: v.number(),
      avgResponseTime: v.number(), // hours
      avgResolutionTime: v.number(), // hours
      totalWasteCollected: v.number(), // kg
      wasteByType: v.object({
        organic: v.number(),
        plastic: v.number(),
        paper: v.number(),
        metal: v.number(),
        electronic: v.number(),
        hazardous: v.number(),
        other: v.number()
      }),
      recyclingRate: v.number(), // percentage
      customerSatisfaction: v.number() // average rating
    }),
    
    // Environmental Impact
    environmentalImpact: v.object({
      carbonReduced: v.number(), // kg CO2
      treesEquivalent: v.number(),
      energySaved: v.number(), // kWh
      waterSaved: v.number(), // liters
      landfillDiverted: v.number() // kg
    }),
    
    // Financial Metrics
    financialMetrics: v.object({
      totalCreditsIssued: v.number(),
      totalCreditsRedeemed: v.number(),
      costSavings: v.number(), // INR
      revenueGenerated: v.number() // INR
    }),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    generatedBy: v.string() // System function
  })
  .index("by_date", ["date"])
  .index("by_period", ["period"])
  .index("by_scope", ["scope", "scopeId"])
  .index("by_created_at", ["createdAt"]),

  // Government Policies & Compliance
  policies: defineTable({
    // Policy Details
    title: v.string(),
    description: v.string(),
    category: v.string(), // "waste_management", "environmental", "urban_planning"
    type: v.union(
      v.literal("regulation"),
      v.literal("guideline"), 
      v.literal("standard"),
      v.literal("procedure")
    ),
    
    // Geographic Scope
    jurisdiction: v.object({
      level: v.union(v.literal("national"), v.literal("state"), v.literal("city"), v.literal("local")),
      area: v.string(), // India, Karnataka, Bangalore, etc.
      population: v.optional(v.number())
    }),
    
    // Implementation
    status: v.union(
      v.literal("draft"),
      v.literal("consultation"),
      v.literal("approved"),
      v.literal("active"),
      v.literal("suspended"),
      v.literal("archived")
    ),
    effectiveDate: v.number(),
    expiryDate: v.optional(v.number()),
    
    // Content & Requirements
    requirements: v.array(v.object({
      id: v.string(),
      title: v.string(),
      description: v.string(),
      mandatory: v.boolean(),
      deadline: v.optional(v.number()),
      penalty: v.optional(v.string())
    })),
    
    // Compliance Tracking
    complianceMetrics: v.object({
      totalEntities: v.number(), // Citizens, businesses, etc.
      compliantEntities: v.number(),
      nonCompliantEntities: v.number(),
      complianceRate: v.number(), // percentage
      lastAssessment: v.number()
    }),
    
    // Documents & Resources
    documents: v.array(v.object({
      name: v.string(),
      type: v.string(), // "pdf", "doc", "image"
      url: v.string(),
      size: v.number()
    })),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id("users"), // Government user
    approvedBy: v.optional(v.id("users")),
    version: v.string()
  })
  .index("by_category", ["category"])
  .index("by_status", ["status"])
  .index("by_jurisdiction", ["jurisdiction.level", "jurisdiction.area"])
  .index("by_effective_date", ["effectiveDate"]),

  // System Configuration
  systemConfig: defineTable({
    key: v.string(), // Unique configuration key
    value: v.any(), // Configuration value (JSON)
    category: v.string(), // "app", "notification", "payment", "ai", etc.
    description: v.string(),
    type: v.union(
      v.literal("string"),
      v.literal("number"),
      v.literal("boolean"),
      v.literal("object"),
      v.literal("array")
    ),
    
    // Access Control
    scope: v.union(v.literal("public"), v.literal("admin"), v.literal("system")),
    editable: v.boolean(),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users"))
  })
  .index("by_key", ["key"])
  .index("by_category", ["category"])
  .index("by_scope", ["scope"])
});
```

---

## 🔄 **API Functions Structure**

### **📝 Queries (Read Operations)**
```typescript
// convex/queries/users.ts
import { query } from "../_generated/server";
import { v } from "convex/values";

// Get user profile by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

// Get user training progress
export const getUserTrainingProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const progress = await ctx.db
      .query("userTrainingProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const modules = await ctx.db
      .query("trainingModules")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return {
      progress,
      modules,
      completionRate: progress.filter(p => p.status === "completed").length / modules.length * 100
    };
  },
});

// Get nearby waste reports
export const getNearbyWasteReports = query({
  args: { 
    lat: v.number(), 
    lng: v.number(), 
    radius: v.number() // km
  },
  handler: async (ctx, { lat, lng, radius }) => {
    const reports = await ctx.db
      .query("wasteReports")
      .withIndex("by_status", (q) => q.eq("status", "reported"))
      .collect();
    
    // Filter by distance (simplified - in production use proper geo queries)
    return reports.filter(report => {
      const distance = calculateDistance(
        lat, lng,
        report.location.coordinates.lat,
        report.location.coordinates.lng
      );
      return distance <= radius;
    });
  },
});
```

### **✏️ Mutations (Write Operations)**
```typescript
// convex/mutations/users.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Create new user profile
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("citizen"),
      v.literal("worker"),
      v.literal("green_champion"),
      v.literal("admin")
    ),
    phone: v.optional(v.string()),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      coordinates: v.object({
        lat: v.number(),
        lng: v.number()
      })
    })
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existingUser) {
      throw new Error("User already exists");
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      ...args,
      status: "active",
      trainingProgress: 0,
      greenCredits: 100, // Welcome bonus
      totalPoints: 0,
      level: 1,
      badges: [],
      certificates: [],
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: "en",
        theme: "light"
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      onboardingCompleted: false
    });
    
    // Create welcome transaction
    await ctx.db.insert("transactions", {
      userId,
      type: "bonus",
      amount: 100,
      description: "Welcome bonus for joining WasteNexus!",
      category: "welcome",
      status: "completed",
      createdAt: Date.now(),
      processedAt: Date.now(),
      previousBalance: 0,
      newBalance: 100
    });
    
    return userId;
  },
});

// Update training progress
export const updateTrainingProgress = mutation({
  args: {
    userId: v.id("users"),
    moduleId: v.id("trainingModules"),
    lessonId: v.string(),
    score: v.optional(v.number()),
    timeSpent: v.number()
  },
  handler: async (ctx, { userId, moduleId, lessonId, score, timeSpent }) => {
    // Get existing progress
    const progress = await ctx.db
      .query("userTrainingProgress")
      .withIndex("by_user_module", (q) => 
        q.eq("userId", userId).eq("moduleId", moduleId)
      )
      .first();
    
    if (!progress) {
      // Create new progress record
      return await ctx.db.insert("userTrainingProgress", {
        userId,
        moduleId,
        status: "in_progress",
        progressPercentage: 10,
        currentLesson: lessonId,
        lessonProgress: [{
          lessonId,
          status: "completed",
          score,
          attempts: 1,
          timeSpent,
          completedAt: Date.now()
        }],
        startedAt: Date.now(),
        attempts: 1,
        totalTimeSpent: timeSpent,
        pointsEarned: 0,
        creditsEarned: 0
      });
    } else {
      // Update existing progress
      const updatedLessons = progress.lessonProgress.map(lesson => 
        lesson.lessonId === lessonId 
          ? { ...lesson, status: "completed", score, timeSpent, completedAt: Date.now() }
          : lesson
      );
      
      await ctx.db.patch(progress._id, {
        lessonProgress: updatedLessons,
        totalTimeSpent: progress.totalTimeSpent + timeSpent,
        updatedAt: Date.now()
      });
    }
  },
});
```

### **🎯 Actions (External API Calls)**
```typescript
// convex/actions/ai.ts
import { action } from "../_generated/server";
import { v } from "convex/values";

// Classify waste from image
export const classifyWaste = action({
  args: { 
    imageUrl: v.string(),
    reportId: v.id("wasteReports")
  },
  handler: async (ctx, { imageUrl, reportId }) => {
    // Call external AI service
    const response = await fetch("https://api.custom-ai-service.com/classify", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        model: "waste-classifier-v2"
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Update report with AI classification
      await ctx.runMutation("reports.updateAIClassification", {
        reportId,
        classification: {
          detectedTypes: result.classes,
          confidence: result.confidence,
          processedAt: Date.now(),
          model: "waste-classifier-v2"
        }
      });
      
      return result;
    } else {
      throw new Error("AI classification failed");
    }
  },
});

// Send notification via external service
export const sendNotification = action({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    channels: v.object({
      push: v.boolean(),
      email: v.boolean(),
      sms: v.boolean()
    })
  },
  handler: async (ctx, args) => {
    // Get user details
    const user = await ctx.runQuery("users.getUserById", { userId: args.userId });
    
    if (!user) throw new Error("User not found");
    
    const results = {
      push: false,
      email: false,
      sms: false
    };
    
    // Send push notification
    if (args.channels.push && user.preferences.notifications.push) {
      try {
        await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            "Authorization": `key=${process.env.FCM_SERVER_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: user.fcmToken,
            notification: {
              title: args.title,
              body: args.message,
            },
          }),
        });
        results.push = true;
      } catch (error) {
        console.error("Push notification failed:", error);
      }
    }
    
    // Send email
    if (args.channels.email && user.preferences.notifications.email) {
      try {
        await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: user.email }],
              subject: args.title,
            }],
            from: { email: "noreply@wastenexus.com" },
            content: [{
              type: "text/html",
              value: `<h2>${args.title}</h2><p>${args.message}</p>`,
            }],
          }),
        });
        results.email = true;
      } catch (error) {
        console.error("Email notification failed:", error);
      }
    }
    
    // Send SMS
    if (args.channels.sms && user.preferences.notifications.sms && user.phone) {
      try {
        await fetch("https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${btoa(`${process.env.TWILIO_SID}:${process.env.TWILIO_TOKEN}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: process.env.TWILIO_PHONE,
            To: user.phone,
            Body: `${args.title}\n\n${args.message}`,
          }),
        });
        results.sms = true;
      } catch (error) {
        console.error("SMS notification failed:", error);
      }
    }
    
    // Store notification in database
    await ctx.runMutation("notifications.create", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      channels: args.channels,
      status: "sent",
      createdAt: Date.now()
    });
    
    return results;
  },
});
```

### **⏰ Scheduled Functions (Cron Jobs)**
```typescript
// convex/crons/analytics.ts
import { cronJobs } from "convex/server";

const crons = cronJobs();

// Daily analytics aggregation
crons.daily(
  "aggregate daily analytics",
  { hourUTC: 2, minuteUTC: 0 }, // 2 AM UTC daily
  async (ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    
    // Get all reports from today
    const todayReports = await ctx.db
      .query("wasteReports")
      .filter((q) => q.gte(q.field("createdAt"), todayMs))
      .collect();
    
    // Get all users active today
    const activeUsers = await ctx.db
      .query("users")
      .filter((q) => q.gte(q.field("lastLoginAt"), todayMs))
      .collect();
    
    // Calculate metrics
    const metrics = {
      totalReports: todayReports.length,
      resolvedReports: todayReports.filter(r => r.status === "resolved").length,
      activeUsers: activeUsers.length,
      totalWasteCollected: todayReports.reduce((sum, r) => 
        sum + (r.collectionData?.actualWeight || 0), 0
      ),
      // ... more calculations
    };
    
    // Store daily analytics
    await ctx.db.insert("analytics", {
      date: todayMs,
      period: "daily",
      scope: "national",
      scopeId: "india",
      userMetrics: {
        totalUsers: activeUsers.length,
        newRegistrations: 0, // Calculate new registrations
        activeUsers: activeUsers.length,
        trainingCompletions: 0, // Calculate completions
        averageEngagement: 0 // Calculate engagement
      },
      wasteMetrics: {
        totalReports: metrics.totalReports,
        resolvedReports: metrics.resolvedReports,
        avgResponseTime: 0, // Calculate average response time
        avgResolutionTime: 0, // Calculate average resolution time
        totalWasteCollected: metrics.totalWasteCollected,
        wasteByType: {
          organic: 0,
          plastic: 0,
          paper: 0,
          metal: 0,
          electronic: 0,
          hazardous: 0,
          other: 0
        },
        recyclingRate: 0,
        customerSatisfaction: 0
      },
      environmentalImpact: {
        carbonReduced: metrics.totalWasteCollected * 0.5, // Estimation
        treesEquivalent: metrics.totalWasteCollected * 0.1,
        energySaved: metrics.totalWasteCollected * 2,
        waterSaved: metrics.totalWasteCollected * 10,
        landfillDiverted: metrics.totalWasteCollected
      },
      financialMetrics: {
        totalCreditsIssued: 0,
        totalCreditsRedeemed: 0,
        costSavings: 0,
        revenueGenerated: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      generatedBy: "system-cron"
    });
  }
);

// Weekly route optimization
crons.weekly(
  "optimize collection routes",
  { dayOfWeek: "sunday", hourUTC: 1, minuteUTC: 0 },
  async (ctx) => {
    // Get all active waste reports
    const pendingReports = await ctx.db
      .query("wasteReports")
      .withIndex("by_status", (q) => q.eq("status", "verified"))
      .collect();
    
    // Group by location/ward
    const reportsByWard = pendingReports.reduce((acc, report) => {
      const ward = report.location.ward || "unknown";
      if (!acc[ward]) acc[ward] = [];
      acc[ward].push(report);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Optimize routes for each ward
    for (const [ward, reports] of Object.entries(reportsByWard)) {
      if (reports.length > 0) {
        // Call route optimization service
        const optimizedRoute = await optimizeRoute(reports);
        
        // Create collection schedule
        await ctx.db.insert("collections", {
          workerId: await getAvailableWorker(ward),
          vehicleId: await getAvailableVehicle(ward),
          date: getNextWorkingDay(),
          shift: "morning",
          route: optimizedRoute,
          status: "scheduled",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          createdBy: "system-cron"
        });
      }
    }
  }
);

// Training reminder notifications
crons.daily(
  "send training reminders",
  { hourUTC: 10, minuteUTC: 0 }, // 10 AM UTC daily
  async (ctx) => {
    // Get users with incomplete training
    const users = await ctx.db
      .query("users")
      .filter((q) => 
        q.and(
          q.lt(q.field("trainingProgress"), 100),
          q.eq(q.field("status"), "active")
        )
      )
      .collect();
    
    for (const user of users) {
      // Check if user hasn't been active in training for 3 days
      const lastActivity = await ctx.db
        .query("userTrainingProgress")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .order("desc")
        .first();
      
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      
      if (!lastActivity || lastActivity.updatedAt < threeDaysAgo) {
        // Send reminder notification
        await ctx.scheduler.runAfter(0, "notifications.send", {
          userId: user._id,
          type: "training_reminder",
          title: "Complete Your Training",
          message: "Continue your waste management training to earn green credits and help the environment!",
          channels: {
            push: true,
            email: false,
            sms: false
          }
        });
      }
    }
  }
);

export default crons;
```

---

## 🔐 **Authentication & Authorization**

### **🔑 Convex Auth Setup**
```typescript
// convex/auth.config.ts
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    {
      domain: "https://arriving-iguana-58.clerk.accounts.dev",
      applicationId: "app_...",
    },
  ],
});
```

### **🛡️ Authorization Helpers**
```typescript
// convex/lib/auth.ts
import { Auth } from "convex/server";
import { Id } from "../_generated/dataModel";

export async function requireAuth(ctx: { auth: Auth; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Authentication required");
  }
  return identity;
}

export async function requireRole(
  ctx: { auth: Auth; db: any }, 
  allowedRoles: string[]
) {
  const identity = await requireAuth(ctx);
  
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  
  return { identity, user };
}

export async function requireAdmin(ctx: { auth: Auth; db: any }) {
  return requireRole(ctx, ["admin"]);
}

export async function requireWorkerOrAdmin(ctx: { auth: Auth; db: any }) {
  return requireRole(ctx, ["worker", "admin"]);
}
```

---

## 🚀 **14-Day Backend Development Plan**

### **🔧 Phase 1: Core Infrastructure (Days 1-4)**

#### **Day 1: Project Setup & Schema Design**
- [ ] Initialize Convex project
- [ ] Design and implement database schema
- [ ] Set up authentication with Clerk
- [ ] Configure file storage
- [ ] Set up basic queries and mutations

#### **Day 2: User Management System**
- [ ] Implement user registration and profile management
- [ ] Build role-based access control
- [ ] Create user preference management
- [ ] Set up profile update functions
- [ ] Implement user search and filtering

#### **Day 3: Training System Backend**
- [ ] Create training module management
- [ ] Implement progress tracking
- [ ] Build quiz and assessment system
- [ ] Set up certificate generation
- [ ] Create achievement and badge system

#### **Day 4: Notification System**
- [ ] Set up push notification infrastructure
- [ ] Implement email notification system
- [ ] Create SMS notification service
- [ ] Build notification preference management
- [ ] Set up notification analytics

### **📊 Phase 2: Core Features (Days 5-8)**

#### **Day 5: Waste Reporting System**
- [ ] Build waste report creation and management
- [ ] Implement photo/video upload handling
- [ ] Set up location and mapping services
- [ ] Create report status tracking
- [ ] Build report search and filtering

#### **Day 6: Collection Management**
- [ ] Implement route optimization algorithms
- [ ] Build collection scheduling system
- [ ] Create worker assignment logic
- [ ] Set up real-time tracking
- [ ] Implement collection analytics

#### **Day 7: AI Integration & External APIs**
- [ ] Integrate waste classification AI
- [ ] Set up image processing pipeline
- [ ] Connect mapping and geocoding services
- [ ] Implement weather API integration
- [ ] Set up external notification services

#### **Day 8: Analytics & Reporting**
- [ ] Build real-time analytics system
- [ ] Create data aggregation functions
- [ ] Implement report generation
- [ ] Set up dashboard data feeds
- [ ] Create performance metrics

### **🎯 Phase 3: Advanced Features (Days 9-11)**

#### **Day 9: Green Credits & Gamification**
- [ ] Implement credit earning and redemption
- [ ] Build transaction tracking
- [ ] Create leaderboard system
- [ ] Set up achievement unlocking
- [ ] Implement social features

#### **Day 10: Government & Compliance**
- [ ] Build policy management system
- [ ] Implement compliance tracking
- [ ] Create audit trail functionality
- [ ] Set up government reporting
- [ ] Build administrative controls

#### **Day 11: Integration & Testing**
- [ ] Implement payment gateway integration
- [ ] Set up third-party service connections
- [ ] Build API rate limiting
- [ ] Create comprehensive error handling
- [ ] Set up monitoring and logging

### **📱 Phase 4: Optimization & Deployment (Days 12-14)**

#### **Day 12: Performance Optimization**
- [ ] Optimize database queries
- [ ] Implement caching strategies
- [ ] Set up scheduled background jobs
- [ ] Optimize file storage and delivery
- [ ] Performance testing and tuning

#### **Day 13: Security & Compliance**
- [ ] Implement security best practices
- [ ] Set up data encryption
- [ ] Create backup and recovery procedures
- [ ] Implement GDPR compliance
- [ ] Security testing and validation

#### **Day 14: Production Deployment**
- [ ] Set up production environment
- [ ] Configure monitoring and alerting
- [ ] Deploy and test all systems
- [ ] Performance monitoring setup
- [ ] Final integration testing

---

## 🔧 **Environment Configuration**

### **📝 Environment Variables**
```bash
# .env.local
# Convex
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# External APIs
AI_CLASSIFICATION_API_KEY=your-ai-api-key
GOOGLE_MAPS_API_KEY=your-maps-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
SENDGRID_API_KEY=your-sendgrid-key
FCM_SERVER_KEY=your-fcm-key

# Payment
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📈 **Monitoring & Analytics**

### **🎯 Key Metrics to Track**
```typescript
// Analytics Dashboard Metrics
const keyMetrics = {
  user: {
    totalUsers: "Total registered users",
    activeUsers: "Daily/Monthly active users",
    newRegistrations: "New user registrations",
    trainingCompletions: "Training module completions",
    retentionRate: "User retention percentage"
  },
  
  waste: {
    totalReports: "Total waste reports submitted",
    resolvedReports: "Reports successfully resolved",
    averageResponseTime: "Time to first response",
    averageResolutionTime: "Time to complete resolution",
    customerSatisfaction: "Average user rating"
  },
  
  environmental: {
    wasteCollected: "Total waste collected (kg)",
    carbonReduced: "CO2 emissions reduced",
    recyclingRate: "Percentage of waste recycled",
    landfillDiverted: "Waste diverted from landfills"
  },
  
  financial: {
    creditsIssued: "Green credits issued",
    creditsRedeemed: "Green credits redeemed",
    costSavings: "Municipal cost savings",
    revenueGenerated: "Platform revenue"
  }
};
```

---

## 🔄 **Real-time Features**

### **⚡ Live Updates & Subscriptions**
```typescript
// Real-time waste report updates
export const subscribeToNearbyReports = query({
  args: { lat: v.number(), lng: v.number(), radius: v.number() },
  handler: async (ctx, { lat, lng, radius }) => {
    // This query will automatically update when new reports are added
    const reports = await ctx.db
      .query("wasteReports")
      .filter((q) => q.neq(q.field("status"), "resolved"))
      .collect();
    
    return reports.filter(report => {
      const distance = calculateDistance(
        lat, lng,
        report.location.coordinates.lat,
        report.location.coordinates.lng
      );
      return distance <= radius;
    });
  },
});

// Real-time collection tracking
export const subscribeToCollectionProgress = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, { collectionId }) => {
    const collection = await ctx.db.get(collectionId);
    if (!collection) return null;
    
    // Get all related reports with their current status
    const reports = await Promise.all(
      collection.route.waypoints.map(waypoint => 
        ctx.db.get(waypoint.reportId)
      )
    );
    
    return {
      collection,
      reports: reports.filter(Boolean),
      progress: collection.route.waypoints.filter(w => w.status === "completed").length / collection.route.waypoints.length
    };
  },
});
```

---

This comprehensive backend planning with Convex provides a robust, scalable foundation for WasteNexus that will seamlessly integrate with your frontend and impress SIH judges! 🏆

Ready to start building the backend? Let's begin with Day 1! 🚀