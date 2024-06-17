import React, { useState, useEffect } from 'react';
import attendanceService from '../../services/attendanceService';
import { Box, Typography, Paper, TextField } from '@mui/material';

const AttendanceStatistics = ({ studentId }) => {
  const [statistics, setStatistics] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');

  const fetchStatistics = async (studentId, year) => {
    try {
      const data = await attendanceService.getAttendanceStatistics(studentId, year);
      setStatistics(data);
    } catch (err) {
      setError('Не вдалося завантажити статистику відвідувань');
    }
  };

  useEffect(() => {
    fetchStatistics(studentId, year);
  }, [studentId, year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Статистика відвідувань</Typography>
      <Box mb={2}>
        <TextField
          label="Оберіть рік"
          variant="outlined"
          fullWidth
          type="number"
          value={year}
          onChange={handleYearChange}
          inputProps={{ min: 2000, max: new Date().getFullYear() }}
        />
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {statistics && (
        <Box>
          <Typography>Ім'я: {statistics.studentName}</Typography>
          <Typography>Усього днів: {statistics.totalDays}</Typography>
          <Typography>Днів присутності: {statistics.presentDays}</Typography>
          <Typography>Днів відсутності: {statistics.absentDays}</Typography>
          <Typography>Відсоток відвідувань: {statistics.attendancePercentage}%</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AttendanceStatistics;
