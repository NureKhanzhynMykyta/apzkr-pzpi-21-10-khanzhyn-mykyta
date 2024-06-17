import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import holidayService from '../../services/holidayService';

const UpdateHolidayForm = () => {
  const [holidays, setHolidays] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const data = await holidayService.getAllHolidays();
        setHolidays(data);
      } catch (err) {
        setError('Не вдалося завантажити розклад канікул');
      }
    };

    fetchHolidays();
  }, []);

  const handleHolidayChange = (e) => {
    const holiday = holidays.find(h => h.id === e.target.value);
    setSelectedHoliday(holiday.id);
    setHolidayName(holiday.holidayName);
    setStartDate(holiday.startDate.split('T')[0]);
    setEndDate(holiday.endDate.split('T')[0]);
  };

  const handleUpdateHoliday = async () => {
    try {
      await holidayService.updateHoliday(selectedHoliday, { id: selectedHoliday, holidayName, startDate, endDate });
      setSuccess('Канікули успішно оновлено');
      setError('');
    } catch (err) {
      setError('Не вдалося оновити канікули');
      setSuccess('');
    }
  };

  const handleDeleteHoliday = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await holidayService.deleteHoliday(selectedHoliday);
      setSuccess('Канікули успішно видалено');
      setError('');
      setHolidays(holidays.filter(h => h.id !== selectedHoliday));
      setSelectedHoliday('');
      setHolidayName('');
      setStartDate('');
      setEndDate('');
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Не вдалося видалити канікули');
      setSuccess('');
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Оновити або видалити канікули</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <Box mb={2}>
        <TextField
          select
          label="Канікули"
          variant="outlined"
          fullWidth
          value={selectedHoliday}
          onChange={handleHolidayChange}
          required
        >
          <MenuItem value="">
            <em>Обрати канікули</em>
          </MenuItem>
          {holidays.map((holiday) => (
            <MenuItem key={holiday.id} value={holiday.id}>
              {holiday.holidayName}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {selectedHoliday && (
        <>
          <Box mb={2}>
            <TextField
              label="Назва канікул"
              variant="outlined"
              fullWidth
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Дата початку"
              type="date"
              variant="outlined"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Дата закінчення"
              type="date"
              variant="outlined"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleUpdateHoliday} sx={{ mr: 2 }}>Оновити канікули</Button>
          <Button variant="contained" color="error" onClick={handleDeleteHoliday}>Видалити канікули</Button>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Видалити канікули</DialogTitle>
        <DialogContent>
          <DialogContentText>Ви впевнені, що хочете видалити ці канікули?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Скасувати</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Видалити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateHolidayForm;
