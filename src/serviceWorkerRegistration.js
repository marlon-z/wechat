// 检查浏览器是否支持 Service Worker
const isServiceWorkerSupported = 'serviceWorker' in navigator;

export function register() {
  if (isServiceWorkerSupported && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      registerValidSW(swUrl);
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // 注册成功
      console.log('Service Worker 注册成功:', registration);

      // 更新检查
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 已安装新版本的Service Worker
              console.log('新版本的Service Worker已安装，将在下次加载时生效');
            } else {
              // 首次安装Service Worker
              console.log('内容已被缓存以供离线使用');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Service Worker 注册失败:', error);
    });
}

export function unregister() {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error('Service Worker 注销失败:', error);
      });
  }
} 