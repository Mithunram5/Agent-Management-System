import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Notes as NotesIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Layout from './Layout';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/lists/my-tasks');
      if (response.data.success) {
        setTasks(response.data.data.lists);
        setTotalItems(response.data.data.totalItems);
      }
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      setError('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            My Tasks
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchMyTasks}
          >
            Refresh
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View all tasks assigned to you.
        </Typography>
        
        {totalItems > 0 && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`Total Items: ${totalItems}`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks assigned yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will see your assigned tasks here once the admin uploads and distributes CSV files.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {tasks.map((task, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {task.fileName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={`${task.totalItems} items`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={formatDate(task.createdAt)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Assigned on {formatDate(task.createdAt)}
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task.items.map((item, itemIndex) => (
                        <TableRow key={itemIndex}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              {item.firstName}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              {item.phone}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <NotesIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              {item.notes || '-'}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Layout>
  );
};

export default MyTasks;
