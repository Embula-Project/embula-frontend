"use client";
import { useState } from "react";
import { registerUser } from "../../services/UserAuthServices";
import ErrorDialog from "../../customer/components/ErrorDialog";
import { useErrorDialog } from "../../customer/hooks/useErrorDialog";

export default function SignUp({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    // Customer-specific fields
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const { error, showError, clearError } = useErrorDialog();
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
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    // Customer-specific validations
    if (formData.role === "CUSTOMER") {
      if (!formData.firstName || formData.firstName.trim() === "") {
        newErrors.firstName = "First name is required";
      }
      
      if (!formData.lastName || formData.lastName.trim() === "") {
        newErrors.lastName = "Last name is required";
      }
      
      if (!formData.address || formData.address.trim() === "") {
        newErrors.address = "Address is required";
      }
      
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[\s-]/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
      }
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
    
    // Real-time password matching validation
    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword" && value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else if (name === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else if (name === "confirmPassword" && value === formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      } else if (name === "password" && value === formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Prepare base payload with id as integer
      const payload = {
        id: parseInt(formData.id),
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      
      // Add customer-specific fields if role is CUSTOMER
      if (formData.role === "CUSTOMER") {
        payload.firstName = formData.firstName;
        payload.lastName = formData.lastName;
        payload.address = formData.address;
        payload.phoneNumber = formData.phoneNumber;
      }
      
      // Call the register user API
      console.log("Registering user with payload:", payload);
      const response = await registerUser(payload);
      console.log("Registration successful:", response);
      
      // Handle successful signup
      alert("Signup successful! You can now login.");
      
      // Optionally switch to login page after successful registration
      if (onSwitchToLogin) {
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showError(error.message || "Signup failed. Please check your information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ErrorDialog 
        open={!!error} 
        onClose={clearError} 
        message={error} 
        title="Registration Error"
      />
      
      <div 
        className="min-h-screen flex items-center justify-center p-4 py-8 relative"
        style={{
          backgroundImage: 'url("/menupage.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/85 backdrop-blur-sm"></div>
        
      <div className="w-full max-w-2xl relative z-10">
        {/* Card Container */}
        <div className="bg-gradient-to-br from-black to-gray-900 border border-amber-900/30 rounded-xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">Join us today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
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
                  errors.id ? "border-red-500" : "border-amber-900/30"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
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
                  errors.email ? "border-red-500" : "border-amber-900/30"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="saman@embula.com"
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
                  errors.password ? "border-red-500" : "border-amber-900/30"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  errors.confirmPassword ? "border-red-500" : 
                  formData.confirmPassword && formData.confirmPassword === formData.password ? "border-green-500" :
                  "border-amber-900/30"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
              {!errors.confirmPassword && formData.confirmPassword && formData.confirmPassword === formData.password && (
                <p className="mt-1 text-sm text-green-400">✓ Passwords match</p>
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
                  errors.role ? "border-red-500" : "border-amber-900/30"
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
              >
                <option value="">Select a role</option>
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role}</p>
              )}
            </div>

            {/* Conditional Customer Fields */}
            {formData.role === "CUSTOMER" && (
              <>
                {/* First Name & Last Name - Two columns on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.firstName ? "border-red-500" : "border-amber-900/30"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.lastName ? "border-red-500" : "border-amber-900/30"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Address Field */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.address ? "border-red-500" : "border-amber-900/30"
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none`}
                    placeholder="123 Main St, City, Country"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-400">{errors.address}</p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      errors.phoneNumber ? "border-red-500" : "border-amber-900/30"
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                    placeholder="0771234567"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-full font-semibold text-white transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg hover:shadow-amber-500/50 hover:scale-105"
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
                className="text-amber-400 hover:text-amber-300 font-medium underline-offset-2 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
