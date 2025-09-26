// src/services/sweetService.js
import { API_ENDPOINTS } from '../config/api.jsx'

export const sweetService = {
  // Public method - no auth required for viewing
  async getAllSweets() {
    try {
      const response = await fetch(API_ENDPOINTS.sweets, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sweets: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sweets:', error);
      throw error;
    }
  },

  // Get sweet by ID
  async getSweetById(id) {
    try {
      const response = await fetch(`${API_ENDPOINTS.sweets}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sweet');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sweet');
    }
  },

  // Create new sweet (Admin only)
  async createSweet(sweetData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login as admin to create sweets');
    }

    try {
      const response = await fetch(API_ENDPOINTS.sweets, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sweetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create sweet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating sweet:', error);
      throw error;
    }
  },

  // Update sweet (Admin only)
  async updateSweet(id, sweetData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login as admin to update sweets');
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.sweets}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sweetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update sweet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating sweet:', error);
      throw error;
    }
  },

  // Delete sweet (Admin only)
  async deleteSweet(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login as admin to delete sweets');
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.sweets}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete sweet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting sweet:', error);
      throw error;
    }
  },

  // Purchase sweet
  async purchaseSweet(sweetId, purchaseData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to purchase sweets');
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.sweets}/${sweetId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to purchase sweet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error purchasing sweet:', error);
      throw error;
    }
  }
}