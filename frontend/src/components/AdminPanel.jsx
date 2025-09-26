// src/components/AdminPanel.jsx
import { useState, useEffect } from 'react'
import { sweetService } from '../services/sweetService.jsx'
import { authService } from '../services/authService.jsx'
import toast from 'react-hot-toast'
import { API_ENDPOINTS } from '../config/api.jsx'

export default function AdminPanel() {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('add')
  const [editingSweet, setEditingSweet] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  })
  
  const [imagePreview, setImagePreview] = useState('')

  // Check if user is admin
  const isAdmin = authService.isAdmin()

  // Fetch all sweets with debug logging
  const fetchSweets = async () => {
    try {
      setLoading(true)
      console.log('🔍 AdminPanel: Fetching sweets...')
      const data = await sweetService.getAllSweets()
      console.log('📦 AdminPanel: Raw data received:', data)

      
      const sweetsList = Array.isArray(data) ? data : (data.sweets || [])
    console.log('📦 AdminPanel: Final sweets list:', sweetsList)
    console.log('📦 AdminPanel: Setting sweets:', sweetsList.length, 'items')
    
      
      setSweets(sweetsList)
    } catch (error) {
      console.error('❌ AdminPanel: Error fetching sweets:', error)
      toast.error('Failed to fetch sweets: ' + error.message)
      setSweets([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch sweets when component mounts or when user becomes admin
  useEffect(() => {
    console.log('🔍 AdminPanel useEffect - isAdmin:', isAdmin)
    if (isAdmin) {
      fetchSweets()
    }
  }, [isAdmin])

  // Also listen for external sweet updates
  useEffect(() => {
    const handleSweetsUpdate = () => {
      console.log('🔄 AdminPanel: External sweet update detected')
      if (isAdmin) {
        fetchSweets()
      }
    }

    window.addEventListener('sweetsUpdated', handleSweetsUpdate)
    return () => {
      window.removeEventListener('sweetsUpdated', handleSweetsUpdate)
    }
  }, [isAdmin])

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle form submission with simplified image handling
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const stockValue = parseInt(formData.stock, 10);
      const finalStock = isNaN(stockValue) ? 0 : stockValue;

      const priceValue = parseFloat(formData.price);
      const finalPrice = isNaN(priceValue) ? 0 : priceValue;

      // Use URL or default image
      const imageUrl = formData.image.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'

      const sweetData = {
        name: formData.name.trim(),
        category: formData.category,
        price: finalPrice,
        stock: finalStock,
        image: imageUrl,
      };

      console.log('🍭 Processed sweet data:', sweetData)

      if (editingSweet) {
        await sweetService.updateSweet(editingSweet._id, sweetData)
        toast.success('Sweet updated successfully! 🍭')
        setEditingSweet(null)
      } else {
        await sweetService.createSweet(sweetData)
        toast.success('Sweet added successfully! 🍭')
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        image: ''
      })
      setImagePreview('')

      // Refresh sweets list
      await fetchSweets()
      
      // Trigger refresh of main SweetCards
      window.dispatchEvent(new Event('sweetsUpdated'))
      
      setActiveTab('view')
    } catch (error) {
      console.error('❌ Submit error:', error)
      toast.error(error.message || 'Failed to save sweet')
    } finally {
      setLoading(false)
    }
  }

  // Handle edit sweet
  const handleEdit = (sweet) => {
    setFormData({
      name: sweet.name,
      price: sweet.price.toString(),
      stock: sweet.stock.toString(),
      category: sweet.category || '',
      image: sweet.image || ''
    })
    setEditingSweet(sweet)
    setImagePreview(sweet.image || '')
    setActiveTab('add')
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSweet(null)
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      image: ''
    })
    setImagePreview('')
  }

  // Handle delete sweet
  const handleDelete = async (sweetId, sweetName) => {
    if (!confirm(`Are you sure you want to delete "${sweetName}"?`)) {
      return
    }

    try {
      await sweetService.deleteSweet(sweetId)
      toast.success('Sweet deleted successfully! 🗑️')
      await fetchSweets()
      
      // Trigger refresh of main SweetCards
      window.dispatchEvent(new Event('sweetsUpdated'))
    } catch (error) {
      toast.error(error.message)
    }
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">Admin Access Required</h2>
        <p className="text-lg text-orange-800/70">
          Please login as an admin to manage sweets.
        </p>
      </div>
    )
  }

  console.log('🎯 AdminPanel render - sweets count:', sweets.length)

  return (
    <div className="space-y-8 bg-gradient-to-b from-orange-50 to-white min-h-screen py-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">
          Sweet Shop Management
        </h2>
        <p className="text-lg text-orange-800/70">
          Add, edit, and manage your sweet inventory
        </p>
      </div>

      {/* Debug Info */}
      <div className="alert bg-amber-100 border-amber-300 max-w-4xl mx-auto">
        <span className="text-amber-800">Debug: Found {sweets.length} sweets | Loading: {loading.toString()} | Tab: {activeTab}</span>
        <button onClick={fetchSweets} className="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-orange-600">Refresh</button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-lg shadow-lg max-w-fit mx-auto border border-orange-200">
        <button 
          className={`px-6 py-3 rounded-l-lg font-medium transition-colors ${
            activeTab === 'add' 
              ? 'bg-orange-600 text-white' 
              : 'text-orange-700 hover:bg-orange-50'
          }`}
          onClick={() => setActiveTab('add')}
        >
          {editingSweet ? 'Edit Sweet' : 'Add Sweet'}
        </button>
        <button 
          className={`px-6 py-3 font-medium transition-colors border-l border-orange-200 ${
            activeTab === 'view' 
              ? 'bg-orange-600 text-white' 
              : 'text-orange-700 hover:bg-orange-50'
          }`}
          onClick={() => {
            setActiveTab('view')
            fetchSweets()
          }}
        >
          View All ({sweets.length})
        </button>
        <button 
          className={`px-6 py-3 rounded-r-lg font-medium transition-colors border-l border-orange-200 ${
            activeTab === 'manage' 
              ? 'bg-orange-600 text-white' 
              : 'text-orange-700 hover:bg-orange-50'
          }`}
          onClick={() => {
            setActiveTab('manage')
            fetchSweets()
          }}
        >
          Manage
        </button>
      </div>

      {/* Add/Edit Sweet Tab */}
      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto">
          <div className="card bg-white shadow-xl border border-orange-200">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6 text-orange-600">
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sweet Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-lg font-semibold text-orange-800">Sweet Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Gulab Jamun"
                    className="input input-bordered border-orange-300 focus:border-orange-500 w-full bg-white text-gray-900 placeholder-gray-500"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-lg font-semibold text-orange-800">Category</span>
                  </label>
                  <select
                    name="category"
                    className="select select-bordered border-orange-300 focus:border-orange-500 w-full bg-white text-gray-900"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="milk-based">Milk-based Sweets</option>
                    <option value="sugar-based">Sugar-based Sweets</option>
                    <option value="dry-fruits">Dry Fruit Sweets</option>
                    <option value="festival">Festival Specials</option>
                    <option value="snacks">Savory Snacks</option>
                  </select>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-semibold text-orange-800">Price (₹)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="input input-bordered border-orange-300 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-semibold text-orange-800">Stock Quantity</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      min="0"
                      className="input input-bordered border-orange-300 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Image Input - URL Only */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-lg font-semibold text-orange-800">Sweet Image</span>
                  </label>
                  
                  <input
                    type="url"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered border-orange-300 focus:border-orange-500 w-full bg-white text-gray-900 placeholder-gray-500"
                    value={formData.image}
                    onChange={(e) => {
                      handleChange(e)
                      setImagePreview(e.target.value)
                    }}
                  />
                  <div className="label">
                    <span className="label-text-alt text-orange-600">Enter a direct image URL (JPG, PNG, GIF)</span>
                  </div>
                  <div className="label">
                    <span className="label-text-alt text-amber-600">💡 Leave empty to use default sweet image</span>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <div className="label">
                        <span className="label-text font-semibold">Preview:</span>
                      </div>
                      <div className="flex justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-48 h-48 object-cover rounded-lg border-2 border-orange-200"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
                          }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <button
                          type="button"
                          className="btn btn-sm bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
                          onClick={() => {
                            setFormData({...formData, image: ''})
                            setImagePreview('')
                          }}
                        >
                          Clear Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="card-actions justify-end space-x-2">
                  {editingSweet && (
                    <button
                      type="button"
                      className="btn btn-outline border-orange-300 text-orange-700 hover:bg-orange-50"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`btn bg-orange-600 hover:bg-orange-700 text-white border-orange-600 ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingSweet ? 'Update Sweet' : 'Add Sweet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View All Sweets Tab */}
      {activeTab === 'view' && (
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h3 className="card-title text-2xl">All Sweets ({sweets.length})</h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => setActiveTab('add')}
                >
                  ➕ Add New Sw
                  eet
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-4">Loading sweets...</p>
                </div>
              ) : sweets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍭</div>
                  <h4 className="text-xl font-bold mb-2">No sweets found</h4>
                  <p className="text-base-content/70 mb-4">
                    Start by adding your first sweet to the inventory.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('add')}
                  >
                    ➕ Add Your First Sweet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sweets.map((sweet) => (
                    <div key={sweet._id} className="card bg-base-200 shadow-md">
                      <figure className="px-4 pt-4">
                        <img
                          src={sweet.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"}
                          alt={sweet.name}
                          className="rounded-xl w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                          }}
                        />
                      </figure>
                      <div className="card-body">
                        <h3 className="card-title text-lg">{sweet.name}</h3>
                        <div className="space-y-2">
                          <p><span className="font-semibold">Category:</span> {sweet.category}</p>
                          <p><span className="font-semibold">Price:</span> ₹{sweet.price}</p>
                          <p><span className="font-semibold">Stock:</span> {sweet.stock} units</p>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleEdit(sweet)}
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div className="max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Manage Sweets</h3>

              {loading ? (
                <div className="text-center py-12">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-4">Loading sweets...</p>
                </div>
              ) : sweets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h4 className="text-xl font-bold mb-2">No sweets to manage</h4>
                  <p className="text-base-content/70">
                    Add some sweets first to manage them here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Sweet</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sweets.map((sweet) => (
                        <tr key={sweet._id}>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img
                                    src={sweet.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"}
                                    alt={sweet.name}
                                    onError={(e) => {
                                      e.target.src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{sweet.name}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-ghost">{sweet.category}</span>
                          </td>
                          <td className="font-semibold">₹{sweet.price}</td>
                          <td>
                            <span className={`badge ${sweet.stock <= 5 ? 'badge-error' : sweet.stock <= 20 ? 'badge-warning' : 'badge-success'}`}>
                              {sweet.stock} units
                            </span>
                          </td>
                          <td>
                            <div className="flex space-x-2">
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleEdit(sweet)}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-error btn-outline"
                                onClick={() => handleDelete(sweet._id, sweet.name)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary Stats */}
              {sweets.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="stat bg-primary text-primary-content rounded-lg">
                    <div className="stat-title">Total Sweets</div>
                    <div className="stat-value">{sweets.length}</div>
                  </div>
                  <div className="stat bg-success text-success-content rounded-lg">
                    <div className="stat-title">Total Stock</div>
                    <div className="stat-value">{sweets.reduce((sum, sweet) => sum + sweet.stock, 0)}</div>
                  </div>
                  <div className="stat bg-accent text-accent-content rounded-lg">
                    <div className="stat-title">Low Stock Items</div>
                    <div className="stat-value">{sweets.filter(sweet => sweet.stock <= 5).length}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}