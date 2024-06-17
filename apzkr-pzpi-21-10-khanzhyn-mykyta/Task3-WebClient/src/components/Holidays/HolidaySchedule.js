import React, { useState, useEffect } from 'react';
import holidayService from '../../services/holidayService';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const HolidaySchedule = () => {
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Розклад канікул</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {holidays.map((holiday) => (
          <ListItem key={holiday.id}>
            <ListItemText
              primary={`${holiday.holidayName}`}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Початок: {new Date(holiday.startDate).toLocaleDateString()}<br />
                    Кінець: {new Date(holiday.endDate).toLocaleDateString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default HolidaySchedule;
