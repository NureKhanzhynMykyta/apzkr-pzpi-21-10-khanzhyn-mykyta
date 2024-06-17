import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const getAllTeachers = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Teacher`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const getTeacherById = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Teacher/getTeacherById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const postTeacher = async (teacher) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(`${API_URL}/Teacher/postTeacher`, teacher, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const updateTeacher = async (id, teacher, updatePassword) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(`${API_URL}/Teacher/putTeacher/${id}?updatePassword=${updatePassword}`, teacher, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const deleteTeacher = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.delete(`${API_URL}/Teacher/delTeacher/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export default {
  getAllTeachers,
  getTeacherById,
  postTeacher,
  updateTeacher,
  deleteTeacher
};
