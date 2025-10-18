# Jobs Management System Documentation

## Overview
A complete job posting and management system for WasteNexus platform where clients can post waste collection jobs, admins verify them, and workers can view and accept jobs.

---

## System Architecture

### 1. Database Model (`models/Job.ts`)
```typescript
Job Schema:
- _id: Unique identifier
- clientId: Reference to User (client who posted)
- title: Job title (max 100 chars)
- description: Job description (max 1000 chars)
- category: 'industry' | 'home' | 'other'
- location: { address, coordinates }
- wasteType: Array of waste types
- estimatedWeight: Optional weight in kg
- budget: Optional budget in ₹
- urgency: 'low' | 'medium' | 'high'
- status: 'pending' | 'verified' | 'rejected' | 'assigned' | 'in-progress' | 'completed'
- assignedWorkerId: Optional reference to worker
- scheduledDate: Optional preferred date
- adminNotes: Admin verification notes
- clientContact: Contact information
- images: Array of image URLs
- timestamps: createdAt, updatedAt
```

---

## API Endpoints

### Client Endpoints (`/api/jobs`)

#### POST - Create New Job
- **Auth Required**: Client role
- **Purpose**: Clients post new waste collection jobs
- **Body**:
  ```json
  {
    "title": "Large Cardboard Collection",
    "description": "Need pickup of 50kg cardboard waste",
    "category": "home",
    "location": { "address": "123 Main St, Mumbai" },
    "wasteType": ["cardboard", "paper"],
    "estimatedWeight": 50,
    "budget": 500,
    "urgency": "medium",
    "scheduledDate": "2025-10-20",
    "clientContact": {
      "name": "John Doe",
      "phone": "+91 9876543210",
      "email": "john@example.com"
    }
  }
  ```
- **Response**: Created job with status 'pending'

#### GET - Fetch Client's Jobs
- **Auth Required**: Client role
- **Query Params**: `?status=pending|verified|rejected|assigned|in-progress|completed`
- **Response**: List of jobs + statistics

---

### Admin Endpoints (`/api/admin/jobs`)

#### GET - Fetch All Jobs
- **Auth Required**: Admin role
- **Query Params**: 
  - `?status=pending|verified|rejected|...`
  - `?category=industry|home|other`
- **Response**: All jobs with detailed info + statistics

#### PUT - Verify/Reject Job
- **Auth Required**: Admin role
- **Body**:
  ```json
  {
    "jobId": "job_id_here",
    "status": "verified",
    "adminNotes": "Approved for worker assignment"
  }
  ```
- **Response**: Updated job

---

### Worker Endpoints (`/api/worker/jobs`)

#### GET - Fetch Available/My Jobs
- **Auth Required**: Worker role
- **Query Params**: `?view=available|my-jobs`
- **Response**: 
  - `available`: Verified jobs not yet assigned
  - `my-jobs`: Jobs assigned to this worker

#### PUT - Job Actions
- **Auth Required**: Worker role
- **Body**:
  ```json
  {
    "jobId": "job_id_here",
    "action": "accept|start|complete"
  }
  ```
- **Actions**:
  - `accept`: Worker accepts a verified job (status → assigned)
  - `start`: Worker starts working (status → in-progress)
  - `complete`: Worker completes job (status → completed)

---

## User Interfaces

### 1. Client Dashboard (`/dashboard/client`)
**Features**:
- ✅ "Post a Job" button with Briefcase icon
- ✅ Navigates to `/dashboard/client/create-job`

### 2. Client Job Creation Page (`/dashboard/client/create-job`)
**Features**:
- ✅ Beautiful form with validation
- ✅ Category selection with visual icons (Home, Industry, Other)
- ✅ Multi-select waste types
- ✅ Location input
- ✅ Optional fields: weight, budget, scheduled date
- ✅ Contact information auto-filled from user profile
- ✅ Admin verification notice
- ✅ Success message with redirect

### 3. Worker Dashboard (`/dashboard/worker`)
**Features**:
- ✅ Three-tab view switcher:
  1. **Collection Tasks** - Existing waste report tasks
  2. **Available Jobs** - Verified jobs ready to accept
  3. **My Jobs** - Jobs worker has accepted
- ✅ Job details with category badges
- ✅ Urgency indicators
- ✅ Budget display
- ✅ Client contact information
- ✅ Action buttons: Accept → Start → Complete

### 4. Admin Jobs Page (`/dashboard/admin/jobs`)
**Features**:
- ✅ **Authentication**: Admin-only access (enforced in layout)
- ✅ **Stats Dashboard**: 
  - Pending, Verified, Rejected counts
  - Category breakdown (Industry, Home, Other)
  - Total jobs counter
- ✅ **Tabs**: Pending, Verified, Rejected, Assigned, In Progress, Completed, All
- ✅ **Job Cards** with full details:
  - Title, description, category badge
  - Status badge with color coding
  - Client information
  - Location, waste types, weight, budget
  - Contact information
  - Scheduled date
  - Posted timestamp
- ✅ **Verification Actions**:
  - "Review Job" button for pending jobs
  - Admin notes textarea
  - Verify/Reject buttons
  - Cancel option
- ✅ **Color-coded status**:
  - Orange: Pending
  - Green: Verified
  - Red: Rejected
  - Blue: Assigned
  - Purple: In Progress
  - Gray: Completed

### 5. Admin Dashboard Integration
**Features**:
- ✅ Jobs Management module card added
- ✅ Teal gradient styling
- ✅ Quick access from main admin dashboard
- ✅ Sidebar navigation updated with Jobs Management link

