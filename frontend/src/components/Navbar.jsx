// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { authService } from '../services/authService.jsx'
import { Link, useNavigate } from 'react-router-dom'
import logo from "/misthi-mahal-logo.png"
import toast from 'react-hot-toast'

export default function Navbar({ onOpenAuth, onOpenCart, cartCount }) {
  const [user, setUser] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Check authentication status
  const checkAuth = () => {
    try {
      const currentUser = authService.getCurrentUser()
      const isAuthenticated = authService.isAuthenticated()
      
      if (isAuthenticated && currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
    
    // Listen for auth changes
    const handleStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    toast.success('Logged out successfully')
    // Trigger auth change event
    window.dispatchEvent(new Event('authChange'))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-200/40 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 backdrop-blur supports-[backdrop-filter]:bg-orange-50/95">
      <div className="container mx-auto flex h-24 max-w-7xl items-center justify-between px-4">
        
        {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-[125px] w-[100px] items-center justify-center rounded-md ">
          <img 
            src={logo} 
            alt="Misthi Mahal Logo" 
            className="h-full w-full object-contain" 
          />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Misthi Mahal
        </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link 
            to="/" 
            className="transition-colors text-orange-600 "
          >
            Home
          </Link>
          {user && authService.isAdmin() && (
            <Link 
              to="/admin" 
              className="transition-colors text-orange-600 "
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          
  

          {user ? (
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-orange-600">{user.name}</span>
                <span className="text-xs text-muted-foreground text-orange-600">{user.email}</span>
              </div>
              
              {/* Admin Badge */}
              {authService.isAdmin() && (
                <div className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full border border-orange-200">
                  Admin
                </div>
              )}
              
              {/* Avatar Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-orange-50">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-200">
                    <img 
                      alt="User avatar" 
                      src="/placeholder-user.jpg"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-lg border border-border w-52 mt-2">
                  <li className="px-3 py-2 border-b border-border">
                    <div className="flex flex-col text-black">
                      <span className="font-medium text-foreground">{user.name}</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                      {authService.isAdmin() && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full mt-1 w-fit">Admin</span>
                      )}
                    </div>
                  </li>
                  
                  {authService.isAdmin() && (
                    <li>
                      <Link 
                        to="/admin" 
                        className="flex items-center px-3 py-2 text-sm hover:bg-orange-50 transition-colors text-black"
                      >
                        <span className="mr-2 tex">⚙️</span>
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white shadow hover:bg-orange-700 h-9 px-4 py-2"
              onClick={onOpenAuth}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}