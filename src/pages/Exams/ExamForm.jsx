import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Input, Select, Button } from '../../components/common';
import { examAPI, classAPI } from '../../services/api';

export default function ExamForm({ examData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    examName: '',
    examType: '',
    class: '',
    subject: '',
    examDate: '',
    totalMarks: '',
    passingMarks: '',
    duration: '',
    status: 'Scheduled',
    academicYear: '2081-2082',
    instructions: '',
  });

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (examData) {
      setFormData({
        examName: examData.examName || '',
        examType: examData.examType || '',
        class: examData.class?._id || examData.class || '',
        subject: examData.subject?._id || examData.subject || '',
        examDate: examData.examDate ? examData.examDate.split('T')[0] : '',
        totalMarks: examData.totalMarks || '',
        passingMarks: examData.passingMarks || '',
        duration: examData.duration || '',
        status: examData.status || 'Scheduled',
        academicYear: examData.academicYear || '2081-2082',
        instructions: examData.instructions || '',
      });
    }
  }, [examData]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll({ status: 'Active' });
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (examData?._id) {
        await examAPI.update(examData._id, formData);
        alert('Exam updated successfully!');
      } else {
        await examAPI.create(formData);
        alert('Exam created successfully!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving exam:', error);
      alert(error.response?.data?.message || 'Error saving exam');
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    'English',
    'Nepali',
    'Mathematics',
    'Science',
    'Social Studies',
    'Computer',
    'Moral Education',
    'Health & Physical Education',
    'Optional Mathematics',
    'Account',
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="Exam Name"
            name="examName"
            value={formData.examName}
            onChange={handleChange}
            required
            placeholder="e.g., First Terminal Exam"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Select
            label="Exam Type"
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            options={['Unit Test', 'Terminal', 'Final', 'Weekly Test', 'Monthly Test']}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Select
            label="Class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            options={classes.map(c => ({ label: c.className, value: c._id }))}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Select
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            options={subjects}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="Exam Date"
            name="examDate"
            type="date"
            value={formData.examDate}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="e.g., 90"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="Total Marks"
            name="totalMarks"
            type="number"
            value={formData.totalMarks}
            onChange={handleChange}
            required
            placeholder="e.g., 100"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="Passing Marks"
            name="passingMarks"
            type="number"
            value={formData.passingMarks}
            onChange={handleChange}
            required
            placeholder="e.g., 40"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={['Scheduled', 'Ongoing', 'Completed', 'Cancelled']}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            label="Academic Year"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            required
            placeholder="e.g., 2081-2082"
          />
        </Grid>

        <Grid size={12}>
          <Input
            label="Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Any special instructions for the exam..."
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {examData ? 'Update Exam' : 'Create Exam'}
        </Button>
      </Box>
    </Box>
  );
}
