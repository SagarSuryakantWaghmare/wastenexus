import mongoose, { Schema, model, models } from 'mongoose';

export interface IEvent {
  _id: string;
  championId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  date: Date;
  participants: mongoose.Types.ObjectId[];
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    championId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Champion ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
EventSchema.index({ date: 1, status: 1 });
EventSchema.index({ championId: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
