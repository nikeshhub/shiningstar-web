import React from 'react';
import { Controller } from 'react-hook-form';
import Input from './Input';

/**
 * Form-aware text input connected to react-hook-form via Controller.
 *
 * @param {Object} props
 * @param {Object} props.control   - react-hook-form control object
 * @param {string} props.name      - Field name (matches schema key)
 * @param {string} props.label     - Visible label
 * @param {string} [props.type]    - Input type (text, number, date, email, …)
 * @param {boolean} [props.required] - Adds asterisk to label
 * All other props are forwarded to the underlying <Input /> component.
 */
const FormField = ({ control, name, label, type = 'text', required = false, ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Input
        {...field}
        label={label}
        type={type}
        required={required}
        error={fieldState.error ? `${fieldState.error.message} (${fieldState.error.type})` : ''}
        {...rest}
      />
    )}
  />
);

export default FormField;
