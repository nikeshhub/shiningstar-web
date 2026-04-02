import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { Table, Button } from '../../components/common';
import { studentAPI, examAPI } from '../../services/api';

export default function MarksEntry({ exam, onClose }) {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (exam?.class) {
      loadStudents();
      loadExistingMarks();
    }
  }, [exam]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll({
        class: exam.class._id || exam.class,
        status: 'Active',
      });
      if (response.data.success) {
        setStudents(response.data.data);

        // Initialize marks
        const initialMarks = {};
        response.data.data.forEach((student) => {
          initialMarks[student._id] = {
            student: student._id,
            marksObtained: '',
            grade: '',
            remarks: '',
            isAbsent: false,
          };
        });
        setMarks(initialMarks);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingMarks = async () => {
    try {
      const response = await examAPI.getMarks(exam._id);
      if (response.data.success && response.data.data?.students) {
        const existingMarks = {};
        response.data.data.students.forEach((record) => {
          existingMarks[record.student._id || record.student] = {
            student: record.student._id || record.student,
            marksObtained: record.marksObtained,
            grade: record.grade || '',
            remarks: record.remarks || '',
            isAbsent: record.isAbsent || false,
          };
        });
        setMarks(prev => ({ ...prev, ...existingMarks }));
      }
    } catch (error) {
      console.error('Error loading marks:', error);
    }
  };

  const calculateGrade = (marksObtained, totalMarks) => {
    const percentage = (marksObtained / totalMarks) * 100;

    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'E';
  };

  const handleMarksChange = (studentId, value) => {
    const marksObtained = parseFloat(value) || 0;
    const grade = calculateGrade(marksObtained, exam.totalMarks);

    setMarks({
      ...marks,
      [studentId]: {
        ...marks[studentId],
        marksObtained: value,
        grade,
      },
    });
  };

  const handleAbsentToggle = (studentId) => {
    setMarks({
      ...marks,
      [studentId]: {
        ...marks[studentId],
        isAbsent: !marks[studentId].isAbsent,
        marksObtained: !marks[studentId].isAbsent ? 0 : marks[studentId].marksObtained,
        grade: !marks[studentId].isAbsent ? 'AB' : marks[studentId].grade,
      },
    });
  };

  const handleRemarksChange = (studentId, value) => {
    setMarks({
      ...marks,
      [studentId]: {
        ...marks[studentId],
        remarks: value,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const marksData = {
        examId: exam._id,
        students: Object.values(marks),
      };

      await examAPI.saveMarks(exam._id, marksData);
      alert('Marks saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks');
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'success';
    if (grade === 'B+' || grade === 'B') return 'primary';
    if (grade === 'C+' || grade === 'C') return 'warning';
    if (grade === 'AB') return 'default';
    return 'error';
  };

  const columns = [
    {
      field: 'rollNumber',
      headerName: 'Roll No',
      width: 80,
      renderCell: (row) => row.rollNumber || '-',
    },
    {
      field: 'name',
      headerName: 'Student Name',
      width: 200,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.name}
        </Typography>
      ),
    },
    {
      field: 'studentId',
      headerName: 'Student ID',
      width: 120,
    },
    {
      field: 'marks',
      headerName: `Marks (out of ${exam?.totalMarks})`,
      width: 150,
      renderCell: (row) => (
        <TextField
          size="small"
          type="number"
          value={marks[row._id]?.marksObtained || ''}
          onChange={(e) => handleMarksChange(row._id, e.target.value)}
          disabled={marks[row._id]?.isAbsent}
          inputProps={{ min: 0, max: exam?.totalMarks }}
          sx={{ width: 100 }}
        />
      ),
    },
    {
      field: 'grade',
      headerName: 'Grade',
      width: 80,
      renderCell: (row) => (
        <Chip
          label={marks[row._id]?.grade || '-'}
          size="small"
          color={getGradeColor(marks[row._id]?.grade)}
        />
      ),
    },
    {
      field: 'absent',
      headerName: 'Absent',
      width: 100,
      renderCell: (row) => (
        <Chip
          label={marks[row._id]?.isAbsent ? 'Absent' : 'Present'}
          size="small"
          color={marks[row._id]?.isAbsent ? 'error' : 'success'}
          onClick={() => handleAbsentToggle(row._id)}
          sx={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      width: 200,
      renderCell: (row) => (
        <TextField
          size="small"
          value={marks[row._id]?.remarks || ''}
          onChange={(e) => handleRemarksChange(row._id, e.target.value)}
          placeholder="Remarks..."
          fullWidth
        />
      ),
    },
  ];

  const stats = {
    totalStudents: students.length,
    present: Object.values(marks).filter(m => !m.isAbsent).length,
    absent: Object.values(marks).filter(m => m.isAbsent).length,
    passed: Object.values(marks).filter(m =>
      !m.isAbsent && parseFloat(m.marksObtained) >= exam?.passingMarks
    ).length,
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Exam:</strong> {exam?.examName} |
          <strong> Class:</strong> {exam?.class?.className} |
          <strong> Subject:</strong> {exam?.subject?.name || exam?.subject} |
          <strong> Total Marks:</strong> {exam?.totalMarks} |
          <strong> Passing Marks:</strong> {exam?.passingMarks}
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', gap: 3, mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2">
          <strong>Total Students:</strong> {stats.totalStudents}
        </Typography>
        <Typography variant="body2" color="success.main">
          <strong>Present:</strong> {stats.present}
        </Typography>
        <Typography variant="body2" color="error.main">
          <strong>Absent:</strong> {stats.absent}
        </Typography>
        <Typography variant="body2" color="primary.main">
          <strong>Passed:</strong> {stats.passed}
        </Typography>
      </Box>

      <Table
        columns={columns}
        rows={students}
        loading={loading}
        emptyMessage="No students found in this class."
        hover
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          loading={saving}
        >
          Save Marks
        </Button>
      </Box>
    </Box>
  );
}
