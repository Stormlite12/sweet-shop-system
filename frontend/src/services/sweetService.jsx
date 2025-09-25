// src/services/sweetService.js
import api from './api'

export const sweetService = {
  // Get all sweets
  async getAllSweets() {
    try {
      const response = await api.get('/sweets')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sweets')
    }
  },

  // Get sweet by ID
  async getSweetById(id) {
    try {
      const response = await api.get(`/sweets/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sweet')
    }
  },

  // Create new sweet (Admin only)
  async createSweet(sweetData) {
    try {
      const response = await api.post('/sweets', sweetData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create sweet')
    }
  },

  // Update sweet (Admin only)
  async updateSweet(id, sweetData) {
    try {
      const response = await api.put(`/sweets/${id}`, sweetData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update sweet')
    }
  },

  // Delete sweet (Admin only)
  async deleteSweet(id) {
    try {
      await api.delete(`/sweets/${id}`)
      return { message: 'Sweet deleted successfully' }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete sweet')
    }
  }
}