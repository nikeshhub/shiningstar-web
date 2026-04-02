import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Button from './Button';

/**
 * Reusable Search Bar with optional filter dropdowns
 *
 * Usage:
 *   <SearchBar
 *     searchValue={search}
 *     onSearchChange={(e) => setSearch(e.target.value)}
 *     onSearch={handleSearch}
 *     placeholder="Search by name or ID..."
 *     filters={[
 *       {
 *         label: 'Class',
 *         value: filterClass,
 *         onChange: (e) => setFilterClass(e.target.value),
 *         options: [
 *           { value: '', label: 'All Classes' },
 *           ...classes.map(c => ({ value: c._id, label: c.className }))
 *         ],
 *         minWidth: 150,
 *       },
 *       {
 *         label: 'Status',
 *         value: filterStatus,
 *         onChange: (e) => setFilterStatus(e.target.value),
 *         options: [
 *           { value: '', label: 'All' },
 *           { value: 'Active', label: 'Active' },
 *           { value: 'Inactive', label: 'Inactive' },
 *         ],
 *         minWidth: 120,
 *       },
 *     ]}
 *   />
 *
 * @param {Object} props
 * @param {string} props.searchValue - Current search input value
 * @param {function} props.onSearchChange - Search input change handler
 * @param {function} props.onSearch - Search button / Enter key handler
 * @param {string} props.placeholder - Search input placeholder
 * @param {Array} props.filters - Array of filter config objects
 * @param {object} props.sx - Additional styling for the Paper wrapper
 */
const SearchBar = ({
  searchValue = '',
  onSearchChange,
  onSearch,
  placeholder = 'Search...',
  filters = [],
  sx = {},
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2, ...sx }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <TextField
          placeholder={placeholder}
          size="small"
          value={searchValue}
          onChange={onSearchChange}
          onKeyPress={handleKeyPress}
          sx={{ flexGrow: 1 }}
        />

        {filters.map((filter, index) => (
          <FormControl key={index} size="small" sx={{ minWidth: filter.minWidth || 140 }}>
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={filter.value}
              label={filter.label}
              onChange={filter.onChange}
            >
              {filter.options.map((opt, i) => (
                <MenuItem key={i} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Button startIcon={<SearchIcon />} onClick={onSearch} size="small">
          Search
        </Button>
      </Stack>
    </Paper>
  );
};

export default SearchBar;
