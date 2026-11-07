/* 交付前终检：版本号一致 / 计数正确 / 三端产物 / 关键特性存在 / 无残留 */
var fs = require('fs');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/') + '/';
var fails = 0;
function ok(c, m) { console.log((c ? 'OK  ' : 'FAIL ') + m); if (!c) fails++; }
var pkg = JSON.parse(fs.readFileSync(root + 'package.json', 'utf8'));
ok(pkg.version === '3.4.1', 'package.json version = ' + pkg.version);
var sw = fs.readFileSync(root + 'sw.js', 'utf8');
ok(/omnitool-v3/.test(sw), 'sw.js 缓存号 omnitool-v3');
var idx = fs.readFileSync(root + 'index.html', 'utf8');
var www = fs.readFileSync(root + 'www/index.html', 'utf8');
ok(idx === www, 'www/index.html 与根目录完全一致（' + Math.round(idx.length / 1024 * 10) / 10 + ' KB）');
[['sitesMoreBtn', '更多按钮 id'], ['site-grid-more', '小众站点网格类'], ['ts-batch', '时间戳批量'],
 ['pwd-check', '密码强度检测'], ['b64-file', 'Base64 文件转码'], ['url-params', 'URL 参数解析'],
 ['token-count', 'Token 计数器'], ['img-prompt', 'AI 绘图提示词'], ['ai-models', 'AI 模型速查'],
 ['prompt-fill', '提示词变量填充'], ['json-yaml', 'JSON↔YAML'], ['gzip', 'GZIP 压缩'],
 ['colorblind', '色盲模拟'], ['lorem', 'Lorem 占位'], ['ulid', 'ULID 生成'],
 ['jsonpath', 'JSONPath 查询'], ['json-table', 'JSON 数组转表格'],
 ['naming-case', '命名风格转换'], ['slug', 'URL Slug'], ['html-md', 'HTML 转 Markdown'],
 ['xml-json', 'XML↔JSON'], ['json-ts', 'JSON 转 TypeScript'], ['roman', '罗马数字互转'],
 ['contrast', '颜色对比度'], ['barcode', '条形码生成'], ['nanoid', '短 ID 生成'],
 ['iso-week', 'ISO 周数']
].forEach(function (p) { ok(idx.indexOf(p[0]) >= 0, 'index.html 含 ' + p[1]); });
ok(/json-yaml/.test(idx.replace(/<script[^>]*>/g, '')), '产物内联了新工具源码（json-yaml 标识）');
ok(!/\{\{VERSION\}\}/.test(idx), '产物无 {{VERSION}} 残留');
[['base32', 'Base32 编解码'], ['vigenere', '维吉尼亚密码'], ['railfence', '栅栏密码'], ['cn-number', '中文数字互转'], ['num-en', '数字转英文'], ['gradient', '渐变生成器'], ['crc32', 'CRC32'], ['properties', 'Properties JSON'], ['csv-md', 'CSV Markdown'], ['sudoku', '数独']].forEach(function (p) { ok(idx.indexOf(p[0]) >= 0, 'index.html 含 ' + p[1]); });
[['tetris', '俄罗斯方块'], ['breakout', '打砖块'], ['puzzle15', '数字华容道'], ['tictactoe', '井字棋'], ['guess-num', '猜数字'], ['rps', '猜拳'], ['coin-flip', '抛硬币'], ['score-board', '桌游记分板']].forEach(function (p) { ok(idx.indexOf(p[0]) >= 0, 'index.html 含 ' + p[1]); });
/* v3.4.1 图标体系 */
ok(idx.indexOf('icons/icon-32.png') >= 0, 'index.html 引用 32px 网站图标');
ok(idx.indexOf('icons/icon-180.png') >= 0, 'index.html 引用 180px Apple Touch 图标');
ok(idx.indexOf("icon: '🐍'") >= 0 && idx.indexOf("icon: '🖌️'") >= 0 && idx.indexOf("icon: '🔌'") >= 0, 'index.html 内联新工具图标（🐍/🖌️/🔌）');
ok(/stroke-linecap="round" stroke-linejoin="round"/.test(idx), '分类 SVG 图标统一含圆角描边');
/* src/index.html 每个脚本只引用一次 */
var src = fs.readFileSync(root + 'src/index.html', 'utf8');
['more6.js', 'more7.js', 'more8.js', 'more9.js', 'more10.js'].forEach(function (f) {
  var n = (src.match(new RegExp(f.replace(/\./g, '\\.'), 'g')) || []).length;
  ok(n === 1, 'src/index.html 引用 ' + f + ' 恰好 1 次（实际 ' + n + '）');
});
/* i18n 新词条 */
var i18n = fs.readFileSync(root + 'js/i18n.js', 'utf8');
['cat.moreSites', 'cat.lessSites', 'cat.sitesSub2'].forEach(function (k) {
  ok(i18n.indexOf("'" + k + "'") >= 0, 'i18n 含 ' + k);
});
ok(/835 个站点/.test(i18n), 'i18n 帮助页记载 835 站点');
ok(/224 款/.test(i18n), 'i18n 帮助页提及 224 款');
['日常工具', 'AI 与网络', '图片与视频', '资源与数据', '效率与学习', '影音 · 阅读 · 游戏', '编程与开源', '购物与通讯', '系统工具'].forEach(function (g) {
  ok(i18n.indexOf("'grp." + g + "'") >= 0, 'i18n 含分组词条 grp.' + g);
});
ok(i18n.indexOf("'cat.video.name': ['视频处理'") >= 0, 'i18n 分类更名：视频处理');
ok(i18n.indexOf("'cat.game.desc': ['贪吃蛇 · 2048 · 俄罗斯方块 等 15 款'") >= 0, 'i18n 游戏分类描述更新');
ok(i18n.indexOf('v3.4.1 全图标优化') >= 0, 'i18n 帮助页含 v3.4.1 图标优化词条');
/* 站点数据：主流 ≤12，小众折叠数据存在 */
var core = fs.readFileSync(root + 'js/core.js', 'utf8');
ok(/小众站点/.test(core), 'core.js 含小众站点注释标记');
ok(/MAX_HOT = 12/.test(core), 'core.js 主流上限 MAX_HOT = 12');
ok(/sitesMoreBtn/.test(core), 'core.js 含更多按钮事件绑定');
ok(/opencode\.ai/.test(core) && /openrouter\.ai/.test(core), 'core.js AI 官网含 OpenCode / OpenRouter');
ok(core.indexOf("['AI 与网络', ['ai', 'net']]") >= 0, 'core.js 分组含 AI 与网络（ai → net）');
/* README */
var readme = fs.readFileSync(root + 'README.md', 'utf8');
ok(/# 万能工具箱 v3\.4/.test(readme), 'README 标题 v3.4');
ok(/224 款工具/.test(readme), 'README 记载 224 款');
ok(/835 个官网/.test(readme), 'README 记载 835 站点');
ok(/### v3\.4/.test(readme), 'README 含 v3.4 更新日志');
ok(/### v3\.4\.1/.test(readme), 'README 含 v3.4.1 更新日志');
ok(/\| AI \| 11 \|/.test(readme), 'README 工具表 AI = 11');
ok(/\| 数据 \| 16 \|/.test(readme), 'README 工具表 数据 = 16');
ok(/\| 编码 \| 13 \|/.test(readme), 'README 工具表 编码 = 13');
ok(/\| 视频处理 \| 8 \|/.test(readme), 'README 工具表 视频处理 = 8');
ok(/\| 游戏 \| 15 \|/.test(readme), 'README 工具表 游戏 = 15');
console.log(fails ? '\n终检失败 ' + fails + ' 项' : '\n终检全部通过：v3.4.1 可交付');
process.exit(fails ? 1 : 0);
