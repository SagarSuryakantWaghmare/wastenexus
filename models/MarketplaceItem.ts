import { Schema, model, models, Document } from 'mongoose';

export interface IMarketplaceItem extends Document {
  _id: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Books' | 'Toys' | 'Appliances' | 'Sports' | 'Home Decor' | 'Kitchen' | 'Other';
  condition: 'Like New' | 'Good' | 'Fair' | 'Needs Repair';
  price: number;
  images: string[]; // Cloudinary URLs
  seller: Schema.Types.ObjectId;
  sellerName: string;
  sellerContact: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  rejectionReason?: string;
  buyer?: Schema.Types.ObjectId;
  buyerName?: string;
  buyerContact?: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  views: number;
  favorites: Schema.Types.ObjectId[]; // User IDs who favorited
  tags?: string[];
  isNegotiable: boolean;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: Schema.Types.ObjectId;
  soldAt?: Date;
}

const MarketplaceItemSchema = new Schema<IMarketplaceItem>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Toys', 'Appliances', 'Sports', 'Home Decor', 'Kitchen', 'Other'],
      required: [true, 'Please select a category'],
    },
    condition: {
      type: String,
      enum: ['Like New', 'Good', 'Fair', 'Needs Repair'],
      required: [true, 'Please specify item condition'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      required: [true, 'Please upload at least one image'],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 1 && v.length <= 5;
        },
        message: 'Please provide 1-5 images',
      },
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerContact: {
      type: String,
      required: [true, 'Please provide contact information'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    buyerName: {
      type: String,
    },
    buyerContact: {
      type: String,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide an address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide a city'],
      },
      state: {
        type: String,
        required: [true, 'Please provide a state'],
      },
      pincode: {
        type: String,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    tags: [{
      type: String,
    }],
    isNegotiable: {
      type: Boolean,
      default: true,
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    soldAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
MarketplaceItemSchema.index({ status: 1, createdAt: -1 });
MarketplaceItemSchema.index({ category: 1, status: 1 });
MarketplaceItemSchema.index({ seller: 1, status: 1 });
MarketplaceItemSchema.index({ 'location.city': 1, status: 1 });
MarketplaceItemSchema.index({ price: 1, status: 1 });

// Text index for search
MarketplaceItemSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Prevent model recompilation in development
export default models.MarketplaceItem || model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);
