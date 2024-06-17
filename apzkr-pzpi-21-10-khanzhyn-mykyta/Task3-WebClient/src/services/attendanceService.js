import axios from 'axios';

const API_URL = 'https://localhost:7263/api';

const getStudentAttendances = async (studentId, startYear = null) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const url = startYear ?
    `${API_URL}/Attendance/getStudentAttendances/${studentId}?startYear=${startYear}` :
    `${API_URL}/Attendance/getStudentAttendances/${studentId}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const getAttendanceStatistics = async (studentId, startYear) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/Attendance/attendanceStatistics/${studentId}/${startYear}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const updateAttendance = async (id, attendance) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(`${API_URL}/Attendance/putAttendance/${id}`, attendance, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

const deleteAttendance = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.delete(`${API_URL}/Attendance/delAttendance/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export default {
  getStudentAttendances,
  getAttendanceStatistics,
  updateAttendance,
  deleteAttendance,
};
