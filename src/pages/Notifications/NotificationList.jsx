import React, { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Dialog, Table } from '../../components/common';
import { notificationAPI } from '../../services/api';
import { formatBSDate } from '../../utils/nepaliDate';

const TAB_DEFINITIONS = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'Sent', value: 'Sent' },
  { label: 'Failed', value: 'Failed' },
];

const getStatusColor = (status) => {
  if (status === 'Sent') return 'success';
  if (status === 'Scheduled') return 'info';
  if (status === 'Processing') return 'warning';
  if (status === 'Failed') return 'error';
  return 'default';
};

const getChannels = (notification) => {
  const channels = [];

  if (notification.sendSMS) channels.push('SMS');
  if (notification.sendEmail) channels.push('Email');
  if (notification.sendPushNotification) channels.push('App');

  return channels;
};

const canManageNotification = (notification) =>
  ['Draft', 'Scheduled', 'Failed'].includes(notification.status);

export default function NotificationList() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [sendDialog, setSendDialog] = useState({ open: false, notification: null });
  const [tabValue, setTabValue] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll();
      if (response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to load notifications',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await notificationAPI.delete(notificationToDelete._id);
      setSnackbar({ open: true, message: 'Notification deleted successfully', severity: 'success' });
      setDeleteDialog(false);
      setNotificationToDelete(null);
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete notification',
        severity: 'error',
      });
    }
  };

  const confirmSend = async () => {
    try {
      const response = await notificationAPI.send(sendDialog.notification._id);
      const { successCount = 0, failureCount = 0 } = response.data.data || {};
      const message = failureCount > 0
        ? `Sent with ${successCount} success and ${failureCount} failure${failureCount === 1 ? '' : 's'}`
        : 'Notification sent successfully';

      setSendDialog({ open: false, notification: null });
      setSnackbar({ open: true, message, severity: failureCount > 0 ? 'warning' : 'success' });
      loadNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      setSendDialog({ open: false, notification: null });
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send notification',
        severity: 'error',
      });
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const jsDate = new Date(date);
    if (Number.isNaN(jsDate.getTime())) return '-';
    const time = jsDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${formatBSDate(jsDate)} ${time}`;
  };

  const columns = [
    {
      field: 'message',
      headerName: 'Message',
      width: 320,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>
            {row.message?.length > 100 ? `${row.message.slice(0, 100)}...` : row.message || '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.scheduledDate ? 'Scheduled message' : 'Manual send message'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'targetAudience',
      headerName: 'Audience',
      width: 210,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.targetAudience}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.totalRecipients || 0} recipient family{row.totalRecipients === 1 ? '' : 'ies'}
            {row.classes?.length ? ` • ${row.classes.map((cls) => cls.className || cls.name).join(', ')}` : ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'channels',
      headerName: 'Channel',
      width: 140,
      renderCell: (row) => {
        const channels = getChannels(row);
        return (
          <Typography variant="body2">
            {channels.length > 0 ? channels.join(', ') : '-'}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={getStatusColor(row.status)}
        />
      ),
    },
    {
      field: 'delivery',
      headerName: 'Delivery',
      width: 180,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.successCount || 0}/{row.totalRecipients || 0} delivered
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.failureCount ? `${row.failureCount} failed` : 'No failures'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'schedule',
      headerName: 'Schedule',
      width: 190,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2">
            {row.scheduledDate ? formatDate(row.scheduledDate) : 'Manual send'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Created {formatDate(row.createdAt)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canManageNotification(row) && (
            <IconButton
              size="small"
              color="success"
              onClick={() => setSendDialog({ open: true, notification: row })}
              title={row.status === 'Scheduled' ? 'Send Now' : 'Send'}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          )}

          {canManageNotification(row) && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/dashboard/notifications/edit/${row._id}`)}
              title="Edit"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}

          {canManageNotification(row) && (
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
          )}
        </Box>
      ),
    },
  ];

  const counts = notifications.reduce((acc, notification) => {
    acc.total += 1;
    acc[notification.status] = (acc[notification.status] || 0) + 1;
    return acc;
  }, { total: 0 });

  const filteredNotifications = tabValue === 'all'
    ? notifications
    : notifications.filter((notification) => notification.status === tabValue);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Notifications (सूचना व्यवस्थापन)
        </Typography>
        <Button startIcon={<AddIcon />} onClick={() => navigate('/dashboard/notifications/add')}>
          Create Notification
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 180 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {counts.total || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Notifications
          </Typography>
        </Card>

        <Card sx={{ flex: 1, minWidth: 180 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
            {(counts.Draft || 0) + (counts.Scheduled || 0)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending Send
          </Typography>
        </Card>

        <Card sx={{ flex: 1, minWidth: 180 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
            {counts.Sent || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sent
          </Typography>
        </Card>

        <Card sx={{ flex: 1, minWidth: 180 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
            {counts.Failed || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Failed
          </Typography>
        </Card>
      </Box>

      {notifications.some((notification) => notification.status === 'Processing') && (
        <Alert severity="info" sx={{ mb: 3 }}>
          One or more notifications are currently being processed.
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(event, value) => setTabValue(value)}>
          {TAB_DEFINITIONS.map((tab) => {
            const count = tab.value === 'all' ? counts.total || 0 : counts[tab.value] || 0;
            return (
              <Tab
                key={tab.value}
                value={tab.value}
                label={`${tab.label} (${count})`}
                icon={tab.value === 'Scheduled' && count > 0 ? <Badge badgeContent={count} color="info"><ScheduleIcon fontSize="small" /></Badge> : null}
                iconPosition="start"
              />
            );
          })}
        </Tabs>
      </Box>

      <Table
        columns={columns}
        rows={filteredNotifications}
        loading={loading}
        emptyMessage="No notifications found. Create one to start sending SMS updates."
        hover
      />

      <Dialog
        variant="confirm"
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Notification"
        message="Delete this notification? Draft, scheduled, or failed notifications can be removed."
        confirmLabel="Delete"
        confirmColor="error"
      />

      <Dialog
        variant="confirm"
        open={sendDialog.open}
        onClose={() => setSendDialog({ open: false, notification: null })}
        onConfirm={confirmSend}
        title={sendDialog.notification?.status === 'Scheduled' ? 'Send Scheduled Notification Now' : 'Send Notification'}
        message={`Send this message to ${sendDialog.notification?.totalRecipients || 0} recipient family${sendDialog.notification?.totalRecipients === 1 ? '' : 'ies'} now?`}
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
