import { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'champion' | 'admin' | 'worker';
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
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['client', 'champion', 'admin', 'worker'],
      required: [true, 'Please specify a role'],
      default: 'client',
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
// Delete the model if it exists to ensure schema updates are applied
if (models.User) {
  delete models.User;
}

const User = model<IUser>('User', UserSchema);

export default User;
