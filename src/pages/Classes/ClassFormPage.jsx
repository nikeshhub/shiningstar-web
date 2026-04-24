import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, QueryState } from '../../components/common';
import { useClass, useQueryStatus } from '../../hooks';
import ClassForm from './ClassForm';

export default function ClassFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const classQuery = useClass(id, { enabled: isEdit });
  const {
    data: classData = null,
    error,
    isInitialLoading,
    isRefreshing,
  } = useQueryStatus(classQuery);

  const handleSuccess = () => {
    navigate('/dashboard/classes');
  };

  const handleCancel = () => {
    navigate('/dashboard/classes');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/classes')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {isEdit ? 'Edit Class' : 'Add New Class'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <QueryState
          isLoading={isEdit && isInitialLoading}
          isRefreshing={isEdit && isRefreshing}
          error={isEdit ? error : null}
          loadingText="Loading class details..."
        >
          <ClassForm classData={classData} onSuccess={handleSuccess} onCancel={handleCancel} />
        </QueryState>
      </Paper>
    </Box>
  );
}
