import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import teacherService from '../../services/teacherService';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        setTeachers(data);
      } catch (err) {
        setError('Не вдалося завантажити вчителів');
      }
    };

    fetchTeachers();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Список вчителів</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box>
        {teachers.map((teacher) => (
          <Box key={teacher.id} mb={2} p={2} border={1} borderRadius={2}>
            <Typography variant="h6">{teacher.surname} {teacher.name} {teacher.patronymic}</Typography>
            <Typography>Пошта: {teacher.email}</Typography>
            <Typography>Номер: {teacher.number}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default TeacherList;
