import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Table, Statistic, Empty } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useSearchParams } from 'react-router-dom';

const { Option } = Select;

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
        // Generate mock results if none exist
        const mockResults = {
          variants: [
            { name: 'Variant A', openRate: 45, clickRate: 18, conversionRate: 9 },
            { name: 'Variant B', openRate: 52, clickRate: 22, conversionRate: 12 },
          ],
          deviceStats: [
            { name: 'Desktop', value: 60 },
            { name: 'Mobile', value: 30 },
            { name: 'Tablet', value: 10 },
          ],
          timeData: [
            { time: 'Morning', opens: 35, clicks: 15 },
            { time: 'Afternoon', opens: 45, clicks: 20 },
            { time: 'Evening', opens: 20, clicks: 10 },
          ],
        };
        localStorage.setItem(`results_${selectedCampaign}`, JSON.stringify(mockResults));
        setResults(mockResults);
      } else {
        setResults(savedResults);
      }
    }
  }, [selectedCampaign]);

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'Variant A',
      dataIndex: 'variantA',
      key: 'variantA',
    },
    {
      title: 'Variant B',
      dataIndex: 'variantB',
      key: 'variantB',
    },
    {
      title: 'Difference',
      dataIndex: 'difference',
      key: 'difference',
    },
  ];

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
      <div>
        <h1>Results</h1>
        <Empty description="Please select a campaign to view results" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1>Results</h1>
        <Select
          style={{ width: 300 }}
          placeholder="Select a campaign"
          value={selectedCampaign}
          onChange={setSelectedCampaign}
        >
          {campaigns.map(campaign => (
            <Option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </Option>
          ))}
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="A/B Test Results">
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Performance by Variant">
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
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Device Distribution">
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
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Performance by Time of Day">
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
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Results; 