import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
  name: string;
  title: string;
  location: string;
  date: Date;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema<IGallery> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Gallery item name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [60, 'Title must not exceed 60 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [150, 'Location must not exceed 150 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description must not exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
GallerySchema.index({ isActive: 1, order: 1 });
GallerySchema.index({ createdAt: -1 });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
