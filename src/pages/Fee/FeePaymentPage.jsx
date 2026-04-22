import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, People as PeopleIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common';
import { feeAPI, familyAPI } from '../../hooks/reactQueryApi';

export default function FeePaymentPage() {
  const navigate = useNavigate();
  const { id: familyId } = useParams();

  const [family, setFamily] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [paymentForm, setPaymentForm] = useState({
    paidAmount: '',
    paymentMethod: 'Cash',
    description: 'Payment received',
  });

  useEffect(() => {
    if (!familyId) return;

    familyAPI.getById(familyId)
      .then((res) => {
        if (res.data.success) setFamily(res.data.data);
      })
      .catch((err) => console.error('Error loading family:', err));
  }, [familyId]);

  const handleAddPayment = async () => {
    if (!paymentForm.paidAmount) {
      setSnackbar({ open: true, message: 'Payment amount is required', severity: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      await feeAPI.createPayment({
        familyId,
        ...paymentForm,
        paidAmount: parseFloat(paymentForm.paidAmount),
      });

      setSnackbar({ open: true, message: 'Payment added successfully!', severity: 'success' });
      setTimeout(() => navigate(`/dashboard/families/${familyId}`), 800);
    } catch (error) {
      console.error('Error adding payment:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error adding payment',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const backUrl = `/dashboard/families/${familyId}`;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(backUrl)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Add Family Payment
        </Typography>
      </Box>

      {family && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<PeopleIcon />} label="Family Billing" color="success" size="small" />
          <Typography variant="body2" color="text.secondary">
            Family: {family.familyId} - {family.primaryContact?.name} ({family.students?.length || 0} students)
          </Typography>
        </Box>
      )}

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Amount Paid"
          type="number"
          value={paymentForm.paidAmount}
          onChange={(e) => setPaymentForm({ ...paymentForm, paidAmount: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          select
          label="Payment Method"
          value={paymentForm.paymentMethod}
          onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          <MenuItem value="Cheque">Cheque</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Description"
          value={paymentForm.description}
          onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(backUrl)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleAddPayment} loading={submitting}>
            Add Payment
          </Button>
        </Box>
      </Paper>

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
