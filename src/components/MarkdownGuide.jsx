import React from 'react';
import { Typography, Card, Space, Divider, Layout, Button, Row, Col } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, BookOutlined, WechatOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Content, Footer } = Layout;

const MarkdownGuide = () => {
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
            <Link to="/markdown-guide" style={{ color: '#00b96b' }}><BookOutlined /> Markdown指南</Link>
            <Link to="/wechat-style" style={{ color: '#555' }}><WechatOutlined /> 微信排版</Link>
            <Link to="/about" style={{ color: '#555' }}><InfoCircleOutlined /> 关于我们</Link>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/editor')} style={{ backgroundColor: '#00b96b' }}>
              打开编辑器
            </Button>
          </Space>
        </div>
      </div>

      <Content style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1}>Markdown 语法完全指南</Title>
          <Paragraph>
            Markdown 是一种轻量级标记语言，创建于2004年，目的是让人们"使用易读易写的纯文本格式编写文档，然后转换成有效的HTML文档"。
            本指南将详细介绍 Markdown 的各种语法和用法。
          </Paragraph>

          <Divider />

          <Title level={2}>基本语法</Title>
          
          <Title level={3}>标题</Title>
          <Card>
            <Paragraph>
              使用 # 号可表示 1-6 级标题，一级标题对应一个 # 号，二级标题对应两个 # 号，以此类推。
            </Paragraph>
            <Paragraph>
              <Text code>
                # 一级标题<br />
                ## 二级标题<br />
                ### 三级标题<br />
                #### 四级标题<br />
                ##### 五级标题<br />
                ###### 六级标题
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>段落和换行</Title>
          <Card>
            <Paragraph>
              段落的前后必须是空行，也就是段落前后必须是空行才能被识别为段落。如果你想在段落内强制换行，可以在行尾加两个以上的空格，然后按 Enter 键。
            </Paragraph>
          </Card>

          <Title level={3}>强调</Title>
          <Card>
            <Paragraph>
              <Text code>
                *斜体文本*<br />
                _斜体文本_<br />
                **粗体文本**<br />
                __粗体文本__<br />
                ***粗斜体文本***<br />
                ___粗斜体文本___
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>列表</Title>
          <Card>
            <Paragraph>无序列表使用星号(*), 加号(+)或是减号(-) 作为列表标记：</Paragraph>
            <Paragraph>
              <Text code>
                * 第一项<br />
                * 第二项<br />
                * 第三项<br /><br />

                + 第一项<br />
                + 第二项<br />
                + 第三项<br /><br />

                - 第一项<br />
                - 第二项<br />
                - 第三项
              </Text>
            </Paragraph>
            <Paragraph>有序列表使用数字并加上 . 号来表示：</Paragraph>
            <Paragraph>
              <Text code>
                1. 第一项<br />
                2. 第二项<br />
                3. 第三项
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>链接</Title>
          <Card>
            <Paragraph>
              <Text code>
                [链接名称](链接地址)<br />
                [链接名称](链接地址 "链接标题")
              </Text>
            </Paragraph>
            <Paragraph>例如：</Paragraph>
            <Paragraph>
              <Text code>
                这是一个链接 [Markdown语法](https://markdown.com.cn)<br />
                这是一个链接 [Markdown语法](https://markdown.com.cn "最好的Markdown教程")
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>图片</Title>
          <Card>
            <Paragraph>
              <Text code>
                ![替代文本](图片链接)<br />
                ![替代文本](图片链接 "图片标题")
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>引用</Title>
          <Card>
            <Paragraph>在段落开头使用 {'>'} 符号 ，然后后面紧跟一个空格符号：</Paragraph>
            <Paragraph>
              <Text code>
                {'>'} 这是一个引用<br />
                {'>'} 这是第二行引用文本
              </Text>
            </Paragraph>
            <Paragraph>嵌套引用：</Paragraph>
            <Paragraph>
              <Text code>
                {'>'} 最外层引用<br />
                {'>'} {'>'} 第一层嵌套引用<br />
                {'>'} {'>'} {'>'} 第二层嵌套引用
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>代码</Title>
          <Card>
            <Paragraph>行内代码：</Paragraph>
            <Paragraph>
              <Text code>
                `code`
              </Text>
            </Paragraph>
            <Paragraph>代码块：</Paragraph>
            <Paragraph>
              <Text code>
                ```javascript<br />
                function add(a, b) {'{'}
                  return a + b;
                {'}'}<br />
                ```
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>表格</Title>
          <Card>
            <Paragraph>
              <Text code>
                | 表头   | 表头   |<br />
                | ------ | ------ |<br />
                | 单元格 | 单元格 |<br />
                | 单元格 | 单元格 |
              </Text>
            </Paragraph>
            <Paragraph>对齐方式：</Paragraph>
            <Paragraph>
              <Text code>
                | 左对齐 | 居中对齐 | 右对齐 |<br />
                | :----- | :------: | -----: |<br />
                | 单元格 | 单元格   | 单元格 |<br />
                | 单元格 | 单元格   | 单元格 |
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>水平线</Title>
          <Card>
            <Paragraph>以下三种方式都可以创建水平线：</Paragraph>
            <Paragraph>
              <Text code>
                ***<br />
                ---<br />
                ___
              </Text>
            </Paragraph>
          </Card>

          <Title level={2}>高级技巧</Title>

          <Title level={3}>任务列表</Title>
          <Card>
            <Paragraph>
              <Text code>
                - [x] 已完成任务<br />
                - [ ] 未完成任务<br />
                - [ ] 未完成任务
              </Text>
            </Paragraph>
          </Card>

          <Title level={3}>脚注</Title>
          <Card>
            <Paragraph>
              <Text code>
                这里有一个脚注[^1]<br /><br />
                [^1]: 这是脚注的内容
              </Text>
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

export default MarkdownGuide; 