---

## Authentication & Security

### Admin Layout (`/app/dashboard/admin/layout.tsx`)
```typescript
✅ Checks if user is logged in
✅ Verifies user role === 'admin'
✅ Redirects non-admin users to /dashboard/client
✅ Redirects non-authenticated users to /auth/signin
✅ Shows loading spinner during auth check
```

### API Route Protection
```typescript
All API routes verify:
1. Token exists in Authorization header
2. Token is valid (using verifyToken)
3. User has correct role (client/worker/admin)
4. Return 401/403 errors for unauthorized access
```

---

## Complete Workflow

### 1. Client Posts Job
1. Client navigates to dashboard
2. Clicks "Post a Job"
3. Fills out form with job details
4. Submits → Status: **Pending**
5. Receives confirmation message

### 2. Admin Reviews Job
1. Admin opens Jobs Management page
2. Views pending jobs in detail
3. Clicks "Review Job"
4. Optionally adds admin notes
5. Clicks "Verify" → Status: **Verified**
   OR clicks "Reject" → Status: **Rejected**

### 3. Worker Accepts Job
1. Worker opens dashboard
2. Switches to "Available Jobs" tab
3. Browses verified jobs
4. Views job details (client contact, location, etc.)
5. Clicks "Accept Job" → Status: **Assigned**

### 4. Worker Completes Job
1. Worker switches to "My Jobs" tab
2. Sees assigned job
3. Clicks "Start Job" → Status: **In Progress**
4. After completion, clicks "Mark as Completed" → Status: **Completed**

---

## Status Flow Chart

```
Client Posts Job
      ↓
  [PENDING] ← Admin reviews
      ↓
Admin Decision:
  ├─ Verify → [VERIFIED] ← Workers can see
  │              ↓
  │         Worker accepts
  │              ↓
  │         [ASSIGNED]
  │              ↓
  │         Worker starts
  │              ↓
  │         [IN-PROGRESS]
  │              ↓
  │         Worker completes
  │              ↓
  │         [COMPLETED]
  │
  └─ Reject → [REJECTED] ← End of flow
```

---

## Key Features

✅ **Three-tier system**: Client → Admin → Worker
✅ **Category-based organization**: Industry, Home, Other
✅ **Urgency levels**: Low, Medium, High
✅ **Budget tracking**: Optional budget field
✅ **Location-based**: Full address + coordinates support
✅ **Multi-waste types**: Select multiple waste categories
✅ **Contact information**: Direct client-worker communication
✅ **Admin notes**: Documentation of verification decisions
✅ **Real-time stats**: Live counts for all job statuses
✅ **Role-based access**: Proper authentication at every level
✅ **Responsive UI**: Works on desktop and mobile
✅ **Beautiful design**: Modern cards, badges, and gradients

---

## File Structure

```
wastenexus/
├── models/
│   └── Job.ts                          # Job schema
├── app/
│   ├── api/
│   │   ├── jobs/
│   │   │   └── route.ts                # Client API
│   │   ├── admin/
│   │   │   └── jobs/
│   │   │       └── route.ts            # Admin API
│   │   └── worker/
│   │       └── jobs/
│   │           └── route.ts            # Worker API
│   └── dashboard/
│       ├── client/
│       │   ├── page.tsx                # Updated with job button
│       │   └── create-job/
│       │       └── page.tsx            # Job creation form
│       ├── worker/
│       │   └── page.tsx                # Updated with jobs tabs
│       └── admin/
│           ├── page.tsx                # Updated with jobs module
│           ├── layout.tsx              # Admin auth protection
│           └── jobs/
│               └── page.tsx            # Jobs management page
└── components/
    └── admin/
        └── AdminSidebar.tsx            # Updated navigation

```

---

## Testing Checklist

### Client Flow
- [ ] Client can access job creation page
- [ ] Form validation works correctly
- [ ] Job submission creates pending job
- [ ] Success message appears
- [ ] Redirect to dashboard works

### Admin Flow
- [ ] Only admins can access /dashboard/admin/jobs
- [ ] Non-admins are redirected
- [ ] Stats display correctly
- [ ] Jobs list by status works
- [ ] Verify action changes status to verified
- [ ] Reject action changes status to rejected
- [ ] Admin notes are saved

### Worker Flow
- [ ] Worker sees available jobs (verified only)
- [ ] Worker can view job details
- [ ] Accept job changes status to assigned
- [ ] My Jobs tab shows assigned jobs
- [ ] Start job changes status to in-progress
- [ ] Complete job changes status to completed

---

## Future Enhancements (Optional)

1. **Notifications**: Email/SMS alerts for job status changes
2. **Image Upload**: Allow clients to upload photos of waste
3. **Rating System**: Workers can rate clients and vice versa
4. **Payment Integration**: Handle payments through platform
5. **Route Optimization**: Help workers plan efficient collection routes
6. **Job History**: Detailed history view for all stakeholders
7. **Search & Filters**: Advanced filtering by location, waste type, etc.
8. **Analytics Dashboard**: Insights on job trends, popular categories

---

## Support & Maintenance

For issues or questions:
1. Check API responses in browser console
2. Verify authentication tokens in localStorage
3. Check user role in database
4. Review server logs for API errors
5. Ensure all required fields are filled in forms

---

**System Status**: ✅ Fully Operational
**Last Updated**: October 18, 2025
**Version**: 1.0.0
