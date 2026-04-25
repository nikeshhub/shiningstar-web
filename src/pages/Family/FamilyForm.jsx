import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  ContactPhone as ContactIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Close as CloseIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Toast, Select } from '../../components/common';
import { familyAPI, studentAPI, classAPI } from '../../hooks/reactQueryApi';
import { todayBSDate, currentBSYear } from '../../utils/nepaliDate';

const RELATION_OPTIONS = ['Father', 'Mother', 'Guardian'];
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
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [classes, setClasses] = useState([]);
  const [createStudentOpen, setCreateStudentOpen] = useState(false);
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [createdFamily, setCreatedFamily] = useState(null);
  const [addedStudents, setAddedStudents] = useState([]);
  const initStudentForm = { name: '', gender: '', dateOfBirth: '', currentClass: '', admissionDate: todayBSDate(), academicYear: String(currentBSYear()) };
  const [studentForm, setStudentForm] = useState(initStudentForm);

  useEffect(() => {
    if (isEdit) {
      loadFamily();
    }
    classAPI.getAll({ status: 'Active' })
      .then(res => { if (res.data.success) setClasses(res.data.data); })
      .catch(console.error);
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

  const handleCreateStudent = async () => {
    const { name, gender, dateOfBirth, currentClass } = studentForm;
    if (!name || !gender || !dateOfBirth || !currentClass) {
      setToast({ open: true, message: 'Student name, gender, date of birth, and class are required', severity: 'error' });
      return;
    }
    const familyId = isEdit ? id : createdFamily?._id;
    try {
      setCreatingStudent(true);
      const response = await studentAPI.create({ ...studentForm, family: familyId });
      const newStudent = response.data.data;
      setToast({ open: true, message: 'Student added successfully!', severity: 'success' });
      setCreateStudentOpen(false);
      setStudentForm(initStudentForm);
      if (isEdit) {
        loadFamily();
      } else {
        const classLabel = classes.find(c => c._id === studentForm.currentClass)?.className || '';
        setAddedStudents(prev => [...prev, { _id: newStudent._id, studentId: newStudent.studentId, name: newStudent.name, className: classLabel }]);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Error creating student',
        severity: 'error',
      });
    } finally {
      setCreatingStudent(false);
    }
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
        if (isEdit) {
          setToast({ open: true, message: 'Family updated successfully!', severity: 'success' });
          setTimeout(() => navigate('/dashboard/families'), 1500);
        } else {
          setCreatedFamily(response.data.data);
        }
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

  // Post-creation view: family created, now optionally add students
  if (createdFamily) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Family Created
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {createdFamily.familyId} · {createdFamily.primaryContact.name} · {createdFamily.primaryContact.mobile}
          </Typography>
        </Box>

        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Add Students
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => { setStudentForm(initStudentForm); setCreateStudentOpen(true); }}
              >
                Add Student
              </Button>
            </Box>
            {addedStudents.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <MuiTable size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Student ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Class</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {addedStudents.map(s => (
                      <TableRow key={s._id}>
                        <TableCell>{s.studentId}</TableCell>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.className}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No students added yet. You can add them now or later from the family edit page.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', p: 3, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 2, mb: 4 }}>
          <Button variant="contained" onClick={() => navigate('/dashboard/families')} sx={{ minWidth: 120 }}>
            Done
          </Button>
        </Box>

        {/* Add Student Dialog (create mode) */}
        <Dialog open={createStudentOpen} onClose={() => setCreateStudentOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Add Student to Family
              <IconButton size="small" onClick={() => setCreateStudentOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Student Name" required
                  value={studentForm.name}
                  onChange={e => setStudentForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Sita Sharma"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Select label="Gender" required allowNone={false}
                  value={studentForm.gender}
                  onChange={e => setStudentForm(p => ({ ...p, gender: e.target.value }))}
                  options={['Male', 'Female', 'Other']}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Date of Birth (BS)" required
                  value={studentForm.dateOfBirth}
                  onChange={e => setStudentForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                  placeholder="e.g., 2060-01-15"
                  helperText="Enter in BS format: YYYY-MM-DD"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Select label="Class" required allowNone={false}
                  value={studentForm.currentClass}
                  onChange={e => setStudentForm(p => ({ ...p, currentClass: e.target.value }))}
                  options={classes.map(c => ({ label: c.className, value: c._id }))}
                  placeholder="Select class"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Admission Date (BS)" required
                  value={studentForm.admissionDate}
                  onChange={e => setStudentForm(p => ({ ...p, admissionDate: e.target.value }))}
                  helperText="Enter in BS format: YYYY-MM-DD"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Academic Year" required
                  value={studentForm.academicYear}
                  onChange={e => setStudentForm(p => ({ ...p, academicYear: e.target.value }))}
                  placeholder="e.g., 2083"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button variant="outlined" onClick={() => setCreateStudentOpen(false)} disabled={creatingStudent}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateStudent} loading={creatingStudent}>
              Add Student
            </Button>
          </DialogActions>
        </Dialog>

        <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
      </Box>
    );
  }

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
            {isEdit ? (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Family ID"
                    name="familyId"
                    value={formData.familyId || ''}
                    disabled
                    helperText="Auto-generated"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Select
                    label="Status"
                    name="status"
                    value={formData.status || 'Active'}
                    onChange={handleChange}
                    options={STATUS_OPTIONS}
                    required
                    allowNone={false}
                  />
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Family ID will be auto-generated on creation. Fees are billed at the family level and shared across all linked students.
              </Typography>
            )}
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
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.primaryContact.name}
                  onChange={handlePrimaryContactChange}
                  required
                  placeholder="e.g., Ram Prasad Sharma"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Select
                  label="Relation"
                  name="relation"
                  value={formData.primaryContact.relation}
                  onChange={handlePrimaryContactChange}
                  options={RELATION_OPTIONS}
                  required
                  allowNone={false}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Citizenship"
                  name="citizenship"
                  value={formData.primaryContact.citizenship}
                  onChange={handlePrimaryContactChange}
                  required
                  placeholder="e.g., Nepali"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={formData.primaryContact.mobile}
                  onChange={handlePrimaryContactChange}
                  required
                  placeholder="e.g., 9841234567"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Alternate Mobile"
                  name="alternateMobile"
                  value={formData.primaryContact.alternateMobile}
                  onChange={handlePrimaryContactChange}
                  placeholder="e.g., 9801234567"
                />
              </Grid>
              <Grid size={12}>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.secondaryContact.name}
                  onChange={handleSecondaryContactChange}
                  placeholder="e.g., Sita Devi Sharma"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Select
                  label="Relation"
                  name="relation"
                  value={formData.secondaryContact.relation}
                  onChange={handleSecondaryContactChange}
                  options={RELATION_OPTIONS}
                  allowNone={true}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Citizenship"
                  name="citizenship"
                  value={formData.secondaryContact.citizenship}
                  onChange={handleSecondaryContactChange}
                  placeholder="e.g., Nepali"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={formData.secondaryContact.mobile}
                  onChange={handleSecondaryContactChange}
                  placeholder="e.g., 9851234567"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  multiline
                  rows={2}
                  placeholder="e.g., Yangwarak-4, Tharpu, Panchthar"
                />
              </Grid>
              <Grid size={12}>
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
