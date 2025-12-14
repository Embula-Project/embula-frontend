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
  color: '#10B981',
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
  backgroundColor: '#10B981',
  color: '#FFFFFF',
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#059669',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

/**
 * SuccessDialog Component
 * 
 * A Material-UI dialog for displaying success messages
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Callback when dialog should close
 * @param {string} title - Dialog title (default: "Success")
 * @param {string} message - Success message to display
 * @param {string} buttonText - Close button text (default: "OK")
 */
export default function SuccessDialog({ 
  open, 
  onClose, 
  title = "Success", 
  message, 
  buttonText = "OK" 
}) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="success-dialog-title"
      aria-describedby="success-dialog-description"
    >
      <StyledDialogTitle id="success-dialog-title">
        {/* Success Icon */}
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        {title}
      </StyledDialogTitle>

      <StyledDialogContent id="success-dialog-description">
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
