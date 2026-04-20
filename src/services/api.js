import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Student APIs
export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  promote: (data) => api.post('/students/promote', data),
  getHistory: (id) => api.get(`/students/${id}/history`),
  updateGPS: (id, data) => api.put(`/students/${id}/gps`, data),
};

// Fee APIs (family-level billing)
export const feeAPI = {
  createCharge: (data) => api.post('/fee/charge', data),
  createPayment: (data) => api.post('/fee/payment', data),
  getLedger: (familyId, params) => api.get(`/fee/ledger/${familyId}`, { params }),
  getTransaction: (id) => api.get(`/fee/transaction/${id}`),
  getDuesList: (params) => api.get('/fee/dues', { params }),
  getCollectionSummary: (params) => api.get('/fee/collection-summary', { params }),
  generateBillNumber: () => api.get('/fee/generate-bill-number'),
};

// Class APIs
export const classAPI = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  getStudents: (id) => api.get(`/classes/${id}/students`),
  getTimetable: (id) => api.get(`/classes/${id}/timetable`),
  setTimetable: (id, data) => api.put(`/classes/${id}/timetable`, data),
  updateSubjectBook: (classId, subjectId, data) => api.put(`/classes/${classId}/subjects/${subjectId}/book`, data),
};

// Attendance APIs
export const attendanceAPI = {
  mark: (data) => api.post('/attendance', data),
  getByDate: (params) => api.get('/attendance/date', { params }),
  getStudentReport: (params) => api.get('/attendance/student-report', { params }),
  getMonthlyReport: (params) => api.get('/attendance/monthly-report', { params }),
  getAbsentStudents: (params) => api.get('/attendance/absent', { params }),
};

// Exam APIs
export const examAPI = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  // Note: creating an exam auto-charges terminal fees (3 months tuition) per family.
  generateNotice: (id) => api.post(`/exams/${id}/notice/generate`),
  downloadNotice: (id) => api.get(`/exams/${id}/notice/download`, { responseType: 'blob' }),
  enterMarks: (data) => api.post('/exams/marks/enter', data),
  bulkEnterMarks: (data) => api.post('/exams/marks/bulk-enter', data),
  deleteMarks: (id) => api.delete(`/exams/marks/${id}`),
  getMarksheet: (params) => api.get('/exams/marks/marksheet', { params }),
  getTerminalMarks: (params) => api.get('/exams/marks/terminal', { params }),
  getClassResult: (params) => api.get('/exams/marks/class-result', { params }),
};

// Inventory APIs
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  distribute: (data) => api.post('/inventory/distribution/distribute', data),
  getStudentDistributions: (studentId) => api.get(`/inventory/distribution/student/${studentId}`),
  getAllDistributions: (params) => api.get('/inventory/distribution/all', { params }),
};

// Teacher APIs
export const teacherAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
};

// Subject APIs
export const subjectAPI = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (data) => api.post('/notifications', data),
  update: (id, data) => api.put(`/notifications/${id}`, data),
  delete: (id) => api.delete(`/notifications/${id}`),
  send: (id) => api.post(`/notifications/${id}/send`),
  sendFeeReminder: (data) => api.post('/notifications/alerts/fee-reminder', data),
  sendAbsenceAlert: (data) => api.post('/notifications/alerts/absence', data),
};

// Auth / system control APIs
export const authAPI = {
  getSystemOverview: () => api.get('/auth/system-overview'),
  getProvisionTargets: (params) => api.get('/auth/provision-targets', { params }),
  provisionAccount: (data) => api.post('/auth/provision-account', data),
  getUsers: (params) => api.get('/auth/users', { params }),
  updatePermissions: (data) => api.put('/auth/users/permissions', data),
  toggleUserStatus: (data) => api.put('/auth/users/toggle-status', data),
  createUser: (data) => api.post('/auth/register', data),
};

// Timetable APIs
export const timetableAPI = {
  getAll: (params) => api.get('/timetable', { params }),
  setAll: (data) => api.put('/timetable', data),
};

// Teacher Attendance APIs
export const teacherAttendanceAPI = {
  getAll: (params) => api.get('/teacher-attendance', { params }),
  create: (data) => api.post('/teacher-attendance', data),
  update: (id, data) => api.patch(`/teacher-attendance/${id}`, data),
  mark: (data) => api.patch('/teacher-attendance/mark', data),
};

// Progress Report APIs
export const progressReportAPI = {
  generate: (data) => api.post('/progress-reports/generate', data),
  bulkGenerate: (data) => api.post('/progress-reports/bulk-generate', data),
  get: (params) => api.get('/progress-reports', { params }),
  getByClass: (params) => api.get('/progress-reports/class', { params }),
  generatePDF: (params) => api.get('/progress-reports/pdf/generate', { params }),
  downloadPDF: (params) => api.get('/progress-reports/pdf/download', { params, responseType: 'blob' }),
};

// Family APIs (families are the billing unit)
export const familyAPI = {
  getAll: (params) => api.get('/families', { params }),
  getById: (id) => api.get(`/families/${id}`),
  create: (data) => api.post('/families', data),
  update: (id, data) => api.patch(`/families/${id}`, data),
  delete: (id) => api.delete(`/families/${id}`),
  getFeeSummary: (id) => api.get(`/families/${id}/fee-summary`),
  linkStudent: (data) => api.post('/families/link-student', data),
  unlinkStudent: (studentId) => api.delete(`/families/unlink-student/${studentId}`),
  generateId: () => api.get('/families/generate/id'),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export default api;
