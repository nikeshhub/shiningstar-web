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
import { ArrowBack as ArrowBackIcon, People as PeopleIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '../../components/common';
import { feeAPI, studentAPI, familyAPI } from '../../services/api';

export default function FeeChargePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId, id } = useParams(); // studentId for individual, id for family

  // Detect mode based on URL pattern
  const isFamilyMode = location.pathname.includes('/families/');
  const entityId = isFamilyMode ? id : studentId;

  const [student, setStudent] = useState(null);
  const [family, setFamily] = useState(null);
  const [billNumber, setBillNumber] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [chargeForm, setChargeForm] = useState({
    description: '',
    chargeAmount: '',
    feeBreakdown: [],
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

    // Generate bill number
    feeAPI.generateBillNumber()
      .then((res) => {
        if (res.data.success) setBillNumber(res.data.data.billNumber);
      })
      .catch((err) => console.error('Error generating bill number:', err));
  }, [entityId, isFamilyMode]);

  const handleAddCharge = async () => {
    try {
      if (isFamilyMode) {
        await familyAPI.createCharge({
          familyId: entityId,
          ...chargeForm,
          billNumber,
          chargeAmount: parseFloat(chargeForm.chargeAmount),
        });
      } else {
        await feeAPI.createCharge({
          studentId: entityId,
          ...chargeForm,
          billNumber,
          chargeAmount: parseFloat(chargeForm.chargeAmount),
        });
      }

      setSnackbar({ open: true, message: 'Charge added successfully!', severity: 'success' });

      // Navigate back to appropriate page
      const backUrl = isFamilyMode
        ? `/dashboard/families/${entityId}`
        : `/dashboard/fee/ledger/${entityId}`;
      setTimeout(() => navigate(backUrl), 800);
    } catch (error) {
      console.error('Error adding charge:', error);
      setSnackbar({ open: true, message: 'Error adding charge', severity: 'error' });
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
          Add Charge {isFamilyMode && '(Family Billing)'}
        </Typography>
      </Box>

      {isFamilyMode && family && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<PeopleIcon />} label="Family Billing" color="primary" size="small" />
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
          <Button variant="outlined" onClick={() => navigate(backUrl)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleAddCharge}>
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
