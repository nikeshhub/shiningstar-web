import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Card, CardContent, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DetailPage, DetailSection, DetailRow, StatusChip } from '../../components/common';
import { attendanceAPI, progressReportAPI, studentAPI } from '../../hooks/reactQueryApi';
import { useAuth } from '../../context/AuthContext';
import { formatBSDate } from '../../utils/nepaliDate';

export default function ParentChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [progressReport, setProgressReport] = useState(null);
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
        const studentFamilyId = studentData.family?._id || studentData.family;
        if (studentFamilyId !== user.profile) {
          navigate('/parent');
          return;
        }

        setStudent(studentData);
        loadChildAcademicData(studentData);
      }
    } catch (error) {
      console.error('Error loading student:', error);
      navigate('/parent');
    } finally {
      setLoading(false);
    }
  };

  const loadChildAcademicData = async (studentData) => {
    const academicYear = studentData.academicYear;

    const [attendanceResult, progressResult] = await Promise.allSettled([
      attendanceAPI.getStudentReport({ studentId: id }),
      academicYear
        ? progressReportAPI.get({ studentId: id, academicYear })
        : Promise.resolve(null),
    ]);

    if (attendanceResult.status === 'fulfilled' && attendanceResult.value?.data?.success) {
      setAttendanceReport(attendanceResult.value.data.data);
    }

    if (progressResult.status === 'fulfilled' && progressResult.value?.data?.success) {
      setProgressReport(progressResult.value.data.data);
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
        <Tab label="Attendance" />
        <Tab label="Progress" />
        <Tab label="Fee Summary" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <DetailSection title="Basic Information">
            <DetailRow label="Student ID" value={student.studentId} />
            <DetailRow label="Status" value={<StatusChip status={student.status} />} />
            <DetailRow label="Date of Birth" value={formatBSDate(student.dateOfBirth)} />
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
            <DetailRow label="Admission Date" value={formatBSDate(student.admissionDate)} />
            <DetailRow label="Academic Year" value={student.academicYear} />
            <DetailRow label="Previous School" value={student.previousSchool} />
            <DetailRow label="Remarks" value={student.remarks} colSpan={12} />
          </DetailSection>
        </>
      )}

      {tabValue === 2 && (
        <>
          <DetailSection title="Attendance Summary">
            <DetailRow label="Total Days" value={attendanceReport?.summary?.totalDays ?? 0} />
            <DetailRow label="Present" value={attendanceReport?.summary?.present ?? 0} />
            <DetailRow label="Absent" value={attendanceReport?.summary?.absent ?? 0} />
            <DetailRow label="Late" value={attendanceReport?.summary?.late ?? 0} />
            <DetailRow label="Attendance %" value={`${attendanceReport?.summary?.attendancePercentage ?? 0}%`} />
          </DetailSection>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
            Recent Attendance
          </Typography>
          <Grid container spacing={1.5}>
            {(attendanceReport?.records || []).slice(0, 8).map((record, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`${record.date}-${index}`}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatBSDate(record.date)}
                    </Typography>
                    <Chip label={record.status} size="small" sx={{ mt: 1 }} />
                    {record.remarks && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {record.remarks}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {(attendanceReport?.records || []).length === 0 && (
              <Grid size={12}>
                <Typography color="text.secondary">No attendance records found.</Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {tabValue === 3 && (
        <>
          <DetailSection title="Progress Report">
            <DetailRow label="Academic Year" value={student.academicYear || '-'} />
            <DetailRow label="Yearly Grade" value={progressReport?.yearlyTotal?.grade || 'Not generated'} />
            <DetailRow label="Grade Point" value={progressReport?.yearlyTotal?.gradePoint ?? '-'} />
            <DetailRow
              label="Completed Terminals"
              value={`${progressReport?.terminals?.filter((terminal) => terminal.marks).length || 0} / ${progressReport?.terminals?.length || 0}`}
            />
          </DetailSection>

          <Grid container spacing={1.5} sx={{ mt: 1 }}>
            {(progressReport?.terminals || []).map((terminal) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={terminal.terminalNumber}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Terminal {terminal.terminalNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      GPA: {terminal.gpa || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Grade: {terminal.grade || 'Pending'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {!progressReport && (
              <Grid size={12}>
                <Typography color="text.secondary">Progress report is not generated yet.</Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {tabValue === 4 && (
        <>
          <DetailSection title="Family Fee Summary">
            <DetailRow
              label="Total Due (Family)"
              value={
                student.family?.familyFeeBalance?.totalDue > 0 ? (
                  <Typography color="error" sx={{ fontWeight: 600 }}>
                    Rs. {student.family.familyFeeBalance.totalDue}
                  </Typography>
                ) : (
                  'Rs. 0'
                )
              }
            />
            <DetailRow
              label="Total Advance (Family)"
              value={
                student.family?.familyFeeBalance?.totalAdvance > 0 ? (
                  <Typography color="success.main" sx={{ fontWeight: 600 }}>
                    Rs. {student.family.familyFeeBalance.totalAdvance}
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
