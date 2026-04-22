import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  alpha,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Schedule as LateIcon,
  Info as ExcusedIcon,
  CalendarToday as CalendarIcon,
  Class as ClassIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Toast, Select, BSDatePicker } from '../../components/common';
import { attendanceAPI, classAPI } from '../../hooks/reactQueryApi';
import { useAuth } from '../../context/AuthContext';
import {
  formatBSDateWithDay,
  getBSDateParts,
  getBSMonthOptions,
  getBSYearOptions,
  getCurrentBSDateParts,
  todayBSDate,
} from '../../utils/nepaliDate';

export default function AttendanceList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher';
  const currentBSDate = getCurrentBSDateParts();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [month, setMonth] = useState(currentBSDate?.month || 1);
  const [year, setYear] = useState(currentBSDate?.year || 2082);
  const [selectedDate, setSelectedDate] = useState(todayBSDate());
  const [tabValue, setTabValue] = useState(0);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [dailyAttendance, setDailyAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const months = getBSMonthOptions();
  const years = getBSYearOptions({ past: 2, future: 2 });

  useEffect(() => {
    loadClasses();
  }, [isTeacher]);

  // Load filters from URL query parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    const classId = searchParams.get('class');
    const date = searchParams.get('date');

    if (tab === 'daily') {
      setTabValue(1);
    } else if (tab === 'monthly') {
      setTabValue(0);
    }

    if (classId && !isTeacher) {
      setSelectedClass(classId);
    }

    if (date) {
      setSelectedDate(date);
      const bsDate = getBSDateParts(date);
      if (bsDate) {
        setMonth(bsDate.month);
        setYear(bsDate.year);
      }
    }
  }, [searchParams, isTeacher]);

  useEffect(() => {
    if (selectedClass && month && year && tabValue === 0) {
      loadMonthlyReport();
    }
  }, [selectedClass, month, year, tabValue]);

  useEffect(() => {
    if (selectedClass && selectedDate && tabValue === 1) {
      loadDailyAttendance();
    }
  }, [selectedClass, selectedDate, tabValue]);

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

  const loadMonthlyReport = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getMonthlyReport({
        classId: selectedClass,
        month,
        year,
      });
      if (response.data.success) {
        setMonthlyReport(response.data.data);
      }
    } catch (error) {
      console.error('Error loading monthly report:', error);
      setToast({
        open: true,
        message: 'Failed to load attendance report',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDailyAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getByDate({
        classId: selectedClass,
        date: selectedDate,
      });
      if (response.data.success) {
        setDailyAttendance(response.data.data);
      }
    } catch (error) {
      console.error('Error loading daily attendance:', error);
      setDailyAttendance(null);
      setToast({
        open: true,
        message: 'No attendance record found for this date',
        severity: 'info',
      });
    } finally {
      setLoading(false);
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

  const getAttendanceIcon = (status) => {
    const icons = {
      Present: <PresentIcon fontSize="small" />,
      Absent: <AbsentIcon fontSize="small" />,
      Late: <LateIcon fontSize="small" />,
      Excused: <ExcusedIcon fontSize="small" />,
    };
    return icons[status];
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'success.main';
    if (percentage >= 75) return 'primary.main';
    if (percentage >= 60) return 'warning.main';
    return 'error.main';
  };

  const selectedClassName = classes.find(c => c._id === selectedClass)?.className || '';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Attendance Records
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and analyze student attendance by class, month, and year
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard/attendance/mark')}
        >
          Mark Attendance
        </Button>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
        >
          <Tab label="Monthly Report" />
          <Tab label="Daily Attendance" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            Filters
          </Typography>
          <Grid container spacing={3}>
            {isTeacher ? (
              <Grid size={{ xs: 12, md: tabValue === 0 ? 4 : 6 }}>
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
              <Grid size={{ xs: 12, md: tabValue === 0 ? 4 : 6 }}>
                <Select
                  label="Select Class"
                  name="class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  options={classes}
                  placeholder="Choose a class"
                  allowNone={true}
                  noneLabel="Choose a class"
                />
              </Grid>
            )}

            {tabValue === 0 ? (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Select
                    label="Month"
                    name="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    options={months}
                    allowNone={false}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Select
                    label="Year"
                    name="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    options={years}
                    allowNone={false}
                  />
                </Grid>
              </>
            ) : (
              <Grid size={{ xs: 12, md: 6 }}>
                <BSDatePicker
                  label="Date (BS)"
                  name="selectedDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Monthly View */}
      {tabValue === 0 && monthlyReport && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: alpha('#2196f3', 0.05), border: '1px solid', borderColor: alpha('#2196f3', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Class
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {selectedClassName}
                    </Typography>
                  </Box>
                  <ClassIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: alpha('#4caf50', 0.05), border: '1px solid', borderColor: alpha('#4caf50', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Students
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {monthlyReport.studentAttendance.length}
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: alpha('#ff9800', 0.05), border: '1px solid', borderColor: alpha('#ff9800', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Working Days
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {monthlyReport.totalWorkingDays}
                    </Typography>
                  </Box>
                  <CalendarIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: alpha('#9c27b0', 0.05), border: '1px solid', borderColor: alpha('#9c27b0', 0.2) }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Avg. Attendance
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      {monthlyReport.studentAttendance.length > 0
                        ? (
                            monthlyReport.studentAttendance.reduce(
                              (sum, s) => sum + parseFloat(s.percentage),
                              0
                            ) / monthlyReport.studentAttendance.length
                          ).toFixed(1)
                        : 0}
                      %
                    </Typography>
                  </Box>
                  <PresentIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 0 && monthlyReport ? (
        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Monthly Attendance Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {months.find(m => m.value === month)?.label} {year} - {selectedClassName}
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha('#1976d2', 0.05) }}>
                    <TableCell sx={{ fontWeight: 600 }}>Roll No.</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Student ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Present</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Absent</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Late</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Excused</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Total Days</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Attendance %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyReport.studentAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No attendance records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    monthlyReport.studentAttendance.map((record) => (
                      <TableRow key={record.student.id} hover>
                        <TableCell>{record.student.rollNumber || '-'}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {record.student.studentId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {record.student.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getAttendanceIcon('Present')}
                            label={record.present}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getAttendanceIcon('Absent')}
                            label={record.absent}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getAttendanceIcon('Late')}
                            label={record.late}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getAttendanceIcon('Excused')}
                            label={record.excused}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {record.total}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: getPercentageColor(parseFloat(record.percentage)),
                            }}
                          >
                            {record.percentage}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : tabValue === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Report Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please select a class, month, and year to view the attendance report
          </Typography>
        </Paper>
      ) : null}

      {/* Daily View */}
      {tabValue === 1 && dailyAttendance && (
        <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Daily Attendance Record
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatBSDateWithDay(selectedDate)} - {selectedClassName}
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#4caf50', 0.05), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {dailyAttendance.students.filter(s => s.status === 'Present').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Present</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#f44336', 0.05), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                      {dailyAttendance.students.filter(s => s.status === 'Absent').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Absent</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#ff9800', 0.05), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {dailyAttendance.students.filter(s => s.status === 'Late').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Late</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#2196f3', 0.05), borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {dailyAttendance.students.filter(s => s.status === 'Excused').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Excused</Typography>
                  </Box>
                </Grid>
              </Grid>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha('#1976d2', 0.05) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Student ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dailyAttendance.students.map((record) => (
                      <TableRow key={record.student._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {record.student.studentId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {record.student.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getAttendanceIcon(record.status)}
                            label={record.status}
                            size="small"
                            color={getStatusColor(record.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {record.remarks || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && !dailyAttendance && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Attendance Record
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please select a class and date to view the daily attendance record
          </Typography>
        </Paper>
      )}

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
