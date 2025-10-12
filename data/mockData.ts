// Mock data for the citizen dashboard
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'worker' | 'admin' | 'green_champion';
  trainingProgress: number;
  greenCredits: number;
  certificatesEarned: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: [number, number];
  };
  joinedDate: string;
  lastActive: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'segregation' | 'collection' | 'recycling' | 'awareness';
  lessons: Lesson[];
  certificate?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  duration: number;
  completed: boolean;
  content?: string;
  videoUrl?: string;
  quiz?: Quiz;
}

export interface Quiz {
  questions: Question[];
  passingScore: number;
  userScore?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WasteReport {
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  wasteTypes: string[];
  description: string;
  status: 'reported' | 'assigned' | 'collected' | 'verified';
  reportedAt: string;
  collectedAt?: string;
  citizenId: string;
  workerId?: string;
  severity: 'low' | 'medium' | 'high';
  aiClassification?: {
    confidence: number;
    suggestions: string[];
  };
}

export interface GreenCredit {
  id: string;
  amount: number;
  type: 'earned' | 'redeemed';
  source: 'training' | 'reporting' | 'segregation' | 'collection';
  description: string;
  date: string;
  relatedId?: string; // ID of related training, report, etc.
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  issuedDate: string;
  moduleId: string;
  score: number;
  verificationId: string;
  blockchainHash?: string;
  downloadUrl: string;
  shareUrl: string;
}

// Mock Data
export const mockUser: User = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'citizen',
  trainingProgress: 75,
  greenCredits: 450,
  certificatesEarned: 3,
  address: {
    street: '123 MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    coordinates: [12.9352, 77.6245]
  },
  joinedDate: '2024-01-15',
  lastActive: '2024-09-13'
};

