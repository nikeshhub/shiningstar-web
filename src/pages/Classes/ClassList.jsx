import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Dialog, Toast } from '../../components/common';
import { useClasses, useDeleteClass, useQueryStatus } from '../../hooks';
import { PageHeader, StatusBadge } from '../../components/dashboard';
import { useAuth } from '../../context/AuthContext';

export default function ClassList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const canManageClasses = user?.role === 'Admin';
  const showFinancialColumns = user?.role === 'Admin';
  const classesQuery = useClasses();
  const { data: classes = [], error, isInitialLoading, isRefreshing } = useQueryStatus(classesQuery, {
    hasData: (data) => Array.isArray(data),
  });
  const deleteClassMutation = useDeleteClass();

  useEffect(() => {
    if (error) {
      setToast({ open: true, message: 'Failed to load classes.', severity: 'error' });
    }
  }, [error]);

  const handleAdd = () => {
    navigate('/dashboard/classes/add');
  };

  const handleEdit = (classData) => {
    navigate(`/dashboard/classes/edit/${classData._id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteClassMutation.mutateAsync(classToDelete._id);
      setToast({ open: true, message: 'Class deleted successfully!', severity: 'success' });
      setDeleteDialog(false);
      setClassToDelete(null);
    } catch (error) {
      console.error('Error deleting class:', error);
      setToast({ open: true, message: 'Failed to delete class', severity: 'error' });
    }
  };

  const columns = [
    {
      field: 'className',
      headerName: 'Class Name',
      width: 200,
      renderCell: (row) => (
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
          {row.className}
        </Typography>
      ),
    },
    {
      field: 'classTeacher',
      headerName: 'Class Teacher',
      width: 200,
      renderCell: (row) => (
        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
          {row.classTeacher?.name || '-'}
        </Typography>
      ),
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 100,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            {row.capacity || '-'}
          </Typography>
        </Box>
      ),
    },
    ...(showFinancialColumns ? [{
      field: 'monthlyFee',
      headerName: 'Monthly Fee',
      width: 130,
      renderCell: (row) => (
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'success.main' }}>
          Rs. {row.monthlyFee || 0}
        </Typography>
      ),
    }] : []),
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (row) => (
        <StatusBadge
          label={row.status}
          status={row.status === 'Active' ? 'success' : 'secondary'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/dashboard/classes/${row._id}`)}
            title="View Details"
          >
            <InfoIcon fontSize="small" />
          </IconButton>
          {canManageClasses && (
            <IconButton
              size="small"
              color="info"
              onClick={() => handleEdit(row)}
              title="Edit"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {canManageClasses && (
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setClassToDelete(row);
                setDeleteDialog(true);
              }}
              title="Delete"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="<em>Classes</em> Management (कक्षा व्यवस्थापन)"
        action={canManageClasses ? (
          <Button startIcon={<AddIcon />} onClick={handleAdd}>
            Add New Class
          </Button>
        ) : null}
      />

      <Table
        columns={columns}
        rows={classes}
        loading={isInitialLoading}
        fetching={isRefreshing}
        loadingMessage="Loading classes..."
        emptyMessage="No classes found. Click 'Add New Class' to create one."
        hover
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        variant="confirm"
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete class <strong>{classToDelete?.className}</strong>?
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
