/* ============================================================
   万能工具箱 · 搜索类工具（3 款：聚合搜索 / 搜索语法 / 网站导航）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 聚合搜索 ============ */
  T.register({
    id: 'search-agg', icon: '🔎', cat: 'search', name: '聚合搜索', net: false,
    desc: '一次输入，一键在多个搜索引擎 / 平台中搜索',
    keywords: '搜索 聚合 多引擎 百度 google bing 知乎 b站 搜索',
    render: function (host) {
      var engines = [
        ['百度', 'https://www.baidu.com/s?wd='], ['必应', 'https://www.bing.com/search?q='],
        ['Google', 'https://www.google.com/search?q='], ['搜狗', 'https://www.sogou.com/web?query='],
        ['知乎', 'https://www.zhihu.com/search?type=content&q='], ['B站', 'https://search.bilibili.com/all?keyword='],
        ['微博', 'https://s.weibo.com/weibo?q='], ['抖音', 'https://www.douyin.com/search/'],
        ['GitHub', 'https://github.com/search?q='], ['维基百科', 'https://zh.wikipedia.org/w/index.php?search='],
        ['小红书', 'https://www.xiaohongshu.com/search_result?keyword='], ['豆瓣', 'https://www.douban.com/search?q=']
      ];
      host.innerHTML =
      '<div class="panel"><h3>' + L('聚合搜索', 'Meta Search') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>关键词</label><input id="saQ" placeholder="输入要搜索的内容…" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="saAll">' + L('全部打开', 'Open all') + '</button></div>' +
        '</div>' +
        '<div class="nav-grid" id="saOut"></div>' +
        '<p class="note">点击单个站点在新标签页打开；“全部打开”会同时打开多个标签页（浏览器可能弹窗拦截，允许后即可）。部分平台需登录才能查看。</p>' +
      '</div>';
      function render() {
        var out = document.getElementById('saOut');
        out.innerHTML = engines.map(function (e) {
          return '<button class="link-card" data-url="' + e[1] + '">' +
            '<span class="lc-logo">🔍</span>' +
            '<span><span class="lc-name">' + e[0] + '</span><br><span class="lc-desc">在' + e[0] + '中搜索</span></span>' +
            '<span class="lc-arrow">↗</span></button>';
        }).join('');
      }
      function open(url) {
        var q = document.getElementById('saQ').value.trim();
        if (!q) { T.toast('请输入关键词'); return; }
        window.open(url + encodeURIComponent(q), '_blank', 'noopener');
      }
      document.getElementById('saOut').addEventListener('click', function (e) {
        var c = e.target.closest('[data-url]');
        if (c) open(c.getAttribute('data-url'));
      });
      document.getElementById('saAll').addEventListener('click', function () {
        var q = document.getElementById('saQ').value.trim();
        if (!q) { T.toast('请输入关键词'); return; }
        engines.forEach(function (e) { window.open(e[1] + encodeURIComponent(q), '_blank', 'noopener'); });
      });
      document.getElementById('saQ').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { var c = document.querySelector('#saOut .link-card'); if (c) open(c.getAttribute('data-url')); }
      });
      render();
    }
  });

  /* ============ 搜索语法速查 ============ */
  T.register({
    id: 'search-syntax', icon: '🎛️', cat: 'search', name: '搜索语法', net: false,
    desc: '搜索引擎高级指令速查（site / filetype / 引号等）',
    keywords: '搜索语法 高级搜索 指令 site filetype 技巧 google',
    render: function (host) {
      var rules = [
        ['site:域名', '限定在指定网站内搜索', 'site:github.com 万能工具箱'],
        ['filetype:类型', '只搜索指定文件类型', '学习笔记 filetype:pdf'],
        ['"关键词"', '精确匹配完整短语', '"2026 年科技趋势"'],
        ['关键词 -排除', '排除包含某词的页面', '手机 测评 -苹果'],
        ['intitle:词', '标题中包含该词', 'intitle:万能工具箱'],
        ['inurl:词', '网址中包含该词', '教程 inurl:guide'],
        ['OR', '匹配两个词中的任意一个', 'Python OR JavaScript 教程'],
        ['A 空格 B', '同时包含 A 和 B（默认 AND）', 'React 状态管理'],
        ['数字1..数字2', '搜索数字范围', '手机 1000..2000元'],
        ['related:域名', '寻找类似网站', 'related:zhihu.com'],
        ['缓存:域名', '查看网页快照（部分引擎支持）', 'cache:example.com'],
        ['通配符 *', '代替未知词（部分引擎支持）', '最佳 * 应用']
      ];
      var h = '<div class="panel"><h3>' + L('搜索语法速查', 'Search Syntax') + '（' + rules.length + '）</h3>';
      h += '<div class="table-wrap"><table class="kv"><tr><th>语法</th><th>作用</th><th>示例</th></tr>';
      rules.forEach(function (r) {
        h += '<tr><td><span class="mono">' + T.esc(r[0]) + '</span></td><td>' + r[1] + '</td><td><span class="mono" style="color:var(--ink-dim)">' + T.esc(r[2]) + '</span></td></tr>';
      });
      h += '</table></div><p class="note">各搜索引擎支持度略有差异：Google / 必应支持较全，百度支持 site / filetype / 引号等常用指令。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ============ 网站导航 ============ */
  T.register({
    id: 'site-nav', icon: '🗺️', cat: 'search', name: '网站导航', net: false,
    desc: '常用网站精选导航（搜索 / 新闻 / 购物 / 视频等）',
    keywords: '网站 导航 常用 网址 收藏 大全 书签',
    render: function (host) {
      var groups = [
        { name: '搜索与门户', items: [
          ['🔍', '百度', 'https://www.baidu.com'], ['🔍', '必应', 'https://www.bing.com'], ['🔍', 'Google', 'https://www.google.com'],
          ['📰', '今日头条', 'https://www.toutiao.com'], ['📰', '腾讯新闻', 'https://news.qq.com'], ['📰', '澎湃新闻', 'https://www.thepaper.cn']
        ]},
        { name: '视频影音', items: [
          ['▶️', '哔哩哔哩', 'https://www.bilibili.com'], ['▶️', '抖音', 'https://www.douyin.com'], ['▶️', '优酷', 'https://www.youku.com'],
          ['▶️', '爱奇艺', 'https://www.iqiyi.com'], ['▶️', '腾讯视频', 'https://v.qq.com'], ['▶️', 'YouTube', 'https://www.youtube.com']
        ]},
        { name: '购物电商', items: [
          ['🛒', '淘宝', 'https://www.taobao.com'], ['🛒', '京东', 'https://www.jd.com'], ['🛒', '拼多多', 'https://www.pinduoduo.com'],
          ['🛒', '天猫', 'https://www.tmall.com'], ['🛒', '闲鱼', 'https://www.goofish.com'], ['🛒', '苏宁', 'https://www.suning.com']
        ]},
        { name: '社交社区', items: [
          ['💬', '微博', 'https://weibo.com'], ['💬', '知乎', 'https://www.zhihu.com'], ['💬', '小红书', 'https://www.xiaohongshu.com'],
          ['💬', '豆瓣', 'https://www.douban.com'], ['💬', '虎扑', 'https://www.hupu.com'], ['💬', '天涯', 'https://www.tianya.cn']
        ]},
        { name: '学习工具', items: [
          ['📚', '中国大学MOOC', 'https://www.icourse163.org'], ['📚', '网易公开课', 'https://open.163.com'], ['📚', '学堂在线', 'https://www.xuetangx.com'],
          ['📚', 'Coursera', 'https://www.coursera.org'], ['📚', '维基百科', 'https://zh.wikipedia.org'], ['📚', '百度文库', 'https://wenku.baidu.com']
        ]},
        { name: '开发技术', items: [
          ['💻', 'GitHub', 'https://github.com'], ['💻', 'Stack Overflow', 'https://stackoverflow.com'], ['💻', 'MDN', 'https://developer.mozilla.org'],
          ['💻', '菜鸟教程', 'https://www.runoob.com'], ['💻', '掘金', 'https://juejin.cn'], ['💻', 'CSDN', 'https://www.csdn.net'],
          ['💻', 'npm', 'https://www.npmjs.com'], ['💻', 'Can I Use', 'https://caniuse.com'], ['💻', 'codepen', 'https://codepen.io']
        ]}
      ];
      var h = '';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g.name + '</h3><div class="nav-grid">';
        g.items.forEach(function (it) {
          h += '<a class="link-card" href="' + it[2] + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="lc-logo">' + it[0] + '</span><span><span class="lc-name">' + T.esc(it[1]) + '</span></span>' +
            '<span class="lc-arrow">↗</span></a>';
        });
        h += '</div></div>';
      });
      host.innerHTML = h;
    }
  });
})();
