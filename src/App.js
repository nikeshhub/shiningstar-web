import React from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient';

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import Dashboard from "./components/layout/Dashboard";
import ParentLayout from "./components/layout/ParentLayout";
import SuperAdminLayout from "./components/layout/SuperAdminLayout";

// Pages
import { Homepage } from "./pages/Homepage/homepage";
import About from "./pages/About/About";
import Academics from "./pages/Academics/Academics";
import Admissions from "./pages/Admissions/Admissions";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound/NotFound";
import {
  dashboardRouteDefinitions,
  parentRouteDefinitions,
  superAdminRouteDefinitions,
  renderRouteElement,
} from "./config/dashboardConfig";

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
    <QueryClientProvider client={queryClient}>
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
            {dashboardRouteDefinitions.map((route) => {
              const Component = route.element;
              const element = (
                <ProtectedRoute allowedRoles={route.allowedRoles}>
                  {renderRouteElement(Component)}
                </ProtectedRoute>
              );

              if (route.index) {
                return <Route key="dashboard-index" index element={element} />;
              }

              return <Route key={route.path} path={route.path} element={element} />;
            })}
          </Route>

          {/* Parent Portal Routes - Parent Access Only */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={['Parent']}>
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            {parentRouteDefinitions.map((route) => {
              const Component = route.element;

              if (route.index) {
                return <Route key="parent-index" index element={renderRouteElement(Component)} />;
              }

              return <Route key={route.path} path={route.path} element={renderRouteElement(Component)} />;
            })}
          </Route>

          {/* SuperAdmin Portal */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            {superAdminRouteDefinitions.map((route) => {
              const Component = route.element;
              const element = (
                <ProtectedRoute allowedRoles={['SuperAdmin']}>
                  {renderRouteElement(Component)}
                </ProtectedRoute>
              );

              if (route.index) {
                return <Route key="superadmin-index" index element={element} />;
              }

              return <Route key={route.path} path={route.path} element={element} />;
            })}
          </Route>

          {/* 404 Not Found - Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </ThemeProvider>
  </QueryClientProvider>
  );
}

export default App;
