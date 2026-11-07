/* 站点一致性终检：URL 去重 / 国内优先于国际 / 主流≤12 / 文档计数与注册表一致 */
var fs = require('fs');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var src = fs.readFileSync(root + '/js/core.js', 'utf8');
var lines = src.split('\n');
var fails = 0;
function ok(c, m) { console.log((c ? 'OK  ' : 'FAIL ') + m); if (!c) fails++; }

var cats = [];
var cur = null;
for (var i = 0; i < lines.length; i++) {
  var ln = lines[i];
  var mc = ln.match(/\{ id: '([a-z0-9]+)', name: '([^']*)'/);
  if (mc) { cur = { id: mc[1], name: mc[2], sites: [] }; cats.push(cur); continue; }
  if (cur) {
    var sm = ln.match(/\{ n: "([^"]*)", u: "([^"]*)", g: "([A-Z]+)"(, h: 1)? \}/);
    if (sm) cur.sites.push({ n: sm[1], u: sm[2], g: sm[3], h: !!sm[4] });
    else if (/^\s*\] ?\},?\s*$/.test(ln)) cur = null;
  }
}
cats = cats.filter(function (c) { return c.sites.length; });

var total = 0, totalHot = 0, totalCn = 0, dupN = 0, orderN = 0;
cats.forEach(function (c) {
  var sites = c.sites;
  total += sites.length;
  totalHot += sites.filter(function (s) { return s.h; }).length;
  totalCn += sites.filter(function (s) { return s.g === 'CN'; }).length;
  /* 1) URL 去重 */
  var seen = {};
  sites.forEach(function (s) {
    var key = s.u.replace(/\/+$/, '');
    if (seen[key]) { dupN++; console.log('  重复 [' + c.id + '] ' + s.n + ' <-> ' + seen[key] + ' ' + s.u); }
    else seen[key] = s.n;
  });
  /* 2) 复现 sitesHtml：主流区与小众区都必须国内(CN)优先于国际(INT) */
  var cnFirst = sites.filter(function (s) { return s.g === 'CN'; })
    .concat(sites.filter(function (s) { return s.g !== 'CN'; }));
  var hot = cnFirst.filter(function (s) { return s.h; });
  if (!hot.length) hot = cnFirst.slice(0, Math.min(12, cnFirst.length));
  var hotIds = {};
  hot.forEach(function (s) { hotIds[s.u] = 1; });
  var more = cnFirst.filter(function (s) { return !hotIds[s.u]; });
  var shown = hot.slice(0, 12);
  var restRaw = hot.slice(12).concat(more);
  var rest = restRaw.filter(function (s) { return s.g === 'CN'; })
    .concat(restRaw.filter(function (s) { return s.g !== 'CN'; }));
  if (shown.length > 12) { orderN++; }
  [shown, rest].forEach(function (list, li) {
    var cnLead = 0;
    for (var k = 0; k < list.length; k++) { if (list[k].g === 'CN') cnLead++; else break; }
    var cnAll = list.filter(function (s) { return s.g === 'CN'; }).length;
    if (cnLead < cnAll) {
      orderN++;
      console.log('  排序 [' + c.id + '] ' + (li ? '小众' : '主流') + '区前 ' + cnLead + ' 个 CN，实际共 ' + cnAll + ' 个 CN');
    }
  });
});

ok(cats.length === 26, '分类数 = ' + cats.length + '（期望 26）');
ok(dupN === 0, 'URL 重复 = ' + dupN + ' 处');
ok(orderN === 0, '国内优先于国际 违规 = ' + orderN + ' 处（主流 + 小众全部检查）');
console.log('站点总数: ' + total + '（主流 ' + totalHot + ' / 小众 ' + (total - totalHot) + '，CN ' + totalCn + ' / INT ' + (total - totalCn) + '）');
ok(total === 835, '站点总数 = ' + total + '（期望 835，文档已按此值同步）');

/* 3) 文档与注册表一致 */
var readme = fs.readFileSync(root + '/README.md', 'utf8');
var i18n = fs.readFileSync(root + '/js/i18n.js', 'utf8');
var pkg = JSON.parse(fs.readFileSync(root + '/package.json', 'utf8'));
var manifest = fs.readFileSync(root + '/manifest.webmanifest', 'utf8');
ok(/835 个官网直达站点/.test(readme), 'README 记载 835 站点');
ok(/835 个站点/.test(i18n), 'i18n 帮助页记载 835 站点');
ok(/835 个官网/.test(pkg.description), 'package.json 记载 835 官网');
ok(/835 个官网直达站点/.test(manifest), 'manifest.webmanifest 记载 835 站点');
ok(!/814 个|814 站点|814 个站点|814 sites|815 个|815 站点/.test(readme + i18n + pkg.description + manifest), '文档无把 814/815 当作当前站点数声明的残留');

/* 4) Atria 在 AI 小众区 */
var ai = cats.filter(function (c) { return c.id === 'ai'; })[0];
var atria = ai.sites.filter(function (s) { return /atria/i.test(s.n); });
ok(atria.length === 1 && !atria[0].h, 'Atria 在 AI 小众区: ' + (atria[0] && atria[0].n + ' ' + atria[0].u));
var oc = ai.sites.filter(function (s) { return /^OpenCode/.test(s.n); });
var orr = ai.sites.filter(function (s) { return /^OpenRouter/.test(s.n); });
ok(oc.length === 1 && oc[0].h && oc[0].g === 'INT', 'OpenCode 在 AI 主流区: ' + (oc[0] && oc[0].u));
ok(orr.length === 1 && orr[0].h && orr[0].g === 'INT', 'OpenRouter 在 AI 主流区: ' + (orr[0] && orr[0].u));
ok(ai.sites.length === 83, 'AI 分类站点数 = ' + ai.sites.length + '（期望 83）');

console.log(fails ? '\n站点终检失败 ' + fails + ' 项' : '\n站点终检全部通过');
process.exit(fails ? 1 : 0);
