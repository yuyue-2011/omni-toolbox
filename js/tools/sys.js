/* ============================================================
   万能工具箱 · 系统类工具（5 款：系统信息/UA/字体/性能/特性检测）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 系统信息 ============ */
  T.register({
    id: 'sys-info', icon: '💻', cat: 'sys', name: '系统信息', net: false,
    desc: '浏览器 / 屏幕 / 硬件 / 存储环境信息总览',
    keywords: '系统信息 浏览器 设备 硬件 内存 屏幕 分辨率 电池 存储',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('系统信息', 'System Info') + '</h3>' +
        '<button class="btn btn-ghost" id="siRefresh">' + L('刷新信息', 'Refresh') + '</button>' +
        '<div id="siOut" style="margin-top:14px"></div>' +
      '</div>';
      function render() {
        var nav = navigator;
        var rows = [
          ['User Agent', nav.userAgent],
          ['浏览器语言', nav.language + '（' + (nav.languages || []).join(', ') + '）'],
          ['平台', nav.platform || nav.userAgentData && nav.userAgentData.platform || '-'],
          ['CPU 核心数', nav.hardwareConcurrency + ' 核'],
          ['设备内存', nav.deviceMemory ? (nav.deviceMemory >= 8 ? nav.deviceMemory + ' GB' : nav.deviceMemory * 1024 + ' MB') : '不支持'],
          ['Cookie 启用', nav.cookieEnabled ? '是' : '否'],
          ['屏幕分辨率', screen.width + ' × ' + screen.height],
          ['可视区域', window.innerWidth + ' × ' + window.innerHeight],
          ['像素比 DPR', window.devicePixelRatio || 1],
          ['屏幕方向', screen.orientation ? screen.orientation.type : '-'],
          ['颜色深度', screen.colorDepth + ' bit'],
          ['时区', Intl.DateTimeFormat().resolvedOptions().timeZone || '-'],
          ['在线状态', navigator.onLine ? '在线' : '离线'],
          ['渲染引擎', (function () {
            var ua = nav.userAgent;
            if (/Edg\//.test(ua)) return 'Edge (Chromium)';
            if (/Chrome\//.test(ua)) return 'Chromium';
            if (/Firefox\//.test(ua)) return 'Gecko';
            if (/Safari\//.test(ua)) return 'WebKit';
            return '未知';
          })()]
        ];
        var h = '<div class="table-wrap"><table class="kv">';
        rows.forEach(function (r) {
          h += '<tr><th>' + r[0] + '</th><td><span class="mono">' + T.esc(r[1]) + '</span></td></tr>';
        });
        h += '</table></div><div id="siMore"></div>';
        document.getElementById('siOut').innerHTML = h;
        /* 电池 */
        if (nav.getBattery) {
          nav.getBattery().then(function (b) {
            var el = document.createElement('div');
            el.className = 'table-wrap';
            el.style.marginTop = '10px';
            el.innerHTML = '<table class="kv"><tr><th>电池</th><td>' + Math.round(b.level * 100) + '%' + (b.charging ? ' · 充电中' : ' · 电池供电') + '</td></tr></table>';
            document.getElementById('siMore').appendChild(el);
          }).catch(function () {});
        }
        /* 存储 */
        if (nav.storage && nav.storage.estimate) {
          nav.storage.estimate().then(function (est) {
            var el = document.createElement('div');
            el.className = 'table-wrap';
            el.style.marginTop = '10px';
            var mb = 1048576;
            el.innerHTML = '<table class="kv"><tr><th>存储已用</th><td>' + (est.usage / mb).toFixed(1) + ' MB</td></tr><tr><th>存储配额</th><td>' + (est.quota / mb).toFixed(0) + ' MB</td></tr></table>';
            document.getElementById('siMore').appendChild(el);
          }).catch(function () {});
        }
      }
      document.getElementById('siRefresh').addEventListener('click', render);
      render();
    }
  });

  /* ============ UA 解析 ============ */
  T.register({
    id: 'ua-parse', icon: '🕵️', cat: 'sys', name: 'UA 解析', net: false,
    desc: '解析 User-Agent 得到浏览器 / 系统 / 设备信息',
    keywords: 'UA useragent 解析 浏览器 系统 设备 版本',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('User-Agent 解析', 'UA Parser') + '</h3>' +
        '<div class="field"><textarea id="uaIn" class="short" spellcheck="false">' + T.esc(navigator.userAgent) + '</textarea></div>' +
        '<button class="btn btn-primary" id="uaBtn">' + L('解析', 'Parse') + '</button>' +
        '<div id="uaOut" style="margin-top:14px"></div>' +
      '</div>';
      function parse(ua) {
        var r = { browser: '-', version: '-', os: '-', device: '桌面端', engine: '-' };
        var m;
        if ((m = ua.match(/Edg\/([\d.]+)/))) { r.browser = 'Microsoft Edge'; r.version = m[1]; r.engine = 'Blink'; }
        else if ((m = ua.match(/OPR\/([\d.]+)/))) { r.browser = 'Opera'; r.version = m[1]; r.engine = 'Blink'; }
        else if ((m = ua.match(/Chrome\/([\d.]+)/))) { r.browser = 'Chrome'; r.version = m[1]; r.engine = 'Blink'; }
        else if ((m = ua.match(/Firefox\/([\d.]+)/))) { r.browser = 'Firefox'; r.version = m[1]; r.engine = 'Gecko'; }
        else if ((m = ua.match(/Safari\/([\d.]+)/))) { r.browser = 'Safari'; r.version = m[1]; r.engine = 'WebKit'; }
        else if (/MicroMessenger/i.test(ua)) r.browser = '微信内置浏览器';
        else if (/QQ\//i.test(ua)) r.browser = 'QQ 浏览器';

        if (/Windows NT 10\.\d/.test(ua)) r.os = 'Windows 10/11';
        else if (/Windows NT 6\.3/.test(ua)) r.os = 'Windows 8.1';
        else if (/Windows NT 6\.1/.test(ua)) r.os = 'Windows 7';
        else if ((m = ua.match(/Android ([\d.]+)/))) { r.os = 'Android ' + m[1]; r.device = '手机/平板'; }
        else if (/iPhone|iPad|iPod/.test(ua)) {
          r.os = /iPad/.test(ua) ? 'iPadOS' : 'iOS';
          r.device = /iPad/.test(ua) ? '平板' : '手机';
        }
        else if ((m = ua.match(/Mac OS X ([\d_]+)/))) r.os = 'macOS ' + m[1].replace(/_/g, '.');
        else if (/Linux/.test(ua)) r.os = 'Linux';
        else if (/CrOS/.test(ua)) r.os = 'ChromeOS';

        if (/Mobile|Android|iPhone/i.test(ua) && !/iPad/.test(ua)) r.device = /Tablet|iPad/.test(ua) ? '平板' : '手机';
        return r;
      }
      document.getElementById('uaBtn').addEventListener('click', function () {
        var ua = document.getElementById('uaIn').value.trim();
        if (!ua) { T.toast('请输入 UA'); return; }
        var r = parse(ua);
        var h = '<div class="stat-grid">';
        [['浏览器', r.browser + ' ' + r.version], ['操作系统', r.os], ['设备类型', r.device], ['内核', r.engine]].forEach(function (p) {
          h += '<div class="stat-box"><div class="k">' + p[0] + '</div><div class="v" style="font-size:16px">' + T.esc(p[1]) + '</div></div>';
        });
        h += '</div>';
        document.getElementById('uaOut').innerHTML = h;
      });
      document.getElementById('uaBtn').click();
    }
  });

  /* ============ 字体检测 ============ */
  T.register({
    id: 'font-list', icon: '🅰️', cat: 'sys', name: '字体检测', net: false,
    desc: '检测系统已安装的常见中英文字体',
    keywords: '字体 检测 系统字体 中文字体 font 安装',
    render: function (host) {
      var fonts = [
        'Microsoft YaHei', '微软雅黑', 'SimHei', '黑体', 'SimSun', '宋体', 'KaiTi', '楷体', 'FangSong', '仿宋',
        'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', 'Source Han Sans SC', 'HarmonyOS Sans SC', 'MiSans',
        'Arial', 'Arial Black', 'Helvetica', 'Helvetica Neue', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact',
        'Times New Roman', 'Georgia', 'Palatino Linotype', 'Courier New', 'Consolas', 'Cascadia Code', 'Menlo',
        'Monaco', 'Segoe UI', 'Segoe Print', 'Calibri', 'Cambria', 'Comic Sans MS', 'Lucida Console', 'Gill Sans',
        'Optima', 'Bodoni MT', 'Copperplate', 'Papyrus', 'Rockwell', 'Futura', 'Gill Sans MT'
      ];
      host.innerHTML =
      '<div class="panel"><h3>' + L('系统字体检测', 'Font Detection') + '（' + fonts.length + '）</h3>' +
        '<div class="chips" id="flOut"></div>' +
        '<p class="note">使用 Canvas 对比法检测，部分字体名称在不同系统显示效果不同。</p>' +
      '</div>';
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      function check(f) {
        ctx.font = 'bold 24px sans-serif';
        var base = ctx.measureText('中文English0123456789').width;
        ctx.font = 'bold 24px "' + f + '", sans-serif';
        var w = ctx.measureText('中文English0123456789').width;
        return Math.abs(w - base) > 0.5;
      }
      var out = document.getElementById('flOut');
      var ok = [], no = [];
      fonts.forEach(function (f) {
        if (check(f)) ok.push(f); else no.push(f);
      });
      var h = ok.map(function (f) { return '<button class="chip" title="已安装">' + T.esc(f) + '</button>'; }).join('');
      if (no.length) h += '<div style="width:100%;margin-top:6px;font-size:11.5px;color:var(--ink-faint)">未检测到：' + no.map(function (f) { return T.esc(f); }).join('、') + '</div>';
      out.innerHTML = h;
    }
  });

  /* ============ 性能监视器 ============ */
  T.register({
    id: 'perf-monitor', icon: '📉', cat: 'sys', name: '性能监视', net: false,
    desc: '实时 FPS / 内存 / 页面加载性能监控',
    keywords: '性能 监控 fps 内存 帧率 加载 指标 performance',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('实时性能监视', 'Performance') + '</h3>' +
        '<div class="stat-grid" style="margin-bottom:12px">' +
          '<div class="stat-box"><div class="k">当前 FPS</div><div class="v" id="pmFps">-</div></div>' +
          '<div class="stat-box"><div class="k">JS 内存</div><div class="v" id="pmMem">-</div></div>' +
          '<div class="stat-box"><div class="k">DOM 节点</div><div class="v" id="pmDom">-</div></div>' +
          '<div class="stat-box"><div class="k">事件监听</div><div class="v" id="pmEvt">-</div></div>' +
        '</div>' +
        '<div id="pmNav" class="table-wrap" style="margin-top:8px"></div>' +
        '<p class="note">FPS 由 requestAnimationFrame 实测；JS 内存仅 Chrome/Edge 支持（performance.memory）。</p>' +
      '</div>';
      /* 导航计时 */
      var nav = (typeof performance.getEntriesByType === 'function' ? (performance.getEntriesByType('navigation')[0] || {}) : {});
      var timing = performance.timing || {};
      function ms(v) { return (v || 0).toFixed(0) + ' ms'; }
      var resCount = typeof performance.getEntriesByType === 'function' ? performance.getEntriesByType('resource').length : '-';
      var rows = [
        ['DNS 解析', ms(timing.domainLookupEnd - timing.domainLookupStart)],
        ['TCP 连接', ms(timing.connectEnd - timing.connectStart)],
        ['请求耗时', ms(timing.responseEnd - timing.requestStart)],
        ['DOM 构建', ms(timing.domComplete - timing.domInteractive)],
        ['页面加载', ms(timing.loadEventEnd - timing.navigationStart)],
        ['资源请求数', resCount]
      ];
      var h = '<table class="kv"><tr><th>页面加载指标</th><th>数值</th></tr>';
      rows.forEach(function (r) { h += '<tr><td>' + r[0] + '</td><td class="mono">' + r[1] + '</td></tr>'; });
      h += '</table>';
      document.getElementById('pmNav').innerHTML = h;

      var frames = 0, last = performance.now();
      function tick(now) {
        frames++;
        if (now - last >= 1000) {
          var fps = Math.round(frames * 1000 / (now - last));
          document.getElementById('pmFps').textContent = fps;
          frames = 0; last = now;
          if (performance.memory) {
            document.getElementById('pmMem').textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
          } else {
            document.getElementById('pmMem').textContent = '不支持';
          }
          document.getElementById('pmDom').textContent = document.getElementsByTagName('*').length;
          document.getElementById('pmEvt').textContent = (window.__evtCount || 0) + '+';
        }
        raf = requestAnimationFrame(tick);
      }
      var raf = requestAnimationFrame(tick);
      return function () { cancelAnimationFrame(raf); };
    }
  });

  /* ============ 浏览器特性检测 ============ */
  T.register({
    id: 'feature-check', icon: '🔬', cat: 'sys', name: '特性检测', net: false,
    desc: '检测浏览器对 WebGL / PWA / 传感器等能力的支持',
    keywords: '特性 检测 浏览器 caniuse webgl webgpu 支持 pwa 传感器',
    render: function (host) {
      function checkAll() {
        var checks = [
          ['WebGL', !!window.WebGLRenderingContext],
          ['WebGL2', !!window.WebGL2RenderingContext],
          ['WebGPU', !!window.GPU],
          ['WebAssembly', typeof WebAssembly !== 'undefined'],
          ['ServiceWorker', 'serviceWorker' in navigator],
          ['IndexedDB', 'indexedDB' in window],
          ['localStorage', (function () { try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); return true; } catch (e) { return false; } })()],
          ['WebRTC', 'RTCPeerConnection' in window],
          ['Notification', 'Notification' in window],
          ['Clipboard API', navigator.clipboard && !!navigator.clipboard.writeText],
          ['SpeechSynthesis', 'speechSynthesis' in window],
          ['Geolocation', 'geolocation' in navigator],
          ['Battery API', 'getBattery' in navigator],
          ['Vibration', 'vibrate' in navigator],
          ['Fullscreen', document.fullscreenEnabled],
          ['Gamepad', 'getGamepads' in navigator],
          ['Bluetooth', 'bluetooth' in navigator],
          ['USB', 'usb' in navigator],
          ['File System', 'showDirectoryPicker' in window],
          ['OffscreenCanvas', 'OffscreenCanvas' in window],
          ['Canvas', !!document.createElement('canvas').getContext],
          ['WebSocket', 'WebSocket' in window],
          ['BroadcastChannel', 'BroadcastChannel' in window],
          ['Share API', 'share' in navigator],
          ['Touch 触控', 'ontouchstart' in window],
          ['Pointer Events', 'PointerEvent' in window],
          ['IntersectionObserver', 'IntersectionObserver' in window],
          ['ResizeObserver', 'ResizeObserver' in window],
          ['fetch', 'fetch' in window],
          ['AbortController', 'AbortController' in window]
        ];
        return checks;
      }
      host.innerHTML =
      '<div class="panel"><h3>' + L('浏览器特性检测', 'Feature Detect') + '</h3>' +
        '<button class="btn btn-ghost" id="fcBtn">' + L('重新检测', 'Re-detect') + '</button>' +
        '<div id="fcOut" class="nav-grid" style="margin-top:14px"></div>' +
      '</div>';
      function render() {
        var out = document.getElementById('fcOut');
        out.innerHTML = checkAll().map(function (c) {
          return '<div class="link-card" style="cursor:default">' +
            '<span class="lc-logo" style="color:' + (c[1] ? 'var(--ok)' : 'var(--err)') + '">' + (c[1] ? '✓' : '✗') + '</span>' +
            '<span><span class="lc-name">' + c[0] + '</span><br><span class="lc-desc">' + (c[1] ? '支持' : '不支持') + '</span></span></div>';
        }).join('');
      }
      document.getElementById('fcBtn').addEventListener('click', render);
      render();
    }
  });
})();
