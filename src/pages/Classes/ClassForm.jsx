import React, { useState, useEffect } from 'react';
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
import { School as SchoolIcon, People as PeopleIcon, MenuBook as MenuBookIcon } from '@mui/icons-material';
import { Button, Toast, FormField, FormSelect, FormAutocompleteSelect, FormMultiSelect } from '../../components/common';
import { classAPI, teacherAPI, subjectAPI } from '../../hooks/reactQueryApi';

// ─── Validation Schema ────────────────────────────────────────────────────────
const classSchema = z.object({
  className: z.string().min(1, 'Class name is required'),
  classTeacher: z.string().optional().default(''),
  capacity: z.preprocess(
    val => (val === '' || val === undefined ? undefined : Number(val)),
    z.number({
      required_error: 'Capacity is required',
      invalid_type_error: 'Capacity is required',
    }).min(1, 'Capacity must be at least 1')
  ),
  monthlyFee: z.preprocess(
    val => (val === '' || val === undefined ? undefined : Number(val)),
    z.number({
      required_error: 'Monthly fee is required',
      invalid_type_error: 'Monthly fee is required',
    }).min(0, 'Fee cannot be negative')
  ),
  subjects: z.array(z.string()).optional().default([]),
  status: z.string().default('Active'),
});

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

export default function ClassForm({ classData, onSuccess, onCancel }) {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const isEdit = Boolean(classData?._id);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      className: '',
      classTeacher: '',
      capacity: 40,
      monthlyFee: 0,
      subjects: [],
      status: 'Active',
    },
  });

  // Load reference data + populate form on edit
  useEffect(() => {
    teacherAPI.getAll({ status: 'Active' })
      .then(res => { if (res.data.success) setTeachers(res.data.data); })
      .catch(err => console.error(err));

    subjectAPI.getAll()
      .then(res => { if (res.data.success) setSubjects(res.data.data); })
      .catch(err => console.error(err));

    if (classData) {
      // Extract subject IDs from the embedded document structure
      const subjectIds = (classData.subjects || [])
        .map(s => {
          // Handle embedded document structure: { subject: {...}, book: {...} }
          if (s.subject) {
            // If subject is an object with _id, return the _id string
            if (typeof s.subject === 'object' && s.subject._id) {
              return s.subject._id;
            }
            // If subject is already a string ID
            if (typeof s.subject === 'string') {
              return s.subject;
            }
          }
          // Handle direct reference (backward compatibility)
          if (s._id) {
            return s._id;
          }
          // If it's already a string, return it
          if (typeof s === 'string') {
            return s;
          }
          return null;
        })
        .filter(id => id !== null); // Remove any null values

      // Extract classTeacher ID safely
      let classTeacherId = '';
      if (classData.classTeacher) {
        if (typeof classData.classTeacher === 'object' && classData.classTeacher._id) {
          classTeacherId = classData.classTeacher._id;
        } else if (typeof classData.classTeacher === 'string') {
          classTeacherId = classData.classTeacher;
        }
      }

      reset({
        className: classData.className || '',
        classTeacher: classTeacherId,
        capacity: classData.capacity || 40,
        monthlyFee: classData.monthlyFee ?? 0,
        subjects: subjectIds,
        status: classData.status || 'Active',
      });
    }
  }, [classData, reset]);

  const teacherOptions = teachers.map(t => ({ label: t.name, value: t._id }));
  const subjectOptions = subjects.map(s => ({
    label: `${s.subjectName} (${s.subjectCode})`,
    value: s._id,
  }));

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await classAPI.update(classData._id, data);
        setToast({ open: true, message: 'Class updated successfully!', severity: 'success' });
      } else {
        const payload = { ...data };
        delete payload.status;
        await classAPI.create(payload);
        setToast({ open: true, message: 'Class created successfully!', severity: 'success' });
      }
      setTimeout(() => onSuccess(), 1000);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error saving class',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {isEdit ? 'Edit Class' : 'Create New Class'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? 'Update class information and configuration' : 'Add a new class to the school'}
        </Typography>
      </Box>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <SchoolIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Basic Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="className"
                  label="Class Name"
                  required
                  placeholder="e.g., Nursery, LKG, UKG, Class 1"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormAutocompleteSelect
                  control={control}
                  name="classTeacher"
                  label="Class Teacher"
                  options={teacherOptions}
                  placeholder="Type to search teacher..."
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="capacity"
                  label="Capacity"
                  type="number"
                  required
                  helperText="Maximum number of students in this class"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="monthlyFee"
                  label="Monthly Fee (Rs.)"
                  type="number"
                  required
                  placeholder="e.g., 5000"
                  helperText="Monthly tuition fee for students"
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
            </Grid>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MenuBookIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Subjects
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the subjects that will be taught in this class
            </Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <FormMultiSelect
                  control={control}
                  name="subjects"
                  label="Select Subjects"
                  options={subjectOptions}
                  helperText="You can select multiple subjects for this class"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Revenue Summary (if editing) */}
        {isEdit && classData && (
          <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2, bgcolor: alpha('#2e7d32', 0.05) }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PeopleIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                  Revenue Summary
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Enrolled Students
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {classData.studentCount || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Monthly Revenue
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      Rs. {classData.totalMonthlyRevenue || 0}
                    </Typography>
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
            {isEdit ? 'Update Class' : 'Create Class'}
          </Button>
        </Box>
      </Box>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
