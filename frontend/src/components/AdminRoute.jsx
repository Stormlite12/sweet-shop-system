// src/components/AdminRoute.jsx
import { authService } from '../services/authService.jsx'

export default function AdminRoute({ children }) {
  const isAdmin = authService.isAdmin()

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600 mb-4">Admin Access Required</h2>
          <p className="text-lg text-orange-800/70 mb-6">
            Please login as an admin to access this area.
          </p>
          <button 
            className="btn bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
            onClick={() => window.location.href = '/'}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return children
}