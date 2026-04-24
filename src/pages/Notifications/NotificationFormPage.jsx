import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, QueryState } from '../../components/common';
import { useNotification, useQueryStatus } from '../../hooks';
import NotificationForm from './NotificationForm';

export default function NotificationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const notificationQuery = useNotification(id, { enabled: isEdit });
  const {
    data: notificationData = null,
    error,
    isInitialLoading,
    isRefreshing,
  } = useQueryStatus(notificationQuery);

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
        <QueryState
          isLoading={isEdit && isInitialLoading}
          isRefreshing={isEdit && isRefreshing}
          error={isEdit ? error : null}
          loadingText="Loading notification..."
        >
          <NotificationForm
            notificationData={notificationData}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </QueryState>
      </Paper>
    </Box>
  );
}
