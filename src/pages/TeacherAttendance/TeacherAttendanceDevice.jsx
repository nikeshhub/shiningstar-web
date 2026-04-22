import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Button, FormAutocompleteSelect, Toast, BSDatePicker } from '../../components/common';
import { teacherAPI, teacherAttendanceAPI } from '../../hooks/reactQueryApi';
import { todayBSDate } from '../../utils/nepaliDate';

const STATUS_OPTIONS = ['Present', 'Absent', 'Leave'];

const formatTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export default function TeacherAttendanceDevice() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [deviceName, setDeviceName] = useState('Main Office');
  const [date, setDate] = useState(todayBSDate());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const teacherOptions = useMemo(() => teachers.map((t) => ({ label: t.name, value: t._id })), [teachers]);

  const loadTeachers = async () => {
    try {
      const res = await teacherAPI.getAll({ status: 'Active' });
      if (res.data.success) setTeachers(res.data.data);
    } catch (err) {
      console.error('Error loading teachers:', err);
    }
  };

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await teacherAttendanceAPI.getAll({ date });
      if (res.data.success) setRecords(res.data.data);
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    loadRecords();
  }, [date]);

  const handleMark = async (type) => {
    if (!selectedTeacher) {
      setToast({ open: true, message: 'Select a teacher', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      await teacherAttendanceAPI.mark({
        teacherId: selectedTeacher,
        date,
        type,
        deviceName,
      });
      setToast({ open: true, message: `Marked ${type.toUpperCase()} successfully`, severity: 'success' });
      loadRecords();
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || `Failed to mark ${type}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualUpdate = async (recordId, updates) => {
    try {
      await teacherAttendanceAPI.update(recordId, updates);
      loadRecords();
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || 'Failed to update record',
        severity: 'error',
      });
    }
  };

  const handleRemarksChange = (recordId, value) => {
    setRecords((prev) => prev.map((rec) => (rec._id === recordId ? { ...rec, remarks: value } : rec)));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Teacher Attendance (Device)
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormAutocompleteSelect
              label="Teacher"
              name="teacher"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              options={teacherOptions}
              placeholder="Type to search teacher..."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <BSDatePicker
              label="Date (BS)"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button fullWidth onClick={() => handleMark('in')} loading={loading}>
              Mark IN
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button fullWidth variant="outlined" onClick={() => handleMark('out')} loading={loading}>
              Mark OUT
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>In Time</TableCell>
              <TableCell>Out Time</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id} hover>
                <TableCell>{record.teacher?.name}</TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={record.status || 'Present'}
                    onChange={(e) => handleManualUpdate(record._id, { status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>{formatTime(record.inTime)}</TableCell>
                <TableCell>{formatTime(record.outTime)}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={record.remarks || ''}
                    onBlur={(e) => handleManualUpdate(record._id, { remarks: e.target.value })}
                    onChange={(e) => handleRemarksChange(record._id, e.target.value)}
                    placeholder="Remarks"
                  />
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">No attendance records</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
