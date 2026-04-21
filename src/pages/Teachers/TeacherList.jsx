import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Dialog, Toast, StatusChip } from '../../components/common';
import { teacherAPI } from '../../services/api';

export default function TeacherList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getAll();
      if (response.data.success) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
      setToast({ open: true, message: 'Failed to load teachers.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/dashboard/teachers/add');
  };

  const handleEdit = (teacherData) => {
    navigate(`/dashboard/teachers/edit/${teacherData._id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await teacherAPI.delete(teacherToDelete._id);
      if (response.data.success) {
        setToast({ open: true, message: 'Teacher deleted successfully!', severity: 'success' });
        setDeleteDialog(false);
        setTeacherToDelete(null);
        loadTeachers();
      } else {
        setToast({ open: true, message: response.data.message, severity: 'error' });
        setDeleteDialog(false);
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      setToast({ open: true, message: 'Failed to delete teacher', severity: 'error' });
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
    },
    {
      field: 'qualification',
      headerName: 'Qualification',
      width: 150,
      renderCell: (row) => row.qualification || '-',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (row) => <StatusChip status={row.status} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/dashboard/teachers/${row._id}`)}
            title="View Details"
          >
            <PersonIcon fontSize="small" />
          </IconButton>
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
              setTeacherToDelete(row);
              setDeleteDialog(true);
            }}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Teachers Management (शिक्षक व्यवस्थापन)
        </Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd}>
          Add New Teacher
        </Button>
      </Box>

      <Table
        columns={columns}
        rows={teachers}
        loading={loading}
        emptyMessage="No teachers found. Click 'Add New Teacher' to create one."
        hover
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        variant="confirm"
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete teacher <strong>{teacherToDelete?.name}</strong>?
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
