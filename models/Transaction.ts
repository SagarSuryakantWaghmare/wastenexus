import { Schema, model, models } from 'mongoose';

export interface ITransaction {
  _id: string;
  userId: Schema.Types.ObjectId;
  type: 'report_verified' | 'job_verified' | 'marketplace_approved' | 'task_completed' | 'event_participation' | 'manual_adjustment';
  amount: number;
  description: string;
  referenceId?: Schema.Types.ObjectId; // ID of related report, job, marketplace item, etc.
  referenceModel?: string; // Model name: 'Report', 'Job', 'MarketplaceItem', etc.
  adminId?: Schema.Types.ObjectId; // Admin who approved/triggered the transaction
  metadata?: {
    weightKg?: number;
    wasteType?: string;
    category?: string;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['report_verified', 'job_verified', 'marketplace_approved', 'task_completed', 'event_participation', 'manual_adjustment'],
      required: [true, 'Transaction type is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
    },
    description: {
      type: String,
      required: [true, 'Transaction description is required'],
      trim: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    referenceModel: {
      type: String,
      trim: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, createdAt: -1 });
TransactionSchema.index({ referenceId: 1, referenceModel: 1 });

const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
