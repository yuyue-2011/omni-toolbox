/* ============================================================
   万能工具箱 v2.9.1 · 差异化增强（4 款）
   时间戳批量转换 / 密码强度检测 / Base64 文件转码 / URL 参数解析
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }

  /* ============ 时间戳批量转换 ============ */
  T.register({
    id: 'ts-batch', cat: 'time', icon: '🧮',
    name: '时间戳批量转换',
    desc: '多行时间戳一次性批量转成本地日期',
    keywords: '时间戳 批量 转换 多行 timestamp batch',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('时间戳批量转换', 'Batch Timestamp Converter') + '</h3>' +
        '<div class="field"><label>' + L('时间戳（每行一个，秒或毫秒自动识别）', 'Timestamps (one per line, sec/ms auto)') + '</label>' +
        '<textarea id="tbIn" placeholder="1750000000&#10;1750000000000&#10;1609459200" style="min-height:130px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="tbBtn">' + L('批量转换', 'Convert all') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="tbNow">' + L('追加当前时间', 'Append now') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="tbClear">' + L('清空', 'Clear') + '</button></div></div>' +
        '<div id="tbOut"></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('日期（批量结果，每行一个）', 'Dates (batch result, one per line)') + '</label><textarea id="tbDates" style="min-height:110px" readonly></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="tbCopy">' + L('复制日期结果', 'Copy dates') + '</button></div></div>' +
      '</div>';
      function pad2(n) { return (n < 10 ? '0' : '') + n; }
      function fmt(d) {
        return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + ' ' +
          pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
      }
      function week(d) { return L('周', 'W') + '日一二三四五六'[d.getDay()]; }
      function convert() {
        var lines = $('tbIn').value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
        if (!lines.length) { out('tbOut', '<div class="empty"><b>' + L('请输入时间戳', 'Enter timestamps') + '</b></div>'); $('tbDates').value = ''; return; }
        var rows = [], dates = [], bad = 0;
        lines.forEach(function (ln) {
          var v = parseFloat(ln.replace(/[,，\s]/g, ''));
          if (isNaN(v)) { bad++; return; }
          var ms = Math.abs(v) < 1e12 ? v * 1000 : v;
          var d = new Date(ms);
          if (isNaN(d)) { bad++; return; }
          var s = fmt(d);
          rows.push('<tr><td class="mono">' + esc(String(v)) + '</td><td class="mono">' + esc(s) + '</td><td>' + week(d) + '</td></tr>');
          dates.push(s);
        });
        var html = '<div class="table-wrap" style="margin-top:12px"><table class="kv"><thead><tr><th>' +
          L('时间戳', 'Timestamp') + '</th><th>' + L('本地时间', 'Local time') + '</th><th>' + L('星期', 'Weekday') + '</th></tr></thead><tbody>' +
          rows.join('') + '</tbody></table></div>';
        if (bad) html += '<p class="note">' + L('已跳过 ', 'Skipped ') + bad + L(' 行无效内容', ' invalid line(s)') + '</p>';
        out('tbOut', html);
        $('tbDates').value = dates.join('\n');
      }
      $('tbBtn').addEventListener('click', convert);
      $('tbNow').addEventListener('click', function () {
        var cur = $('tbIn').value.trim();
        $('tbIn').value = (cur ? cur + '\n' : '') + Math.floor(Date.now() / 1000);
        convert();
      });
      $('tbClear').addEventListener('click', function () { $('tbIn').value = ''; $('tbDates').value = ''; out('tbOut', ''); });
      $('tbCopy').addEventListener('click', function () { T.copyText($('tbDates').value); });
    }
  });

  /* ============ 密码强度检测 ============ */
  T.register({
    id: 'pwd-check', cat: 'text', icon: '🔍',
    name: '密码强度检测',
    desc: '评估密码熵值、破解时间与改进建议',
    keywords: '密码 强度 检测 熵 安全 password strength entropy',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('密码强度检测', 'Password Strength Checker') + '</h3>' +
        '<div class="field"><label>' + L('输入要检测的密码（本地计算，不上传）', 'Enter password (computed locally, never uploaded)') + '</label>' +
        '<input id="pcIn" type="text" placeholder="password…" autocomplete="off" style="font-family:var(--mono)"></div>' +
        '<div class="strength" id="pcBar"><i></i><i></i><i></i><i></i></div>' +
        '<div class="stat-grid" style="margin-top:14px">' +
          '<div class="stat-box"><div class="k">' + L('熵值', 'Entropy') + '</div><div class="v" id="pcEnt">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('字符集规模', 'Pool size') + '</div><div class="v" id="pcPool">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('长度', 'Length') + '</div><div class="v" id="pcLen">-</div></div>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>' + L('暴力破解预估（10 亿次/秒）', 'Brute-force estimate (10⁹ guesses/s)') + '</label><div class="out" id="pcTime"><span class="muted">' + L('结果将显示在这里', 'Result appears here') + '</span></div></div>' +
        '<div id="pcTips"></div>' +
      '</div>';
      var COMMON = ['123456', '123456789', 'password', 'qwerty', 'abc123', '111111', '12345678', '12345', 'admin', 'letmein', '000000', 'iloveyou', '88888888', '666666', '123123'];
      function humanTime(secs) {
        if (secs < 1) return L('瞬间', 'instant');
        var units = [
          [31536000, L('年', 'y')], [86400, L('天', 'd')], [3600, L('小时', 'h')],
          [60, L('分钟', 'm')], [1, L('秒', 's')]
        ];
        var parts = [];
        for (var i = 0; i < units.length; i++) {
          var n = Math.floor(secs / units[i][0]);
          if (n > 0) { parts.push(n + ' ' + units[i][1]); secs -= n * units[i][0]; }
          if (parts.length >= 2) break;
        }
        return parts.join(' ') || L('不足 1 秒', 'under 1 second');
      }
      function analyze(pw) {
        var lower = /[a-z]/.test(pw), upper = /[A-Z]/.test(pw), digit = /\d/.test(pw), sym = /[^a-zA-Z0-9]/.test(pw);
        var pool = 0;
        if (lower) pool += 26;
        if (upper) pool += 26;
        if (digit) pool += 10;
        if (sym) pool += 33;
        var entropy = pw.length * Math.log2(pool || 1);
        var guesses = Math.pow(2, entropy) / 2;
        var secs = guesses / 1e9;
        var lvl = 1; // 有输入即至少亮一格（极弱）
        if (entropy >= 40) lvl = 2;
        if (entropy >= 56) lvl = 3;
        if (entropy >= 75) lvl = 4;
        return { pool: pool, entropy: entropy, secs: secs, lvl: lvl, lower: lower, upper: upper, digit: digit, sym: sym };
      }
      $('pcIn').addEventListener('input', function () {
        var pw = $('pcIn').value;
        if (!pw) {
          $('pcBar').querySelectorAll('i').forEach(function (i) { i.className = ''; });
          $('pcEnt').textContent = '-'; $('pcPool').textContent = '-'; $('pcLen').textContent = '-';
          $('pcTime').innerHTML = '<span class="muted">' + L('结果将显示在这里', 'Result appears here') + '</span>';
          out('pcTips', '');
          return;
        }
        var a = analyze(pw);
        var NAMES = ['', 'on1', 'on2', 'on3', 'on4'];
        $('pcBar').querySelectorAll('i').forEach(function (i, idx) {
          i.className = idx < a.lvl ? NAMES[a.lvl] : '';
        });
        $('pcEnt').textContent = a.entropy.toFixed(1) + ' bit';
        $('pcPool').textContent = a.pool;
        $('pcLen').textContent = pw.length;
        $('pcTime').textContent = humanTime(a.secs);
        $('pcTime').appendChild(T.mkCopyBtn(humanTime(a.secs)));
        var tips = [];
        if (pw.length < 12) tips.push(L('长度不足 12 位，建议加长', 'Shorter than 12 chars — make it longer'));
        if (!a.upper) tips.push(L('缺少大写字母', 'No uppercase letters'));
        if (!a.lower) tips.push(L('缺少小写字母', 'No lowercase letters'));
        if (!a.digit) tips.push(L('缺少数字', 'No digits'));
        if (!a.sym) tips.push(L('缺少符号', 'No symbols'));
        if (/^[0-9]+$/.test(pw)) tips.push(L('纯数字密码极易被穷举', 'All-digit passwords are trivially guessed'));
        if (/(.)\1{2,}/.test(pw)) tips.push(L('含连续重复字符', 'Contains repeated characters'));
        if (COMMON.indexOf(pw.toLowerCase()) >= 0) tips.push(L('这是常见密码，请立即更换', 'This is a common password — change it now'));
        if (!tips.length) tips.push(L('组合良好，继续保持', 'Good composition — keep it up'));
        out('pcTips', '<ul class="note" style="padding-left:18px;margin-top:10px">' +
          tips.map(function (tp) { return '<li>' + esc(tp) + '</li>'; }).join('') + '</ul>');
      });
    }
  });

  /* ============ Base64 文件转码 ============ */
  T.register({
    id: 'b64-file', cat: 'codec', icon: '📦',
    name: 'Base64 文件转码',
    desc: '文件与 Base64 互转（拖入即转，可下载还原）',
    keywords: 'base64 文件 file 转码 拖拽 dataurl',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('文件 → Base64', 'File → Base64') + '</h3>' +
        '<div class="field"><label>' + L('选择或拖入文件', 'Choose or drop a file') + '</label>' +
        '<input type="file" id="bfFile" style="font-size:13px"></div>' +
        '<div id="bfDrop" style="border:1.5px dashed var(--line);border-radius:12px;padding:18px;text-align:center;color:var(--ink-faint);font-size:13px;transition:border-color .15s,background .15s">' +
        L('拖放文件到此处', 'Drop a file here') + '</div>' +
        '<div id="bfMeta"></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('Base64 输出（Data URL）', 'Base64 output (Data URL)') + '</label><textarea id="bfOut" style="min-height:130px" readonly></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="bfCopy">' + L('复制 Base64', 'Copy Base64') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="bfPure">' + L('仅复制编码体', 'Copy raw only') + '</button></div></div>' +
      '</div>' +
      '<div class="panel"><h3>' + L('Base64 → 文件', 'Base64 → File') + '</h3>' +
        '<div class="field"><label>' + L('粘贴 Base64 或 Data URL', 'Paste Base64 or Data URL') + '</label><textarea id="bfIn" style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field grow"><label>' + L('文件名', 'Filename') + '</label><input id="bfName" placeholder="download.bin"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="bfDl">' + L('解码并下载', 'Decode & download') + '</button></div></div>' +
        '<div id="bfErr"></div>' +
      '</div>';
      var cur = '';
      function human(n) {
        if (n < 1024) return n + ' B';
        if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
        return (n / 1048576).toFixed(1) + ' MB';
      }
      function handle(file) {
        if (!file) return;
        T.readFile(file, function (url) {
          cur = url;
          $('bfOut').value = url;
          out('bfMeta', '<div class="stat-grid" style="margin-top:12px">' +
            '<div class="stat-box"><div class="k">' + L('文件名', 'Name') + '</div><div class="v" style="font-size:14px">' + esc(file.name) + '</div></div>' +
            '<div class="stat-box"><div class="k">' + L('类型', 'Type') + '</div><div class="v" style="font-size:14px">' + esc(file.type || L('未知', 'unknown')) + '</div></div>' +
            '<div class="stat-box"><div class="k">' + L('大小', 'Size') + '</div><div class="v">' + human(file.size) + '</div></div></div>');
          $('bfName').value = file.name;
        });
      }
      $('bfFile').addEventListener('change', function () { handle(this.files[0]); });
      var drop = $('bfDrop');
      ['dragenter', 'dragover'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.style.borderColor = 'var(--accent)'; drop.style.background = 'color-mix(in srgb,var(--accent) 8%,transparent)'; });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.style.borderColor = ''; drop.style.background = ''; });
      });
      drop.addEventListener('drop', function (e) {
        var f = e.dataTransfer && e.dataTransfer.files[0];
        if (f) handle(f);
      });
      $('bfCopy').addEventListener('click', function () { T.copyText($('bfOut').value); });
      $('bfPure').addEventListener('click', function () {
        var u = $('bfOut').value;
        T.copyText(u.indexOf(',') >= 0 ? u.slice(u.indexOf(',') + 1) : u);
      });
      $('bfDl').addEventListener('click', function () {
        var raw = $('bfIn').value.trim();
        out('bfErr', '');
        if (!raw) { out('bfErr', '<div class="msg err">' + L('请先粘贴 Base64 内容', 'Paste Base64 content first') + '</div>'); return; }
        var body = raw, mime = 'application/octet-stream';
        var m = /^data:([^;,]*)(;base64)?,(.*)$/s.exec(raw);
        if (m) { if (m[1]) mime = m[1]; body = m[3]; }
        try {
          var bin = atob(body.replace(/\s+/g, ''));
          var bytes = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          var name = $('bfName').value.trim() || 'download.bin';
          T.blobDownload(new Blob([bytes], { type: mime }), name);
          out('bfErr', '<div class="msg ok">' + L('已下载 ', 'Downloaded ') + esc(name) + ' (' + human(bytes.length) + ')</div>');
        } catch (e) {
          out('bfErr', '<div class="msg err">' + L('解码失败：不是有效的 Base64', 'Decode failed: invalid Base64') + '</div>');
        }
      });
    }
  });

  /* ============ URL 参数解析 ============ */
  T.register({
    id: 'url-params', cat: 'text', icon: '🔗',
    name: 'URL 参数解析',
    desc: '拆解 URL 为协议 / 主机 / 路径 / 参数表',
    keywords: 'url 参数 query 解析 键值对 parse',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('URL 参数解析', 'URL Parameter Parser') + '</h3>' +
        '<div class="field"><label>' + L('输入完整 URL', 'Enter full URL') + '</label>' +
        '<input id="upIn" placeholder="https://example.com/search?q=tools&page=2" style="font-family:var(--mono)"></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="upBtn">' + L('解析', 'Parse') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="upSample">' + L('示例', 'Sample') + '</button></div></div>' +
        '<div id="upOut"></div>' +
      '</div>';
      function decode(s) { try { return decodeURIComponent(s.replace(/\+/g, ' ')); } catch (e) { return s; } }
      function parse() {
        var raw = $('upIn').value.trim();
        if (!raw) { out('upOut', '<div class="empty"><b>' + L('请输入 URL', 'Enter a URL') + '</b></div>'); return; }
        var u;
        try { u = new URL(raw); }
        catch (e) {
          try { u = new URL('http://' + raw); }
          catch (e2) { out('upOut', '<div class="empty"><b>' + L('无法解析该 URL', 'Could not parse this URL') + '</b></div>'); return; }
        }
        var meta = [
          [L('协议', 'Protocol'), u.protocol],
          [L('主机', 'Host'), u.host],
          [L('路径', 'Path'), u.pathname],
          [L('查询串', 'Query'), u.search || '-'],
          [L('锚点', 'Hash'), u.hash || '-']
        ];
        var rows = [];
        u.searchParams.forEach(function (v, k) { rows.push([k, v]); });
        var html = '<div class="table-wrap" style="margin-top:12px"><table class="kv"><thead><tr><th>' +
          L('项目', 'Item') + '</th><th>' + L('值', 'Value') + '</th></tr></thead><tbody>' +
          meta.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td class="mono">' + esc(r[1]) + '</td></tr>'; }).join('') +
          '</tbody></table></div>';
        if (rows.length) {
          html += '<div class="field" style="margin-top:16px"><label>' + L('参数键值对（', 'Query params (') + rows.length + L(' 个，已解码）', ', decoded)') + '</label>' +
            '<div class="table-wrap"><table class="kv"><thead><tr><th>#</th><th>' + L('键', 'Key') + '</th><th>' + L('值', 'Value') + '</th></tr></thead><tbody>' +
            rows.map(function (r, i) {
              return '<tr><td>' + (i + 1) + '</td><td class="mono">' + esc(decode(r[0])) + '</td><td class="mono">' + esc(decode(r[1])) + '</td></tr>';
            }).join('') + '</tbody></table></div></div>';
          var json = {};
          rows.forEach(function (r) { json[decode(r[0])] = decode(r[1]); });
          html += '<div class="field"><label>JSON</label><div class="out" id="upJson">' + esc(JSON.stringify(json, null, 2)) + '</div></div>';
        } else {
          html += '<p class="note">' + L('该 URL 没有查询参数。', 'This URL has no query params.') + '</p>';
        }
        out('upOut', html);
        var j = $('upJson');
        if (j) j.appendChild(T.mkCopyBtn(j.textContent));
      }
      $('upBtn').addEventListener('click', parse);
      $('upSample').addEventListener('click', function () {
        $('upIn').value = 'https://www.example.com/search?keyword=' + encodeURIComponent('万能工具箱') + '&page=2&size=20&lang=zh-CN#results';
        parse();
      });
    }
  });
})();
