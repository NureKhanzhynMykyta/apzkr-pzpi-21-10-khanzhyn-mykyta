import React, { useState } from 'react';
import authService from '../../services/authService';
import {
  TextField, Button, Box, Typography, Paper, Container
} from '@mui/material';

const EditTeacherForm = ({ user, onUpdate, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [patronymic, setPatronymic] = useState(user.patronymic);
  const [number, setNumber] = useState(user.number || '');
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editTeacherDto = {
      id: user.id,
      name,
      surname,
      patronymic,
      number,
      email,
      currentPassword,
      newPassword
    };

    let errors = {};
    if (newPassword.length > 0 && newPassword.length < 8) {
      errors.newPassword = 'Новий пароль повинен містити мінімум 8 символів';
    }
    if (currentPassword.length > 0 && newPassword.length === 0) {
      errors.newPassword = 'Введіть новий пароль';
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await authService.updateTeacherData(editTeacherDto);
      onUpdate();
      setError('');
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors) {
          setValidationErrors(data.errors);
        } else if (typeof data === 'string') {
          setError(data);
        } else if (data.error) {
          setError(data.error);
        } else if (data[""]) {
          setError(data[""][0]);
        } else {
          setError('Не вдалося оновити дані');
        }
      } else {
        setError('Не вдалося оновити дані');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>Редагувати дані</Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {validationErrors.name && <Typography color="error">{validationErrors.name}</Typography>}
          </Box>
          <Box mb={2}>
            <TextField
              label="Surname"
              variant="outlined"
              fullWidth
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            {validationErrors.surname && <Typography color="error">{validationErrors.surname}</Typography>}
          </Box>
          <Box mb={2}>
            <TextField
              label="Patronymic"
              variant="outlined"
              fullWidth
              type="text"
              value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
              required
            />
            {validationErrors.patronymic && <Typography color="error">{validationErrors.patronymic}</Typography>}
          </Box>
          <Box mb={2}>
            <TextField
              label="Number"
              variant="outlined"
              fullWidth
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            {validationErrors.number && <Typography color="error">{validationErrors.number}</Typography>}
          </Box>
          <Box mb={2}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {validationErrors.email && <Typography color="error">{validationErrors.email}</Typography>}
          </Box>
          <Box mb={2}>
            <TextField
              label="Current Password"
              variant="outlined"
              fullWidth
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {validationErrors.newPassword && <Typography color="error">{validationErrors.newPassword}</Typography>}
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" type="submit">Зберегти зміни</Button>
            <Button variant="contained" color="secondary" onClick={onCancel}>Відмінити</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditTeacherForm;
