import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplaceItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'furniture' | 'electronics' | 'books' | 'clothes' | 'other';
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'needs_repair';
  images: string[];
  aiAnalysis?: {
    reuseability: string;
    suggestions: string[];
    estimatedValue: number;
  };
  type: 'donate' | 'exchange' | 'sell';
  price?: number; // in points if exchange/sell
  status: 'available' | 'reserved' | 'completed' | 'cancelled';
  interestedUsers: mongoose.Types.ObjectId[];
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['furniture', 'electronics', 'books', 'clothes', 'other'], required: true },
  condition: { type: String, enum: ['new', 'like_new', 'good', 'fair', 'needs_repair'], required: true },
  images: [{ type: String }],
  aiAnalysis: {
    reuseability: { type: String },
    suggestions: [{ type: String }],
    estimatedValue: { type: Number },
  },
  type: { type: String, enum: ['donate', 'exchange', 'sell'], required: true },
  price: { type: Number },
  status: { type: String, enum: ['available', 'reserved', 'completed', 'cancelled'], default: 'available' },
  interestedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  location: {
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.MarketplaceItem || mongoose.model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);
