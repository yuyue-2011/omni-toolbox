/* ============================================================
   万能工具箱 · 效率类工具（3 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 待办清单 ============ */
  T.register({
    id: 'todo', icon: '✅', cat: 'work', name: '待办清单',
    desc: '本地保存的待办事项，支持筛选与完成标记',
    keywords: '待办 todo 清单 任务 事项',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('待办清单', 'Todo List') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><input id="tdInput" placeholder="' + L('添加新待办，回车确认…', 'Add a todo, press Enter…') + '" style="margin-bottom:0"></div>' +
          '<div class="field"><button class="btn btn-primary" id="tdAdd">' + L('添加', 'Add') + '</button></div>' +
        '</div>' +
        '<div class="tabs" id="tdTabs" style="margin-top:14px">' +
          '<button data-f="all" class="active">' + L('全部', 'All') + '</button><button data-f="todo">' + L('未完成', 'Active') + '</button><button data-f="done">' + L('已完成', 'Done') + '</button>' +
        '</div>' +
        '<div class="list" id="tdList"></div>' +
        '<div class="row" style="justify-content:space-between;margin-top:14px">' +
          '<span class="muted" id="tdCount"></span>' +
          '<button class="btn btn-danger" id="tdClear" style="min-height:36px;height:36px;font-size:13px">' + L('清除已完成', 'Clear done') + '</button>' +
        '</div>' +
        '<p class="muted">' + L('数据保存在本机浏览器，不会上传。', 'Data stays in your browser — never uploaded.') + '</p>' +
      '</div>';
      var items = T.store.get('todo', []);
      var filter = 'all';
      function save() { T.store.set('todo', items); }
      function renderList() {
        var list = items.filter(function (it) {
          return filter === 'all' || (filter === 'done' ? it.done : !it.done);
        });
        var el = document.getElementById('tdList');
        if (!list.length) {
          el.innerHTML = '<div class="empty"><b>' + (filter === 'all' ? L('还没有待办', 'Nothing yet') : filter === 'done' ? L('暂无已完成事项', 'Nothing done yet') : L('全部完成，休息一下', 'All done — take a break')) + '</b></div>';
        } else {
          el.innerHTML = list.map(function (it) {
            return '<div class="list-item' + (it.done ? ' done' : '') + '" data-id="' + it.id + '">' +
              '<button class="checkbox' + (it.done ? ' on' : '') + '" data-act="toggle" aria-label="切换完成"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>' +
              '<span class="li-text">' + T.esc(it.text) + '</span>' +
              '<span class="li-sub">' + (it.time || '') + '</span>' +
              '<button class="icon-btn" data-act="del" aria-label="删除" style="display:grid;width:36px;height:36px;flex:none">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/></svg></button></div>';
          }).join('');
        }
        var done = items.filter(function (x) { return x.done; }).length;
        document.getElementById('tdCount').textContent = (isEn() ? 'Total ' : '共 ') + items.length + (isEn() ? ' · done ' : ' 项 · 已完成 ') + done + (isEn() ? '' : ' 项');
      }
      function add(text) {
        text = text.trim();
        if (!text) return;
        var d = new Date();
        items.unshift({
          id: Date.now() + '' + Math.floor(Math.random() * 1000),
          text: text,
          done: false,
          time: d.getMonth() + 1 + '/' + d.getDate() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
        });
        save();
        renderList();
      }
      document.getElementById('tdAdd').addEventListener('click', function () {
        add(document.getElementById('tdInput').value);
        document.getElementById('tdInput').value = '';
      });
      document.getElementById('tdInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          add(this.value);
          this.value = '';
        }
      });
      document.getElementById('tdTabs').addEventListener('click', function (e) {
        var b = e.target.closest('button[data-f]');
        if (!b) return;
        filter = b.getAttribute('data-f');
        this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
        renderList();
      });
      document.getElementById('tdList').addEventListener('click', function (e) {
        var btn = e.target.closest('[data-act]');
        var item = e.target.closest('.list-item');
        if (!btn || !item) return;
        var it = items.filter(function (x) { return x.id === item.getAttribute('data-id'); })[0];
        if (!it) return;
        if (btn.getAttribute('data-act') === 'toggle') it.done = !it.done;
        else items = items.filter(function (x) { return x.id !== it.id; });
        save();
        renderList();
      });
      document.getElementById('tdClear').addEventListener('click', function () {
        items = items.filter(function (x) { return !x.done; });
        save();
        renderList();
      });
      renderList();
    }
  });

  /* ============ 番茄钟 ============ */
  T.register({
    id: 'pomodoro', icon: '🍅', cat: 'work', name: '番茄钟',
    desc: '25 分钟专注 + 休息循环，配置可保存',
    keywords: '番茄钟 pomodoro 专注 计时 效率',
    render: function (host) {
      var cfg = T.store.get('pomoCfg', { work: 25, short: 5, long: 15, cycles: 4 });
      var state = { phase: 'work', remain: cfg.work * 60000, total: cfg.work * 60000, running: false, endAt: 0, done: 0 };
      function fmtT(ms) {
        var s = Math.max(0, Math.ceil(ms / 1000));
        return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + s % 60).slice(-2);
      }
      function beep() {
        try {
          var ctx = new (window.AudioContext || window.webkitAudioContext)();
          var o = ctx.createOscillator(); var g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = 660;
          g.gain.setValueAtTime(0.2, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
          o.start(); o.stop(ctx.currentTime + 0.9);
        } catch (e) { /* 忽略 */ }
      }
      function render() {
        var circ = 2 * Math.PI * 96;
        var ring = document.getElementById('pmRing');
        ring.style.strokeDasharray = circ;
        ring.style.strokeDashoffset = circ * (1 - (state.total ? state.remain / state.total : 0));
        document.getElementById('pmDisp').textContent = fmtT(state.remain);
        var ph = document.getElementById('pmPhase');
        if (state.phase === 'work') { ph.textContent = '专注中 · 第 ' + (state.done + 1) + ' 轮'; ph.style.color = 'var(--accent)'; }
        else if (state.phase === 'short') { ph.textContent = '短休息'; ph.style.color = 'var(--ok)'; }
        else { ph.textContent = '长休息'; ph.style.color = 'var(--ok)'; }
        document.getElementById('pmStart').textContent = state.running ? '暂停' : '开始';
        document.getElementById('pmRound').textContent = '已完成 ' + state.done + ' / ' + cfg.cycles + ' 轮';
      }
      function tick() {
        state.remain = state.endAt - Date.now();
        if (state.remain <= 0) {
          state.remain = 0;
          state.running = false;
          T.clearAllTimers();
          beep();
          if (state.phase === 'work') {
            state.done++;
            if (state.done >= cfg.cycles) { state.phase = 'long'; state.done = 0; }
            else state.phase = 'short';
          } else state.phase = 'work';
          state.total = (state.phase === 'work' ? cfg.work : state.phase === 'short' ? cfg.short : cfg.long) * 60000;
          state.remain = state.total;
          document.getElementById('pmStart').textContent = '开始';
          render();
          T.toast('阶段结束');
        } else render();
      }
      function phaseMin() { return state.phase === 'work' ? cfg.work : state.phase === 'short' ? cfg.short : cfg.long; }
      host.innerHTML =
      '<div class="panel" style="text-align:center">' +
        '<div class="timer-ring">' +
          '<svg width="220" height="220" viewBox="0 0 220 220">' +
            '<circle class="ring-bg" cx="110" cy="110" r="96" stroke-width="12"/>' +
            '<circle class="ring-fg" id="pmRing" cx="110" cy="110" r="96" stroke-width="12"/>' +
          '</svg>' +
          '<div class="time-text" id="pmDisp">25:00</div>' +
          '<div class="phase-text" id="pmPhase">' + L('专注中', 'Focus') + '</div>' +
        '</div>' +
        '<div class="row" style="justify-content:center">' +
          '<button class="btn btn-primary" id="pmStart" style="min-width:110px">' + L('开始', 'Start') + '</button>' +
          '<button class="btn btn-ghost" id="pmReset">' + L('重置', 'Reset') + '</button>' +
        '</div>' +
        '<p class="muted" id="pmRound" style="margin-top:10px">' + L('已完成 0 / 4 轮', 'Cycles: 0 / 4') + '</p>' +
      '</div>' +
      '<div class="panel"><h3>' + L('设置（自动保存）', 'Settings (auto-saved)') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('专注（分钟）', 'Focus (min)') + '</label><input id="pmW" inputmode="numeric" value="' + cfg.work + '"></div>' +
          '<div class="field grow"><label>' + L('短休息（分钟）', 'Short break') + '</label><input id="pmS" inputmode="numeric" value="' + cfg.short + '"></div>' +
          '<div class="field grow"><label>' + L('长休息（分钟）', 'Long break') + '</label><input id="pmL" inputmode="numeric" value="' + cfg.long + '"></div>' +
          '<div class="field grow"><label>' + L('循环轮数', 'Cycles') + '</label><input id="pmC" inputmode="numeric" value="' + cfg.cycles + '"></div>' +
        '</div>' +
        '<button class="btn btn-ghost" id="pmSave">' + L('保存设置', 'Save') + '</button>' +
      '</div>';
      document.getElementById('pmStart').addEventListener('click', function () {
        if (!state.running) {
          if (!state.remain) state.remain = state.total;
          state.endAt = Date.now() + state.remain;
          state.running = true;
          tick();
          T.setIntervalSafe(tick, 250);
        } else {
          state.remain = state.endAt - Date.now();
          state.running = false;
          T.clearAllTimers();
          render();
        }
      });
      document.getElementById('pmReset').addEventListener('click', function () {
        state.running = false;
        T.clearAllTimers();
        state.phase = 'work';
        state.total = cfg.work * 60000;
        state.remain = state.total;
        render();
      });
      document.getElementById('pmSave').addEventListener('click', function () {
        var w = parseInt(document.getElementById('pmW').value, 10);
        var s = parseInt(document.getElementById('pmS').value, 10);
        var l = parseInt(document.getElementById('pmL').value, 10);
        var c = parseInt(document.getElementById('pmC').value, 10);
        if (!w || !s || !l || !c || w < 1 || s < 1 || l < 1 || c < 1) { T.toast(L('请输入有效数值', 'Enter valid numbers')); return; }
        cfg = { work: w, short: s, long: l, cycles: c };
        T.store.set('pomoCfg', cfg);
        state.running = false;
        T.clearAllTimers();
        state.phase = 'work';
        state.total = w * 60000;
        state.remain = state.total;
        render();
        T.toast(L('设置已保存', 'Settings saved'));
      });
      state.total = cfg.work * 60000;
      state.remain = state.total;
      render();
    }
  });

  /* ============ 便签 ============ */
  T.register({
    id: 'notes', icon: '📒', cat: 'work', name: '便签',
    desc: '本地多便签记录，随手记、随时查',
    keywords: '便签 notes 备忘录 记录 记事',
    render: function (host) {
      host.innerHTML =
      '<div class="panel" id="ntListPanel"><h3>' + L('便签', 'Sticky Notes') + '</h3>' +
        '<button class="btn btn-primary" id="ntNew">' + L('新建便签', 'New note') + '</button>' +
        '<div class="list" id="ntList"></div>' +
        '<p class="muted">' + L('便签保存在本机，仅自己可见。', 'Notes are stored locally, visible only to you.') + '</p>' +
      '</div>' +
      '<div class="panel" id="ntEditPanel" style="display:none">' +
        '<div class="row" style="justify-content:space-between;align-items:center">' +
          '<h3 style="margin:0" id="ntEditTitle">' + L('编辑便签', 'Edit note') + '</h3>' +
          '<button class="btn btn-ghost" id="ntBack" style="min-height:36px;height:36px;font-size:13px">' + L('返回列表', 'Back') + '</button>' +
        '</div>' +
        '<div class="field" style="margin-top:12px"><input id="ntName" placeholder="' + L('标题', 'Title') + '"></div>' +
        '<div class="field"><textarea id="ntBody" placeholder="' + L('内容…', 'Content…') + '" style="min-height:220px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="ntSave">' + L('保存', 'Save') + '</button>' +
          '<button class="btn btn-danger" id="ntDel">' + L('删除', 'Delete') + '</button>' +
        '</div>' +
      '</div>';
      var notes = T.store.get('notes', []);
      var currentId = null;
      function save() { T.store.set('notes', notes); }
      function renderList() {
        var el = document.getElementById('ntList');
        if (!notes.length) {
          el.innerHTML = '<div class="empty"><b>' + L('还没有便签', 'No notes yet') + '</b>' + L('点击「新建便签」开始记录', 'Click “New note” to start') + '</div>';
          return;
        }
        el.innerHTML = notes.map(function (n) {
          var preview = (n.body || '').replace(/\n/g, ' ').slice(0, 40);
          return '<button class="list-item" data-id="' + n.id + '" style="width:100%;text-align:left;cursor:pointer">' +
            '<span style="flex:none;color:var(--accent)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/></svg></span>' +
            '<span style="flex:1;min-width:0"><b style="display:block;font-size:14px">' + T.esc(n.name || L('无标题', 'Untitled')) + '</b>' +
            '<span class="li-sub">' + T.esc(preview) + '</span></span>' +
            '<span class="li-sub" style="flex:none">' + (n.time || '') + '</span></button>';
        }).join('');
      }
      function openEdit(id) {
        currentId = id;
        var n = notes.filter(function (x) { return x.id === id; })[0];
        document.getElementById('ntEditPanel').style.display = 'block';
        document.getElementById('ntListPanel').style.display = 'none';
        document.getElementById('ntName').value = n.name || '';
        document.getElementById('ntBody').value = n.body || '';
        document.getElementById('ntEditTitle').textContent = L('编辑便签', 'Edit note');
      }
      document.getElementById('ntNew').addEventListener('click', function () {
        var d = new Date();
        var n = {
          id: Date.now() + '' + Math.floor(Math.random() * 1000),
          name: '新便签',
          body: '',
          time: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)
        };
        notes.unshift(n);
        save();
        renderList();
        openEdit(n.id);
      });
      document.getElementById('ntList').addEventListener('click', function (e) {
        var item = e.target.closest('[data-id]');
        if (item) openEdit(item.getAttribute('data-id'));
      });
      document.getElementById('ntSave').addEventListener('click', function () {
        if (!currentId) return;
        var n = notes.filter(function (x) { return x.id === currentId; })[0];
        if (!n) return;
        n.name = document.getElementById('ntName').value.trim() || L('无标题', 'Untitled');
        n.body = document.getElementById('ntBody').value;
        var d = new Date();
        n.time = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        save();
        renderList();
        document.getElementById('ntEditPanel').style.display = 'none';
        document.getElementById('ntListPanel').style.display = 'block';
        T.toast(L('已保存', 'Saved'));
      });
      document.getElementById('ntDel').addEventListener('click', function () {
        if (!currentId) return;
        notes = notes.filter(function (x) { return x.id !== currentId; });
        currentId = null;
        save();
        renderList();
        document.getElementById('ntEditPanel').style.display = 'none';
        document.getElementById('ntListPanel').style.display = 'block';
        T.toast(L('已删除', 'Deleted'));
      });
      document.getElementById('ntBack').addEventListener('click', function () {
        currentId = null;
        document.getElementById('ntEditPanel').style.display = 'none';
        document.getElementById('ntListPanel').style.display = 'block';
      });
      renderList();
    }
  });
})();
