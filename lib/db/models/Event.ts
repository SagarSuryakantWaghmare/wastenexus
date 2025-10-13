import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  type: 'awareness' | 'cleanup' | 'workshop' | 'tree_planting';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  date: Date;
  duration: number; // in hours
  maxParticipants: number;
  participants: mongoose.Types.ObjectId[];
  organizer: mongoose.Types.ObjectId;
  imageUrl?: string;
  pointsReward: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['awareness', 'cleanup', 'workshop', 'tree_planting'], required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  pointsReward: { type: Number, default: 50 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
