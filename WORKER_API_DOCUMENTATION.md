# Worker API Documentation

## Overview
Complete API implementation for worker task management, allowing workers to view assigned waste collection tasks and update their status.

---

## API Endpoints

### 1. GET /api/worker/tasks

**Description:** Fetch collection tasks assigned to the logged-in worker.

**Authentication:** Required (Bearer Token)

**Authorization:** Worker role only

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status: 'assigned', 'in-progress', or 'completed' |

**Request Example:**
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/worker/tasks?status=assigned', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
```

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "_id": "task_id",
      "reportId": {
        "_id": "report_id",
        "type": "plastic",
        "weightKg": 5.5,
        "imageUrl": "https://cloudinary.com/...",
        "location": {
          "address": "123 Green Street, Mumbai",
          "coordinates": {
            "lat": 19.0760,
            "lng": 72.8777
          }
        },
        "userId": {
          "name": "Rahul Sharma",
          "email": "rahul@example.com"
        }
      },
      "status": "assigned",
      "assignedDate": "2025-10-18T10:30:00.000Z",
      "workerId": "worker_id"
    }
  ],
  "stats": {
    "totalAssigned": 12,
    "pending": 2,
    "inProgress": 2,
    "completed": 8,
    "totalWeight": 156.5
  }
}
```

**Error Responses:**

401 Unauthorized:
```json
{
  "error": "Authentication required"
}
```

403 Forbidden:
```json
{
  "error": "Access denied. Workers only."
}
```

---

### 2. PUT /api/worker/tasks

**Description:** Update the status of a collection task.

**Authentication:** Required (Bearer Token)

**Authorization:** Worker role only (can only update own tasks)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| taskId | string | Yes | ID of the task to update |
| status | string | Yes | New status: 'assigned', 'in-progress', or 'completed' |

**Request Example:**
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/worker/tasks', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    taskId: 'task_id_here',
    status: 'in-progress'
  })
});

const data = await response.json();
```

**Response (200 OK):**
```json
{
  "message": "Task status updated successfully",
  "task": {
    "_id": "task_id",
    "reportId": {
      "type": "plastic",
      "weightKg": 5.5,
      "location": {
        "address": "123 Green Street, Mumbai"
      },
      "userId": {
        "name": "Rahul Sharma"
      }
    },
    "status": "in-progress",
    "assignedDate": "2025-10-18T10:30:00.000Z",
    "startedDate": "2025-10-18T11:45:00.000Z"
  }
}
```

**Status Workflow:**
- `assigned` → `in-progress`: Sets `startedDate`
- `in-progress` → `completed`: Sets `completedDate`

**Error Responses:**

400 Bad Request:
```json
{
  "error": "Task ID and status are required"
}
```
OR
```json
{
  "error": "Invalid status"
}
```

404 Not Found:
```json
{
  "error": "Task not found or access denied"
}
```

---

## Database Schema

### WorkerTask Model

```typescript
{
  _id: ObjectId,
  reportId: ObjectId (ref: Report),
  workerId: ObjectId (ref: User),
  status: 'assigned' | 'in-progress' | 'completed',
  assignedDate: Date,
  startedDate?: Date,
  completedDate?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ workerId: 1, status: 1 }` - Fast queries for worker's tasks by status
- `{ reportId: 1 }` - Prevent duplicate assignments

---

## Worker Dashboard Integration

### Component: `app/dashboard/worker/page.tsx`

**Features Implemented:**

1. **Real-time Data Fetching**
   - Fetches tasks on component mount
   - Uses JWT authentication
   - Displays actual data from database

2. **Task Status Management**
   - Start Collection: `assigned` → `in-progress`
   - Mark as Completed: `in-progress` → `completed`
   - Automatic timestamp tracking

3. **Statistics Dashboard**
   - Total Tasks
   - Pending Count
   - In Progress Count
   - Completed Count
   - Total Weight Collected (kg)

4. **Task Filtering**
   - Assigned - New tasks waiting
   - In Progress - Currently active
   - Completed - Finished collections
   - All - Complete view

5. **Navigation Integration**
   - "Get Directions" opens Google Maps
   - Uses coordinates from report location
   - Opens in new tab

**State Management:**
```typescript
const [tasks, setTasks] = useState<CollectionTask[]>([]);
const [stats, setStats] = useState({
  totalAssigned: 0,
  completed: 0,
  inProgress: 0,
  pending: 0,
  totalWeight: 0,
});
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('assigned');
```

**Key Functions:**

```typescript
// Fetch all tasks for logged-in worker
const fetchTasks = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/worker/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  setTasks(data.tasks);
  setStats(data.stats);
};

