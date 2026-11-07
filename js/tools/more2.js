/* ============================================================
   万能工具箱 v2.9 · 编码转换增强（5 款）
   Base64 / Hex / URL 编解码 / JWT 解析 / HTML 转义
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }

  
  /* ============ Hex 与文本互转 ============ */
  T.register({
    id: 'hex-text', cat: 'codec', icon: '#️⃣',
    name: 'Hex 与文本互转',
    desc: '字符串与十六进制互转，可加分隔',
    keywords: 'hex 十六进制 16进制 转换 bytes encode',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Hex 与文本互转', 'Hex ↔ Text') + '</h3>' +
        '<div class="field"><label>' + L('输入', 'Input') + '</label><textarea id="hxIn" style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="hxEnc">' + L('文本 → Hex', 'Text → Hex') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="hxDec">' + L('Hex → 文本', 'Hex → Text') + '</button></div>' +
        '<div class="field"><label>' + L('分隔', 'Separator') + '</label><select id="hxSep"><option value="">' + L('无', 'None') + '</option><option value=" " selected>' + L('空格', 'Space') + '</option><option value="-">-</option><option value=":">:</option></select></div></div>' +
        '<div class="field"><label>' + L('输出', 'Output') + '</label><textarea id="hxOut" style="min-height:110px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="hxCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
      '</div>';
      function pad2(n) { return (n < 16 ? '0' : '') + n.toString(16); }
      $('hxEnc').addEventListener('click', function () {
        var sep = $('hxSep').value;
        var bytes = new TextEncoder().encode($('hxIn').value);
        var arr = [];
        for (var i = 0; i < bytes.length; i++) arr.push(pad2(bytes[i]));
        $('hxOut').value = arr.join(sep);
      });
      $('hxDec').addEventListener('click', function () {
        var hex = $('hxIn').value.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '');
        if (hex.length % 2) { T.toast(L('Hex 长度必须为偶数', 'Hex length must be even')); return; }
        var bytes = new Uint8Array(hex.length / 2);
        for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        try { $('hxOut').value = new TextDecoder().decode(bytes); } catch (e) { T.toast(L('解码失败', 'Decode failed')); }
      });
      $('hxCopy').addEventListener('click', function () { T.copyText($('hxOut').value); });
    }
  });

  
  /* ============ JWT 解析 ============ */
  T.register({
    id: 'jwt-decode', cat: 'codec', icon: '🪪',
    name: 'JWT 解析',
    desc: '解码 Header / Payload（不验签）',
    keywords: 'jwt json web token 解析 header payload decode',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('JWT 解析（不验签）', 'JWT Decode (no verify)') + '</h3>' +
        '<div class="field"><label>' + L('JWT', 'JWT') + '</label><textarea id="jwtIn" placeholder="eyJhbGciOi..." style="min-height:90px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="jwtBtn">' + L('解析', 'Decode') + '</button></div></div>' +
        '<div id="jwtOut"></div>' +
      '</div>';
      function b64url(s) {
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        return s;
      }
      $('jwtBtn').addEventListener('click', function () {
        var raw = $('jwtIn').value.trim();
        var parts = raw.split('.');
        if (parts.length < 2) { out('jwtOut', '<div class="empty"><b>' + L('JWT 格式应为 header.payload.signature', 'JWT format: header.payload.signature') + '</b></div>'); return; }
        try {
          var h = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64url(parts[0])), function (c) { return c.charCodeAt(0); })));
          var p = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64url(parts[1])), function (c) { return c.charCodeAt(0); })));
          function box(title, obj) {
            return '<div class="field"><label>' + title + '</label><div class="diff-box">' + esc(JSON.stringify(obj, null, 2)) + '</div></div>';
          }
          var h2 = '<div class="row" style="margin-top:8px">' + box(L('头部 Header', 'Header'), h) + box(L('载荷 Payload', 'Payload'), p) + '</div>';
          if (parts[2]) h2 += '<p class="note" style="margin-top:8px">' + L('签名段未验证。', 'Signature not verified.') + '</p>';
          out('jwtOut', h2);
        } catch (e) {
          out('jwtOut', '<div class="empty"><b>' + L('解析失败', 'Decode failed') + '</b><span style="font-size:13px">' + esc(String(e.message || e)) + '</span></div>');
        }
      });
    }
  });

  /* ============ HTML 转义与还原 ============ */
  T.register({
    id: 'html-escape', cat: 'codec', icon: '⌗',
    name: 'HTML 转义',
    desc: 'HTML 实体编码 / 还原',
    keywords: 'html escape entity 转义 实体 编码 解码 &amp;',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('HTML 转义与还原', 'HTML Escape / Unescape') + '</h3>' +
        '<div class="field"><label>' + L('输入', 'Input') + '</label><textarea id="heIn" style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="heEsc">' + L('转义 →', 'Escape →') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="heUn">' + L('← 还原', '← Unescape') + '</button></div></div>' +
        '<div class="field"><label>' + L('输出', 'Output') + '</label><textarea id="heOut" style="min-height:110px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="heCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
      '</div>';
      var MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      $('heEsc').addEventListener('click', function () {
        $('heOut').value = $('heIn').value.replace(/[&<>"']/g, function (c) { return MAP[c]; });
      });
      $('heUn').addEventListener('click', function () {
        var s = $('heIn').value
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');
        $('heOut').value = s;
      });
      $('heCopy').addEventListener('click', function () { T.copyText($('heOut').value); });
    }
  });
})();
