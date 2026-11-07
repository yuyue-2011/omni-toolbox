/* ============================================================
   万能工具箱 · 云盘类工具（3 款：链接收藏 / 提取码生成 / 分享二维码）
   数据仅存本地
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 网盘链接管理 ============ */
  T.register({
    id: 'cloud-links', icon: '📁', cat: 'cloud', name: '网盘链接管理', net: false,
    desc: '集中收藏网盘链接与提取码，一键复制打开',
    keywords: '网盘 链接 管理 收藏 提取码 百度 夸克 阿里 收藏夹',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('网盘链接收藏', 'Cloud Links') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>名称</label><input id="clName" placeholder="例如：学习资料" spellcheck="false"></div>' +
          '<div class="field grow"><label>链接</label><input id="clUrl" placeholder="https://pan.xxx.com/…" spellcheck="false"></div>' +
          '<div class="field"><label>提取码</label><input id="clPwd" style="width:120px" placeholder="可选" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="clAdd">' + L('添加', 'Add') + '</button></div>' +
        '</div>' +
        '<div class="field"><label>备注（可选）</label><input id="clNote" placeholder="备注信息…" spellcheck="false"></div>' +
        '<div id="clList"></div>' +
        '<p class="note">收藏数据保存在本机浏览器（localStorage），不会上传。提取码可能过期，以实际分享者信息为准。</p>' +
      '</div>';
      function render() {
        var list = T.store.get('cloudLinks', []);
        var el = document.getElementById('clList');
        if (!list.length) {
          el.innerHTML = '<div class="empty"><b>还没有收藏</b>添加第一条网盘链接吧</div>';
          return;
        }
        var h = '<div class="list">';
        list.forEach(function (it, i) {
          h += '<div class="list-item" style="flex-wrap:wrap">' +
            '<div style="flex:1;min-width:160px"><div class="li-text">' + T.esc(it.name) + (it.pwd ? ' <span class="badge" style="font-family:var(--mono)">' + T.esc(it.pwd) + '</span>' : '') + '</div>' +
            (it.note ? '<div class="li-sub">' + T.esc(it.note) + '</div>' : '') +
            '<div class="li-sub" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + T.esc(it.url) + '</div></div>' +
            '<div style="display:flex;gap:8px">' +
              '<button class="btn btn-ghost copy-btn" data-act="copy" data-i="' + i + '" style="min-height:32px;height:32px;padding:0 12px;font-size:12px">' + L('复制链接', 'Copy link') + '</button>' +
              '<button class="btn btn-ghost copy-btn" data-act="open" data-i="' + i + '" style="min-height:32px;height:32px;padding:0 12px;font-size:12px">' + L('打开', 'Open') + '</button>' +
              '<button class="btn btn-danger copy-btn" data-act="del" data-i="' + i + '" style="min-height:32px;height:32px;padding:0 12px;font-size:12px">' + L('删除', 'Delete') + '</button>' +
            '</div></div>';
        });
        h += '</div>';
        el.innerHTML = h;
      }
      function save(list) { T.store.set('cloudLinks', list); render(); }
      document.getElementById('clAdd').addEventListener('click', function () {
        var name = document.getElementById('clName').value.trim();
        var url = document.getElementById('clUrl').value.trim();
        if (!name || !url) { T.toast('请填写名称和链接'); return; }
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        var list = T.store.get('cloudLinks', []);
        list.unshift({
          name: name, url: url,
          pwd: document.getElementById('clPwd').value.trim(),
          note: document.getElementById('clNote').value.trim()
        });
        save(list);
        document.getElementById('clName').value = '';
        document.getElementById('clUrl').value = '';
        document.getElementById('clPwd').value = '';
        document.getElementById('clNote').value = '';
        T.toast('已添加');
      });
      document.getElementById('clList').addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (!b) return;
        var list = T.store.get('cloudLinks', []);
        var i = parseInt(b.getAttribute('data-i'), 10);
        var it = list[i];
        if (!it) return;
        var act = b.getAttribute('data-act');
        if (act === 'copy') T.copyText(it.url + (it.pwd ? '\n提取码：' + it.pwd : ''));
        else if (act === 'open') window.open(it.url, '_blank', 'noopener');
        else if (act === 'del') { list.splice(i, 1); save(list); }
      });
      render();
    }
  });

  /* ============ 提取码生成器 ============ */
  T.register({
    id: 'code-gen', icon: '🔓', cat: 'cloud', name: '提取码生成', net: false,
    desc: '批量生成网盘 / 分享用的随机提取码',
    keywords: '提取码 生成 随机 网盘 分享码 密码',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('提取码生成器', 'Extract Code Gen') + '</h3>' +
        '<div class="row">' +
          '<div class="field"><label>位数</label><select id="cgLen"><option>4</option><option selected>4</option><option>6</option><option>8</option></select></div>' +
          '<div class="field"><label>生成数量</label><select id="cgNum"><option>5</option><option selected>10</option><option>20</option><option>50</option></select></div>' +
          '<div class="field"><label>字符集</label><select id="cgSet"><option selected>数字 + 大写字母（易识别）</option><option>仅数字</option><option>全部字母数字</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="cgBtn">' + L('生成', 'Generate') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="cgCopy">' + L('复制全部', 'Copy all') + '</button></div>' +
        '</div>' +
        '<div id="cgOut" class="chips" style="margin-top:10px"></div>' +
        '<p class="note">易识别模式排除 0/O/1/I 等易混淆字符，适合分享口令场景。</p>' +
      '</div>';
      var last = [];
      function generate() {
        var len = parseInt(document.getElementById('cgLen').value, 10);
        var num = parseInt(document.getElementById('cgNum').value, 10);
        var set = document.getElementById('cgSet').value;
        var pool;
        if (set.indexOf('数字') === 0 && set.indexOf('仅') >= 0) pool = '0123456789';
        else if (set.indexOf('全部') >= 0) pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        else pool = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        last = [];
        for (var i = 0; i < num; i++) {
          var s = '';
          for (var j = 0; j < len; j++) s += pool[Math.floor(Math.random() * pool.length)];
          last.push(s);
        }
        document.getElementById('cgOut').innerHTML = last.map(function (c) {
          return '<button class="chip" data-c="' + c + '">' + c + '</button>';
        }).join('');
      }
      document.getElementById('cgBtn').addEventListener('click', generate);
      document.getElementById('cgOut').addEventListener('click', function (e) {
        var c = e.target.closest('[data-c]');
        if (c) { T.copyText(c.getAttribute('data-c')); }
      });
      document.getElementById('cgCopy').addEventListener('click', function () {
        if (!last.length) { T.toast('请先生成'); return; }
        T.copyText(last.join('\n'));
      });
      generate();
    }
  });

  /* ============ 链接分享二维码 ============ */
  T.register({
    id: 'share-link', icon: '🔳', cat: 'cloud', name: '链接转二维码', net: false,
    desc: '把链接 / 文本生成二维码，扫码即达（可下载）',
    keywords: '二维码 分享 链接 生成 扫码 文本',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('链接转二维码', 'Link to QR') + '</h3>' +
        '<div class="field"><label>链接或文本</label><textarea id="slIn" class="short" placeholder="https://example.com 或任意文本" spellcheck="false"></textarea></div>' +
        '<div class="row">' +
          '<div class="field"><label>尺寸</label><select id="slSize"><option>200</option><option selected>300</option><option>400</option><option>600</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="slBtn">' + L('生成', 'Generate') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="slDl">下载 PNG</button></div>' +
        '</div>' +
        '<div class="qr-box" id="slOut" style="margin-top:14px"><span class="muted">输入内容后点击生成</span></div>' +
      '</div>';
      var lastDataUrl = null;
      document.getElementById('slBtn').addEventListener('click', function () {
        var s = document.getElementById('slIn').value.trim();
        if (!s) { T.toast('请输入链接或文本'); return; }
        if (typeof QRCode === 'undefined') { T.toast('二维码组件未加载'); return; }
        var size = parseInt(document.getElementById('slSize').value, 10);
        var qr = qrcode(0, 'M');
        qr.addData(s);
        qr.make();
        var cell = qr.getModuleCount();
        var scale = Math.floor(size / (cell + 8));
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = (cell + 8) * scale;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111111';
        for (var x = 0; x < cell; x++) for (var y = 0; y < cell; y++) {
          if (qr.isDark(x, y)) ctx.fillRect((x + 4) * scale, (y + 4) * scale, scale, scale);
        }
        lastDataUrl = canvas.toDataURL('image/png');
        var out = document.getElementById('slOut');
        out.innerHTML = '<img src="' + lastDataUrl + '" alt="二维码" style="width:' + size + 'px;max-width:100%;height:auto">' +
          '<div class="muted" style="color:var(--ink-faint)">' + T.esc(s.slice(0, 60)) + (s.length > 60 ? '…' : '') + '</div>';
      });
      document.getElementById('slDl').addEventListener('click', function () {
        if (!lastDataUrl) { T.toast('请先生成二维码'); return; }
        var a = document.createElement('a');
        a.href = lastDataUrl;
        a.download = '二维码.png';
        a.click();
      });
    }
  });
})();
