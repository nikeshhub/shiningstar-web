import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, QueryState } from '../../components/common';
import { useQueryStatus, useTeacher } from '../../hooks';
import TeacherForm from './TeacherForm';

export default function TeacherFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const teacherQuery = useTeacher(id, { enabled: isEdit });
  const {
    data: teacherData = null,
    error,
    isInitialLoading,
    isRefreshing,
  } = useQueryStatus(teacherQuery);

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
        <QueryState
          isLoading={isEdit && isInitialLoading}
          isRefreshing={isEdit && isRefreshing}
          error={isEdit ? error : null}
          loadingText="Loading teacher details..."
        >
          <TeacherForm teacherData={teacherData} onSuccess={handleSuccess} onCancel={handleCancel} />
        </QueryState>
      </Paper>
    </Box>
  );
}
