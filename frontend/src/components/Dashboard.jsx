import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Layout from './Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalDistributions: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch agents count
      const agentsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/agents`);
      const totalAgents = agentsResponse.data.data?.pagination?.totalAgents || 0;

      // Fetch distributed lists
      const listsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/lists`);
      const lists = listsResponse.data.data?.lists || [];
      const totalDistributions = lists.length;
      const totalItems = lists.reduce((sum, list) => sum + (list.totalItems || 0), 0);
      
      setStats({
        totalAgents,
        totalDistributions,
        totalItems,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, description, icon, color = 'primary', action }) => (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      }
    }}>
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 3
      }}>
        {/* Icon */}
        {icon && (
          <Box sx={{
            mb: 2,
            color: `${color}.main`,
            fontSize: 40
          }}>
            {icon}
          </Box>
        )}

        {/* Value */}
        <Typography variant="h3" component="div" fontWeight="bold" gutterBottom sx={{ color: `${color}.main` }}>
          {loading ? <CircularProgress size={32} /> : value}
        </Typography>

        {/* Title */}
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {description}
          </Typography>
        )}

        {/* Action Button */}
        {action && (
          <Box sx={{ mt: 'auto' }}>
            {action}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardStats}>
          Retry
        </Button>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the Agent Management System. Here's an overview of your system.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Agents"
            value={stats.totalAgents}
            description="Active agents in the system"
            icon={<PeopleIcon />}
            color="primary"
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/agents')}
              >
                View Agents
              </Button>
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Distributions"
            value={stats.totalDistributions}
            description="Total file distributions"
            icon={<AssignmentIcon />}
            color="success"
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/lists')}
              >
                View All Lists
              </Button>
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            description="Items distributed to agents"
            icon={<TrendingUpIcon />}
            color="info"
          />
        </Grid>


      </Grid>

      {stats.totalAgents === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Add agents to start distributing CSV files. Currently have {stats.totalAgents} agents.
        </Alert>
      )}

      {/* Quick Actions */}
      <Box sx={{
        textAlign: 'center',
        mb: 4,
        p: 2,
        bgcolor: 'grey.50',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        maxWidth: 600,
        mx: 'auto'
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Perform common tasks quickly
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/agents')}
            sx={{
              minWidth: 120,
              py: 1,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.875rem'
            }}
          >
            Add Agent
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/upload')}
            sx={{
              minWidth: 120,
              py: 1,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.875rem'
            }}
          >
            Upload File
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/lists')}
            sx={{
              minWidth: 120,
              py: 1,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.875rem'
            }}
          >
            View Distributions
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;
