import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Divider, Alert } from '@mui/material';
import { Input, Select, Dialog, Button, Toast, FormAutocompleteSelect } from '../../components/common';
import { inventoryAPI, studentAPI } from '../../services/api';

export default function DistributeDialog({ open, onClose, item, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    quantity: 1,
    paymentStatus: 'Pending',
    remarks: '',
  });
  const [alreadyGiven, setAlreadyGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!open) return;
    setFormData({ studentId: '', quantity: 1, paymentStatus: 'Pending', remarks: '' });
    setAlreadyGiven(false);
    studentAPI.getAll({ status: 'Active' })
      .then(res => { if (res.data.success) setStudents(res.data.data); })
      .catch(() => {});
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'studentId' && value && item?._id) {
      inventoryAPI.getStudentDistributions(value)
        .then(res => {
          if (!res.data.success) return;
          const given = res.data.data.distributions.some(
            d => (d.item?._id || d.item) === item._id
          );
          setAlreadyGiven(given);
        })
        .catch(() => setAlreadyGiven(false));
    }

    if (name === 'studentId' && !value) setAlreadyGiven(false);
  };

  const totalAmount = (parseFloat(formData.quantity) || 0) * (item?.unitPrice || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId) {
      setToast({ open: true, message: 'Please select a student', severity: 'error' });
      return;
    }
    if (!formData.quantity || Number(formData.quantity) < 1) {
      setToast({ open: true, message: 'Quantity must be at least 1', severity: 'error' });
      return;
    }
    if (Number(formData.quantity) > item?.quantity) {
      setToast({ open: true, message: `Only ${item.quantity} ${item.unit} in stock`, severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      await inventoryAPI.distribute({
        studentId: formData.studentId,
        itemId: item._id,
        quantity: Number(formData.quantity),
        paymentStatus: formData.paymentStatus,
        linkToFee: formData.paymentStatus === 'Linked to Fee',
        remarks: formData.remarks,
      });
      setToast({ open: true, message: 'Item distributed successfully!', severity: 'success' });
      setTimeout(() => { onSuccess(); onClose(); }, 800);
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'Failed to distribute item', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const studentOptions = students.map(s => ({
    label: `${s.name} (${s.studentId || s._id.slice(-4)})`,
    value: s._id,
  }));

  const paymentOptions = ['Pending', 'Paid', 'Linked to Fee'];

  return (
    <>
      <Dialog
        variant="form"
        title={`Distribute — ${item?.itemName || ''}`}
        open={open}
        onClose={onClose}
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          {/* Item summary */}
          <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid size={4}>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body2" fontWeight={600}>{item?.category}</Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="caption" color="text.secondary">In Stock</Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={item?.quantity === 0 ? 'error.main' : 'success.main'}
                >
                  {item?.quantity} {item?.unit}
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="caption" color="text.secondary">Unit Price</Typography>
                <Typography variant="body2" fontWeight={600}>Rs. {item?.unitPrice || 0}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2}>
            <Grid size={12}>
              <FormAutocompleteSelect
                label="Student"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                options={studentOptions}
                required
                placeholder="Type to search student..."
              />
            </Grid>

            {/* Already given warning */}
            {alreadyGiven && (
              <Grid size={12}>
                <Alert severity="warning">
                  This student has already received <strong>{item?.itemName}</strong>. Proceeding will distribute a replacement.
                </Alert>
              </Grid>
            )}

            <Grid size={6}>
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: item?.quantity }}
                helperText={`Max available: ${item?.quantity}`}
              />
            </Grid>

            <Grid size={6}>
              <Select
                label="Payment Status"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                options={paymentOptions}
                required
                allowNone={false}
              />
            </Grid>

            <Grid size={12}>
              <Input
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Optional notes..."
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Amount</Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">
                Rs. {totalAmount.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" loading={loading}>
                Distribute
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      <Toast toast={toast} onClose={() => setToast(prev => ({ ...prev, open: false }))} />
    </>
  );
}
