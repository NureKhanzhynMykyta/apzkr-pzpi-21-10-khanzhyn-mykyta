import React, { useState, useEffect } from 'react';
import classService from '../../services/classService';
import { Box, Typography, Paper, TextField, MenuItem, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const UpdateClassForm = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getAllClasses();
        setClasses(data);
      } catch (err) {
        setError('Не вдалося завантажити список класів');
      }
    };

    fetchClasses();
  }, []);

  const handleClassChange = (e) => {
    const selectedClass = classes.find(cls => cls.id === e.target.value);
    setSelectedClass(selectedClass.id);
    setClassName(selectedClass.className);
  };

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleUpdateClass = async () => {
    try {
      await classService.updateClass({ id: selectedClass, className });
      setSuccess('Клас успішно оновлено');
      setError('');
    } catch (err) {
      setError('Не вдалося оновити клас');
      setSuccess('');
    }
  };

  const handleDeleteClass = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await classService.deleteClass(selectedClass);
      setClasses(classes.filter(cls => cls.id !== selectedClass));
      setSelectedClass('');
      setClassName('');
      setSuccess('Клас успішно видалено');
      setError('');
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Не вдалося видалити клас');
      setSuccess('');
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Оновити або видалити клас</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
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
            <MenuItem key={cls.id} value={cls.id}>
              {cls.className}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box mb={2}>
        <TextField
          label="Назва класу"
          variant="outlined"
          fullWidth
          value={className}
          onChange={handleClassNameChange}
          required
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleUpdateClass} sx={{ mr: 2 }}>
        Оновити клас
      </Button>
      <Button variant="contained" color="error" onClick={handleDeleteClass}>
        Видалити клас
      </Button>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Видалити клас</DialogTitle>
        <DialogContent>
          <DialogContentText>Ви впевнені, що хочете видалити цей клас?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Скасувати</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Видалити</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UpdateClassForm;
