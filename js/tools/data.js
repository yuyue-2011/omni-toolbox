/* ============================================================
   万能工具箱 · 数据类工具（2 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 统计计算 ============ */
  T.register({
    id: 'stats', icon: '📈', cat: 'data', name: '统计计算',
    desc: '均值 / 中位数 / 众数 / 方差 / 标准差',
    keywords: '统计 stats 均值 方差 标准差 中位数',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('统计计算', 'Statistics') + '</h3>' +
        '<div class="field"><textarea id="stIn" placeholder="输入数字，可用空格 / 逗号 / 换行分隔，例如：&#10;85 92 78 90 88" style="min-height:140px"></textarea></div>' +
        '<div class="stat-grid" id="stOut">' +
          '<div class="stat-box"><div class="k">数据个数</div><div class="v" id="stCount">-</div></div>' +
          '<div class="stat-box"><div class="k">总和</div><div class="v" id="stSum">-</div></div>' +
          '<div class="stat-box"><div class="k">平均值</div><div class="v" id="stMean">-</div></div>' +
          '<div class="stat-box"><div class="k">中位数</div><div class="v" id="stMed">-</div></div>' +
          '<div class="stat-box"><div class="k">最小值</div><div class="v" id="stMin">-</div></div>' +
          '<div class="stat-box"><div class="k">最大值</div><div class="v" id="stMax">-</div></div>' +
          '<div class="stat-box"><div class="k">样本标准差</div><div class="v" id="stSd">-</div></div>' +
          '<div class="stat-box"><div class="k">总体标准差</div><div class="v" id="stSdp">-</div></div>' +
        '</div>' +
      '</div>';
      var el = document.getElementById('stIn');
      function calc() {
        var nums = el.value.split(/[\s,，;；\n]+/).map(parseFloat).filter(function (v) { return !isNaN(v); });
        var ids = ['stCount', 'stSum', 'stMean', 'stMed', 'stMin', 'stMax', 'stSd', 'stSdp'];
        if (!nums.length) { ids.forEach(function (id) { document.getElementById(id).textContent = '-'; }); return; }
        var n = nums.length;
        var sum = nums.reduce(function (a, b) { return a + b; }, 0);
        var mean = sum / n;
        var sorted = nums.slice().sort(function (a, b) { return a - b; });
        var med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        var sd = Math.sqrt(nums.reduce(function (a, b) { var d = b - mean; return a + d * d; }, 0) / n);
        var sdp = Math.sqrt(nums.reduce(function (a, b) { var d = b - mean; return a + d * d; }, 0) / (n - 1));
        var f = function (v) { return T.fmtNum(v, 6); };
        document.getElementById('stCount').textContent = n;
        document.getElementById('stSum').textContent = f(sum);
        document.getElementById('stMean').textContent = f(mean);
        document.getElementById('stMed').textContent = f(med);
        document.getElementById('stMin').textContent = f(sorted[0]);
        document.getElementById('stMax').textContent = f(sorted[n - 1]);
        document.getElementById('stSd').textContent = f(sdp);
        document.getElementById('stSdp').textContent = f(sd);
      }
      el.addEventListener('input', calc);
    }
  });

  /* ============ 词频统计 ============ */
  T.register({
    id: 'word-freq', icon: '📶', cat: 'data', name: '词频统计',
    desc: '统计文本中英文单词出现次数排行',
    keywords: '词频 频率 frequency 单词 排行',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('词频统计', 'Word Frequency') + '</h3>' +
        '<div class="field"><textarea id="wfIn" placeholder="粘贴英文文本…" style="min-height:160px"></textarea></div>' +
        '<div class="row">' +
          '<div class="field grow"><label>显示前 N 个</label><select id="wfN"><option>10</option><option selected>20</option><option>50</option></select></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="wfBtn">' + L('统计', 'Analyze') + '</button></div>' +
        '</div>' +
        '<div id="wfOut"></div>' +
      '</div>';
      document.getElementById('wfBtn').addEventListener('click', function () {
        var s = document.getElementById('wfIn').value.toLowerCase();
        var n = parseInt(document.getElementById('wfN').value, 10);
        if (!s.trim()) { T.toast('请输入文本'); return; }
        var words = s.match(/[a-z0-9]+(?:['’-][a-z0-9]+)*/g) || [];
        var map = {};
        words.forEach(function (w) { map[w] = (map[w] || 0) + 1; });
        var arr = Object.keys(map).map(function (k) { return { w: k, c: map[k] }; })
          .sort(function (a, b) { return b.c - a.c || a.w.localeCompare(b.w); })
          .slice(0, n);
        var max = arr.length ? arr[0].c : 1;
        var h = '<div style="display:flex;flex-direction:column;gap:6px;margin-top:14px">';
        arr.forEach(function (item, i) {
          var pct = Math.round(item.c / max * 100);
          h += '<div style="display:flex;align-items:center;gap:10px;font-size:13.5px">' +
            '<span style="width:38px;color:var(--ink-faint);text-align:right;flex:none">' + item.w + '</span>' +
            '<span style="flex:1;height:18px;background:var(--card-2);border-radius:4px;overflow:hidden"><span style="display:block;height:100%;width:' + pct + '%;background:var(--accent);border-radius:4px"></span></span>' +
            '<span style="width:34px;color:var(--ink-dim);font-family:var(--mono)">' + item.c + '</span>' +
          '</div>';
        });
        h += '</div>';
        document.getElementById('wfOut').innerHTML = arr.length ? h : '<div class="empty"><b>未发现英文单词</b></div>';
      });
    }
  });
})();
