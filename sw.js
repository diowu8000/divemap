// DiveMap Service Worker
// 策略：network-first（有網路時永遠抓最新版），只有離線時才退回快取。
// 這樣設計是因為這個專案更新頻繁，絕對不能讓使用者被舊版本卡住看不到更新。

var CACHE_NAME = 'divemap-shell-v1'; // 之後若要強制清舊快取，把版本號改掉即可
var SHELL_FILES = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting(); // 新版 service worker 安裝後立刻生效，不用等使用者關閉所有分頁
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_FILES).catch(function () {
        // 個別檔案抓不到也不影響安裝（例如離線安裝的情境）
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;

  // 只處理同源的 GET 請求（app 本身的檔案）。
  // 外部資源（Leaflet CDN、Esri 地圖圖磚、天氣 API、字型）一律直接放行給瀏覽器自己處理，
  // 不快取——地圖圖磚快取會佔用大量空間，天氣資料快取會給使用者過期資訊。
  var url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then(function (res) {
        var resClone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, resClone); });
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match('./index.html');
        });
      })
  );
});
