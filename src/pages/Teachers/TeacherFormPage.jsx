import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common';
import { teacherAPI } from '../../services/api';
import TeacherForm from './TeacherForm';

export default function TeacherFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    teacherAPI.getById(id)
      .then((res) => {
        if (res.data.success) setTeacherData(res.data.data);
      })
      .catch((err) => console.error('Error loading teacher:', err));
  }, [id, isEdit]);

  const handleSuccess = () => {
    navigate('/dashboard/teachers');
  };

  const handleCancel = () => {
    navigate('/dashboard/teachers');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/teachers')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {isEdit ? 'Edit Teacher' : 'Add New Teacher'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TeacherForm teacherData={teacherData} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Paper>
    </Box>
  );
}
