import { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Switch,
  Select,
  MenuItem,
  Grid,
  Box,
  FormControlLabel,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Mail as MailIcon,
  Api as ApiIcon,
  Notifications as NotificationsIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

function Settings() {
  const [formData, setFormData] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    senderEmail: 'noreply@example.com',
    senderName: 'A/B Testing Platform',
    apiKey: '••••••••••••••••',
    notifications: true,
    emailFrequency: 'daily',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notifications' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('settings', JSON.stringify(formData));
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success',
      });
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      smtpServer: 'smtp.example.com',
      smtpPort: '587',
      senderEmail: 'noreply@example.com',
      senderName: 'A/B Testing Platform',
      apiKey: '••••••••••••••••',
      notifications: true,
      emailFrequency: 'daily',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Configure your A/B Testing Platform settings
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Configuration
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="SMTP Server"
                      name="smtpServer"
                      value={formData.smtpServer}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: <MailIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="SMTP Port"
                      name="smtpPort"
                      value={formData.smtpPort}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: <ApiIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Sender Email"
                      name="senderEmail"
                      type="email"
                      value={formData.senderEmail}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: <MailIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Sender Name"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: <MailIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="API Key"
                      name="apiKey"
                      type="password"
                      value={formData.apiKey}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.notifications}
                          onChange={handleInputChange}
                          name="notifications"
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Notification Frequency</InputLabel>
                      <Select
                        name="emailFrequency"
                        value={formData.emailFrequency}
                        label="Notification Frequency"
                        onChange={handleInputChange}
                      >
                        <MenuItem value="realtime">Real-time</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        startIcon={<SaveIcon />}
                      >
                        Save Settings
                      </Button>
                      <Button onClick={handleReset}>
                        Reset
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<MailIcon />}
                  fullWidth
                >
                  Test Email Configuration
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ApiIcon />}
                  fullWidth
                >
                  Validate API Key
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                  fullWidth
                >
                  Send Test Notification
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Help & Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Need help with your settings? Check out our documentation or contact support.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="text" fullWidth>
                  View Documentation
                </Button>
                <Button variant="text" fullWidth>
                  Contact Support
                </Button>
              </Box>
            </CardContent>
          </Card>
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

export default Settings; 