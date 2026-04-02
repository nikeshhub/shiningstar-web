import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem, Chip, Box } from '@mui/material';

/**
 * Form-aware multi-select with chip rendering, connected to react-hook-form.
 *
 * @param {Object} props
 * @param {Object} props.control     - react-hook-form control object
 * @param {string} props.name        - Field name (matches schema key)
 * @param {string} props.label       - Visible label
 * @param {Array}  props.options     - [{label, value}]
 * @param {string} [props.helperText] - Static helper text shown below the field
 */
const FormMultiSelect = ({ control, name, label, options = [], helperText, ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        select
        fullWidth
        label={label}
        value={field.value || []}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message || helperText || ''}
        SelectProps={{
          multiple: true,
          renderValue: (selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((val) => {
                const opt = options.find(o => o.value === val);
                return <Chip key={val} label={opt?.label || val} size="small" />;
              })}
            </Box>
          ),
        }}
        {...rest}
      >
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>
    )}
  />
);

export default FormMultiSelect;
