import React from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ParentLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          height: 68,
          px: { xs: 2, md: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/logo.png" alt="Shining Star" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>
              Shining Star
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
              Parent Portal
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
              {user?.username || 'Parent'}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
              {user?.role || 'Parent'}
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'P'}
          </Avatar>
          <IconButton onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
