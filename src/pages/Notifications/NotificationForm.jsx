import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
  alpha,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Sms as SmsIcon,
} from '@mui/icons-material';
import {
  Button,
  FormAutocompleteSelect,
  Input,
  Select,
  Toast,
} from '../../components/common';
import {
  classAPI,
  notificationAPI,
  studentAPI,
} from '../../services/api';

const TARGET_AUDIENCE_OPTIONS = [
  'All Parents',
  'Class-wise',
  'Custom Group',
  'Individual',
];

const toDateTimeLocal = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
};

const formatSchedulePreview = (value) => {
  if (!value) {
    return 'Draft. Send it manually from the notifications list.';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Scheduled date is invalid.';
  }

  return `Scheduled for ${date.toLocaleString()}`;
};

const getSelectedLabels = (options, values) => {
  const selected = Array.isArray(values) ? values : values ? [values] : [];

  return selected
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean);
};

export default function NotificationForm({ notificationData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    message: '',
    targetAudience: 'All Parents',
    classes: [],
    recipients: [],
    scheduledDate: '',
  });
  const [classOptions, setClassOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    let ignore = false;

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const [classResponse, studentResponse] = await Promise.all([
          classAPI.getAll({ status: 'Active' }),
          studentAPI.getAll({ status: 'Active' }),
        ]);

        if (ignore) {
          return;
        }

        const classes = (classResponse.data.data || []).map((cls) => ({
          label: cls.className,
          value: cls._id,
        }));

        const students = (studentResponse.data.data || []).map((student) => ({
          label: `${student.name} (${student.studentId || 'No ID'})${student.currentClass?.className ? ` • ${student.currentClass.className}` : ''}`,
          value: student._id,
        }));

        setClassOptions(classes);
        setStudentOptions(students);
      } catch (error) {
        if (!ignore) {
          console.error('Error loading notification options:', error);
          setToast({
            open: true,
            message: 'Failed to load classes and students',
            severity: 'error',
          });
        }
      } finally {
        if (!ignore) {
          setLoadingOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!notificationData) {
      return;
    }

    setFormData({
      message: notificationData.message || '',
      targetAudience: notificationData.targetAudience || 'All Parents',
      classes: (notificationData.classes || []).map((item) => item._id || item),
      recipients: (notificationData.recipients || []).map((item) => item._id || item),
      scheduledDate: toDateTimeLocal(notificationData.scheduledDate),
    });
  }, [notificationData]);

  const isLocked = notificationData && ['Sent', 'Processing'].includes(notificationData.status);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    if (name === 'targetAudience') {
      setFormData((prev) => ({
        ...prev,
        targetAudience: value,
        classes: [],
        recipients: [],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiValueChange = (name) => (event) => {
    const value = Array.isArray(event.target.value)
      ? event.target.value
      : event.target.value
        ? [event.target.value]
        : [];

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIndividualRecipientChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      recipients: value ? [value] : [],
    }));
  };

  const validateForm = () => {
    if (!formData.message.trim()) {
      return 'Notification message is required';
    }

    if (formData.targetAudience === 'Class-wise' && formData.classes.length === 0) {
      return 'Select at least one class';
    }

    if (formData.targetAudience === 'Custom Group' && formData.recipients.length === 0) {
      return 'Select at least one student recipient';
    }

    if (formData.targetAudience === 'Individual' && formData.recipients.length !== 1) {
      return 'Select exactly one student for an individual notification';
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setToast({ open: true, message: validationError, severity: 'warning' });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        message: formData.message.trim(),
        targetAudience: formData.targetAudience,
        classes: formData.targetAudience === 'Class-wise' ? formData.classes : [],
        recipients: ['Custom Group', 'Individual'].includes(formData.targetAudience)
          ? formData.recipients
          : [],
        sendSMS: true,
        sendEmail: false,
        sendPushNotification: false,
        scheduledDate: formData.scheduledDate || undefined,
      };

      if (notificationData?._id) {
        await notificationAPI.update(notificationData._id, payload);
        setToast({ open: true, message: 'Notification updated successfully', severity: 'success' });
      } else {
        await notificationAPI.create(payload);
        setToast({ open: true, message: payload.scheduledDate ? 'Notification scheduled successfully' : 'Notification saved as draft', severity: 'success' });
      }

      setTimeout(() => onSuccess(), 900);
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

  const selectedClassLabels = getSelectedLabels(classOptions, formData.classes);
  const selectedRecipientLabels = getSelectedLabels(studentOptions, formData.recipients);

  if (loadingOptions) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading notification setup...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {notificationData ? 'Edit Notification' : 'Create Notification'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure the audience and content. SMS delivery is sent from the backend through Aakash SMS.
        </Typography>
      </Box>

      {isLocked && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This notification is already {notificationData.status.toLowerCase()} and can no longer be edited.
        </Alert>
      )}

      {notificationData?.lastError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Last delivery error: {notificationData.lastError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
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
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleFieldChange}
                  required
                  disabled={isLocked || loading}
                  multiline
                  rows={5}
                  placeholder="Enter the SMS message parents should receive"
                />
              </Grid>

              <Grid size={12}>
                <Select
                  label="Target Audience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleFieldChange}
                  options={TARGET_AUDIENCE_OPTIONS}
                  required
                  disabled={isLocked || loading}
                  allowNone={false}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PeopleIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Audience Setup
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Recipients are deduplicated by family so each parent contact receives one SMS.
            </Typography>

            <Grid container spacing={3}>
              {formData.targetAudience === 'Class-wise' && (
                <Grid size={12}>
                  <Select
                    label="Classes"
                    name="classes"
                    value={formData.classes}
                    onChange={handleMultiValueChange('classes')}
                    options={classOptions}
                    multiple
                    required
                    disabled={isLocked || loading}
                    allowNone={false}
                    helperText="Select one or more active classes"
                  />
                </Grid>
              )}

              {formData.targetAudience === 'Custom Group' && (
                <Grid size={12}>
                  <Select
                    label="Students"
                    name="recipients"
                    value={formData.recipients}
                    onChange={handleMultiValueChange('recipients')}
                    options={studentOptions}
                    multiple
                    required
                    disabled={isLocked || loading}
                    allowNone={false}
                    helperText="Choose the students whose families should receive this SMS"
                  />
                </Grid>
              )}

              {formData.targetAudience === 'Individual' && (
                <Grid size={12}>
                  <FormAutocompleteSelect
                    label="Student"
                    name="individualRecipient"
                    value={formData.recipients[0] || ''}
                    onChange={handleIndividualRecipientChange}
                    options={studentOptions}
                    required
                    disabled={isLocked || loading}
                  />
                </Grid>
              )}

              {formData.targetAudience === 'All Parents' && (
                <Grid size={12}>
                  <Alert severity="info">
                    All active families with at least one active student will receive this SMS.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ScheduleIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Delivery
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Leave the schedule empty to save a draft and send it manually later.
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Aakash SMS delivery runs from the backend server only. The deployed backend IP must be whitelisted by the provider.
            </Alert>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  label="Scheduled Date"
                  name="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={handleFieldChange}
                  disabled={isLocked || loading}
                  helperText="Optional. The server will automatically send scheduled notifications."
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    height: '100%',
                    minHeight: 56,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    px: 2,
                    bgcolor: alpha('#1976d2', 0.04),
                  }}
                >
                  <SmsIcon color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Active Channel
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SMS via Aakash SMS
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2, bgcolor: alpha('#1976d2', 0.05) }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PeopleIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Preview
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                {formData.message || 'Your notification message preview will appear here.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={formData.targetAudience} size="small" color="info" />
                <Chip label={formData.scheduledDate ? 'Scheduled' : 'Draft'} size="small" color={formData.scheduledDate ? 'warning' : 'default'} />
                <Chip label="SMS" size="small" color="primary" />
              </Box>

              {selectedClassLabels.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Classes: {selectedClassLabels.join(', ')}
                </Typography>
              )}

              {selectedRecipientLabels.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Recipients: {selectedRecipientLabels.slice(0, 5).join(', ')}
                  {selectedRecipientLabels.length > 5 ? ` +${selectedRecipientLabels.length - 5} more` : ''}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary">
                {formatSchedulePreview(formData.scheduledDate)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            p: 3,
            bgcolor: alpha('#f5f5f5', 0.5),
            borderRadius: 2,
          }}
        >
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
            disabled={isLocked}
            sx={{ minWidth: 180 }}
          >
            {notificationData ? 'Save Notification' : 'Create Notification'}
          </Button>
        </Box>
      </Box>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
