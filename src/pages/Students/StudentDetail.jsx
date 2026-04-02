import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DetailPage, DetailSection, DetailRow, StatusChip } from '../../components/common';
import { studentAPI } from '../../services/api';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculate age from date of birth
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
        setStudent(response.data.data);
      }
    } catch (error) {
      console.error('Error loading student:', error);
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
        <Typography variant="h6" color="text.secondary">Student not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/dashboard/students')}>
          Back to Students
        </Button>
      </Box>
    );
  }

  return (
    <DetailPage
      title={student.name}
      backTo="/dashboard/students"
      loading={false}
      actions={
        <Button startIcon={<EditIcon />} onClick={() => navigate(`/dashboard/students/edit/${id}`)}>
          Edit Student
        </Button>
      }
    >
      {/* Basic Info */}
      <DetailSection title="Basic Information">
        <DetailRow label="Student ID" value={student.studentId} />
        <DetailRow label="Status" value={<StatusChip status={student.status} />} />
        <DetailRow label="Date of Birth" value={student.dateOfBirth?.split('T')[0] || '-'} />
        <DetailRow label="Age" value={calculateAge(student.dateOfBirth)} />
        <DetailRow label="Gender" value={student.gender} />
      </DetailSection>

      {/* Family Info */}
      {student.family && (
        <DetailSection title="Family Information">
          <DetailRow label="Family ID" value={student.family.familyId} />
          <DetailRow label="Primary Contact Name" value={student.family.primaryContact?.name} />
          <DetailRow label="Relation" value={student.family.primaryContact?.relation} />
          <DetailRow label="Phone (Primary)" value={student.family.primaryContact?.mobile} />
          <DetailRow label="Email (Primary)" value={student.family.primaryContact?.email} />
          <DetailRow label="Secondary Contact Name" value={student.family.secondaryContact?.name} />
          <DetailRow label="Relation" value={student.family.secondaryContact?.relation} />
          <DetailRow label="Phone (Secondary)" value={student.family.secondaryContact?.mobile} />
          <DetailRow label="Email (Secondary)" value={student.family.secondaryContact?.email} />
          <DetailRow label="Address" value={student.family.address} colSpan={12} />
          <DetailRow
            label="View Family Details"
            value={
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/dashboard/families/${student.family._id}`)}
              >
                View Full Family
              </Button>
            }
          />
        </DetailSection>
      )}

      {/* Academic Info */}
      <DetailSection title="Academic Information">
        <DetailRow label="Class" value={student.currentClass?.className || '-'} />
        <DetailRow label="Roll Number" value={student.rollNumber} />
        <DetailRow label="Admission Date" value={student.admissionDate?.split('T')[0] || '-'} />
        <DetailRow label="Academic Year" value={student.academicYear} />
        <DetailRow label="Previous School" value={student.previousSchool} />
        <DetailRow label="Remarks" value={student.remarks} colSpan={12} />
      </DetailSection>

      {/* Fee Balance */}
      <DetailSection title="Fee Summary">
        <DetailRow
          label="Total Due"
          value={
            student.feeBalance?.totalDue > 0 ? (
              <Typography color="error" sx={{ fontWeight: 600 }}>
                Rs. {student.feeBalance.totalDue}
              </Typography>
            ) : 'Rs. 0'
          }
        />
        <DetailRow
          label="Total Advance"
          value={
            student.feeBalance?.totalAdvance > 0 ? (
              <Typography color="success.main" sx={{ fontWeight: 600 }}>
                Rs. {student.feeBalance.totalAdvance}
              </Typography>
            ) : 'Rs. 0'
          }
        />
      </DetailSection>
    </DetailPage>
  );
}
