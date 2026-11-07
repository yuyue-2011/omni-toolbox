/* 全局状态核查：版本号 / 工具数 / 站点数 / 各文件一致性 */
var fs = require('fs');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/') + '/';
var { JSDOM } = require('jsdom');
var html = fs.readFileSync(root + 'index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
var w = dom.window;
try { fs.mkdirSync(root + '_testlog', { recursive: true }); } catch (e) {}
setTimeout(function () {
  var T = w.Toolbox;
  var L = [];
  L.push('=== 版本号现状 ===');
  ['package.json', 'sw.js', 'js/i18n.js', 'src/index.html', 'README.md'].forEach(function (f) {
    var s = fs.readFileSync(root + f, 'utf8');
    var vers = s.match(/v?\d+\.\d+\.\d+|omnitool-v[\d.]+|version": "[\d.]+/g) || [];
    L.push(f + ': ' + vers.slice(0, 6).join(' | '));
  });
  L.push('');
  L.push('=== 工具/站点真实计数 ===');
  var tools = T.allTools();
  L.push('注册表工具总数: ' + tools.length);
  var byCat = {};
  tools.forEach(function (t) { byCat[t.cat] = (byCat[t.cat] || 0) + 1; });
  L.push(JSON.stringify(byCat));
  var sites = 0, hot = 0;
  T.CATS.forEach(function (c) {
    sites += (c.sites || []).length;
    hot += (c.sites || []).filter(function (s) { return s.h; }).length;
  });
  L.push('站点总数: ' + sites + '（主流 h:1 = ' + hot + '，小众 = ' + (sites - hot) + '）');
  L.push('分类数: ' + T.CATS.length);
  fs.writeFileSync(root + '_testlog/state.log', L.join('\n'), 'utf8');
  process.exit(0);
}, 4000);
