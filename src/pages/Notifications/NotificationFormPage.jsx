import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
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

  useEffect(() => {
    if (!isEdit) return;
    notificationAPI.getById(id)
      .then((res) => {
        if (res.data.success) setNotificationData(res.data.data);
      })
      .catch((err) => console.error('Error loading notification:', err));
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
        <NotificationForm
          notificationData={notificationData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </Paper>
    </Box>
  );
}
