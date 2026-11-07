/* 验证版本号在界面各处正确显示（动态读取 package.json 版本与实时工具数） */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var pkg = JSON.parse(fs.readFileSync(root + '/package.json', 'utf8'));
var VER = pkg.version;
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, beforeParse: function (window) { window.scrollTo = function () {}; } });
var w = dom.window;
var fails = 0;
function ok(c, m) { console.log((c ? 'OK  ' : 'FAIL ') + m); if (!c) fails++; }

setTimeout(function () {
  ok(html.indexOf('{{VERSION}}') < 0, '产物中无 {{VERSION}} 残留');
  /* 首页 eyebrow */
  var eb = w.document.querySelector('.eyebrow');
  ok(!!eb && eb.textContent.indexOf('v' + VER) >= 0, '首页 eyebrow = ' + (eb && eb.textContent.trim()));
  /* 设置页关于 */
  w.location.hash = '#/settings';
  setTimeout(function () {
    var T = w.Toolbox;
    var n = T ? T.allTools().length : 0;
    var panels = w.document.querySelectorAll('.panel');
    var about = null;
    panels.forEach(function (p) {
      if (p.textContent.indexOf('Omni Toolbox v' + VER) >= 0) about = p;
    });
    ok(!!about, '设置页关于面板显示 v' + VER);
    var sideVer = w.document.querySelector('.side-foot .ver');
    ok(!!sideVer && sideVer.textContent.indexOf('v' + VER) >= 0, '侧栏版本号 = ' + (sideVer && sideVer.textContent.trim()));
    ok(n > 0 && !!about && about.textContent.indexOf(String(n)) >= 0, '关于面板工具数 ' + n);
    console.log(fails ? '\n版本号验证失败 ' + fails + ' 项' : '\n版本号验证全部通过（首页 / 关于 / 侧栏 = v' + VER + '，工具 ' + n + ' 款）');
    process.exit(fails ? 1 : 0);
  }, 4000);
}, 4000);
