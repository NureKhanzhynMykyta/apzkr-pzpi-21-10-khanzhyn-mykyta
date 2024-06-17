import React, { useState } from 'react';
import authService from '../../services/authService';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const EditStudentForm = ({ user, onUpdate, onCancel }) => {
  const [number, setNumber] = useState(user.number || '');
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editStudentDto = {
      id: user.id,
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
      await authService.updateStudentData(editStudentDto);
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
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Номер телефону"
            variant="outlined"
            fullWidth
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            error={!!validationErrors.number}
            helperText={validationErrors.number}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Пошта"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Поточний пароль"
            variant="outlined"
            fullWidth
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Новий пароль"
            variant="outlined"
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!validationErrors.newPassword}
            helperText={validationErrors.newPassword}
          />
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" type="submit">Зберегти зміни</Button>
          <Button variant="contained" color="secondary" onClick={onCancel}>Відмінити</Button>
        </Box>
      </form>
    </Paper>
  );
};

export default EditStudentForm;
