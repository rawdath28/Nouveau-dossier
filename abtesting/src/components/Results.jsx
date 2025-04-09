import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useSearchParams } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function Results() {
  const [searchParams] = useSearchParams();
  const [selectedCampaign, setSelectedCampaign] = useState(searchParams.get('campaignId'));
  const [campaigns, setCampaigns] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Load campaigns from localStorage
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    setCampaigns(savedCampaigns);
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      // Load results from localStorage
      const savedResults = JSON.parse(localStorage.getItem(`results_${selectedCampaign}`) || 'null');
      if (!savedResults) {
        // Generate unique mock results based on campaign ID
        const campaignId = parseInt(selectedCampaign);
        const baseOpenRate = 40 + (campaignId % 20); // Varies between 40-60%
        const baseClickRate = 15 + (campaignId % 10); // Varies between 15-25%
        const baseConversionRate = 5 + (campaignId % 8); // Varies between 5-13%

        const mockResults = {
          variants: [
            { 
              name: 'Variant A', 
              openRate: baseOpenRate, 
              clickRate: baseClickRate, 
              conversionRate: baseConversionRate 
            },
            { 
              name: 'Variant B', 
              openRate: baseOpenRate + 5 + (campaignId % 5), 
              clickRate: baseClickRate + 3 + (campaignId % 4), 
              conversionRate: baseConversionRate + 2 + (campaignId % 3) 
            },
          ],
          deviceStats: [
            { name: 'Desktop', value: 55 + (campaignId % 20) },
            { name: 'Mobile', value: 25 + (campaignId % 15) },
            { name: 'Tablet', value: 20 - (campaignId % 10) },
          ],
          timeData: [
            { 
              time: 'Morning', 
              opens: 30 + (campaignId % 15), 
              clicks: 12 + (campaignId % 8) 
            },
            { 
              time: 'Afternoon', 
              opens: 40 + (campaignId % 20), 
              clicks: 18 + (campaignId % 10) 
            },
            { 
              time: 'Evening', 
              opens: 25 + (campaignId % 15), 
              clicks: 10 + (campaignId % 8) 
            },
          ],
        };
        localStorage.setItem(`results_${selectedCampaign}`, JSON.stringify(mockResults));
        setResults(mockResults);
      } else {
        setResults(savedResults);
      }
    }
  }, [selectedCampaign]);

  const data = results ? [
    {
      key: '1',
      metric: 'Open Rate',
      variantA: `${results.variants[0].openRate}%`,
      variantB: `${results.variants[1].openRate}%`,
      difference: `${results.variants[1].openRate - results.variants[0].openRate}%`,
    },
    {
      key: '2',
      metric: 'Click Rate',
      variantA: `${results.variants[0].clickRate}%`,
      variantB: `${results.variants[1].clickRate}%`,
      difference: `${results.variants[1].clickRate - results.variants[0].clickRate}%`,
    },
    {
      key: '3',
      metric: 'Conversion Rate',
      variantA: `${results.variants[0].conversionRate}%`,
      variantB: `${results.variants[1].conversionRate}%`,
      difference: `${results.variants[1].conversionRate - results.variants[0].conversionRate}%`,
    },
  ] : [];

  if (!selectedCampaign) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please select a campaign to view results
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Results
        </Typography>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Select a campaign</InputLabel>
          <Select
            value={selectedCampaign}
            label="Select a campaign"
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            {campaigns.map(campaign => (
              <MenuItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                A/B Test Results
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell>Variant A</TableCell>
                      <TableCell>Variant B</TableCell>
                      <TableCell>Difference</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.key}>
                        <TableCell>{row.metric}</TableCell>
                        <TableCell>{row.variantA}</TableCell>
                        <TableCell>{row.variantB}</TableCell>
                        <TableCell>{row.difference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance by Variant
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <BarChart
                  width={500}
                  height={300}
                  data={results?.variants}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="openRate" fill="#8884d8" name="Open Rate %" />
                  <Bar dataKey="clickRate" fill="#82ca9d" name="Click Rate %" />
                  <Bar dataKey="conversionRate" fill="#ffc658" name="Conversion Rate %" />
                </BarChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <PieChart width={500} height={300}>
                  <Pie
                    data={results?.deviceStats}
                    cx={250}
                    cy={150}
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {results?.deviceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance by Time of Day
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <BarChart
                  width={1000}
                  height={300}
                  data={results?.timeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="opens" fill="#8884d8" name="Opens" />
                  <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                </BarChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Results; 