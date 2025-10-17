import { Schema, model, models } from 'mongoose';

export interface IWorkerTask {
  _id: string;
  reportId: Schema.Types.ObjectId;
  workerId: Schema.Types.ObjectId;
  status: 'assigned' | 'in-progress' | 'completed';
  assignedDate: Date;
  startedDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerTaskSchema = new Schema<IWorkerTask>(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['assigned', 'in-progress', 'completed'],
      default: 'assigned',
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    startedDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
WorkerTaskSchema.index({ workerId: 1, status: 1 });
WorkerTaskSchema.index({ reportId: 1 });

// Delete the model if it exists to ensure schema updates are applied
if (models.WorkerTask) {
  delete models.WorkerTask;
}

const WorkerTask = model<IWorkerTask>('WorkerTask', WorkerTaskSchema);

export default WorkerTask;
