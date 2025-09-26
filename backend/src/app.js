import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import sweetRoutes from './routes/sweetRoutes.js'

dotenv.config()

const app = express()

// 🔥 PRODUCTION CORS FIX - Add your Vercel domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000', 
  'http://127.0.0.1:5173',
  'https://sweet-shop-system.vercel.app',  // ✅ Your actual Vercel URL
  'https://*.vercel.app',                   // ✅ Allow all Vercel preview URLs
  'https://your-custom-domain.com'          // Add your custom domain if you have one
]

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Check if the origin is in our allowed list or matches a pattern
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Handle wildcard patterns like *.vercel.app
        const pattern = allowedOrigin.replace('*', '.*')
        return new RegExp(pattern).test(origin)
      }
      return allowedOrigin === origin
    })) {
      return callback(null, true)
    }
    
    console.log('❌ CORS blocked origin:', origin)
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
    return callback(new Error(msg), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
}))

// Handle preflight OPTIONS requests
app.options('*', cors())


// Middleware
app.use(express.json({ limit: '5mb' })) // Reduced from 10mb to 5mb
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

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
    cors: 'enabled',
    imageStorage: 'mongodb-base64'
  })
})

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' })
})

export default app