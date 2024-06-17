import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const getAllSubjects = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Subject`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};
const postSubject = async (subjectData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(`${API_URL}/Subject/postSubject`, subjectData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const updateSubject = async (id, subjectData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(`${API_URL}/Subject/putSubject/${id}`, subjectData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const deleteSubject = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.delete(`${API_URL}/Subject/delSubject/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export default {
  getAllSubjects,
  postSubject,
  updateSubject,
  deleteSubject,
};
