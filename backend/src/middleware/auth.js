import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('MIDDLEWARE ERROR:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};