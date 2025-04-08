import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { 
  getCampaigns, 
  createCampaign, 
  deleteCampaign 
} from '../services/campaignService';

function Campaigns() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns(currentUser.id);
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load campaigns',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      setLoading(true);
      const newCampaign = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        target_audience: formData.targetAudience,
        start_date: formData.startDate,
        end_date: formData.endDate,
      };
      
      await createCampaign(newCampaign, currentUser.id);
      
      setSnackbar({
        open: true,
        message: 'Campaign created successfully!',
        severity: 'success',
      });
      
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        targetAudience: '',
        startDate: '',
        endDate: '',
      });
      
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create campaign',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      setLoading(true);
      await deleteCampaign(campaignId, currentUser.id);
      
      setSnackbar({
        open: true,
        message: 'Campaign deleted successfully!',
        severity: 'success',
      });
      
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete campaign',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Campaigns
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          Create Campaign
        </Button>
      </Box>

      {loading && campaigns.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/results?campaignId=${campaign.id}`)}
                      disabled={loading}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {campaigns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No campaigns found. Create your first campaign!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Create New Campaign</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Campaign Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="targetAudience"
            label="Target Audience"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.targetAudience}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.startDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.endDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateCampaign} 
            variant="contained" 
            disabled={!formData.name || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Campaigns; 