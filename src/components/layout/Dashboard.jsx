import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  InputBase,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  EventNote as EventNoteIcon,
  Assignment as AssignmentIcon,
  Inventory as InventoryIcon,
  Notifications as NotificationsIcon,
  Class as ClassIcon,
  Schedule as ScheduleIcon,
  HowToReg as HowToRegIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  FamilyRestroom as FamilyIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuSections = [
  {
    label: 'OVERVIEW',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['Admin', 'Teacher'] },
    ],
  },
  {
    label: 'ACADEMIC',
    items: [
      { text: 'Students', icon: <PeopleIcon />, path: '/dashboard/students', roles: ['Admin', 'Teacher'], badge: null },
      { text: 'Classes', icon: <ClassIcon />, path: '/dashboard/classes', roles: ['Admin', 'Teacher'] },
      { text: 'Subjects', icon: <MenuBookIcon />, path: '/dashboard/subjects', roles: ['Admin'] },
      { text: 'Teachers', icon: <SchoolIcon />, path: '/dashboard/teachers', roles: ['Admin'] },
      { text: 'Attendance', icon: <EventNoteIcon />, path: '/dashboard/attendance', roles: ['Admin', 'Teacher'] },
    ],
  },
  {
    label: 'ASSESSMENT',
    items: [
      { text: 'Exams & Marks', icon: <AssignmentIcon />, path: '/dashboard/exams', roles: ['Admin', 'Teacher'] },
      { text: 'Progress Reports', icon: <AssessmentIcon />, path: '/dashboard/progress-reports', roles: ['Admin', 'Teacher'] },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { text: 'Families', icon: <FamilyIcon />, path: '/dashboard/families', roles: ['Admin'] },
      { text: 'Promotion', icon: <TrendingUpIcon />, path: '/dashboard/students/promote', roles: ['Admin'] },
      { text: 'Fee Management', icon: <PaymentIcon />, path: '/dashboard/fee', roles: ['Admin'] },
      { text: 'Teacher Attendance', icon: <HowToRegIcon />, path: '/dashboard/teacher-attendance', roles: ['Admin'] },
      { text: 'Inventory', icon: <InventoryIcon />, path: '/dashboard/inventory', roles: ['Admin'] },
      { text: 'Timetable', icon: <ScheduleIcon />, path: '/dashboard/timetable', roles: ['Admin', 'Teacher'] },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/dashboard/notifications', roles: ['Admin'], badge: 3 },
    ],
  },
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  // Filter menu sections based on user role
  const filteredMenuSections = menuSections.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(user?.role);
    }),
  })).filter((section) => section.items.length > 0);

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
      {/* Brand Block */}
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
              Management
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User Block */}
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
              {user?.username?.charAt(0).toUpperCase() || 'U'}
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
              {user?.username || 'User'}
            </Typography>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.5)',
                lineHeight: 1,
              }}
            >
              {user?.role || 'Role'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1 }}>
        {filteredMenuSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 2 }}>
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
                const isActive = location.pathname === item.path;
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
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '13px',
                          fontWeight: 500,
                        }}
                      />
                      {item.badge && (
                        <Box
                          sx={{
                            minWidth: 18,
                            height: 18,
                            px: 0.625,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '100px',
                            bgcolor: 'error.main',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'white',
                          }}
                        >
                          {item.badge}
                        </Box>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
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

      {/* Topbar */}
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

        {/* Page Title - Will be updated per page */}
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
            Dashboard
          </Typography>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Search Bar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              px: 1.5,
              py: 0.75,
              width: 180,
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.75 }} />
            <InputBase
              placeholder="Search..."
              sx={{
                flex: 1,
                fontSize: '12px',
                color: 'text.primary',
                '& input::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Icon Buttons */}
          <IconButton
            size="small"
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'primary.light',
                borderColor: 'primary.main',
              },
            }}
          >
            <Badge
              badgeContent={3}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '9px',
                  height: 14,
                  minWidth: 14,
                  fontWeight: 700,
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: 18 }} />
            </Badge>
          </IconButton>

          <IconButton
            size="small"
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'primary.light',
                borderColor: 'primary.main',
              },
            }}
          >
            <SettingsIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* User Avatar */}
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
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
              },
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
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
      </Box>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
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

        {/* Desktop Drawer */}
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

      {/* Main Content */}
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
        {/* Spacer for fixed topbar */}
        <Box sx={{ height: '60px', flexShrink: 0 }} />

        {/* Scrollable Content */}
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
