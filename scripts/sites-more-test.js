/* 官网「3 行主流 + 更多按钮」实测 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
var w = dom.window;
var fails = 0;
function ok(c, m) { console.log((c ? 'OK  ' : 'FAIL ') + m); if (!c) fails++; }

setTimeout(function () {
  var T = w.Toolbox;
  ok(!!T, 'Toolbox 已定义');
  var totalSites = 0, totalHot = 0;
  T.CATS.forEach(function (c) { totalSites += (c.sites || []).length; });
  console.log('全站站点总数: ' + totalSites);

  function checkCat(id) {
    w.location.hash = '#/cat/' + id;
    return new Promise(function (res) {
      setTimeout(function () {
        var doc = w.document;
        var shown = doc.querySelectorAll('.site-grid:not(.site-grid-more) .site-card').length;
        var btn = doc.getElementById('sitesMoreBtn');
        var grid = doc.getElementById('siteGridMore');
        var less = doc.getElementById('sitesLessBtn');
        var hasBtn = !!btn;
        var hiddenCount = grid ? grid.querySelectorAll('.site-card').length : 0;
        ok(shown <= 12, '[' + id + '] 主流展示 ' + shown + ' 张（≤12，3 行）');
        ok(hasBtn === (hiddenCount > 0), '[' + id + '] 更多按钮存在性 = ' + hasBtn + '（小众 ' + hiddenCount + ' 张）');        if (btn) {
          var lbl = btn.querySelector('.sm-label').textContent;
          ok(/\d+/.test(lbl), '[' + id + '] 按钮文案含数字: ' + lbl.trim());
          /* 关键断言：计算样式必须真的为 none（v3.0.1 修复） */
          var disp0 = w.getComputedStyle(grid).display;
          ok(disp0 === 'none', '[' + id + '] 折叠时计算 display = ' + disp0);
          ok(w.getComputedStyle(btn).display !== 'none', '[' + id + '] 更多按钮可见');
          ok(w.getComputedStyle(less).display === 'none', '[' + id + '] 收起按钮隐藏');
          /* 点击展开 */
          btn.click();
          ok(!grid.hidden, '[' + id + '] 点击后小众网格显示');
          ok(!less.hidden, '[' + id + '] 收起按钮显示');
          ok(w.getComputedStyle(grid).display !== 'none', '[' + id + '] 展开后计算 display = ' + w.getComputedStyle(grid).display);
          ok(w.getComputedStyle(btn).display === 'none', '[' + id + '] 展开后更多按钮隐藏');
          ok(/小众|niche/i.test(doc.body.textContent), '[' + id + '] 展开后内容含小众站点');
          /* 收起 */
          less.click();
          ok(grid.hidden, '[' + id + '] 收起后小众网格隐藏');
          ok(!btn.hidden, '[' + id + '] 收起后更多按钮恢复');
          ok(w.getComputedStyle(grid).display === 'none', '[' + id + '] 收起后计算 display = ' + w.getComputedStyle(grid).display);
        }
        res();
      }, 90);
    });
  }

  var ids = ['search', 'calc', 'ai', 'sys', 'book', 'study', 'doc', 'net', 'game'];
  var p = Promise.resolve();
  ids.forEach(function (id) { p = p.then(function () { return checkCat(id); }); });
  p.then(function () {
    console.log(fails ? '\n官网「更多」实测失败 ' + fails + ' 项' : '\n官网「3 行主流 + 更多按钮」实测全部通过');
    process.exit(fails ? 1 : 0);
  });
}, 4000);
