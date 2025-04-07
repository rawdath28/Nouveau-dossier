import { Row, Col, Card, Statistic, Typography, Divider, Space, Button } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import {
  ExperimentOutlined,
  RocketOutlined,
  MailOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <Title level={2}>Dashboard</Title>
          <Text type="secondary">Welcome to your A/B Testing Platform</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/campaigns')}
        >
          New Campaign
        </Button>
      </div>

      <Divider />

      <Row gutter={[24, 24]} className="dashboard-stats">
        <Col span={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Total Campaigns"
              value={summary.totalCampaigns}
              prefix={<ExperimentOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Active Tests"
              value={summary.activeTests}
              prefix={<RocketOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Total Emails Sent"
              value={summary.totalEmails}
              prefix={<MailOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 15%
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="Average Open Rate"
              value={summary.avgOpenRate}
              suffix="%"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: summary.avgOpenRate > 40 ? '#52c41a' : '#f5222d' }}
              suffix={
                <span style={{ fontSize: '14px', color: summary.avgOpenRate > 40 ? '#52c41a' : '#f5222d' }}>
                  {summary.avgOpenRate > 40 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} 5%
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={16}>
          <Card className="chart-container" title="Performance Trends">
            <div style={{ height: 400, width: '100%' }}>
              <ResponsiveContainer>
                <LineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    padding={{ left: 30, right: 30 }}
                  />
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
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="chart-container" title="Device Distribution">
            <div style={{ height: 400, width: '100%' }}>
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
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card className="chart-container" title="Performance by Time of Day">
            <div style={{ height: 400, width: '100%' }}>
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
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard; 