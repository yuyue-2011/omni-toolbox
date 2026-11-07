/* 捕获 index.html 加载过程中的所有 console 错误 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var { JSDOM, VirtualConsole } = require('jsdom');
var errs = [];
var vc = new VirtualConsole();
vc.on('jsdomError', function (e) { errs.push('jsdomError: ' + e.message + (e.detail && e.detail.stack ? ' @ ' + String(e.detail.stack).split('\n')[1] : '')); });
vc.on('error', function (m) { errs.push('console.error: ' + m); });
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
setTimeout(function () {
  var T = dom.window.Toolbox;
  fs.writeFileSync(root + '/_testlog/load-errors.log',
    '工具数: ' + T.allTools().length + '\n' +
    'json-yaml 存在: ' + !!T.allTools().filter(function (t) { return t.id === 'json-yaml'; }).length + '\n' +
    'more8 ids: ' + ['json-yaml', 'gzip', 'colorblind', 'lorem', 'ulid', 'jsonpath', 'json-table'].filter(function (id) {
      return T.allTools().some(function (t) { return t.id === id; });
    }).join(',') + '\n\n错误(' + errs.length + '):\n' + errs.join('\n'), 'utf8');
  process.exit(0);
}, 2000);
