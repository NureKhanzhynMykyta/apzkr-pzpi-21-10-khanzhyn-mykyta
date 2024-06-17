import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import studentService from '../../services/studentService';
import classService from '../../services/classService';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAllStudents();
        setStudents(data);
      } catch (err) {
        setError('Не вдалося завантажити учнів');
      }
    };

    const fetchClasses = async () => {
      try {
        const data = await classService.getAllClasses();
        setClasses(data);
      } catch (err) {
        setError('Не вдалося завантажити класи');
      }
    };

    fetchStudents();
    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    const selected = e.target.value;
    setSelectedClass(selected);
    if (selected) {
      try {
        const data = await studentService.getFilteredStudents(selected);
        setStudents(data);
      } catch (err) {
        setError('Не вдалося завантажити учнів за класом');
      }
    } else {
      try {
        const data = await studentService.getAllStudents();
        setStudents(data);
      } catch (err) {
        setError('Не вдалося завантажити учнів');
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Список учнів</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Оберіть клас</InputLabel>
        <Select
          value={selectedClass}
          onChange={handleClassChange}
          label="Оберіть клас"
        >
          <MenuItem value="">
            <em>Всі класи</em>
          </MenuItem>
          {classes.map((classItem) => (
            <MenuItem key={classItem.id} value={classItem.className}>
              {classItem.className}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box>
        {students.map((student) => (
          <Box key={student.id} mb={2} p={2} border={1} borderRadius={2}>
            <Typography variant="h6">{student.surname} {student.name} {student.patronymic}</Typography>
            <Typography>Клас: {student.className}</Typography>
            <Typography>Пошта: {student.email}</Typography>
            <Typography>Номер: {student.number}</Typography>
            <Typography>Дата народження: {new Date(student.birthDate).toLocaleDateString()}</Typography>
            <Typography>NFC ID: {student.nfcId}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default StudentList;
