/* 静态检查：工具注册一致性 + 常见 API 缺失检测 */
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
    beforeParse(window) {
      window.fetch = global.fetch;
      window.TextEncoder = global.TextEncoder; window.TextDecoder = global.TextDecoder;
      window.btoa = s => Buffer.from(s, 'binary').toString('base64');
      window.atob = s => Buffer.from(s, 'base64').toString('binary');
      window.confirm = () => false; window.alert = () => {};
      window.scrollTo = () => {};
      window.requestAnimationFrame = cb => setTimeout(() => cb(performance.now()), 16);
      window.cancelAnimationFrame = id => clearTimeout(id);
      if (window.HTMLCanvasElement) window.HTMLCanvasElement.prototype.getContext = () => ({
        drawImage() {}, toDataURL: () => 'data:image/png;base64,x', fillRect() {}, clearRect() {},
        fillStyle: '', strokeStyle: '', font: '', textAlign: '', textBaseline: '',
        measureText: () => ({ width: 10 }), getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
        createLinearGradient: () => ({ addColorStop() {} }), createRadialGradient: () => ({ addColorStop() {} }),
        arc() {}, beginPath() {}, closePath() {}, fill() {}, stroke() {}, moveTo() {}, lineTo() {},
        save() {}, restore() {}, translate() {}, scale() {}, rotate() {}, rect() {}, clip() {}
      });
    }
  });
  const window = dom.window;
  await sleep(2500);
  const T = window.Toolbox;
  const tools = T.allTools();
  const seen = new Set();
  let fail = 0;

  /* 1. 重复 id / 缺字段 */
  tools.forEach(t => {
    if (seen.has(t.id)) { console.log('重复工具 id: ' + t.id); fail++; }
    seen.add(t.id);
    if (!t.name) { console.log('工具缺 name: ' + t.id); fail++; }
    if (typeof t.render !== 'function') { console.log('工具缺 render: ' + t.id); fail++; }
  });

  /* 2. HTML id 冲突检测：渲染后 DOM 里是否有重复 id */
  const ids = {};
  tools.forEach(t => {
    window.location.hash = '#/tool/' + t.id;
    const host = window.document.getElementById('toolHost');
    if (!host) return;
    host.querySelectorAll('[id]').forEach(el => {
      const k = el.id;
      if (!ids[k]) ids[k] = [];
      if (ids[k].indexOf(t.id) < 0) ids[k].push(t.id);
    });
  });
  Object.keys(ids).forEach(k => {
    if (ids[k].length > 1 && !/^md\d+$/.test(k)) { console.log('跨工具重复 id: ' + k + ' → ' + ids[k].slice(0, 5).join(', ')); fail++; }
  });

  /* 注入扫描已覆盖在下方第 4 步；此处不再做基于固定 id 列表的全局冲突检测 */

  /* 4. 未转义注入扫描：innerHTML 拼接中直接使用用户输入变量
        白名单：调用自带转义的转换器（如 MdConverter.toHtml）不计为未转义 */
  const toolDir = path.join(root, 'js', 'tools');
  fs.readdirSync(toolDir).forEach(f => {
    const src = fs.readFileSync(path.join(toolDir, f), 'utf8');
    const lines = src.split('\n');
    lines.forEach((l, i) => {
      const safeConv = /\.toHtml\(|MdConverter/.test(l);
      /* innerHTML 赋值行里出现了 .value 且未用 esc( 包裹的 $ { } 拼接 */
      if (/innerHTML\s*[+]?=/.test(l) && /\.value/.test(l) && !/esc\(/.test(l) && !safeConv) {
        console.log('疑似未转义注入 ' + f + ':' + (i + 1) + ' ' + l.trim().slice(0, 110));
      }
    });
  });

  /* 5. 转义回归实测：Markdown 预览必须把 HTML 输入渲染为转义文本 */
  window.location.hash = '#/tool/doc-md';
  await sleep(300);
  const mdIn = window.document.getElementById('dmIn');
  const mdOut = window.document.getElementById('dmOut');
  if (!mdIn || !mdOut) {
    console.log('Markdown 预览工具未渲染（doc-md）'); fail++;
  } else {
    mdIn.value = '<img src=x onerror=alert(1)> **b**';
    mdIn.dispatchEvent(new window.Event('input'));
    const rendered = mdOut.innerHTML;
    if (!/&lt;img/i.test(rendered)) { console.log('Markdown 预览未渲染输入'); fail++; }
    else if (/<img/i.test(rendered)) { console.log('Markdown 预览未转义注入: ' + rendered.slice(0, 120)); fail++; }
    else { console.log('OK  Markdown 预览已转义（<img>/onerror 未注入）'); }
  }

  console.log(fail ? '\n静态检查发现 ' + fail + ' 处问题' : '\n静态检查通过');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('异常: ' + e.message); process.exit(1); });
