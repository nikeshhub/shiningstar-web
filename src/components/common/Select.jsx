import React from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select as MuiSelect, FormHelperText } from '@mui/material';

/**
 * Reusable Select/Dropdown Component
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Select label
 * @param {string} props.name - Select name
 * @param {string|number} props.value - Selected value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Array of options [{label, value}] or simple array of strings
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.fullWidth - Whether select takes full width
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether select is disabled
 * @param {string} props.size - Size variant (small, medium)
 * @param {string} props.variant - Variant type (outlined, filled, standard) - default uses TextField
 * @param {boolean} props.useTextField - Whether to use TextField with select prop (default: true)
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.allowNone - Whether to allow selecting "None" (default: true)
 * @param {string} props.noneLabel - Label for the "None" option (default: "None")
 * @param {string} props.helperText - Helper text below the select
 * @param {boolean} props.multiple - Whether to allow multiple selections
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  fullWidth = true,
  error = '',
  disabled = false,
  size = 'medium',
  variant = 'outlined',
  useTextField = true,
  placeholder = '',
  allowNone = true,
  noneLabel = 'None',
  helperText = '',
  multiple = false,
  renderValue,
  ...otherProps
}) => {
  // Normalize options to {label, value} format, with fallbacks for raw objects
  const normalizedOptions = options.map(option => {
    if (typeof option === 'string' || typeof option === 'number') {
      return { label: option, value: option };
    }
    if (option && typeof option === 'object') {
      if ('label' in option && 'value' in option) return option;
      const fallbackValue = option._id ?? option.id ?? option.value ?? option.code ?? option.name;
      const fallbackLabel =
        option.label ??
        option.name ??
        option.className ??
        option.subjectName ??
        option.title ??
        option.examName ??
        option.itemName ??
        String(fallbackValue ?? '');
      return { label: fallbackLabel, value: fallbackValue };
    }
    return { label: String(option), value: option };
  });

  // Determine if we should show a "None" option
  const hasEmptyOption = normalizedOptions.some(opt => opt.value === '' || opt.value === null);
  const showNoneOption = allowNone && !hasEmptyOption && !required;

  // Placeholder text
  const placeholderText = placeholder || (showNoneOption ? noneLabel : `Select ${label || 'an option'}`);

  // Resolve label from value
  const resolveLabel = (selected) => {
    if (multiple && Array.isArray(selected)) {
      return selected
        .map(val => {
          const match = normalizedOptions.find(opt => opt.value === val);
          return match ? match.label : val;
        })
        .join(', ');
    }
    const match = normalizedOptions.find(opt => opt.value === selected);
    return match ? match.label : selected;
  };

  // Handle empty value
  const safeValue = value ?? '';

  // Using TextField with select prop (simpler, recommended for forms)
  if (useTextField) {
    return (
      <TextField
        select
        label={label}
        name={name}
        value={safeValue}
        onChange={onChange}
        required={required}
        fullWidth={fullWidth}
        error={Boolean(error)}
        helperText={error || helperText}
        disabled={disabled}
        size={size}
        variant={variant}
        InputLabelProps={{ shrink: true }}
        SelectProps={{
          displayEmpty: true,
          multiple: multiple,
          renderValue: renderValue || ((selected) => {
            if (!selected || (Array.isArray(selected) && selected.length === 0) || selected === '') {
              return <span style={{ color: '#9e9e9e' }}>{placeholderText}</span>;
            }
            return resolveLabel(selected);
          }),
        }}
        {...otherProps}
      >
        {showNoneOption && (
          <MenuItem value="">
            <em style={{ color: '#757575' }}>{noneLabel}</em>
          </MenuItem>
        )}
        {normalizedOptions.map((option, index) => (
          <MenuItem key={option.value !== undefined && option.value !== '' ? option.value : index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  // Using FormControl + Select (for more control)
  return (
    <FormControl
      fullWidth={fullWidth}
      required={required}
      error={Boolean(error)}
      disabled={disabled}
      size={size}
      variant={variant}
    >
      {label && <InputLabel shrink>{label}</InputLabel>}
      <MuiSelect
        name={name}
        value={safeValue}
        onChange={onChange}
        label={label}
        displayEmpty
        multiple={multiple}
        renderValue={renderValue || ((selected) => {
          if (!selected || (Array.isArray(selected) && selected.length === 0) || selected === '') {
            return <span style={{ color: '#9e9e9e' }}>{placeholderText}</span>;
          }
          return resolveLabel(selected);
        })}
        {...otherProps}
      >
        {showNoneOption && (
          <MenuItem value="">
            <em style={{ color: '#757575' }}>{noneLabel}</em>
          </MenuItem>
        )}
        {normalizedOptions.map((option, index) => (
          <MenuItem key={option.value !== undefined && option.value !== '' ? option.value : index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default Select;
