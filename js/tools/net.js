/* ============================================================
   万能工具箱 · 网络类工具（8 款：测速/IP/延迟/站点/DNS/代理/状态/端口）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* 异步回调安全守卫：页面已切换（节点被移除）时静默返回 */
  function guard(id) { return !!document.getElementById(id); }

  /* ============ 网速测试 ============ */
  T.register({
    id: 'net-speed', icon: '⚡', cat: 'net', name: '网速测试', net: true,
    netNote: '从 Cloudflare 公共测速端点下载测试文件实测下行速度，同时显示浏览器估算的连接信息；接口不可达时自动提示。',
    desc: '实测下载速度 + 连接信息（RTT / 带宽估计）',
    keywords: '网速 测速 带宽 下载速度 speedtest 网络',
    render: function (host) {
      var aborted = false;
      host.innerHTML =
      '<div class="panel"><h3>' + L('实测下载速度', 'Download Speed Test') + '</h3>' +
        '<div class="row">' +
          '<div class="field"><label>' + L('测试数据量', 'Payload') + '</label><select id="nsSize"><option value="5000000">5 MB</option><option value="10000000" selected>10 MB</option><option value="25000000">25 MB</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="nsBtn">' + L('开始测速', 'Start') + '</button></div>' +
        '</div>' +
        '<div class="progress"><i id="nsBar"></i></div>' +
        '<div id="nsOut" class="stat-grid" style="margin-top:14px">' +
          '<div class="stat-box"><div class="k">' + L('下载速度', 'Speed') + '</div><div class="v" id="nsSpeed">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('传输数据', 'Bytes') + '</div><div class="v" id="nsBytes">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('耗时', 'Time') + '</div><div class="v" id="nsTime">-</div></div>' +
        '</div>' +
        '<div id="nsConn" class="note" style="margin-top:12px"></div>' +
      '</div>';
      var conn = navigator.connection;
      if (conn) {
        var h = (isEn() ? 'Browser connection: ' : '浏览器连接信息：') +
          '<b>' + (isEn() ? 'Type' : '类型') + '</b> ' + (conn.type || conn.effectiveType || (isEn() ? 'unknown' : '未知')) +
          ' · <b>RTT</b> ' + (conn.rtt != null ? conn.rtt + 'ms' : '-') +
          ' · <b>' + (isEn() ? 'Downlink est.' : '下行估算') + '</b> ' + (conn.downlink != null ? conn.downlink + ' Mbps' : '-');
        document.getElementById('nsConn').innerHTML = h;
      } else {
        document.getElementById('nsConn').textContent = L('浏览器未提供连接信息（仅 Chrome/Edge 支持 navigator.connection）。', 'No connection info from browser (navigator.connection is Chrome/Edge only).');
      }
      document.getElementById('nsBtn').addEventListener('click', function () {
        var size = parseInt(document.getElementById('nsSize').value, 10);
        var urls = [
          'https://speed.cloudflare.com/__down?bytes=' + size,
          'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js'
        ];
        var btn = document.getElementById('nsBtn');
        var bar = document.getElementById('nsBar');
        btn.disabled = true;
        btn.textContent = L('测速中…', 'Testing…');
        var t0 = performance.now();
        function tryLoad(i) {
          if (aborted) return Promise.reject(new Error('aborted'));
          if (i >= urls.length) return Promise.reject(new Error('all'));
          return T.getBlob(urls[i], 30000).catch(function () { return tryLoad(i + 1); });
        }
        tryLoad(0).then(function (blob) {
          if (!guard('nsSpeed')) return;
          var dt = (performance.now() - t0) / 1000;
          var mbps = (blob.size * 8 / dt / 1e6);
          document.getElementById('nsSpeed').innerHTML = mbps.toFixed(1) + ' <small>Mbps</small>';
          document.getElementById('nsBytes').innerHTML = (blob.size / 1048576).toFixed(2) + ' <small>MB</small>';
          document.getElementById('nsTime').innerHTML = dt.toFixed(2) + ' <small>' + (isEn() ? 's' : '秒') + '</small>';
          bar.style.width = '100%';
          T.toast(L('测速完成', 'Speed test done'));
        }, function () {
          if (!guard('nsSpeed')) return;
          document.getElementById('nsOut').innerHTML = '<div class="msg err">' + L('测速失败：Cloudflare / jsDelivr 双节点均不可达（请检查网络）', 'Both speed nodes (Cloudflare / jsDelivr) unreachable — check network.') + '</div>';
        }).then(function () {
          if (!guard('nsBtn')) return;
          btn.disabled = false;
          btn.textContent = L('重新测速', 'Retest');
        });
      });
      return function () { aborted = true; };
    }
  });

  /* ============ IP 信息查询 ============ */
  T.register({
    id: 'ip-info', icon: '🛰️', cat: 'net', name: 'IP 信息', net: true,
    netNote: '使用 ipapi.co / ipinfo.io / ip-api.com 免费接口获取公网 IP 与地理位置。',
    desc: '查询公网 IP、归属地、运营商与时区',
    keywords: 'IP 地址 查询 归属地 运营商 定位 geo',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('公网 IP 信息', 'Public IP Info') + '</h3>' +
        '<button class="btn btn-primary" id="ipBtn">' + L('立即查询', 'Look up') + '</button>' +
        '<div id="ipOut" style="margin-top:14px"></div>' +
        '<p class="note">' + L('通过多个免费公开接口获取，仅显示你自己的网络出口信息，不会上传任何数据。', 'Fetched from free public APIs; shows your own egress info and uploads nothing.') + '</p>' +
      '</div>';
      function show() {
        var out = document.getElementById('ipOut');
        if (!out) return;
        out.innerHTML = '<div class="msg">' + L('查询中…', 'Fetching…') + '</div>';
        var api = function (d) {
          return {
            ip: d.ip || d.query || '',
            city: d.city || d.region || d.regionName || d.country_name || d.country || '',
            org: d.org || d.asn || d.as || d.isp || d.organisation || '',
            tz: d.timezone || d.time_zone || '',
            lat: d.latitude != null ? d.latitude : (d.lat != null ? d.lat : ''),
            lon: d.longitude != null ? d.longitude : (d.lon != null ? d.lon : ''),
            ver: d.version || ''
          };
        };
        T.getJSON('https://ipapi.co/json/', 7000).then(api, function () {
          return T.getJSON('https://ipinfo.io/json', 7000).then(api, function () {
            return T.getJSON('https://ip-api.com/json/?lang=zh-CN', 7000).then(function (d) {
              return { ip: d.query, city: d.city + (d.regionName && d.regionName !== d.city ? ' · ' + d.regionName : ''), org: d.isp || '', tz: d.timezone || '', lat: d.lat, lon: d.lon, ver: '' };
            });
          });
        }).then(function (d) {
          var out = document.getElementById('ipOut');
          if (!out) return;
          var rows = [
            ['IP 地址', d.ip], ['归属地', d.city], ['运营商/组织', d.org || '-'],
            ['时区', d.tz || '-'], ['纬度', d.lat === '' ? '-' : d.lat], ['经度', d.lon === '' ? '-' : d.lon]
          ];
          var h = '<div class="table-wrap"><table class="kv">';
          rows.forEach(function (r) {
            h += '<tr><th>' + r[0] + '</th><td><span class="mono">' + T.esc(r[1]) + '</span></td></tr>';
          });
          h += '</table></div>';
          h += '<button class="btn btn-ghost copy-btn" style="margin-top:12px">' + L('复制全部', 'Copy all') + '</button>';
          out.innerHTML = h;
          var cp = out.querySelector('.copy-btn');
          if (cp) cp.addEventListener('click', function () {
            T.copyText(rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n'));
          });
        }, function (e) {
          out.innerHTML = '<div class="msg err">' + L('查询失败：', 'Lookup failed: ') + T.esc(e.message || L('网络不可达', 'Network unreachable')) + '</div>';
        });
      }
      document.getElementById('ipBtn').addEventListener('click', show);
      show();
    }
  });

  /* ============ 延迟检测 ============ */
  T.register({
    id: 'ping-test', icon: '🏓', cat: 'net', name: '延迟检测', net: true,
    netNote: '对常用站点发起带超时的请求测量往返延迟，受本地网络与 CORS 影响。',
    desc: '测量多个常用站点的网络往返延迟',
    keywords: 'ping 延迟 网络延迟 测速 响应时间 latency',
    render: function (host) {
      var sites = [
        ['百度', 'https://www.baidu.com'], ['必应', 'https://www.bing.com'],
        ['GitHub', 'https://github.com'], ['Cloudflare', 'https://www.cloudflare.com'],
        ['淘宝', 'https://www.taobao.com'], ['抖音', 'https://www.douyin.com']
      ];
      host.innerHTML =
      '<div class="panel"><h3>' + L('站点延迟测试', 'Latency Test') + '</h3>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="pgBtn">' + L('开始测试', 'Start') + '</button></div>' +
        '<div class="field grow"><label>&nbsp;</label><span class="note" style="margin:0">每站点最多等待 5 秒</span></div></div>' +
        '<div id="pgOut" style="margin-top:12px"></div>' +
      '</div>';
      function ping(url, name) {
        var t0 = performance.now();
        return T.fetchText(url, 5000).then(function () {
          return Math.round(performance.now() - t0);
        }, function () {
          return -1;
        });
      }
      document.getElementById('pgBtn').addEventListener('click', function () {
        var btn = document.getElementById('pgBtn');
        var out = document.getElementById('pgOut');
        btn.disabled = true;
        out.innerHTML = sites.map(function (s) {
          return '<div class="ping-row"><span class="p-name">' + T.esc(s[0]) + '</span><span class="p-val" data-i="' + s[1] + '">测试中…</span></div>';
        }).join('');
        var ps = sites.map(function (s, i) {
          return ping(s[1]).then(function (ms) {
            var el = out.querySelector('[data-i="' + s[1] + '"]');
            if (el) {
              if (ms < 0) { el.textContent = L('不可达', 'Unreachable'); el.className = 'p-val err'; }
              else { el.textContent = ms + ' ms'; el.className = 'p-val ' + (ms < 150 ? 'ok' : ms < 400 ? 'warn' : 'err'); }
            }
          });
        });
        Promise.all(ps).then(function () {
          btn.disabled = false;
          btn.textContent = L('重新测试', 'Retest');
        });
      });
      document.getElementById('pgBtn').click();
    }
  });

  /* ============ 网站状态检测 ============ */
  T.register({
    id: 'site-check', icon: '🩺', cat: 'net', name: '网站状态', net: true,
    netNote: '对目标网址发起请求检查可访问性；目标站点若禁止跨域可能误报，属浏览器安全机制。',
    desc: '检测网址是否可访问及响应耗时',
    keywords: '网站 状态 检测 可用性 404 存活 在线 uptime',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('网站可用性检测', 'Site Status') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('网址', 'URL') + '</label><input id="scUrl" placeholder="https://example.com" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="scBtn">' + L('检测', 'Check') + '</button></div>' +
        '</div>' +
        '<div id="scOut" style="margin-top:12px"></div>' +
        '<p class="note">返回 HTTP 状态码与耗时。若目标站点设置了跨域限制，会显示“被拦截”，此时不代表站点不可访问（可在浏览器地址栏直接打开验证）。</p>' +
      '</div>';
      document.getElementById('scBtn').addEventListener('click', function () {
        var raw = document.getElementById('scUrl').value.trim();
        if (!raw) { T.toast('请输入网址'); return; }
        var url = /^https?:\/\//i.test(raw) ? raw : 'https://' + raw;
        var out = document.getElementById('scOut');
        out.innerHTML = '<div class="msg">' + L('检测中…', 'Checking…') + '</div>';
        var t0 = performance.now();
        T.getJSON(url, 9000).then(function (d) {
          var ms = Math.round(performance.now() - t0);
          out.innerHTML = '<div class="result-list"><div class="rl ok">✅ 可访问 · HTTP 200 · ' + ms + ' ms</div></div>';
        }, function (e) {
          var ms = Math.round(performance.now() - t0);
          var msg = e.message || '';
          var cls = 'err';
          if (/HTTP 2\d\d/.test(msg)) { msg = '✅ 可访问 · ' + msg + ' · ' + ms + ' ms'; cls = 'ok'; }
          else if (/CORS|Failed to fetch|Load failed|超时|NetworkError|TypeError/.test(msg)) {
            msg = '⚠️ 可能被跨域限制或不可达（' + msg + '）· ' + ms + ' ms';
          }
          out.innerHTML = '<div class="result-list"><div class="rl ' + cls + '">' + T.esc(msg) + '</div></div>';
        });
      });
      document.getElementById('scUrl').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('scBtn').click();
      });
    }
  });

  /* ============ DNS 解析 ============ */
  T.register({
    id: 'dns-lookup', icon: '🔎', cat: 'net', name: 'DNS 解析', net: true,
    netNote: '通过 Google Public DNS over HTTPS 公共接口查询记录。',
    desc: '查询域名的 A / AAAA / MX / CNAME / NS / TXT 记录',
    keywords: 'DNS 域名解析 解析记录 A记录 MX CNAME 查询',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('DNS 记录查询', 'DNS Lookup') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('域名', 'Domain') + '</label><input id="dnDomain" placeholder="example.com" spellcheck="false"></div>' +
          '<div class="field"><label>记录类型</label><select id="dnType">' +
            '<option>A</option><option>AAAA</option><option>MX</option><option>CNAME</option><option>NS</option><option>TXT</option><option>ANY</option>' +
          '</select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="dnBtn">' + L('查询', 'Look up') + '</button></div>' +
        '</div>' +
        '<div id="dnOut" style="margin-top:12px"></div>' +
        '<p class="note">使用公共 DNS over HTTPS 接口，返回结果与本地 DNS 可能不同。</p>' +
      '</div>';
      document.getElementById('dnBtn').addEventListener('click', function () {
        var dom = document.getElementById('dnDomain').value.trim();
        var type = document.getElementById('dnType').value;
        if (!dom) { T.toast('请输入域名'); return; }
        var out = document.getElementById('dnOut');
        out.innerHTML = '<div class="msg">' + L('查询中…', 'Fetching…') + '</div>';
        /* 三源互备：Google DoH（国际）→ 腾讯 DNSPod → 阿里 DoH（国内） */
        var dnQ = 'https://dns.google/resolve?name=' + encodeURIComponent(dom) + '&type=' + type;
        var dnA = 'https://doh.pub/dns-query?name=' + encodeURIComponent(dom) + '&type=' + type;
        var dnB = 'https://dns.alidns.com/resolve?name=' + encodeURIComponent(dom) + '&type=' + type;
        function dnFetch(url) {
          return T.getJSON(url, 7000).then(function (d) {
            if (d && d.Status === 0 && d.Answer && d.Answer.length) return d;
            throw new Error('empty');
          });
        }
        function dnTable(d) {
          var h = '<div class="table-wrap"><table class="kv"><tr><th>类型</th><th>TTL</th><th>数据</th></tr>';
          (d.Answer || []).forEach(function (a) {
            h += '<tr><td>' + T.esc(a.type) + '</td><td class="mono">' + T.esc(a.TTL) + '</td><td><span class="mono">' + T.esc(a.data) + '</span></td></tr>';
          });
          return h + '</table></div>';
        }
        dnFetch(dnQ).catch(function () { return dnFetch(dnA); })
          .catch(function () { return dnFetch(dnB); })
          .then(function (d) { out.innerHTML = dnTable(d); }, function () {
            out.innerHTML = '<div class="msg err">' + L('查询失败：Google / 腾讯 / 阿里三源均无结果', 'No results from Google / Tencent / Alibaba DNS') + '</div>';
          });
      });
      document.getElementById('dnDomain').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('dnBtn').click();
      });
    }
  });

  /* ============ 代理出口检测 ============ */
  T.register({
    id: 'proxy-check', icon: '🎭', cat: 'net', name: '代理出口检测', net: true,
    netNote: '显示当前网络出口的公网 IP、归属地与运营商，帮助确认是否经由代理/中转节点，仅供网络诊断等合法用途。',
    desc: '检测当前出口 IP、归属地、运营商与延迟',
    keywords: '代理 出口 IP 检测 节点 网络诊断 中转',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('当前网络出口信息', 'Exit Info') + '</h3>' +
        '<button class="btn btn-primary" id="pxBtn">重新检测</button>' +
        '<div id="pxOut" class="stat-grid" style="margin-top:14px">' +
          '<div class="stat-box"><div class="k">出口 IP</div><div class="v" id="pxIp">-</div></div>' +
          '<div class="stat-box"><div class="k">归属地</div><div class="v" id="pxGeo">-</div></div>' +
          '<div class="stat-box"><div class="k">运营商/组织</div><div class="v" id="pxOrg">-</div></div>' +
          '<div class="stat-box"><div class="k">延迟</div><div class="v" id="pxMs">-</div></div>' +
        '</div>' +
        '<p class="note">该工具只读取你自己设备的出口网络信息，用于网络诊断、排查代理配置是否生效等合法用途；不提供、不推荐任何代理服务。若当前请求经由代理，此处显示的将是代理节点的出口地址。</p>' +
      '</div>';
      function detect() {
        if (!guard('pxIp')) return;
        document.getElementById('pxIp').textContent = '...';
        var t0 = performance.now();
        T.getJSON('https://ipapi.co/json/', 7000).then(function (d) {
          if (!guard('pxIp')) return;
          document.getElementById('pxIp').textContent = d.ip || '-';
          document.getElementById('pxGeo').textContent = [d.city, d.region, d.country_name].filter(Boolean).join(' · ') || '-';
          document.getElementById('pxOrg').textContent = d.org || '-';
          document.getElementById('pxMs').innerHTML = Math.round(performance.now() - t0) + ' <small>ms</small>';
        }, function () {
          T.getJSON('https://ipinfo.io/json', 7000).then(function (d) {
            if (!guard('pxIp')) return;
            document.getElementById('pxIp').textContent = d.ip || '-';
            document.getElementById('pxGeo').textContent = [d.city, d.region, d.country].filter(Boolean).join(' · ') || '-';
            document.getElementById('pxOrg').textContent = d.org || '-';
            document.getElementById('pxMs').innerHTML = Math.round(performance.now() - t0) + ' <small>ms</small>';
          }, function (e) {
            if (!guard('pxIp')) return;
            document.getElementById('pxIp').textContent = '-';
            document.getElementById('pxGeo').textContent = L('查询失败', 'Lookup failed');
            document.getElementById('pxOrg').textContent = T.esc(e.message || '网络不可达');
          });
        });
      }
      document.getElementById('pxBtn').addEventListener('click', detect);
      detect();
    }
  });

  /* ============ 网络状态 ============ */
  T.register({
    id: 'net-status', icon: '📶', cat: 'net', name: '网络状态', net: true,
    netNote: '读取浏览器 Network Information API 实时显示网络类型与质量，无需上传数据。',
    desc: '实时显示在线状态、网络类型、RTT 与带宽',
    keywords: '网络状态 在线 离线 连接类型 4G wifi 5G rtt',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('实时网络状态', 'Network Status') + '</h3>' +
        '<div id="nsGrid" class="stat-grid">' +
          '<div class="stat-box"><div class="k">在线状态</div><div class="v" id="nstOnline">-</div></div>' +
          '<div class="stat-box"><div class="k">网络类型</div><div class="v" id="nstType">-</div></div>' +
          '<div class="stat-box"><div class="k">有效类型</div><div class="v" id="nstEff">-</div></div>' +
          '<div class="stat-box"><div class="k">RTT</div><div class="v" id="nstRtt">-</div></div>' +
          '<div class="stat-box"><div class="k">下行</div><div class="v" id="nstDown">-</div></div>' +
          '<div class="stat-box"><div class="k">省流量</div><div class="v" id="nstSave">-</div></div>' +
        '</div>' +
        '<p class="note" id="nstNote"></p>' +
      '</div>';
      function upd() {
        var conn = navigator.connection;
        document.getElementById('nstOnline').innerHTML = navigator.onLine ? '<span style="color:var(--ok)">在线</span>' : '<span style="color:var(--err)">离线</span>';
        if (conn) {
          document.getElementById('nstType').textContent = conn.type || '未知';
          document.getElementById('nstEff').textContent = conn.effectiveType || '-';
          document.getElementById('nstRtt').textContent = conn.rtt != null ? conn.rtt + ' ms' : '-';
          document.getElementById('nstDown').textContent = conn.downlink != null ? conn.downlink + ' Mbps' : '-';
          document.getElementById('nstSave').textContent = conn.saveData ? '是' : '否';
          document.getElementById('nstNote').textContent = L('网络参数变化时自动刷新（浏览器会定时更新估算值）。', 'Auto-refreshes on network changes (browser updates estimates periodically).');
        } else {
          document.getElementById('nstType').textContent = L('不支持', 'Unsupported');
          document.getElementById('nstEff').textContent = '-';
          document.getElementById('nstRtt').textContent = '-';
          document.getElementById('nstDown').textContent = '-';
          document.getElementById('nstSave').textContent = '-';
          document.getElementById('nstNote').textContent = L('当前浏览器不支持 Network Information API（推荐 Chrome / Edge）。', 'Network Information API unsupported (Chrome/Edge recommended).');
        }
      }
      upd();
      var conn = navigator.connection;
      if (conn && conn.addEventListener) {
        conn.addEventListener('change', upd);
        return function () { conn.removeEventListener('change', upd); };
      }
    }
  });

  /* ============ 常用端口速查 ============ */
  T.register({
    id: 'port-common', icon: '🔌', cat: 'net', name: '常用端口', net: false,
    desc: '网络服务常用端口速查表',
    keywords: '端口 port 常见 服务 协议 ftp ssh http mysql redis',
    render: function (host) {
      var ports = [
        ['20/21', 'FTP', '文件传输'],
        ['22', 'SSH', '安全远程登录'],
        ['23', 'Telnet', '远程登录（明文，不推荐）'],
        ['25', 'SMTP', '邮件发送'],
        ['53', 'DNS', '域名解析'],
        ['67/68', 'DHCP', '动态主机配置'],
        ['80', 'HTTP', '网页服务'],
        ['110', 'POP3', '邮件接收'],
        ['123', 'NTP', '时间同步'],
        ['143', 'IMAP', '邮件接收（较新）'],
        ['443', 'HTTPS', '加密网页服务'],
        ['445', 'SMB', 'Windows 文件共享'],
        ['873', 'Rsync', '远程同步'],
        ['1080', 'SOCKS', '代理协议'],
        ['1433', 'MSSQL', 'SQL Server 数据库'],
        ['1521', 'Oracle', 'Oracle 数据库'],
        ['3306', 'MySQL', 'MySQL 数据库'],
        ['3389', 'RDP', 'Windows 远程桌面'],
        ['5432', 'PostgreSQL', 'PostgreSQL 数据库'],
        ['5672', 'AMQP', 'RabbitMQ 消息队列'],
        ['6379', 'Redis', 'Redis 缓存'],
        ['8080', 'HTTP-Alt', '常用 HTTP 备用端口'],
        ['8443', 'HTTPS-Alt', '常用 HTTPS 备用端口'],
        ['9000', 'PHP-FPM', 'PHP 进程管理器'],
        ['9200', 'Elasticsearch', 'ES 搜索服务'],
        ['27017', 'MongoDB', 'MongoDB 数据库']
      ];
      var h = '<div class="panel"><h3>' + L('常用端口速查', 'Common Ports') + '（' + ports.length + '）</h3>';
      h += '<div class="table-wrap"><table class="kv"><tr><th>端口</th><th>服务</th><th>说明</th></tr>';
      ports.forEach(function (p) {
        h += '<tr><td class="mono">' + p[0] + '</td><td>' + p[1] + '</td><td>' + p[2] + '</td></tr>';
      });
      h += '</table></div></div>';
      host.innerHTML = h;
    }
  });
})();
