/* ============================================================
   万能工具箱 · 计算类工具（8 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 科学计算器 ============ */
  T.register({
    id: 'sci-calc', icon: '🧮', cat: 'calc', name: '科学计算器',
    desc: '标准四则 + 三角函数、对数、阶乘、括号运算',
    keywords: 'calculator 计算 函数 sin cos tan log sqrt',
    render: function (host) {
      host.innerHTML =
      '<div class="panel" style="max-width:560px">' +
        '<style>' +
        '.calc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}' +
        '.calc-grid .btn{min-height:52px;font-size:17px;font-weight:500;font-family:var(--mono)}' +
        '.calc-grid .btn.op{background:var(--card-2);border:1px solid var(--line)}' +
        '.calc-grid .btn.fn{font-size:13.5px;background:var(--bg-soft);border:1px solid var(--line-soft);color:var(--ink-dim)}' +
        '.calc-grid .btn.eq{background:var(--accent);color:var(--accent-ink)}' +
        '.calc-grid .btn.clr{background:rgba(242,109,109,.14);color:var(--err);border:1px solid rgba(242,109,109,.3)}' +
        '</style>' +
        '<div class="field"><input id="scExpr" class="calc-input" readonly placeholder="0" style="font-family:var(--mono);font-size:24px;text-align:right;height:56px;background:var(--bg-soft);border:1px solid var(--line);border-radius:10px;padding:0 14px;width:100%"></div>' +
        '<div class="out" id="scResult" style="margin-bottom:14px;min-height:34px;font-size:16px;color:var(--ink-dim)">' + L('输入表达式，实时计算结果', 'Type an expression, live result below') + '</div>' +
        '<div class="calc-grid">' +
          '<button class="btn fn" data-k="sin(">sin</button><button class="btn fn" data-k="cos(">cos</button><button class="btn fn" data-k="tan(">tan</button><button class="btn fn" data-k="sqrt(">√</button>' +
          '<button class="btn fn" data-k="ln(">ln</button><button class="btn fn" data-k="log(">log</button><button class="btn fn" data-k="^">x^y</button><button class="btn fn" data-k="!">n!</button>' +
          '<button class="btn fn" data-k="pi">π</button><button class="btn fn" data-k="e">e</button><button class="btn clr" id="scClear">C</button><button class="btn clr" id="scBack">⌫</button>' +
          '<button class="btn op" data-k="(">(</button><button class="btn op" data-k=")">)</button><button class="btn op" data-k="%">%</button><button class="btn op" data-k="/">÷</button>' +
          '<button class="btn op" data-k="7">7</button><button class="btn op" data-k="8">8</button><button class="btn op" data-k="9">9</button><button class="btn op" data-k="*">×</button>' +
          '<button class="btn op" data-k="4">4</button><button class="btn op" data-k="5">5</button><button class="btn op" data-k="6">6</button><button class="btn op" data-k="-">−</button>' +
          '<button class="btn op" data-k="1">1</button><button class="btn op" data-k="2">2</button><button class="btn op" data-k="3">3</button><button class="btn op" data-k="+">+</button>' +
          '<button class="btn op" data-k="0">0</button><button class="btn op" data-k=".">.</button><button class="btn op" id="scEq" style="grid-column:span 2" class="btn eq">=</button>' +
        '</div>' +
        '<p class="muted">支持 + - × ÷ % ^ ! 与 sin/cos/tan/ln/log/sqrt，支持括号与隐式乘法（如 2π、3(4+5)）。</p>' +
      '</div>';

      var exprEl = document.getElementById('scExpr');
      var resEl = document.getElementById('scResult');
      var expr = '';

      function update() {
        exprEl.value = expr || '0';
        if (!expr) { resEl.textContent = '输入表达式，实时计算结果'; resEl.style.color = ''; return; }
        try {
          var v = calcEval(expr);
          resEl.textContent = '= ' + fmt(v);
          resEl.style.color = 'var(--accent)';
        } catch (e) {
          resEl.textContent = e.message || String(e);
          resEl.style.color = 'var(--err)';
        }
      }
      function fmt(v) {
        if (!isFinite(v)) return '无穷大 / 无意义';
        var s = String(Math.round(v * 1e10) / 1e10);
        if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
        return s;
      }
      host.querySelectorAll('.calc-grid [data-k]').forEach(function (b) {
        b.addEventListener('click', function () { expr += b.getAttribute('data-k'); update(); });
      });
      document.getElementById('scClear').addEventListener('click', function () { expr = ''; update(); });
      document.getElementById('scBack').addEventListener('click', function () {
        expr = expr.slice(0, -1); update();
      });
      document.getElementById('scEq').addEventListener('click', function () {
        try { expr = String(fmt(calcEval(expr))); }
        catch (e) { T.toast('表达式有误'); }
        update();
      });
      document.addEventListener('keydown', function (e) { if (e.target === exprEl) e.preventDefault(); });
    }
  });

  /* 表达式求值：递归下降 */
  function calcEval(src) {
    var s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s+/g, '');
    if (!s) throw new Error('空表达式');
    var toks = [];
    var re = /(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+|[a-zA-Z]+|[+\-*/%^!()])/g;
    var m;
    while ((m = re.exec(s)) !== null) {
      var t = m[1];
      if (/^\d/.test(t) || t[0] === '.') toks.push({ t: 'num', v: parseFloat(t) });
      else if (/^[a-zA-Z]+$/.test(t)) toks.push({ t: 'id', v: t.toLowerCase() });
      else toks.push({ t: t });
    }
    if (!toks.length) throw new Error('无法识别表达式');
    var i = 0;
    function peek() { return toks[i]; }
    function next() { return toks[i++]; }
    function expect(op) {
      var tk = next();
      if (!tk || tk.t !== op) throw new Error('缺少 ' + op);
    }
    function parseExpr() {
      var v = parseTerm();
      while (peek() && (peek().t === '+' || peek().t === '-')) {
        var op = next().t;
        var r = parseTerm();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }
    function parseTerm() {
      var v = parseFactor();
      while (peek() && (peek().t === '*' || peek().t === '/' || peek().t === '%')) {
        var op = next().t;
        var r = parseFactor();
        if (op === '*') v = v * r;
        else if (op === '/') { if (r === 0) throw new Error('除数不能为 0'); v = v / r; }
        else v = v % r;
      }
      return v;
    }
    function parseFactor() {
      if (peek() && peek().t === '-') { next(); return -parseFactor(); }
      if (peek() && peek().t === '+') { next(); return parseFactor(); }
      var v = parseAtom();
      while (peek() && peek().t === '!') {
        next();
        if (v < 0 || Math.floor(v) !== v) throw new Error('阶乘仅支持非负整数');
        if (v > 170) throw new Error('阶乘数值过大');
        var f = 1;
        for (var k = 2; k <= v; k++) f *= k;
        v = f;
      }
      if (peek() && (peek().t === 'num' || peek().t === 'id' || peek().t === '(')) {
        v = v * parseFactor(); /* 隐式乘法 */
      }
      return v;
    }
    function parseAtom() {
      var tk = next();
      if (!tk) throw new Error('表达式不完整');
      if (tk.t === 'num') return tk.v;
      if (tk.t === '(') {
        var v = parseExpr();
        expect(')');
        return v;
      }
      if (tk.t === 'id') {
        if (tk.v === 'pi') return Math.PI;
        if (tk.v === 'e') return Math.E;
        var fns = {
          sin: Math.sin, cos: Math.cos, tan: Math.tan,
          asin: Math.asin, acos: Math.acos, atan: Math.atan,
          ln: Math.log, log: function (x) { return Math.log(x) / Math.LN10; },
          sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor,
          ceil: Math.ceil, round: Math.round, exp: Math.exp
        };
        var f = fns[tk.v];
        if (!f) throw new Error('未知函数 ' + tk.v);
        expect('(');
        var a = parseExpr();
        expect(')');
        return f(a);
      }
      if (tk.t === '^') throw new Error('缺少操作数');
      throw new Error('无法识别: ' + tk.t);
    }
    var out = parseExpr();
    if (peek()) throw new Error('多余内容: ' + peek().t);
    return out;
  }

  /* ============ 单位换算 ============ */
  T.register({
    id: 'unit-convert', icon: '📏', cat: 'calc', name: '单位换算',
    desc: '长度 · 重量 · 面积 · 体积 · 温度 · 速度 · 时间 · 存储',
    keywords: 'unit convert 单位 换算 长度 重量 温度',
    render: function (host) {
      var cats = {
        length: {
          name: '长度', base: '米', units: { 毫米: 0.001, 厘米: 0.01, 米: 1, 千米: 1000, 英寸: 0.0254, 英尺: 0.3048, 码: 0.9144, 英里: 1609.344, 海里: 1852, 里: 500 } },
        weight: {
          name: '重量', base: '千克', units: { 毫克: 1e-6, 克: 0.001, 千克: 1, 吨: 1000, 斤: 0.5, 两: 0.05, 磅: 0.45359237, 盎司: 0.028349523125, 克拉: 0.0002 } },
        area: {
          name: '面积', base: '平方米', units: { 平方毫米: 1e-6, 平方厘米: 1e-4, 平方米: 1, 公顷: 10000, 平方公里: 1e6, 亩: 666.6667, 平方英尺: 0.09290304, 英亩: 4046.8564 } },
        volume: {
          name: '体积', base: '升', units: { 毫升: 0.001, 升: 1, 立方米: 1000, 立方厘米: 0.001, 立方分米: 1, 美制加仑: 3.785411784, 英制加仑: 4.54609, 美制品脱: 0.473176 } },
        temperature: {
          name: '温度', base: '摄氏度', special: true,
          units: { 摄氏度: 'C', 华氏度: 'F', 开尔文: 'K' },
          toBase: { C: function (v) { return v; }, F: function (v) { return (v - 32) * 5 / 9; }, K: function (v) { return v - 273.15; } },
          fromBase: { C: function (v) { return v; }, F: function (v) { return v * 9 / 5 + 32; }, K: function (v) { return v + 273.15; } } },
        speed: {
          name: '速度', base: '米/秒', units: { '米/秒': 1, '千米/小时': 1 / 3.6, '英里/小时': 0.44704, 节: 0.514444, '英尺/秒': 0.3048, 马赫: 340.3 } },
        time: {
          name: '时间', base: '秒', units: { 毫秒: 0.001, 秒: 1, 分钟: 60, 小时: 3600, 天: 86400, 周: 604800, '月(30天)': 2592000, '年(365天)': 31536000 } },
        storage: {
          name: '存储', base: '字节', units: { 比特: 0.125, 字节: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 } }
      };
      function opts(o, sel) {
        return Object.keys(o).map(function (k) {
          return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + k + '</option>';
        }).join('');
      }
      host.innerHTML =
      '<div class="panel"><h3>' + L('单位换算', 'Unit Converter') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('类型', 'Type') + '</label><select id="ucCat">' + Object.keys(cats).map(function (k) { return '<option value="' + k + '">' + cats[k].name + '</option>'; }).join('') + '</select></div>' +
          '<div class="field grow"><label>' + L('数值', 'Value') + '</label><input id="ucVal" inputmode="decimal" placeholder="' + L('输入数值', 'Enter value') + '"></div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('从', 'From') + '</label><select id="ucFrom"></select></div>' +
          '<button class="btn btn-ghost" id="ucSwap" title="' + L('交换单位', 'Swap units') + '" style="min-height:44px;margin-bottom:12px">⇄</button>' +
          '<div class="field grow"><label>' + L('到', 'To') + '</label><select id="ucTo"></select></div>' +
        '</div>' +
        '<div class="field"><label>' + L('结果', 'Result') + '</label><div class="out big-out" id="ucOut">-</div></div>' +
        '<p class="muted">' + L('存储单位按 1 KB = 1024 B 二进制换算。', 'Storage units use binary: 1 KB = 1024 B.') + '</p>' +
      '</div>';
      var catSel = document.getElementById('ucCat');
      var fromSel = document.getElementById('ucFrom');
      var toSel = document.getElementById('ucTo');
      var valEl = document.getElementById('ucVal');
      var outEl = document.getElementById('ucOut');
      function fillUnits() {
        var c = cats[catSel.value];
        fromSel.innerHTML = opts(c.units, '米');
        toSel.innerHTML = opts(c.units, null);
        if (c.base && c.units[c.base]) toSel.value = c.base;
      }
      function compute() {
        var c = cats[catSel.value];
        var v = parseFloat(valEl.value);
        if (isNaN(v)) { outEl.textContent = L('请输入数值', 'Enter a value'); return; }
        var from = fromSel.value, to = toSel.value;
        var r;
        if (c.special) {
          r = c.fromBase[to](c.toBase[from](v));
        } else {
          r = v * c.units[from] / c.units[to];
        }
        outEl.textContent = T.fmtNum(r, r < 1e-6 || r > 1e10 ? 10 : 6) + ' ' + to;
      }
      catSel.addEventListener('change', function () { fillUnits(); compute(); });
      fromSel.addEventListener('change', compute);
      toSel.addEventListener('change', compute);
      valEl.addEventListener('input', compute);
      document.getElementById('ucSwap').addEventListener('click', function () {
        var t = fromSel.value; fromSel.value = toSel.value; toSel.value = t; compute();
      });
      fillUnits();
    }
  });

  /* ============ 进制转换 ============ */
  T.register({
    id: 'base-convert', icon: '🔟', cat: 'calc', name: '进制转换',
    desc: '二进制 / 八进制 / 十进制 / 十六进制互转',
    keywords: '进制 binary hex decimal 2进制 16进制',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('进制转换', 'Base Converter') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('输入进制', 'Input base') + '</label><select id="bcBase">' + ['2', '8', '10', '16'].map(function (b) { return '<option value="' + b + '"' + (b === '10' ? ' selected' : '') + '>' + b + ' 进制</option>'; }).join('') + '</select></div>' +
          '<div class="field grow" style="flex:2"><label>' + L('数值', 'Value') + '</label><input id="bcVal" spellcheck="false" placeholder="' + L('输入待转换的数值', 'Enter value to convert') + '"></div>' +
        '</div>' +
        '<div class="stat-grid">' +
          '<div class="stat-box"><div class="k">二进制 (2)</div><div class="v" style="font-size:15px" id="bc2">-</div></div>' +
          '<div class="stat-box"><div class="k">八进制 (8)</div><div class="v" style="font-size:15px" id="bc8">-</div></div>' +
          '<div class="stat-box"><div class="k">十进制 (10)</div><div class="v" style="font-size:15px" id="bc10">-</div></div>' +
          '<div class="stat-box"><div class="k">十六进制 (16)</div><div class="v" style="font-size:15px" id="bc16">-</div></div>' +
        '</div>' +
        '<p class="muted">' + L('支持整数转换，范围受 JavaScript 安全整数限制（约 ±9×10¹⁵）。', 'Integers only; limited by JS safe integers (±9×10¹⁵).') + '</p>' +
      '</div>';
      var baseSel = document.getElementById('bcBase');
      var valEl = document.getElementById('bcVal');
      function convert() {
        var base = parseInt(baseSel.value, 10);
        var s = valEl.value.trim().toUpperCase();
        var out = { 2: '-', 8: '-', 10: '-', 16: '-' };
        if (s) {
          var valid = true;
          for (var i = 0; i < s.length; i++) {
            var d = parseInt(s[i], base);
            if (isNaN(d)) { valid = false; break; }
          }
          if (!valid) {
            document.getElementById('bc2').textContent = L('输入无效', 'Invalid input');
            document.getElementById('bc8').textContent = L('输入无效', 'Invalid input');
            document.getElementById('bc10').textContent = L('输入无效', 'Invalid input');
            document.getElementById('bc16').textContent = L('输入无效', 'Invalid input');
            return;
          }
          var n = parseInt(s, base);
          if (!isFinite(n) || n > 9007199254740991 || n < -9007199254740991) {
            document.getElementById('bc10').textContent = L('超出范围', 'Out of range');
            return;
          }
          out[2] = n.toString(2);
          out[8] = n.toString(8);
          out[10] = n.toString(10);
          out[16] = n.toString(16).toUpperCase();
        }
        document.getElementById('bc2').textContent = out[2];
        document.getElementById('bc8').textContent = out[8];
        document.getElementById('bc10').textContent = out[10];
        document.getElementById('bc16').textContent = out[16];
      }
      baseSel.addEventListener('change', convert);
      valEl.addEventListener('input', convert);
    }
  });

  /* ============ BMI 计算 ============ */
  T.register({
    id: 'bmi', icon: '⚖️', cat: 'calc', name: 'BMI 计算',
    desc: '身高体重测算身体质量指数与健康区间（中国标准）',
    keywords: 'bmi 体重 健康 指数',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('BMI 计算', 'BMI Calculator') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('身高（cm）', 'Height (cm)') + '</label><input id="bmiH" inputmode="decimal" placeholder="' + L('例如 170', 'e.g. 170') + '"></div>' +
          '<div class="field grow"><label>' + L('体重（kg）', 'Weight (kg)') + '</label><input id="bmiW" inputmode="decimal" placeholder="' + L('例如 65', 'e.g. 65') + '"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="bmiBtn">' + L('计算', 'Calculate') + '</button></div>' +
        '</div>' +
        '<div class="stat-grid" id="bmiOut" style="display:none">' +
          '<div class="stat-box"><div class="k">BMI</div><div class="v" id="bmiV">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('评价', 'Rating') + '</div><div class="v" id="bmiCat" style="font-size:16px">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('健康体重范围', 'Healthy range') + '</div><div class="v" id="bmiRange" style="font-size:15px">-</div></div>' +
        '</div>' +
        '<p class="muted">' + L('中国成人标准：偏瘦 &lt;18.5 · 正常 18.5~24 · 超重 24~28 · 肥胖 ≥28。', 'CN adult standard: under &lt;18.5 · normal 18.5~24 · over 24~28 · obese ≥28.') + '</p>' +
      '</div>';
      document.getElementById('bmiBtn').addEventListener('click', function () {
        var h = parseFloat(document.getElementById('bmiH').value);
        var w = parseFloat(document.getElementById('bmiW').value);
        if (!h || !w || h < 50 || h > 280 || w < 2 || w > 500) { T.toast(L('请输入有效的身高和体重', 'Enter valid height & weight')); return; }
        var bmi = w / Math.pow(h / 100, 2);
        var cat, color = 'var(--ink)';
        if (bmi < 18.5) { cat = L('偏瘦', 'Underweight'); color = 'var(--warn)'; }
        else if (bmi < 24) { cat = L('正常', 'Normal'); color = 'var(--ok)'; }
        else if (bmi < 28) { cat = L('超重', 'Overweight'); color = 'var(--warn)'; }
        else { cat = L('肥胖', 'Obese'); color = 'var(--err)'; }
        var lo = 18.5 * Math.pow(h / 100, 2), hi = 24 * Math.pow(h / 100, 2);
        document.getElementById('bmiOut').style.display = 'grid';
        document.getElementById('bmiV').textContent = bmi.toFixed(1);
        var c = document.getElementById('bmiCat');
        c.textContent = cat; c.style.color = color;
        document.getElementById('bmiRange').textContent = lo.toFixed(1) + ' ~ ' + hi.toFixed(1) + ' kg';
      });
    }
  });

  /* ============ 房贷计算器 ============ */
  T.register({
    id: 'mortgage', icon: '🏠', cat: 'calc', name: '房贷计算器',
    desc: '等额本息 / 等额本金月供与利息测算',
    keywords: '房贷 贷款 月供 利息 按揭',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('房贷计算', 'Mortgage Calculator') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('贷款金额（万元）', 'Loan (10k CNY)') + '</label><input id="mgAmt" inputmode="decimal" placeholder="' + L('例如 100', 'e.g. 100') + '"></div>' +
          '<div class="field grow"><label>' + L('年利率（%）', 'Annual rate (%)') + '</label><input id="mgRate" inputmode="decimal" placeholder="' + L('例如 3.85', 'e.g. 3.85') + '"></div>' +
          '<div class="field grow"><label>' + L('贷款年限（年）', 'Years') + '</label><input id="mgYears" inputmode="numeric" placeholder="' + L('例如 30', 'e.g. 30') + '"></div>' +
        '</div>' +
        '<div class="field"><label>' + L('还款方式', 'Repayment') + '</label><select id="mgMethod">' +
          '<option value="debx">' + L('等额本息（月供固定）', 'Equal payment (fixed)') + '</option><option value="debj">' + L('等额本金（月供递减）', 'Equal principal (decreasing)') + '</option>' +
        '</select></div>' +
        '<button class="btn btn-primary" id="mgBtn">' + L('计算', 'Calculate') + '</button>' +
        '<div class="stat-grid" id="mgOut" style="display:none;margin-top:16px">' +
          '<div class="stat-box"><div class="k">' + L('每月月供', 'Monthly payment') + '</div><div class="v" id="mgPay">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('利息总额', 'Total interest') + '</div><div class="v" id="mgInt" style="color:var(--err)">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('还款总额', 'Total payment') + '</div><div class="v" id="mgTotal">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('利息占比', 'Interest share') + '</div><div class="v" id="mgPct">-</div></div>' +
        '</div>' +
      '</div>';
      document.getElementById('mgBtn').addEventListener('click', function () {
        var P = parseFloat(document.getElementById('mgAmt').value) * 10000;
        var yr = parseFloat(document.getElementById('mgRate').value);
        var n = parseInt(document.getElementById('mgYears').value, 10);
        if (!P || isNaN(yr) || !n || n < 1) { T.toast(L('请完整填写金额、利率和年限', 'Fill in amount, rate and years')); return; }
        var r = yr / 100 / 12;
        var months = n * 12;
        var pay, totalInt;
        if (document.getElementById('mgMethod').value === 'debx') {
          var pv = Math.pow(1 + r, months);
          pay = P * r * pv / (pv - 1);
          totalInt = pay * months - P;
        } else {
          var principal = P / months;
          var firstInt = P * r;
          pay = principal + firstInt;
          totalInt = P * r * (months + 1) / 2;
        }
        var total = P + totalInt;
        document.getElementById('mgOut').style.display = 'grid';
        document.getElementById('mgPay').textContent = '¥' + Math.round(pay).toLocaleString();
        document.getElementById('mgInt').textContent = '¥' + Math.round(totalInt).toLocaleString();
        document.getElementById('mgTotal').textContent = '¥' + Math.round(total).toLocaleString();
        document.getElementById('mgPct').textContent = (totalInt / total * 100).toFixed(1) + '%';
      });
    }
  });

  /* ============ 百分比计算 ============ */
  T.register({
    id: 'percent', icon: '💯', cat: 'calc', name: '百分比计算',
    desc: '占比 / 百分比数值 / 增减幅度三类常用计算',
    keywords: '百分比 percent 占比 折扣',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('百分比计算', 'Percent Calculator') + '</h3>' +
        '<div class="tabs" id="pcTabs">' +
          '<button data-m="1" class="active">A ' + L('占 B 的 %', 'as % of B') + '</button>' +
          '<button data-m="2">A ' + L('的 B% 是多少', '× B%') + '</button>' +
          '<button data-m="3">A ' + L('到 B 增减 %', 'to B change %') + '</button>' +
        '</div>' +
        '<div class="row" id="pcRow1"><div class="field grow"><label>A</label><input id="pcA" inputmode="decimal"></div><div class="field grow"><label>B</label><input id="pcB" inputmode="decimal"></div></div>' +
        '<div class="row" id="pcRow2" style="display:none"><div class="field grow"><label>A</label><input id="pcX" inputmode="decimal"></div><div class="field grow"><label>B（%）</label><input id="pcY" inputmode="decimal"></div></div>' +
        '<div class="row" id="pcRow3" style="display:none"><div class="field grow"><label>' + L('原值 A', 'Old A') + '</label><input id="pcM" inputmode="decimal"></div><div class="field grow"><label>' + L('新值 B', 'New B') + '</label><input id="pcN" inputmode="decimal"></div></div>' +
        '<div class="field"><label>' + L('结果', 'Result') + '</label><div class="out big-out" id="pcOut">-</div></div>' +
      '</div>';
      var mode = 1;
      function bind(m, el) {
        el.addEventListener('input', function () {
          var a = parseFloat(document.getElementById(m === 1 ? 'pcA' : m === 2 ? 'pcX' : 'pcM').value);
          var b = parseFloat(document.getElementById(m === 1 ? 'pcB' : m === 2 ? 'pcY' : 'pcN').value);
          var out = document.getElementById('pcOut');
          if (isNaN(a) || isNaN(b)) { out.textContent = L('请输入数值', 'Enter values'); return; }
          if (m === 1) out.textContent = (b === 0 ? L('除数不能为 0', 'Divisor cannot be 0') : (a / b * 100).toFixed(2) + '%');
          else if (m === 2) out.textContent = (a * b / 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
          else out.textContent = (a === 0 ? L('原值不能为 0', 'Old value cannot be 0') : ((b - a) / a * 100).toFixed(2) + '% (' + (b >= a ? L('增', 'up') : L('减', 'down')) + ')');
        });
      }
      bind(1, document.getElementById('pcA')); bind(1, document.getElementById('pcB'));
      bind(2, document.getElementById('pcX')); bind(2, document.getElementById('pcY'));
      bind(3, document.getElementById('pcM')); bind(3, document.getElementById('pcN'));
      var tabs = document.getElementById('pcTabs');
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-m]');
        if (!b) return;
        mode = parseInt(b.getAttribute('data-m'), 10);
        tabs.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
        document.getElementById('pcRow1').style.display = mode === 1 ? 'flex' : 'none';
        document.getElementById('pcRow2').style.display = mode === 2 ? 'flex' : 'none';
        document.getElementById('pcRow3').style.display = mode === 3 ? 'flex' : 'none';
        document.getElementById('pcOut').textContent = '-';
      });
    }
  });

  /* ============ 日期计算 ============ */
  T.register({
    id: 'date-calc', icon: '📆', cat: 'calc', name: '日期计算',
    desc: '两日期相差天数 + 日期加减推算',
    keywords: '日期 date 相差 天数 推算',
    render: function (host) {
      function today() { return new Date(); }
      function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
      function pad(n) { return (n < 10 ? '0' : '') + n; }
      host.innerHTML =
      '<div class="panel"><h3>' + L('相差天数', 'Days Between') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('开始日期', 'Start date') + '</label><input type="date" id="dcA" value="' + iso(today()) + '"></div>' +
          '<div class="field grow"><label>' + L('结束日期', 'End date') + '</label><input type="date" id="dcB" value="' + iso(today()) + '"></div>' +
        '</div>' +
        '<div class="field"><label>' + L('结果', 'Result') + '</label><div class="out big-out" id="dcOut">-</div></div>' +
      '</div>' +
      '<div class="panel"><h3>' + L('日期推算', 'Date Add') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('起始日期', 'From') + '</label><input type="date" id="dcC" value="' + iso(today()) + '"></div>' +
          '<div class="field grow"><label>' + L('加减天数（负数为往前）', 'Days to add (negative = back)') + '</label><input id="dcD" inputmode="numeric" placeholder="' + L('例如 100', 'e.g. 100') + '"></div>' +
        '</div>' +
        '<button class="btn btn-primary" id="dcBtn">' + L('推算', 'Calculate') + '</button>' +
        '<div class="field" style="margin-top:14px"><label>' + L('结果', 'Result') + '</label><div class="out big-out" id="dcOut2">-</div></div>' +
      '</div>';
      function calcDiff() {
        var a = new Date(document.getElementById('dcA').value + 'T00:00:00');
        var b = new Date(document.getElementById('dcB').value + 'T00:00:00');
        if (isNaN(a) || isNaN(b)) { document.getElementById('dcOut').textContent = '-'; return; }
        var days = Math.round((b - a) / 86400000);
        var weeks = Math.floor(Math.abs(days) / 7), rem = Math.abs(days) % 7;
        document.getElementById('dcOut').textContent = Math.abs(days) + (isEn() ? ' days' : ' 天') +
          (days < 0 ? (isEn() ? ' (B before A)' : '（B 在 A 之前）') : days > 0 ? (isEn() ? ' (B after A)' : '（B 在 A 之后）') : (isEn() ? ' (same day)' : '（同一天）')) +
          (weeks ? ' = ' + weeks + (isEn() ? ' wk ' : ' 周 ') + rem + (isEn() ? ' d' : ' 天') : '');
      }
      document.getElementById('dcA').addEventListener('change', calcDiff);
      document.getElementById('dcB').addEventListener('change', calcDiff);
      document.getElementById('dcBtn').addEventListener('click', function () {
        var c = new Date(document.getElementById('dcC').value + 'T00:00:00');
        var d = parseInt(document.getElementById('dcD').value, 10);
        if (isNaN(c) || isNaN(d)) { T.toast(L('请填写日期和天数', 'Fill in date and days')); return; }
        var r = new Date(c.getTime() + d * 86400000);
        document.getElementById('dcOut2').textContent = iso(r) + (isEn() ? ' (' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][r.getDay()] + ')' : '（周' + '日一二三四五六'[r.getDay()] + '）');
      });
      calcDiff();
    }
  });

  /* ============ 年龄计算 ============ */
  T.register({
    id: 'age', icon: '🎂', cat: 'calc', name: '年龄计算',
    desc: '出生日期精确到年月日的年龄 + 距下次生日天数',
    keywords: '年龄 age 生日 周岁',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('年龄计算', 'Age Calculator') + '</h3>' +
        '<div class="field"><label>' + L('出生日期', 'Birth date') + '</label><input type="date" id="agBirth"></div>' +
        '<button class="btn btn-primary" id="agBtn">' + L('计算', 'Calculate') + '</button>' +
        '<div class="stat-grid" id="agOut" style="display:none;margin-top:16px">' +
          '<div class="stat-box"><div class="k">' + L('周岁', 'Age') + '</div><div class="v" id="agAge">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('精确年龄', 'Exact age') + '</div><div class="v" style="font-size:15px" id="agExact">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('距下次生日', 'Next birthday') + '</div><div class="v" id="agNext">-</div></div>' +
        '</div>' +
      '</div>';
      document.getElementById('agBtn').addEventListener('click', function () {
        var s = document.getElementById('agBirth').value;
        if (!s) { T.toast(L('请选择出生日期', 'Pick a birth date')); return; }
        var b = new Date(s + 'T00:00:00');
        var now = new Date();
        var y = now.getFullYear() - b.getFullYear();
        var m = now.getMonth() - b.getMonth();
        var d = now.getDate() - b.getDate();
        if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        var next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
        if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
          next = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate());
        }
        var days = Math.round((next - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
        document.getElementById('agOut').style.display = 'grid';
        document.getElementById('agAge').textContent = y + (isEn() ? ' y' : ' 岁');
        document.getElementById('agExact').textContent = y + (isEn() ? 'y ' : ' 年 ') + m + (isEn() ? 'm ' : ' 个月 ') + d + (isEn() ? 'd' : ' 天');
        document.getElementById('agNext').textContent = days + (isEn() ? ' d' : ' 天');
      });
    }
  });
})();
