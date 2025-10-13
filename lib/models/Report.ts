import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  wasteType: {
    type: String,
    required: true,
  },
  isRecyclable: {
    type: Boolean,
    required: true,
  },
  quantity: Number,
  recyclability: Number,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  aiAnalysis: {
    wasteType: String,
    isRecyclable: Boolean,
    materials: [String],
    additionalInfo: String,
    quantity: Number,
    recyclability: Number,
  },
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
