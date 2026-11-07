/* ============================================================
   万能工具箱 · 时间类工具（4 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function fmtHMS(ms) {
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    var cs = Math.floor(ms % 1000 / 10);
    return pad2(h) + ':' + pad2(m) + ':' + pad2(sec) + '.' + pad2(cs);
  }

  /* ============ 秒表 ============ */
  T.register({
    id: 'stopwatch', icon: '⏱️', cat: 'time', name: '秒表',
    desc: '高精度计时，支持计次（圈速）记录',
    keywords: '秒表 stopwatch 计时 圈速 lap',
    render: function (host) {
      host.innerHTML =
      '<div class="panel" style="text-align:center">' +
        '<div style="font-family:var(--mono);font-size:clamp(38px,8vw,56px);font-weight:700;letter-spacing:2px;padding:14px 0 4px" id="swDisp">00:00:00.00</div>' +
        '<p class="muted">点击开始计时，计次可记录每圈耗时</p>' +
        '<div class="row" style="justify-content:center;margin:18px 0 4px">' +
          '<button class="btn btn-primary" id="swStart" style="min-width:110px">' + L('开始', 'Start') + '</button>' +
          '<button class="btn btn-ghost" id="swLap" disabled>' + L('计次', 'Lap') + '</button>' +
          '<button class="btn btn-ghost" id="swReset">' + L('复位', 'Reset') + '</button>' +
        '</div>' +
        '<div id="swLaps"></div>' +
      '</div>';
      var disp = document.getElementById('swDisp');
      var lapsEl = document.getElementById('swLaps');
      var startBtn = document.getElementById('swStart');
      var lapBtn = document.getElementById('swLap');
      var running = false, t0 = 0, elapsed = 0, laps = [];
      function render() {
        disp.textContent = fmtHMS(elapsed);
        startBtn.textContent = running ? '暂停' : '继续';
      }
      function tick() {
        elapsed = t0 + (performance.now() - startMs);
        render();
      }
      var startMs = 0;
      startBtn.addEventListener('click', function () {
        if (!running) {
          if (!elapsed) t0 = 0;
          startMs = performance.now();
          running = true;
          T.setIntervalSafe(tick, 33);
          lapBtn.disabled = false;
        } else {
          t0 = elapsed;
          running = false;
          T.clearAllTimers();
          render();
        }
      });
      lapBtn.addEventListener('click', function () {
        var prev = laps.length ? laps[laps.length - 1].acc : 0;
        laps.push({ acc: elapsed, lap: elapsed - prev });
        var h = '<table class="lap-table"><thead><tr><th>次数</th><th>累计</th><th>本次</th></tr></thead><tbody>';
        laps.forEach(function (l, i) {
          h += '<tr><td>' + (i + 1) + '</td><td>' + fmtHMS(l.acc) + '</td><td>' + fmtHMS(l.lap) + '</td></tr>';
        });
        h += '</tbody></table>';
        lapsEl.innerHTML = h;
      });
      document.getElementById('swReset').addEventListener('click', function () {
        running = false;
        T.clearAllTimers();
        elapsed = 0; laps = [];
        lapsEl.innerHTML = '';
        lapBtn.disabled = true;
        startBtn.textContent = '开始';
        render();
      });
    }
  });

  /* ============ 倒计时 ============ */
  T.register({
    id: 'countdown', icon: '⏲️', cat: 'time', name: '倒计时',
    desc: '设定时长倒计时，结束时响铃提醒',
    keywords: '倒计时 countdown 定时 提醒 闹钟',
    render: function (host) {
      var total = 0, remain = 0, running = false, endAt = 0;
      var timerId = null;
      function beep() {
        try {
          var ctx = new (window.AudioContext || window.webkitAudioContext)();
          var o = ctx.createOscillator();
          var g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.25, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          o.start(); o.stop(ctx.currentTime + 1.2);
        } catch (e) { /* 音频不可用时静默 */ }
      }
      function render() {
        var s = Math.max(0, Math.ceil(remain / 1000));
        var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
        document.getElementById('cdDisp').textContent =
          (h ? pad2(h) + ':' : '') + pad2(m) + ':' + pad2(sec);
        var ring = document.getElementById('cdRing');
        if (ring) {
          var circ = 2 * Math.PI * 96;
          var frac = total ? remain / total : 0;
          ring.style.strokeDasharray = circ;
          ring.style.strokeDashoffset = circ * (1 - frac);
        }
      }
      function tick() {
        remain = endAt - Date.now();
        if (remain <= 0) {
          remain = 0;
          running = false;
          T.clearAllTimers();
          document.getElementById('cdStart').textContent = '开始';
          render();
          beep();
          T.toast('时间到');
        } else render();
      }
      host.innerHTML =
      '<div class="panel" style="text-align:center">' +
        '<div class="timer-ring">' +
          '<svg width="220" height="220" viewBox="0 0 220 220">' +
            '<circle class="ring-bg" cx="110" cy="110" r="96" stroke-width="12"/>' +
            '<circle class="ring-fg" id="cdRing" cx="110" cy="110" r="96" stroke-width="12"/>' +
          '</svg>' +
          '<div class="time-text" id="cdDisp">00:00</div>' +
          '<div class="phase-text" id="cdPhase">设定时长开始倒计时</div>' +
        '</div>' +
        '<div class="row" style="justify-content:center">' +
          '<div class="field"><label>分</label><input id="cdM" inputmode="numeric" value="5" style="width:90px;text-align:center"></div>' +
          '<div class="field"><label>秒</label><input id="cdS" inputmode="numeric" value="0" style="width:90px;text-align:center"></div>' +
        '</div>' +
        '<div class="row" style="justify-content:center;margin-top:6px">' +
          '<button class="btn btn-primary" id="cdStart" style="min-width:110px">' + L('开始', 'Start') + '</button>' +
          '<button class="btn btn-ghost" id="cdReset">' + L('复位', 'Reset') + '</button>' +
        '</div>' +
      '</div>';
      function setFromInputs() {
        var m = parseInt(document.getElementById('cdM').value, 10) || 0;
        var s = parseInt(document.getElementById('cdS').value, 10) || 0;
        total = remain = Math.max(1000, (m * 60 + s) * 1000);
        render();
      }
      document.getElementById('cdStart').addEventListener('click', function () {
        if (!running) {
          if (!remain) setFromInputs();
          endAt = Date.now() + remain;
          running = true;
          document.getElementById('cdPhase').textContent = '倒计时中';
          this.textContent = '暂停';
          tick();
          T.setIntervalSafe(tick, 250);
        } else {
          remain = endAt - Date.now();
          running = false;
          T.clearAllTimers();
          document.getElementById('cdPhase').textContent = '已暂停';
          this.textContent = '继续';
        }
      });
      document.getElementById('cdReset').addEventListener('click', function () {
        running = false;
        T.clearAllTimers();
        document.getElementById('cdStart').textContent = '开始';
        document.getElementById('cdPhase').textContent = '设定时长开始倒计时';
        setFromInputs();
      });
      setFromInputs();
    }
  });

  /* ============ 世界时钟 ============ */
  T.register({
    id: 'worldclock', icon: '🌏', cat: 'time', name: '世界时钟',
    desc: '主要城市与任意时区当前时间',
    keywords: '世界时钟 world clock 时区 城市 时间',
    render: function (host) {
      var cities = [
        { n: '北京', o: 8 }, { n: '上海', o: 8 }, { n: '香港', o: 8 },
        { n: '东京', o: 9 }, { n: '首尔', o: 9 }, { n: '新加坡', o: 8 },
        { n: '悉尼', o: 10 }, { n: '迪拜', o: 4 }, { n: '莫斯科', o: 3 },
        { n: '伦敦', o: 0 }, { n: '巴黎', o: 1 }, { n: '柏林', o: 1 },
        { n: '纽约', o: -4 }, { n: '洛杉矶', o: -7 }, { n: '芝加哥', o: -5 },
        { n: '旧金山', o: -7 }, { n: '温哥华', o: -7 }, { n: '圣保罗', o: -3 }
      ];
      host.innerHTML =
      '<div class="panel"><h3>' + L('世界时钟', 'World Clock') + '</h3>' +
        '<div class="stat-grid" id="wcGrid"></div>' +
        '<div class="field" style="margin-top:16px"><label>自定义时区（UTC 偏移，如 +5.5 / -3）</label>' +
          '<div class="row"><input id="wcOff" inputmode="decimal" placeholder="例如 +5.5" style="width:140px;background:var(--bg-soft);border:1px solid var(--line);border-radius:10px;padding:11px 12px">' +
          '<button class="btn btn-ghost" id="wcAdd">' + L('添加', 'Add') + '</button></div>' +
        '</div>' +
        '<p class="muted">固定偏移显示（未做夏令时自动调整），误差不超过 1 小时。</p>' +
      '</div>';
      var custom = T.store.get('wcCustom', []);
      var grid = document.getElementById('wcGrid');
      function card(c) {
        var d = new Date(Date.now() + (c.o - new Date().getTimezoneOffset() / 60) * 3600000);
        return '<div class="stat-box" style="position:relative">' +
          (c.custom ? '<button class="wc-del" data-c="' + T.esc(c.n) + '" style="position:absolute;top:6px;right:8px;color:var(--ink-faint);font-size:13px" title="删除">×</button>' : '') +
          '<div class="k">' + T.esc(c.n) + ' · UTC' + (c.o >= 0 ? '+' : '') + c.o + '</div>' +
          '<div class="v" style="font-size:17px">' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds()) + '</div></div>';
      }
      function renderAll() {
        var list = cities.concat(custom.map(function (n) {
          return { n: n.n, o: n.o, custom: true };
        }));
        grid.innerHTML = list.map(card).join('');
      }
      function tick() { renderAll(); }
      renderAll();
      T.setIntervalSafe(tick, 1000);
      grid.addEventListener('click', function (e) {
        var b = e.target.closest('.wc-del');
        if (!b) return;
        var n = b.getAttribute('data-c');
        custom = custom.filter(function (x) { return x.n !== n; });
        T.store.set('wcCustom', custom);
        renderAll();
      });
      document.getElementById('wcAdd').addEventListener('click', function () {
        var v = document.getElementById('wcOff').value.trim();
        var o = parseFloat(v);
        if (isNaN(o) || o < -12 || o > 14) { T.toast('请输入 -12 ~ +14 之间的偏移'); return; }
        var n = 'UTC' + (o >= 0 ? '+' : '') + o;
        if (custom.some(function (x) { return x.o === o; })) { T.toast('该时区已存在'); return; }
        custom.push({ n: n, o: o });
        T.store.set('wcCustom', custom);
        document.getElementById('wcOff').value = '';
        renderAll();
      });
    }
  });

  /* ============ 时间戳转换 ============ */
  T.register({
    id: 'timestamp', icon: '🕐', cat: 'time', name: '时间戳转换',
    desc: 'Unix 时间戳与日期时间互转',
    keywords: '时间戳 timestamp unix 转换 epoch',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('时间戳 → 日期', 'Timestamp → Date') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>时间戳</label><input id="tsIn" inputmode="numeric" placeholder="例如 1750000000 或 1750000000000"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="tsNow">' + L('使用当前时间', 'Use now') + '</button></div>' +
        '</div>' +
        '<div class="stat-grid" id="tsOut" style="display:none">' +
          '<div class="stat-box"><div class="k">本地时间</div><div class="v" style="font-size:15px" id="tsLocal">-</div></div>' +
          '<div class="stat-box"><div class="k">UTC 时间</div><div class="v" style="font-size:15px" id="tsUtc">-</div></div>' +
          '<div class="stat-box"><div class="k">ISO 格式</div><div class="v" style="font-size:14px" id="tsIso">-</div></div>' +
          '<div class="stat-box"><div class="k">星期</div><div class="v" style="font-size:15px" id="tsWeek">-</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="panel"><h3>' + L('日期 → 时间戳', 'Date → Timestamp') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>日期时间</label><input type="datetime-local" id="tsDate"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="tsCvt">' + L('转换', 'Convert') + '</button></div>' +
        '</div>' +
        '<div class="field" style="margin-top:10px"><label>秒级时间戳</label><div class="out" id="tsSec"><span class="muted">-</span></div></div>' +
        '<div class="field"><label>毫秒级时间戳</label><div class="out" id="tsMs"><span class="muted">-</span></div></div>' +
      '</div>';
      function pad2b(n) { return (n < 10 ? '0' : '') + n; }
      function fmtLocal(d) {
        return d.getFullYear() + '-' + pad2b(d.getMonth() + 1) + '-' + pad2b(d.getDate()) + ' ' +
          pad2b(d.getHours()) + ':' + pad2b(d.getMinutes()) + ':' + pad2b(d.getSeconds());
      }
      document.getElementById('tsIn').addEventListener('input', function () {
        var v = parseFloat(document.getElementById('tsIn').value);
        if (isNaN(v)) { document.getElementById('tsOut').style.display = 'none'; return; }
        var ms = Math.abs(v) < 1e12 ? v * 1000 : v;
        var d = new Date(ms);
        if (isNaN(d)) return;
        document.getElementById('tsOut').style.display = 'grid';
        document.getElementById('tsLocal').textContent = fmtLocal(d);
        document.getElementById('tsUtc').textContent = d.toUTCString().slice(0, 22);
        document.getElementById('tsIso').textContent = d.toISOString();
        document.getElementById('tsWeek').textContent = '周' + '日一二三四五六'[d.getDay()];
      });
      document.getElementById('tsNow').addEventListener('click', function () {
        document.getElementById('tsIn').value = Math.floor(Date.now() / 1000);
        document.getElementById('tsIn').dispatchEvent(new Event('input'));
      });
      document.getElementById('tsCvt').addEventListener('click', function () {
        var v = document.getElementById('tsDate').value;
        if (!v) { T.toast('请选择日期时间'); return; }
        var ms = new Date(v).getTime();
        var sec = Math.floor(ms / 1000);
        var s1 = document.getElementById('tsSec'), s2 = document.getElementById('tsMs');
        s1.textContent = sec; s1.appendChild(T.mkCopyBtn(String(sec)));
        s2.textContent = ms; s2.appendChild(T.mkCopyBtn(String(ms)));
      });
      /* 默认填当前时间 */
      var now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      document.getElementById('tsDate').value = now.toISOString().slice(0, 16);
    }
  });
})();
