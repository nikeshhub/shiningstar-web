import React from 'react';
import { Controller } from 'react-hook-form';
import Input from './Input';
import BSDatePicker from './BSDatePicker';

/**
 * Form-aware text input connected to react-hook-form via Controller.
 *
 * For `type="date"`, this renders a <BSDatePicker> (Bikram Sambat) instead of
 * the native `<input type="date">`. BSDatePicker keeps the underlying field
 * value in BS format (`YYYY-MM-DD`), so form state and user-facing filters
 * stay on the Nepali calendar end to end.
 *
 * @param {Object} props
 * @param {Object} props.control   - react-hook-form control object
 * @param {string} props.name      - Field name (matches schema key)
 * @param {string} props.label     - Visible label
 * @param {string} [props.type]    - Input type (text, number, date, email, …)
 * @param {boolean} [props.required] - Adds asterisk to label
 * All other props are forwarded to the underlying component.
 */
const FormField = ({ control, name, label, type = 'text', required = false, ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => {
      const errorMsg = fieldState.error
        ? `${fieldState.error.message} (${fieldState.error.type})`
        : '';

      if (type === 'date') {
        // BSDatePicker is a functional component without forwardRef, so strip
        // RHF's `ref` before spreading to avoid React's "Function components
        // cannot be given refs" warning.
        const { ref: _ignoredRef, ...fieldProps } = field;
        return (
          <BSDatePicker
            {...fieldProps}
            label={label}
            required={required}
            error={errorMsg}
            {...rest}
          />
        );
      }

      return (
        <Input
          {...field}
          label={label}
          type={type}
          required={required}
          error={errorMsg}
          {...rest}
        />
      );
    }}
  />
);

export default FormField;
