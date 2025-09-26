import Sweet from '../models/Sweet.js';
import mongoose from 'mongoose';

// GET /api/sweets - Get all sweets
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    console.log('✅ Found sweets:', sweets.length);
    res.json(sweets);
  } catch (error) {
    console.error('❌ Error fetching sweets:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/sweets - Create new sweet (simplified)
export const createSweet = async (req, res) => {
  try {
    const { name, category, price, stock, image } = req.body;
    
    const sweet = new Sweet({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    });

    const savedSweet = await sweet.save();
    console.log('✅ Sweet created:', savedSweet.name);
    res.status(201).json(savedSweet);
  } catch (error) {
    console.error('❌ Error creating sweet:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(400).json({ message: error.message || 'Failed to create sweet' });
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

// POST /api/sweets/:id/purchase - Purchase sweet (reduce stock)
export const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body; // ✅ Fixed: changed from 'stock' to 'quantity'

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid sweet ID' });
    }

    // Validate quantity
    if (!quantity) {
      return res.status(400).json({ message: 'Purchase quantity is required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Purchase quantity must be positive' });
    }

    // Find sweet
    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    // Check stock availability
    if (sweet.stock < quantity) { // ✅ Fixed: use 'quantity' consistently
      return res.status(400).json({ 
        message: 'Insufficient stock',
        available: sweet.stock,
        requested: quantity
      });
    }

    // Update stock
    sweet.stock -= quantity; // ✅ Fixed: use 'quantity' consistently
    await sweet.save();

    // Calculate purchase details
    const totalPrice = parseFloat((quantity * sweet.price).toFixed(2)); // ✅ Fixed: use 'quantity'

    res.status(200).json({
      message: 'Purchase successful',
      sweet,
      purchaseDetails: {
        quantity,
        totalPrice,
        unitPrice: sweet.price
      }
    });

  } catch (error) {
    console.log('PURCHASE SWEET ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/sweets/:id/restock - Restock sweet (increase stock, admin only)
export const restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body; // ✅ Fixed: changed from 'stock' to 'quantity'

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid sweet ID' });
    }

    // Validate quantity
    if (!quantity) {
      return res.status(400).json({ message: 'Restock quantity is required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Restock quantity must be positive' });
    }

    // Find sweet
    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    // Store previous stock
    const previousStock = sweet.stock; // ✅ Fixed: renamed for clarity

    // Update stock
    sweet.stock += quantity; // ✅ Fixed: use 'quantity' consistently
    await sweet.save();

    res.status(200).json({
      message: 'Restock successful',
      sweet,
      restockDetails: {
        quantity,
        previousStock, // ✅ Fixed: renamed for clarity
        newStock: sweet.stock // ✅ Fixed: renamed for clarity
      }
    });

  } catch (error) {
    console.log('RESTOCK SWEET ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};