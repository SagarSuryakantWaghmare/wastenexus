import mongoose, { Schema, Document } from 'mongoose';

export interface ICollectedWaste extends Document {
  reportId: mongoose.Types.ObjectId;
  collectorId: mongoose.Types.ObjectId;
  collectionDate: Date;
  status: string;
}

const CollectedWasteSchema: Schema = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
  collectorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collectionDate: { type: Date, default: Date.now },
  status: { type: String, default: 'verified' },
});

export default mongoose.models.CollectedWaste || mongoose.model<ICollectedWaste>('CollectedWaste', CollectedWasteSchema);
