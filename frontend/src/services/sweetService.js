// src/services/sweetService.js
import { API_ENDPOINTS } from '../config/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  }
}

const sweetService = {
  getAllSweets: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.sweets, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get all sweets error:', error);
      throw error;
    }
  },

  createSweet: async (sweetData) => {
    try {
      const response = await fetch(API_ENDPOINTS.sweets, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sweetData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create sweet error:', error);
      throw error;
    }
  },

  updateSweet: async (id, sweetData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.sweets}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(sweetData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update sweet error:', error);
      throw error;
    }
  },

  deleteSweet: async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.sweets}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete sweet error:', error);
      throw error;
    }
  },

  purchaseSweet: async (id, purchaseData) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.sweets}/${id}/purchase`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Purchase sweet error:', error);
      throw error;
    }
  }
};

export { sweetService };