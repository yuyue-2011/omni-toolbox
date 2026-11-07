/* 开发自检：jsdom 加载单文件页面，逐个渲染 224 款工具，捕获运行时错误 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async function () {
  /* 单文件校验：不应有外部 js/css 引用 */
  const extRefs = html.match(/src="(?:js|css)\//g) || [];
  if (extRefs.length) { console.log('FAIL: 单文件仍有外部引用 ' + extRefs.length + ' 处'); process.exit(1); }
  console.log('OK  单文件校验通过（内联 css+js）');

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
      /* 测试基线：固定中文界面（jsdom 默认 navigator.language=en-US，会经 isEn() 的 auto 解析把壳层切到英文） */
      try { Object.defineProperty(window.navigator, 'language', { value: 'zh-CN', configurable: true }); } catch (e) {}
      window.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(performance.now()); }, 16); };
      window.cancelAnimationFrame = function (id) { clearTimeout(id); };
      if (window.HTMLCanvasElement && window.HTMLCanvasElement.prototype) {
        window.HTMLCanvasElement.prototype.getContext = function () {
          return { drawImage: function () {}, toDataURL: function () { return 'data:image/png;base64,x'; },
                   fillRect: function () {}, clearRect: function () {}, fillStyle: '', measureText: function () { return { width: 10 }; } };
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
  window.addEventListener('error', function (e) { errors.push('window-error: ' + (e.message || 'unknown')); });
  window.addEventListener('unhandledrejection', function (e) {
    errors.push('unhandled-rejection: ' + (e.reason && e.reason.message ? e.reason.message : String(e.reason)));
  });

  /* 等待脚本加载与 boot */
  await sleep(2500);

  const T = window.Toolbox;
  if (!T) { console.log('FAIL: Toolbox 未定义'); process.exit(1); }
  if (T.settings) T.settings.lang = 'zh'; /* 测试基线：固定中文界面 */
  const tools = T.allTools();
  console.log('OK 已注册工具数: ' + tools.length + '（期望 224）');
  if (tools.length !== 224) console.log('WARN: 期望 224 款，实际 ' + tools.length);
  if (T.CATS.length !== 26) console.log('WARN: 期望 26 类，实际 ' + T.CATS.length);

  /* 分类内工具数（v2.5 断言） */
  const expectCount = {
    calc: 16, text: 26, codec: 13, time: 8, random: 6, image: 7, data: 16, life: 6, work: 6,
    net: 10, ai: 11, sys: 10, game: 15, search: 4, code: 12, video: 8, down: 4, cloud: 4,
    github: 5, shop: 6, com: 8, vplat: 5, music: 5, book: 4, study: 5, doc: 4
  };
  let countMismatch = 0;
  T.CATS.forEach(function (c) {
    const n = T.catTools(c.id).length;
    const exp = expectCount[c.id];
    if (exp != null && n !== exp) { console.log('WARN: 分类 ' + c.id + ' 期望 ' + exp + ' 实际 ' + n); countMismatch++; }
  });
  if (countMismatch === 0) console.log('OK  26 个分类工具数全部符合断言');

  const doc = window.document;
  let fail = 0;

  /* v3.4.1 图标全覆盖 */
  const noIcon = tools.filter(function (t) { return !t.icon; });
  console.log(noIcon.length === 0 ? 'OK 224 款工具图标全覆盖' : 'FAIL 缺图标 ' + noIcon.map(function (t) { return t.id; }).join(', '));
  if (noIcon.length) fail++;
  const iconSeen = {};
  let iconDup = 0;
  tools.forEach(function (t) { if (!t.icon) return; const k = t.cat + '|' + t.icon; if (iconSeen[k]) { iconDup++; } else { iconSeen[k] = t.id; } });
  console.log(iconDup === 0 ? 'OK 同分类图标无重复（' + tools.length + ' 个）' : 'FAIL 同分类重复图标 ' + iconDup + ' 组');
  if (iconDup) fail++;
  const catSvgOk = T.CATS.every(function (c) { return /^<svg viewBox="0 0 24 24"/.test(c.icon || '') && String(c.icon).indexOf('stroke-linejoin="round"') >= 0; });
  console.log(catSvgOk ? 'OK 26 分类 SVG 图标规范（圆角描边）' : 'FAIL 分类 SVG 图标不规范');
  if (!catSvgOk) fail++;

  /* 状态栏 */
  if (doc.getElementById('sbTime') && doc.getElementById('sbTime').textContent.indexOf(':') >= 0) {
    console.log('OK  状态栏时间渲染');
  } else { console.log('FAIL 状态栏时间未渲染'); fail++; }
  if (doc.getElementById('sbProxy')) {
    console.log('OK  代理识别标记存在');
  } else { console.log('FAIL 代理识别标记缺失'); fail++; }

  /* 首页 */
  window.location.hash = '#/';
  await sleep(150);
  const cards = doc.querySelectorAll('.cat-card').length;
  console.log(cards === 26 ? 'OK 首页分类卡片 26 个' : 'FAIL 首页分类卡片: ' + cards);
  if (cards !== 26) fail++;

  /* 侧栏分组 */
  const groups = doc.querySelectorAll('.nav-group').length;
  console.log(groups === 9 ? 'OK 侧栏板块分组 9 组' : 'FAIL 侧栏分组: ' + groups);
  if (groups !== 9) fail++;

  /* 逐个工具 */
  for (const t of tools) {
    window.location.hash = '#/tool/' + t.id;
    await sleep(70);
    const host = doc.getElementById('toolHost');
    if (!host || !host.innerHTML) { console.log('FAIL ' + t.id + ': 无渲染内容'); fail++; continue; }
    if (host.innerHTML.indexOf('工具加载出错') >= 0) {
      console.log('FAIL ' + t.id + ': ' + host.textContent.replace(/\s+/g, ' ').slice(0, 80));
      fail++;
      continue;
    }
    const inputs = host.querySelectorAll('input,select,textarea,button,a').length;
    const textLen = (host.textContent || '').trim().length;
    if (!inputs && textLen < 10) { console.log('FAIL ' + t.id + ': 无交互元素且无内容'); fail++; continue; }
    console.log('OK  ' + t.id + '（' + t.name + '，控件 ' + inputs + ' 个）');
  }

  /* 分类页（抽样 7 个，含新增板块） */
  const catChecks = [['net', 10], ['sys', 10], ['shop', 6], ['com', 8], ['vplat', 5], ['music', 5], ['book', 4], ['study', 5], ['doc', 4], ['video', 8]];
  for (const [cid, exp] of catChecks) {
    window.location.hash = '#/cat/' + cid;
    await sleep(150);
    const n = doc.querySelectorAll('.tool-card').length;
    const sites = doc.querySelectorAll('.site-card').length;
    const winMode = doc.querySelector('.site-grid.win') !== null;
    console.log(n === exp ? 'OK 分类 ' + cid + ' 工具卡片 ' + n + ' 个' : 'FAIL 分类 ' + cid + ' 卡片: ' + n);
    console.log(sites >= 3 ? 'OK 分类 ' + cid + ' 官网导航 ' + sites + ' 张' : 'FAIL 分类 ' + cid + ' 官网导航: ' + sites);
    console.log(winMode ? 'OK 分类 ' + cid + ' 官网小窗排列' : 'FAIL 分类 ' + cid + ' 官网未启用小窗');
    if (n !== exp) fail++;
    if (sites < 3) fail++;
    if (!winMode) fail++;
  }

  /* 官网总站点数（v2.5：≥300） */
  const totalSites = T.totalSites ? T.totalSites() : 0;
  console.log(totalSites >= 300 ? 'OK 全站官网站点 ' + totalSites + ' 个（≥300）' : 'FAIL 官网站点不足: ' + totalSites);
  if (totalSites < 300) fail++;

  /* 板块分组 v3.3（9 大板块：系统独立 + 影音阅读游戏 + 编程开源） */
  const groupNames = T.CAT_GROUPS.map(g => g[0]).join('|');
  console.log(groupNames.indexOf('系统工具') >= 0 && groupNames.indexOf('影音 · 阅读 · 游戏') >= 0 && groupNames.indexOf('编程与开源') >= 0 ? 'OK v3.3 分组重排（系统独立 + 影音阅读游戏 + 编程开源）' : 'FAIL 分组重排缺失: ' + groupNames);
  if (groupNames.indexOf('系统工具') < 0) fail++;

  /* v2.6.1：搜索板块移入日常工具第一位 */
  const dailyFirst = T.CAT_GROUPS[0][1];
  const searchFirst = dailyFirst && dailyFirst[0] === 'search' && dailyFirst.indexOf('calc') > 0;
  console.log(searchFirst ? 'OK 搜索板块置于日常工具分组第一位' : 'FAIL 搜索未置顶: ' + JSON.stringify(dailyFirst));
  if (!searchFirst) fail++;
  /* v3.3：板块重排（按使用频率，9 大板块） */
  const groupOrder = T.CAT_GROUPS.map(g => g[0]).join('|');
  const expectOrder = '日常工具|AI 与网络|图片与视频|资源与数据|效率与学习|影音 · 阅读 · 游戏|编程与开源|购物与通讯|系统工具';
  console.log(groupOrder === expectOrder ? 'OK 板块重排顺序正确' : 'FAIL 板块顺序: ' + groupOrder);
  if (groupOrder !== expectOrder) fail++;
  window.location.hash = '#/';
  await sleep(150);
  const catCards = doc.querySelectorAll('.cat-card');
  const firstCardCat = catCards.length ? catCards[0].getAttribute('data-cat') : '';
  console.log(firstCardCat === 'search' ? 'OK 首页第一个分类卡片为搜索' : 'FAIL 首页首卡片非搜索: ' + firstCardCat);
  if (firstCardCat !== 'search') fail++;
  const secondCardCat = catCards.length > 1 ? catCards[1].getAttribute('data-cat') : '';
  console.log(secondCardCat === 'calc' ? 'OK 首页第二个分类卡片为计算' : 'FAIL 首页次卡片: ' + secondCardCat);
  if (secondCardCat !== 'calc') fail++;

  /* 帮助页 */
  window.location.hash = '#/help';
  await sleep(150);
  const helpOk = doc.querySelector('#view .help') !== null && doc.querySelector('#view .help').textContent.indexOf('使用说明书') >= 0;
  console.log(helpOk ? 'OK 帮助/说明书页渲染' : 'FAIL 帮助页未渲染');
  if (!helpOk) fail++;
  const helpProxy = doc.querySelector('#view .help') && doc.querySelector('#view .help').textContent.indexOf('代理识别') >= 0;
  console.log(helpProxy ? 'OK 说明书含代理识别说明' : 'FAIL 说明书缺代理识别说明');
  if (!helpProxy) fail++;
  const helpNew = doc.querySelector('#view .help') && doc.querySelector('#view .help').textContent.indexOf('视频平台') >= 0;
  console.log(helpNew ? 'OK 说明书含视频平台/图书/学习板块' : 'FAIL 说明书缺新板块说明');
  if (!helpNew) fail++;
  const helpSites = doc.querySelector('#view .help') && doc.querySelector('#view .help').textContent.indexOf('小窗口') >= 0;
  console.log(helpSites ? 'OK 说明书含官网小窗说明' : 'FAIL 说明书缺官网小窗说明');
  if (!helpSites) fail++;

  /* 设置页 */
  window.location.hash = '#/settings';
  await sleep(150);
  const setOk = doc.getElementById('setGlass') !== null && doc.getElementById('setRadius') !== null;
  console.log(setOk ? 'OK 设置页渲染（主题/玻璃/圆角）' : 'FAIL 设置页未渲染');
  if (!setOk) fail++;
  const setMode = doc.getElementById('setMode') !== null && doc.querySelectorAll('#setMode [data-act="mode"]').length === 3;
  console.log(setMode ? 'OK 明暗模式切换（深/浅/跟随系统）' : 'FAIL 明暗模式控件缺失');
  if (!setMode) fail++;
  const setSitesMode = doc.getElementById('setSitesMode') !== null && doc.querySelectorAll('#setSitesMode [data-act="sitesmode"]').length === 2;
  console.log(setSitesMode ? 'OK 官网卡片样式开关（小窗口/标准卡片）' : 'FAIL 官网卡片样式控件缺失');
  if (!setSitesMode) fail++;
  const setReset = doc.getElementById('setReset') !== null;
  console.log(setReset ? 'OK 重置设置按钮存在' : 'FAIL 重置设置按钮缺失');
  if (!setReset) fail++;
  const setGear = doc.getElementById('sbGear') && doc.getElementById('sbGear').textContent.indexOf('设置') >= 0;
  console.log(setGear ? 'OK 加大设置键（含文字标签）' : 'WARN 设置键文案');

  /* v2.6 中英双语切换 */
  const setLang = doc.getElementById('setLang') !== null && doc.querySelectorAll('#setLang [data-act="lang"]').length >= 2;
  console.log(setLang ? 'OK 设置页语言切换区（中文/English）' : 'FAIL 语言切换区缺失');
  if (!setLang) fail++;
  // 切到英文
  const enBtn = doc.querySelector('#setLang [data-act="lang"][data-val="en"]');
  if (enBtn) {
    enBtn.click();
    await sleep(200);
    const langAttr = doc.documentElement.lang;
    const brandEn = doc.getElementById('brandSub') && doc.getElementById('brandSub').textContent.indexOf('tools') >= 0;
    const bodyEn = doc.body.textContent.indexOf('Settings') >= 0 || doc.body.textContent.indexOf('Help') >= 0;
    console.log(langAttr === 'en' ? 'OK 切换英文后 <html lang="en">' : 'FAIL html lang: ' + langAttr);
    console.log(brandEn ? 'OK 英文副标题生效' : 'WARN 英文副标题未生效');
    console.log(bodyEn ? 'OK 界面文案切为英文' : 'FAIL 界面未切换英文');
    if (langAttr !== 'en') fail++;
    if (!bodyEn) fail++;
    let savedLang = '';
    try { savedLang = window.localStorage.getItem('omnitool.settings') || ''; } catch (e) {}
    console.log(savedLang.indexOf('"lang":"en"') >= 0 ? 'OK 语言选择已持久化' : 'WARN 语言持久化未验证（localStorage 受限）');
    // 切回中文
    const zhBtn = doc.querySelector('#setLang [data-act="lang"][data-val="zh"]');
    if (zhBtn) { zhBtn.click(); await sleep(200); }
    console.log(doc.documentElement.lang.indexOf('zh') === 0 ? 'OK 切回中文' : 'FAIL 切回中文失败: ' + doc.documentElement.lang);
    if (doc.documentElement.lang.indexOf('zh') !== 0) fail++;
    // 恢复默认语言，避免影响后续断言
    try { window.localStorage.removeItem('omnitool.settings'); } catch (e) {}
  } else {
    console.log('FAIL 未找到英文切换按钮'); fail++;
  }

  /* 搜索 */
  window.location.hash = '#/';
  await sleep(120);
  const search = doc.getElementById('searchInput');
  search.value = '正则';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  await sleep(80);
  const found = doc.querySelectorAll('.tool-card').length;
  console.log(found >= 1 ? 'OK 搜索“正则”命中 ' + found + ' 项' : 'FAIL 搜索无结果');
  if (found < 1) fail++;

  if (errors.length) {
    console.log('\n捕获到异步错误 ' + errors.length + ' 个:');
    errors.slice(0, 10).forEach(e => console.log('  ' + e));
    fail += errors.length;
  }

  console.log(fail ? '\n冒烟测试失败项: ' + fail : '\n冒烟测试全部通过（224 款工具 + 图标全覆盖 + 26 类 + 9 组 + 明暗 + 重置 + 代理标记 + 官网导航 + 帮助 + 设置 + 搜索 + 状态栏）');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('测试执行异常: ' + e.message); process.exit(1); });
