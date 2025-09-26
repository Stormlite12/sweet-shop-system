// src/components/SweetCards.jsx
import { useState, useEffect } from 'react'
import { sweetService } from '../services/sweetService.jsx'
import toast from 'react-hot-toast'

export default function SweetCards({ cart, onOpenCart }) {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching sweets from backend...')
        const data = await sweetService.getAllSweets()
        console.log('📦 Backend response:', data)
        
        if (Array.isArray(data)) {
          setSweets(data)
        } else if (data && Array.isArray(data.sweets)) {
          setSweets(data.sweets)
        } else if (data && Array.isArray(data.data)) {
          setSweets(data.data)
        } else {
          console.warn('⚠️ Backend did not return an array:', data)
          setSweets([])
          toast.error('Invalid data format from server')
        }
        
      } catch (err) {
        console.error('❌ Error fetching sweets:', err)
        setError(err.message)
        setSweets([])
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSweets()
  }, [])

  // Add effect to listen for sweet updates only
  useEffect(() => {
    const handleSweetsUpdate = async () => {
      try {
        const data = await sweetService.getAllSweets()
        if (Array.isArray(data)) {
          setSweets(data)
        } else if (data && Array.isArray(data.sweets)) {
          setSweets(data.sweets)
        } else if (data && Array.isArray(data.data)) {
          setSweets(data.data)
        }
      } catch (err) {
        console.error('Error refreshing sweets:', err)
      }
    }

    window.addEventListener('sweetsUpdated', handleSweetsUpdate)
    
    return () => {
      window.removeEventListener('sweetsUpdated', handleSweetsUpdate)
    }
  }, [])

  const categories = [
    'All Categories', 
    ...new Set(
      (Array.isArray(sweets) ? sweets : [])
        .map(sweet => sweet?.category)
        .filter(Boolean)
    )
  ]

  const filteredSweets = (Array.isArray(sweets) ? sweets : []).filter(sweet => {
    if (!sweet || !sweet.name) return false
    
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || sweet.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (sweetId) => {
    cart.addToCart(sweetId, 1)
  }

  const getCartQuantity = (sweetId) => {
    return cart.getCartQuantity(sweetId)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Delicious Sweets
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading our sweet collection... 🍭
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none bg-orange-600 text-white shadow hover:bg-orange-700 h-10 px-6 py-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Our Delicious Sweets
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handcrafted with love, made from the finest ingredients by our master Halwais
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-black placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Category Filter */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="text-black inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-10 px-4 py-2 min-w-[160px]">
              {selectedCategory}
              <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow-lg bg-white rounded-lg border border-gray-200 w-52 mt-2 text-black">
              {categories.map((category) => (
                <li key={category}>
                  <a 
                    onClick={() => setSelectedCategory(category)} 
                    className="block px-3 py-2 text-sm text-black hover:bg-orange-50 hover:text-orange-700 rounded transition-colors"
                  >
                    {category}
                  </a>
                  
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sweet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet) => {
            if (!sweet || !sweet._id) return null
            
            const isOutOfStock = sweet.stock === 0 || sweet.stock < 0
            const cartQty = getCartQuantity(sweet._id)
            
            return (
              <div key={sweet._id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                
                {/* Sweet Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={sweet.image || "/placeholder.jpg"}
                    alt={sweet.name || "Sweet"}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                    onError={(e) => {
                      e.target.src = "/src/assets/placeholder.jpg"
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {sweet.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        {sweet.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Qty: {sweet.stock || 0}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {sweet.name || "Unknown Sweet"}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {sweet.description || "Delicious handcrafted sweet made with premium ingredients"}
                  </p>

                  {/* Price and Cart */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{typeof sweet.price === 'number' ? sweet.price.toFixed(2) : '0.00'}
                    </span>
                    {cartQty > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        In Cart: {getCartQuantity(sweet._id)}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  {isOutOfStock ? (
                    <button 
                      className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-400 cursor-not-allowed h-10 px-4 py-2"
                      disabled
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button 
                      className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none bg-orange-600 text-white shadow hover:bg-orange-700 h-10 px-4 py-2"
                      onClick={() => addToCart(sweet._id)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9" />
                      </svg>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredSweets.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {!Array.isArray(sweets) || sweets.length === 0 ? 'No sweets available' : 'No sweets found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {!Array.isArray(sweets) || sweets.length === 0
                ? 'Check back later for our delicious treats!' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {Array.isArray(sweets) && sweets.length > 0 && (
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-orange-600 text-white shadow hover:bg-orange-700 h-10 px-6 py-2"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All Categories')
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Floating Cart Counter - Clickable */}
        {cart.getTotalItems() > 0 && (
          <button
            onClick={onOpenCart}
            className="fixed bottom-6 right-6 z-50 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 shadow-lg border border-orange-500 transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <span className="font-semibold text-sm flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9" />
              </svg>
              <span>Cart: {cart.getTotalItems()} items</span>
            </span>
          </button>
        )}
      </div>
    </section>
  )
}