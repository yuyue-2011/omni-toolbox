/* ============================================================
   万能工具箱 · 工具扩充（W4 批次，10 款）
   Base32 编解码 / 维吉尼亚密码 / 栅栏密码 / 中文数字互转 / 数字转英文
   CSS 渐变生成器 / CRC32 校验 / Properties 转 JSON / CSV 转 Markdown / 数独
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

  /* ---------- UTF-8 手动编解码（不依赖 TextEncoder，兼容旧环境） ---------- */
  function utf8Encode(str) {
    var s = String(str || ''), outb = [];
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) outb.push(c);
      else if (c < 0x800) outb.push(0xC0 | (c >> 6), 0x80 | (c & 63));
      else if (c >= 0xD800 && c <= 0xDBFF && i + 1 < s.length) {
        var c2 = s.charCodeAt(++i);
        var cp = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00);
        outb.push(0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
      } else outb.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return outb;
  }
  function utf8Decode(b) {
    var s = '', i = 0;
    while (i < b.length) {
      var c = b[i++];
      if (c < 0x80) s += String.fromCharCode(c);
      else if (c < 0xE0) s += String.fromCharCode(((c & 31) << 6) | (b[i++] & 63));
      else if (c < 0xF0) s += String.fromCharCode(((c & 15) << 12) | ((b[i++] & 63) << 6) | (b[i++] & 63));
      else {
        var cp = ((c & 7) << 18) | ((b[i++] & 63) << 12) | ((b[i++] & 63) << 6) | (b[i++] & 63);
        cp -= 0x10000;
        s += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 1023));
      }
    }
    return s;
  }

  /* ============ 1. Base32 编解码 ============ */
  T.register({
    id: 'base32', cat: 'codec', icon: '🅱️',
    name: 'Base32 编解码', desc: 'RFC 4648 Base32 编码 / 解码（UTF-8）',
    keywords: 'base32 rfc4648 编码 解码 encode decode',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Base32 编解码', 'Base32 Encoder / Decoder') + '</h3>' +
        '<div class="field"><label>' + L('输入（文本或 Base32）', 'Input (text or Base32)') + '</label>' +
        '<textarea id="b32In" placeholder="Hello 万能工具箱" style="min-height:90px"></textarea></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="b32Enc">' + L('编码', 'Encode') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="b32Dec">' + L('解码', 'Decode') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('结果', 'Result') + '</label><div id="b32Out"></div></div></div>';
      var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      function enc(bytes) {
        var bits = 0, val = 0, s = '';
        for (var i = 0; i < bytes.length; i++) {
          val = (val << 8) | bytes[i]; bits += 8;
          while (bits >= 5) { s += A[(val >>> (bits - 5)) & 31]; bits -= 5; }
        }
        if (bits > 0) s += A[(val << (5 - bits)) & 31];
        while (s.length % 8) s += '=';
        return s;
      }
      function dec(str) {
        var s = String(str || '').toUpperCase().replace(/[^A-Z2-7]/g, ''), bits = 0, val = 0, bytes = [];
        for (var i = 0; i < s.length; i++) {
          val = (val << 5) | A.indexOf(s[i]); bits += 5;
          if (bits >= 8) { bytes.push((val >>> (bits - 8)) & 255); bits -= 8; }
        }
        return bytes;
      }
      $('b32Enc').addEventListener('click', function () {
        var v = $('b32In').value;
        if (!v) { out('b32Out', note(L('请输入内容', 'Type something'))); return; }
        var r = enc(utf8Encode(v));
        out('b32Out', pre(r) + '<button class="btn btn-ghost" id="b32Copy" style="margin-top:8px">' + L('复制', 'Copy') + '</button>');
        $('b32Copy').addEventListener('click', function () { T.copyText(r, function () { T.toast(T.t('ui.copied')); }); });
      });
      $('b32Dec').addEventListener('click', function () {
        var v = $('b32In').value;
        if (!v.trim()) { out('b32Out', note(L('请输入 Base32', 'Enter Base32'))); return; }
        try { out('b32Out', pre(utf8Decode(dec(v)))); }
        catch (e) { out('b32Out', note('⚠ ' + L('无法解码', 'Cannot decode'))); }
      });
    }
  });

  /* ============ 2. 维吉尼亚密码 ============ */
  T.register({
    id: 'vigenere', cat: 'codec', icon: '🗝️',
    name: '维吉尼亚密码', desc: '密钥字母位移加密 / 解密（非字母原样保留）',
    keywords: 'vigenere 维吉尼亚 密码 加密 解密 cipher 密钥',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('维吉尼亚密码', 'Vigenère Cipher') + '</h3>' +
        '<div class="field"><label>' + L('明文 / 密文', 'Text') + '</label><textarea id="vgIn" placeholder="ATTACK AT DAWN" style="min-height:80px"></textarea></div>' +
        '<div class="field"><label>' + L('密钥（字母）', 'Key (letters)') + '</label><input id="vgKey" value="LEMON"></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vgEnc">' + L('加密', 'Encrypt') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="vgDec">' + L('解密', 'Decrypt') + '</button></div></div>' +
        '<div id="vgOut" class="result" style="margin-top:10px"></div></div>';
      function run(dec) {
        var text = $('vgIn').value;
        var key = String($('vgKey').value || '').toUpperCase().replace(/[^A-Z]/g, '');
        if (!text) { out('vgOut', note(L('请输入内容', 'Enter text'))); return; }
        if (!key) { out('vgOut', note(L('请输入至少一个字母密钥', 'Enter a letter key'))); return; }
        var ki = 0, s = '';
        for (var i = 0; i < text.length; i++) {
          var code = text.charCodeAt(i), base;
          if (code >= 65 && code <= 90) base = 65;
          else if (code >= 97 && code <= 122) base = 97;
          else { s += text[i]; continue; }
          var k = key.charCodeAt(ki % key.length) - 65; ki++;
          s += String.fromCharCode((code - base + (dec ? (26 - k) : k)) % 26 + base);
        }
        out('vgOut', pre(s) + '<button class="btn btn-ghost" id="vgCopy" style="margin-top:8px">' + L('复制', 'Copy') + '</button>');
        $('vgCopy').addEventListener('click', function () { T.copyText(s, function () { T.toast(T.t('ui.copied')); }); });
      }
      $('vgEnc').addEventListener('click', function () { run(false); });
      $('vgDec').addEventListener('click', function () { run(true); });
    }
  });

  /* ============ 3. 栅栏密码 ============ */
  T.register({
    id: 'railfence', cat: 'codec', icon: '🚧',
    name: '栅栏密码', desc: 'Rail Fence 栅栏加密 / 解密（可设栏数）',
    keywords: 'rail fence 栅栏 密码 加密 解密 cipher',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('栅栏密码', 'Rail Fence Cipher') + '</h3>' +
        '<div class="field"><label>' + L('文本', 'Text') + '</label><textarea id="rfIn" placeholder="WE ARE DISCOVERED FLEE AT ONCE" style="min-height:80px"></textarea></div>' +
        '<div class="field"><label>' + L('栏数（2–10）', 'Rails (2–10)') + '</label><input type="number" id="rfN" value="3" min="2" max="10" step="1"></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="rfEnc">' + L('加密', 'Encrypt') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="rfDec">' + L('解密', 'Decrypt') + '</button></div></div>' +
        '<div id="rfOut" class="result" style="margin-top:10px"></div></div>';
      function rails() { return Math.max(2, Math.min(10, parseInt($('rfN').value, 10) || 3)); }
      function pattern(n, r) {
        var p = [], row = 0, dir = 1;
        for (var i = 0; i < n; i++) { p.push(row); row += dir; if (row === 0 || row === r - 1) dir = -dir; }
        return p;
      }
      function show(s) { out('rfOut', pre(s) + '<button class="btn btn-ghost" id="rfCopy" style="margin-top:8px">' + L('复制', 'Copy') + '</button>'); $('rfCopy').addEventListener('click', function () { T.copyText(s, function () { T.toast(T.t('ui.copied')); }); }); }
      $('rfEnc').addEventListener('click', function () {
        var text = $('rfIn').value, r = rails();
        if (!text) { out('rfOut', note(L('请输入内容', 'Enter text'))); return; }
        var rows = [], i;
        for (i = 0; i < r; i++) rows.push('');
        pattern(text.length, r).forEach(function (p, idx) { rows[p] += text[idx]; });
        show(rows.join(''));
      });
      $('rfDec').addEventListener('click', function () {
        var text = $('rfIn').value, r = rails();
        if (!text) { out('rfOut', note(L('请输入内容', 'Enter text'))); return; }
        var pat = pattern(text.length, r), counts = [], i;
        for (i = 0; i < r; i++) counts.push(0);
        pat.forEach(function (p) { counts[p]++; });
        var rows = [], idx = 0;
        for (i = 0; i < r; i++) { rows.push(text.substr(idx, counts[i])); idx += counts[i]; }
        var pos = [], s = '';
        for (i = 0; i < r; i++) pos.push(0);
        pat.forEach(function (p) { s += rows[p][pos[p]++]; });
        show(s);
      });
    }
  });

  /* ============ 4. 中文数字互转 ============ */
  T.register({
    id: 'cn-number', cat: 'text', icon: '🀄',
    name: '中文数字互转', desc: '阿拉伯数字 ↔ 中文数字（一二三 / 壹贰叁）',
    keywords: '中文数字 汉字 金额 大写 壹贰叁 转换 数字',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('中文数字互转', 'Chinese Numerals Converter') + '</h3>' +
        '<div class="field"><label>' + L('输入数字或中文数字', 'Number or Chinese numerals') + '</label>' +
        '<input id="cnIn" placeholder="2024 或 二千零二十四"></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="cnTo">' + L('转中文', 'To Chinese') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="cnFrom">' + L('转阿拉伯数字', 'To Number') + '</button></div></div>' +
        '<div id="cnOut" class="result" style="margin-top:10px"></div></div>';
      var D = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      var BIGD = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      var U = ['', '十', '百', '千'];
      var BIGU = ['', '拾', '佰', '仟'];
      var S = ['', '万', '亿', '万亿'];
      function digits(n, big) { var arr = big ? BIGD : D, u = big ? BIGU : U, s = String(n), r = ''; for (var i = 0; i < s.length; i++) r += arr[+s[i]] + (u[s.length - 1 - i] || ''); return r; }
      function toCn(num, big) {
        num = Math.floor(Math.abs(Number(num)));
        if (!isFinite(num)) return null;
        if (num === 0) return big ? '零' : '零';
        var arr = big ? BIGD : D, u = big ? BIGU : U;
        var str = String(num), groups = [], g;
        while (str.length > 0) { groups.unshift(str.slice(-4)); str = str.slice(0, -4); }
        var res = '';
        for (g = 0; g < groups.length; g++) {
          var grp = groups[g], part = '', zero = false;
          for (var i = 0; i < grp.length; i++) {
            var d = +grp[i], unit = u[grp.length - 1 - i];
            if (d === 0) { zero = true; }
            else {
              if (zero && part) part += arr[0];
              else if (zero && !part && res) part += arr[0];
              zero = false;
              part += arr[d] + unit;
            }
          }
          if (part) res += part + S[groups.length - 1 - g];
          else if (res && res.charAt(res.length - 1) !== arr[0]) res += arr[0];
        }
        res = res.replace(new RegExp(arr[0] + '+$'), '');
        if (!big) res = res.replace(/^一十/, '十');
        return res || arr[0];
      }
      var MAP = { '零': 0, '〇': 0, '一': 1, '壹': 1, '二': 2, '贰': 2, '两': 2, '三': 3, '叁': 3, '四': 4, '肆': 4, '五': 5, '伍': 5, '六': 6, '陆': 6, '七': 7, '柒': 7, '八': 8, '捌': 8, '九': 9, '玖': 9 };
      var UNIT = { '十': 10, '拾': 10, '百': 100, '佰': 100, '千': 1000, '仟': 1000 };
      var BIG = { '万': 10000, '亿': 100000000 };
      function fromCn(s) {
        s = String(s || '').trim();
        if (!s) return null;
        if (!/[十拾百佰千仟万亿]/.test(s)) {
          var d = '';
          for (var i = 0; i < s.length; i++) { if (MAP[s[i]] == null) return null; d += MAP[s[i]]; }
          return d === '' ? null : parseInt(d, 10);
        }
        var total = 0, section = 0, num = 0, seen = false;
        for (var j = 0; j < s.length; j++) {
          var ch = s[j];
          if (MAP[ch] != null) { num = MAP[ch]; seen = true; }
          else if (UNIT[ch]) { if (num === 0) num = 1; section += num * UNIT[ch]; num = 0; seen = true; }
          else if (BIG[ch]) { section += num; total += section * BIG[ch]; section = 0; num = 0; seen = true; }
          else return null;
        }
        if (!seen) return null;
        return total + section + num;
      }
      $('cnTo').addEventListener('click', function () {
        var v = String($('cnIn').value).replace(/[^0-9]/g, '');
        if (!v) { out('cnOut', note(L('请输入数字', 'Enter a number'))); return; }
        out('cnOut', '<b>' + esc(v) + '</b> = <code>' + toCn(v, false) + '</code><br><span class="note">' + L('大写：', 'Uppercase: ') + toCn(v, true) + '</span>');
      });
      $('cnFrom').addEventListener('click', function () {
        var n = fromCn($('cnIn').value);
        out('cnOut', n == null ? note(L('请输入有效中文数字', 'Enter valid Chinese numerals')) : '<code>' + esc($('cnIn').value) + '</code> = <b>' + n + '</b>');
      });
    }
  });

  /* ============ 5. 数字转英文 ============ */
  T.register({
    id: 'num-en', cat: 'text', icon: '🔢',
    name: '数字转英文', desc: '阿拉伯数字转英文单词（支持万亿级）',
    keywords: 'number english 英文 单词 数字 转换 words',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('数字转英文', 'Number to English') + '</h3>' +
        '<div class="field"><label>' + L('数字', 'Number') + '</label><input id="neIn" placeholder="1234567"></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="neRun">' + L('转换', 'Convert') + '</button></div></div>' +
        '<div id="neOut" class="result" style="margin-top:10px"></div></div>';
      var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      function chunk(x) {
        var s = '';
        if (x >= 100) { s += ONES[Math.floor(x / 100)] + ' hundred'; x %= 100; if (x) s += ' '; }
        if (x >= 20) { s += TENS[Math.floor(x / 10)]; if (x % 10) s += '-' + ONES[x % 10]; }
        else if (x > 0) s += ONES[x];
        return s;
      }
      function toEn(n) {
        n = Math.floor(Math.abs(Number(n)));
        if (!isFinite(n) || n > 999999999999999) return null;
        if (n === 0) return 'zero';
        var scales = [[1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']], parts = [];
        scales.forEach(function (sc) { if (n >= sc[0]) { parts.push(chunk(Math.floor(n / sc[0])) + ' ' + sc[1]); n %= sc[0]; } });
        if (n > 0) parts.push(chunk(n));
        return parts.join(' ');
      }
      function run() {
        var v = String($('neIn').value).replace(/[^0-9]/g, '');
        if (!v) { out('neOut', note(L('请输入非负整数', 'Enter a non-negative integer'))); return; }
        var s = toEn(v);
        out('neOut', s ? '<div style="font-size:18px">' + esc(s) + '</div>' : note(L('数字过大', 'Number too large')));
      }
      $('neRun').addEventListener('click', run);
      $('neIn').addEventListener('input', run);
      run();
    }
  });

  /* ============ 6. CSS 渐变生成器 ============ */
  T.register({
    id: 'gradient', cat: 'image', icon: '🌈',
    name: '渐变生成器', desc: '生成 CSS 线性 / 径向渐变并复制代码',
    keywords: 'gradient 渐变 css 背景 颜色 生成',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('CSS 渐变生成器', 'CSS Gradient Generator') + '</h3>' +
        '<div class="row"><div class="field"><label>' + L('类型', 'Type') + '</label><select id="gdType"><option value="linear">linear-gradient</option><option value="radial">radial-gradient</option></select></div>' +
        '<div class="field"><label>' + L('角度', 'Angle') + '</label><input type="number" id="gdAngle" value="135" min="0" max="360" step="1"></div></div>' +
        '<div class="row"><div class="field"><label>' + L('起始色', 'Start') + '</label><input type="color" id="gdA" value="#667eea"></div>' +
        '<div class="field"><label>' + L('结束色', 'End') + '</label><input type="color" id="gdB" value="#764ba2"></div>' +
        '<div class="field"><label>' + L('方向', 'Reverse') + '</label><button class="btn btn-ghost" id="gdSwap">' + L('对调', 'Swap') + '</button></div></div>' +
        '<div id="gdPreview" style="height:120px;border-radius:10px;margin-top:12px;border:1px solid var(--line)"></div>' +
        '<div class="field" style="margin-top:12px"><label>CSS</label><div id="gdOut"></div></div></div>';
      function css() {
        var a = $('gdA').value, b = $('gdB').value;
        if ($('gdType').value === 'radial') return 'radial-gradient(circle, ' + a + ', ' + b + ')';
        return 'linear-gradient(' + (parseInt($('gdAngle').value, 10) || 0) + 'deg, ' + a + ', ' + b + ')';
      }
      function run() {
        var c = css();
        var pv = $('gdPreview');
        if (pv) pv.style.background = c;
        out('gdOut', '<div style="display:flex;gap:8px;align-items:center"><code style="flex:1">background: ' + esc(c) + ';</code>' +
          '<button class="btn btn-ghost" id="gdCopy">' + L('复制', 'Copy') + '</button></div>');
        $('gdCopy').addEventListener('click', function () { T.copyText('background: ' + c + ';', function () { T.toast(T.t('ui.copied')); }); });
      }
      $('gdType').addEventListener('change', run);
      $('gdAngle').addEventListener('input', run);
      $('gdA').addEventListener('input', run);
      $('gdB').addEventListener('input', run);
      $('gdSwap').addEventListener('click', function () { var a = $('gdA').value; $('gdA').value = $('gdB').value; $('gdB').value = a; run(); });
      run();
    }
  });

  /* ============ 7. CRC32 校验 ============ */
  T.register({
    id: 'crc32', cat: 'data', icon: '🧮',
    name: 'CRC32 校验', desc: '计算文本 CRC32 校验和（十六进制 / 十进制）',
    keywords: 'crc32 校验 checksum 哈希 hash 校验和',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('CRC32 校验', 'CRC32 Checksum') + '</h3>' +
        '<div class="field"><label>' + L('文本', 'Text') + '</label><textarea id="crcIn" placeholder="Hello, 万能工具箱!" style="min-height:100px"></textarea></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="crcRun">' + L('计算', 'Compute') + '</button></div></div>' +
        '<div id="crcOut" style="margin-top:12px"></div></div>';
      var table = (function () {
        var t = [], c, n, k;
        for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; }
        return t;
      })();
      function crc(bytes) {
        var c = 0xFFFFFFFF;
        for (var i = 0; i < bytes.length; i++) c = table[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
        return (c ^ 0xFFFFFFFF) >>> 0;
      }
      function run() {
        var v = $('crcIn').value;
        if (!v) { out('crcOut', note(L('请输入内容', 'Type something'))); return; }
        var bytes = utf8Encode(v);
        var h = crc(bytes).toString(16).padStart(8, '0');
        out('crcOut',
          '<table style="width:100%;border-collapse:collapse">' +
          '<tr><td style="padding:4px 0">CRC32 (hex)</td><td><code>' + h.toUpperCase() + '</code></td></tr>' +
          '<tr><td style="padding:4px 0">CRC32 (dec)</td><td><code>' + crc(bytes) + '</code></td></tr>' +
          '<tr><td style="padding:4px 0">' + L('字节数', 'Bytes') + '</td><td>' + bytes.length + '</td></tr>' +
          '</table>');
      }
      $('crcRun').addEventListener('click', run);
      $('crcIn').addEventListener('input', run);
      run();
    }
  });

  /* ============ 8. Properties 转 JSON ============ */
  T.register({
    id: 'properties', cat: 'data', icon: '⚙️',
    name: 'Properties 转 JSON', desc: '.properties / .ini 与 JSON 双向转换',
    keywords: 'properties ini json 配置 转换 键值',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Properties 转 JSON', 'Properties to JSON') + '</h3>' +
        '<div class="field"><label>' + L('输入（.properties 或 JSON）', 'Input (.properties or JSON)') + '</label>' +
        '<textarea id="prIn" placeholder="app.name=万能工具箱&#10;# 注释&#10;app.version=3.4.1" style="min-height:120px"></textarea></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="prToJson">' + L('→ JSON', '→ JSON') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="prToProp">' + L('→ Properties', '→ Properties') + '</button></div></div>' +
        '<div id="prOut" style="margin-top:12px"></div></div>';
      function parseProps(text) {
        var obj = {};
        String(text || '').split(/\r?\n/).forEach(function (ln) {
          var t = ln.replace(/^\s+/, '');
          if (!t || t.charAt(0) === '#' || t.charAt(0) === '!') return;
          var m = /^([^=:\s]+)\s*[=:]?\s*(.*)$/.exec(t);
          if (!m) return;
          obj[m[1]] = m[2].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        });
        return obj;
      }
      function serProps(obj) {
        return Object.keys(obj).map(function (k) {
          var v = obj[k];
          if (v && typeof v === 'object') v = JSON.stringify(v);
          return k + '=' + String(v == null ? '' : v).replace(/\n/g, '\\n');
        }).join('\n');
      }
      function fail(msg) { out('prOut', note('⚠ ' + msg)); }
      $('prToJson').addEventListener('click', function () {
        var v = $('prIn').value;
        if (!v.trim()) { fail(L('请输入内容', 'Enter content')); return; }
        if (/^\s*\{/.test(v)) { try { out('prOut', pre(JSON.stringify(JSON.parse(v), null, 2))); } catch (e) { fail(L('JSON 格式错误', 'Invalid JSON')); } return; }
        out('prOut', pre(JSON.stringify(parseProps(v), null, 2)));
      });
      $('prToProp').addEventListener('click', function () {
        var v = $('prIn').value;
        if (!v.trim()) { fail(L('请输入内容', 'Enter content')); return; }
        if (/^\s*\{/.test(v)) { try { out('prOut', pre(serProps(JSON.parse(v)))); } catch (e) { fail(L('JSON 格式错误', 'Invalid JSON')); } return; }
        out('prOut', pre(serProps(parseProps(v))));
      });
    }
  });

  /* ============ 9. CSV 转 Markdown ============ */
  T.register({
    id: 'csv-md', cat: 'data', icon: '📋',
    name: 'CSV 转 Markdown', desc: 'CSV / TSV 转 Markdown 表格',
    keywords: 'csv tsv markdown 表格 转换 table',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('CSV 转 Markdown 表格', 'CSV to Markdown Table') + '</h3>' +
        '<div class="field"><label>' + L('CSV（首行为表头）', 'CSV (first row = header)') + '</label>' +
        '<textarea id="cmIn" placeholder="姓名,年龄,城市&#10;张三,28,北京&#10;李四,31,上海" style="min-height:120px"></textarea></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="cmRun">' + L('转换', 'Convert') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="cmSample">' + L('示例', 'Sample') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>Markdown</label><div id="cmOut"></div></div></div>';
      function detect(text) {
        if (text.indexOf('\t') >= 0) return '\t';
        var counts = { ',': (text.match(/,/g) || []).length, ';': (text.match(/;/g) || []).length };
        return counts[';'] > counts[','] ? ';' : ',';
      }
      function parse(text, delim) {
        var rows = [], row = [], cur = '', q = false;
        for (var i = 0; i < text.length; i++) {
          var ch = text[i];
          if (q) {
            if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
            else cur += ch;
          } else if (ch === '"') q = true;
          else if (ch === delim) { row.push(cur); cur = ''; }
          else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
          else if (ch !== '\r') cur += ch;
        }
        if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
        return rows.filter(function (r) { return r.length && r.join('') !== ''; });
      }
      function run() {
        var v = $('cmIn').value;
        if (!v.trim()) { out('cmOut', note(L('请输入 CSV', 'Paste CSV'))); return; }
        try {
          var rows = parse(v, detect(v));
          if (!rows.length) { out('cmOut', note(L('无有效数据', 'No data'))); return; }
          var cols = Math.max.apply(null, rows.map(function (r) { return r.length; }));
          function line(cells, isHead) {
            var cs = [];
            for (var i = 0; i < cols; i++) cs.push(String(cells[i] == null ? '' : cells[i]).replace(/\|/g, '\\|'));
            return '| ' + cs.join(' | ') + ' |';
          }
          var md = [line(rows[0], true), line(rows[0].map(function () { return '---'; })), ].concat(rows.slice(1).map(function (r) { return line(r); })).join('\n');
          out('cmOut', pre(md) + '<button class="btn btn-ghost" id="cmCopy" style="margin-top:8px">' + L('复制', 'Copy') + '</button>');
          $('cmCopy').addEventListener('click', function () { T.copyText(md, function () { T.toast(T.t('ui.copied')); }); });
        } catch (e) { out('cmOut', note('⚠ ' + (e.message || e))); }
      }
      $('cmRun').addEventListener('click', run);
      $('cmSample').addEventListener('click', function () {
        $('cmIn').value = '姓名,年龄,城市\n张三,28,北京\n李四,31,上海';
        run();
      });
      run();
    }
  });

  /* ============ 10. 数独 ============ */
  T.register({
    id: 'sudoku', cat: 'game', icon: '🧩',
    name: '数独', desc: '9×9 数独出题与一键求解',
    keywords: 'sudoku 数独 谜题 求解 puzzle game',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('数独（出题 / 求解）', 'Sudoku (Generate / Solve)') + '</h3>' +
        '<div id="sdGrid" style="display:grid;grid-template-columns:repeat(9,1fr);gap:0;width:306px;margin:0 auto;border:2px solid var(--line)"></div>' +
        '<div class="row" style="justify-content:center;margin-top:12px">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="sdGen">' + L('出题', 'Generate') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="sdSolve">' + L('求解', 'Solve') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="sdClear">' + L('清空', 'Clear') + '</button></div></div>' +
        '<div id="sdOut"></div></div>';
      var cells = [];
      var grid = $('sdGrid');
      for (var i = 0; i < 81; i++) {
        var inp = document.createElement('input');
        inp.type = 'text'; inp.maxLength = 1; inp.className = 'sd-cell';
        inp.setAttribute('inputmode', 'numeric');
        var r = Math.floor(i / 9), c = i % 9;
        inp.style.cssText = 'width:34px;height:34px;text-align:center;border:1px solid var(--line);border-radius:0;font-size:16px;background:transparent;color:var(--fg)';
        if ((c + 1) % 3 === 0 && c !== 8) inp.style.borderRightWidth = '2px';
        if ((r + 1) % 3 === 0 && r !== 8) inp.style.borderBottomWidth = '2px';
        inp.addEventListener('input', function () { this.value = this.value.replace(/[^1-9]/g, '').slice(0, 1); });
        cells.push(inp); grid.appendChild(inp);
      }
      function read() { return cells.map(function (c) { var v = parseInt(c.value, 10); return (v >= 1 && v <= 9) ? v : 0; }); }
      function write(g) { for (var i = 0; i < 81; i++) { cells[i].value = g[i] ? String(g[i]) : ''; cells[i].style.color = 'var(--fg)'; } }
      function ok(g, p, v) {
        var r = Math.floor(p / 9), c = p % 9;
        for (var i = 0; i < 9; i++) { if (g[r * 9 + i] === v || g[i * 9 + c] === v) return false; }
        var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
        for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) if (g[(br + a) * 9 + bc + b] === v) return false;
        return true;
      }
      function solve(g) {
        var p = g.indexOf(0);
        if (p < 0) return true;
        for (var v = 1; v <= 9; v++) { if (ok(g, p, v)) { g[p] = v; if (solve(g)) return true; g[p] = 0; } }
        return false;
      }
      function fullGrid() {
        var g = new Array(81).fill(0);
        function fill(pos) {
          if (pos === 81) return true;
          var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          for (var i = nums.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = nums[i]; nums[i] = nums[j]; nums[j] = t; }
          for (var k = 0; k < 9; k++) { if (ok(g, pos, nums[k])) { g[pos] = nums[k]; if (fill(pos + 1)) return true; g[pos] = 0; } }
          return false;
        }
        fill(0);
        return g;
      }
      $('sdGen').addEventListener('click', function () {
        try {
          var g = fullGrid();
          var idxs = [];
          for (var i = 0; i < 81; i++) idxs.push(i);
          for (var j = idxs.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = idxs[j]; idxs[j] = idxs[k]; idxs[k] = t; }
          var remove = 45;
          for (var m = 0; m < remove && m < idxs.length; m++) g[idxs[m]] = 0;
          write(g);
          out('sdOut', note(L('已生成题目，点「求解」查看答案。', 'Puzzle generated — click Solve for the answer.')));
        } catch (e) { out('sdOut', note('⚠ ' + (e.message || e))); }
      });
      $('sdSolve').addEventListener('click', function () {
        var g = read();
        var puzzle = g.slice();
        if (!solve(g)) { out('sdOut', note(L('当前盘面无解，请检查输入。', 'No solution — check your input.'))); return; }
        for (var i = 0; i < 81; i++) { cells[i].value = String(g[i]); cells[i].style.color = puzzle[i] ? 'var(--fg)' : 'var(--accent, #4c8dff)'; }
        out('sdOut', note(L('已求解完成。', 'Solved.')));
      });
      $('sdClear').addEventListener('click', function () {
        write(new Array(81).fill(0));
        out('sdOut', '');
      });
    }
  });
})();
