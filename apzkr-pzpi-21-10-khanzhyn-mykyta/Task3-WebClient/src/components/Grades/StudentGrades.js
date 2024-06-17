import React, { useEffect, useState, useCallback } from 'react';
import classRecordService from '../../services/classRecordService';
import subjectService from '../../services/subjectService';
import {
  Box, Typography, Paper, MenuItem, TextField, List, ListItem, ListItemText
} from '@mui/material';

const StudentGrades = ({ studentId, studentFullName }) => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedGradeType, setSelectedGradeType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectService.getAllSubjects();
        setSubjects(data);

        const subjectNames = Array.from(new Set(data.map(subject => subject.subjectName)));
        setUniqueSubjects(subjectNames);
      } catch (err) {
        setError('Не вдалося завантажити предмети');
      }
    };

    fetchSubjects();
  }, []);

  const fetchGrades = useCallback(async () => {
    try {
      const data = await classRecordService.getFilteredClassRecords(selectedSubject, selectedClass, studentFullName, selectedGradeType);
      // Сортуємо оцінки за датою
      data.sort((a, b) => new Date(b.gradeDate) - new Date(a.gradeDate));
      setGrades(data);
      setError('');
    } catch (err) {
      setError('Не вдалося завантажити оцінки');
    }
  }, [selectedSubject, selectedClass, selectedGradeType, studentFullName]);

  useEffect(() => {
    if (selectedSubject && selectedClass) {
      fetchGrades();
    }
  }, [selectedSubject, selectedClass, selectedGradeType, studentFullName, fetchGrades]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedClass('');
    setSelectedGradeType('');
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedGradeType('');
  };

  const handleGradeTypeChange = (e) => {
    setSelectedGradeType(e.target.value);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Щоденник з оцінками</Typography>
      {error && <Typography color="error">{error}</Typography>}
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
          value={selectedClass}
          onChange={handleClassChange}
          required
        >
          <MenuItem value="">
            <em>Обрати клас</em>
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

export default StudentGrades;
