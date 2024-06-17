import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditTeacherForm from '../components/Teachers/EditTeacherForm';
import GradeAssignmentForm from '../components/Grades/GradeAssignmentForm';
import GradeUpdateForm from '../components/Grades/GradeUpdateForm';
import StudentGradeBook from '../components/Grades/StudentGradeBook';
import TeacherAnnualAverageGrade from '../components/Grades/TeacherAnnualAverageGrade';
import AddStudentForm from '../components/Students/AddStudentForm';
import HolidaySchedule from '../components/Holidays/HolidaySchedule';
import StudentAttendanceTeacher from '../components/Attendances/StudentAttendanceTeacher';
import UpdateStudentForm from '../components/Students/UpdateStudentForm';
import authService from '../services/authService';
import { Container, Typography, Button, Box, AppBar, Toolbar, Grid, Paper } from '@mui/material';

const TeacherPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [viewingGrades, setViewingGrades] = useState(false);
  const [updatingGrades, setUpdatingGrades] = useState(false);
  const [viewingAnnualGrade, setViewingAnnualGrade] = useState(false);
  const [viewingGradeBook, setViewingGradeBook] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);
  const [viewingHolidaySchedule, setViewingHolidaySchedule] = useState(false);
  const [viewingAttendance, setViewingAttendance] = useState(false);
  const [updatingStudent, setUpdatingStudent] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    const updatedUser = await authService.getTeacherData();
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleViewGrades = () => {
    setViewingGrades(true);
    setUpdatingGrades(false);
    setViewingAnnualGrade(false);
    setViewingGradeBook(false);
    setAddingStudent(false);
    setViewingHolidaySchedule(false);
    setViewingAttendance(false);
    setUpdatingStudent(false);
  };

  const handleUpdateGrades = () => {
    setUpdatingGrades(true);
    setViewingGrades(false);
    setViewingAnnualGrade(false);
    setViewingGradeBook(false);
    setAddingStudent(false);
    setViewingHolidaySchedule(false);
    setViewingAttendance(false);
    setUpdatingStudent(false);
  };

  const handleViewAnnualGrade = () => {
    setViewingAnnualGrade(true);
    setViewingGrades(false);
    setUpdatingGrades(false);
    setViewingGradeBook(false);
    setAddingStudent(false);
    setViewingHolidaySchedule(false);
    setViewingAttendance(false);
    setUpdatingStudent(false);
  };

  const handleViewGradeBook = () => {
    setViewingGradeBook(true);
    setViewingGrades(false);
    setUpdatingGrades(false);
    setViewingAnnualGrade(false);
    setAddingStudent(false);
    setViewingHolidaySchedule(false);
    setViewingAttendance(false);
    setUpdatingStudent(false);
  };

  const handleAddStudent = () => {
    setAddingStudent(true);
    setViewingGrades(false);
    setUpdatingGrades(false);
    setViewingAnnualGrade(false);
    setViewingGradeBook(false);
    setViewingHolidaySchedule(false);
    setViewingAttendance(false);
    setUpdatingStudent(false);
  };

  const handleViewHolidaySchedule = () => {
    setViewingHolidaySchedule(true);
    setAddingStudent(false);
    setViewingGrades(false);
    setUpdatingGrades(false);
    setViewingAnnualGrade(false);
    setViewingGradeBook(false);
    setViewingAttendance(false);
    setUpdatingStudent(false);
  };

  const handleViewAttendance = () => {
    setViewingAttendance(true);
    setViewingHolidaySchedule(false);
    setAddingStudent(false);
    setViewingGrades(false);
    setUpdatingGrades(false);
    setViewingAnnualGrade(false);
    setViewingGradeBook(false);
    setUpdatingStudent(false);
  };

  const handleUpdateStudent = () => {
    setUpdatingStudent(true);
    setViewingAttendance(false);
    setViewingHolidaySchedule(false);
    setAddingStudent(false);
    setViewingGrades(false);
    setUpdatingGrades(false);
    setViewingAnnualGrade(false);
    setViewingGradeBook(false);
  };

  const handleHideForms = () => {
    setViewingGrades(false);
    setUpdatingGrades(false);
    setViewingAnnualGrade(false);
    setViewingGradeBook(false);
    setAddingStudent(false);
    setViewingHolidaySchedule(false);
    setViewingAttendance(false);
    setUpdatingStudent(false);
  };

  return (
    <Container>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleEditClick}>
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
          variant={viewingGrades ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewGrades}
        >
          Проставити оцінки
        </Button>
        <Button
          variant={updatingGrades ? "contained" : "outlined"}
          color="primary"
          onClick={handleUpdateGrades}
        >
          Оновити оцінки
        </Button>
        <Button
          variant={viewingGradeBook ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewGradeBook}
        >
          Переглянути журнал оцінок
        </Button>
        <Button
          variant={viewingAnnualGrade ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewAnnualGrade}
        >
          Розрахувати річну оцінку
        </Button>
        <Button
          variant={viewingHolidaySchedule ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewHolidaySchedule}
        >
          Розклад канікул
        </Button>
        <Button
          variant={viewingAttendance ? "contained" : "outlined"}
          color="primary"
          onClick={handleViewAttendance}
        >
          Відвідуваність учня
        </Button>
        <Button
          variant={addingStudent ? "contained" : "outlined"}
          color="primary"
          onClick={handleAddStudent}
        >
          Додати учня
        </Button>
        <Button
          variant={updatingStudent ? "contained" : "outlined"}
          color="primary"
          onClick={handleUpdateStudent}
        >
          Оновити дані учня
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Вітаємо, {user.name} {user.surname} {user.patronymic}</Typography>
        <Typography>Номер телефону: {user.number}</Typography>
        <Typography>Електронна пошта: {user.email}</Typography>
        {isEditing ? (
          <EditTeacherForm user={user} onUpdate={handleUpdate} onCancel={handleCancel} />
        ) : (
          <>
            {viewingGrades && (
              <>
                <GradeAssignmentForm />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати форму оцінок
                </Button>
              </>
            )}
            {updatingGrades && (
              <>
                <GradeUpdateForm />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати форму оновлення оцінок
                </Button>
              </>
            )}
            {viewingAnnualGrade && (
              <>
                <TeacherAnnualAverageGrade />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати форму річної оцінки
                </Button>
              </>
            )}
            {viewingGradeBook && (
              <>
                <StudentGradeBook />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати журнал оцінок
                </Button>
              </>
            )}
            {addingStudent && (
              <>
                <AddStudentForm />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати форму додавання учня
                </Button>
              </>
            )}
            {viewingHolidaySchedule && (
              <>
                <HolidaySchedule />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати розклад канікул
                </Button>
              </>
            )}
            {viewingAttendance && (
              <>
                <StudentAttendanceTeacher />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати форму відвідуваності
                </Button>
              </>
            )}
            {updatingStudent && (
              <>
                <UpdateStudentForm />
                <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
                  Приховати форму оновлення даних учня
                </Button>
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default TeacherPage;
