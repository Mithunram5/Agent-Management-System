import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (user.role === 'agent') {
        navigate('/my-tasks', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return null;
};

export default RoleBasedRedirect;
