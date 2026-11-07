/* v2.9.1 新工具专项实测：4 款差异化工具的核心逻辑 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, {
  runScripts: 'dangerously', pretendToBeVisual: true,
  beforeParse: function (win) {
    /* 测试基线：固定中文界面（jsdom 默认 navigator.language=en-US，isEn() 会解析为英文，中文断言全部失效） */
    try { Object.defineProperty(win.navigator, 'language', { value: 'zh-CN', configurable: true }); } catch (e) {}
    win.scrollTo = function () {};
  }
});
var w = dom.window;
var fails = 0;
var logs = [];
function ok(c, m) { logs.push((c ? 'OK  ' : 'FAIL ') + m); if (!c) fails++; }

setTimeout(function () {
  var T = w.Toolbox;
  ok(!!T, 'Toolbox 已定义');
  var ids = ['ts-batch', 'pwd-check', 'b64-file', 'url-params'];
  ids.forEach(function (id) {
    var t = T.allTools().filter(function (x) { return x.id === id; })[0];
    ok(!!t, '注册表含 ' + id + '（' + (t && t.name) + '）');
  });

  function open(id, cb) {
    w.location.hash = '#/tool/' + id;
    setTimeout(cb, 60);
  }

  /* ---- 时间戳批量转换 ---- */
  open('ts-batch', function () {
    var doc = w.document;
    var ta = doc.getElementById('tbIn');
    ok(!!ta, 'ts-batch 输入框存在');
    ta.value = '1750000000\n1750000000000\n1609459200\n不是时间戳';
    doc.getElementById('tbBtn').click();
    var rows = doc.querySelectorAll('#tbOut tbody tr');
    ok(rows.length === 3, 'ts-batch 转换 3 行（跳过无效），实际 ' + rows.length);
    var dates = doc.getElementById('tbDates').value.split('\n');
    ok(dates.length === 3 && /2021-01-0[12]/.test(dates[2].trim()), 'ts-batch 含 1609459200 结果');
    ok(/2025-06-15/.test(dates[0]), 'ts-batch 秒级 1750000000 = 2025-06-15');
    ok(/已跳过|invalid/i.test(doc.getElementById('tbOut').textContent), 'ts-batch 提示跳过无效行');
    /* 追加当前时间 */
    doc.getElementById('tbNow').click();
    ok(doc.getElementById('tbDates').value.split('\n').length === 4, 'tbNow 追加后 4 行');
    next1();
  });

  function next1() {
    /* ---- 密码强度检测 ---- */
    w.location.hash = '#/tool/pwd-check';
    setTimeout(function () {
      var doc = w.document;
      var inp = doc.getElementById('pcIn');
      ok(!!inp, 'pwd-check 输入框存在');
      inp.value = '123456';
      inp.dispatchEvent(new w.Event('input', { bubbles: true }));
      ok(doc.getElementById('pcEnt').textContent.indexOf('bit') >= 0, 'pwd-check 123456 熵值 = ' + doc.getElementById('pcEnt').textContent);
      ok(/常见密码/.test(doc.getElementById('pcTips').textContent), 'pwd-check 123456 命中常见密码提示');
      var weak = doc.querySelectorAll('#pcBar i.on1').length;
      ok(weak >= 1, 'pwd-check 弱密码亮 1 格强度条');
      inp.value = 'Tr0ub4dor&3xyzABC!';
      inp.dispatchEvent(new w.Event('input', { bubbles: true }));
      var strong = doc.querySelectorAll('#pcBar i.on4').length;
      ok(strong === 4, 'pwd-check 强密码亮 4 格强度条');
      ok(/年|y/.test(doc.getElementById('pcTime').textContent), 'pwd-check 强密码破解时间 = ' + doc.getElementById('pcTime').textContent.trim());
      next2();
    }, 60);
  }

  function next2() {
    /* ---- URL 参数解析 ---- */
    w.location.hash = '#/tool/url-params';
    setTimeout(function () {
      var doc = w.document;
      var inp = doc.getElementById('upIn');
      ok(!!inp, 'url-params 输入框存在');
      doc.getElementById('upSample').click();
      var txt = doc.getElementById('upOut').textContent;
      ok(/example\.com/.test(txt), 'url-params 解析出主机 example.com');
      ok(/万能工具箱/.test(txt), 'url-params 中文参数已解码');
      ok(/"size": "20"/.test(doc.getElementById('upOut').textContent), 'url-params JSON 含 size:20');
      /* 无效 URL 回退 */
      inp.value = 'not a url at all';
      doc.getElementById('upBtn').click();
      ok(/无法解析|Could not parse/.test(doc.getElementById('upOut').textContent), 'url-params 纯文本回退 http 前缀解析');
      next3();
    }, 60);
  }

  function next3() {
    /* ---- Base64 文件转码：解码链路 ---- */
    w.location.hash = '#/tool/b64-file';
    setTimeout(function () {
      var doc = w.document;
      ok(!!doc.getElementById('bfIn'), 'b64-file 解码输入框存在');
      ok(!!doc.getElementById('bfDrop'), 'b64-file 拖放区存在');
      /* 无效输入报错 */
      doc.getElementById('bfIn').value = '!!!不是base64!!!';
      doc.getElementById('bfDl').click();
      ok(/解码失败/.test(doc.getElementById('bfErr').textContent), 'b64-file 无效内容报解码失败');
      /* 合法 base64（"hello"） */
      doc.getElementById('bfIn').value = btoa('hello world');
      doc.getElementById('bfName').value = 'test.txt';
      /* 拦截 blobDownload */
      var saved = null;
      T.blobDownload = function (blob, name) { saved = { blob: blob, name: name }; };
      doc.getElementById('bfDl').click();
      ok(!!saved, 'b64-file 解码触发下载');
      ok(saved && saved.name === 'test.txt', 'b64-file 下载文件名 = test.txt');
      logs.forEach(function (l) { console.log(l); });
      console.log(fails ? '\n新工具专项实测失败 ' + fails + ' 项' : '\n新工具专项实测全部通过（4 款 × 核心逻辑）');
      process.exit(fails ? 1 : 0);
    }, 60);
  }
}, 4000);