export const mockTrainingModules: TrainingModule[] = [
  {
    id: '1',
    title: 'Waste Segregation Fundamentals',
    description: 'Learn the basics of proper waste segregation for a cleaner environment',
    duration: 45,
    progress: 100,
    status: 'completed',
    difficulty: 'beginner',
    category: 'segregation',
    certificate: 'cert_001',
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to Waste Types',
        type: 'video',
        duration: 10,
        completed: true,
        videoUrl: '/videos/waste-types.mp4'
      },
      {
        id: '1-2',
        title: 'Segregation Techniques',
        type: 'interactive',
        duration: 15,
        completed: true
      },
      {
        id: '1-3',
        title: 'Knowledge Assessment',
        type: 'quiz',
        duration: 10,
        completed: true,
        quiz: {
          questions: [],
          passingScore: 80,
          userScore: 85
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced Recycling Methods',
    description: 'Understand advanced recycling techniques and their environmental impact',
    duration: 60,
    progress: 60,
    status: 'in_progress',
    difficulty: 'intermediate',
    category: 'recycling',
    lessons: [
      {
        id: '2-1',
        title: 'Plastic Recycling',
        type: 'video',
        duration: 20,
        completed: true
      },
      {
        id: '2-2',
        title: 'Metal and Glass Processing',
        type: 'text',
        duration: 15,
        completed: true
      },
      {
        id: '2-3',
        title: 'Composting Organic Waste',
        type: 'interactive',
        duration: 25,
        completed: false
      }
    ]
  },
  {
    id: '3',
    title: 'Community Waste Management',
    description: 'Learn how to organize community-level waste management initiatives',
    duration: 90,
    progress: 0,
    status: 'not_started',
    difficulty: 'advanced',
    category: 'awareness',
    lessons: [
      {
        id: '3-1',
        title: 'Community Leadership',
        type: 'video',
        duration: 30,
        completed: false
      },
      {
        id: '3-2',
        title: 'Organizing Clean-up Drives',
        type: 'text',
        duration: 20,
        completed: false
      },
      {
        id: '3-3',
        title: 'Awareness Campaigns',
        type: 'interactive',
        duration: 40,
        completed: false
      }
    ]
  }
];

export const mockWasteReports: WasteReport[] = [
  {
    id: 'wr_001',
    location: {
      lat: 12.9352,
      lng: 77.6245,
      address: 'Near Bus Stop, MG Road, Koramangala, Bangalore'
    },
    photos: ['/images/waste-report-1.jpg', '/images/waste-report-2.jpg'],
    wasteTypes: ['plastic', 'organic', 'paper'],
    description: 'Overflowing bins with mixed waste. Urgent attention needed.',
    status: 'collected',
    reportedAt: '2024-09-10T14:30:00Z',
    collectedAt: '2024-09-11T09:15:00Z',
    citizenId: '1',
    workerId: 'worker_123',
    severity: 'high',
    aiClassification: {
      confidence: 0.92,
      suggestions: ['Separate organic waste', 'Use smaller plastic containers']
    }
  },
  {
    id: 'wr_002',
    location: {
      lat: 12.9351,
      lng: 77.6244,
      address: 'Park Entrance, Koramangala 4th Block, Bangalore'
    },
    photos: ['/images/waste-report-3.jpg'],
    wasteTypes: ['plastic'],
    description: 'Plastic bottles scattered in the park area.',
    status: 'assigned',
    reportedAt: '2024-09-12T16:45:00Z',
    citizenId: '1',
    workerId: 'worker_456',
    severity: 'medium',
    aiClassification: {
      confidence: 0.88,
      suggestions: ['Install more bins in park area']
    }
  }
];

export const mockGreenCredits: GreenCredit[] = [
  {
    id: 'gc_001',
    amount: 50,
    type: 'earned',
    source: 'training',
    description: 'Completed Waste Segregation Fundamentals course',
    date: '2024-09-01T10:00:00Z',
    relatedId: '1'
  },
  {
    id: 'gc_002',
    amount: 25,
    type: 'earned',
    source: 'reporting',
    description: 'Reported waste issue at MG Road',
    date: '2024-09-10T14:30:00Z',
    relatedId: 'wr_001'
  },
  {
    id: 'gc_003',
    amount: 30,
    type: 'earned',
    source: 'segregation',
    description: 'Perfect segregation score for the week',
    date: '2024-09-08T00:00:00Z'
  },
  {
    id: 'gc_004',
    amount: -20,
    type: 'redeemed',
    source: 'collection',
    description: 'Redeemed for eco-friendly products',
    date: '2024-09-05T15:20:00Z'
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert_001',
    title: 'Waste Segregation Expert',
    description: 'Successfully completed the Waste Segregation Fundamentals course with 85% score',
    issuedDate: '2024-09-01T10:00:00Z',
    moduleId: '1',
    score: 85,
    verificationId: 'WN-2024-001',
    blockchainHash: '0x1234567890abcdef...',
    downloadUrl: '/certificates/cert_001.pdf',
    shareUrl: '/certificates/share/cert_001'
  },
  {
    id: 'cert_002',
    title: 'Community Leader',
    description: 'Completed advanced community waste management training',
    issuedDate: '2024-08-15T14:30:00Z',
    moduleId: '3',
    score: 92,
    verificationId: 'WN-2024-002',
    downloadUrl: '/certificates/cert_002.pdf',
    shareUrl: '/certificates/share/cert_002'
  },
  {
    id: 'cert_003',
    title: 'Recycling Specialist',
    description: 'Mastered advanced recycling methods and techniques',
    issuedDate: '2024-07-20T09:45:00Z',
    moduleId: '2',
    score: 88,
    verificationId: 'WN-2024-003',
    downloadUrl: '/certificates/cert_003.pdf',
    shareUrl: '/certificates/share/cert_003'
  }
];

// Statistics for dashboard
export const mockStats = {
  totalUsers: 15420,
  wasteCollected: '2,450 kg',
  co2Saved: '1,200 kg',
  treesPlanted: 45,
  completionRate: 78,
  avgScore: 85
};

// Worker-specific types and data
export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'worker';
  avatar_url?: string;
  assigned_area: string;
  vehicle_id?: string;
  created_at: string;
  employee_id: string;
  shift: 'morning' | 'afternoon' | 'night';
  experience_years: number;
  rating: number;
  completed_collections: number;
  safety_score: number;
}

