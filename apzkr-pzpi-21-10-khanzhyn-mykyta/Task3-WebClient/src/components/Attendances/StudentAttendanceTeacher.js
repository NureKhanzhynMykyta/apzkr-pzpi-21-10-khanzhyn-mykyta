import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import attendanceService from '../../services/attendanceService';
import classService from '../../services/classService';
import studentService from '../../services/studentService';

const StudentAttendanceTeacher = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendances, setAttendances] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await classService.getAllClasses();
        setClasses(classData);
        const studentData = await studentService.getAllStudents();
        setStudents(studentData);
        setFilteredStudents(studentData);
      } catch (err) {
        setError('Не вдалося завантажити дані');
      }
    };

    fetchData();
  }, []);

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    setSelectedStudent('');

    if (selectedClass === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => student.className === selectedClass);
      setFilteredStudents(filtered);
    }
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
    setAttendances([]);
    setStatistics(null);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleViewAttendance = async () => {
    const student = students.find(s => `${s.surname} ${s.name} ${s.patronymic}` === selectedStudent);

    if (!student) {
      setError('Обраний учень не знайдено');
      return;
    }

    try {
      const attendanceData = await attendanceService.getStudentAttendances(student.id, year);
      const statisticsData = await attendanceService.getAttendanceStatistics(student.id, year);
      setAttendances(attendanceData);
      setStatistics(statisticsData);
      setError('');
    } catch (err) {
      setError('Не вдалося завантажити відвідуваність');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Переглянути відвідуваність учня</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box mb={2}>
        <TextField
          select
          label="Клас"
          variant="outlined"
          fullWidth
          value={selectedClass}
          onChange={handleClassChange}
        >
          <MenuItem value="">
            <em>Обрати клас</em>
          </MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls.id} value={cls.className}>
              {cls.className}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box mb={2}>
        <TextField
          select
          label="Учень"
          variant="outlined"
          fullWidth
          value={selectedStudent}
          onChange={handleStudentChange}
          required
        >
          <MenuItem value="">
            <em>Обрати учня</em>
          </MenuItem>
          {filteredStudents.map((student) => (
            <MenuItem key={student.id} value={`${student.surname} ${student.name} ${student.patronymic}`}>
              {`${student.surname} ${student.name} ${student.patronymic}`}
            </MenuItem>
          ))}
        </TextField>
      </Box>
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
      <Button variant="contained" color="primary" onClick={handleViewAttendance}>
        Переглянути відвідуваність
      </Button>
      {statistics && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>Статистика відвідувань</Typography>
          <Box>
            <Typography>Ім'я: {statistics.studentName}</Typography>
            <Typography>Усього днів: {statistics.totalDays}</Typography>
            <Typography>Днів присутності: {statistics.presentDays}</Typography>
            <Typography>Днів відсутності: {statistics.absentDays}</Typography>
            <Typography>Відсоток відвідувань: {statistics.attendancePercentage}%</Typography>
          </Box>
        </Paper>
      )}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
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

export default StudentAttendanceTeacher;
