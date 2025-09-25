import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import sweetRoutes from './routes/sweetRoutes.js'

dotenv.config()

const app = express()

// 🔧 FIX: CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'http://localhost:5174', // Your current dev port
    'https://your-frontend-domain.vercel.app' // For future frontend deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions)) // Handle preflight requests

// Other middleware
app.use(helmet())
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