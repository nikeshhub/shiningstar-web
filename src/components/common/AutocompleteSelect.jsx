import React from "react";
import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";

/**
 * Searchable autocomplete dropdown for large datasets (200+ items).
 * Filters client-side as the user types. Drop-in for Select when lists get long.
 *
 * @param {string}   props.label        - Field label
 * @param {string}   props.name         - Field name (used in onChange synthetic event)
 * @param {*}        props.value        - Selected value (the raw value, not the option object)
 * @param {function} props.onChange     - Called with a synthetic { target: { name, value } }
 * @param {Array}    props.options      - [{ label, value }] or flat string[]
 * @param {boolean}  props.required     - Whether the field is required
 * @param {boolean}  props.disabled     - Whether the field is disabled
 * @param {string}   props.placeholder  - Input placeholder
 * @param {string}   props.helperText   - Helper text below the field
 * @param {string}   props.error        - Error message (shown in red)
 * @param {string}   props.size         - 'small' | 'medium'
 * @param {boolean}  props.loading      - Show loading spinner in the field
 * @param {boolean}  props.fullWidth    - Full width (default true)
 */
const AutocompleteSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  placeholder = "",
  helperText = "",
  error = "",
  size = "medium",
  loading = false,
  ...otherProps
}) => {
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { label: String(opt), value: opt };
    }
    return opt;
  });

  const selectedOption =
    normalizedOptions.find((opt) => opt.value === value) || null;

  const handleChange = (_, newOption) => {
    onChange({ target: { name, value: newOption ? newOption.value : "" } });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        fullWidth
        options={normalizedOptions}
        value={selectedOption}
        onChange={handleChange}
        disabled={disabled}
        loading={loading}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        getOptionLabel={(option) => option.label || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            size={size}
            fullWidth
            placeholder={placeholder || `Search ${label || ""}...`}
            error={Boolean(error)}
            helperText={error || helperText}
            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        {...otherProps}
      />
    </Box>
  );
};

export default AutocompleteSelect;
