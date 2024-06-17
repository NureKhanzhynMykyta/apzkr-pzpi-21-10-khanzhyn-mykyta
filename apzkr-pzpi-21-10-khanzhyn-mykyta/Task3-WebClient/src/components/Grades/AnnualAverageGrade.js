import React, { useState, useEffect } from 'react';
import subjectService from '../../services/subjectService';
import classRecordService from '../../services/classRecordService';
import {
  Box, Typography, Paper, MenuItem, TextField, Button
} from '@mui/material';

const AnnualAverageGrade = ({ studentId }) => {
  const [subjects, setSubjects] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [year, setYear] = useState('');
  const [weightPR, setWeightPR] = useState(1);
  const [weightTR, setWeightTR] = useState(1);
  const [weightDR, setWeightDR] = useState(1);
  const [weightKR, setWeightKR] = useState(1);
  const [averageGrade, setAverageGrade] = useState(null);
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

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedClass('');
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await classRecordService.getAnnualAverageGrade(
        studentId,
        selectedSubject,
        selectedClass,
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

export default AnnualAverageGrade;
