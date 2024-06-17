import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const getAllClasses = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Class`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const postClass = async (classData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(`${API_URL}/Class/postClass`, classData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const updateClass = async (classData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(`${API_URL}/Class/putClass/${classData.id}`, classData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const deleteClass = async (classId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.delete(`${API_URL}/Class/delClass/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export default {
  getAllClasses,
  postClass,
  updateClass,
  deleteClass
};
