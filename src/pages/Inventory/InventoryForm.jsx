import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { Input, Select, Button, Toast } from '../../components/common';
import { inventoryAPI, classAPI } from '../../services/api';

export default function InventoryForm({ itemData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: '',
    unit: '',
    minimumQuantity: '',
    unitPrice: '',
    location: '',
    description: '',
    applicableClasses: [],
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    classAPI.getAll({ status: 'Active' })
      .then(res => { if (res.data.success) setClasses(res.data.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (itemData) {
      setFormData({
        itemName: itemData.itemName || '',
        category: itemData.category || '',
        quantity: itemData.quantity || '',
        unit: itemData.unit || '',
        minimumQuantity: itemData.minimumQuantity || '',
        unitPrice: itemData.unitPrice || '',
        location: itemData.location || '',
        description: itemData.description || '',
        applicableClasses: itemData.applicableClasses?.map(c => c._id || c) || [],
      });
    }
  }, [itemData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData };
      if (payload.category !== 'Books') payload.applicableClasses = [];

      if (itemData?._id) {
        await inventoryAPI.update(itemData._id, payload);
        setToast({ open: true, message: 'Item updated successfully!', severity: 'success' });
      } else {
        await inventoryAPI.create(payload);
        setToast({ open: true, message: 'Item added successfully!', severity: 'success' });
      }
      setTimeout(() => onSuccess(), 1000);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error saving item',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Books', 'Stationery', 'Uniform'];
  const units = ['Piece', 'Set', 'Box', 'Pack', 'Dozen'];
  const classOptions = classes.map(c => ({ label: c.className, value: c._id }));
  const totalValue = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {itemData ? 'Edit Inventory Item' : 'Add Inventory Item'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {itemData ? 'Update item information and stock details' : 'Add a new item to the inventory'}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InventoryIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Item Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  label="Item Name"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., English Book Grade 5"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categories}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Select
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  options={units}
                  required
                />
              </Grid>

              <Grid size={12}>
                <Input
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Additional details about the item..."
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Applicable Classes — only for Books */}
        {formData.category === 'Books' && (
          <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SchoolIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Applicable Classes
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Which classes use this book? Used to auto-fill book sets during distribution.
              </Typography>
              <Select
                label="Classes"
                name="applicableClasses"
                value={formData.applicableClasses}
                onChange={handleChange}
                options={classOptions}
                multiple
                allowNone={false}
                placeholder="Select classes..."
                helperText="Select all classes that use this book"
              />
            </CardContent>
          </Card>
        )}

        {/* Stock & Location */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ShippingIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Stock & Location
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Quantity tracking and storage information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 50"
                  helperText="Current stock quantity"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  label="Minimum Quantity"
                  name="minimumQuantity"
                  type="number"
                  value={formData.minimumQuantity}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 10"
                  helperText="Alert threshold for low stock"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  label="Storage Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Store Room 1, Shelf A"
                  helperText="Where the item is stored"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MoneyIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Pricing Information
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Cost and value tracking
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Input
                  label="Unit Price (Rs.)"
                  name="unitPrice"
                  type="number"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="e.g., 250"
                  helperText="Price per unit"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{
                  p: 2,
                  bgcolor: alpha('#2e7d32', 0.05),
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: alpha('#2e7d32', 0.2),
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Total Value
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                    Rs. {totalValue.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          p: 3,
          bgcolor: alpha('#f5f5f5', 0.5),
          borderRadius: 2,
        }}>
          <Button variant="outlined" onClick={onCancel} disabled={loading} sx={{ minWidth: 120 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={loading} sx={{ minWidth: 160 }}>
            {itemData ? 'Update Item' : 'Add Item'}
          </Button>
        </Box>
      </Box>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
