/* v2.9.2 新增 AI 工具专项实测 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
var w = dom.window;
var fails = 0;
var logs = [];
function ok(c, m) { logs.push((c ? 'OK  ' : 'FAIL ') + m); if (!c) fails++; }
function open(id, cb) { w.location.hash = '#/tool/' + id; setTimeout(cb, 70); }

setTimeout(function () {
  var T = w.Toolbox;
  ['token-count', 'img-prompt', 'ai-models', 'prompt-fill'].forEach(function (id) {
    var t = T.allTools().filter(function (x) { return x.id === id; })[0];
    ok(!!t, '注册表含 ' + id + '（' + (t && t.name) + '）');
  });

  /* ---- Token 计数器 ---- */
  open('token-count', function () {
    var doc = w.document;
    var ta = doc.getElementById('tcIn');
    ok(!!ta, 'token-count 输入框存在');
    ta.value = '你好世界，这是一段用于测试 Token 计数器的文本。Hello world.';
    ta.dispatchEvent(new w.Event('input', { bubbles: true }));
    var tok = doc.getElementById('tcToken').textContent;
    var ch = doc.getElementById('tcChar').textContent;
    ok(/\d/.test(tok), 'token-count 估算 Token = ' + tok);
    ok(/[3-9]\d/.test(ch), 'token-count 字符数 = ' + ch);
    ok(/%/.test(doc.getElementById('tcCtx').textContent), 'token-count 上下文占比已计算');
    doc.getElementById('tcRule').value = 'zh';
    doc.getElementById('tcRule').dispatchEvent(new w.Event('change', { bubbles: true }));
    ok(doc.getElementById('tcToken').textContent !== '-', 'token-count 切换口径后重算');
    next1();
  });

  function next1() {
    /* ---- AI 绘图提示词 ---- */
    open('img-prompt', function () {
      var doc = w.document;
      ok(!!doc.getElementById('ipIn'), 'img-prompt 主体输入框存在');
      ok(doc.querySelectorAll('#ipStyle button').length === 8, 'img-prompt 8 种风格');
      ok(doc.querySelectorAll('#ipLight button').length === 6, 'img-prompt 6 种光线');
      doc.getElementById('ipIn').value = '一只橘猫坐在窗台上看雨';
      doc.getElementById('ipGen').click();
      var out1 = doc.getElementById('ipOut').textContent;
      ok(/photorealistic|anime|oil/i.test(out1), 'img-prompt 含风格词');
      ok(/lighting|hour|neon/i.test(out1), 'img-prompt 含光线词');
      ok(/masterpiece|best quality/i.test(out1), 'img-prompt 含质量词');
      var mj = doc.getElementById('ipMj').textContent;
      ok(/--ar 16:9/.test(mj), 'img-prompt MJ 版含 --ar 16:9');
      ok(/--v 6/.test(mj), 'img-prompt MJ 版含 --v 6');
      /* 空输入提示 */
      doc.getElementById('ipIn').value = '';
      doc.getElementById('ipGen').click();
      /* 切换风格 */
      doc.querySelectorAll('#ipStyle button')[2].click();
      doc.getElementById('ipIn').value = 'a cat';
      doc.getElementById('ipGen').click();
      ok(/oil painting/i.test(doc.getElementById('ipOut').textContent), 'img-prompt 切换油画风格生效');
      next2();
    }, 70);
  }

  function next2() {
    /* ---- AI 模型速查 ---- */
    open('ai-models', function () {
      var doc = w.document;
      var rows = doc.querySelectorAll('#app .kv tbody tr, .panel .kv tbody tr');
      ok(rows.length >= 10, 'ai-models 表格行数 = ' + rows.length);
      var txt = doc.querySelector('.panel').textContent;
      ok(/DeepSeek/.test(txt), 'ai-models 含 DeepSeek');
      ok(/GPT/.test(txt), 'ai-models 含 GPT');
      ok(/Claude/.test(txt), 'ai-models 含 Claude');
      ok(/上下文|Context/.test(txt), 'ai-models 含上下文列');
      next3();
    }, 70);
  }

  function next3() {
    /* ---- 提示词变量填充 ---- */
    open('prompt-fill', function () {
      var doc = w.document;
      ok(!!doc.getElementById('pfTmpl'), 'prompt-fill 模板框存在');
      /* 默认模板有 4 个变量 */
      doc.getElementById('pfParse').click();
      var varInputs = doc.querySelectorAll('#pfVars input');
      ok(varInputs.length === 4, 'prompt-fill 解析出 4 个变量，实际 ' + varInputs.length);
      /* 填入变量值 */
      var keys = ['语气', '产品', '字数', '人群'];
      var vals = ['幽默', '万能工具箱', '100', '大学生'];
      keys.forEach(function (k, i) {
        var inp = doc.getElementById('pfV' + i);
        if (inp) { inp.value = vals[i]; inp.dispatchEvent(new w.Event('input', { bubbles: true })); }
      });
      var result = doc.getElementById('pfOut').textContent;
      ok(/幽默/.test(result), 'prompt-fill 填入「幽默」');
      ok(/大学生/.test(result), 'prompt-fill 填入「大学生」');
      ok(!/【/.test(result), 'prompt-fill 无未填充占位符');
      /* 无变量模板 */
      doc.getElementById('pfTmpl').value = '这段话没有变量';
      doc.getElementById('pfParse').click();
      ok(/未发现变量|No placeholders/i.test(doc.getElementById('pfVars').textContent), 'prompt-fill 无变量时提示');
      logs.forEach(function (l) { console.log(l); });
      console.log(fails ? '\nAI 新工具实测失败 ' + fails + ' 项' : '\nAI 新工具专项实测全部通过（4 款）');
      process.exit(fails ? 1 : 0);
    }, 70);
  }
}, 4000);
