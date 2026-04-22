import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  ContactPhone as ContactIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { Button, Toast, FormField, FormSelect } from '../../components/common';
import { teacherAPI } from '../../hooks/reactQueryApi';
import { adToBSDate } from '../../utils/nepaliDate';

// ─── Validation Schema ────────────────────────────────────────────────────────
const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().optional().default(''),
  gender: z.string().optional().default(''),
  address: z.string().optional().default(''),
  qualification: z.string().optional().default(''),
  salary: z.preprocess(
    val => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(0, 'Salary cannot be negative').optional()
  ),
  status: z.string().default('Active'),
});

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

export default function TeacherForm({ teacherData, onSuccess, onCancel }) {
  const [toast, setToast] = React.useState({ open: false, message: '', severity: 'info' });
  const isEdit = Boolean(teacherData?._id);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      qualification: '',
      salary: undefined,
      status: 'Active',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (teacherData) {
      reset({
        name: teacherData.name || '',
        email: teacherData.email || '',
        phone: teacherData.phone || '',
        dateOfBirth: adToBSDate(teacherData.dateOfBirth),
        gender: teacherData.gender || '',
        address: teacherData.address || '',
        qualification: teacherData.qualification || '',
        salary: teacherData.salary ?? undefined,
        status: teacherData.status || 'Active',
      });
    }
  }, [teacherData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await teacherAPI.update(teacherData._id, data);
        setToast({ open: true, message: 'Teacher updated successfully!', severity: 'success' });
      } else {
        const payload = { ...data };
        delete payload.status;
        await teacherAPI.create(payload);
        setToast({ open: true, message: 'Teacher created successfully!', severity: 'success' });
      }
      setTimeout(() => onSuccess(), 1000);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error saving teacher',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {isEdit ? 'Edit Teacher' : 'Add New Teacher'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? 'Update teacher information and details' : 'Register a new teacher in the system'}
        </Typography>
      </Box>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Personal Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="name"
                  label="Full Name"
                  required
                  placeholder="e.g., John Doe"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  helperText="Select teacher's birth date"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormSelect
                  control={control}
                  name="gender"
                  label="Gender"
                  options={GENDER_OPTIONS}
                  placeholder="Select gender"
                />
              </Grid>

              {isEdit && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormSelect
                    control={control}
                    name="status"
                    label="Status"
                    options={STATUS_OPTIONS}
                    renderValue={(selected) => (
                      <Chip
                        label={selected}
                        size="small"
                        color={selected === 'Active' ? 'success' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid size={12}>
                <FormField
                  control={control}
                  name="address"
                  label="Address"
                  multiline
                  rows={2}
                  placeholder="Enter complete address"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ContactIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Contact Information
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Email and phone number for communication
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="teacher@example.com"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="phone"
                  label="Phone Number"
                  required
                  placeholder="e.g., 9841234567"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SchoolIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Professional Information
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Academic qualifications and employment details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="qualification"
                  label="Qualification"
                  placeholder="e.g., B.Ed., M.A., B.Sc."
                  helperText="Highest educational qualification"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="salary"
                  label="Monthly Salary (Rs.)"
                  type="number"
                  placeholder="e.g., 25000"
                  helperText="Monthly salary amount"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Salary Summary (if editing and has salary) */}
        {isEdit && teacherData?.salary && (
          <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2, bgcolor: alpha('#1976d2', 0.05) }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WorkIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Salary Summary
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Monthly Salary
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Rs. {teacherData.salary || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Annual Salary
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      Rs. {(teacherData.salary || 0) * 12}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={teacherData.status}
                      size="small"
                      color={teacherData.status === 'Active' ? 'success' : 'default'}
                      sx={{ fontWeight: 600, mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
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
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ minWidth: 160 }}
          >
            {isEdit ? 'Update Teacher' : 'Add Teacher'}
          </Button>
        </Box>
      </Box>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
