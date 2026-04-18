import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Toast } from '../../components/common';
import { examAPI, classAPI, subjectAPI } from '../../services/api';

const GPA_SCALE = {
  'A+': { min: 90, gpa: 4.0, color: '#2e7d32' },
  'A': { min: 80, gpa: 3.6, color: '#388e3c' },
  'B+': { min: 70, gpa: 3.2, color: '#689f38' },
  'B': { min: 60, gpa: 2.8, color: '#afb42b' },
  'C+': { min: 50, gpa: 2.4, color: '#f57c00' },
  'C': { min: 40, gpa: 2.0, color: '#ef6c00' },
  'D': { min: 20, gpa: 1.6, color: '#d84315' },
  'NG': { min: 0, gpa: 0.0, color: '#c62828' },
};

export default function MarksEntryNew() {
  const navigate = useNavigate();
  const { id: examId } = useParams();

  const [exam, setExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadExam();
  }, [examId]);

  useEffect(() => {
    if (selectedClass && exam) {
      loadStudents();
      loadSubjects();
    }
  }, [selectedClass, exam]);

  const loadExam = async () => {
    try {
      const response = await examAPI.getById(examId);
      if (response.data.success) {
        const examData = response.data.data;
        setExam(examData);

        // If only one class, auto-select it
        if (examData.classes?.length === 1) {
          setSelectedClass(examData.classes[0]._id || examData.classes[0]);
        }
      }
    } catch (error) {
      console.error('Error loading exam:', error);
      setToast({ open: true, message: 'Failed to load exam', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await classAPI.getStudents(selectedClass);
      if (response.data.success) {
        const studentsList = response.data.data;
        setStudents(studentsList);

        // Initialize marks data for each student
        const initialMarks = {};
        studentsList.forEach((student) => {
          initialMarks[student._id] = {
            studentId: student._id,
            subjectMarks: [],
          };
        });
        setMarksData(initialMarks);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await subjectAPI.getAll();
      if (response.data.success) {
        // Filter subjects applicable to this class (you may need class info to filter properly)
        setSubjects(response.data.data);

        // Initialize subject marks for each student
        setMarksData(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(studentId => {
            updated[studentId].subjectMarks = response.data.data.map(subject => ({
              subject: subject._id,
              subjectName: subject.subjectName,
              writtenMarks: '',
              practicalMarks: '',
              fullMarks: subject.fullMarks,
              passMarks: subject.passMarks,
              isAbsent: false,
            }));
          });
          return updated;
        });
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleMarksChange = (studentId, subjectIndex, field, value) => {
    setMarksData(prev => {
      const updated = { ...prev };
      if (!updated[studentId]) return prev;

      updated[studentId].subjectMarks[subjectIndex][field] = value;

      // Auto-calculate totals if written or practical changed
      if (field === 'writtenMarks' || field === 'practicalMarks') {
        const subject = updated[studentId].subjectMarks[subjectIndex];
        const written = parseFloat(subject.writtenMarks) || 0;
        const practical = parseFloat(subject.practicalMarks) || 0;
        subject.totalMarks = written + practical;
      }

      return updated;
    });
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 20) return 'D';
    return 'NG';
  };

  const getGradeInfo = (percentage) => {
    const grade = calculateGrade(percentage);
    return { grade, ...GPA_SCALE[grade] };
  };

  const handleSaveMarks = async (studentId) => {
    const studentData = marksData[studentId];
    if (!studentData) return;

    try {
      setSaving(true);

      const payload = {
        exam: examId,
        student: studentId,
        academicYear: exam.academicYear,
        terminalNumber: exam.terminalNumber,
        subjectMarks: studentData.subjectMarks.map(sm => ({
          subject: sm.subject,
          writtenMarks: parseFloat(sm.writtenMarks) || 0,
          practicalMarks: parseFloat(sm.practicalMarks) || 0,
          fullMarks: sm.fullMarks,
          passMarks: sm.passMarks,
          isAbsent: sm.isAbsent,
        })),
      };

      const response = await examAPI.enterMarks(payload);

      if (response.data.success) {
        setToast({ open: true, message: 'Marks saved successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      setToast({ open: true, message: error.response?.data?.message || 'Failed to save marks', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!exam) {
    return (
      <Box>
        <Alert severity="error">Exam not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Marks Entry - {exam.examName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={exam.examType} color="primary" size="small" />
            {exam.terminalNumber && <Chip label={`Terminal ${exam.terminalNumber}`} color="warning" size="small" />}
            <Chip label={exam.academicYear} size="small" />
          </Box>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard/exams')}
        >
          Back to Exams
        </Button>
      </Box>

      {/* Class Selection */}
      {exam.classes?.length > 1 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              label="Select Class"
            >
              {exam.classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      )}

      {/* NEB Grading Scale Reference */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          NEB Grading Scale:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(GPA_SCALE).map(([grade, info]) => (
            <Chip
              key={grade}
              label={`${grade} = ${info.min}%+ (${info.gpa})`}
              size="small"
              sx={{ bgcolor: info.color, color: 'white' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Marks Entry for Each Student */}
      {selectedClass && students.length > 0 ? (
        <Grid container spacing={2}>
          {students.map((student) => {
            const studentMarks = marksData[student._id];
            if (!studentMarks) return null;

            return (
              <Grid size={12} key={student._id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Roll: {student.rollNumber} | ID: {student.studentId}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSaveMarks(student._id)}
                      loading={saving}
                    >
                      Save Marks
                    </Button>
                  </Box>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Subject</TableCell>
                          <TableCell align="center">Written</TableCell>
                          <TableCell align="center">Practical</TableCell>
                          <TableCell align="center">Total</TableCell>
                          <TableCell align="center">Full Marks</TableCell>
                          <TableCell align="center">%</TableCell>
                          <TableCell align="center">Grade</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {studentMarks.subjectMarks.map((subject, idx) => {
                          const total = (parseFloat(subject.writtenMarks) || 0) + (parseFloat(subject.practicalMarks) || 0);
                          const percentage = subject.fullMarks > 0 ? (total / subject.fullMarks) * 100 : 0;
                          const gradeInfo = getGradeInfo(percentage);

                          return (
                            <TableRow key={idx}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {subject.subjectName}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  size="small"
                                  type="number"
                                  value={subject.writtenMarks}
                                  onChange={(e) => handleMarksChange(student._id, idx, 'writtenMarks', e.target.value)}
                                  inputProps={{ min: 0, max: 50, style: { textAlign: 'center' } }}
                                  sx={{ width: 80 }}
                                  disabled={subject.isAbsent}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <TextField
                                  size="small"
                                  type="number"
                                  value={subject.practicalMarks}
                                  onChange={(e) => handleMarksChange(student._id, idx, 'practicalMarks', e.target.value)}
                                  inputProps={{ min: 0, max: 50, style: { textAlign: 'center' } }}
                                  sx={{ width: 80 }}
                                  disabled={subject.isAbsent}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {total.toFixed(0)}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {subject.fullMarks}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {percentage.toFixed(1)}%
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${gradeInfo.grade} (${gradeInfo.gpa})`}
                                  size="small"
                                  sx={{
                                    bgcolor: gradeInfo.color,
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Alert severity="info">
          {selectedClass ? 'No students found in this class' : 'Please select a class to enter marks'}
        </Alert>
      )}

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
}
