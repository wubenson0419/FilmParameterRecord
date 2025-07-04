const CACHE_NAME = 'film-record-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'style.css', // 假設您的 CSS 樣式是獨立的 style.css 檔案
  'image/myicon.png' // PWA 圖標
];

// 安裝服務工作者並快取所有必要的資產
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 啟用服務工作者並清理舊的快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截網路請求並提供快取內容 (快取優先策略)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有響應，則返回快取響應
        if (response) {
          return response;
        }
        // 否則，從網路獲取請求
        return fetch(event.request).then(
          response => {
            // 檢查響應是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆響應，因為響應流只能被消費一次
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
