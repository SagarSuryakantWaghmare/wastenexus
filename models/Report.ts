import mongoose, { Schema, model, models } from 'mongoose';

export interface IReport {
  _id: string;
  userId: mongoose.Types.ObjectId;
  type: string;
  weightKg: number;
  status: 'pending' | 'verified' | 'rejected';
  pointsAwarded: number;
  imageUrl?: string;
  aiClassification?: {
    type: string;
    confidence: number;
    description: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: {
        values: ['plastic', 'cardboard', 'e-waste', 'metal', 'glass', 'organic', 'paper'],
        message: '{VALUE} is not a valid waste type',
      },
      trim: true,
      lowercase: true,
    },
    weightKg: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0.1, 'Weight must be at least 0.1 kg'],
      max: [10000, 'Weight must not exceed 10000 kg'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'verified', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
      index: true,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
      min: [0, 'Points awarded cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Image URL must be a valid HTTP(S) URL',
      },
    },
    aiClassification: {
      type: {
        type: String,
      },
      confidence: {
        type: Number,
        min: [0, 'Confidence must be between 0 and 1'],
        max: [1, 'Confidence must be between 0 and 1'],
      },
      description: String,
    },
    location: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ReportSchema.index({ userId: 1, status: 1 }); // User's reports by status
ReportSchema.index({ status: 1, createdAt: -1 }); // Pending reports sorted by date
ReportSchema.index({ createdAt: -1 }); // Recent reports
ReportSchema.index({ type: 1, status: 1 }); // Reports by type and status
ReportSchema.index({ userId: 1, createdAt: -1 }); // User's recent reports

// Compound index for admin dashboard queries
ReportSchema.index({ status: 1, date: -1 });

const Report = models.Report || model<IReport>('Report', ReportSchema);

export default Report;
