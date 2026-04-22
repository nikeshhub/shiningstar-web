import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { familyAPI } from '../../hooks/reactQueryApi';
import { Table, Toast, Dialog } from '../../components/common';
import { PageHeader } from '../../components/dashboard';

export default function FamilyList() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, familyId: null, familyName: '' });

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    try {
      setLoading(true);
      const response = await familyAPI.getAll();
      if (response.data.success) {
        setFamilies(response.data.data);
      }
    } catch (error) {
      console.error('Error loading families:', error);
      setToast({ open: true, message: 'Error loading families', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (family) => {
    setDeleteDialog({
      open: true,
      familyId: family._id,
      familyName: family.familyId || family.primaryContact.name
    });
  };

  const confirmDelete = async () => {
    try {
      await familyAPI.delete(deleteDialog.familyId);
      setDeleteDialog({ open: false, familyId: null, familyName: '' });
      setToast({ open: true, message: 'Family deleted successfully', severity: 'success' });
      loadFamilies();
    } catch (error) {
      console.error('Error deleting family:', error);
      setDeleteDialog({ open: false, familyId: null, familyName: '' });
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error deleting family',
        severity: 'error',
      });
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, familyId: null, familyName: '' });
  };

  const columns = [
    {
      field: 'familyId',
      headerName: 'Family ID',
      width: 120,
    },
    {
      field: 'primaryContact',
      headerName: 'Primary Contact',
      flex: 1,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.primaryContact.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.primaryContact.mobile}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'studentCount',
      headerName: 'Students',
      width: 100,
      renderCell: (row) => (
        <Chip
          icon={<PeopleIcon />}
          label={row.studentCount || 0}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'familyFeeBalance',
      headerName: 'Balance',
      width: 150,
      renderCell: (row) => {
        const balance = row.familyFeeBalance;
        const netBalance = (balance?.totalDue || 0) - (balance?.totalAdvance || 0);

        return (
          <Box>
            {netBalance > 0 ? (
              <Typography variant="body2" color="error" fontWeight={600}>
                Due: Rs. {balance.totalDue}
              </Typography>
            ) : netBalance < 0 ? (
              <Typography variant="body2" color="success.main" fontWeight={600}>
                Advance: Rs. {balance.totalAdvance}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Clear
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'Active' ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/dashboard/families/${row._id}`)}
            title="View Details"
          >
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/dashboard/families/edit/${row._id}`)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row)}
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
      <PageHeader
        title="<em>Family</em> Management"
        subtitle="Manage families for sibling grouping and combined fee billing"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/families/create')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2,
            }}
          >
            Create Family
          </Button>
        }
      />

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#2196f3', 0.05), border: '1px solid', borderColor: alpha('#2196f3', 0.2) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Families
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {families.length}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#4caf50', 0.05), border: '1px solid', borderColor: alpha('#4caf50', 0.2) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Active Families
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {families.filter((f) => f.status === 'Active').length}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#ff9800', 0.05), border: '1px solid', borderColor: alpha('#ff9800', 0.2) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {families.reduce((sum, f) => sum + (f.studentCount || 0), 0)}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: alpha('#9c27b0', 0.05), border: '1px solid', borderColor: alpha('#9c27b0', 0.2) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Families with Dues
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                    {families.filter((f) => (f.familyFeeBalance?.totalDue || 0) > 0).length}
                  </Typography>
                </Box>
                <BalanceIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Families Table */}
      <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
        <CardContent>
          <Table
            columns={columns}
            rows={families}
            loading={loading}
            pagination={true}
            rowsPerPage={10}
          />
        </CardContent>
      </Card>

      <Dialog
        variant="confirm"
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Family"
        message={`Are you sure you want to delete family "${deleteDialog.familyName}"? All students must be unlinked first.`}
        confirmLabel="Delete"
        confirmColor="error"
      />

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
