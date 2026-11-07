/* 深度交互自检：jsdom 加载页面，对每个工具模拟填输入 / 点按钮，捕获运行时错误 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async function () {
  const dom = new JSDOM(html, {
    url: 'file:///' + path.join(root, 'index.html').replace(/\\/g, '/'),
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.fetch = global.fetch;
      window.AbortController = global.AbortController;
      window.TextEncoder = global.TextEncoder;
      window.TextDecoder = global.TextDecoder;
      window.btoa = function (s) { return Buffer.from(s, 'binary').toString('base64'); };
      window.atob = function (s) { return Buffer.from(s, 'base64').toString('binary'); };
      window.confirm = function () { return false; };
      window.scrollTo = function () {};
      window.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(performance.now()); }, 16); };
      window.cancelAnimationFrame = function (id) { clearTimeout(id); };
      window.alert = function () {};
      /* jsdom 在 file:// (opaque origin) 下不支持 localStorage，注入内存版 */
      var mem = {};
      Object.defineProperty(window, 'localStorage', {
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
      if (window.HTMLCanvasElement && window.HTMLCanvasElement.prototype) {
        window.HTMLCanvasElement.prototype.getContext = function () {
          return { drawImage: function () {}, toDataURL: function () { return 'data:image/png;base64,x'; },
                   fillRect: function () {}, clearRect: function () {}, fillStyle: '', measureText: function () { return { width: 10 }; },
                   getImageData: function (x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4) }; },
                   createLinearGradient: function () { return { addColorStop: function () {} }; },
                   arc: function () {}, beginPath: function () {}, closePath: function () {}, fill: function () {}, stroke: function () {} };
        };
      }
      if (window.HTMLVideoElement && window.HTMLVideoElement.prototype) {
        try { Object.defineProperty(window.HTMLVideoElement.prototype, 'videoWidth', { get: function () { return 320; } }); } catch (e) {}
        try { Object.defineProperty(window.HTMLVideoElement.prototype, 'videoHeight', { get: function () { return 240; } }); } catch (e) {}
      }
    }
  });

  const window = dom.window;
  const errors = [];
  window.addEventListener('error', function (e) {
    var st = (e.error && e.error.stack) ? String(e.error.stack).split('\n').slice(0, 3).join(' <- ') : '';
    errors.push('[err] ' + (e.message || 'unknown') + ' @ ' + window.location.hash + (st ? '\n      ' + st : ''));
  });
  window.addEventListener('unhandledrejection', function (e) {
    var st = (e.reason && e.reason.stack) ? String(e.reason.stack).split('\n').slice(0, 3).join(' <- ') : '';
    errors.push('[rej] ' + window.location.hash + ' ' + (e.reason && e.reason.message ? e.reason.message : String(e.reason)) + (st ? '\n      ' + st : ''));
  });

  await sleep(2500);
  const T = window.Toolbox;
  const doc = window.document;
  const tools = T.allTools();
  let fail = 0;
  let total = 0;

  /* 预填一些典型输入，逐工具点击主按钮 */
  const presets = {
    'json-format': { 'jfIn': '{"a":1,"b":[1,2,3]}' },
    'base64': { 'b64In': 'hello world' },
    'url-codec': { 'urlIn': 'https://example.com/?a=1&b=2' },
    'case-convert': { 'ccIn': 'Hello World Foo Bar' },
    'word-count': { 'wcIn': '床前明月光，疑是地上霜。举头望明月，低头思故乡。' },
    'hash': { 'hashIn': 'hello' },
    'morse': { 'morseIn': 'SOS HELP' },
    'timestamp': { 'tsIn': '1700000000' },
    'percent': { 'pA': '200', 'pB': '50' },
    'bmi': { 'bmiH': '175', 'bmiW': '70' },
    'age': { 'ageD': '1990-01-01' },
    'rmb-upper': { 'rmbIn': '12345.67' },
    'idcard': { 'idIn': '11010519491231002X' },
    'random-num': { 'rnMin': '1', 'rnMax': '100' },
    'password': {},
    'unicode': { 'ucIn': 'Hello 你好' },
    'regex-test': { 'rxPat': '\\d+', 'rxTxt': 'abc123def456' },
    'text-diff': { 'tdA': 'hello world\nfoo bar', 'tdB': 'hello world\nfoo baz' },
    'text-sort': { 'tsIn': 'banana\napple\ncherry\napple' },
    'text-replace': { 'trIn': 'hello world', 'trFrom': 'world', 'trTo': 'there' },
    'text-tools': { 'ttIn': '  Hello   World  ' },
    'base-convert': { 'bcIn': '255' },
    'calc-fuel': { 'fuelKm': '100', 'fuelL': '8', 'fuelPrice': '8' },
    'calc-interest': { 'ciP': '10000', 'ciR': '5', 'ciN': '10' },
    'mortgage': { 'mgTotal': '1000000', 'mgRate': '4.2', 'mgYears': '30' },
    'date-calc': { 'dcA': '2024-01-01', 'dcB': '2024-12-31' },
    'stats': { 'stIn': '1,2,3,4,5,6,7,8,9,10' },
    'word-freq': { 'wfIn': 'the quick brown fox the lazy dog the cat' },
    'qrcode': { 'qrIn': 'https://example.com' },
    'codec-caesar': { 'ccIn2': 'HELLO' },
    'translate': { 'trText': '你好，世界' },
    'unit-convert': { 'ucVal': '1000' }
  };

  for (const t of tools) {
    total++;
    window.location.hash = '#/tool/' + t.id;
    await sleep(60);
    errors.length = 0;
    const host = doc.getElementById('toolHost');
    if (!host) continue;
    const pre = presets[t.id] || {};
    /* 填预设输入 */
    Object.keys(pre).forEach(function (id) {
      const el = doc.getElementById(id);
      if (el) { el.value = pre[id]; el.dispatchEvent(new window.Event('input', { bubbles: true })); }
    });
    /* 点击所有主按钮（btn-primary），每个点一次 */
    const btns = host.querySelectorAll('button.btn-primary, button.btn:not(.btn-ghost):not(.btn-danger)');
    const limit = Math.min(btns.length, 3);
    for (let i = 0; i < limit; i++) {
      try { btns[i].click(); } catch (e) { errors.push('[click] ' + t.id + ': ' + e.message); }
      await sleep(30);
    }
    /* 触发 change 事件（select / input range 等） */
    const sels = host.querySelectorAll('select');
    for (let i = 0; i < Math.min(sels.length, 2); i++) {
      try { sels[i].dispatchEvent(new window.Event('change', { bubbles: true })); } catch (e) {}
      await sleep(20);
    }
    if (errors.length) {
      errors.forEach(function (e) { console.log('FAIL ' + t.id + ' ' + e); });
      fail += errors.length;
    }
  }
  console.log(fail ? '\n深度交互测试失败 ' + fail + ' 项' : '\n深度交互测试全部通过（' + total + ' 款工具逐个填输入 + 点按钮）');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('测试执行异常: ' + e.message); process.exit(1); });
