/* ============================================================
   万能工具箱 · 文本类工具（8 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 字数统计 ============ */
  T.register({
    id: 'word-count', icon: '📑', cat: 'text', name: '字数统计',
    desc: '字符、单词、行数、段落与预计阅读时间',
    keywords: '字数 count 统计 字符 阅读时间',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('字数统计', 'Word Counter') + '</h3>' +
        '<div class="field"><textarea id="wcIn" placeholder="' + L('在此粘贴或输入文本…', 'Paste or type text here…') + '" style="min-height:180px"></textarea></div>' +
        '<div class="stat-grid" id="wcOut">' +
          '<div class="stat-box"><div class="k">总字符</div><div class="v" id="wcTotal">0</div></div>' +
          '<div class="stat-box"><div class="k">不含空格</div><div class="v" id="wcNoSpace">0</div></div>' +
          '<div class="stat-box"><div class="k">中文字符</div><div class="v" id="wcCjk">0</div></div>' +
          '<div class="stat-box"><div class="k">英文单词</div><div class="v" id="wcWord">0</div></div>' +
          '<div class="stat-box"><div class="k">行数</div><div class="v" id="wcLine">0</div></div>' +
          '<div class="stat-box"><div class="k">段落</div><div class="v" id="wcPara">0</div></div>' +
          '<div class="stat-box"><div class="k">预计阅读</div><div class="v" style="font-size:16px" id="wcRead">-</div></div>' +
        '</div>' +
      '</div>';
      var el = document.getElementById('wcIn');
      function calc() {
        var s = el.value;
        document.getElementById('wcTotal').textContent = s.length;
        document.getElementById('wcNoSpace').textContent = s.replace(/\s/g, '').length;
        document.getElementById('wcCjk').textContent = (s.match(/[\u4e00-\u9fff]/g) || []).length;
        var words = (s.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
        document.getElementById('wcWord').textContent = words;
        document.getElementById('wcLine').textContent = s ? s.split(/\n/).length : 0;
        document.getElementById('wcPara').textContent = s ? s.split(/\n\s*\n/).filter(function (x) { return x.trim(); }).length : 0;
        var cjk = (s.match(/[\u4e00-\u9fff]/g) || []).length;
        var min = Math.ceil(cjk / 300 + words / 200);
        document.getElementById('wcRead').textContent = min ? '约 ' + min + ' 分钟' : '-';
      }
      el.addEventListener('input', calc);
      calc();
    }
  });

  /* ============ JSON 格式化 ============ */
  T.register({
    id: 'json-format', icon: '📐', cat: 'text', name: 'JSON 格式化',
    desc: '格式化 / 压缩 / 校验 JSON 数据',
    keywords: 'json 格式化 format 压缩 校验',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('JSON 工具', 'JSON Tools') + '</h3>' +
        '<div class="field"><textarea id="jfIn" placeholder=\'{"name":"示例","list":[1,2,3]}\' style="min-height:170px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="jfFmt">' + L('格式化', 'Format') + '</button>' +
          '<button class="btn btn-ghost" id="jfMin">' + L('压缩', 'Minify') + '</button>' +
          '<button class="btn btn-ghost" id="jfClear">' + L('清空', 'Clear') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>输出</label><div class="out" id="jfOut"><span class="muted">结果将显示在这里</span></div></div>' +
      '</div>';
      function run(compact) {
        var raw = document.getElementById('jfIn').value.trim();
        if (!raw) { T.toast('请输入 JSON'); return; }
        try {
          var v = JSON.parse(raw);
          var out = compact ? JSON.stringify(v) : JSON.stringify(v, null, 2);
          var box = document.getElementById('jfOut');
          box.textContent = out;
          box.appendChild(T.mkCopyBtn(out));
        } catch (e) {
          document.getElementById('jfOut').textContent = 'JSON 解析失败：' + e.message;
        }
      }
      document.getElementById('jfFmt').addEventListener('click', function () { run(false); });
      document.getElementById('jfMin').addEventListener('click', function () { run(true); });
      document.getElementById('jfClear').addEventListener('click', function () {
        document.getElementById('jfIn').value = '';
        document.getElementById('jfOut').textContent = '结果将显示在这里';
      });
    }
  });

  /* ============ Base64 编解码 ============ */
  T.register({
    id: 'base64', icon: '🔡', cat: 'text', name: 'Base64 编解码',
    desc: '文本与 Base64 互转，完整支持中文与 UTF-8',
    keywords: 'base64 编码 解码 encode decode',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>Base64 编解码</h3>' +
        '<div class="field"><label>' + L('输入', 'Input') + '</label><textarea id="b64In" placeholder="' + L('输入文本或 Base64 字符串…', 'Enter text or Base64…') + '" style="min-height:150px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="b64Enc">' + L('编码', 'Encode') + '</button>' +
          '<button class="btn btn-ghost" id="b64Dec">' + L('解码', 'Decode') + '</button>' +
          '<button class="btn btn-ghost" id="b64Clear">' + L('清空', 'Clear') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>输出</label><div class="out" id="b64Out"><span class="muted">结果将显示在这里</span></div></div>' +
      '</div>';
      function b64encode(str) {
        var bytes = new TextEncoder().encode(str);
        var bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin);
      }
      function b64decode(str) {
        var bin = atob(str.replace(/\s+/g, ''));
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder().decode(bytes);
      }
      document.getElementById('b64Enc').addEventListener('click', function () {
        var s = document.getElementById('b64In').value;
        if (!s) { T.toast('请输入内容'); return; }
        var out = b64encode(s);
        var box = document.getElementById('b64Out');
        box.textContent = out;
        box.appendChild(T.mkCopyBtn(out));
      });
      document.getElementById('b64Dec').addEventListener('click', function () {
        var s = document.getElementById('b64In').value.trim();
        if (!s) { T.toast('请输入内容'); return; }
        try {
          var out = b64decode(s);
          var box = document.getElementById('b64Out');
          box.textContent = out;
          box.appendChild(T.mkCopyBtn(out));
        } catch (e) {
          document.getElementById('b64Out').textContent = '解码失败：不是有效的 Base64 字符串';
        }
      });
      document.getElementById('b64Clear').addEventListener('click', function () {
        document.getElementById('b64In').value = '';
        document.getElementById('b64Out').textContent = '结果将显示在这里';
      });
    }
  });

  /* ============ URL 编解码 ============ */
  T.register({
    id: 'url-codec', icon: '🔃', cat: 'text', name: 'URL 编解码',
    desc: 'URL 参数与特殊字符编码 / 解码',
    keywords: 'url encode decode 编码 解码 链接',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>URL 编解码</h3>' +
        '<div class="field"><textarea id="urlIn" placeholder="' + L('输入 URL 或文本…', 'Enter URL or text…') + '" style="min-height:130px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="urlEnc">' + L('编码', 'Encode') + '</button>' +
          '<button class="btn btn-ghost" id="urlDec">' + L('解码', 'Decode') + '</button>' +
          '<button class="btn btn-ghost" id="urlFull">' + L('编码（完整）', 'Encode (full)') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>输出</label><div class="out" id="urlOut"><span class="muted">结果将显示在这里</span></div></div>' +
        '<p class="muted">「编码」保留 : / ? &amp; = 等 URL 结构字符；「编码（完整）」使用 encodeURIComponent 全部转义。</p>' +
      '</div>';
      function run(fn) {
        var s = document.getElementById('urlIn').value;
        if (!s) { T.toast('请输入内容'); return; }
        var out = fn(s);
        var box = document.getElementById('urlOut');
        box.textContent = out;
        box.appendChild(T.mkCopyBtn(out));
      }
      document.getElementById('urlEnc').addEventListener('click', function () { run(encodeURI); });
      document.getElementById('urlFull').addEventListener('click', function () { run(encodeURIComponent); });
      document.getElementById('urlDec').addEventListener('click', function () {
        run(function (s) {
          try { return decodeURIComponent(s); }
          catch (e) { try { return decodeURI(s); } catch (e2) { return '解码失败：无法识别的内容'; } }
        });
      });
    }
  });

  /* ============ 大小写转换 ============ */
  T.register({
    id: 'case-convert', icon: '🔠', cat: 'text', name: '大小写转换',
    desc: '大写 / 小写 / 句首大写 / 标题格式一键转换',
    keywords: 'case 大小写 upper lower title',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('大小写转换', 'Case Converter') + '</h3>' +
        '<div class="field"><textarea id="ccIn" placeholder="' + L('输入文本…', 'Enter text…') + '" style="min-height:140px"></textarea></div>' +
        '<div class="row" style="flex-wrap:wrap">' +
          '<button class="btn btn-ghost" data-c="upper">全部大写</button>' +
          '<button class="btn btn-ghost" data-c="lower">全部小写</button>' +
          '<button class="btn btn-ghost" data-c="sentence">句首大写</button>' +
          '<button class="btn btn-ghost" data-c="title">标题格式</button>' +
          '<button class="btn btn-ghost" data-c="swap">大小写互换</button>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>输出</label><div class="out" id="ccOut"><span class="muted">结果将显示在这里</span></div></div>' +
      '</div>';
      host.querySelectorAll('[data-c]').forEach(function (b) {
        b.addEventListener('click', function () {
          var s = document.getElementById('ccIn').value;
          if (!s) { T.toast('请输入文本'); return; }
          var m = b.getAttribute('data-c'), out;
          if (m === 'upper') out = s.toUpperCase();
          else if (m === 'lower') out = s.toLowerCase();
          else if (m === 'sentence') out = s.toLowerCase().replace(/(^\s*|[.!?。！？]\s+)([a-z])/g, function (_, p, c) { return p + c.toUpperCase(); });
          else if (m === 'title') out = s.toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
          else out = s.split('').map(function (c) { return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase(); }).join('');
          var box = document.getElementById('ccOut');
          box.textContent = out;
          box.appendChild(T.mkCopyBtn(out));
        });
      });
    }
  });

  /* ============ 文本整理 ============ */
  T.register({
    id: 'text-tools', icon: '🧰', cat: 'text', name: '文本整理',
    desc: '排序 · 去重 · 反转 · 去空行 · 去空格',
    keywords: '文本 整理 排序 去重 sort dedupe',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('文本整理', 'Text Cleaner') + '</h3>' +
        '<div class="field"><textarea id="ttIn" placeholder="' + L('每行一条，粘贴要整理的文本…', 'One item per line…') + '" style="min-height:170px"></textarea></div>' +
        '<div class="row" style="flex-wrap:wrap">' +
          '<button class="btn btn-ghost" data-t="sort">' + L('升序排序', 'Sort ↑') + '</button>' +
          '<button class="btn btn-ghost" data-t="rsort">' + L('降序排序', 'Sort ↓') + '</button>' +
          '<button class="btn btn-ghost" data-t="dedupe">' + L('去重保留首个', 'Dedupe') + '</button>' +
          '<button class="btn btn-ghost" data-t="revline">' + L('行序反转', 'Reverse') + '</button>' +
          '<button class="btn btn-ghost" data-t="noempty">' + L('去除空行', 'Drop empty') + '</button>' +
          '<button class="btn btn-ghost" data-t="nospace">' + L('去除全部空格', 'Remove spaces') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>' + L('输出', 'Output') + '</label><div class="out" id="ttOut" style="min-height:120px"><span class="muted">' + L('结果将显示在这里', 'Result appears here') + '</span></div></div>' +
      '</div>';
      host.querySelectorAll('[data-t]').forEach(function (b) {
        b.addEventListener('click', function () {
          var s = document.getElementById('ttIn').value;
          if (!s) { T.toast(L('请输入文本', 'Enter some text')); return; }
          var m = b.getAttribute('data-t'), out;
          var lines = s.split('\n');
          if (m === 'sort') out = lines.slice().sort(function (a, b2) { return a.localeCompare(b2, 'zh'); }).join('\n');
          else if (m === 'rsort') out = lines.slice().sort(function (a, b2) { return b2.localeCompare(a, 'zh'); }).join('\n');
          else if (m === 'dedupe') out = lines.filter(function (v, i) { return lines.indexOf(v) === i; }).join('\n');
          else if (m === 'revline') out = lines.reverse().join('\n');
          else if (m === 'noempty') out = lines.filter(function (l) { return l.trim(); }).join('\n');
          else out = s.replace(/\s/g, '');
          var box = document.getElementById('ttOut');
          box.textContent = out;
          box.appendChild(T.mkCopyBtn(out));
        });
      });
    }
  });

  /* ============ 密码生成器 ============ */
  T.register({
    id: 'password', icon: '🔑', cat: 'text', name: '密码生成器',
    desc: '自定义长度与字符集的强密码批量生成',
    keywords: '密码 password 生成 随机 强密码',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('密码生成器', 'Password Generator') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('长度：', 'Length: ') + '<b id="pwLenV">16</b></label><input type="range" id="pwLen" min="6" max="48" value="16" style="width:100%;accent-color:var(--accent)"></div>' +
          '<div class="field"><label>' + L('生成数量', 'Count') + '</label><select id="pwCount"><option>1</option><option>5</option><option selected>10</option><option>20</option></select></div>' +
        '</div>' +
        '<div class="row" style="flex-wrap:wrap">' +
          '<label class="field" style="flex-direction:row;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pwU" checked style="accent-color:var(--accent)"> ' + L('大写字母', 'Uppercase') + '</label>' +
          '<label class="field" style="flex-direction:row;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pwL" checked style="accent-color:var(--accent)"> ' + L('小写字母', 'Lowercase') + '</label>' +
          '<label class="field" style="flex-direction:row;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pwN" checked style="accent-color:var(--accent)"> ' + L('数字', 'Digits') + '</label>' +
          '<label class="field" style="flex-direction:row;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pwS" style="accent-color:var(--accent)"> ' + L('符号', 'Symbols') + '</label>' +
          '<label class="field" style="flex-direction:row;align-items:center;gap:6px;margin-bottom:8px"><input type="checkbox" id="pwX" checked style="accent-color:var(--accent)"> ' + L('排除易混字符', 'No ambiguous') + '</label>' +
        '</div>' +
        '<button class="btn btn-primary" id="pwBtn">' + L('生成密码', 'Generate') + '</button>' +
        '<div class="chips" id="pwOut" style="flex-direction:column;align-items:stretch"></div>' +
      '</div>';
      var lenEl = document.getElementById('pwLen');
      lenEl.addEventListener('input', function () { document.getElementById('pwLenV').textContent = lenEl.value; });
      function strength(pw) {
        var score = 0;
        if (pw.length >= 12) score++; if (pw.length >= 18) score++;
        if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[^a-zA-Z0-9]/.test(pw)) score++;
        return Math.min(4, score + (pw.length >= 8 ? 1 : 0));
      }
      document.getElementById('pwBtn').addEventListener('click', function () {
        var len = parseInt(lenEl.value, 10);
        var pools = [];
        if (document.getElementById('pwU').checked) pools.push('ABCDEFGHJKLMNPQRSTUVWXYZ');
        if (document.getElementById('pwL').checked) pools.push('abcdefghijkmnpqrstuvwxyz');
        if (document.getElementById('pwN').checked) pools.push('23456789');
        if (document.getElementById('pwS').checked) pools.push('!@#$%^&*()-_=+[]{};:,.<>?');
        var avoid = document.getElementById('pwX').checked;
        if (avoid) {
          pools = pools.map(function (p) { return p.replace(/[0O1lI|5S2Z]/g, ''); }).filter(function (p) { return p; });
        }
        if (!pools.length) { T.toast('请至少选择一种字符类型'); return; }
        var all = pools.join('');
        var count = parseInt(document.getElementById('pwCount').value, 10);
        var out = document.getElementById('pwOut');
        out.innerHTML = '';
        for (var c = 0; c < count; c++) {
          var pw = '';
          /* 至少从每个池取一个，保证字符类型齐全 */
          var picks = pools.slice();
          while (pw.length < len) {
            if (picks.length) {
              var pi = Math.floor(Math.random() * picks.length);
              var p = picks[pi];
              pw += p[Math.floor(Math.random() * p.length)];
              picks.splice(pi, 1);
            } else {
              pw += all[Math.floor(Math.random() * all.length)];
            }
          }
          pw = pw.split('').sort(function () { return Math.random() - 0.5; }).join('');
          var sc = strength(pw);
          var chip = document.createElement('div');
          chip.style.cssText = 'display:flex;align-items:center;gap:10px;background:var(--bg-soft);border:1px solid var(--line);border-radius:10px;padding:10px 14px';
          chip.innerHTML = '<span style="font-family:var(--mono);font-size:14px;flex:1;word-break:break-all">' + T.esc(pw) + '</span>' +
            '<span class="strength" style="margin:0;width:64px;flex:none">' +
            '<i class="' + (sc >= 1 ? 'on1' : '') + '"></i><i class="' + (sc >= 2 ? 'on2' : '') + '"></i><i class="' + (sc >= 3 ? 'on3' : '') + '"></i><i class="' + (sc >= 4 ? 'on4' : '') + '"></i></span>' +
            '<button class="btn btn-ghost copy-btn" style="position:static;min-height:32px;height:32px">复制</button>';
          chip.querySelector('.copy-btn').addEventListener('click', function () { T.copyText(pw); });
          out.appendChild(chip);
        }
      });
    }
  });

  /* ============ 文本对比 ============ */
  T.register({
    id: 'text-diff', icon: '🆚', cat: 'text', name: '文本对比',
    desc: '按行对比两段文本，标出增删差异',
    keywords: 'diff 对比 差异 比较 文本',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('文本对比', 'Text Diff') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('原文本（A）', 'Original (A)') + '</label><textarea id="dfA" placeholder="' + L('原始文本…', 'Original…') + '" style="min-height:150px"></textarea></div>' +
          '<div class="field grow"><label>' + L('新文本（B）', 'New (B)') + '</label><textarea id="dfB" placeholder="' + L('对比文本…', 'Compare…') + '" style="min-height:150px"></textarea></div>' +
        '</div>' +
        '<button class="btn btn-primary" id="dfBtn">' + L('对比', 'Compare') + '</button>' +
        '<div class="field" style="margin-top:14px"><label>差异结果</label><div class="out" id="dfOut" style="font-family:var(--mono);font-size:13px;line-height:1.7;min-height:140px"><span class="muted">点击对比查看结果</span></div></div>' +
        '<p class="muted">绿色 <span style="color:var(--ok)">+</span> 为新增，红色 <span style="color:var(--err)">−</span> 为删除。超出 500 行时仅比较前 500 行。</p>' +
      '</div>';
      document.getElementById('dfBtn').addEventListener('click', function () {
        var a = document.getElementById('dfA').value.split('\n').slice(0, 500);
        var b = document.getElementById('dfB').value.split('\n').slice(0, 500);
        var diff = lcsDiff(a, b);
        var out = document.getElementById('dfOut');
        out.innerHTML = '';
        var add = 0, del = 0;
        diff.forEach(function (d) {
          if (d.type === 'same') {
            out.appendChild(span('  ' + d.text, '#9AA1AC'));
          } else if (d.type === 'add') {
            add++;
            out.appendChild(span('+ ' + d.text, 'var(--ok)'));
          } else {
            del++;
            out.appendChild(span('- ' + d.text, 'var(--err)'));
          }
        });
        out.appendChild(span('', ''));
        out.appendChild(span(L('新增 ', '+') + add + (isEn() ? ' added · ' : ' 行 · 删除 ') + del + (isEn() ? ' removed' : ' 行'), '#6B7280'));
        function span(text, color) {
          var s = document.createElement('span');
          s.style.color = color;
          s.style.whiteSpace = 'pre-wrap';
          s.style.display = 'block';
          s.textContent = text;
          return s;
        }
      });
      /* LCS 行级差异 */
      function lcsDiff(a, b) {
        var n = a.length, m = b.length;
        var dp = [];
        for (var i = 0; i <= n; i++) { dp[i] = new Array(m + 1).fill(0); }
        for (i = n - 1; i >= 0; i--) {
          for (var j = m - 1; j >= 0; j--) {
            dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
          }
        }
        var res = [];
        i = 0; j = 0;
        while (i < n && j < m) {
          if (a[i] === b[j]) { res.push({ type: 'same', text: a[i] }); i++; j++; }
          else if (dp[i + 1][j] >= dp[i][j + 1]) { res.push({ type: 'del', text: a[i] }); i++; }
          else { res.push({ type: 'add', text: b[j] }); j++; }
        }
        while (i < n) { res.push({ type: 'del', text: a[i] }); i++; }
        while (j < m) { res.push({ type: 'add', text: b[j] }); j++; }
        return res;
      }
    }
  });
})();
