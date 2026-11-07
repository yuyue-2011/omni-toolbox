/* 游戏回归自检（v3.4）：8 款新游戏渲染与交互 + 已有游戏修复断言
   覆盖：贪吃蛇开局不即死 / 2048 单块生成与合并计分 / 扫雷旗数与首点安全 /
   井字棋人机对弈 / 猜数字 / 猜拳 / 抛硬币 / 华容道 / 记分板 / 记忆翻牌 /
   打字测速粘贴防护 / 俄罗斯方块与打砖块启动 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let pass = 0, fail = 0;
function ok(cond, label) {
  if (cond) { pass++; console.log('OK  ' + label); }
  else { fail++; console.log('FAIL ' + label); }
}

(async function () {
  const errors = [];
  const dom = new JSDOM(html, {
    url: 'file:///' + path.join(root, 'index.html').replace(/\\/g, '/'),
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.fetch = global.fetch;
      window.AbortController = global.AbortController;
      window.TextEncoder = global.TextEncoder;
      window.TextDecoder = global.TextDecoder;
      window.btoa = function (s) { return Buffer.from(s, 'binary').toString('base64'); };
      window.atob = function (s) { return Buffer.from(s, 'base64').toString('binary'); };
      window.confirm = function () { return false; };
      window.scrollTo = function () {};
      /* 测试基线：固定中文界面（jsdom 默认 navigator.language=en-US，isEn() 会解析为英文，中文断言全部失效） */
      try { Object.defineProperty(window.navigator, 'language', { value: 'zh-CN', configurable: true }); } catch (e) {}
      window.HTMLCanvasElement.prototype.getContext = function () {
        return new Proxy({}, {
          get(t, k) {
            if (k === 'measureText') return function () { return { width: 10 }; };
            if (k === 'getImageData') return function () { return { data: [] }; };
            if (k === 'createLinearGradient' || k === 'createRadialGradient') return function () { return { addColorStop: function () {} }; };
            if (k === 'toDataURL') return function () { return ''; };
            return function () {};
          },
          set() { return true; }
        });
      };
      window.addEventListener('error', e => errors.push('' + ((e.error && e.error.stack) || e.message)));
      window.addEventListener('unhandledrejection', e => errors.push('rejection: ' + e.reason));
    }
  });
  const w = dom.window, doc = w.document;

  /* 等注册表就绪 */
  let tries = 0;
  const timer = setInterval(check, 50);
  function check() {
    tries++;
    if (w.Toolbox && w.Toolbox.allTools && w.Toolbox.allTools().length >= 200) {
      clearInterval(timer);
      run().catch(e => { console.log('FAIL 运行异常: ' + e.stack); process.exit(1); });
    } else if (tries > 120) {
      clearInterval(timer);
      console.log('FAIL 页面加载超时');
      process.exit(1);
    }
  }

  async function run() {
    const T = w.Toolbox;

    /* ---------- 注册表 ---------- */
    const all = T.allTools();
    ok(all.length === 224, '工具总数 224（实际 ' + all.length + '）');
    const game = T.catTools('game');
    ok(game.length === 15, '游戏分类 15 款（实际 ' + game.length + '）');
    const need = ['tetris', 'breakout', 'puzzle15', 'tictactoe', 'guess-num', 'rps', 'coin-flip', 'score-board'];
    const ids = game.map(t => t.id);
    const missing = need.filter(id => ids.indexOf(id) < 0);
    ok(missing.length === 0, '8 款新游戏注册齐全' + (missing.length ? '（缺失 ' + missing.join(',') + '）' : ''));

    /* ---------- 贪吃蛇：开局不即死（回归） ---------- */
    const toasts = [];
    const origToast = T.toast;
    T.toast = function (m) { toasts.push(String(m)); return origToast(m); };
    w.location.hash = '#/tool/snake';
    await sleep(160);
    doc.getElementById('skStart').click();
    await sleep(400);
    const snakeDead = toasts.some(t => t.indexOf('游戏结束') >= 0);
    ok(!snakeDead, '贪吃蛇 启动 400ms 未即死' + (snakeDead ? '（捕获: ' + toasts.join('|') + '）' : ''));

    /* ---------- 2048：每步单块生成 + 合并计分（回归） ---------- */
    w.location.hash = '#/tool/game-2048';
    await sleep(160);
    const rnd = w.Math.random;
    w.Math.random = function () { return 0; }; /* 固定：新块落在第一个空格，值恒为 2 */
    doc.getElementById('gNew').click();
    await sleep(20);
    w.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await sleep(30);
    const gScore = doc.getElementById('gScore').textContent;
    const filled = Array.from(doc.getElementById('gBoard').children).filter(c => (c.textContent || '') !== '').length;
    w.Math.random = rnd;
    ok(gScore === '4', '2048 合并计分正确（得分 ' + gScore + '）');
    ok(filled === 2, '2048 每步仅生成 1 块（合并后填充 ' + filled + ' 格）');

    /* ---------- 扫雷：旗数统计（回归） + 首点安全（回归） ---------- */
    w.location.hash = '#/tool/minesweeper';
    await sleep(160);
    const flagChk = doc.getElementById('msFlagMode');
    flagChk.checked = true;
    flagChk.dispatchEvent(new w.Event('change', { bubbles: true }));
    /* 注意：插旗会重绘格子，需重新查询元素再点击 */
    doc.querySelector('.mine-cell[data-i="0"]').click();
    await sleep(20);
    const left1 = doc.getElementById('msLeft').textContent;
    doc.querySelector('.mine-cell[data-i="0"]').click();
    await sleep(20);
    const left2 = doc.getElementById('msLeft').textContent;
    ok(left1 === '9' && left2 === '10', '扫雷 插旗 9 / 拔旗 10（实际 ' + left1 + ' / ' + left2 + '）');
    flagChk.checked = false;
    flagChk.dispatchEvent(new w.Event('change', { bubbles: true }));
    doc.querySelector('.mine-cell[data-i="40"]').click();
    await sleep(30);
    const opened = doc.querySelectorAll('.mine-cell.open').length;
    const msState = doc.getElementById('msState').textContent;
    ok(opened > 1 && msState.indexOf('💥') < 0, '扫雷 首点安全（展开 ' + opened + ' 格，状态 ' + msState + '）');

    /* ---------- 井字棋 ---------- */
    w.location.hash = '#/tool/tictactoe';
    await sleep(160);
    doc.querySelector('.ttt-cell[data-i="4"]').click();
    await sleep(450);
    const xs = Array.from(doc.querySelectorAll('.ttt-cell')).filter(c => c.textContent === 'X').length;
    const os = Array.from(doc.querySelectorAll('.ttt-cell')).filter(c => c.textContent === 'O').length;
    ok(xs === 1 && os === 1, '井字棋 人机各一步（X=' + xs + ' O=' + os + '）');

    /* ---------- 猜数字 ---------- */
    w.location.hash = '#/tool/guess-num';
    await sleep(160);
    doc.getElementById('gnInput').value = '50';
    doc.getElementById('gnGo').click();
    await sleep(20);
    const gnTries = doc.getElementById('gnTries').textContent;
    const gnHint = doc.getElementById('gnHint').textContent;
    ok(gnTries === '1' && /(太大|太小|🎉)/.test(gnHint), '猜数字 第 1 次尝试提示「' + gnHint + '」');

    /* ---------- 猜拳 ---------- */
    w.location.hash = '#/tool/rps';
    await sleep(160);
    doc.getElementById('rpsPaper').click();
    await sleep(20);
    const rpsRes = doc.getElementById('rpsResult').textContent;
    const rpsSum = parseInt(doc.getElementById('rpsW').textContent, 10) + parseInt(doc.getElementById('rpsL').textContent, 10) + parseInt(doc.getElementById('rpsT').textContent, 10);
    ok(!!rpsRes && rpsSum === 1, '猜拳 出拳有结果（' + rpsRes + '）');

    /* ---------- 抛硬币 ---------- */
    w.location.hash = '#/tool/coin-flip';
    await sleep(160);
    doc.getElementById('cfFlip').click();
    await sleep(950);
    const cfRes = doc.getElementById('cfResult').textContent;
    const cfStats = doc.getElementById('cfStats').textContent;
    ok(/^(正面！|反面！)$/.test(cfRes) && cfStats.indexOf('共 1 次') >= 0, '抛硬币 结果（' + cfRes + '，' + cfStats + '）');

    /* ---------- 数字华容道 ---------- */
    w.location.hash = '#/tool/puzzle15';
    await sleep(160);
    const pCells = doc.querySelectorAll('.p15-cell').length;
    doc.getElementById('p15New').click();
    await sleep(20);
    const moves0 = doc.getElementById('p15Moves').textContent;
    const bIdx = parseInt(doc.querySelector('.p15-cell.blank').getAttribute('data-i'), 10);
    const nb = (bIdx % 4 < 3) ? bIdx + 1 : bIdx - 1;
    doc.querySelector('.p15-cell[data-i="' + nb + '"]').click();
    await sleep(20);
    const moves1 = doc.getElementById('p15Moves').textContent;
    ok(pCells === 16 && moves0 === '0' && moves1 === '1', '华容道 16 格 + 步数 ' + moves0 + '→' + moves1);

    /* ---------- 桌游记分板 ---------- */
    w.location.hash = '#/tool/score-board';
    await sleep(160);
    doc.getElementById('scbName').value = '测试玩家';
    doc.getElementById('scbAdd').click();
    await sleep(20);
    const rows = doc.querySelectorAll('.scb-row').length;
    doc.querySelector('.scb-row [data-act="plus1"]').click();
    await sleep(20);
    let scb = doc.querySelector('.scb-row .scb-score').textContent;
    ok(rows === 1 && scb === '1', '记分板 添加玩家并 +1（' + scb + ' 分）');
    doc.querySelector('.scb-row [data-act="minus1"]').click();
    await sleep(20);
    scb = doc.querySelector('.scb-row .scb-score').textContent;
    ok(scb === '0', '记分板 -1 回到 0（' + scb + ' 分）');

    /* ---------- 记忆翻牌 ---------- */
    w.location.hash = '#/tool/game-memory';
    await sleep(160);
    const cards = Array.from(doc.querySelectorAll('.mem-card'));
    let pair = null;
    for (let i = 0; i < cards.length && !pair; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        if (cards[i].getAttribute('data-e') === cards[j].getAttribute('data-e')) { pair = [cards[i], cards[j]]; break; }
      }
    }
    if (pair) { pair[0].click(); pair[1].click(); }
    await sleep(30);
    const doneN = doc.querySelectorAll('.mem-card.done').length;
    const gmStat = doc.getElementById('gmStat').textContent;
    ok(pair && doneN === 2 && gmStat === '步数 1', '记忆翻牌 配对成功（' + gmStat + '）');

    /* ---------- 打字测速：粘贴防护（回归） ---------- */
    w.location.hash = '#/tool/game-type';
    await sleep(160);
    const gtTarget = doc.getElementById('gtTarget').textContent;
    const ta = doc.getElementById('gtInput');
    ta.value = gtTarget;
    ta.dispatchEvent(new w.Event('input', { bubbles: true }));
    await sleep(30);
    const gtRes = doc.getElementById('gtResult').textContent;
    ok(gtRes.indexOf('完成') >= 0 && !/Infinity|NaN/.test(gtRes), '打字测速 粘贴完成且数值正常（' + gtRes.slice(0, 40) + '）');

    /* ---------- 俄罗斯方块 ---------- */
    w.location.hash = '#/tool/tetris';
    await sleep(160);
    doc.getElementById('ttStart').click();
    await sleep(120);
    doc.getElementById('ttPause').click();
    await sleep(20);
    const ttPaused = doc.getElementById('ttPause').textContent;
    doc.getElementById('ttPause').click();
    await sleep(20);
    const ttResumed = doc.getElementById('ttPause').textContent;
    ok(ttPaused === '继续' && ttResumed === '暂停', '俄罗斯方块 启动 / 暂停 / 继续（' + ttPaused + '→' + ttResumed + '）');

    /* ---------- 打砖块 ---------- */
    w.location.hash = '#/tool/breakout';
    await sleep(160);
    doc.getElementById('boStart').click();
    await sleep(400);
    const boLives = doc.getElementById('boLives').textContent;
    ok(!!doc.getElementById('boCanvas') && boLives === '3', '打砖块 启动运行（剩余球 ' + boLives + '）');

    /* ---------- 运行时零异常 ---------- */
    ok(errors.length === 0, '全部游戏运行零异常' + (errors.length ? '（' + errors.length + ' 个错误）' : ''));

    console.log(fail ? 'FAIL 游戏回归：' + fail + ' 项失败 / ' + (pass + fail) + ' 项' : 'OK 游戏回归全部通过（' + pass + ' 项断言）');
    process.exit(fail ? 1 : 0);
  }
})();
