import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const getAllStudents = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Student`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const getFilteredStudents = async (className) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Student/getFilteredStudents?className=${className}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const getStudentById = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Student/getStudentById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const updateStudent = async (id, student) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  console.log('Updating new Student:', student);

  const response = await axios.put(`${API_URL}/Student/putStudent/${id}`, student, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const postStudent = async (student) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(`${API_URL}/Student/postStudent`, student, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const deleteStudent = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.delete(`${API_URL}/Student/delStudent/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export default {
  getAllStudents,
  getFilteredStudents,
  getStudentById,
  updateStudent,
  postStudent,
  deleteStudent
};
