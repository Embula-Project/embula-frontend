/**
 * ERROR DIALOG IMPLEMENTATION GUIDE
 * ==================================
 * 
 * This guide shows how to use the ErrorDialog and SuccessDialog components
 * for better error and success message handling across the application.
 */

// ============================================================================
// COMPONENTS CREATED
// ============================================================================

/**
 * 1. ErrorDialog Component
 * Location: src/app/customer/components/ErrorDialog.jsx
 * 
 * A Material-UI dialog for displaying error messages with:
 * - Dark theme styling matching the app
 * - Error icon
 * - Customizable title and message
 * - Purple action button
 * - Responsive design
 */

/**
 * 2. SuccessDialog Component
 * Location: src/app/customer/components/SuccessDialog.jsx
 * 
 * A Material-UI dialog for displaying success messages with:
 * - Dark theme styling matching the app
 * - Success checkmark icon
 * - Customizable title and message
 * - Green action button
 * - Responsive design
 */

/**
 * 3. useErrorDialog Hook
 * Location: src/app/customer/hooks/useErrorDialog.js
 * 
 * A custom React hook for managing error dialog state with:
 * - error: Current error message (null if no error)
 * - showError(message): Function to display an error
 * - clearError(): Function to close the error dialog
 * - hasError: Boolean indicating if there's an error
 */

// ============================================================================
// INSTALLATION
// ============================================================================

/**
 * Material-UI packages installed:
 * - @mui/material
 * - @emotion/react
 * - @emotion/styled
 * 
 * Command used:
 * npm install @mui/material @emotion/react @emotion/styled
 */

// ============================================================================
// BASIC USAGE - ERROR DIALOG
// ============================================================================

/**
 * Example 1: Using ErrorDialog with useErrorDialog hook
 */
import ErrorDialog from "../../customer/components/ErrorDialog";
import { useErrorDialog } from "../../customer/hooks/useErrorDialog";

function MyComponent() {
  const { error, showError, clearError } = useErrorDialog();

  const handleSomething = async () => {
    try {
      // Your code here
      await someApiCall();
    } catch (err) {
      showError("Failed to load data. Please try again.");
    }
  };

  return (
    <>
      <ErrorDialog 
        open={!!error} 
        onClose={clearError} 
        message={error} 
        title="Error"
      />
      
      {/* Your component JSX */}
      <button onClick={handleSomething}>Click Me</button>
    </>
  );
}

/**
 * Example 2: Using ErrorDialog with custom state
 */
import { useState } from "react";
import ErrorDialog from "../../customer/components/ErrorDialog";

function MyComponent2() {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAction = async () => {
    try {
      await someAction();
    } catch (err) {
      setErrorMessage("An error occurred!");
    }
  };

  return (
    <>
      <ErrorDialog 
        open={!!errorMessage} 
        onClose={() => setErrorMessage(null)} 
        message={errorMessage} 
        title="Operation Failed"
        buttonText="Close"
      />
      
      <button onClick={handleAction}>Do Something</button>
    </>
  );
}

// ============================================================================
// BASIC USAGE - SUCCESS DIALOG
// ============================================================================

/**
 * Example 3: Using SuccessDialog
 */
import { useState } from "react";
import SuccessDialog from "../../customer/components/SuccessDialog";

function RegistrationForm() {
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async () => {
    try {
      await registerUser(data);
      setSuccessMessage("Registration successful! You can now log in.");
    } catch (err) {
      // Handle error
    }
  };

  return (
    <>
      <SuccessDialog 
        open={!!successMessage} 
        onClose={() => setSuccessMessage(null)} 
        message={successMessage} 
        title="Success!"
      />
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </>
  );
}

// ============================================================================
// COMPONENTS UPDATED
// ============================================================================

/**
 * The following components have been updated to use ErrorDialog:
 * 
 * 1. Menu Component (src/app/customer/components/Menu.jsx)
 *    - Shows dialog for menu loading errors
 *    - Shows dialog for pagination errors
 *    - Removed inline error display
 * 
 * 2. Login Component (src/app/components/mainpage/Login.jsx)
 *    - Shows dialog for login API errors
 *    - Removed inline submit error display
 *    - Keeps field-level validation errors inline
 * 
 * 3. SignUp Component (src/app/components/mainpage/SignUp.jsx)
 *    - Shows dialog for registration API errors
 *    - Removed inline submit error display
 *    - Keeps field-level validation errors inline
 */

