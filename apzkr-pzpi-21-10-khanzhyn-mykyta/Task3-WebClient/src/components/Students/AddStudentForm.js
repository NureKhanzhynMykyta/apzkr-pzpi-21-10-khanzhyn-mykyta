import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, MenuItem, Button } from '@mui/material';
import classService from '../../services/classService';
import studentService from '../../services/studentService';

const AddStudentForm = () => {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [classId, setClassId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await classService.getAllClasses();
        setClasses(classData);
      } catch (err) {
        setError('Не вдалося завантажити дані');
      }
    };

    fetchData();
  }, []);

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);

    try {
      const selectedClassObj = classes.find(cls => cls.className === selectedClass);
      if (selectedClassObj) {
        setClassId(selectedClassObj.id);
      } else {
        setClassId(null);
      }
    } catch (err) {
      setError('Не вдалося завантажити клас');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStudent = {
      name,
      surname,
      patronymic,
      number,
      email,
      password,
      birthDate,
      className: selectedClass,
      classId: classId,
      nfcId: "string"
    };

    console.log('Submitting new student: ', newStudent);

    try {
      await studentService.postStudent(newStudent);
      setSuccess('Учень успішно доданий');
      setError('');
    } catch (err) {
      setError('Не вдалося додати учня');
      setSuccess('');
      console.error('Error adding student:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Додати нового учня</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Ім'я"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Прізвище"
            variant="outlined"
            fullWidth
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="По-батькові"
            variant="outlined"
            fullWidth
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Номер телефону"
            variant="outlined"
            fullWidth
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Електронна пошта"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Пароль"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Дата народження"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Клас"
            variant="outlined"
            fullWidth
            value={selectedClass}
            onChange={handleClassChange}
            required
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
        <Button variant="contained" color="primary" type="submit">
          Додати учня
        </Button>
      </form>
    </Paper>
  );
};

export default AddStudentForm;
