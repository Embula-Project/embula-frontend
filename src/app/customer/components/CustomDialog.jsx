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

const StyledDialogTitle = styled(DialogTitle)(({ variant }) => {
  const colors = {
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  };
  
  return {
    color: colors[variant] || colors.info,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderBottom: '1px solid #374151',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };
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
  gap: '12px',
});

const StyledButton = styled(Button)(({ variant }) => {
  const baseStyles = {
    padding: '10px 24px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    '&:active': {
      transform: 'translateY(0)',
    },
  };

  const primaryColors = {
    error: { bg: '#EF4444', hover: '#DC2626' },
    success: { bg: '#10B981', hover: '#059669' },
    warning: { bg: '#F59E0B', hover: '#D97706' },
    info: { bg: '#3B82F6', hover: '#2563EB' },
  };

  const colors = primaryColors[variant] || primaryColors.info;

  return {
    ...baseStyles,
    backgroundColor: colors.bg,
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: colors.hover,
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 6px ${colors.bg}50`,
    },
  };
});

const SecondaryButton = styled(Button)({
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'all 0.2s',
  backgroundColor: 'transparent',
  color: '#9CA3AF',
  border: '1px solid #4B5563',
  '&:hover': {
    backgroundColor: '#1F2937',
    borderColor: '#6B7280',
    color: '#D1D5DB',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

// Icon components
const ErrorIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const SuccessIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const icons = {
  error: <ErrorIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

/**
 * CustomDialog Component
 * 
 * A versatile Material-UI dialog for displaying messages with different variants
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Callback when dialog should close
 * @param {string} title - Dialog title
 * @param {string} message - Message to display
 * @param {string} variant - Dialog type: 'error', 'success', 'warning', 'info' (default: 'info')
 * @param {string} confirmText - Confirm button text (default: "OK")
 * @param {string} cancelText - Cancel button text (optional, if provided shows cancel button)
 * @param {function} onConfirm - Callback when confirm is clicked (optional)
 * @param {function} onCancel - Callback when cancel is clicked (optional)
 */
export default function CustomDialog({ 
  open, 
  onClose, 
  title = "Notice", 
  message, 
  variant = "info",
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="custom-dialog-title"
      aria-describedby="custom-dialog-description"
    >
      <StyledDialogTitle id="custom-dialog-title" variant={variant}>
        {icons[variant] || icons.info}
        {title}
      </StyledDialogTitle>

      <StyledDialogContent id="custom-dialog-description">
        {message}
      </StyledDialogContent>

      <StyledDialogActions>
        {cancelText && (
          <SecondaryButton onClick={handleCancel}>
            {cancelText}
          </SecondaryButton>
        )}
        <StyledButton onClick={handleConfirm} variant={variant} autoFocus>
          {confirmText}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
