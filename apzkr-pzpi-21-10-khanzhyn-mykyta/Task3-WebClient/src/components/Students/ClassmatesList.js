import React, { useEffect, useState } from 'react';
import studentService from '../../services/studentService';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const ClassmatesList = ({ className }) => {
  const [classmates, setClassmates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassmates = async () => {
      try {
        const data = await studentService.getFilteredStudents(className);
        const sortedData = data.sort((a, b) => a.surname.localeCompare(b.surname));
        setClassmates(sortedData);
      } catch (err) {
        setError('Не вдалося завантажити список однокласників');
      }
    };

    fetchClassmates();
  }, [className]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Список однокласників</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {classmates.map((student, index) => (
          <ListItem key={student.id}>
            <ListItemText
              primary={`Номер у класі: ${index + 1}`}
              secondary={
                <>
                  <Typography component="span" variant="body1">
                    Прізвище: {student.surname}<br />
                    Ім'я: {student.name}<br />
                    По-батькові: {student.patronymic}<br />
                    Номер телефону: {student.number}<br />
                    Електронна пошта: {student.email}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ClassmatesList;
