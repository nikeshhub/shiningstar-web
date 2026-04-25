import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  CameraAlt as CameraIcon,
  Description as DocumentIcon,
  UploadFile as UploadIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, FormField, FormSelect, FormAutocompleteSelect, Toast, Select } from '../../components/common';
import { studentAPI, classAPI, familyAPI } from '../../hooks/reactQueryApi';
import { adToBSDate, todayBSDate, currentBSYear } from '../../utils/nepaliDate';
import { resolveAssetUrl } from '../../config/env';

// ─── Validation Schema ────────────────────────────────────────────────────────
const studentSchema = z.object({
  name: z.string().min(1, 'Student name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  family: z.string().min(1, 'Family is required'),
  currentClass: z.string().min(1, 'Class is required'),
  rollNumber: z.preprocess(
    val => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ),
  admissionDate: z.string().min(1, 'Admission date is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  previousSchool: z.string().optional().default(''),
  birthCertificate: z.string().optional().default(''),
  photo: z.string().optional().default(''),
  status: z.string().default('Active'),
  remarks: z.string().optional().default(''),
});

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Transferred', value: 'Transferred' },
  { label: 'Graduated', value: 'Graduated' },
];

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [classes, setClasses] = useState([]);
  const [families, setFamilies] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [birthCertificateFile, setBirthCertificateFile] = useState(null);
  const [birthCertificatePreview, setBirthCertificatePreview] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const initFamilyForm = {
    primaryContact: { name: '', relation: 'Father', citizenship: '', mobile: '', alternateMobile: '', email: '' },
    address: '',
    remarks: '',
  };
  const [createFamilyOpen, setCreateFamilyOpen] = useState(false);
  const [familyForm, setFamilyForm] = useState(initFamilyForm);
  const [creatingFamily, setCreatingFamily] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      dateOfBirth: '',
      gender: '',
      family: '',
      currentClass: '',
      rollNumber: undefined,
      admissionDate: todayBSDate(),
      academicYear: String(currentBSYear()),
      previousSchool: '',
      birthCertificate: '',
      photo: '',
      status: 'Active',
      remarks: '',
    },
  });

  useEffect(() => {
    classAPI.getAll({ status: 'Active' })
      .then(res => { if (res.data.success) setClasses(res.data.data); })
      .catch(err => console.error(err));

    familyAPI.getAll({ status: 'Active' })
      .then(res => { if (res.data.success) setFamilies(res.data.data); })
      .catch(err => console.error(err));

    if (isEdit) {
      studentAPI.getById(id).then(res => {
        if (res.data.success) {
          const s = res.data.data;
          reset({
            name: s.name || '',
            dateOfBirth: adToBSDate(s.dateOfBirth),
            gender: s.gender || '',
            family: s.family?._id || s.family || '',
            currentClass: s.currentClass?._id || s.currentClass || '',
            rollNumber: s.rollNumber ?? undefined,
            admissionDate: adToBSDate(s.admissionDate),
            academicYear: s.academicYear || String(currentBSYear()),
            previousSchool: s.previousSchool || '',
            birthCertificate: s.birthCertificate || '',
            photo: s.photo || '',
            status: s.status || 'Active',
            remarks: s.remarks || '',
          });
          if (s.photo) {
            setPhotoPreview(resolveAssetUrl(s.photo));
          }
          if (s.birthCertificate) {
            setBirthCertificatePreview(resolveAssetUrl(s.birthCertificate));
          }
        }
      }).catch(err => console.error(err));
    }
  }, [id, isEdit, reset]);

  const classOptions = classes.map(c => ({ label: c.className, value: c._id }));
  const familyOptions = families.map(f => ({
    label: `${f.familyId} - ${f.primaryContact.name}`,
    value: f._id
  }));

  const handleCreateFamily = async () => {
    const { name, citizenship, mobile } = familyForm.primaryContact;
    if (!name || !citizenship || !mobile || !familyForm.address) {
      setToast({ open: true, message: 'Primary contact name, citizenship, mobile, and address are required', severity: 'error' });
      return;
    }
    try {
      setCreatingFamily(true);
      const response = await familyAPI.create(familyForm);
      const newFamily = response.data.data;
      setFamilies(prev => [newFamily, ...prev]);
      setValue('family', newFamily._id);
      setCreateFamilyOpen(false);
      setFamilyForm(initFamilyForm);
      setToast({ open: true, message: `Family ${newFamily.familyId} created and selected!`, severity: 'success' });
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Error creating family',
        severity: 'error',
      });
    } finally {
      setCreatingFamily(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all form fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== '' && key !== 'photo' && key !== 'birthCertificate') {
          formData.append(key, data[key]);
        }
      });

      // Append files
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      if (birthCertificateFile) {
        formData.append('birthCertificate', birthCertificateFile);
      }

      if (isEdit) {
        await studentAPI.update(id, formData);
        setToast({ open: true, message: 'Student updated successfully!', severity: 'success' });
      } else {
        // Remove status for new students
        formData.delete('status');
        await studentAPI.create(formData);
        setToast({ open: true, message: 'Student created successfully!', severity: 'success' });
      }
      setTimeout(() => navigate('/dashboard/students'), 1500);
    } catch (error) {
      console.error('Error saving student:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error saving student',
        severity: 'error',
      });
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setToast({ open: true, message: 'Error accessing camera', severity: 'error' });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Convert canvas to blob and then to File
      canvas.toBlob((blob) => {
        const file = new File([blob], `student-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.95);

      stopCamera();
    }
  };

  const handleBirthCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBirthCertificateFile(file);
      setBirthCertificatePreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Cleanup camera on unmount
  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/students')}
          sx={{ mb: 2, color: 'text.secondary', '&:hover': { bgcolor: alpha('#1976d2', 0.05) } }}
        >
          Back to Students
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {isEdit ? 'Edit Student' : 'Add New Student'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? 'Update student information and details' : 'Register a new student in the school'}
        </Typography>
      </Box>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Basic Information
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormField
                  control={control}
                  name="name"
                  label="Student Name"
                  required
                  placeholder="e.g., John Doe"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormField
                  control={control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  required
                  helperText="Student's birth date"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormSelect
                  control={control}
                  name="gender"
                  label="Gender"
                  options={GENDER_OPTIONS}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <FormAutocompleteSelect
                      control={control}
                      name="family"
                      label="Family"
                      options={familyOptions}
                      required
                      placeholder="Type to search family..."
                      helperText="Parent/Guardian contact information"
                    />
                  </Box>
                  <Tooltip title="Create new family">
                    <IconButton color="primary" onClick={() => setCreateFamilyOpen(true)} sx={{ mt: 1 }}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>

              {isEdit && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormSelect
                    control={control}
                    name="status"
                    label="Status"
                    options={STATUS_OPTIONS}
                    renderValue={(selected) => (
                      <Chip
                        label={selected}
                        size="small"
                        color={selected === 'Active' ? 'success' : selected === 'Graduated' ? 'info' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SchoolIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Academic Information
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Class assignment and admission details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormSelect
                  control={control}
                  name="currentClass"
                  label="Class"
                  options={classOptions}
                  required
                  placeholder="Select student's class"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="rollNumber"
                  label="Roll Number"
                  type="number"
                  placeholder="e.g., 15"
                  helperText="Class roll number (optional)"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="admissionDate"
                  label="Admission Date"
                  type="date"
                  required
                  helperText="Date of admission to school"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  control={control}
                  name="academicYear"
                  label="Academic Year"
                  required
                  placeholder="e.g., 2083"
                  helperText="Nepali academic year"
                />
              </Grid>

              <Grid size={12}>
                <FormField
                  control={control}
                  name="previousSchool"
                  label="Previous School (Optional)"
                  placeholder="Name of previous school if transferred"
                />
              </Grid>

              <Grid size={12}>
                <FormField
                  control={control}
                  name="remarks"
                  label="Remarks"
                  multiline
                  rows={3}
                  placeholder="Any additional notes or comments about the student"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Documents & Photo */}
        <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <DocumentIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Documents & Photo
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {/* Birth Certificate Upload */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Birth Certificate
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                  >
                    {birthCertificatePreview ? 'Change Birth Certificate' : 'Upload Birth Certificate'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleBirthCertificateChange}
                    />
                  </Button>
                  {birthCertificatePreview && (
                    <Box sx={{ mt: 2, position: 'relative', display: 'inline-block', width: '100%', textAlign: 'center' }}>
                      <Box
                        component="img"
                        src={birthCertificatePreview}
                        alt="Birth Certificate"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: 2,
                          border: '2px solid #e0e0e0',
                          objectFit: 'contain',
                          display: 'block',
                          mx: 'auto',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => { setBirthCertificatePreview(null); setBirthCertificateFile(null); }}
                        sx={{
                          position: 'absolute', top: 4, right: 4,
                          bgcolor: 'rgba(0,0,0,0.55)', color: '#fff',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Student Photo */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Student Photo
                  </Typography>
                  {!showCamera ? (
                    <>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<UploadIcon />}
                          sx={{ flex: 1 }}
                        >
                          Upload Photo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handlePhotoUpload}
                          />
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CameraIcon />}
                          onClick={startCamera}
                          sx={{ flex: 1 }}
                        >
                          Take Photo
                        </Button>
                      </Box>
                      {photoPreview && (
                        <Box sx={{ mt: 2, position: 'relative', display: 'inline-block', width: '100%', textAlign: 'center' }}>
                          <Box
                            component="img"
                            src={photoPreview}
                            alt="Student"
                            sx={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: 2,
                              border: '2px solid #e0e0e0',
                              objectFit: 'contain',
                              display: 'block',
                              mx: 'auto',
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                            sx={{
                              position: 'absolute', top: 4, right: 4,
                              bgcolor: 'rgba(0,0,0,0.55)', color: '#fff',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          style={{
                            width: '100%',
                            maxWidth: '300px',
                            borderRadius: '8px',
                            border: '2px solid #1976d2',
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button variant="contained" onClick={capturePhoto}>
                          Take Photo
                        </Button>
                        <Button variant="outlined" onClick={stopCamera}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          p: 3,
          bgcolor: alpha('#f5f5f5', 0.5),
          borderRadius: 2,
          mb: 4,
        }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/students')}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ minWidth: 160 }}
          >
            {isEdit ? 'Update Student' : 'Add Student'}
          </Button>
        </Box>
      </Box>

      {/* Create Family Dialog */}
      <Dialog open={createFamilyOpen} onClose={() => setCreateFamilyOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Create New Family
            <IconButton size="small" onClick={() => setCreateFamilyOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Primary Contact
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Name" required
                value={familyForm.primaryContact.name}
                onChange={e => setFamilyForm(p => ({ ...p, primaryContact: { ...p.primaryContact, name: e.target.value } }))}
                placeholder="e.g., Ram Prasad Sharma"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Select
                label="Relation" required allowNone={false}
                value={familyForm.primaryContact.relation}
                onChange={e => setFamilyForm(p => ({ ...p, primaryContact: { ...p.primaryContact, relation: e.target.value } }))}
                options={['Father', 'Mother', 'Guardian']}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Citizenship" required
                value={familyForm.primaryContact.citizenship}
                onChange={e => setFamilyForm(p => ({ ...p, primaryContact: { ...p.primaryContact, citizenship: e.target.value } }))}
                placeholder="e.g., Nepali"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Mobile Number" required
                value={familyForm.primaryContact.mobile}
                onChange={e => setFamilyForm(p => ({ ...p, primaryContact: { ...p.primaryContact, mobile: e.target.value } }))}
                placeholder="e.g., 9841234567"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Alternate Mobile"
                value={familyForm.primaryContact.alternateMobile}
                onChange={e => setFamilyForm(p => ({ ...p, primaryContact: { ...p.primaryContact, alternateMobile: e.target.value } }))}
                placeholder="e.g., 9801234567"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Email" type="email"
                value={familyForm.primaryContact.email}
                onChange={e => setFamilyForm(p => ({ ...p, primaryContact: { ...p.primaryContact, email: e.target.value } }))}
                placeholder="e.g., parent@example.com"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth label="Address" required multiline rows={2}
                value={familyForm.address}
                onChange={e => setFamilyForm(p => ({ ...p, address: e.target.value }))}
                placeholder="e.g., Yangwarak-4, Tharpu, Panchthar"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth label="Remarks" multiline rows={2}
                value={familyForm.remarks}
                onChange={e => setFamilyForm(p => ({ ...p, remarks: e.target.value }))}
                placeholder="Any additional notes about the family"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setCreateFamilyOpen(false)} disabled={creatingFamily}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreateFamily} loading={creatingFamily}>
            Create Family
          </Button>
        </DialogActions>
      </Dialog>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
