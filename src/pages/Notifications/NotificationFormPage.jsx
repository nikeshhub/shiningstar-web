import React from 'react';
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common';
import { useNotification } from '../../hooks';
import NotificationForm from './NotificationForm';

export default function NotificationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const {
    data: notificationData = null,
    isLoading: loading,
    error,
  } = useNotification(id, { enabled: isEdit });
  const loadError = error?.message || '';

  const handleSuccess = () => {
    navigate('/dashboard/notifications');
  };

  const handleCancel = () => {
    navigate('/dashboard/notifications');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/notifications')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {isEdit ? 'Edit Notification' : 'Create Notification'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Loading notification...
            </Typography>
          </Box>
        ) : loadError ? (
          <Alert severity="error">{loadError}</Alert>
        ) : (
          <NotificationForm
            notificationData={notificationData}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </Paper>
    </Box>
  );
}
