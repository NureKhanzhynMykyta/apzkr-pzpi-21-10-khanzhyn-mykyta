import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const getAllHolidays = async () => {
  const response = await axios.get(`${API_URL}/Holiday`);
  return response.data;
};

const postHoliday = async (holiday) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(`${API_URL}/Holiday/postHoliday`, holiday, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const updateHoliday = async (id, holiday) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(`${API_URL}/Holiday/putHoliday/${id}`, holiday, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const deleteHoliday = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.delete(`${API_URL}/Holiday/delHoliday/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export default {
  getAllHolidays,
  postHoliday,
  updateHoliday,
  deleteHoliday
};
