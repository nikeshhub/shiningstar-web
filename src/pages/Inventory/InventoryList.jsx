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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card } from '../../components/common';
import { inventoryAPI } from '../../services/api';

export default function InventoryList() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAll();
      if (response.data.success) {
        setInventory(response.data.data);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      setSnackbar({ open: true, message: 'Failed to load inventory. Please check if the server is running.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/dashboard/inventory/add');
  };

  const handleEdit = (item) => {
    navigate(`/dashboard/inventory/edit/${item._id}`);
  };

  const handleDelete = async () => {
    try {
      await inventoryAPI.delete(itemToDelete._id);
      setSnackbar({ open: true, message: 'Item deleted successfully!', severity: 'success' });
      setDeleteDialog(false);
      setItemToDelete(null);
      loadInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
      setSnackbar({ open: true, message: 'Failed to delete item', severity: 'error' });
    }
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { label: 'Out of Stock', color: 'error' };
    if (item.quantity <= item.minimumQuantity) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const columns = [
    {
      field: 'itemName',
      headerName: 'Item Name',
      width: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.itemName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.itemCode}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (row) => (
        <Chip label={row.category} size="small" variant="outlined" />
      ),
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
      field: 'minimumQuantity',
      headerName: 'Min. Quantity',
      width: 130,
      renderCell: (row) => `${row.minimumQuantity} ${row.unit}`,
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 120,
      renderCell: (row) => `Rs. ${row.unitPrice || 0}`,
    },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      width: 130,
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
      width: 120,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(row)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setItemToDelete(row);
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

  const lowStockItems = inventory.filter(item => item.quantity <= item.minimumQuantity);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0),
    lowStock: lowStockItems.length,
    outOfStock: outOfStockItems.length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Inventory Management (सामान व्यवस्थापन)
        </Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd}>
          Add New Item
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card
          sx={{ flex: 1, bgcolor: 'primary.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {stats.totalItems}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Items
          </Typography>
        </Card>

        <Card
          sx={{ flex: 1, bgcolor: 'success.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
            Rs. {stats.totalValue.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Value
          </Typography>
        </Card>

        <Card
          sx={{ flex: 1, bgcolor: 'warning.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
            {stats.lowStock}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Low Stock
          </Typography>
        </Card>

        <Card
          sx={{ flex: 1, bgcolor: 'error.lighter' }}
          contentSx={{ textAlign: 'center' }}
        >
          <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
            {stats.outOfStock}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Out of Stock
          </Typography>
        </Card>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All Items (${inventory.length})`} />
          <Tab
            label={`Low Stock (${lowStockItems.length})`}
            icon={lowStockItems.length > 0 ? <WarningIcon color="warning" /> : null}
            iconPosition="end"
          />
          <Tab
            label={`Out of Stock (${outOfStockItems.length})`}
            icon={outOfStockItems.length > 0 ? <WarningIcon color="error" /> : null}
            iconPosition="end"
          />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Table
          columns={columns}
          rows={inventory}
          loading={loading}
          emptyMessage="No inventory items found. Click 'Add New Item' to create one."
          hover
        />
      )}

      {tabValue === 1 && (
        <Table
          columns={columns}
          rows={lowStockItems}
          loading={loading}
          emptyMessage="No low stock items."
          hover
        />
      )}

      {tabValue === 2 && (
        <Table
          columns={columns}
          rows={outOfStockItems}
          loading={loading}
          emptyMessage="No out of stock items."
          hover
        />
      )}

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{itemToDelete?.itemName}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
