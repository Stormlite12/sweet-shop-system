import Sweet from '../models/Sweet.js';
import mongoose from 'mongoose';

// GET /api/sweets - Get all sweets
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json({ sweets });
  } catch (error) {
    console.log('GET ALL SWEETS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/sweets/:id - Get single sweet
export const getSweetById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid sweet ID' });
    }

    const sweet = await Sweet.findById(id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json({ sweet });
  } catch (error) {
    console.log('GET SWEET BY ID ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};