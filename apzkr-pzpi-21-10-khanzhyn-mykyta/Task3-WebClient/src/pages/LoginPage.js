import React from 'react';
import LoginForm from '../components/Authorization/LoginForm';
import { Container, Typography } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        StudCheck
      </Typography>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
