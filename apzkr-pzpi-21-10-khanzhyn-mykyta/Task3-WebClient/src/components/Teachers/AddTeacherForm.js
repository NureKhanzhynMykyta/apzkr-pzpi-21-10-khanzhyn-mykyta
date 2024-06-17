import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import teacherService from '../../services/teacherService';

const AddTeacherForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTeacher = {
      name,
      surname,
      patronymic,
      number,
      email,
      password,
    };

    try {
      await teacherService.postTeacher(newTeacher);
      setSuccess('Вчитель успішно доданий');
      setError('');
    } catch (err) {
      setError('Не вдалося додати вчителя');
      setSuccess('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Додати нового вчителя</Typography>
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
        <Button variant="contained" color="primary" type="submit">
          Додати вчителя
        </Button>
      </form>
    </Paper>
  );
};

export default AddTeacherForm;
