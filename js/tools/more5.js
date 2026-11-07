/* ============================================================
   万能工具箱 v2.9 · 时间 / 随机 / 代码类增强（8 款）
   时间戳 / 倒计时 / 番茄钟 / 抽签 / UUID / 密码 / Cron / SQL
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }

  
  /* ============ 纪念日倒计时 ============ */
  T.register({
    id: 'countdown-day', cat: 'time', icon: '⏳',
    name: '纪念日倒计时',
    desc: '倒数/正数某个日期与今天的天数',
    keywords: '纪念日 倒计时 天数 countdown 日期',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('纪念日倒计时', 'Countdown Days') + '</h3>' +
        '<div class="row">' +
        '<div class="field grow"><label>' + L('目标日期', 'Target date') + '</label><input id="cdDate" type="date"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="cdBtn">' + L('计算', 'Calculate') + '</button></div></div>' +
        '<div id="cdOut"></div>' +
      '</div>';
      $('cdBtn').addEventListener('click', function () {
        var v = $('cdDate').value;
        if (!v) { out('cdOut', '<div class="empty"><b>' + L('请选择日期', 'Pick a date') + '</b></div>'); return; }
        var target = new Date(v + 'T00:00:00');
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var diff = Math.round((target - today) / 86400000);
        var abs = Math.abs(diff);
        var label = diff > 0 ? L('距离', 'Days until') : L('已过', 'Days since');
        var title = diff > 0 ? L('还有', 'remaining') : L('已经过去', 'passed');
        out('cdOut',
          '<div class="stat-grid" style="margin-top:12px">' +
            '<div class="stat-box"><span class="stat-num">' + abs + '</span><span class="stat-label">' + L('天', 'days') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + Math.floor(abs / 7) + '</span><span class="stat-label">' + L('周', 'weeks') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + (abs * 24) + '</span><span class="speed-stat-label">' + L('小时', 'hours') + '</span></div>' +
          '</div>' +
          '<p class="note" style="margin-top:10px">' + label + ' ' + esc(v) + ' ' + title + ' ' + abs + ' ' + L('天', 'days') + '。</p>'
        );
      });
    }
  });

  /* ============ 抽签 / 抽人 ============ */
  T.register({
    id: 'draw-lots', cat: 'random', icon: '🧧',
    name: '抽签抽人',
    desc: '从名单中随机抽取 N 个不重复结果',
    keywords: '抽签 抽人 随机 抽奖 名单',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('抽签 / 抽人', 'Draw Lots') + '</h3>' +
        '<div class="field"><label>' + L('名单（每行一个）', 'Names (one per line)') + '</label><textarea id="dlIn" placeholder="张三&#10;李四&#10;王五" style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>' + L('抽取个数', 'Pick count') + '</label><input id="dlN" type="number" value="1" min="1" style="width:80px"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="dlBtn">' + L('开始抽取', 'Draw') + '</button></div></div>' +
        '<div id="dlOut"></div>' +
      '</div>';
      $('dlBtn').addEventListener('click', function () {
        var arr = $('dlIn').value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
        if (arr.length < 2) { out('dlOut', '<div class="empty"><b>' + L('请至少输入两个选项', 'Enter at least 2 options') + '</b></div>'); return; }
        var n = parseInt($('dlN').value, 10);
        if (isNaN(n) || n < 1) n = 1;
        if (n > arr.length) n = arr.length;
        var pool = arr.slice(), res = [];
        for (var i = 0; i < n; i++) {
          var idx = Math.floor(Math.random() * pool.length);
          res.push(pool[idx]);
          pool.splice(idx, 1);
        }
        out('dlOut',
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">' +
          res.map(function (r) {
            return '<div class="chip" style="font-size:16px;padding:10px 16px;background:var(--ac-grad);color:#fff">' + esc(r) + '</div>';
          }).join('') + '</div>');
      });
    }
  });

  /* ============ UUID 生成 ============ */
  T.register({
    id: 'uuid-gen', cat: 'code', icon: '🆔',
    name: 'UUID 生成',
    desc: '批量生成 UUID v4，一键复制',
    keywords: 'uuid guid 生成 唯一 标识',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('UUID 生成器', 'UUID Generator') + '</h3>' +
        '<div class="row">' +
        '<div class="field"><label>' + L('个数', 'Count') + '</label><input id="ugN" type="number" value="5" min="1" max="500" style="width:80px"></div>' +
        '<div class="field"><label>' + L('大写', 'Uppercase') + '</label><input id="ugUp" type="checkbox"></div>' +
        '<div class="field"><label>' + L('带花括号', 'Braces') + '</label><input id="ugBr" type="checkbox"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="ugBtn">' + L('生成', 'Generate') + '</button></div></div>' +
        '<div class="field"><label>' + L('结果', 'Result') + '</label><textarea id="ugOut" style="min-height:130px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="ugCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
      '</div>';
      function uuid() {
        if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
        var d = Date.now();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      }
      $('ugBtn').addEventListener('click', function () {
        var n = parseInt($('ugN').value, 10);
        if (isNaN(n) || n < 1) n = 1;
        if (n > 500) n = 500;
        var up = $('ugUp').checked, br = $('ugBr').checked;
        var arr = [];
        for (var i = 0; i < n; i++) {
          var u = uuid();
          if (up) u = u.toUpperCase();
          if (br) u = '{' + u + '}';
          arr.push(u);
        }
        $('ugOut').value = arr.join('\n');
      });
      $('ugCopy').addEventListener('click', function () { T.copyText($('ugOut').value); });
    }
  });

  
  /* ============ Cron 表达式生成 ============ */
  T.register({
    id: 'cron-gen', cat: 'code', icon: '⏰',
    name: 'Cron 表达式',
    desc: '常用周期表达式生成与中文解释',
    keywords: 'cron 定时 任务 表达式 crontab',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Cron 表达式生成器', 'Cron Expression Builder') + '</h3>' +
        '<div class="field"><label>' + L('常用周期', 'Common patterns') + '</label><select id="cgPresets">' +
        '<option value="* * * * *">' + L('每分钟', 'Every minute') + '</option>' +
        '<option value="0 * * * *">' + L('每小时的整点', 'Every hour') + '</option>' +
        '<option value="0 0 * * *">' + L('每天 0 点', 'Daily at 00:00') + '</option>' +
        '<option value="0 0 * * 1">' + L('每周一 0 点', 'Weekly Monday 00:00') + '</option>' +
        '<option value="0 0 1 * *">' + L('每月 1 号 0 点', 'Monthly 1st 00:00') + '</option>' +
        '<option value="0 0 1 1 *">' + L('每年 1 月 1 日', 'Yearly Jan 1st') + '</option>' +
        '<option value="*/5 * * * *">' + L('每 5 分钟', 'Every 5 minutes') + '</option>' +
        '<option value="0 9 * * 1-5">' + L('工作日 9 点', 'Weekdays at 9:00') + '</option>' +
        '</select></div>' +
        '<div class="row">' +
        '<div class="field grow"><label>' + L('表达式', 'Expression') + '</label><input id="cgIn" value="0 0 * * *"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="cgBtn">' + L('解释', 'Explain') + '</button></div></div>' +
        '<div id="cgOut"></div>' +
        '<div class="field"><label>' + L('分段自定义', 'Custom fields') + '</label><div class="row" style="gap:6px">' +
        '<input id="cgM" placeholder="' + L('分', 'Min') + '" style="width:52px" value="0">' +
        '<input id="cgH" placeholder="' + L('时', 'Hour') + '" style="width:52px" value="0">' +
        '<input id="cgD" placeholder="' + L('日', 'Day') + '" style="width:52px" value="*">' +
        '<input id="cgMo" placeholder="' + L('月', 'Month') + '" style="width:52px" value="*">' +
        '<input id="cgW" placeholder="' + L('周', 'Week') + '" style="width:52px" value="*"></div></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="cgBuild">' + L('拼接表达式', 'Build') + '</button></div></div>' +
      '</div>';
      function explain(exp) {
        var parts = exp.trim().split(/\s+/);
        if (parts.length !== 5) return L('需要 5 段：分 时 日 月 周', 'Need 5 fields: min hour day month weekday');
        var f = parts.map(function (p) {
          if (p === '*') return L('任意', 'any');
          if (/^\*\/(\d+)$/.test(p)) return L('每 ', 'Every ') + RegExp.$1 + L(' 个单位', ' units');
          if (/^\d+$/.test(p)) return p;
          if (/^\d+-\d+$/.test(p)) return p + L(' 范围', ' range');
          return p;
        });
        return L('分:', 'Min: ') + f[0] + ' · ' + L('时:', 'Hour: ') + f[1] + ' · ' + L('日:', 'Day: ') + f[2] + ' · ' + L('月:', 'Month: ') + f[1 + 1] + ' · ' + L('周:', 'Week: ') + f[4];
      }
      $('cgPresets').addEventListener('change', function () { $('cgIn').value = $('cgPresets').value; });
      $('cgBtn').addEventListener('click', function () {
        out('cgOut', '<div class="diff-box" style="margin-top:10px">' + esc(explain($('cgIn').value)) + '</div>');
      });
      $('cgBuild').addEventListener('click', function () {
        $('cgIn').value = [$('cgM').value, $('cgH').value, $('cgD').value, $('cgMo').value, $('cgW').value].join(' ');
        out('cgOut', '<div class="diff-box" style="margin-top:10px">' + esc(explain($('cgIn').value)) + '</div>');
      });
    }
  });

  /* ============ SQL 格式化 ============ */
  T.register({
    id: 'sql-fmt', cat: 'code', icon: '🗄️',
    name: 'SQL 格式化',
    desc: '关键字大写与缩进排版',
    keywords: 'sql 格式化 排版 关键字 大写',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('SQL 格式化', 'SQL Formatter') + '</h3>' +
        '<div class="field"><label>' + L('输入 SQL', 'Enter SQL') + '</label><textarea id="sfIn" placeholder="select id,name from users where age > 18 order by id" style="min-height:110px"></textarea></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="sfBtn">' + L('格式化', 'Format') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="sfUp">' + L('仅大写', 'Uppercase only') + '</button></div></div>' +
        '<div class="field"><label>' + L('结果', 'Result') + '</label><textarea id="sfOut" style="min-height:110px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="sfCopy">' + L('复制结果', 'Copy result') + '</button></div></div>' +
      '</div>';
      var KW = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'LIMIT', 'OFFSET', 'UNION', 'CREATE TABLE', 'PRIMARY KEY', 'DISTINCT'];
      function fmt(sql, upper) {
        var s = ' ' + sql.replace(/\s+/g, ' ').trim() + ' ';
        KW.forEach(function (k) {
          var re = new RegExp('\\s' + k.replace(/ /g, '\\s+') + '\\s', 'gi');
          s = s.replace(re, ' ' + k + ' ');
        });
        s = s.replace(/\s+/g, ' ').trim();
        if (!upper) {
          /* 简单缩进排版 */
          s = s.replace(/ (SELECT|VALUES|SET|ON|AND|OR|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|UNION|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN) /gi, '\n$1 ');
          s = s.replace(/^SELECT /, 'SELECT ');
        }
        return s;
      }
      $('sfBtn').addEventListener('click', function () { $('sfOut').value = fmt($('sfIn').value, false); });
      $('sfUp').addEventListener('click', function () { $('sfOut').value = fmt($('sfIn').value, true); });
      $('sfCopy').addEventListener('click', function () { T.copyText($('sfOut').value); });
    }
  });
})();
