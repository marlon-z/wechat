import React from 'react';
import { Typography, Card, Space, Avatar, Layout, Row, Col, Button, Divider } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, BookOutlined, WechatOutlined, InfoCircleOutlined, EditOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Content, Footer } = Layout;

const teamMembers = [
  {
    name: '开发负责人',
    role: '技术负责人',
    description: '负责整个应用的架构设计和核心功能开发，拥有多年React和前端开发经验。',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&seed=1'
  },
  {
    name: '设计师',
    role: 'UI/UX设计师',
    description: '负责应用的界面设计和用户体验优化，专注于创造简洁、美观、易用的界面。',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&seed=2'
  },
  {
    name: '测试工程师',
    role: '质量保证',
    description: '负责应用的测试和质量保证，确保每个功能都能正常运行并且没有bug。',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&seed=3'
  }
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            <Link to="/" style={{ color: '#00b96b' }}>Markdown编辑器</Link>
          </Title>
          <Space size="large">
            <Link to="/" style={{ color: '#555' }}><HomeOutlined /> 首页</Link>
            <Link to="/markdown-guide" style={{ color: '#555' }}><BookOutlined /> Markdown指南</Link>
            <Link to="/wechat-style" style={{ color: '#555' }}><WechatOutlined /> 微信排版</Link>
            <Link to="/about" style={{ color: '#00b96b' }}><InfoCircleOutlined /> 关于我们</Link>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/editor')} style={{ backgroundColor: '#00b96b' }}>
              打开编辑器
            </Button>
          </Space>
        </div>
      </div>

      <Content style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1}>关于我们</Title>
          <Paragraph>
            欢迎了解我们的Markdown编辑器项目！我们致力于创建一个简单、高效且功能强大的Markdown编辑工具，满足写作者、开发者和内容创作者的需求。
          </Paragraph>

          <Divider />

          <Title level={2}>我们的团队</Title>
          <Row gutter={[24, 24]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card hoverable>
                  <Space direction="vertical" style={{ textAlign: 'center', width: '100%' }}>
                    <Avatar size={80} src={member.avatar} />
                    <Title level={4}>{member.name}</Title>
                    <Text type="secondary">{member.role}</Text>
                    <Paragraph>{member.description}</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Title level={2}>产品理念</Title>
          <Card>
            <Paragraph>
              我们相信写作应该是简单而愉快的。我们的Markdown编辑器旨在提供一个无干扰的环境，让用户可以专注于内容创作，而不必担心复杂的格式和排版问题。
            </Paragraph>
            <Paragraph>
              我们的核心理念包括：
            </Paragraph>
            <ul>
              <li><Text strong>简洁</Text> - 干净的界面，无干扰的写作体验</li>
              <li><Text strong>高效</Text> - 丰富的快捷键和工具栏，提高写作效率</li>
              <li><Text strong>灵活</Text> - 适应不同的写作需求和输出格式</li>
              <li><Text strong>开放</Text> - 支持标准Markdown语法，与其他工具兼容</li>
            </ul>
          </Card>

          <Title level={2}>技术栈</Title>
          <Card>
            <Paragraph>
              我们的Markdown编辑器基于现代Web技术构建：
            </Paragraph>
            <ul>
              <li><Text strong>前端框架</Text>: React</li>
              <li><Text strong>UI组件库</Text>: Ant Design</li>
              <li><Text strong>Markdown解析</Text>: Marked.js</li>
              <li><Text strong>代码语法高亮</Text>: Prism.js</li>
              <li><Text strong>状态管理</Text>: Context API</li>
              <li><Text strong>路由</Text>: React Router</li>
            </ul>
          </Card>

          <Title level={2}>联系我们</Title>
          <Card>
            <Space size="large">
              <Button type="primary" icon={<MailOutlined />} style={{ backgroundColor: '#00b96b' }}>
                发送邮件
              </Button>
              <Button icon={<GithubOutlined />}>
                GitHub仓库
              </Button>
            </Space>
            <Paragraph style={{ marginTop: '1rem' }}>
              如有任何问题、建议或合作意向，欢迎通过以上方式与我们联系。我们期待听到您的声音！
            </Paragraph>
          </Card>

          <Button 
            type="primary" 
            size="large"
            style={{ marginTop: '2rem', backgroundColor: '#00b96b' }}
            onClick={() => navigate('/editor')}
          >
            开始使用Markdown编辑器
          </Button>
        </Space>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
        <Space size="large" style={{ marginBottom: '1rem' }}>
          <Link to="/">首页</Link>
          <Link to="/markdown-guide">Markdown指南</Link>
          <Link to="/wechat-style">微信排版</Link>
          <Link to="/about">关于我们</Link>
          <Link to="/editor">编辑器</Link>
        </Space>
        <div>
          © 2024 Markdown编辑器. 保留所有权利.
        </div>
      </Footer>
    </Layout>
  );
};

export default AboutPage; 