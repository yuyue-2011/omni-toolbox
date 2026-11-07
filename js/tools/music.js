/* ============================================================
   万能工具箱 v2.6 · 音乐板块（4 款）
   平台导航 / 节拍器 / 音调发生器 / 我的歌单
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var esc = T.esc, toast = T.toast;

  /* ================= 音乐：平台导航 ================= */
  T.register({
    id: 'music-nav', cat: 'music', icon: '🎧', net: true,
    name: '音乐平台导航', desc: '国内外音乐流媒体平台直达',
    keywords: '音乐 听歌 平台 网易云 QQ音乐 酷狗 酷我 Spotify AppleMusic',
    render: function (host) {
      var groups = [
        { t: '国内音乐', items: [
          { n: '网易云音乐', u: 'https://music.163.com', d: '评论区文化，歌单生态', g: 'CN' },
          { n: 'QQ音乐', u: 'https://y.qq.com', d: '曲库全，腾讯系', g: 'CN' },
          { n: '酷狗音乐', u: 'https://www.kugou.com', d: '长音频与K歌', g: 'CN' },
          { n: '酷我音乐', u: 'https://www.kuwo.cn', d: '无损音质与直播', g: 'CN' },
          { n: '咪咕音乐', u: 'https://music.migu.cn', d: '正版曲库，周杰伦全专', g: 'CN' },
          { n: '汽水音乐', u: 'https://www.douyin.com/music', d: '抖音潮流BGM', g: 'CN' },
          { n: '豆瓣音乐', u: 'https://music.douban.com', d: '乐评与榜单', g: 'CN' }
        ] },
        { t: '国际音乐', items: [
          { n: 'Spotify', u: 'https://open.spotify.com', d: '全球流媒体霸主', g: 'INT' },
          { n: 'Apple Music', u: 'https://music.apple.com', d: '高保真无损', g: 'INT' },
          { n: 'YouTube Music', u: 'https://music.youtube.com', d: 'MV 与混音齐全', g: 'INT' },
          { n: 'SoundCloud', u: 'https://soundcloud.com', d: '独立音乐人社区', g: 'INT' },
          { n: 'Bandcamp', u: 'https://bandcamp.com', d: '独立唱片直销', g: 'INT' },
          { n: 'JioSaavn', u: 'https://www.jiosaavn.com', d: '印度与南亚音乐', g: 'INT' }
        ] }
      ];
      var h = '<div class="panel"><h3>' + L('音乐平台导航', 'Music Platforms') + '</h3><p class="note">' +
        L('点击直达官方平台；右侧徽标标识站点地区——国内 IP 下国内站点高亮，国外 IP 下国际站点自动点亮。',
          'Open official sites. Badges highlight the region matching your current IP.') + '</p>';
      groups.forEach(function (g) {
        h += '<div class="set-sub">' + esc(L(g.t, g.t === '国内音乐' ? 'CN Music' : 'Global Music')) + '</div><div class="site-grid">';
        g.items.forEach(function (s) {
          h += '<a class="site-card" href="' + s.u + '" target="_blank" rel="noopener noreferrer"><b>' + esc(s.n) + ' <span class="badge ' + (s.g === 'CN' ? 'net' : 'off') + '">' + (s.g === 'CN' ? L('国内','CN') : L('国际','Global')) + '</span></b><span>' + esc(s.d) + '</span><i>' + esc(s.u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
        });
        h += '</div>';
      });
      h += '</div>';
      host.innerHTML = h;
    }
  });

  /* ================= 音乐：节拍器 ================= */
  var metroCtx = null, metroTimer = null, metroBeat = 0;
  function metroEnsure() {
    if (!metroCtx) metroCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (metroCtx.state === 'suspended') metroCtx.resume();
    return metroCtx;
  }
  function metroAvail() {
    try { return !!metroEnsure(); } catch (e) { return false; }
  }
  function metroClick(at, strong) {
    var ctx = metroEnsure();
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = strong ? 1568 : 1046;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.5, at + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
    o.connect(g); g.connect(ctx.destination);
    o.start(at); o.stop(at + 0.1);
  }
  function metroStop() { if (metroTimer) { clearInterval(metroTimer); metroTimer = null; } metroBeat = 0; }
  T.register({
    id: 'music-metronome', cat: 'music', icon: '🥁',
    name: '节拍器', desc: '练习打拍子，可调 BPM 与拍号',
    keywords: '节拍器 打拍子 tempo bpm 练琴 鼓点',
    render: function (host) {
      var h = '<div class="panel"><h3>' + L('节拍器', 'Metronome') + '</h3>' +
        '<p class="note">' + L('用扬声器/耳机听节拍；重音为每小节第一拍（高音）。', 'Listen through speaker/headphones; strong beat on the first of each bar.') + '</p>' +
        '<div class="row" style="align-items:center;gap:14px;flex-wrap:wrap">' +
        '<label style="font-size:13px">' + L('速度 BPM', 'Tempo') + ' <b id="m-bpm-v" style="color:var(--accent);font-size:18px">120</b></label>' +
        '<input type="range" id="m-bpm" min="30" max="240" value="120" style="flex:1;min-width:180px">' +
        '<label style="font-size:13px">' + L('拍号', 'Beats/bar') + '</label>' +
        '<select id="m-sig" style="...">';
      for (var s = 2; s <= 8; s++) h += '<option value="' + s + '"' + (s === 4 ? ' selected' : '') + '>' + s + '</option>';
      h += '</select>' +
        '<button class="btn" id="m-start">' + L('开始', 'Start') + '</button>' +
        '<button class="btn ghost" id="m-stop">' + L('停止', 'Stop') + '</button>' +
        '<div id="m-dots" style="display:flex;gap:8px"></div></div>' +
        '<div id="m-cur" style="margin-top:14px;font-size:13px;color:var(--ink-dim)"></div></div>';
      host.innerHTML = h;
      var bpmEl = host.querySelector('#m-bpm'), vEl = host.querySelector('#m-bpm-v'),
          sigEl = host.querySelector('#m-sig'), dotsEl = host.querySelector('#m-dots'),
          curEl = host.querySelector('#m-cur');
      function drawDots() {
        var n = parseInt(sigEl.value, 10);
        var hh = '';
        for (var i = 0; i < n; i++) hh += '<span id="md' + i + '" style="width:14px;height:14px;border-radius:50%;background:var(--card-2);display:inline-block;border:1px solid var(--line)"></span>';
        dotsEl.innerHTML = hh;
      }
      drawDots();
      function tick() {
        var bpm = parseInt(bpmEl.value, 10), sig = parseInt(sigEl.value, 10);
        var now = metroCtx ? metroCtx.currentTime : 0;
        var strong = metroBeat % sig === 0;
        if (metroCtx) metroClick(now + 0.02, strong);
        var dot = host.querySelector('#md' + (metroBeat % sig));
        if (dot) {
          dot.style.background = 'var(--accent)';
          setTimeout(function () { if (dot) dot.style.background = 'var(--card-2)'; }, 180);
        }
        curEl.textContent = L('第 ' + (metroBeat + 1) + ' 拍 / ' + bpm + ' BPM', 'Beat ' + (metroBeat + 1) + ' · ' + bpm + ' BPM');
        metroBeat++;
      }
      bpmEl.oninput = function () { vEl.textContent = bpmEl.value; if (metroTimer) { metroStop(); startMetro(); } };
      sigEl.onchange = function () { drawDots(); metroBeat = 0; };
      function startMetro() {
        var bpm = parseInt(bpmEl.value, 10);
        metroBeat = 0;
        metroTimer = setInterval(tick, 60000 / bpm);
        tick();
      }
      host.querySelector('#m-start').onclick = function () {
        metroStop();
        if (!metroAvail()) {
          curEl.textContent = L('当前浏览器不支持音频，无法发声。', 'Audio is not available in this browser.');
          return;
        }
        startMetro();
      };
      host.querySelector('#m-stop').onclick = function () { metroStop(); curEl.textContent = ''; };
      return function () { metroStop(); };
    }
  });

  /* ================= 音乐：音调发生器 ================= */
  var toneCtx = null, toneOsc = null, toneGain = null;
  T.register({
    id: 'music-tone', cat: 'music', icon: '🎛️',
    name: '音调发生器', desc: '生成纯音，调音/听力测试',
    keywords: '音调 频率 发生器 纯音 调音 听力 正弦波 hz',
    render: function (host) {
      var presets = [
        { n: 'A4（440Hz）', f: 440 }, { n: 'C5（523Hz）', f: 523.25 },
        { n: 'E5（659Hz）', f: 659.25 }, { n: '白噪提示音 1kHz', f: 1000 },
        { n: '低音 100Hz', f: 100 }, { n: '高音 2kHz', f: 2000 }
      ];
      var h = '<div class="panel"><h3>' + L('音调发生器', 'Tone Generator') + '</h3>' +
        '<p class="note">' + L('生成正弦纯音，用于乐器调音或听力测试；请从低音量开始。', 'Generate a sine wave for tuning/hearing tests. Start at low volume.') + '</p>' +
        '<div class="row" style="align-items:center;gap:14px;flex-wrap:wrap">' +
        '<label style="font-size:13px">' + L('频率 Hz', 'Frequency') + ' <b id="t-fv" style="color:var(--accent)">440</b></label>' +
        '<input type="range" id="t-f" min="20" max="5000" value="440" step="1" style="flex:1;min-width:180px">' +
        '<label style="font-size:13px">' + L('音量', 'Volume') + '</label>' +
        '<input type="range" id="t-v" min="0" max="100" value="30" style="width:120px">' +
        '<button class="btn" id="t-play">' + L('播放', 'Play') + '</button>' +
        '<button class="btn ghost" id="t-stop">' + L('停止', 'Stop') + '</button></div>' +
        '<div class="set-sub">' + L('常用音高', 'Common notes') + '</div><div class="row" style="gap:8px;flex-wrap:wrap">';
      presets.forEach(function (p) {
        h += '<button class="btn ghost tone-preset" data-f="' + p.f + '">' + esc(L(p.n, p.n)) + '</button>';
      });
      h += '</div></div>';
      host.innerHTML = h;
      var fEl = host.querySelector('#t-f'), fv = host.querySelector('#t-fv'), vEl = host.querySelector('#t-v');
      function ensureTone() {
        if (!toneCtx) {
          toneCtx = new (window.AudioContext || window.webkitAudioContext)();
          toneOsc = toneCtx.createOscillator(); toneGain = toneCtx.createGain();
          toneOsc.type = 'sine'; toneOsc.connect(toneGain); toneGain.connect(toneCtx.destination);
          toneOsc.start();
        }
        if (toneCtx.state === 'suspended') toneCtx.resume();
        toneOsc.frequency.value = parseFloat(fEl.value);
        toneGain.gain.value = parseInt(vEl.value, 10) / 100 * 0.6;
      }
      function toneAvail() {
        try { return !!(window.AudioContext || window.webkitAudioContext); } catch (e) { return false; }
      }
      fEl.oninput = function () { fv.textContent = fEl.value; if (toneOsc) toneOsc.frequency.value = parseFloat(fEl.value); };
      vEl.oninput = function () { if (toneGain) toneGain.gain.value = parseInt(vEl.value, 10) / 100 * 0.6; };
      host.querySelector('#t-play').onclick = function () {
        if (!toneAvail()) { toast(L('当前浏览器不支持音频。', 'Audio is not supported in this browser.')); return; }
        ensureTone();
      };
      host.querySelector('#t-stop').onclick = function () { if (toneGain) toneGain.gain.value = 0; };
      return function () { if (toneGain) toneGain.gain.value = 0; };
      host.querySelectorAll('.tone-preset').forEach(function (b) {
        b.onclick = function () { fEl.value = b.getAttribute('data-f'); fv.textContent = fEl.value; ensureTone(); };
      });
    }
  });

  /* ================= 音乐：我的歌单（本地） ================= */
  T.register({
    id: 'music-playlist', cat: 'music', icon: '🎵',
    name: '我的歌单', desc: '本地收藏常听曲目，纯离线保存',
    keywords: '歌单 收藏 曲目 我的 列表 离线',
    render: function (host) {
      var KEY = 'omni_playlist';
      var list = T.store.get(KEY, []);
      function draw() {
        var h = '<div class="panel"><h3>' + L('我的歌单（本地保存）', 'My Playlist (local)') + '</h3>' +
          '<p class="note">' + L('数据仅保存在本机浏览器，不上传。', 'Stored only in your browser; never uploaded.') + '</p>' +
          '<div class="row" style="gap:8px;flex-wrap:wrap"><input id="pl-name" placeholder="' + L('歌曲名 / 歌手', 'Title / Artist') + '" style="flex:1;min-width:180px">' +
          '<input id="pl-link" placeholder="' + L('链接（可选）', 'Link (optional)') + '" style="flex:1;min-width:180px">' +
          '<button class="btn" id="pl-add">' + L('添加', 'Add') + '</button></div>' +
          '<div id="pl-list" style="margin-top:12px"></div></div>';
        host.innerHTML = h;
        var box = host.querySelector('#pl-list');
        if (!list.length) { box.innerHTML = '<div class="empty">' + L('歌单为空，添加第一首吧。', 'Playlist is empty — add your first track.') + '</div>'; return; }
        list.forEach(function (it, i) {
          var link = it.link ? '<a class="link-dim" href="' + esc(it.link) + '" target="_blank" rel="noopener noreferrer">' + L('打开', 'open') + '</a>' : '';
          box.innerHTML += '<div class="note-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:10px;margin-bottom:6px;background:var(--card-2)"><span>🎵 ' + esc(it.name) + (link ? ' ' + link : '') + '</span><button class="btn ghost pl-del" data-i="' + i + '">' + L('删除', 'Del') + '</button></div>';
        });
        box.querySelectorAll('.pl-del').forEach(function (b) {
          b.onclick = function () { list.splice(parseInt(b.getAttribute('data-i'), 10), 1); T.store.set(KEY, list); draw(); };
        });
      }
      draw();
      host.querySelector('#pl-add').onclick = function () {
        var n = host.querySelector('#pl-name').value.trim(), l = host.querySelector('#pl-link').value.trim();
        if (!n) return;
        list.push({ name: n, link: l }); T.store.set(KEY, list); draw();
      };
    }
  });

  /* ================= 音乐：万能格式转换 ================= */
  T.register({
    id: 'music-convert', cat: 'music', icon: '🔄',
    name: '万能格式转换', desc: '图片互转 / 录音 / 录屏，本地完成不上传',
    keywords: '格式转换 图片转 png jpg webp 录音 录屏 导出',
    render: function (host) {
      var h = '<div class="panel"><h3>' + L('万能格式转换（本地处理）', 'Universal Format Converter (local)') + '</h3>' +
        '<p class="note">' + L('所有转换均在本机浏览器完成，不上传任何文件。图片走 Canvas；录音/录屏用 MediaRecorder。', 'All processing is local via Canvas / MediaRecorder. Nothing is uploaded.') + '</p>' +

        '<div class="set-sub">' + L('① 图片格式互转', '① Image conversion') + '</div>' +
        '<div class="row" style="gap:10px;flex-wrap:wrap;align-items:center">' +
        '<input type="file" id="cv-img" accept="image/*">' +
        '<select id="cv-fmt"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select>' +
        '<button class="btn" id="cv-go">' + L('转换并下载', 'Convert & Download') + '</button></div>' +
        '<div id="cv-status" style="margin-top:8px;font-size:13px;color:var(--ink-dim)"></div>' +

        '<div class="set-sub">' + L('② 麦克风录音 → WebM', '② Mic recording → WebM') + '</div>' +
        '<div class="row" style="gap:10px;flex-wrap:wrap;align-items:center">' +
        '<button class="btn" id="cv-rec">' + L('开始录音', 'Start') + '</button>' +
        '<button class="btn ghost" id="cv-stoprec" disabled>' + L('停止并下载', 'Stop & Download') + '</button></div>' +

        '<div class="set-sub">' + L('③ 屏幕录制 → WebM', '③ Screen record → WebM') + '</div>' +
        '<div class="row" style="gap:10px;flex-wrap:wrap;align-items:center">' +
        '<button class="btn" id="cv-scr">' + L('开始录屏', 'Start') + '</button>' +
        '<button class="btn ghost" id="cv-stopscr" disabled>' + L('停止并下载', 'Stop & Download') + '</button></div>' +
        '<div id="cv-info" style="margin-top:8px;font-size:13px;color:var(--ink-dim)"></div></div>';
      host.innerHTML = h;
      function download(blob, name) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name; a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      }
      /* ① 图片 */
      host.querySelector('#cv-go').onclick = function () {
        var f = host.querySelector('#cv-img').files[0], st = host.querySelector('#cv-status');
        if (!f) { st.textContent = L('请先选择图片。', 'Pick an image first.'); return; }
        var fmt = host.querySelector('#cv-fmt').value, img = new Image();
        img.onload = function () {
          var c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
          c.getContext('2d').drawImage(img, 0, 0);
          c.toBlob(function (b) {
            var ext = fmt === 'image/png' ? 'png' : fmt === 'image/webp' ? 'webp' : 'jpg';
            download(b, 'converted.' + ext);
            st.textContent = L('已导出 ' + ext.toUpperCase() + '，' + Math.round(b.size / 1024) + ' KB', 'Exported ' + ext.toUpperCase() + ', ' + Math.round(b.size / 1024) + ' KB');
          }, fmt, 0.9);
        };
        img.src = URL.createObjectURL(f);
      };
      /* ② 录音 */
      var rec = null, chunks = [];
      host.querySelector('#cv-rec').onclick = async function () {
        try {
          var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          rec = new MediaRecorder(stream); chunks = [];
          rec.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
          rec.onstop = function () {
            download(new Blob(chunks, { type: 'audio/webm' }), 'recording-' + Date.now() + '.webm');
            host.querySelector('#cv-stoprec').disabled = true;
            host.querySelector('#cv-rec').disabled = false;
            stream.getTracks().forEach(function (t) { t.stop(); });
          };
          rec.start(); this.disabled = true; host.querySelector('#cv-stoprec').disabled = false;
        } catch (e) { host.querySelector('#cv-status').textContent = L('无法访问麦克风：' + e.message, 'Mic error: ' + e.message); }
      };
      host.querySelector('#cv-stoprec').onclick = function () { if (rec && rec.state !== 'inactive') rec.stop(); };
      /* ③ 录屏 */
      var scr = null, schunks = [];
      host.querySelector('#cv-scr').onclick = async function () {
        try {
          var stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
          scr = new MediaRecorder(stream); schunks = [];
          scr.ondataavailable = function (e) { if (e.data.size) schunks.push(e.data); };
          scr.onstop = function () {
            download(new Blob(schunks, { type: 'video/webm' }), 'screen-' + Date.now() + '.webm');
            host.querySelector('#cv-stopscr').disabled = true;
            host.querySelector('#cv-scr').disabled = false;
            stream.getTracks().forEach(function (t) { t.stop(); });
          };
          scr.start(); this.disabled = true; host.querySelector('#cv-stopscr').disabled = false;
          host.querySelector('#cv-info').textContent = L('正在录制，点浏览器弹窗中的"停止共享"可结束。', 'Recording — click "Stop sharing" in the browser bar to end.');
        } catch (e) { host.querySelector('#cv-info').textContent = L('录屏失败：' + e.message, 'Screen capture error: ' + e.message); }
      };
      host.querySelector('#cv-stopscr').onclick = function () { if (scr && scr.state !== 'inactive') scr.stop(); };
    }
  });

})();
