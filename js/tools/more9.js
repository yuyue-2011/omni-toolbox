/* ============================================================
   万能工具箱 · 工具扩充（W2 批次，10 款）
   命名风格转换 / URL Slug / HTML→Markdown / XML↔JSON / JSON→TS
   罗马数字 / 颜色对比度 / 条形码(Code39) / 短 ID(NanoID) / ISO 周数
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }
  function note(s) { return '<p class="note">' + s + '</p>'; }
  function pre(s) { return '<pre style="white-space:pre-wrap;word-break:break-word">' + esc(s) + '</pre>'; }

  /* ============ 1. 命名风格转换 ============ */
  T.register({
    id: 'naming-case', cat: 'text', icon: '🐫',
    name: '命名风格转换', desc: 'camel / snake / kebab / Pascal / CONSTANT 互转',
    keywords: 'case naming camel snake kebab pascal constant 命名 驼峰 下划线 连字符',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('命名风格转换', 'Naming Case Converter') + '</h3>' +
        '<div class="field"><label>' + L('输入（任意风格）', 'Input (any style)') + '</label>' +
        '<input id="ncIn" placeholder="helloWorld / hello_world / hello-world"></div>' +
        '<div id="ncOut"></div></div>';
      function splitWords(s) {
        s = String(s || '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
        return s.split(/[^A-Za-z0-9]+/).filter(function (w) { return w.length; }).map(function (w) { return w.toLowerCase(); });
      }
      function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
      function run() {
        var ws = splitWords($('ncIn').value);
        if (!ws.length) { out('ncOut', note(L('请输入内容', 'Type something'))); return; }
        var rows = [
          ['camelCase', ws[0] + ws.slice(1).map(cap).join('')],
          ['PascalCase', ws.map(cap).join('')],
          ['snake_case', ws.join('_')],
          ['SCREAMING_SNAKE', ws.join('_').toUpperCase()],
          ['kebab-case', ws.join('-')],
          ['Train-Case', ws.map(cap).join('-')],
          ['dot.case', ws.join('.')],
          ['Title Case', ws.map(cap).join(' ')]
        ];
        out('ncOut', '<div class="field" style="margin-top:10px"><label>' + L('转换结果', 'Result') + '</label>' +
          rows.map(function (r) { return '<div style="display:flex;gap:10px;padding:4px 0"><span style="width:160px;color:var(--dim)">' + r[0] + '</span><code>' + esc(r[1]) + '</code></div>'; }).join('') +
          '</div>');
      }
      $('ncIn').addEventListener('input', run);
      run();
    }
  });

  /* ============ 2. URL Slug 生成 ============ */
  T.register({
    id: 'slug', cat: 'text', icon: '🐌',
    name: 'URL Slug 生成', desc: '把标题转成简洁的 URL 短链标识',
    keywords: 'slug url 短链 seo 标题 友好 链接 permalink',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('URL Slug 生成', 'URL Slug Generator') + '</h3>' +
        '<div class="field"><label>' + L('标题 / 文本', 'Title / text') + '</label>' +
        '<input id="slIn" placeholder="万能工具箱 v3.0 使用指南"></div>' +
        '<div class="row"><div class="field"><label>' + L('分隔符', 'Separator') + '</label>' +
        '<select id="slSep"><option value="-">-</option><option value="_">_</option></select></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="slRun">' + L('生成', 'Generate') + '</button></div></div>' +
        '<div id="slOut"></div></div>';
      function slugify(s, sep) {
        return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .toLowerCase().trim()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, sep)
          .replace(new RegExp('\\' + sep + '{2,}', 'g'), sep)
          .replace(new RegExp('^\\' + sep + '+|\\' + sep + '+$', 'g'), '');
      }
      function run() {
        var sep = $('slSep').value;
        var v = $('slIn').value;
        var s = slugify(v, sep);
        if (!s) { out('slOut', note(L('请输入内容', 'Type something'))); return; }
        out('slOut', '<div class="field" style="margin-top:10px"><label>' + L('结果', 'Result') + '</label>' +
          '<div style="display:flex;gap:8px;align-items:center"><input id="slRes" readonly value="' + esc(s) + '" style="flex:1">' +
          '<button class="btn btn-ghost" id="slCopy">' + L('复制', 'Copy') + '</button></div></div>');
        $('slCopy').addEventListener('click', function () { T.copyText(s, function () { T.toast(T.t('ui.copied')); }); });
      }
      $('slRun').addEventListener('click', run);
      $('slIn').addEventListener('input', run);
      $('slSep').addEventListener('change', run);
      run();
    }
  });

  /* ============ 3. HTML → Markdown ============ */
  T.register({
    id: 'html-md', cat: 'text', icon: '📝',
    name: 'HTML 转 Markdown', desc: '把 HTML 片段转成 Markdown 文本',
    keywords: 'html markdown md 转换 富文本 粘贴',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('HTML 转 Markdown', 'HTML to Markdown') + '</h3>' +
        '<div class="field"><label>HTML</label><textarea id="hmIn" placeholder="<h1>标题</h1><p>段落 <b>加粗</b></p>" style="min-height:120px"></textarea></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="hmRun">' + L('转换', 'Convert') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="hmSample">' + L('示例', 'Sample') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>Markdown</label><div id="hmOut"></div></div></div>';
      function htmlToMd(h) {
        h = String(h || '');
        h = h.replace(/<!--[\s\S]*?-->/g, '');
        h = h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');
        h = h.replace(/<\s*h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, function (m, n, t) { return '\n\n' + new Array(+n + 1).join('#') + ' ' + t.trim() + '\n\n'; });
        h = h.replace(/<\s*(strong|b)\s*>([\s\S]*?)<\/\1>/gi, '**$2**');
        h = h.replace(/<\s*(em|i)\s*>([\s\S]*?)<\/\1>/gi, '*$2*');
        h = h.replace(/<\s*code\s*>([\s\S]*?)<\/code>/gi, '`$1`');
        h = h.replace(/<\s*a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
        h = h.replace(/<\s*li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
        h = h.replace(/<\s*br\s*\/?>/gi, '\n');
        h = h.replace(/<\s*(p|div|section|article)[^>]*>([\s\S]*?)<\/\1>/gi, '$2\n\n');
        h = h.replace(/<[^>]+>/g, '');
        h = h.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
        h = h.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
        return h.trim();
      }
      function run() {
        var v = $('hmIn').value;
        if (!v.trim()) { out('hmOut', note(L('请输入 HTML', 'Paste HTML'))); return; }
        out('hmOut', pre(htmlToMd(v)));
      }
      $('hmRun').addEventListener('click', run);
      $('hmSample').addEventListener('click', function () {
        $('hmIn').value = '<h1>万能工具箱</h1>\n<p>这是一个 <b>离线</b> 工具合集，见 <a href="https://example.com">官网</a>。</p>\n<ul><li>计算</li><li>文本</li></ul>';
        run();
      });
      run();
    }
  });

  /* ============ 4. XML ↔ JSON ============ */
  T.register({
    id: 'xml-json', cat: 'data', icon: '🧩',
    name: 'XML ↔ JSON 互转', desc: 'XML 与 JSON 双向转换（属性用 @ 前缀）',
    keywords: 'xml json 转换 互转 属性 文档',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('XML ↔ JSON 互转', 'XML ↔ JSON Converter') + '</h3>' +
        '<div class="field"><label>XML / JSON</label><textarea id="xjIn" placeholder="<note id=\"1\"><to>Alice</to><body>Hello</body></note>" style="min-height:130px"></textarea></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="xjToJson">' + L('XML → JSON', 'XML → JSON') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="xjToXml">' + L('JSON → XML', 'JSON → XML') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="xjSample">' + L('示例', 'Sample') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('输出', 'Output') + '</label><div id="xjOut"></div></div>' +
        '<div id="xjErr"></div></div>';
      function escXml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
      function escAttr(s) { return escXml(s).replace(/"/g, '&quot;'); }
      function xmlToObj(node) {
        var obj = {}, attrs = node.attributes || [];
        for (var i = 0; i < attrs.length; i++) obj['@' + attrs[i].name] = attrs[i].value;
        var kids = [], text = '';
        for (var j = 0; j < node.childNodes.length; j++) {
          var c = node.childNodes[j];
          if (c.nodeType === 1) kids.push(c);
          else if (c.nodeType === 3) text += c.nodeValue;
        }
        text = text.trim();
        if (!kids.length) {
          if (Object.keys(obj).length) { if (text) obj['#text'] = text; return obj; }
          return text;
        }
        kids.forEach(function (c) {
          var v = xmlToObj(c);
          if (obj[c.nodeName] === undefined) obj[c.nodeName] = v;
          else { if (!Array.isArray(obj[c.nodeName])) obj[c.nodeName] = [obj[c.nodeName]]; obj[c.nodeName].push(v); }
        });
        if (text) obj['#text'] = text;
        return obj;
      }
      function objToXml(name, v, depth) {
        var pad = new Array(depth + 1).join('  ');
        if (Array.isArray(v)) return v.map(function (it) { return objToXml(name, it, depth); }).join('\n');
        if (v && typeof v === 'object') {
          var attrs = '', inner = '';
          Object.keys(v).forEach(function (k) {
            if (k.charAt(0) === '@') attrs += ' ' + k.slice(1) + '="' + escAttr(v[k]) + '"';
            else if (k === '#text') inner += escXml(v[k]);
            else inner += '\n' + objToXml(k, v[k], depth + 1);
          });
          return pad + '<' + name + attrs + (inner ? '>' + inner + '\n' + pad + '</' + name + '>' : '/>');
        }
        return pad + '<' + name + '>' + escXml(v) + '</' + name + '>';
      }
      function fail(msg) { out('xjErr', note('⚠ ' + msg)); out('xjOut', ''); }
      function toJson() {
        var v = $('xjIn').value;
        if (!v.trim()) { fail(L('请输入 XML', 'Enter XML')); return; }
        try {
          var doc = new DOMParser().parseFromString(v, 'application/xml');
          if (doc.querySelector('parsererror')) throw new Error('XML 格式错误');
          out('xjErr', '');
          out('xjOut', pre(JSON.stringify(xmlToObj(doc.documentElement), null, 2)));
        } catch (e) { fail(String(e.message || e)); }
      }
      function toXml() {
        var v = $('xjIn').value;
        if (!v.trim()) { fail(L('请输入 JSON', 'Enter JSON')); return; }
        try {
          var o = JSON.parse(v);
          var root = (o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).length === 1) ? Object.keys(o)[0] : 'root';
          var body = (root === 'root') ? o : o[root];
          out('xjErr', '');
          out('xjOut', pre(objToXml(root, body, 0)));
        } catch (e) { fail(L('JSON 格式错误：', 'Invalid JSON: ') + (e.message || e)); }
      }
      $('xjToJson').addEventListener('click', toJson);
      $('xjToXml').addEventListener('click', toXml);
      $('xjSample').addEventListener('click', function () {
        $('xjIn').value = '<note id="1"><to>Alice</to><body>Hello</body><tag>a</tag><tag>b</tag></note>';
        toJson();
      });
    }
  });

  /* ============ 5. JSON → TypeScript ============ */
  T.register({
    id: 'json-ts', cat: 'data', icon: '🟦',
    name: 'JSON 转 TypeScript', desc: '由 JSON 样例生成 TS 接口定义',
    keywords: 'json typescript ts 接口 interface 类型 生成',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('JSON 转 TypeScript', 'JSON to TypeScript') + '</h3>' +
        '<div class="field"><label>JSON</label><textarea id="jtIn" placeholder=\'{"name":"box","count":3,"tags":["a"],"owner":{"id":1,"vip":true}}\' style="min-height:130px"></textarea></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="jtRun">' + L('生成接口', 'Generate') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="jtSample">' + L('示例', 'Sample') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>TypeScript</label><div id="jtOut"></div></div>' +
        '<div id="jtErr"></div></div>';
      function tsType(v) {
        if (v === null) return 'null';
        if (Array.isArray(v)) return v.length ? tsType(v[0]) + '[]' : 'any[]';
        var t = typeof v;
        if (t === 'number') return 'number';
        if (t === 'boolean') return 'boolean';
        if (t === 'string') return 'string';
        if (t === 'object') return null;
        return 'any';
      }
      function ifaceName(k) {
        var w = String(k).replace(/[^A-Za-z0-9]/g, ' ').split(' ').filter(Boolean)
          .map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1); }).join('');
        return w || 'Item';
      }
      function propName(k) { return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k); }
      function build(name, obj, defs) {
        var lines = ['export interface ' + name + ' {'];
        Object.keys(obj).forEach(function (k) {
          var v = obj[k], t = tsType(v), nn;
          if (t === null) { nn = ifaceName(k); build(nn, v, defs); lines.push('  ' + propName(k) + ': ' + nn + ';'); }
          else if (Array.isArray(v) && v.length && v[0] && typeof v[0] === 'object' && !Array.isArray(v[0])) {
            nn = ifaceName(k); build(nn, v[0], defs); lines.push('  ' + propName(k) + ': ' + nn + '[];');
          } else lines.push('  ' + propName(k) + ': ' + t + ';');
        });
        lines.push('}');
        defs.unshift(lines.join('\n'));
      }
      function run() {
        var v = $('jtIn').value;
        if (!v.trim()) { out('jtOut', note(L('请输入 JSON', 'Enter JSON'))); out('jtErr', ''); return; }
        var obj;
        try { obj = JSON.parse(v); } catch (e) { out('jtOut', ''); out('jtErr', note('⚠ ' + L('JSON 格式错误：', 'Invalid JSON: ') + (e.message || e))); return; }
        out('jtErr', '');
        var defs = [], root = obj;
        var arr = Array.isArray(obj);
        if (arr) root = obj[0] || {};
        if (root && typeof root === 'object' && !Array.isArray(root)) build('Root', root, defs);
        else { out('jtOut', pre('export type Root = ' + tsType(obj) + ';')); return; }
        var head = arr ? 'export type Root = Root[];\n\n' : '';
        out('jtOut', pre(head + defs.join('\n\n')));
      }
      $('jtRun').addEventListener('click', run);
      $('jtSample').addEventListener('click', function () {
        $('jtIn').value = '{"name":"box","count":3,"tags":["a","b"],"owner":{"id":1,"vip":true}}';
        run();
      });
      run();
    }
  });

  /* ============ 6. 罗马数字互转 ============ */
  T.register({
    id: 'roman', cat: 'calc', icon: '🏛️',
    name: '罗马数字互转', desc: '阿拉伯数字 ↔ 罗马数字（1–3999）',
    keywords: 'roman 罗马 数字 转换 numeral',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('罗马数字互转', 'Roman Numeral Converter') + '</h3>' +
        '<div class="field"><label>' + L('输入数字或罗马数字', 'Number or Roman') + '</label>' +
        '<input id="rmIn" placeholder="2024 或 MMXXIV"></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="rmToRoman">' + L('→ 罗马数字', '→ Roman') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="rmToNum">' + L('→ 阿拉伯数字', '→ Number') + '</button></div></div>' +
        '<div id="rmOut" class="result" style="margin-top:10px"></div></div>';
      var ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
      function toRoman(n) {
        if (!(n >= 1 && n <= 3999)) return null;
        var s = '';
        ROMAN.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } });
        return s;
      }
      function fromRoman(str) {
        var s = String(str || '').toUpperCase().replace(/[^IVXLCDM]/g, '');
        if (!s) return null;
        var map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }, t = 0;
        for (var i = 0; i < s.length; i++) { var v = map[s[i]], nx = map[s[i + 1]]; t += (nx && v < nx) ? -v : v; }
        return t >= 1 && t <= 3999 ? t : null;
      }
      function show(html) { out('rmOut', html); }
      $('rmToRoman').addEventListener('click', function () {
        var n = parseInt(String($('rmIn').value).replace(/[^0-9]/g, ''), 10);
        var r = toRoman(n);
        show(r ? '<b>' + esc(String(n)) + '</b> = <code>' + r + '</code>' : note(L('请输入 1–3999 的整数', 'Enter an integer 1–3999')));
      });
      $('rmToNum').addEventListener('click', function () {
        var n = fromRoman($('rmIn').value);
        show(n ? '<code>' + String($('rmIn').value).toUpperCase() + '</code> = <b>' + n + '</b>' : note(L('请输入有效罗马数字（1–3999）', 'Enter a valid Roman numeral (1–3999)')));
      });
    }
  });

  /* ============ 7. 颜色对比度（WCAG） ============ */
  T.register({
    id: 'contrast', cat: 'image', icon: '🌗',
    name: '颜色对比度检测', desc: '按 WCAG 计算前景/背景对比度与达标等级',
    keywords: 'contrast wcag 对比度 无障碍 a11y 颜色 亮度',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('颜色对比度检测', 'Color Contrast Checker') + '</h3>' +
        '<div class="row"><div class="field"><label>' + L('前景色', 'Foreground') + '</label><input type="color" id="ctFg" value="#111111"></div>' +
        '<div class="field"><label>' + L('背景色', 'Background') + '</label><input type="color" id="ctBg" value="#ffffff"></div></div>' +
        '<div id="ctOut" style="margin-top:12px"></div></div>';
      function hex2rgb(h) {
        h = String(h || '').trim().replace('#', '');
        if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
        if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
      }
      function lum(rgb) {
        var a = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
      }
      function ratio(fg, bg) { var l1 = lum(fg), l2 = lum(bg), hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); }
      function badge(ok, txt) { return '<span class="badge ' + (ok ? 'net' : 'off') + '">' + txt + '</span>'; }
      function run() {
        var fg = hex2rgb($('ctFg').value), bg = hex2rgb($('ctBg').value);
        if (!fg || !bg) { out('ctOut', note(L('颜色格式无效', 'Invalid color'))); return; }
        var r = ratio(fg, bg);
        var fgC = $('ctFg').value, bgC = $('ctBg').value;
        out('ctOut',
          '<div style="padding:18px;border-radius:10px;background:' + esc(bgC) + ';color:' + esc(fgC) + ';border:1px solid var(--line)">' +
            '<div style="font-size:20px;font-weight:700">' + L('示例文本 Sample Text', 'Sample Text 示例文本') + '</div>' +
            '<div style="font-size:14px">' + L('普通正文大小 14px', 'Body text at 14px') + '</div>' +
          '</div>' +
          '<table style="width:100%;margin-top:12px;border-collapse:collapse">' +
          '<tr><td style="padding:4px 0">' + L('对比度', 'Contrast ratio') + '</td><td><b>' + r.toFixed(2) + ':1</b></td></tr>' +
          '<tr><td style="padding:4px 0">AA ' + L('普通文本 ≥4.5', 'normal ≥4.5') + '</td><td>' + badge(r >= 4.5, r >= 4.5 ? 'Pass' : 'Fail') + '</td></tr>' +
          '<tr><td style="padding:4px 0">AA ' + L('大文本 ≥3', 'large ≥3') + '</td><td>' + badge(r >= 3, r >= 3 ? 'Pass' : 'Fail') + '</td></tr>' +
          '<tr><td style="padding:4px 0">AAA ' + L('普通文本 ≥7', 'normal ≥7') + '</td><td>' + badge(r >= 7, r >= 7 ? 'Pass' : 'Fail') + '</td></tr>' +
          '</table>');
      }
      $('ctFg').addEventListener('input', run);
      $('ctBg').addEventListener('input', run);
      run();
    }
  });

  /* ============ 8. 条形码生成（Code 39） ============ */
  T.register({
    id: 'barcode', cat: 'codec', icon: '📊',
    name: '条形码生成', desc: '生成 Code 39 条形码（SVG，可复制）',
    keywords: 'barcode 条形码 code39 条码 生成 svg',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('条形码生成（Code 39）', 'Barcode Generator (Code 39)') + '</h3>' +
        '<div class="field"><label>' + L('内容（数字 / 大写字母 / - . $ / + %）', 'Content (0-9 A-Z - . $ / + %)') + '</label>' +
        '<input id="brIn" value="TOOLBOX-39"></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="brRun">' + L('生成', 'Generate') + '</button></div></div>' +
        '<div id="brOut" style="margin-top:12px;background:#fff;padding:12px;border-radius:8px"></div>' +
        '<div id="brErr"></div></div>';
      var C39 = {
        '0': [1, 1, 1, 2, 2, 1, 2, 1, 1], '1': [2, 1, 1, 2, 1, 1, 1, 1, 2], '2': [1, 1, 2, 2, 1, 1, 1, 1, 2],
        '3': [2, 1, 2, 2, 1, 1, 1, 1, 1], '4': [1, 1, 1, 2, 2, 1, 1, 1, 2], '5': [2, 1, 1, 2, 2, 1, 1, 1, 1],
        '6': [1, 1, 2, 2, 2, 1, 1, 1, 1], '7': [1, 1, 1, 2, 1, 1, 2, 1, 2], '8': [2, 1, 1, 2, 1, 1, 2, 1, 1],
        '9': [1, 1, 2, 2, 1, 1, 2, 1, 1],
        'A': [2, 1, 1, 1, 1, 2, 1, 1, 2], 'B': [1, 1, 2, 1, 1, 2, 1, 1, 2], 'C': [2, 1, 2, 1, 1, 2, 1, 1, 1],
        'D': [1, 1, 1, 1, 2, 2, 1, 1, 2], 'E': [2, 1, 1, 1, 2, 2, 1, 1, 1], 'F': [1, 1, 2, 1, 2, 2, 1, 1, 1],
        'G': [1, 1, 1, 1, 1, 2, 2, 1, 2], 'H': [2, 1, 1, 1, 1, 2, 2, 1, 1], 'I': [1, 1, 2, 1, 1, 2, 2, 1, 1],
        'J': [1, 1, 1, 1, 2, 2, 2, 1, 1], 'K': [2, 1, 1, 1, 1, 1, 1, 2, 2], 'L': [1, 1, 2, 1, 1, 1, 1, 2, 2],
        'M': [2, 1, 2, 1, 1, 1, 1, 2, 1], 'N': [1, 1, 1, 1, 2, 1, 1, 2, 2], 'O': [2, 1, 1, 1, 2, 1, 1, 2, 1],
        'P': [1, 1, 2, 1, 2, 1, 1, 2, 1], 'Q': [1, 1, 1, 1, 1, 1, 2, 2, 2], 'R': [2, 1, 1, 1, 1, 1, 2, 2, 1],
        'S': [1, 1, 2, 1, 1, 1, 2, 2, 1], 'T': [1, 1, 1, 1, 2, 1, 2, 2, 1], 'U': [2, 2, 1, 1, 1, 1, 1, 1, 2],
        'V': [1, 2, 2, 1, 1, 1, 1, 1, 2], 'W': [2, 2, 2, 1, 1, 1, 1, 1, 1], 'X': [1, 2, 1, 1, 2, 1, 1, 1, 2],
        'Y': [2, 2, 1, 1, 2, 1, 1, 1, 1], 'Z': [1, 2, 2, 1, 2, 1, 1, 1, 1],
        '-': [1, 2, 1, 1, 1, 1, 2, 1, 2], '.': [2, 2, 1, 1, 1, 1, 2, 1, 1], ' ': [1, 2, 2, 1, 1, 1, 2, 1, 1],
        '$': [1, 2, 1, 2, 1, 2, 1, 1, 1], '/': [1, 2, 1, 2, 1, 1, 1, 2, 1],
        '+': [1, 2, 1, 1, 1, 2, 1, 2, 1], '%': [1, 1, 1, 2, 1, 2, 1, 2, 1], '*': [1, 2, 1, 1, 2, 1, 2, 1, 1]
      };
      function svg(text) {
        text = String(text || '').toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '');
        if (!text) return null;
        var chars = ('*' + text + '*').split('');
        var mod = 2, h = 80, quiet = 10 * mod, total = 0;
        chars.forEach(function (ch) { var p = C39[ch]; if (p) total += p.reduce(function (a, b) { return a + b; }, 0) + 1; });
        var w = quiet * 2 + total * mod, x = quiet, rects = '';
        chars.forEach(function (ch) {
          var p = C39[ch]; if (!p) return;
          for (var i = 0; i < 9; i++) {
            var bw = p[i] * mod;
            if (i % 2 === 0) rects += '<rect x="' + x + '" y="0" width="' + bw + '" height="' + h + '"/>';
            x += bw;
          }
          x += mod;
        });
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + Math.min(w, 900) + 'px" preserveAspectRatio="xMinYMid meet"><g fill="#111">' + rects + '</g></svg>';
      }
      function run() {
        var v = $('brIn').value;
        var s = svg(v);
        if (!s) { out('brOut', note(L('请输入有效内容', 'Enter valid content'))); return; }
        out('brOut', s + '<div style="text-align:center;color:#111;font-weight:700;letter-spacing:3px">' + esc(String(v).toUpperCase()) + '</div>');
      }
      $('brRun').addEventListener('click', run);
      $('brIn').addEventListener('input', run);
      run();
    }
  });

  /* ============ 9. 短 ID 生成（NanoID 风格） ============ */
  T.register({
    id: 'nanoid', cat: 'code', icon: '🎫',
    name: '短 ID 生成', desc: '生成 URL 安全的短随机 ID（NanoID 风格）',
    keywords: 'nanoid 短id 随机 唯一 id 生成 token',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('短 ID 生成（NanoID 风格）', 'Short ID Generator (NanoID)') + '</h3>' +
        '<div class="row"><div class="field"><label>' + L('长度', 'Length') + '</label><input type="number" id="niLen" value="21" min="4" max="64" step="1"></div>' +
        '<div class="field"><label>' + L('数量', 'Count') + '</label><input type="number" id="niCount" value="5" min="1" max="100" step="1"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="niRun">' + L('生成', 'Generate') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('结果', 'Result') + '</label><div id="niOut"></div></div></div>';
      var A = 'ModuleSymbhasOwnPr0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';
      function rand(len) {
        var s = '', i, c = window.crypto;
        if (c && c.getRandomValues) {
          var b = new Uint8Array(len);
          c.getRandomValues(b);
          for (i = 0; i < len; i++) s += A[b[i] % A.length];
        } else {
          for (i = 0; i < len; i++) s += A[Math.floor(Math.random() * A.length)];
        }
        return s;
      }
      function run() {
        var len = Math.max(4, Math.min(64, parseInt($('niLen').value, 10) || 21));
        var n = Math.max(1, Math.min(100, parseInt($('niCount').value, 10) || 5));
        var ids = [];
        for (var i = 0; i < n; i++) ids.push(rand(len));
        var text = ids.join('\n');
        out('niOut', pre(text) + '<button class="btn btn-ghost" id="niCopy" style="margin-top:8px">' + L('复制全部', 'Copy all') + '</button>');
        $('niCopy').addEventListener('click', function () { T.copyText(text, function () { T.toast(T.t('ui.copied')); }); });
      }
      $('niRun').addEventListener('click', run);
      run();
    }
  });

  /* ============ 10. ISO 周数 ============ */
  T.register({
    id: 'iso-week', cat: 'time', icon: '📅',
    name: 'ISO 周数计算', desc: '查询日期所属 ISO 周号、周起止日期',
    keywords: 'iso week 周数 周号 星期 日期 惯例',
    render: function (host) {
      function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
      function fmt(d) { var m = d.getMonth() + 1, dd = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd; }
      var t0 = today();
      host.innerHTML =
      '<div class="panel"><h3>' + L('ISO 周数计算', 'ISO Week Calculator') + '</h3>' +
        '<div class="field"><label>' + L('日期', 'Date') + '</label><input type="date" id="iwDate" value="' + fmt(t0) + '"></div>' +
        '<div id="iwOut" style="margin-top:12px"></div></div>';
      function isoWeek(d) {
        var u = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        var day = u.getUTCDay() || 7;
        u.setUTCDate(u.getUTCDate() + 4 - day);
        var ys = new Date(Date.UTC(u.getUTCFullYear(), 0, 1));
        var week = Math.ceil((((u - ys) / 86400000) + 1) / 7);
        return { year: u.getUTCFullYear(), week: week };
      }
      function run() {
        var v = $('iwDate').value;
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
        if (!m) { out('iwOut', note(L('请选择日期', 'Pick a date'))); return; }
        var d = new Date(+m[1], +m[2] - 1, +m[3]);
        var r = isoWeek(d);
        var day = d.getDay() || 7;
        var mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day + 1);
        var sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);
        out('iwOut', '<div class="field"><label>' + L('结果', 'Result') + '</label>' +
          '<div style="font-size:20px;font-weight:700">' + r.year + '-W' + (r.week < 10 ? '0' : '') + r.week + '</div>' +
          '<div class="note" style="margin-top:6px">' + L('本周：', 'Week: ') + fmt(mon) + L(' 至 ', ' to ') + fmt(sun) + L('（周一至周日）', ' (Mon–Sun)') + '</div></div>');
      }
      $('iwDate').addEventListener('change', run);
      $('iwDate').addEventListener('input', run);
      run();
    }
  });
})();
