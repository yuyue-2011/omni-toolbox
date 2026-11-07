/* 验证收藏功能端到端 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async function () {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const dom = new JSDOM(html, {
    url: 'file:///' + path.join(root, 'index.html').replace(/\\/g, '/'),
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(w) {
      w.fetch = global.fetch; w.scrollTo = () => {};
      w.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);
      w.confirm = () => true; w.alert = () => {};
      /* jsdom 在 file:// (opaque origin) 下不支持 localStorage，注入内存版 */
      var mem = {};
      Object.defineProperty(w, 'localStorage', {
        configurable: true,
        get: function () {
          return {
            getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
            setItem: function (k, v) { mem[k] = String(v); },
            removeItem: function (k) { delete mem[k]; },
            clear: function () { mem = {}; },
            key: function (i) { return Object.keys(mem)[i] || null; },
            get length() { return Object.keys(mem).length; }
          };
        }
      });
    }
  });
  const w = dom.window;
  await sleep(2500);
  const doc = w.document;
  let fail = 0;
  function ck(cond, msg) { console.log((cond ? 'OK  ' : 'FAIL') + ' ' + msg); if (!cond) fail++; }

  /* 1. 首页有收藏区 */
  const secs = doc.querySelectorAll('.section-title h2');
  const names = Array.from(secs).map(function (e) { return e.textContent; });
  ck(names.indexOf('我的收藏') >= 0 || names.indexOf('Favorites') >= 0, '首页含“我的收藏”分区');
  ck(!!doc.querySelector('.empty'), '空收藏时显示引导文案');

  /* 2. 打开工具页，收藏按钮存在 */
  w.location.hash = '#/tool/json-format';
  await sleep(200);
  const favBtn = doc.getElementById('favBtn');
  ck(!!favBtn, '工具页有收藏按钮 ☆');
  ck(favBtn && favBtn.textContent === '☆', '初始未收藏显示 ☆');

  /* 3. 点击收藏 */
  favBtn.click();
  await sleep(150);
  ck(favBtn.classList.contains('on'), '点击后按钮变为已收藏状态');
  ck(favBtn.textContent === '★', '已收藏显示 ★');
  var keys = [];
  for (var i = 0; i < w.localStorage.length; i++) keys.push(w.localStorage.key(i));
  console.log('   localStorage keys: ' + JSON.stringify(keys));
  console.log('   omnitool.favs = ' + w.localStorage.getItem('omnitool.favs'));
  var stored = null;
  try { stored = JSON.parse(w.localStorage.getItem('omnitool.favs') || 'null'); } catch (e) {}
  ck(Array.isArray(stored) && stored.indexOf('json-format') >= 0,
     '收藏已持久化到 localStorage (实际值: ' + JSON.stringify(stored) + ')');

  /* 4. 回首页，收藏区出现卡片 */
  w.location.hash = '#/';
  await sleep(200);
  const favCards = doc.querySelectorAll('.section-title');
  var found = false;
  doc.querySelectorAll('.grid .tool-card').forEach(function (c) { if (c.textContent.indexOf('JSON') >= 0) found = true; });
  ck(found, '首页收藏区出现已收藏工具卡片');

  /* 5. 取消收藏 */
  w.location.hash = '#/tool/json-format';
  await sleep(150);
  doc.getElementById('favBtn').click();
  await sleep(60);
  ck(doc.getElementById('favBtn').textContent === '☆', '再次点击取消收藏');

  console.log(fail ? '\n收藏功能验证失败 ' + fail + ' 项' : '\n收藏功能端到端验证通过');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('异常: ' + e.message); process.exit(1); });
