/* 包装：跑指定测试脚本，把输出写入 _testlog/<name>.log（UTF-8） */
var { execFileSync } = require('child_process');
var fs = require('fs');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var script = process.argv[2];
var name = process.argv[3] || script.replace(/^.*[\\/]/, '').replace(/\.js$/, '');
try { fs.mkdirSync(root + '/_testlog', { recursive: true }); } catch (e) {}
try {
  var out = execFileSync('node', [script], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1024 * 1024 * 32 });
  fs.writeFileSync(root + '/_testlog/' + name + '.log', out, 'utf8');
  process.exitCode = 0;
} catch (e) {
  fs.writeFileSync(root + '/_testlog/' + name + '.log', (e.stdout || '') + '\n[EXIT ' + (e.status || '?') + ']\n' + (e.stderr || ''), 'utf8');
  process.exitCode = e.status || 1;
}
