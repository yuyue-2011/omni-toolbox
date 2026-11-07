/* 列出全部工具 id（轮询等待注册完成，时序稳定） */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
var w = dom.window;
var tries = 0;
var timer = setInterval(function () {
  tries++;
  var T = w.Toolbox;
  if (!T || !T.allTools || T.allTools().length < 190) {
    if (tries > 120) { clearInterval(timer); fs.writeFileSync(root + '/_testlog/ids.txt', 'TIMEOUT\n', 'utf8'); process.exit(1); }
    return;
  }
  clearInterval(timer);
  var ids = T.allTools().map(function (t) { return t.id; });
  fs.writeFileSync(root + '/_testlog/ids.txt', ids.length + '\n' + ids.join('\n'), 'utf8');
  process.exit(0);
}, 200);
