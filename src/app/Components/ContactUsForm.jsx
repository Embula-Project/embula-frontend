'use client';
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { submitContactUs } from '../services/ContactUsService';

const complaintTypes = [
  { value: 'COMPLAINT', label: 'Complaint' },
  { value: 'FEEDBACK', label: 'Feedback' },
  { value: 'SUGGESTION', label: 'Suggestion' }
];

const initialFormState = {
  name: '',
  email: '',
  complaintType: '',
  description: ''
};

const ContactUsForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.complaintType) newErrors.complaintType = 'Please select a type';
    if (!formData.description.trim()) newErrors.description = 'Please enter a message';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContactUs(formData);
      setStatus('success');
      setFormData(initialFormState);
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your full name"
            className="w-full bg-gray-800/50 border border-gray-700 focus:border-amber-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors"
          />
          {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-800/50 border border-gray-700 focus:border-amber-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors"
          />
          {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {complaintTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleChange('complaintType', type.value)}
              className={`py-3 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${
                formData.complaintType === type.value
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        {errors.complaintType && <p className="text-red-400 text-xs mt-2">{errors.complaintType}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Message
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Tell us more..."
          rows={6}
          className="w-full bg-gray-800/50 border border-gray-700 focus:border-amber-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors resize-none"
        />
        {errors.description && <p className="text-red-400 text-xs mt-2">{errors.description}</p>}
      </div>

      {status === 'success' && (
        <p className="text-emerald-400 text-sm">Thanks! Your message has been sent successfully.</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm">Something went wrong while sending your message. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center gap-2"
      >
        {isSubmitting ? 'Sending...' : 'Submit'}
        <Send size={18} />
      </button>
    </form>
  );
};

export default ContactUsForm;
