import React, { useState, useEffect } from 'react';
import attendanceService from '../../services/attendanceService';
import {
  Box, Typography, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

const StudentAttendance = ({ studentId }) => {
  const [attendances, setAttendances] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');

  const fetchAttendances = async (studentId, year) => {
    try {
      const data = await attendanceService.getStudentAttendances(studentId, year);
      setAttendances(data);
    } catch (err) {
      setError('Не вдалося завантажити відвідування');
    }
  };

  useEffect(() => {
    fetchAttendances(studentId, year);
  }, [studentId, year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Відвідування учня</Typography>
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Час входу</TableCell>
              <TableCell>Час виходу</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendances.map((att) => (
              <TableRow key={att.id}>
                <TableCell>{new Date(att.checkInTime).toLocaleDateString()}</TableCell>
                <TableCell>{att.status}</TableCell>
                <TableCell>{att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString() : '-'}</TableCell>
                <TableCell>{att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StudentAttendance;
