import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, MenuItem, Button, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import teacherService from '../../services/teacherService';

const UpdateTeacherForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teacherData, setTeacherData] = useState(null);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teacherData = await teacherService.getAllTeachers();
        setTeachers(teacherData);
      } catch (err) {
        setError('Не вдалося завантажити дані');
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherChange = async (e) => {
    const selectedTeacherId = e.target.value;
    setSelectedTeacher(selectedTeacherId);

    try {
      const teacher = await teacherService.getTeacherById(selectedTeacherId);
      setTeacherData(teacher);
    } catch (err) {
      setError('Не вдалося завантажити дані вчителя');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setUpdatePassword(e.target.checked);
    if (!e.target.checked) {
      setTeacherData({
        ...teacherData,
        password: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await teacherService.updateTeacher(selectedTeacher, teacherData, updatePassword);
      setSuccess('Дані вчителя успішно оновлено');
      setError('');
    } catch (err) {
      setError('Не вдалося оновити дані вчителя');
      setSuccess('');
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await teacherService.deleteTeacher(selectedTeacher);
      setSuccess('Вчителя успішно видалено');
      setError('');
      setTeacherData(null);
      setSelectedTeacher('');
      const teacherData = await teacherService.getAllTeachers();
      setTeachers(teacherData);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Не вдалося видалити вчителя');
      setSuccess('');
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Оновити дані вчителя</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            select
            label="Вчитель"
            variant="outlined"
            fullWidth
            value={selectedTeacher}
            onChange={handleTeacherChange}
            required
          >
            <MenuItem value="">
              <em>Обрати вчителя</em>
            </MenuItem>
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {`${teacher.surname} ${teacher.name} ${teacher.patronymic}`}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        {teacherData && (
          <>
            <Box mb={2}>
              <TextField
                label="Ім'я"
                variant="outlined"
                fullWidth
                name="name"
                value={teacherData.name}
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
                value={teacherData.surname}
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
                value={teacherData.patronymic}
                onChange={handleInputChange}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Номер телефону"
                variant="outlined"
                fullWidth
                name="number"
                value={teacherData.number}
                onChange={handleInputChange}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Електронна пошта"
                variant="outlined"
                fullWidth
                name="email"
                value={teacherData.email}
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
                value={updatePassword ? teacherData.password : ''}
                onChange={handleInputChange}
                disabled={!updatePassword}
                required={updatePassword}
              />
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
              Оновити дані вчителя
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Видалити вчителя
            </Button>
          </>
        )}
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Видалити вчителя</DialogTitle>
        <DialogContent>
          <DialogContentText>Ви впевнені, що хочете видалити цього вчителя?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Скасувати</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Видалити</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UpdateTeacherForm;
