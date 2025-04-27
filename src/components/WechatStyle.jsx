import React from 'react';
import { Typography, Card, Space, Layout, Row, Col, Button, Divider, Image } from 'antd';
import { HomeOutlined, BookOutlined, WechatOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;

// 定义默认图片URL，避免base64编码
const DEFAULT_IMAGE = "https://placehold.co/400x300/e2e8f0/1e293b?text=Image";

const features = [
  {
    title: '精美排版',
    description: '自动优化标题、段落、引用和列表的样式，使文章清晰易读，符合微信公众号的阅读体验。',
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    title: '代码高亮',
    description: '支持多种编程语言的代码高亮，使代码块更易阅读，适合技术类文章的创作。',
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    title: '图片优化',
    description: '自动为图片添加边框、圆角和阴影效果，美化文章整体视觉效果，提升读者体验。',
    image: 'https://picsum.photos/400/300?random=3'
  }
];

const steps = [
  {
    title: '步骤一：编写Markdown',
    description: '使用我们的Markdown编辑器编写文章内容，支持所有标准Markdown语法。'
  },
  {
    title: '步骤二：切换到微信样式',
    description: '点击"微信样式"按钮，预览将以微信公众号文章的样式显示。'
  },
  {
    title: '步骤三：复制HTML',
    description: '点击"复制HTML"按钮，获取格式化后的HTML代码。'
  },
  {
    title: '步骤四：粘贴到公众号',
    description: '在微信公众号编辑器中点击"插入-HTML"，粘贴HTML代码即可。'
  }
];

const WechatStyle = () => {
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
            <Link to="/wechat-style" style={{ color: '#00b96b' }}><WechatOutlined /> 微信排版</Link>
            <Link to="/about" style={{ color: '#555' }}><InfoCircleOutlined /> 关于我们</Link>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/editor')} style={{ backgroundColor: '#00b96b' }}>
              打开编辑器
            </Button>
          </Space>
        </div>
      </div>

      <Content style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1}>微信排版样式</Title>
          <Paragraph>
            我们的Markdown编辑器提供了一套专为微信公众号文章优化的排版样式。使用这套样式，您可以轻松创建出美观、专业的微信公众号文章，无需额外的排版工作。
          </Paragraph>

          <Divider />

          <Title level={2}>样式特点</Title>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card hoverable>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px' }}
                      fallback={DEFAULT_IMAGE}
                    />
                    <Title level={4} style={{ marginTop: '16px' }}>{feature.title}</Title>
                    <Paragraph>{feature.description}</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <Title level={2}>预览示例</Title>
          <Card>
            <div className="wechat-preview">
              <Image
                src="https://picsum.photos/800/400?random=4"
                alt="微信文章预览"
                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                fallback={DEFAULT_IMAGE}
              />
              <div style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                <Title level={3} style={{ marginTop: 0 }}>微信文章预览效果</Title>
                <Paragraph>
                  这是使用我们的微信样式排版后的文章预览效果。注意标题的字体大小和颜色、段落的间距、引用的样式以及整体的布局结构。
                </Paragraph>
                <Paragraph>
                  通过我们的编辑器，您可以轻松创建出如上图所示的精美排版文章，让您的内容在微信公众号平台上脱颖而出。
                </Paragraph>
              </div>
            </div>
          </Card>

          <Divider />

          <Title level={2}>使用步骤</Title>
          <Row gutter={[24, 24]}>
            {steps.map((step, index) => (
              <Col xs={24} sm={12} key={index}>
                <Card hoverable>
                  <Title level={4}>{step.title}</Title>
                  <Paragraph>{step.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <Card style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Space direction="vertical" size="large">
              <Title level={3}>立即体验微信排版功能</Title>
              <Paragraph>
                通过我们的Markdown编辑器，您可以轻松创建出符合微信公众号平台风格的精美文章，
                让您的内容更具吸引力和专业感。
              </Paragraph>
              <Button 
                type="primary" 
                size="large" 
                icon={<EditOutlined />}
                onClick={() => navigate('/editor')}
                style={{ backgroundColor: '#00b96b' }}
              >
                打开编辑器体验
              </Button>
            </Space>
          </Card>
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

export default WechatStyle; 