/* ============================================================
   万能工具箱 · 图片类工具（3 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(2) + ' MB';
  }

  /* ============ 图片压缩 ============ */
  T.register({
    id: 'image-compress', icon: '🗜️', cat: 'image', name: '图片压缩',
    desc: '本地压缩图片，调整尺寸与质量，不经过服务器',
    keywords: '图片压缩 压缩 compress image 缩小',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('图片压缩', 'Image Compress') + '</h3>' +
        '<div class="field"><input type="file" id="icFile" accept="image/*" style="background:var(--bg-soft);border:1px dashed var(--line);border-radius:10px;padding:22px;width:100%;color:var(--ink-dim)"></div>' +
        '<div class="row">' +
          '<div class="field grow"><label>最长边（px）：<b id="icWv">1280</b></label><input type="range" id="icW" min="320" max="2560" step="16" value="1280" style="width:100%;accent-color:var(--accent)"></div>' +
          '<div class="field grow"><label>质量（%）：<b id="icQv">80</b></label><input type="range" id="icQ" min="10" max="100" value="80" style="width:100%;accent-color:var(--accent)"></div>' +
        '</div>' +
        '<div class="img-row" id="icRow" style="display:none">' +
          '<figure><img id="icOrig"><figcaption>原图</figcaption></figure>' +
          '<figure><img id="icNew"><figcaption>压缩后</figcaption></figure>' +
        '</div>' +
        '<div class="out" id="icInfo" style="margin-top:14px"><span class="muted">选择图片后自动压缩</span></div>' +
        '<button class="btn btn-primary" id="icDl" style="margin-top:12px" disabled>' + L('下载压缩图', 'Download') + '</button>' +
      '</div>';
      var fileEl = document.getElementById('icFile');
      var state = { url: null, name: 'compressed.jpg' };
      document.getElementById('icW').addEventListener('input', function () { document.getElementById('icWv').textContent = this.value; });
      document.getElementById('icQ').addEventListener('input', function () { document.getElementById('icQv').textContent = this.value; });
      fileEl.addEventListener('change', function () {
        var file = fileEl.files && fileEl.files[0];
        if (!file) return;
        T.readFile(file, function (dataUrl) {
          var img = new Image();
          img.onload = function () { compress(img, file); };
          img.onerror = function () { T.toast('无法读取该图片'); };
          img.src = dataUrl;
        });
      });
      function compress(img, file) {
        var maxSide = parseInt(document.getElementById('icW').value, 10);
        var quality = parseInt(document.getElementById('icQ').value, 10) / 100;
        var scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        var outType = 'image/jpeg';
        if (/png/i.test(file.type)) outType = 'image/png';
        var out = canvas.toDataURL(outType, outType === 'image/png' ? undefined : quality);
        document.getElementById('icRow').style.display = 'flex';
        document.getElementById('icOrig').src = img.src;
        document.getElementById('icNew').src = out;
        var origSize = file.size;
        var newSize = Math.round(out.length * 3 / 4);
        var reduced = origSize > 0 ? Math.round((1 - newSize / origSize) * 100) : 0;
        document.getElementById('icInfo').innerHTML =
          '原图 ' + img.width + '×' + img.height + ' · ' + fmtBytes(origSize) +
          '<br>压缩后 ' + w + '×' + h + ' · ' + fmtBytes(newSize) +
          (reduced > 0 ? ' · 体积减少约 ' + reduced + '%' : ' · 原图已较小，建议直接使用原图');
        state.url = out;
        state.name = file.name.replace(/\.[^.]+$/, '') + '-compressed.jpg';
        document.getElementById('icDl').disabled = false;
      }
      document.getElementById('icDl').addEventListener('click', function () {
        if (!state.url) return;
        var a = document.createElement('a');
        a.download = state.name;
        a.href = state.url;
        a.click();
      });
    }
  });

  /* ============ 图片转 Base64 ============ */
  T.register({
    id: 'image-base64', icon: '🖼️', cat: 'image', name: '图片转 Base64',
    desc: '图片转 Data URL，用于内嵌网页与代码',
    keywords: 'base64 图片 转换 data url 前端',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('图片转 Base64', 'Image to Base64') + '</h3>' +
        '<div class="field"><input type="file" id="ibFile" accept="image/*" style="background:var(--bg-soft);border:1px dashed var(--line);border-radius:10px;padding:22px;width:100%;color:var(--ink-dim)"></div>' +
        '<div id="ibPrev" style="margin:12px 0"></div>' +
        '<div class="field"><label>Data URL（前缀 data:image/...）</label><div class="out" id="ibOut" style="min-height:120px;max-height:220px;overflow:auto"><span class="muted">选择图片后自动转换</span></div></div>' +
        '<p class="muted">完整 Base64 会内嵌在 Data URL 中，可直接粘贴进 HTML/CSS/JS。</p>' +
      '</div>';
      document.getElementById('ibFile').addEventListener('change', function () {
        var file = this.files && this.files[0];
        if (!file) return;
        T.readFile(file, function (dataUrl) {
          var prev = document.getElementById('ibPrev');
          prev.innerHTML = '<img class="img-preview" src="' + dataUrl + '" alt="预览">' +
            '<p class="muted">' + file.name + ' · ' + fmtBytes(file.size) + '</p>';
          var box = document.getElementById('ibOut');
          box.textContent = dataUrl;
          box.appendChild(T.mkCopyBtn(dataUrl));
        });
      });
    }
  });

  /* ============ 颜色拾取 ============ */
  T.register({
    id: 'color-picker', icon: '🖌️', cat: 'image', name: '颜色拾取',
    desc: '取色并实时转换 HEX / RGB / HSL，常用色板',
    keywords: '颜色 color 取色 色板 hex rgb hsl',
    render: function (host) {
      var presets = ['#E8A33D', '#5B8DEF', '#3BC98A', '#A06BF0', '#F26D6D', '#2ABFC4', '#F2A33B', '#E884A8', '#6FCB6F', '#4EA5E0', '#9AA1AC', '#FFFFFF', '#121417', '#2B3A55'];
      host.innerHTML =
      '<div class="panel"><h3>' + L('颜色拾取', 'Color Picker') + '</h3>' +
        '<div class="swatch" id="cpSwatch"></div>' +
        '<div class="row">' +
          '<div class="field grow"><label>选择颜色</label><input type="color" id="cpPick" value="#E8A33D" style="width:100%;height:44px;background:var(--bg-soft);border:1px solid var(--line);border-radius:10px;cursor:pointer"></div>' +
          '<div class="field grow"><label>HEX</label><input id="cpHex" value="#E8A33D" spellcheck="false"></div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="field grow"><label>R</label><input id="cpR" inputmode="numeric" value="232"></div>' +
          '<div class="field grow"><label>G</label><input id="cpG" inputmode="numeric" value="163"></div>' +
          '<div class="field grow"><label>B</label><input id="cpB" inputmode="numeric" value="61"></div>' +
        '</div>' +
        '<div class="stat-grid">' +
          '<div class="stat-box"><div class="k">HEX</div><div class="v" style="font-size:15px" id="cpOutHex">-</div></div>' +
          '<div class="stat-box"><div class="k">RGB</div><div class="v" style="font-size:15px" id="cpOutRgb">-</div></div>' +
          '<div class="stat-box"><div class="k">HSL</div><div class="v" style="font-size:15px" id="cpOutHsl">-</div></div>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>常用色板（点击复制）</label><div class="chips" id="cpPresets">' +
          presets.map(function (c) { return '<span class="chip" data-c="' + c + '" style="background:' + c + ';border-color:transparent;width:34px;height:34px;padding:0;cursor:pointer" title="' + c + '"></span>'; }).join('') +
        '</div></div>' +
      '</div>';
      function hexToRgb(h) {
        var m = /^#?([0-9a-f]{6})$/i.exec(h.trim());
        if (!m) return null;
        var n = parseInt(m[1], 16);
        return { r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 };
      }
      function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
          else if (max === g) h = (b - r) / d + 2;
          else h = (r - g) / d + 4;
          h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
      }
      function apply(r, g, b, fromPicker) {
        r = Math.max(0, Math.min(255, r | 0));
        g = Math.max(0, Math.min(255, g | 0));
        b = Math.max(0, Math.min(255, b | 0));
        var hex = '#' + [r, g, b].map(function (v) { return v.toString(16).padStart(2, '0'); }).join('');
        var hsl = rgbToHsl(r, g, b);
        document.getElementById('cpSwatch').style.background = hex;
        if (!fromPicker) document.getElementById('cpPick').value = hex;
        document.getElementById('cpHex').value = hex;
        document.getElementById('cpR').value = r;
        document.getElementById('cpG').value = g;
        document.getElementById('cpB').value = b;
        var o1 = document.getElementById('cpOutHex');
        o1.textContent = hex; o1.appendChild(T.mkCopyBtn(hex));
        var rgbS = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        var o2 = document.getElementById('cpOutRgb');
        o2.textContent = rgbS; o2.appendChild(T.mkCopyBtn(rgbS));
        var hslS = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
        var o3 = document.getElementById('cpOutHsl');
        o3.textContent = hslS; o3.appendChild(T.mkCopyBtn(hslS));
      }
      document.getElementById('cpPick').addEventListener('input', function () {
        var c = hexToRgb(this.value);
        if (c) apply(c.r, c.g, c.b, true);
      });
      document.getElementById('cpHex').addEventListener('input', function () {
        var c = hexToRgb(this.value);
        if (c) apply(c.r, c.g, c.b, false);
      });
      function bindRgb(id) {
        document.getElementById(id).addEventListener('input', function () {
          var r = parseInt(document.getElementById('cpR').value, 10);
          var g = parseInt(document.getElementById('cpG').value, 10);
          var b = parseInt(document.getElementById('cpB').value, 10);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) apply(r, g, b, false);
        });
      }
      bindRgb('cpR'); bindRgb('cpG'); bindRgb('cpB');
      document.getElementById('cpPresets').addEventListener('click', function (e) {
        var chip = e.target.closest('[data-c]');
        if (!chip) return;
        var c = hexToRgb(chip.getAttribute('data-c'));
        if (c) apply(c.r, c.g, c.b, false);
      });
      apply(232, 163, 61, true);
    }
  });
})();
