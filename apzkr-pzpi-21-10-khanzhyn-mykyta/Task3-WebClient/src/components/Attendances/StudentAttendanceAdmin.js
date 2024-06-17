import React, { useEffect, useState } from 'react';
import { Paper, Typography, TextField, MenuItem, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import studentService from '../../services/studentService';
import attendanceService from '../../services/attendanceService';
import classService from '../../services/classService';

const StudentAttendanceAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendances, setAttendances] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await classService.getAllClasses();
        setClasses(classData);
        const studentData = await studentService.getAllStudents();
        setStudents(studentData);
        setFilteredStudents(studentData); // Set initial filtered students to all students
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
  };

  const handleViewAttendances = async () => {
    const student = filteredStudents.find(s => `${s.surname} ${s.name} ${s.patronymic}` === selectedStudent);

    if (!student) {
      setError('Обраний учень не знайдено');
      return;
    }

    try {
      const attendanceData = await attendanceService.getStudentAttendances(student.id);
      setAttendances(attendanceData);
      setError('');
    } catch (err) {
      setError('Не вдалося завантажити відвідування');
      setAttendances([]);
    }
  };

  const handleEditClick = (attendance) => {
    setSelectedAttendance(attendance);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (attendance) => {
    setSelectedAttendance(attendance);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await attendanceService.updateAttendance(selectedAttendance.id, selectedAttendance);
      setEditDialogOpen(false);
      handleViewAttendances(); // Refresh the attendance list
    } catch (err) {
      setError('Не вдалося оновити відвідування');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await attendanceService.deleteAttendance(selectedAttendance.id);
      setDeleteDialogOpen(false);
      handleViewAttendances(); // Refresh the attendance list
    } catch (err) {
      setError('Не вдалося видалити відвідування');
    }
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
  };

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setSelectedAttendance(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateTimeLocal = (dateTime) => {
    const date = new Date(dateTime);
    const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(date.getTime() - timezoneOffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Відвідування учня</Typography>
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
      <Button variant="contained" color="primary" onClick={handleViewAttendances}>
        Переглянути відвідування
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Час приходу</TableCell>
              <TableCell>Час відходу</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>{new Date(attendance.checkInTime).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(attendance.checkInTime).toLocaleTimeString()}</TableCell>
                <TableCell>{attendance.checkOutTime ? new Date(attendance.checkOutTime).toLocaleTimeString() : '---'}</TableCell>
                <TableCell>{attendance.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEditClick(attendance)}>Редагувати</Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteClick(attendance)}>Видалити</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Редагувати відвідування</DialogTitle>
        <DialogContent>
          <DialogContentText>Заповніть форму для оновлення відвідування</DialogContentText>
          <TextField
            margin="dense"
            label="Час приходу"
            type="datetime-local"
            fullWidth
            name="checkInTime"
            value={selectedAttendance ? formatDateTimeLocal(selectedAttendance.checkInTime) : ''}
            onChange={handleAttendanceChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Час відходу"
            type="datetime-local"
            fullWidth
            name="checkOutTime"
            value={selectedAttendance && selectedAttendance.checkOutTime ? formatDateTimeLocal(selectedAttendance.checkOutTime) : ''}
            onChange={handleAttendanceChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            margin="dense"
            label="Статус"
            fullWidth
            name="status"
            value={selectedAttendance ? selectedAttendance.status : ''}
            onChange={handleAttendanceChange}
            required
          >
            <MenuItem value="Присутній">Присутній</MenuItem>
            <MenuItem value="Відсутній">Відсутній</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Скасувати</Button>
          <Button onClick={handleEditSubmit} color="primary">Зберегти</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Видалити відвідування</DialogTitle>
        <DialogContent>
          <DialogContentText>Ви впевнені, що хочете видалити це відвідування?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Скасувати</Button>
          <Button onClick={handleDeleteSubmit} color="secondary">Видалити</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StudentAttendanceAdmin;
