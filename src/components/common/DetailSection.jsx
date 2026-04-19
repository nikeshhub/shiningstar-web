import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';

/**
 * Reusable Detail Section Components for individual entity pages
 *
 * 1. DetailSection - wraps a group of detail rows under a section title
 * 2. DetailRow - single label/value row
 * 3. DetailPage - full page layout with back button, title, and loading state
 *
 * Usage:
 *   <DetailPage
 *     title="Student Details"
 *     backTo="/dashboard/students"
 *     loading={loading}
 *     actions={<Button onClick={handleEdit}>Edit</Button>}
 *   >
 *     <DetailSection title="Basic Information">
 *       <DetailRow label="Name" value={student.name} />
 *       <DetailRow label="Age" value={student.age} />
 *       <DetailRow label="Status" value={<StatusChip status={student.status} />} />
 *     </DetailSection>
 *   </DetailPage>
 */

/**
 * Single label/value detail row
 */
export const DetailRow = ({ label, value, colSpan = 6 }) => {
  return (
    <Grid size={{ xs: 12, sm: colSpan }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.3, fontWeight: 400 }}>
        {value || '-'}
      </Typography>
    </Grid>
  );
};

/**
 * Section with a title wrapping multiple DetailRows
 */
export const DetailSection = ({ title, children }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {children}
      </Grid>
    </Box>
  );
};

/**
 * Full detail page layout
 */
export const DetailPage = ({ title, backTo, loading, actions, children }) => {
  const navigate = backTo ? require('react-router-dom').useNavigate() : null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {backTo && (
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
              onClick={() => navigate(backTo)}
            >
              ← Back
            </Typography>
          )}
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {actions}
          </Box>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        {children}
      </Paper>
    </Box>
  );
};

export default DetailSection;
