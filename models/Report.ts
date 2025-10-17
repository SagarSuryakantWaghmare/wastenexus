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
    },
    type: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: ['plastic', 'cardboard', 'e-waste', 'metal', 'glass', 'organic', 'paper'],
      trim: true,
    },
    weightKg: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0.1, 'Weight must be at least 0.1 kg'],
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    pointsAwarded: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    aiClassification: {
      type: {
        type: String,
      },
      confidence: Number,
      description: String,
    },
    location: {
      latitude: Number,
      longitude: Number,
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

// Index for faster queries
ReportSchema.index({ userId: 1, status: 1 });
ReportSchema.index({ createdAt: -1 });

const Report = models.Report || model<IReport>('Report', ReportSchema);

export default Report;
