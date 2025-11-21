"use client";
import React, { useState } from 'react';
import { createDiscount, uploadDiscountImage } from '../../services/discountService';

const DiscountForm = ({ onDiscountAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    validFrom: '',
    validTo: '',
    isActive: true,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let finalImageUrl = formData.imageUrl;

      // Handle file upload if selected
      if (uploadType === 'file' && imageFile) {
        const uploadResponse = await uploadDiscountImage(imageFile);
        // Assuming the API returns the URL in a property like 'url' or 'imageUrl'
        // Adjust based on actual API response structure
        finalImageUrl = uploadResponse.imageUrl || uploadResponse.url || uploadResponse; 
      }

      const discountPayload = {
        ...formData,
        imageUrl: finalImageUrl,
        discountPercentage: Number(formData.discountPercentage)
      };

      await createDiscount(discountPayload);
      setMessage('Discount created successfully!');
      setFormData({
        title: '',
        description: '',
        discountPercentage: '',
        validFrom: '',
        validTo: '',
        isActive: true,
        imageUrl: ''
      });
      setImageFile(null);
      if (onDiscountAdded) onDiscountAdded();
    } catch (error) {
      console.error(error);
      setMessage('Failed to create discount. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Discount</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('success') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Discount Percentage</label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Valid From</label>
            <input
              type="date"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Valid To</label>
            <input
              type="date"
              name="validTo"
              value={formData.validTo}
              onChange={handleChange}
              required
              className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Image Source</label>
          <div className="flex space-x-4 mb-3">
            <button
              type="button"
              onClick={() => setUploadType('url')}
              className={`px-4 py-1 rounded-full text-sm transition-colors ${uploadType === 'url' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`px-4 py-1 rounded-full text-sm transition-colors ${uploadType === 'file' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Upload File
            </button>
          </div>

          {uploadType === 'url' ? (
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
            />
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            id="isActive"
            className="mr-2 w-4 h-4 accent-orange-600"
          />
          <label htmlFor="isActive" className="text-gray-300 text-sm">Active Discount</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Discount'}
        </button>
      </form>
    </div>
  );
};

export default DiscountForm;
