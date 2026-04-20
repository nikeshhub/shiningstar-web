import React, { useState } from 'react';
import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSuperAdminTitle, superAdminNavigationSections } from '../../config/dashboardConfig';

const drawerWidth = 240;

const getUserDisplay = (user) => user?.email || user?.phoneNumber || 'SuperAdmin';

export default function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenuSections = superAdminNavigationSections.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roles?.includes(user?.role)),
  })).filter((section) => section.items.length > 0);

  const currentPageTitle = getSuperAdminTitle(location.pathname);
  const displayName = getUserDisplay(user);

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0A0F1E',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(27, 79, 216, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ p: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '9px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/logo.png" alt="Shining Star" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'white',
                lineHeight: 1,
                mb: 0.25,
              }}
            >
              Shining Star
            </Typography>
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              SuperAdmin
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'primary.light',
                color: 'primary.main',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'Fraunces, serif',
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 8,
                height: 8,
                bgcolor: '#16A34A',
                borderRadius: '50%',
                border: '2px solid #0A0F1E',
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'white',
                lineHeight: 1.2,
                mb: 0.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </Typography>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: 1,
              }}
            >
              {user?.role || 'SuperAdmin'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1 }}>
        {filteredMenuSections.map((section) => (
          <Box key={section.label} sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: '9px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                px: 1.25,
                mb: 0.75,
              }}
            >
              {section.label}
            </Typography>
            <List sx={{ p: 0 }}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                const Icon = item.icon;

                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      onClick={() => handleMenuClick(item.path)}
                      sx={{
                        py: 1.125,
                        px: 1.25,
                        borderRadius: '8px',
                        position: 'relative',
                        color: isActive ? 'white' : 'rgba(255, 255, 255, 0.55)',
                        bgcolor: isActive ? 'rgba(27, 79, 216, 0.35)' : 'transparent',
                        '&:hover': {
                          bgcolor: isActive ? 'rgba(27, 79, 216, 0.35)' : 'rgba(255, 255, 255, 0.06)',
                          color: isActive ? 'white' : 'rgba(255, 255, 255, 0.9)',
                        },
                        '&::before': isActive ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          bottom: 4,
                          width: '3px',
                          bgcolor: 'primary.main',
                          borderRadius: '0 2px 2px 0',
                        } : {},
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          color: 'inherit',
                          fontSize: '18px',
                        }}
                      >
                        <Icon />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '13px',
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Typography
          sx={{
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
          }}
        >
          © 2026 Shining Star
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: { xs: 0, sm: `${drawerWidth}px` },
          right: 0,
          height: '60px',
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          alignItems: 'center',
          px: 3.5,
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Fraunces, serif',
              fontSize: '20px',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {currentPageTitle}
          </Typography>
        </Box>

        <IconButton onClick={handleProfileMenuOpen} size="small">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'Fraunces, serif',
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
            },
          }}
        >
          <MenuItem disabled>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role || 'SuperAdmin'}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Toolbar sx={{ height: '60px', flexShrink: 0 }} />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            bgcolor: 'background.default',
            p: 3,
            pt: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
