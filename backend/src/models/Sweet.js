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
    validate: {
      validator: function(v) {
        // Allow URLs only (removed Base64 validation)
        if (!v) return true;
        return v.startsWith('http');
      },
      message: 'Image must be a valid URL'
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