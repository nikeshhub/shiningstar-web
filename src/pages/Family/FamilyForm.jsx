import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  ContactPhone as ContactIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Toast, Select } from '../../components/common';
import { familyAPI } from '../../services/api';

const RELATION_OPTIONS = ['Father', 'Mother', 'Guardian'];
const BILLING_TYPE_OPTIONS = ['Individual', 'Family'];
const STATUS_OPTIONS = ['Active', 'Inactive'];

export default function FamilyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    primaryContact: {
      name: '',
      relation: 'Father',
      citizenship: '',
      mobile: '',
      alternateMobile: '',
      email: '',
    },
    secondaryContact: {
      name: '',
      relation: 'Mother',
      citizenship: '',
      mobile: '',
      email: '',
    },
    address: '',
    billingType: 'Family',
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (isEdit) {
      loadFamily();
    }
  }, [id]);

  const loadFamily = async () => {
    try {
      const response = await familyAPI.getById(id);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading family:', error);
      setToast({ open: true, message: 'Error loading family', severity: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrimaryContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      primaryContact: { ...prev.primaryContact, [name]: value },
    }));
  };

  const handleSecondaryContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      secondaryContact: { ...prev.secondaryContact, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.primaryContact.name || !formData.primaryContact.mobile || !formData.primaryContact.citizenship) {
      setToast({ open: true, message: 'Primary contact name, citizenship, and mobile are required', severity: 'error' });
      return;
    }

    if (!formData.address) {
      setToast({ open: true, message: 'Address is required', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = isEdit
        ? await familyAPI.update(id, formData)
        : await familyAPI.create(formData);

      if (response.data.success) {
        setToast({
          open: true,
          message: `Family ${isEdit ? 'updated' : 'created'} successfully!`,
          severity: 'success',
        });
        setTimeout(() => navigate('/dashboard/families'), 1500);
      }
    } catch (error) {
      console.error('Error saving family:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || `Error ${isEdit ? 'updating' : 'creating'} family`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/families')}
          sx={{ mb: 2, color: 'text.secondary', '&:hover': { bgcolor: alpha('#1976d2', 0.05) } }}
        >
          Back to Families
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {isEdit ? 'Edit Family' : 'Create New Family'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? 'Update family information' : 'Add a new family for sibling grouping'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Family Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {isEdit && (
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Family ID"
                    name="familyId"
                    value={formData.familyId || ''}
                    disabled
                    helperText="Auto-generated"
                  />
                </Grid>
              )}
              <Grid item xs={12} md={isEdit ? 4 : 6}>
                <Select
                  label="Billing Type *"
                  name="billingType"
                  value={formData.billingType}
                  onChange={handleChange}
                  options={BILLING_TYPE_OPTIONS}
                  required
                  allowNone={false}
                  helperText="Family billing combines all students"
                />
              </Grid>
              {isEdit && (
                <Grid item xs={12} md={4}>
                  <Select
                    label="Status *"
                    name="status"
                    value={formData.status || 'Active'}
                    onChange={handleChange}
                    options={STATUS_OPTIONS}
                    required
                    allowNone={false}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <ContactIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Primary Contact
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name *"
                  name="name"
                  value={formData.primaryContact.name}
                  onChange={handlePrimaryContactChange}
                  required
                  placeholder="e.g., Ram Prasad Sharma"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Select
                  label="Relation *"
                  name="relation"
                  value={formData.primaryContact.relation}
                  onChange={handlePrimaryContactChange}
                  options={RELATION_OPTIONS}
                  required
                  allowNone={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Citizenship *"
                  name="citizenship"
                  value={formData.primaryContact.citizenship}
                  onChange={handlePrimaryContactChange}
                  required
                  placeholder="e.g., Nepali"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number *"
                  name="mobile"
                  value={formData.primaryContact.mobile}
                  onChange={handlePrimaryContactChange}
                  required
                  placeholder="e.g., 9841234567"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Alternate Mobile"
                  name="alternateMobile"
                  value={formData.primaryContact.alternateMobile}
                  onChange={handlePrimaryContactChange}
                  placeholder="e.g., 9801234567"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.primaryContact.email}
                  onChange={handlePrimaryContactChange}
                  placeholder="e.g., parent@example.com"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Secondary Contact */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ContactIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Secondary Contact
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Optional - for additional parent/guardian
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.secondaryContact.name}
                  onChange={handleSecondaryContactChange}
                  placeholder="e.g., Sita Devi Sharma"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Select
                  label="Relation"
                  name="relation"
                  value={formData.secondaryContact.relation}
                  onChange={handleSecondaryContactChange}
                  options={RELATION_OPTIONS}
                  allowNone={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Citizenship"
                  name="citizenship"
                  value={formData.secondaryContact.citizenship}
                  onChange={handleSecondaryContactChange}
                  placeholder="e.g., Nepali"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={formData.secondaryContact.mobile}
                  onChange={handleSecondaryContactChange}
                  placeholder="e.g., 9851234567"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.secondaryContact.email}
                  onChange={handleSecondaryContactChange}
                  placeholder="e.g., parent2@example.com"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Address & Remarks */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <HomeIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Address & Remarks
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  multiline
                  rows={2}
                  placeholder="e.g., Yangwarak-4, Tharpu, Panchthar"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  placeholder="Any additional notes about the family"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            p: 3,
            bgcolor: alpha('#f5f5f5', 0.5),
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/families')}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={loading} sx={{ minWidth: 160 }}>
            {isEdit ? 'Update Family' : 'Create Family'}
          </Button>
        </Box>
      </form>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
