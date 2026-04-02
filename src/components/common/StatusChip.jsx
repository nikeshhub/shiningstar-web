import React from 'react';
import { Chip } from '@mui/material';

/**
 * Reusable Status Chip Component
 *
 * Maps status strings to appropriate MUI Chip colors.
 *
 * Usage:
 *   <StatusChip status="Active" />
 *   <StatusChip status="Inactive" />
 *   <StatusChip status="Transferred" />
 *   <StatusChip status={student.status} size="medium" />
 *
 * @param {Object} props
 * @param {string} props.status - Status text (Active, Inactive, Transferred, Graduated, etc.)
 * @param {string} props.size - Chip size "small" | "medium" (default: "small")
 * @param {object} props.sx - Additional styling
 */

const statusColorMap = {
  Active: 'success',
  Inactive: 'default',
  Transferred: 'warning',
  Graduated: 'info',
  Pending: 'warning',
  Suspended: 'error',
  Sent: 'success',
  Draft: 'default',
  Scheduled: 'info',
};

const StatusChip = ({ status, size = 'small', sx = {}, ...otherProps }) => {
  const color = statusColorMap[status] || 'default';

  return (
    <Chip
      label={status || '-'}
      color={color}
      size={size}
      sx={sx}
      {...otherProps}
    />
  );
};

export default StatusChip;