export interface Route {
  id: string;
  date: string;
  area: string;
  optimized_path: Array<{lat: number, lng: number, address: string}>;
  vehicle_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_worker_id: string;
  start_time?: string;
  end_time?: string;
  estimated_duration: number;
  distance_km: number;
  fuel_estimate: number;
}

export interface CollectionTask {
  id: string;
  route_id: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  bin_id?: string;
  waste_type: string[];
  status: 'pending' | 'collected' | 'missed' | 'issue_reported' | 'in_progress';
  assigned_worker_id: string;
  scheduled_time: string;
  collected_at?: string;
  photo_url?: string;
  issue_description?: string;
  weight_kg?: number;
  priority: 'low' | 'medium' | 'high';
  estimated_time: number;
}

export interface SafetyChecklistItem {
  id: string;
  name: string;
  category: 'ppe' | 'vehicle' | 'equipment' | 'health';
  required: boolean;
  checked: boolean;
  notes?: string;
}

export interface SafetyChecklist {
  id: string;
  worker_id: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  pre_shift_checks: SafetyChecklistItem[];
  post_shift_checks: SafetyChecklistItem[];
  issues_found: string;
  status: 'completed' | 'pending' | 'failed';
  submitted_at?: string;
  supervisor_approval?: boolean;
}

export interface PerformanceRecord {
  id: string;
  worker_id: string;
  date: string;
  tasks_assigned: number;
  tasks_completed: number;
  tasks_missed: number;
  average_collection_time: number;
  total_distance_km: number;
  fuel_efficiency: number;
  safety_score: number;
  customer_feedback: number;
  supervisor_rating: number;
  incidents: number;
  overtime_hours: number;
  feedback: string;
}

export interface Vehicle {
  id: string;
  registration_number: string;
  type: 'truck' | 'van' | 'compactor';
  capacity_kg: number;
  fuel_type: 'diesel' | 'electric' | 'cng';
  status: 'available' | 'in_use' | 'maintenance' | 'breakdown';
  last_maintenance: string;
  mileage: number;
  assigned_worker_id?: string;
}

// Mock Worker Data
export const mockWorker: WorkerProfile = {
  id: 'worker_001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@wastenexus.com',
  phone: '+91 98765 43211',
  role: 'worker',
  avatar_url: '/avatars/worker.jpg',
  assigned_area: 'Koramangala Zone-A',
  vehicle_id: 'vehicle_001',
  created_at: '2024-01-10T00:00:00Z',
  employee_id: 'WN2024001',
  shift: 'morning',
  experience_years: 3,
  rating: 4.7,
  completed_collections: 2847,
  safety_score: 96
};

export const mockRoutes: Route[] = [
  {
    id: 'route_001',
    date: '2024-09-14',
    area: 'Koramangala Zone-A',
    optimized_path: [
      { lat: 12.9352, lng: 77.6245, address: 'Koramangala 4th Block' },
      { lat: 12.9368, lng: 77.6127, address: 'Koramangala 5th Block' },
      { lat: 12.9298, lng: 77.6270, address: 'Koramangala 6th Block' },
      { lat: 12.9344, lng: 77.6186, address: 'Koramangala 7th Block' },
      { lat: 12.9279, lng: 77.6271, address: 'Koramangala 8th Block' }
    ],
    vehicle_id: 'vehicle_001',
    status: 'in_progress',
    assigned_worker_id: 'worker_001',
    start_time: '2024-09-14T06:00:00Z',
    estimated_duration: 240,
    distance_km: 12.5,
    fuel_estimate: 2.8
  },
  {
    id: 'route_002',
    date: '2024-09-15',
    area: 'Koramangala Zone-A',
    optimized_path: [
      { lat: 12.9325, lng: 77.6201, address: 'Koramangala 1st Block' },
      { lat: 12.9341, lng: 77.6198, address: 'Koramangala 2nd Block' },
      { lat: 12.9356, lng: 77.6215, address: 'Koramangala 3rd Block' }
    ],
    vehicle_id: 'vehicle_001',
    status: 'pending',
    assigned_worker_id: 'worker_001',
    estimated_duration: 180,
    distance_km: 8.2,
    fuel_estimate: 1.9
  }
];

