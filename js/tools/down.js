/* ============================================================
   万能工具箱 · 下载类工具（3 款：直链 / 批量 / 磁力解析）
   仅下载你有权获取的公开内容，请遵守法律法规与平台规则
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 直链下载 ============ */
  T.register({
    id: 'direct-down', icon: '📥', cat: 'down', name: '直链下载', net: true,
    netNote: '通过浏览器下载直链文件；目标服务器需允许跨域，否则会被浏览器拦截（可改用“打开链接”）。',
    desc: '输入文件直链下载到本机，可自定义文件名',
    keywords: '下载 直链 文件 url 保存 链接',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('直链下载', 'Direct Download') + '</h3>' +
        '<div class="field"><label>文件直链 URL</label><input id="ddUrl" placeholder="https://example.com/file.zip" spellcheck="false"></div>' +
        '<div class="field"><label>保存文件名（可选）</label><input id="ddName" placeholder="留空自动识别" spellcheck="false"></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="ddRun">' + L('下载', 'Download') + '</button>' +
          '<button class="btn btn-ghost" id="ddOpen">' + L('在新标签页打开', 'Open tab') + '</button>' +
        '</div>' +
        '<div id="ddBar" class="progress"><i></i></div>' +
        '<div id="ddOut" class="msg" style="margin-top:8px"></div>' +
        '<p class="note">若目标服务器未开放 CORS（多数下载站如此），浏览器会拦截下载，此时请改用“在新标签页打开”。仅下载你有权获取的文件。</p>' +
      '</div>';
      document.getElementById('ddRun').addEventListener('click', function () {
        var url = document.getElementById('ddUrl').value.trim();
        if (!url) { T.toast('请输入 URL'); return; }
        var out = document.getElementById('ddOut');
        var bar = document.getElementById('ddBar').querySelector('i');
        out.textContent = '下载中…';
        out.className = 'msg';
        bar.style.width = '20%';
        T.getBlob(url, 60000).then(function (blob) {
          bar.style.width = '100%';
          var name = document.getElementById('ddName').value.trim();
          if (!name) {
            try { name = decodeURIComponent(new URL(url).pathname.split('/').pop()) || 'download'; }
            catch (e) { name = 'download'; }
          }
          if (!/\.[a-z0-9]{1,8}$/i.test(name)) {
            var ext = (blob.type.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
            name += '.' + (ext || 'bin');
          }
          T.blobDownload(blob, name);
          out.textContent = '已下载：' + name + '（' + (blob.size / 1048576).toFixed(1) + ' MB）';
          out.className = 'msg ok';
        }, function (e) {
          out.textContent = '下载失败：' + (e.message || '网络错误') + '。多为 CORS 限制，试试“在新标签页打开”。';
          out.className = 'msg err';
          bar.style.width = '0';
        });
      });
      document.getElementById('ddOpen').addEventListener('click', function () {
        var url = document.getElementById('ddUrl').value.trim();
        if (!url) { T.toast('请输入 URL'); return; }
        window.open(url, '_blank', 'noopener');
      });
      document.getElementById('ddUrl').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('ddRun').click();
      });
    }
  });

  /* ============ 批量下载 ============ */
  T.register({
    id: 'batch-down', icon: '📂', cat: 'down', name: '批量下载', net: true,
    netNote: '逐条下载文本中的多个直链；同样受目标服务器 CORS 限制。',
    desc: '每行一个链接，批量顺序下载并显示进度',
    keywords: '批量 下载 多个 链接 列表 进度',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('批量下载', 'Batch Download') + '</h3>' +
        '<div class="field"><label>链接列表（每行一个）</label><textarea id="bdList" placeholder="https://example.com/a.jpg&#10;https://example.com/b.jpg" spellcheck="false" style="min-height:160px"></textarea></div>' +
        '<div class="row"><button class="btn btn-primary" id="bdRun">' + L('开始批量下载', 'Start batch') + '</button>' +
        '<button class="btn btn-ghost" id="bdStop" disabled>' + L('停止', 'Stop') + '</button></div>' +
        '<div id="bdOut" style="margin-top:12px"></div>' +
        '<p class="note">逐个下载并触发浏览器保存。若中途失败会继续下一个并在最后汇总。受 CORS 限制的链接会提示失败。</p>' +
      '</div>';
      var stopFlag = false;
      document.getElementById('bdStop').addEventListener('click', function () { stopFlag = true; });
      document.getElementById('bdRun').addEventListener('click', function () {
        var urls = document.getElementById('bdList').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
        if (!urls.length) { T.toast('请输入至少一个链接'); return; }
        var out = document.getElementById('bdOut');
        var btn = document.getElementById('bdRun');
        var stopBtn = document.getElementById('bdStop');
        stopFlag = false;
        btn.disabled = true;
        stopBtn.disabled = false;
        out.innerHTML = urls.map(function (u, i) {
          return '<div class="rl" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + T.esc(u) + '</span><span class="p-val">等待</span></div>';
        }).join('');
        var ok = 0, fail = 0;
        var chain = Promise.resolve();
        urls.forEach(function (u, i) {
          chain = chain.then(function () {
            if (stopFlag) return;
            var row = out.querySelector('[data-i="' + i + '"] .p-val');
            if (row) { row.textContent = '下载中…'; row.className = 'p-val warn'; }
            return T.getBlob(u, 60000).then(function (blob) {
              var name = 'download-' + (i + 1);
              try {
                var p = new URL(u).pathname.split('/').pop();
                if (p) name = decodeURIComponent(p);
              } catch (e) {}
              if (!/\.[a-z0-9]{1,8}$/i.test(name)) name += '.' + (blob.type.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '') || '.bin';
              T.blobDownload(blob, name);
              ok++;
              if (row) { row.textContent = '✓ 完成'; row.className = 'p-val ok'; }
            }, function () {
              fail++;
              if (row) { row.textContent = '✗ 失败'; row.className = 'p-val err'; }
            });
          });
        });
        chain.then(function () {
          btn.disabled = false;
          stopBtn.disabled = true;
          out.innerHTML += '<div class="msg" style="margin-top:8px">完成：成功 ' + ok + ' / 失败 ' + fail + ' / 共 ' + urls.length + '</div>';
        });
      });
    }
  });

  /* ============ 磁力链接解析 ============ */
  T.register({
    id: 'magnet-parse', icon: '🧲', cat: 'down', name: '磁力链接解析', net: false,
    desc: '解析磁力链接信息：哈希 / Base32 / 参数明细',
    keywords: '磁力 magnet 解析 bt 种子 hash 迅雷 qbittorrent',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('磁力链接解析', 'Magnet Parser') + '</h3>' +
        '<div class="field"><label>磁力链接</label><textarea id="mpIn" class="short" placeholder="magnet:?xt=urn:btih:…" spellcheck="false"></textarea></div>' +
        '<div class="row"><button class="btn btn-primary" id="mpBtn">' + L('解析', 'Parse') + '</button>' +
        '<button class="btn btn-ghost" id="mpCopy">' + L('复制信息哈希', 'Copy hash') + '</button></div>' +
        '<div id="mpOut" style="margin-top:12px"></div>' +
        '<p class="note">仅解析链接中携带的信息（哈希、名称、Tracker 等），用于核对与分享链接；下载行为请遵守法律法规，仅获取你有权获取的内容。</p>' +
      '</div>';
      function parse(magnet) {
        var r = { hash: '', base32: '', name: '', trackers: [], dn: '', others: [] };
        var m = magnet.match(/xt=urn:btih:([0-9a-fA-F]{40}|[A-Za-z2-7]{32})/);
        if (!m) return null;
        var raw = m[1];
        if (/^[0-9a-fA-F]{40}$/.test(raw)) {
          r.hash = raw.toLowerCase();
          /* hex → base32 (RFC 4648) */
          var bits = '';
          for (var i = 0; i < r.hash.length; i += 2) {
            bits += ('00000000' + parseInt(r.hash.substr(i, 2), 16).toString(2)).slice(-8);
          }
          var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
          for (var j = 0; j < bits.length; j += 5) {
            r.base32 += A[parseInt((bits.substr(j, 5) + '00000').slice(0, 5), 2)];
          }
          r.base32 = r.base32.slice(0, 32);
        } else {
          r.base32 = raw.toUpperCase();
          r.hash = '(需在 BT 客户端内查看)';
        }
        var dm = magnet.match(/dn=([^&]+)/);
        if (dm) r.dn = decodeURIComponent(dm[1]);
        var tr = magnet.match(/tr=([^&]+)/g) || [];
        r.trackers = tr.map(function (t) { return decodeURIComponent(t.slice(3)); });
        return r;
      }
      document.getElementById('mpBtn').addEventListener('click', function () {
        var s = document.getElementById('mpIn').value.trim();
        var out = document.getElementById('mpOut');
        if (!s) { T.toast('请输入磁力链接'); return; }
        var r = parse(s);
        if (!r) { out.innerHTML = '<div class="msg err">未能识别磁力链接（需包含 xt=urn:btih: 信息哈希）</div>'; return; }
        var rows = [
          ['信息哈希 (hex)', r.hash],
          ['信息哈希 (Base32)', r.base32],
          ['文件名称', r.dn || '-'],
          ['完整磁力链接', s]
        ];
        var h = '<div class="table-wrap"><table class="kv">';
        rows.forEach(function (rr) {
          h += '<tr><th>' + rr[0] + '</th><td><span class="mono" style="word-break:break-all">' + T.esc(rr[1]) + '</span></td></tr>';
        });
        h += '</table></div>';
        if (r.trackers.length) {
          h += '<div class="chips">' + r.trackers.map(function (t) { return '<span class="chip dim">' + T.esc(t) + '</span>'; }).join('') + '</div>';
        }
        h += '<p class="note">可将信息哈希粘贴到 qBittorrent / Transmission 等客户端“添加磁力链接”中使用。</p>';
        out.innerHTML = h;
      });
      document.getElementById('mpCopy').addEventListener('click', function () {
        var s = document.getElementById('mpIn').value.trim();
        if (!s) { T.toast('请先输入磁力链接'); return; }
        var r = parse(s);
        if (!r) { T.toast('未能识别信息哈希'); return; }
        T.copyText(r.base32.length === 32 ? r.base32 : r.hash);
      });
    }
  });
})();
