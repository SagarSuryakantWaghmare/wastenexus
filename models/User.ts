import { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'champion' | 'admin' | 'worker';
  profileImage?: string;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['client', 'champion', 'admin', 'worker'],
        message: '{VALUE} is not a valid role',
      },
      required: [true, 'Please specify a role'],
      default: 'client',
    },
    profileImage: {
      type: String,
      default: '',
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ totalPoints: -1 }); // For leaderboard queries
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// Compound index for role-based queries with sorting
UserSchema.index({ role: 1, totalPoints: -1 });

// Prevent model recompilation in development
const User = models.User || model<IUser>('User', UserSchema);

export default User;
