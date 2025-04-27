import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import MDEditor, { getCommands } from '@uiw/react-md-editor';
import { Layout, Typography, theme as antTheme, Button, Space, App as AntApp, ConfigProvider, message, Menu, Input, Switch, Select, Divider, Dropdown, Radio, Tooltip, Slider, Spin } from 'antd';
import { 
  SettingOutlined, 
  CopyOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SaveOutlined, 
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined, 
  GlobalOutlined, 
  ReloadOutlined,
  FileTextOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import './App.css';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';
import koKR from 'antd/locale/ko_KR';
import frFR from 'antd/locale/fr_FR';
import deDE from 'antd/locale/de_DE';
import esES from 'antd/locale/es_ES';
import ptPT from 'antd/locale/pt_PT';
import ruRU from 'antd/locale/ru_RU';
import ColorPicker from './ColorPicker';
import SEOLandingPage from './components/SEOLandingPage';

// 使用React.lazy懒加载非关键路径组件
const LazyMarkdownGuide = lazy(() => import('./components/MarkdownGuide'));
const LazyWechatStyle = lazy(() => import('./components/WechatStyle.jsx'));
const LazyAboutPage = lazy(() => import('./components/AboutPage'));

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface Article {
  id: string;
  title: string;
  content: string;
  lastSaved?: string;
  isDefault?: boolean;
  isEditing?: boolean;
}

const DEFAULT_CONTENT = `# 欢迎使用 Markdown 编辑器

这是一个简单而强大的 Markdown 编辑器，帮助你更好地创作和管理文章。

## 基本功能

1. **文章管理**
   - 点击左上角 "+" 按钮创建新文章
   - 点击文章右侧保存按钮保存文章
   - 点击文章右侧删除按钮删除文章（本说明文档不可删除）

2. **编辑功能**
   - 支持标准 Markdown 语法
   - 实时预览编辑效果
   - 自动保存到本地存储

3. **其他功能**
   - 点击右上角复制按钮复制全文
   - 点击左侧折叠按钮收起/展开文章列表

## Markdown 语法示例

### 标题
# 一级标题
## 二级标题
### 三级标题

### 列表
- 无序列表项
- 另一个无序列表项
  - 缩进的列表项

1. 有序列表项
2. 另一个有序列表项

### 强调
*斜体文本* 或 _斜体文本_
**粗体文本** 或 __粗体文本__
***粗斜体文本*** 或 ___粗斜体文本___

### 引用
> 这是一个引用
> 可以有多行

### 代码
行内代码：\`console.log('Hello World')\`

代码块：
\`\`\`javascript
function greeting(name) {
  console.log('Hello, ' + name + '!');
}
\`\`\`

### 表格
| 表头1 | 表头2 |
|-------|-------|
| 单元格1 | 单元格2 |
| 单元格3 | 单元格4 |

### 链接和图片
[链接文本](https://example.com)
![图片描述](https://example.com/image.jpg)

开始使用吧！创建你的第一篇文章！`;

const MARKDOWN_GUIDE = `# Markdown 语法指南

这是一个完整的 Markdown 语法指南，帮助你更好地使用 Markdown 编辑器。

## 基础语法

### 1. 标题

使用 \`#\` 符号可以创建标题，数量表示级别：

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
\`\`\`

### 2. 强调

\`\`\`markdown
*斜体文本* 或 _斜体文本_
**粗体文本** 或 __粗体文本__
***粗斜体文本*** 或 ___粗斜体文本___
~~删除线文本~~
\`\`\`

效果：
*斜体文本* 或 _斜体文本_
**粗体文本** 或 __粗体文本__
***粗斜体文本*** 或 ___粗斜体文本___
~~删除线文本~~

### 3. 列表

无序列表使用 \`-\`、\`*\` 或 \`+\`：

\`\`\`markdown
- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2
\`\`\`

有序列表使用数字加点：

\`\`\`markdown
1. 第一项
2. 第二项
3. 第三项
\`\`\`

### 4. 链接和图片

链接：
\`\`\`markdown
[链接文字](链接地址 "可选标题")
[Markdown 教程](https://markdown.com.cn "最好的markdown教程")
\`\`\`

图片：
\`\`\`markdown
![替代文字](图片地址 "可选标题")
![Markdown Logo](https://markdown.com.cn/hero.png "Markdown Logo")
\`\`\`

### 5. 引用

\`\`\`markdown
> 这是一个引用
> 
> 引用可以有多个段落
>> 这是嵌套引用
\`\`\`

### 6. 代码

行内代码：
\`\`\`markdown
这是一段包含 \`行内代码\` 的文本
\`\`\`

代码块：
\`\`\`markdown
\`\`\`javascript
function hello() {
  console.log('Hello, Markdown!');
}
\`\`\`
\`\`\`

## 扩展语法

### 1. 表格

\`\`\`markdown
| 表头1 | 表头2 | 表头3 |
|-------|:-----:|------:|
| 左对齐 | 居中 | 右对齐 |
| 内容 | 内容 | 内容 |
\`\`\`

### 2. 任务列表

\`\`\`markdown
- [x] 已完成任务
- [ ] 未完成任务
- [ ] ~~取消的任务~~
\`\`\`

### 3. 脚注

\`\`\`markdown
这里是一段文字[^1]
[^1]: 这里是脚注内容
\`\`\`

### 4. 数学公式

行内公式：
\`\`\`markdown
这是一个行内公式：$E=mc^2$
\`\`\`

块级公式：
\`\`\`markdown
$$
\\sum_{i=1}^n a_i=0
$$
\`\`\`

### 5. HTML 支持

Markdown 支持直接使用 HTML：

\`\`\`markdown
<div align="center">
  <h1>居中标题</h1>
    </div>

<span style="color: red;">红色文字</span>
\`\`\`

## 最佳实践

1. **保持简洁**：Markdown 的设计初衷是简洁易读
2. **合理使用空行**：在不同元素之间添加空行提高可读性
3. **适当缩进**：列表嵌套时使用缩进
4. **一致性**：在整个文档中保持格式一致

## 常见问题

1. **换行**：在行末添加两个空格或使用空行来换行
2. **转义字符**：使用 \\ 来转义 Markdown 特殊字符
3. **空格敏感**：某些语法对空格敏感，注意格式

## 编辑器快捷键

- **Ctrl/Cmd + B**：粗体
- **Ctrl/Cmd + I**：斜体
- **Ctrl/Cmd + K**：插入链接
- **Ctrl/Cmd + Shift + K**：插入图片
- **Ctrl/Cmd + Shift + C**：代码块

希望这个指南能帮助你更好地使用 Markdown！`;

const STORAGE_KEY = 'markdown-editor-articles';

type LocaleType = 
  | 'zh-CN'  // 简体中文
  | 'en-US'  // 英语
  | 'es-ES'  // 西班牙语
  | 'fr-FR'  // 法语
  | 'de-DE'  // 德语
  | 'pt-BR'  // 葡萄牙语(巴西)
  | 'ru-RU'  // 俄语
  | 'ar-SA'  // 阿拉伯语
  | 'hi-IN'  // 印地语
  | 'ja-JP'  // 日语
  | 'ko-KR'; // 韩语

interface LocaleConfig {
  locale: any;
  text: string;
  flag: string;
  toolbar: ToolbarConfig;
}

const locales: Record<LocaleType, LocaleConfig> = {
  'zh-CN': {
    locale: zhCN,
    text: '简体中文',
    flag: '🇨🇳',
    toolbar: {
      bold: '加粗',
      italic: '斜体',
      strikethrough: '删除线',  // 添加删除线翻译
      heading: '标题',          // 添加标题翻译
      hr: '水平线',             // 添加水平线翻译
      quote: '引用',
      code: '代码',
      codeBlock: '代码块',      // 添加代码块
      link: '链接',
      image: '图片',
      table: '表格',
      orderedList: '有序列表',
      unorderedList: '无序列表',
      ol: '有序列表',             // 添加有序列表(可能的替代命令名)
      ul: '无序列表',             // 添加无序列表(可能的替代命令名)
      taskList: '任务列表',
      checklist: '任务列表',      // 添加检查列表(可能的替代命令名)
      edit: '编辑模式',
      live: '实时预览',
      preview: '预览模式',
      fullscreen: '全屏模式',
      webView: '网页视图',
      mobileView: '移动视图',
      copy: '复制内容',
      title: '标题',          // 标题工具
      comment: '注释'         // 注释工具
    }
  },
  'en-US': {
    locale: enUS,
    text: 'English',
    flag: '🇺🇸',
    toolbar: {
      bold: 'Bold',
      italic: 'Italic',
      strikethrough: 'Strikethrough',  // 添加删除线翻译
      heading: 'Heading',              // 添加标题翻译
      hr: 'Horizontal Rule',           // 添加水平线翻译
      quote: 'Quote',
      code: 'Code',
      codeBlock: 'Code Block',      // 添加代码块
      link: 'Link',
      image: 'Image',
      table: 'Table',
      orderedList: 'Ordered List',
      unorderedList: 'Unordered List',
      ol: 'Ordered List',             // 添加有序列表(可能的替代命令名)
      ul: 'Unordered List',             // 添加无序列表(可能的替代命令名)
      taskList: 'Task List',
      checklist: 'Checklist',      // 添加检查列表(可能的替代命令名)
      edit: 'Edit Mode',
      live: 'Live Preview',
      preview: 'Preview Mode',
      fullscreen: 'Fullscreen',
      webView: 'Web View',
      mobileView: 'Mobile View',
      copy: 'Copy Content',
      title: 'Title',          // 标题工具
      comment: 'Comment'        // 注释工具
    }
  },
  'es-ES': {
    locale: esES,
    text: 'Español',
    flag: '🇪🇸',
    toolbar: {
      bold: 'Negrita',
      italic: 'Cursiva',
      strikethrough: 'Tachado',
      heading: 'Título',
      hr: 'Línea horizontal',
      quote: 'Cita',
      code: 'Código',
      link: 'Enlace',
      image: 'Imagen',
      table: 'Tabla',
      orderedList: 'Lista ordenada',
      unorderedList: 'Lista no ordenada',
      taskList: 'Lista de tareas',
      edit: 'Modo de edición',
      live: 'Vista previa en vivo',
      preview: 'Modo vista previa',
      fullscreen: 'Pantalla completa',
      webView: 'Vista web',
      mobileView: 'Vista móvil',
      copy: 'Copiar contenido',
      title: 'Título',          // 标题工具
      comment: 'Comentario'      // 注释工具
    }
  },
  'fr-FR': {
    locale: frFR,
    text: 'Français',
    flag: '🇫🇷',
    toolbar: {
      bold: 'Gras',
      italic: 'Italique',
      strikethrough: 'Barré',
      heading: 'Titre',
      hr: 'Ligne horizontale',
      quote: 'Citation',
      code: 'Code',
      link: 'Lien',
      image: 'Image',
      table: 'Tableau',
      orderedList: 'Liste ordonnée',
      unorderedList: 'Liste non ordonnée',
      taskList: 'Liste de tâches',
      edit: 'Mode édition',
      live: 'Aperçu en direct',
      preview: 'Mode aperçu',
      fullscreen: 'Plein écran',
      webView: 'Vue web',
      mobileView: 'Vue mobile',
      copy: 'Copier le contenu',
      title: 'Titre',          // 标题工具
      comment: 'Commentaire'    // 注释工具
    }
  },
  'de-DE': {
    locale: deDE,
    text: 'Deutsch',
    flag: '🇩🇪',
    toolbar: {
      bold: 'Fett',
      italic: 'Kursiv',
      strikethrough: 'Durchgestrichen',
      heading: 'Überschrift',
      hr: 'Horizontale Linie',
      quote: 'Zitat',
      code: 'Code',
      link: 'Link',
      image: 'Bild',
      table: 'Tabelle',
      orderedList: 'Geordnete Liste',
      unorderedList: 'Ungeordnete Liste',
      taskList: 'Aufgabenliste',
      edit: 'Bearbeitungsmodus',
      live: 'Live-Vorschau',
      preview: 'Vorschaumodus',
      fullscreen: 'Vollbild',
      webView: 'Web-Ansicht',
      mobileView: 'Mobile Ansicht',
      copy: 'Inhalt kopieren',
      title: 'Überschrift',          // 标题工具
      comment: 'Kommentar'            // 注释工具
    }
  },
  'pt-BR': {
    locale: ptPT,
    text: 'Português',
    flag: '🇧🇷',
    toolbar: {
      bold: 'Negrito',
      italic: 'Itálico',
      strikethrough: 'Tachado',
      heading: 'Título',
      hr: 'Linha horizontal',
      quote: 'Citação',
      code: 'Código',
      link: 'Link',
      image: 'Imagem',
      table: 'Tabela',
      orderedList: 'Lista ordenada',
      unorderedList: 'Lista Não Ordenada',
      taskList: 'Lista de Tarefas',
      edit: 'Modo Edição',
      live: 'Visualização ao Vivo',
      preview: 'Modo Visualização',
      fullscreen: 'Tela Cheia',
      webView: 'Visualização web',
      mobileView: 'Visualização móvel',
      copy: 'Copiar conteúdo',
      title: 'Título',          // 标题工具
      comment: 'Comentário'      // 注释工具
    }
  },
  'ru-RU': {
    locale: ruRU,
    text: 'Русский',
    flag: '🇷🇺',
    toolbar: {
      bold: 'Жирный',
      italic: 'Курсив',
      strikethrough: 'Зачеркнутый',
      heading: 'Заголовок',
      hr: 'Горизонтальная линия',
      quote: 'Цитата',
      code: 'Код',
      link: 'Ссылка',
      image: 'Изображение',
      table: 'Таблица',
      orderedList: 'Нумерованный список',
      unorderedList: 'Маркированный список',
      taskList: 'Список задач',
      edit: 'Режим редактирования',
      live: 'Предпросмотр',
      preview: 'Режим просмотра',
      fullscreen: 'Полный экран',
      webView: 'Веб-просмотр',
      mobileView: 'Мобильный просмотр',
      copy: 'Копировать содержимое',
      title: 'Заголовок',          // 标题工具
      comment: 'Комментарий'        // 注释工具
    }
  },
  'ar-SA': {
    locale: null, // Need to import Arabic locale
    text: 'العربية',
    flag: '🇸🇦',
    toolbar: {
      bold: 'عريض',
      italic: 'مائل',
      strikethrough: 'مشطوب',
      heading: 'عنوان',
      hr: 'خط أفقي',
      quote: 'اقتباس',
      code: 'كود',
      link: 'رابط',
      image: 'صورة',
      table: 'جدول',
      orderedList: 'قائمة مرقمة',
      unorderedList: 'قائمة نقطية',
      taskList: 'قائمة المهام',
      edit: 'وضع التحرير',
      live: 'معاينة مباشرة',
      preview: 'وضع المعاينة',
      fullscreen: 'ملء الشاشة',
      webView: 'عرض الويب',
      mobileView: 'عرض الجوال',
      copy: 'نسخ المحتوى',
      title: 'عنوان',          // 标题工具
      comment: 'تعليق'          // 注释工具
    }
  },
  'hi-IN': {
    locale: null, // Need to import Hindi locale
    text: 'हिन्दी',
    flag: '🇮🇳',
    toolbar: {
      bold: 'बोल्ड',
      italic: 'इटैलिक',
      strikethrough: 'स्ट्राइकथ्रू',
      heading: 'हेडिंग',
      hr: 'हॉरिज़ॉन्टल रूल',
      quote: 'उद्धरण',
      code: 'कोड',
      codeBlock: 'कोड ब्लॉक',
      link: 'लिंक',
      image: 'इमेज',
      table: 'टेबल',
      orderedList: 'ऑर्डर्ड लिस्ट',
      unorderedList: 'अनऑर्डर्ड लिस्ट',
      ol: 'ऑर्डर्ड लिस्ट',
      ul: 'अनऑर्डर्ड लिस्ट',
      taskList: 'टास्क लिस्ट',
      checklist: 'टास्क लिस्ट',
      edit: 'एडिट मोड',
      live: 'लाइव प्रीव्यू',
      preview: 'प्रीव्यू मोड',
      fullscreen: 'फुलस्क्रीन',
      webView: 'वेब व्यू',
      mobileView: 'मोबाइल व्यू',
      copy: 'कॉपी कंटेंट',
      title: 'शीर्षक',          // 标题工具
      comment: 'टिप्पणी'         // 注释工具
    }
  },
  'ja-JP': {
    locale: jaJP,
    text: '日本語',
    flag: '🇯🇵',
    toolbar: {
      bold: '太字',
      italic: '斜体',
      strikethrough: '取り消し線',
      heading: '見出し',
      hr: '水平線',
      quote: '引用',
      code: 'コード',
      codeBlock: 'コードブロック',
      link: 'リンク',
      image: '画像',
      table: '表',
      orderedList: '番号付きリスト',
      unorderedList: '箇条書きリスト',
      taskList: 'タスクリスト',
      edit: '編集モード',
      live: 'ライブプレビュー',
      preview: 'プレビューモード',
      fullscreen: '全画面表示',
      webView: 'ウェブビュー',
      mobileView: 'モバイルビュー',
      copy: 'コンテンツをコピー',
      title: 'タイトル',          // 标题工具
      comment: 'コメント'          // 注释工具
    }
  },
  'ko-KR': {
    locale: koKR,
    text: '한국어',
    flag: '🇰🇷',
    toolbar: {
      bold: '굵게',
      italic: '기울임꼴',
      strikethrough: '취소선',
      heading: '제목',
      hr: '수평선',
      quote: '인용',
      code: '코드',
      codeBlock: '코드 블록',
      link: '링크',
      image: '이미지',
      table: '테이블',
      orderedList: '순서 있는 목록',
      unorderedList: '순서 없는 목록',
      taskList: '작업 목록',
      edit: '편집 모드',
      live: '실시간 미리보기',
      preview: '미리보기 모드',
      fullscreen: '전체 화면',
      webView: '웹 보기',
      mobileView: '모바일 보기',
      copy: '내용 복사',
      title: '제목',          // 标题工具
      comment: '주석'          // 注释工具
    }
  }
};

interface ToolbarConfig {
  bold: string;
  italic: string;
  strikethrough: string;  // 添加删除线
  heading: string;        // 添加标题
  hr: string;             // 添加水平线
  quote: string;
  code: string;
  codeBlock?: string;      // 添加代码块（可选）
  link: string;
  image: string;
  table: string;
  orderedList: string;
  unorderedList: string;
  ol?: string;             // 添加有序列表(可能的替代命令名)（可选）
  ul?: string;             // 添加无序列表(可能的替代命令名)（可选）
  taskList: string;
  checklist?: string;      // 添加检查列表(可能的替代命令名)（可选）
  title?: string;          // 标题工具（可选）
  comment?: string;        // 注释工具（可选）
  edit: string;
  live: string;
  preview: string;
  fullscreen: string;
  webView: string;
  mobileView: string;
  copy: string;
}

interface Translation {
  welcome: string;
  newArticle: string;
  save: string;
  delete: string;
  settings: string;
  copy: string;
  articleList: string;
  markdownEditor: string;
  renderSettings: string;
  closeSettings: string;
  copyContent: string;
  light: string;
  dark: string;
  fontSize: string;
  small: string;
  medium: string;
  large: string;
  extraLarge: string;
  autoSave: string;
  showLineNumbers: string;
  spellCheck: string;
  renderStyle: string;
  renderColor: string;
  newArticleTitle: string;
  newArticleContent: string;
  readOnlyWarning: string;
  cannotSaveWarning: string;
  cannotDeleteWarning: string;
  minArticleWarning: string;
  emptyTitleWarning: string;
  copySuccess: string;
  copyError: string;
  saveSuccess: string;
  deleteSuccess: string;
  placeholder: string;
  defaultContent: string;
  renderStyleTitle: string;
  renderColorTitle: string;
  fontSizeTitle: string;
  autoSaveTitle: string;
  showLineNumbersTitle: string;
  spellCheckTitle: string;
  renderStyleOptions: {
    wechat: string;
    github: string;
    simple: string;
    academic: string;
    blog: string;
    docs: string;
  };
  fontSizeOptions: {
    extraSmall: string;
    small: string;
    medium: string;
    mediumLarge: string;
    large: string;
    extraLarge: string;
    huge: string;
  };
  autoSaveOptions: {
    oneSecond: string;
    threeSeconds: string;
    fiveSeconds: string;
    tenSeconds: string;
  };
  toolbar: ToolbarConfig;
  bodyFontSize: string;
  headingFontSize: string;
  paragraphSettings: {
    lineHeight: string;
    letterSpacing: string;
    textIndent: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    marginBottom: string;
    marginLeft: string;
    marginRight: string;
  };
  paragraphSettingsTitle: string;  // 改名以避免冲突
  lineHeight: string;
  letterSpacing: string;
  textIndent: string;
  textAlign: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  normal: string;
  
  // SEO页面和静态页面翻译
  seo: {
    title: string;
    subtitle: string;
    description: string;
    startEditing: string;
    features: {
      title: string;
      professionalEditor: {
        title: string;
        description: string;
      };
      wechatFormatting: {
        title: string;
        description: string;
      };
      multipleThemes: {
        title: string;
        description: string;
      };
      mobileView: {
        title: string;
        description: string;
      };
      darkMode: {
        title: string;
        description: string;
      };
    };
    useCases: {
      title: string;
      description: string;
      items: string[];
    };
    cta: {
      title: string;
      button: string;
    };
  };
  
  // 页面导航
  nav: {
    home: string;
    editor: string;
    markdownGuide: string;
    wechatStyle: string;
    about: string;
  };
  
  // 关于页面
  about: {
    title: string;
    content: string;
    team: string;
    contact: string;
  };
}

const translations: Record<LocaleType, Translation> = {
  'zh-CN': {
    welcome: '欢迎使用 Markdown 编辑器',
    newArticle: '新建文章',
    save: '保存',
    delete: '删除',
    settings: '设置',
    copy: '复制',
    articleList: '文章列表',
    markdownEditor: 'Markdown 编辑器',
    renderSettings: '渲染设置',
    closeSettings: '关闭设置',
    copyContent: '复制内容',
    light: '浅色',
    dark: '深色',
    fontSize: '字体大小',
    small: '小',
    medium: '中',
    large: '大',
    extraLarge: '特大',
    autoSave: '自动保存',
    showLineNumbers: '显示行号',
    spellCheck: '拼写检查',
    renderStyle: '渲染样式',
    renderColor: '渲染颜色',
    newArticleTitle: '新文章',
    newArticleContent: '在这里输入内容...',
    readOnlyWarning: '这是只读文档',
    cannotSaveWarning: '无法保存只读文档',
    cannotDeleteWarning: '无法删除只读文档',
    minArticleWarning: '至少需要保留一篇文章',
    emptyTitleWarning: '标题不能为空',
    copySuccess: '复制成功',
    copyError: '复制失败',
    saveSuccess: '保存成功',
    deleteSuccess: '删除成功',
    placeholder: '在这里输入 Markdown 文本...',
    defaultContent: `# 欢迎使用 Markdown 编辑器\n\n这是一个简单但功能强大的 Markdown 编辑器，可以帮助您更好地编写和管理文档。\n\n## 基本功能\n\n1. **文档管理**\n   - 点击左上角的"+"按钮创建新文档\n   - 左侧面板显示所有文档列表\n   - 可以随时切换编辑不同的文档\n\n2. **编辑功能**\n   - 支持所有标准的 Markdown 语法\n   - 实时预览编辑效果\n   - 自动保存编辑内容\n\n3. **其他功能**\n   - 支持多种渲染样式\n   - 可调整字体大小\n   - 支持深色/浅色主题切换\n   - 支持复制文档内容\n\n## 开始使用\n\n现在就可以开始创建您的第一篇文档了！点击左上角的"+"按钮，开始您的创作之旅。`,
    renderStyleTitle: '渲染样式',
    renderColorTitle: '渲染颜色',
    fontSizeTitle: '字体大小',
    autoSaveTitle: '自动保存',
    showLineNumbersTitle: '显示行号',
    spellCheckTitle: '拼写检查',
    renderStyleOptions: {
      wechat: '微信公众号',
      github: 'GitHub',
      simple: '简约',
      academic: '学术',
      blog: '博客',
      docs: '文档'
    },
    fontSizeOptions: {
      extraSmall: '特小',
      small: '小',
      medium: '中',
      mediumLarge: '中大',
      large: '大',
      extraLarge: '特大',
      huge: '超大',
    },
    autoSaveOptions: {
      oneSecond: '1 秒',
      threeSeconds: '3 秒',
      fiveSeconds: '5 秒',
      tenSeconds: '10 秒'
    },
    toolbar: {
      bold: '粗体',
      italic: '斜体',
      strikethrough: '删除线',  // 添加删除线翻译
      heading: '标题',          // 添加标题翻译
      hr: '水平线',             // 添加水平线翻译
      quote: '引用',
      code: '代码',
      codeBlock: '代码块',      // 添加代码块
      link: '链接',
      image: '图片',
      table: '表格',
      orderedList: '有序列表',
      unorderedList: '无序列表',
      ol: '有序列表',             // 添加有序列表(可能的替代命令名)
      ul: '无序列表',             // 添加无序列表(可能的替代命令名)
      taskList: '任务列表',
      checklist: '任务列表',      // 添加检查列表(可能的替代命令名)
      edit: '编辑模式',
      live: '实时预览',
      preview: '预览模式',
      fullscreen: '全屏模式',
      webView: '网页视图',
      mobileView: '移动视图',
      copy: '复制内容',
      title: '标题',          // 标题工具
      comment: '注释'         // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: '段落设置',
    lineHeight: '行间距',
    letterSpacing: '字间距',
    textIndent: '首行缩进',
    textAlign: '对齐方式',
    marginBottom: '段后距',
    marginLeft: '左缩进',
    marginRight: '右缩进',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    alignJustify: '两端对齐',
    normal: '正常',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown 编辑器',
      subtitle: '强大的 Markdown 编辑器',
      description: 'Markdown 编辑器是一款功能强大的编辑工具，可以帮助您更好地编写和管理文档。',
      startEditing: '开始编辑',
      features: {
        title: '功能特点',
        professionalEditor: {
          title: '专业编辑器',
          description: 'Markdown 编辑器提供了专业的编辑功能，可以帮助您更好地编写和管理文档。'
        },
        wechatFormatting: {
          title: '微信公众号格式化',
          description: 'Markdown 编辑器支持微信公众号的格式化，可以帮助您更好地编写和管理文档。'
        },
        multipleThemes: {
          title: '多种主题',
          description: 'Markdown 编辑器支持多种主题，可以根据您的需求选择不同的主题。'
        },
        mobileView: {
          title: '移动视图',
          description: 'Markdown 编辑器支持移动视图，可以在移动设备上更好地阅读和编辑文档。'
        },
        darkMode: {
          title: '暗黑模式',
          description: 'Markdown 编辑器支持暗黑模式，可以在夜间更好地阅读和编辑文档。'
        }
      },
      useCases: {
        title: '使用场景',
        description: 'Markdown 编辑器适用于多种场景，包括撰写博客、编写文档、编写代码等。',
        items: [
          '撰写博客',
          '编写文档',
          '编写代码',
          '编写报告',
          '编写笔记',
          '编写项目文档'
        ]
      },
      cta: {
        title: '立即开始',
        button: '开始使用'
      }
    },
    
    // 页面导航
    nav: {
      home: '首页',
      editor: '编辑器',
      markdownGuide: 'Markdown 语法指南',
      wechatStyle: '微信公众号样式',
      about: '关于'
    },
    
    // 关于页面
    about: {
      title: '关于我们',
      content: '我们是一群热爱技术的人，致力于提供高质量的 Markdown 编辑器。',
      team: '团队成员',
      contact: '联系我们'
    }
  },
  'en-US': {
    welcome: 'Welcome',
    newArticle: 'New Article',
    save: 'Save',
    delete: 'Delete',
    settings: 'Settings',
    copy: 'Copy',
    articleList: 'Article List',
    markdownEditor: 'Markdown Editor',
    renderSettings: 'Render Settings',
    closeSettings: 'Close Settings',
    copyContent: 'Copy Content',
    light: 'Light',
    dark: 'Dark',
    fontSize: 'Font Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    extraLarge: 'Extra Large',
    autoSave: 'Auto Save',
    showLineNumbers: 'Show Line Numbers',
    spellCheck: 'Spell Check',
    renderStyle: 'Render Style',
    renderColor: 'Render Color',
    newArticleTitle: 'New Article',
    newArticleContent: 'Enter content here...',
    readOnlyWarning: 'This is a read-only document',
    cannotSaveWarning: 'Cannot save read-only document',
    cannotDeleteWarning: 'Cannot delete read-only document',
    minArticleWarning: 'Must keep at least one article',
    emptyTitleWarning: 'Title cannot be empty',
    copySuccess: 'Copied successfully',
    copyError: 'Copy failed',
    saveSuccess: 'Saved successfully',
    deleteSuccess: 'Deleted successfully',
    placeholder: 'Enter your Markdown text here...',
    defaultContent: `# Welcome to Markdown Editor\n\nThis is a simple yet powerful Markdown editor to help you write and manage documents better.\n\n## Basic Features\n\n1. **Document Management**\n   - Click the "+" button in the top left to create a new document\n   - Left panel shows all document list\n   - Switch between different documents anytime\n\n2. **Editing Features**\n   - Supports all standard Markdown syntax\n   - Real-time preview of editing effects\n   - Auto-save content\n\n3. **Other Features**\n   - Multiple rendering styles\n   - Adjustable font size\n   - Support light/dark theme\n   - Copy document content\n\n## Get Started\n\nYou can start creating your first document now! Click the "+" button in the top left to begin your writing journey.`,
    renderStyleTitle: 'Render Style',
    renderColorTitle: 'Render Color',
    fontSizeTitle: 'Font Size',
    autoSaveTitle: 'Auto Save',
    showLineNumbersTitle: 'Show Line Numbers',
    spellCheckTitle: 'Spell Check',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'Simple',
      academic: 'Academic',
      blog: 'Blog',
      docs: 'Docs'
    },
    fontSizeOptions: {
      extraSmall: 'Extra Small',
      small: 'Small',
      medium: 'Medium',
      mediumLarge: 'Medium Large',
      large: 'Large',
      extraLarge: 'Extra Large',
      huge: 'Huge',
    },
    autoSaveOptions: {
      oneSecond: '1 second',
      threeSeconds: '3 seconds',
      fiveSeconds: '5 seconds',
      tenSeconds: '10 seconds'
    },
    toolbar: {
      bold: 'Bold',
      italic: 'Italic',
      strikethrough: 'Strikethrough',  // 添加删除线翻译
      heading: 'Heading',              // 添加标题翻译
      hr: 'Horizontal Rule',           // 添加水平线翻译
      quote: 'Quote',
      code: 'Code',
      codeBlock: 'Code Block',      // 添加代码块
      link: 'Link',
      image: 'Image',
      table: 'Table',
      orderedList: 'Ordered List',
      unorderedList: 'Unordered List',
      ol: 'Ordered List',             // 添加有序列表(可能的替代命令名)
      ul: 'Unordered List',             // 添加无序列表(可能的替代命令名)
      taskList: 'Task List',
      checklist: 'Checklist',      // 添加检查列表(可能的替代命令名)
      edit: 'Edit Mode',
      live: 'Live Preview',
      preview: 'Preview Mode',
      fullscreen: 'Fullscreen',
      webView: 'Web View',
      mobileView: 'Mobile View',
      copy: 'Copy Content',
      title: 'Title',          // 标题工具
      comment: 'Comment'        // 注释工具
    },
    bodyFontSize: 'Body Font Size',
    headingFontSize: 'Heading Font Size',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: 'Paragraph Settings',
    lineHeight: 'Line Height',
    letterSpacing: 'Letter Spacing',
    textIndent: 'Text Indent',
    textAlign: 'Text Align',
    marginBottom: 'Margin Bottom',
    marginLeft: 'Margin Left',
    marginRight: 'Margin Right',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    alignJustify: 'Justify',
    normal: 'Normal',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: 'Powerful Markdown Editor',
      description: 'Markdown Editor is a powerful editing tool that helps you write and manage documents better.',
      startEditing: 'Start Editing',
      features: {
        title: 'Features',
        professionalEditor: {
          title: 'Professional Editor',
          description: 'Markdown Editor provides professional editing features to help you write and manage documents better.'
        },
        wechatFormatting: {
          title: 'WeChat Formatting',
          description: 'Markdown Editor supports WeChat formatting to help you write and manage documents better.'
        },
        multipleThemes: {
          title: 'Multiple Themes',
          description: 'Markdown Editor supports multiple themes to choose from based on your needs.'
        },
        mobileView: {
          title: 'Mobile View',
          description: 'Markdown Editor supports mobile view, allowing you to read and edit documents better on mobile devices.'
        },
        darkMode: {
          title: 'Dark Mode',
          description: 'Markdown Editor supports dark mode, allowing you to read and edit documents better at night.'
        }
      },
      useCases: {
        title: 'Use Cases',
        description: 'Markdown Editor is suitable for various scenarios, including writing blogs, writing documents, writing code, etc.',
        items: [
          'Writing Blogs',
          'Writing Documents',
          'Writing Code',
          'Writing Reports',
          'Writing Notes',
          'Writing Project Documents'
        ]
      },
      cta: {
        title: 'Get Started',
        button: 'Get Started'
      }
    },
    
    // 页面导航
    nav: {
      home: 'Home',
      editor: 'Editor',
      markdownGuide: 'Markdown Guide',
      wechatStyle: 'WeChat Style',
      about: 'About'
    },
    
    // 关于页面
    about: {
      title: 'About Us',
      content: 'We are a group of tech enthusiasts who are passionate about providing high-quality Markdown editors.',
      team: 'Our Team',
      contact: 'Contact Us'
    }
  },
  'es-ES': {
    welcome: 'Bienvenido',
    newArticle: 'Nuevo artículo',
    save: 'Guardar',
    delete: 'Eliminar',
    settings: 'Configuración',
    copy: 'Copiar',
    articleList: 'Lista de artículos',
    markdownEditor: 'Editor de Markdown',
    renderSettings: 'Configuración de renderizado',
    closeSettings: 'Cerrar configuración',
    copyContent: 'Contenido copiado',
    light: 'Claro',
    dark: 'Oscuro',
    fontSize: 'Tamaño de fuente',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    extraLarge: 'Muy grande',
    autoSave: 'Auto-guardar',
    showLineNumbers: 'Mostrar números de línea',
    spellCheck: 'Revisar ortografía',
    renderStyle: 'Estilo de renderizado',
    renderColor: 'Color de renderizado',
    newArticleTitle: 'Nuevo artículo',
    newArticleContent: 'Escribe tu contenido aquí...',
    readOnlyWarning: 'Este es un documento de solo lectura',
    cannotSaveWarning: 'No se puede guardar el documento de solo lectura',
    cannotDeleteWarning: 'No se puede eliminar el documento de solo lectura',
    minArticleWarning: 'Debe mantener al menos un artículo',
    emptyTitleWarning: 'El título no puede estar vacío',
    copySuccess: 'Copiado correctamente',
    copyError: 'Error al copiar',
    saveSuccess: 'Guardado correctamente',
    deleteSuccess: 'Eliminado correctamente',
    placeholder: 'Escribe tu texto Markdown aquí...',
    defaultContent: `# Bienvenido a Markdown Editor\n\nEste es un editor de Markdown simple pero potente para ayudarte a escribir y gestionar tus documentos.\n\n## Características básicas\n\n1. **Gestión de documentos**\n   - Haz clic en el botón "+" en la esquina superior izquierda para crear un nuevo documento\n   - El panel izquierdo muestra una lista de todos los documentos\n   - Puedes cambiar entre diferentes documentos en cualquier momento\n\n2. **Funcionalidades de edición**\n   - Soporta todas las sintaxis estándar de Markdown\n   - Vista previa en tiempo real de los efectos de edición\n   - Guardado automático del contenido\n\n3. **Otras características**\n   - Varias opciones de renderizado\n   - Ajusta el tamaño de la fuente\n   - Soporte para temas claros/oscuros\n   - Copiar contenido del documento\n\n## Empezar\n\n¡Ahora puedes empezar a crear tu primer documento! Haz clic en el botón "+" en la esquina superior izquierda para comenzar tu viaje de escritura.`,
    renderStyleTitle: 'Estilo de renderizado',
    renderColorTitle: 'Color de renderizado',
    fontSizeTitle: 'Tamaño de fuente',
    autoSaveTitle: 'Auto-guardar',
    showLineNumbersTitle: 'Mostrar números de línea',
    spellCheckTitle: 'Revisar ortografía',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'Simple',
      academic: 'Académico',
      blog: 'Blog',
      docs: 'Documentos'
    },
    fontSizeOptions: {
      extraSmall: 'Pequeño (12px)',
      small: 'Mediano (14px)',
      medium: 'Grande (16px)',
      mediumLarge: 'Muy grande (18px)',
      large: 'Muy grande (20px)',
      extraLarge: 'Muy grande (22px)',
      huge: 'Muy grande (24px)'
    },
    autoSaveOptions: {
      oneSecond: '1 segundo',
      threeSeconds: '3 segundos',
      fiveSeconds: '5 segundos',
      tenSeconds: '10 segundos'
    },
    toolbar: {
      bold: 'Negrita',
      italic: 'Cursiva',
      strikethrough: 'Tachado',
      heading: 'Título',
      hr: 'Línea horizontal',
      quote: 'Cita',
      code: 'Código',
      codeBlock: 'Bloque de código',      // 添加代码块
      link: 'Enlace',
      image: 'Imagen',
      table: 'Tabla',
      orderedList: 'Lista ordenada',
      unorderedList: 'Lista no ordenada',
      ol: 'Lista ordenada',             // 添加有序列表(可能的替代命令名)
      ul: 'Lista no ordenada',             // 添加无序列表(可能的替代命令名)
      taskList: 'Lista de tareas',
      checklist: 'Lista de tareas',      // 添加检查列表(可能的替代命令名)
      edit: 'Modo de edición',
      live: 'Vista previa en vivo',
      preview: 'Modo vista previa',
      fullscreen: 'Pantalla completa',
      webView: 'Vista web',
      mobileView: 'Vista móvil',
      copy: 'Copiar contenido',
      title: 'Título',          // 标题工具
      comment: 'Comentario'      // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: 'Configuración de párrafos',
    lineHeight: 'Altura de línea',
    letterSpacing: 'Espaciado de letras',
    textIndent: 'Sangría',
    textAlign: 'Alineación',
    marginBottom: 'Espacio después de párrafo',
    marginLeft: 'Sangría izquierda',
    marginRight: 'Sangría derecha',
    alignLeft: 'Izquierda',
    alignCenter: 'Centro',
    alignRight: 'Derecha',
    alignJustify: 'Justificado',
    normal: 'Normal',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: 'Editor de Markdown Potente',
      description: 'Markdown Editor es un editor de Markdown potente que te ayuda a escribir y gestionar documentos mejor.',
      startEditing: 'Comenzar a editar',
      features: {
        title: 'Características',
        professionalEditor: {
          title: 'Editor Profesional',
          description: 'Markdown Editor proporciona funciones de edición profesionales para ayudarte a escribir y gestionar documentos mejor.'
        },
        wechatFormatting: {
          title: 'Formato de WeChat',
          description: 'Markdown Editor soporta el formato de WeChat para ayudarte a escribir y gestionar documentos mejor.'
        },
        multipleThemes: {
          title: 'Varias Temas',
          description: 'Markdown Editor soporta varios temas para que puedas elegir el que mejor se adapte a tus necesidades.'
        },
        mobileView: {
          title: 'Vista Móvil',
          description: 'Markdown Editor soporta vista móvil, lo que te permite leer y editar documentos mejor en dispositivos móviles.'
        },
        darkMode: {
          title: 'Modo Oscuro',
          description: 'Markdown Editor soporta modo oscuro, lo que te permite leer y editar documentos mejor en la noche.'
        }
      },
      useCases: {
        title: 'Casos de uso',
        description: 'Markdown Editor es adecuado para varios escenarios, incluyendo escribir blogs, documentos, código, etc.',
        items: [
          'Escribir Blogs',
          'Escribir Documentos',
          'Escribir Código',
          'Escribir Informes',
          'Escribir Notas',
          'Escribir Documentos de Proyecto'
        ]
      },
      cta: {
        title: 'Comenzar',
        button: 'Comenzar'
      }
    },
    
    // 页面导航
    nav: {
      home: 'Inicio',
      editor: 'Editor',
      markdownGuide: 'Guía de Markdown',
      wechatStyle: 'Estilo de WeChat',
      about: 'Acerca de'
    },
    
    // 关于页面
    about: {
      title: 'Acerca de Nosotros',
      content: 'Somos un grupo de entusiastas de la tecnología que estamos comprometidos en proporcionar editores de Markdown de alta calidad.',
      team: 'Nuestro Equipo',
      contact: 'Contáctanos'
    }
  },
  'fr-FR': {
    welcome: 'Bienvenue',
    newArticle: 'Nouvel article',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    settings: 'Paramètres',
    copy: 'Copier',
    articleList: 'Liste des articles',
    markdownEditor: 'Éditeur Markdown',
    renderSettings: 'Paramètres de rendu',
    closeSettings: 'Fermer les paramètres',
    copyContent: 'Contenu copié',
    light: 'Clair',
    dark: 'Sombre',
    fontSize: 'Taille de police',
    small: 'Petit',
    medium: 'Moyen',
    large: 'Grand',
    extraLarge: 'Très grand',
    autoSave: 'Auto-sauvegarder',
    showLineNumbers: 'Afficher les numéros de ligne',
    spellCheck: 'Vérifier l orthographe',
    renderStyle: 'Style de rendu',
    renderColor: 'Couleur de rendu',
    newArticleTitle: 'Nouvel article',
    newArticleContent: 'Entrez votre contenu ici...',
    readOnlyWarning: 'Ce document est en lecture seule',
    cannotSaveWarning: 'Impossible de sauvegarder ce document en lecture seule',
    cannotDeleteWarning: 'Impossible de supprimer ce document en lecture seule',
    minArticleWarning: 'Vous devez conserver au moins un article',
    emptyTitleWarning: 'Le titre ne peut pas être vide',
    copySuccess: 'Copié avec succès',
    copyError: 'Échec de la copie',
    saveSuccess: 'Sauvegardé avec succès',
    deleteSuccess: 'Supprimé avec succès',
    placeholder: 'Entrez votre texte Markdown ici...',
    defaultContent: `# Bienvenue sur Markdown Editor\n\nCe est un éditeur Markdown simple mais puissant pour vous aider à écrire et à gérer vos documents.\n\n## Fonctionnalités de base\n\n1. **Gestion des documents**\n   - Cliquez sur le bouton "+" en haut à gauche pour créer un nouveau document\n   - Le panneau de gauche affiche la liste de tous les documents\n   - Vous pouvez basculer entre différents documents à tout moment\n\n2. **Fonctionnalités d édition**\n   - Soutient toutes les syntaxes Markdown standard\n   - Aperçu en temps réel des effets de l édition\n   - Sauvegarde automatique du contenu\n\n3. **Autres fonctionnalités**\n   - Plusieurs styles de rendu\n   - Réglage de la taille de la police\n   - Support pour les thèmes clairs/sombres\n   - Copie du contenu du document\n\n## Commencer\n\nVous pouvez commencer à créer votre premier document maintenant! Cliquez sur le bouton "+" en haut à gauche pour commencer votre parcours d écriture.`,
    renderStyleTitle: 'Style de rendu',
    renderColorTitle: 'Couleur de rendu',
    fontSizeTitle: 'Taille de police',
    autoSaveTitle: 'Auto-sauvegarder',
    showLineNumbersTitle: 'Afficher les numéros de ligne',
    spellCheckTitle: 'Vérifier l orthographe',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'Simple',
      academic: 'Académique',
      blog: 'Blog',
      docs: 'Docs'
    },
    fontSizeOptions: {
      extraSmall: 'Petit',
      small: 'Moyen',
      medium: 'Grand',
      mediumLarge: 'Très grand',
      large: 'Très grand',
      extraLarge: 'Très grand',
      huge: 'Très grand'
    },
    autoSaveOptions: {
      oneSecond: '1 seconde',
      threeSeconds: '3 secondes',
      fiveSeconds: '5 secondes',
      tenSeconds: '10 secondes'
    },
    toolbar: {
      bold: 'Gras',
      italic: 'Italique',
      strikethrough: 'Barré',  // 添加删除线翻译
      heading: 'Titre',        // 添加标题翻译
      hr: 'Ligne horizontale',  // 添加水平线翻译
      quote: 'Citation',
      code: 'Code',
      codeBlock: 'Bloc de code',      // 添加代码块
      link: 'Lien',
      image: 'Image',
      table: 'Tableau',
      orderedList: 'Liste ordonnée',
      unorderedList: 'Liste non ordonnée',
      ol: 'Liste ordonnée',             // 添加有序列表(可能的替代命令名)
      ul: 'Liste non ordonnée',             // 添加无序列表(可能的替代命令名)
      taskList: 'Liste de tâches',
      checklist: 'Liste de tâches',      // 添加检查列表(可能的替代命令名)
      edit: 'Mode édition',
      live: 'Aperçu en direct',
      preview: 'Mode aperçu',
      fullscreen: 'Plein écran',
      webView: 'Vue web',
      mobileView: 'Vue mobile',
      copy: 'Copier le contenu',
      title: 'Titre',          // 标题工具
      comment: 'Commentaire'    // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: 'Paramètres de paragraphe',
    lineHeight: 'Hauteur de ligne',
    letterSpacing: 'Espacement des lettres',
    textIndent: 'Retrait',
    textAlign: 'Alignement',
    marginBottom: 'Espace après paragraphe',
    marginLeft: 'Retrait gauche',
    marginRight: 'Retrait droit',
    alignLeft: 'Gauche',
    alignCenter: 'Centre',
    alignRight: 'Droite',
    alignJustify: 'Justifié',
    normal: 'Normal',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: 'Éditeur Markdown Puissant',
      description: 'Markdown Editor est un éditeur puissant qui vous aide à écrire et à gérer des documents plus facilement.',
      startEditing: 'Commencer à éditer',
      features: {
        title: 'Fonctionnalités',
        professionalEditor: {
          title: 'Éditeur Professionnel',
          description: 'Markdown Editor fournit des fonctionnalités d\'édition professionnelles pour vous aider à écrire et à gérer des documents plus facilement.'
        },
        wechatFormatting: {
          title: 'Formatage de WeChat',
          description: 'Markdown Editor supporte le formatage de WeChat pour vous aider à écrire et à gérer des documents plus facilement.'
        },
        multipleThemes: {
          title: 'Thèmes multiples',
          description: 'Markdown Editor supporte plusieurs thèmes pour que vous puissiez choisir celui qui vous convient le mieux.'
        },
        mobileView: {
          title: 'Vue mobile',
          description: 'Markdown Editor supporte vue mobile, ce qui vous permet de lire et d\'éditer des documents plus facilement sur les appareils mobiles.'
        },
        darkMode: {
          title: 'Mode sombre',
          description: 'Markdown Editor supporte mode sombre, ce qui vous permet de lire et d\'éditer des documents plus facilement la nuit.'
        }
      },
      useCases: {
        title: 'Cas d\'utilisation',
        description: 'Markdown Editor est adapté à divers scénarios, y compris l\'écriture de blogs, de documents, de code, etc.',
        items: [
          'Écriture de blogs',
          'Écriture de documents',
          'Écriture de code',
          'Écriture de rapports',
          'Écriture de notes',
          'Écriture de documents de projet'
        ]
      },
      cta: {
        title: 'Commencer',
        button: 'Commencer'
      }
    },
    
    // 页面导航
    nav: {
      home: 'Accueil',
      editor: 'Éditeur',
      markdownGuide: 'Guide de Markdown',
      wechatStyle: 'Style de WeChat',
      about: 'À propos'
    },
    
    // 关于页面
    about: {
      title: 'À Propos de Nous',
      content: 'Nous sommes un groupe d\'entusiastes de la technologie qui sont engagés pour fournir des éditeurs de Markdown de haute qualité.',
      team: 'Notre Équipe',
      contact: 'Contactez-nous'
    }
  },
  'de-DE': {
    welcome: 'Willkommen',
    newArticle: 'Neue Artikel',
    save: 'Speichern',
    delete: 'Löschen',
    settings: 'Einstellungen',
    copy: 'Kopieren',
    articleList: 'Artikel Liste',
    markdownEditor: 'Markdown Editor',
    renderSettings: 'Render Einstellungen',
    closeSettings: 'Einstellungen schließen',
    copyContent: 'Inhalt kopieren',
    light: 'Hell',
    dark: 'Dunkel',
    fontSize: 'Schriftgröße',
    small: 'Klein',
    medium: 'Mittel',
    large: 'Groß',
    extraLarge: 'Sehr groß',
    autoSave: 'Automatisches Speichern',
    showLineNumbers: 'Zeilennummern anzeigen',
    spellCheck: 'Rechtschreibprüfung',
    renderStyle: 'Renderstil',
    renderColor: 'Farbe für das Rendern',
    newArticleTitle: 'Neue Artikel',
    newArticleContent: 'Geben Sie hier Ihren Inhalt ein...',
    readOnlyWarning: 'Dies ist ein nur-lesbares Dokument',
    cannotSaveWarning: 'Nicht möglich, nur-lesbares Dokument zu speichern',
    cannotDeleteWarning: 'Nicht möglich, nur-lesbares Dokument zu löschen',
    minArticleWarning: 'Sie müssen mindestens einen Artikel aufbewahren',
    emptyTitleWarning: 'Der Titel darf nicht leer sein',
    copySuccess: 'Inhalt erfolgreich kopiert',
    copyError: 'Fehler beim Kopieren',
    saveSuccess: 'Inhalt erfolgreich gespeichert',
    deleteSuccess: 'Inhalt erfolgreich gelöscht',
    placeholder: 'Geben Sie hier Ihren Markdown-Text ein...',
    defaultContent: `# Willkommen bei Markdown Editor\n\nDies ist ein einfacher aber mächtiger Markdown-Editor, um Ihnen zu helfen, Dokumente zu schreiben und zu verwalten.\n\n## Grundlegende Funktionen\n\n1. **Dokumentenverwaltung**\n   - Klicken Sie auf das "+" in der oberen linken Ecke, um ein neues Dokument zu erstellen\n   - Das linke Panel zeigt eine Liste aller Dokumente an\n   - Sie können jederzeit zwischen verschiedenen Dokumenten wechseln\n\n2. **Bearbeitungsfunktionen**\n   - Unterstützt alle Standard-Markdown-Syntax\n   - Real-time-Vorschau der Bearbeitungseffekte\n   - Automatisches Speichern des Inhalts\n\n3. **Andere Funktionen**\n   - Mehrere Rendering-Stile\n   - Anpassbare Schriftgröße\n   - Unterstützung für hellen/dunklen Themenmodus\n   - Kopieren Sie den Dokumenteninhalt\n\n## Erste Schritte\n\nSie können jetzt Ihr erstes Dokument erstellen! Klicken Sie auf das "+" in der oberen linken Ecke, um mit Ihrer Schreibfahrt zu beginnen.`,
    renderStyleTitle: 'Renderstil',
    renderColorTitle: 'Farbe für das Rendern',
    fontSizeTitle: 'Schriftgröße',
    autoSaveTitle: 'Automatisches Speichern',
    showLineNumbersTitle: 'Zeilennummern anzeigen',
    spellCheckTitle: 'Rechtschreibprüfung',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'Einfach',
      academic: 'Akademisch',
      blog: 'Blog',
      docs: 'Dokumente'
    },
    fontSizeOptions: {
      extraSmall: 'Klein (12px)',
      small: 'Mittel (14px)',
      medium: 'Groß (16px)',
      mediumLarge: 'Sehr groß (18px)',
      large: 'Sehr groß (20px)',
      extraLarge: 'Sehr groß (22px)',
      huge: 'Sehr groß (24px)'
    },
    autoSaveOptions: {
      oneSecond: '1 Sekunde',
      threeSeconds: '3 Sekunden',
      fiveSeconds: '5 Sekunden',
      tenSeconds: '10 Sekunden'
    },
    toolbar: {
      bold: 'Fett',
      italic: 'Kursiv',
      strikethrough: 'Durchgestrichen',  // 添加删除线翻译
      heading: 'Überschrift',        // 添加标题翻译
      hr: 'Horizontale Linie',      // 添加水平线翻译
      quote: 'Zitat',
      code: 'Code',
      codeBlock: 'Codeblock',      // 添加代码块
      link: 'Link',
      image: 'Bild',
      table: 'Tabelle',
      orderedList: 'Geordnete Liste',
      unorderedList: 'Ungeordnete Liste',
      ol: 'Geordnete Liste',             // 添加有序列表(可能的替代命令名)
      ul: 'Ungeordnete Liste',             // 添加无序列表(可能的替代命令名)
      taskList: 'Aufgabenliste',
      checklist: 'Aufgabenliste',      // 添加检查列表(可能的替代命令名)
      edit: 'Bearbeitungsmodus',
      live: 'Live-Vorschau',
      preview: 'Vorschaumodus',
      fullscreen: 'Vollbild',
      webView: 'Web-Ansicht',
      mobileView: 'Mobile Ansicht',
      copy: 'Inhalt kopieren',
      title: 'Überschrift',          // 标题工具
      comment: 'Kommentar'            // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: 'Absatzeinstellungen',
    lineHeight: 'Zeilenabstand',
    letterSpacing: 'Zeichenabstand',
    textIndent: 'Einzug',
    textAlign: 'Ausrichtung',
    marginBottom: 'Abstand nach Absatz',
    marginLeft: 'Einzug links',
    marginRight: 'Einzug rechts',
    alignLeft: 'Links',
    alignCenter: 'Mitte',
    alignRight: 'Rechts',
    alignJustify: 'Blocksatz',
    normal: 'Normal',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: 'Mächtiger Markdown-Editor',
      description: 'Markdown Editor ist ein mächtiger Editor, der Ihnen hilft, Dokumente zu schreiben und zu verwalten.',
      startEditing: 'Beginnen Sie mit dem Bearbeiten',
      features: {
        title: 'Funktionen',
        professionalEditor: {
          title: 'Professioneller Editor',
          description: 'Markdown Editor bietet professionelle Bearbeitungsfunktionen, um Ihnen zu helfen, Dokumente zu schreiben und zu verwalten.'
        },
        wechatFormatting: {
          title: 'WeChat-Formatierung',
          description: 'Markdown Editor unterstützt WeChat-Formatierung, um Ihnen zu helfen, Dokumente zu schreiben und zu verwalten.'
        },
        multipleThemes: {
          title: 'Mehrere Themen',
          description: 'Markdown Editor unterstützt mehrere Themen, damit Sie das Thema auswählen können, das am besten zu Ihren Bedürfnissen passt.'
        },
        mobileView: {
          title: 'Mobile Ansicht',
          description: 'Markdown Editor unterstützt Mobile Ansicht, damit Sie Dokumente besser auf mobilen Geräten lesen und bearbeiten können.'
        },
        darkMode: {
          title: 'Dunkles Thema',
          description: 'Markdown Editor unterstützt dunkles Thema, damit Sie Dokumente besser lesen und bearbeiten können, wenn es dunkel ist.'
        }
      },
      useCases: {
        title: 'Anwendungsfälle',
        description: 'Markdown Editor ist für verschiedene Szenarien geeignet, einschließlich dem Schreiben von Blogs, Dokumenten, Code, etc.',
        items: [
          'Blog schreiben',
          'Dokumente schreiben',
          'Code schreiben',
          'Berichte schreiben',
          'Notizen schreiben',
          'Projektdokumente schreiben'
        ]
      },
      cta: {
        title: 'Los geht\'s',
        button: 'Los geht\'s'
      }
    },
    
    // 页面导航
    nav: {
      home: 'Home',
      editor: 'Editor',
      markdownGuide: 'Markdown Guide',
      wechatStyle: 'WeChat Style',
      about: 'About'
    },
    
    // 关于页面
    about: {
      title: 'Über uns',
      content: 'Wir sind eine Gruppe von Technikbegeisterten, die es uns zur Aufgabe gemacht haben, hochwertige Markdown-Editoren zu entwickeln.',
      team: 'Unser Team',
      contact: 'Kontakt'
    }
  },
  'pt-BR': {
    welcome: 'Bem-vindo',
    newArticle: 'Novo artigo',
    save: 'Salvar',
    delete: 'Excluir',
    settings: 'Configurações',
    copy: 'Copiar',
    articleList: 'Lista de artigos',
    markdownEditor: 'Editor de Markdown',
    renderSettings: 'Configurações de renderização',
    closeSettings: 'Fechar configurações',
    copyContent: 'Conteúdo copiado',
    light: 'Claro',
    dark: 'Escuro',
    fontSize: 'Tamanho da fonte',
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
    extraLarge: 'Muito grande',
    autoSave: 'Auto-salvar',
    showLineNumbers: 'Mostrar números de linha',
    spellCheck: 'Verificar ortografia',
    renderStyle: 'Estilo de renderização',
    renderColor: 'Cor de renderização',
    newArticleTitle: 'Novo artigo',
    newArticleContent: 'Digite seu conteúdo aqui...',
    readOnlyWarning: 'Este é um documento de leitura',
    cannotSaveWarning: 'Não é possível salvar o documento de leitura',
    cannotDeleteWarning: 'Não é possível excluir o documento de leitura',
    minArticleWarning: 'Você deve manter pelo menos um artigo',
    emptyTitleWarning: 'O título não pode estar vazio',
    copySuccess: 'Conteúdo copiado com sucesso',
    copyError: 'Erro ao copiar',
    saveSuccess: 'Conteúdo salvo com sucesso',
    deleteSuccess: 'Conteúdo excluído com sucesso',
    placeholder: 'Digite seu texto Markdown aquí...',
    defaultContent: `# Bem-vindo ao Markdown Editor\n\nEste é um editor de Markdown simples mas poderoso para ajudá-lo a escrever e gerenciar documentos.\n\n## Funcionalidades básicas\n\n1. **Gerenciamento de documentos**\n   - Clique no botão "+" na esquina superior esquerda para criar um novo documento\n   - O painel esquerdo exibe uma lista de todos os documentos\n   - Você pode alternar entre diferentes documentos a qualquer momento\n\n2. **Funcionalidades de edição**\n   - Suporta todas as sintaxes Markdown padrão\n   - Visualização em tempo real dos efeitos da edição\n   - Salvamento automático do conteúdo\n\n3. **Outras funcionalidades**\n   - Vários estilos de renderização\n   - Ajuste o tamanho da fonte\n   - Suporte para temas claro/escuro\n   - Copiar conteúdo do documento\n\n## Começar\n\nAgora você pode começar a criar seu primeiro documento! Clique no botão "+" na esquina superior esquerda para começar sua jornada de escrita.`,
    renderStyleTitle: 'Estilo de renderização',
    renderColorTitle: 'Cor de renderização',
    fontSizeTitle: 'Tamanho da fonte',
    autoSaveTitle: 'Auto-salvar',
    showLineNumbersTitle: 'Mostrar números de linha',
    spellCheckTitle: 'Verificar ortografia',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'Simples',
      academic: 'Acadêmico',
      blog: 'Blog',
      docs: 'Documentos'
    },
    fontSizeOptions: {
      extraSmall: 'Pequeno (12px)',
      small: 'Médio (14px)',
      medium: 'Grande (16px)',
      mediumLarge: 'Muito grande (18px)',
      large: 'Muito grande (20px)',
      extraLarge: 'Muito grande (22px)',
      huge: 'Muito grande (24px)'
    },
    autoSaveOptions: {
      oneSecond: '1 segundo',
      threeSeconds: '3 segundos',
      fiveSeconds: '5 segundos',
      tenSeconds: '10 segundos'
    },
    toolbar: {
      bold: 'Negrito',
      italic: 'Itálico',
      strikethrough: 'Riscado',  // 添加删除线翻译
      heading: 'Título',        // 添加标题翻译
      hr: 'Linha horizontal',  // 添加水平线翻译
      quote: 'Citação',
      code: 'Código',
      codeBlock: 'Bloco de código',      // 添加代码块
      link: 'Link',
      image: 'Imagem',
      table: 'Tabela',
      orderedList: 'Lista ordenada',
      unorderedList: 'Lista não ordenada',
      ol: 'Lista ordenada',             // 添加有序列表(可能的替代命令名)
      ul: 'Lista não ordenada',             // 添加无序列表(可能的替代命令名)
      taskList: 'Lista de tarefas',
      checklist: 'Lista de tarefas',      // 添加检查列表(可能的替代命令名)
      edit: 'Modo de edição',
      live: 'Visualização ao vivo',
      preview: 'Modo visualização',
      fullscreen: 'Tela cheia',
      webView: 'Visualização web',
      mobileView: 'Visualização móvel',
      copy: 'Copiar conteúdo',
      title: 'Título',          // 标题工具
      comment: 'Comentário'      // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: 'Configurações de parágrafo',
    lineHeight: 'Espaço entre linhas',
    letterSpacing: 'Espaçamento de letras',
    textIndent: 'Recuo',
    textAlign: 'Alinhamento',
    marginBottom: 'Espaço após parágrafo',
    marginLeft: 'Recuo esquerdo',
    marginRight: 'Recuo direito',
    alignLeft: 'Esquerda',
    alignCenter: 'Centro',
    alignRight: 'Direita',
    alignJustify: 'Justificado',
    normal: 'Normal',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: 'Editor de Markdown Potente',
      description: 'Markdown Editor é um editor potente que ajuda você a escrever e gerenciar documentos melhor.',
      startEditing: 'Comece a editar',
      features: {
        title: 'Funcionalidades',
        professionalEditor: {
          title: 'Editor Profissional',
          description: 'Markdown Editor fornece funcionalidades de edição profissional para ajudá-lo a escrever e gerenciar documentos melhor.'
        },
        wechatFormatting: {
          title: 'Formatação de WeChat',
          description: 'Markdown Editor suporta formatação de WeChat para ajudá-lo a escrever e gerenciar documentos melhor.'
        },
        multipleThemes: {
          title: 'Vários Temas',
          description: 'Markdown Editor suporta vários temas para que você possa escolher o tema que melhor se adapta às suas necessidades.'
        },
        mobileView: {
          title: 'Visualização Mobile',
          description: 'Markdown Editor suporta Visualização Mobile, o que permite que você leia e edite documentos melhor em dispositivos móveis.'
        },
        darkMode: {
          title: 'Modo Escuro',
          description: 'Markdown Editor suporta Modo Escuro, o que permite que você leia e edite documentos melhor à noite.'
        }
      },
      useCases: {
        title: 'Casos de uso',
        description: 'Markdown Editor é adequado para vários cenários, incluindo escrever blogs, documentos, código, etc.',
        items: [
          'Escrever Blogs',
          'Escrever Documentos',
          'Escrever Código',
          'Escrever Relatórios',
          'Escrever Notas',
          'Escrever Documentos de Projeto'
        ]
      },
      cta: {
        title: 'Começar',
        button: 'Começar'
      }
    },
    
    // 页面导航
    nav: {
      home: 'Início',
      editor: 'Editor',
      markdownGuide: 'Guia de Markdown',
      wechatStyle: 'Estilo de WeChat',
      about: 'Sobre'
    },
    
    // 关于页面
    about: {
      title: 'Sobre Nós',
      content: 'Somos um grupo de entusiastas da tecnologia que estão comprometidos em fornecer editores de Markdown de alta qualidade.',
      team: 'Nossa Equipe',
      contact: 'Contate-nos'
    }
  },
  'ru-RU': {
    welcome: 'Добро пожаловать',
    newArticle: 'Новая статья',
    save: 'Сохранить',
    delete: 'Удалить',
    settings: 'Настройки',
    copy: 'Копировать',
    articleList: 'Список статей',
    markdownEditor: 'Редактор Markdown',
    renderSettings: 'Настройки рендеринга',
    closeSettings: 'Закрыть настройки',
    copyContent: 'Копировать содержимое',
    light: 'Светлый',
    dark: 'Темный',
    fontSize: 'Размер шрифта',
    small: 'Маленький',
    medium: 'Средний',
    large: 'Большой',
    extraLarge: 'Очень большой',
    autoSave: 'Автосохранение',
    showLineNumbers: 'Показывать номера строк',
    spellCheck: 'Проверка орфографии',
    renderStyle: 'Стиль рендеринга',
    renderColor: 'Цвет рендеринга',
    newArticleTitle: 'Новая статья',
    newArticleContent: 'Введите ваш текст здесь...',
    readOnlyWarning: 'Этот документ доступен только для чтения',
    cannotSaveWarning: 'Невозможно сохранить документ только для чтения',
    cannotDeleteWarning: 'Невозможно удалить документ только для чтения',
    minArticleWarning: 'Вы должны сохранить хотя бы одну статью',
    emptyTitleWarning: 'Заголовок не может быть пустым',
    copySuccess: 'Содержимое успешно скопировано',
    copyError: 'Ошибка при копировании',
    saveSuccess: 'Содержимое успешно сохранено',
    deleteSuccess: 'Содержимое успешно удалено',
    placeholder: 'Введите ваш текст Markdown здесь...',
    defaultContent: `# Добро пожаловать в Markdown Editor\n\nЭто простой но мощный редактор Markdown, чтобы помочь вам писать и управлять документами.\n\n## Основные функции\n\n1. **Управление документами**\n   - Нажмите на кнопку "+" в верхнем левом углу, чтобы создать новый документ\n   - Левое меню показывает список всех документов\n   - Вы можете переключаться между различными документами в любое время\n\n2. **Функции редактирования**\n   - Поддерживает все стандартные синтаксисы Markdown\n   - Реальное время предварительного просмотра эффектов редактирования\n   - Автоматическое сохранение содержимого\n\n3. **Другие функции**\n   - Несколько стилей рендеринга\n   - Настройка размера шрифта\n   - Поддержка светлой/темной темы\n   - Копирование содержимого документа\n\n## Начало работы\n\nТеперь вы можете начать создавать свой первый документ! Нажмите на кнопку "+" в верхнем левом углу, чтобы начать ваше путешествие по письму.`,
    renderStyleTitle: 'Стиль рендеринга',
    renderColorTitle: 'Цвет рендеринга',
    fontSizeTitle: 'Размер шрифта',
    autoSaveTitle: 'Автосохранение',
    showLineNumbersTitle: 'Показывать номера строк',
    spellCheckTitle: 'Проверка орфографии',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'Простой',
      academic: 'Учебный',
      blog: 'Блог',
      docs: 'Документы'
    },
    fontSizeOptions: {
      extraSmall: 'Маленький (12px)',
      small: 'Средний (14px)',
      medium: 'Большой (16px)',
      mediumLarge: 'Очень большой (18px)',
      large: 'Очень большой (20px)',
      extraLarge: 'Очень большой (22px)',
      huge: 'Очень большой (24px)'
    },
    autoSaveOptions: {
      oneSecond: '1 секунда',
      threeSeconds: '3 секунды',
      fiveSeconds: '5 секунд',
      tenSeconds: '10 секунд'
    },
    toolbar: {
      bold: 'Полужирный',
      italic: 'Курсив',
      strikethrough: 'Зачеркнутый',  // 添加删除线翻译
      heading: 'Заголовок',        // 添加标题翻译
      hr: 'Горизонтальная линия',  // 添加水平线翻译
      quote: 'Цитата',
      code: 'Код',
      codeBlock: 'Блок кода',      // 添加代码块
      link: 'Ссылка',
      image: 'Изображение',
      table: 'Таблица',
      orderedList: 'Нумерованный список',
      unorderedList: 'Маркированный список',
      ol: 'Нумерованный список',             // 添加有序列表(可能的替代命令名)
      ul: 'Маркированный список',             // 添加无序列表(可能的替代命令名)
      taskList: 'Список задач',
      checklist: 'Список задач',      // 添加检查列表(可能的替代命令名)
      edit: 'Режим редактирования',
      live: 'Предпросмотр',
      preview: 'Режим просмотра',
      fullscreen: 'Полный экран',
      webView: 'Веб-просмотр',
      mobileView: 'Мобильный просмотр',
      copy: 'Копировать содержимое',
      title: 'Заголовок',          // 标题工具
      comment: 'Комментарий'        // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: 'Настройки абзаца',
    lineHeight: 'Межстрочный интервал',
    letterSpacing: 'Интервал между символами',
    textIndent: 'Отступ',
    textAlign: 'Выравнивание',
    marginBottom: 'Отступ после абзаца',
    marginLeft: 'Отступ слева',
    marginRight: 'Отступ справа',
    alignLeft: 'Левое',
    alignCenter: 'По центру',
    alignRight: 'Правое',
    alignJustify: 'По ширине',
    normal: 'Обычный',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: 'Мощный редактор Markdown',
      description: 'Markdown Editor — это мощный редактор, который поможет вам писать и управлять документами.',
      startEditing: 'Начните редактировать',
      features: {
        title: 'Функции',
        professionalEditor: {
          title: 'Профессиональный редактор',
          description: 'Markdown Editor предоставляет профессиональные функции для написания и управления документами.'
        },
        wechatFormatting: {
          title: 'Форматирование WeChat',
          description: 'Markdown Editor поддерживает форматирование WeChat для написания и управления документами.'
        },
        multipleThemes: {
          title: 'Несколько тем',
          description: 'Markdown Editor поддерживает несколько тем, чтобы вы могли выбрать тему, которая лучше всего подходит для ваших нужд.'
        },
        mobileView: {
          title: 'Мобильный режим',
          description: 'Markdown Editor поддерживает мобильный режим, что позволяет вам лучше читать и редактировать документы на мобильных устройствах.'
        },
        darkMode: {
          title: 'Темный режим',
          description: 'Markdown Editor поддерживает темный режим, что позволяет вам лучше читать и редактировать документы ночью.'
        }
      },
      useCases: {
        title: 'Сценарии использования',
        description: 'Markdown Editor подходит для различных сценариев, включая написание блогов, документов, кода и т.д.',
        items: [
          'Написание блогов',
          'Написание документов',
          'Написание кода',
          'Написание отчетов',
          'Написание заметок',
          'Написание проектной документации'
        ]
      },
      cta: {
        title: 'Начать',
        button: 'Начать'
      }
    },
    
    // 页面导航
    nav: {
      home: 'Главная',
      editor: 'Редактор',
      markdownGuide: 'Руководство по Markdown',
      wechatStyle: 'Стиль WeChat',
      about: 'О нас'
    },
    
    // 关于页面
    about: {
      title: 'О нас',
      content: 'Мы — команда энтузиастов, которая занята разработкой высококачественных редакторов Markdown.',
      team: 'Наша команда',
      contact: 'Свяжитесь с нами'
    }
  },
  'ar-SA': {
    welcome: 'مرحبا بك',
    newArticle: 'مقال جديد',
    save: 'حفظ',
    delete: 'حذف',
    settings: 'الإعدادات',
    copy: 'نسخ',
    articleList: 'قائمة المقالات',
    markdownEditor: 'محرر Markdown',
    renderSettings: 'إعدادات التقديم',
    closeSettings: 'إغلاق الإعدادات',
    copyContent: 'نسخ المحتوى',
    light: 'فاتح',
    dark: 'داكن',
    fontSize: 'حجم الخط',
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',
    extraLarge: 'عملاق',
    autoSave: 'تلقائي',
    showLineNumbers: 'إظهار أرقام الأسطر',
    spellCheck: 'التحقق من الإملاء',
    renderStyle: 'نمط التقديم',
    renderColor: 'لون التقديم',
    newArticleTitle: 'مقال جديد',
    newArticleContent: 'أدخل محتوى هنا...',
    readOnlyWarning: 'هذا مستند فقط للقراءة',
    cannotSaveWarning: 'لا يمكن حفظ مستند فقط للقراءة',
    cannotDeleteWarning: 'لا يمكن حذف مستند فقط للقراءة',
    minArticleWarning: 'يجب أن تحتفظ بما يقل عن مقال واحد',
    emptyTitleWarning: 'لا يمكن أن يكون العنوان فارغًا',
    copySuccess: 'تم نسخ المحتوى بنجاح',
    copyError: 'فشل النسخ',
    saveSuccess: 'تم حفظ المحتوى بنجاح',
    deleteSuccess: 'تم حذف المحتوى بنجاح',
    placeholder: 'أدخل نص Markdown هنا...',
    defaultContent: `# مرحبا بك في محرر Markdown\n\nهذا محرر Markdown بسيط لكنه قوي لمساعدتك على كتابة وإدارة المستندات.\n\n## الميزات الأساسية\n\n1. **إدارة المستندات**\n   - اضغط على زر "+" في الزاوية العلوية اليسرى لإنشاء مستند جديد\n   - جزء الشريط الأيسر يظهر قائمة كل المستندات\n   - يمكنك التبديل بين المستندات المختلفة عند أي وقت\n\n2. **ميزات التحرير**\n   - تدعم جميع البنيات العلمية لـ Markdown\n   - عرض معاينة التحرير بالوقت الحقيقي\n   - حفظ المحتوى تلقائيًا\n\n3. **ميزات أخرى**\n   - عدة أنماط التقديم\n   - تعديل حجم الخط\n   - دعم الوضعين الفاتح/الداكن\n   - نسخ المحتوى من المستند\n\n## إبدأ\n\nيمكنك الآن إنشاء مستندك الأول! اضغط على زر "+" في الزاوية العلوية اليسرى لبدء رحلتك الكتابية.`,
    renderStyleTitle: 'نمط التقديم',
    renderColorTitle: 'لون التقديم',
    fontSizeTitle: 'حجم الخط',
    autoSaveTitle: 'تلقائي',
    showLineNumbersTitle: 'إظهار أرقام الأسطر',
    spellCheckTitle: 'التحقق من الإملاء',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'بسيط',
      academic: 'دراسي',
      blog: 'مدونة',
      docs: 'المستندات'
    },
    fontSizeOptions: {
      extraSmall: 'صغير (12px)',
      small: 'متوسط (14px)',
      medium: 'كبير (16px)',
      mediumLarge: 'عملاق (18px)',
      large: 'عملاق (20px)',
      extraLarge: 'عملاق (22px)',
      huge: 'عملاق (24px)'
    },
    autoSaveOptions: {
      oneSecond: '1 ثانية',
      threeSeconds: '3 ثوان',
      fiveSeconds: '5 ثوان',
      tenSeconds: '10 ثوان'
    },
    toolbar: {
      bold: 'بدر',
      italic: 'مائل',
      strikethrough: 'مشطوب',  // 添加删除线翻译
      heading: 'عنوان',        // 添加标题翻译
      hr: 'خط أفقي',          // 添加水平线翻译
      quote: 'اقتباس',
      code: 'كود',
      codeBlock: 'كود',      // 添加代码块
      link: 'رابط',
      image: 'صورة',
      table: 'جدول',
      orderedList: 'قائمة مرقمة',
      unorderedList: 'قائمة نقطية',
      ol: 'قائمة مرقمة',             // 添加有序列表(可能的替代命令名)
      ul: 'قائمة نقطية',             // 添加无序列表(可能的替代命令名)
      taskList: 'قائمة المهام',
      checklist: 'قائمة المهام',      // 添加检查列表(可能的替代命令名)
      edit: 'وضع التحرير',
      live: 'معاينة مباشرة',
      preview: 'وضع المعاينة',
      fullscreen: 'ملء الشاشة',
      webView: 'عرض الويب',
      mobileView: 'عرض الجوال',
      copy: 'نسخ المحتوى',
      title: 'عنوان',          // 标题工具
      comment: 'تعليق'          // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: 'إعدادات الفقرة',
    lineHeight: 'مسافة السطر',
    letterSpacing: 'مسافة الأحرف',
    textIndent: 'مسافة الإدخال',
    textAlign: 'محاذاة',
    marginBottom: 'مسافة بعد الفقرة',
    marginLeft: 'مسافة إدخال يسار',
    marginRight: 'مسافة إدخال يمين',
    alignLeft: 'محاذاة يسار',
    alignCenter: 'محاذاة مركز',
    alignRight: 'محاذاة يمين',
    alignJustify: 'محاذاة متساوية',
    normal: 'عادي',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: 'محرر Markdown متميز',
      description: 'محرر Markdown هو محرر متميز يساعدك على كتابة وإدارة المستندات بشكل أفضل.',
      startEditing: 'ابدأ التحرير',
      features: {
        title: 'الميزات',
        professionalEditor: {
          title: 'محرر متميز',
          description: 'محرر Markdown يوفر ميزات تحرير متميزة لمساعدتك على كتابة وإدارة المستندات بشكل أفضل.'
        },
        wechatFormatting: {
          title: 'تنسيق WeChat',
          description: 'محرر Markdown يدعم تنسيق WeChat لمساعدتك على كتابة وإدارة المستندات بشكل أفضل.'
        },
        multipleThemes: {
          title: 'العديد من الأنماط',
          description: 'محرر Markdown يدعم العديد من الأنماط لكي تتمكن من اختيار النمط الذي يناسبك بشكل أفضل.'
        },
        mobileView: {
          title: 'العرض المتحرك',
          description: 'محرر Markdown يدعم العرض المتحرك، مما يسمح لك بقراءة وتحرير المستندات بشكل أفضل على الأجهزة المحمولة.'
        },
        darkMode: {
          title: 'الوضع الداكن',
          description: 'محرر Markdown يدعم الوضع الداكن، مما يسمح لك بقراءة وتحرير المستندات بشكل أفضل في الليل.'
        }
      },
      useCases: {
        title: 'سيناريوهات الاستخدام',
        description: 'محرر Markdown مناسب لعدد من السيناريوهات، بما في ذلك كتابة المدونات وكتابة المستندات وكتابة الكود وما إلى ذلك.',
        items: [
          'كتابة المدونات',
          'كتابة المستندات',
          'كتابة الكود',
          'كتابة التقارير',
          'كتابة الملاحظات',
          'كتابة مستندات المشروع'
        ]
      },
      cta: {
        title: 'إبدأ',
        button: 'إبدأ'
      }
    },
    
    // 页面导航
    nav: {
      home: 'الرئيسية',
      editor: 'المحرر',
      markdownGuide: 'دليل Markdown',
      wechatStyle: 'أنماط WeChat',
      about: 'عن'
    },
    
    // 关于页面
    about: {
      title: 'عنا',
      content: 'نحن مجموعة من محبي التكنولوجيا التي تهتم بتطوير محرر Markdown لمساعدتنا على تحسين تجربة كتابة وإدارة المستندات.',
      team: 'فريقنا',
      contact: 'اتصل بنا'
    }
  },
  'hi-IN': {
    welcome: 'आपका स्वागत है',
    newArticle: 'नया लेख',
    save: 'सहेजें',
    delete: 'हटाएं',
    settings: 'सेटिंग्स',
    copy: 'कॉपी करें',
    articleList: 'लेख सूची',
    markdownEditor: 'मार्कडाउन एडिटर',
    renderSettings: 'रेंडर सेटिंग्स',
    closeSettings: 'सेटिंग्स बंद करें',
    copyContent: 'सामग्री कॉपी करें',
    light: 'छाँव',
    dark: 'गहरा',
    fontSize: 'फ़ॉन्ट साइज़',
    small: 'छोटा',
    medium: 'मध्यम',
    large: 'बड़ा',
    extraLarge: 'बहुत बड़ा',
    autoSave: 'स्वचालित सहेजना',
    showLineNumbers: 'लाइन नंबर दिखाएं',
    spellCheck: 'वर्तमान व्याकरण जाँच',
    renderStyle: 'रेंडरिंग स्टाइल',
    renderColor: 'रेंडरिंग कलर',
    newArticleTitle: 'नया लेख',
    newArticleContent: 'यहाँ सामग्री दर्ज करें...',
    readOnlyWarning: 'यह केवल पढ़ने के लिए दस्तावेज़ है',
    cannotSaveWarning: 'केवल पढ़ने के लिए दस्तावेज़ सहेजने में सफल नहीं हो सकता',
    cannotDeleteWarning: 'केवल पढ़ने के लिए दस्तावेज़ हटाने में सफल नहीं हो सकता',
    minArticleWarning: 'आपको कम से कम एक लेख सहेजना होगा',
    emptyTitleWarning: 'शीर्षक खाली नहीं हो सकता',
    copySuccess: 'सामग्री सफलतापूर्वक कॉपी कर ली गई',
    copyError: 'कॉपी में विफलता',
    saveSuccess: 'सामग्री सफलतापूर्वक सहेज गई',
    deleteSuccess: 'सामग्री सफलतापूर्वक हटाई गई',
    placeholder: 'यहाँ आपका Markdown टेक्स्ट दर्ज करें...',
    defaultContent: `# 欢迎使用 Markdown 编辑器\n\n这是一个简单但功能强大的 Markdown 编辑器，可以帮助您更好地编写和管理文档。\n\n## 基本功能\n\n1. **文档管理**\n   - 点击左上角的"+"按钮创建新文档\n   - 左侧面板显示所有文档列表\n   - 可以随时切换编辑不同的文档\n\n2. **编辑功能**\n   - 支持所有标准的 Markdown 语法\n   - 实时预览编辑效果\n   - 自动保存编辑内容\n\n3. **其他功能**\n   - 支持多种渲染样式\n   - 可调整字体大小\n   - 支持深色/浅色主题切换\n   - 支持复制文档内容\n\n## 开始使用\n\n现在就可以开始创建您的第一篇文档了！点击左上角的"+"按钮，开始您的创作之旅。`,
    renderStyleTitle: '渲染样式',
    renderColorTitle: '渲染颜色',
    fontSizeTitle: '字体大小',
    autoSaveTitle: '自动保存',
    showLineNumbersTitle: '显示行号',
    spellCheckTitle: '拼写检查',
    renderStyleOptions: {
      wechat: '微信公众号',
      github: 'GitHub',
      simple: '简约',
      academic: '学术',
      blog: '博客',
      docs: '文档'
    },
    fontSizeOptions: {
      extraSmall: '特小',
      small: '小',
      medium: '中',
      mediumLarge: '中大',
      large: '大',
      extraLarge: '特大',
      huge: '超大',
    },
    autoSaveOptions: {
      oneSecond: '1 秒',
      threeSeconds: '3 秒',
      fiveSeconds: '5 秒',
      tenSeconds: '10 秒'
    },
    toolbar: {
      bold: '粗体',
      italic: '斜体',
      strikethrough: '删除线',  // 添加删除线翻译
      heading: '标题',          // 添加标题翻译
      hr: '水平线',             // 添加水平线翻译
      quote: '引用',
      code: '代码',
      codeBlock: '代码块',      // 添加代码块
      link: '链接',
      image: '图片',
      table: '表格',
      orderedList: '有序列表',
      unorderedList: '无序列表',
      ol: '有序列表',             // 添加有序列表(可能的替代命令名)
      ul: '无序列表',             // 添加无序列表(可能的替代命令名)
      taskList: '任务列表',
      checklist: '任务列表',      // 添加检查列表(可能的替代命令名)
      edit: '编辑模式',
      live: '实时预览',
      preview: '预览模式',
      fullscreen: '全屏模式',
      webView: '网页视图',
      mobileView: '移动视图',
      copy: '复制内容',
      title: '标题',          // 标题工具
      comment: '注释'         // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: '段落设置',
    lineHeight: '行间距',
    letterSpacing: '字间距',
    textIndent: '首行缩进',
    textAlign: '对齐方式',
    marginBottom: '段后距',
    marginLeft: '左缩进',
    marginRight: '右缩进',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    alignJustify: '两端对齐',
    normal: '正常',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: '功能强大的 Markdown 编辑器',
      description: 'Markdown Editor 是一款功能强大的编辑工具，可以帮助您更好地编写和管理文档。',
      startEditing: '开始编辑',
      features: {
        title: '功能特点',
        professionalEditor: {
          title: '专业编辑器',
          description: 'Markdown Editor 提供了专业的编辑功能，可以帮助您更好地编写和管理文档。'
        },
        wechatFormatting: {
          title: '微信公众号格式化',
          description: 'Markdown Editor 支持微信公众号的格式化，可以帮助您更好地编写和管理文档。'
        },
        multipleThemes: {
          title: '多种主题',
          description: 'Markdown Editor 支持多种主题，可以根据您的需求选择不同的主题。'
        },
        mobileView: {
          title: '移动视图',
          description: 'Markdown Editor 支持移动视图，可以在移动设备上更好地阅读和编辑文档。'
        },
        darkMode: {
          title: '暗黑模式',
          description: 'Markdown Editor 支持暗黑模式，可以在夜间更好地阅读和编辑文档。'
        }
      },
      useCases: {
        title: '使用场景',
        description: 'Markdown Editor 适用于多种场景，包括撰写博客、编写文档、编写代码等。',
        items: [
          '撰写博客',
          '编写文档',
          '编写代码',
          '编写报告',
          '编写笔记',
          '编写项目文档'
        ]
      },
      cta: {
        title: '立即开始',
        button: '开始使用'
      }
    },
    
    // 页面导航
    nav: {
      home: '首页',
      editor: '编辑器',
      markdownGuide: 'Markdown 语法指南',
      wechatStyle: '微信公众号样式',
      about: '关于'
    },
    
    // 关于页面
    about: {
      title: '关于我们',
      content: '我们是一群热爱技术的人，致力于提供高质量的 Markdown 编辑器。',
      team: '团队成员',
      contact: '联系我们'
    }
  },
  'ko-KR': {
    welcome: '한국어',
    newArticle: '한국어 글',
    save: '저장',
    delete: '삭제',
    settings: '설정',
    copy: '복사',
    articleList: '글 목록',
    markdownEditor: '마크다운 에디터',
    renderSettings: '렌더링 설정',
    closeSettings: '설정 닫기',
    copyContent: '복사된 내용',
    light: '밝은',
    dark: '어두운',
    fontSize: '글꼴 크기',
    small: '작은',
    medium: '중간',
    large: '큰',
    extraLarge: '매우 큰',
    autoSave: '자동 저장',
    showLineNumbers: '줄 번호 표시',
    spellCheck: '맞춤법 검사',
    renderStyle: '렌더링 스타일',
    renderColor: '렌더링 색상',
    newArticleTitle: '새 글',
    newArticleContent: '여기에 내용을 입력하세요...',
    readOnlyWarning: '이 문서는 읽기 전용입니다',
    cannotSaveWarning: '읽기 전용 문서를 저장할 수 없습니다',
    cannotDeleteWarning: '읽기 전용 문서를 삭제할 수 없습니다',
    minArticleWarning: '최소한 한 개의 글을 유지해야 합니다',
    emptyTitleWarning: '제목을 비워둘 수 없습니다',
    copySuccess: '내용이 성공적으로 복사되었습니다',
    copyError: '복사 실패',
    saveSuccess: '내용이 성공적으로 저장되었습니다',
    deleteSuccess: '내용이 성공적으로 삭제되었습니다',
    placeholder: '여기에 마크다운 텍스트를 입력하세요...',
    defaultContent: `# 마크다운 에디터에 오신 것을 환영합니다\n\n이것은 간단하지만 강력한 마크다운 에디터입니다. 문서를 작성하고 관리하는 데 도움을 줄 것입니다.\n\n## 기본 기능\n\n1. **문서 관리**\n   - 왼쪽 상단의 "+" 버튼을 클릭하여 새 문서를 만듭니다\n   - 왼쪽 패널에서 모든 문서 목록을 볼 수 있습니다\n   - 언제든지 다른 문서로 전환할 수 있습니다\n\n2. **편집 기능**\n   - 모든 표준 Markdown 구문을 지원합니다\n   - 편집 효과를 실시간으로 미리보기\n   - 내용을 자동으로 저장\n\n3. **기타 기능**\n   - 다양한 렌더링 스타일\n   - 글꼴 크기 조정\n   - 밝은/어두운 테마 지원\n   - 문서 내용 복사\n\n## 시작하기\n\n이제 첫 번째 문서를 만들 수 있습니다! 왼쪽 상단의 "+" 버튼을 클릭하여 글쓰기 여정을 시작하세요.`,
    renderStyleTitle: '렌더링 스타일',
    renderColorTitle: '렌더링 색상',
    fontSizeTitle: '글꼴 크기',
    autoSaveTitle: '자동 저장',
    showLineNumbersTitle: '줄 번호 표시',
    spellCheckTitle: '맞춤법 검사',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: '간단한',
      academic: '학술적인',
      blog: '블로그',
      docs: '문서'
    },
    fontSizeOptions: {
      extraSmall: '작은 (12px)',
      small: '중간 (14px)',
      medium: '큰 (16px)',
      mediumLarge: '중대 (18px)',
      large: '큰 (20px)',
      extraLarge: '매우 큰 (22px)',
      huge: '매우 큰 (24px)'
    },
    autoSaveOptions: {
      oneSecond: '1 초',
      threeSeconds: '3 초',
      fiveSeconds: '5 초',
      tenSeconds: '10 초'
    },
    toolbar: {
      bold: '굵게',
      italic: '기울임',
      strikethrough: '취소선',  // 添加删除线翻译
      heading: '제목',        // 添加标题翻译
      hr: '수평선',          // 添加水平线翻译
      quote: '인용',
      code: '코드',
      codeBlock: '코드',      // 添加代码块
      link: '링크',
      image: '이미지',
      table: '표',
      orderedList: '번호 매기기',
      unorderedList: '글머리 기호',
      ol: '번호 매기기',             // 添加有序列表(可能的替代命令名)
      ul: '글머리 기호',             // 添加无序列表(可能的替代命令名)
      taskList: '작업 목록',
      checklist: '작업 목록',      // 添加检查列表(可能的替代命令名)
      edit: '편집 모드',
      live: '실시간 미리보기',
      preview: '미리보기 모드',
      fullscreen: '전체 화면',
      webView: '웹 보기',
      mobileView: '모바일 보기',
      copy: '내용 복사',
      title: '제목',          // 标题工具
      comment: '주석'          // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: '설정',
    lineHeight: '행간',
    letterSpacing: '글자간격',
    textIndent: '들여쓰기',
    textAlign: '정렬',
    marginBottom: '단락 후 간격',
    marginLeft: '왼쪽 들여쓰기',
    marginRight: '오른쪽 들여쓰기',
    alignLeft: '왼쪽 정렬',
    alignCenter: '가운데 정렬',
    alignRight: '오른쪽 정렬',
    alignJustify: '양끝 정렬',
    normal: '보통',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: '강력한 Markdown 에디터',
      description: 'Markdown Editor는 문서를 작성하고 관리하는 데 도움을 주는 강력한 에디터입니다.',
      startEditing: '편집 시작',
      features: {
        title: '기능',
        professionalEditor: {
          title: '전문 에디터',
          description: 'Markdown Editor는 문서를 작성하고 관리하는 데 도움을 주는 전문적인 기능을 제공합니다.'
        },
        wechatFormatting: {
          title: 'WeChat 포맷팅',
          description: 'Markdown Editor는 WeChat 포맷팅을 지원하여 문서를 작성하고 관리하는 데 도움을 줍니다.'
        },
        multipleThemes: {
          title: '다양한 테마',
          description: 'Markdown Editor는 다양한 테마를 지원하여 사용자가 원하는 테마를 선택할 수 있습니다.'
        },
        mobileView: {
          title: '모바일 보기',
          description: 'Markdown Editor는 모바일 보기를 지원하여 사용자가 문서를 더 쉽게 읽고 편집할 수 있습니다.'
        },
        darkMode: {
          title: '다크 모드',
          description: 'Markdown Editor는 다크 모드를 지원하여 사용자가 문서를 더 쉽게 읽고 편집할 수 있습니다.'
        }
      },
      useCases: {
        title: '사용 사례',
        description: 'Markdown Editor는 다양한 시나리오에 적합합니다. 블로그, 문서, 코드 등을 작성하는 데 사용할 수 있습니다.',
        items: [
          '블로그 작성',
          '문서 작성',
          '코드 작성',
          '보고서 작성',
          '노트 작성',
          '프로젝트 문서 작성'
        ]
      },
      cta: {
        title: '시작하기',
        button: '시작하기'
      }
    },
    
    // 页面导航
    nav: {
      home: '홈',
      editor: '에디터',
      markdownGuide: 'Markdown 가이드',
      wechatStyle: 'WeChat 스타일',
      about: '소개'
    },
    
    // 关于页面
    about: {
      title: '소개',
      content: '우리는 기술에 대한 열정을 가진 사람들의 모임으로, Markdown 에디터를 개발하여 문서를 작성하고 관리하는 데 도움을 주기 위해 노력하고 있습니다.',
      team: '우리 팀',
      contact: '연락처'
    }
  },
  'ja-JP': {
    welcome: 'ようこそ',
    newArticle: '新規記事',
    save: '保存',
    delete: '削除',
    settings: '設定',
    copy: 'コピー',
    articleList: '記事一覧',
    markdownEditor: 'Markdownエディタ',
    renderSettings: 'レンダリング設定',
    closeSettings: '設定を閉じる',
    copyContent: '内容をコピー',
    light: 'ライト',
    dark: 'ダーク',
    fontSize: 'フォントサイズ',
    small: '小',
    medium: '中',
    large: '大',
    extraLarge: '特大',
    autoSave: '自動保存',
    showLineNumbers: '行番号を表示',
    spellCheck: 'スペルチェック',
    renderStyle: 'レンダリングスタイル',
    renderColor: 'レンダリング色',
    newArticleTitle: '新規記事',
    newArticleContent: 'ここに内容を入力...',
    readOnlyWarning: 'これは読み取り専用のドキュメントです',
    cannotSaveWarning: '読み取り専用のドキュメントは保存できません',
    cannotDeleteWarning: '読み取り専用のドキュメントは削除できません',
    minArticleWarning: '少なくとも1つの記事を保持する必要があります',
    emptyTitleWarning: 'タイトルを空にすることはできません',
    copySuccess: 'コピーしました',
    copyError: 'コピーに失敗しました',
    saveSuccess: '保存しました',
    deleteSuccess: '削除しました',
    placeholder: 'ここにMarkdownテキストを入力...',
    defaultContent: `# Markdownエディタへようこそ\n\nこれは、文書の作成と管理をより良くサポートするシンプルながらパワフルなMarkdownエディタです。\n\n## 基本機能\n\n1. **文書管理**\n   - 左上の"+"ボタンをクリックして新規文書を作成\n   - 左パネルにすべての文書リストを表示\n   - いつでも異なる文書を切り替え可能\n\n2. **編集機能**\n   - 標準的なMarkdown構文をすべてサポート\n   - 編集効果のリアルタイムプレビュー\n   - 内容の自動保存\n\n3. **その他の機能**\n   - 複数のレンダリングスタイル\n   - フォントサイズの調整可能\n   - ライト/ダークテーマのサポート\n   - 文書内容のコピー\n\n## 始めましょう\n\n最初の文書を作成できます！左上の"+"ボタンをクリックして、執筆の旅を始めましょう。`,
    renderStyleTitle: 'レンダリングスタイル',
    renderColorTitle: 'レンダリング色',
    fontSizeTitle: 'フォントサイズ',
    autoSaveTitle: '自動保存',
    showLineNumbersTitle: '行番号を表示',
    spellCheckTitle: 'スペルチェック',
    renderStyleOptions: {
      wechat: 'WeChat',
      github: 'GitHub',
      simple: 'シンプル',
      academic: '学術',
      blog: 'ブログ',
      docs: 'ドキュメント'
    },
    fontSizeOptions: {
      extraSmall: '小 (12px)',
      small: '中 (14px)',
      medium: '大 (16px)',
      mediumLarge: '特大 (18px)',
      large: '特大 (20px)',
      extraLarge: '特大 (22px)',
      huge: '特大 (24px)'
    },
    autoSaveOptions: {
      oneSecond: '1秒',
      threeSeconds: '3秒',
      fiveSeconds: '5秒',
      tenSeconds: '10秒'
    },
    toolbar: {
      bold: '太字',
      italic: '斜体',
      strikethrough: '取消线',  // 添加删除线翻译
      heading: '标题',          // 添加标题翻译
      hr: '水平线',             // 添加水平线翻译
      quote: '引用',
      code: 'コード',
      codeBlock: 'コードブロック',      // 添加代码块
      link: 'リンク',
      image: '画像',
      table: '表',
      orderedList: '番号付きリスト',
      unorderedList: '箇条書き',
      ol: '番号付きリスト',             // 添加有序列表(可能的替代命令名)
      ul: '箇条書き',             // 添加无序列表(可能的替代命令名)
      taskList: 'タスクリスト',
      checklist: 'タスクリスト',      // 添加检查列表(可能的替代命令名)
      edit: '編集モード',
      live: 'ライブプレビュー',
      preview: 'プレビューモード',
      fullscreen: '全画面表示',
      webView: 'ウェブ表示',
      mobileView: 'モバイル表示',
      copy: '内容をコピー',
      title: 'タイトル',          // 标题工具
      comment: 'コメント'          // 注释工具
    },
    bodyFontSize: '正文字体大小',
    headingFontSize: '标题字体大小',
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left' as const,
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    paragraphSettingsTitle: '設定',
    lineHeight: '行間',
    letterSpacing: '字間',
    textIndent: '字下げ',
    textAlign: '揃え',
    marginBottom: '段落後の間隔',
    marginLeft: '左の字下げ',
    marginRight: '右の字下げ',
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
    alignJustify: '両端揃え',
    normal: '普通',
    
    // SEO页面和静态页面翻译
    seo: {
      title: 'Markdown Editor',
      subtitle: '功能强大的 Markdown 编辑器',
      description: 'Markdown Editor 是一款功能强大的编辑工具，可以帮助您更好地编写和管理文档。',
      startEditing: '开始编辑',
      features: {
        title: '功能特点',
        professionalEditor: {
          title: '专业编辑器',
          description: 'Markdown Editor 提供了专业的编辑功能，可以帮助您更好地编写和管理文档。'
        },
        wechatFormatting: {
          title: '微信公众号格式化',
          description: 'Markdown Editor 支持微信公众号的格式化，可以帮助您更好地编写和管理文档。'
        },
        multipleThemes: {
          title: '多种主题',
          description: 'Markdown Editor 支持多种主题，可以根据您的需求选择不同的主题。'
        },
        mobileView: {
          title: '移动视图',
          description: 'Markdown Editor 支持移动视图，可以在移动设备上更好地阅读和编辑文档。'
        },
        darkMode: {
          title: '暗黑模式',
          description: 'Markdown Editor 支持暗黑模式，可以在夜间更好地阅读和编辑文档。'
        }
      },
      useCases: {
        title: '使用场景',
        description: 'Markdown Editor 适用于多种场景，包括撰写博客、编写文档、编写代码等。',
        items: [
          '撰写博客',
          '编写文档',
          '编写代码',
          '编写报告',
          '编写笔记',
          '编写项目文档'
        ]
      },
      cta: {
        title: '立即开始',
        button: '开始使用'
      }
    },
    
    // 页面导航
    nav: {
      home: '首页',
      editor: '编辑器',
      markdownGuide: 'Markdown 语法指南',
      wechatStyle: '微信公众号样式',
      about: '关于'
    },
    
    // 关于页面
    about: {
      title: '关于我们',
      content: '我们是一群热爱技术的人，致力于提供高质量的 Markdown 编辑器。',
      team: '团队成员',
      contact: '联系我们'
    }
  }
};

