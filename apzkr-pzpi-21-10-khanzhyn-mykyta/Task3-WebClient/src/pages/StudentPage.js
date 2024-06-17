import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import EditStudentForm from '../components/Students/EditStudentForm';
import StudentAttendance from '../components/Attendances/StudentAttendance';
import AttendanceStatistics from '../components/Attendances/AttendanceStatistics';
import ClassmatesList from '../components/Students/ClassmatesList';
import StudentGrades from '../components/Grades/StudentGrades';
import AnnualAverageGrade from '../components/Grades/AnnualAverageGrade';
import HolidaySchedule from '../components/Holidays/HolidaySchedule';
import {
  Container, Typography, Button, Box, Paper, Link, AppBar, Toolbar, Grid
} from '@mui/material';

const StudentPage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewingAttendance, setViewingAttendance] = useState(false);
  const [viewingStatistics, setViewingStatistics] = useState(false);
  const [viewingGrades, setViewingGrades] = useState(false);
  const [viewingAnnualGrade, setViewingAnnualGrade] = useState(false);
  const [viewingClassmates, setViewingClassmates] = useState(false);
  const [viewingHolidaySchedule, setViewingHolidaySchedule] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authService.getStudentData();
        setUser(data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    setIsEditing(false);
    const data = await authService.getStudentData();
    setUser(data);
  };

  const handleViewAttendance = () => {
    setViewingAttendance(true);
    setViewingStatistics(false);
    setViewingGrades(false);
    setViewingAnnualGrade(false);
    setViewingClassmates(false);
    setViewingHolidaySchedule(false);
  };

  const handleViewStatistics = () => {
    setViewingStatistics(true);
    setViewingAttendance(false);
    setViewingGrades(false);
    setViewingAnnualGrade(false);
    setViewingClassmates(false);
    setViewingHolidaySchedule(false);
  };

  const handleViewGrades = () => {
    setViewingGrades(true);
    setViewingAttendance(false);
    setViewingStatistics(false);
    setViewingAnnualGrade(false);
    setViewingClassmates(false);
    setViewingHolidaySchedule(false);
  };

  const handleViewAnnualGrade = () => {
    setViewingAnnualGrade(true);
    setViewingAttendance(false);
    setViewingStatistics(false);
    setViewingGrades(false);
    setViewingClassmates(false);
    setViewingHolidaySchedule(false);
  };

  const handleViewClassmates = () => {
    setViewingClassmates(true);
    setViewingAttendance(false);
    setViewingStatistics(false);
    setViewingGrades(false);
    setViewingAnnualGrade(false);
    setViewingHolidaySchedule(false);
  };

  const handleViewHolidaySchedule = () => {
    setViewingHolidaySchedule(true);
    setViewingClassmates(false);
    setViewingAttendance(false);
    setViewingStatistics(false);
    setViewingGrades(false);
    setViewingAnnualGrade(false);
  };

  const handleHideForms = () => {
    setViewingAttendance(false);
    setViewingStatistics(false);
    setViewingGrades(false);
    setViewingAnnualGrade(false);
    setViewingClassmates(false);
    setViewingHolidaySchedule(false);
  };

  const renderActiveView = () => {
    switch (true) {
      case viewingAttendance:
        return (
          <>
            <StudentAttendance studentId={user.id} />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму відвідування
            </Button>
          </>
        );
      case viewingStatistics:
        return (
          <>
            <AttendanceStatistics studentId={user.id} />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати статистику відвідування
            </Button>
          </>
        );
      case viewingGrades:
        return (
          <>
            <StudentGrades studentId={user.id} studentFullName={`${user.surname} ${user.name} ${user.patronymic}`} />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати щоденник з оцінками
            </Button>
          </>
        );
      case viewingAnnualGrade:
        return (
          <>
            <AnnualAverageGrade studentId={user.id} />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати річну оцінку за предметом
            </Button>
          </>
        );
      case viewingClassmates:
        return (
          <>
            <ClassmatesList className={user.className} />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати список однокласників
            </Button>
          </>
        );
      case viewingHolidaySchedule:
        return (
          <>
            <HolidaySchedule />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати розклад канікул
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <AppBar position="static" color="default" sx={{ mb: 3, backgroundColor: '#87CEFA' }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleEdit}>
                Редагувати дані
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Вийти
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 3, display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant={viewingAttendance ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewAttendance}
        >
          Переглянути відвідування
        </Button>
        <Button
          variant={viewingStatistics ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewStatistics}
        >
          Переглянути статистику відвідувань
        </Button>
        <Button
          variant={viewingGrades ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewGrades}
        >
          Переглянути щоденник з оцінками
        </Button>
        <Button
          variant={viewingAnnualGrade ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewAnnualGrade}
        >
          Переглянути річну оцінку за предметом
        </Button>
        <Button
          variant={viewingClassmates ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewClassmates}
        >
          Переглянути однокласників
        </Button>
        <Button
          variant={viewingHolidaySchedule ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewHolidaySchedule}
        >
          Переглянути розклад канікул
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Вітаємо, {user.name} {user.surname} {user.patronymic}</Typography>
        <Typography>Номер телефону: {user.number}</Typography>
        <Typography>Електронна пошта: {user.email}</Typography>
        <Typography>Клас: <Link component="button" onClick={handleViewClassmates}>{user.className}</Link></Typography>
        <Box sx={{ mt: 3 }}>
          {isEditing ? (
            <EditStudentForm user={user} onUpdate={handleUpdate} onCancel={handleCancelEdit} />
          ) : null}
          {renderActiveView()}
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentPage;
