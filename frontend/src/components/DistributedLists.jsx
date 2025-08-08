import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  Notes as NotesIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';
import Layout from './Layout';

const DistributedLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDistributedLists();
  }, []);

  const fetchDistributedLists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/lists`);
      if (response.data.success) {
        setLists(response.data.data.lists);
      }
    } catch (error) {
      console.error('Error fetching distributed lists:', error);
      setError('Failed to load distributed lists');
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
            Distributed Lists
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDistributedLists}
          >
            Refresh
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          View all uploaded files and their distribution among agents.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {lists.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No distributed lists found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a CSV file to see distributions here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {lists.map((list, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {list.fileName || 'Unknown File'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      icon={<DescriptionIcon />}
                      label={`${list.totalItems || 0} items`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={formatDate(list.uploadDate)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Distributed among {list.distributions?.length || 0} agents
                </Typography>

                <Grid container spacing={2}>
                  {(list.distributions || []).map((distribution, distIndex) => (
                    <Grid item xs={12} md={6} lg={4} key={distIndex}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <PersonIcon color="primary" />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1">
                                {distribution.agent?.name || 'Unknown Agent'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {distribution.agent?.email || 'No email'}
                              </Typography>
                            </Box>
                            <Chip
                              label={`${distribution.itemCount || 0} items`}
                              size="small"
                              color="success"
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
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
                                {(distribution.items || []).map((item, itemIndex) => (
                                  <TableRow key={itemIndex}>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        {item?.firstName || '-'}
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        {item?.phone || '-'}
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <NotesIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        {item?.notes || '-'}
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Layout>
  );
};

export default DistributedLists;
