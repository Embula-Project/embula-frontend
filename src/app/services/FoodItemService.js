import apiClient from './ApiClient';

/**
 * Service for food item management operations (Admin)
 */

/**
 * Get all food items with pagination
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Page size
 * @returns {Promise} Promise resolving to paginated food items
 */
export const getAllFoodItems = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/api/v1/fooditem/getAllFoodItems', {
      params: { page, size }
    });
    console.log('Fetched food items:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching food items:', error);
    throw error;
  }
};

/**
 * Add a new food item with image
 * @param {Object} foodItemData - Food item details
 * @param {File} imageFile - Image file
 * @returns {Promise} Promise resolving to created food item
 */
export const addFoodItem = async (foodItemData, imageFile) => {
  try {
    const formData = new FormData();
    
    // Add the food item DTO as a JSON blob
    const foodItemBlob = new Blob([JSON.stringify(foodItemData)], {
      type: 'application/json'
    });
    formData.append('foodItemDTO', foodItemBlob);
    
    // Add the image file
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    
    const response = await apiClient.post('/api/v1/fooditem', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Food item added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding food item:', error);
    throw error;
  }
};

/**
 * Update an existing food item
 * @param {string|number} itemId - Food item ID
 * @param {Object} foodItemData - Updated food item details
 * @param {File} imageFile - Image file (optional)
 * @returns {Promise} Promise resolving to updated food item
 */
export const updateFoodItem = async (itemId, foodItemData, imageFile) => {
  try {
    const formData = new FormData();
    
    // Add the food item update DTO as a JSON blob
    const foodItemBlob = new Blob([JSON.stringify(foodItemData)], {
      type: 'application/json'
    });
    formData.append('foodItemUpdateDTO', foodItemBlob);
    
    // Add the image file if provided
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    
    const response = await apiClient.put(`/api/v1/fooditem/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Food item updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating food item ${itemId}:`, error);
    throw error;
  }
};

/**
 * Delete a food item
 * @param {string|number} itemId - Food item ID
 * @returns {Promise} Promise resolving to deletion response
 */
export const deleteFoodItem = async (itemId) => {
  try {
    const response = await apiClient.delete(`/api/v1/fooditem/${itemId}`);
    console.log('Food item deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting food item ${itemId}:`, error);
    throw error;
  }
};
