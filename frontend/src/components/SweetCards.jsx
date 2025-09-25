// src/components/SweetCards.jsx
import { useState, useEffect } from 'react'
import { sweetService } from '../services/sweetService'
import toast from 'react-hot-toast'

export default function SweetCards() {
  const [sweets, setSweets] = useState([]) // Always start with empty array
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [cartItems, setCartItems] = useState({})

  // Fetch sweets from backend
  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching sweets from backend...')
        const data = await sweetService.getAllSweets()
        console.log('📦 Backend response:', data)
        
        // Make sure data is an array
        if (Array.isArray(data)) {
          setSweets(data)
        } else if (data && Array.isArray(data.sweets)) {
          // If backend returns { sweets: [...] }
          setSweets(data.sweets)
        } else if (data && Array.isArray(data.data)) {
          // If backend returns { data: [...] }
          setSweets(data.data)
        } else {
          console.warn('⚠️ Backend did not return an array:', data)
          setSweets([])
          toast.error('Invalid data format from server')
        }
        
      } catch (err) {
        console.error('❌ Error fetching sweets:', err)
        setError(err.message)
        setSweets([]) // Always ensure sweets is an array
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSweets()
  }, [])

  // Safely get categories (with fallback)
  const categories = [
    'All Categories', 
    ...new Set(
      (Array.isArray(sweets) ? sweets : [])
        .map(sweet => sweet?.category)
        .filter(Boolean)
    )
  ]

  // Safely filter sweets (with fallback)
  const filteredSweets = (Array.isArray(sweets) ? sweets : []).filter(sweet => {
    if (!sweet || !sweet.name) return false
    
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || sweet.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (sweetId) => {
    setCartItems(prev => ({
      ...prev,
      [sweetId]: (prev[sweetId] || 0) + 1
    }))
    toast.success('Added to cart! 🍭')
  }

  const getCartQuantity = (sweetId) => {
    return cartItems[sweetId] || 0
  }

  // Debug info
  console.log('🍭 Sweet Cards State:', {
    sweetsLength: Array.isArray(sweets) ? sweets.length : 'NOT ARRAY',
    loading,
    error,
    sweetsType: typeof sweets,
    sweetsValue: sweets
  })

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral mb-4">
              Our Delicious Sweets
            </h2>
            <p className="text-lg text-base-content/70">
              Loading our sweet collection... 🍭
            </p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <figure className="animate-pulse bg-base-300 h-64"></figure>
                <div className="card-body">
                  <div className="animate-pulse">
                    <div className="h-6 bg-base-300 rounded mb-2"></div>
                    <div className="h-4 bg-base-300 rounded mb-4"></div>
                    <div className="h-8 bg-base-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-3xl font-bold text-neutral mb-4">Oops! Something went wrong</h2>
          <p className="text-lg text-base-content/70 mb-6">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral mb-4">
            Our Delicious Sweets
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Handcrafted with love, made from the finest ingredients by our master Halwais
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-center items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search Sweets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10 focus:input-primary"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline min-w-48">
              {selectedCategory}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2">
              {categories.map((category) => (
                <li key={category}>
                  <a onClick={() => setSelectedCategory(category)} className="hover:bg-primary hover:text-primary-content">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sweet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSweets.map((sweet) => {
            if (!sweet || !sweet._id) return null
            
            const isOutOfStock = sweet.stock === 0 || sweet.stock < 0
            const cartQty = getCartQuantity(sweet._id)
            
            return (
              <div key={sweet._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Sweet Image */}
                <figure className="relative">
                  <img
                    src={sweet.image || "/src/assets/placeholder.jpg"}
                    alt={sweet.name || "Sweet"}
                    className={`w-full h-64 object-cover ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                    onError={(e) => {
                      e.target.src = "/src/assets/placeholder.jpg"
                    }}
                  />
                  
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    {isOutOfStock ? (
                      <div className="badge badge-error text-white font-semibold">Out of Stock</div>
                    ) : (
                      <div className="badge badge-success text-white">Qty: {sweet.stock || 0}</div>
                    )}
                  </div>

                  {/* Category Badge */}
                  {sweet.category && (
                    <div className="absolute top-3 left-3">
                      <div className="badge badge-primary text-white">{sweet.category}</div>
                    </div>
                  )}
                </figure>

                {/* Card Content */}
                <div className="card-body p-6">
                  <h3 className="card-title text-xl font-bold text-neutral">
                    {sweet.name || "Unknown Sweet"}
                  </h3>
                  
                  <p className="text-base-content/70 text-sm leading-relaxed mb-4">
                    {sweet.description || "No description available"}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ${typeof sweet.price === 'number' ? sweet.price.toFixed(2) : '0.00'}
                    </span>
                    {cartQty > 0 && (
                      <div className="badge badge-primary badge-lg">
                        In Cart: {cartQty}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="card-actions justify-end">
                    {isOutOfStock ? (
                      <button className="btn btn-disabled w-full" disabled>
                        Sold Out
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary w-full hover:btn-primary-focus transition-all"
                        onClick={() => addToCart(sweet._id)}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9" />
                        </svg>
                        Purchase
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results Message */}
        {filteredSweets.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍭</div>
            <h3 className="text-2xl font-bold text-neutral mb-2">
              {!Array.isArray(sweets) || sweets.length === 0 ? 'No sweets available' : 'No sweets found'}
            </h3>
            <p className="text-base-content/70">
              {!Array.isArray(sweets) || sweets.length === 0
                ? 'Check back later for our delicious treats!' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {Array.isArray(sweets) && sweets.length > 0 && (
              <button 
                className="btn btn-primary mt-4"
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

        {/* Cart Counter */}
        {Object.values(cartItems).some(qty => qty > 0) && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-primary text-primary-content rounded-full px-6 py-3 shadow-lg">
              <span className="font-semibold">
                Cart: {Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)} items
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}