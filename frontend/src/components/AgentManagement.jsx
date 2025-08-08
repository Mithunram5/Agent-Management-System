import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Chip,
  DialogContentText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Layout from './Layout';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [agentTasks, setAgentTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/agents`);
      if (response.data.success) {
        setAgents(response.data.data.agents);
        // Fetch task counts for each agent
        await fetchAgentTaskCounts(response.data.data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentTaskCounts = async (agentList) => {
    try {
      const taskCounts = {};
      for (const agent of agentList) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/lists/agent/${agent._id}`);
          if (response.data.success) {
            taskCounts[agent._id] = response.data.data.totalItems || 0;
          }
        } catch (error) {
          taskCounts[agent._id] = 0;
        }
      }
      setAgentTasks(taskCounts);
    } catch (error) {
      console.error('Error fetching agent task counts:', error);
    }
  };

  const handleOpenDialog = (agent = null) => {
    setEditingAgent(agent);
    setFormData({
      name: agent?.name || '',
      email: agent?.email || '',
      mobile: agent?.mobile || '',
      password: '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAgent(null);
    setFormData({ name: '', email: '', mobile: '', password: '' });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      errors.mobile = 'Please enter a valid mobile number with country code';
    }
    
    if (!editingAgent && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      let response;
      if (editingAgent) {
        response = await axios.put(`${import.meta.env.VITE_API_URL}/agents/${editingAgent._id}`, payload);
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/agents`, payload);
      }

      if (response.data.success) {
        setSuccess(editingAgent ? 'Agent updated successfully' : 'Agent created successfully');
        handleCloseDialog();
        fetchAgents();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.field || err.param] = err.message || err.msg;
        });
        setFormErrors(serverErrors);
      } else {
        setError(error.response?.data?.message || 'Failed to save agent');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/agents/${agentToDelete._id}`);
      if (response.data.success) {
        setSuccess('Agent deleted successfully');
        fetchAgents();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError(error.response?.data?.message || 'Failed to delete agent');
    } finally {
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAgentToDelete(null);
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Agent Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Agent
          </Button>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          Manage agents in the system.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {agents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} key={agent._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      {agent.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {agent.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {agent.mobile}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Tasks: ${agentTasks[agent._id] || 0}`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`Created: ${new Date(agent.createdAt).toLocaleDateString()}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto' }}>
                    <Tooltip title="Edit Agent">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(agent)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Agent">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(agent)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {agents.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No agents found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your first agent to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Agent
          </Button>
        </Box>
      )}

      {/* Add/Edit Agent Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingAgent ? 'Edit Agent' : 'Add New Agent'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="mobile"
              label="Mobile Number (with country code)"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.mobile}
              onChange={handleInputChange}
              error={!!formErrors.mobile}
              helperText={formErrors.mobile || 'Example: +1234567890'}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="password"
              label={editingAgent ? 'New Password (leave blank to keep current)' : 'Password'}
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
            >
              {submitting ? (
                <CircularProgress size={20} />
              ) : (
                editingAgent ? 'Update' : 'Create'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete agent <strong>{agentToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. All tasks assigned to this agent will remain in the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AgentManagement;
