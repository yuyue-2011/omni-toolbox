/* ============================================================
   万能工具箱 v3.0 · 开发者工具增强（7 款）
   JSON↔YAML / GZIP 压缩 / 色盲模拟 / Lorem 占位 / ULID 生成
   JSONPath 查询 / JSON 数组转表格
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }

  /* ============ JSON ↔ YAML 互转 ============ */
  T.register({
    id: 'json-yaml', cat: 'data', icon: '🔀',
    name: 'JSON ↔ YAML 互转',
    desc: 'JSON 与 YAML 双向转换（常用子集）',
    keywords: 'json yaml 转换 互转 配置 config',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('JSON ↔ YAML 互转', 'JSON ↔ YAML Converter') + '</h3>' +
        '<div class="field"><label>JSON</label><textarea id="jyJson" placeholder=\'{"name":"万能工具箱","ver":3,"tags":["工具","离线"]}\' style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="jyToYaml">' + L('JSON → YAML', 'JSON → YAML') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="jyToJson">' + L('YAML → JSON', 'YAML → JSON') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="jySample">' + L('示例', 'Sample') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>YAML</label><textarea id="jyYaml" placeholder="name: 万能工具箱&#10;ver: 3" style="min-height:130px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="jyCopyY">' + L('复制 YAML', 'Copy YAML') + '</button></div>' +
        '<div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="jyCopyJ">' + L('复制 JSON', 'Copy JSON') + '</button></div></div>' +
        '<div id="jyErr"></div>' +
      '</div>';
      function toYaml(v, depth) {
        var pad = '  '.repeat(depth);
        if (Array.isArray(v)) {
          if (!v.length) return '[]';
          return v.map(function (it) {
            if (it && typeof it === 'object') {
              var inner = toYaml(it, depth + 1).replace(/^ {2}/, '');
              return pad + '- ' + inner;
            }
            return pad + '- ' + JSON.stringify(it);
          }).join('\n');
        }
        if (v && typeof v === 'object') {
          var keys = Object.keys(v);
          if (!keys.length) return '{}';
          return keys.map(function (k) {
            var val = v[k];
            if (val && typeof val === 'object') {
              var sub = toYaml(val, depth + 1);
              if (sub === '[]' || sub === '{}') return pad + k + ': ' + sub;
              return pad + k + ':\n' + sub;
            }
            return pad + k + ': ' + JSON.stringify(val);
          }).join('\n');
        }
        return pad + JSON.stringify(v);
      }
      function yamlToJson(text) {
        var lines = text.split(/\r?\n/).filter(function (l) { return l.trim() && !/^\s*#/.test(l); });
        var idx = 0;
        function parseBlock(depth) {
          var result = null, lastKey = null;
          while (idx < lines.length) {
            var line = lines[idx];
            var ind = line.match(/^ */)[0].length;
            if (ind < depth) break;
            if (ind > depth) throw new Error(L('缩进层级过深：第 ', 'Bad indent at line ') + (idx + 1));
            var content = line.slice(depth);
            if (content[0] === '-') {
              if (!Array.isArray(result)) result = [];
              var itemRaw = content.slice(1).trim();
              if (!itemRaw) {
                idx++;
                var sub = parseBlock(depth + 2);
                result.push(sub);
                continue;
              }
              var kv = itemRaw.match(/^([^\s:]+):\s*(.*)$/);
              if (kv) {
                var obj = {};
                obj[kv[1]] = scalar(kv[2]);
                idx++;
                var sub2 = parseBlock(depth + 2);
                if (sub2 && typeof sub2 === 'object') Object.keys(sub2).forEach(function (k) { obj[k] = sub2[k]; });
                result.push(obj);
              } else {
                result.push(scalar(itemRaw));
                idx++;
              }
              continue;
            }
            var m = content.match(/^([^:]+):\s*(.*)$/);
            if (!m) throw new Error(L('无法解析第 ', 'Cannot parse line ') + (idx + 1) + L(' 行', ''));
            if (result === null) result = {};
            var key = m[1].trim(), valRaw = m[2].trim();
            lastKey = key;
            if (!valRaw) {
              idx++;
              var deeper = lines[idx] && lines[idx].match(/^ */)[0].length > depth;
              result[key] = deeper ? parseBlock(depth + 2) : '';
            } else {
              result[key] = scalar(valRaw);
              idx++;
            }
          }
          return result;
        }
        function scalar(s) {
          if (/^".*"$/.test(s)) return JSON.parse(s);
          if (/^'.*'$/.test(s)) return s.slice(1, -1);
          if (s === 'true') return true;
          if (s === 'false') return false;
          if (s === 'null' || s === '~') return null;
          if (/^-?\d+$/.test(s)) return parseInt(s, 10);
          if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
          return s;
        }
        return parseBlock(0);
      }
      $('jyToYaml').addEventListener('click', function () {
        try {
          var v = JSON.parse($('jyJson').value);
          $('jyYaml').value = toYaml(v, 0);
          out('jyErr', '<div class="msg ok">' + L('已转换为 YAML', 'Converted to YAML') + '</div>');
        } catch (e) { out('jyErr', '<div class="msg err">' + L('JSON 解析失败：', 'JSON parse error: ') + esc(e.message) + '</div>'); }
      });
      $('jyToJson').addEventListener('click', function () {
        try {
          var v = yamlToJson($('jyYaml').value);
          $('jyJson').value = JSON.stringify(v, null, 2);
          out('jyErr', '<div class="msg ok">' + L('已转换为 JSON', 'Converted to JSON') + '</div>');
        } catch (e) { out('jyErr', '<div class="msg err">' + L('YAML 解析失败：', 'YAML parse error: ') + esc(e.message) + '</div>'); }
      });
      $('jySample').addEventListener('click', function () {
        $('jyJson').value = JSON.stringify({ name: '万能工具箱', version: 3, offline: true, tags: ['工具', '离线'], author: { team: 'Chatbox', year: 2026 } }, null, 2);
        out('jyErr', '');
      });
      $('jyCopyY').addEventListener('click', function () { T.copyText($('jyYaml').value); });
      $('jyCopyJ').addEventListener('click', function () { T.copyText($('jyJson').value); });
    }
  });

  /* ============ GZIP 压缩 / 解压 ============ */
  T.register({
    id: 'gzip', cat: 'codec', icon: '🗜️',
    name: 'GZIP 压缩 / 解压',
    desc: '文本 GZIP 压缩为 Base64、反向解压',
    keywords: 'gzip 压缩 解压 base64 zlib deflate',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('GZIP 压缩 / 解压', 'GZIP Compress / Decompress') + '</h3>' +
        '<div class="field"><label>' + L('输入文本', 'Input text') + '</label><textarea id="gzIn" style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="gzZip">' + L('压缩 → Base64', 'Compress → Base64') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="gzUnzip">' + L('Base64 → 解压', 'Base64 → Decompress') + '</button></div></div>' +
        '<div class="stat-grid" style="margin-top:12px">' +
          '<div class="stat-box"><div class="k">' + L('原始大小', 'Original') + '</div><div class="v" id="gzO">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('压缩后', 'Compressed') + '</div><div class="v" id="gzC">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('压缩率', 'Ratio') + '</div><div class="v" id="gzR">-</div></div></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('输出（Base64）', 'Output (Base64)') + '</label><textarea id="gzOut" style="min-height:90px" readonly></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="gzCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
        '<div id="gzErr"></div>' +
      '</div>';
      function b64ToBytes(b64) {
        var bin = atob(b64.replace(/\s+/g, ''));
        var arr = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return arr;
      }
      function bytesToB64(bytes) {
        var bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin);
      }
      function human(n) { return n < 1024 ? n + ' B' : (n / 1024).toFixed(1) + ' KB'; }
      function guard() {
        if (typeof CompressionStream === 'undefined') {
          out('gzErr', '<div class="msg err">' + L('当前浏览器不支持压缩流（CompressionStream），请用 Chrome 80+ 或客户端。', 'This browser lacks CompressionStream — use Chrome 80+ or the desktop app.') + '</div>');
          return false;
        }
        return true;
      }
      $('gzZip').addEventListener('click', function () {
        if (!guard()) return;
        var raw = $('gzIn').value;
        if (!raw) { out('gzErr', '<div class="msg err">' + L('请输入文本', 'Enter text first') + '</div>'); return; }
        var stream = new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'));
        new Response(stream).arrayBuffer().then(function (buf) {
          var bytes = new Uint8Array(buf);
          $('gzOut').value = bytesToB64(bytes);
          $('gzO').textContent = human(raw.length * 3); /* UTF-8 近似 */
          $('gzC').textContent = human(bytes.length);
          $('gzR').textContent = raw.length ? Math.round(bytes.length / raw.length * 100) + '%' : '-';
          out('gzErr', '<div class="msg ok">' + L('压缩完成', 'Done') + '</div>');
        }).catch(function (e) { out('gzErr', '<div class="msg err">' + esc(e.message) + '</div>'); });
      });
      $('gzUnzip').addEventListener('click', function () {
        if (!guard()) return;
        var b64 = $('gzIn').value.trim();
        if (!b64) { out('gzErr', '<div class="msg err">' + L('请输入 Base64 压缩数据', 'Paste Base64 gzip data first') + '</div>'); return; }
        try {
          var stream = new Blob([b64ToBytes(b64)]).stream().pipeThrough(new DecompressionStream('gzip'));
          new Response(stream).text().then(function (txt) {
            $('gzOut').value = txt;
            $('gzO').textContent = '-'; $('gzC').textContent = human(txt.length); $('gzR').textContent = '-';
            out('gzErr', '<div class="msg ok">' + L('解压完成', 'Done') + '</div>');
          }).catch(function (e) { out('gzErr', '<div class="msg err">' + L('解压失败：数据不是有效的 GZIP', 'Decompress failed: not valid GZIP') + '</div>'); });
        } catch (e) { out('gzErr', '<div class="msg err">' + L('Base64 解码失败', 'Base64 decode failed') + '</div>'); }
      });
      $('gzCopy').addEventListener('click', function () { T.copyText($('gzOut').value); });
    }
  });

  /* ============ 色盲模拟 ============ */
  T.register({
    id: 'colorblind', cat: 'image', icon: '👁️',
    name: '色盲模拟',
    desc: '模拟红/绿/蓝色盲与全色盲视图',
    keywords: '色盲 模拟 无障碍 对比度 accessibility',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('色盲模拟', 'Color-Blindness Simulator') + '</h3>' +
        '<div class="field"><label>' + L('选择或拖入图片', 'Choose or drop an image') + '</label><input type="file" id="cbFile" accept="image/*" style="font-size:13px"></div>' +
        '<div class="field"><label>' + L('色觉类型', 'Vision type') + '</label><div class="seg" id="cbType">' +
          ['红色盲 Protanopia', '绿色盲 Deuteranopia', '蓝色盲 Tritanopia', '全色盲 Achromatopsia'].map(function (n, i) {
            return '<button type="button" data-i="' + i + '"' + (i === 0 ? ' class="active"' : '') + '>' + L(n.split(' ')[0], n.split(' ')[1]) + '</button>';
          }).join('') +
        '</div></div>' +
        '<div class="cb-wrap" style="margin-top:14px;text-align:center">' +
          '<canvas id="cbCanvas" style="max-width:100%;border-radius:10px;border:1px solid var(--line);background:var(--card-2)"></canvas>' +
          '<div class="empty" style="padding:30px" id="cbEmpty"><b>' + L('导入图片后开始模拟', 'Load an image to start') + '</b></div>' +
        '</div>' +
        '<div class="row" style="margin-top:12px"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="cbDl">' + L('下载模拟结果', 'Download result') + '</button></div></div>' +
      '</div>';
      /* LMS 色觉变换矩阵（标准近似值） */
      var M = {
        0: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],      /* 红色盲 */
        1: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],              /* 绿色盲 */
        2: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],        /* 蓝色盲 */
        3: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114] /* 全色盲 */
      };
      var cur = 0, img = null;
      function draw() {
        if (!img) return;
        var cv = $('cbCanvas');
        $('cbEmpty').style.display = 'none';
        cv.width = img.width; cv.height = img.height;
        var ctx = cv.getContext('2d');
        if (!ctx) { out('cbEmpty', '<b>' + L('当前环境不支持 Canvas', 'Canvas not supported here') + '</b>'); $('cbEmpty').style.display = ''; cv.style.display = 'none'; return; }
        ctx.drawImage(img, 0, 0);
        try {
          var data = ctx.getImageData(0, 0, cv.width, cv.height);
          var d = data.data, mm = M[cur];
          for (var i = 0; i < d.length; i += 4) {
            var r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
            d[i] = Math.round((r * mm[0] + g * mm[1] + b * mm[2]) * 255);
            d[i + 1] = Math.round((r * mm[3] + g * mm[4] + b * mm[5]) * 255);
            d[i + 2] = Math.round((r * mm[6] + g * mm[7] + b * mm[8]) * 255);
          }
          ctx.putImageData(data, 0, 0);
        } catch (e) { /* 跨域图片无法读取像素，保持原图 */ }
      }
      $('cbType').querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          $('cbType').querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          cur = Number(b.dataset.i);
          draw();
        });
      });
      function handle(file) {
        if (!file) return;
        img = new Image();
        img.onload = draw;
        T.readFile(file, function (url) { img.src = url; });
      }
      $('cbFile').addEventListener('change', function () { handle(this.files[0]); });
      $('cbDl').addEventListener('click', function () {
        var cv = $('cbCanvas');
        if (!img || !cv.width) { T.toast(L('请先导入图片', 'Load an image first')); return; }
        cv.toBlob(function (blob) { T.blobDownload(blob, 'colorblind.png'); });
      });
    }
  });

  /* ============ Lorem Ipsum 占位文本 ============ */
  T.register({
    id: 'lorem', cat: 'text', icon: '✒️',
    name: 'Lorem 占位文本',
    desc: '生成中英文占位假文本（段/句/词）',
    keywords: 'lorem ipsum 占位 文本 假数据 mock',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Lorem Ipsum 占位文本', 'Lorem Ipsum Placeholder') + '</h3>' +
        '<div class="row">' +
        '<div class="field grow"><label>' + L('数量', 'Count') + '</label><input id="loCount" type="number" value="5" min="1" max="200"></div>' +
        '<div class="field grow"><label>' + L('单位', 'Unit') + '</label><select id="loUnit"><option value="p">' + L('段落', 'Paragraphs') + '</option><option value="s">' + L('句子', 'Sentences') + '</option><option value="w">' + L('单词', 'Words') + '</option></select></div>' +
        '<div class="field grow"><label>' + L('语言', 'Language') + '</label><select id="loLang"><option value="zh">' + L('中文', 'Chinese') + '</option><option value="en" selected>Lorem Ipsum</option></select></div></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="loGen">' + L('生成', 'Generate') + '</button></div>' +
        '<div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="loCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('结果', 'Result') + '</label><textarea id="loOut" style="min-height:150px" readonly></textarea></div>' +
        '<div id="loStat"></div>' +
      '</div>';
      var EN = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];
      var ZH = ['在这个', '数字化的', '时代', '工具', '让', '生活', '更', '便捷', '我们', '致力于', '打造', '一款', '全能的', '离线', '工具箱', '覆盖', '日常', '办公', '学习', '与', '娱乐', '的', '方方面面', '所有', '功能', '都在', '本地', '运行', '无需', '联网', '数据', '安全', '可靠', '界面', '简洁', '直观', '操作', '流畅', '自然', '支持', '多端', '同步', '体验', '一致', '持续', '更新', '迭代', '倾听', '用户', '反馈', '不断', '完善', '细节'];
      function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
      function sentence(lang) {
        var w = lang === 'zh' ? ZH : EN, n = lang === 'zh' ? 8 + Math.floor(Math.random() * 6) : 6 + Math.floor(Math.random() * 10);
        var parts = [];
        for (var i = 0; i < n; i++) parts.push(pick(w));
        var s = parts.join(lang === 'zh' ? '' : ' ');
        return s.charAt(0).toUpperCase() + s.slice(1) + (lang === 'zh' ? '。' : '.');
      }
      function paragraph(lang) {
        var n = 3 + Math.floor(Math.random() * 4), arr = [];
        for (var i = 0; i < n; i++) arr.push(sentence(lang));
        return arr.join(lang === 'zh' ? '' : ' ');
      }
      $('loGen').addEventListener('click', function () {
        var n = Math.min(200, Math.max(1, Number($('loCount').value) || 5));
        var unit = $('loUnit').value, lang = $('loLang').value, arr = [];
        for (var i = 0; i < n; i++) {
          if (unit === 'p') arr.push(paragraph(lang));
          else if (unit === 's') arr.push(sentence(lang));
          else arr.push(pick(lang === 'zh' ? ZH : EN));
        }
        $('loOut').value = arr.join(unit === 'w' ? ' ' : '\n\n');
        out('loStat', '<div class="msg ok">' + L('已生成 ', 'Generated ') + n + ' ' + $('loUnit').selectedOptions[0].text + L('，共 ', ', ') + $('loOut').value.length + L(' 字符', ' chars') + '</div>');
      });
      $('loCopy').addEventListener('click', function () { T.copyText($('loOut').value); });
    }
  });

  /* ============ ULID 批量生成 ============ */
  T.register({
    id: 'ulid', cat: 'code', icon: '🕰️',
    name: 'ULID 批量生成',
    desc: '生成时间有序的 ULID（Crockford Base32）',
    keywords: 'ulid id 生成 uuid 主键 时间有序',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('ULID 批量生成', 'ULID Batch Generator') + '</h3>' +
        '<div class="row">' +
        '<div class="field grow"><label>' + L('数量', 'Count') + '</label><input id="ulCount" type="number" value="10" min="1" max="500"></div>' +
        '<div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="ulGen">' + L('生成', 'Generate') + '</button></div>' +
        '<div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="ulCopy">' + L('复制全部', 'Copy all') + '</button></div></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('结果（26 位，时间有序）', 'Result (26 chars, time-ordered)') + '</label><textarea id="ulOut" style="min-height:150px;font-family:var(--mono);font-size:13px" readonly></textarea></div>' +
        '<div id="ulStat"></div>' +
      '</div>';
      var ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
      var lastTime = 0, lastRand = null;
      function ulid() {
        var t = Date.now(), time = '', ts = t;
        for (var i = 9; i >= 0; i--) { time = ALPHABET[ts % 32] + time; ts = Math.floor(ts / 32); }
        var rand;
        if (t === lastTime && lastRand) {
          /* 同一毫秒内随机部分 +1，保证整批严格递增（ULID 规范的单调性） */
          rand = lastRand.slice();
          for (var j = 15; j >= 0; j--) {
            var idx = ALPHABET.indexOf(rand[j]);
            if (idx < 31) { rand[j] = ALPHABET[idx + 1]; break; }
            rand[j] = '0';
          }
        } else {
          rand = [];
          for (var r = 0; r < 16; r++) rand.push(ALPHABET[Math.floor(Math.random() * 32)]);
        }
        lastTime = t;
        lastRand = rand;
        return time + rand.join('');
      }
      $('ulGen').addEventListener('click', function () {
        var n = Math.min(500, Math.max(1, Number($('ulCount').value) || 10));
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(ulid());
        $('ulOut').value = arr.join('\n');
        out('ulStat', '<div class="msg ok">' + L('已生成 ', 'Generated ') + n + ' 个 ULID</div>');
      });
      $('ulCopy').addEventListener('click', function () { T.copyText($('ulOut').value); });
    }
  });

  /* ============ JSONPath 查询 ============ */
  T.register({
    id: 'jsonpath', cat: 'data', icon: '🧭',
    name: 'JSONPath 查询',
    desc: '用路径表达式从 JSON 中提取数据',
    keywords: 'jsonpath json 路径 查询 提取 表达式',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('JSONPath 查询', 'JSONPath Query') + '</h3>' +
        '<div class="field"><label>JSON</label><textarea id="jpJson" placeholder=\'[{"name":"A","price":10},{"name":"B","price":20}]\' style="min-height:100px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field grow"><label>' + L('路径表达式', 'Path expression') + '</label><input id="jpPath" placeholder="$.list[*].name" style="font-family:var(--mono)"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="jpGo">' + L('查询', 'Query') + '</button></div></div>' +
        '<p class="note">' + L('支持 $ 根、.键、[下标]、[*] 全部、..键 递归查找，如 $.store.book[*].title 或 $..price', 'Supports $ root, .key, [index], [*] wildcard, ..key recursive — e.g. $.store.book[*].title or $..price') + '</p>' +
        '<div id="jpOut"></div>' +
      '</div>';
      function walk(obj, segs, i, acc) {
        if (i >= segs.length) { acc.push(obj); return; }
        var seg = segs[i];
        if (seg.t === 'key') {
          if (obj && Object.prototype.hasOwnProperty.call(obj, seg.v)) walk(obj[seg.v], segs, i + 1, acc);
        } else if (seg.t === 'idx') {
          if (Array.isArray(obj) && seg.v < obj.length) walk(obj[seg.v], segs, i + 1, acc);
        } else if (seg.t === 'all') {
          if (Array.isArray(obj)) obj.forEach(function (it) { walk(it, segs, i + 1, acc); });
          else if (obj && typeof obj === 'object') Object.keys(obj).forEach(function (k) { walk(obj[k], segs, i + 1, acc); });
        } else if (seg.t === 'recur') {
          /* 递归收集所有含该键的值 */
          function deep(o) {
            if (o && typeof o === 'object') {
              if (Object.prototype.hasOwnProperty.call(o, seg.v)) acc2.push(o[seg.v]);
              (Array.isArray(o) ? o : Object.keys(o).map(function (k) { return o[k]; })).forEach(deep);
            }
          }
          var acc2 = [];
          deep(obj);
          /* 递归键是终态，继续后续段需对每个命中值再走剩余段 */
          acc2.forEach(function (v) { walk(v, segs, i + 1, acc); });
        }
      }
      function parsePath(p) {
        p = p.trim().replace(/^\$/, '');
        var segs = [], rest = p;
        while (rest.length) {
          if (rest[0] === '.') {
            if (rest[1] === '.') {
              var m = rest.slice(2).match(/^([A-Za-z_$][\w$]*)/);
              if (!m) throw new Error(L('.. 后面必须是键名', 'Expected key after ..'));
              segs.push({ t: 'recur', v: m[1] });
              rest = rest.slice(2 + m[1].length);
            } else {
              var m2 = rest.slice(1).match(/^([A-Za-z_$][\w$]*)/);
              if (!m2) throw new Error(L('. 后面必须是键名', 'Expected key after .'));
              segs.push({ t: 'key', v: m2[1] });
              rest = rest.slice(1 + m2[1].length);
            }
          } else if (rest[0] === '[') {
            var m3 = rest.match(/^\[(\*|\d+)\]/);
            if (!m3) throw new Error(L('[] 内只能是数字或 *', '[] allows only index or *'));
            segs.push(m3[1] === '*' ? { t: 'all' } : { t: 'idx', v: Number(m3[1]) });
            rest = rest.slice(m3[0].length);
          } else {
            throw new Error(L('无法解析的路径片段：', 'Bad path segment: ') + rest.slice(0, 12));
          }
        }
        return segs;
      }
      $('jpGo').addEventListener('click', function () {
        var raw = $('jpJson').value.trim(), path = $('jpPath').value.trim();
        if (!raw || !path) { out('jpOut', '<div class="empty"><b>' + L('请填写 JSON 与路径表达式', 'Fill in JSON and path') + '</b></div>'); return; }
        var v;
        try { v = JSON.parse(raw); }
        catch (e) { out('jpOut', '<div class="msg err">' + L('JSON 解析失败：', 'JSON parse error: ') + esc(e.message) + '</div>'); return; }
        try {
          var acc = [];
          walk(v, parsePath(path), 0, acc);
          if (!acc.length) { out('jpOut', '<div class="empty"><b>' + L('未匹配到任何结果', 'No matches') + '</b></div>'); return; }
          var json = acc.map(function (x) { return typeof x === 'object' ? JSON.stringify(x, null, 2) : JSON.stringify(x); }).join('\n');
          out('jpOut', '<div class="field"><label>' + L('命中 ', 'Hits: ') + acc.length + '</label><div class="out" id="jpRes">' + esc(json) + '</div></div>');
          $('jpRes').appendChild(T.mkCopyBtn(json));
        } catch (e) { out('jpOut', '<div class="msg err">' + L('路径解析失败：', 'Path error: ') + esc(e.message) + '</div>'); }
      });
    }
  });

  /* ============ JSON 数组转表格 ============ */
  T.register({
    id: 'json-table', cat: 'data', icon: '🗂️',
    name: 'JSON 数组转表格',
    desc: '对象数组一键转 HTML 表格与 CSV',
    keywords: 'json 数组 表格 csv 转换 可视化',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('JSON 数组转表格', 'JSON Array to Table') + '</h3>' +
        '<div class="field"><label>JSON' + L('（对象数组）', ' (array of objects)') + '</label><textarea id="jtIn" placeholder=\'[{"姓名":"张三","年龄":20},{"姓名":"李四","年龄":25}]\' style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="jtGo">' + L('转换', 'Convert') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="jtSample">' + L('示例', 'Sample') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="jtCsv">' + L('下载 CSV', 'Download CSV') + '</button></div></div>' +
        '<div id="jtOut"></div>' +
      '</div>';
      var last = null;
      function toCsv(rows, keys) {
        return keys.map(function (k) { return '"' + String(k).replace(/"/g, '""') + '"'; }).join(',') + '\n' +
          rows.map(function (r) {
            return keys.map(function (k) {
              var v = r[k];
              if (v === null || v === undefined) return '';
              if (typeof v === 'object') return '"' + JSON.stringify(v).replace(/"/g, '""') + '"';
              return '"' + String(v).replace(/"/g, '""') + '"';
            }).join(',');
          }).join('\n');
      }
      $('jtGo').addEventListener('click', function () {
        var raw = $('jtIn').value.trim();
        if (!raw) { out('jtOut', '<div class="empty"><b>' + L('请输入 JSON 数组', 'Enter a JSON array') + '</b></div>'); return; }
        var v;
        try { v = JSON.parse(raw); }
        catch (e) { out('jtOut', '<div class="msg err">' + L('JSON 解析失败：', 'JSON parse error: ') + esc(e.message) + '</div>'); return; }
        if (!Array.isArray(v)) { out('jtOut', '<div class="msg err">' + L('顶层必须是数组（[ {...}, {...} ]）', 'Top level must be an array') + '</div>'); return; }
        if (!v.length) { out('jtOut', '<div class="empty"><b>' + L('数组为空', 'Empty array') + '</b></div>'); return; }
        var keys = [];
        v.forEach(function (r) { if (r && typeof r === 'object') Object.keys(r).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); }); });
        if (!keys.length) { out('jtOut', '<div class="msg err">' + L('数组元素必须是对象', 'Elements must be objects') + '</div>'); return; }
        last = { rows: v, keys: keys };
        var html = '<div class="field" style="margin-top:12px"><label>' + L('表格预览（', 'Preview (') + v.length + ' × ' + keys.length + '）</label>' +
          '<div class="table-wrap"><table class="kv"><thead><tr>' + keys.map(function (k) { return '<th>' + esc(k) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          v.map(function (r) {
            return '<tr>' + keys.map(function (k) {
              var val = r[k];
              var s = val === null || val === undefined ? '' : (typeof val === 'object' ? JSON.stringify(val) : String(val));
              return '<td class="mono">' + esc(s) + '</td>';
            }).join('') + '</tr>';
          }).join('') + '</tbody></table></div></div>';
        out('jtOut', html);
      });
      $('jtSample').addEventListener('click', function () {
        $('jtIn').value = JSON.stringify([
          { 姓名: '张三', 年龄: 20, 城市: '北京' },
          { 姓名: '李四', 年龄: 25, 城市: '上海' },
          { 姓名: '王五', 年龄: 30, 城市: '广州' }
        ], null, 2);
      });
      $('jtCsv').addEventListener('click', function () {
        if (!last) { T.toast(L('请先点击「转换」', 'Click "Convert" first')); return; }
        var csv = '﻿' + toCsv(last.rows, last.keys);
        T.blobDownload(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'table.csv');
      });
    }
  });
})();
