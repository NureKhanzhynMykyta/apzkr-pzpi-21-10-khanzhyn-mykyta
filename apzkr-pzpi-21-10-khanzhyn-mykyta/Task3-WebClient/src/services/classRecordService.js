import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const getFilteredClassRecords = async (subjectName, subjectClass, studentName, gradeType) => {
  const response = await axios.get(`${API_URL}/ClassRecord/getFilteredClassRecords`, {
    params: { subjectName, subjectClass, studentName, gradeType }
  });
  return response.data;
};

const getAnnualAverageGrade = async (studentId, subjectName, subjectClass, year, weightPR, weightTR, weightDR, weightKR) => {
  const response = await axios.get(`${API_URL}/ClassRecord/annualAverageGrade`, {
    params: { studentId, subjectName, subjectClass, year, weightPR, weightTR, weightDR, weightKR }
  });
  return response.data;
};

const postClassRecord = async (classRecord) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Posting new class record:', classRecord);

  try {
    const response = await axios.post(`${API_URL}/ClassRecord/postClassRecord`, classRecord, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Response from server:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error posting class record:', err.response ? err.response.data : err.message);
    throw err;
  }
};

const updateClassRecord = async (id, classRecord) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
    console.log('Updating class record:',id, classRecord);

  const response = await axios.put(`${API_URL}/ClassRecord/putClassRecord/${id}`, classRecord, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const deleteClassRecord = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.delete(`${API_URL}/ClassRecord/delClassRecord/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  getFilteredClassRecords,
  getAnnualAverageGrade,
  postClassRecord,
  updateClassRecord,
  deleteClassRecord
};
