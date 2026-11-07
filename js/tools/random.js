/* ============================================================
   万能工具箱 · 随机类工具（4 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 随机数生成 ============ */
  T.register({
    id: 'random-num', icon: '🎰', cat: 'random', name: '随机数生成',
    desc: '指定范围与数量的随机数（支持不重复）',
    keywords: '随机数 random number 随机 范围',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('随机数生成', 'Random Numbers') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('最小值', 'Min') + '</label><input id="rnMin" inputmode="numeric" value="1"></div>' +
          '<div class="field grow"><label>' + L('最大值', 'Max') + '</label><input id="rnMax" inputmode="numeric" value="100"></div>' +
          '<div class="field grow"><label>' + L('数量', 'Count') + '</label><input id="rnN" inputmode="numeric" value="1"></div>' +
        '</div>' +
        '<label class="field" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="rnUnique" checked style="accent-color:var(--accent)"> ' + L('生成结果不重复', 'No duplicates') + '</label>' +
        '<button class="btn btn-primary" id="rnBtn">' + L('生成', 'Generate') + '</button>' +
        '<div class="chips" id="rnOut" style="margin-top:16px"></div>' +
      '</div>';
      document.getElementById('rnBtn').addEventListener('click', function () {
        var min = parseInt(document.getElementById('rnMin').value, 10);
        var max = parseInt(document.getElementById('rnMax').value, 10);
        var n = parseInt(document.getElementById('rnN').value, 10);
        if (isNaN(min) || isNaN(max) || isNaN(n) || min > max || n < 1) { T.toast(L('请填写有效范围与数量', 'Enter a valid range & count')); return; }
        var unique = document.getElementById('rnUnique').checked;
        if (unique && n > max - min + 1) { T.toast(L('范围内数值不足，无法生成不重复结果', 'Not enough values in range for unique results')); return; }
        var out = [];
        if (unique) {
          var pool = [];
          for (var i = min; i <= max; i++) pool.push(i);
          while (out.length < n) {
            var idx = Math.floor(Math.random() * pool.length);
            out.push(pool[idx]);
            pool.splice(idx, 1);
          }
        } else {
          for (var k = 0; k < n; k++) out.push(min + Math.floor(Math.random() * (max - min + 1)));
        }
        var box = document.getElementById('rnOut');
        box.innerHTML = out.map(function (v) { return '<span class="chip">' + v + '</span>'; }).join('');
      });
    }
  });

  /* ============ 抽签抽奖 ============ */
  T.register({
    id: 'lucky-draw', icon: '🍀', cat: 'random', name: '抽签抽奖',
    desc: '从名单中随机抽取，支持抽取多个',
    keywords: '抽签 抽奖 lucky draw 抽取 名单',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('抽签抽奖', 'Lucky Draw') + '</h3>' +
        '<div class="field"><label>' + L('候选名单（每行一个）', 'Candidates (one per line)') + '</label><textarea id="ldNames" placeholder="' + L('张三&#10;李四&#10;王五…', 'Alice&#10;Bob&#10;Carol…') + '" style="min-height:150px"></textarea></div>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('抽取人数', 'Pick count') + '</label><input id="ldN" inputmode="numeric" value="1"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="ldBtn">' + L('开始抽取', 'Draw') + '</button></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="ldReset">' + L('重置已抽', 'Reset') + '</button></div>' +
        '</div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('抽取结果', 'Result') + '</label><div class="chips" id="ldOut" style="flex-direction:column;align-items:stretch"></div></div>' +
        '<p class="muted" id="ldInfo">' + L('已抽 0 人', 'Drawn: 0') + '</p>' +
      '</div>';
      var used = [];
      function names() {
        return document.getElementById('ldNames').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      }
      function refreshInfo() {
        document.getElementById('ldInfo').textContent = '名单共 ' + names().length + ' 人，已抽 ' + used.length + ' 人' + (used.length ? '：' + used.join('、') : '');
      }
      document.getElementById('ldBtn').addEventListener('click', function () {
        var list = names();
        var n = parseInt(document.getElementById('ldN').value, 10);
        if (!list.length) { T.toast(L('请先填写名单', 'Fill in the candidate list first')); return; }
        if (isNaN(n) || n < 1) { T.toast(L('请填写抽取人数', 'Enter how many to pick')); return; }
        var avail = list.filter(function (x) { return used.indexOf(x) < 0; });
        if (!avail.length) { T.toast(L('名单已全部抽完', 'All candidates drawn')); return; }
        if (n > avail.length) n = avail.length;
        /* 滚动动画 */
        var box = document.getElementById('ldOut');
        box.innerHTML = '';
        var picked = [];
        var frames = 14;
        var f = 0;
        var iv = T.setIntervalSafe(function () {
          var tmp = [];
          for (var i = 0; i < n; i++) tmp.push(avail[Math.floor(Math.random() * avail.length)]);
          box.innerHTML = tmp.map(function (v) { return '<span class="chip dim">' + T.esc(v) + '</span>'; }).join('');
          f++;
          if (f >= frames) {
            T.clearAllTimers();
            for (var k = 0; k < n; k++) {
              var idx = Math.floor(Math.random() * avail.length);
              picked.push(avail[idx]);
              avail.splice(idx, 1);
            }
            used = used.concat(picked);
            box.innerHTML = picked.map(function (v) { return '<span class="chip">' + T.esc(v) + '</span>'; }).join('');
            T.toast(L('抽取完成', 'Drawn!'));
            refreshInfo();
          }
        }, 60);
      });
      document.getElementById('ldReset').addEventListener('click', function () {
        used = [];
        document.getElementById('ldOut').innerHTML = '';
        refreshInfo();
      });
    }
  });

  /* ============ 掷骰子 ============ */
  T.register({
    id: 'dice', icon: '🎲', cat: 'random', name: '掷骰子',
    desc: 'D4 ~ D20 多骰同掷，支持聚点骰',
    keywords: '骰子 dice 掷骰 D20 跑团',
    render: function (host) {
      host.innerHTML =
      '<div class="panel" style="text-align:center"><h3 style="text-align:left">' + L('掷骰子', 'Dice Roller') + '</h3>' +
        '<div class="row" style="justify-content:center">' +
          '<div class="field"><label>' + L('骰子类型', 'Die') + '</label><select id="dcType">' + [4, 6, 8, 10, 12, 20].map(function (s) { return '<option value="' + s + '"' + (s === 6 ? ' selected' : '') + '>D' + s + '</option>'; }).join('') + '</select></div>' +
          '<div class="field"><label>' + L('数量', 'Count') + '</label><input id="dcN" inputmode="numeric" value="1" style="width:90px;text-align:center"></div>' +
        '</div>' +
        '<button class="btn btn-primary" id="dcBtn" style="min-width:140px">' + L('掷骰', 'Roll') + '</button>' +
        '<div class="dice-area" id="dcArea"></div>' +
        '<div class="dice-total" id="dcTotal"></div>' +
      '</div>';
      function pips(sides, v) {
        /* 每个骰面按标准点数布局：1-6 用点阵，更大面显示数字 */
        var cells = [];
        for (var i = 0; i < 9; i++) cells.push(i);
        var on = [];
        if (v === 1) on = [4];
        else if (v === 2) on = [0, 8];
        else if (v === 3) on = [0, 4, 8];
        else if (v === 4) on = [0, 2, 6, 8];
        else if (v === 5) on = [0, 2, 4, 6, 8];
        else if (v === 6) on = [0, 2, 3, 5, 6, 8];
        else if (sides > 6) return '<span style="grid-column:1/4;grid-row:1/4;place-self:center;font-size:26px;font-weight:700">' + v + '</span>';
        return cells.map(function (c) { return '<span class="pip' + (on.indexOf(c) >= 0 ? ' on' : '') + '"></span>'; }).join('');
      }
      document.getElementById('dcBtn').addEventListener('click', function () {
        var sides = parseInt(document.getElementById('dcType').value, 10);
        var n = parseInt(document.getElementById('dcN').value, 10);
        if (isNaN(n) || n < 1 || n > 12) { T.toast(L('数量需在 1~12 之间', 'Count must be 1–12')); return; }
        var area = document.getElementById('dcArea');
        var total = 0;
        area.innerHTML = '';
        var dies = [];
        for (var i = 0; i < n; i++) {
          var v = 1 + Math.floor(Math.random() * sides);
          total += v;
          var die = document.createElement('div');
          die.className = 'die';
          die.innerHTML = pips(sides, v);
          area.appendChild(die);
          dies.push(die);
        }
        /* 滚动动画：快速换值 */
        var f = 0;
        var iv = T.setIntervalSafe(function () {
          f++;
          var done = f >= 10;
          area.querySelectorAll('.die').forEach(function (d, idx) {
            if (done) return;
            d.classList.add('rolling');
            var rv = 1 + Math.floor(Math.random() * sides);
            d.innerHTML = pips(sides, rv);
            setTimeout(function () { d.classList.remove('rolling'); }, 140);
          });
          if (done) {
            T.clearAllTimers();
            /* 最终值 */
            var finals = [];
            for (var k = 0; k < n; k++) {
              var fv = 1 + Math.floor(Math.random() * sides);
              finals.push(fv);
            }
            total = finals.reduce(function (a, b) { return a + b; }, 0);
            dies.forEach(function (d, idx) { d.innerHTML = pips(sides, finals[idx]); });
            document.getElementById('dcTotal').textContent = n > 1 ? (isEn() ? 'Total ' : '总计 ') + total + (isEn() ? ' (' : '（') + finals.join(' + ') + (isEn() ? ')' : '）') : (isEn() ? 'Rolled ' : '掷出 ') + total;
          }
        }, 70);
      });
    }
  });

  /* ============ 随机分组 ============ */
  T.register({
    id: 'team-split', icon: '👥', cat: 'random', name: '随机分组',
    desc: '名单按人数 / 组数随机均衡分组',
    keywords: '分组 team split 随机 均衡 队伍',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('随机分组', 'Team Splitter') + '</h3>' +
        '<div class="field"><label>' + L('成员名单（每行一个）', 'Members (one per line)') + '</label><textarea id="tsNames" placeholder="' + L('张三&#10;李四&#10;王五…', 'Alice&#10;Bob&#10;Carol…') + '" style="min-height:150px"></textarea></div>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('每组人数', 'Per group') + '</label><input id="tsPer" inputmode="numeric" placeholder="' + L('例如 3（与组数二选一）', 'e.g. 3 (or group count)') + '"></div>' +
          '<div class="field grow"><label>' + L('组数', 'Groups') + '</label><input id="tsGroups" inputmode="numeric" placeholder="' + L('例如 4（与人数二选一）', 'e.g. 4 (or per group)') + '"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="tsBtn">' + L('分组', 'Split') + '</button></div>' +
        '</div>' +
        '<div id="tsOut"></div>' +
      '</div>';
      document.getElementById('tsBtn').addEventListener('click', function () {
        var list = document.getElementById('tsNames').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
        if (list.length < 2) { T.toast(L('请至少填写 2 名成员', 'Enter at least 2 members')); return; }
        var per = parseInt(document.getElementById('tsPer').value, 10);
        var g = parseInt(document.getElementById('tsGroups').value, 10);
        var groupCount;
        if (!isNaN(g) && g > 0) groupCount = g;
        else if (!isNaN(per) && per > 0) groupCount = Math.ceil(list.length / per);
        else { T.toast(L('请填写每组人数或组数', 'Fill in per-group or group count')); return; }
        if (groupCount > list.length) groupCount = list.length;
        /* 洗牌 */
        var pool = list.slice();
        for (var i = pool.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
        }
        var groups = [];
        for (var k = 0; k < groupCount; k++) groups.push([]);
        pool.forEach(function (name, idx) { groups[idx % groupCount].push(name); });
        var h = '<div class="stat-grid">';
        groups.forEach(function (gmem, gi) {
          h += '<div class="stat-box" style="min-height:110px"><div class="k">' + (isEn() ? 'Group ' : '第 ') + (gi + 1) + (isEn() ? ' (' : ' 组（') + gmem.length + (isEn() ? ')' : ' 人）') + '</div>' +
            '<div class="v" style="font-size:14px;font-family:inherit;font-weight:400;line-height:1.8">' +
            gmem.map(function (m) { return T.esc(m); }).join('<br>') + '</div></div>';
        });
        h += '</div>';
        document.getElementById('tsOut').innerHTML = h;
      });
    }
  });
})();
