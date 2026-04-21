import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { studentAPI } from '../../services/api';

export default function LinkStudentDialog({ open, onClose, onLink, currentFamilyId }) {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      loadAvailableStudents();
      setSelectedStudents([]);
    }
  }, [open]);

  const loadAvailableStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      if (response.data.success) {
        // Filter out students who are already linked to a family
        const availableStudents = response.data.data.filter(
          (student) => !student.family || student.family === currentFamilyId
        );
        setStudents(availableStudents);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleLink = () => {
    onLink(selectedStudents);
    onClose();
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Link Students to Family</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredStudents.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
            No students available to link
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredStudents.map((student) => (
              <ListItem key={student._id} disablePadding>
                <ListItemButton onClick={() => handleToggle(student._id)} dense>
                  <Checkbox
                    edge="start"
                    checked={selectedStudents.includes(student._id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">{student.name}</Typography>
                        <Chip label={student.studentId} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        {student.currentClass && (
                          <Chip
                            label={student.currentClass.className}
                            size="small"
                            color="primary"
                          />
                        )}
                        {student.status && (
                          <Chip
                            label={student.status}
                            size="small"
                            color={student.status === 'Active' ? 'success' : 'default'}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        {selectedStudents.length > 0 && (
          <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
            {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleLink}
          disabled={selectedStudents.length === 0}
        >
          Link Selected Students
        </Button>
      </DialogActions>
    </Dialog>
  );
}