export const mockCollectionTasks: CollectionTask[] = [
  {
    id: 'task_001',
    route_id: 'route_001',
    location: {
      address: 'MG Road Junction, Koramangala 4th Block',
      lat: 12.9352,
      lng: 77.6245
    },
    bin_id: 'bin_001',
    waste_type: ['organic', 'plastic', 'paper'],
    status: 'collected',
    assigned_worker_id: 'worker_001',
    scheduled_time: '2024-09-14T06:30:00Z',
    collected_at: '2024-09-14T06:28:00Z',
    photo_url: '/collection-proof/task_001.jpg',
    weight_kg: 45,
    priority: 'medium',
    estimated_time: 15
  },
  {
    id: 'task_002',
    route_id: 'route_001',
    location: {
      address: 'Forum Mall Entrance, Koramangala 5th Block',
      lat: 12.9368,
      lng: 77.6127
    },
    bin_id: 'bin_002',
    waste_type: ['plastic', 'paper', 'metal'],
    status: 'in_progress',
    assigned_worker_id: 'worker_001',
    scheduled_time: '2024-09-14T07:00:00Z',
    priority: 'high',
    estimated_time: 20
  },
  {
    id: 'task_003',
    route_id: 'route_001',
    location: {
      address: 'Koramangala Metro Station, 6th Block',
      lat: 12.9298,
      lng: 77.6270
    },
    waste_type: ['organic', 'paper'],
    status: 'pending',
    assigned_worker_id: 'worker_001',
    scheduled_time: '2024-09-14T07:30:00Z',
    priority: 'low',
    estimated_time: 12
  },
  {
    id: 'task_004',
    route_id: 'route_001',
    location: {
      address: 'Sony World Signal, Koramangala 7th Block',
      lat: 12.9344,
      lng: 77.6186
    },
    waste_type: ['plastic', 'organic'],
    status: 'missed',
    assigned_worker_id: 'worker_001',
    scheduled_time: '2024-09-14T08:00:00Z',
    issue_description: 'Bin was locked, unable to access',
    priority: 'medium',
    estimated_time: 15
  }
];

export const mockSafetyChecklist: SafetyChecklist = {
  id: 'safety_001',
  worker_id: 'worker_001',
  date: '2024-09-14',
  shift: 'morning',
  pre_shift_checks: [
    { id: 'ppe_1', name: 'Safety Helmet', category: 'ppe', required: true, checked: true },
    { id: 'ppe_2', name: 'Safety Gloves', category: 'ppe', required: true, checked: true },
    { id: 'ppe_3', name: 'High-Vis Vest', category: 'ppe', required: true, checked: true },
    { id: 'ppe_4', name: 'Safety Boots', category: 'ppe', required: true, checked: true },
    { id: 'ppe_5', name: 'Face Mask', category: 'ppe', required: true, checked: true },
    { id: 'vehicle_1', name: 'Vehicle Inspection', category: 'vehicle', required: true, checked: true },
    { id: 'vehicle_2', name: 'Fuel Level Check', category: 'vehicle', required: true, checked: true },
    { id: 'vehicle_3', name: 'Tire Condition', category: 'vehicle', required: true, checked: true },
    { id: 'equipment_1', name: 'Collection Tools', category: 'equipment', required: true, checked: true },
    { id: 'equipment_2', name: 'Cleaning Supplies', category: 'equipment', required: true, checked: true },
    { id: 'health_1', name: 'Health Self-Assessment', category: 'health', required: true, checked: true }
  ],
  post_shift_checks: [
    { id: 'post_1', name: 'Equipment Return', category: 'equipment', required: true, checked: false },
    { id: 'post_2', name: 'Vehicle Cleaning', category: 'vehicle', required: true, checked: false },
    { id: 'post_3', name: 'Incident Reporting', category: 'health', required: false, checked: false },
    { id: 'post_4', name: 'PPE Condition Check', category: 'ppe', required: true, checked: false }
  ],
  issues_found: '',
  status: 'pending'
};

