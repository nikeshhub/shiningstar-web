import React from 'react';
import { TextField } from '@mui/material';

/**
 * Reusable Input Component
 * Wrapper around Material-UI TextField with consistent styling
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.type - Input type (text, number, email, password, date, etc.)
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.fullWidth - Whether input takes full width
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.multiline - Whether input is multiline
 * @param {number} props.rows - Number of rows for multiline
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.size - Size variant (small, medium)
 */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  fullWidth = true,
  error = '',
  disabled = false,
  multiline = false,
  rows = 4,
  placeholder = '',
  size = 'medium',
  InputLabelProps,
  ...otherProps
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      fullWidth={fullWidth}
      error={Boolean(error)}
      helperText={error}
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      placeholder={placeholder}
      size={size}
      InputLabelProps={type === 'date' || type === 'datetime-local' ? { shrink: true, ...InputLabelProps } : InputLabelProps}
      {...otherProps}
    />
  );
};

export default Input;
