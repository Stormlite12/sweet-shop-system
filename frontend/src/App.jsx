// src/App.jsx
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from '../src/pages/Home'
import AdminPanel from './components/AdminPanel'
import AuthModal from './components/AuthModal'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    window.dispatchEvent(new Event('authChange'))
  }

  return (
    <Router>
      <div className="min-h-screen" data-theme="sweetshop">
        <Navbar onOpenAuth={() => setShowAuthModal(true)} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
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
      </div>
    </Router>
  )
}

export default App