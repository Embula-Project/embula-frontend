import axios from 'axios';

const API_URL = 'http://localhost:8081/api/discounts';

// GET all discounts
export const getDiscounts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

// POST new discount (JSON)
export const createDiscount = async (discountData) => {
  try {
    const response = await axios.post(API_URL, discountData);
    return response.data;
  } catch (error) {
    console.error("Error creating discount:", error);
    throw error;
  }
};

// POST upload image
export const uploadDiscountImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Assuming returns { imageUrl: "..." } or similar
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
