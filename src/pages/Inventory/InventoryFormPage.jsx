import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common';
import { useInventoryItem } from '../../hooks';
import InventoryForm from './InventoryForm';

export default function InventoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: itemData = null } = useInventoryItem(id, { enabled: isEdit });

  const handleSuccess = () => {
    navigate('/dashboard/inventory');
  };

  const handleCancel = () => {
    navigate('/dashboard/inventory');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/inventory')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {isEdit ? 'Edit Inventory Item' : 'Add New Item'}
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <InventoryForm itemData={itemData} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Paper>
    </Box>
  );
}
