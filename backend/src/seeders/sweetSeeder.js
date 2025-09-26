import mongoose from 'mongoose'
import Sweet from '../models/Sweet.js'
import dotenv from 'dotenv'

dotenv.config()

const defaultSweets = [
  {
    name: "Gulab Jamun",
    description: "Soft, spongy milk-solid balls soaked in aromatic sugar syrup",
    price: 150,
    stock: 50,
    category: "Milk Sweets",
    image: "/gulab-jamun-sweet.jpg"
  },
  {
    name: "Rasgulla",
    description: "Light, fluffy cottage cheese balls in sweet syrup",
    price: 120,
    stock: 40,
    category: "Milk Sweets",
    image: "/rasgulla-sweet.jpg"
  },
  {
    name: "Jalebi",
    description: "Crispy, spiral-shaped deep-fried sweets soaked in sugar syrup",
    price: 180,
    stock: 35,
    category: "Festival Specials",
    image: "/jalebi-sweet.jpg"
  },
  {
    name: "Kaju Katli",
    description: "Diamond-shaped cashew fudge with silver leaf",
    price: 300,
    stock: 25,
    category: "Dry Fruits",
    image: "/kaju-katli-sweet.jpg"
  },
  {
    name: "Motichoor Ladoo",
    description: "Round sweets made from tiny chickpea flour pearls",
    price: 200,
    stock: 30,
    category: "Festival Specials",
    image: "/ladoo-sweet.jpg"
  },
  {
    name: "Barfi",
    description: "Rich milk-based confection with nuts and aromatic spices",
    price: 250,
    stock: 20,
    category: "Milk Sweets",
    image: "/barfi-sweet.jpg"
  },
  {
    name: "Kesar Pista Kulfi",
    description: "Traditional frozen dessert with saffron and pistachios",
    price: 80,
    stock: 45,
    category: "Frozen Treats",
    image: "/placeholder.jpg"
  },
  {
    name: "Ras Malai",
    description: "Delicate cottage cheese dumplings in sweetened milk",
    price: 160,
    stock: 35,
    category: "Milk Sweets",
    image: "/placeholder.jpg"
  }
]

const seedSweets = async () => {
  try {
    // 🔧 Fix: Use MONGO_URI instead of MONGODB_URI
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sweetshop'
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri)
    console.log('🔗 Connected to MongoDB:', mongoUri)

    // Clear existing sweets (optional - comment this line to keep existing sweets)
    await Sweet.deleteMany({})
    console.log('🧹 Cleared existing sweets')

    // Insert default sweets
    const createdSweets = await Sweet.insertMany(defaultSweets)
    console.log(`✅ Successfully added ${createdSweets.length} sweets to database:`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    createdSweets.forEach((sweet, index) => {
      console.log(`   ${index + 1}. 🍭 ${sweet.name}`)
      console.log(`      💰 Price: ₹${sweet.price}`)
      console.log(`      📦 Stock: ${sweet.stock} units`)
      console.log(`      🏷️  Category: ${sweet.category}`)
      console.log(`      ─────────────────────`)
    })
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding sweets:', error.message)
    console.error('Full error:', error)
  } finally {
    // Close connection
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
    process.exit(0)
  }
}

// Run the seeder
seedSweets()