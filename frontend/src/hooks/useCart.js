import { useState } from 'react'
import toast from 'react-hot-toast'

export function useCart() {
  const [cartItems, setCartItems] = useState({})

  const addToCart = (sweetId, quantity = 1) => {
    setCartItems(prev => ({
      ...prev,
      [sweetId]: (prev[sweetId] || 0) + quantity
    }))
    toast.success('Added to cart! 🍭')
  }

  const updateQuantity = (sweetId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(sweetId)
      return
    }

    setCartItems(prev => ({
      ...prev,
      [sweetId]: newQuantity
    }))
  }

  const removeFromCart = (sweetId) => {
    setCartItems(prev => {
      const newCart = { ...prev }
      delete newCart[sweetId]
      return newCart
    })
    toast.success('Removed from cart! 🗑️')
  }

  const clearCart = () => {
    setCartItems({})
    toast.success('Cart cleared! 🧹')
  }

  const getCartQuantity = (sweetId) => {
    return cartItems[sweetId] || 0
  }

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)
  }

  const getCartItems = () => {
    return cartItems
  }

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartQuantity,
    getTotalItems,
    getCartItems,
    setCartItems
  }
}