// Update task status
const updateTaskStatus = async (taskId: string, status: string) => {
  const token = localStorage.getItem('token');
  await fetch('/api/worker/tasks', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ taskId, status })
  });
  fetchTasks(); // Refresh data
};
```

---

## Task Assignment System

### Admin Task Assignment (Manual)

Admins can assign verified reports to workers using the provided script:

**Script Location:** `scripts/assignWorkerTasks.js`

**Available Functions:**

1. **Assign Single Report to Worker:**
```javascript
assignReportToWorker('REPORT_ID', 'worker@example.com');
```

2. **Assign Multiple Reports:**
```javascript
assignMultipleReports('worker@example.com', [
  'REPORT_ID_1',
  'REPORT_ID_2',
  'REPORT_ID_3'
]);
```

3. **View Available Workers:**
```javascript
getAvailableWorkers();
// Output:
// 📋 Available Workers:
// 1. John Doe (john@example.com)
// 2. Jane Smith (jane@example.com)
```

4. **View Unassigned Reports:**
```javascript
getUnassignedReports();
// Lists all verified reports without assigned workers
```

5. **View Worker Statistics:**
```javascript
getWorkerStats('worker@example.com');
// Output:
// 📊 Stats for John Doe:
// Total Tasks: 12
// Assigned: 2
// In Progress: 2
// Completed: 8
// Total Weight Collected: 156.5 kg
```

**Prerequisites for Assignment:**
- Report must have status: `verified`
- Worker must have role: `worker`
- Report cannot already be assigned

---

## Security Features

### Authentication & Authorization
- JWT token required for all endpoints
- Token verified on every request
- Workers can only access their own tasks
- Role-based access control (RBAC)

### Data Protection
- Workers cannot see other workers' tasks
- Task updates restricted to assigned worker
- Populated data limited to necessary fields only

### Error Handling
- Comprehensive error messages
- Proper HTTP status codes
- Console logging for debugging
- Graceful fallbacks in UI

---

## Testing Guide

### Manual Testing Steps

**1. Register as Worker:**
```
1. Go to /auth/signup
2. Select "Worker" role
3. Fill in details and submit
4. Should redirect to /dashboard/worker
```

**2. Verify Empty State:**
```
✅ Dashboard loads without errors
✅ All stats show 0
✅ "No tasks found" message appears
✅ Tabs are functional
```

**3. Assign Test Task (Using Script):**
```javascript
// In MongoDB or Node.js console
assignReportToWorker('VERIFIED_REPORT_ID', 'worker@example.com');
```

**4. Verify Task Appears:**
```
✅ Task appears in "Assigned" tab
✅ Task shows correct waste type and weight
✅ Reporter name and location display
✅ Stats update correctly
✅ Image displays (if available)
```

**5. Test Status Updates:**
```
1. Click "Start Collection"
   ✅ Status changes to "In Progress"
   ✅ Task moves to "In Progress" tab
   ✅ Stats update

2. Click "Mark as Completed"
   ✅ Status changes to "Completed"
   ✅ Task moves to "Completed" tab
   ✅ Stats update (including total weight)
```

**6. Test Navigation:**
```
Click "Get Directions"
✅ Opens Google Maps in new tab
✅ Correct coordinates used
✅ Shows location on map
```

---

## Common Issues & Solutions

### Issue 1: "No authentication token found"
**Solution:** Ensure user is logged in and token is stored in localStorage

### Issue 2: "Tasks not appearing"
**Cause:** No tasks assigned to worker
**Solution:** Use assignment script to assign verified reports

### Issue 3: "Failed to update task status"
**Causes:**
- Invalid status transition
- Network error
- Task doesn't belong to worker
**Solution:** Check console for error details

### Issue 4: Statistics not updating
**Solution:** Ensure `fetchTasks()` is called after status updates

---

## Performance Optimization

### Database Indexes
```javascript
WorkerTaskSchema.index({ workerId: 1, status: 1 }); // Fast filtering
WorkerTaskSchema.index({ reportId: 1 }); // Prevent duplicates
```

### API Optimization
- Only populates necessary fields
- Sorts by most recent first
- Uses lean queries where possible
- Calculates stats in single query

### Frontend Optimization
- Loading states prevent multiple API calls
- Optimistic UI updates
- Image lazy loading
- Responsive design for mobile

---

## Future Enhancements

### Phase 1 - Admin UI
- [ ] Task assignment interface in admin dashboard
- [ ] Bulk assignment by location/area
- [ ] Worker performance metrics
- [ ] Task reassignment capability

### Phase 2 - Advanced Features
- [ ] Route optimization for multiple pickups
- [ ] Real-time GPS tracking
- [ ] Photo upload for proof of collection
- [ ] Digital signatures
- [ ] Push notifications for new tasks

### Phase 3 - Analytics
- [ ] Worker efficiency reports
- [ ] Collection time analytics
- [ ] Route completion statistics
- [ ] Monthly performance reports

### Phase 4 - Logistics
- [ ] Vehicle management
- [ ] Fuel tracking
- [ ] Multi-worker teams
- [ ] Shift scheduling
- [ ] Inventory management

---

## Summary

✅ **Implemented:**
- WorkerTask database model with proper schema
- Complete API endpoints (GET & PUT)
- JWT authentication and authorization
- Worker dashboard with real data
- Task status management workflow
- Statistics tracking
- Google Maps integration
- Assignment helper scripts

✅ **Working Features:**
- Workers can view assigned tasks
- Status updates (assigned → in-progress → completed)
- Real-time statistics
- Navigation to collection locations
- Responsive UI with proper error handling

✅ **Ready for Production:**
- Proper error handling
- Security measures
- Database indexes
- TypeScript type safety
- Comprehensive documentation

The worker system is now fully functional with real data and proper API integration! 🚛✨
