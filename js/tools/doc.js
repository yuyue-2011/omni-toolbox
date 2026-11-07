/* ============================================================
   万能工具箱 v2.6 · 文档板块（4 款）
   图片转PDF / Markdown预览 / 文本文件合并 / 文档格式速查
   全部本地处理，不上传文件
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ================= 文档：图片转 PDF（内置极简 PDF 生成器） ================= */
  T.register({
    id: 'doc-img2pdf', cat: 'doc', icon: '📄',
    name: '图片转 PDF', desc: '多张图片合成一个 PDF，可调页面大小',
    keywords: '图片 PDF 转换 合并 生成 扫描件 证件 发票 导出',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('图片转 PDF', 'Image to PDF') + '</h3>' +
        '<div class="field"><input type="file" id="diFiles" accept="image/*" multiple></div>' +
        '<div class="row">' +
          '<div class="field"><label>' + L('页面方向', 'Orientation') + '</label><select id="diOrient"><option value="auto">' + L('按图片自动', 'Auto') + '</option><option value="land">' + L('横向', 'Landscape') + '</option><option value="port">' + L('纵向', 'Portrait') + '</option></select></div>' +
          '<div class="field"><label>' + L('质量', 'Quality') + '</label><select id="diQ"><option value="0.7">' + L('标准', 'Standard') + '</option><option selected value="0.85">' + L('高清', 'High') + '</option><option value="0.95">' + L('最佳', 'Best') + '</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="diRun" disabled>' + L('生成 PDF', 'Make PDF') + '</button></div>' +
        '</div>' +
        '<div id="diList" class="note"></div>' +
        '<div id="diOut"></div>' +
        '<p class="note">图片在本地压缩并嵌入 PDF（JPEG 编码），不上传文件。适合发票 / 证件 / 笔记扫描件整理。</p>' +
      '</div>';
      var files = [];
      document.getElementById('diFiles').addEventListener('change', function (e) {
        files = Array.prototype.slice.call(e.target.files || []);
        document.getElementById('diRun').disabled = files.length === 0;
        document.getElementById('diList').textContent = files.length ? '已选择 ' + files.length + ' 张图片' : '';
      });
      document.getElementById('diRun').addEventListener('click', function () {
        var out = document.getElementById('diOut');
        var btn = document.getElementById('diRun');
        if (!files.length) return;
        btn.disabled = true;
        out.innerHTML = '<div class="msg">处理中…</div>';
        var orient = document.getElementById('diOrient').value;
        var q = parseFloat(document.getElementById('diQ').value);
        var imgs = [];
        var i = 0;
        function next() {
          if (i >= files.length) return finish();
          var fr = new FileReader();
          fr.onload = (function (idx) {
            return function () {
              var img = new Image();
              img.onload = function () {
                imgs.push(img);
                i++;
                next();
              };
              img.onerror = function () { i++; next(); };
              img.src = fr.result;
            };
          })(i);
          fr.readAsDataURL(files[i]);
        }
        function finish() {
          try {
            var pdf = buildPdfFromImages(imgs, orient, q);
            var blob = new Blob([pdf], { type: 'application/pdf' });
            out.innerHTML = '<div class="msg ok">已生成 ' + imgs.length + ' 页 PDF · ' + (blob.size / 1024).toFixed(0) + ' KB</div>' +
              '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="diDl">下载 PDF</button></div>';
            document.getElementById('diDl').addEventListener('click', function () { T.blobDownload(blob, '图片转PDF.pdf'); });
            btn.disabled = false;
          } catch (err) {
            out.innerHTML = '<div class="msg err">' + L('生成失败：', 'Failed: ') + (err && err.message ? err.message : err) + '</div>';
            btn.disabled = false;
          }
        }
        next();
      });
      return function () {};
    }
  });

  /* 极简 PDF 生成器：把图片以 JPEG 嵌入（DCTDecode），每图一页 */
  function buildPdfFromImages(imgs, orient, q) {
    var A4W = 595, A4H = 842; /* pt */
    var objects = [];
    var pages = [];
    imgs.forEach(function (img) {
      var w = Math.max(1, img.naturalWidth || img.width);
      var h = Math.max(1, img.naturalHeight || img.height);
      var maxW = 1500;
      var scale = Math.min(1, maxW / w);
      var cw = Math.round(w * scale), ch = Math.round(h * scale);
      var canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, cw, ch);
      var dataUrl = canvas.toDataURL('image/jpeg', q);
      var b64 = dataUrl.split(',')[1] || '';
      var bytes = atob(b64);
      var jpeg = new Uint8Array(bytes.length);
      for (var k = 0; k < bytes.length; k++) jpeg[k] = bytes.charCodeAt(k);
      /* 页面尺寸：图片等比适配页面，方向按设置 */
      var pw = w, ph = h;
      if (orient === 'land') { pw = A4H; ph = A4W; }
      else if (orient === 'port') { pw = A4W; ph = A4H; }
      else {
        if (w > h) { pw = A4H; ph = A4W; } else { pw = A4W; ph = A4H; }
      }
      var s = Math.min(pw / w, ph / h) * 0.94;
      var dw = w * s, dh = h * s;
      var x = (pw - dw) / 2, y = (ph - dh) / 2;
      var imgObj = objects.length + 1;
      var pageObj = objects.length + 2;
      pages.push(pageObj);
      objects.push([imgObj, 'image', jpeg, dw, dh, x, y, pw, ph]);
      objects.push([pageObj, 'page', imgObj, pw, ph]);
    });
    var n = objects.length + 3; /* catalog + pages + pages-kids */
    var catalog = n - 2, pagesRoot = n - 1;
    var out = [];
    function push(s) { out.push(s); }
    push('%PDF-1.4\n%\u00E2\u00E3\u00CF\u00D3\n');
    var offsets = [];
    var objId = 0;
    function obj(num, body) {
      offsets[num] = out.join('').length;
      push(num + ' 0 obj\n' + body + '\nendobj\n');
    }
    /* images & pages */
    objects.forEach(function (o) {
      if (o[1] === 'image') {
        var jp = o[2];
        var off = out.join('').length;
        obj(o[0], '<< /Type /XObject /Subtype /Image /Width ' + o[3] + ' /Height ' + o[4] +
          ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jp.length + ' >>\nstream\n');
        for (var s2 = 0; s2 < jp.length; s2 += 4096) {
          push(String.fromCharCode.apply(null, jp.subarray(s2, Math.min(s2 + 4096, jp.length))));
        }
        push('\nendstream');
      } else {
        obj(o[0], '<< /Type /Page /Parent ' + pagesRoot + ' 0 R /MediaBox [0 0 ' + o[3] + ' ' + o[4] + '] /Resources << /XObject << /Im0 ' + o[2] + ' 0 R >> >> /Contents ' + (o[0] + 1) + ' 0 R >>');
        var cx = o[5], cy = o[6], dw = o[3], dh = o[4];
        var cs = 'q\n' + dw + ' 0 0 ' + dh + ' ' + cx + ' ' + cy + ' cm\n/Im0 Do\nQ\n';
        var cid = o[0] + 1;
        offsets[cid] = out.join('').length;
        push(cid + ' 0 obj\n<< /Length ' + cs.length + ' >>\nstream\n' + cs + 'endstream\nendobj\n');
      }
    });
    /* catalog & pages root */
    obj(catalog, '<< /Type /Catalog /Pages ' + pagesRoot + ' 0 R >>');
    obj(pagesRoot, '<< /Type /Pages /Kids [' + pages.map(function (p) { return p + ' 0 R'; }).join(' ') + '] /Count ' + pages.length + ' >>');
    var xrefStart = out.join('').length;
    push('xref\n0 ' + (n + 1) + '\n0000000000 65535 f \n');
    for (var oi = 1; oi <= n; oi++) {
      var offs = offsets[oi];
      push(('0000000000' + (offs === undefined ? 0 : offs)).slice(-10) + ' 00000 n \n');
    }
    push('trailer\n<< /Size ' + (n + 1) + ' /Root ' + catalog + ' 0 R >>\nstartxref\n' + xrefStart + '\n%%EOF\n');
    var text = out.join('');
    var buf = new Uint8Array(text.length);
    for (var c = 0; c < text.length; c++) buf[c] = text.charCodeAt(c) & 255;
    return buf;
  }

  /* ================= 文档：Markdown 预览与转换 ================= */
  T.register({
    id: 'doc-md', cat: 'doc', icon: '📝',
    name: 'Markdown 预览', desc: '实时预览 Markdown，可导出 HTML / MD',
    keywords: 'markdown MD 预览 转换 HTML 编辑器 排版 笔记',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Markdown 预览与转换', 'Markdown Preview') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('输入 Markdown', 'Markdown input') + '</label></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="dmSample">' + L('载入示例', 'Sample') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="dmCopy">' + L('复制 HTML', 'Copy HTML') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="dmDl">' + L('下载', 'Download') + '</button></div>' +
        '</div>' +
        '<textarea id="dmIn" rows="10" spellcheck="false" placeholder="# 标题&#10;&#10;支持 **粗体**、*斜体*、`行内代码`、列表、表格、链接、引用、代码块等"></textarea>' +
        '<div id="dmOut" class="md-preview" style="margin-top:12px"></div>' +
        '<p class="note">' + L('预览在本地实时渲染；下载可保存为 .md 或 .html。渲染已做转义，不会执行脚本。', 'Renders locally; download as .md or .html. Output is escaped, no scripts run.') + '</p>' +
      '</div>';
      var md = new MdConverter();
      var out = document.getElementById('dmOut');
      var inp = document.getElementById('dmIn');
      function render() {
        out.innerHTML = md.toHtml(inp.value);
      }
      inp.addEventListener('input', render);
      document.getElementById('dmSample').addEventListener('click', function () {
        inp.value =
'# 万能工具箱\n\n## 支持语法\n\n- **粗体** / *斜体* / `行内代码`\n- 有序列表：\n  1. 第一项\n  2. 第二项\n\n> 引用：全部在本地处理，不上传文件。\n\n```js\nconsole.log("hello");\n```\n\n| 功能 | 说明 |\n| --- | --- |\n| 预览 | 实时渲染 |\n| 导出 | HTML / MD |\n\n[访问官网](https://www.example.com)';
        render();
      });
      document.getElementById('dmCopy').addEventListener('click', function () {
        T.copyText(out.innerHTML);
        T.toast('HTML 已复制');
      });
      document.getElementById('dmDl').addEventListener('click', function () {
        var html = '<!DOCTYPE html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Markdown 导出</title><style>body{max-width:760px;margin:0 auto;padding:24px;font:16px/1.7 system-ui,sans-serif;color:#222}pre{background:#f5f5f5;padding:12px;border-radius:8px;overflow:auto}code{background:#f0f0f0;padding:2px 5px;border-radius:4px}pre code{background:none;padding:0}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px 10px}blockquote{border-left:4px solid #ddd;margin:0;padding-left:12px;color:#666}img{max-width:100%}</style><body>' + out.innerHTML + '</body></html>';
        T.blobDownload(new Blob([html], { type: 'text/html;charset=utf-8' }), 'markdown.html');
      });
      render();
      return function () {};
    }
  });

  /* 极简 Markdown 转换器（安全转义 + 常用语法） */
  function MdConverter() {
    this.toHtml = function (src) {
      var lines = (src || '').replace(/\r\n/g, '\n').split('\n');
      var html = '';
      var list = null, inCode = false, codeBuf = [];
      function closeList() {
        if (list) { html += '</' + list + '>\n'; list = null; }
      }
      function esc2(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      function inline(s) {
        s = esc2(s);
        s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
        s = s.replace(/\*([^*]+)\*/g, '<i>$1</i>');
        s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        return s;
      }
      function parseTableRow(line, head) {
        var cells = line.split('|').slice(1, -1);
        if (!cells.length) cells = line.split('|');
        var h = '<tr>';
        for (var i = 0; i < cells.length; i++) {
          h += (head ? '<th>' : '<td>') + inline(cells[i].trim()) + (head ? '</th>' : '</td>');
        }
        return h + '</tr>';
      }
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var trim = line.trim();
        if (trim === '```') {
          if (inCode) {
            html += '<pre><code>' + esc2(codeBuf.join('\n')) + '</code></pre>\n';
            codeBuf = []; inCode = false;
          } else { closeList(); inCode = true; }
          continue;
        }
        if (inCode) { codeBuf.push(line); continue; }
        if (!trim) { closeList(); html += '\n'; continue; }
        var m;
        if ((m = trim.match(/^#{1,6}\s+(.*)$/))) {
          closeList();
          var lv = m[0].indexOf('#');
          html += '<h' + lv + '>' + inline(m[1]) + '</h' + lv + '>\n';
        } else if ((m = trim.match(/^>\s?(.*)$/))) {
          closeList();
          html += '<blockquote>' + inline(m[1]) + '</blockquote>\n';
        } else if ((m = trim.match(/^[-*]\s+(.*)$/)) || (m = trim.match(/^\d+\.\s+(.*)$/))) {
          var isUl = m[1] === undefined ? false : /^[-*]\s/.test(trim);
          if (m[0].indexOf('-') === 0 || m[0].indexOf('*') === 0) {
            if (list !== 'ul') { closeList(); list = 'ul'; html += '<ul>\n'; }
            html += '<li>' + inline(m[1]) + '</li>\n';
          } else {
            if (list !== 'ol') { closeList(); list = 'ol'; html += '<ol>\n'; }
            html += '<li>' + inline(m[1]) + '</li>\n';
          }
        } else if (trim.indexOf('|') >= 0 && /^\s*\|?[\s:|-]+\|?\s*$/.test(trim) && html.lastIndexOf('<table>') > html.lastIndexOf('</table>')) {
          continue; /* 分隔行 */
        } else if (trim.indexOf('|') >= 0 && /^\|.*\|\s*$/.test(trim)) {
          closeList();
          var isHead = html.lastIndexOf('<table>') <= html.lastIndexOf('</table>');
          if (isHead) {
            html += '<div class="table-wrap"><table>' + parseTableRow(trim, true);
            var nxt = lines[i + 1];
            if (nxt && /^\s*\|?[\s:|-]+\|?\s*$/.test(nxt.trim())) { i++; }
            html += '</table></div>\n';
          }
        } else if ((m = trim.match(/^---+\s*$/))) {
          closeList();
          html += '<hr>\n';
        } else if ((m = trim.match(/^!\[([^\]]*)\]\((https?:[^)\s]+)\)$/))) {
          closeList();
          html += '<img src="' + m[2] + '" alt="' + esc2(m[1]) + '" loading="lazy">\n';
        } else {
          closeList();
          html += '<p>' + inline(trim) + '</p>\n';
        }
      }
      if (inCode) { html += '<pre><code>' + esc2(codeBuf.join('\n')) + '</code></pre>\n'; }
      closeList();
      return html;
    };
  }

  /* ================= 文档：文本文件合并 ================= */
  T.register({
    id: 'doc-txtmerge', cat: 'doc', icon: '🧩',
    name: '文本文件合并', desc: '多个 TXT / MD / LOG 文件按序合并为一个',
    keywords: '文本 合并 拼接 文件 TXT MD LOG 批处理 日志',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('文本文件合并', 'Text Merger') + '</h3>' +
        '<div class="field"><input type="file" id="dtFiles" accept=".txt,.md,.log,.csv,.json,.html,.js,.css,.py,.java,.c,.cpp,.ts" multiple></div>' +
        '<div class="row">' +
          '<div class="field"><label>' + L('分隔线', 'Separator') + '</label><select id="dtSep"><option value="0">' + L('无', 'None') + '</option><option selected value="1">' + L('文件名分隔线', 'File name') + '</option><option value="2">' + L('空行分隔', 'Blank line') + '</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="dtRun" disabled>' + L('合并', 'Merge') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="dtDl" disabled>' + L('下载合并文件', 'Download merged') + '</button></div>' +
        '</div>' +
        '<div id="dtOut" class="note"></div>' +
        '<p class="note">按文件选择顺序合并文本内容；也可在下框手动粘贴文本块后点击“合并到下方”。</p>' +
        '<textarea id="dtPaste" rows="6" placeholder="' + L('也可以在这里粘贴需要合并的文本块…', 'Or paste text blocks to merge here…') + '"></textarea>' +
        '<div class="row" style="margin-top:8px"><button class="btn btn-ghost" id="dtAppend">追加到合并结果</button></div>' +
      '</div>';
      var merged = [];
      var names = [];
      document.getElementById('dtFiles').addEventListener('change', function (e) {
        var fs = Array.prototype.slice.call(e.target.files || []);
        document.getElementById('dtRun').disabled = fs.length === 0;
        document.getElementById('dtOut').textContent = fs.length ? '已选择 ' + fs.length + ' 个文件' : '';
        if (fs.length === 0) { merged = []; names = []; }
      });
      function sepLine(n) {
        return '/* ===== ' + n + ' ===== */';
      }
      document.getElementById('dtRun').addEventListener('click', function () {
        var inp = document.getElementById('dtFiles');
        var fs = Array.prototype.slice.call(inp.files || []);
        if (!fs.length) return;
        var out = document.getElementById('dtOut');
        var mode = document.getElementById('dtSep').value;
        merged = []; names = [];
        var i = 0;
        function read() {
          if (i >= fs.length) {
            var text = merged.join('\n');
            document.getElementById('dtDl').disabled = !text;
            out.innerHTML = '<span class="msg ok">已合并 ' + fs.length + ' 个文件 · ' + text.length + ' 字符</span>';
            return;
          }
          var fr = new FileReader();
          fr.onload = function () {
            if (mode === '1') merged.push(sepLine(fs[i].name) + '\n');
            else if (mode === '2' && merged.length) merged.push('');
            merged.push(fr.result || '');
            names.push(fs[i].name);
            i++;
            read();
          };
          fr.readAsText(fs[i], 'utf-8');
        }
        read();
      });
      document.getElementById('dtAppend').addEventListener('click', function () {
        var v = document.getElementById('dtPaste').value;
        if (!v.trim()) { T.toast('先粘贴文本'); return; }
        if (merged.length) merged.push('\n');
        merged.push(v);
        document.getElementById('dtDl').disabled = false;
        document.getElementById('dtOut').innerHTML = '<span class="msg ok">已追加粘贴块 · 共 ' + merged.join('\n').length + ' 字符</span>';
      });
      document.getElementById('dtDl').addEventListener('click', function () {
        if (!merged.join('\n')) { T.toast('没有可下载的内容'); return; }
        T.blobDownload(new Blob([merged.join('\n')], { type: 'text/plain;charset=utf-8' }), '合并文本.txt');
      });
      return function () {};
    }
  });

  /* ================= 文档：格式速查与转换导航 ================= */
  T.register({
    id: 'doc-fmt', cat: 'doc', icon: '🗂️',
    name: '文档格式速查', desc: '常见文档格式说明与格式转换工具导航',
    keywords: '文档 格式 转换 速查 DOCX PDF MD TXT 办公 工具 导航',
    render: function (host) {
      var fmts = [
        ['DOCX', 'Word 文档（新版，含 XML）', '文字排版'],
        ['DOC', 'Word 文档（旧版二进制）', '兼容老文件'],
        ['XLSX', 'Excel 工作簿', '表格数据'],
        ['PPTX', 'PowerPoint 演示', '幻灯片'],
        ['PDF', '便携式文档，跨平台稳定', '分发 / 打印'],
        ['TXT', '纯文本', '通用记录'],
        ['MD', 'Markdown 标记文本', '笔记 / 文档'],
        ['CSV', '逗号分隔表格', '数据交换'],
        ['RTF', '富文本格式', '跨平台排版'],
        ['HTML', '网页标记语言', '网页 / 导出'],
        ['ODT', 'LibreOffice 文档', '开源办公'],
        ['EPUB', '电子书（重排版）', '阅读器'],
        ['MOBI/AZW3', 'Kindle 电子书', 'Kindle 阅读']
      ];
      var routes = [
        ['DOCX → PDF', '打印导出 / WPS / 在线工具'],
        ['PDF → DOCX', 'WPS 会员 / Adobe / 在线工具'],
        ['图片 → PDF', '本页“图片转 PDF”即可'],
        ['XLSX → CSV', '另存为 CSV（编码注意 UTF-8）'],
        ['PDF → 图片', '在线工具 / 打印为图片'],
        ['EPUB → PDF', 'Calibre 转换（免费开源）'],
        ['MD → HTML', '本页“Markdown 预览”'],
        ['TXT → DOCX', 'Word 打开另存即可']
      ];
      var sites = [
        ['WPS 官网', 'https://www.wps.cn', '国内办公套件，格式兼容好', 'CN'],
        ['Microsoft 365', 'https://www.microsoft.com/microsoft-365', 'Word / Excel / PPT 官方', 'INT'],
        ['Google Docs', 'https://docs.google.com', '在线协作文档', 'INT'],
        ['Adobe Acrobat', 'https://www.adobe.com/acrobat', 'PDF 官方工具', 'INT'],
        ['福昕 PDF', 'https://www.foxitsoftware.cn', '国产 PDF 阅读器', 'CN'],
        ['iLovePDF', 'https://www.ilovepdf.com', 'PDF 在线转换', 'INT'],
        ['Smallpdf', 'https://smallpdf.com', 'PDF 在线处理', 'INT'],
        ['PDF24', 'https://tools.pdf24.org', '免费 PDF 工具', 'INT'],
        ['LibreOffice', 'https://www.libreoffice.org', '免费开源办公套件', 'INT'],
        ['ONLYOFFICE', 'https://www.onlyoffice.com', '开源协作办公', 'INT'],
        ['Calibre', 'https://calibre-ebook.com', '电子书转换管理', 'INT'],
        ['CloudConvert', 'https://cloudconvert.com', '200+ 格式在线互转', 'INT'],
        ['腾讯文档', 'https://docs.qq.com', '在线协作文档', 'CN'],
        ['语雀', 'https://www.yuque.com', '知识库与文档', 'CN']
      ];
      var h = '<div class="panel"><h3>' + L('文档格式速查', 'Doc Format Guide') + '</h3>';
      h += '<div class="set-sub">常见文档格式</div><div class="table-wrap"><table class="kv">';
      fmts.forEach(function (f) {
        h += '<tr><td style="width:22%"><b>' + esc(f[0]) + '</b></td><td style="width:34%">' + esc(f[1]) + '</td><td>' + esc(f[2]) + '</td></tr>';
      });
      h += '</table></div>';
      h += '<div class="set-sub">常用转换路线</div><div class="table-wrap"><table class="kv">';
      routes.forEach(function (r) {
        h += '<tr><td style="width:30%"><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>';
      });
      h += '</table></div>';
      h += '<div class="set-sub">格式转换工具官网</div><div class="site-grid">';
      sites.forEach(function (s) {
        h += '<a class="site-card" href="' + s[1] + '" target="_blank" rel="noopener noreferrer"><b>' + esc(s[0]) + ' <span class="badge ' + (s[3] === 'CN' ? 'net' : 'off') + '">' + (s[3] === 'CN' ? '国内' : '国际') + '</span></b><span>' + esc(s[2]) + '</span><i>' + esc(s[1].replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
      });
      h += '</div>';
      h += '</div>';
      host.innerHTML = h;
    }
  });
})();
