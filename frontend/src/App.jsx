// src/App.jsx
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Home from './pages/home'
import AdminPanel from './components/AdminPanel'
import AdminRoute from './components/AdminRoute'
import AuthModal from './components/AuthModal'
import CartSidebar from './components/CartSidebar'
import CurtainEffect from './components/CurtainEffect'
import Footer from './components/Footer' // Import the new Footer component
import { useCart } from './hooks/useCart.jsx'
import './App.css'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [showCurtain, setShowCurtain] = useState(true)
  
  // Cart logic moved to custom hook
  const cart = useCart()

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    window.dispatchEvent(new Event('authChange'))
  }

  const handleCurtainComplete = () => {
    // Hide curtain after animation completes
    setTimeout(() => {
      setShowCurtain(false)
    }, 500)
  }

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      
      {showCurtain && (
        <CurtainEffect onComplete={handleCurtainComplete}>
          {/* Main app content will be revealed behind curtains */}
          <Navbar 
            onOpenAuth={() => setShowAuthModal(true)} 
            onOpenCart={() => setShowCartSidebar(true)}
            cartCount={cart.getTotalItems()}
          />

          <Routes>
            <Route path="/" element={
              <Home 
                cart={cart} 
                onOpenCart={() => setShowCartSidebar(true)}
                onOpenAuth={() => setShowAuthModal(true)}
              />
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
          </Routes>
        </CurtainEffect>
      )}

      {/* Main app content - only show when curtain is completely gone */}
      {!showCurtain && (
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar 
            onOpenAuth={() => setShowAuthModal(true)} 
            onOpenCart={() => setShowCartSidebar(true)}
            cartCount={cart.getTotalItems()}
          />

          <Routes>
            <Route path="/" element={
              <Home 
                cart={cart} 
                onOpenCart={() => setShowCartSidebar(true)}
                onOpenAuth={() => setShowAuthModal(true)}
              />
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
          </Routes>

          <Footer /> {/* Add the Footer component here */}
        </div>
      )}

      {/* Modals - always available */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <CartSidebar 
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
        cart={cart}
        onOpenAuth={() => {
          setShowCartSidebar(false)
          setShowAuthModal(true)
        }}
      />

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#f97316',
            color: '#fff',
          },
        }}
      />
    </Router>
  )
}

export default App