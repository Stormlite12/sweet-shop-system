import express from 'express';
import authRoutes from '../src/routes/authRoutes.js';
import sweetRoutes from '../src/routes/sweetRoutes.js'

const app=express();
app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/sweets',sweetRoutes);

export default app;