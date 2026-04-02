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
import { ArrowBack as ArrowBackIcon, People as PeopleIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '../../components/common';
import { feeAPI, studentAPI, familyAPI } from '../../services/api';

export default function FeePaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId, id } = useParams(); // studentId for individual, id for family

  // Detect mode based on URL pattern
  const isFamilyMode = location.pathname.includes('/families/');
  const entityId = isFamilyMode ? id : studentId;

  const [student, setStudent] = useState(null);
  const [family, setFamily] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [paymentForm, setPaymentForm] = useState({
    paidAmount: '',
    paymentMethod: 'Cash',
    description: 'Payment received',
  });

  useEffect(() => {
    if (!entityId) return;

    // Load entity data (student or family)
    if (isFamilyMode) {
      familyAPI.getById(entityId)
        .then((res) => {
          if (res.data.success) setFamily(res.data.data);
        })
        .catch((err) => console.error('Error loading family:', err));
    } else {
      studentAPI.getById(entityId)
        .then((res) => {
          if (res.data.success) setStudent(res.data.data);
        })
        .catch((err) => console.error('Error loading student:', err));
    }
  }, [entityId, isFamilyMode]);

  const handleAddPayment = async () => {
    try {
      if (isFamilyMode) {
        await familyAPI.createPayment({
          familyId: entityId,
          ...paymentForm,
          paidAmount: parseFloat(paymentForm.paidAmount),
        });
      } else {
        await feeAPI.createPayment({
          studentId: entityId,
          ...paymentForm,
          paidAmount: parseFloat(paymentForm.paidAmount),
        });
      }

      setSnackbar({ open: true, message: 'Payment added successfully!', severity: 'success' });

      // Navigate back to appropriate page
      const backUrl = isFamilyMode
        ? `/dashboard/families/${entityId}`
        : `/dashboard/fee/ledger/${entityId}`;
      setTimeout(() => navigate(backUrl), 800);
    } catch (error) {
      console.error('Error adding payment:', error);
      setSnackbar({ open: true, message: 'Error adding payment', severity: 'error' });
    }
  };

  const backUrl = isFamilyMode
    ? `/dashboard/families/${entityId}`
    : `/dashboard/fee/ledger/${entityId}`;

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
          Add Payment {isFamilyMode && '(Family Billing)'}
        </Typography>
      </Box>

      {isFamilyMode && family && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<PeopleIcon />} label="Family Billing" color="success" size="small" />
          <Typography variant="body2" color="text.secondary">
            Family: {family.familyId} - {family.primaryContact.name} ({family.students?.length || 0} students)
          </Typography>
        </Box>
      )}

      {!isFamilyMode && student && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<PersonIcon />} label="Individual Billing" color="default" size="small" />
          <Typography variant="body2" color="text.secondary">
            Student: {student.name} ({student.studentId})
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
          <Button variant="outlined" onClick={() => navigate(backUrl)}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleAddPayment}>
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
