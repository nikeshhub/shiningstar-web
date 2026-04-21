import React, { useState, useEffect } from 'react';
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
import { subjectAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SubjectList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const canManageSubjects = user?.role === 'Admin';

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectAPI.getAll();
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setToast({ open: true, message: 'Failed to load subjects.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/dashboard/subjects/add');
  };

  const handleEdit = (subject) => {
    navigate(`/dashboard/subjects/edit/${subject._id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await subjectAPI.delete(subjectToDelete._id);
      if (response.data.success) {
        setToast({ open: true, message: 'Subject deleted successfully!', severity: 'success' });
        setDeleteDialog(false);
        setSubjectToDelete(null);
        loadSubjects();
      } else {
        setToast({ open: true, message: response.data.message, severity: 'error' });
        setDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      setToast({ open: true, message: 'Failed to delete subject', severity: 'error' });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Subjects Management (विषय व्यवस्थापन)
        </Typography>
        {canManageSubjects && (
          <Button startIcon={<AddIcon />} onClick={handleAdd}>
            Add New Subject
          </Button>
        )}
      </Box>

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
