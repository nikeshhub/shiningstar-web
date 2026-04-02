import React from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import Dashboard from "./components/layout/Dashboard";

// Pages
import { Homepage } from "./pages/Homepage/homepage";
import About from "./pages/About/About";
import Academics from "./pages/Academics/Academics";
import Admissions from "./pages/Admissions/Admissions";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound/NotFound";
import DashboardHome from "./pages/DashboardHome";
import StudentList from "./pages/Students/StudentList";
import StudentForm from "./pages/Students/StudentForm";
import Promotion from "./pages/Students/Promotion";
import FeeManagement from "./pages/Fee/FeeManagement";
import FeeLedger from "./pages/Fee/FeeLedger";
import FeeChargePage from "./pages/Fee/FeeChargePage";
import FeePaymentPage from "./pages/Fee/FeePaymentPage";
import AttendanceMark from "./pages/Attendance/AttendanceMark";
import AttendanceList from "./pages/Attendance/AttendanceList";
import ClassList from "./pages/Classes/ClassList";
import ClassDetail from "./pages/Classes/ClassDetail";
import ClassFormPage from "./pages/Classes/ClassFormPage";
import StudentDetail from "./pages/Students/StudentDetail";
import TeacherList from "./pages/Teachers/TeacherList";
import TeacherDetail from "./pages/Teachers/TeacherDetail";
import TeacherFormPage from "./pages/Teachers/TeacherFormPage";
import ExamList from "./pages/Exams/ExamList";
import ExamFormPage from "./pages/Exams/ExamFormPage";
import MarksEntryPage from "./pages/Exams/MarksEntryPage";
import InventoryList from "./pages/Inventory/InventoryList";
import InventoryFormPage from "./pages/Inventory/InventoryFormPage";
import NotificationList from "./pages/Notifications/NotificationList";
import NotificationFormPage from "./pages/Notifications/NotificationFormPage";
import TimetableEditor from "./pages/Timetable/TimetableEditor";
import TeacherAttendanceDevice from "./pages/TeacherAttendance/TeacherAttendanceDevice";
import SubjectList from "./pages/Subjects/SubjectList";
import SubjectFormPage from "./pages/Subjects/SubjectFormPage";
import ProgressReportList from "./pages/ProgressReports/ProgressReportList";
import FamilyList from "./pages/Family/FamilyList";
import FamilyForm from "./pages/Family/FamilyForm";
import FamilyDetail from "./pages/Family/FamilyDetail";
import ParentDashboard from "./pages/Parent/ParentDashboard";
import ParentChildDetail from "./pages/Parent/ParentChildDetail";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1B4FD8',
      light: '#EEF3FF',
      dark: '#1644C0',
    },
    secondary: {
      main: '#7C3AED',
      light: '#EDE9FE',
    },
    success: {
      main: '#16A34A',
      light: '#DCFCE7',
    },
    error: {
      main: '#DC2626',
      light: '#FEE2E2',
    },
    warning: {
      main: '#D97706',
      light: '#FEF3C7',
    },
    info: {
      main: '#1B4FD8',
      light: '#EEF3FF',
    },
    background: {
      default: '#F7F8FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0A0F1E',
      secondary: '#3D4460',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontSize: '13px',
    },
    body2: {
      fontSize: '12px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          border: '1px solid #E8EAF0',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes - Admin & Teacher Access */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />

            {/* Student Management - Admin & Teacher */}
            <Route path="students" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <StudentList />
              </ProtectedRoute>
            } />
            <Route path="students/add" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <StudentForm />
              </ProtectedRoute>
            } />
            <Route path="students/promote" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Promotion />
              </ProtectedRoute>
            } />
            <Route path="students/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <StudentForm />
              </ProtectedRoute>
            } />
            <Route path="students/:id" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <StudentDetail />
              </ProtectedRoute>
            } />

            {/* Fee Management - Admin Only */}
            <Route path="fee" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FeeManagement />
              </ProtectedRoute>
            } />
            <Route path="fee/ledger/:studentId" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FeeLedger />
              </ProtectedRoute>
            } />
            <Route path="fee/ledger/:studentId/charge" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FeeChargePage />
              </ProtectedRoute>
            } />
            <Route path="fee/ledger/:studentId/payment" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FeePaymentPage />
              </ProtectedRoute>
            } />

            {/* Family Management - Admin Only */}
            <Route path="families" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FamilyList />
              </ProtectedRoute>
            } />
            <Route path="families/create" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FamilyForm />
              </ProtectedRoute>
            } />
            <Route path="families/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FamilyForm />
              </ProtectedRoute>
            } />
            <Route path="families/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FamilyDetail />
              </ProtectedRoute>
            } />
            <Route path="families/:id/charge" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FeeChargePage />
              </ProtectedRoute>
            } />
            <Route path="families/:id/payment" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <FeePaymentPage />
              </ProtectedRoute>
            } />

            {/* Attendance - Admin & Teacher */}
            <Route path="attendance" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <AttendanceList />
              </ProtectedRoute>
            } />
            <Route path="attendance/mark" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <AttendanceMark />
              </ProtectedRoute>
            } />

            {/* Classes Management - Admin Only for create/edit */}
            <Route path="classes" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <ClassList />
              </ProtectedRoute>
            } />
            <Route path="classes/add" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ClassFormPage />
              </ProtectedRoute>
            } />
            <Route path="classes/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ClassFormPage />
              </ProtectedRoute>
            } />
            <Route path="classes/:id" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <ClassDetail />
              </ProtectedRoute>
            } />

            {/* Subjects Management - Admin Only */}
            <Route path="subjects" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <SubjectList />
              </ProtectedRoute>
            } />
            <Route path="subjects/add" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <SubjectFormPage />
              </ProtectedRoute>
            } />
            <Route path="subjects/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <SubjectFormPage />
              </ProtectedRoute>
            } />

            {/* Teachers Management - Admin Only */}
            <Route path="teachers" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <TeacherList />
              </ProtectedRoute>
            } />
            <Route path="teachers/add" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <TeacherFormPage />
              </ProtectedRoute>
            } />
            <Route path="teachers/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <TeacherFormPage />
              </ProtectedRoute>
            } />
            <Route path="teachers/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <TeacherDetail />
              </ProtectedRoute>
            } />

            {/* Exams & Marks - Admin & Teacher */}
            <Route path="exams" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <ExamList />
              </ProtectedRoute>
            } />
            <Route path="exams/add" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ExamFormPage />
              </ProtectedRoute>
            } />
            <Route path="exams/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ExamFormPage />
              </ProtectedRoute>
            } />
            <Route path="exams/:id/marks" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <MarksEntryPage />
              </ProtectedRoute>
            } />

            {/* Progress Reports - Admin & Teacher */}
            <Route path="progress-reports" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <ProgressReportList />
              </ProtectedRoute>
            } />

            {/* Inventory Management - Admin Only */}
            <Route path="inventory" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <InventoryList />
              </ProtectedRoute>
            } />
            <Route path="inventory/add" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <InventoryFormPage />
              </ProtectedRoute>
            } />
            <Route path="inventory/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <InventoryFormPage />
              </ProtectedRoute>
            } />

            {/* Notifications - Admin Only */}
            <Route path="notifications" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <NotificationList />
              </ProtectedRoute>
            } />
            <Route path="notifications/add" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <NotificationFormPage />
              </ProtectedRoute>
            } />
            <Route path="notifications/edit/:id" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <NotificationFormPage />
              </ProtectedRoute>
            } />

            {/* Timetable - Admin & Teacher */}
            <Route path="timetable" element={
              <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                <TimetableEditor />
              </ProtectedRoute>
            } />

            {/* Teacher Attendance - Admin Only */}
            <Route path="teacher-attendance" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <TeacherAttendanceDevice />
              </ProtectedRoute>
            } />
          </Route>

          {/* Parent Portal Routes - Parent Access Only */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={['Parent']}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="children/:id" element={<ParentChildDetail />} />
          </Route>

          {/* 404 Not Found - Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
