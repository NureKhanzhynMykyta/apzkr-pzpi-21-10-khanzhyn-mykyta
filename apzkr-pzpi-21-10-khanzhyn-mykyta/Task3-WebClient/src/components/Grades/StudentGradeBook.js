import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, MenuItem, Button, List, ListItem, ListItemText } from '@mui/material';
import studentService from '../../services/studentService';
import classService from '../../services/classService';
import subjectService from '../../services/subjectService';
import classRecordService from '../../services/classRecordService';

const StudentGradeBook = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectClass, setSelectedSubjectClass] = useState('');
  const [selectedGradeType, setSelectedGradeType] = useState('');
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await classService.getAllClasses();
        setClasses(classData);
        const studentData = await studentService.getAllStudents();
        setStudents(studentData);
        setFilteredStudents(studentData); // Set the initial filtered students list to all students
        const subjectData = await subjectService.getAllSubjects();
        setSubjects(subjectData);
        const subjectNames = Array.from(new Set(subjectData.map(subject => subject.subjectName)));
        setUniqueSubjects(subjectNames);
      } catch (err) {
        setError('Не вдалося завантажити дані');
      }
    };

    fetchData();
  }, []);

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    setSelectedStudent('');

    if (selectedClass === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => student.className === selectedClass);
      setFilteredStudents(filtered);
    }
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedSubjectClass('');
  };

  const handleSubjectClassChange = (e) => {
    setSelectedSubjectClass(e.target.value);
  };

  const handleGradeTypeChange = (e) => {
    setSelectedGradeType(e.target.value);
  };

  const handleViewGrades = async () => {
    const student = students.find(s => `${s.surname} ${s.name} ${s.patronymic}` === selectedStudent);
    const subject = subjects.find(s => s.subjectName === selectedSubject && s.subjectClass === selectedSubjectClass);

    if (!student || !subject) {
      setError('Обраний учень або предмет не знайдено');
      return;
    }

    try {
      const gradeData = await classRecordService.getFilteredClassRecords(selectedSubject, selectedSubjectClass, selectedStudent, selectedGradeType);
      gradeData.sort((a, b) => new Date(b.gradeDate) - new Date(a.gradeDate)); // Сортування за датою від найбільшої до найменшої
      setGrades(gradeData);
      setError('');
    } catch (err) {
      setError('Не вдалося завантажити оцінки');
      setGrades([]);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Журнал оцінок учня</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box mb={2}>
        <TextField
          select
          label="Клас"
          variant="outlined"
          fullWidth
          value={selectedClass}
          onChange={handleClassChange}
        >
          <MenuItem value="">
            <em>Обрати клас</em>
          </MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls.id} value={cls.className}>
              {cls.className}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box mb={2}>
        <TextField
          select
          label="Учень"
          variant="outlined"
          fullWidth
          value={selectedStudent}
          onChange={handleStudentChange}
          required
        >
          <MenuItem value="">
            <em>Обрати учня</em>
          </MenuItem>
          {filteredStudents.map((student) => (
            <MenuItem key={student.id} value={`${student.surname} ${student.name} ${student.patronymic}`}>
              {`${student.surname} ${student.name} ${student.patronymic}`}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box mb={2}>
        <TextField
          select
          label="Предмет"
          variant="outlined"
          fullWidth
          value={selectedSubject}
          onChange={handleSubjectChange}
          required
        >
          <MenuItem value="">
            <em>Обрати предмет</em>
          </MenuItem>
          {uniqueSubjects.map((subject, index) => (
            <MenuItem key={index} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box mb={2}>
        <TextField
          select
          label="Клас предмета"
          variant="outlined"
          fullWidth
          value={selectedSubjectClass}
          onChange={handleSubjectClassChange}
          required
        >
          <MenuItem value="">
            <em>Обрати клас предмета</em>
          </MenuItem>
          {subjects
            .filter((subject) => subject.subjectName === selectedSubject)
            .map((subject) => (
              <MenuItem key={subject.id} value={subject.subjectClass}>
                {subject.subjectClass}
              </MenuItem>
            ))}
        </TextField>
      </Box>
      <Box mb={2}>
        <TextField
          select
          label="Тип оцінки"
          variant="outlined"
          fullWidth
          value={selectedGradeType}
          onChange={handleGradeTypeChange}
        >
          <MenuItem value="">
            <em>Обрати тип оцінки</em>
          </MenuItem>
          <MenuItem value="ПР">ПР</MenuItem>
          <MenuItem value="ТР">ТР</MenuItem>
          <MenuItem value="ДР">ДР</MenuItem>
          <MenuItem value="КР">КР</MenuItem>
        </TextField>
      </Box>
      <Button variant="contained" color="primary" onClick={handleViewGrades}>
        Переглянути оцінки
      </Button>
      <List>
        {grades.map((grade) => (
          <ListItem key={grade.id}>
            <ListItemText
              primary={`Оцінка: ${grade.grade}`}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    Тип роботи: {grade.gradeType}<br />
                    Дата: {new Date(grade.gradeDate).toLocaleDateString()}<br />
                    Вчитель: {grade.teacherName}
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

export default StudentGradeBook;
