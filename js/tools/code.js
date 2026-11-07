/* ============================================================
   万能工具箱 · 编程类工具（6 款：正则/格式化/HTTP/SQL/Unicode/速查）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 正则表达式测试 ============ */
  T.register({
    id: 'regex-test', icon: '🧪', cat: 'code', name: '正则测试', net: false,
    desc: '可视化测试正则表达式，高亮匹配结果',
    keywords: '正则 测试 regex 匹配 表达式 高亮 捕获组',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('正则表达式测试', 'Regex Tester') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>正则表达式</label><input id="rxPat" placeholder="例如：\\d{3,}" spellcheck="false" style="font-family:var(--mono)"></div>' +
          '<div class="field"><label>修饰符</label><input id="rxFlag" value="g" style="width:70px;font-family:var(--mono)"></div>' +
        '</div>' +
        '<div class="field"><label>测试文本</label><textarea id="rxText" placeholder="输入要匹配的文本…" style="min-height:150px"></textarea></div>' +
        '<div id="rxInfo" class="muted" style="margin-top:8px"></div>' +
        '<div class="hl-out" id="rxOut" style="margin-top:8px"></div>' +
        '<div id="rxCaps" style="margin-top:10px"></div>' +
        '<p class="note">支持 g / i / m / s / u / y 修饰符；匹配项以琥珀色高亮。测试文本建议不超过 2 万字符，避免复杂回溯导致卡顿。</p>' +
      '</div>';
      function run() {
        var pat = document.getElementById('rxPat').value;
        var flags = document.getElementById('rxFlag').value;
        var text = document.getElementById('rxText').value;
        var info = document.getElementById('rxInfo');
        var out = document.getElementById('rxOut');
        var caps = document.getElementById('rxCaps');
        caps.innerHTML = '';
        if (!pat) { out.textContent = '输入正则表达式后自动测试…'; info.textContent = ''; return; }
        if (text.length > 50000) { out.textContent = '文本过长，已跳过高亮'; info.textContent = ''; return; }
        var re;
        try { re = new RegExp(pat, flags); }
        catch (e) { out.innerHTML = '<span class="msg err">正则错误：' + T.esc(e.message) + '</span>'; info.textContent = ''; return; }
        var count = 0, last = 0, html = '', m;
        try {
          while ((m = re.exec(text)) !== null) {
            count++;
            html += T.esc(text.slice(last, m.index)) + '<mark>' + T.esc(m[0]) + '</mark>';
            last = m.index + m[0].length;
            if (m.index === re.lastIndex) re.lastIndex++;
            if (count > 20000) break;
          }
        } catch (e) {
          out.innerHTML = '<span class="msg err">执行异常（可能正回溯过深）：' + T.esc(e.message) + '</span>';
          return;
        }
        html += T.esc(text.slice(last));
        if (!flags.indexOf('g') >= 0 && count === 1) {
          /* 显示捕获组 */
          var capsHtml = '<div class="table-wrap"><table class="cap-table"><tr><th>组</th><th>值</th></tr>';
          for (var i = 0; i < m.length; i++) {
            capsHtml += '<tr><td>' + i + '</td><td><span class="mono">' + T.esc(m[i] == null ? '(未匹配)' : m[i]) + '</span></td></tr>';
          }
          capsHtml += '</table></div>';
          caps.innerHTML = capsHtml;
        }
        out.innerHTML = html || '<span class="muted">（无匹配）</span>';
        info.innerHTML = '匹配 <b>' + count + '</b> 处 · 文本 ' + text.length + ' 字符' + (count ? ' · <button class="btn btn-ghost copy-btn" style="min-height:26px;height:26px;padding:0 10px;font-size:11px">' + L('复制匹配列表', 'Copy matches') + '</button>' : '');
        var cp = info.querySelector('.copy-btn');
        if (cp) cp.addEventListener('click', function () {
          var list = [];
          re.lastIndex = 0;
          var mm;
          while ((mm = re.exec(text)) !== null) { list.push(mm[0]); if (mm.index === re.lastIndex) re.lastIndex++; }
          T.copyText(list.join('\n'));
        });
      }
      ['rxPat', 'rxFlag', 'rxText'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', run);
      });
      run();
    }
  });

  /* ============ 代码格式化 ============ */
  T.register({
    id: 'code-fmt', icon: '🖊️', cat: 'code', name: '代码格式化', net: false,
    desc: 'JSON / HTML / CSS / SQL 一键格式化与压缩',
    keywords: '代码 格式化 美化 json html css sql 压缩 排版',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('代码格式化', 'Code Formatter') + '</h3>' +
        '<div class="row">' +
          '<div class="field"><label>语言</label><select id="cfLang"><option>JSON</option><option>HTML</option><option>CSS</option><option>SQL</option></select></div>' +
          '<div class="field"><label>缩进</label><select id="cfIndent"><option>2 空格</option><option selected>4 空格</option><option>Tab</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="cfBtn">' + L('格式化', 'Format') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="cfMin">' + L('压缩', 'Minify') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="cfCopy">' + L('复制结果', 'Copy') + '</button></div>' +
        '</div>' +
        '<div class="field"><textarea id="cfIn" placeholder="粘贴代码…" spellcheck="false" style="min-height:220px"></textarea></div>' +
        '<div id="cfOut" class="out" style="min-height:60px"></div>' +
      '</div>';
      function indentUnit() {
        var v = document.getElementById('cfIndent').value;
        return v === 'Tab' ? '\t' : new Array(parseInt(v, 10) + 1).join(' ');
      }
      function fmtJSON(s, indent) {
        return JSON.stringify(JSON.parse(s), null, indent);
      }
      function fmtCSS(s, indent) {
        var out = '';
        var depth = 0;
        var token = s.replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*([{}:;,])\s*/g, '$1');
        var i = 0;
        while (i < token.length) {
          var c = token[i];
          if (c === '{') {
            out += ' {' + '\n';
            depth++;
            i++;
          } else if (c === '}') {
            depth = Math.max(0, depth - 1);
            out = out.replace(/[ \t]+$/m, '');
            out += '\n' + new Array(depth + 1).join(indent) + '}\n';
            i++;
          } else if (c === ';') {
            out += ';\n';
            i++;
          } else if (c === ':') {
            out += ': ';
            i++;
          } else {
            var end = i;
            while (end < token.length && '{;}:'.indexOf(token[end]) < 0) end++;
            var chunk = token.slice(i, end).trim();
            if (chunk) out += new Array(depth + 1).join(indent) + chunk;
            i = end;
          }
        }
        return out.replace(/\n{3,}/g, '\n\n').trim();
      }
      function fmtHTML(s, indent) {
        var voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
        var out = '';
        var depth = 0;
        var i = 0;
        var rest = s;
        var re = /<!--[\s\S]*?-->|<[^>]+>|[^<]+/g;
        var parts = s.match(re) || [];
        parts.forEach(function (p) {
          var trim = p.trim();
          if (!trim) return;
          if (trim.indexOf('<!--') === 0) {
            out += new Array(depth + 1).join(indent) + trim + '\n';
            return;
          }
          if (trim.indexOf('<') === 0) {
            var tag = (trim.match(/^<\/?([a-zA-Z0-9]+)/) || [])[1] || '';
            var closing = trim.indexOf('</') === 0;
            var selfClose = /\/>$/.test(trim) || (voidTags.indexOf(tag.toLowerCase()) >= 0 && !closing);
            if (closing) depth = Math.max(0, depth - 1);
            out += new Array(depth + 1).join(indent) + trim + '\n';
            if (!closing && !selfClose) depth++;
          } else {
            out += new Array(depth + 1).join(indent) + trim + '\n';
          }
        });
        return out.replace(/\n{3,}/g, '\n\n').trim();
      }
      var SQL_KW = /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|INDEX|UNION|ALL|AND|OR|NOT|NULL|AS|DISTINCT|CASE|WHEN|THEN|ELSE|END|IN|EXISTS|BETWEEN|LIKE|IS|ASC|DESC|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|UNIQUE|COMMENT)\b/i;
      function fmtSQL(s, indent) {
        var lines = s.replace(/;[ \t]*\n?/g, ';\n').split('\n');
        var out = [];
        var depth = 0;
        lines.forEach(function (raw) {
          var line = raw.trim();
          if (!line) return;
          var upper = line.toUpperCase();
          var leading = '';
          if (/^(FROM|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|WHERE|GROUP|ORDER|HAVING|LIMIT|UNION|ON|AND|OR)\b/.test(upper) || /^(LEFT|RIGHT|INNER|OUTER|CROSS|FULL)\s+JOIN/.test(upper)) {
            if (depth > 0) depth--;
            leading = new Array(depth + 1).join(indent);
            if (/^(WHERE|HAVING|UNION)\b/.test(upper)) { /* 保持同级 */ }
          } else if (/^\)/.test(line)) {
            depth = Math.max(0, depth - 1);
            leading = new Array(depth + 1).join(indent);
          } else {
            leading = new Array(depth + 1).join(indent);
          }
          if (/(^|\s)(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(line) && !/^SELECT/.test(upper)) {
            /* 语句起始行 */
          }
          if (/^SELECT\b/i.test(upper) || /^\(/.test(line)) {
            if (/^SELECT\b/i.test(upper)) depth = 1;
          }
          out.push(leading + line);
          if (/\($/.test(line)) depth++;
        });
        return out.join('\n');
      }
      document.getElementById('cfBtn').addEventListener('click', function () {
        var s = document.getElementById('cfIn').value;
        var lang = document.getElementById('cfLang').value;
        var indent = indentUnit();
        var out = document.getElementById('cfOut');
        if (!s.trim()) { T.toast('请输入代码'); return; }
        try {
          var res;
          if (lang === 'JSON') res = fmtJSON(s, indent === '\t' ? '\t' : indent.length);
          else if (lang === 'CSS') res = fmtCSS(s, indent);
          else if (lang === 'HTML') res = fmtHTML(s, indent);
          else res = fmtSQL(s, indent);
          out.textContent = res;
        } catch (e) {
          out.innerHTML = '<span class="msg err">格式化失败：' + T.esc(e.message) + '（请检查语法）</span>';
        }
      });
      document.getElementById('cfMin').addEventListener('click', function () {
        var s = document.getElementById('cfIn').value;
        var lang = document.getElementById('cfLang').value;
        var out = document.getElementById('cfOut');
        if (!s.trim()) { T.toast('请输入代码'); return; }
        try {
          if (lang === 'JSON') out.textContent = JSON.stringify(JSON.parse(s));
          else if (lang === 'CSS') out.textContent = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
          else if (lang === 'HTML') out.textContent = s.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
          else out.textContent = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, ' ').replace(/\s{2,}/g, ' ').trim();
        } catch (e) {
          out.innerHTML = '<span class="msg err">压缩失败：' + T.esc(e.message) + '</span>';
        }
      });
      document.getElementById('cfCopy').addEventListener('click', function () {
        var t = document.getElementById('cfOut').textContent;
        if (!t) { T.toast('没有可复制的内容'); return; }
        T.copyText(t);
      });
    }
  });

  /* ============ HTTP 请求调试 ============ */
  T.register({
    id: 'http-client', icon: '📤', cat: 'code', name: 'HTTP 调试', net: true,
    netNote: '在浏览器内直接发起 fetch 请求；目标接口需允许跨域（CORS），否则请求会被浏览器拦截。',
    desc: '发送 GET / POST 请求，查看状态码、响应头与正文',
    keywords: 'http 请求 调试 api 接口 fetch post get 测试',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('HTTP 请求调试', 'HTTP Debug') + '</h3>' +
        '<div class="row">' +
          '<div class="field"><label>方法</label><select id="hcMethod"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option><option>HEAD</option></select></div>' +
          '<div class="field grow"><label>URL</label><input id="hcUrl" placeholder="https://api.example.com/data" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="hcSend">' + L('发送', 'Send') + '</button></div>' +
        '</div>' +
        '<div class="field"><label>请求头（每行 key: value）</label><textarea id="hcHeaders" class="short" placeholder="Content-Type: application/json&#10;Authorization: Bearer xxx" spellcheck="false"></textarea></div>' +
        '<div class="field"><label>请求体（POST / PUT）</label><textarea id="hcBody" class="short" spellcheck="false"></textarea></div>' +
        '<div id="hcOut" style="margin-top:8px"></div>' +
        '<p class="note">受浏览器同源策略限制：跨域接口若未返回 CORS 头将被拦截（显示 NetworkError）。建议用允许跨域的测试接口验证，如 https://httpbin.org/get 。</p>' +
      '</div>';
      document.getElementById('hcSend').addEventListener('click', function () {
        var url = document.getElementById('hcUrl').value.trim();
        var method = document.getElementById('hcMethod').value;
        if (!url) { T.toast('请输入 URL'); return; }
        var out = document.getElementById('hcOut');
        out.innerHTML = '<div class="msg">请求中…</div>';
        var headers = {};
        document.getElementById('hcHeaders').value.split('\n').forEach(function (l) {
          var i = l.indexOf(':');
          if (i > 0) headers[l.slice(0, i).trim()] = l.slice(i + 1).trim();
        });
        var opt = { method: method, headers: headers };
        var body = document.getElementById('hcBody').value;
        if (body && method !== 'GET' && method !== 'HEAD') opt.body = body;
        var t0 = performance.now();
        fetch(url, opt).then(function (r) {
          var ms = Math.round(performance.now() - t0);
          var resH = '';
          r.headers.forEach(function (v, k) { resH += k + ': ' + v + '\n'; });
          var type = (r.headers.get('content-type') || '');
          var bodyP = type.indexOf('json') >= 0 ? r.json() : r.text();
          return Promise.all([Promise.resolve(r.status), Promise.resolve(r.statusText), bodyP, Promise.resolve(resH), Promise.resolve(ms)]);
        }).then(function (d) {
          var st = d[0], stt = d[1], b = d[2], hd = d[3], ms = d[4];
          var bodyStr = typeof b === 'string' ? b : JSON.stringify(b, null, 2);
          out.innerHTML =
            '<div class="result-list"><div class="rl ' + (st < 400 ? 'ok' : 'err') + '"><span class="n">' + st + '</span><b>' + stt + '</b><span class="muted" style="margin-left:auto">' + ms + ' ms</span></div></div>' +
            '<div style="display:grid;gap:10px;margin-top:10px;grid-template-columns:1fr 1fr" class="hc-cols">' +
              '<div class="out" style="min-height:120px;max-height:240px;overflow:auto;white-space:pre">' + T.esc(hd) + '</div>' +
              '<div class="out" style="min-height:120px;max-height:240px;overflow:auto;white-space:pre-wrap">' + T.esc(bodyStr.slice(0, 50000)) + '</div>' +
            '</div>';
        }, function (e) {
          var ms = Math.round(performance.now() - t0);
          out.innerHTML = '<div class="msg err">请求失败：' + T.esc(e.message || '网络错误') + '（' + ms + ' ms，多为 CORS 拦截或网络不可达）</div>';
        });
      });
      document.getElementById('hcUrl').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('hcSend').click();
      });
    }
  });

  /* ============ Unicode 转换 ============ */
  T.register({
    id: 'unicode', icon: '🔣', cat: 'code', name: 'Unicode 转换', net: false,
    desc: '文本 ↔ \\u 转义互转，查看字符编码信息',
    keywords: 'unicode 转义 编码 转换 字符 ascii 码点',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Unicode / 转义转换', 'Unicode / Escape') + '</h3>' +
        '<div class="field"><label>原始文本</label><textarea id="ucIn" placeholder="输入文本…" style="min-height:120px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="ucEncode">→ \\uXXXX 转义</button>' +
          '<button class="btn btn-ghost" id="ucDecode">← 转义还原</button>' +
          '<button class="btn btn-ghost" id="ucInfo">' + L('字符信息', 'Inspect') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:12px"><label>结果</label><div class="out" id="ucOut" style="min-height:60px"></div></div>' +
        '<div id="ucTable" style="margin-top:10px"></div>' +
      '</div>';
      document.getElementById('ucEncode').addEventListener('click', function () {
        var s = document.getElementById('ucIn').value;
        var out = '';
        for (var i = 0; i < s.length; i++) {
          var cp = s.codePointAt(i);
          if (cp > 0xFFFF) { out += '\\u{' + cp.toString(16) + '}'; i++; }
          else if (cp > 127) out += '\\u' + ('0000' + cp.toString(16)).slice(-4);
          else out += s[i];
        }
        document.getElementById('ucOut').textContent = out;
      });
      document.getElementById('ucDecode').addEventListener('click', function () {
        var s = document.getElementById('ucIn').value;
        var out = s
          .replace(/\\u\{([0-9a-fA-F]+)\}/g, function (m, h) { return String.fromCodePoint(parseInt(h, 16)); })
          .replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
          .replace(/\\x([0-9a-fA-F]{2})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
          .replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        document.getElementById('ucOut').textContent = out;
      });
      document.getElementById('ucInfo').addEventListener('click', function () {
        var s = document.getElementById('ucIn').value;
        if (!s) { T.toast('请输入文本'); return; }
        var rows = [];
        for (var i = 0; i < s.length; i++) {
          var cp = s.codePointAt(i);
          var ch = s[i];
          if (cp > 0xFFFF) { ch = s.slice(i, i + 2); i++; }
          rows.push([ch, 'U+' + ('0000' + cp.toString(16)).toUpperCase().slice(-4), cp, cp.toString(2)]);
          if (rows.length >= 50) break;
        }
        var h = '<div class="table-wrap"><table class="kv"><tr><th>字符</th><th>码点</th><th>十进制</th><th>UTF-8</th></tr>';
        rows.forEach(function (r) {
          var utf8 = encodeURIComponent(r[0]).replace(/%/g, ' ').trim();
          h += '<tr><td style="font-size:18px">' + T.esc(r[0]) + '</td><td class="mono">' + r[1] + '</td><td class="mono">' + r[2] + '</td><td class="mono" style="color:var(--ink-faint)">' + T.esc(utf8) + '</td></tr>';
        });
        h += '</table></div>';
        document.getElementById('ucTable').innerHTML = h;
      });
    }
  });

  /* ============ 编程速查表 ============ */
  T.register({
    id: 'cheatsheet', icon: '📜', cat: 'code', name: '编程速查表', net: false,
    desc: 'HTML / CSS / JS / Git / 正则常用速查',
    keywords: '速查 编程 备忘 cheatsheet html css js git 正则 手册',
    render: function (host) {
      var tabs = [
        ['Git', [
          ['git init', '初始化仓库'],
          ['git clone <url>', '克隆远程仓库'],
          ['git status', '查看工作区状态'],
          ['git add .', '暂存所有改动'],
          ['git commit -m "msg"', '提交暂存内容'],
          ['git pull', '拉取远程更新'],
          ['git push', '推送本地提交'],
          ['git branch', '查看分支'],
          ['git checkout -b <name>', '新建并切换分支'],
          ['git merge <branch>', '合并分支'],
          ['git stash', '暂存当前改动'],
          ['git log --oneline', '简洁提交历史'],
          ['git reset --hard HEAD~1', '回退上一个提交（慎用）'],
          ['git revert <hash>', '撤销指定提交']
        ]],
        ['HTML', [
          ['<!DOCTYPE html>', '文档类型声明'],
          ['<meta charset="utf-8">', '字符编码'],
          ['<meta name="viewport">', '移动端视口'],
          ['<link rel="stylesheet" href="a.css">', '引入样式'],
          ['<script src="a.js" defer></script>', '引入脚本'],
          ['<img src alt loading="lazy">', '图片（延迟加载）'],
          ['<a href target="_blank" rel="noopener">', '新窗口链接'],
          ['<details><summary>', '折叠面板'],
          ['<dialog>', '原生对话框'],
          ['data-* 属性', '自定义数据属性']
        ]],
        ['CSS', [
          ['display:flex / grid', '布局模式'],
          ['gap: 8px', '子元素间距'],
          ['position:sticky;top:0', '吸顶'],
          ['aspect-ratio:16/9', '宽高比'],
          ['clamp(1rem,2vw,2rem)', '响应式字号'],
          ['color-mix(in srgb,a 50%,b)', '颜色混合'],
          ['backdrop-filter:blur(8px)', '背景模糊（毛玻璃）'],
          [':root{--x:#fff}', 'CSS 变量定义'],
          ['var(--x)', '变量引用'],
          ['@media (max-width:720px)', '响应式断点'],
          ['transition:all .2s', '过渡动画'],
          ['scroll-behavior:smooth', '平滑滚动']
        ]],
        ['JS', [
          ['const / let / (不推荐 var)', '变量声明'],
          ['arrow fn: (a,b)=>a+b', '箭头函数'],
          ['template: `x ${y}`', '模板字符串'],
          ['?? 空值合并', 'null/undefined 兜底'],
          ['?. 可选链', '安全访问属性'],
          ['[...arr] / {...obj}', '展开语法'],
          ['arr.map/filter/reduce', '数组高阶函数'],
          ['Promise.all([...])', '并行等待'],
          ['async/await', '异步语法'],
          ['fetch(url).then(r=>r.json())', '请求 JSON'],
          ['localStorage.setItem/getItem', '本地存储'],
          ['document.querySelector', 'DOM 选择']
        ]],
        ['正则', [
          ['\\d', '数字'], ['\\w', '字母数字下划线'], ['\\s', '空白'],
          ['.', '任意字符（除换行）'], ['^ $', '开头 结尾'], ['* + ?', '0+ / 1+ / 0-1 次'],
          ['{n,m}', 'n 到 m 次'], ['[abc]', '字符集'], ['(a|b)', '分组或'],
          ['(?:x)', '非捕获组'], ['(?=x)', '前瞻断言'], ['i/g/m/s/u', '常用修饰符']
        ]]
      ];
      var h = '<div class="panel"><h3>' + L('编程速查表', 'Coding Cheatsheet') + '</h3><div class="tabs" id="csTabs">' +
        tabs.map(function (t, i) { return '<button data-i="' + i + '" class="' + (i === 0 ? 'active' : '') + '">' + t[0] + '</button>'; }).join('') +
        '</div><div id="csOut"></div></div>';
      host.innerHTML = h;
      function render(i) {
        var t = tabs[i];
        var hh = '<div class="table-wrap"><table class="kv"><tr><th>写法 / 命令</th><th>说明</th></tr>';
        t[1].forEach(function (r) {
          hh += '<tr><td><span class="mono">' + T.esc(r[0]) + '</span></td><td>' + r[1] + '</td></tr>';
        });
        hh += '</table></div>';
        document.getElementById('csOut').innerHTML = hh;
      }
      document.getElementById('csTabs').addEventListener('click', function (e) {
        var b = e.target.closest('[data-i]');
        if (!b) return;
        document.querySelectorAll('#csTabs button').forEach(function (x, i) { x.classList.toggle('active', i === parseInt(b.getAttribute('data-i'), 10)); });
        render(parseInt(b.getAttribute('data-i'), 10));
      });
      render(0);
    }
  });
})();
