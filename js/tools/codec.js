/* ============================================================
   万能工具箱 · 编码类工具（哈希 / 摩斯 / 二维码）
   哈希算法：纯 JS 实现（MD5 / SHA-1 / SHA-256），仅本地计算
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 哈希函数库 ============ */
  function utf8Bytes(str) {
    return new TextEncoder().encode(str);
  }
  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
  function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }

  /* ---- MD5 ---- */
  function md5(str) {
    var bytes = utf8Bytes(str);
    var bitLen = bytes.length * 8;
    var msg = new Uint8Array(((bytes.length + 8) >> 6 << 6) + 64);
    msg.set(bytes);
    msg[bytes.length] = 0x80;
    /* 长度以 64 位小端写入 */
    var dv = new DataView(msg.buffer);
    dv.setUint32(msg.length - 8, bitLen >>> 0, true);
    dv.setUint32(msg.length - 4, Math.floor(bitLen / 0x100000000), true);

    var K = [];
    for (var i = 0; i < 64; i++) {
      K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
    }
    var S = [[7, 12, 17, 22], [5, 9, 14, 20], [4, 11, 16, 23], [6, 10, 15, 21]];
    var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    var M = new Uint32Array(16);

    for (var off = 0; off < msg.length; off += 64) {
      for (i = 0; i < 16; i++) {
        M[i] = dv.getUint32(off + i * 4, true);
      }
      var A = a0, B = b0, C = c0, D = d0;
      for (i = 0; i < 64; i++) {
        var f, g;
        if (i < 16) { f = (B & C) | (~B & D); g = i; }
        else if (i < 32) { f = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if (i < 48) { f = B ^ C ^ D; g = (3 * i + 5) % 16; }
        else { f = C ^ (B | ~D); g = (7 * i) % 16; }
        var round = i >> 4;
        var tmp = (B + rotl((A + f + K[i] + M[g]) >>> 0, S[round][i % 4])) >>> 0;
        A = D; D = C; C = B; B = tmp;
      }
      a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
    }
    function le32(x) {
      var s = '';
      for (var k = 0; k < 4; k++) { s += ((x >>> (k * 8)) & 0xff).toString(16).padStart(2, '0'); }
      return s;
    }
    return le32(a0) + le32(b0) + le32(c0) + le32(d0);
  }

  /* ---- SHA-1 ---- */
  function sha1(str) {
    var bytes = utf8Bytes(str);
    var bitLen = bytes.length * 8;
    var msg = new Uint8Array(((bytes.length + 8) >> 6 << 6) + 64);
    msg.set(bytes);
    msg[bytes.length] = 0x80;
    var dv = new DataView(msg.buffer);
    dv.setUint32(msg.length - 8, Math.floor(bitLen / 0x100000000));
    dv.setUint32(msg.length - 4, bitLen >>> 0);

    var h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
    var K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];
    var w = new Uint32Array(80);

    for (var off = 0; off < msg.length; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 80; i++) {
        w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
      }
      var a = h0, b = h1, c = h2, d = h3, e = h4;
      for (i = 0; i < 80; i++) {
        var f, k;
        if (i < 20) { f = (b & c) | (~b & d); k = K[0]; }
        else if (i < 40) { f = b ^ c ^ d; k = K[1]; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = K[2]; }
        else { f = b ^ c ^ d; k = K[3]; }
        var tmp = (rotl(a, 5) + f + e + k + w[i]) >>> 0;
        e = d; d = c; c = rotl(b, 30); b = a; a = tmp;
      }
      h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
    }
    function be32(x) { return (x >>> 0).toString(16).padStart(8, '0'); }
    return be32(h0) + be32(h1) + be32(h2) + be32(h3) + be32(h4);
  }

  /* ---- SHA-256 ---- */
  function sha256(str) {
    var bytes = utf8Bytes(str);
    var bitLen = bytes.length * 8;
    var msg = new Uint8Array(((bytes.length + 8) >> 6 << 6) + 64);
    msg.set(bytes);
    msg[bytes.length] = 0x80;
    var dv = new DataView(msg.buffer);
    dv.setUint32(msg.length - 8, Math.floor(bitLen / 0x100000000));
    dv.setUint32(msg.length - 4, bitLen >>> 0);

    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    /* K：前 64 个素数立方根的小数部分前 32 位 */
    var K = (function () {
      var primes = [], n = 2;
      while (primes.length < 64) {
        var isP = true;
        for (var i = 0; i < primes.length; i++) {
          if (n % primes[i] === 0) { isP = false; break; }
          if (primes[i] * primes[i] > n) break;
        }
        if (isP) primes.push(n);
        n++;
      }
      return primes.map(function (p) {
        var r = Math.cbrt(p);
        return Math.floor((r - Math.floor(r)) * 0x100000000) >>> 0;
      });
    })();

    var w = new Uint32Array(64);
    for (var off = 0; off < msg.length; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (i = 16; i < 64; i++) {
        var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    function be32(x) { return (x >>> 0).toString(16).padStart(8, '0'); }
    return H.map(be32).join('');
  }

  /* ============ 哈希工具 ============ */
  T.register({
    id: 'hash', icon: '🧬', cat: 'codec', name: 'MD5 / SHA 哈希',
    desc: '文本的 MD5、SHA-1、SHA-256 摘要（本地计算，不上传）',
    keywords: 'md5 sha1 sha256 哈希 hash 摘要',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('哈希计算', 'Hash Calculator') + '</h3>' +
        '<div class="field"><textarea id="hsIn" placeholder="' + L('输入要计算哈希的文本…', 'Enter text to hash…') + '" style="min-height:130px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="hsMd5">MD5</button>' +
          '<button class="btn btn-ghost" id="hsSha1">SHA-1</button>' +
          '<button class="btn btn-ghost" id="hsSha256">SHA-256</button>' +
          '<button class="btn btn-ghost" id="hsAll">' + L('全部计算', 'All') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>MD5</label><div class="out" id="hsOut1"><span class="muted">-</span></div></div>' +
        '<div class="field"><label>SHA-1</label><div class="out" id="hsOut2"><span class="muted">-</span></div></div>' +
        '<div class="field"><label>SHA-256</label><div class="out" id="hsOut3"><span class="muted">-</span></div></div>' +
        '<p class="muted">' + L('所有计算都在本地完成，输入内容不会离开设备。', 'All hashing runs locally; nothing leaves your device.') + '</p>' +
      '</div>';
      function setOut(id, val) {
        var box = document.getElementById(id);
        box.textContent = val;
        box.appendChild(T.mkCopyBtn(val));
      }
      function run(type) {
        var s = document.getElementById('hsIn').value;
        if (!s) { T.toast(L('请输入文本', 'Enter some text')); return; }
        if (type === 1 || type === 4) setOut('hsOut1', md5(s));
        if (type === 2 || type === 4) setOut('hsOut2', sha1(s));
        if (type === 3 || type === 4) setOut('hsOut3', sha256(s));
      }
      document.getElementById('hsMd5').addEventListener('click', function () { run(1); });
      document.getElementById('hsSha1').addEventListener('click', function () { run(2); });
      document.getElementById('hsSha256').addEventListener('click', function () { run(3); });
      document.getElementById('hsAll').addEventListener('click', function () { run(4); });
    }
  });

  /* ============ 摩斯密码 ============ */
  T.register({
    id: 'morse', icon: '📡', cat: 'codec', name: '摩斯密码',
    desc: '文本与摩斯电码互转（国际标准）',
    keywords: '摩斯 morse 电码 密码 莫尔斯',
    render: function (host) {
      var map = {
        A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
        I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
        Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
        Y: '-.--', Z: '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '-': '-....-', '/': '-..-.',
        '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
        '+': '.-.-.', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
      };
      var rev = {};
      Object.keys(map).forEach(function (k) { rev[map[k]] = k; });
      host.innerHTML =
      '<div class="panel"><h3>' + L('摩斯密码', 'Morse Code') + '</h3>' +
        '<div class="field"><textarea id="msIn" placeholder="' + L('输入文本或摩斯码（字母间空格，单词间 / ）…', 'Enter text or Morse (space between letters, / between words)…') + '" style="min-height:150px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="msEnc">文本 → 摩斯</button>' +
          '<button class="btn btn-ghost" id="msDec">Morse → ' + L('文本', 'Text') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>' + L('输出', 'Output') + '</label><div class="out" id="msOut" style="min-height:100px"><span class="muted">' + L('结果将显示在这里', 'Result appears here') + '</span></div></div>' +
      '</div>';
      document.getElementById('msEnc').addEventListener('click', function () {
        var s = document.getElementById('msIn').value.toUpperCase();
        if (!s.trim()) { T.toast(L('请输入内容', 'Enter some content')); return; }
        var words = s.split(/\s+/);
        var out = words.map(function (w) {
          return w.split('').map(function (c) {
            return map[c] != null ? map[c] : null;
          }).filter(function (x) { return x != null; }).join(' ');
        }).filter(function (x) { return x; }).join(' / ');
        var box = document.getElementById('msOut');
        box.textContent = out || L('（无可编码字符）', '(no encodable chars)');
        box.appendChild(T.mkCopyBtn(box.textContent));
      });
      document.getElementById('msDec').addEventListener('click', function () {
        var s = document.getElementById('msIn').value.trim();
        if (!s) { T.toast(L('请输入内容', 'Enter some content')); return; }
        try {
          var out = s.split('/').map(function (word) {
            return word.trim().split(/\s+/).map(function (m) {
              if (rev[m] != null) return rev[m];
              throw new Error('无法识别的码: ' + m);
            }).join('');
          }).join(' ');
          var box = document.getElementById('msOut');
          box.textContent = out;
          box.appendChild(T.mkCopyBtn(out));
        } catch (e) {
          document.getElementById('msOut').textContent = e.message;
        }
      });
    }
  });

  /* ============ 二维码生成 ============ */
  T.register({
    id: 'qrcode', icon: '🔳', cat: 'codec', name: '二维码生成',
    desc: '文本 / 链接生成二维码，可下载 PNG',
    keywords: '二维码 qr code 扫码 链接',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('二维码生成', 'QR Generator') + '</h3>' +
        '<div class="field"><textarea id="qrIn" placeholder="' + L('输入文本或链接，例如 https://example.com …', 'Enter text or a link, e.g. https://example.com…') + '" style="min-height:120px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="qrBtn">' + L('生成二维码', 'Generate QR') + '</button>' +
          '<button class="btn btn-ghost" id="qrDl" disabled>' + L('下载 PNG', 'Download PNG') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:16px"><label>' + L('预览', 'Preview') + '</label>' +
          '<div class="qr-box" id="qrBox"><span class="muted">' + L('输入内容后点击生成', 'Enter content and click generate') + '</span></div>' +
        '</div>' +
      '</div>';
      var lastSvg = null, lastMatrix = null, lastSize = 0;
      document.getElementById('qrBtn').addEventListener('click', function () {
        var s = document.getElementById('qrIn').value;
        if (!s.trim()) { T.toast('请输入内容'); return; }
        var typeNumber = 0; /* 自动选择版本 */
        var errLv = 'M';
        var qr = null;
        try {
          qr = qrcode(typeNumber, errLv);
          qr.addData(s, 'Byte');
          qr.make();
        } catch (e) {
          T.toast('内容过长，无法生成二维码');
          return;
        }
        lastSize = qr.getModuleCount();
        lastMatrix = [];
        for (var r = 0; r < lastSize; r++) {
          lastMatrix[r] = [];
          for (var c = 0; c < lastSize; c++) lastMatrix[r][c] = qr.isDark(r, c);
        }
        lastSvg = qr.createSvgTag(6, 4);
        document.getElementById('qrBox').innerHTML = lastSvg +
          '<span class="muted">版本自动 · 纠错级别 M · ' + lastSize + '×' + lastSize + ' 模块</span>';
        document.getElementById('qrDl').disabled = false;
      });
      document.getElementById('qrDl').addEventListener('click', function () {
        if (!lastMatrix) return;
        var scale = 12, pad = 4;
        var canvas = document.createElement('canvas');
        canvas.width = (lastSize + pad * 2) * scale;
        canvas.height = canvas.width;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        for (var r = 0; r < lastSize; r++) {
          for (var c = 0; c < lastSize; c++) {
            if (lastMatrix[r][c]) ctx.fillRect((c + pad) * scale, (r + pad) * scale, scale, scale);
          }
        }
        var a = document.createElement('a');
        a.download = 'qrcode.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
        T.toast('二维码已下载');
      });
    }
  });
})();
