import mongoose, { Schema, Document } from 'mongoose';

export interface IRewardItem extends Document {
  name: string;
  description: string;
  category: 'bill_discount' | 'transport' | 'eco_products' | 'other';
  pointsCost: number;
  imageUrl?: string;
  stock: number;
  redemptionInfo: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RewardItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['bill_discount', 'transport', 'eco_products', 'other'], required: true },
  pointsCost: { type: Number, required: true },
  imageUrl: { type: String },
  stock: { type: Number, default: -1 }, // -1 means unlimited
  redemptionInfo: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.RewardItem || mongoose.model<IRewardItem>('RewardItem', RewardItemSchema);
