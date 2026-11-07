/* 全量扫描注册表中的重名工具（同名不同 id）与同 id 情况 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
setTimeout(function () {
  var T = dom.window.Toolbox;
  var list = T.allTools();
  var byName = {}, byId = {};
  list.forEach(function (t) {
    (byName[t.name] = byName[t.name] || []).push(t.id + '/' + t.cat);
    (byId[t.id] = byId[t.id] || []).push(t.name);
  });
  var dupNames = 0;
  Object.keys(byName).forEach(function (n) {
    if (byName[n].length > 1) { console.log('同名: ' + n + ' -> ' + byName[n].join(', ')); dupNames++; }
  });
  var dupIds = 0;
  Object.keys(byId).forEach(function (i) {
    if (byId[i].length > 1) { console.log('同 id: ' + i + ' -> ' + byId[i].join(', ')); dupIds++; }
  });
  var seen = {};
  list.forEach(function (t) { seen[t.cat] = (seen[t.cat] || 0) + 1; });
  console.log('统计: ' + list.length + ' 款工具，重名 ' + dupNames + ' 组，重 id ' + dupIds + ' 组');
  process.exit(0);
}, 3500);
