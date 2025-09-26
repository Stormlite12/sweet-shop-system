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
  
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageInputType, setImageInputType] = useState('url') // 'url' or 'upload'

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

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      
      // Clear URL input when file is selected
      setFormData({...formData, image: ''})
    } else {
      setImageFile(null)
      setImagePreview('')
    }
  }

  // Upload image to server
  const uploadImage = async (file) => {
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)
    
    try {
      console.log('📤 Uploading file:', file.name);
      
      // Get the token for authentication
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Please login as admin to upload images')
      }
      
      const response = await fetch(API_ENDPOINTS.upload, { // Use config instead of hardcoded URL
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Add auth token
        },
        body: formDataUpload,
      })
      
      if (response.status === 401) {
        throw new Error('Admin login required to upload images')
      }
      
      if (response.status === 403) {
        throw new Error('Admin privileges required to upload images')
      }
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json()
      console.log('✅ Upload successful:', data);
      return data.imageUrl
    } catch (error) {
      console.error('❌ Image upload error:', error)
      
      // Show specific error messages
      if (error.message.includes('401') || error.message.includes('Admin login')) {
        toast.error('Please login as admin to upload images')
      } else if (error.message.includes('403') || error.message.includes('privileges')) {
        toast.error('Admin privileges required for image uploads')
      } else {
        toast.error('Image upload failed: ' + error.message)
      }
      
      throw error
    }
  }

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const stockValue = parseInt(formData.stock, 10);
      const finalStock = isNaN(stockValue) ? 0 : stockValue;

      const priceValue = parseFloat(formData.price);
      const finalPrice = isNaN(priceValue) ? 0 : priceValue;

      let imageUrl = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'

      // Handle image - either upload file or use URL
      if (imageInputType === 'upload' && imageFile) {
        try {
          const uploadedUrl = await uploadImage(imageFile)
          imageUrl = uploadedUrl // Use the full URL returned from server
          toast.success('Image uploaded successfully!')
          console.log('📤 Using uploaded image URL:', imageUrl)
        } catch (error) {
          // If upload fails, offer to use URL instead or default image
          if (error.message.includes('Admin') || error.message.includes('401') || error.message.includes('403')) {
            toast.error('Upload failed - using default image instead')
            imageUrl = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
          } else {
            toast.error('Failed to upload image: ' + error.message)
            setLoading(false)
            return
          }
        }
      } else if (imageInputType === 'url' && formData.image.trim()) {
        imageUrl = formData.image.trim()
      }

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
      setImageFile(null)
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
    setImageFile(null)
    setImagePreview(sweet.image || '')
    setImageInputType('url') // Default to URL when editing
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
    setImageFile(null)
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
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-3xl font-bold text-neutral mb-4">Admin Access Required</h2>
        <p className="text-lg text-base-content/70">
          Please login as an admin to manage sweets.
        </p>
      </div>
    )
  }

  console.log('🎯 AdminPanel render - sweets count:', sweets.length)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral mb-4">
          Sweet Shop Management
        </h2>
        <p className="text-lg text-base-content/70">
          Add, edit, and manage your sweet inventory
        </p>
      </div>

      {/* Debug Info (remove this later) */}
      <div className="alert alert-info">
        <span>Debug: Found {sweets.length} sweets | Loading: {loading.toString()} | Tab: {activeTab}</span>
        <button onClick={fetchSweets} className="btn btn-sm">Refresh</button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed justify-center bg-base-100 shadow-lg max-w-fit mx-auto">
        <button 
          className={`tab tab-lg ${activeTab === 'add' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          {editingSweet ? '✏️ Edit Sweet' : '➕ Add Sweet'}
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'view' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('view')
            fetchSweets() // Force refresh
          }}
        >
          👀 View All ({sweets.length})
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'manage' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('manage')
            fetchSweets() // Force refresh
          }}
        >
          ⚙️ Manage
        </button>
      </div>

      {/* Add/Edit Sweet Tab */}
      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">
                {editingSweet ? '✏️ Edit Sweet' : '➕ Add New Sweet'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sweet Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">Sweet Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Gulab Jamun"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">Category</span>
                  </label>
                  <select
                    name="category"
                    className="select select-bordered w-full"
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
                      <span className="label-text text-lg font-semibold">Price (₹)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="input input-bordered"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-semibold">Stock Quantity</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      min="0"
                      className="input input-bordered"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Image Input with Toggle */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">Sweet Image</span>
                  </label>
                  
                  {/* Image Input Type Toggle */}
                  <div className="tabs tabs-boxed mb-4 w-fit">
                    <button 
                      type="button"
                      className={`tab ${imageInputType === 'url' ? 'tab-active' : ''}`}
                      onClick={() => {
                        setImageInputType('url')
                        setImageFile(null)
                        setImagePreview(formData.image || '')
                      }}
                    >
                      🔗 Image URL
                    </button>
                    <button 
                      type="button"
                      className={`tab ${imageInputType === 'upload' ? 'tab-active' : ''}`}
                      onClick={() => {
                        setImageInputType('upload')
                        setFormData({...formData, image: ''})
                        setImagePreview(imageFile ? URL.createObjectURL(imageFile) : '')
                      }}
                      title="Requires admin login for file uploads"
                    >
                      📁 Upload File {!isAdmin && '🔒'}
                    </button>
                  </div>

                  {/* Show admin requirement notice for uploads */}
                  {imageInputType === 'upload' && !isAdmin && (
                    <div className="alert alert-warning mb-4">
                      <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Admin login required for file uploads. Please use Image URL instead.</span>
                    </div>
                  )}

                  {/* URL Input */}
                  {imageInputType === 'url' && (
                    <>
                      <input
                        type="url"
                        name="image"
                        placeholder="https://example.com/image.jpg"
                        className="input input-bordered w-full"
                        value={formData.image}
                        onChange={(e) => {
                          handleChange(e)
                          setImagePreview(e.target.value)
                        }}
                      />
                      <div className="label">
                        <span className="label-text-alt">Enter a direct image URL (JPG, PNG, GIF)</span>
                      </div>
                    </>
                  )}

                  {/* File Upload */}
                  {imageInputType === 'upload' && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full"
                      />
                      <div className="label">
                        <span className="label-text-alt">Upload from your device (Max 5MB)</span>
                      </div>
                    </>
                  )}

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
                          className="w-48 h-48 object-cover rounded-lg border-2 border-base-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
                          }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => {
                            if (imageInputType === 'url') {
                              setFormData({...formData, image: ''})
                            } else {
                              setImageFile(null)
                            }
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
                      className="btn btn-outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
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
                  ➕ Add New Sweet
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
                          src={sweet.image || '/placeholder.jpg'}
                          alt={sweet.name}
                          className="rounded-xl w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg'
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
                                    src={sweet.image || '/placeholder.jpg'}
                                    alt={sweet.name}
                                    onError={(e) => {
                                      e.target.src = '/placeholder.jpg'
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