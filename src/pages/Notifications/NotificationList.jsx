import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, Dialog } from '../../components/common';
import { notificationAPI } from '../../services/api';

export default function NotificationList() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [sendDialog, setSendDialog] = useState({ open: false, notification: null });
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll();
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setSnackbar({ open: true, message: 'Failed to load notifications. Please check if the server is running.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/dashboard/notifications/add');
  };

  const handleEdit = (notification) => {
    navigate(`/dashboard/notifications/edit/${notification._id}`);
  };

  const handleDelete = async () => {
    try {
      await notificationAPI.delete(notificationToDelete._id);
      setSnackbar({ open: true, message: 'Notification deleted successfully!', severity: 'success' });
      setDeleteDialog(false);
      setNotificationToDelete(null);
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      setSnackbar({ open: true, message: 'Failed to delete notification', severity: 'error' });
    }
  };

  const handleSend = (notification) => {
    setSendDialog({ open: true, notification });
  };

  const confirmSend = async () => {
    try {
      await notificationAPI.send(sendDialog.notification._id);
      setSendDialog({ open: false, notification: null });
      setSnackbar({ open: true, message: 'Notification sent successfully!', severity: 'success' });
      loadNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      setSendDialog({ open: false, notification: null });
      setSnackbar({ open: true, message: 'Failed to send notification', severity: 'error' });
    }
  };

  const closeSendDialog = () => {
    setSendDialog({ open: false, notification: null });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-GB');
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.message?.substring(0, 50)}...
          </Typography>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      renderCell: (row) => (
        <Chip
          label={row.type}
          size="small"
          color={
            row.type === 'Emergency' ? 'error' :
            row.type === 'Important' ? 'warning' :
            row.type === 'Event' ? 'info' :
            'default'
          }
        />
      ),
    },
    {
      field: 'recipients',
      headerName: 'Recipients',
      width: 150,
      renderCell: (row) => (
        <Chip label={row.recipients} size="small" variant="outlined" />
      ),
    },
    {
      field: 'channel',
      headerName: 'Channel',
      width: 120,
      renderCell: (row) => (
        <Typography variant="body2">
          {row.channel?.join(', ')}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={
            row.status === 'Sent' ? 'success' :
            row.status === 'Scheduled' ? 'info' :
            'default'
          }
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 160,
      renderCell: (row) => formatDate(row.createdAt),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {row.status === 'Draft' && (
            <IconButton
              size="small"
              color="success"
              onClick={() => handleSend(row)}
              title="Send"
            >
              <SendIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setNotificationToDelete(row);
              setDeleteDialog(true);
            }}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const draftNotifications = notifications.filter(n => n.status === 'Draft');
  const sentNotifications = notifications.filter(n => n.status === 'Sent');

  const stats = {
    total: notifications.length,
    draft: draftNotifications.length,
    sent: sentNotifications.length,
    scheduled: notifications.filter(n => n.status === 'Scheduled').length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Notifications (सूचना व्यवस्थापन)
        </Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd}>
          Create Notification
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card
          sx={{ flex: 1, bgcolor: 'primary.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Notifications
          </Typography>
        </Card>

        <Card
          sx={{ flex: 1, bgcolor: 'warning.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
            {stats.draft}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Draft
          </Typography>
        </Card>

        <Card
          sx={{ flex: 1, bgcolor: 'success.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
            {stats.sent}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sent
          </Typography>
        </Card>

        <Card
          sx={{ flex: 1, bgcolor: 'info.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
            {stats.scheduled}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scheduled
          </Typography>
        </Card>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All (${notifications.length})`} />
          <Tab
            label={`Draft (${draftNotifications.length})`}
            icon={draftNotifications.length > 0 ? <Badge badgeContent={draftNotifications.length} color="warning" /> : null}
            iconPosition="end"
          />
          <Tab label={`Sent (${sentNotifications.length})`} />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Table
          columns={columns}
          rows={notifications}
          loading={loading}
          emptyMessage="No notifications found. Click 'Create Notification' to send one."
          hover
        />
      )}

      {tabValue === 1 && (
        <Table
          columns={columns}
          rows={draftNotifications}
          loading={loading}
          emptyMessage="No draft notifications."
          hover
        />
      )}

      {tabValue === 2 && (
        <Table
          columns={columns}
          rows={sentNotifications}
          loading={loading}
          emptyMessage="No sent notifications."
          hover
        />
      )}

      <Dialog
        variant="confirm"
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Notification"
        message={`Are you sure you want to delete notification "${notificationToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
      />

      <Dialog
        variant="confirm"
        open={sendDialog.open}
        onClose={closeSendDialog}
        onConfirm={confirmSend}
        title="Send Notification"
        message={`Send notification "${sendDialog.notification?.title}" to ${sendDialog.notification?.recipients}?`}
        confirmLabel="Send"
        confirmColor="primary"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
