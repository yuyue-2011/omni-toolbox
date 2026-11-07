/* 实测新增设置项：字号滑块 / 动效开关 / 新主题切换 是否渲染并生效 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, beforeParse: function (window) { window.scrollTo = function () {}; } });
var w = dom.window;
var fails = 0;
function ok(cond, msg) { console.log((cond ? 'OK  ' : 'FAIL ') + msg); if (!cond) fails++; }
setTimeout(function () {
  var T = w.Toolbox;
  ok(!!T, 'Toolbox 已定义');
  /* 打开设置页 */
  w.location.hash = '#/settings';
  setTimeout(function () {
    var doc = w.document;
    var fs1 = doc.getElementById('setFontScale');
    var mo = doc.getElementById('setMotion');
    ok(!!fs1, '字号滑块 setFontScale 存在 (min=' + (fs1 && fs1.min) + ' max=' + (fs1 && fs1.max) + ' val=' + (fs1 && fs1.value) + ')');
    ok(!!mo, '动效开关 setMotion 存在 (on=' + mo.classList.contains('on') + ')');
    ok(!!doc.querySelector('[data-act="theme"][data-val="violet"]'), '紫罗兰主题色卡存在');
    ok(!!doc.querySelector('[data-act="theme"][data-val="cyber"]'), '赛博朋克主题色卡存在');
    ok(!!doc.querySelector('[data-act="theme"][data-val="amber"]'), '琥珀暖橙主题色卡存在');
    ok(!!doc.querySelector('[data-act="theme"][data-val="ocean"]'), '海洋蓝主题色卡存在');
    /* CSS 中 body 的 zoom 规则存在（jsdom 不计算 zoom，改读样式表） */
    var sheets = doc.styleSheets, zoomRule = '';
    for (var si = 0; si < sheets.length; si++) {
      try {
        var rs = sheets[si].cssRules;
        for (var sj = 0; sj < rs.length; sj++) {
          if (rs[sj].selectorText === 'body' && rs[sj].style && rs[sj].style.zoom) zoomRule = rs[sj].style.zoom;
        }
      } catch (e) {}
    }
    ok(zoomRule === 'var(--font-scale,100%)', 'CSS body zoom 规则 = ' + zoomRule);
    ok(w.getComputedStyle(doc.body).fontSize === '15px', '默认 body font-size=15px（实际 ' + w.getComputedStyle(doc.body).fontSize + '）');
    /* 调字号到 140 */
    fs1.value = '140';
    fs1.dispatchEvent(new w.Event('input', { bubbles: true }));
    ok(T.settings.fontScale === 140, 'fontScale 已持久化 = ' + T.settings.fontScale);
    ok(w.getComputedStyle(doc.documentElement).getPropertyValue('--font-scale').trim() === '140%', '根元素 --font-scale=140%');
    /* 关动效 */
    mo.click();
    ok(T.settings.motion === false, 'motion 关闭后持久化 = false');
    ok(doc.body.classList.contains('no-motion'), 'body 带 no-motion 类');
    ok(mo.classList.contains('on') === false, '开关 UI 已关闭');
    /* 切赛博朋克主题 */
    var cyber = doc.querySelector('[data-act="theme"][data-val="cyber"]');
    cyber.click();
    ok(T.settings.theme === 'cyber', 'theme=cyber');
    ok(doc.documentElement.getAttribute('data-theme') === 'cyber', 'data-theme=cyber');
    var bg = w.getComputedStyle(doc.documentElement).getPropertyValue('--bg').trim();
    ok(bg === '#0A0E1A', 'cyber --bg=#0A0E1A（实际 ' + bg + '）');
    var ac = w.getComputedStyle(doc.documentElement).getPropertyValue('--accent').trim();
    ok(ac === '#00E5C0', 'cyber --accent=#00E5C0（实际 ' + ac + '）');
    /* 切紫罗兰主题 */
    doc.querySelector('[data-act="theme"][data-val="violet"]').click();
    var bgv = w.getComputedStyle(doc.documentElement).getPropertyValue('--bg').trim();
    ok(bgv === '#160F26', 'violet --bg=#160F26（实际 ' + bgv + '）');
    var acv = w.getComputedStyle(doc.documentElement).getPropertyValue('--accent').trim();
    ok(acv === '#B388FF', 'violet --accent=#B388FF（实际 ' + acv + '）');
    /* 重置设置应恢复 fontScale/motion */
    var rst = doc.getElementById('setReset');
    w.confirm = function () { return true; };
    rst.click();
    ok(T.settings.fontScale === 100, '重置后 fontScale=100（实际 ' + T.settings.fontScale + '）');
    ok(T.settings.motion === true, '重置后 motion=true（实际 ' + T.settings.motion + '）');
    ok(doc.body.classList.contains('no-motion') === false, '重置后无 no-motion');
    /* 设置页重渲染后控件仍在 */
    var fs2 = doc.getElementById('setFontScale');
    ok(!!fs2 && fs2.value === '100', '重置后滑块重新渲染 value=100');
    /* 帮助页 v3.4.1 文案 */
    w.location.hash = '#/help';
    setTimeout(function () {
      var txt = doc.body.textContent;
      ok(txt.indexOf('v3.4.1 更新内容') >= 0, '帮助页含「v3.4.1 更新内容」');
      ok(txt.indexOf('紫罗兰') >= 0, '帮助页含新主题「紫罗兰」');
      ok(txt.indexOf('224') >= 0, '帮助页提及 224 款');
      ok(txt.indexOf('835') >= 0, '帮助页提及 835 站点');
      console.log(fails ? '\n设置实测失败 ' + fails + ' 项' : '\n新增设置项实测全部通过');
      process.exit(fails ? 1 : 0);
    }, 4000);
  }, 4000);
}, 4000);
