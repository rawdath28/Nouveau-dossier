import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { 
  getCampaignById, 
  getCampaignResults, 
  saveCampaignResults 
} from '../services/campaignService';

function Results() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const campaignId = searchParams.get('campaignId');
  
  const [campaign, setCampaign] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (campaignId) {
      loadCampaignData();
    }
  }, [campaignId]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load campaign details
      const campaignData = await getCampaignById(campaignId, currentUser.id);
      if (!campaignData) {
        throw new Error('Campaign not found');
      }
      setCampaign(campaignData);

      // Load campaign results
      const resultsData = await getCampaignResults(campaignId, currentUser.id);
      setResults(resultsData || generateInitialResults());
    } catch (err) {
      console.error('Error loading campaign data:', err);
      setError(err.message);
      setSnackbar({
        open: true,
        message: 'Failed to load campaign data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInitialResults = () => {
    return {
      variant_a: {
        views: 0,
        clicks: 0,
        conversions: 0,
      },
      variant_b: {
        views: 0,
        clicks: 0,
        conversions: 0,
      },
    };
  };

  const calculateMetrics = (variant) => {
    if (!results || !results[variant]) return { ctr: 0, cvr: 0 };
    
    const { views, clicks, conversions } = results[variant];
    const ctr = views > 0 ? (clicks / views) * 100 : 0;
    const cvr = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    return { ctr, cvr };
  };

  const handleMetricUpdate = async (variant, metric, value) => {
    try {
      setLoading(true);
      const newResults = {
        ...results,
        [variant]: {
          ...results[variant],
          [metric]: Math.max(0, parseInt(value) || 0),
        },
      };
      
      await saveCampaignResults(campaignId, newResults, currentUser.id);
      setResults(newResults);
      
      setSnackbar({
        open: true,
        message: 'Results updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating results:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update results',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !campaign) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No campaign selected</Alert>
      </Box>
    );
  }

  const chartData = [
    {
      name: 'Variant A',
      views: results?.variant_a.views || 0,
      clicks: results?.variant_a.clicks || 0,
      conversions: results?.variant_a.conversions || 0,
    },
    {
      name: 'Variant B',
      views: results?.variant_b.views || 0,
      clicks: results?.variant_b.clicks || 0,
      conversions: results?.variant_b.conversions || 0,
    },
  ];

  const variantAMetrics = calculateMetrics('variant_a');
  const variantBMetrics = calculateMetrics('variant_b');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {campaign.name} - Results
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {campaign.description}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Variant A Metrics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                CTR: {variantAMetrics.ctr.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CVR: {variantAMetrics.cvr.toFixed(2)}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <input
                type="number"
                value={results?.variant_a.views || 0}
                onChange={(e) => handleMetricUpdate('variant_a', 'views', e.target.value)}
                placeholder="Views"
                disabled={loading}
              />
              <input
                type="number"
                value={results?.variant_a.clicks || 0}
                onChange={(e) => handleMetricUpdate('variant_a', 'clicks', e.target.value)}
                placeholder="Clicks"
                disabled={loading}
              />
              <input
                type="number"
                value={results?.variant_a.conversions || 0}
                onChange={(e) => handleMetricUpdate('variant_a', 'conversions', e.target.value)}
                placeholder="Conversions"
                disabled={loading}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Variant B Metrics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                CTR: {variantBMetrics.ctr.toFixed(2)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CVR: {variantBMetrics.cvr.toFixed(2)}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <input
                type="number"
                value={results?.variant_b.views || 0}
                onChange={(e) => handleMetricUpdate('variant_b', 'views', e.target.value)}
                placeholder="Views"
                disabled={loading}
              />
              <input
                type="number"
                value={results?.variant_b.clicks || 0}
                onChange={(e) => handleMetricUpdate('variant_b', 'clicks', e.target.value)}
                placeholder="Clicks"
                disabled={loading}
              />
              <input
                type="number"
                value={results?.variant_b.conversions || 0}
                onChange={(e) => handleMetricUpdate('variant_b', 'conversions', e.target.value)}
                placeholder="Conversions"
                disabled={loading}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="clicks" fill="#82ca9d" />
                <Bar dataKey="conversions" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

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

export default Results; 