import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/authRoutes.js';
import sweetRoutes from '../src/routes/sweetRoutes.js';

dotenv.config();

const app = express();

// Minimal middlewares for tests
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Mount routes (no global CORS wildcard, no DB connect here)
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

export default app;


