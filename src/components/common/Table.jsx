import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

/**
 * Reusable Table Component
 *
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column definitions [{field, headerName, width, renderCell}]
 * @param {Array} props.rows - Data rows (array of objects)
 * @param {boolean} props.loading - Whether table is loading
 * @param {string} props.emptyMessage - Message to show when no data
 * @param {boolean} props.pagination - Whether to show pagination
 * @param {number} props.page - Current page (0-indexed)
 * @param {number} props.rowsPerPage - Rows per page
 * @param {number} props.totalRows - Total number of rows
 * @param {function} props.onPageChange - Page change handler
 * @param {function} props.onRowsPerPageChange - Rows per page change handler
 * @param {boolean} props.hover - Whether rows have hover effect
 * @param {boolean} props.striped - Whether to show striped rows
 * @param {object} props.sx - Additional styling
 */
const Table = ({
  columns = [],
  rows = [],
  loading = false,
  emptyMessage = 'No data available',
  pagination = false,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  hover = true,
  striped = false,
  sx = {},
  headerBgColor = '#f5f5f5',
  ...otherProps
}) => {
  const handleChangePage = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(parseInt(event.target.value, 10));
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', ...sx }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Paper>
    );
  }

  if (rows.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', ...sx }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={sx}>
      <TableContainer>
        <MuiTable {...otherProps}>
          <TableHead>
            <TableRow sx={{ bgcolor: headerBgColor }}>
              {columns.map((column, index) => (
                <TableCell
                  key={column.field || index}
                  sx={{
                    fontWeight: 'bold',
                    width: column.width,
                    minWidth: column.minWidth,
                    ...column.headerSx
                  }}
                  align={column.align || 'left'}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={row.id || row._id || rowIndex}
                hover={hover}
                sx={striped && rowIndex % 2 === 1 ? { bgcolor: '#fafafa' } : {}}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${column.field || colIndex}`}
                    align={column.align || 'left'}
                    sx={column.cellSx}
                  >
                    {column.renderCell
                      ? column.renderCell(row, rowIndex)
                      : row[column.field] || '-'
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
};

export default Table;
