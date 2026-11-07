/* 万能工具箱 v3.4.1 · Service Worker：离线缓存（单文件版）
   策略：主文档（index.html / 导航请求）网络优先，保证永远拿到最新版本；
   静态资源（图标 / manifest）缓存优先，离线可用。 */
'use strict';

var CACHE = 'omnitool-v3.4.1';
var CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(CORE).catch(function () { /* 个别资源失败不阻塞安装 */ });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  /* 主文档：网络优先（拿到最新页面，失败再回退缓存） */
  var isDoc = e.request.mode === 'navigate' || url.pathname === '/' ||
    url.pathname.endsWith('/index.html') || url.pathname === './index.html';
  if (isDoc) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return caches.match(e.request).then(function (hit) { return hit || caches.match('./index.html'); }); })
    );
    return;
  }
  /* 其它同源静态资源：缓存优先，后台更新 */
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
