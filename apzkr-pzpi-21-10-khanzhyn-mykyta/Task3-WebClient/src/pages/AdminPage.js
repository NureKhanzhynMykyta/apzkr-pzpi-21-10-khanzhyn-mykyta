import React, { useState } from 'react';
import { Container, Typography, Paper, AppBar, Toolbar, Grid, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddHolidayForm from '../components/Holidays/AddHolidayForm';
import UpdateHolidayForm from '../components/Holidays/UpdateHolidayForm';
import HolidaySchedule from '../components/Holidays/HolidaySchedule';
import AddClassForm from '../components/Classes/AddClassForm';
import ClassList from '../components/Classes/ClassList';
import UpdateClassForm from '../components/Classes/UpdateClassForm';
import SubjectList from '../components/Subjects/SubjectList';
import AddSubjectForm from '../components/Subjects/AddSubjectForm';
import UpdateSubjectForm from '../components/Subjects/UpdateSubjectForm';
import StudentList from '../components/Students/StudentList';
import AddStudentForm from '../components/Students/AddStudentForm';
import UpdateStudentForm from '../components/Students/UpdateStudentForm';
import TeacherList from '../components/Teachers/TeacherList';
import AddTeacherForm from '../components/Teachers/AddTeacherForm';
import UpdateTeacherForm from '../components/Teachers/UpdateTeacherForm';
import AddGradeForm from '../components/Grades/AddGradeForm';
import StudentGradeBook from '../components/Grades/StudentGradeBook';
import GradeAdminUpdateForm from '../components/Grades/GradeAdminUpdateForm';
import StudentAttendanceAdmin from '../components/Attendances/StudentAttendanceAdmin';

const AdminPage = () => {
  const navigate = useNavigate();
  const [viewingAddHolidayForm, setViewingAddHolidayForm] = useState(false);
  const [viewingUpdateHolidayForm, setViewingUpdateHolidayForm] = useState(false);
  const [viewingHolidaySchedule, setViewingHolidaySchedule] = useState(false);
  const [viewingAddClassForm, setViewingAddClassForm] = useState(false);
  const [viewingClassList, setViewingClassList] = useState(false);
  const [viewingUpdateClassForm, setViewingUpdateClassForm] = useState(false);
  const [viewingSubjectList, setViewingSubjectList] = useState(false);
  const [viewingAddSubjectForm, setViewingAddSubjectForm] = useState(false);
  const [viewingUpdateSubjectForm, setViewingUpdateSubjectForm] = useState(false);
  const [viewingStudentList, setViewingStudentList] = useState(false);
  const [viewingAddStudentForm, setViewingAddStudentForm] = useState(false);
  const [viewingUpdateStudentForm, setViewingUpdateStudentForm] = useState(false);
  const [viewingTeacherList, setViewingTeacherList] = useState(false);
  const [viewingAddTeacherForm, setViewingAddTeacherForm] = useState(false);
  const [viewingUpdateTeacherForm, setViewingUpdateTeacherForm] = useState(false);
  const [viewingAddGradeForm, setViewingAddGradeForm] = useState(false);
  const [viewingGradeBook, setViewingGradeBook] = useState(false);
  const [viewingGradeAdminUpdateForm, setViewingGradeAdminUpdateForm] = useState(false);
  const [viewingStudentAttendance, setViewingStudentAttendance] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleViewAddHolidayForm = () => {
    setViewingAddHolidayForm(true);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingAddClassForm(false);
    setViewingClassList(false);
    setViewingUpdateClassForm(false);
    setViewingSubjectList(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewUpdateHolidayForm = () => {
    setViewingUpdateHolidayForm(true);
    setViewingAddHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingAddClassForm(false);
    setViewingClassList(false);
    setViewingUpdateClassForm(false);
    setViewingSubjectList(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewHolidaySchedule = () => {
    setViewingHolidaySchedule(true);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingAddClassForm(false);
    setViewingClassList(false);
    setViewingUpdateClassForm(false);
    setViewingSubjectList(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewAddClassForm = () => {
    setViewingAddClassForm(true);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingClassList(false);
    setViewingUpdateClassForm(false);
    setViewingSubjectList(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewClassList = () => {
    setViewingClassList(true);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingUpdateClassForm(false);
    setViewingSubjectList(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewUpdateClassForm = () => {
    setViewingUpdateClassForm(true);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingSubjectList(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewSubjectList = () => {
    setViewingSubjectList(true);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewAddSubjectForm = () => {
    setViewingAddSubjectForm(true);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewUpdateSubjectForm = () => {
    setViewingUpdateSubjectForm(true);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewStudentList = () => {
    setViewingStudentList(true);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewAddStudentForm = () => {
    setViewingAddStudentForm(true);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewUpdateStudentForm = () => {
    setViewingUpdateStudentForm(true);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewTeacherList = () => {
    setViewingTeacherList(true);
    setViewingUpdateStudentForm(false);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewAddTeacherForm = () => {
    setViewingAddTeacherForm(true);
    setViewingTeacherList(false);
    setViewingUpdateStudentForm(false);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewUpdateTeacherForm = () => {
    setViewingUpdateTeacherForm(true);
    setViewingAddTeacherForm(false);
    setViewingTeacherList(false);
    setViewingUpdateStudentForm(false);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewAddGradeForm = () => {
    setViewingAddGradeForm(true);
    setViewingUpdateTeacherForm(false);
    setViewingAddTeacherForm(false);
    setViewingTeacherList(false);
    setViewingUpdateStudentForm(false);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewGradeBook = () => {
    setViewingGradeBook(true);
    setViewingAddGradeForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddTeacherForm(false);
    setViewingTeacherList(false);
    setViewingUpdateStudentForm(false);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  const handleViewGradeAdminUpdateForm = () => {
    setViewingGradeAdminUpdateForm(true);
    setViewingGradeBook(false);
    setViewingAddGradeForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddTeacherForm(false);
    setViewingTeacherList(false);
    setViewingUpdateStudentForm(false);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingStudentAttendance(false);
  };

  const handleViewStudentAttendance = () => {
    setViewingStudentAttendance(true);
    setViewingGradeAdminUpdateForm(false);
    setViewingGradeBook(false);
    setViewingAddGradeForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddTeacherForm(false);
    setViewingTeacherList(false);
    setViewingUpdateStudentForm(false);
    setViewingAddStudentForm(false);
    setViewingStudentList(false);
    setViewingUpdateSubjectForm(false);
    setViewingAddSubjectForm(false);
    setViewingSubjectList(false);
    setViewingUpdateClassForm(false);
    setViewingClassList(false);
    setViewingAddClassForm(false);
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
  };

  const handleHideForms = () => {
    setViewingAddHolidayForm(false);
    setViewingUpdateHolidayForm(false);
    setViewingHolidaySchedule(false);
    setViewingAddClassForm(false);
    setViewingClassList(false);
    setViewingUpdateClassForm(false);
    setViewingSubjectList(false);
    setViewingAddSubjectForm(false);
    setViewingUpdateSubjectForm(false);
    setViewingStudentList(false);
    setViewingAddStudentForm(false);
    setViewingUpdateStudentForm(false);
    setViewingTeacherList(false);
    setViewingAddTeacherForm(false);
    setViewingUpdateTeacherForm(false);
    setViewingAddGradeForm(false);
    setViewingGradeBook(false);
    setViewingGradeAdminUpdateForm(false);
    setViewingStudentAttendance(false);
  };

  return (
    <Container>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">Адміністратор</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Вийти
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" gutterBottom>Вітаємо на сторінці адміністратора</Typography>
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: 'column' }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">Канікули</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={viewingHolidaySchedule ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewHolidaySchedule}
            >
              Переглянути всі канікули
            </Button>
            <Button
              variant={viewingAddHolidayForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewAddHolidayForm}
            >
              Додати канікули
            </Button>
            <Button
              variant={viewingUpdateHolidayForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewUpdateHolidayForm}
            >
              Оновити або видалити канікули
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">Класи</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={viewingClassList ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewClassList}
            >
              Переглянути всі класи
            </Button>
            <Button
              variant={viewingAddClassForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewAddClassForm}
            >
              Додати клас
            </Button>
            <Button
              variant={viewingUpdateClassForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewUpdateClassForm}
            >
              Оновити або видалити клас
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">Предмети</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={viewingSubjectList ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewSubjectList}
            >
              Переглянути всі предмети
            </Button>
            <Button
              variant={viewingAddSubjectForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewAddSubjectForm}
            >
              Додати предмет
            </Button>
            <Button
              variant={viewingUpdateSubjectForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewUpdateSubjectForm}
            >
              Оновити або видалити предмет
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">Учні</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={viewingStudentList ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewStudentList}
            >
              Переглянути всіх учнів
            </Button>
            <Button
              variant={viewingAddStudentForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewAddStudentForm}
            >
              Додати учня
            </Button>
            <Button
              variant={viewingUpdateStudentForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewUpdateStudentForm}
            >
              Оновити або видалити учня
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">Вчителі</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={viewingTeacherList ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewTeacherList}
            >
              Переглянути всіх вчителів
            </Button>
            <Button
              variant={viewingAddTeacherForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewAddTeacherForm}
            >
              Додати вчителя
            </Button>
            <Button
              variant={viewingUpdateTeacherForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewUpdateTeacherForm}
            >
              Оновити або видалити вчителя
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">Оцінки</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={viewingGradeBook ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewGradeBook}
            >
              Переглянути оцінки
            </Button>
            <Button
              variant={viewingAddGradeForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewAddGradeForm}
            >
              Додати оцінку
            </Button>
            <Button
              variant={viewingGradeAdminUpdateForm ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewGradeAdminUpdateForm}
            >
              Оновити або видалити оцінку
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">Відвідування</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant={viewingStudentAttendance ? "contained" : "outlined"}
              color="primary"
              onClick={handleViewStudentAttendance}
            >
              Переглянути та редагувати відвідування учня
            </Button>
          </Box>
        </Paper>
      </Box>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {viewingAddHolidayForm && (
          <>
            <AddHolidayForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму додавання канікул
            </Button>
          </>
        )}
        {viewingUpdateHolidayForm && (
          <>
            <UpdateHolidayForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму оновлення або видалення канікул
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
        {viewingAddClassForm && (
          <>
            <AddClassForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму додавання класу
            </Button>
          </>
        )}
        {viewingClassList && (
          <>
            <ClassList />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати список класів
            </Button>
          </>
        )}
        {viewingUpdateClassForm && (
          <>
            <UpdateClassForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму оновлення або видалення класу
            </Button>
          </>
        )}
        {viewingSubjectList && (
          <>
            <SubjectList />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати список предметів
            </Button>
          </>
        )}
        {viewingAddSubjectForm && (
          <>
            <AddSubjectForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму додавання предмету
            </Button>
          </>
        )}
        {viewingUpdateSubjectForm && (
          <>
            <UpdateSubjectForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму оновлення або видалення предмету
            </Button>
          </>
        )}
        {viewingStudentList && (
          <>
            <StudentList />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати список учнів
            </Button>
          </>
        )}
        {viewingAddStudentForm && (
          <>
            <AddStudentForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму додавання учня
            </Button>
          </>
        )}
        {viewingUpdateStudentForm && (
          <>
            <UpdateStudentForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму оновлення або видалення учня
            </Button>
          </>
        )}
        {viewingTeacherList && (
          <>
            <TeacherList />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати список вчителів
            </Button>
          </>
        )}
        {viewingAddTeacherForm && (
          <>
            <AddTeacherForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму додавання вчителя
            </Button>
          </>
        )}
        {viewingUpdateTeacherForm && (
          <>
            <UpdateTeacherForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму оновлення або видалення вчителя
            </Button>
          </>
        )}
        {viewingAddGradeForm && (
          <>
            <AddGradeForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму додавання оцінки
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
        {viewingGradeAdminUpdateForm && (
          <>
            <GradeAdminUpdateForm />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати форму оновлення або видалення оцінки
            </Button>
          </>
        )}
        {viewingStudentAttendance && (
          <>
            <StudentAttendanceAdmin />
            <Button variant="contained" onClick={handleHideForms} sx={{ mt: 2 }}>
              Приховати відвідування учня
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AdminPage;
