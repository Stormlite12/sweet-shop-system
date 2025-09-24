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

// POST /api/sweets - Create new sweet (Admin only)
export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity
    });

    const savedSweet = await sweet.save();
    res.status(201).json({ sweet: savedSweet });
  } catch (error) {
    console.log('CREATE SWEET ERROR:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/sweets/search - Search sweets
export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    
    // Build search query
    let searchQuery = {};
    
    if (name) {
      searchQuery.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    
    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(searchQuery);
    res.status(200).json({ sweets });
  } catch (error) {
    console.log('SEARCH SWEETS ERROR:', error);
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

// PUT /api/sweets/:id - Update sweet (Admin only)
export const updateSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid sweet ID' });
    }

    const updatedSweet = await Sweet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json({ sweet: updatedSweet });
  } catch (error) {
    console.log('UPDATE SWEET ERROR:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/sweets/:id - Delete sweet (Admin only)
export const deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid sweet ID' });
    }

    const deletedSweet = await Sweet.findByIdAndDelete(id);

    if (!deletedSweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.log('DELETE SWEET ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};