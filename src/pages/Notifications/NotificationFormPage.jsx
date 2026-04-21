import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common';
import { notificationAPI } from '../../services/api';
import NotificationForm from './NotificationForm';

export default function NotificationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [notificationData, setNotificationData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    setLoadError('');
    notificationAPI.getById(id)
      .then((res) => {
        if (res.data.success) setNotificationData(res.data.data);
      })
      .catch((err) => {
        console.error('Error loading notification:', err);
        setLoadError(err.response?.data?.message || 'Failed to load notification');
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

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
