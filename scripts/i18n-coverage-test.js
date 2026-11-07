/* 双语覆盖实测：全部工具都必须有 tool.<id>.name / .desc 且英文非空 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, beforeParse: function (window) { window.scrollTo = function () {}; } });
var w = dom.window;
var tries = 0;
var timer = setInterval(function () {
  tries++;
  var T = w.Toolbox;
  var I18N = w.I18N;
  if (!T || !T.allTools || T.allTools().length < 190 || !I18N) {
    if (tries > 120) { clearInterval(timer); console.log('TIMEOUT'); process.exit(1); }
    return;
  }
  clearInterval(timer);
  var tools = T.allTools();
  var miss = [], empty = [];
  tools.forEach(function (t) {
    var n = I18N['tool.' + t.id + '.name'];
    var d = I18N['tool.' + t.id + '.desc'];
    if (!n) miss.push(t.id + '.name');
    else if (!n[1]) empty.push(t.id + '.name');
    if (!d) miss.push(t.id + '.desc');
    else if (!d[1]) empty.push(t.id + '.desc');
  });
  console.log('工具数: ' + tools.length + '，缺失键: ' + miss.length + '，英文为空: ' + empty.length);
  if (miss.length) console.log('缺失: ' + miss.slice(0, 50).join(', '));
  if (empty.length) console.log('英文空: ' + empty.slice(0, 50).join(', '));
  if (miss.length || empty.length) process.exit(1);
  console.log('OK  ' + tools.length + ' 款工具中英名称/描述齐全');
  process.exit(0);
}, 200);
