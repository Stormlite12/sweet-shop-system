// src/components/Navbar.jsx
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // We'll connect this to auth later
  const [user, setUser] = useState(null) // We'll connect this to auth later

  return (
    <div className="navbar bg-base-100/95 backdrop-blur-sm shadow-lg fixed top-0 z-50 px-4">
      {/* Navbar Start - Logo & Mobile Menu */}
      <div className="navbar-start">
        {/* Mobile Hamburger Menu */}
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a className="hover:text-primary">🏠 Home</a></li>
              <li><a className="hover:text-primary">🛒 Shop</a></li>
              <li><a className="hover:text-primary">ℹ️ About</a></li>
              <li><a className="hover:text-primary">📞 Contact</a></li>
              {!isLoggedIn && (
                <li><a className="hover:text-primary">🔑 Login</a></li>
              )}
            </ul>
          )}
        </div>

        {/* Logo */}
      <a className="btn btn-ghost text-xl font-bold hover:bg-transparent flex items-center gap-2">
      <img src="/src/assets/misthi-mahal-logo.png" alt="Sweet Shop Logo" className="w-6 h-6" />
      <span className="text-neutral">Sweet Shop</span>
      </a>

    </div>
      {/* Navbar Center - Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <a className="btn btn-ghost hover:btn-primary hover:text-primary-content transition-all">
              🏠 Home
            </a>
          </li>
        </ul>
      </div>

      {/* Navbar End - User Actions */}
      <div className="navbar-end gap-2">
        {/* Shopping Cart Icon (for later) */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle hover:btn-primary">
            <div className="indicator">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9M16 16a1 1 0 100 2 1 1 0 000-2zm-8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              <span className="badge badge-sm badge-primary indicator-item">0</span>
            </div>
          </div>
        </div>

        {/* User Authentication */}
        {isLoggedIn ? (
          /* User Dropdown Menu */
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost hover:btn-primary transition-all">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <span className="hidden md:inline ml-2 font-medium">
                {user?.email || 'User'}
              </span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2">
              {/* Admin Panel (show only for admin users) */}
              <li>
                <a className="hover:bg-primary hover:text-primary-content">
                  👑 Admin Panel
                </a>
              </li>
              <li><hr className="my-1" /></li>
              <li>
                <a 
                  className="hover:bg-error hover:text-error-content text-error"
                  onClick={() => {
                    setIsLoggedIn(false)
                    setUser(null)
                    // We'll add proper logout logic later
                  }}
                >
                  🚪 Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          /* Login Button */
          <button 
            className="btn btn-primary hover:btn-primary-focus transition-all"
            onClick={() => {
              // We'll add login modal logic later
              setIsLoggedIn(true) // Temporary for testing
              setUser({ email: 'test@example.com' }) // Temporary for testing
            }}
          >
            <span className="hidden sm:inline">🔑</span>
            Login
          </button>
        )}
      </div>
    </div>
  )
}