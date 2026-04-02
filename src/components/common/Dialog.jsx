import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Button from './Button';

/**
 * Generic Dialog Component
 *
 * Supports two modes:
 * 1. Form Dialog - for add/edit forms (variant="form")
 *    Usage: <Dialog variant="form" title="Add Item" open={open} onClose={onClose}>
 *              <YourFormComponent />
 *           </Dialog>
 *
 * 2. Confirm Dialog - for delete/action confirmations (variant="confirm")
 *    Usage: <Dialog
 *              variant="confirm"
 *              title="Confirm Delete"
 *              message="Are you sure you want to delete this item?"
 *              confirmLabel="Delete"
 *              confirmColor="error"
 *              open={open}
 *              onClose={onClose}
 *              onConfirm={handleDelete}
 *           />
 *
 * @param {Object} props
 * @param {string} props.variant - "form" or "confirm"
 * @param {string} props.title - Dialog title
 * @param {boolean} props.open - Whether dialog is open
 * @param {function} props.onClose - Close handler
 * @param {React.ReactNode} props.children - Content (for form variant)
 * @param {string|React.ReactNode} props.message - Confirmation message (for confirm variant)
 * @param {function} props.onConfirm - Confirm handler (for confirm variant)
 * @param {string} props.confirmLabel - Confirm button label (default: "Confirm")
 * @param {string} props.confirmColor - Confirm button color (default: "primary")
 * @param {string} props.cancelLabel - Cancel button label (default: "Cancel")
 * @param {string} props.maxWidth - Dialog max width (default: "md")
 * @param {boolean} props.fullWidth - Full width (default: true)
 * @param {boolean} props.showCloseIcon - Show X icon in title (default: true)
 */
const Dialog = ({
  variant = 'form',
  title,
  open = false,
  onClose,
  children,
  message,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmColor = 'primary',
  cancelLabel = 'Cancel',
  maxWidth = 'md',
  fullWidth = true,
  showCloseIcon = true,
  ...otherProps
}) => {
  if (variant === 'confirm') {
    return (
      <MuiDialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        {...otherProps}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {title}
            {showCloseIcon && (
              <IconButton size="small" onClick={onClose} sx={{ ml: 1 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="contained" color={confirmColor} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </MuiDialog>
    );
  }

  // Default: form variant
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...otherProps}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          {showCloseIcon && (
            <IconButton size="small" onClick={onClose} sx={{ ml: 1 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </MuiDialog>
  );
};

export default Dialog;
