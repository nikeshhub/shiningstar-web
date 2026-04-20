import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, People as PeopleIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common';
import { feeAPI, familyAPI } from '../../services/api';

export default function FeeChargePage() {
  const navigate = useNavigate();
  const { id: familyId } = useParams();

  const [family, setFamily] = useState(null);
  const [billNumber, setBillNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [chargeForm, setChargeForm] = useState({
    description: '',
    chargeAmount: '',
    feeBreakdown: [],
  });

  useEffect(() => {
    if (!familyId) return;

    familyAPI.getById(familyId)
      .then((res) => {
        if (res.data.success) setFamily(res.data.data);
      })
      .catch((err) => console.error('Error loading family:', err));

    feeAPI.generateBillNumber()
      .then((res) => {
        if (res.data.success) setBillNumber(res.data.data.billNumber);
      })
      .catch((err) => console.error('Error generating bill number:', err));
  }, [familyId]);

  const handleAddCharge = async () => {
    if (!chargeForm.description || !chargeForm.chargeAmount) {
      setSnackbar({ open: true, message: 'Description and amount are required', severity: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      await feeAPI.createCharge({
        familyId,
        ...chargeForm,
        billNumber,
        chargeAmount: parseFloat(chargeForm.chargeAmount),
      });

      setSnackbar({ open: true, message: 'Charge added successfully!', severity: 'success' });
      setTimeout(() => navigate(`/dashboard/families/${familyId}`), 800);
    } catch (error) {
      console.error('Error adding charge:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error adding charge',
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
          Add Family Charge
        </Typography>
      </Box>

      {family && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<PeopleIcon />} label="Family Billing" color="primary" size="small" />
          <Typography variant="body2" color="text.secondary">
            Family: {family.familyId} - {family.primaryContact?.name} ({family.students?.length || 0} students)
          </Typography>
        </Box>
      )}

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Bill Number"
          value={billNumber}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          value={chargeForm.description}
          onChange={(e) => setChargeForm({ ...chargeForm, description: e.target.value })}
          placeholder="e.g., मासिक शुल्क, परीक्षा शुल्क"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Total Amount"
          type="number"
          value={chargeForm.chargeAmount}
          onChange={(e) => setChargeForm({ ...chargeForm, chargeAmount: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate(backUrl)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleAddCharge} loading={submitting}>
            Add Charge
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