export const mockPerformanceRecords: PerformanceRecord[] = [
  {
    id: 'perf_001',
    worker_id: 'worker_001',
    date: '2024-09-13',
    tasks_assigned: 12,
    tasks_completed: 11,
    tasks_missed: 1,
    average_collection_time: 14.5,
    total_distance_km: 15.3,
    fuel_efficiency: 8.2,
    safety_score: 98,
    customer_feedback: 4.6,
    supervisor_rating: 4.8,
    incidents: 0,
    overtime_hours: 0.5,
    feedback: 'Excellent performance. Handled difficult collection at Forum Mall efficiently.'
  },
  {
    id: 'perf_002',
    worker_id: 'worker_001',
    date: '2024-09-12',
    tasks_assigned: 10,
    tasks_completed: 10,
    tasks_missed: 0,
    average_collection_time: 13.2,
    total_distance_km: 12.8,
    fuel_efficiency: 9.1,
    safety_score: 95,
    customer_feedback: 4.7,
    supervisor_rating: 4.9,
    incidents: 0,
    overtime_hours: 0,
    feedback: 'Perfect completion rate. Good time management.'
  },
  {
    id: 'perf_003',
    worker_id: 'worker_001',
    date: '2024-09-11',
    tasks_assigned: 14,
    tasks_completed: 12,
    tasks_missed: 2,
    average_collection_time: 16.8,
    total_distance_km: 18.5,
    fuel_efficiency: 7.5,
    safety_score: 92,
    customer_feedback: 4.3,
    supervisor_rating: 4.5,
    incidents: 1,
    overtime_hours: 1.2,
    feedback: 'Two bins were inaccessible due to parking issues. Reported to authorities.'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle_001',
    registration_number: 'KA01AB1234',
    type: 'compactor',
    capacity_kg: 5000,
    fuel_type: 'diesel',
    status: 'in_use',
    last_maintenance: '2024-09-01',
    mileage: 45678,
    assigned_worker_id: 'worker_001'
  },
  {
    id: 'vehicle_002',
    registration_number: 'KA01CD5678',
    type: 'truck',
    capacity_kg: 3000,
    fuel_type: 'cng',
    status: 'available',
    last_maintenance: '2024-08-28',
    mileage: 32145
  }
];

// Green Champions Mock Data
export interface GreenChampion {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  level: 'Junior Champion' | 'Senior Champion' | 'Lead Champion';
  areasAssigned: string[];
  totalCitizens: number;
  monthlyScore: number;
  badge: string;
  joinDate: string;
  lastActive: string;
  avatar?: string;
}

