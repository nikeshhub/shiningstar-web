import React from 'react';
import { Controller } from 'react-hook-form';
import AutocompleteSelect from './AutocompleteSelect';

/**
 * Universal autocomplete select — works in two modes:
 *
 * 1. react-hook-form mode (pass `control`):
 *    <FormAutocompleteSelect control={control} name="family" ... />
 *
 * 2. Plain controlled mode (no `control`):
 *    <FormAutocompleteSelect name="studentId" value={val} onChange={fn} ... />
 *
 * Use this everywhere instead of Select/AutocompleteSelect for large datasets.
 */
const FormAutocompleteSelect = ({
  control,
  name,
  label,
  options = [],
  required = false,
  value,
  onChange,
  error,
  ...rest
}) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <AutocompleteSelect
            label={label}
            name={name}
            value={field.value || ''}
            onChange={({ target }) => field.onChange(target.value)}
            options={options}
            required={required}
            error={fieldState.error?.message || ''}
            {...rest}
          />
        )}
      />
    );
  }

  return (
    <AutocompleteSelect
      label={label}
      name={name}
      value={value || ''}
      onChange={onChange}
      options={options}
      required={required}
      error={error || ''}
      {...rest}
    />
  );
};

export default FormAutocompleteSelect;
