// API configuration for different environments

const getApiBaseUrl = () => {
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    // Development - use localhost:5000 (NOT 8080!)
    return 'http://localhost:5000'
  } else {
    // Production - use Railway URL
    return import.meta.env.VITE_API_BASE_URL || 'https://energetic-kindness-production.up.railway.app'
  }
}

export const API_BASE_URL = getApiBaseUrl()
export const API_ENDPOINTS = {
  sweets: `${API_BASE_URL}/api/sweets`,
  auth: `${API_BASE_URL}/api/auth`, 
  upload: `${API_BASE_URL}/api/sweets/upload`,
  uploads: `${API_BASE_URL}/uploads`
}

// Debug logging with more info
console.log('🔧 API Configuration:', {
  environment: import.meta.env.DEV ? 'development' : 'production',
  mode: import.meta.env.MODE,
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS,
  origin: window.location.origin
})
