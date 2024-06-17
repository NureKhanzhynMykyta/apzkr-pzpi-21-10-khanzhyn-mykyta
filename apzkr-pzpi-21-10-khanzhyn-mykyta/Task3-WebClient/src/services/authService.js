import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const loginStudent = async (loginData) => {
  return await axios.post(`${API_URL}/Student/authorizeStudent`, loginData);
};

const loginTeacher = async (loginData) => {
  return await axios.post(`${API_URL}/Teacher/authorizeTeacher`, loginData);
};

const loginAdmin = async (loginData) => {
  return await axios.post(`${API_URL}/Admin/login`, loginData);
};

const getStudentData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Student/getStudent`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const getTeacherData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.get(`${API_URL}/Teacher/getTeacher`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const updateStudentData = async (studentData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(`${API_URL}/Student/editStudent`, studentData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const updateTeacherData = async (editTeacherDto) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.put(`${API_URL}/Teacher/editTeacher`, editTeacherDto, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  loginStudent,
  loginTeacher,
  loginAdmin,
  getStudentData,
  getTeacherData,
  updateStudentData,
  updateTeacherData
};
