import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  wasteType: string;
  amount: string;
  quantity?: number;
  imageUrl?: string;
  verificationResults?: any;
  status: 'pending' | 'assigned' | 'collected' | 'segregated' | 'recycled' | 'energy_recovery';
  assignedTo?: mongoose.Types.ObjectId;
  recyclingPlant?: string;
  impact?: {
    co2Saved: number;
    treesEquivalent: number;
    waterSaved: number;
  };
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  wasteType: { type: String, required: true },
  amount: { type: String, required: true },
  quantity: { type: Number },
  imageUrl: { type: String },
  verificationResults: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'assigned', 'collected', 'segregated', 'recycled', 'energy_recovery'], default: 'pending' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  recyclingPlant: { type: String },
  impact: {
    co2Saved: { type: Number, default: 0 },
    treesEquivalent: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 },
  },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
