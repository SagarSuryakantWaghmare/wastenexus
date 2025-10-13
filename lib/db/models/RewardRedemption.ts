import mongoose, { Schema, Document } from 'mongoose';

export interface IRewardRedemption extends Document {
  userId: mongoose.Types.ObjectId;
  rewardItemId: mongoose.Types.ObjectId;
  pointsSpent: number;
  status: 'pending' | 'approved' | 'delivered' | 'rejected';
  redemptionCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RewardRedemptionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rewardItemId: { type: Schema.Types.ObjectId, ref: 'RewardItem', required: true },
  pointsSpent: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'delivered', 'rejected'], default: 'pending' },
  redemptionCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.RewardRedemption || mongoose.model<IRewardRedemption>('RewardRedemption', RewardRedemptionSchema);
