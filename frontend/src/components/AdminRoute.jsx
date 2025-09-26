// src/components/AdminRoute.jsx
import { authService } from '../services/authService.jsx'

export default function AdminRoute({ children }) {
  const isAdmin = authService.isAdmin()

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral mb-4">Admin Access Required</h2>
          <p className="text-lg text-base-content/70 mb-6">
            Please login as an admin to access this area.
          </p>
          <button 
            className="btn btn-primary"
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