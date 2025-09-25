// src/services/authService.js
import api from './api'

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  async register(email, password) {
    try {
      const response = await api.post('/auth/register', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { token, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  }
}