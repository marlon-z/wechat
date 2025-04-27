const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'articles.json');

// 确保数据文件存在
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const defaultArticle = {
      id: '1',
      title: '欢迎使用',
      content: '# 欢迎使用 Markdown 编辑器\n\n这是一个简单而强大的 Markdown 编辑器...',
      isDefault: true
    };
    await fs.writeFile(DATA_FILE, JSON.stringify([defaultArticle], null, 2));
  }
}

// 获取所有文章
app.get('/api/articles', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: '获取文章列表失败' });
  }
});

// 获取单个文章
app.get('/api/articles/:id', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const articles = JSON.parse(data);
    const article = articles.find(a => a.id === req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 创建新文章
app.post('/api/articles', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const articles = JSON.parse(data);
    
    const newArticle = {
      id: Date.now().toString(),
      title: req.body.title || '新文章',
      content: req.body.content || '# 新文章\n\n开始编写...',
      lastSaved: new Date().toLocaleString()
    };
    
    articles.push(newArticle);
    await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2));
    
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: '创建文章失败' });
  }
});

// 更新文章
app.put('/api/articles/:id', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    let articles = JSON.parse(data);
    
    const index = articles.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    // 不允许修改默认文章
    if (articles[index].isDefault) {
      return res.status(403).json({ error: '默认文章不可修改' });
    }
    
    articles[index] = {
      ...articles[index],
      ...req.body,
      lastSaved: new Date().toLocaleString()
    };
    
    await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2));
    res.json(articles[index]);
  } catch (error) {
    res.status(500).json({ error: '更新文章失败' });
  }
});

// 删除文章
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    let articles = JSON.parse(data);
    
    const article = articles.find(a => a.id === req.params.id);
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    // 不允许删除默认文章
    if (article.isDefault) {
      return res.status(403).json({ error: '默认文章不可删除' });
    }
    
    articles = articles.filter(a => a.id !== req.params.id);
    
    if (articles.length === 0) {
      return res.status(400).json({ error: '至少保留一篇文章' });
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2));
    res.json({ message: '文章已删除' });
  } catch (error) {
    res.status(500).json({ error: '删除文章失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 