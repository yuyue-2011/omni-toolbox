/* 统计官网站点真实总数：core.js CATS 各 cat 的 sites 数组 + sites.js 各分类数组 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
setTimeout(function () {
  var w = dom.window;
  var T = w.Toolbox;
  var cats = T.CATS || [];
  var coreCount = 0, perCat = {};
  cats.forEach(function (c) {
    var n = Array.isArray(c.sites) ? c.sites.length : 0;
    perCat[c.id] = (perCat[c.id] || 0) + n;
    coreCount += n;
  });
  var S = w.SITES || {};
  var siteCount = 0, perSites = {};
  Object.keys(S).forEach(function (k) {
    var n = Array.isArray(S[k]) ? S[k].length : 0;
    perSites[k] = n;
    siteCount += n;
  });
  var out = [];
  out.push('CATS sites 合计: ' + coreCount);
  out.push('SITES(js/sites.js) 合计: ' + siteCount);
  out.push('总计（去重前）: ' + (coreCount + siteCount));
  var all = {};
  cats.forEach(function (c) { (c.sites || []).forEach(function (s) { all[s.u] = (all[s.u] || 0) + 1; }); });
  Object.keys(S).forEach(function (k) { S[k].forEach(function (s) { all[s.u] = (all[s.u] || 0) + 1; }); });
  var dupU = Object.keys(all).filter(function (u) { return all[u] > 1; });
  var uniq = Object.keys(all).length;
  out.push('去重后唯一站点: ' + uniq + '，重复 URL: ' + dupU.length);
  if (dupU.length) out.push('重复: ' + dupU.slice(0, 10).join(', '));
  fs.writeFileSync(root + '/_testlog/sites-count.txt', out.join('\n') + '\n', 'utf8');
  console.log(out.join('\n'));
  process.exit(0);
}, 4000);
