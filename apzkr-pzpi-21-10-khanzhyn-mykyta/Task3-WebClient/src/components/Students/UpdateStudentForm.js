import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, MenuItem, Button, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import studentService from '../../services/studentService';
import classService from '../../services/classService';

const UpdateStudentForm = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await classService.getAllClasses();
        setClasses(classData);
        const studentData = await studentService.getAllStudents();
        setStudents(studentData);
        setFilteredStudents(studentData); // Set the initial filtered students list to all students
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

  const handleStudentChange = async (e) => {
    const selectedStudentId = e.target.value;
    setSelectedStudent(selectedStudentId);

    try {
      const student = await studentService.getStudentById(selectedStudentId);
      setStudentData(student);
    } catch (err) {
      setError('Не вдалося завантажити дані учня');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
  };

  const handleClassSelectionChange = (e) => {
    const selectedClassId = e.target.value;
    const selectedClass = classes.find(cls => cls.id === selectedClassId);
    setStudentData({
      ...studentData,
      classId: selectedClassId,
      className: selectedClass ? selectedClass.className : '',
    });
  };

  const handleCheckboxChange = (e) => {
    setUpdatePassword(e.target.checked);
    if (!e.target.checked) {
      setStudentData({
        ...studentData,
        password: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await studentService.updateStudent(selectedStudent, studentData, updatePassword);
      setSuccess('Дані учня успішно оновлено');
      setError('');
    } catch (err) {
      setError('Не вдалося оновити дані учня');
      setSuccess('');
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await studentService.deleteStudent(selectedStudent);
      setSuccess('Учня успішно видалено');
      setError('');
      setStudentData(null);
      setSelectedStudent('');
      const studentData = await studentService.getAllStudents();
      setStudents(studentData);
      setFilteredStudents(selectedClass ? studentData.filter(student => student.className === selectedClass) : studentData);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Не вдалося видалити учня');
      setSuccess('');
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Оновити дані учня</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
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
              <MenuItem key={student.id} value={student.id}>
                {`${student.surname} ${student.name} ${student.patronymic}`}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        {studentData && (
          <>
            <Box mb={2}>
              <TextField
                label="Ім'я"
                variant="outlined"
                fullWidth
                name="name"
                value={studentData.name}
                onChange={handleInputChange}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Прізвище"
                variant="outlined"
                fullWidth
                name="surname"
                value={studentData.surname}
                onChange={handleInputChange}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="По-батькові"
                variant="outlined"
                fullWidth
                name="patronymic"
                value={studentData.patronymic}
                onChange={handleInputChange}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Номер телефону"
                variant="outlined"
                fullWidth
                name="number"
                value={studentData.number}
                onChange={handleInputChange}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Електронна пошта"
                variant="outlined"
                fullWidth
                name="email"
                value={studentData.email}
                onChange={handleInputChange}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Пароль"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={updatePassword ? studentData.password : ''}
                onChange={handleInputChange}
                disabled={!updatePassword}
                required={updatePassword}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Дата народження"
                type="date"
                variant="outlined"
                fullWidth
                name="birthDate"
                value={studentData.birthDate.slice(0, 10)}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="NFC ID"
                variant="outlined"
                fullWidth
                name="nfcId"
                value={studentData.nfcId}
                onChange={handleInputChange}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                select
                label="Клас"
                variant="outlined"
                fullWidth
                name="classId"
                value={studentData.classId || ''}
                onChange={handleClassSelectionChange}
                required
              >
                <MenuItem value="">
                  <em>Обрати клас</em>
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.className}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={updatePassword}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                label="Оновити пароль"
              />
            </Box>
            <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
              Оновити дані учня
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Видалити учня
            </Button>
          </>
        )}
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Видалити учня</DialogTitle>
        <DialogContent>
          <DialogContentText>Ви впевнені, що хочете видалити цього учня?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Скасувати</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Видалити</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UpdateStudentForm;
