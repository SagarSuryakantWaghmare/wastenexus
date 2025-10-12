import mongoose, { Schema, Document } from 'mongoose';

  userId: mongoose.Types.ObjectId;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  wasteType: string;
  amount: string;
  imageUrl?: string;
  verificationResults?: any;
  status: string;
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  wasteType: { type: String, required: true },
  amount: { type: String, required: true },
  imageUrl: { type: String },
  verificationResults: { type: Schema.Types.Mixed },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
