import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, MenuItem, Button } from '@mui/material';
import classRecordService from '../../services/classRecordService';
import subjectService from '../../services/subjectService';
import studentService from '../../services/studentService';
import classService from '../../services/classService';

const GradeAssignmentForm = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectClass, setSelectedSubjectClass] = useState('');
  const [grade, setGrade] = useState('');
  const [gradeType, setGradeType] = useState('');
  const [gradeDate, setGradeDate] = useState(new Date().toISOString().slice(0, 10)); // Default to current date
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

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
    setSelectedSubject('');
    setSelectedSubjectClass('');

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
    setGradeType(e.target.value);
  };

  const handleDateChange = (e) => {
    setGradeDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = students.find(s => `${s.surname} ${s.name} ${s.patronymic}` === selectedStudent);
    const subject = subjects.find(s => s.subjectName === selectedSubject && s.subjectClass === selectedSubjectClass);

    if (!student || !subject) {
      setError('Обраний учень або предмет не знайдено');
      return;
    }

    const newRecord = {
      studentId: student.id,
      studentName: `${student.surname} ${student.name} ${student.patronymic}`,
      subjectId: subject.id,
      subjectName: selectedSubject,
      subjectClass: selectedSubjectClass,
      grade: parseFloat(grade), // ensure the grade is a number
      gradeType,
      gradeDate: new Date(gradeDate).toISOString(),
      teacherName: `${user.surname} ${user.name} ${user.patronymic}` // додайте ім'я вчителя або інше потрібне значення
    };

    try {
      await classRecordService.postClassRecord(newRecord);
      setSuccess('Оцінка успішно проставлена');
      setError('');
    } catch (err) {
      setError('Не вдалося проставити оцінку');
      setSuccess('');
      console.error('Error submitting new record:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Проставити оцінку</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form onSubmit={handleSubmit}>
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
            label="Оцінка"
            variant="outlined"
            fullWidth
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Тип оцінки"
            variant="outlined"
            fullWidth
            value={gradeType}
            onChange={handleGradeTypeChange}
            required
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
        <Box mb={2}>
          <TextField
            label="Дата"
            type="date"
            variant="outlined"
            fullWidth
            value={gradeDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">Проставити оцінку</Button>
      </form>
    </Paper>
  );
};

export default GradeAssignmentForm;
