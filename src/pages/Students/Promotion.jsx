import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Button, Toast, Select, Input } from '../../components/common';
import { studentAPI, classAPI } from '../../services/api';

const CURRENT_YEAR = '2081-2082';
const NEXT_YEAR = '2082-2083';

const ACTION_OPTIONS = [
  { label: 'Promote', value: 'promote' },
  { label: 'Repeat', value: 'repeat' },
];

export default function Promotion() {
  // Step 1: source filters
  const [classes, setClasses] = useState([]);
  const [sourceClassId, setSourceClassId] = useState('');
  const [sourceYear, setSourceYear] = useState(CURRENT_YEAR);

  // Step 2: students loaded from source
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Step 3: selection + action
  const [selected, setSelected] = useState([]);
  const [action, setAction] = useState('promote');
  const [targetClassId, setTargetClassId] = useState('');
  const [targetYear, setTargetYear] = useState(NEXT_YEAR);

  // Feedback
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // Load classes once
  useEffect(() => {
    classAPI.getAll().then(res => {
      if (res.data.success) setClasses(res.data.data);
    }).catch(err => console.error(err));
  }, []);

  // Load students whenever source class / year changes
  useEffect(() => {
    if (!sourceClassId) {
      setStudents([]);
      setSelected([]);
      return;
    }
    setLoadingStudents(true);
    studentAPI.getAll({ class: sourceClassId, status: 'Active' })
      .then(res => {
        if (res.data.success) {
          const filtered = res.data.data.filter(s => s.academicYear === sourceYear);
          setStudents(filtered);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingStudents(false));
    setSelected([]);
  }, [sourceClassId, sourceYear]);

  // When action switches to 'repeat', target class = source class
  useEffect(() => {
    if (action === 'repeat') {
      setTargetClassId(sourceClassId);
    } else {
      setTargetClassId('');
    }
  }, [action, sourceClassId]);

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? students.map(s => s._id) : []);
  };

  const handleSelectOne = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setToast({ open: true, message: 'Select at least one student.', severity: 'warning' });
      return;
    }
    if (action === 'promote' && !targetClassId) {
      setToast({ open: true, message: 'Select a target class for promotion.', severity: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await studentAPI.promote({
        studentIds: selected,
        newClassId: targetClassId,
        academicYear: targetYear,
        action,
      });
      setToast({ open: true, message: res.data.message, severity: 'success' });
      setStudents(prev => prev.filter(s => !selected.includes(s._id)));
      setSelected([]);
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || 'Promotion failed',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Derived labels
  const classOptions = classes.map(c => ({ label: c.className, value: c._id }));
  const targetClassOptions = classes
    .filter(c => c._id !== sourceClassId)
    .map(c => ({ label: c.className, value: c._id }));
  const sourceClassName = classes.find(c => c._id === sourceClassId)?.className || '';
  const targetClassName = classes.find(c => c._id === targetClassId)?.className || '';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Promotion & Repeat (पदस्थापना)
        </Typography>
      </Box>

      {/* Source Class selector */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
          Source Class
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ minWidth: 180 }}>
            <Select
              name="sourceClass"
              label="Class"
              value={sourceClassId}
              onChange={(e) => setSourceClassId(e.target.value)}
              options={classOptions}
              size="small"
            />
          </Box>
          <Box sx={{ minWidth: 150 }}>
            <Input
              name="sourceYear"
              label="Academic Year"
              value={sourceYear}
              onChange={(e) => setSourceYear(e.target.value)}
              placeholder="e.g. 2081-2082"
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* Student table */}
      {sourceClassId && (
        <Paper sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 2 }}>
            <Typography variant="subtitle2">
              Students in {sourceClassName} ({sourceYear})
            </Typography>
            <Chip label={`${students.length} students`} size="small" />
          </Box>

          <TableContainer>
            <MuiTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < students.length}
                      checked={students.length > 0 && selected.length === students.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>Loading...</TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No active students found in this class for {sourceYear}
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map(s => (
                    <TableRow key={s._id} selected={selected.includes(s._id)} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(s._id)}
                          onChange={() => handleSelectOne(s._id)}
                        />
                      </TableCell>
                      <TableCell>{s.studentId}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.rollNumber || '-'}</TableCell>
                      <TableCell>{s.gender}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Paper>
      )}

      {/* Action + Target */}
      {selected.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
            Action ({selected.length} selected)
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <Box sx={{ minWidth: 150 }}>
              <Select
                name="action"
                label="Action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                options={ACTION_OPTIONS}
                size="small"
              />
            </Box>

            {action === 'promote' && (
              <Box sx={{ minWidth: 180 }}>
                <Select
                  name="targetClass"
                  label="Target Class"
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  options={targetClassOptions}
                  size="small"
                  error={!targetClassId ? 'Required' : ''}
                />
              </Box>
            )}

            {action === 'repeat' && (
              <Chip
                label={`Repeat: ${sourceClassName}`}
                color="warning"
                variant="outlined"
                sx={{ height: 40 }}
              />
            )}

            <Box sx={{ minWidth: 150 }}>
              <Input
                name="targetYear"
                label="Target Year"
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                size="small"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Alert severity={action === 'repeat' ? 'warning' : 'info'} sx={{ mb: 2 }}>
            {action === 'promote'
              ? `Move ${selected.length} student(s) from ${sourceClassName} to ${targetClassName || '...'} for ${targetYear}`
              : `Keep ${selected.length} student(s) in ${sourceClassName} for ${targetYear} (repeat)`}
          </Alert>

          <Button
            onClick={handleSubmit}
            loading={submitting}
            startIcon={action === 'repeat' ? <RefreshIcon /> : <TrendingUpIcon />}
            color={action === 'repeat' ? 'warning' : 'primary'}
            disabled={action === 'promote' && !targetClassId}
          >
            {action === 'promote' ? 'Promote Students' : 'Mark as Repeat'}
          </Button>
        </Paper>
      )}

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
