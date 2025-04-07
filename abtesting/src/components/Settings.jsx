import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Switch, Select, Space, Row, Col, message } from 'antd';
import { SaveOutlined, MailOutlined, ApiOutlined, BellOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('settings', JSON.stringify(values));
      setLoading(false);
      message.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div>
          <Title level={2}>Settings</Title>
          <Text type="secondary">Configure your A/B Testing Platform settings</Text>
        </div>
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card title="Email Configuration" className="settings-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                smtpServer: 'smtp.example.com',
                smtpPort: '587',
                senderEmail: 'noreply@example.com',
                senderName: 'A/B Testing Platform',
                apiKey: '••••••••••••••••',
                notifications: true,
                emailFrequency: 'daily',
              }}
            >
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Form.Item
                    label="SMTP Server"
                    name="smtpServer"
                    rules={[{ required: true, message: 'Please input your SMTP server!' }]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="smtp.example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="SMTP Port"
                    name="smtpPort"
                    rules={[{ required: true, message: 'Please input your SMTP port!' }]}
                  >
                    <Input prefix={<ApiOutlined />} placeholder="587" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Form.Item
                    label="Sender Email"
                    name="senderEmail"
                    rules={[
                      { required: true, message: 'Please input your sender email!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="noreply@example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Sender Name"
                    name="senderName"
                    rules={[{ required: true, message: 'Please input your sender name!' }]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="A/B Testing Platform" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="API Key"
                name="apiKey"
                rules={[{ required: true, message: 'Please input your API key!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter your API key" />
              </Form.Item>

              <Divider />

              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Form.Item
                    label="Email Notifications"
                    name="notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Notification Frequency"
                    name="emailFrequency"
                  >
                    <Select>
                      <Option value="realtime">Real-time</Option>
                      <Option value="daily">Daily</Option>
                      <Option value="weekly">Weekly</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                    Save Settings
                  </Button>
                  <Button onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Quick Actions" className="settings-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button icon={<MailOutlined />} block>
                Test Email Configuration
              </Button>
              <Button icon={<ApiOutlined />} block>
                Validate API Key
              </Button>
              <Button icon={<BellOutlined />} block>
                Send Test Notification
              </Button>
            </Space>
          </Card>

          <Card title="Help & Support" className="settings-card" style={{ marginTop: '24px' }}>
            <Text type="secondary">
              Need help with your settings? Check out our documentation or contact support.
            </Text>
            <Space direction="vertical" style={{ width: '100%', marginTop: '16px' }}>
              <Button type="link" block>
                View Documentation
              </Button>
              <Button type="link" block>
                Contact Support
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Settings; 