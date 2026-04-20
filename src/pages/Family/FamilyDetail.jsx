import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  alpha,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  Link as LinkIcon,
  LinkOff as UnlinkIcon,
  AccountBalance as LedgerIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { familyAPI, feeAPI } from '../../services/api';
import { Toast, Dialog } from '../../components/common';
import LinkStudentDialog from './LinkStudentDialog';

/**
 * FamilyDetail — at-a-glance summary of a family.
 *
 * This page intentionally keeps a light footprint:
 *  · Primary contact info
 *  · Current outstanding balance (denormalised mirror)
 *  · Linked students
 *  · Quick actions: add charge, add payment, open ledger
 *
 * The full fee ledger (transaction history, filters, statement PDF) lives
 * on its own route at /dashboard/families/:id/ledger — opened by the
 * "View Fee Ledger" button below.
 */
export default function FamilyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [family, setFamily] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [unlinkDialog, setUnlinkDialog] = useState({ open: false, studentId: null, studentName: '' });

  useEffect(() => {
    if (id) {
      loadFamilyData();
      loadCurrentBalance();
    }
  }, [id]);

  const loadFamilyData = async () => {
    try {
      const response = await familyAPI.getById(id);
      if (response.data.success) {
        setFamily(response.data.data);
        setStudents(response.data.data.students || []);
      }
    } catch (error) {
      console.error('Error loading family:', error);
      setToast({ open: true, message: 'Error loading family', severity: 'error' });
    }
  };

  // We only need the running balance here, not the full transaction list.
  // Reusing the ledger endpoint for this is cheap enough and keeps the
  // balance computation in one place (server side).
  const loadCurrentBalance = async () => {
    try {
      const response = await feeAPI.getLedger(id);
      if (response.data.success) {
        setCurrentBalance(response.data.data.currentBalance);
      }
    } catch (error) {
      console.error('Error loading family balance:', error);
    }
  };

  const handleLinkStudents = async (studentIds) => {
    try {
      for (const studentId of studentIds) {
        await familyAPI.linkStudent({ familyId: id, studentId });
      }
      setToast({
        open: true,
        message: `${studentIds.length} student(s) linked successfully`,
        severity: 'success',
      });
      loadFamilyData();
    } catch (error) {
      console.error('Error linking students:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error linking students',
        severity: 'error',
      });
    }
  };

  const handleUnlinkStudent = (studentId, studentName) => {
    setUnlinkDialog({ open: true, studentId, studentName });
  };

  const confirmUnlink = async () => {
    try {
      await familyAPI.unlinkStudent(unlinkDialog.studentId);
      setUnlinkDialog({ open: false, studentId: null, studentName: '' });
      setToast({
        open: true,
        message: 'Student unlinked successfully',
        severity: 'success',
      });
      loadFamilyData();
    } catch (error) {
      console.error('Error unlinking student:', error);
      setUnlinkDialog({ open: false, studentId: null, studentName: '' });
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error unlinking student',
        severity: 'error',
      });
    }
  };

  const closeUnlinkDialog = () => {
    setUnlinkDialog({ open: false, studentId: null, studentName: '' });
  };

  if (!family) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/families')}
          sx={{ mr: 2 }}
        >
          Back to Families
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Family Details - {family.familyId}
        </Typography>
      </Box>

      {/* Family Information Card */}
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Primary Contact
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {family.primaryContact.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Relation:</strong> {family.primaryContact.relation}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mobile:</strong> {family.primaryContact.mobile}
              </Typography>
              {family.primaryContact.email && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {family.primaryContact.email}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Address:</strong> {family.address}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Status:</strong>{' '}
                <Chip
                  label={family.status}
                  size="small"
                  color={family.status === 'Active' ? 'success' : 'default'}
                />
              </Typography>

              {currentBalance && (
                <Box sx={{ mt: 3 }}>
                  {currentBalance.totalDue > 0 ? (
                    <>
                      <Typography variant="h4" color="error">
                        Rs. {currentBalance.totalDue}
                      </Typography>
                      <Typography color="text.secondary">Total Due (बाँकी)</Typography>
                    </>
                  ) : currentBalance.totalAdvance > 0 ? (
                    <>
                      <Typography variant="h4" color="success.main">
                        Rs. {currentBalance.totalAdvance}
                      </Typography>
                      <Typography color="text.secondary">Advance (अग्रिम)</Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="success.main">
                        Clear
                      </Typography>
                      <Typography color="text.secondary">No Dues</Typography>
                    </>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Students in Family */}
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Students in Family ({students.length})
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<LinkIcon />}
              onClick={() => setLinkDialogOpen(true)}
            >
              Link Students
            </Button>
          </Box>
          {students.length > 0 ? (
            <List>
              {students.map((student) => (
                <ListItem
                  key={student._id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: alpha('#1976d2', 0.02),
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleUnlinkStudent(student._id, student.name)}
                      title="Unlink student from family"
                    >
                      <UnlinkIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {student.name}
                        </Typography>
                        <Chip label={student.studentId} size="small" variant="outlined" />
                        <Chip
                          label={student.currentClass?.className}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No students linked to this family yet
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          size="large"
          startIcon={<LedgerIcon />}
          onClick={() => navigate(`/dashboard/families/${id}/ledger`)}
        >
          View Fee Ledger
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/dashboard/families/${id}/charge`)}
          color="error"
        >
          Add Family Charge
        </Button>
        <Button
          variant="outlined"
          startIcon={<PaymentIcon />}
          onClick={() => navigate(`/dashboard/families/${id}/payment`)}
          color="success"
        >
          Add Family Payment
        </Button>
      </Stack>

      <LinkStudentDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onLink={handleLinkStudents}
        currentFamilyId={id}
      />

      <Dialog
        variant="confirm"
        open={unlinkDialog.open}
        onClose={closeUnlinkDialog}
        onConfirm={confirmUnlink}
        title="Unlink Student"
        message={`Are you sure you want to unlink ${unlinkDialog.studentName} from this family?`}
        confirmLabel="Unlink"
        confirmColor="error"
      />

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
