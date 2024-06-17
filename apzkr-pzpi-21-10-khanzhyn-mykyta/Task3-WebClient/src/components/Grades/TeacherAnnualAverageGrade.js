import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, MenuItem, TextField, Button } from '@mui/material';
import classService from '../../services/classService';
import studentService from '../../services/studentService';
import subjectService from '../../services/subjectService';
import classRecordService from '../../services/classRecordService';

const TeacherAnnualAverageGrade = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectClass, setSelectedSubjectClass] = useState('');
  const [year, setYear] = useState('');
  const [weightPR, setWeightPR] = useState(1);
  const [weightTR, setWeightTR] = useState(1);
  const [weightDR, setWeightDR] = useState(1);
  const [weightKR, setWeightKR] = useState(1);
  const [averageGrade, setAverageGrade] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await classService.getAllClasses();
        setClasses(classData);
        const studentData = await studentService.getAllStudents();
        setStudents(studentData);
        setFilteredStudents(studentData);
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

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = students.find(s => `${s.surname} ${s.name} ${s.patronymic}` === selectedStudent);

    if (!student) {
      setError('Обраний учень не знайдено');
      return;
    }

    try {
      const response = await classRecordService.getAnnualAverageGrade(
        student.id,
        selectedSubject,
        selectedSubjectClass,
        year,
        weightPR,
        weightTR,
        weightDR,
        weightKR
      );
      setAverageGrade(response);
      setError('');
    } catch (err) {
      setError('Не вдалося отримати річну оцінку');
      setAverageGrade(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Річна оцінка за обраний предмет</Typography>
      {error && <Typography color="error">{error}</Typography>}
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
            label="Рік"
            variant="outlined"
            fullWidth
            type="number"
            value={year}
            onChange={handleYearChange}
            inputProps={{ min: 2000 }}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Вага ПР"
            variant="outlined"
            fullWidth
            type="number"
            value={weightPR}
            onChange={(e) => setWeightPR(e.target.value)}
            step="0.1"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Вага ТР"
            variant="outlined"
            fullWidth
            type="number"
            value={weightTR}
            onChange={(e) => setWeightTR(e.target.value)}
            step="0.1"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Вага ДР"
            variant="outlined"
            fullWidth
            type="number"
            value={weightDR}
            onChange={(e) => setWeightDR(e.target.value)}
            step="0.1"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Вага КР"
            variant="outlined"
            fullWidth
            type="number"
            value={weightKR}
            onChange={(e) => setWeightKR(e.target.value)}
            step="0.1"
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">Отримати річну оцінку</Button>
      </form>
      {averageGrade !== null && (
        <Box mt={3}>
          <Typography variant="h6">Оцінка за 1 семестр: {averageGrade.firstSemesterGrade}</Typography>
          <Typography variant="h6">Оцінка за 2 семестр: {averageGrade.secondSemesterGrade}</Typography>
          <Typography variant="h6">Річна оцінка: {averageGrade.annualGrade}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TeacherAnnualAverageGrade;
