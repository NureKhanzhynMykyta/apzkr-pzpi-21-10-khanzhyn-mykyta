import React, { useState, useEffect } from 'react';
import subjectService from '../../services/subjectService';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectService.getAllSubjects();
        setSubjects(data);
      } catch (err) {
        setError('Не вдалося завантажити список предметів');
      }
    };

    fetchSubjects();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Список предметів</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {subjects.map((subject) => (
          <ListItem key={subject.id}>
            <ListItemText
              primary={subject.subjectName}
              secondary={subject.subjectClass}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SubjectList;
