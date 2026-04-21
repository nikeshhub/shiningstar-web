import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

/**
 * Reusable Button Component
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (contained, outlined, text)
 * @param {string} props.color - Button color (primary, secondary, success, error, warning, info)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {React.ReactNode} props.startIcon - Icon to show at start
 * @param {React.ReactNode} props.endIcon - Icon to show at end
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  children,
  sx = {},
  ...otherProps
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={16} /> : startIcon}
      endIcon={!loading ? endIcon : null}
      onClick={onClick}
      type={type}
      sx={sx}
      {...otherProps}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
