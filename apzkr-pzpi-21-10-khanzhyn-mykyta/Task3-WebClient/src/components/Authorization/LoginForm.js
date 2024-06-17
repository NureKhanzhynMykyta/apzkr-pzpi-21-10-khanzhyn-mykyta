import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { Container, Box, TextField, Button, Typography, MenuItem, Paper, FormControl, InputLabel, Select } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  let isMounted = true;

  useEffect(() => {
    return () => {
      // eslint-disable-next-line
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (role === 'student') {
        response = await authService.loginStudent({ email, password });
        localStorage.setItem('token', response.data.access_token);
        const userData = await authService.getStudentData();
        if (isMounted) {
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/student');
        }
      } else if (role === 'teacher') {
        // Спочатку спробуємо увійти як адміністратор
        try {
          response = await authService.loginAdmin({ username: email, password });
          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
          if (isMounted) {
            navigate('/admin');
          }
        } catch (adminError) {
          // Якщо авторизація адміністратора не вдалась, спробуємо увійти як вчитель
          response = await authService.loginTeacher({ email, password });
          localStorage.setItem('token', response.data.access_token);
          const userData = await authService.getTeacherData();
          if (isMounted) {
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/teacher');
          }
        }
      }
      setError('');
    } catch (err) {
      if (isMounted) {
        setError('Невірна адреса електронної пошти або пароль');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>Вхід</Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label={role === 'admin' ? 'Логін' : 'Пошта'}
              variant="outlined"
              fullWidth
              type="text"
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>Роль</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="student">Учень</MenuItem>
                <MenuItem value="teacher">Вчитель</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {error && <Typography color="error" align="center">{error}</Typography>}
          <Button variant="contained" color="primary" fullWidth type="submit">Login</Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
