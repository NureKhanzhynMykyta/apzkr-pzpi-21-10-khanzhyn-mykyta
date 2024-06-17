import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import subjectService from '../../services/subjectService';

const AddSubjectForm = () => {
  const [subjectName, setSubjectName] = useState('');
  const [subjectClass, setSubjectClass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subjectService.postSubject({ subjectName, subjectClass });
      setSuccess('Предмет успішно створений');
      setSubjectName('');
      setSubjectClass('');
      setError('');
    } catch (err) {
      setError('Не вдалося створити предмет');
      setSuccess('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Додати новий предмет</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Назва предмета"
            variant="outlined"
            fullWidth
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Клас предмета"
            variant="outlined"
            fullWidth
            value={subjectClass}
            onChange={(e) => setSubjectClass(e.target.value)}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Додати предмет
        </Button>
      </form>
    </Paper>
  );
};

export default AddSubjectForm;
