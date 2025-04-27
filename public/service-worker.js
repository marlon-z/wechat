// 缓存名称和版本
const CACHE_NAME = 'md-editor-cache-v1';

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/imageLoader.js'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
  // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前终止
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('已打开缓存');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('预缓存资源时出错:', error);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除不在白名单中的旧缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 排除不应该被缓存的请求
  if (
    event.request.method !== 'GET' || 
    !event.request.url.startsWith('http')
  ) {
    return;
  }

  // 使用 Cache First 策略，如果缓存中有响应，则使用缓存，否则发送网络请求
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 缓存命中直接返回
        if (response) {
          return response;
        }

        // 如果缓存未命中，从网络获取资源
        return fetch(event.request)
          .then((response) => {
            // 检查是否是有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 在返回响应前复制一份并存入缓存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                // 缓存新的响应
                if (event.request.url.indexOf('/static/') > -1 || 
                    event.request.url.endsWith('.js') || 
                    event.request.url.endsWith('.css') || 
                    event.request.url.endsWith('.png') || 
                    event.request.url.endsWith('.jpg') || 
                    event.request.url.endsWith('.svg')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // 网络请求失败时，如果是HTML文档请求，返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // 对于其他资源，可以返回一个默认的响应
            return new Response('Network error occurred', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-articles') {
    event.waitUntil(syncArticles());
  }
});

// 后台同步函数 - 实现本地数据和服务器的同步
function syncArticles() {
  // 这里实现文章的同步逻辑
  return Promise.resolve();
}

// 推送通知
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/logo192.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // 如果已有打开的窗口，则跳转到该窗口
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        // 否则打开新窗口
        return clients.openWindow('/');
      })
  );
}); 