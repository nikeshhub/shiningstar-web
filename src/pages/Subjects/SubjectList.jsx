import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Dialog, Toast } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/dashboard';
import { useSubjects, useDeleteSubject } from '../../hooks';

export default function SubjectList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const canManageSubjects = user?.role === 'Admin';

  // React Query hooks
  const { data: subjects = [], isLoading: loading, error } = useSubjects();
  const deleteSubjectMutation = useDeleteSubject();

  // Show error toast if query fails
  React.useEffect(() => {
    if (error) {
      setToast({ open: true, message: 'Failed to load subjects.', severity: 'error' });
    }
  }, [error]);

  const handleAdd = () => {
    navigate('/dashboard/subjects/add');
  };

  const handleEdit = (subject) => {
    navigate(`/dashboard/subjects/edit/${subject._id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteSubjectMutation.mutateAsync(subjectToDelete._id);
      setToast({ open: true, message: 'Subject deleted successfully!', severity: 'success' });
      setDeleteDialog(false);
      setSubjectToDelete(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
      setToast({
        open: true,
        message: error.message || 'Failed to delete subject',
        severity: 'error'
      });
      setDeleteDialog(false);
    }
  };

  const columns = [
    {
      field: 'subjectName',
      headerName: 'Subject Name',
      width: 180,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.subjectName}
        </Typography>
      ),
    },
    {
      field: 'subjectCode',
      headerName: 'Code',
      width: 100,
      renderCell: (row) => (
        <Chip
          label={row.subjectCode}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'subjectType',
      headerName: 'Type',
      width: 100,
      renderCell: (row) => (
        <Chip
          label={row.subjectType}
          size="small"
          color={row.subjectType === 'Major' ? 'error' : 'success'}
        />
      ),
    },
    {
      field: 'creditHours',
      headerName: 'Credit Hours',
      width: 120,
      renderCell: (row) => (
        <Typography variant="body2">
          {row.creditHours.toFixed(1)}
        </Typography>
      ),
    },
    {
      field: 'marks',
      headerName: 'Marks Distribution',
      width: 180,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          W: {row.writtenMarks} | P: {row.practicalMarks}
        </Typography>
      ),
    },
    {
      field: 'fullMarks',
      headerName: 'Full Marks',
      width: 100,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
          {row.fullMarks}
        </Typography>
      ),
    },
    {
      field: 'passMarks',
      headerName: 'Pass Marks',
      width: 100,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#d32f2f' }}>
          {row.passMarks}
        </Typography>
      ),
    },
    {
      field: 'applicableCategories',
      headerName: 'Applicable To',
      width: 200,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.applicableCategories?.map((cat, idx) => (
            <Chip
              key={idx}
              label={cat.replace(/_/g, ' ')}
              size="small"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'isOptional',
      headerName: 'Optional',
      width: 100,
      renderCell: (row) => (
        <Chip
          label={row.isOptional ? 'Yes' : 'No'}
          size="small"
          color={row.isOptional ? 'info' : 'default'}
        />
      ),
    },
    ...(canManageSubjects ? [{
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="info"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setSubjectToDelete(row);
              setDeleteDialog(true);
            }}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    }] : []),
  ];

  return (
    <Box>
      <PageHeader
        title="<em>Subjects</em> Management (विषय व्यवस्थापन)"
        action={
          canManageSubjects ? (
            <Button startIcon={<AddIcon />} onClick={handleAdd}>
              Add New Subject
            </Button>
          ) : null
        }
      />

      <Table
        columns={columns}
        rows={subjects}
        loading={loading}
        emptyMessage="No subjects found. Click 'Add New Subject' to create one."
        hover
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        variant="confirm"
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete subject <strong>{subjectToDelete?.subjectName}</strong>?
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        confirmColor="error"
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
      />

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
