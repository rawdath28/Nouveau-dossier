import { Layout, Menu, Typography } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  DashboardOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  SettingOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import Results from './components/Results';
import Settings from './components/Settings';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Layout className="app-layout">
        <Header className="app-header">
          <div className="app-logo">
            <DesktopOutlined style={{ marginRight: 8 }} />
            A/B Testing Platform
          </div>
        </Header>
        <Layout>
          <Sider width={250} theme="light" className="app-sidebar">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
              items={[
                {
                  key: '1',
                  icon: <DashboardOutlined />,
                  label: <Link to="/">Dashboard</Link>,
                },
                {
                  key: '2',
                  icon: <ExperimentOutlined />,
                  label: <Link to="/campaigns">Campaigns</Link>,
                },
                {
                  key: '3',
                  icon: <BarChartOutlined />,
                  label: <Link to="/results">Results</Link>,
                },
                {
                  key: '4',
                  icon: <SettingOutlined />,
                  label: <Link to="/settings">Settings</Link>,
                },
              ]}
            />
          </Sider>
          <Content className="app-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/results" element={<Results />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
      <div className="mobile-warning">
        <div>
          <Title level={2} style={{ color: 'white' }}>Desktop Only</Title>
          <p>This platform is optimized for desktop use. Please access it from a desktop computer for the best experience.</p>
        </div>
      </div>
    </Router>
  );
}

export default App;
