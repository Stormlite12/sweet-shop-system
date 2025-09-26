import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import sweetRoutes from './routes/sweetRoutes.js'
import path from 'path'
import fs from 'fs'

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

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 Created uploads directory:', uploadsDir)
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir))
console.log('📁 Serving static files from:', uploadsDir)

// Connect to database
connectDB()

// Routes
app.use('/api/sweets', sweetRoutes)
app.use('/api/auth', authRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sweet Shop API is running!',
    status: 'healthy',
    cors: 'enabled'
  })
})

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' })
})

export default app