import { useState, useEffect } from 'react'
import { sweetService } from '../services/sweetService.jsx'
import { authService } from '../services/authService.jsx'
import toast from 'react-hot-toast'

export default function CartSidebar({ isOpen, onClose, cart, onOpenAuth }) {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated())
    }
    
    checkAuth()
    
    // Listen for auth changes
    window.addEventListener('authChange', checkAuth)
    return () => window.removeEventListener('authChange', checkAuth)
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchSweetDetails()
    }
  }, [isOpen, cart.cartItems])

  const fetchSweetDetails = async () => {
    try {
      setLoading(true)
      const sweetIds = Object.keys(cart.cartItems).filter(id => cart.cartItems[id] > 0)
      
      if (sweetIds.length === 0) {
        setSweets([])
        return
      }

      const response = await sweetService.getAllSweets()
      // Handle both response formats
      const allSweets = Array.isArray(response) ? response : (response.sweets || response.data || [])
      const cartSweets = allSweets.filter(sweet => sweetIds.includes(sweet._id))
      setSweets(cartSweets)
    } catch (error) {
      console.error('Error fetching cart details:', error)
      toast.error('Failed to load cart details')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return sweets.reduce((total, sweet) => {
      const quantity = cart.cartItems[sweet._id] || 0
      return total + (sweet.price * quantity)
    }, 0)
  }

  const handlePurchase = async () => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      toast.error('Please login to complete your purchase')
      onOpenAuth() // Open auth modal
      return
    }

    try {
      setPurchasing(true)

      // Add validation before purchase
      if (sweets.length === 0) {
        toast.error('No items in cart to purchase')
        return
      }

      const purchasePromises = sweets.map(async (sweet) => {
        const quantity = cart.cartItems[sweet._id]
        if (quantity > 0) {
          return await sweetService.purchaseSweet(sweet._id, { quantity })
        }
      }).filter(Boolean)

      await Promise.all(purchasePromises)

      toast.success('🎉 Purchase successful! Thank you for your order!')
      cart.clearCart()
      onClose()
      
      // Refresh sweets to update stock
      window.dispatchEvent(new Event('sweetsUpdated'))
      
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error(error.message || 'Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-gray-600">{cart.getTotalItems()} items</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-orange-100 flex items-center justify-center transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 pb-0">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-3 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sweets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Discover our delicious handcrafted sweets and add them to your cart!</p>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sweets.map((sweet) => {
                  const quantity = cart.cartItems[sweet._id] || 0
                  const itemTotal = sweet.price * quantity
                  
                  return (
                    <div key={sweet._id} className="flex space-x-3 p-4 bg-orange-50/50 rounded-lg border border-orange-100 hover:bg-orange-50/70 transition-colors">
                      <img
                        src={sweet.image || "/placeholder.jpg"}
                        alt={sweet.name}
                        className="w-16 h-16 object-cover rounded-lg border border-orange-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg"
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{sweet.name}</h4>
                        <p className="text-sm text-gray-600">₹{sweet.price.toFixed(2)} each</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => cart.updateQuantity(sweet._id, quantity - 1)}
                              className="w-8 h-8 rounded-full bg-orange-200 hover:bg-orange-300 flex items-center justify-center transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                              aria-label="Decrease quantity"
                            >
                              <svg className="w-4 h-4 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="w-12 text-center font-medium text-gray-900 select-none">{quantity}</span>
                            
                            <button
                              onClick={() => cart.updateQuantity(sweet._id, quantity + 1)}
                              disabled={quantity >= sweet.stock}
                              className="w-8 h-8 rounded-full bg-orange-200 hover:bg-orange-300 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                              aria-label="Increase quantity"
                            >
                              <svg className="w-4 h-4 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <div className="font-semibold text-orange-600">₹{itemTotal.toFixed(2)}</div>
                            {quantity >= sweet.stock && (
                              <div className="text-xs text-red-600">Max stock reached</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => cart.removeFromCart(sweet._id)}
                        className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )
                })}

                {/* Clear Cart Button */}
                {sweets.length > 0 && (
                  <button
                    onClick={cart.clearCart}
                    className="w-full py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Clear All Items
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {sweets.length > 0 && (
            <div className="border-t border-orange-100 p-6 bg-gradient-to-r from-orange-50 to-amber-50 mt-auto">
              
              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Items ({cart.getTotalItems()})</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-orange-200 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-orange-600">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Purchase Button - Show different states based on auth */}
              {!isAuthenticated ? (
                <button
                  onClick={handlePurchase}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Login to Complete Purchase</span>
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || sweets.length === 0}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mb-2"
                >
                  {purchasing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Purchase...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9" />
                      </svg>
                      <span>Complete Purchase</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-xs text-gray-600 text-center mb-20">
                {isAuthenticated 
                  ? '🔒 Secure checkout • Stock updated in real-time'
                  : '🔐 Login required for secure checkout'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

