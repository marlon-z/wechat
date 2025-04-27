// 这是一个Web Worker，用于处理耗时的Markdown解析操作
self.onmessage = function(e) {
  const { action, payload } = e.data;
  
  if (action === 'parseMarkdown') {
    // 简单的Markdown解析逻辑
    const { content } = payload;
    
    // 处理标题
    let parsed = content
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
      .replace(/^##### (.*?)$/gm, '<h5>$1</h5>')
      .replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
      
    // 处理粗体和斜体
    parsed = parsed
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>')
      .replace(/\_(.*?)\_/g, '<em>$1</em>');
      
    // 处理代码块
    parsed = parsed
      .replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
      
    // 处理列表
    parsed = parsed
      .replace(/^\- (.*?)$/gm, '<li>$1</li>')
      .replace(/^\+ (.*?)$/gm, '<li>$1</li>')
      .replace(/^\* (.*?)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
      
    // 处理链接和图片
    parsed = parsed
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />');
      
    // 处理段落
    parsed = parsed
      .replace(/^(?!<[a-z]).+$/gm, '<p>$&</p>');
      
    // 返回解析结果
    self.postMessage({
      action: 'parseMarkdownResult',
      result: parsed
    });
  }
}; 