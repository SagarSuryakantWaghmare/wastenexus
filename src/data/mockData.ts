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