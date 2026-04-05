import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import SplashScreen from "./components/SplashScreen/SplashScreen";

// Static Pages
import { Homepage } from "./pages/Homepage/homepage";
import About from "./pages/About/About";
import Academics from "./pages/Academics/Academics";
import Admissions from "./pages/Admissions/Admissions";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";

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
  const [showSplash, setShowSplash] = useState(true);

  const handleLoadComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showSplash && <SplashScreen onLoadComplete={handleLoadComplete} />}
      <Routes>
        {/* Static Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        {/* 404 Not Found - Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
