// src/components/Navbar.jsx - Add navigation links
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export default function Navbar({ onOpenAuth }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
    }

    checkAuth()
    window.addEventListener('authChange', checkAuth)
    
    return () => {
      window.removeEventListener('authChange', checkAuth)
    }
  }, [])

  const handleLogout = async () => {
    try {
      setLoading(true)
      authService.logout()
      setUser(null)
      toast.success('Logged out successfully! 👋')
      navigate('/') // Redirect to home
      window.dispatchEvent(new Event('authChange'))
    } catch (error) {
      toast.error('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          🍭 Sweet Shop
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/" className="hover:bg-primary-focus">Home</Link></li>
          {user && authService.isAdmin() && (
            <li><Link to="/admin" className="hover:bg-primary-focus">Admin Panel</Link></li>
          )}
        </ul>
      </div>
      
      <div className="navbar-end space-x-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img 
                  alt="User avatar" 
                  src="/src/assets/placeholder-user.jpg"
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li className="menu-title">
                <span>{user.name}</span>
                <span className="text-xs opacity-60">{user.email}</span>
                {authService.isAdmin() && (
                  <span className="badge badge-primary badge-sm">Admin</span>
                )}
              </li>
              <li><Link to="/admin">Admin Panel</Link></li>
              <li>
                <button 
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <button 
            className="btn btn-secondary"
            onClick={onOpenAuth}
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}