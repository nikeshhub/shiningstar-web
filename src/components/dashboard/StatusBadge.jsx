import React from 'react';
import { Chip } from '@mui/material';

/**
 * Status Badge Component
 * Colored badge for status indicators (Paid/Unpaid, Present/Absent, etc.)
 *
 * @param {string} status - Status type: 'success', 'error', 'warning', 'info', 'secondary'
 * @param {string} label - Badge text
 * @param {string} size - Size: 'small' or 'medium' (default: 'small')
 */
const StatusBadge = ({ status = 'info', label, size = 'small', ...props }) => {
  const getColors = () => {
    switch (status) {
      case 'success': // Paid, Present
        return {
          bg: '#DCFCE7',
          color: '#16A34A',
        };
      case 'error': // Unpaid, Absent
        return {
          bg: '#FEE2E2',
          color: '#DC2626',
        };
      case 'warning': // Partial, Late
        return {
          bg: '#FEF3C7',
          color: '#D97706',
        };
      case 'info': // Info, Class
        return {
          bg: '#EEF3FF',
          color: '#1B4FD8',
        };
      case 'secondary': // Special, Other
        return {
          bg: '#EDE9FE',
          color: '#7C3AED',
        };
      default:
        return {
          bg: '#F7F8FC',
          color: '#3D4460',
        };
    }
  };

  const colors = getColors();

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontSize: '11px',
        fontWeight: 700,
        height: size === 'small' ? '20px' : '24px',
        borderRadius: '100px',
        '& .MuiChip-label': {
          px: size === 'small' ? 1.125 : 1.5,
        },
      }}
      {...props}
    />
  );
};

export default StatusBadge;
