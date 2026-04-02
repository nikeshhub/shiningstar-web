import React from 'react';
import { Controller } from 'react-hook-form';
import Select from './Select';

/**
 * Form-aware single select connected to react-hook-form via Controller.
 *
 * @param {Object}  props
 * @param {Object}  props.control  - react-hook-form control object
 * @param {string}  props.name     - Field name (matches schema key)
 * @param {string}  props.label    - Visible label
 * @param {Array}   props.options  - [{label, value}] or plain string[]
 * @param {boolean} [props.required]
 * All other props are forwarded to the underlying <Select /> component.
 */
const FormSelect = ({ control, name, label, options = [], required = false, ...rest }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Select
        {...field}
        label={label}
        options={options}
        required={required}
        error={fieldState.error ? `${fieldState.error.message} (${fieldState.error.type})` : ''}
        {...rest}
      />
    )}
  />
);

export default FormSelect;
