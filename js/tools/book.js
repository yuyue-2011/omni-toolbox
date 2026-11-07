/* ============================================================
   万能工具箱 v2.6 · 图书板块（4 款）
   图书检索导航 / ISBN 校验 / 书单灵感 / 阅读记录本
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  var esc = T.esc;

  /* ================= 图书：图书检索导航 ================= */
  T.register({
    id: 'book-search', cat: 'book', icon: '📚',
    name: '图书检索导航', desc: '国内外图书搜索 / 购买 / 借阅平台直达',
    keywords: '图书 书 搜索 购书 京东 当当 豆瓣 图书馆 找书 买书 平台',
    render: function (host) {
      var sites = [
        { n: '京东图书', u: 'https://book.jd.com', d: '综合购书，自营次日达', g: 'CN' },
        { n: '当当网', u: 'http://www.dangdang.com', d: '老牌图书电商，折扣活动多', g: 'CN' },
        { n: '豆瓣读书', u: 'https://book.douban.com', d: '评分书评，找好书神器', g: 'CN' },
        { n: '孔夫子旧书网', u: 'https://www.kongfz.com', d: '绝版书 / 二手书交易', g: 'CN' },
        { n: '中国国家数字图书馆', u: 'http://www.nlc.cn', d: '国家图书馆，电子资源丰富', g: 'CN' },
        { n: '超星发现', u: 'https://www.chaoxing.com', d: '学术文献与图书检索', g: 'CN' },
        { n: 'Amazon Books', u: 'https://www.amazon.com/books', d: '全球最大书店', g: 'INT' },
        { n: 'Google Books', u: 'https://books.google.com', d: '全球图书全文搜索', g: 'INT' },
        { n: 'Project Gutenberg', u: 'https://www.gutenberg.org', d: '6万+免费公版电子书', g: 'INT' },
        { n: 'Open Library', u: 'https://openlibrary.org', d: '开放图书馆，可借阅电子书', g: 'INT' },
        { n: 'Goodreads', u: 'https://www.goodreads.com', d: '英文书评分与书单社区', g: 'INT' },
        { n: 'LibraryThing', u: 'https://www.librarything.com', d: '个人藏书管理与推荐', g: 'INT' }
      ];
      var h = '<div class="panel"><h3>' + L('图书检索导航', 'Book Search') + '</h3><p class="note">找书 / 购书 / 借阅 / 电子书一站直达，均为官方或知名站点。</p><div class="site-grid">';
      sites.forEach(function (s) {
        h += '<a class="site-card" href="' + s.u + '" target="_blank" rel="noopener noreferrer"><b>' + esc(s.n) + ' <span class="badge ' + (s.g === 'CN' ? 'net' : 'off') + '">' + (s.g === 'CN' ? '国内' : '国际') + '</span></b><span>' + esc(s.d) + '</span><i>' + esc(s.u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
      });
      h += '</div></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 图书：ISBN 校验 ================= */
  T.register({
    id: 'book-isbn', cat: 'book', icon: '🔢',
    name: 'ISBN 校验', desc: '校验 ISBN-10 / ISBN-13 并解析出版信息区段',
    keywords: 'ISBN 书号 校验 验证 图书 编号 isbn10 isbn13',
    render: function (host) {
      host.innerHTML =
        '<div class="panel"><h3>' + L('ISBN 校验', 'ISBN Check') + '</h3>' +
        '<div class="field"><label>输入 ISBN（10 位或 13 位，可带连字符）</label>' +
        '<input id="isbnIn" placeholder="例如 9787020002207 或 0-306-40615-2" spellcheck="false"></div>' +
        '<div class="row"><button class="btn btn-primary" id="isbnBtn">' + L('校验', 'Validate') + '</button>' +
        '<button class="btn btn-ghost" id="isbnClear">' + L('清空', 'Clear') + '</button></div>' +
        '<div id="isbnOut" style="margin-top:14px"></div>' +
        '<p class="note">ISBN 校验位算法为纯本地计算：13 位加权求和取模 10，10 位加权求和取模 11（X 表示 10）。</p></div>';
      function check() {
        var raw = document.getElementById('isbnIn').value.replace(/[-\s]/g, '').toUpperCase();
        var out = document.getElementById('isbnOut');
        if (!raw) { out.innerHTML = ''; return; }
        if (!/^[0-9X]{10}$/.test(raw) && !/^[0-9]{13}$/.test(raw)) {
          out.innerHTML = '<div class="msg err">格式不正确：应为 10 位或 13 位数字（10 位末位可为 X）</div>';
          return;
        }
        var ok = false, type = '';
        if (raw.length === 13) {
          type = 'ISBN-13';
          var sum = 0;
          for (var i = 0; i < 12; i++) sum += Number(raw[i]) * (i % 2 === 0 ? 1 : 3);
          var ck = (10 - sum % 10) % 10;
          ok = ck === Number(raw[12]);
        } else {
          type = 'ISBN-10';
          var s2 = 0;
          for (var j = 0; j < 9; j++) s2 += Number(raw[j]) * (10 - j);
          var ck2 = (11 - s2 % 11) % 11;
          var expect = ck2 === 10 ? 'X' : String(ck2);
          ok = expect === raw[9];
        }
        var h = '<div class="stat-grid">' +
          '<div class="stat-box"><div class="k">格式</div><div class="v" style="font-size:16px">' + type + '</div></div>' +
          '<div class="stat-box"><div class="k">校验结果</div><div class="v" style="font-size:16px;color:' + (ok ? 'var(--ok)' : 'var(--err)') + '">' + (ok ? '✓ 有效' : '✗ 无效') + '</div></div></div>';
        if (ok && raw.length === 13) {
          h += '<div class="panel" style="margin-top:10px;background:var(--bg-soft)"><h3>' + L('区段解析（仅供参考）', 'ISBN Segments') + '</h3>' +
            '<div class="chips">' +
            '<span class="chip">前缀 978/979（图书产品码）</span>' +
            '<span class="chip">注册组：' + raw.slice(3, 5) + '</span>' +
            '<span class="chip">校验位：' + raw[12] + '</span></div></div>';
        }
        out.innerHTML = h;
      }
      document.getElementById('isbnBtn').addEventListener('click', check);
      document.getElementById('isbnIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
      document.getElementById('isbnClear').addEventListener('click', function () {
        document.getElementById('isbnIn').value = '';
        document.getElementById('isbnOut').innerHTML = '';
      });
    }
  });

  /* ================= 图书：书单灵感 ================= */
  T.register({
    id: 'book-wish', cat: 'book', icon: '💡',
    name: '书单灵感', desc: '按类型速览经典书目，找书不再纠结',
    keywords: '书单 推荐 经典 必读 名著 科技 文学 历史 成长',
    render: function (host) {
      var groups = [
        ['经典文学', ['《百年孤独》加西亚·马尔克斯', '《活着》余华', '《平凡的世界》路遥', '《围城》钱钟书', '《呐喊》鲁迅', '《1984》乔治·奥威尔', '《小王子》圣埃克苏佩里']],
        ['科幻奇幻', ['《三体》刘慈欣', '《银河帝国》阿西莫夫', '《沙丘》赫伯特', '《基地》阿西莫夫', '《球状闪电》刘慈欣']],
        ['科技与思维', ['《浪潮之巅》吴军', '《人类简史》赫拉利', '《思考，快与慢》卡尼曼', '《黑天鹅》塔勒布', '《失控》凯文·凯利', '《代码大全》迈克康奈尔']],
        ['历史社科', ['《明朝那些事儿》当年明月', '《万历十五年》黄仁宇', '《枪炮、病菌与钢铁》戴蒙德', '《乡土中国》费孝通']],
        ['个人成长', ['《刻意练习》艾利克森', '《高效能人士的七个习惯》柯维', '《原子习惯》克利尔', '《被讨厌的勇气》岸见一郎', '《非暴力沟通》卢森堡']],
        ['财经商业', ['《穷查理宝典》查理·芒格', '《聪明的投资者》格雷厄姆', '《经济学原理》曼昆', '《纳瓦尔宝典》埃里克·乔根森']]
      ];
      var h = '';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g[0] + '</h3><div class="chips">';
        g[1].forEach(function (b) { h += '<span class="chip">' + esc(b) + '</span>'; });
        h += '</div></div>';
      });
      h += '<p class="note">书单为常见经典书目整理，供选书参考；同一本书可能有多个译本，可结合评分与试读选择。</p>';
      host.innerHTML = h;
    }
  });

  /* ================= 图书：阅读记录本 ================= */
  T.register({
    id: 'book-shelf', cat: 'book', icon: '📖',
    name: '阅读记录本', desc: '记录想读 / 在读 / 已读，自动统计阅读量',
    keywords: '阅读 记录 书架 读书 书单 想读 在读 已读 收藏',
    render: function (host) {
      var KEY = 'omnitool.bookshelf';
      var items = [];
      try { items = T.store.get('bookshelf', []); } catch (e) {}
      function save() { T.store.set('bookshelf', items); }
      function render() {
        var nWant = items.filter(function (i) { return i.st === 0; }).length;
        var nDoing = items.filter(function (i) { return i.st === 1; }).length;
        var nDone = items.filter(function (i) { return i.st === 2; }).length;
        var h = '<div class="panel"><h3>' + L('我的书架', 'My Shelf') + '</h3>' +
          '<div class="stat-grid" style="margin-bottom:12px">' +
          '<div class="stat-box"><div class="k">全部</div><div class="v">' + items.length + '<small>本</small></div></div>' +
          '<div class="stat-box"><div class="k">想读</div><div class="v" style="color:var(--ink-dim)">' + nWant + '</div></div>' +
          '<div class="stat-box"><div class="k">在读</div><div class="v" style="color:var(--warn)">' + nDoing + '</div></div>' +
          '<div class="stat-box"><div class="k">已读</div><div class="v" style="color:var(--ok)">' + nDone + '</div></div>' +
          '</div>' +
          '<div class="row">' +
          '<div class="field grow" style="margin-bottom:8px"><input id="bsName" placeholder="书名，如：三体" spellcheck="false"></div>' +
          '<div class="field" style="margin-bottom:8px"><select id="bsSt" style="width:110px"><option value="0">想读</option><option value="1">在读</option><option value="2">已读</option></select></div>' +
          '<div class="field" style="margin-bottom:8px"><button class="btn btn-primary" id="bsAdd">＋ 加入书架</button></div>' +
          '</div><p class="note">数据保存在本机；已读书目可在右侧标星评分。</p></div>';
        if (!items.length) {
          h += '<div class="empty"><b>书架是空的</b>输入书名点“加入书架”开始记录阅读</div>';
        } else {
          h += '<div class="list">';
          items.forEach(function (it, i) {
            var star = '';
            for (var s = 1; s <= 5; s++) star += '<span class="bs-star' + (s <= (it.rate || 0) ? ' on' : '') + '" data-rate="' + s + '" data-i="' + i + '">★</span>';
            h += '<div class="list-item" style="flex-wrap:wrap">' +
              '<span class="li-text"><b>' + esc(it.name) + '</b> <span class="badge ' + (it.st === 0 ? 'off' : (it.st === 1 ? 'net' : 'ok')) + '">' + ['想读', '在读', '已读'][it.st] + '</span></span>' +
              '<span style="flex:1"></span>' +
              (it.st === 2 ? '<span class="bs-stars">' + star + '</span>' : '') +
              '<button class="btn btn-ghost" data-move="' + i + '">' + (it.st < 2 ? '推进' : '') + '</button>' +
              '<button class="btn btn-ghost" data-del="' + i + '" title="删除">🗑</button></div>';
          });
          h += '</div>';
        }
        host.innerHTML = h;
        document.getElementById('bsAdd').addEventListener('click', function () { add(); });
        var ni = document.getElementById('bsName');
        if (ni) ni.addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });
        host.querySelectorAll('[data-move]').forEach(function (b) {
          b.addEventListener('click', function () {
            var i = Number(b.getAttribute('data-move'));
            if (items[i].st < 2) items[i].st++;
            save(); render();
          });
        });
        host.querySelectorAll('[data-del]').forEach(function (b) {
          b.addEventListener('click', function () {
            items.splice(Number(b.getAttribute('data-del')), 1);
            save(); render();
          });
        });
        host.querySelectorAll('.bs-star').forEach(function (sp) {
          sp.addEventListener('click', function () {
            var i = Number(sp.getAttribute('data-i'));
            items[i].rate = Number(sp.getAttribute('data-rate'));
            save(); render();
          });
        });
      }
      function add() {
        var n = document.getElementById('bsName').value.trim();
        if (!n) { T.toast('请输入书名'); return; }
        items.unshift({ name: n, st: Number(document.getElementById('bsSt').value), rate: 0 });
        save(); render();
      }
      render();
    }
  });
})();
