/* 一键跑完整测试链：check + static + smoke + deep + settings + 界面修复回归 */
var { execFileSync } = require('child_process');
var fs = require('fs');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var steps = [
  ['scripts/check.js', 'check（全部 JS 语法）'],
  ['scripts/static-check.js', 'static-check（注入/id 冲突）'],
  ['scripts/smoke-test.js', 'smoke-test（渲染）'],
  ['scripts/deep-test.js', 'deep-test（逐工具交互）'],
  ['scripts/settings-test.js', 'settings-test（新设置项实测）'],
  ['scripts/new-tools-test.js', 'new-tools-test（v2.9.1 四款）'],
  ['scripts/ai-tools-test.js', 'ai-tools-test（4 款 AI 工具）'],
  ['scripts/v3-tools-test.js', 'v3-tools-test（11 款 v3.0 新工具）'],
  ['scripts/sites-more-test.js', 'sites-more-test（官网「更多」实测）'],
  ['scripts/sites-final-test.js', 'sites-final-test（站点去重 / 国内优先 / 计数）'],
  ['scripts/dup-check.js', 'dup-check（重名/id 检查）'],
  ['scripts/i18n-coverage-test.js', 'i18n-coverage-test（双语覆盖）'],
  ['scripts/game-test.js', 'game-test（15 款游戏 + 修复回归）'],
  ['scripts/ui-fix-test.js', 'ui-fix-test（布局 / 按钮 / 火星文 / 设置持久化）']
];
var out = [];
var failed = [];
try { fs.mkdirSync(root + '/_testlog', { recursive: true }); } catch (e) {}
steps.forEach(function (s) {
  var res;
  try {
    var o = execFileSync('node', [s[0]], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1024 * 1024 * 64 });
    res = { name: s[1], exit: 0, tail: o.trim().split('\n').slice(-3).join('\n') };
  } catch (e) {
    res = { name: s[1], exit: e.status, tail: ((e.stdout || '') + (e.stderr || '')).trim().split('\n').slice(-5).join('\n') };
  }
  if (res.exit !== 0) failed.push(s[1]);
  out.push('=== ' + res.name + ' [exit ' + res.exit + '] ===');
  out.push(res.tail);
});
fs.writeFileSync(root + '/_testlog/final.log', out.join('\n\n') + '\n', 'utf8');
console.log(out.join('\n\n'));
if (failed.length) {
  console.log('\n!!! 测试链失败：' + failed.join(' / '));
  process.exit(1);
}
