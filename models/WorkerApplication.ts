import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkerApplication extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  photo?: {
    public_id: string;
    secure_url: string;
  };
  aadhaarCard?: {
    public_id: string;
    secure_url: string;
  };
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  userId?: mongoose.Types.ObjectId;
  appliedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerApplicationSchema = new Schema<IWorkerApplication>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    locationCoordinates: {
      lat: Number,
      lng: Number,
    },
    photo: {
      public_id: String,
      secure_url: String,
    },
    aadhaarCard: {
      public_id: String,
      secure_url: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: Date,
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
WorkerApplicationSchema.index({ email: 1 });
WorkerApplicationSchema.index({ status: 1 });
WorkerApplicationSchema.index({ appliedAt: -1 });

export default mongoose.models.WorkerApplication ||
  mongoose.model<IWorkerApplication>('WorkerApplication', WorkerApplicationSchema);
