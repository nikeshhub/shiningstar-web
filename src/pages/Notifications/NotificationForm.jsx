import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Card,
  CardContent,
  Chip,
  alpha,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Input, Select, Button, Toast } from '../../components/common';
import { notificationAPI } from '../../services/api';

const TYPE_OPTIONS = ['General', 'Important', 'Emergency', 'Event', 'Academic'];
const RECIPIENT_OPTIONS = ['All', 'Students', 'Parents', 'Teachers', 'Staff', 'Specific Class'];
const STATUS_OPTIONS = ['Draft', 'Scheduled', 'Sent'];

export default function NotificationForm({ notificationData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: '',
    recipients: '',
    channel: [],
    status: 'Draft',
    sendAt: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (notificationData) {
      setFormData({
        title: notificationData.title || '',
        message: notificationData.message || '',
        type: notificationData.type || '',
        recipients: notificationData.recipients || '',
        channel: notificationData.channel || [],
        status: notificationData.status || 'Draft',
        sendAt: notificationData.sendAt ? notificationData.sendAt.split('T')[0] : '',
      });
    }
  }, [notificationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChannelChange = (e) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      channel: checked
        ? [...formData.channel, value]
        : formData.channel.filter(c => c !== value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.channel.length === 0) {
      setToast({ open: true, message: 'Please select at least one notification channel', severity: 'warning' });
      return;
    }

    try {
      setLoading(true);

      if (notificationData?._id) {
        await notificationAPI.update(notificationData._id, formData);
        setToast({ open: true, message: 'Notification updated successfully!', severity: 'success' });
      } else {
        await notificationAPI.create(formData);
        setToast({ open: true, message: 'Notification created successfully!', severity: 'success' });
      }

      setTimeout(() => onSuccess(), 1000);
    } catch (error) {
      console.error('Error saving notification:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error saving notification',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {notificationData ? 'Edit Notification' : 'Create Notification'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {notificationData ? 'Update notification details and recipients' : 'Send announcements to students, parents, and staff'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Message Content */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <NotificationsIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Message Content
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., School Holiday Announcement"
                />
              </Grid>

              <Grid size={12}>
                <Input
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  placeholder="Enter the notification message here..."
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Select
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={TYPE_OPTIONS}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Select
                  label="Recipients"
                  name="recipients"
                  value={formData.recipients}
                  onChange={handleChange}
                  options={RECIPIENT_OPTIONS}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Delivery Settings */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SendIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Delivery Settings
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how and when to send this notification
            </Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormGroup>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Notification Channels *
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="SMS"
                          checked={formData.channel.includes('SMS')}
                          onChange={handleChannelChange}
                        />
                      }
                      label="SMS"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="Email"
                          checked={formData.channel.includes('Email')}
                          onChange={handleChannelChange}
                        />
                      }
                      label="Email"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="App"
                          checked={formData.channel.includes('App')}
                          onChange={handleChannelChange}
                        />
                      }
                      label="App Notification"
                    />
                  </Box>
                  {formData.channel.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {formData.channel.map((ch) => (
                        <Chip key={ch} label={ch} size="small" color="primary" sx={{ fontWeight: 500 }} />
                      ))}
                    </Box>
                  )}
                </FormGroup>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={STATUS_OPTIONS}
                  required
                />
              </Grid>

              {formData.status === 'Scheduled' && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Input
                    label="Send At"
                    name="sendAt"
                    type="datetime-local"
                    value={formData.sendAt}
                    onChange={handleChange}
                    helperText="Schedule when to send this notification"
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Preview */}
        {(formData.title || formData.message) && (
          <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2, bgcolor: alpha('#1976d2', 0.05) }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PeopleIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Preview
                </Typography>
              </Box>
              <Box sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}>
                {formData.title && (
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {formData.title}
                  </Typography>
                )}
                {formData.message && (
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {formData.message}
                  </Typography>
                )}
                {(formData.type || formData.recipients) && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.type && <Chip label={formData.type} size="small" color="secondary" />}
                    {formData.recipients && <Chip label={`To: ${formData.recipients}`} size="small" color="info" />}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          p: 3,
          bgcolor: alpha('#f5f5f5', 0.5),
          borderRadius: 2,
        }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={loading}
            sx={{ minWidth: 160 }}
          >
            {notificationData ? 'Update' : 'Create'} Notification
          </Button>
        </Box>
      </Box>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
