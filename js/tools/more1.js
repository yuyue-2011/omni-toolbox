/* 万能工具箱 v2.9 · 数据类增强（5 款） */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }

  /* ============ JSON 树查看 ============ */
  T.register({
    id: 'json-tree', cat: 'data', icon: '🌳',
    name: 'JSON 树查看',
    desc: '折叠展开 / 路径复制 / 节点统计',
    keywords: 'json tree 树 查看 展开 折叠 路径 viewer',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('JSON 树查看器', 'JSON Tree Viewer') + '</h3>' +
        '<div class="field"><textarea id="jtIn" placeholder=\'{"name":"Omni","tools":[1,2,3]}\' style="min-height:120px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="jtBtn">' + L('解析', 'Parse') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="jtAll">' + L('全部展开', 'Expand all') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="jtNone">' + L('全部折叠', 'Collapse all') + '</button></div></div>' +
        '<div id="jtOut"></div><div id="jtTail"></div>' +
      '</div>';
      var seq = 0;
      function ea(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
      function build(obj, key, depth, path) {
        var isArr = Array.isArray(obj);
        var isObj = obj !== null && typeof obj === 'object';
        var pad = depth ? ' style="margin-left:16px"' : '';
        if (isObj) {
          var ks = isArr ? obj.map(function (_, i) { return i; }) : Object.keys(obj);
          var kids = ks.map(function (k) {
            var kp = isArr ? path + '[' + k + ']' : (path ? path + '.' : '') + k;
            return build(obj[k], String(k), depth + 1, kp);
          }).join('');
          return '<div class="jt-node"' + pad + '><span class="jt-key jt-fold" data-path="' + ea(path) + '">' + ea(key) + '</span>' +
            (isArr ? ' []' : ' {}') + ' <span class="jt-meta">' + ks.length + ' ' + L('项', 'items') + '</span>' +
            '<div class="jt-kids" style="display:none">' + kids + '</div></div>';
        }
        var disp = obj === null ? 'null' : typeof obj === 'string' ? JSON.stringify(obj) : String(obj);
        var cls = obj === null ? 'jt-null' : typeof obj;
        return '<div class="jt-node jt-leaf"' + pad + '><span class="jt-key" data-path="' + ea(path) + '">' + ea(key) + '</span>: ' +
          '<span class="jt-val jt-' + cls + '">' + ea(disp) + '</span></div>';
      }
      function parse() {
        seq = 0;
        var raw = $('jtIn').value.trim();
        var box = $('jtOut');
        if (!raw) { box.innerHTML = '<div class="empty"><b>' + L('请输入 JSON', 'Please enter JSON') + '</b></div>'; $('jtTail').innerHTML = ''; return; }
        var data;
        try { data = JSON.parse(raw); } catch (e) {
          box.innerHTML = '<div class="empty"><b>JSON ' + L('解析失败', 'parse failed') + '</b><span style="font-size:13px">' + esc(String(e.message || e)) + '</span></div>';
          $('jtTail').innerHTML = '';
          return;
        }
        if (!data || typeof data !== 'object') { box.innerHTML = '<div class="empty"><b>' + L('根节点需为对象或数组', 'Root must be an object or array') + '</b></div>'; $('jtTail').innerHTML = ''; return; }
        box.innerHTML = '<div class="jt-root">' + build(data, L('根节点', 'root'), 0, '') + '</div>';
        $('jtTail').innerHTML = '<p class="note" style="margin-top:10px">' +
          L('点击 {} / [] 节点的键可折叠或展开；点击叶子节点的键复制其访问路径。',
            'Click a {} / [] key to fold/unfold; click a leaf key to copy its path.') + '</p>';
        box.querySelectorAll('.jt-fold').forEach(function (key) {
          key.addEventListener('click', function () {
            var node = key.parentNode;
            var kids = node.querySelector('.jt-kids');
            if (kids) kids.style.display = kids.style.display === 'none' ? 'block' : 'none';
          });
        });
        box.querySelectorAll('.jt-leaf .jt-key').forEach(function (key) {
          key.classList.add('jt-copy');
          key.addEventListener('click', function () { T.copyText(key.getAttribute('data-path')); });
        });
      }
      $('jtBtn').addEventListener('click', parse);
      $('jtAll').addEventListener('click', function () {
        $('jtOut').querySelectorAll('.jt-kids').forEach(function (k) { k.style.display = 'block'; });
      });
      $('jtNone').addEventListener('click', function () {
        $('jtOut').querySelectorAll('.jt-kids').forEach(function (k) { k.style.display = 'none'; });
      });
      parse();
    }
  });

  /* ============ CSV ↔ JSON 互转 ============ */
  T.register({
    id: 'csv-json', cat: 'data', icon: '📄',
    name: 'CSV ↔ JSON 互转',
    desc: 'CSV 与 JSON 双向转换，支持表头',
    keywords: 'csv json 转换 表格 table convert 互转',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('CSV 与 JSON 互转', 'CSV ↔ JSON Converter') + '</h3>' +
        '<div class="field"><label>' + L('输入（CSV 或 JSON 数组）', 'Input (CSV or JSON array)') + '</label>' +
        '<textarea id="cjIn" placeholder="name,age&#10;Alice,30&#10;Bob,25" style="min-height:130px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="cjC2J">CSV → JSON</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="cjJ2C">JSON → CSV</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="cjClear">' + L('清空', 'Clear') + '</button></div></div>' +
        '<div class="field"><label>' + L('输出', 'Output') + '</label><textarea id="cjOut" style="min-height:130px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="cjCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
      '</div>';
      function csvRows(text) {
        var rows = [], cur = [], field = '', inQ = false, i = 0;
        while (i < text.length) {
          var ch = text[i];
          if (inQ) {
            if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
            field += ch; i++; continue;
          }
          if (ch === '"') { inQ = true; i++; continue; }
          if (ch === ',') { cur.push(field); field = ''; i++; continue; }
          if (ch === '\r') { i++; continue; }
          if (ch === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; i++; continue; }
          field += ch; i++;
        }
        if (field !== '' || cur.length) { cur.push(field); rows.push(cur); }
        return rows.filter(function (r) { return r.some(function (c) { return c.trim() !== ''; }); });
      }
      function autoNum(s) {
        if (!/^-?\d+(\.\d+)?$/.test(s)) return s;
        var n = Number(s);
        return isNaN(n) ? s : n;
      }
      $('cjC2J').addEventListener('click', function () {
        var rows = csvRows($('cjIn').value);
        if (!rows.length) { T.toast(L('未解析到数据', 'No data parsed')); return; }
        var head = rows[0];
        var arr = rows.slice(1).map(function (r) {
          var o = {};
          head.forEach(function (k, i) { o[k] = autoNum(r[i] == null ? '' : r[i]); });
          return o;
        });
        $('cjOut').value = JSON.stringify(arr, null, 2);
      });
      $('cjJ2C').addEventListener('click', function () {
        var data;
        try { data = JSON.parse($('cjIn').value); } catch (e) { T.toast(L('JSON 解析失败', 'JSON parse failed')); return; }
        if (!Array.isArray(data)) { T.toast(L('需要 JSON 数组', 'A JSON array is required')); return; }
        var head = [];
        data.forEach(function (o) { Object.keys(o || {}).forEach(function (k) { if (head.indexOf(k) < 0) head.push(k); }); });
        var lines = [head.join(',')];
        data.forEach(function (o) {
          lines.push(head.map(function (k) {
            var v = (o == null || o[k] == null) ? '' : String(o[k]);
            if (/[",\n\r]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
            return v;
          }).join(','));
        });
        $('cjOut').value = lines.join('\n');
      });
      $('cjClear').addEventListener('click', function () { $('cjIn').value = ''; $('cjOut').value = ''; });
      $('cjCopy').addEventListener('click', function () { T.copyText($('cjOut').value); });
    }
  });

  /* ============ 集合运算 ============ */
  T.register({
    id: 'set-ops', cat: 'data', icon: '∩',
    name: '集合运算',
    desc: '去重 / 交集 / 并集 / 差集（按行）',
    keywords: '集合 去重 交集 并集 差集 set unique union intersect diff',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('集合运算（按行）', 'Set Operations (per line)') + '</h3>' +
        '<div class="field"><label>A</label><textarea id="soA" placeholder="apple&#10;banana&#10;cherry" style="min-height:110px"></textarea></div>' +
        '<div class="field"><label>B</label><textarea id="soB" placeholder="banana&#10;cherry&#10;date" style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" data-op="unique">' + L('A 去重', 'A unique') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" data-op="inter">A ∩ B</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" data-op="union">A ∪ B</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" data-op="diff">A − B</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" data-op="sym">A △ B</button></div></div>' +
        '<div class="field"><label>' + L('结果', 'Result') + ' <span id="soCount" class="chip dim"></span></label>' +
        '<textarea id="soOut" style="min-height:110px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="soCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
      '</div>';
      function lines(id) {
        return $(id).value.split(/\r?\n/).map(function (s) { return s.trim(); })
          .filter(function (s, i, a) { return s !== '' && a.indexOf(s) === i; });
      }
      host.querySelectorAll('[data-op]').forEach(function (b) {
        b.addEventListener('click', function () {
          var A = lines('soA'), B = lines('soB'), R = [];
          var op = b.getAttribute('data-op');
          if (op === 'unique') R = A;
          if (op === 'inter') R = A.filter(function (x) { return B.indexOf(x) >= 0; });
          if (op === 'union') R = A.concat(B.filter(function (b2) { return A.indexOf(b2) < 0; }));
          if (op === 'diff') R = A.filter(function (x) { return B.indexOf(x) < 0; });
          if (op === 'sym') R = A.filter(function (x) { return B.indexOf(x) < 0; })
            .concat(B.filter(function (x) { return A.indexOf(x) < 0; }));
          $('soOut').value = R.join('\n');
          $('soCount').textContent = R.length + ' ' + L('行', 'lines');
        });
      });
      $('soCopy').addEventListener('click', function () { T.copyText($('soOut').value); });
    }
  });

  /* ============ 柱状图生成 ============ */
  T.register({
    id: 'data-bar', cat: 'data', icon: '📊',
    name: '柱状图生成',
    desc: '输入标签与数值快速生成柱状图',
    keywords: '柱状图 条形图 图表 chart bar 可视化 数据',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('柱状图生成', 'Bar Chart Generator') + '</h3>' +
        '<div class="field"><label>' + L('数据（每行：标签 数值）', 'Data (per line: label value)') + '</label>' +
        '<textarea id="bdIn" placeholder="一月 120&#10;二月 180&#10;三月 150" style="min-height:120px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="bdBtn">' + L('生成图表', 'Generate') + '</button></div>' +
        '<div class="field"><label>' + L('排序', 'Sort') + '</label><select id="bdSort"><option value="none">' + L('原顺序', 'Original') + '</option><option value="desc">' + L('从高到低', 'High → Low') + '</option><option value="asc">' + L('从低到高', 'Low → High') + '</option></select></div></div>' +
        '<div id="bdOut"></div>' +
      '</div>';
      $('bdBtn').addEventListener('click', function () {
        var rows = $('bdIn').value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
        var data = rows.map(function (r, idx) {
          var m = r.split(/[\s，,\t]+/);
          var v = parseFloat(m[m.length - 1]);
          return { label: m.slice(0, -1).join(' ') || ('#' + (idx + 1)), value: isNaN(v) ? 0 : v };
        });
        var sort = $('bdSort').value;
        if (sort === 'desc') data.sort(function (a, b) { return b.value - a.value; });
        if (sort === 'asc') data.sort(function (a, b) { return a.value - b.value; });
        if (!data.length) { out('bdOut', '<div class="empty"><b>' + L('请输入数据', 'Please enter data') + '</b></div>'); return; }
        var max = Math.max.apply(null, data.map(function (d) { return Math.abs(d.value); })) || 1;
        var h = '<div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">';
        data.forEach(function (d) {
          var pct = Math.max(2, Math.round(Math.abs(d.value) / max * 100));
          h += '<div style="display:flex;align-items:center;gap:10px;font-size:13.5px">' +
            '<span style="width:74px;flex:none;color:var(--ink-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(d.label) + '</span>' +
            '<span style="flex:1;height:20px;background:var(--card-2);border-radius:5px;overflow:hidden">' +
            '<span style="display:block;height:100%;width:' + pct + '%;background:var(--ac-grad);border-radius:5px"></span></span>' +
            '<span style="width:64px;flex:none;text-align:right;font-family:var(--mono);color:var(--ink)">' + d.value + '</span></div>';
        });
        out('bdOut', h + '</div>');
      });
    }
  });

  /* ============ 文本差异对比 ============ */
  T.register({
    id: 'data-diff', cat: 'data', icon: '≠',
    name: '文本差异对比',
    desc: '逐词 / 逐行高亮两段文本的不同',
    keywords: 'diff 差异 对比 不同 compare 文本',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('文本差异对比', 'Text Diff') + '</h3>' +
        '<div class="row">' +
        '<div class="field grow"><label>' + L('原文', 'Original') + '</label><textarea id="dfA" style="min-height:120px"></textarea></div>' +
        '<div class="field grow"><label>' + L('修改后', 'Modified') + '</label><textarea id="dfB" style="min-height:120px"></textarea></div></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="dfWord">' + L('逐词对比', 'Word diff') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="dfLine">' + L('逐行对比', 'Line diff') + '</button></div></div>' +
        '<div id="dfOut"></div>' +
      '</div>';
      function esc2(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
      function lcs(a, b) {
        if (a.length * b.length > 4000000) return null;
        var m = a.length, n = b.length;
        var dp = [];
        for (var i = 0; i <= m; i++) dp[i] = new Array(n + 1).fill(0);
        for (i = 1; i <= m; i++) for (var j = 1; j <= n; j++) {
          dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
        var x = m, y = n, oa = [], ob = [];
        while (x > 0 && y > 0) {
          if (a[x - 1] === b[y - 1]) { oa.unshift({ t: 'same', v: a[x - 1] }); ob.unshift({ t: 'same', v: a[x - 1] }); x--; y--; }
          else if (dp[x - 1][y] >= dp[x][y - 1]) { oa.unshift({ t: 'del', v: a[x - 1] }); x--; }
          else { ob.unshift({ t: 'ins', v: b[y - 1] }); y--; }
        }
        while (x > 0) { oa.unshift({ t: 'del', v: a[x - 1] }); x--; }
        while (y > 0) { ob.unshift({ t: 'ins', v: b[y - 1] }); y--; }
        return { a: oa, b: ob };
      }
      function paint(res) {
        function side(segs) {
          return segs.map(function (s) {
            if (s.t === 'same') return esc2(s.v);
            var bg = s.t === 'del' ? 'rgba(242,109,109,.22)' : 'rgba(47,191,143,.22)';
            return '<span style="background:' + bg + ';border-radius:3px">' + esc2(s.v) + '</span>';
          }).join('');
        }
        var h = '<div class="row" style="margin-top:8px">' +
          '<div class="field grow"><label>' + L('原文', 'Original') + '</label><div class="diff-box">' + side(res.a) + '</div></div>' +
          '<div class="field grow"><label>' + L('修改后', 'Modified') + '</label><div class="diff-box">' + side(res.b) + '</div></div></div>';
        out('dfOut', h);
      }
      $('dfWord').addEventListener('click', function () {
        var a = $('dfA').value.split(/(\s+)/), b = $('dfB').value.split(/(\s+)/);
        var res = lcs(a, b);
        if (!res) { T.toast(L('内容过大，请分段对比', 'Too large; compare in chunks')); return; }
        paint(res);
      });
      $('dfLine').addEventListener('click', function () {
        var a = $('dfA').value.split('\n'), b = $('dfB').value.split('\n');
        var res = lcs(a, b);
        if (!res) { T.toast(L('内容过大，请分段对比', 'Too large; compare in chunks')); return; }
        paint(res);
      });
    }
  });
})();
