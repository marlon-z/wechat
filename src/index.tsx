import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// 优化初始渲染
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 禁用StrictMode以减少开发环境中的重复渲染
root.render(
  <App />
);

// 启用性能监控
reportWebVitals(console.log);

// 注册Service Worker以支持离线访问和性能优化
serviceWorkerRegistration.register();
