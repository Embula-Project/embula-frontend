'use client';
import { useState, useEffect } from 'react';
import { getAllFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from '@/app/services/FoodItemService';

function buildImageSrc(imageType, imageData) {
  if (!imageData || !imageType || !imageType.startsWith("image/")) return null;
  return `data:${imageType};base64,${imageData}`;
}

export default function FoodItemsSection() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  
  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, item: null });
  
  // Form data
  const [formData, setFormData] = useState({
    itemName: '',
    ingredients: [],
    type: '',
    description: '',
    price: '',
    portionSize: '',
    image: ''
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, [currentPage, pageSize]);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllFoodItems(currentPage, pageSize);
      
      console.log('Food items response:', response);
      
      if (response.code === 200 && response.data) {
        setFoodItems(response.data.list || []);
        setTotalItems(response.data.totalItems || 0);
      } else {
        setError('Failed to fetch food items');
      }
    } catch (err) {
      console.error('Error fetching food items:', err);
      setError(err.response?.data?.message || 'Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      itemName: '',
      ingredients: [],
      type: '',
      description: '',
      price: '',
      portionSize: '',
      image: ''
    });
    setIngredientInput('');
    setImageFile(null);
    setImagePreview(null);
    setShowAddEditModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName || '',
      ingredients: item.ingredients || [],
      type: item.type || '',
      description: item.description || '',
      price: item.price || '',
      portionSize: item.portionSize || '',
      image: item.image || ''
    });
    setIngredientInput('');
    setImageFile(null);
    // Build image preview from imageType and imageData
    const existingImageSrc = buildImageSrc(item?.imageType, item?.imageData);
    setImagePreview(existingImageSrc || null);
    setShowAddEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddEditModal(false);
    setEditingItem(null);
    setFormData({
      itemName: '',
      ingredients: [],
      type: '',
      description: '',
      price: '',
      portionSize: '',
      image: ''
    });
    setIngredientInput('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      const itemData = {
        itemName: formData.itemName,
        ingredients: formData.ingredients,
        type: formData.type,
        description: formData.description,
        price: parseFloat(formData.price),
        portionSize: formData.portionSize,
      };

      if (editingItem) {
        // Update existing item
        itemData.image = formData.image;
        await updateFoodItem(editingItem.itemId, itemData);
      } else {
        // Add new item
        if (!imageFile) {
          setError('Please select an image');
          setSubmitting(false);
          return;
        }
        await addFoodItem(itemData, imageFile);
      }

      await fetchFoodItems();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving food item:', err);
      setError(err.response?.data?.message || 'Failed to save food item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirmDialog({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    const { item } = deleteConfirmDialog;
    
    try {
      await deleteFoodItem(item.itemId);
      await fetchFoodItems();
      setDeleteConfirmDialog({ isOpen: false, item: null });
    } catch (err) {
      console.error('Error deleting food item:', err);
      setError(err.response?.data?.message || 'Failed to delete food item');
      setDeleteConfirmDialog({ isOpen: false, item: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmDialog({ isOpen: false, item: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Food Items Management</h2>
        <button 
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Item
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Items</p>
          <p className="text-3xl font-bold text-white mt-2">{totalItems}</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Current Page Items</p>
          <p className="text-3xl font-bold text-white mt-2">{foodItems.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Pages</p>
          <p className="text-3xl font-bold text-white mt-2">{Math.ceil(totalItems / pageSize)}</p>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {foodItems.length === 0 ? (
          <div className="col-span-full bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-400 text-lg">No food items found</p>
            <p className="text-gray-500 text-sm mt-2">Click "Add New Item" to create your first food item</p>
          </div>
        ) : (
          foodItems.map((item) => {
            const imageSrc = buildImageSrc(item?.imageType, item?.imageData);
            return (
            <div key={item.itemId} className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group">
              {/* Image */}
              <div className="relative h-48 bg-gray-800 overflow-hidden">
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Rs. {item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-1">{item.itemName}</h3>
                <p className="text-amber-400 text-sm mb-2">{item.type}</p>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                {/* Ingredients */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs mb-1">Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-xs">
                          {ingredient}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="text-gray-500 text-xs">+{item.ingredients.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-gray-500 text-xs mb-4">Portion: {item.portionSize}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="flex-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 hover:bg-blue-900/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="flex-1 bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-900/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalItems > pageSize && (
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {foodItems.length} of {totalItems} items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-amber-900/20 text-amber-400 border border-amber-500/30 rounded-lg">
              Page {currentPage + 1} of {Math.ceil(totalItems / pageSize)}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={(currentPage + 1) * pageSize >= totalItems}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Item Name *</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g., Chocolate Brownie"
                />
              </div>

              {/* Type and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Type *</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g., Dessert"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Price (Rs.) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0.1"
                    step="0.01"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              {/* Portion Size */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Portion Size *</label>
                <input
                  type="text"
                  name="portionSize"
                  value={formData.portionSize}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g., 1 piece, 250g, etc."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  placeholder="Describe the food item..."
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Ingredients</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="Add an ingredient"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-amber-900/30 text-amber-400 border border-amber-500/30 hover:bg-amber-900/50 px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <span key={index} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Image {!editingItem && '*'}
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 mb-2">Click to upload an image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-block bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmDialog.isOpen && deleteConfirmDialog.item && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-900/30 border-2 border-red-500/50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Delete Food Item
            </h3>

            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirmDialog.item.itemName}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
