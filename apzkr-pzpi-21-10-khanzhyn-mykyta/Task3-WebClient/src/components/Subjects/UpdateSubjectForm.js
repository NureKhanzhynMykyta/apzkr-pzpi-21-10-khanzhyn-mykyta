import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import subjectService from '../../services/subjectService';

const UpdateSubjectForm = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectClass, setSubjectClass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectService.getAllSubjects();
        setSubjects(data);
      } catch (err) {
        setError('Не вдалося завантажити предмети');
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectChange = (e) => {
    const selected = subjects.find(subject => subject.id === e.target.value);
    setSelectedSubject(selected.id);
    setSubjectName(selected.subjectName);
    setSubjectClass(selected.subjectClass);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await subjectService.updateSubject(selectedSubject, { id: selectedSubject, subjectName, subjectClass });
      setSuccess('Предмет успішно оновлено');
      setError('');
    } catch (err) {
      setError('Не вдалося оновити предмет');
      setSuccess('');
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await subjectService.deleteSubject(selectedSubject);
      setSuccess('Предмет успішно видалено');
      setError('');
      setSubjectName('');
      setSubjectClass('');
      setSelectedSubject('');
      const updatedSubjects = await subjectService.getAllSubjects();
      setSubjects(updatedSubjects);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Не вдалося видалити предмет');
      setSuccess('');
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Оновити або видалити предмет</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleUpdate}>
        <Box mb={2}>
          <TextField
            select
            label="Оберіть предмет"
            variant="outlined"
            fullWidth
            value={selectedSubject}
            onChange={handleSubjectChange}
            required
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {`${subject.subjectName} (${subject.subjectClass})`}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            label="Назва предмета"
            variant="outlined"
            fullWidth
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Клас предмета"
            variant="outlined"
            fullWidth
            value={subjectClass}
            onChange={(e) => setSubjectClass(e.target.value)}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
          Оновити предмет
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Видалити предмет
        </Button>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Видалити предмет</DialogTitle>
        <DialogContent>
          <DialogContentText>Ви впевнені, що хочете видалити цей предмет?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Скасувати</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Видалити</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UpdateSubjectForm;
