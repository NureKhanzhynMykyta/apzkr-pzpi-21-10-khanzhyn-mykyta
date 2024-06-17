import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import holidayService from '../../services/holidayService';

const AddHolidayForm = () => {
  const [holidayName, setHolidayName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newHoliday = {
      holidayName,
      startDate,
      endDate,
    };

    try {
      await holidayService.postHoliday(newHoliday);
      setSuccess('Канікули успішно створені');
      setError('');
    } catch (err) {
      setError('Не вдалося створити канікули');
      setSuccess('');
      console.error('Error creating holiday:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Додати нові канікули</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Назва канікул"
            variant="outlined"
            fullWidth
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Дата початку"
            variant="outlined"
            fullWidth
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Дата закінчення"
            variant="outlined"
            fullWidth
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">Додати канікули</Button>
      </form>
    </Paper>
  );
};

export default AddHolidayForm;
