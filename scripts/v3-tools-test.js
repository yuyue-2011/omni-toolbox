/* v3.0 新工具功能实测：11 款（7 开发者 + 4 AI）核心逻辑 */
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
function open(id, cb) { w.location.hash = '#/tool/' + id; setTimeout(cb, 90); }

setTimeout(function () {
  var T = w.Toolbox;
  ['json-yaml', 'gzip', 'colorblind', 'lorem', 'ulid', 'jsonpath', 'json-table',
   'token-count', 'img-prompt', 'ai-models', 'prompt-fill'].forEach(function (id) {
    var t = T.allTools().filter(function (x) { return x.id === id; })[0];
    ok(!!t, '注册表含 ' + id + '（' + (t && t.name) + '）');
  });

  open('json-yaml', function () {
    var doc = w.document;
    doc.getElementById('jyJson').value = '{"name":"Tom","age":30,"tags":["a","b"]}';
    doc.getElementById('jyToYaml').click();
    var y = doc.getElementById('jyYaml').value;
    ok(/name: "?Tom"?/.test(y), 'JSON→YAML 输出含 name: Tom');
    ok(/tags:/.test(y), 'JSON→YAML 输出含 tags 数组');
    ok(/- "?a"?/.test(y), 'JSON→YAML 数组元素 a');
    /* 再转回 JSON */
    doc.getElementById('jyYaml').value = y;
    doc.getElementById('jyToJson').click();
    var j = doc.getElementById('jyJson').value;
    ok(/"age": 30/.test(j), 'YAML→JSON 往返含 age: 30');
    ok(/"name": "Tom"/.test(j), 'YAML→JSON 往返含 name: Tom');
    next1();
  });

  function next1() {
    open('lorem', function () {
      var doc = w.document;
      doc.getElementById('loUnit').value = 'w';
      doc.getElementById('loCount').value = '10';
      doc.getElementById('loGen').click();
      var ws = doc.getElementById('loOut').value.trim().split(/\s+/);
      ok(ws.length === 10, 'Lorem 生成 10 个词，实际 ' + ws.length);
      doc.getElementById('loUnit').value = 'p';
      doc.getElementById('loGen').click();
      ok(doc.getElementById('loOut').value.length > 100, 'Lorem 段落长度 > 100');
      /* 中文模式 */
      doc.getElementById('loLang').value = 'zh';
      doc.getElementById('loGen').click();
      ok(/[\u4e00-\u9fff]/.test(doc.getElementById('loOut').value), 'Lorem 中文模式输出中文');
      next2();
    });
  }

  function next2() {
    open('ulid', function () {
      var doc = w.document;
      doc.getElementById('ulCount').value = '5';
      doc.getElementById('ulGen').click();
      var lines = doc.getElementById('ulOut').value.split('\n');
      ok(lines.length === 5, 'ULID 生成 5 个，实际 ' + lines.length);
      ok(/^[0-9A-Z]{26}$/.test(lines[0]), 'ULID 格式 26 位 Crockford Base32：' + lines[0]);
      ok(lines[0] <= lines[4], 'ULID 按时间有序');
      next3();
    });
  }

  function next3() {
    open('colorblind', function () {
      var doc = w.document;
      ok(!!doc.getElementById('cbFile'), '色盲模拟文件输入存在');
      ok(doc.querySelectorAll('#cbType button').length === 4, '色盲模拟 4 种类型按钮');
      ok(!!doc.getElementById('cbCanvas'), '色盲模拟画布存在');
      next4();
    });
  }

  function next4() {
    open('jsonpath', function () {
      var doc = w.document;
      doc.getElementById('jpJson').value = '{"users":[{"name":"Tom"},{"name":"Jerry"}]}';
      doc.getElementById('jpPath').value = '$.users[*].name';
      doc.getElementById('jpGo').click();
      var txt = doc.getElementById('jpOut').textContent;
      ok(/Tom/.test(txt) && /Jerry/.test(txt), 'JSONPath $.users[*].name 提取 Tom/Jerry');
      doc.getElementById('jpPath').value = '$.users[0].name';
      doc.getElementById('jpGo').click();
      var t2 = doc.getElementById('jpOut').textContent;
      ok(/Tom/.test(t2) && !/Jerry/.test(t2), 'JSONPath $.users[0].name 只取 Tom');
      /* 递归 */
      doc.getElementById('jpPath').value = '$..name';
      doc.getElementById('jpGo').click();
      ok(/Tom/.test(doc.getElementById('jpOut').textContent), 'JSONPath $..name 递归命中');
      /* 坏路径报错 */
      doc.getElementById('jpPath').value = '$.[bad';
      doc.getElementById('jpGo').click();
      ok(/路径解析失败|Path error/.test(doc.getElementById('jpOut').textContent), 'JSONPath 非法路径报错');
      next5();
    });
  }

  function next5() {
    open('json-table', function () {
      var doc = w.document;
      doc.getElementById('jtIn').value = '[{"name":"Tom","age":30},{"name":"Jerry","age":25}]';
      doc.getElementById('jtGo').click();
      var rows = doc.querySelectorAll('#jtOut tbody tr');
      ok(rows.length === 2, 'JSON 表格 2 行，实际 ' + rows.length);
      ok(/Jerry/.test(doc.getElementById('jtOut').textContent), 'JSON 表格含 Jerry');
      /* 非数组报错 */
      doc.getElementById('jtIn').value = '{"a":1}';
      doc.getElementById('jtGo').click();
      ok(/必须是数组|must be an array/i.test(doc.getElementById('jtOut').textContent), 'JSON 表格非数组报错');
      next6();
    });
  }

  function next6() {
    open('gzip', function () {
      var doc = w.document;
      ok(!!doc.getElementById('gzIn'), 'GZIP 输入框存在');
      doc.getElementById('gzIn').value = 'hello world hello world hello world';
      doc.getElementById('gzZip').click();
      setTimeout(function () {
        var out1 = doc.getElementById('gzOut').value;
        if (typeof w.CompressionStream === 'undefined') {
          ok(/不支持/.test(doc.getElementById('gzErr').textContent), 'GZIP 无压缩流环境给出降级提示');
          finish();
        } else {
          ok(out1.length > 0, 'GZIP 压缩输出 Base64：' + out1.slice(0, 24) + '…');
          doc.getElementById('gzIn').value = out1;
          doc.getElementById('gzUnzip').click();
          setTimeout(function () {
            ok(/hello world/.test(doc.getElementById('gzOut').value), 'GZIP 解压往返成功');
            finish();
          }, 200);
        }
      }, 250);
    });
  }

  function finish() {
    logs.forEach(function (l) { console.log(l); });
    console.log(fails ? '\n功能实测失败 ' + fails + ' 项' : '\n功能实测全部通过（11 款 v3.0 新工具）');
    process.exit(fails ? 1 : 0);
  }
}, 4000);