// ============================================================================
// DIALOG PROPS
// ============================================================================

/**
 * ErrorDialog Props:
 * @param {boolean} open - Controls dialog visibility (required)
 * @param {function} onClose - Callback when dialog closes (required)
 * @param {string} message - Error message to display (required)
 * @param {string} title - Dialog title (optional, default: "Error")
 * @param {string} buttonText - Button text (optional, default: "OK")
 */

/**
 * SuccessDialog Props:
 * @param {boolean} open - Controls dialog visibility (required)
 * @param {function} onClose - Callback when dialog closes (required)
 * @param {string} message - Success message to display (required)
 * @param {string} title - Dialog title (optional, default: "Success")
 * @param {string} buttonText - Button text (optional, default: "OK")
 */

// ============================================================================
// STYLING
// ============================================================================

/**
 * Both dialogs use:
 * - Black background (#000000)
 * - Gray borders (#374151)
 * - Rounded corners (12px)
 * - Min width: 400px, Max width: 500px
 * - Responsive design
 * - Smooth hover effects
 * - Icons for visual clarity
 * 
 * ErrorDialog: Red title (#EF4444) with warning icon
 * SuccessDialog: Green title (#10B981) with checkmark icon
 */

// ============================================================================
// ADVANCED USAGE
// ============================================================================

/**
 * Example 4: Multiple error types with custom titles
 */
function AdvancedComponent() {
  const { error, showError, clearError } = useErrorDialog();
  const [errorTitle, setErrorTitle] = useState("Error");

  const handleNetworkError = () => {
    setErrorTitle("Network Error");
    showError("Unable to connect to the server. Please check your internet connection.");
  };

  const handleValidationError = () => {
    setErrorTitle("Validation Error");
    showError("Please fill in all required fields correctly.");
  };

  return (
    <>
      <ErrorDialog 
        open={!!error} 
        onClose={clearError} 
        message={error} 
        title={errorTitle}
      />
      
      <button onClick={handleNetworkError}>Test Network Error</button>
      <button onClick={handleValidationError}>Test Validation Error</button>
    </>
  );
}

/**
 * Example 5: Combining Error and Success dialogs
 */
function FormComponent() {
  const { error, showError, clearError } = useErrorDialog();
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (data) => {
    try {
      await submitData(data);
      setSuccess("Your data has been saved successfully!");
    } catch (err) {
      showError(err.message || "Failed to save data. Please try again.");
    }
  };

  return (
    <>
      <ErrorDialog 
        open={!!error} 
        onClose={clearError} 
        message={error} 
      />
      
      <SuccessDialog 
        open={!!success} 
        onClose={() => setSuccess(null)} 
        message={success} 
      />
      
      {/* Form here */}
    </>
  );
}

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * 1. Use dialogs for important messages that need user attention
 * 2. Keep inline errors for field-level validation
 * 3. Use clear, user-friendly error messages
 * 4. Always provide a way to close the dialog
 * 5. Consider auto-closing success dialogs after a delay (optional)
 * 6. Use appropriate titles to give context
 * 7. Keep messages concise but informative
 */

/**
 * Example 6: Auto-closing success dialog
 */
function AutoCloseExample() {
  const [success, setSuccess] = useState(null);

  const handleSuccess = () => {
    setSuccess("Operation completed successfully!");
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  return (
    <>
      <SuccessDialog 
        open={!!success} 
        onClose={() => setSuccess(null)} 
        message={success} 
      />
      
      <button onClick={handleSuccess}>Complete Action</button>
    </>
  );
}

// ============================================================================
// NOTES
// ============================================================================

/**
 * - Dialogs are accessible with proper ARIA labels
 * - Click outside or press ESC to close (default MUI behavior)
 * - Dialogs are centered on screen
 * - They work on mobile and desktop
 * - The backdrop darkens the background when dialog is open
 * - Only one dialog should be open at a time for better UX
 */

export default {};
