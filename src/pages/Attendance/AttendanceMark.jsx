import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Chip,
  Select as MuiSelect,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { classAPI, attendanceAPI, studentAPI } from '../../services/api';
import { Toast, Select, BSDatePicker } from '../../components/common';
import { todayBSDate } from '../../utils/nepaliDate';
import { useAuth } from '../../context/AuthContext';

export default function AttendanceMark() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher';
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(todayBSDate());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadClasses();
  }, [isTeacher]);

  useEffect(() => {
    if (selectedClass && date) {
      loadStudentsAndAttendance();
    }
  }, [selectedClass, date]);

  const loadClasses = async () => {
    try {
      const response = await classAPI.getAll({ status: 'Active' });
      if (response.data.success) {
        const classList = response.data.data || [];
        setClasses(classList);

        if (isTeacher) {
          setSelectedClass(classList[0]?._id || '');
        }
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadStudentsAndAttendance = async () => {
    try {
      setLoading(true);
      setStudents([]);
      setAttendance({});
      setExistingAttendance(null);

      // Load students
      const studentsResponse = await studentAPI.getAll({
        class: selectedClass,
        status: 'Active',
      });

      if (!studentsResponse.data.success) {
        setStudents([]);
        setAttendance({});
        return;
      }

      const studentsList = studentsResponse.data.data || [];
      setStudents(studentsList);

      // Check for existing attendance
      let existingData = null;
      try {
        const attendanceResponse = await attendanceAPI.getByDate({
          classId: selectedClass,
          date: date,
        });
        if (attendanceResponse.data.success && attendanceResponse.data.data) {
          setExistingAttendance(attendanceResponse.data.data);
          existingData = attendanceResponse.data.data;
        }
      } catch (error) {
        console.error('Error checking attendance:', error);
      }

      // Initialize attendance based on existing data or default to Present
      const attendanceData = {};
      studentsList.forEach((student) => {
        if (existingData) {
          // Find existing record for this student
          const existingRecord = existingData.students.find(
            (record) => {
              const studentId = record.student._id || record.student;
              return studentId.toString() === student._id.toString();
            }
          );

          if (existingRecord) {
            attendanceData[student._id] = {
              student: student._id,
              status: existingRecord.status,
              remarks: existingRecord.remarks || '',
            };
          } else {
            // New student not in existing attendance
            attendanceData[student._id] = {
              student: student._id,
              status: 'Present',
              remarks: '',
            };
          }
        } else {
          // No existing attendance, default to Present
          attendanceData[student._id] = {
            student: student._id,
            status: 'Present',
            remarks: '',
          };
        }
      });

      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
      setAttendance({});
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance({
      ...attendance,
      [studentId]: {
        ...attendance[studentId],
        status,
      },
    });
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendance({
      ...attendance,
      [studentId]: {
        ...attendance[studentId],
        remarks,
      },
    });
  };

  const handleSubmit = async () => {
    if (!selectedClass || students.length === 0) {
      setToast({
        open: true,
        message: isTeacher ? 'No class teacher assignment with active students found' : 'Please select a class with students to mark attendance',
        severity: 'warning',
      });
      return;
    }

    try {
      const attendanceData = {
        classId: selectedClass,
        date: date,
        students: Object.values(attendance),
        academicYear: '2081-2082',
      };

      await attendanceAPI.mark(attendanceData);

      setToast({
        open: true,
        message: 'Attendance saved successfully!',
        severity: 'success',
      });

      // Navigate to attendance list with the date and class set
      setTimeout(() => {
        navigate(`/dashboard/attendance?tab=daily&class=${selectedClass}&date=${date}`);
      }, 1500);
    } catch (error) {
      console.error('Error saving attendance:', error);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error saving attendance',
        severity: 'error',
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Present: 'success',
      Absent: 'error',
      Late: 'warning',
      Excused: 'info',
    };
    return colors[status] || 'default';
  };

  const calculateStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    if (attendance && Object.keys(attendance).length > 0) {
      Object.values(attendance).forEach((record) => {
        if (record && record.status) {
          stats[record.status.toLowerCase()]++;
        }
      });
    }

    return stats;
  };

  const stats = calculateStats();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Mark Attendance (हाजिरी लिनुहोस्)
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {isTeacher ? (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  My Class
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {classes[0]?.className || 'No class teacher assignment found'}
                </Typography>
              </Box>
            </Grid>
          ) : (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Select
                label="Select Class"
                name="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={classes}
                placeholder="Select Class"
                allowNone={true}
                noneLabel="Select Class"
              />
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <BSDatePicker
              label="Date (BS)"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
        </Grid>

        {existingAttendance && (
          <Typography color="info.main" sx={{ mt: 2 }}>
            Note: Attendance already marked for this date. You can update it.
          </Typography>
        )}
      </Paper>

      {students.length > 0 && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid size={3}>
                <Typography variant="h6" color="success.main">
                  Present: {stats.present}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="h6" color="error.main">
                  Absent: {stats.absent}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="h6" color="warning.main">
                  Late: {stats.late}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography variant="h6" color="info.main">
                  Excused: {stats.excused}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} hover>
                    <TableCell>{student.rollNumber || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>
                      <MuiSelect
                        size="small"
                        value={attendance[student._id]?.status || 'Present'}
                        onChange={(e) => handleStatusChange(student._id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="Present">Present</MenuItem>
                        <MenuItem value="Absent">Absent</MenuItem>
                        <MenuItem value="Late">Late</MenuItem>
                        <MenuItem value="Excused">Excused</MenuItem>
                      </MuiSelect>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="Remarks..."
                        value={attendance[student._id]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              size="large"
              disabled={students.length === 0 || loading}
            >
              Save Attendance
            </Button>
          </Box>
        </>
      )}

      {selectedClass && loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Loading students...
          </Typography>
        </Paper>
      )}

      {selectedClass && !loading && students.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Students Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no active students in this class. Please add students to the class first.
          </Typography>
        </Paper>
      )}

      {!selectedClass && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Please select a class and date to mark attendance
          </Typography>
        </Paper>
      )}

      <Toast
        toast={toast}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
