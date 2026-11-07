/* ============================================================
   万能工具箱 · 游戏类工具（12 款）
   经典 4 款：贪吃蛇 / 2048 / 扫雷 / 反应测试
   v3.4 新增 8 款：俄罗斯方块 / 打砖块 / 数字华容道 / 井字棋 /
   猜数字 / 猜拳 / 抛硬币 / 桌游记分板
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  var esc = T.esc || function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ============ 贪吃蛇 ============ */
  T.register({
    id: 'snake', icon: '🐍', cat: 'game', name: '贪吃蛇', net: false,
    desc: '经典贪吃蛇小游戏（键盘 / 触屏控制）',
    keywords: '贪吃蛇 游戏 snake 小游戏 休闲',
    render: function (host) {
      var N = 20, CELL = 20, SIZE = N * CELL;
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('贪吃蛇', 'Snake') + '</h3>' +
        '<div class="game-score"><span>' + L('得分', 'Score') + ' <b id="skScore">0</b></span><span>' + L('最高', 'Best') + ' <b id="skBest">0</b></span></div>' +
        '<canvas class="snake-canvas" id="skCanvas" width="' + SIZE + '" height="' + SIZE + '" style="width:100%;max-width:400px;aspect-ratio:1"></canvas>' +
        '<div class="dpad" id="skDpad">' +
          '<button data-d="up" style="grid-column:2">▲</button>' +
          '<button data-d="left" style="grid-column:1;grid-row:2">◀</button>' +
          '<button data-d="down" style="grid-column:2;grid-row:2">▼</button>' +
          '<button data-d="right" style="grid-column:3;grid-row:2">▶</button>' +
        '</div>' +
        '<div class="row"><button class="btn btn-primary" id="skStart">' + L('开始 / 重新开始', 'Start / Restart') + '</button>' +
        '<button class="btn btn-ghost" id="skPause">' + L('暂停', 'Pause') + '</button></div>' +
        '<p class="note">' + L('方向键或屏幕方向键控制移动；吃到红色食物得分 +1，撞墙或撞到自己游戏结束。', 'Use arrow keys or the on-screen pad; eat the red food to score, avoid walls and yourself.') + '</p>' +
      '</div>';
      var canvas = document.getElementById('skCanvas');
      var ctx = canvas.getContext('2d');
      var scoreEl = document.getElementById('skScore');
      var best = T.store.get('snakeBest', 0);
      document.getElementById('skBest').textContent = best;
      var snake, dir, nextDir, food, running, over, paused, timer;

      function reset() {
        /* 蛇头为数组末尾元素（渲染/移动逻辑一致）；(9,10) 起步朝右 */
        snake = [{ x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 }];
        dir = { x: 1, y: 0 }; nextDir = dir;
        running = false; over = false; paused = false;
        scoreEl.textContent = 0;
        placeFood();
        draw();
      }
      function placeFood() {
        if (N * N - snake.length <= 0) { food = null; return; } /* 满屏：无食物可放 */
        do {
          food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
      }
      function draw() {
        ctx.fillStyle = '#0D1013';
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.fillStyle = '#242933';
        for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) {
          if ((x + y) % 2 === 0) ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
        if (food) {
          ctx.fillStyle = '#F26D6D';
          ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
        }
        snake.forEach(function (s, i) {
          ctx.fillStyle = i === snake.length - 1 ? '#E8A33D' : '#3BC98A';
          ctx.fillRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3);
        });
      }
      function step() {
        if (!running || paused || over) return;
        dir = nextDir;
        var head = { x: snake[snake.length - 1].x + dir.x, y: snake[snake.length - 1].y + dir.y };
        if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N ||
            snake.some(function (s, i) { return i > 0 && s.x === head.x && s.y === head.y; })) {
          over = true; running = false;
          document.getElementById('skPause').textContent = L('暂停', 'Pause');
          var sc = parseInt(scoreEl.textContent, 10);
          if (sc > best) {
            best = sc;
            T.store.set('snakeBest', best);
            document.getElementById('skBest').textContent = best;
          }
          T.toast(L('游戏结束！得分 ', 'Game over! Score ') + sc);
          return;
        }
        snake.push(head);
        if (food && head.x === food.x && head.y === food.y) {
          scoreEl.textContent = parseInt(scoreEl.textContent, 10) + 1;
          placeFood();
        } else {
          snake.shift();
        }
        draw();
      }
      function loop() { step(); timer = setTimeout(loop, 110); }
      document.getElementById('skStart').addEventListener('click', function () {
        clearTimeout(timer);
        reset();
        running = true;
        paused = false;
        document.getElementById('skPause').textContent = L('暂停', 'Pause');
        loop();
      });
      document.getElementById('skPause').addEventListener('click', function () {
        if (!running) return;
        paused = !paused;
        this.textContent = paused ? L('继续', 'Resume') : L('暂停', 'Pause');
      });
      function setDir(d) {
        var m = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[d];
        if (!m) return;
        if (m.x === -dir.x && m.y === -dir.y) return;
        nextDir = m;
      }
      function skKey(e) {
        var k = e.key;
        if (k === 'ArrowUp') { e.preventDefault(); setDir('up'); }
        else if (k === 'ArrowDown') { e.preventDefault(); setDir('down'); }
        else if (k === 'ArrowLeft') { e.preventDefault(); setDir('left'); }
        else if (k === 'ArrowRight') { e.preventDefault(); setDir('right'); }
        else if (k === ' ') { e.preventDefault(); document.getElementById('skStart').click(); }
      }
      window.addEventListener('keydown', skKey);
      document.getElementById('skDpad').addEventListener('click', function (e) {
        var b = e.target.closest('[data-d]');
        if (b) setDir(b.getAttribute('data-d'));
      });
      reset();
      return function () {
        clearTimeout(timer);
        window.removeEventListener('keydown', skKey);
      };
    }
  });

  /* ============ 2048 ============ */
  T.register({
    id: 'game-2048', icon: '🧮', cat: 'game', name: '2048', net: false,
    desc: '数字合成小游戏，滑动 / 方向键合并方块',
    keywords: '2048 游戏 数字 合成 益智',
    render: function (host) {
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('2048', '2048') + '</h3>' +
        '<div class="game-score"><span>' + L('得分', 'Score') + ' <b id="gScore">0</b></span><span>' + L('最高', 'Best') + ' <b id="gBest">0</b></span>' +
        '<button class="btn btn-ghost" style="min-height:32px;height:32px;padding:0 12px;font-size:12px" id="gNew">' + L('新游戏', 'New game') + '</button></div>' +
        '<div class="t2048" id="gBoard" style="grid-template-columns:repeat(4,1fr)"></div>' +
        '<p class="note">' + L('方向键或触屏滑动移动，相同数字合并；达到 2048 获胜，无法移动则结束。', 'Slide with arrow keys or touch; equal tiles merge — reach 2048 to win.') + '</p>' +
      '</div>';
      var grid = [], score = 0, won = false;
      var best = T.store.get('g2048Best', 0);
      document.getElementById('gBest').textContent = best;
      var board = document.getElementById('gBoard');
      function empty() { return grid.filter(function (c) { return c === 0; }).length; }
      function spawn() {
        var cells = [];
        grid.forEach(function (c, i) { if (c === 0) cells.push(i); });
        if (!cells.length) return;
        var i = cells[Math.floor(Math.random() * cells.length)];
        grid[i] = Math.random() < 0.9 ? 2 : 4;
      }
      function render() {
        board.innerHTML = grid.map(function (v) {
          return '<div class="cell2048' + (v ? ' t' + v : '') + '">' + (v || '') + '</div>';
        }).join('');
        document.getElementById('gScore').textContent = score;
        if (score > best) { best = score; T.store.set('g2048Best', best); }
        document.getElementById('gBest').textContent = best;
      }
      function slideRow(row) {
        var arr = row.filter(function (v) { return v; });
        var out = [], i = 0;
        while (i < arr.length) {
          if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
            out.push(arr[i] * 2);
            score += arr[i] * 2;
            i += 2;
          } else { out.push(arr[i]); i++; }
        }
        while (out.length < 4) out.push(0);
        return out;
      }
      function move(d) {
        var before = grid.join(',');
        var rows = [];
        for (var i = 0; i < 4; i++) rows.push(grid.slice(i * 4, i * 4 + 4));
        function trans(m) {
          for (var x = 0; x < 4; x++) {
            var col = [];
            for (var y = 0; y < 4; y++) col.push(m[y][x]);
            col = slideRow(d === 'up' ? col : col.slice().reverse());
            if (d === 'down') col = col.reverse();
            for (var yy = 0; yy < 4; yy++) m[yy][x] = col[yy];
          }
        }
        if (d === 'left') rows = rows.map(slideRow);
        else if (d === 'right') rows = rows.map(function (r) { return slideRow(r.slice().reverse()).reverse(); });
        else trans(rows);
        grid = rows.join(',').split(',').map(Number);
        if (grid.join(',') !== before) {
          spawn(); /* 每步只生成 1 个新方块（与经典 2048 一致） */
          render();
          checkEnd();
        }
      }
      function checkEnd() {
        if (!won && grid.indexOf(2048) >= 0) { won = true; T.toast(L('🎉 达成 2048！', '🎉 You made 2048!')); }
        var full = grid.indexOf(0) < 0;
        if (full) {
          var movable = false;
          for (var i = 0; i < 4 && !movable; i++) for (var j = 0; j < 4; j++) {
            if (j < 3 && grid[i * 4 + j] === grid[i * 4 + j + 1]) movable = true;
            if (i < 3 && grid[i * 4 + j] === grid[(i + 1) * 4 + j]) movable = true;
          }
          if (!movable) {
            T.toast(L('游戏结束！得分 ', 'Game over! Score ') + score);
          }
        }
      }
      function reset() {
        grid = []; score = 0; won = false;
        for (var i = 0; i < 16; i++) grid.push(0);
        spawn(); spawn();
        render();
      }
      var startX, startY;
      board.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX; startY = e.touches[0].clientY;
      }, { passive: true });
      board.addEventListener('touchend', function (e) {
        if (startX == null) return;
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        startX = startY = null;
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
        else move(dy > 0 ? 'down' : 'up');
      }, { passive: true });
      window.addEventListener('keydown', function gKey(e) {
        if (e.key === 'ArrowUp') { e.preventDefault(); move('up'); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); move('down'); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); move('left'); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); move('right'); }
      });
      document.getElementById('gNew').addEventListener('click', reset);
      reset();
      return function () { window.removeEventListener('keydown', gKey); };
    }
  });

  /* ============ 扫雷 ============ */
  T.register({
    id: 'minesweeper', icon: '💣', cat: 'game', name: '扫雷', net: false,
    desc: '经典扫雷（9×9 / 10 雷，左键翻开、右键标旗）',
    keywords: '扫雷 游戏 minesweeper 益智 挖雷',
    render: function (host) {
      var R = 9, C = 9, MINES = 10;
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('扫雷', 'Minesweeper') + '</h3>' +
        '<div class="game-score"><span>' + L('剩余雷', 'Mines left') + ' <b id="msLeft">' + MINES + '</b></span><span id="msState">-</span>' +
        '<button class="btn btn-ghost" style="min-height:32px;height:32px;padding:0 12px;font-size:12px" id="msNew">' + L('重新开始', 'Restart') + '</button></div>' +
        '<div class="game-board" style="padding:8px"><div class="mine-grid" id="msGrid" style="grid-template-columns:repeat(' + C + ',34px)"></div></div>' +
        '<p class="note">' + L('点击翻开；长按 / 右键标记地雷旗；数字表示周围地雷数。手机端可用“标旗模式”开关。', 'Tap to reveal; long-press / right-click to flag; numbers count nearby mines.') + '</p>' +
        '<label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-dim)"><input type="checkbox" id="msFlagMode"> ' + L('标旗模式（手机端：点击改为插旗）', 'Flag mode (tap flags on mobile)') + '</label>' +
      '</div>';
      var grid, revealed, flags, over, won, placed = false, flagMode = false;
      var leftEl = document.getElementById('msLeft');
      var stateEl = document.getElementById('msState');
      document.getElementById('msFlagMode').addEventListener('change', function (e) { flagMode = e.target.checked; });
      function init() {
        grid = []; revealed = []; flags = {};
        for (var i = 0; i < R * C; i++) grid.push(0);
        placed = false; /* 首次点开后布雷，保证第一次点击永不踩雷 */
        over = false; won = false;
        leftEl.textContent = MINES;
        stateEl.textContent = L('游戏进行中', 'Playing');
        renderGrid();
      }
      function placeMines(safe) {
        var sx = Math.floor(safe / C), sy = safe % C;
        var pool = [];
        for (var i = 0; i < R * C; i++) {
          var dx = Math.floor(i / C) - sx, dy = (i % C) - sy;
          if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) continue; /* 首点九宫格内不放雷 */
          pool.push(i);
        }
        for (var k = 0; k < MINES && k < pool.length; k++) {
          var j = k + Math.floor(Math.random() * (pool.length - k));
          var t = pool[k]; pool[k] = pool[j]; pool[j] = t;
          grid[pool[k]] = -1;
        }
        for (var x = 0; x < R; x++) for (var y = 0; y < C; y++) {
          if (grid[x * C + y] === -1) continue;
          var n = 0;
          for (var ddx = -1; ddx <= 1; ddx++) for (var ddy = -1; ddy <= 1; ddy++) {
            var nx = x + ddx, ny = y + ddy;
            if (nx >= 0 && ny >= 0 && nx < R && ny < C && grid[nx * C + ny] === -1) n++;
          }
          grid[x * C + y] = n;
        }
        placed = true;
      }
      function toggleFlag(i) {
        if (revealed[i]) return;
        if (flags[i]) delete flags[i]; else flags[i] = true;
        leftEl.textContent = MINES - Object.keys(flags).length;
        renderGrid();
      }
      function renderGrid() {
        var el = document.getElementById('msGrid');
        var h = '';
        for (var x = 0; x < R; x++) for (var y = 0; y < C; y++) {
          var i = x * C + y;
          var cls = 'mine-cell';
          var txt = '';
          if (revealed[i]) {
            cls += ' open';
            if (grid[i] === -1) cls += ' mine';
            else if (grid[i] > 0) { txt = grid[i]; cls += ' n' + grid[i]; }
          } else if (flags[i]) { txt = '🚩'; }
          h += '<div class="' + cls + '" data-i="' + i + '" style="font-size:' + (grid[i] === -1 ? '16px' : '14px') + '">' + (txt === '0' ? '' : txt) + '</div>';
        }
        el.innerHTML = h;
      }
      function reveal(i) {
        if (revealed[i] || flags[i] || over) return;
        if (!placed) placeMines(i);
        revealed[i] = true;
        if (grid[i] === -1) { endGame(false); return; }
        if (grid[i] === 0) {
          var x = Math.floor(i / C), y = i % C;
          for (var dx = -1; dx <= 1; dx++) for (var dy = -1; dy <= 1; dy++) {
            var nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < R && ny < C) reveal(nx * C + ny);
          }
        }
        checkWin();
      }
      function checkWin() {
        var safe = R * C - MINES;
        var r = revealed.filter(Boolean).length;
        if (r === safe && !over) {
          won = true; over = true;
          stateEl.textContent = L('🎉 胜利！', '🎉 You win!');
          T.toast(L('扫雷胜利！', 'Minesweeper cleared!'));
        }
        renderGrid();
      }
      function endGame(lose) {
        over = true;
        stateEl.textContent = L('💥 踩雷了', '💥 Boom!');
        for (var i = 0; i < R * C; i++) if (grid[i] === -1) revealed[i] = true;
        renderGrid();
        T.toast(L('游戏结束', 'Game over'));
      }
      var lpTimer = null, lpFired = false;
      var gridEl = document.getElementById('msGrid');
      /* 手机端长按 450ms 插旗（与说明一致），长按后的 click 被拦截 */
      gridEl.addEventListener('touchstart', function (e) {
        var cell = e.target.closest('[data-i]');
        if (!cell || over) return;
        lpFired = false;
        var idx = parseInt(cell.getAttribute('data-i'), 10);
        clearTimeout(lpTimer);
        lpTimer = setTimeout(function () { lpFired = true; toggleFlag(idx); }, 450);
      }, { passive: true });
      gridEl.addEventListener('touchend', function () { clearTimeout(lpTimer); });
      gridEl.addEventListener('touchmove', function () { clearTimeout(lpTimer); }, { passive: true });
      gridEl.addEventListener('click', function (e) {
        var cell = e.target.closest('[data-i]');
        if (!cell) return;
        if (lpFired) { lpFired = false; return; }
        if (over) return;
        var i = parseInt(cell.getAttribute('data-i'), 10);
        if (flagMode) { toggleFlag(i); return; }
        reveal(i);
      });
      gridEl.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var cell = e.target.closest('[data-i]');
        if (!cell || over) return;
        toggleFlag(parseInt(cell.getAttribute('data-i'), 10));
      });
      document.getElementById('msNew').addEventListener('click', init);
      init();
    }
  });

  /* ============ 反应测试 ============ */
  T.register({
    id: 'reaction', icon: '🖱️', cat: 'game', name: '反应测试', net: false,
    desc: '测量点击反应速度（5 轮取平均）',
    keywords: '反应 测试 速度 反应力 游戏 手速',
    render: function (host) {
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('反应速度测试', 'Reaction Test') + '</h3>' +
        '<div class="game-score"><span>' + L('本轮', 'Now') + ' <b id="rtCur">-</b> ms</span><span>' + L('平均', 'Avg') + ' <b id="rtAvg">-</b> ms</span><span>' + L('次数', 'Runs') + ' <b id="rtCount">0</b>/5</span></div>' +
        '<div class="reaction-pad" id="rtPad" style="width:100%;max-width:400px;aspect-ratio:1.6;display:grid;place-items:center;cursor:pointer;text-align:center;padding:16px;font-size:17px;color:var(--ink-dim)">' + L('点击开始测试', 'Click to start') + '</div>' +
        '<p class="note">' + L('点击后等待屏幕变绿，立刻再次点击。绿色出现到点击的毫秒数即反应时间。', 'Click, wait for green, then click again as fast as you can — the delay is your reaction time.') + '</p>' +
      '</div>';
      var pad = document.getElementById('rtPad');
      var phase = 'idle', waitTimer, readyAt, results = [];
      function upd() {
        document.getElementById('rtCur').textContent = results.length ? results[results.length - 1] + ' ms' : '-';
        document.getElementById('rtAvg').textContent = results.length ? Math.round(results.reduce(function (a, b) { return a + b; }, 0) / results.length) + ' ms' : '-';
        document.getElementById('rtCount').textContent = results.length;
      }
      function resetPad(text, color) {
        pad.textContent = text;
        pad.style.background = color || '#0D1013';
        pad.style.color = color === 'var(--ok)' ? '#0B1F16' : 'var(--ink-dim)';
      }
      pad.addEventListener('click', function () {
        if (phase === 'idle') {
          if (results.length >= 5) { results = []; upd(); } /* 完成一轮后，点击开始新一轮并清空 */
          phase = 'waiting';
          resetPad(L('等待变绿…', 'Wait for green…'), '#1A1D23');
          waitTimer = setTimeout(function () {
            phase = 'ready';
            readyAt = performance.now();
            resetPad(L('点击！', 'Click!'), 'var(--ok)');
          }, 1200 + Math.random() * 3800);
        } else if (phase === 'waiting') {
          clearTimeout(waitTimer);
          phase = 'idle';
          resetPad(L('太早了！点击重试', 'Too soon! Click to retry'));
        } else if (phase === 'ready') {
          var ms = Math.round(performance.now() - readyAt);
          results.push(ms);
          upd();
          phase = 'idle';
          /* 保留本轮成绩显示，直到点击开始下一轮 */
          resetPad(results.length >= 5 ? L('完成！点击再来一轮', 'Done! Click to play again') : L('点击开始下一轮', 'Click for the next round'));
          if (results.length >= 5) {
            var avg = Math.round(results.reduce(function (a, b) { return a + b; }, 0) / results.length);
            T.toast(L('平均反应 ', 'Average ') + avg + ' ms' + L(avg < 220 ? '，反应很快！' : avg < 320 ? '，不错！' : '，可以再练练', avg < 220 ? ' — lightning fast!' : avg < 320 ? ' — nice!' : ' — keep practicing!'));
          }
        }
      });
      upd();
      return function () { clearTimeout(waitTimer); };
    }
  });

  /* ============ 俄罗斯方块 ============ */
  T.register({
    id: 'tetris', icon: '🧱', cat: 'game', name: '俄罗斯方块', net: false,
    desc: '经典俄罗斯方块，消行得分（键盘 / 触屏）',
    keywords: '俄罗斯方块 游戏 tetris 方块 消行 益智 街机',
    render: function (host) {
      var COLS = 10, ROWS = 20, CELL = 20, W = COLS * CELL, H = ROWS * CELL;
      var SHAPES = {
        I: [[1, 1, 1, 1]],
        O: [[1, 1], [1, 1]],
        T: [[0, 1, 0], [1, 1, 1]],
        S: [[0, 1, 1], [1, 1, 0]],
        Z: [[1, 1, 0], [0, 1, 1]],
        J: [[1, 0, 0], [1, 1, 1]],
        L: [[0, 0, 1], [1, 1, 1]]
      };
      var COLORS = { I: '#4FA3FF', O: '#E8A33D', T: '#9B6DF0', S: '#3BC98A', Z: '#F26D6D', J: '#2ABFC4', L: '#E884A8' };
      var KEYS = Object.keys(SHAPES);
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('俄罗斯方块', 'Tetris') + '</h3>' +
        '<div class="game-score"><span>' + L('得分', 'Score') + ' <b id="ttScore">0</b></span><span>' + L('行数', 'Lines') + ' <b id="ttLines">0</b></span><span>' + L('最高', 'Best') + ' <b id="ttBest">0</b></span></div>' +
        '<canvas class="snake-canvas tetris-canvas" id="ttCanvas" width="' + W + '" height="' + H + '" style="width:100%;max-width:220px;aspect-ratio:1/2"></canvas>' +
        '<div class="dpad" id="ttDpad">' +
          '<button data-a="rotate" style="grid-column:2;grid-row:1">↻</button>' +
          '<button data-a="drop" style="grid-column:3;grid-row:1">⇩</button>' +
          '<button data-a="left" style="grid-column:1;grid-row:2">◀</button>' +
          '<button data-a="down" style="grid-column:2;grid-row:2">▼</button>' +
          '<button data-a="right" style="grid-column:3;grid-row:2">▶</button>' +
        '</div>' +
        '<div class="row"><button class="btn btn-primary" id="ttStart">' + L('开始 / 重新开始', 'Start / Restart') + '</button>' +
        '<button class="btn btn-ghost" id="ttPause">' + L('暂停', 'Pause') + '</button></div>' +
        '<p class="note">' + L('方向键移动 / ↑ 旋转 / 空格直落；消除整行得分，速度随行数加快。', 'Arrows move, ↑ rotates, Space hard-drops; clear rows to score — it speeds up as you go.') + '</p>' +
      '</div>';
      var canvas = document.getElementById('ttCanvas');
      var ctx = canvas.getContext('2d');
      var scoreEl = document.getElementById('ttScore');
      var linesEl = document.getElementById('ttLines');
      var best = T.store.get('tetrisBest', 0);
      document.getElementById('ttBest').textContent = best;
      var board, piece, px, py, running = false, over = false, paused = false, timer = null, score = 0, lines = 0, dropMs = 600;

      function emptyBoard() {
        var b = [];
        for (var i = 0; i < ROWS; i++) { var r = []; for (var j = 0; j < COLS; j++) r.push(''); b.push(r); }
        return b;
      }
      function newPiece() {
        var k = KEYS[Math.floor(Math.random() * KEYS.length)];
        return { k: k, m: SHAPES[k].map(function (r) { return r.slice(); }) };
      }
      function collide(m, x, y) {
        for (var r = 0; r < m.length; r++) for (var c = 0; c < m[r].length; c++) {
          if (!m[r][c]) continue;
          var nx = x + c, ny = y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && board[ny][nx]) return true;
        }
        return false;
      }
      function rotateM(m) {
        var R = m.length, Cn = m[0].length, out = [];
        for (var c = 0; c < Cn; c++) { var row = []; for (var r = R - 1; r >= 0; r--) row.push(m[r][c]); out.push(row); }
        return out;
      }
      function spawn() {
        piece = newPiece(); px = Math.floor((COLS - piece.m[0].length) / 2); py = 0;
        if (collide(piece.m, px, py)) { gameOver(); return false; }
        return true;
      }
      function lock() {
        piece.m.forEach(function (row, r) {
          row.forEach(function (v, c) { if (v && py + r >= 0) board[py + r][px + c] = piece.k; });
        });
        var cleared = 0;
        for (var r = ROWS - 1; r >= 0; r--) {
          var full = board[r].every(function (v) { return v; });
          if (full) { board.splice(r, 1); var nr = []; for (var q = 0; q < COLS; q++) nr.push(''); board.unshift(nr); cleared++; r++; }
        }
        if (cleared) {
          score += [0, 100, 300, 500, 800][cleared];
          lines += cleared;
          scoreEl.textContent = score;
          linesEl.textContent = lines;
          dropMs = Math.max(120, 600 - Math.floor(lines / 5) * 60);
        }
        if (!spawn()) { draw(); return; }
      }
      function schedule() { clearTimeout(timer); timer = setTimeout(tick, dropMs); }
      function tick() {
        if (!running || over) return;
        if (!paused) {
          if (!collide(piece.m, px, py + 1)) py++;
          else lock();
          draw();
        }
        schedule();
      }
      function draw() {
        ctx.fillStyle = '#0D1013'; ctx.fillRect(0, 0, W, H);
        for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
          if (board[r][c]) { ctx.fillStyle = COLORS[board[r][c]]; ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2); }
        }
        if (!piece) return;
        ctx.fillStyle = COLORS[piece.k];
        piece.m.forEach(function (row, r) {
          row.forEach(function (v, c) { if (v && py + r >= 0) ctx.fillRect((px + c) * CELL + 1, (py + r) * CELL + 1, CELL - 2, CELL - 2); });
        });
      }
      function gameOver() {
        over = true; running = false;
        document.getElementById('ttPause').textContent = L('暂停', 'Pause');
        if (score > best) { best = score; T.store.set('tetrisBest', best); document.getElementById('ttBest').textContent = best; }
        T.toast(L('游戏结束！得分 ', 'Game over! Score ') + score);
      }
      function move(dx) { if (!running || paused || over) return; if (!collide(piece.m, px + dx, py)) { px += dx; draw(); } }
      function down() { if (!running || paused || over) return; if (!collide(piece.m, px, py + 1)) { py++; draw(); } else { lock(); draw(); } }
      function rot() {
        if (!running || paused || over) return;
        var m = rotateM(piece.m);
        for (var k = 0; k < 3; k++) {
          if (!collide(m, px - k, py)) { piece.m = m; px -= k; draw(); return; }
          if (!collide(m, px + k, py)) { piece.m = m; px += k; draw(); return; }
        }
      }
      function hardDrop() {
        if (!running || paused || over) return;
        while (!collide(piece.m, px, py + 1)) py++;
        lock(); draw();
      }
      function reset() {
        board = emptyBoard(); score = 0; lines = 0; dropMs = 600;
        scoreEl.textContent = 0; linesEl.textContent = 0;
        over = false; paused = false;
        spawn();
        draw();
      }
      document.getElementById('ttStart').addEventListener('click', function () {
        clearTimeout(timer);
        reset(); running = true;
        document.getElementById('ttPause').textContent = L('暂停', 'Pause');
        schedule();
      });
      document.getElementById('ttPause').addEventListener('click', function () {
        if (!running || over) return;
        paused = !paused;
        this.textContent = paused ? L('继续', 'Resume') : L('暂停', 'Pause');
      });
      function ttKey(e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); down(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); rot(); }
        else if (e.key === ' ') { e.preventDefault(); hardDrop(); }
      }
      window.addEventListener('keydown', ttKey);
      document.getElementById('ttDpad').addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'left') move(-1);
        else if (a === 'right') move(1);
        else if (a === 'down') down();
        else if (a === 'rotate') rot();
        else if (a === 'drop') hardDrop();
      });
      reset();
      return function () { clearTimeout(timer); window.removeEventListener('keydown', ttKey); };
    }
  });

  /* ============ 打砖块 ============ */
  T.register({
    id: 'breakout', icon: '🔨', cat: 'game', name: '打砖块', net: false,
    desc: '弹球打砖块小游戏（键盘 / 触屏移动挡板）',
    keywords: '打砖块 游戏 breakout 弹球 砖块 街机 休闲',
    render: function (host) {
      var W = 320, H = 400, COLS = 8, BROWS = 5;
      var BW = W / COLS, BH = 16, PADW = 64, PADH = 10, BALL = 8;
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('打砖块', 'Breakout') + '</h3>' +
        '<div class="game-score"><span>' + L('得分', 'Score') + ' <b id="boScore">0</b></span><span>' + L('剩余球', 'Balls') + ' <b id="boLives">3</b></span><span>' + L('最高', 'Best') + ' <b id="boBest">0</b></span></div>' +
        '<canvas class="snake-canvas breakout-canvas" id="boCanvas" width="' + W + '" height="' + H + '" style="width:100%;max-width:320px;aspect-ratio:4/5;touch-action:none"></canvas>' +
        '<div class="row"><button class="btn btn-primary" id="boStart">' + L('开始 / 重新开始', 'Start / Restart') + '</button></div>' +
        '<p class="note">' + L('左右方向键或触摸移动挡板；击碎全部砖块过关，漏球扣一颗，球用完结束。', 'Move the paddle with ←/→ or touch; clear all bricks to win — a miss costs a ball.') + '</p>' +
      '</div>';
      var canvas = document.getElementById('boCanvas');
      var ctx = canvas.getContext('2d');
      var scoreEl = document.getElementById('boScore');
      var livesEl = document.getElementById('boLives');
      var best = T.store.get('breakoutBest', 0);
      document.getElementById('boBest').textContent = best;
      var bricks, padX, ball, score = 0, lives = 3, running = false, over = false, raf = null;

      function resetBricks() {
        bricks = [];
        for (var r = 0; r < BROWS; r++) { var row = []; for (var c = 0; c < COLS; c++) row.push(1); bricks.push(row); }
      }
      function resetBall() {
        padX = (W - PADW) / 2;
        ball = { x: W / 2, y: H - 60, vx: Math.random() < 0.5 ? -1.8 : 1.8, vy: -2.4 };
      }
      function reset() {
        resetBricks(); resetBall();
        score = 0; lives = 3; running = true; over = false;
        scoreEl.textContent = 0; livesEl.textContent = 3;
      }
      function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      function loop() {
        raf = requestAnimationFrame(loop);
        if (!running || over) return;
        var steps = Math.max(1, Math.ceil(Math.max(Math.abs(ball.vx), Math.abs(ball.vy)) / 4));
        for (var s = 0; s < steps; s++) {
          ball.x += ball.vx / steps; ball.y += ball.vy / steps;
          if (ball.x <= BALL / 2) { ball.x = BALL / 2; ball.vx = Math.abs(ball.vx); }
          if (ball.x >= W - BALL / 2) { ball.x = W - BALL / 2; ball.vx = -Math.abs(ball.vx); }
          if (ball.y <= BALL / 2) { ball.y = BALL / 2; ball.vy = Math.abs(ball.vy); }
          if (ball.vy > 0 && ball.y >= H - PADH - BALL / 2 - 2 && ball.y <= H - PADH - BALL / 2 + 8 &&
              ball.x >= padX - BALL / 2 && ball.x <= padX + PADW + BALL / 2) {
            ball.y = H - PADH - BALL / 2 - 2; ball.vy = -Math.abs(ball.vy);
            ball.vx += (ball.x - (padX + PADW / 2)) / PADW * 1.6;
            ball.vx = Math.max(-3.2, Math.min(3.2, ball.vx));
          }
          if (ball.y - BALL / 2 <= BROWS * BH) {
            var bc = Math.floor(ball.x / BW), br2 = Math.floor((ball.y - BALL / 2) / BH);
            if (br2 >= 0 && br2 < BROWS && bc >= 0 && bc < COLS && bricks[br2][bc]) {
              bricks[br2][bc] = 0; score += 10; scoreEl.textContent = score;
              ball.vy = -ball.vy;
              if (score > best) { best = score; T.store.set('breakoutBest', best); document.getElementById('boBest').textContent = best; }
            }
          }
          if (ball.y - BALL / 2 > H) {
            lives--; livesEl.textContent = Math.max(0, lives);
            if (lives <= 0) { running = false; over = true; T.toast(L('游戏结束！得分 ', 'Game over! Score ') + score); }
            else resetBall();
            break;
          }
        }
        if (running && bricks.every(function (r) { return r.every(function (v) { return !v; }); })) {
          running = false;
          T.toast(L('🎉 全部击碎，过关！', '🎉 Cleared! You win!'));
        }
        draw();
      }
      function draw() {
        ctx.fillStyle = '#0D1013'; ctx.fillRect(0, 0, W, H);
        var cols = ['#4FA3FF', '#3BC98A', '#E8A33D', '#F26D6D', '#9B6DF0'];
        for (var r = 0; r < BROWS; r++) for (var c = 0; c < COLS; c++) {
          if (bricks[r][c]) { ctx.fillStyle = cols[r]; ctx.fillRect(c * BW + 2, r * BH + 2, BW - 4, BH - 4); }
        }
        ctx.fillStyle = '#3BC98A'; ctx.fillRect(padX, H - PADH, PADW, PADH);
        ctx.fillStyle = '#E8A33D'; ctx.fillRect(ball.x - BALL / 2, ball.y - BALL / 2, BALL, BALL);
      }
      function padTo(x) { padX = Math.max(0, Math.min(W - PADW, x - PADW / 2)); }
      canvas.addEventListener('pointermove', function (e) {
        var rect = canvas.getBoundingClientRect();
        if (!rect.width) return;
        padTo((e.clientX - rect.left) / rect.width * W);
      });
      canvas.addEventListener('touchmove', function (e) {
        if (e.touches && e.touches.length) {
          e.preventDefault();
          var rect = canvas.getBoundingClientRect();
          if (rect.width) padTo((e.touches[0].clientX - rect.left) / rect.width * W);
        }
      }, { passive: false });
      function boKey(e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); padX = Math.max(0, padX - 24); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); padX = Math.min(W - PADW, padX + 24); }
      }
      window.addEventListener('keydown', boKey);
      document.getElementById('boStart').addEventListener('click', function () {
        stop(); reset(); loop();
      });
      reset(); running = false;
      draw();
      return function () { stop(); window.removeEventListener('keydown', boKey); };
    }
  });

  /* ============ 数字华容道 ============ */
  T.register({
    id: 'puzzle15', icon: '🔢', cat: 'game', name: '数字华容道', net: false,
    desc: '4×4 滑块拼图，复原 1-15（点击 / 方向键）',
    keywords: '华容道 拼图 滑块 15 数字 谜题 puzzle 游戏',
    render: function (host) {
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('数字华容道', '15-Puzzle') + '</h3>' +
        '<div class="game-score"><span>' + L('步数', 'Moves') + ' <b id="p15Moves">0</b></span><span>' + L('最佳', 'Best') + ' <b id="p15Best">-</b></span></div>' +
        '<div class="p15-grid" id="p15Grid"></div>' +
        '<div class="row"><button class="btn btn-primary" id="p15New">' + L('重新打乱', 'Shuffle') + '</button></div>' +
        '<p class="note">' + L('点击空位旁的方块滑动，或用方向键滑入对应方向的方块；把 1-15 按顺序排好即胜利。', 'Slide a tile next to the gap, or use arrow keys (the tile in that direction slides in); order 1-15 to win.') + '</p>' +
      '</div>';
      var cells = [], moves = 0, solved = false;
      var best = T.store.get('p15Best', null);
      var gridEl = document.getElementById('p15Grid');
      var movesEl = document.getElementById('p15Moves');
      document.getElementById('p15Best').textContent = best || '-';
      function render() {
        gridEl.innerHTML = cells.map(function (v, i) {
          return '<div class="p15-cell' + (v ? '' : ' blank') + '" data-i="' + i + '">' + (v || '') + '</div>';
        }).join('');
      }
      function isSolved() {
        for (var i = 0; i < 15; i++) if (cells[i] !== i + 1) return false;
        return cells[15] === 0;
      }
      function swap(a, b) { var t = cells[a]; cells[a] = cells[b]; cells[b] = t; }
      function tryMove(i) {
        if (solved) return;
        var b = cells.indexOf(0);
        var r = Math.floor(i / 4), c = i % 4, br = Math.floor(b / 4), bc = b % 4;
        var ok2 = (r === br && Math.abs(c - bc) === 1) || (c === bc && Math.abs(r - br) === 1);
        if (!ok2) return;
        swap(i, b);
        moves++; movesEl.textContent = moves;
        render();
        if (isSolved()) {
          solved = true;
          if (best == null || moves < best) { best = moves; T.store.set('p15Best', best); document.getElementById('p15Best').textContent = best; }
          T.toast(L('🎉 复原成功！步数 ', '🎉 Solved in ') + moves);
        }
      }
      function shuffle() {
        /* 从复原态做大量随机合法移动，保证必定可解 */
        cells = [];
        for (var i = 1; i <= 15; i++) cells.push(i);
        cells.push(0);
        var blank = 15, last = -1;
        for (var k = 0; k < 180; k++) {
          var r = Math.floor(blank / 4), c = blank % 4, opts = [];
          if (r > 0 && blank - 4 !== last) opts.push(blank - 4);
          if (r < 3 && blank + 4 !== last) opts.push(blank + 4);
          if (c > 0 && blank - 1 !== last) opts.push(blank - 1);
          if (c < 3 && blank + 1 !== last) opts.push(blank + 1);
          if (!opts.length) opts.push(last);
          var m = opts[Math.floor(Math.random() * opts.length)];
          swap(blank, m); last = blank; blank = m;
        }
        moves = 0; solved = false; movesEl.textContent = 0;
        if (isSolved()) { shuffle(); return; }
        render();
      }
      gridEl.addEventListener('click', function (e) {
        var cell = e.target.closest('[data-i]');
        if (cell) tryMove(parseInt(cell.getAttribute('data-i'), 10));
      });
      function p15Key(e) {
        var b = cells.indexOf(0), r = Math.floor(b / 4), c = b % 4;
        if (e.key === 'ArrowUp' && r < 3) { e.preventDefault(); tryMove(b + 4); }
        else if (e.key === 'ArrowDown' && r > 0) { e.preventDefault(); tryMove(b - 4); }
        else if (e.key === 'ArrowLeft' && c < 3) { e.preventDefault(); tryMove(b + 1); }
        else if (e.key === 'ArrowRight' && c > 0) { e.preventDefault(); tryMove(b - 1); }
      }
      window.addEventListener('keydown', p15Key);
      document.getElementById('p15New').addEventListener('click', shuffle);
      shuffle();
      return function () { window.removeEventListener('keydown', p15Key); };
    }
  });

  /* ============ 井字棋 ============ */
  T.register({
    id: 'tictactoe', icon: '⭕', cat: 'game', name: '井字棋', net: false,
    desc: '三连成线小游戏（人机对战）',
    keywords: '井字棋 三连 游戏 tic tac toe 人机 对战',
    render: function (host) {
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('井字棋（对战电脑）', 'Tic-Tac-Toe (vs CPU)') + '</h3>' +
        '<div class="game-score"><span>' + L('你（X）', 'You (X)') + ' <b id="tttW">0</b></span><span>' + L('电脑（O）', 'CPU (O)') + ' <b id="tttL">0</b></span><span>' + L('平局', 'Draws') + ' <b id="tttD">0</b></span></div>' +
        '<div class="ttt-grid" id="tttGrid"></div>' +
        '<div class="row" style="justify-content:center"><button class="btn btn-ghost" id="tttNew">' + L('重新开始', 'New round') + '</button><span id="tttMsg" style="align-self:center;font-size:13px;color:var(--ink-dim)"></span></div>' +
        '<p class="note">' + L('你先手（X），先连成三子者胜；电脑会尽力拦截与进攻。', 'You move first (X); line up three to win — the CPU blocks and attacks.') + '</p>' +
      '</div>';
      var board, over = false, w = 0, l = 0, d = 0, busy = false, tid = null;
      var gridEl = document.getElementById('tttGrid');
      var msgEl = document.getElementById('tttMsg');
      var LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      function render() {
        gridEl.innerHTML = board.map(function (v, i) {
          return '<div class="ttt-cell' + (v ? ' ' + (v === 'X' ? 'x' : 'o') : '') + '" data-i="' + i + '">' + (v || '') + '</div>';
        }).join('');
      }
      function winner(b) {
        for (var i = 0; i < LINES.length; i++) {
          var ln = LINES[i];
          if (b[ln[0]] && b[ln[0]] === b[ln[1]] && b[ln[1]] === b[ln[2]]) return b[ln[0]];
        }
        return b.indexOf('') < 0 ? 'draw' : '';
      }
      function aiMove(b) {
        var empty = [];
        b.forEach(function (v, i) { if (!v) empty.push(i); });
        for (var i = 0; i < empty.length; i++) { b[empty[i]] = 'O'; if (winner(b) === 'O') { b[empty[i]] = ''; return empty[i]; } b[empty[i]] = ''; }
        for (var j = 0; j < empty.length; j++) { b[empty[j]] = 'X'; if (winner(b) === 'X') { b[empty[j]] = ''; return empty[j]; } b[empty[j]] = ''; }
        if (!b[4]) return 4;
        var corners = [0, 2, 6, 8].filter(function (i) { return !b[i]; });
        if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
        return empty[Math.floor(Math.random() * empty.length)];
      }
      function finish(res) {
        over = true;
        if (res === 'X') { w++; document.getElementById('tttW').textContent = w; msgEl.textContent = L('你赢了！', 'You win!'); T.toast(L('🎉 你赢了！', '🎉 You win!')); }
        else if (res === 'O') { l++; document.getElementById('tttL').textContent = l; msgEl.textContent = L('电脑赢了', 'CPU wins'); T.toast(L('电脑赢了，再来一局！', 'CPU wins — try again!')); }
        else { d++; document.getElementById('tttD').textContent = d; msgEl.textContent = L('平局', 'Draw'); }
      }
      function play(i) {
        if (over || busy || board[i]) return;
        board[i] = 'X';
        var r = winner(board);
        if (r) { render(); finish(r); return; }
        busy = true; /* 电脑“思考”一下，避免连点 */
        tid = setTimeout(function () {
          var m = aiMove(board);
          if (m != null) board[m] = 'O';
          busy = false;
          var r2 = winner(board);
          render();
          if (r2) finish(r2);
        }, 260);
        render();
      }
      function reset() {
        clearTimeout(tid);
        board = ['', '', '', '', '', '', '', '', ''];
        over = false; busy = false; msgEl.textContent = '';
        render();
      }
      gridEl.addEventListener('click', function (e) {
        var cell = e.target.closest('[data-i]');
        if (cell) play(parseInt(cell.getAttribute('data-i'), 10));
      });
      document.getElementById('tttNew').addEventListener('click', reset);
      reset();
      return function () { clearTimeout(tid); };
    }
  });

  /* ============ 猜数字 ============ */
  T.register({
    id: 'guess-num', icon: '❓', cat: 'game', name: '猜数字', net: false,
    desc: '1-100 猜数小游戏，含大小提示与最佳成绩',
    keywords: '猜数字 游戏 数字 推理 大小提示 1-100',
    render: function (host) {
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('猜数字（1-100）', 'Guess the Number (1-100)') + '</h3>' +
        '<div class="game-score"><span>' + L('已猜', 'Tries') + ' <b id="gnTries">0</b></span><span>' + L('最佳', 'Best') + ' <b id="gnBest">-</b></span></div>' +
        '<div class="row" style="justify-content:center"><input id="gnInput" type="number" min="1" max="100" placeholder="' + L('输入 1-100', 'Type 1-100') + '" style="max-width:140px;text-align:center"><button class="btn btn-primary" id="gnGo">' + L('猜！', 'Guess') + '</button><button class="btn btn-ghost" id="gnNew">' + L('重新开始', 'Restart') + '</button></div>' +
        '<div id="gnHint" style="min-height:28px;font-size:15px;text-align:center"></div>' +
        '<p class="note">' + L('输入数字后点「猜」，根据「太大 / 太小」提示逐步缩小范围。', 'Guess and use the higher/lower hints to close in.') + '</p>' +
      '</div>';
      var target, tries = 0, done = false;
      var best = T.store.get('gnBest', null);
      var hintEl = document.getElementById('gnHint');
      var triesEl = document.getElementById('gnTries');
      var input = document.getElementById('gnInput');
      document.getElementById('gnBest').textContent = best || '-';
      function newGame() {
        target = 1 + Math.floor(Math.random() * 100);
        tries = 0; done = false;
        triesEl.textContent = 0;
        hintEl.innerHTML = L('来猜一个 1-100 的整数吧！', 'Pick a number from 1 to 100!');
        input.value = '';
        input.focus();
      }
      function guess() {
        if (done) return;
        var v = parseInt(input.value, 10);
        if (!(v >= 1 && v <= 100)) { hintEl.innerHTML = L('请输入 1-100 的整数。', 'Enter an integer from 1 to 100.'); return; }
        tries++;
        triesEl.textContent = tries;
        if (v === target) {
          done = true;
          hintEl.innerHTML = L('🎉 猜中了！共用 ' + tries + ' 次', '🎉 Correct! ' + tries + ' tries');
          T.toast(L('🎉 猜中了！', '🎉 Spot on!'));
          if (best == null || tries < best) { best = tries; T.store.set('gnBest', best); document.getElementById('gnBest').textContent = best; }
        } else if (v > target) {
          hintEl.innerHTML = L('太大了 ⬇（第 ' + tries + ' 次）', 'Too high ⬇ (try ' + tries + ')');
        } else {
          hintEl.innerHTML = L('太小了 ⬆（第 ' + tries + ' 次）', 'Too low ⬆ (try ' + tries + ')');
        }
        input.select();
      }
      document.getElementById('gnGo').addEventListener('click', guess);
      document.getElementById('gnNew').addEventListener('click', newGame);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') guess(); });
      newGame();
    }
  });

  /* ============ 猜拳 ============ */
  T.register({
    id: 'rps', icon: '✊', cat: 'game', name: '猜拳', net: false,
    desc: '石头剪刀布人机对战，含连胜与比分统计',
    keywords: '猜拳 石头 剪刀 布 游戏 人机 对战 休闲',
    render: function (host) {
      var EMO = { rock: '✊', paper: '✋', scissors: '✌️' };
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('猜拳（对战电脑）', 'Rock-Paper-Scissors') + '</h3>' +
        '<div class="game-score"><span>' + L('胜', 'Wins') + ' <b id="rpsW">0</b></span><span>' + L('负', 'Losses') + ' <b id="rpsL">0</b></span><span>' + L('平', 'Ties') + ' <b id="rpsT">0</b></span><span>' + L('连胜', 'Streak') + ' <b id="rpsS">0</b></span></div>' +
        '<div id="rpsStage" style="font-size:44px;text-align:center;min-height:64px">🤜 🤛</div>' +
        '<div id="rpsResult" style="font-size:15px;text-align:center;min-height:26px">' + L('出拳吧！', 'Make your move!') + '</div>' +
        '<div class="row" style="justify-content:center">' +
          '<button class="btn btn-primary" id="rpsRock">✊ ' + L('石头', 'Rock') + '</button>' +
          '<button class="btn btn-primary" id="rpsPaper">✋ ' + L('布', 'Paper') + '</button>' +
          '<button class="btn btn-primary" id="rpsScissors">✌️ ' + L('剪刀', 'Scissors') + '</button>' +
        '</div>' +
        '<p class="note">' + L('石头胜剪刀、剪刀胜布、布胜石头；比分仅在本次会话内累计。', 'Rock beats scissors, scissors beat paper, paper beats rock.') + '</p>' +
      '</div>';
      var w = 0, l = 0, t = 0, streak = 0;
      var stageEl = document.getElementById('rpsStage');
      var resEl = document.getElementById('rpsResult');
      function play(pick) {
        var keys = ['rock', 'paper', 'scissors'];
        var cpu = keys[Math.floor(Math.random() * 3)];
        stageEl.textContent = EMO[pick] + '   VS   ' + EMO[cpu];
        var res;
        if (pick === cpu) { t++; streak = 0; res = L('平局，再来！', 'Tie — again!'); }
        else if ((pick === 'rock' && cpu === 'scissors') || (pick === 'scissors' && cpu === 'paper') || (pick === 'paper' && cpu === 'rock')) {
          w++; streak++;
          res = L('你赢了！', 'You win!') + (streak >= 2 ? L('（连胜 ' + streak + '）', ' (streak ' + streak + ')') : '');
        } else { l++; streak = 0; res = L('电脑赢了，再来！', 'CPU wins — again!'); }
        resEl.textContent = res;
        document.getElementById('rpsW').textContent = w;
        document.getElementById('rpsL').textContent = l;
        document.getElementById('rpsT').textContent = t;
        document.getElementById('rpsS').textContent = streak;
      }
      document.getElementById('rpsRock').addEventListener('click', function () { play('rock'); });
      document.getElementById('rpsPaper').addEventListener('click', function () { play('paper'); });
      document.getElementById('rpsScissors').addEventListener('click', function () { play('scissors'); });
    }
  });

  /* ============ 抛硬币 ============ */
  T.register({
    id: 'coin-flip', icon: '🪙', cat: 'game', name: '抛硬币', net: false,
    desc: '在线抛硬币，正反面随机决定（猜先用）',
    keywords: '抛硬币 猜先 正反 随机 判决 游戏 工具',
    render: function (host) {
      host.innerHTML =
      '<div class="panel game-wrap"><h3>' + L('抛硬币', 'Coin Flip') + '</h3>' +
        '<div id="cfCoin" style="font-size:64px;text-align:center;min-height:84px;line-height:1.2">🪙</div>' +
        '<div id="cfResult" style="font-size:17px;text-align:center;min-height:28px;font-weight:700">' + L('点击按钮开始', 'Press the button') + '</div>' +
        '<div class="row" style="justify-content:center"><button class="btn btn-primary" id="cfFlip">' + L('抛硬币', 'Flip') + '</button></div>' +
        '<div id="cfStats" style="text-align:center;font-size:13px;color:var(--ink-dim)">' + L('正面 0 · 反面 0 · 共 0 次', 'Heads 0 · Tails 0 · 0 flips') + '</div>' +
        '<p class="note">' + L('适合决定谁先手、做选择等场景；只用本地随机数。', 'Great for picking who goes first; uses local randomness only.') + '</p>' +
      '</div>';
      var heads = 0, tails = 0, flipping = false, timer = null;
      var coinEl = document.getElementById('cfCoin');
      var resEl = document.getElementById('cfResult');
      function stats() {
        document.getElementById('cfStats').textContent = L(
          '正面 ' + heads + ' · 反面 ' + tails + ' · 共 ' + (heads + tails) + ' 次',
          'Heads ' + heads + ' · Tails ' + tails + ' · ' + (heads + tails) + ' flips');
      }
      document.getElementById('cfFlip').addEventListener('click', function () {
        if (flipping) return;
        flipping = true;
        resEl.textContent = L('抛出中…', 'Flipping…');
        var n = 0;
        timer = setInterval(function () {
          coinEl.textContent = Math.random() < 0.5 ? '🪙' : '🌕';
          if (++n >= 6) {
            clearInterval(timer); timer = null;
            var head = Math.random() < 0.5;
            if (head) heads++; else tails++;
            coinEl.textContent = head ? '🪙' : '🌕';
            resEl.textContent = head ? L('正面！', 'Heads!') : L('反面！', 'Tails!');
            stats();
            flipping = false;
          }
        }, 90);
      });
      stats();
      return function () { if (timer) clearInterval(timer); };
    }
  });

  /* ============ 桌游记分板 ============ */
  T.register({
    id: 'score-board', icon: '🏆', cat: 'game', name: '桌游记分板', net: false,
    desc: '多人计分板，桌游 / 牌局计分（本地保存）',
    keywords: '记分 计分板 桌游 牌局 分数 游戏工具 多人',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('桌游记分板', 'Score Board') + '</h3>' +
        '<div class="row"><input id="scbName" placeholder="' + L('玩家昵称', 'Player name') + '" style="max-width:180px"><button class="btn btn-primary" id="scbAdd">' + L('添加玩家', 'Add player') + '</button><button class="btn btn-ghost" id="scbResetAll">' + L('重置全部', 'Reset all') + '</button></div>' +
        '<div id="scbList" class="scb-list"></div>' +
        '<p class="note">' + L('适合桌游 / 牌局计分：±1 / ±5 快速调整；数据保存在本机浏览器。', 'For board games & card nights: adjust by ±1 / ±5; saved locally.') + '</p>' +
      '</div>';
      var players = T.store.get('scbPlayers', []);
      if (!Array.isArray(players)) players = [];
      var listEl = document.getElementById('scbList');
      function save() { T.store.set('scbPlayers', players); }
      function render() {
        var h = players.map(function (p, i) {
          return '<div class="scb-row" data-i="' + i + '"><span class="scb-name">' + esc(p.name) + '</span>' +
            '<span class="scb-score">' + p.score + '</span><span style="flex:1"></span>' +
            '<button class="btn btn-ghost scb-btn" data-act="minus5">−5</button>' +
            '<button class="btn btn-ghost scb-btn" data-act="minus1">−1</button>' +
            '<button class="btn btn-ghost scb-btn" data-act="plus1">＋1</button>' +
            '<button class="btn btn-ghost scb-btn" data-act="plus5">＋5</button>' +
            '<button class="btn btn-ghost scb-btn" data-act="del">✕</button></div>';
        }).join('');
        listEl.innerHTML = h || '<p class="note">' + L('还没有玩家，先添加一个吧。', 'No players yet — add one above.') + '</p>';
      }
      document.getElementById('scbAdd').addEventListener('click', function () {
        var name = document.getElementById('scbName').value.trim();
        if (!name) { T.toast(L('请输入玩家昵称', 'Enter a player name')); return; }
        players.push({ name: name, score: 0 });
        document.getElementById('scbName').value = '';
        save(); render();
      });
      listEl.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        var row = e.target.closest('[data-i]');
        if (!b || !row) return;
        var i = parseInt(row.getAttribute('data-i'), 10);
        var p = players[i]; if (!p) return;
        var act = b.getAttribute('data-act');
        if (act === 'plus1') p.score++;
        else if (act === 'minus1') p.score--;
        else if (act === 'plus5') p.score += 5;
        else if (act === 'minus5') p.score -= 5;
        else if (act === 'del') players.splice(i, 1);
        save(); render();
      });
      document.getElementById('scbResetAll').addEventListener('click', function () {
        players = []; save(); render();
      });
      render();
    }
  });
})();