const t = (locale: LocaleType, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }
  if (value === undefined) {
    value = translations['zh-CN'];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
  }
  return value || key;
};

const AlignButton: React.FC<{
  value: string;
  tooltip: string;
  icon: React.ReactNode;
}> = React.memo(({ value, tooltip, icon }) => (
  <Tooltip title={tooltip} placement="top">
    <Radio.Button value={value} style={{ width: '25%', textAlign: 'center', fontSize: '16px' }}>
      {icon}
    </Radio.Button>
  </Tooltip>
));

// 语言选择器组件
const LanguageSelector = React.memo(({ locale, setLocale }: { locale: LocaleType; setLocale: (locale: LocaleType) => void }) => {
  const [open, setOpen] = useState(false);

  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    setLocale(key as LocaleType);
    localStorage.setItem('locale', key); // 保存语言设置到 localStorage
    setOpen(false);
  }, [setLocale]);

  const items = useMemo(() => Object.entries(locales).map(([key, value]) => ({
    key,
    label: (
      <Space>
        <span role="img" aria-label={value.text}>{value.flag}</span>
        <span>{value.text}</span>
      </Space>
    ),
  })), []);

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button type="text" onClick={e => e.stopPropagation()}>
        <Space>
          {React.createElement(GlobalOutlined)}
          <span>{locales[locale].text}</span>
        </Space>
      </Button>
    </Dropdown>
  );
});

