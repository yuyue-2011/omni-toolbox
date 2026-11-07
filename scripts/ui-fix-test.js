/* 回归测试：移动端布局 / 工具页操作按钮 / 火星文 / 设置持久化
   说明：jsdom 不计算真实布局，这里校验关键 DOM 结构与 CSS 规则；
   实际像素布局已通过 Chromium 多宽度验证。 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css', 'app.css'), 'utf8');
let fails = 0;
function ok(cond, msg) { console.log((cond ? 'OK  ' : 'FAIL ') + msg); if (!cond) fails++; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async function () {
  /* 关键 CSS 规则 */
  ok(css.includes('padding-top:calc(var(--sb-h,44px) + var(--topbar-h,67px))'), '主内容避开“状态栏 + 顶栏”');
  ok(/@media \(max-width:899px\)\{[\s\S]*?\.topbar\{left:0;/.test(css), '移动端顶栏贴住视口左侧');
  ok(css.includes('body.hide-statusbar .main{padding-top:var(--topbar-h,67px)}'), '隐藏状态栏后主内容仍避开顶栏');
  ok(css.includes('flex-wrap:wrap;align-items:flex-start'), '工具页标题行允许在窄屏换行');
  ok(css.includes('.lang-seg { flex-wrap: wrap; max-width: 100%; min-width: 0; }'), '语言选择器限制在面板宽度内');
  ok(css.includes('#sbIp{display:none}') && css.includes('#sbGeo{display:none}'), '窄屏状态栏会隐藏溢出项');

  const dom = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.localStorage.setItem('omnitool.settings', JSON.stringify({
        fontScale: 140, motion: false, theme: 'violet', mode: 'dark', statusbar: true, lang: 'zh'
      }));
      window.fetch = function () { return Promise.reject(new Error('offline')); };
      window.scrollTo = function () {};
    }
  });
  const w = dom.window;
  const d = w.document;
  await sleep(2500);

  const T = w.Toolbox;
  ok(!!T, 'Toolbox 已定义');
  if (!T) { process.exit(1); }

  /* 设置持久化：fontScale / motion 曾经没有从 localStorage 读回 */
  ok(T.settings.fontScale === 140, '重新加载后字号设置保留（fontScale=140）');
  ok(T.settings.motion === false, '重新加载后动效设置保留（motion=false）');
  ok(d.documentElement.style.getPropertyValue('--font-scale') === '140%', '根元素恢复 --font-scale=140%');
  ok(d.body.classList.contains('no-motion'), '重新加载后仍关闭动效');
  ok(d.documentElement.getAttribute('data-theme') === 'violet', '重新加载后主题保留');

  /* 工具页：收藏 / 分享按钮在标题行内，不再掉到面板上 */
  w.location.hash = '#/tool/mars-text';
  await sleep(600);
  const actions = d.querySelector('.tool-actions');
  const titleRow = d.querySelector('.tool-title-row');
  ok(!!actions && !!titleRow, '工具页标题行与操作按钮存在');
  ok(!!actions && actions.parentNode === titleRow, '收藏 / 分享按钮位于标题行内');
  ok(!!d.querySelector('.tool-title-row #favBtn') && !!d.querySelector('.tool-title-row #shareBtn'), '收藏 / 分享按钮仍保留原 ID');
  ok(!!d.querySelector('.tool-title-main'), '工具标题正文有可收缩容器');

  /* 火星文转换 */
  const input = d.getElementById('mtIn');
  const out = d.getElementById('mtOut');
  const convert = d.getElementById('mtBtn');
  const clear = d.getElementById('mtClear');
  ok(!!input && !!out && !!convert && !!clear, '火星文输入 / 转换 / 清空 / 输出控件齐全');
  input.value = '你好，我喜欢你！';
  convert.click();
  ok(out.value === '沵恏，涐囍歡袮！', '火星文转换结果正确（' + out.value + '）');
  ok(out.readOnly, '结果框为只读，避免误改');
  clear.click();
  ok(input.value === '' && out.value === '', '清空按钮同时清空输入和结果');
  convert.click();
  ok(d.getElementById('toast').textContent.indexOf('请先输入') >= 0, '空输入转换会给出提示');

  /* 设置页：语言选择器仍在 set-row 内 */
  w.location.hash = '#/settings';
  await sleep(600);
  const lang = d.querySelector('.lang-seg');
  ok(!!lang && !!lang.closest('.set-row'), '语言选择器位于设置行内');
  ok(!!lang && lang.querySelectorAll('button').length === 10, '语言选择器包含全部 10 种选项');

  console.log(fails ? '\n界面修复回归测试失败 ' + fails + ' 项' : '\n界面修复回归测试全部通过');
  process.exit(fails ? 1 : 0);
})();
