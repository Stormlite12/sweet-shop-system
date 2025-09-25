// backend/src/models/Sweet.js
import mongoose from 'mongoose';

const SweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sweet name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  stock: {  // Changed from 'quantity' to 'stock' to match frontend
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative']
  },
  image: {
    type: String,
    default: '/src/assets/placeholder.jpg' // Default placeholder image
  },
  isActive: {
    type: Boolean,
    default: true // To enable/disable sweets without deleting
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Sweet = mongoose.model('Sweet', SweetSchema);

export default Sweet;