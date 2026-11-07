/* 导出当前所有分类的官网清单，便于规划扩充 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
var w = dom.window;
setTimeout(function () {
  var T = w.Toolbox;
  var out = [];
  var total = 0;
  T.CATS.forEach(function (c) {
    var n = (c.sites || []).length;
    total += n;
    out.push('[' + c.id + '] ' + c.name + ' —— ' + n + ' 站');
    (c.sites || []).forEach(function (s) {
      out.push('    ' + (s.h ? 'HOT ' : '    ') + s.n + ' | ' + s.u + ' | ' + s.g);
    });
  });
  out.push('\n合计 ' + total + ' 站');
  fs.writeFileSync(root + '/_testlog/sites-before.md', out.join('\n'), 'utf8');
  console.log('合计 ' + total + ' 站，写入 _testlog/sites-before.md');
  process.exit(0);
}, 4000);
