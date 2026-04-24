import React from 'react';
import { Alert, Box, CircularProgress, LinearProgress, Typography } from '@mui/material';

const QueryState = ({
  isLoading = false,
  isRefreshing = false,
  error = null,
  loadingText = 'Loading...',
  minHeight = 240,
  children,
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight,
          px: 3,
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">{loadingText}</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error.message || 'Something went wrong.'}</Alert>;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {isRefreshing && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        />
      )}
      {children}
    </Box>
  );
};

export default QueryState;
