"use client";
import { useState } from 'react';

/**
 * Custom hook for managing error dialog state
 * 
 * Usage:
 * const { error, showError, clearError } = useErrorDialog();
 * 
 * // Show an error
 * showError("Something went wrong!");
 * 
 * // In JSX
 * <ErrorDialog open={!!error} onClose={clearError} message={error} />
 * 
 * @returns {Object} - { error, showError, clearError }
 */
export function useErrorDialog() {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    showError,
    clearError,
    hasError: !!error,
  };
}
