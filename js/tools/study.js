/* ============================================================
   万能工具箱 v2.6 · 学习板块（4 款）
   学习平台导航 / 学习方法库 / 记忆闪卡 / 学习打卡
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  var esc = T.esc;

  /* ================= 学习：平台导航 ================= */
  T.register({
    id: 'study-nav', cat: 'study', icon: '🎓',
    name: '学习平台导航', desc: '国内外在线课程 / 学习平台直达',
    keywords: '学习 课程 平台 慕课 MOOC 网课 公开课 在线教育 Coursera edX Udemy 导航',
    render: function (host) {
      var groups = [
        { t: '国内平台', items: [
          { n: '国家智慧教育平台', u: 'https://www.smartedu.cn', d: '国家官方免费课程', g: 'CN' },
          { n: '中国大学MOOC', u: 'https://www.icourse163.org', d: '985/211 名校课程', g: 'CN' },
          { n: '学堂在线', u: 'https://www.xuetangx.com', d: '清华牵头在线学堂', g: 'CN' },
          { n: '网易公开课', u: 'https://open.163.com', d: '名校公开课翻译', g: 'CN' },
          { n: '网易云课堂', u: 'https://study.163.com', d: '职业技能课程', g: 'CN' },
          { n: 'B站课堂', u: 'https://www.bilibili.com/cheese', d: '知识区付费课程', g: 'CN' },
          { n: '慕课网', u: 'https://www.imooc.com', d: '程序员实战课程', g: 'CN' },
          { n: '极客时间', u: 'https://time.geekbang.org', d: '技术专栏与视频课', g: 'CN' }
        ] },
        { t: '国际平台', items: [
          { n: 'Coursera', u: 'https://www.coursera.org', d: '全球名校课程', g: 'INT' },
          { n: 'edX', u: 'https://www.edx.org', d: 'MIT / 哈佛合作平台', g: 'INT' },
          { n: 'Khan Academy', u: 'https://www.khanacademy.org', d: '免费数学科学课程', g: 'INT' },
          { n: 'Udemy', u: 'https://www.udemy.com', d: '海量实战课程', g: 'INT' },
          { n: 'Duolingo', u: 'https://www.duolingo.com', d: '免费语言学习', g: 'INT' },
          { n: 'Codecademy', u: 'https://www.codecademy.com', d: '交互式编程学习', g: 'INT' },
          { n: 'Skillshare', u: 'https://www.skillshare.com', d: '创意技能课程', g: 'INT' },
          { n: 'MIT OpenCourseWare', u: 'https://ocw.mit.edu', d: '麻省理工免费课件', g: 'INT' }
        ] }
      ];
      var h = '<div class="panel"><h3>' + L('学习平台导航', 'Learning Sites') + '</h3><p class="note">点击直达官方平台，共 ' + groups.reduce(function (a, g) { return a + g.items.length; }, 0) + ' 个站点。</p>';
      groups.forEach(function (g) {
        h += '<div class="set-sub">' + esc(g.t) + '</div><div class="site-grid">';
        g.items.forEach(function (s) {
          h += '<a class="site-card" href="' + s.u + '" target="_blank" rel="noopener noreferrer"><b>' + esc(s.n) + ' <span class="badge ' + (s.g === 'CN' ? 'net' : 'off') + '">' + (s.g === 'CN' ? '国内' : '国际') + '</span></b><span>' + esc(s.d) + '</span><i>' + esc(s.u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
        });
        h += '</div>';
      });
      h += '</div>';
      host.innerHTML = h;
    }
  });

  /* ================= 学习：学习方法库 ================= */
  T.register({
    id: 'study-method', cat: 'study', icon: '🧠',
    name: '学习方法库', desc: '费曼 / 番茄 / 艾宾浩斯等高效学习法速查',
    keywords: '学习方法 费曼 番茄钟 艾宾浩斯 遗忘曲线 康奈尔 间隔重复 记忆 技巧 效率',
    render: function (host) {
      var methods = [
        ['费曼学习法', '用最简单的话把概念讲给外行听，讲不明白的地方就是没学会的地方。核心：概念 → 讲解 → 纠错 → 简化。', '适合理解性知识'],
        ['番茄工作法', '25 分钟专注 + 5 分钟休息为 1 个番茄，4 个番茄后大休息。降低启动阻力，保持节奏。', '适合需要长时间专注'],
        ['艾宾浩斯遗忘曲线', '记忆在 20 分钟后衰减最快。按 5 分钟 / 30 分钟 / 12 小时 / 1 天 / 2 天 / 4 天 / 7 天 / 15 天复习，可大幅提升留存。', '适合背诵类内容'],
        ['间隔重复（Spaced Repetition）', '在快要忘记时复习，配合 Anki / 闪卡工具，用最小投入获得最大记忆收益。', '适合单词 / 公式'],
        ['康奈尔笔记法', '一页分三栏：右侧主笔记、左侧关键词、底部总结。课后用关键词回忆并写总结。', '适合课堂 / 阅读'],
        ['刻意练习', '只在舒适区边缘练习，针对弱点做有反馈的高强度训练，而非机械重复。', '适合技能提升'],
        ['SQ3R 阅读法', '浏览 Survey → 提问 Question → 精读 Read → 复述 Recite → 复习 Review，让阅读带问题、带输出。', '适合教材 / 论文'],
        ['两分钟法则', '2 分钟内能做完的事立刻做，避免任务堆积；大任务拆成 2 分钟起步动作降低启动成本。', '适合拖延场景']
      ];
      var h = '<div class="panel"><h3>' + L('学习方法库', 'Study Methods') + '</h3><p class="note">8 种主流学习法速查，点击即可复制文字。</p><div class="note-grid">';
      methods.forEach(function (m) {
        h += '<div class="note-card" data-copy="' + esc(m[0] + '：' + m[1]) + '"><b>' + esc(m[0]) + '</b>' +
          '<p style="margin:0;font-size:13px;line-height:1.65;color:var(--ink-dim)">' + esc(m[1]) + '</p>' +
          '<span style="font-size:11.5px;color:var(--ink-faint)">' + esc(m[2]) + '</span></div>';
      });
      h += '</div><p class="note">点击卡片可复制该方法的完整说明。</p></div>';
      host.innerHTML = h;
      host.querySelectorAll('[data-copy]').forEach(function (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () { T.copyText(card.getAttribute('data-copy')); });
      });
    }
  });

  /* ================= 学习：记忆闪卡 ================= */
  T.register({
    id: 'study-cards', cat: 'study', icon: '🃏',
    name: '记忆闪卡', desc: '本地词卡集 / 正反面翻转 / 随机抽卡',
    keywords: '闪卡 记忆 卡片 单词 背诵 复习 间隔 翻转 Anki 词卡',
    render: function (host) {
      var KEY = 'omnitool.study.cards';
      function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
      function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
      var flipped = false;
      function render() {
        var list = load();
        var h = '<div class="panel"><h3>' + L('记忆闪卡', 'Flashcards') + '</h3><p class="note">共 ' + list.length + ' 张卡片，数据仅保存在本机。</p>' +
          '<div class="row"><input class="grow" id="scFront" placeholder="正面（问题 / 单词）" style="min-width:140px" spellcheck="false">' +
          '<input class="grow" id="scBack" placeholder="背面（答案 / 释义）" style="min-width:140px" spellcheck="false">' +
          '<button class="btn btn-primary" id="scAdd">' + L('添加', 'Add') + '</button></div>' +
          '<div class="list" id="scList" style="max-height:260px;overflow:auto">';
        if (!list.length) h += '<div class="empty"><b>还没有卡片</b>先添加几张再开始背诵</div>';
        list.forEach(function (x, i) {
          h += '<div class="list-item"><span class="li-text"><b>' + esc(x.f) + '</b><div class="li-sub">' + esc(x.b) + '</div></span>' +
            '<button class="btn btn-ghost" data-i="' + i + '" data-a="del">删</button></div>';
        });
        h += '</div><div class="set-sub" style="margin-top:14px">背诵模式</div>' +
          '<div class="rd-result" id="scCard" style="border:1px dashed var(--line);border-radius:14px;cursor:pointer">' +
          (list.length ? '<div><b style="font-size:20px">' + esc(list[0].f) + '</b><p class="note" style="margin-top:8px">点击翻面</p></div>' : '<span style="color:var(--ink-faint)">暂无卡片可背</span>') +
          '</div><div class="row" style="margin-top:10px">' +
          '<button class="btn btn-ghost" id="scPrev" ' + (list.length ? '' : 'disabled') + '>' + L('上一张', 'Prev') + '</button>' +
          '<button class="btn btn-ghost" id="scFlip" ' + (list.length ? '' : 'disabled') + '>' + L('翻面', 'Flip') + '</button>' +
          '<button class="btn btn-ghost" id="scNext" ' + (list.length ? '' : 'disabled') + '>' + L('下一张', 'Next') + '</button>' +
          '<button class="btn btn-ghost" id="scShuffle" ' + (list.length ? '' : 'disabled') + '>' + L('随机', 'Shuffle') + '</button></div></div>';
        host.innerHTML = h;
        var idx = 0;
        function paintCard() {
          var list2 = load();
          if (!list2.length) { host.querySelector('#scCard').innerHTML = '<span style="color:var(--ink-faint)">暂无卡片可背</span>'; return; }
          idx = Math.max(0, Math.min(idx, list2.length - 1));
          var c = list2[idx];
          host.querySelector('#scCard').innerHTML = flipped
            ? '<div><b style="font-size:20px">' + esc(c.b) + '</b><p class="note" style="margin-top:8px">' + esc(c.f) + '（点击翻回）</p></div>'
            : '<div><b style="font-size:20px">' + esc(c.f) + '</b><p class="note" style="margin-top:8px">点击翻面</p></div>';
        }
        host.querySelector('#scAdd').addEventListener('click', function () {
          var f = host.querySelector('#scFront').value.trim(), b = host.querySelector('#scBack').value.trim();
          if (!f || !b) { T.toast('正反面都不能为空'); return; }
          var l = load(); l.push({ f: f, b: b }); save(l); render();
        });
        host.querySelector('#scList').addEventListener('click', function (e) {
          var b = e.target.closest('[data-a]');
          if (!b) return;
          var l = load(); l.splice(Number(b.getAttribute('data-i')), 1); save(l); render();
        });
        host.querySelector('#scCard').addEventListener('click', function () { flipped = !flipped; paintCard(); });
        host.querySelector('#scFlip').addEventListener('click', function () { flipped = !flipped; paintCard(); });
        host.querySelector('#scNext').addEventListener('click', function () { flipped = false; idx = (idx + 1) % load().length; paintCard(); });
        host.querySelector('#scPrev').addEventListener('click', function () { flipped = false; idx = (idx - 1 + load().length) % load().length; paintCard(); });
        host.querySelector('#scShuffle').addEventListener('click', function () { flipped = false; idx = Math.floor(Math.random() * load().length); paintCard(); });
      }
      render();
    }
  });

  /* ================= 学习：学习打卡 ================= */
  T.register({
    id: 'study-check', cat: 'study', icon: '✅',
    name: '学习打卡', desc: '每日学习时长记录 / 7 天连续统计',
    keywords: '学习 打卡 记录 时长 统计 连续 天数 目标 自律 进度',
    render: function (host) {
      var KEY = 'omnitool.study.checks';
      function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
      function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
      function todayStr() {
        var d = new Date();
        return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
      }
      function pad2(n) { return n < 10 ? '0' + n : '' + n; }
      function render() {
        var data = load();
        var today = todayStr();
        var t = data[today] || { m: 0, n: '' };
        var days = Object.keys(data).sort().slice(-7);
        var total = Object.keys(data).reduce(function (a, k) { return a + (data[k].m || 0); }, 0);
        var streak = 0;
        var d = new Date();
        for (var i = 0; i < 365; i++) {
          var key = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
          if (data[key] && (data[key].m || 0) > 0) { streak++; d.setDate(d.getDate() - 1); }
          else break;
        }
        var h = '<div class="panel"><h3>' + L('学习打卡', 'Study Check-in') + '</h3><p class="note">累计 ' + total + ' 分钟 · 连续打卡 ' + streak + ' 天 · 今日 ' + t.m + ' 分钟</p>' +
          '<div class="row"><input id="ckMin" type="number" min="1" max="1440" placeholder="今日学习分钟数" value="' + (t.m || '') + '" style="width:150px">' +
          '<input id="ckNote" class="grow" placeholder="备注（可选）" value="' + esc(t.n) + '" style="min-width:140px" spellcheck="false">' +
          '<button class="btn btn-primary" id="ckSave">' + L('保存今日', 'Save') + '</button></div>' +
          '<div class="set-sub" style="margin-top:14px">最近 7 天</div><div class="memory-grid" style="max-width:none">';
        var wd = ['日', '一', '二', '三', '四', '五', '六'];
        for (var k = 6; k >= 0; k--) {
          var dt = new Date();
          dt.setDate(dt.getDate() - k);
          var key2 = dt.getFullYear() + '-' + pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate());
          var v = data[key2] ? data[key2].m : 0;
          h += '<div class="rd-box' + (v > 0 ? ' on' : '') + '" title="' + key2 + ' ' + v + ' 分钟">' +
            '<span style="font-size:10.5px">' + wd[dt.getDay()] + '</span><b style="font-size:12.5px">' + (v ? v + '分' : '—') + '</b></div>';
        }
        h += '</div><p class="note">点击格子可查看对应日期明细；打卡数据仅保存在本机。</p></div>';
        host.innerHTML = h;
        host.querySelector('#ckSave').addEventListener('click', function () {
          var m = parseInt(host.querySelector('#ckMin').value, 10);
          if (!m || m < 1) { T.toast('请输入有效分钟数'); return; }
          data[today] = { m: m, n: host.querySelector('#ckNote').value.trim() };
          save(data);
          T.toast('今日打卡已保存');
          render();
        });
      }
      render();
    }
  });
})();
