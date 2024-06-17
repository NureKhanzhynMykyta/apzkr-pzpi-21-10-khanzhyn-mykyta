import React, { useState, useEffect } from 'react';
import classService from '../../services/classService';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getAllClasses();
        setClasses(data);
      } catch (err) {
        setError('Не вдалося завантажити список класів');
      }
    };

    fetchClasses();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Список класів</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {classes.map((classItem) => (
          <ListItem key={classItem.id}>
            <ListItemText primary={classItem.className} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ClassList;
