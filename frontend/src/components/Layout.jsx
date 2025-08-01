import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    {
      text: 'Dashboard',
      path: '/dashboard',
    },
    {
      text: 'Agents',
      path: '/agents',
    },
    {
      text: 'Upload CSV',
      path: '/upload',
    },
    {
      text: 'Lists',
      path: '/lists',
    },
  ];

  const agentMenuItems = [
    {
      text: 'My Tasks',
      path: '/my-tasks',
    },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : agentMenuItems;

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Agent Management System
          </Typography>

          {/* Navigation Menu - Centered */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexGrow: 1
          }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  textTransform: 'none',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* User Info and Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.name || user?.email} ({user?.role})
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box sx={{ width: '100%', maxWidth: 1200 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
