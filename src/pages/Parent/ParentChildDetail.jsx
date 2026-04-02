import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DetailPage, DetailSection, DetailRow, StatusChip } from '../../components/common';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ParentChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getById(id);
      if (response.data.success) {
        const studentData = response.data.data;

        // Verify this student belongs to the logged-in parent's family
        if (studentData.family?._id !== user.profile) {
          navigate('/parent');
          return;
        }

        setStudent(studentData);
      }
    } catch (error) {
      console.error('Error loading student:', error);
      navigate('/parent');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DetailPage loading={true} />;
  }

  if (!student) {
    return (
      <Box sx={{ textAlign: 'center', pt: 10 }}>
        <Typography variant="h6" color="text.secondary">
          Student not found
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/parent')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/parent')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {student.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {student.studentId}
      </Typography>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Basic Information" />
        <Tab label="Academic Information" />
        <Tab label="Fee Summary" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <DetailSection title="Basic Information">
            <DetailRow label="Student ID" value={student.studentId} />
            <DetailRow label="Status" value={<StatusChip status={student.status} />} />
            <DetailRow label="Date of Birth" value={student.dateOfBirth?.split('T')[0] || '-'} />
            <DetailRow label="Age" value={calculateAge(student.dateOfBirth)} />
            <DetailRow label="Gender" value={student.gender} />
          </DetailSection>
        </>
      )}

      {tabValue === 1 && (
        <>
          <DetailSection title="Academic Information">
            <DetailRow label="Class" value={student.currentClass?.className || '-'} />
            <DetailRow label="Roll Number" value={student.rollNumber} />
            <DetailRow label="Admission Date" value={student.admissionDate?.split('T')[0] || '-'} />
            <DetailRow label="Academic Year" value={student.academicYear} />
            <DetailRow label="Previous School" value={student.previousSchool} />
            <DetailRow label="Remarks" value={student.remarks} colSpan={12} />
          </DetailSection>
        </>
      )}

      {tabValue === 2 && (
        <>
          <DetailSection title="Fee Summary">
            <DetailRow
              label="Total Due"
              value={
                student.feeBalance?.totalDue > 0 ? (
                  <Typography color="error" sx={{ fontWeight: 600 }}>
                    Rs. {student.feeBalance.totalDue}
                  </Typography>
                ) : (
                  'Rs. 0'
                )
              }
            />
            <DetailRow
              label="Total Advance"
              value={
                student.feeBalance?.totalAdvance > 0 ? (
                  <Typography color="success.main" sx={{ fontWeight: 600 }}>
                    Rs. {student.feeBalance.totalAdvance}
                  </Typography>
                ) : (
                  'Rs. 0'
                )
              }
            />
          </DetailSection>
        </>
      )}
    </Box>
  );
}
