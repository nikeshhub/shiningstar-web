import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Generic Toast/Snackbar Notification Component
 *
 * Usage:
 *   const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
 *
 *   // Show toast
 *   setToast({ open: true, message: 'Saved successfully!', severity: 'success' });
 *
 *   // In JSX
 *   <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
 *
 * @param {Object} props
 * @param {Object} props.toast - Toast state { open, message, severity }
 * @param {boolean} props.toast.open - Whether toast is visible
 * @param {string} props.toast.message - Toast message text
 * @param {string} props.toast.severity - "success" | "error" | "warning" | "info"
 * @param {function} props.onClose - Close handler
 * @param {number} props.autoHideDuration - Auto-hide duration in ms (default: 4000)
 * @param {object} props.anchorOrigin - Position { vertical, horizontal } (default: bottom center)
 */
const Toast = ({
  toast = { open: false, message: '', severity: 'info' },
  onClose,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
}) => {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={toast.severity}
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