export interface AreaMonitoring {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'issues';
  bins: number;
  fullBins: number;
  lastCollection: string;
  nextCollection: string;
  citizens: number;
  complianceScore: number;
  issues: number;
  coordinates: { lat: number; lng: number };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'bin_full' | 'violation' | 'maintenance' | 'emergency';
  message: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface ComplianceAudit {
  id: string;
  area: string;
  date: string;
  auditor: string;
  score: number;
  status: 'completed' | 'pending' | 'review_required';
  violations: number;
  improvements: number;
  nextAudit: string;
  categories: {
    segregation: number;
    binMaintenance: number;
    citizenCompliance: number;
    collectionTiming: number;
  };
}

export interface Violation {
  id: string;
  type: 'improper_segregation' | 'overflowing_bin' | 'missed_collection' | 'contamination';
  severity: 'low' | 'medium' | 'high';
  area: string;
  reportedBy: string;
  date: string;
  status: 'pending' | 'resolved' | 'escalated';
  description: string;
  action: string;
  resolvedDate?: string;
  photos?: string[];
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  completions: number;
  rewards: string;
  duration: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed' | 'ending_soon';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'segregation' | 'community' | 'composting' | 'awareness';
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  organizer: string;
  type: 'meetup' | 'workshop' | 'training' | 'cleanup';
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface CitizenLeaderboard {
  rank: number;
  name: string;
  area: string;
  points: number;
  level: 'Eco Beginner' | 'Eco Warrior' | 'Green Guardian' | 'Eco Champion';
  badges: number;
  streak: number;
  avatar?: string;
  improvement: string;
}

export interface SmartBin {
  id: string;
  location: string;
  fillLevel: number;
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: string;
  temperature: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  type: 'organic' | 'recyclable' | 'general';
}

// Mock Green Champions data
export const mockGreenChampion: GreenChampion = {
  id: 'gc-001',
  name: 'Priya Sharma',
  employeeId: 'GC-2024-001',
  email: 'priya.sharma@wastenexus.com',
  phone: '+91 98765 43210',
  level: 'Senior Champion',
  areasAssigned: ['sector-15-a', 'sector-12-b', 'sector-18-c'],
  totalCitizens: 4580,
  monthlyScore: 94,
  badge: 'Environmental Guardian',
  joinDate: '2023-08-15',
  lastActive: '2024-09-15T10:30:00Z'
};

export const mockAreasData: AreaMonitoring[] = [
  {
    id: 'area-1',
    name: 'Sector 15 - Block A',
    status: 'active',
    bins: 24,
    fullBins: 3,
    lastCollection: '2 hours ago',
    nextCollection: 'Tomorrow 9:00 AM',
    citizens: 450,
    complianceScore: 92,
    issues: 1,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    alerts: [
      {
        id: 'alert-001',
        type: 'bin_full',
        message: 'Bin #15A-08 is 95% full',
        time: '30 mins ago',
        severity: 'medium',
        resolved: false
      }
    ]
  },
  {
    id: 'area-2',
    name: 'Sector 12 - Block B',
    status: 'completed',
    bins: 18,
    fullBins: 0,
    lastCollection: '4 hours ago',
    nextCollection: 'Day after tomorrow 10:00 AM',
    citizens: 320,
    complianceScore: 96,
    issues: 0,
    coordinates: { lat: 12.9616, lng: 77.5846 },
    alerts: []
  },
  {
    id: 'area-3',
    name: 'Sector 18 - Block C',
    status: 'issues',
    bins: 30,
    fullBins: 8,
    lastCollection: '6 hours ago',
    nextCollection: 'Today 2:00 PM',
    citizens: 580,
    complianceScore: 78,
    issues: 3,
    coordinates: { lat: 12.9816, lng: 77.6046 },
    alerts: [
      {
        id: 'alert-002',
        type: 'violation',
        message: 'Improper segregation reported',
        time: '1 hour ago',
        severity: 'high',
        resolved: false
      },
      {
        id: 'alert-003',
        type: 'bin_full',
        message: 'Multiple bins reaching capacity',
        time: '2 hours ago',
        severity: 'medium',
        resolved: false
      }
    ]
  }
];

export const mockComplianceAudits: ComplianceAudit[] = [
  {
    id: 'AUDIT-2024-001',
    area: 'Sector 15 - Block A',
    date: '2024-09-15',
    auditor: 'Priya Sharma',
    score: 92,
    status: 'completed',
    violations: 2,
    improvements: 5,
    nextAudit: '2024-10-15',
    categories: {
      segregation: 95,
      binMaintenance: 88,
      citizenCompliance: 94,
      collectionTiming: 90
    }
  },
  {
    id: 'AUDIT-2024-002',
    area: 'Sector 18 - Block C',
    date: '2024-09-14',
    auditor: 'Priya Sharma',
    score: 78,
    status: 'review_required',
    violations: 5,
    improvements: 8,
    nextAudit: '2024-09-21',
    categories: {
      segregation: 72,
      binMaintenance: 85,
      citizenCompliance: 75,
      collectionTiming: 80
    }
  }
];

export const mockViolations: Violation[] = [
  {
    id: 'VIO-2024-045',
    type: 'improper_segregation',
    severity: 'medium',
    area: 'Sector 15 - Block A',
    reportedBy: 'Citizen App',
    date: '2024-09-15',
    status: 'resolved',
    description: 'Mixed organic and plastic waste in green bin',
    action: 'Citizen education provided',
    resolvedDate: '2024-09-15'
  },
  {
    id: 'VIO-2024-046',
    type: 'overflowing_bin',
    severity: 'high',
    area: 'Sector 18 - Block C',
    reportedBy: 'Smart Sensor',
    date: '2024-09-14',
    status: 'pending',
    description: 'Bin exceeding capacity for 24+ hours',
    action: 'Emergency collection scheduled'
  }
];

export const mockCommunityLeaderboard: CitizenLeaderboard[] = [
  {
    rank: 1,
    name: 'Rajesh Kumar',
    area: 'Sector 15 - Block A',
    points: 2850,
    level: 'Eco Champion',
    badges: 12,
    streak: 45,
    improvement: '+150'
  },
  {
    rank: 2,
    name: 'Priya Sharma',
    area: 'Sector 12 - Block B',
    points: 2720,
    level: 'Green Guardian',
    badges: 10,
    streak: 38,
    improvement: '+85'
  },
  {
    rank: 3,
    name: 'Amit Singh',
    area: 'Sector 18 - Block C',
    points: 2650,
    level: 'Green Guardian',
    badges: 9,
    streak: 42,
    improvement: '+120'
  }
];

export const mockCommunityEvents: CommunityEvent[] = [
  {
    id: 'EVT-001',
    title: 'Monthly Green Champions Meetup',
    description: 'Community gathering to discuss environmental initiatives',
    date: '2024-09-25',
    time: '6:00 PM - 8:00 PM',
    location: 'Community Center, Sector 15',
    attendees: 156,
    maxAttendees: 200,
    organizer: 'Priya Sharma',
    type: 'meetup',
    status: 'upcoming'
  },
  {
    id: 'EVT-002',
    title: 'Composting Workshop',
    description: 'Learn home composting techniques from experts',
    date: '2024-09-28',
    time: '10:00 AM - 12:00 PM',
    location: 'Green Park, Sector 12',
    attendees: 89,
    maxAttendees: 150,
    organizer: 'Rajesh Kumar',
    type: 'workshop',
    status: 'upcoming'
  }
];

export const mockCommunityChallsges: CommunityChallenge[] = [
  {
    id: 'CHAL-001',
    title: 'Zero Waste Week',
    description: 'Achieve 100% waste segregation for 7 consecutive days',
    participants: 1250,
    completions: 847,
    rewards: '500 Green Credits + Eco Badge',
    duration: '7 days',
    startDate: '2024-09-20',
    endDate: '2024-09-27',
    status: 'active',
    difficulty: 'medium',
    category: 'segregation'
  },
  {
    id: 'CHAL-002',
    title: 'Community Clean Drive',
    description: 'Organize neighborhood cleanup and report waste hotspots',
    participants: 890,
    completions: 234,
    rewards: '1000 Green Credits + Leader Badge',
    duration: '14 days',
    startDate: '2024-09-15',
    endDate: '2024-09-29',
    status: 'active',
    difficulty: 'hard',
    category: 'community'
  }
];

export const mockSmartBins: SmartBin[] = [
  {
    id: 'BIN-15A-08',
    location: 'Sector 15 - Corner Market',
    fillLevel: 95,
    batteryLevel: 78,
    signalStrength: 85,
    lastUpdate: '5 mins ago',
    temperature: 28,
    status: 'critical',
    type: 'general'
  },
  {
    id: 'BIN-15A-12',
    location: 'Sector 15 - Residential Complex',
    fillLevel: 67,
    batteryLevel: 92,
    signalStrength: 78,
    lastUpdate: '8 mins ago',
    temperature: 26,
    status: 'normal',
    type: 'organic'
  },
  {
    id: 'BIN-15A-15',
    location: 'Sector 15 - Bus Stop',
    fillLevel: 45,
    batteryLevel: 65,
    signalStrength: 90,
    lastUpdate: '3 mins ago',
    temperature: 29,
    status: 'normal',
    type: 'recyclable'
  }
];