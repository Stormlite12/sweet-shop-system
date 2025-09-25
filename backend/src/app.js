import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import sweetRoutes from './routes/sweetRoutes.js'

dotenv.config()

const app = express()

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))



// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to database
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/sweets', sweetRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sweet Shop API is running!',
    status: 'healthy',
    cors: 'enabled'
  })
})

export default app