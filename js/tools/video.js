/* ============================================================
   万能工具箱 v2.6 · 视频类工具（8 款：播放 / 抽帧 / 截图 / GIF /
   音频提取 / 片段截取 / 九宫格封面）
   全部在本地处理，不上传文件
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 本地视频播放器 ============ */
  T.register({
    id: 'video-player', icon: '▶️', cat: 'video', name: '本地视频播放', net: false,
    desc: '播放本地视频文件：倍速 / 画中画 / 全屏',
    keywords: '视频 播放 本地 播放器 倍速 画中画 全屏',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('本地视频播放器', 'Local Video Player') + '</h3>' +
        '<div class="field"><input type="file" id="vpFile" accept="video/*"></div>' +
        '<video id="vpVideo" controls playsinline style="width:100%;max-height:480px;background:#000;border-radius:10px;border:1px solid var(--line)" hidden></video>' +
        '<div class="row" style="margin-top:12px">' +
          '<div class="field"><label>播放速度</label><select id="vpSpeed"><option>0.5</option><option>0.75</option><option selected>1</option><option>1.25</option><option>1.5</option><option>2</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="vpPiP">画中画</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="vpFull">全屏</button></div>' +
        '</div>' +
        '<div id="vpInfo" class="note"></div>' +
        '<p class="note">视频完全在本地播放，不会上传。支持常见格式（MP4 / WebM / MOV 等，视浏览器解码能力而定）。</p>' +
      '</div>';
      var video = document.getElementById('vpVideo');
      document.getElementById('vpFile').addEventListener('change', function (e) {
        var f = e.target.files[0];
        if (!f) return;
        if (f.size > 2 * 1024 * 1024 * 1024) { T.toast('文件过大（>2GB），可能无法加载'); }
        video.hidden = false;
        video.src = URL.createObjectURL(f);
        video.load();
        video.play().catch(function () {});
        var info = document.getElementById('vpInfo');
        info.textContent = f.name + ' · ' + (f.size / 1048576).toFixed(1) + ' MB';
        video.addEventListener('loadedmetadata', function () {
          info.textContent = f.name + ' · ' + (f.size / 1048576).toFixed(1) + ' MB · ' +
            video.videoWidth + '×' + video.videoHeight + ' · ' +
            Math.floor(video.duration / 60) + ':' + ('0' + Math.floor(video.duration % 60)).slice(-2);
        });
      });
      document.getElementById('vpSpeed').addEventListener('change', function () {
        video.playbackRate = parseFloat(this.value);
      });
      document.getElementById('vpPiP').addEventListener('click', function () {
        if (document.pictureInPictureElement) document.exitPictureInPicture();
        else if (document.pictureInPictureEnabled) video.requestPictureInPicture();
        else T.toast('当前浏览器不支持画中画');
      });
      document.getElementById('vpFull').addEventListener('click', function () {
        if (video.requestFullscreen) video.requestFullscreen();
      });
      return function () {
        if (video.src) URL.revokeObjectURL(video.src);
      };
    }
  });

  /* ============ 视频抽帧 ============ */
  T.register({
    id: 'video-frames', icon: '🎞️', cat: 'video', name: '视频抽帧', net: false,
    desc: '按时间间隔抽取视频关键帧，生成缩略图网格',
    keywords: '视频 抽帧 截图 缩略图 关键帧 预览 合成',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('视频抽帧（缩略图网格）', 'Extract Frames') + '</h3>' +
        '<div class="field"><input type="file" id="vfFile" accept="video/*"></div>' +
        '<div class="row">' +
          '<div class="field"><label>抽帧间隔（秒）</label><select id="vfGap"><option>1</option><option selected>5</option><option>10</option><option>30</option><option>60</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vfRun" disabled>' + L('开始抽帧', 'Extract') + '</button></div>' +
        '</div>' +
        '<div id="vfBar" class="progress"><i></i></div>' +
        '<div id="vfOut" style="margin-top:12px"></div>' +
        '<p class="note">在本地逐帧绘制并合并为一张大图，可下载。视频较长时耗时较久，建议先用 60 秒间隔。</p>' +
      '</div>';
      var video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      var url = null;
      document.getElementById('vfFile').addEventListener('change', function (e) {
        var f = e.target.files[0];
        if (!f) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(f);
        video.src = url;
        document.getElementById('vfRun').disabled = false;
      });
      document.getElementById('vfRun').addEventListener('click', function () {
        var out = document.getElementById('vfOut');
        var gap = parseFloat(document.getElementById('vfGap').value);
        var btn = document.getElementById('vfRun');
        var bar = document.getElementById('vfBar').querySelector('i');
        btn.disabled = true;
        out.innerHTML = '<div class="msg">解析视频…</div>';
        var onMeta = function () {
          var dur = video.duration;
          if (!isFinite(dur) || dur <= 0) { out.innerHTML = '<div class="msg err">无法读取视频时长</div>'; btn.disabled = false; return; }
          var thumbs = [];
          for (var t = 0; t < dur; t += gap) thumbs.push(t);
          if (!thumbs.length) thumbs.push(0);
          var W = 320, H = Math.round(W * (video.videoHeight / video.videoWidth) || W * 0.56);
          var cols = 4;
          var rows = Math.ceil(thumbs.length / cols);
          var canvas = document.createElement('canvas');
          canvas.width = W * cols;
          canvas.height = H * rows;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#0D1013';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          var done = 0;
          function drawFrame(t, i) {
            video.currentTime = t;
            video.onseeked = function () {
              var x = (i % cols) * W, y = Math.floor(i / cols) * H;
              ctx.drawImage(video, x, y, W, H);
              ctx.fillStyle = 'rgba(13,16,19,.7)';
              ctx.fillRect(x, y + H - 22, W, 22);
              ctx.fillStyle = '#E8A33D';
              ctx.font = '12px Consolas,monospace';
              ctx.fillText(fmt(t), x + 6, y + H - 7);
              done++;
              bar.style.width = Math.round(done / thumbs.length * 100) + '%';
              if (done < thumbs.length) drawFrame(thumbs[done], done);
              else {
                out.innerHTML = '<div class="msg ok">共抽取 ' + done + ' 帧</div>' +
                  '<img class="img-preview" src="' + canvas.toDataURL('image/jpeg', 0.82) + '" style="margin-top:10px">' +
                  '<div class="row" style="margin-top:12px"><button class="btn btn-primary" id="vfDl">下载网格图（' + canvas.width + '×' + canvas.height + '）</button></div>';
                document.getElementById('vfDl').addEventListener('click', function () {
                  canvas.toBlob(function (b) { T.blobDownload(b, '视频抽帧.jpg'); }, 'image/jpeg', 0.9);
                });
                btn.disabled = false;
              }
            };
          }
          drawFrame(thumbs[0], 0);
        };
        if (video.readyState >= 1) onMeta();
        else video.onloadedmetadata = onMeta;
      });
      function fmt(t) {
        var m = Math.floor(t / 60), s = Math.floor(t % 60);
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      }
      return function () { if (url) URL.revokeObjectURL(url); };
    }
  });

  /* ============ 视频截图 ============ */
  T.register({
    id: 'video-shot', icon: '📸', cat: 'video', name: '视频截图', net: false,
    desc: '逐帧定位并截取视频当前帧为图片',
    keywords: '视频 截图 抓帧 帧 定位 导出 图片',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('视频截图', 'Video Snapshot') + '</h3>' +
        '<div class="field"><input type="file" id="vsFile" accept="video/*"></div>' +
        '<video id="vsVideo" controls playsinline style="width:100%;max-height:420px;background:#000;border-radius:10px;border:1px solid var(--line)" hidden></video>' +
        '<div class="row" style="margin-top:12px">' +
          '<div class="field grow"><label>定位到（秒）</label><input id="vsSeek" type="number" min="0" step="0.1" value="0" style="font-family:var(--mono)"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="vsGo">定位</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vsShot">' + L('截取当前帧', 'Capture frame') + '</button></div>' +
        '</div>' +
        '<div id="vsOut" style="margin-top:12px"></div>' +
        '<p class="note">拖动播放条到目标位置，或输入秒数定位后点击“截取当前帧”，图片在本地生成可下载。</p>' +
      '</div>';
      var video = document.getElementById('vsVideo');
      var url = null;
      document.getElementById('vsFile').addEventListener('change', function (e) {
        var f = e.target.files[0];
        if (!f) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(f);
        video.hidden = false;
        video.src = url;
        document.getElementById('vsSeek').value = '0';
      });
      document.getElementById('vsGo').addEventListener('click', function () {
        var t = parseFloat(document.getElementById('vsSeek').value);
        if (isNaN(t)) { T.toast('请输入秒数'); return; }
        if (video.readyState < 1) { T.toast('请先选择视频'); return; }
        video.currentTime = Math.max(0, Math.min(t, video.duration || 0));
      });
      document.getElementById('vsShot').addEventListener('click', function () {
        if (video.readyState < 2) { T.toast('视频尚未就绪，请等待加载'); return; }
        var out = document.getElementById('vsOut');
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        var t = video.currentTime;
        var m = Math.floor(t / 60), s = Math.floor(t % 60);
        var label = (m < 10 ? '0' : '') + m + '-' + (s < 10 ? '0' : '') + s;
        out.innerHTML = '<div class="msg ok">已截取 ' + video.videoWidth + '×' + video.videoHeight + ' @ ' + label + '</div>' +
          '<img class="img-preview" src="' + canvas.toDataURL('image/png') + '" style="margin-top:8px">' +
          '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="vsDl">下载 PNG</button></div>';
        document.getElementById('vsDl').addEventListener('click', function () {
          canvas.toBlob(function (b) { T.blobDownload(b, '截图-' + label + '.png'); }, 'image/png');
        });
      });
      return function () { if (url) URL.revokeObjectURL(url); };
    }
  });

  /* ============ 视频转 GIF（内置 GIF 编码器） ============ */
  T.register({
    id: 'video-gif', icon: '🌀', cat: 'video', name: '视频转 GIF', net: false,
    desc: '从视频抽取画面生成动图，可调帧率与宽度',
    keywords: '视频 GIF 动图 转换 表情包 抽帧',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('视频转 GIF 动图', 'Video to GIF') + '</h3>' +
        '<div class="field"><input type="file" id="vgFile" accept="video/*"></div>' +
        '<div class="row">' +
          '<div class="field"><label>帧率（fps）</label><select id="vgFps"><option>5</option><option selected>10</option><option>15</option><option>20</option></select></div>' +
          '<div class="field"><label>输出宽度</label><select id="vgW"><option>240</option><option selected>320</option><option>480</option><option>640</option></select></div>' +
          '<div class="field"><label>起始秒</label><input id="vgFrom" type="number" min="0" step="1" value="0" style="width:80px"></div>' +
          '<div class="field"><label>时长（秒）</label><input id="vgLen" type="number" min="1" max="20" step="1" value="3" style="width:80px"></div>' +
        '</div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vgRun" disabled>' + L('生成 GIF', 'Make GIF') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><span class="note" style="margin-top:8px">建议总帧数 ≤ 120，超长会较慢</span></div></div>' +
        '<div id="vgBar" class="progress"><i></i></div>' +
        '<div id="vgOut" style="margin-top:12px"></div>' +
        '<p class="note">在本地逐帧绘制并编码为 GIF，不上传文件。GIF 为 256 色调色板，画质一般，适合表情包与动图演示。</p>' +
      '</div>';
      var video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      var url = null;
      document.getElementById('vgFile').addEventListener('change', function (e) {
        var f = e.target.files[0];
        if (!f) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(f);
        video.src = url;
        document.getElementById('vgRun').disabled = false;
      });
      document.getElementById('vgRun').addEventListener('click', function () {
        var out = document.getElementById('vgOut');
        var btn = document.getElementById('vgRun');
        var bar = document.getElementById('vgBar').querySelector('i');
        btn.disabled = true;
        out.innerHTML = '<div class="msg">解析视频…</div>';
        var onMeta = function () {
          var dur = video.duration;
          if (!isFinite(dur) || dur <= 0) { out.innerHTML = '<div class="msg err">无法读取视频时长</div>'; btn.disabled = false; return; }
          var fps = parseInt(document.getElementById('vgFps').value, 10);
          var W = parseInt(document.getElementById('vgW').value, 10);
          var from = Math.max(0, Math.min(parseFloat(document.getElementById('vgFrom').value) || 0, dur - 0.1));
          var len = Math.min(20, Math.max(1, parseFloat(document.getElementById('vgLen').value) || 3));
          var to = Math.min(dur, from + len);
          var H = Math.max(16, Math.round(W * (video.videoHeight / video.videoWidth) || W * 0.56));
          var frames = [];
          var t = from;
          while (t < to) { frames.push(t); t += 1 / fps; }
          if (frames.length > 180) frames = frames.slice(0, 180);
          var canvas = document.createElement('canvas');
          canvas.width = W; canvas.height = H;
          var ctx = canvas.getContext('2d');
          var done = 0;
          function grab(i) {
            video.currentTime = frames[i];
            video.onseeked = function () {
              ctx.drawImage(video, 0, 0, W, H);
              var img = ctx.getImageData(0, 0, W, H);
              frames[i] = img.data;
              done++;
              bar.style.width = Math.round(done / frames.length * 100) + '%';
              if (done < frames.length) grab(done);
              else {
                try {
                  var gif = buildGif(frames, W, H, Math.round(100 / fps));
                  var blob = new Blob([gif], { type: 'image/gif' });
                  out.innerHTML = '<div class="msg ok">已生成 ' + frames.length + ' 帧 · ' + W + '×' + H + ' · ' + (blob.size / 1024).toFixed(0) + ' KB</div>' +
                    '<img class="img-preview" src="' + URL.createObjectURL(blob) + '" style="margin-top:8px">' +
                    '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="vgDl">下载 GIF</button></div>';
                  var u = URL.createObjectURL(blob);
                  document.getElementById('vgDl').addEventListener('click', function () {
                    T.blobDownload(blob, '视频动图.gif');
                  });
                  setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
                } catch (err) {
                  out.innerHTML = '<div class="msg err">GIF 编码失败：' + (err && err.message ? err.message : err) + '</div>';
                }
                btn.disabled = false;
              }
            };
          }
          if (frames.length) grab(0);
          else { out.innerHTML = '<div class="msg err">没有可生成的帧</div>'; btn.disabled = false; }
        };
        if (video.readyState >= 1) onMeta();
        else video.onloadedmetadata = onMeta;
      });
      return function () { if (url) URL.revokeObjectURL(url); };
    }
  });

  /* 极简 GIF 编码器：RGB332 调色板 + LZW（无第三方依赖） */
  function buildGif(frameRgbaList, w, h, delayCs) {
    var pal = new Uint8Array(256 * 3);
    for (var i = 0; i < 256; i++) {
      pal[i * 3] = ((i >> 5) & 7) * 36 + 18;
      pal[i * 3 + 1] = ((i >> 2) & 7) * 36 + 18;
      pal[i * 3 + 2] = (i & 3) * 85 + 42;
    }
    function idxOf(pix) {
      return ((pix[0] >> 5) << 5) | ((pix[1] >> 5) << 2) | (pix[2] >> 6);
    }
    function lzwEncode(indices, minCode) {
      var out = [];
      var bitBuf = 0, bitCnt = 0;
      var dict = {}, next = 258;
      var codeSize = minCode + 1;
      function emit(code) {
        bitBuf |= code << bitCnt;
        bitCnt += codeSize;
        while (bitCnt >= 8) {
          out.push(bitBuf & 255);
          bitBuf >>= 8;
          bitCnt -= 8;
        }
      }
      emit(256);
      var prev = indices[0];
      for (var i = 1; i < indices.length; i++) {
        var cur = indices[i];
        var k = prev + ',' + cur;
        if (dict[k] !== undefined) { prev = dict[k]; }
        else {
          emit(prev);
          dict[k] = next++;
          if (next === (1 << codeSize) && codeSize < 12) codeSize++;
          if (next >= 4096) { emit(256); dict = {}; next = 258; codeSize = minCode + 1; }
          prev = cur;
        }
      }
      emit(prev);
      emit(257);
      if (bitCnt > 0) out.push(bitBuf & 255);
      return out;
    }
    var bytes = [];
    function u8(n) { bytes.push(n & 255); }
    function u16(n) { bytes.push(n & 255, (n >> 8) & 255); }
    function str(s) { for (var j = 0; j < s.length; j++) u8(s.charCodeAt(j)); }
    str('GIF89a');
    u16(w); u16(h); u8(0xF7); u8(0); u8(0);
    for (var p = 0; p < 768; p++) u8(pal[p]);
    var frame = 0;
    function addFrame(rgba) {
      u8(0x21); u8(0xF9); u8(0x04); u8(0x04); u16(delayCs); u8(0); u8(0);
      u8(0x2C); u16(0); u16(0); u16(w); u16(h); u8(0);
      var idx = new Uint8Array(w * h);
      var q = 0;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var o = (y * w + x) * 4;
          idx[q++] = idxOf([rgba[o], rgba[o + 1], rgba[o + 2]]);
        }
      }
      var lzw = lzwEncode(idx, 8);
      u8(8);
      for (var s2 = 0; s2 < lzw.length; s2 += 255) {
        var chunk = Math.min(255, lzw.length - s2);
        u8(chunk);
        for (var c = 0; c < chunk; c++) u8(lzw[s2 + c]);
      }
      u8(0);
      frame++;
    }
    for (var f = 0; f < frameRgbaList.length; f++) addFrame(frameRgbaList[f]);
    u8(0x3B);
    return new Uint8Array(bytes);
  }

  /* ============ 音频提取（本地提取音轨为 WAV） ============ */
  T.register({
    id: 'video-audio', icon: '🔊', cat: 'video', name: '音频提取', net: false,
    desc: '从视频中提取音轨并保存为 WAV 音频',
    keywords: '视频 音频 提取 音轨 转音频 WAV 配音',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('视频音频提取（转 WAV）', 'Audio Extractor (WAV)') + '</h3>' +
        '<div class="field"><input type="file" id="vaFile" accept="video/*,audio/*"></div>' +
        '<div class="row">' +
          '<div class="field"><label>声道</label><select id="vaCh"><option value="1">单声道</option><option selected value="2">双声道</option></select></div>' +
          '<div class="field"><label>采样率</label><select id="vaRate"><option value="16000">16 kHz</option><option selected value="44100">44.1 kHz</option><option value="48000">48 kHz</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vaRun" disabled>' + L('提取音频', 'Extract audio') + '</button></div>' +
        '</div>' +
        '<div id="vaOut" class="note"></div>' +
        '<p class="note">在本地解码音轨并编码为 WAV（PCM 16bit），不上传文件。适合提取配音、音乐、会议录音。</p>' +
      '</div>';
      if (typeof window.AudioContext === 'undefined' && typeof window.webkitAudioContext === 'undefined') {
        document.getElementById('vaRun').disabled = true;
        document.getElementById('vaOut').textContent = '当前浏览器不支持 WebAudio 解码（请用 Chrome / Edge / Firefox）。';
      }
      var file = null;
      document.getElementById('vaFile').addEventListener('change', function (e) {
        file = e.target.files[0] || null;
        document.getElementById('vaRun').disabled = !file;
      });
      document.getElementById('vaRun').addEventListener('click', function () {
        if (!file) return;
        var out = document.getElementById('vaOut');
        var btn = document.getElementById('vaRun');
        btn.disabled = true;
        out.textContent = '解码中…（大文件需要几秒）';
        var AC = window.AudioContext || window.webkitAudioContext;
        var ac = new AC();
        var fr = new FileReader();
        fr.onload = function () {
          ac.decodeAudioData(fr.result, function (buf) {
            var ch = parseInt(document.getElementById('vaCh').value, 10);
            var rate = parseInt(document.getElementById('vaRate').value, 10);
            var oc = new OfflineAudioContext(ch, Math.ceil(buf.duration * rate), rate);
            var src = oc.createBufferSource();
            src.buffer = buf;
            src.connect(oc.destination);
            src.start(0);
            oc.startRendering().then(function (rendered) {
              var wav = pcmToWav(rendered);
              var blob = new Blob([wav], { type: 'audio/wav' });
              out.innerHTML = '<span class="msg ok">已提取 ' + rendered.duration.toFixed(1) + ' 秒 · ' + (blob.size / 1048576).toFixed(1) + ' MB</span>';
              var row = document.createElement('div');
              row.className = 'row';
              row.style.marginTop = '10px';
              row.innerHTML = '<button class="btn btn-primary" id="vaDl">下载 WAV</button>';
              out.appendChild(row);
              document.getElementById('vaDl').addEventListener('click', function () {
                T.blobDownload(blob, '提取音频.wav');
              });
              btn.disabled = false;
              ac.close();
            }).catch(function (e2) {
              out.textContent = '渲染失败：' + (e2 && e2.message ? e2.message : e2);
              btn.disabled = false;
              ac.close();
            });
          }, function () {
            out.textContent = '解码失败：视频编码不受支持或文件损坏。';
            btn.disabled = false;
            ac.close();
          });
        };
        fr.readAsArrayBuffer(file);
      });
      return function () {};
    }
  });

  function pcmToWav(buffer) {
    var ch = buffer.numberOfChannels;
    var rate = buffer.sampleRate;
    var len = buffer.length;
    var dataSize = len * ch * 2;
    var ab = new ArrayBuffer(44 + dataSize);
    var dv = new DataView(ab);
    function ws(o, s) { for (var i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); }
    ws(0, 'RIFF'); dv.setUint32(4, 36 + dataSize, true); ws(8, 'WAVE');
    ws(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, ch, true);
    dv.setUint32(24, rate, true); dv.setUint32(28, rate * ch * 2, true); dv.setUint16(32, ch * 2, true); dv.setUint16(34, 16, true);
    ws(36, 'data'); dv.setUint32(40, dataSize, true);
    var off = 44;
    var chans = [];
    for (var c = 0; c < ch; c++) chans.push(buffer.getChannelData(c));
    for (var i = 0; i < len; i++) {
      for (var c2 = 0; c2 < ch; c2++) {
        var s2 = Math.max(-1, Math.min(1, chans[c2][i]));
        dv.setInt16(off, s2 < 0 ? s2 * 0x8000 : s2 * 0x7FFF, true);
        off += 2;
      }
    }
    return ab;
  }

  /* ============ 片段截取（本地截取视频片段） ============ */
  T.register({
    id: 'video-cut', icon: '✂️', cat: 'video', name: '片段截取', net: false,
    desc: '按起止时间截取视频片段并导出（WebM）',
    keywords: '视频 截取 片段 剪辑 裁剪 起止 导出',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('视频片段截取', 'Clip Cutter') + '</h3>' +
        '<div class="field"><input type="file" id="vcFile" accept="video/*"></div>' +
        '<video id="vcVideo" controls playsinline style="width:100%;max-height:340px;background:#000;border-radius:10px;border:1px solid var(--line)" hidden></video>' +
        '<div class="row" style="margin-top:12px">' +
          '<div class="field grow"><label>' + L('开始（秒）', 'Start (s)') + '</label><input id="vcFrom" type="number" min="0" step="0.5" value="0"></div>' +
          '<div class="field grow"><label>结束（秒）</label><input id="vcTo" type="number" min="0" step="0.5" value="5"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vcRun" disabled>' + L('开始截取', 'Cut') + '</button></div>' +
        '</div>' +
        '<div id="vcOut" class="note"></div>' +
        '<p class="note">在本地重放起止区间并实时录制为 WebM 视频（依赖浏览器 MediaRecorder，Chrome / Edge / Firefox 可用），不上传文件。</p>' +
      '</div>';
      var video = document.getElementById('vcVideo');
      var url = null;
      document.getElementById('vcFile').addEventListener('change', function (e) {
        var f = e.target.files[0];
        if (!f) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(f);
        video.hidden = false;
        video.src = url;
        document.getElementById('vcRun').disabled = false;
      });
      document.getElementById('vcRun').addEventListener('click', function () {
        if (typeof window.MediaRecorder === 'undefined') { T.toast('当前浏览器不支持 MediaRecorder，无法录制'); return; }
        if (video.readyState < 1) { T.toast('视频尚未就绪'); return; }
        var out = document.getElementById('vcOut');
        var from = Math.max(0, parseFloat(document.getElementById('vcFrom').value) || 0);
        var to = Math.max(from + 0.5, parseFloat(document.getElementById('vcTo').value) || 0);
        var btn = document.getElementById('vcRun');
        btn.disabled = true;
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext('2d');
        var stream = canvas.captureStream(30);
        var mime = (window.MediaRecorder.isTypeSupported ? window.MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : (window.MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm') : 'video/webm');
        var rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 });
        var chunks = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        video.muted = false;
        video.currentTime = from;
        var raf = 0;
        function draw() {
          if (video.currentTime >= to || video.ended) { rec.stop(); return; }
          ctx.drawImage(video, 0, 0);
          raf = requestAnimationFrame(draw);
        }
        rec.onstop = function () {
          cancelAnimationFrame(raf);
          video.pause();
          var blob = new Blob(chunks, { type: 'video/webm' });
          out.innerHTML = '<span class="msg ok">已截取 ' + (to - from).toFixed(1) + ' 秒 · ' + (blob.size / 1048576).toFixed(1) + ' MB · ' + mime + '</span>';
          var row = document.createElement('div');
          row.className = 'row';
          row.style.marginTop = '10px';
          row.innerHTML = '<button class="btn btn-primary" id="vcDl">下载片段（WebM）</button>';
          out.appendChild(row);
          document.getElementById('vcDl').addEventListener('click', function () { T.blobDownload(blob, '片段-' + from + '-' + to + '.webm'); });
          btn.disabled = false;
        };
        video.onseeked = function () {
          video.onseeked = null;
          rec.start(200);
          draw();
        };
      });
      return function () { if (url) URL.revokeObjectURL(url); };
    }
  });

  /* ============ 九宫格封面 ============ */
  T.register({
    id: 'video-grid', icon: '🔲', cat: 'video', name: '封面九宫格', net: false,
    desc: '把视频平均切分抽取画面，拼成封面九宫格',
    keywords: '视频 封面 九宫格 拼图 缩略图 预览 海报',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('视频封面九宫格', 'Cover Grid') + '</h3>' +
        '<div class="field"><input type="file" id="vg2File" accept="video/*"></div>' +
        '<div class="row">' +
          '<div class="field"><label>网格</label><select id="vg2N"><option value="4">2×2</option><option selected value="9">3×3</option><option value="16">4×4</option></select></div>' +
          '<div class="field"><label>每格宽度</label><select id="vg2W"><option>240</option><option selected>320</option><option>400</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vg2Run" disabled>' + L('生成拼图', 'Make grid') + '</button></div>' +
        '</div>' +
        '<div id="vg2Out" style="margin-top:12px"></div>' +
        '<p class="note">按视频总时长平均分成 N 格，抽取每格起始帧拼成一张封面大图，可下载 PNG。</p>' +
      '</div>';
      var video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      var url = null;
      document.getElementById('vg2File').addEventListener('change', function (e) {
        var f = e.target.files[0];
        if (!f) return;
        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(f);
        video.src = url;
        document.getElementById('vg2Run').disabled = false;
      });
      document.getElementById('vg2Run').addEventListener('click', function () {
        var out = document.getElementById('vg2Out');
        var btn = document.getElementById('vg2Run');
        btn.disabled = true;
        out.innerHTML = '<div class="msg">解析视频…</div>';
        var onMeta = function () {
          var dur = video.duration;
          if (!isFinite(dur) || dur <= 0) { out.innerHTML = '<div class="msg err">无法读取视频时长</div>'; btn.disabled = false; return; }
          var n = parseInt(document.getElementById('vg2N').value, 10);
          var W = parseInt(document.getElementById('vg2W').value, 10);
          var cols = Math.sqrt(n);
          var rows = cols;
          var H = Math.max(16, Math.round(W * (video.videoHeight / video.videoWidth) || W * 0.56));
          var canvas = document.createElement('canvas');
          canvas.width = W * cols;
          canvas.height = H * rows;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#0D1013';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          var times = [];
          for (var i = 0; i < n; i++) times.push(Math.min(dur - 0.05, dur * i / n));
          var done = 0;
          function grab(i) {
            video.currentTime = times[i];
            video.onseeked = function () {
              var x = (i % cols) * W, y = Math.floor(i / cols) * H;
              ctx.drawImage(video, x, y, W, H);
              ctx.fillStyle = 'rgba(13,16,19,.65)';
              ctx.fillRect(x, y + H - 24, W, 24);
              ctx.fillStyle = '#E8A33D';
              ctx.font = '12px Consolas,monospace';
              var t = times[i], m = Math.floor(t / 60), s = Math.floor(t % 60);
              ctx.fillText((m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s, x + 6, y + H - 8);
              done++;
              if (done < n) grab(done);
              else {
                out.innerHTML = '<div class="msg ok">已抽取 ' + n + ' 帧拼图 ' + canvas.width + '×' + canvas.height + '</div>' +
                  '<img class="img-preview" src="' + canvas.toDataURL('image/jpeg', 0.85) + '" style="margin-top:10px">' +
                  '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="vg2Dl">下载拼图</button></div>';
                document.getElementById('vg2Dl').addEventListener('click', function () {
                  canvas.toBlob(function (b) { T.blobDownload(b, '封面九宫格.jpg'); }, 'image/jpeg', 0.92);
                });
                btn.disabled = false;
              }
            };
          }
          grab(0);
        };
        if (video.readyState >= 1) onMeta();
        else video.onloadedmetadata = onMeta;
      });
      return function () { if (url) URL.revokeObjectURL(url); };
    }
  });
})();
