import mongoose, { Schema, model, models } from 'mongoose';

export interface IJob {
  _id: string;
  clientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'industry' | 'home' | 'other';
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  wasteType: string[];
  estimatedWeight?: number;
  status: 'pending' | 'verified' | 'rejected' | 'assigned' | 'in-progress' | 'completed';
  assignedWorkerId?: mongoose.Types.ObjectId;
  budget?: number;
  urgency: 'low' | 'medium' | 'high';
  scheduledDate?: Date;
  completedDate?: Date;
  adminNotes?: string;
  clientContact?: {
    name: string;
    phone: string;
    email: string;
  };
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['industry', 'home', 'other'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Location address is required'],
      },
      latitude: Number,
      longitude: Number,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    wasteType: {
      type: [String],
      required: [true, 'At least one waste type is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one waste type must be specified',
      },
    },
    estimatedWeight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'assigned', 'in-progress', 'completed'],
      default: 'pending',
    },
    assignedWorkerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    scheduledDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    clientContact: {
      name: String,
      phone: String,
      email: String,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
JobSchema.index({ clientId: 1, status: 1 });
JobSchema.index({ status: 1, category: 1 });
JobSchema.index({ assignedWorkerId: 1, status: 1 });
JobSchema.index({ createdAt: -1 });

const Job = models.Job || model<IJob>('Job', JobSchema);

export default Job;
