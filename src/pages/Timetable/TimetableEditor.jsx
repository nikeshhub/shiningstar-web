import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { Button, Select, Toast } from '../../components/common';
import { classAPI, subjectAPI, teacherAPI, timetableAPI } from '../../services/api';

const PERIODS = [1, 2, 3, 4, 5, 6, 7];

const getPeriodTimes = () => {
  const startMinutes = 10 * 60; // 10:00
  const periodLength = 40;
  const breakAfterSecond = 15;
  const lunchAfterFourth = 40;

  let cursor = startMinutes;
  const times = {};

  PERIODS.forEach((period) => {
    const start = cursor;
    const end = cursor + periodLength;
    times[period] = {
      start,
      end,
      label: `${formatTime(start)}–${formatTime(end)}`,
    };
    cursor = end;

    if (period === 2) cursor += breakAfterSecond;
    if (period === 4) cursor += lunchAfterFourth;
  });

  return times;
};

const formatTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hh = h % 12 === 0 ? 12 : h % 12;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
};

export default function TimetableEditor() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [grid, setGrid] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const periodTimes = useMemo(() => getPeriodTimes(), []);
  useEffect(() => {
    classAPI.getAll({ status: 'Active' })
      .then((res) => { if (res.data.success) setClasses(res.data.data); })
      .catch((err) => console.error('Error loading classes:', err));

    subjectAPI.getAll()
      .then((res) => { if (res.data.success) setSubjects(res.data.data); })
      .catch((err) => console.error('Error loading subjects:', err));

    teacherAPI.getAll({ status: 'Active' })
      .then((res) => { if (res.data.success) setTeachers(res.data.data); })
      .catch((err) => console.error('Error loading teachers:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    timetableAPI.getAll()
      .then((res) => {
        if (res.data.success) {
          const nextGrid = {};
          classes.forEach((cls) => {
            nextGrid[cls._id] = {};
            PERIODS.forEach((p) => {
              nextGrid[cls._id][p] = { subjects: [], teacher: '' };
            });
          });

          res.data.data.forEach((slot) => {
            const classId = slot.class?._id || slot.class;
            if (!nextGrid[classId]) return;
            nextGrid[classId][slot.period] = {
              subjects: (slot.subjects || []).map((subject) => subject?._id || subject || ''),
              teacher: slot.teacher?._id || slot.teacher || '',
            };
          });
          setGrid(nextGrid);
        }
      })
      .catch((err) => console.error('Error loading timetable:', err))
      .finally(() => setLoading(false));
  }, [classes]);

  const handleCellChange = (classId, period, field, value) => {
    setGrid((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [period]: {
          ...prev[classId]?.[period],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    const slots = [];
    const teacherUsage = {};
    const subjectUsage = {};

    for (const cls of classes) {
      for (const period of PERIODS) {
        const cell = grid[cls._id]?.[period] || { subjects: [], teacher: '' };
        if (cell.teacher && Array.isArray(cell.subjects) && cell.subjects.length > 0) {
          const teacherId = cell.teacher;
          if (!teacherUsage[period]) teacherUsage[period] = {};
          if (teacherUsage[period][teacherId] && teacherUsage[period][teacherId] !== cls._id) {
            setToast({
              open: true,
              severity: 'error',
              message: `Teacher "${teacherMap[teacherId] || 'Unknown'}" is already assigned in Period ${period} for ${classMap[teacherUsage[period][teacherId]] || 'another class'}.`,
            });
            return;
          }
          teacherUsage[period][teacherId] = cls._id;

          if (!subjectUsage[cls._id]) subjectUsage[cls._id] = {};
          const repeat = cell.subjects.find((subjectId) => subjectUsage[cls._id][subjectId] && subjectUsage[cls._id][subjectId] !== period);
          if (repeat) {
            setToast({
              open: true,
              severity: 'error',
              message: `Subject "${subjectMap[repeat] || 'Unknown'}" is repeated in ${classMap[cls._id] || 'this class'}.`,
            });
            return;
          }
          cell.subjects.forEach((subjectId) => {
            subjectUsage[cls._id][subjectId] = period;
          });

          slots.push({
            class: cls._id,
            period,
            teacher: cell.teacher,
            subjects: cell.subjects,
          });
        }
      }
    }

    try {
      setLoading(true);
      await timetableAPI.setAll({ slots });
      setToast({ open: true, message: 'Timetable saved successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error saving timetable:', err);
      setToast({
        open: true,
        message: err.response?.data?.message || 'Failed to save timetable',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = subjects.map((s) => ({
    label: `${s.subjectName} (${s.subjectCode || ''})`.trim(),
    value: s._id,
  }));
  const subjectLabelMap = Object.fromEntries(
    subjects.map((s) => [s._id, `${s.subjectName} (${s.subjectCode || ''})`.trim()])
  );
  const classSubjectOptions = Object.fromEntries(
    classes.map((cls) => [
      cls._id,
      (cls.subjects || []).map((s) => ({
        label: (s && typeof s === 'object')
          ? `${s.subjectName || s.name || ''} (${s.subjectCode || ''})`.trim()
          : (subjectLabelMap[s] || String(s)),
        value: (s && typeof s === 'object') ? s._id : s,
      })),
    ])
  );
  const teacherOptions = teachers.map((t) => ({ label: t.name, value: t._id }));
  const classMap = Object.fromEntries(classes.map((c) => [c._id, c.className]));
  const teacherMap = Object.fromEntries(teachers.map((t) => [t._id, t.name]));
  const subjectMap = Object.fromEntries(subjects.map((s) => [s._id, s.subjectName]));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Timetable
        </Typography>
        <Button onClick={handleSave} loading={loading}>
          Save Timetable
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100', width: 200 }}>
                Class
              </TableCell>
              {PERIODS.map((p) => (
                <TableCell key={p} sx={{ fontWeight: 600, bgcolor: 'grey.100', minWidth: 220 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>P{p}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {periodTimes[p].label}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls._id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{cls.className}</TableCell>
                {PERIODS.map((period) => (
                  <TableCell key={period}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField
                          select
                          fullWidth
                          label="Subjects"
                          value={grid[cls._id]?.[period]?.subjects || []}
                          onChange={(e) => handleCellChange(cls._id, period, 'subjects', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{
                            multiple: true,
                            displayEmpty: true,
                            renderValue: (selected) => (
                              (selected?.length || 0) === 0 ? (
                                <span style={{ color: '#9e9e9e' }}>Select subjects</span>
                              ) : (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((val) => {
                                  const opt = subjectOptions.find(o => o.value === val);
                                  return <Chip key={val} label={opt?.label || val} size="small" />;
                                })}
                              </Box>
                              )
                            ),
                          }}
                          size="small"
                        >
                          {(classSubjectOptions[cls._id] || subjectOptions).map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <Select
                          label="Teacher"
                          name={`teacher-${cls._id}-${period}`}
                          value={grid[cls._id]?.[period]?.teacher || ''}
                          onChange={(e) => handleCellChange(cls._id, period, 'teacher', e.target.value)}
                          options={teacherOptions}
                          placeholder="Select Teacher"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
