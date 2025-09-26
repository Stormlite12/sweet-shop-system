// backend/src/models/Sweet.js
import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sweet name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['milk-based', 'sugar-based', 'dry-fruits', 'festival', 'snacks'],
      message: 'Please select a valid category'
    }
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= 0 && Number.isFinite(v);
      },
      message: 'Price must be a valid positive number'
    }
  },
  
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be a whole number'
    }
  },
  
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    maxlength: [2000000, 'Image data too large (max 2MB Base64)'], // Reduced limit
    validate: {
      validator: function(v) {
        // Allow URLs or Base64 data URLs
        if (!v) return true;
        if (v.startsWith('http')) return true;
        if (v.startsWith('data:image/')) {
          // Check Base64 size (rough estimate)
          const base64Data = v.split(',')[1] || '';
          const sizeInBytes = (base64Data.length * 3) / 4;
          return sizeInBytes <= 2 * 1024 * 1024; // 2MB limit
        }
        return false;
      },
      message: 'Image must be a valid URL or Base64 data URL (max 2MB)'
    }
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: 'Delicious handcrafted sweet made with premium ingredients'
  }
}, {
  timestamps: true
});

// Add index for better query performance
sweetSchema.index({ category: 1 });
sweetSchema.index({ name: 1 });
sweetSchema.index({ price: 1 });

export default mongoose.model('Sweet', sweetSchema);