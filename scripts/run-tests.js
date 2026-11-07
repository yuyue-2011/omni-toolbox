/* 运行 smoke/deep 测试并把输出写到项目内 _testlog（UTF-8），供外层读取 */
var { execFileSync } = require('child_process');
var fs = require('fs');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var log = root + '/_testlog';
try { fs.mkdirSync(log, { recursive: true }); } catch (e) {}
function run(script, name) {
  try {
    var out = execFileSync('node', [script], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1024 * 1024 * 32 });
    fs.writeFileSync(log + '/' + name + '.log', out, 'utf8');
  } catch (e) {
    fs.writeFileSync(log + '/' + name + '.log', (e.stdout || '') + '\n[EXIT ' + (e.status || '?') + ']\n' + (e.stderr || ''), 'utf8');
  }
  var st = fs.statSync(log + '/' + name + '.log');
  console.log(name + ': ' + st.size + ' bytes');
}
run('scripts/smoke-test.js', 'smoke');
run('scripts/deep-test.js', 'deep');
run('scripts/ui-fix-test.js', 'ui-fix');
console.log('done');
