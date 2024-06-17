import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import classService from '../../services/classService';

const AddClassForm = () => {
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await classService.postClass({ className });
      setSuccess('Клас успішно створено');
      setClassName('');
    } catch (err) {
      setError('Не вдалося створити клас');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Додати новий клас</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Назва класу"
            variant="outlined"
            fullWidth
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">Додати клас</Button>
      </form>
    </Box>
  );
};

export default AddClassForm;
