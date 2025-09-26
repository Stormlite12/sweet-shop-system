// src/components/AuthModal.jsx
import { useState } from 'react'
import { authService } from '../services/authService.jsx'
import toast from 'react-hot-toast'

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('login')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔐 Attempting authentication...', { activeTab, email: formData.email })
      
      if (activeTab === 'login') {
        const result = await authService.login(formData.email, formData.password)
        console.log('✅ Login successful:', result)
        toast.success(`Welcome back! ${result.user.role === 'admin' ? '👑 Admin' : '🍭'}`)
      } else {
        const result = await authService.register(formData.email, formData.password)
        console.log('✅ Registration successful:', result)
        toast.success(`Welcome to Sweet Shop! ${result.user.role === 'admin' ? '🎉 You are the first admin!' : '🍭'}`)
      }
      
      // Reset form and close modal
      setFormData({ email: '', password: '' })
      
      // Trigger auth change event
      window.dispatchEvent(new Event('authChange'))
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('❌ Authentication failed:', error)
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ email: '', password: '' })
    setActiveTab('login')
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box w-96 max-w-md bg-gradient-to-b from-orange-50 to-amber-50 border border-orange-200">
        {/* Close Button */}
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:bg-orange-100 text-orange-700"
          onClick={() => {
            resetForm()
            onClose()
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-orange-600">Sweet Shop</h2>
          <p className="text-orange-800/70 mt-2">
            {activeTab === 'login' ? 'Welcome back!' : 'Join our sweet family!'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-orange-100 rounded-lg p-1 mb-6">
          <button 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'login' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-orange-700 hover:bg-orange-200'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'register' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-orange-700 hover:bg-orange-200'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-orange-800 font-medium">Email</span>
            </label>
            <input 
              type="email" 
              name="email"
              className="input input-bordered border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-500" 
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required 
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-orange-800 font-medium">Password</span>
            </label>
            <input 
              type="password" 
              name="password"
              className="input input-bordered border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900 placeholder-gray-500" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required 
              minLength={6}
              disabled={loading}
            />
            {activeTab === 'register' && (
              <label className="label">
                <span className="label-text-alt text-orange-600">Minimum 6 characters</span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className={`btn w-full mt-6 bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              'Please wait...'
            ) : (
              activeTab === 'login' ? 'Login' : 'Register'
            )}
          </button>
        </form>

        {/* Switch Tab Helper */}
        <div className="text-center mt-4 text-sm">
          {activeTab === 'login' ? (
            <p className="text-orange-800">
              Don't have an account?{' '}
              <button 
                className="text-orange-600 hover:text-orange-700 font-medium underline" 
                onClick={() => setActiveTab('register')}
                disabled={loading}
              >
                Register here
              </button>
            </p>
          ) : (
            <p className="text-orange-800">
              Already have an account?{' '}
              <button 
                className="text-orange-600 hover:text-orange-700 font-medium underline" 
                onClick={() => setActiveTab('login')}
                disabled={loading}
              >
                Login here
              </button>
            </p>
          )}
        </div>

        {/* First User Info */}
        {activeTab === 'register' && (
          <div className="alert bg-amber-100 border-amber-300 mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6 text-amber-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-xs text-amber-800">First user to register becomes admin!</span>
          </div>
        )}
      </div>
    </div>
  )
}