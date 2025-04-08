import { Grid, Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import {
  Science as ScienceIcon,
  RocketLaunch as RocketIcon,
  Mail as MailIcon,
  ShowChart as ChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalCampaigns: 0,
    activeTests: 0,
    totalEmails: 0,
    avgOpenRate: 0,
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    // Load campaigns from localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const activeTests = campaigns.filter(campaign => campaign.status === 'Active').length;
    
    // Calculate summary statistics
    const totalEmails = campaigns.reduce((sum, campaign) => {
      const results = JSON.parse(localStorage.getItem(`results_${campaign.id}`) || 'null');
      return sum + (results?.variants?.[0]?.openRate || 0) + (results?.variants?.[1]?.openRate || 0);
    }, 0);

    const avgOpenRate = campaigns.length > 0
      ? campaigns.reduce((sum, campaign) => {
          const results = JSON.parse(localStorage.getItem(`results_${campaign.id}`) || 'null');
          const campaignAvg = results
            ? (results.variants[0].openRate + results.variants[1].openRate) / 2
            : 0;
          return sum + campaignAvg;
        }, 0) / campaigns.length
      : 0;

    setSummary({
      totalCampaigns: campaigns.length,
      activeTests,
      totalEmails,
      avgOpenRate: avgOpenRate.toFixed(1),
    });

    // Generate performance data for the last 4 months
    const currentDate = new Date();
    const performanceData = Array.from({ length: 4 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - (3 - i));
      return {
        date: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        openRate: Math.round(40 + Math.random() * 20),
        clickRate: Math.round(10 + Math.random() * 15),
        conversionRate: Math.round(5 + Math.random() * 10),
      };
    });

    setPerformanceData(performanceData);

    // Generate device data
    setDeviceData([
      { name: 'Desktop', value: 65 },
      { name: 'Mobile', value: 25 },
      { name: 'Tablet', value: 10 },
    ]);

    // Generate time data
    setTimeData([
      { time: 'Morning', opens: 35, clicks: 15 },
      { time: 'Afternoon', opens: 45, clicks: 20 },
      { time: 'Evening', opens: 20, clicks: 10 },
    ]);
  }, []);

  const StatCard = ({ title, value, icon, trend, trendValue }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
          {title === 'Average Open Rate' && '%'}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          {trend === 'up' ? (
            <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
          ) : (
            <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            color={trend === 'up' ? 'success.main' : 'error.main'}
          >
            {trendValue}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome to your A/B Testing Platform
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/campaigns')}
        >
          New Campaign
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Campaigns"
            value={summary.totalCampaigns}
            icon={<ScienceIcon color="primary" />}
            trend="up"
            trendValue={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Tests"
            value={summary.activeTests}
            icon={<RocketIcon color="primary" />}
            trend="up"
            trendValue={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Emails Sent"
            value={summary.totalEmails}
            icon={<MailIcon color="primary" />}
            trend="up"
            trendValue={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Open Rate"
            value={summary.avgOpenRate}
            icon={<ChartIcon color="primary" />}
            trend={summary.avgOpenRate > 40 ? "up" : "down"}
            trendValue={5}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Trends
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="openRate"
                      stroke="#8884d8"
                      name="Open Rate %"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="clickRate"
                      stroke="#82ca9d"
                      name="Click Rate %"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversionRate"
                      stroke="#ffc658"
                      name="Conversion Rate %"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Distribution
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance by Time of Day
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart
                    data={timeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="opens" fill="#8884d8" name="Opens" />
                    <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 