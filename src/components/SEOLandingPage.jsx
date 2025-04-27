import React from 'react';
import { Typography, Row, Col, Card, Button, List, Divider, Menu, Space } from 'antd';
import { EditOutlined, WechatOutlined, FileTextOutlined, MobileOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const SEOLandingPage = ({ onStartEditing, locale, translations }) => {
  const navigate = useNavigate();
  
  // 使用t函数获取翻译
  const t = (key) => {
    // 支持嵌套键, 例如 'seo.title'
    const keys = key.split('.');
    let result = translations[locale];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // 如果找不到翻译，返回键名
        return key;
      }
    }
    
    return result;
  };

  const handleStartEditing = () => {
    if (onStartEditing) {
      onStartEditing();
    }
  };

  const features = [
    {
      icon: <EditOutlined style={{ fontSize: '2rem', color: '#00b96b' }} />,
      title: t('seo.features.professionalEditor.title'),
      description: t('seo.features.professionalEditor.description'),
    },
    {
      icon: <WechatOutlined style={{ fontSize: '2rem', color: '#00b96b' }} />,
      title: t('seo.features.wechatFormatting.title'),
      description: t('seo.features.wechatFormatting.description'),
    },
    {
      icon: <FileTextOutlined style={{ fontSize: '2rem', color: '#00b96b' }} />,
      title: t('seo.features.multipleThemes.title'),
      description: t('seo.features.multipleThemes.description'),
    },
    {
      icon: <MobileOutlined style={{ fontSize: '2rem', color: '#00b96b' }} />,
      title: t('seo.features.mobileView.title'),
      description: t('seo.features.mobileView.description'),
    },
    {
      icon: <BulbOutlined style={{ fontSize: '2rem', color: '#00b96b' }} />,
      title: t('seo.features.darkMode.title'),
      description: t('seo.features.darkMode.description'),
    },
  ];

  const markdownGuide = [
    '# Markdown基础语法指南',
    '## 标题使用#符号',
    '### 段落直接输入文本',
    '**粗体文本** 和 *斜体文本*',
    '- 无序列表项',
    '1. 有序列表项',
    '> 引用文本块',
    '`行内代码` 和 ```代码块```',
    '[链接文本](https://example.com)',
    '![图片描述](image.jpg)',
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <Space size="large">
          <Link to="/markdown-guide" style={{ color: '#00b96b' }}>{t('nav.markdownGuide')}</Link>
          <Link to="/wechat-style" style={{ color: '#00b96b' }}>{t('nav.wechatStyle')}</Link>
          <Link to="/about" style={{ color: '#00b96b' }}>{t('nav.about')}</Link>
          <Button type="primary" onClick={handleStartEditing} style={{ backgroundColor: '#00b96b' }}>{t('nav.editor')}</Button>
        </Space>
      </div>
      
      <Row gutter={[24, 48]}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={1}>{t('seo.title')} | {t('seo.subtitle')}</Title>
          <Paragraph style={{ fontSize: '1.2rem' }}>
            {t('seo.description')}
          </Paragraph>
          <Button type="primary" size="large" style={{ marginTop: '1rem', backgroundColor: '#00b96b' }} onClick={handleStartEditing}>
            {t('seo.startEditing')}
          </Button>
        </Col>

        <Col span={24}>
          <Divider orientation="left">
            <Title level={2}>{t('seo.features.title')}</Title>
          </Divider>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card hoverable style={{ height: '100%', textAlign: 'center' }}>
                  <div>{feature.icon}</div>
                  <Title level={4} style={{ marginTop: '1rem' }}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col span={24}>
          <Divider orientation="left">
            <Title level={2}>{t('seo.useCases.title')}</Title>
          </Divider>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Title level={3}>{t('seo.useCases.items')[0]}</Title>
              <Paragraph>
                {t('seo.useCases.description')}
              </Paragraph>
              <Button type="link" onClick={() => navigate('/markdown-guide')} style={{ color: '#00b96b', paddingLeft: 0 }}>
                {t('nav.markdownGuide')} &gt;
              </Button>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Markdown语法示例" style={{ height: '100%' }}>
                <List
                  dataSource={markdownGuide}
                  renderItem={item => (
                    <List.Item>
                      <Text code>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Divider orientation="left">
            <Title level={2}>{t('seo.useCases.title')}</Title>
          </Divider>
          <Row gutter={[24, 24]}>
            {t('seo.useCases.items').slice(0, 3).map((useCase, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card 
                  title={useCase} 
                  hoverable 
                  extra={index === 0 ? <Link to="/wechat-style" style={{ color: '#00b96b' }}>{t('more')}</Link> : null}
                >
                  <Paragraph>
                    {t('seo.useCases.description')}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col span={24} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Title level={2}>{t('seo.cta.title')}</Title>
          <Paragraph style={{ fontSize: '1.2rem' }}>
            {t('seo.description')}
          </Paragraph>
          <Button type="primary" size="large" style={{ marginTop: '1rem', backgroundColor: '#00b96b' }} onClick={handleStartEditing}>
            {t('seo.cta.button')}
          </Button>
        </Col>
        
        <Col span={24} style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Space size="large">
            <Link to="/markdown-guide" style={{ color: '#666' }}>{t('nav.markdownGuide')}</Link>
            <Link to="/wechat-style" style={{ color: '#666' }}>{t('nav.wechatStyle')}</Link>
            <Link to="/about" style={{ color: '#666' }}>{t('nav.about')}</Link>
            <Link to="/editor" style={{ color: '#666' }}>{t('nav.editor')}</Link>
          </Space>
          <Paragraph style={{ marginTop: '1rem', color: '#999' }}>
            © 2024 Markdown{t('editor')}. 
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
};

export default SEOLandingPage; 