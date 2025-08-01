import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Layout from './Layout';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError('');
    setUploadResult(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    setError('');
    setUploadResult(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return 'Please select a CSV, XLSX, or XLS file';
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadResult(response.data.data);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.join(', '));
      } else {
        setError(error.response?.data?.message || 'Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload CSV File
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload a CSV, XLSX, or XLS file to distribute among agents.
        </Typography>
      </Box>

          {/* Instructions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Instructions
          </Typography>
          <Typography variant="body2" paragraph>
            1. Prepare your CSV file with the required columns: <strong>FirstName</strong>, <strong>Phone</strong>, <strong>Notes</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            2. Make sure your file is in CSV, XLSX, or XLS format (maximum 5MB)
          </Typography>
          <Typography variant="body2" paragraph>
            3. Upload the file and it will be automatically distributed equally among all available agents
          </Typography>
          <Typography variant="body2">
            4. Each agent will receive their assigned tasks which they can view after logging in
          </Typography>
        </CardContent>
      </Card>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {uploadResult && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            File uploaded and distributed successfully!
          </Typography>
          <Typography variant="body2">
            {uploadResult.totalItems} items distributed among {uploadResult.summary.totalAgents} agents
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Paper
            sx={{
              p: 4,
              border: '2px dashed',
              borderColor: file ? 'success.main' : 'grey.300',
              borderRadius: 2,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              {file ? 'File Selected' : 'Drop your file here or click to browse'}
            </Typography>
            
            {file ? (
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={<DescriptionIcon />}
                  label={file.name}
                  color="success"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Size: {formatFileSize(file.size)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Supported formats: CSV, XLSX, XLS (Max 5MB)
              </Typography>
            )}
          </Paper>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={!file || uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            >
              {uploading ? 'Uploading...' : 'Upload and Distribute'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                File Requirements
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Required Columns"
                    secondary="FirstName, Phone, Notes"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Supported Formats"
                    secondary="CSV, XLSX, XLS"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Maximum File Size"
                    secondary="5MB"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Distribution"
                    secondary="Items will be distributed equally among 5 agents"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sample CSV Format
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`FirstName,Phone,Notes
John,+1234567890,Important client
Jane,+0987654321,Follow up needed
Bob,+1122334455,New prospect`}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {uploadResult && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Distribution Summary
          </Typography>
          <Grid container spacing={2}>
            {uploadResult.distributions.map((dist, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {dist.agent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {dist.agent.email}
                    </Typography>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`${dist.itemCount} items`}
                      color="success"
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Layout>
  );
};

export default FileUpload;
