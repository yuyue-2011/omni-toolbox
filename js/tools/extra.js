/* ============================================================
   万能工具箱 v2.1 · 扩展工具（为既有板块追加 31 款）
   计算+2 / 文本+2 / 编码+1 / 时间+1 / 随机+1 / 图片+1 / 数据+1 /
   生活+1 / 效率+3（含记事本、密码保险箱）/ 网络+2 / AI+2 / 系统+5 /
   游戏+2 / 搜索+1 / 编程+2 / 视频+1 / 下载+1 / 云盘+1 / GitHub+1
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc, toast = T.toast;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ================= 计算：油耗费用 ================= */
  T.register({
    id: 'calc-fuel', cat: 'calc', icon: '⛽',
    name: '油耗费用', desc: '按里程 / 油耗 / 油价计算出行费用',
    keywords: '油耗 油费 汽车 出行 费用 计算 里程 油价',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>油耗费用计算</h3>' +
        '<div class="field"><label>行驶里程（公里）</label><input id="cfDist" type="number" value="100" min="0"></div>' +
        '<div class="field"><label>百公里油耗（升）</label><input id="cfCons" type="number" value="7.5" min="0" step="0.1"></div>' +
        '<div class="field"><label>油价（元/升）</label><input id="cfPrice" type="number" value="7.9" min="0" step="0.01"></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="cfBtn">计算</button></div></div>' +
        '<div id="cfOut"></div>' +
        '<p class="note">单程费用 = 里程 ÷ 100 × 油耗 × 油价。可自行换算往返费用。</p>' +
      '</div>';
      function run() {
        var d = parseFloat(document.getElementById('cfDist').value);
        var c = parseFloat(document.getElementById('cfCons').value);
        var p = parseFloat(document.getElementById('cfPrice').value);
        var out = document.getElementById('cfOut');
        if (isNaN(d) || isNaN(c) || isNaN(p) || d < 0 || c < 0 || p < 0) { out.innerHTML = '<div class="msg err">请输入有效数字</div>'; return; }
        var one = d / 100 * c * p;
        out.innerHTML = '<div class="stat-grid">' +
          '<div class="stat-box"><div class="k">单程油费</div><div class="v">¥' + one.toFixed(2) + '</div></div>' +
          '<div class="stat-box"><div class="k">往返油费</div><div class="v">¥' + (one * 2).toFixed(2) + '</div></div>' +
          '<div class="stat-box"><div class="k">用油量</div><div class="v">' + (d / 100 * c).toFixed(2) + ' L</div></div>' +
          '</div>' +
          '<p class="note">每公里成本 ¥' + (one / d).toFixed(2) + '（按 ' + d + ' km 计）。</p>';
      }
      document.getElementById('cfBtn').addEventListener('click', run);
      ['cfDist', 'cfCons', 'cfPrice'].forEach(function (id) {
        document.getElementById(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
      });
    }
  });

  /* ================= 计算：复利计算 ================= */
  T.register({
    id: 'calc-interest', cat: 'calc', icon: '💹',
    name: '复利计算', desc: '本金复利与单利对比，算清钱生钱',
    keywords: '复利 单利 利息 理财 投资 收益 计算 本金 年利率',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>复利 / 单利计算</h3>' +
        '<div class="field"><label>本金（元）</label><input id="ciP" type="number" value="10000" min="0"></div>' +
        '<div class="field"><label>年利率（%）</label><input id="ciR" type="number" value="5" min="0" step="0.1"></div>' +
        '<div class="field"><label>年限</label><input id="ciN" type="number" value="10" min="0"></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="ciBtn">计算</button></div></div>' +
        '<div id="ciOut"></div>' +
        '<p class="note">复利按年复投计算；对比单利可直观看到“利滚利”的差距。</p>' +
      '</div>';
      function run() {
        var p = parseFloat(document.getElementById('ciP').value);
        var r = parseFloat(document.getElementById('ciR').value);
        var n = parseFloat(document.getElementById('ciN').value);
        var out = document.getElementById('ciOut');
        if (isNaN(p) || isNaN(r) || isNaN(n) || p < 0 || r < 0 || n < 0) { out.innerHTML = '<div class="msg err">请输入有效数字</div>'; return; }
        var rate = r / 100;
        var compound = p * Math.pow(1 + rate, n);
        var simple = p * (1 + rate * n);
        out.innerHTML = '<div class="stat-grid">' +
          '<div class="stat-box"><div class="k">复利终值</div><div class="v">¥' + compound.toFixed(2) + '</div></div>' +
          '<div class="stat-box"><div class="k">复利收益</div><div class="v">¥' + (compound - p).toFixed(2) + '</div></div>' +
          '<div class="stat-box"><div class="k">单利终值</div><div class="v">¥' + simple.toFixed(2) + '</div></div>' +
          '<div class="stat-box"><div class="k">差额</div><div class="v">¥' + (compound - simple).toFixed(2) + '</div></div>' +
          '</div>' +
          '<p class="note">年化' + r + '% 复投 ' + n + ' 年，资产变为本金的 ' + (compound / p).toFixed(2) + ' 倍。</p>';
      }
      document.getElementById('ciBtn').addEventListener('click', run);
      ['ciP', 'ciR', 'ciN'].forEach(function (id) {
        document.getElementById(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
      });
    }
  });

  /* ================= 文本：行排序去重 ================= */
  T.register({
    id: 'text-sort', cat: 'text', icon: '🔀',
    name: '行排序去重', desc: '多行文本排序、去重、统计',
    keywords: '排序 去重 文本 行 处理 整理 去重工具 列表',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>行排序去重</h3>' +
        '<div class="field"><label>待处理文本（每行一条）</label><textarea id="tsIn" rows="9" placeholder="粘贴多行内容…"></textarea></div>' +
        '<div class="row" style="flex-wrap:wrap;gap:8px">' +
          '<button class="btn btn-primary" id="tsSortA">升序</button>' +
          '<button class="btn" id="tsSortD">降序</button>' +
          '<button class="btn" id="tsDedup">去重</button>' +
          '<button class="btn" id="tsDedupSort">去重+排序</button>' +
          '<button class="btn" id="tsReverse">倒序</button>' +
          '<button class="btn" id="tsShuffle">随机打乱</button>' +
          '<button class="btn" id="tsTrim">清理空行</button>' +
        '</div>' +
        '<div class="field" style="margin-top:10px"><label>结果</label><textarea id="tsOut" rows="9" readonly></textarea></div>' +
        '<div class="row"><button class="btn btn-ghost" id="tsCopy">复制结果</button><span class="muted" id="tsStat" style="margin-left:10px;align-self:center"></span></div>' +
      '</div>';
      function lines() {
        return document.getElementById('tsIn').value.split('\n');
      }
      function out(arr) {
        var o = document.getElementById('tsOut');
        o.value = arr.join('\n');
        document.getElementById('tsStat').textContent = arr.length + ' 行（原文 ' + lines().length + ' 行）';
      }
      function act(fn) { out(fn(lines())); }
      document.getElementById('tsSortA').addEventListener('click', function () { act(function (l) { return l.slice().sort(function (a, b) { return a.localeCompare(b, 'zh'); }); }); });
      document.getElementById('tsSortD').addEventListener('click', function () { act(function (l) { return l.slice().sort(function (a, b) { return b.localeCompare(a, 'zh'); }); }); });
      document.getElementById('tsDedup').addEventListener('click', function () { act(function (l) { var s = {}, r = []; l.forEach(function (x) { if (!s[x]) { s[x] = 1; r.push(x); } }); return r; }); });
      document.getElementById('tsDedupSort').addEventListener('click', function () { act(function (l) { var s = {}, r = []; l.forEach(function (x) { if (!s[x]) { s[x] = 1; r.push(x); } }); return r.sort(function (a, b) { return a.localeCompare(b, 'zh'); }); }); });
      document.getElementById('tsReverse').addEventListener('click', function () { act(function (l) { return l.slice().reverse(); }); });
      document.getElementById('tsShuffle').addEventListener('click', function () { act(function (l) { var a = l.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }); });
      document.getElementById('tsTrim').addEventListener('click', function () { act(function (l) { return l.filter(function (x) { return x.trim() !== ''; }); }); });
      document.getElementById('tsCopy').addEventListener('click', function () { T.copyText(document.getElementById('tsOut').value); });
    }
  });

  /* ================= 文本：批量查找替换 ================= */
  T.register({
    id: 'text-replace', cat: 'text', icon: '🔁',
    name: '批量替换', desc: '文本批量查找替换，支持正则与统计',
    keywords: '替换 查找 批量 文本 正则 处理 工具',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>批量查找替换</h3>' +
        '<div class="field"><label>原文</label><textarea id="trIn" rows="8"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>查找内容</label><input id="trFind" spellcheck="false"></div>' +
        '<div class="field grow"><label>替换为</label><input id="trRep" spellcheck="false"></div></div>' +
        '<div class="row" style="gap:14px"><label class="chk"><input type="checkbox" id="trRe"> 使用正则</label>' +
        '<label class="chk"><input type="checkbox" id="trAll" checked> 全部替换</label></div>' +
        '<div class="row"><button class="btn btn-primary" id="trBtn">替换</button><span class="muted" id="trStat" style="align-self:center;margin-left:10px"></span></div>' +
        '<div class="field" style="margin-top:10px"><label>结果</label><textarea id="trOut" rows="8" readonly></textarea></div>' +
        '<div class="row"><button class="btn btn-ghost" id="trCopy">复制结果</button></div>' +
      '</div>';
      document.getElementById('trBtn').addEventListener('click', function () {
        var src = document.getElementById('trIn').value;
        var find = document.getElementById('trFind').value;
        var rep = document.getElementById('trRep').value;
        var isRe = document.getElementById('trRe').checked;
        var all = document.getElementById('trAll').checked;
        var outEl = document.getElementById('trOut');
        var stat = document.getElementById('trStat');
        var count = 0;
        if (!find) { stat.textContent = '请输入查找内容'; return; }
        try {
          var result;
          if (isRe) {
            var re = new RegExp(find, all ? 'g' : '');
            var match = src.match(new RegExp(find, 'g'));
            count = match ? match.length : 0;
            result = src.replace(re, function () { return rep; });
          } else {
            if (all) {
              var idx = 0, chunks = [];
              while (true) {
                var i = src.indexOf(find, idx);
                if (i < 0) break;
                chunks.push(src.slice(idx, i) + rep);
                idx = i + find.length; count++;
              }
              result = chunks.join('') + src.slice(idx);
            } else {
              var j = src.indexOf(find);
              count = j >= 0 ? 1 : 0;
              result = j >= 0 ? src.slice(0, j) + rep + src.slice(j + find.length) : src;
            }
          }
          outEl.value = result;
          stat.textContent = '已替换 ' + count + ' 处';
        } catch (e) { stat.textContent = '正则错误：' + (e.message || e); }
      });
      document.getElementById('trCopy').addEventListener('click', function () { T.copyText(document.getElementById('trOut').value); });
    }
  });

  /* ================= 编码：凯撒密码 ================= */
  T.register({
    id: 'codec-caesar', cat: 'codec', icon: '🔐',
    name: '凯撒密码', desc: '经典位移加密，本地离线加解密',
    keywords: '凯撒 密码 加密 解密 位移 caesar cipher 古典',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>凯撒密码</h3>' +
        '<p class="note">把字母按位移量移动，例如位移 3：A→D。仅加密英文字母，其他字符保持不变。</p>' +
        '<div class="field"><label>明文 / 密文</label><textarea id="caIn" rows="5" placeholder="输入要加密或解密的内容…"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>位移量（1-25）</label><input id="caShift" type="number" value="3" min="1" max="25"></div></div>' +
        '<div class="row"><button class="btn btn-primary" id="caEnc">加密</button><button class="btn" id="caDec">解密</button><button class="btn btn-ghost" id="caClear">清空</button></div>' +
        '<div class="field" style="margin-top:10px"><label>结果</label><textarea id="caOut" rows="5" readonly></textarea></div>' +
        '<div class="row"><button class="btn btn-ghost" id="caCopy">复制结果</button></div>' +
      '</div>';
      function shift(txt, n) {
        return txt.replace(/[a-zA-Z]/g, function (ch) {
          var base = ch <= 'Z' ? 65 : 97;
          return String.fromCharCode((ch.charCodeAt(0) - base + n + 26) % 26 + base);
        });
      }
      document.getElementById('caEnc').addEventListener('click', function () {
        var n = parseInt(document.getElementById('caShift').value, 10) || 3;
        document.getElementById('caOut').value = shift(document.getElementById('caIn').value, n);
      });
      document.getElementById('caDec').addEventListener('click', function () {
        var n = parseInt(document.getElementById('caShift').value, 10) || 3;
        document.getElementById('caOut').value = shift(document.getElementById('caIn').value, -n);
      });
      document.getElementById('caClear').addEventListener('click', function () { document.getElementById('caIn').value = ''; document.getElementById('caOut').value = ''; });
      document.getElementById('caCopy').addEventListener('click', function () { T.copyText(document.getElementById('caOut').value); });
    }
  });

  /* ================= 时间：节假日速查 ================= */
  T.register({
    id: 'time-holiday', cat: 'time', icon: '🎉',
    name: '节假日速查', desc: '法定节假日与纪念日参考',
    keywords: '节假日 法定 假期 国庆 春节 中秋 纪念日 日历',
    render: function (host) {
      var legal = [
        ['元旦', '1月1日', '放假 1 天'],
        ['春节', '农历正月初一', '放假 3 天（除夕至初六连休）'],
        ['清明节', '4月4-6日', '放假 1 天'],
        ['劳动节', '5月1日', '放假 1 天'],
        ['端午节', '农历五月初五', '放假 1 天'],
        ['中秋节', '农历八月十五', '放假 1 天'],
        ['国庆节', '10月1日', '放假 3 天']
      ];
      var memory = [
        ['10月1日', '国庆节'], ['10月10日', '辛亥革命纪念日'], ['12月13日', '国家公祭日'],
        ['9月30日', '烈士纪念日'], ['9月10日', '教师节'], ['5月12日', '国际护士节'],
        ['8月1日', '建军节'], ['7月1日', '建党节'], ['5月4日', '青年节'],
        ['3月12日', '植树节'], ['5月第二个周日', '母亲节'], ['6月第三个周日', '父亲节'],
        ['10月31日', '万圣节'], ['12月25日', '圣诞节'], ['2月14日', '情人节'],
        ['11月第四个周四', '感恩节'], ['6月1日', '儿童节'], ['4月22日', '世界地球日']
      ];
      var h = '<div class="panel"><h3>法定节假日</h3><div class="table-wrap"><table class="kv"><tr><th>节日</th><th>日期</th><th>说明</th></tr>';
      legal.forEach(function (r) { h += '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; });
      h += '</table></div><p class="note">法定节假日共 11 天；每年具体放假与调休安排由国务院办公厅提前发布，请以官方公告为准。</p></div>';
      h += '<div class="panel"><h3>常见纪念日</h3><div class="table-wrap"><table class="kv"><tr><th>日期</th><th>纪念日</th></tr>';
      memory.forEach(function (r) { h += '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; });
      h += '</table></div></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 随机：选择困难助手 ================= */
  T.register({
    id: 'random-decision', cat: 'random', icon: '🎯',
    name: '选择助手', desc: '选项太多选不出？让随机帮你决定',
    keywords: '选择 困难 随机 决定 纠结 选择器 抽选 decision',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>选择困难症助手</h3>' +
        '<div class="field"><label>输入选项（每行一个，或用逗号分隔）</label><textarea id="rdOpts" rows="6" placeholder="火锅&#10;烧烤&#10;日料"></textarea></div>' +
        '<div class="row"><button class="btn btn-primary" id="rdGo">🎲 帮我决定</button>' +
        '<button class="btn" id="rdFill">填入示例</button></div>' +
        '<div id="rdResult" style="margin-top:14px"></div>' +
      '</div>';
      var timer = null;
      document.getElementById('rdGo').addEventListener('click', function () {
        var txt = document.getElementById('rdOpts').value;
        var opts = txt.split(/[\n,，、;；]+/).map(function (s) { return s.trim(); }).filter(Boolean);
        if (!opts.length) {
          opts = ['火锅', '烧烤', '日料', '麻辣烫', '汉堡', '拉面', '披萨', '轻食'];
          document.getElementById('rdOpts').value = opts.join('\n');
        }
        var el = document.getElementById('rdResult');
        var spins = 0;
        if (timer) clearInterval(timer);
        el.className = 'rd-result';
        timer = setInterval(function () {
          var r = opts[Math.floor(Math.random() * opts.length)];
          el.innerHTML = '<div class="rd-rolling">' + esc(r) + '</div>';
          if (++spins > 18) {
            clearInterval(timer); timer = null;
            el.className = 'rd-result';
            el.innerHTML = '<div class="stat-box" style="margin:auto"><div class="k">就决定是你了</div><div class="v" style="font-size:26px">' + esc(r) + '</div></div>' +
              '<button class="btn btn-ghost" id="rdAgain" style="margin-top:10px">🔁 再试一次</button>';
            var again = document.getElementById('rdAgain');
            if (again) again.addEventListener('click', function () { document.getElementById('rdGo').click(); });
          }
        }, 70);
      });
      document.getElementById('rdFill').addEventListener('click', function () {
        document.getElementById('rdOpts').value = '火锅\n烧烤\n日料\n自助餐\n汉堡\n面馆\n轻食沙拉\n家常菜';
      });
      return function () { if (timer) { clearInterval(timer); timer = null; } };
    }
  });

  /* ================= 图片：主色提取 ================= */
  T.register({
    id: 'image-color', cat: 'image', icon: '🎨',
    name: '图片主色', desc: '提取图片主色调与色板',
    keywords: '主色 提取 配色 色板 图片 颜色 palette 取色',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>图片主色提取</h3>' +
        '<div class="field"><label>选择图片（本地处理，不上传）</label><input type="file" id="icFile" accept="image/*"></div>' +
        '<div id="icOut" style="margin-top:12px"></div>' +
        '<p class="note">在本地将图片缩小后统计主要颜色，隐私安全。</p>' +
      '</div>';
      document.getElementById('icFile').addEventListener('change', function () {
        var f = this.files && this.files[0];
        var out = document.getElementById('icOut');
        if (!f) return;
        var img = new Image();
        img.onload = function () {
          var w = 64, h = Math.max(1, Math.round(img.height * w / img.width));
          var cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          var ctx = cv.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          var data;
          try { data = ctx.getImageData(0, 0, w, h).data; }
          catch (e) { out.innerHTML = '<div class="msg err">无法读取图片像素（跨域或格式受限）</div>'; return; }
          var buckets = {};
          for (var i = 0; i < data.length; i += 4) {
            var r = data[i] >> 4, g = data[i + 1] >> 4, b = data[i + 2] >> 4;
            var key = (r << 8) | (g << 4) | b;
            buckets[key] = (buckets[key] || 0) + 1;
          }
          var arr = Object.keys(buckets).map(function (k) {
            return { k: Number(k), n: buckets[k] };
          }).sort(function (a, b) { return b.n - a.n; }).slice(0, 8);
          var total = w * h;
          var hh = '<div class="swatch-row">';
          arr.forEach(function (o) {
            var r2 = (o.k >> 8 & 15) * 17, g2 = (o.k >> 4 & 15) * 17, b2 = (o.k & 15) * 17;
            var hex = '#' + [r2, g2, b2].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
            hh += '<div class="swatch-box"><span class="swatch" style="background:' + hex + '"></span><span class="mono">' + hex + '</span><span class="muted">' + Math.round(o.n / total * 100) + '%</span></div>';
          });
          hh += '</div><div class="row"><button class="btn btn-ghost" id="icCopy">复制全部色值</button></div>';
          out.innerHTML = hh;
          var cp = document.getElementById('icCopy');
          if (cp) cp.addEventListener('click', function () {
            var hexes = arr.map(function (o) {
              var r3 = (o.k >> 8 & 15) * 17, g3 = (o.k >> 4 & 15) * 17, b3 = (o.k & 15) * 17;
              return '#' + [r3, g3, b3].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
            });
            T.copyText(hexes.join('\n'));
          });
        };
        img.onerror = function () { out.innerHTML = '<div class="msg err">图片加载失败</div>'; };
        img.src = URL.createObjectURL(f);
      });
    }
  });

  /* ================= 数据：CSV 预览 ================= */
  T.register({
    id: 'data-csv', cat: 'data', icon: '🗃️',
    name: 'CSV 预览', desc: '粘贴 CSV 快速预览为表格',
    keywords: 'csv 表格 预览 转换 数据 电子表格 excel 逗号',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>CSV 预览</h3>' +
        '<div class="field"><label>粘贴 CSV 内容（自动识别逗号/分号/Tab）</label><textarea id="dcIn" rows="8" placeholder="姓名,城市,分数&#10;张三,北京,98"></textarea></div>' +
        '<div class="row"><button class="btn btn-primary" id="dcBtn">解析预览</button></div>' +
        '<div id="dcOut" style="margin-top:12px"></div>' +
      '</div>';
      function parseCSV(text) {
        var sep = ',';
        var line = text.split('\n').find(function (l) { return l.trim(); }) || '';
        if (line.indexOf('\t') >= 0 && line.indexOf(',') < 0) sep = '\t';
        else if (line.indexOf(';') >= 0 && line.indexOf(',') < 0) sep = ';';
        var rows = [], row = [], cell = '', inQ = false;
        var src = text;
        for (var i = 0; i < src.length; i++) {
          var ch = src[i];
          if (inQ) {
            if (ch === '"') {
              if (src[i + 1] === '"') { cell += '"'; i++; }
              else inQ = false;
            } else cell += ch;
          } else if (ch === '"') inQ = true;
          else if (ch === sep) { row.push(cell); cell = ''; }
          else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
          else if (ch === '\r') { /* skip */ }
          else cell += ch;
        }
        row.push(cell); rows.push(row);
        return rows.filter(function (r) { return r.some(function (c) { return c.trim() !== ''; }); });
      }
      document.getElementById('dcBtn').addEventListener('click', function () {
        var rows = parseCSV(document.getElementById('dcIn').value);
        var out = document.getElementById('dcOut');
        if (!rows.length) { out.innerHTML = '<div class="msg err">未解析到数据</div>'; return; }
        var cols = Math.max.apply(null, rows.map(function (r) { return r.length; }));
        var h = '<p class="note">共 ' + rows.length + ' 行 × ' + cols + ' 列</p><div class="table-wrap"><div style="overflow:auto;max-height:420px"><table class="kv">';
        rows.forEach(function (r, i) {
          h += '<tr' + (i === 0 ? ' style="background:var(--card-2)"' : '') + '>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
        });
        h += '</table></div></div>';
        out.innerHTML = h;
      });
    }
  });

  /* ================= 生活：礼物灵感 ================= */
  T.register({
    id: 'life-gift', cat: 'life', icon: '🎁',
    name: '礼物灵感', desc: '按对象与预算快速获取送礼建议',
    keywords: '礼物 送礼 送什么 生日 节日 建议 灵感 预算',
    render: function (host) {
      var lib = {
        '父母': { '100': ['保温杯', '按摩捶', '体检套餐', '鲜花', '茶叶'], '300': ['颈部按摩仪', '足浴盆', '羊绒围巾', '血压计', '相册'], '1000': ['按摩椅垫', '金饰', '智能手机', '出境游套餐', '体检贵宾卡'] },
        '恋人': { '100': ['手写信+相册', '香薰蜡烛', '定制钥匙扣', '巧克力礼盒', '星空灯'], '300': ['情侣手表', '香水', '围巾手套', '拍立得', '首饰'], '1000': ['项链戒指', '双人旅行', '轻奢包', '游戏机', '金饰'] },
        '朋友': { '100': ['咖啡杯', '手账本', '文创摆件', '零食大礼包', '书'], '300': ['蓝牙耳机', '机械键盘', '积木', '保温杯礼盒', '桌游'], '1000': ['显示器', '任天堂游戏机', '球鞋', '无人机', '旅行箱'] },
        '同事': { '100': ['绿植盆栽', '马克杯', '办公室靠垫', '零食', '书签'], '300': ['护腰靠垫', '保温壶', '键盘', '眼罩礼盒', '加湿器'], '1000': ['人体工学椅', '机械键盘', '显示器支架', '咖啡机', '购物卡'] },
        '孩子': { '100': ['乐高', '绘本套装', '积木', '文具礼盒', '拼图'], '300': ['平衡车', '科学实验套装', '遥控车', '智能玩具', '儿童相机'], '1000': ['平板电脑', '自行车', '编程机器人', '天文望远镜', '乐园年卡'] }
      };
      var tips = ['提前问清对方最近缺什么，比惊喜更实用', '送体验（旅行/课程/体检）比送实物更难忘', '预算内选品质，不要为面子超支', '手写卡片永远加分', '留意对方收藏夹和购物车', '礼物包装与仪式感同样重要'];
      host.innerHTML =
      '<div class="panel"><h3>礼物灵感生成</h3>' +
        '<div class="row"><div class="field grow"><label>对象</label><select id="lgWho">' +
        Object.keys(lib).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></div>' +
        '<div class="field grow"><label>预算档</label><select id="lgBudget"><option>100</option><option>300</option><option>1000</option></select></div></div>' +
        '<div class="row"><button class="btn btn-primary" id="lgBtn">给我建议</button></div>' +
        '<div id="lgOut" style="margin-top:12px"></div>' +
      '</div>';
      document.getElementById('lgBtn').addEventListener('click', function () {
        var who = document.getElementById('lgWho').value;
        var b = document.getElementById('lgBudget').value;
        var list = (lib[who] && lib[who][b]) || [];
        var h = '<div class="chips">' + list.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div>';
        h += '<p class="note">小贴士：' + tips[Math.floor(Math.random() * tips.length)] + '</p>';
        document.getElementById('lgOut').innerHTML = h;
      });
    }
  });

  /* ================= 效率：邮件模板库 ================= */
  T.register({
    id: 'work-email', cat: 'work', icon: '✉️',
    name: '邮件模板', desc: '职场与生活常用邮件模板即取即用',
    keywords: '邮件 模板 请假 辞职 职场 书信 模板库 email',
    render: function (host) {
      var groups = [
        ['职场', [
          ['请假邮件', '主题：请假申请（姓名-日期）\n\n您好：\n因【原因】，我计划于【日期】请假【天数】天。期间工作已与【同事】交接，如需补充材料请随时告知。\n恳请批准，谢谢！'],
          ['辞职邮件', '主题：离职申请\n\n尊敬的领导：\n经过慎重考虑，我决定辞去【岗位】一职，预计最后工作日为【日期】。感谢公司给予的机会与培养，我会在离职前完成工作交接。祝公司发展顺利！'],
          ['催款邮件', '主题：关于【项目】款项的跟进\n\n您好：\n贵司【项目】的款项（金额【】元）已过约定付款期，麻烦确认一下付款安排。如有任何问题，欢迎随时沟通。谢谢！'],
          ['跟进邮件', '主题：关于【事项】的跟进\n\n您好：\n上次沟通的【事项】进展如何？我们这边已准备就绪，若需要补充信息请告知。期待回复！']
        ]],
        ['生活', [
          ['邀请邮件', '主题：邀请函\n\n亲爱的【名字】：\n诚挚邀请您参加【活动】，时间【日期】，地点【地点】。期待您的到来！'],
          ['致谢邮件', '主题：感谢\n\n亲爱的【名字】：\n非常感谢您的帮助/支持，对我意义重大。祝一切顺利！'],
          ['道歉邮件', '主题：致歉\n\n亲爱的【名字】：\n非常抱歉给您带来不便，原因是【原因】。我已着手处理，并将【补救措施】。请谅解！'],
          ['节日祝福', '主题：节日快乐\n\n亲爱的【名字】：\n值此佳节，祝您【祝福语】！愿【愿望】。期待再次相聚！']
        ]],
        ['学术', [
          ['联系导师', '主题：报考咨询-姓名\n\n尊敬的【老师】：\n您好！我是【学校/专业】的学生【姓名】，对您【方向】的研究非常感兴趣，希望有机会攻读您的硕士/博士。附上简历与成绩单，盼回复。谢谢！'],
          ['会议询问', '主题：会议咨询\n\n您好：\n请问【会议】的投稿截止日期与要求是否有所调整？另请告知注册费用与住宿安排。谢谢！']
        ]]
      ];
      var h = '';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g[0] + '</h3>';
        g[1].forEach(function (t) {
          h += '<div class="tpl-row"><b>' + t[0] + '</b><pre class="out">' + esc(t[1]) + '</pre>' +
            '<button class="btn btn-ghost copy-btn" data-tpl="' + esc(t[1]) + '">' + L('复制', 'Copy') + '</button></div>';
        });
        h += '</div>';
      });
      host.innerHTML = h;
      host.querySelectorAll('[data-tpl]').forEach(function (b) {
        b.addEventListener('click', function () { T.copyText(b.getAttribute('data-tpl')); });
      });
    }
  });

  /* ================= 效率：记事本 ================= */
  T.register({
    id: 'work-note', cat: 'work', icon: '📝',
    name: '记事本', desc: '本地多篇记事本，自动保存',
    keywords: '记事本 笔记 备忘 便签 记录 备忘录 note 写作',
    render: function (host) {
      var KEY = 'notes';
      var notes = T.store.get(KEY, []);
      var cur = null;
      function save() { T.store.set(KEY, notes); }
      function titleOf(n) { return n.title || (n.body ? n.body.replace(/\s+/g, ' ').slice(0, 18) : L('空记事', 'Empty note')); }
      function listHtml() {
        var h = '<div class="notes-bar">';
        h += '<button class="btn btn-primary" id="nnAdd">＋ ' + L('新建记事', 'New note') + '</button>';
        h += '</div>';
        if (!notes.length) h += '<p class="muted" style="margin-top:10px">' + L('还没有记事，点“新建”开始记录。', 'No notes yet — click “New note” to start.') + '</p>';
        if (notes.length) {
          h += '<div class="notes-list">';
          notes.forEach(function (n, i) {
            var d = new Date(n.ts);
            h += '<div class="note-item' + (cur === i ? ' active' : '') + '" data-i="' + i + '">' +
              '<b>' + esc(titleOf(n)) + '</b><span>' + (isEn() ? (d.getMonth() + 1) + '/' + d.getDate() + ' ' : (d.getMonth() + 1) + '月' + d.getDate() + '日 ') + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + '</span></div>';
          });
          h += '</div>';
        }
        return h;
      }
      function editorHtml() {
        var n = notes[cur];
        if (!n) return '<div class="empty"><b>' + L('选择或新建一篇记事', 'Select or create a note') + '</b></div>';
        return '<div class="note-editor"><input id="nnTitle" placeholder="' + L('标题', 'Title') + '" value="' + esc(n.title || '') + '">' +
          '<textarea id="nnBody" rows="14" placeholder="' + L('开始记录…', 'Start typing…') + '">' + esc(n.body || '') + '</textarea>' +
          '<div class="row"><span class="muted" id="nnMeta"></span>' +
          '<span style="flex:1"></span><button class="btn btn-danger" id="nnDel">' + L('删除', 'Delete') + '</button></div></div>';
      }
      function render() {
        var h = '<div class="panel note-app">' + listHtml() + '<div class="note-main">' + editorHtml() + '</div></div>';
        host.innerHTML = h;
        var add = document.getElementById('nnAdd');
        if (add) add.addEventListener('click', function () {
          notes.unshift({ id: 'n' + Date.now(), title: '', body: '', ts: Date.now() });
          cur = 0; save(); render();
          var t = document.getElementById('nnBody'); if (t) t.focus();
        });
        host.querySelectorAll('.note-item').forEach(function (el) {
          el.addEventListener('click', function () {
            cur = Number(el.getAttribute('data-i'));
            render();
          });
        });
        var title = document.getElementById('nnTitle');
        var body = document.getElementById('nnBody');
        var meta = document.getElementById('nnMeta');
        if (meta && notes[cur]) meta.textContent = (isEn() ? 'Saved ' : '保存于 ') + new Date(notes[cur].ts).toLocaleString(isEn() ? 'en-US' : 'zh-CN') + (isEn() ? ' · autosave' : ' · 自动保存');
        function autosave() {
          if (!notes[cur] || !title) return;
          notes[cur].title = title.value;
          notes[cur].body = body ? body.value : '';
          notes[cur].ts = Date.now();
          save();
        }
        if (title) title.addEventListener('input', autosave);
        if (body) body.addEventListener('input', autosave);
        var del = document.getElementById('nnDel');
        if (del) del.addEventListener('click', function () {
          if (confirm(L('删除这篇记事？', 'Delete this note?'))) {
            notes.splice(cur, 1); cur = notes.length ? 0 : null; save(); render();
          }
        });
      }
      render();
    }
  });

  /* ================= 效率：密码保险箱 ================= */
  T.register({
    id: 'work-vault', cat: 'work', icon: '🔒',
    name: '密码保险箱', desc: '本地加密保存账号密码（主密码保护）',
    keywords: '密码 保险箱 保存 账号 管理 加密 vault 密码管理',
    render: function (host) {
      var KEY = 'vault';
      var data = T.store.get(KEY, null);
      function h(s) { var x = 2166136261; for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
      function seed(pw, salt) { return (Math.imul(h('omni' + salt + pw) ^ h(pw + salt + 'box'), 2654435761)) >>> 0; }
      function u8e(s) { try { return unescape(encodeURIComponent(s)); } catch (e) { return s; } }
      function u8d(s) { try { return decodeURIComponent(escape(s)); } catch (e) { return s; } }
      function xenc(plain, s) { var t = u8e(plain), o = ''; for (var i = 0; i < t.length; i++) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; o += String.fromCharCode(t.charCodeAt(i) ^ ((s >>> 24) & 255)); } return o; }
      function xdec(cipher, s) { var o = ''; for (var i = 0; i < cipher.length; i++) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; o += String.fromCharCode(cipher.charCodeAt(i) ^ ((s >>> 24) & 255)); } return u8d(o); }
      function b64(s) { try { return btoa(s); } catch (e) { return ''; } }
      function unb64(s) { try { return atob(s); } catch (e) { return ''; } }

      var master = null;
      var items = [];

      function persist() {
        T.store.set(KEY, { v: 1, salt: data.salt, check: data.check, items: b64(xenc(JSON.stringify(items), seed(master, data.salt))) });
      }
      function setupView(msg) {
        host.innerHTML = '<div class="panel"><h3>' + L('密码保险箱 · 首次设置', 'Password Vault · Setup') + '</h3>' +
          (msg ? '<div class="msg err">' + esc(msg) + '</div>' : '') +
          '<p class="note">' + L('设置一个主密码用于本地加密保护。数据仅保存在本机浏览器中。', 'Set a master password for local encryption. Data stays in your browser only.') + '</p>' +
          '<div class="field"><label>' + L('设置主密码', 'Master password') + '</label><input type="password" id="vvP1" autocomplete="new-password"></div>' +
          '<div class="field"><label>' + L('确认主密码', 'Confirm master password') + '</label><input type="password" id="vvP2" autocomplete="new-password"></div>' +
          '<div class="row"><button class="btn btn-primary" id="vvSet">' + L('创建保险箱', 'Create vault') + '</button></div></div>';
        document.getElementById('vvSet').addEventListener('click', function () {
          var p1 = document.getElementById('vvP1').value;
          var p2 = document.getElementById('vvP2').value;
          if (p1.length < 4) { setupView(L('主密码至少 4 位', 'Master password must be at least 4 chars')); return; }
          if (p1 !== p2) { setupView(L('两次输入不一致', 'Passwords do not match')); return; }
          data = { salt: Math.random().toString(36).slice(2, 10), check: String(h('chk' + p1)) };
          master = p1; items = [];
          persist();
          mainView();
        });
      }
      function unlockView(msg) {
        host.innerHTML = '<div class="panel"><h3>' + L('密码保险箱 · 解锁', 'Password Vault · Unlock') + '</h3>' +
          (msg ? '<div class="msg err">' + esc(msg) + '</div>' : '') +
          '<div class="field"><label>' + L('输入主密码', 'Master password') + '</label><input type="password" id="vuP" autocomplete="current-password"></div>' +
          '<div class="row"><button class="btn btn-primary" id="vuBtn">' + L('解锁', 'Unlock') + '</button>' +
          '<button class="btn btn-ghost" id="vuReset">' + L('忘记密码？重置', 'Forgot? Reset') + '</button></div>' +
          '<p class="note">' + L('忘记主密码将无法恢复数据，可重置后重新开始。', 'If you forget the master password, data cannot be recovered; reset to start over.') + '</p></div>';
        document.getElementById('vuBtn').addEventListener('click', function () {
          var p = document.getElementById('vuP').value;
          if (String(h('chk' + p)) !== data.check) { unlockView(L('主密码错误', 'Wrong master password')); return; }
          master = p;
          try { items = JSON.parse(xdec(unb64(data.items || ''), seed(master, data.salt))); } catch (e) { items = []; }
          mainView();
        });
        document.getElementById('vuReset').addEventListener('click', function () {
          if (confirm(L('重置将删除全部已保存的密码，确定？', 'Reset deletes ALL saved passwords. Continue?'))) {
            T.store.del(KEY); data = null; setupView();
          }
        });
      }
      function mainView() {
        var h = '<div class="panel"><h3>' + L('密码保险箱', 'Password Vault') + ' <span class="badge net">' + L('已解锁', 'Unlocked') + '</span></h3>' +
          '<div class="row" style="margin-bottom:10px"><button class="btn btn-primary" id="vaAdd">＋ ' + L('添加账号', 'Add entry') + '</button>' +
          '<button class="btn btn-ghost" id="vaLock" style="margin-left:auto">' + L('锁定', 'Lock') + '</button></div>';
        if (!items.length) h += '<div class="empty"><b>' + L('还没有保存的账号', 'No saved entries yet') + '</b>' + L('点“添加账号”开始记录', 'Click “Add entry” to start') + '</div>';
        else {
          h += '<div class="vault-list">';
          items.forEach(function (it, i) {
            h += '<div class="vault-item"><div class="vi-top"><b>' + esc(it.site || L('未命名', 'Untitled')) + '</b><span class="muted">' + esc(it.user || '') + '</span>' +
              '<span style="flex:1"></span><button class="btn btn-ghost copy-btn" data-cp="' + esc(it.pass || '') + '" title="' + L('复制密码', 'Copy password') + '">' + L('复制密码', 'Copy pw') + '</button>' +
              '<button class="btn btn-ghost" data-del="' + i + '" title="' + L('删除', 'Delete') + '">🗑</button></div>' +
              '<div class="vi-pass mono" data-pw="' + esc(it.pass || '') + '">••••••••</div>' +
              (it.note ? '<div class="muted">' + esc(it.note) + '</div>' : '') +
              '</div>';
          });
          h += '</div>';
        }
        h += '<p class="note">' + L('数据经主密码派生密钥做本地混淆存储（非强加密），请勿存放银行/支付等高敏感信息。', 'Data is obfuscated locally with a key derived from your master password (not strong encryption). Avoid highly sensitive info.') + '</p></div>';
        host.innerHTML = h;
        document.getElementById('vaAdd').addEventListener('click', function () {
          var site = prompt('网站/应用名称：') || '';
          var user = prompt('用户名/账号：') || '';
          var pass = prompt('密码：') || '';
          var note = prompt('备注（可选）：') || '';
          items.push({ site: site, user: user, pass: pass, note: note });
          persist(); mainView();
        });
        document.getElementById('vaLock').addEventListener('click', function () { master = null; unlockView(); });
        host.querySelectorAll('[data-cp]').forEach(function (b) {
          b.addEventListener('click', function () { T.copyText(b.getAttribute('data-cp')); });
        });
        host.querySelectorAll('[data-del]').forEach(function (b) {
          b.addEventListener('click', function () {
            var i = Number(b.getAttribute('data-del'));
            if (confirm(L('删除该账号？', 'Delete this entry?'))) { items.splice(i, 1); persist(); mainView(); }
          });
        });
        host.querySelectorAll('[data-pw]').forEach(function (el) {
          el.addEventListener('click', function () {
            var vis = el.getAttribute('data-vis') === '1';
            el.textContent = vis ? '••••••••' : el.getAttribute('data-pw');
            el.setAttribute('data-vis', vis ? '0' : '1');
          });
        });
      }
      if (!data) setupView();
      else unlockView();
    }
  });

  /* ================= 网络：子网计算 ================= */
  T.register({
    id: 'net-subnet', cat: 'net', icon: '🕸️',
    name: '子网计算', desc: 'IP / CIDR 子网划分计算',
    keywords: '子网 掩码 CIDR IP 网段 计算 网络 划分 subnet',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>子网计算</h3>' +
        '<div class="row"><div class="field grow"><label>IP 地址</label><input id="nsIp" placeholder="例如 192.168.1.100" spellcheck="false"></div>' +
        '<div class="field grow"><label>CIDR 前缀</label><input id="nsCidr" type="number" value="24" min="0" max="32"></div></div>' +
        '<div class="row"><button class="btn btn-primary" id="nsBtn">计算</button></div>' +
        '<div id="nsOut" style="margin-top:12px"></div>' +
      '</div>';
      document.getElementById('nsBtn').addEventListener('click', function () {
        var ip = document.getElementById('nsIp').value.trim();
        var pre = parseInt(document.getElementById('nsCidr').value, 10);
        var out = document.getElementById('nsOut');
        var parts = ip.split('.').map(Number);
        if (parts.length !== 4 || parts.some(function (p) { return isNaN(p) || p < 0 || p > 255; }) || isNaN(pre) || pre < 0 || pre > 32) {
          out.innerHTML = '<div class="msg err">请输入合法 IP 与 0-32 的前缀</div>'; return;
        }
        var ipn = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
        var mask = pre === 0 ? 0 : (~0 << (32 - pre)) >>> 0;
        var net = (ipn & mask) >>> 0;
        var bcast = (net | (~mask >>> 0)) >>> 0;
        function ipstr(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
        function maskBin(n) {
          var b = '';
          for (var i = 3; i >= 0; i--) b += ((n >>> (i * 8)) & 255).toString(2).padStart(8, '0') + ' ';
          return b.trim();
        }
        var hosts = pre >= 31 ? (pre === 31 ? 2 : 1) : Math.pow(2, 32 - pre) - 2;
        out.innerHTML = '<div class="table-wrap"><table class="kv">' +
          '<tr><th>网络地址</th><td>' + ipstr(net) + '</td></tr>' +
          '<tr><th>广播地址</th><td>' + ipstr(bcast) + '</td></tr>' +
          '<tr><th>可用主机范围</th><td>' + (pre >= 31 ? ipstr(net) + ' / ' + ipstr(bcast) : ipstr((net + 1) >>> 0) + ' – ' + ipstr((bcast - 1) >>> 0)) + '</td></tr>' +
          '<tr><th>可用主机数</th><td>' + hosts + '</td></tr>' +
          '<tr><th>子网掩码</th><td>' + ipstr(mask) + '</td></tr>' +
          '<tr><th>掩码二进制</th><td class="mono" style="font-size:12px">' + maskBin(mask) + '</td></tr>' +
          '</table></div>';
      });
    }
  });

  /* ================= 网络：链接解析 ================= */
  T.register({
    id: 'net-url', cat: 'net', icon: '🔗',
    name: '链接解析', desc: '把任意 URL 拆解为各组成部分',
    keywords: 'url 链接 解析 网址 域名 参数 query 端口 分析',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>链接解析</h3>' +
        '<div class="field"><label>输入链接</label><input id="nuIn" placeholder="https://example.com/path?name=1#top" spellcheck="false"></div>' +
        '<div class="row"><button class="btn btn-primary" id="nuBtn">解析</button></div>' +
        '<div id="nuOut" style="margin-top:12px"></div>' +
      '</div>';
      document.getElementById('nuBtn').addEventListener('click', function () {
        var raw = document.getElementById('nuIn').value.trim();
        var out = document.getElementById('nuOut');
        if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw)) raw = 'http://' + raw;
        try {
          var a = new URL(raw);
          var rows = [
            ['协议', a.protocol.replace(':', '')],
            ['主机名', a.hostname],
            ['端口', a.port || (a.protocol === 'https:' ? '443（默认）' : '80（默认）')],
            ['路径', a.pathname || '/'],
            ['查询参数', a.search || '无'],
            ['锚点', a.hash || '无'],
            ['完整地址', a.href]
          ];
          var h = '<div class="table-wrap"><table class="kv">';
          rows.forEach(function (r) { h += '<tr><th>' + r[0] + '</th><td class="mono" style="word-break:break-all">' + esc(r[1]) + '</td></tr>'; });
          h += '</table></div>';
          if (a.search) {
            var params = [];
            a.searchParams.forEach(function (v, k) { params.push([k, v]); });
            h += '<p class="note">共 ' + params.length + ' 个查询参数</p><div class="table-wrap"><table class="kv">';
            params.forEach(function (p) { h += '<tr><th>' + esc(p[0]) + '</th><td class="mono">' + esc(p[1]) + '</td></tr>'; });
            h += '</table></div>';
          }
          out.innerHTML = h;
        } catch (e) { out.innerHTML = '<div class="msg err">无法解析该链接</div>'; }
      });
      document.getElementById('nuIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('nuBtn').click(); });
    }
  });

  /* ================= AI：标题生成器 ================= */
  T.register({
    id: 'ai-title', cat: 'ai', icon: '💡',
    name: '标题生成', desc: '按主题与风格批量生成标题灵感',
    keywords: '标题 生成 文案 公众号 小红书 标题党 灵感 起名',
    render: function (host) {
      var styles = {
        '数字式': ['{t}的{0}个关键技巧', '关于{t}，你必须知道的{0}件事', '我用{0}分钟搞懂了{t}', '{t}入门：{0}个避坑指南', '90% 的人都忽略的{t}细节'],
        '悬念式': ['为什么懂{t}的人，从不说这三句话？', '{t}背后，藏着哪些你不知道的真相？', '别再乱来了！{t}的正确打开方式', '一个{t}老手的自白', '看完这篇{t}，你会感谢自己'],
        '干货式': ['{t}完全指南（2026 版）', '一文读懂{t}：原理、方法与实践', '{t}实战手册：从零到精通', '关于{t}的最全整理，建议收藏', '{t}避坑清单：新手必看'],
        '对比式': ['{t}选 A 还是 B？看完不再纠结', '普通人与高手玩{t}的区别', '{t}新旧对比：变化有多大？', '{t}三大流派，你站哪边？', '同类{t}横向测评：谁更值得'],
        '口语式': ['救命，{t}也太好用了吧', '姐妹们，{t}真的可以冲', '说真的，{t}没那么难', '后悔没早点学会{t}', '被问了 100 遍的{t}问题，一次说清']
      };
      var fills = [3, 5, 7, 10, 12];
      host.innerHTML =
      '<div class="panel"><h3>标题生成器</h3>' +
        '<div class="field"><label>主题（例如：Excel 技巧）</label><input id="atTopic" placeholder="输入主题关键词…"></div>' +
        '<div class="field"><label>风格</label><select id="atStyle">' +
        Object.keys(styles).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></div>' +
        '<div class="row"><button class="btn btn-primary" id="atBtn">生成 10 个标题</button></div>' +
        '<div id="atOut" style="margin-top:12px"></div>' +
      '</div>';
      document.getElementById('atBtn').addEventListener('click', function () {
        var t = document.getElementById('atTopic').value.trim();
        var st = document.getElementById('atStyle').value;
        var out = document.getElementById('atOut');
        if (!t) { out.innerHTML = '<div class="msg err">请输入主题</div>'; return; }
        var tpls = styles[st] || styles['数字式'];
        var seen = {}, list = [];
        while (list.length < 10) {
          var tpl = tpls[Math.floor(Math.random() * tpls.length)];
          var filled = tpl.split('{0}').join(String(fills[Math.floor(Math.random() * fills.length)])).split('{t}').join(t);
          if (!seen[filled]) { seen[filled] = 1; list.push(filled); }
        }
        out.innerHTML = '<div class="tpl-row"><ul style="line-height:2">' + list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<button class="btn btn-ghost copy-btn" id="atCopy">复制全部</button></div>';
        document.getElementById('atCopy').addEventListener('click', function () { T.copyText(list.join('\n')); });
      });
    }
  });

  /* ================= AI：起名灵感 ================= */
  T.register({
    id: 'ai-name', cat: 'ai', icon: '✨',
    name: '起名灵感', desc: '中文名 / 网名 / 英文名灵感生成',
    keywords: '起名 名字 取名 网名 昵称 英文名 灵感 姓名',
    render: function (host) {
      var zi = ['轩', '宇', '泽', '宸', '晗', '瑞', '铭', '昊', '梓', '萱', '怡', '欣', '瑶', '琪', '诺', '彦', '博', '哲', '涵', '曦', '子', '文', '俊', '雅', '嘉', '诗', '桐', '沐', '阳', '凡'];
      var zi2 = ['安', '乐', '宁', '清', '和', '恒', '知', '行', '初', '澄', '朗', '越', '谦', '润', '泽', '景', '怀', '言', '明', '诚'];
      var netyou = ['猫', '鱼', '风', '云', '星', '月', '林', '川', '野', '鹿', '鲸', '屿', '雾', '海', '糖', '茶', '橙', '桃', '梨', '夏'];
      var netwo = ['不熬夜', '爱睡觉', '摸鱼中', '在线', '很忙', '不吃香菜', '干饭人', '追风少年', '打工魂', '摆烂中', '已躺平', '爱学习', '冲冲冲', '小透明', '大魔王'];
      var en1 = ['Aria', 'Luna', 'Nova', 'Iris', 'Mia', 'Leo', 'Max', 'Noah', 'Eli', 'Finn', 'Skye', 'Zoe', 'Kai', 'Rex', 'Jade', 'Wren', 'Ace', 'Owen', 'Ruby', 'Ivy'];
      var en2 = ['Grace', 'Storm', 'Walker', 'Stone', 'River', 'Blue', 'Fox', 'Wolf', 'Ray', 'Moon', 'Hart', 'Sun', 'Rain', 'Lee'];
      host.innerHTML =
      '<div class="panel"><h3>起名灵感生成</h3>' +
        '<div class="row"><div class="field grow"><label>姓氏（可选）</label><input id="anSurname" placeholder="留空则生成全名" maxlength="1"></div>' +
        '<div class="field grow"><label>类型</label><select id="anType"><option>中文名</option><option>网名</option><option>英文名</option></select></div></div>' +
        '<div class="row"><button class="btn btn-primary" id="anBtn">生成 12 个</button></div>' +
        '<div id="anOut" style="margin-top:12px"></div>' +
      '</div>';
      function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
      document.getElementById('anBtn').addEventListener('click', function () {
        var sur = document.getElementById('anSurname').value.trim();
        var type = document.getElementById('anType').value;
        var out = document.getElementById('anOut');
        var list = [];
        for (var i = 0; i < 12; i++) {
          if (type === '中文名') {
            list.push((sur || '') + pick(zi) + (Math.random() > 0.4 ? pick(zi) : pick(zi2)));
          } else if (type === '网名') {
            list.push(pick(netyou) + pick(netwo) + (Math.random() > 0.5 ? '' + (10 + Math.floor(Math.random() * 90)) : ''));
          } else {
            list.push(pick(en1) + ' ' + pick(en2) + (Math.random() > 0.6 ? '.' + Math.floor(Math.random() * 99) : ''));
          }
        }
        out.innerHTML = '<div class="chips">' + list.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div>' +
          '<div class="row"><button class="btn btn-ghost" id="anCopy">复制全部</button></div>';
        document.getElementById('anCopy').addEventListener('click', function () { T.copyText(list.join('\n')); });
      });
    }
  });

  /* ================= 系统：Windows 命令速查 ================= */
  T.register({
    id: 'sys-win-cmd', cat: 'sys', icon: '🖥️',
    name: 'Windows 命令', desc: 'CMD 与 PowerShell 常用命令速查',
    keywords: 'windows 命令 cmd powershell 系统 终端 速查 常用',
    render: function (host) {
      var groups = [
        ['CMD 常用', [
          ['ipconfig', '查看 IP / 网卡配置'],
          ['ipconfig /flushdns', '刷新 DNS 缓存'],
          ['ping 域名', '测试网络连通与延迟'],
          ['tracert 域名', '追踪路由节点'],
          ['systeminfo', '查看系统完整信息'],
          ['tasklist', '列出进程'],
          ['taskkill /f /im 程序.exe', '强制结束进程'],
          ['sfc /scannow', '修复系统文件'],
          ['cleanmgr', '打开磁盘清理'],
          ['msconfig', '系统配置 / 启动项'],
          ['dxdiag', 'DirectX 诊断（显卡信息）'],
          ['mstsc', '远程桌面连接'],
          ['control', '打开控制面板'],
          ['shutdown /s /t 0', '立即关机'],
          ['shutdown /r /t 0', '立即重启']
        ]],
        ['PowerShell 常用', [
          ['Get-Process', '列出进程'],
          ['Stop-Process -Name 进程', '结束进程'],
          ['Get-Service', '查看服务状态'],
          ['Get-ChildItem', '列出目录内容（ls）'],
          ['Set-Location 路径', '切换目录（cd）'],
          ['Get-NetIPAddress', '查看 IP 地址'],
          ['Test-NetConnection 域名', '测试网络连通性'],
          ['Get-ComputerInfo', '系统完整信息'],
          ['Clear-Host', '清屏（cls）'],
          ['Get-History', '查看命令历史']
        ]]
      ];
      var h = '';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g[0] + '</h3><div class="table-wrap"><table class="kv"><tr><th>命令</th><th>作用</th></tr>';
        g[1].forEach(function (r) { h += '<tr><td><span class="mono">' + esc(r[0]) + '</span></td><td>' + r[1] + '</td></tr>'; });
        h += '</table></div></div>';
      });
      host.innerHTML = h;
    }
  });

  /* ================= 系统：Windows 快捷键 ================= */
  T.register({
    id: 'sys-win-shortcut', cat: 'sys', icon: '⌨️',
    name: 'Win 快捷键', desc: '高频 Win 快捷键速查表',
    keywords: '快捷键 快捷键表 windows 键盘 win 操作 速查',
    render: function (host) {
      var rows = [
        ['Win + E', '打开文件资源管理器'], ['Win + D', '显示桌面 / 恢复窗口'], ['Win + L', '锁定电脑'],
        ['Win + I', '打开设置'], ['Win + A', '操作中心 / 快速设置'], ['Win + S', '搜索'],
        ['Win + V', '剪贴板历史'], ['Win + .', '表情符号面板'], ['Win + P', '投影 / 多屏模式'],
        ['Win + Tab', '任务视图 / 虚拟桌面'], ['Win + Ctrl + ←/→', '切换虚拟桌面'], ['Win + Shift + S', '截图（可框选）'],
        ['Win + PrtScn', '全屏截图自动保存'], ['Win + R', '运行对话框'], ['Win + X', '快速菜单（设备管理/终端等）'],
        ['Win + ↑/↓', '窗口最大化/还原'], ['Win + ←/→', '窗口左右分屏'], ['Alt + Tab', '切换窗口'],
        ['Ctrl + Shift + Esc', '任务管理器'], ['Ctrl + C / V / X / Z', '复制 / 粘贴 / 剪切 / 撤销'],
        ['Alt + F4', '关闭当前窗口'], ['F2', '重命名'], ['F5', '刷新'],
        ['Win + M', '全部窗口最小化'], ['Win + Home', '最小化非活动窗口']
      ];
      var h = '<div class="panel"><h3>Win 快捷键速查</h3><div class="table-wrap"><table class="kv"><tr><th>快捷键</th><th>作用</th></tr>';
      rows.forEach(function (r) { h += '<tr><td><span class="mono">' + r[0] + '</span></td><td>' + r[1] + '</td></tr>'; });
      h += '</table></div><p class="note">适用于 Windows 10 / 11。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 系统：ADB 速查 ================= */
  T.register({
    id: 'sys-android-adb', cat: 'sys', icon: '🤖',
    name: 'ADB 速查', desc: 'Android 调试桥常用命令',
    keywords: 'adb android 调试 命令 刷机 手机 开发者 速查',
    render: function (host) {
      var groups = [
        ['连接与设备', [
          ['adb devices', '列出已连接设备'],
          ['adb connect 192.168.1.10:5555', '无线连接设备'],
          ['adb disconnect', '断开连接'],
          ['adb kill-server / start-server', '重启 ADB 服务']
        ]],
        ['应用管理', [
          ['adb install app.apk', '安装应用'],
          ['adb install -r app.apk', '覆盖安装保留数据'],
          ['adb uninstall 包名', '卸载应用'],
          ['adb shell pm list packages', '列出已装应用包名'],
          ['adb shell pm clear 包名', '清除应用数据']
        ]],
        ['调试与文件', [
          ['adb logcat', '查看实时日志'],
          ['adb logcat -c', '清空日志'],
          ['adb pull /sdcard/x ./x', '从设备拉取文件'],
          ['adb push ./x /sdcard/x', '推送文件到设备'],
          ['adb shell screencap -p /sdcard/s.png', '截图'],
          ['adb exec-out screencap -p > s.png', '截图到电脑（Win 用 cmd）'],
          ['adb shell screenrecord /sdcard/r.mp4', '录屏'],
          ['adb reboot', '重启设备']
        ]],
        ['高级', [
          ['adb shell dumpsys battery', '电池信息'],
          ['adb shell dumpsys package 包名', '应用详情'],
          ['adb shell am start -n 包名/Activity', '启动指定 Activity'],
          ['adb shell settings put global airplane_mode_on 1', '修改系统设置'],
          ['adb reverse tcp:8081 tcp:8081', '端口反向转发（开发调试）']
        ]]
      ];
      var h = '<p class="note">ADB 为 Android 开发者调试工具，需在手机开启“开发者选项 → USB 调试”。</p>';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g[0] + '</h3><div class="table-wrap"><table class="kv"><tr><th>命令</th><th>作用</th></tr>';
        g[1].forEach(function (r) { h += '<tr><td><span class="mono">' + esc(r[0]) + '</span></td><td>' + r[1] + '</td></tr>'; });
        h += '</table></div></div>';
      });
      host.innerHTML = h;
    }
  });

  /* ================= 系统：硬件工具箱导航 ================= */
  T.register({
    id: 'sys-hw-tools', cat: 'sys', icon: '🔧',
    name: '硬件工具箱', desc: '图吧工具箱 / CPU-Z 等检测工具官方导航',
    keywords: '硬件 检测 工具箱 图吧 cpu-z gpu-z hwinfo 温度 配置 官网',
    render: function (host) {
      var tools = [
        { n: '图吧工具箱', u: 'https://www.tbtool.cn', g: 'CN', d: '国产硬件检测合集，集 CPU-Z / GPU-Z / AIDA64 等为一体' },
        { n: 'CPU-Z', u: 'https://www.cpuid.com/softwares/cpu-z.html', g: 'INT', d: 'CPU / 主板 / 内存详细参数检测（官方）' },
        { n: 'GPU-Z', u: 'https://www.techpowerup.com/gpuz/', g: 'INT', d: '显卡参数与传感器监控' },
        { n: 'HWiNFO', u: 'https://www.hwinfo.com', g: 'INT', d: '全硬件深度传感器监测（温度/电压/功耗）' },
        { n: 'AIDA64', u: 'https://www.aida64.com', g: 'INT', d: '整机信息、稳定性测试与压力烤机' },
        { n: 'CrystalDiskInfo', u: 'https://crystalmark.info/en/software/crystaldiskinfo/', g: 'INT', d: '硬盘健康状态（SMART）检测' },
        { n: 'CrystalDiskMark', u: 'https://crystalmark.info/en/software/crystaldiskmark/', g: 'INT', d: '硬盘 / 固态读写速度测试' },
        { n: 'Speccy', u: 'https://www.ccleaner.com/speccy', g: 'INT', d: '一键查看整机配置概览' },
        { n: '鲁大师', u: 'https://www.ludashi.com', g: 'CN', d: '国产整机检测与跑分' },
        { n: '3DMark', u: 'https://www.3dmark.com', g: 'INT', d: '显卡 / 整机游戏性能基准测试' },
        { n: 'AIDA64 (Android)', u: 'https://play.google.com/store/apps/details?id=com.finalwire.aida64', g: 'INT', d: '手机硬件信息检测' },
        { n: 'CPU-Z (Android)', u: 'https://www.cpuid.com/softwares/cpu-z-android.html', g: 'INT', d: '安卓手机 CPU / 传感器检测' },
        { n: 'DevCheck', u: 'https://play.google.com/store/apps/details?id=flar2.devcheck', g: 'INT', d: '安卓硬件与系统实时信息' },
        { n: '安兔兔评测', u: 'https://www.antutu.com', g: 'CN', d: '国产手机跑分与性能排行' }
      ];
      var h = '<div class="panel"><h3>硬件检测工具箱导航</h3>' +
        '<p class="note">Windows 与 Android 平台常用硬件检测工具官网入口，均为官方或知名站点。</p>' +
        '<div class="site-grid">';
      tools.forEach(function (t) {
        h += '<a class="site-card" href="' + t.u + '" target="_blank" rel="noopener noreferrer">' +
          '<b>' + esc(t.n) + ' <span class="badge ' + (t.g === 'CN' ? 'net' : 'off') + '">' + (t.g === 'CN' ? '国内' : '国际') + '</span></b>' +
          '<span>' + esc(t.d) + '</span><i>' + esc(t.u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
      });
      h += '</div></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 系统：Windows 优化清理 ================= */
  T.register({
    id: 'sys-clean', cat: 'sys', icon: '🧹',
    name: '系统清理', desc: 'Windows 优化与清理操作清单',
    keywords: '清理 优化 卡顿 磁盘 垃圾 系统 加速 windows 清理',
    render: function (host) {
      var items = [
        ['磁盘清理', 'Win 搜索“磁盘清理”→ 选择系统盘 → 勾选临时文件 / 回收站 / 更新缓存清理'],
        ['清理临时文件', 'Win + R 输入 %temp% 全选删除；再运行 temp 与 prefetch 目录清理'],
        ['卸载不常用软件', '设置 → 应用 → 按体积排序，卸载大体积且不用的软件'],
        ['禁用开机启动项', '任务管理器 → 启动应用，禁用不必要项（保留输入法/安全软件）'],
        ['关闭休眠文件', '管理员 CMD 运行 powercfg /h off（可释放数 GB，需管理员）'],
        ['存储感知', '设置 → 系统 → 存储 → 开启“存储感知”自动清理临时文件'],
        ['系统更新', '设置 → Windows 更新 → 检查更新并安装（包含安全修复）'],
        ['病毒扫描', 'Windows 安全中心 → 病毒和威胁防护 → 快速扫描'],
        ['清理浏览器缓存', '浏览器设置 → 清除浏览数据（勾选缓存图片与文件）'],
        ['碎片整理', '搜索“碎片整理”→ 选择机械硬盘优化（固态硬盘无需）'],
        ['电源计划', '控制面板 → 电源选项 → 选择“高性能”，笔记本兼顾续航'],
        ['更新驱动', '设备管理器检查带“!”的设备，或用官方驱动工具更新显卡驱动']
      ];
      var done = T.store.get('clean', {});
      var h = '<div class="panel"><h3>Windows 优化与清理清单</h3>' +
        '<p class="note">逐项完成可明显改善卡顿与磁盘占用；已勾选项自动保存。</p>';
      items.forEach(function (it, i) {
        var k = String(i);
        var on = !!done[k];
        h += '<div class="clean-row"><label class="chk"><input type="checkbox" data-i="' + k + '"' + (on ? ' checked' : '') + '> <b>' + it[0] + '</b></label>' +
          '<p class="muted" style="margin:4px 0 10px 26px">' + esc(it[1]) + '</p></div>';
      });
      h += '<div class="row"><button class="btn btn-ghost" id="scReset">重置清单</button></div></div>';
      host.innerHTML = h;
      host.querySelectorAll('input[type=checkbox]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          done[cb.getAttribute('data-i')] = cb.checked;
          T.store.set('clean', done);
        });
      });
      var rs = document.getElementById('scReset');
      if (rs) rs.addEventListener('click', function () { if (confirm('重置清理清单进度？')) { T.store.del('clean'); location.reload(); } });
    }
  });

  /* ================= 游戏：记忆翻牌 ================= */
  T.register({
    id: 'game-memory', cat: 'game', icon: '🃏',
    name: '记忆翻牌', desc: '翻牌配对记忆小游戏',
    keywords: '记忆 翻牌 游戏 配对 记忆训练 卡片 memory',
    render: function (host) {
      var EMO = ['🍎', '🍌', '🍇', '🍓', '🍉', '🍒', '🍑', '🥝'];
      var best = T.store.get('memBest', null);
      host.innerHTML = '<div class="panel"><h3>记忆翻牌</h3>' +
        '<div class="row"><span class="muted" id="gmStat">步数 0</span><span style="flex:1"></span>' +
        (best ? '<span class="muted">最佳 ' + best + ' 步</span>' : '') +
        '<button class="btn btn-ghost" id="gmRestart" style="margin-left:8px">重来</button></div>' +
        '<div class="memory-grid" id="gmGrid"></div></div>';
      var cards = [], opened = [], lock = false, moves = 0, matched = 0;
      function build() {
        var deck = EMO.concat(EMO);
        for (var i = deck.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
        cards = deck; opened = []; lock = false; moves = 0; matched = 0;
        var g = document.getElementById('gmGrid');
        g.innerHTML = deck.map(function (e, i) { return '<div class="mem-card" data-i="' + i + '" data-e="' + e + '"><span class="mc-front"></span><span class="mc-back">' + e + '</span></div>'; }).join('');
        document.getElementById('gmStat').textContent = '步数 0';
        g.querySelectorAll('.mem-card').forEach(function (el) {
          el.addEventListener('click', function () {
            if (lock || el.classList.contains('open') || el.classList.contains('done')) return;
            el.classList.add('open');
            opened.push(el);
            if (opened.length === 2) {
              moves++;
              document.getElementById('gmStat').textContent = '步数 ' + moves;
              var a = opened[0], b = opened[1];
              if (a.getAttribute('data-e') === b.getAttribute('data-e')) {
                a.classList.add('done'); b.classList.add('done'); opened = [];
                if (++matched === EMO.length) {
                  var prev = T.store.get('memBest', null);
                  if (!prev || moves < prev) T.store.set('memBest', moves);
                  toast('🎉 全部配对完成，用了 ' + moves + ' 步！');
                }
              } else {
                lock = true;
                setTimeout(function () { a.classList.remove('open'); b.classList.remove('open'); opened = []; lock = false; }, 700);
              }
            }
          });
        });
      }
      build();
      document.getElementById('gmRestart').addEventListener('click', build);
    }
  });

  /* ================= 游戏：打字测速 ================= */
  T.register({
    id: 'game-type', cat: 'game', icon: '⌨️',
    name: '打字测速', desc: '英文打字速度与准确率测试',
    keywords: '打字 测速 打字游戏 键盘 速度 wpm 练习',
    render: function (host) {
      var TEXT = 'The quick brown fox jumps over the lazy dog. Practice makes perfect, and every minute spent typing brings you closer to mastery. Never give up on the things that matter to you, because great results come from small consistent efforts.';
      host.innerHTML = '<div class="panel"><h3>打字测速</h3>' +
        '<p class="note" id="gtTarget" style="line-height:1.9;font-size:15px"></p>' +
        '<textarea id="gtInput" rows="4" placeholder="在此输入，自动开始计时…" style="margin-top:8px"></textarea>' +
        '<div class="row" style="margin-top:10px"><button class="btn btn-primary" id="gtRestart">重新开始</button>' +
        '<span class="muted" id="gtResult" style="align-self:center;margin-left:12px"></span></div></div>';
      var words = TEXT.split(' ');
      document.getElementById('gtTarget').innerHTML = words.map(function (w, i) { return '<span data-w="' + i + '">' + w + '</span>'; }).join(' ');
      var start = null, finished = false;
      var input = document.getElementById('gtInput');
      input.addEventListener('input', function () {
        if (finished) return;
        var val = input.value;
        if (!start && val) start = Date.now();
        var arr = val.trim().split(/\s+/);
        var ok = 0;
        var spans = document.querySelectorAll('#gtTarget [data-w]');
        for (var i = 0; i < spans.length; i++) {
          var w = arr[i] || '';
          var good = w === words[i];
          if (w) { spans[i].className = good ? 'gt-ok' : 'gt-err'; if (good) ok++; }
          else spans[i].className = '';
        }
        if (arr.length >= words.length && val.trim() === TEXT.trim()) {
          finished = true;
          var sec = Math.max(0.25, (Date.now() - start) / 1000); /* 下限钳制：防粘贴瞬间完成导致 WPM 异常 */
          var wpm = Math.round(words.length / (sec / 60));
          var acc = Math.round(ok / words.length * 100);
          document.getElementById('gtResult').textContent = '完成！速度 ' + wpm + ' WPM · 准确率 ' + acc + '% · 用时 ' + sec.toFixed(1) + ' 秒';
          toast('🎉 ' + wpm + ' WPM');
        }
      });
      document.getElementById('gtRestart').addEventListener('click', function () {
        input.value = ''; start = null; finished = false;
        document.getElementById('gtResult').textContent = '';
        document.querySelectorAll('#gtTarget [data-w]').forEach(function (s) { s.className = ''; });
        input.focus();
      });
    }
  });

  /* ================= 搜索：开发镜像源导航 ================= */
  T.register({
    id: 'search-mirror', cat: 'search', icon: '🌐',
    name: '镜像源导航', desc: 'npm / pip / GitHub 等开发镜像官方入口',
    keywords: '镜像 源 npm pip github 加速 开源 下载 导航 清华 阿里',
    render: function (host) {
      var sites = [
        { n: '清华开源镜像站', u: 'https://mirrors.tuna.tsinghua.edu.cn', d: 'pip / npm / Ubuntu / 各发行版镜像' },
        { n: '阿里云镜像站', u: 'https://developer.aliyun.com/mirror/', d: 'npm / Maven / Docker / 系统镜像' },
        { n: '中科大镜像站', u: 'https://mirrors.ustc.edu.cn', d: 'Linux 发行版与常用软件源' },
        { n: '淘宝 npm 镜像', u: 'https://npmmirror.com', d: 'npm registry 国内加速' },
        { n: '华为云镜像站', u: 'https://mirrors.huaweicloud.com', d: '开发工具与系统镜像' },
        { n: '腾讯软件源', u: 'https://mirrors.cloud.tencent.com', d: '各类开源软件镜像' },
        { n: 'GitHub 仓库下载', u: 'https://github.com', d: '官方仓库（配合加速工具使用）' },
        { n: 'Gitee 码云', u: 'https://gitee.com', d: '国内代码托管平台' },
        { n: 'Maven 中央仓库', u: 'https://repo1.maven.org/maven2/', d: 'Java 依赖官方仓库' },
        { n: 'Docker Hub', u: 'https://hub.docker.com', d: '容器镜像官方仓库' },
        { n: 'PHP Packagist', u: 'https://packagist.org', d: 'Composer 依赖源' },
        { n: 'NuGet', u: 'https://www.nuget.org', d: '.NET 包管理源' }
      ];
      var h = '<div class="panel"><h3>开发镜像源导航</h3><p class="note">国内主流开发镜像与软件源官方入口，提升下载速度。</p><div class="site-grid">';
      sites.forEach(function (s) {
        h += '<a class="site-card" href="' + s.u + '" target="_blank" rel="noopener noreferrer"><b>' + esc(s.n) + '</b><span>' + esc(s.d) + '</span><i>' + esc(s.u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
      });
      h += '</div></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 编程：JS 运行 ================= */
  T.register({
    id: 'code-jsrun', cat: 'code', icon: '🚀',
    name: 'JS 运行', desc: '在线运行 JavaScript 代码片段',
    keywords: 'js javascript 运行 在线 调试 代码 执行 控制台',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>JavaScript 在线运行</h3>' +
        '<div class="field"><label>代码</label><textarea id="jrIn" rows="10" spellcheck="false" placeholder="console.log(&#39;你好&#39;);&#10;const a = 1 + 2; console.log(a);"></textarea></div>' +
        '<div class="row"><button class="btn btn-primary" id="jrRun">▶ 运行</button><button class="btn" id="jrClear">清空</button>' +
        '<span class="muted" style="align-self:center;margin-left:10px">console 输出会显示在下方</span></div>' +
        '<div class="field" style="margin-top:10px"><label>输出</label><pre class="out" id="jrOut" style="min-height:90px"></pre></div>' +
        '<p class="note">⚠️ 代码在本页面上下文执行，仅运行你信任的代码。</p>' +
      '</div>';
      document.getElementById('jrRun').addEventListener('click', function () {
        var code = document.getElementById('jrIn').value;
        var out = document.getElementById('jrOut');
        var logs = [];
        function fakeLog() {
          return function () {
            var parts = [];
            for (var i = 0; i < arguments.length; i++) {
              var a = arguments[i];
              try { parts.push(typeof a === 'object' ? JSON.stringify(a, null, 1) : String(a)); } catch (e) { parts.push(String(a)); }
            }
            logs.push(parts.join(' '));
            out.textContent = logs.join('\n');
          };
        }
        try {
          var fn = new Function('console', 'window', '"use strict";\n' + code);
          fn({ log: fakeLog(), warn: fakeLog(), error: fakeLog(), info: fakeLog() }, window);
          if (!logs.length) logs.push('（无输出）');
          out.textContent = logs.join('\n');
        } catch (e) {
          out.textContent = '❌ ' + (e && e.message ? e.message : String(e));
        }
      });
      document.getElementById('jrClear').addEventListener('click', function () {
        document.getElementById('jrIn').value = '';
        document.getElementById('jrOut').textContent = '';
      });
    }
  });

  /* ================= 编程：颜色转换 ================= */
  T.register({
    id: 'code-color', cat: 'code', icon: '🌈',
    name: '颜色转换', desc: 'HEX / RGB / HSL 颜色互转与预览',
    keywords: '颜色 转换 hex rgb hsl 色值 调色 配色 前端',
    render: function (host) {
      function toHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, hh = 0, s = 0;
        if (max !== min) {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          if (max === r) hh = (g - b) / d + (g < b ? 6 : 0);
          else if (max === g) hh = (b - r) / d + 2;
          else hh = (r - g) / d + 4;
          hh *= 60;
        }
        return [Math.round(hh), Math.round(s * 100), Math.round(l * 100)];
      }
      function parseHex(v) {
        var m = /^#?([0-9a-f]{6})$/i.exec(v.trim());
        if (!m) return null;
        var n = parseInt(m[1], 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      }
      function render() {
        var hex = document.getElementById('ccHex').value;
        var rgb = parseHex(hex);
        if (!rgb) return;
        var hsl = toHsl(rgb[0], rgb[1], rgb[2]);
        document.getElementById('ccR').value = rgb[0];
        document.getElementById('ccG').value = rgb[1];
        document.getElementById('ccB').value = rgb[2];
        document.getElementById('ccH').value = hsl[0];
        document.getElementById('ccS').value = hsl[1];
        document.getElementById('ccL').value = hsl[2];
        var pv = document.getElementById('ccPreview');
        pv.style.background = hex;
        pv.textContent = hex;
      }
      host.innerHTML =
      '<div class="panel"><h3>颜色转换</h3>' +
        '<div class="row"><div class="field grow"><label>HEX</label><input id="ccHex" value="#4FA3FF" spellcheck="false" maxlength="7"></div>' +
        '<div class="field" style="min-width:90px"><label>预览</label><div id="ccPreview" style="height:38px;border-radius:10px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)"></div></div></div>' +
        '<div class="row"><div class="field"><label>R</label><input id="ccR" type="number" min="0" max="255"></div>' +
        '<div class="field"><label>G</label><input id="ccG" type="number" min="0" max="255"></div>' +
        '<div class="field"><label>B</label><input id="ccB" type="number" min="0" max="255"></div></div>' +
        '<div class="row"><div class="field"><label>H</label><input id="ccH" type="number" min="0" max="360"></div>' +
        '<div class="field"><label>S%</label><input id="ccS" type="number" min="0" max="100"></div>' +
        '<div class="field"><label>L%</label><input id="ccL" type="number" min="0" max="100"></div></div>' +
        '<p class="note">修改 HEX 即时同步 RGB 与 HSL；点击预览复制色值。</p>' +
      '</div>';
      document.getElementById('ccHex').addEventListener('input', render);
      render();
      document.getElementById('ccPreview').addEventListener('click', function () { T.copyText(document.getElementById('ccHex').value); });
    }
  });

  /* ================= 视频：视频文件信息 ================= */
  T.register({
    id: 'video-info', cat: 'video', icon: '🎬',
    name: '视频信息', desc: '查看本地视频文件的详细信息',
    keywords: '视频 信息 属性 分辨率 时长 大小 元数据 metadata',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>视频文件信息</h3>' +
        '<div class="field"><label>选择视频文件（本地读取，不上传）</label><input type="file" id="viFile" accept="video/*"></div>' +
        '<div id="viOut" style="margin-top:12px"></div>' +
      '</div>';
      document.getElementById('viFile').addEventListener('change', function () {
        var f = this.files && this.files[0];
        var out = document.getElementById('viOut');
        if (!f) return;
        var v = document.createElement('video');
        v.preload = 'metadata';
        v.src = URL.createObjectURL(f);
        v.onloadedmetadata = function () {
          function mb(b) { return (b / 1048576).toFixed(1) + ' MB'; }
          function dur(s) {
            if (!isFinite(s)) return '未知';
            return Math.floor(s / 3600) + ':' + ('0' + Math.floor(s % 3600 / 60)).slice(-2) + ':' + ('0' + Math.floor(s % 60)).slice(-2);
          }
          var rows = [
            ['文件名', f.name],
            ['大小', mb(f.size)],
            ['时长', dur(v.duration)],
            ['分辨率', (v.videoWidth || '未知') + ' × ' + (v.videoHeight || '未知')],
            ['类型', f.type || '未知']
          ];
          var h = '<div class="table-wrap"><table class="kv">';
          rows.forEach(function (r) { h += '<tr><th>' + r[0] + '</th><td>' + esc(r[1]) + '</td></tr>'; });
          h += '</table></div>';
          out.innerHTML = h;
          URL.revokeObjectURL(v.src);
        };
        v.onerror = function () { out.innerHTML = '<div class="msg err">无法读取该视频元数据（格式可能不受支持）</div>'; };
      });
    }
  });

  /* ================= 下载：下载协议速查 ================= */
  T.register({
    id: 'down-proto', cat: 'down', icon: '📦',
    name: '下载协议', desc: '常见下载协议格式与场景速查',
    keywords: '下载 协议 magnet ed2k thunder bt 磁力 链接 格式 速查',
    render: function (host) {
      var rows = [
        ['HTTP / HTTPS', 'https://example.com/file.zip', '常规网页下载，支持断点续传（服务器支持时）', '浏览器 / 下载器'],
        ['FTP', 'ftp://user:pass@host/file', '文件服务器传输，局域网与旧站点常见', 'FileZilla 等'],
        ['磁力链接', 'magnet:?xt=urn:btih:40位hex', 'BT 去中心化，无中心服务器，需种子索引', 'qBittorrent / 迅雷'],
        ['BT 种子', '文件 .torrent', '包含文件信息与节点，配合 BT 客户端使用', 'qBittorrent / Transmission'],
        ['ed2k', 'ed2k://|file|name|size|hash|/', 'eMule 电驴协议，老资源多', 'eMule / 迅雷'],
        ['迅雷专用链', 'thunder://base64(AA+真实链接+ZZ)', '迅雷私有协议，封装真实链接', '迅雷'],
        ['aria2', 'aria2c -c "url"', '命令行下载神器，支持多线程与断点', 'aria2 / Aria2NG']
      ];
      var h = '<div class="panel"><h3>下载协议速查</h3><div class="table-wrap"><table class="kv"><tr><th>协议</th><th>链接/格式示例</th><th>说明</th><th>常用工具</th></tr>';
      rows.forEach(function (r) {
        h += '<tr><td><b>' + r[0] + '</b></td><td class="mono" style="font-size:12px;word-break:break-all">' + esc(r[1]) + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
      });
      h += '</table></div><p class="note">请遵守相关法律法规，仅下载你有权获取的内容。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 云盘：网盘横评 ================= */
  T.register({
    id: 'cloud-compare', cat: 'cloud', icon: '⚖️',
    name: '网盘横评', desc: '主流网盘容量与特点对比',
    keywords: '网盘 对比 横评 百度 阿里 容量 会员 比较 存储',
    render: function (host) {
      var rows = [
        ['百度网盘', '约 2TB（限时活动）', 'SVIP 约 25 元/月', '资源最多，下载限速明显'],
        ['阿里云盘', '约 100GB', '会员约 18 元/月', '速度快不限速，生态较新'],
        ['夸克网盘', '约 10GB', '会员约 20 元/月', '与夸克浏览器联动，在线播放强'],
        ['腾讯微云', '10GB', '会员约 15 元/月', '与 QQ / 微信联动'],
        ['坚果云', '1GB 起', '专业版约 20 元/月', '增量同步强，适合文档办公'],
        ['OneDrive', '5GB', 'Microsoft 365 含 1TB', '与 Windows / Office 深度整合'],
        ['Google Drive', '15GB', '2TB 约 9.99 美元/月', '国际通用，协作强'],
        ['Dropbox', '2GB', '2TB 约 11.99 美元/月', '老牌同步盘，生态成熟'],
        ['iCloud', '5GB', '2TB 约 68 元/月', '苹果设备全家桶同步']
      ];
      var h = '<div class="panel"><h3>主流网盘横评</h3><div class="table-wrap"><table class="kv"><tr><th>网盘</th><th>免费容量</th><th>会员价格</th><th>特点</th></tr>';
      rows.forEach(function (r) { h += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; });
      h += '</table></div><p class="note">容量与价格随活动变化，请以官网实时信息为准。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= GitHub：最新版本查询 ================= */
  T.register({
    id: 'gh-release', cat: 'github', icon: '🏷️', net: true,
    netNote: '通过 GitHub 官方 API 查询仓库最新 Release，受每小时 60 次限流。',
    name: '最新版本', desc: '查询任意 GitHub 仓库的最新 Release',
    keywords: 'github release 版本 更新 最新 发布 下载 查询',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>GitHub 最新版本查询</h3>' +
        '<div class="row"><div class="field grow"><label>仓库（owner/repo）</label><input id="gr3Input" placeholder="例如：torvalds/linux" spellcheck="false"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="gr3Btn">查询</button></div></div>' +
        '<div id="gr3Out" style="margin-top:12px"></div>' +
        '<p class="note">数据来自 GitHub 公开 API，无 token 每小时限 60 次。</p>' +
      '</div>';
      document.getElementById('gr3Btn').addEventListener('click', function () {
        var raw = document.getElementById('gr3Input').value.trim();
        var out = document.getElementById('gr3Out');
        if (!raw) { toast('请输入 owner/repo'); return; }
        var parts = raw.replace(/^https?:\/\/github\.com\//i, '').split('/');
        if (parts.length < 2) { out.innerHTML = '<div class="msg err">格式应为 owner/repo</div>'; return; }
        out.innerHTML = '<div class="msg">查询中…</div>';
        var repo = encodeURIComponent(parts[0]) + '/' + encodeURIComponent(parts[1].replace(/\.git$/, ''));
        T.getJSON('https://api.github.com/repos/' + repo + '/releases/latest', 10000).then(function (d) {
          var h = '<div class="stat-grid" style="margin-bottom:10px">' +
            '<div class="stat-box"><div class="k">版本</div><div class="v" style="font-size:16px">' + esc(d.tag_name || '-') + '</div></div>' +
            '<div class="stat-box"><div class="k">发布时间</div><div class="v" style="font-size:15px">' + esc((d.published_at || '').slice(0, 10)) + '</div></div>' +
            '</div>';
          if (d.body) h += '<div class="panel" style="background:var(--bg-soft)"><pre class="out" style="white-space:pre-wrap">' + esc(d.body.slice(0, 3000)) + '</pre></div>';
          if (d.assets && d.assets.length) {
            h += '<p class="note">共 ' + d.assets.length + ' 个附件：</p><div class="chips">';
            d.assets.forEach(function (a) {
              h += '<a class="chip" href="' + a.browser_download_url + '" target="_blank" rel="noopener noreferrer">⬇ ' + esc(a.name) + '（' + Math.round(a.size / 1048576) + ' MB）</a>';
            });
            h += '</div>';
          }
          out.innerHTML = h;
        }, function (e) {
          out.innerHTML = '<div class="msg err">' + esc((e && e.message && /404/.test(e.message)) ? '未找到该仓库或没有 Release' : ((e && e.message && /403|rate/i.test(e.message)) ? '请求被限流，请稍后再试' : '请求失败，请检查网络')) + '</div>';
        });
      });
      document.getElementById('gr3Input').addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('gr3Btn').click(); });
    }
  });
})();
