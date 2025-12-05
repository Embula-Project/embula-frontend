"use client";
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Styled components to match dark theme
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#000000',
    border: '1px solid #374151',
    borderRadius: '12px',
    minWidth: '400px',
    maxWidth: '500px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)({
  color: '#EF4444',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  borderBottom: '1px solid #374151',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const StyledDialogContent = styled(DialogContent)({
  color: '#D1D5DB',
  padding: '24px',
  fontSize: '1rem',
  lineHeight: '1.6',
});

const StyledDialogActions = styled(DialogActions)({
  padding: '16px 24px',
  borderTop: '1px solid #374151',
});

const StyledButton = styled(Button)({
  backgroundColor: '#7C3AED',
  color: '#FFFFFF',
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#6D28D9',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px rgba(124, 58, 237, 0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

/**
 * ErrorDialog Component
 * 
 * A Material-UI dialog for displaying error messages in a clean, user-friendly way
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Callback when dialog should close
 * @param {string} title - Dialog title (default: "Error")
 * @param {string} message - Error message to display
 * @param {string} buttonText - Close button text (default: "OK")
 */
export default function ErrorDialog({ 
  open, 
  onClose, 
  title = "Error", 
  message, 
  buttonText = "OK" 
}) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <StyledDialogTitle id="error-dialog-title">
        {/* Error Icon */}
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        {title}
      </StyledDialogTitle>

      <StyledDialogContent id="error-dialog-description">
        {message}
      </StyledDialogContent>

      <StyledDialogActions>
        <StyledButton onClick={onClose} autoFocus>
          {buttonText}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
