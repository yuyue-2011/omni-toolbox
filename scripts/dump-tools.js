/* 从构建产物读取真实注册表，生成 README 用的工具清单 markdown 表格
   （轮询等待注册完成，时序稳定） */
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
    if (tries > 120) { clearInterval(timer); console.log('TIMEOUT'); process.exit(1); }
    return;
  }
  clearInterval(timer);
  var list = T.allTools();
  var byCat = {};
  list.forEach(function (t) { (byCat[t.cat] = byCat[t.cat] || []).push(t.name); });
  var order = ['search','calc','text','codec','time','random','image','data','life','work','net','ai','sys','game','code','video','down','cloud','github','shop','com','vplat','music','book','study','doc'];
  var catName = { search:'搜索', calc:'计算', text:'文本', codec:'编码', time:'时间', random:'随机', image:'图片', data:'数据', life:'生活', work:'效率', net:'网络', ai:'AI', sys:'系统', game:'游戏', code:'编程', video:'视频', down:'下载', cloud:'云盘', github:'GitHub', shop:'购物', com:'通讯', vplat:'视频平台', music:'音乐', book:'图书', study:'学习', doc:'文档' };
  var lines = [];
  var total = 0;
  order.forEach(function (c) {
    var arr = byCat[c] || [];
    arr.sort(function (a, b) { return a.localeCompare(b, 'zh'); });
    total += arr.length;
    lines.push('| ' + catName[c] + ' | ' + arr.length + ' | ' + arr.join('、') + ' |');
  });
  var out = '| 分类 | 数量 | 工具 |\n|---|---|---|\n' + lines.join('\n') + '\n\n（合计 ' + total + ' 款 / ' + order.length + ' 类）\n';
  fs.writeFileSync(root + '/_testlog/tools.md', out, 'utf8');
  console.log('tools: ' + total + ' 款，cats: ' + order.length);
  process.exit(0);
}, 200);
