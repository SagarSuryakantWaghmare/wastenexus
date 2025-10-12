import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  collectionInfo: string;
  points: number;
  level: number;
  isAvailable: boolean;
  createdAt: Date;
}

const RewardSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  collectionInfo: { type: String },
  points: { type: Number, required: true },
  level: { type: Number, default: 1 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Reward || mongoose.model<IReward>('Reward', RewardSchema);
