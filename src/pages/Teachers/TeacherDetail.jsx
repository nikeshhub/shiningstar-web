import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField, MenuItem } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DetailPage, DetailSection, DetailRow, StatusChip, Table } from '../../components/common';
import { teacherAPI, timetableAPI, teacherAttendanceAPI } from '../../services/api';

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceFilters, setAttendanceFilters] = useState({
    status: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    loadTeacher();
    loadTimetable();
    loadAttendance();
  }, [id, attendanceFilters.status, attendanceFilters.from, attendanceFilters.to]);

  const loadTeacher = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getById(id);
      if (response.data.success) {
        setTeacher(response.data.data);
      }
    } catch (error) {
      console.error('Error loading teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimetable = async () => {
    try {
      const response = await timetableAPI.getAll({ teacherId: id });
      if (response.data.success) {
        setTimetableSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const params = { teacherId: id };
      if (attendanceFilters.status) params.status = attendanceFilters.status;
      if (attendanceFilters.from) params.from = attendanceFilters.from;
      if (attendanceFilters.to) params.to = attendanceFilters.to;

      const response = await teacherAttendanceAPI.getAll(params);
      if (response.data.success) {
        setAttendanceRecords(response.data.data);
      }
    } catch (error) {
      console.error('Error loading teacher attendance:', error);
    }
  };

  if (loading) {
    return <DetailPage loading={true} />;
  }

  if (!teacher) {
    return (
      <Box sx={{ textAlign: 'center', pt: 10 }}>
        <Typography variant="h6" color="text.secondary">Teacher not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/dashboard/teachers')}>
          Back to Teachers
        </Button>
      </Box>
    );
  }

  const classColumns = [
    {
      field: 'className',
      headerName: 'Class Name',
      width: 200,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.className}
        </Typography>
      ),
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 100,
    },
    {
      field: 'monthlyFee',
      headerName: 'Monthly Fee',
      width: 140,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
          Rs. {row.monthlyFee || 0}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (row) => <StatusChip status={row.status} />,
    },
  ];

  const periods = [1, 2, 3, 4, 5, 6, 7];
  const grid = {};
  timetableSlots.forEach((slot) => {
    const key = slot.period;
    if (!grid[key]) grid[key] = [];
    const teacherId = slot.teacher?._id || slot.teacher;
    if (teacherId !== id) return;
    (slot.subjects || []).forEach((subject) => {
      grid[key].push({
        className: slot.class?.className,
        subjectName: subject?.subjectName || subject,
      });
    });
  });

  return (
    <>
      <DetailPage
        title={teacher.name}
        backTo="/dashboard/teachers"
        loading={false}
        actions={
          <Button startIcon={<EditIcon />} onClick={() => navigate(`/dashboard/teachers/edit/${id}`)}>
            Edit Teacher
          </Button>
        }
      >
        {/* Basic Info */}
        <DetailSection title="Personal Information">
          <DetailRow label="Status" value={<StatusChip status={teacher.status} />} />
          <DetailRow label="Email" value={teacher.email} />
          <DetailRow label="Phone" value={teacher.phone} />
          <DetailRow label="Date of Birth" value={teacher.dateOfBirth?.split('T')[0] || '-'} />
          <DetailRow label="Gender" value={teacher.gender || '-'} />
          <DetailRow label="Address" value={teacher.address || '-'} colSpan={12} />
        </DetailSection>

        {/* Professional Info */}
        <DetailSection title="Professional Information">
          <DetailRow label="Qualification" value={teacher.qualification || '-'} />
          <DetailRow
            label="Salary"
            value={teacher.salary ? `Rs. ${teacher.salary}` : '-'}
          />
          <DetailRow
            label="Join Date"
            value={teacher.joinDate?.split('T')[0] || '-'}
          />
        </DetailSection>

        {/* Classes Teaching */}
        {teacher.classesTeaching && teacher.classesTeaching.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              Classes (as Class Teacher)
            </Typography>
            <Table
              columns={classColumns}
              rows={teacher.classesTeaching}
              emptyMessage="Not assigned as class teacher for any class."
              hover
            />
          </Box>
        )}

        {/* Teaching Timetable */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Teaching Timetable
          </Typography>
          {timetableSlots.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <MuiTable size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', width: 90 }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', textAlign: 'center' }}>
                      Classes & Subjects
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {periods.map(period => (
                    <TableRow key={period}>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>P{period}</TableCell>
                      <TableCell sx={{ verticalAlign: 'top', minWidth: 160 }}>
                        {(grid[period] || []).length > 0 ? (grid[period] || []).map((slot, idx) => (
                          <Box key={`${period}-${idx}`} sx={{ mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                              {slot.className || 'Class'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {slot.subjectName || 'Subject'}
                            </Typography>
                          </Box>
                        )) : (
                          <Typography variant="caption" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </MuiTable>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No timetable configured for this teacher.
            </Typography>
          )}
        </Box>

        {/* Attendance Records */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Attendance
          </Typography>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={attendanceFilters.status}
                  onChange={(e) => setAttendanceFilters({ ...attendanceFilters, status: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Leave">Leave</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="From"
                  type="date"
                  value={attendanceFilters.from}
                  onChange={(e) => setAttendanceFilters({ ...attendanceFilters, from: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="To"
                  type="date"
                  value={attendanceFilters.to}
                  onChange={(e) => setAttendanceFilters({ ...attendanceFilters, to: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={loadAttendance}>
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper}>
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>In Time</TableCell>
                  <TableCell>Out Time</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record._id} hover>
                    <TableCell>{new Date(record.date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>{record.inTime ? new Date(record.inTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '-'}</TableCell>
                    <TableCell>{record.outTime ? new Date(record.outTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '-'}</TableCell>
                    <TableCell>{record.deviceName || '-'}</TableCell>
                    <TableCell>{record.remarks || '-'}</TableCell>
                  </TableRow>
                ))}
                {attendanceRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">No attendance records found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Box>
      </DetailPage>

    </>
  );
}
