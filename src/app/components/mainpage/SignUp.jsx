"use client";
import { useState } from "react";

export default function SignUp({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // ID validation
    if (!formData.id) {
      newErrors.id = "ID is required";
    } else if (isNaN(formData.id) || parseInt(formData.id) < 0) {
      newErrors.id = "ID must be a valid positive number";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Prepare data with id as integer
      const payload = {
        id: parseInt(formData.id),
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      
      // TODO: Replace with your actual signup API call
      console.log("Signup attempt:", payload);
      
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Handle successful signup here
      alert("Signup successful!");
    } catch (error) {
      setErrors({ submit: "Signup failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-black border border-gray-700 rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Join us today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ID Field */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-2">
                User ID
              </label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.id ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="Enter your ID"
              />
              {errors.id && (
                <p className="mt-1 text-sm text-red-400">{errors.id}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.email ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.role ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              >
                <option value="">Select a role</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={onSwitchToLogin} 
                className="text-purple-400 hover:text-purple-300 font-medium underline-offset-2 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
