import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Share as DistributeIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, Select } from '../../components/common';
import { inventoryAPI } from '../../hooks/reactQueryApi';
import { formatBSDate } from '../../utils/nepaliDate';
import DistributeDialog from './DistributeDialog';
import DistributeBookSetDialog from './DistributeBookSetDialog';

const CATEGORIES = ['Books', 'Stationery', 'Uniform'];
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Linked to Fee'];

const paymentStatusColor = { Paid: 'success', Pending: 'warning', 'Linked to Fee': 'info' };

export default function InventoryList() {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distLoading, setDistLoading] = useState(false);

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [distributeDialog, setDistributeDialog] = useState(false);
  const [itemToDistribute, setItemToDistribute] = useState(null);
  const [bookSetDialog, setBookSetDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (tabValue === 3) loadDistributions();
  }, [tabValue, filterPaymentStatus]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAll();
      if (response.data.success) setInventory(response.data.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load inventory.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadDistributions = async () => {
    try {
      setDistLoading(true);
      const params = {};
      if (filterPaymentStatus) params.paymentStatus = filterPaymentStatus;
      const response = await inventoryAPI.getAllDistributions(params);
      if (response.data.success) setDistributions(response.data.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load distributions.', severity: 'error' });
    } finally {
      setDistLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await inventoryAPI.delete(itemToDelete._id);
      setSnackbar({ open: true, message: 'Item deleted successfully!', severity: 'success' });
      setDeleteDialog(false);
      setItemToDelete(null);
      loadInventory();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to delete item', severity: 'error' });
    }
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (item.quantity <= item.minimumQuantity) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = !search ||
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = filteredInventory.filter(item => item.quantity > 0 && item.quantity <= item.minimumQuantity);
  const outOfStockItems = filteredInventory.filter(item => item.quantity === 0);

  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0),
    lowStock: inventory.filter(i => i.quantity > 0 && i.quantity <= i.minimumQuantity).length,
    outOfStock: inventory.filter(i => i.quantity === 0).length,
  };

  const itemColumns = [
    {
      field: 'itemName',
      headerName: 'Item Name',
      width: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.itemName}</Typography>
          <Typography variant="caption" color="text.secondary">{row.itemCode}</Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 130,
      renderCell: (row) => <Chip label={row.category} size="small" variant="outlined" />,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      renderCell: (row) => (
        <Typography
          variant="body2"
          color={row.quantity <= row.minimumQuantity ? 'error' : 'text.primary'}
          sx={{ fontWeight: row.quantity === 0 ? 'bold' : 'normal' }}
        >
          {row.quantity} {row.unit}
        </Typography>
      ),
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 110,
      renderCell: (row) => `Rs. ${row.unitPrice || 0}`,
    },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      width: 120,
      renderCell: (row) => `Rs. ${(row.quantity * (row.unitPrice || 0)).toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Stock Status',
      width: 130,
      renderCell: (row) => {
        const status = getStockStatus(row);
        return <Chip label={status.label} color={status.color} size="small" />;
      },
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
            onClick={() => { setItemToDistribute(row); setDistributeDialog(true); }}
            title="Distribute"
            disabled={row.quantity === 0}
          >
            <DistributeIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/dashboard/inventory/edit/${row._id}`)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => { setItemToDelete(row); setDeleteDialog(true); }}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const distributionColumns = [
    {
      field: 'student',
      headerName: 'Student',
      width: 180,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.student?.name || '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.student?.studentId || ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'item',
      headerName: 'Item',
      width: 180,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.item?.itemName || '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.item?.category || ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 80,
      renderCell: (row) => `${row.quantity} ${row.item?.unit || ''}`,
    },
    {
      field: 'price',
      headerName: 'Unit Price',
      width: 110,
      renderCell: (row) => `Rs. ${row.price || 0}`,
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 110,
      renderCell: (row) => `Rs. ${row.totalAmount || 0}`,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 130,
      renderCell: (row) => (
        <Chip
          label={row.paymentStatus}
          color={paymentStatusColor[row.paymentStatus] || 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'distributionDate',
      headerName: 'Date',
      width: 120,
      renderCell: (row) => formatBSDate(row.distributionDate),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Inventory Management
        </Typography>
        <Button startIcon={<AddIcon />} onClick={() => navigate('/dashboard/inventory/add')}>
          Add New Item
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>{stats.totalItems}</Typography>
          <Typography variant="body2" color="text.secondary">Total Items</Typography>
        </Card>
        <Card sx={{ flex: 1 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
            Rs. {stats.totalValue.toFixed(0)}
          </Typography>
          <Typography variant="body2" color="text.secondary">Total Value</Typography>
        </Card>
        <Card sx={{ flex: 1 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>{stats.lowStock}</Typography>
          <Typography variant="body2" color="text.secondary">Low Stock</Typography>
        </Card>
        <Card sx={{ flex: 1 }} contentSx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>{stats.outOfStock}</Typography>
          <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label={`All Items (${inventory.length})`} />
          <Tab
            label={`Low Stock (${stats.lowStock})`}
            icon={stats.lowStock > 0 ? <WarningIcon color="warning" fontSize="small" /> : null}
            iconPosition="end"
          />
          <Tab
            label={`Out of Stock (${stats.outOfStock})`}
            icon={stats.outOfStock > 0 ? <WarningIcon color="error" fontSize="small" /> : null}
            iconPosition="end"
          />
          <Tab label="Distributions" />
        </Tabs>
      </Box>

      {/* Inventory tabs (0,1,2) — shared search/filter toolbar */}
      {tabValue < 3 && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search by name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Select
            label="Category"
            name="filterCategory"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            options={CATEGORIES}
            allowNone
            noneLabel="All Categories"
            sx={{ width: 180 }}
            size="small"
          />
        </Box>
      )}

      {tabValue === 0 && (
        <Table
          columns={itemColumns}
          rows={filteredInventory}
          loading={loading}
          emptyMessage="No inventory items found."
          hover
        />
      )}
      {tabValue === 1 && (
        <Table
          columns={itemColumns}
          rows={lowStockItems}
          loading={loading}
          emptyMessage="No low stock items."
          hover
        />
      )}
      {tabValue === 2 && (
        <Table
          columns={itemColumns}
          rows={outOfStockItems}
          loading={loading}
          emptyMessage="No out of stock items."
          hover
        />
      )}

      {/* Distributions tab */}
      {tabValue === 3 && (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Select
              label="Payment Status"
              name="filterPaymentStatus"
              value={filterPaymentStatus}
              onChange={e => setFilterPaymentStatus(e.target.value)}
              options={PAYMENT_STATUSES}
              allowNone
              noneLabel="All Statuses"
              sx={{ width: 200 }}
              size="small"
            />
            <Box sx={{ ml: 'auto' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setBookSetDialog(true)}
              >
                Distribute Book Set
              </Button>
            </Box>
          </Box>
          <Table
            columns={distributionColumns}
            rows={distributions}
            loading={distLoading}
            emptyMessage="No distribution records found."
            hover
          />
        </>
      )}

      {/* Delete Confirm */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{itemToDelete?.itemName}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Distribute Dialog */}
      <DistributeDialog
        open={distributeDialog}
        onClose={() => { setDistributeDialog(false); setItemToDistribute(null); }}
        item={itemToDistribute}
        onSuccess={() => { loadInventory(); if (tabValue === 3) loadDistributions(); }}
      />

      {/* Distribute Book Set Dialog */}
      <DistributeBookSetDialog
        open={bookSetDialog}
        onClose={() => setBookSetDialog(false)}
        onSuccess={() => { loadInventory(); loadDistributions(); }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
