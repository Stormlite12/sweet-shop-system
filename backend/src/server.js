// src/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js'; // Changed from database.js to db.js
import sweetRoutes from './routes/sweetRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// IMPORTANT: Serve static files BEFORE other middleware
app.use('/uploads', express.static(uploadsDir));
console.log('📁 Serving static files from:', uploadsDir);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'https://your-frontend-domain.com',        // Add your deployed frontend URL
    'https://your-app.netlify.app',            // If using Netlify
    'https://your-app.vercel.app',             // If using Vercel
    'https://your-custom-domain.com'           // Your custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/sweets', sweetRoutes);
app.use('/api/auth', authRoutes);

// Test route to check if uploads work
app.get('/api/test-upload', (req, res) => {
  const testFiles = fs.readdirSync(uploadsDir);
  res.json({ 
    message: 'Upload test endpoint',
    uploadsDir,
    files: testFiles,
    staticUrl: `http://localhost:${PORT}/uploads/`
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', port: PORT });
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Static files served at: http://localhost:${PORT}/uploads/`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});