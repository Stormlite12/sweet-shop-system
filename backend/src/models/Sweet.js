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
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Sweet = mongoose.model('Sweet', SweetSchema);

export default Sweet;
