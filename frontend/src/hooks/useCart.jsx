import { useState, useEffect } from 'react'

export const useCart = () => {
  const [cartItems, setCartItems] = useState({})

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sweetShopCart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sweetShopCart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (sweetId, quantity = 1) => {
    setCartItems(prev => ({
      ...prev,
      [sweetId]: (prev[sweetId] || 0) + quantity
    }))
  }

  const removeFromCart = (sweetId) => {
    setCartItems(prev => {
      const newCart = { ...prev }
      delete newCart[sweetId]
      return newCart
    })
  }

  const updateQuantity = (sweetId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sweetId)
    } else {
      setCartItems(prev => ({
        ...prev,
        [sweetId]: quantity
      }))
    }
  }

  const clearCart = () => {
    setCartItems({})
  }

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)
  }

  const getCartQuantity = (sweetId) => {
    return cartItems[sweetId] || 0
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getCartQuantity
  }
}