const MainApp: React.FC<{ 
  locale: LocaleType; 
  setLocale: (locale: LocaleType) => void;
  onGoHome: () => void;
}> = ({ locale, setLocale, onGoHome }) => {
  const [value, setValue] = useState<string>(DEFAULT_CONTENT);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(false);
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultArticles = [
      { id: 'welcome', title: t(locale, 'welcome'), content: DEFAULT_CONTENT, isDefault: true },
      { id: 'markdown-guide', title: 'Markdown 语法指南', content: MARKDOWN_GUIDE, isDefault: true }
    ];
    
    if (saved) {
      try {
        const parsedArticles: Article[] = JSON.parse(saved);
        // 移除所有默认文章
        const userArticles = parsedArticles.filter(article => !article.isDefault);
        // 添加回默认文章
        return [...defaultArticles, ...userArticles];
      } catch (e) {
        return defaultArticles;
      }
    }
    
    return defaultArticles;
  });
  const [currentArticle, setCurrentArticle] = useState<string | null>(() => {
    const lastEditedId = localStorage.getItem('last-edited-article');
    return lastEditedId || 'welcome';
  });
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'light';
  });

  // 监听主题变化并保存
  useEffect(() => {
    localStorage.setItem('theme-mode', currentTheme);
    document.documentElement.setAttribute('data-color-mode', currentTheme);
    document.body.setAttribute('data-color-mode', currentTheme);
  }, [currentTheme]);

  // 移除 lastScrollTopRef 和 SCROLL_THRESHOLD
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  interface Settings {
    fontSize: string; // 保持字符串类型，但确保值格式为 "16px"
    headingFontSize: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
    };
    headingColor: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
    };
    headingBold: {
      h1: boolean;
      h2: boolean;
      h3: boolean;
      h4: boolean;
    };
    paragraphSettings: {
      lineHeight: string;
      letterSpacing: string;
      textIndent: string;
      textAlign: 'left' | 'center' | 'right' | 'justify';
      marginBottom: string;
      marginLeft: string;
      marginRight: string;
    };
    autoSave: boolean;
    autoSaveInterval: number;
    lineNumbers: boolean;
    spellCheck: boolean;
    renderStyle: string;
    renderColor: string;
    viewMode: 'web' | 'mobile';  // 添加视图模式设置
  }

  const [settings, setSettings] = useState<Settings>({
    fontSize: '16px', // 使用明确的像素值代替"medium"
    headingFontSize: {
      h1: '33px',
      h2: '27px',
      h3: '21px',
      h4: '19px'
    },
    headingColor: {
      h1: '#000000',
      h2: '#000000',
      h3: '#000000',
      h4: '#000000'
    },
    headingBold: {
      h1: true,
      h2: true,
      h3: true,
      h4: true
    },
    paragraphSettings: {
      lineHeight: '1.6',
      letterSpacing: 'normal',
      textIndent: '0',
      textAlign: 'left',
      marginBottom: '1em',
      marginLeft: '0',
      marginRight: '0'
    },
    autoSave: true,
    autoSaveInterval: 3000,
    lineNumbers: false,
    spellCheck: false,
    renderStyle: 'wechat',
    renderColor: '#00b96b',
    viewMode: 'web'  // 添加默认视图模式
  });

  // 监听字体大小变化
  useEffect(() => {
    document.documentElement.style.setProperty('--editor-font-size', `${settings.fontSize}px`);
  }, [settings.fontSize]);

  // 自动保存函数
  const autoSave = useCallback((article: Article) => {
    if (article.isDefault) return;
    
    setArticles(prevArticles => 
      prevArticles.map(a => 
        a.id === article.id 
          ? { ...a, content: article.content, lastSaved: new Date().toLocaleString() }
          : a
      )
    );
  }, []);

  // 防抖处理的自动保存
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debouncedAutoSave = useCallback((article: Article) => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      autoSave(article);
    }, settings.autoSaveInterval);
  }, [autoSave, settings.autoSaveInterval]);

  // 自动保存到 localStorage，并确保欢迎使用文档的 isDefault 属性不会被移除
  useEffect(() => {
    const articlesToSave = articles.map((article: Article) => 
      article.title === '欢迎使用' ? { ...article, isDefault: true } : article
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articlesToSave));
  }, [articles]);

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem('markdown-editor-settings', JSON.stringify(settings));
  }, [settings]);

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('markdown-editor-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // 更新防抖时间
  useEffect(() => {
    if (settings.autoSave) {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      // 使用新的间隔时间
      const newInterval = settings.autoSaveInterval;
      const currentArticleData = articles.find(a => a.id === currentArticle);
      if (currentArticleData && !currentArticleData.isDefault) {
        scrollTimerRef.current = setTimeout(() => {
          autoSave(currentArticleData);
        }, newInterval);
      }
    }
  }, [settings.autoSaveInterval, settings.autoSave, currentArticle, articles, autoSave]);

  // 应用主题样式
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', currentTheme);
    document.body.setAttribute('data-color-mode', currentTheme);
  }, [currentTheme]);

  // 处理自动保存开关
  useEffect(() => {
    if (!settings.autoSave && scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
  }, [settings.autoSave]);

  // 初始化时设置当前文章的内容
  useEffect(() => {
    const currentArticleData = articles.find(a => a.id === currentArticle);
    if (currentArticleData) {
      setValue(currentArticleData.content);
    }
  }, [currentArticle, articles]);

  // 当切换文章时保存最后编辑的文章ID
  useEffect(() => {
    if (currentArticle) {
      localStorage.setItem('last-edited-article', currentArticle);
    }
  }, [currentArticle]);

  // 更新默认内容的翻译
  useEffect(() => {
    setArticles(prevArticles => {
      const updatedArticles = prevArticles.map(article => {
        if (article.id === 'welcome') {
          return { ...article, title: t(locale, 'welcome'), content: DEFAULT_CONTENT };
        }
        return article;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArticles));
      return updatedArticles;
    });
  }, [locale]);

  const copyToClipboard = async () => {
    try {
      const editorContent = document.querySelector('.w-md-editor-preview');
      if (!editorContent) {
        throw new Error('Preview content not found');
      }
      
      // 创建一个临时的选区
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorContent);
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // 执行复制命令
      document.execCommand('copy');
      
      // 清除选区
      selection?.removeAllRanges();
      
      message.success(t(locale, 'copySuccess'));
    } catch (err) {
      message.error(t(locale, 'copyError'));
    }
  };

  const addNewArticle = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: t(locale, 'newArticleTitle'),
      content: ""
    };
    setArticles([...articles, newArticle]);
    setCurrentArticle(newArticle.id);
    setValue(newArticle.content);
  };

  const handleArticleChange = (articleId: string) => {
    if (!articleId) return;
    setCurrentArticle(articleId);
    const article = articles.find(a => a.id === articleId);
    if (article) {
      setValue(article.content);
    }
  };

  const handleContentChange = useCallback((newContent: string | undefined) => {
    if (!currentArticle) return;
    
    setValue(newContent || '');
    const currentArticleData = articles.find(a => a.id === currentArticle);
    if (currentArticleData?.isDefault) {
      message.warning(t(locale, 'readOnlyWarning'));
      setValue(currentArticleData.content);
      return;
    }

    const updatedArticle = {
      ...currentArticleData!,
      content: newContent || '',
      lastSaved: new Date().toLocaleString()
    };

    setArticles(articles.map(article =>
      article.id === currentArticle
        ? updatedArticle
        : article
    ));
  }, [currentArticle, articles, locale]);
  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const saveCurrentArticle = () => {
    if (!currentArticle) return;
    
    const currentArticleData = articles.find(a => a.id === currentArticle);
    if (currentArticleData?.isDefault) {
      message.warning(t(locale, 'cannotSaveWarning'));
      return;
    }

    setArticles(articles.map(article =>
      article.id === currentArticle
        ? { ...article, lastSaved: new Date().toLocaleString() }
        : article
    ));
    message.success(t(locale, 'saveSuccess'));
  };

  const deleteArticle = (articleId: string) => {
    if (articles.length <= 1) {
      message.warning(t(locale, 'minArticleWarning'));
      return;
    }

    const newArticles = articles.filter(article => article.id !== articleId);
    setArticles(newArticles);

    if (currentArticle === articleId) {
      const firstArticle = newArticles[0];
      setCurrentArticle(firstArticle.id);
      setValue(firstArticle.content);
    }
    
    message.success(t(locale, 'deleteSuccess'));
  };

  const startEditing = (articleId: string) => {
    setArticles(articles.map(article => 
      article.id === articleId ? { ...article, isEditing: true } : article
    ));
  };

  const handleTitleChange = useCallback((articleId: string, newTitle: string) => {
    if (!newTitle.trim()) {
      message.warning(t(locale, 'emptyTitleWarning'));
      return;
    }

    const article = articles.find(a => a.id === articleId);
    if (article?.isDefault) {
      message.warning(t(locale, 'cannotSaveWarning'));
      return;
    }

    setArticles(articles.map(article =>
      article.id === articleId
        ? { ...article, title: newTitle, isEditing: false } // 添加isEditing: false，保存后退出编辑状态
        : article
    ));
  }, [articles, locale]);

  const menuItems: MenuProps['items'] = articles.map(article => ({
    key: article.id,
    icon: React.createElement(FileTextOutlined),
    onClick: () => handleArticleChange(article.id),
    label: (
      <div className="article-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {article.isEditing && !article.isDefault ? (
          <Input
            size="small"
            defaultValue={article.title}
            onClick={e => e.stopPropagation()}
            onPressEnter={(e) => handleTitleChange(article.id, (e.target as HTMLInputElement).value)}
            onBlur={(e) => handleTitleChange(article.id, e.target.value)}
            autoFocus
          />
        ) : (
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</span>
        )}
        {!collapsed && (
          <Space style={{ flexShrink: 0 }}>
            {!article.isDefault && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={React.createElement(EditOutlined)}
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(article.id);
                  }}
                />
                <Button
                  type="text"
                  size="small"
                  className="save-icon"
                  icon={React.createElement(SaveOutlined)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentArticle === article.id) {
                      saveCurrentArticle();
                    }
                  }}
                />
                <Button
                  type="text"
                  size="small"
                  className="delete-icon"
                  icon={React.createElement(DeleteOutlined)}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteArticle(article.id);
                  }}
                />
              </>
            )}
          </Space>
        )}
    </div>
    )
  }));

  // 更新设置
  const updateSettings = (key: keyof Settings, value: any) => {
    setSettings((prev: Settings) => {
      if (key === 'headingFontSize') {
        // 确保在更新 headingFontSize 时保留现有的值
        return {
          ...prev,
          headingFontSize: {
            ...prev.headingFontSize,
            ...value
          }
        };
      }
      return {
        ...prev,
        [key]: value
      };
    });
  };

  // 更新主题
  const updateTheme = (theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-color-mode', theme);
    document.body.setAttribute('data-color-mode', theme);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLanguageChange = (value: LocaleType) => {
    setLocale(value);
    localStorage.setItem('locale', value);
  };

  // 添加节流函数
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const languageOptions = useMemo(() => Object.entries(locales).map(([key, value]) => ({
    value: key as LocaleType,
    label: `${value.flag} ${value.text}`
  })), [locales]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const FONT_SIZE_OPTIONS = [
    { value: '14px', label: t(locale, 'fontSizeOptions.extraSmall') },
    { value: '15px', label: t(locale, 'fontSizeOptions.small') },
    { value: '16px', label: t(locale, 'fontSizeOptions.medium') },
    { value: '17px', label: t(locale, 'fontSizeOptions.mediumLarge') },
    { value: '18px', label: t(locale, 'fontSizeOptions.large') },
    { value: '19px', label: t(locale, 'fontSizeOptions.extraLarge') },
    { value: '20px', label: t(locale, 'fontSizeOptions.huge') },
  ];

  const [siderWidth, setSiderWidth] = useState<number>(() => {
    const savedWidth = localStorage.getItem('sider-width');
    return savedWidth ? parseInt(savedWidth) : 260;
  });

  const [settingsSiderWidth, setSettingsSiderWidth] = useState<number>(() => {
    const savedWidth = localStorage.getItem('settings-sider-width');
    return savedWidth ? parseInt(savedWidth) : 300;
  });

  const siderRef = useRef<HTMLDivElement>(null);
  const settingsSiderRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const isScrolling = useRef(false);

  useEffect(() => {
    const leftSider = siderRef.current;
    const rightSider = settingsSiderRef.current;
    if (!leftSider) return;

    const startResizing = (e: MouseEvent) => {
      // 左侧栏调整
      if (e.clientX >= leftSider.offsetLeft + 180 && e.clientX <= leftSider.offsetLeft + leftSider.offsetWidth + 10) {
        isResizing.current = { ...isResizing.current, left: true };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      }
      // 右侧栏调整
      if (rightSider && settingsOpen) {
        const rightSiderLeft = rightSider.getBoundingClientRect().left;
        if (Math.abs(e.clientX - rightSiderLeft) <= 10) {
          isResizing.current = { ...isResizing.current, right: true };
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
        }
      }
    };

    const stopResizing = () => {
      isResizing.current = { left: false, right: false };
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    const resize = (e: MouseEvent) => {
      // 左侧栏宽度调整
      if (isResizing.current.left) {
        const newWidth = e.clientX - leftSider.offsetLeft;
        if (newWidth >= 200 && newWidth <= 600) {
          setSiderWidth(newWidth);
          localStorage.setItem('sider-width', newWidth.toString());
        }
      }
      // 右侧栏宽度调整
      if (isResizing.current.right && rightSider && settingsOpen) {
        const containerWidth = document.documentElement.clientWidth;
        const newWidth = containerWidth - e.clientX;
        if (newWidth >= 250 && newWidth <= 600) {
          setSettingsSiderWidth(newWidth);
          localStorage.setItem('settings-sider-width', newWidth.toString());
        }
      }
    };

    leftSider.addEventListener('mousedown', startResizing);
    if (rightSider) {
      rightSider.addEventListener('mousedown', startResizing);
    }
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);

    return () => {
      leftSider.removeEventListener('mousedown', startResizing);
      if (rightSider) {
        rightSider.removeEventListener('mousedown', startResizing);
      }
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [settingsOpen]);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editorContent = editorRef.current?.querySelector('.w-md-editor-content');
    if (!editorContent) return;

    const editorArea = editorContent.querySelector('.w-md-editor-text-input') as HTMLElement;
    const previewArea = editorContent.querySelector('.w-md-editor-preview') as HTMLElement;
    
    if (!editorArea || !previewArea) {
      console.log('Failed to find editor or preview elements');
      return;
    }

    const handleEditorScroll = () => {
      if (isScrolling.current) return;
      
      isScrolling.current = true;
      
      const editorScrollHeight = editorArea.scrollHeight - editorArea.clientHeight;
      const previewScrollHeight = previewArea.scrollHeight - previewArea.clientHeight;
      
      if (editorScrollHeight <= 0 || previewScrollHeight <= 0) {
        isScrolling.current = false;
        return;
      }

      const scrollRatio = editorArea.scrollTop / editorScrollHeight;
      previewArea.scrollTop = scrollRatio * previewScrollHeight;

      requestAnimationFrame(() => {
        isScrolling.current = false;
      });
    };

    console.log('Adding editor scroll event listener');
    editorArea.addEventListener('scroll', handleEditorScroll);

    return () => {
      console.log('Removing editor scroll event listener');
      editorArea.removeEventListener('scroll', handleEditorScroll);
    };
  }, []);

  // 辅助函数：确保字体大小值的格式正确
  const parseFontSize = (value: string, defaultValue: number): number => {
    // 如果是像素值(如"16px")，提取数字部分
    if (value.endsWith('px')) {
      const size = parseInt(value.replace('px', ''));
      return isNaN(size) ? defaultValue : size;
    }
    
    // 映射描述性值到像素值
    const fontSizeMap: {[key: string]: number} = {
      'extraSmall': 12,
      'small': 14, 
      'medium': 16,
      'mediumLarge': 18,
      'large': 20,
      'extraLarge': 24,
      'huge': 28
    };
    
    return fontSizeMap[value] || defaultValue;
  };

  // 添加视图模式切换处理函数
  const toggleViewMode = (mode: 'web' | 'mobile') => {
    setSettings(prev => ({
      ...prev,
      viewMode: mode
    }));
  };

  // 1. 添加恢复默认设置函数
  const resetToDefaultSettings = () => {
    // 创建默认设置对象
    const defaultSettings: Settings = {
      fontSize: '16px', // 使用明确的像素值
      headingFontSize: {
        h1: '33px',
        h2: '27px',
        h3: '21px',
        h4: '19px'
      },
      headingColor: {
        h1: '#000000',
        h2: '#000000',
        h3: '#000000',
        h4: '#000000'
      },
      headingBold: {
        h1: true,
        h2: true,
        h3: true,
        h4: true
      },
      paragraphSettings: {
        lineHeight: '1.6',
        letterSpacing: 'normal',
        textIndent: '0',
        textAlign: 'left',
        marginBottom: '1em',
        marginLeft: '0',
        marginRight: '0'
      },
      autoSave: true,
      autoSaveInterval: 3000,
      lineNumbers: false,
      spellCheck: false,
      renderStyle: 'wechat',
      renderColor: '#00b96b',
      viewMode: 'web'
    };
    
    // 更新设置状态
    setSettings(defaultSettings);
    
    // 保存到localStorage
    localStorage.setItem('markdown-editor-settings', JSON.stringify(defaultSettings));
    
    // 显示成功消息
    message.success(t(locale, 'settings') + '已重置为默认值');
  };

  return (
    <ConfigProvider
      locale={locales[locale].locale}
      theme={{
        algorithm: currentTheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#00b96b',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: currentTheme === 'dark' ? '#141414' : '#ffffff' }}>
        <Sider 
          ref={siderRef}
          collapsible={false}
          collapsed={collapsed}
          theme={currentTheme}
          width={siderWidth}
          style={{ 
            borderRight: `1px solid ${currentTheme === 'dark' ? '#303030' : '#f0f0f0'}`,
            background: currentTheme === 'dark' ? '#141414' : '#ffffff',
            position: 'relative',
            transition: 'none'
          }}
        >
          <div style={{ 
            position: 'absolute',
            top: 0,
            right: -5,
            width: '10px',
            height: '100%',
            cursor: 'col-resize',
            zIndex: 100
          }} />
          <div style={{ 
            padding: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            color: currentTheme === 'dark' ? '#ffffff' : 'inherit'
          }}>
            {!collapsed && <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{t(locale, 'articleList')}</span>}
            <Space>
              <Button
                type="text"
                icon={React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                onClick={() => setCollapsed(!collapsed)}
              />
              <Button
                type="text"
                icon={React.createElement(PlusOutlined)}
                onClick={addNewArticle}
              />
            </Space>
          </div>
          <Menu
            mode="inline"
            selectedKeys={currentArticle ? [currentArticle] : []}
            items={menuItems}
            theme={currentTheme}
          />
        </Sider>
        <Layout>
          <Header style={{ 
            padding: '0 16px',
            background: currentTheme === 'dark' ? '#141414' : '#ffffff',
            borderBottom: `1px solid ${currentTheme === 'dark' ? '#303030' : '#f0f0f0'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
              <Space size="middle">
                <Title level={3} style={{ 
                  margin: 0,
                  color: currentTheme === 'dark' ? '#ffffff' : 'inherit'
                }}>{t(locale, 'markdownEditor')}</Title>
                <LanguageSelector locale={locale} setLocale={setLocale} />
              </Space>
              <Space>
                <Button
                  type="text"
                  icon={React.createElement(HomeOutlined)}
                  onClick={onGoHome}
                  title="返回首页"
                >
                  返回首页
                </Button>
                <Button
                  type="primary"
                  icon={React.createElement(CopyOutlined)}
                  onClick={copyToClipboard}
                >
                  {t(locale, 'copyContent')}
                </Button>
                <Button
                  type="text"
                  icon={React.createElement(SettingOutlined)}
                  onClick={() => setSettingsOpen(!settingsOpen)}
                >
                  {settingsOpen ? t(locale, 'closeSettings') : t(locale, 'renderSettings')}
                </Button>
                <Select
                  value={currentTheme}
                  onChange={updateTheme}
                  style={{ width: 100 }}
                  options={[
                    { label: t(locale, 'light'), value: 'light' },
                    { label: t(locale, 'dark'), value: 'dark' },
                  ]}
                />
              </Space>
            </div>
          </Header>
          <Layout style={{ 
            flexDirection: 'row',
            background: currentTheme === 'dark' ? '#141414' : '#ffffff'
          }}>
            <Content style={{ 
              padding: '24px', 
              background: currentTheme === 'dark' ? '#141414' : '#ffffff',
              flex: 1,
              height: 'calc(100vh - 64px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div className="editor-container" ref={editorRef}>
                <MDEditor
                  value={value}
                  onChange={handleContentChange}
                  preview="live"
                  height="100%"
                  highlightEnable={false}
                  className={`${settings.renderStyle} ${settings.viewMode === 'mobile' ? 'mobile-preview' : ''}`}
                  data-show-line-numbers={settings.lineNumbers}
                  textareaProps={{
                    placeholder: t(locale, 'placeholder'),
                    readOnly: articles.find(a => a.id === currentArticle)?.isDefault,
                    spellCheck: settings.spellCheck,
                    className: 'markdown-textarea'
                  }}
                  commands={(() => {
                    // 获取默认命令并应用翻译
                    const defaultCommands = getCommands().filter(cmd => 
                      cmd.name !== 'edit' && 
                      cmd.name !== 'live' && 
                      cmd.name !== 'preview' && 
                      cmd.name !== 'fullscreen' &&
                      cmd.name !== 'help'
                    );
                    
                    // 为每个命令应用翻译
                    return defaultCommands.map(cmd => {
                      // 创建一个新的命令对象
                      const newCmd = { ...cmd };
                      
                      // 尝试查找对应的翻译
                      // 有些命令名可能是codeblock而不是codeBlock等，尝试多种情况
                      const cmdName = cmd.name;
                      let translationKey = `toolbar.${cmdName}`;
                      
                      // 特殊情况处理
                      if (cmdName === 'codeblock') {
                        translationKey = 'toolbar.codeBlock';
                      } else if (cmdName === 'ordered-list') {
                        translationKey = 'toolbar.orderedList';
                      } else if (cmdName === 'unordered-list') {
                        translationKey = 'toolbar.unorderedList';
                      } else if (cmdName === 'checked-list') {
                        translationKey = 'toolbar.checklist';
                      } else if (cmdName === 'title') {
                        translationKey = 'toolbar.title';
                      } else if (cmdName === 'conment' || cmdName === 'comment') {
                        // conment可能是comment的拼写错误
                        translationKey = 'toolbar.comment';
                      }
                      
                      // 应用翻译
                      newCmd.buttonProps = {
                        ...(newCmd.buttonProps || {}),
                        'aria-label': t(locale, translationKey),
                        title: t(locale, translationKey)
                      };
                      
                      // 如果找不到特定翻译，使用默认标题
                      if (typeof newCmd.buttonProps.title === 'undefined' || 
                          newCmd.buttonProps.title === translationKey) {
                        // 显示命令名作为后备
                        console.log(`Missing translation for ${cmdName}, using default`);
                      }
                      
                      return newCmd;
                    });
                  })()}
                  extraCommands={[
                    {
                      name: 'webView',
                      keyCommand: 'webView',
                      buttonProps: { 
                        'aria-label': t(locale, 'toolbar.webView'),
                        style: { color: settings.viewMode === 'web' ? '#1890ff' : undefined },
                        title: t(locale, 'toolbar.webView')
                      },
                      icon: (
                        <span className="anticon">
                          <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136V232h752v560z" />
                          </svg>
                        </span>
                      ),
                      execute: () => {
                        toggleViewMode('web');
                      },
                    },
                    {
                      name: 'mobileView',
                      keyCommand: 'mobileView',
                      buttonProps: { 
                        'aria-label': t(locale, 'toolbar.mobileView'),
                        style: { color: settings.viewMode === 'mobile' ? '#1890ff' : undefined },
                        title: t(locale, 'toolbar.mobileView')
                      },
                      icon: (
                        <span className="anticon">
                          <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M744 62H280c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h464c35.3 0 64-28.7 64-64V126c0-35.3-28.7-64-64-64zm-8 824H288V134h448v752zM472 784a40 40 0 1080 0 40 40 0 10-80 0z" />
                          </svg>
                        </span>
                      ),
                      execute: () => {
                        toggleViewMode('mobile');
                      },
                    },
                    {
                      name: 'divider',
                      keyCommand: 'divider',
                      buttonProps: { 
                        'aria-label': t(locale, 'toolbar.divider'),
                        style: { cursor: 'default' }
                      },
                      icon: <span style={{ width: '1px', height: '1.25em', backgroundColor: 'rgba(0, 0, 0, 0.06)', margin: '0 8px', display: 'inline-block' }} />,
                      execute: () => {},
                    },
                    {
                      name: 'copy',
                      keyCommand: 'copy',
                      buttonProps: { 
                        'aria-label': t(locale, 'toolbar.copy'),
                        title: t(locale, 'toolbar.copy')
                      },
                      icon: (
                        <span className="anticon">
                          <svg viewBox="64 64 896 896" focusable="false" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" />
                          </svg>
                        </span>
                      ),
                      execute: () => {
                        copyToClipboard();
                      },
                    },
                  ]}
                  previewOptions={{
                    className: `markdown-preview ${settings.renderStyle}`,
                    style: {
                      '--render-color': settings.renderColor,
                      '--md-bg-color': currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
                      '--md-text-color': currentTheme === 'dark' ? '#e0e0e0' : '#333333',
                      '--md-border-color': currentTheme === 'dark' ? '#404040' : '#e8e8e8',
                      '--body-font-size': settings.fontSize,
                      '--h1-font-size': settings.headingFontSize.h1,
                      '--h2-font-size': settings.headingFontSize.h2,
                      '--h3-font-size': settings.headingFontSize.h3,
                      '--h4-font-size': settings.headingFontSize.h4,
                      '--h1-color': settings.headingColor.h1,
                      '--h2-color': settings.headingColor.h2,
                      '--h3-color': settings.headingColor.h3,
                      '--h4-color': settings.headingColor.h4,
                      '--h1-bold': settings.headingBold.h1 ? 'bold' : 'normal',
                      '--h2-bold': settings.headingBold.h2 ? 'bold' : 'normal',
                      '--h3-bold': settings.headingBold.h3 ? 'bold' : 'normal',
                      '--h4-bold': settings.headingBold.h4 ? 'bold' : 'normal',
                      '--paragraph-line-height': settings.paragraphSettings.lineHeight,
                      '--paragraph-letter-spacing': settings.paragraphSettings.letterSpacing,
                      '--paragraph-text-indent': settings.paragraphSettings.textIndent,
                      '--paragraph-text-align': settings.paragraphSettings.textAlign,
                      '--paragraph-margin-bottom': settings.paragraphSettings.marginBottom,
                      '--paragraph-margin-left': settings.paragraphSettings.marginLeft,
                      '--paragraph-margin-right': settings.paragraphSettings.marginRight
                    } as React.CSSProperties
                  }}
                />
              </div>
            </Content>
            {settingsOpen && (
              <Sider
                width={settingsSiderWidth}
                style={{
                  background: currentTheme === 'dark' ? '#141414' : '#ffffff',
                  borderLeft: `1px solid ${currentTheme === 'dark' ? '#303030' : '#f0f0f0'}`,
                  position: 'relative'
                }}
                ref={settingsSiderRef}
              >
                <div 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: -5,
                    width: '10px',
                    height: '100%',
                    cursor: 'col-resize',
                    zIndex: 100
                  }} 
                />
                <div className="settings-content">
                  {/* 1. 渲染样式设置 */}
                  <div>
                    <Typography.Title level={5}>{t(locale, 'renderStyleTitle')}</Typography.Title>
                    <Select
                      style={{ width: '100%' }}
                      value={settings.renderStyle}
                      onChange={(value: string) => updateSettings('renderStyle', value)}
                      options={[
                        { label: t(locale, 'renderStyleOptions.wechat'), value: 'wechat' },
                        { label: t(locale, 'renderStyleOptions.github'), value: 'github' },
                        { label: t(locale, 'renderStyleOptions.simple'), value: 'simple' },
                        { label: t(locale, 'renderStyleOptions.academic'), value: 'academic' },
                        { label: t(locale, 'renderStyleOptions.blog'), value: 'blog' },
                        { label: t(locale, 'renderStyleOptions.docs'), value: 'docs' }
                      ]}
                    />
                  </div>

                  {/* 添加分割线 */}
                  <Divider style={{ margin: '16px 0' }} />

                  {/* 2. 渲染颜色 */}
                  <div>
                    <Typography.Title level={5}>{t(locale, 'renderColorTitle')}</Typography.Title>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <Button
                        style={{ 
                          backgroundColor: '#000000',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#000000' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#000000')}
                        title="GitHub"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#1DA1F2',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#1DA1F2' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#1DA1F2')}
                        title="Twitter"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#0A66C2',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#0A66C2' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#0A66C2')}
                        title="LinkedIn"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#FF0000',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#FF0000' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#FF0000')}
                        title="YouTube"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#1877F2',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#1877F2' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#1877F2')}
                        title="Facebook"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#E60012',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#E60012' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#E60012')}
                        title="Nintendo"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#7A1FA2',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#7A1FA2' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#7A1FA2')}
                        title="Twitch"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#EA4335',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#EA4335' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#EA4335')}
                        title="Google"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#00B96B',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#00B96B' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#00B96B')}
                        title="Spotify"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#FF6900',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#FF6900' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#FF6900')}
                        title="Reddit"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#0084FF',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#0084FF' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#0084FF')}
                        title="Messenger"
                      />
                      <Button
                        style={{ 
                          backgroundColor: '#5865F2',
                          width: '100%',
                          height: '32px',
                          border: settings.renderColor === '#5865F2' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                        }}
                        onClick={() => updateSettings('renderColor', '#5865F2')}
                        title="Discord"
                      />
                    </div>
                    <Input 
                      type="color" 
                      value={settings.renderColor}
                      onChange={(e) => updateSettings('renderColor', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <Divider />

                  {/* 3. 字体大小设置 */}
                  <div>
                    <Typography.Title level={5}>{t(locale, 'fontSizeTitle')}</Typography.Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Typography.Text>{t(locale, 'bodyFontSize')}</Typography.Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                          <Slider
                            style={{ flex: 1 }}
                            min={14}
                            max={20}
                            defaultValue={16}
                            value={parseFontSize(settings.fontSize, 16)}
                            onChange={(value: number) => updateSettings('fontSize', `${value}px`)}
                            tooltip={{ formatter: (value?: number) => value ? `${value}px` : '' }}
                          />
                          <Typography.Text style={{ minWidth: '40px', textAlign: 'right' }}>
                            {parseFontSize(settings.fontSize, 16)}px
                          </Typography.Text>
                        </div>
                      </div>
                      <div>
                        <Typography.Text>{t(locale, 'headingFontSize')}</Typography.Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '8px' }}>
                          <Typography.Text style={{ width: '60px' }}>标题</Typography.Text>
                          <Typography.Text style={{ flex: 1, textAlign: 'center' }}>字体大小</Typography.Text>
                          <Typography.Text style={{ width: '50px', textAlign: 'center' }}>颜色</Typography.Text>
                          <Typography.Text style={{ width: '50px', textAlign: 'center' }}>加粗</Typography.Text>
                        </div>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {['h1', 'h2', 'h3', 'h4'].map((heading) => (
                            <div key={heading} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                              <Typography.Text style={{ width: '30px' }}>{heading.toUpperCase()}:</Typography.Text>
                              <Slider
                                style={{ flex: 1 }}
                                min={heading === 'h1' ? 30 : heading === 'h2' ? 24 : heading === 'h3' ? 18 : 16}
                                max={heading === 'h1' ? 36 : heading === 'h2' ? 30 : heading === 'h3' ? 24 : 22}
                                step={1}
                                value={parseFontSize(settings.headingFontSize[heading as keyof typeof settings.headingFontSize], 
                                  heading === 'h1' ? 33 : heading === 'h2' ? 27 : heading === 'h3' ? 21 : 19)}
                                onChange={(value: number) => {
                                  const newHeadingFontSize = { ...settings.headingFontSize };
                                  newHeadingFontSize[heading as keyof typeof settings.headingFontSize] = `${value}px`;
                                  updateSettings('headingFontSize', newHeadingFontSize);
                                }}
                                tooltip={{ formatter: (value?: number) => value ? `${value}px` : '' }}
                              />
                              <Typography.Text style={{ minWidth: '40px', textAlign: 'right' }}>
                                {parseFontSize(settings.headingFontSize[heading as keyof typeof settings.headingFontSize], 
                                  heading === 'h1' ? 33 : heading === 'h2' ? 27 : heading === 'h3' ? 21 : 19)}px
                              </Typography.Text>
                              <ColorPicker
                                value={settings.headingColor[heading as keyof typeof settings.headingColor]}
                                onChange={(color) => {
                                  const newHeadingColor = { ...settings.headingColor };
                                  newHeadingColor[heading as keyof typeof settings.headingColor] = color.toHexString();
                                  updateSettings('headingColor', newHeadingColor);
                                }}
                                size="small"
                              />
                              <Switch
                                checked={settings.headingBold[heading as keyof typeof settings.headingBold]}
                                onChange={(checked) => {
                                  const newHeadingBold = { ...settings.headingBold };
                                  newHeadingBold[heading as keyof typeof settings.headingBold] = checked;
                                  updateSettings('headingBold', newHeadingBold);
                                }}
                                size="small"
                              />
                            </div>
                          ))}
                        </Space>
                      </div>
                    </Space>
                  </div>

                  <Divider />

                  {/* 4. 段落设置 */}
                  <div>
                    <Typography.Title level={5}>{t(locale, 'paragraphSettingsTitle')}</Typography.Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Typography.Text>{t(locale, 'lineHeight')}</Typography.Text>
                        <Select
                          style={{ width: '100%' }}
                          value={settings.paragraphSettings.lineHeight}
                          onChange={(value) => updateSettings('paragraphSettings', { ...settings.paragraphSettings, lineHeight: value })}
                          options={[
                            { label: '1.4', value: '1.4' },
                            { label: '1.6', value: '1.6' },
                            { label: '1.8', value: '1.8' },
                            { label: '2.0', value: '2.0' },
                          ]}
                        />
                      </div>
                      <div>
                        <Typography.Text>{t(locale, 'letterSpacing')}</Typography.Text>
                        <Select
                          style={{ width: '100%' }}
                          value={settings.paragraphSettings.letterSpacing}
                          onChange={(value) => updateSettings('paragraphSettings', { ...settings.paragraphSettings, letterSpacing: value })}
                          options={[
                            { label: t(locale, 'normal'), value: 'normal' },
                            { label: '0.5px', value: '0.5px' },
                            { label: '1px', value: '1px' },
                            { label: '1.5px', value: '1.5px' },
                            { label: '2px', value: '2px' },
                          ]}
                        />
                      </div>
                      <div>
                        <Typography.Text>{t(locale, 'textIndent')}</Typography.Text>
                        <Select
                          style={{ width: '100%' }}
                          value={settings.paragraphSettings.textIndent}
                          onChange={(value) => updateSettings('paragraphSettings', { ...settings.paragraphSettings, textIndent: value })}
                          options={[
                            { label: '0', value: '0' },
                            { label: '2em', value: '2em' },
                            { label: '4em', value: '4em' },
                          ]}
                        />
                      </div>
                      <div>
                        <Typography.Text>{t(locale, 'textAlign')}</Typography.Text>
                        <Radio.Group
                          value={settings.paragraphSettings.textAlign}
                          onChange={(e) => updateSettings('paragraphSettings', { ...settings.paragraphSettings, textAlign: e.target.value })}
                          optionType="button"
                          buttonStyle="solid"
                          style={{ width: '100%', marginTop: '8px' }}
                        >
                          <AlignButton
                            value="left"
                            tooltip={t(locale, 'alignLeft')}
                            icon={
                              <span className="anticon">
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="align-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                  <path d="M120 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0 424h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm784 140H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
                                </svg>
                              </span>
                            }
                          />
                          <AlignButton
                            value="center"
                            tooltip={t(locale, 'alignCenter')}
                            icon={
                              <span className="anticon">
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="align-center" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                  <path d="M264 230h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm496 424H264c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM904 794H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
                                </svg>
                              </span>
                            }
                          />
                          <AlignButton
                            value="right"
                            tooltip={t(locale, 'alignRight')}
                            icon={
                              <span className="anticon">
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="align-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                  <path d="M904 158H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 424H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 212H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-424H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
                                </svg>
                              </span>
                            }
                          />
                          <AlignButton
                            value="justify"
                            tooltip={t(locale, 'alignJustify')}
                            icon={
                              <span className="anticon">
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true" style={{ transform: 'rotate(90deg)' }}>
                                  <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" />
                                </svg>
                              </span>
                            }
                          />
                        </Radio.Group>
                      </div>
                      <div>
                        <Typography.Text>{t(locale, 'marginBottom')}</Typography.Text>
                        <Select
                          style={{ width: '100%' }}
                          value={settings.paragraphSettings.marginBottom}
                          onChange={(value) => updateSettings('paragraphSettings', { ...settings.paragraphSettings, marginBottom: value })}
                          options={[
                            { label: '0.5em', value: '0.5em' },
                            { label: '1em', value: '1em' },
                            { label: '1.5em', value: '1.5em' },
                            { label: '2em', value: '2em' },
                          ]}
                        />
                      </div>
                      <div>
                        <Typography.Text>{t(locale, 'marginLeft')}</Typography.Text>
                        <Select
                          style={{ width: '100%' }}
                          value={settings.paragraphSettings.marginLeft}
                          onChange={(value) => updateSettings('paragraphSettings', { ...settings.paragraphSettings, marginLeft: value })}
                          options={[
                            { label: '0', value: '0' },
                            { label: '1em', value: '1em' },
                            { label: '2em', value: '2em' },
                            { label: '3em', value: '3em' },
                          ]}
                        />
                      </div>
                      <div>
                        <Typography.Text>{t(locale, 'marginRight')}</Typography.Text>
                        <Select
                          style={{ width: '100%' }}
                          value={settings.paragraphSettings.marginRight}
                          onChange={(value) => updateSettings('paragraphSettings', { ...settings.paragraphSettings, marginRight: value })}
                          options={[
                            { label: '0', value: '0' },
                            { label: '1em', value: '1em' },
                            { label: '2em', value: '2em' },
                            { label: '3em', value: '3em' },
                          ]}
                        />
                      </div>
                    </Space>
                  </div>

                  <Divider />

                  {/* 5. 其他设置 */}
                  <div>
                    <Typography.Title level={5}>{t(locale, 'settings')}</Typography.Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Typography.Text>{t(locale, 'autoSaveTitle')}</Typography.Text>
                        <Select
                          style={{ width: '100%' }}
                          value={settings.autoSaveInterval}
                          onChange={(value) => updateSettings('autoSaveInterval', value)}
                          options={[
                            { label: t(locale, 'autoSaveOptions.oneSecond'), value: 1000 },
                            { label: t(locale, 'autoSaveOptions.threeSeconds'), value: 3000 },
                            { label: t(locale, 'autoSaveOptions.fiveSeconds'), value: 5000 },
                            { label: t(locale, 'autoSaveOptions.tenSeconds'), value: 10000 },
                          ]}
                        />
                      </div>
                      {/* 保留行号和拼写检查的状态，但隐藏控件 */}
                      <div style={{ display: 'none' }}>
                        <Typography.Text>{t(locale, 'showLineNumbersTitle')}</Typography.Text>
                        <Switch
                          checked={settings.lineNumbers}
                          onChange={(checked) => updateSettings('lineNumbers', checked)}
                        />
                      </div>
                      <div style={{ display: 'none' }}>
                        <Typography.Text>{t(locale, 'spellCheckTitle')}</Typography.Text>
                        <Switch
                          checked={settings.spellCheck}
                          onChange={(checked) => updateSettings('spellCheck', checked)}
                        />
                      </div>
                    </Space>
                  </div>
                  {/* 在最后添加重置按钮 */}
                  <Divider />
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Button 
                      type="primary" 
                      danger
                      icon={React.createElement(ReloadOutlined)}
                      onClick={resetToDefaultSettings}
                      style={{ width: '100%' }}
                    >
                      恢复默认设置
                    </Button>
                  </div>
                </div>
              </Sider>
            )}
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  const [locale, setLocale] = useState<LocaleType>(() => {
    const savedLocale = localStorage.getItem('locale');
    // 检查保存的语言是否是有效的语言选项
    return (savedLocale && Object.keys(locales).includes(savedLocale)) ? (savedLocale as LocaleType) : 'zh-CN';
  });
  
  // 添加当前页面状态
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage === 'editor' ? 'editor' : 'home';
  });
  
  // 监听语言变化并保存
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);
  
  // 监听页面变化并保存
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  return (
    <ConfigProvider locale={locales[locale].locale}>
      <AntApp>
        <Router>
          <AppContent 
            locale={locale} 
            setLocale={setLocale} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};

// 创建子组件以便在Router内使用useNavigate
const AppContent: React.FC<{
  locale: LocaleType;
  setLocale: React.Dispatch<React.SetStateAction<LocaleType>>;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}> = ({ locale, setLocale, currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  
  // 处理开始编辑
  const handleStartEditing = () => {
    setCurrentPage('editor');
    navigate('/editor');
  };
  
  // 处理返回首页
  const handleGoHome = () => {
    setCurrentPage('home');
    navigate('/');
  };
  
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}><Spin size="large" /></div>}>
      <Routes>
        <Route path="/" element={<SEOLandingPage 
          onStartEditing={handleStartEditing} 
          locale={locale} 
          translations={translations} 
        />} />
        <Route path="/editor" element={<MainApp locale={locale} setLocale={setLocale} onGoHome={handleGoHome} />} />
        <Route path="/markdown-guide" element={<LazyMarkdownGuide />} />
        <Route path="/wechat-style" element={<LazyWechatStyle />} />
        <Route path="/about" element={<LazyAboutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default App;


