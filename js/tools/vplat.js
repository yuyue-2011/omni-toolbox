/* ============================================================
   万能工具箱 v2.6 · 视频平台板块（5 款）
   平台导航 / 观影清单 / 平台对比 / 类型速查 / 视频提取下载器
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  var esc = T.esc;

  /* ================= 视频平台：平台导航 ================= */
  T.register({
    id: 'vplat-nav', cat: 'vplat', icon: '📺',
    name: '视频平台导航', desc: '国内外长视频 / 短视频 / 流媒体平台直达',
    keywords: '视频 平台 导航 影视 追剧 哔哩哔哩 腾讯 爱奇艺 优酷 抖音 快手 YouTube Netflix 流媒体',
    render: function (host) {
      var groups = [
        { t: '国内长视频', items: [
          { n: '哔哩哔哩', u: 'https://www.bilibili.com', d: '二次元 / 番剧 / 知识区', g: 'CN' },
          { n: '腾讯视频', u: 'https://v.qq.com', d: '剧集综艺，会员权益多', g: 'CN' },
          { n: '爱奇艺', u: 'https://www.iqiyi.com', d: '自制剧与院线电影', g: 'CN' },
          { n: '优酷', u: 'https://www.youku.com', d: '老牌长视频平台', g: 'CN' },
          { n: '芒果TV', u: 'https://www.mgtv.com', d: '综艺王牌平台', g: 'CN' },
          { n: '央视频', u: 'https://www.yangshipin.cn', d: '央视官方，新闻纪实', g: 'CN' },
          { n: '西瓜视频', u: 'https://www.ixigua.com', d: '中长视频与影视解说', g: 'CN' },
          { n: '咪咕视频', u: 'https://www.miguvideo.com', d: '体育赛事直播见长', g: 'CN' }
        ] },
        { t: '国内短视频', items: [
          { n: '抖音', u: 'https://www.douyin.com', d: '短视频头部平台', g: 'CN' },
          { n: '快手', u: 'https://www.kuaishou.com', d: '普惠短视频社区', g: 'CN' },
          { n: '微信视频号', u: 'https://channels.weixin.qq.com', d: '微信生态短视频', g: 'CN' },
          { n: '小红书', u: 'https://www.xiaohongshu.com', d: '生活方式短视频', g: 'CN' }
        ] },
        { t: '国际流媒体', items: [
          { n: 'YouTube', u: 'https://www.youtube.com', d: '全球最大视频平台', g: 'INT' },
          { n: 'Netflix', u: 'https://www.netflix.com', d: '全球流媒体巨头', g: 'INT' },
          { n: 'Disney+', u: 'https://www.disneyplus.com', d: '迪士尼 / 漫威 / 星战', g: 'INT' },
          { n: 'Prime Video', u: 'https://www.primevideo.com', d: '亚马逊流媒体', g: 'INT' },
          { n: 'HBO Max', u: 'https://www.max.com', d: '华纳精品剧集', g: 'INT' },
          { n: 'Twitch', u: 'https://www.twitch.tv', d: '游戏直播平台', g: 'INT' },
          { n: 'Vimeo', u: 'https://vimeo.com', d: '独立创作者视频社区', g: 'INT' }
        ] }
      ];
      var h = '<div class="panel"><h3>' + L('视频平台导航', 'Video Platforms') + '</h3><p class="note">点击直达官方平台，共 ' + groups.reduce(function (a, g) { return a + g.items.length; }, 0) + ' 个站点。</p>';
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

  /* ================= 视频平台：观影清单 ================= */
  T.register({
    id: 'vplat-watch', cat: 'vplat', icon: '🎬',
    name: '观影清单', desc: '追剧进度 / 想看与在看 / 本地追踪',
    keywords: '观影 清单 追剧 进度 剧集 电影 想看 在看 已看 待看',
    render: function (host) {
      var KEY = 'omnitool.vplat.watch';
      function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
      function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
      function render() {
        var list = load();
        var done = list.filter(function (x) { return x.done; }).length;
        var h = '<div class="panel"><h3>' + L('观影清单', 'Watchlist') + '</h3><p class="note">共 ' + list.length + ' 条，已完成 ' + done + ' 条' + (list.length ? '（完成率 ' + Math.round(done / list.length * 100) + '%）' : '') + '</p>' +
          '<div class="row"><input class="grow" id="vwTitle" placeholder="片名 / 剧名" style="min-width:140px" spellcheck="false">' +
          '<select id="vwCat" style="min-width:110px"><option value="剧集">剧集</option><option value="电影">电影</option><option value="综艺">综艺</option><option value="纪录片">纪录片</option><option value="动漫">动漫</option></select>' +
          '<select id="vwPlat"><option value="">平台不限</option><option>哔哩哔哩</option><option>腾讯视频</option><option>爱奇艺</option><option>优酷</option><option>芒果TV</option><option>抖音</option><option>YouTube</option><option>Netflix</option><option>Disney+</option><option>其他</option></select>' +
          '<select id="vwState"><option>想看</option><option>在看</option></select>' +
          '<button class="btn btn-primary" id="vwAdd">' + L('添加', 'Add') + '</button></div>' +
          '<div class="list" id="vwList">';
        if (!list.length) h += '<div class="empty"><b>还没有记录</b>添加想看或正在追的剧集 / 电影</div>';
        list.forEach(function (x, i) {
          h += '<div class="list-item' + (x.done ? ' done' : '') + '">' +
            '<span class="li-text"><b>' + esc(x.t) + '</b> <span class="badge net">' + esc(x.c) + '</span>' +
            (x.p ? ' <span class="badge off">' + esc(x.p) + '</span>' : '') +
            '<div class="li-sub">' + esc(x.s) + ' · ' + (x.time || '') + '</div></span>' +
            '<button class="btn btn-ghost" data-i="' + i + '" data-a="toggle">' + (x.done ? '重看' : '看完') + '</button>' +
            '<button class="btn btn-ghost" data-i="' + i + '" data-a="del">删</button></div>';
        });
        h += '</div></div>';
        host.innerHTML = h;
        host.querySelector('#vwAdd').addEventListener('click', function () {
          var t = host.querySelector('#vwTitle').value.trim();
          if (!t) { T.toast('请输入片名'); return; }
          var list2 = load();
          list2.unshift({ t: t, c: host.querySelector('#vwCat').value, p: host.querySelector('#vwPlat').value, s: host.querySelector('#vwState').value, time: new Date().toLocaleDateString('zh-CN'), done: false });
          save(list2);
          render();
        });
        host.querySelector('#vwList').addEventListener('click', function (e) {
          var b = e.target.closest('[data-a]');
          if (!b) return;
          var list3 = load();
          var i = Number(b.getAttribute('data-i'));
          if (b.getAttribute('data-a') === 'del') list3.splice(i, 1);
          else list3[i].done = !list3[i].done;
          save(list3);
          render();
        });
      }
      render();
    }
  });

  /* ================= 视频平台：平台对比 ================= */
  T.register({
    id: 'vplat-compare', cat: 'vplat', icon: '⚖️',
    name: '平台对比', desc: '主流视频平台特色 / 会员对比速查表',
    keywords: '平台 对比 会员 价格 特色 视频 腾讯 爱奇艺 优酷 B站 芒果 比较',
    render: function (host) {
      var rows = [
        ['哔哩哔哩', 'UGC + 番剧 + 知识', '大会员：番剧 / 电影 / 漫画', '弹幕文化浓厚，学习资源丰富'],
        ['腾讯视频', '剧集 / 综艺 / 体育', 'VIP：热剧抢先看', 'IP 版权多，NBA / 欧冠直播'],
        ['爱奇艺', '自制剧 / 电影', '黄金 VIP：全站影视', '迷雾剧场等自制口碑剧'],
        ['优酷', '剧集 / 港剧 / 电影', '酷喵 VIP', '港剧与经典老剧资源'],
        ['芒果TV', '综艺为主', '会员：综艺抢先看', '热门综艺（浪姐 / 明侦）'],
        ['央视频', '新闻 / 纪实 / 直播', '免费为主', '央视官方，权威内容'],
        ['抖音', '短视频 / 直播', '无硬性会员', '算法推荐强，直播带货'],
        ['YouTube', '全类型 UGC', 'Premium：去广告 + 后台播放', '全球创作者内容最全'],
        ['Netflix', '自制剧 / 电影', '三档订阅', '全球流媒体标杆，画质高'],
        ['Disney+', '迪士尼 / 漫威 / 星战', '订阅制', '家庭向内容强'],
        ['Prime Video', '电影 / 剧集', '随 Prime 会员附赠', '亚马逊生态绑定']
      ];
      var h = '<div class="panel"><h3>' + L('主流视频平台对比', 'Platform Compare') + '</h3><p class="note">会员价格随活动变化，以下仅为特色速查，价格请以各平台官网为准。</p>' +
        '<div class="table-wrap"><table class="kv"><tr><th>平台</th><th>内容特色</th><th>会员权益（参考）</th><th>备注</th></tr>';
      rows.forEach(function (r) {
        h += '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>';
      });
      h += '</table></div></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 视频平台：类型速查 ================= */
  T.register({
    id: 'vplat-type', cat: 'vplat', icon: '🏷️',
    name: '类型速查', desc: '影视分级 / 常用术语 / 片长分类速查',
    keywords: '类型 分级 术语 影视 电影 剧集 分集 蓝光 4K 分辨率 帧率 时长',
    render: function (host) {
      var segs = [
        { t: '常见分级（参考）', items: [
          ['G', '大众级，任何年龄可看'],
          ['PG', '建议家长陪同'],
          ['PG-13', '13 岁以下需家长指导'],
          ['R', '17 岁以下需家长陪同'],
          ['NC-17', '17 岁以下禁止观看'],
          ['内地电影分级', '内地尚未正式分级，以审查上映为准']
        ] },
        { t: '画质与格式', items: [
          ['480P', '标清，约 854×480'],
          ['720P', '高清 HD，1280×720'],
          ['1080P', '全高清 FHD，1920×1080'],
          ['4K UHD', '超高清，3840×2160'],
          ['HDR', '高动态范围，明暗细节更好'],
          ['蓝光原盘', '无损画质，体积大']
        ] },
        { t: '常见术语', items: [
          ['追剧', '按集追看连载剧集'],
          ['养肥再看', '等剧集更完再一次性看'],
          ['二刷 / N 刷', '重复观看'],
          ['番剧', '日本动画剧集'],
          ['弹幕', '实时评论字幕，B 站特色'],
          ['片头曲 OP', 'Opening，片头主题曲'],
          ['片尾曲 ED', 'Ending，片尾主题曲'],
          ['高能预警', '前方剧情高能提醒']
        ] }
      ];
      var h = '<div class="panel"><h3>' + L('影视类型速查', 'Genres') + '</h3><p class="note">观影 / 追剧常用概念速查表，纯本地数据。</p>';
      segs.forEach(function (s) {
        h += '<div class="set-sub">' + esc(s.t) + '</div><div class="table-wrap"><table class="kv">';
        s.items.forEach(function (it) {
          h += '<tr><td style="width:38%"><b>' + esc(it[0]) + '</b></td><td>' + esc(it[1]) + '</td></tr>';
        });
        h += '</table></div>';
      });
      h += '</div>';
      host.innerHTML = h;
    }
  });

  /* ================= 视频平台：提取下载器 ================= */
  T.register({
    id: 'vplat-get', cat: 'vplat', icon: '⬇️',
    name: '视频提取下载器', desc: '识别视频链接并给出对应平台下载方案',
    keywords: '视频 提取 下载 解析 链接 无水印 抖音 B站 YouTube 工具 命令',
    render: function (host) {
      var PLATS = [
        { re: /bilibili\.com|b23\.tv/, n: '哔哩哔哩', t: '国内长视频', way: 'B 站客户端 / 唧唧Down / BBDown（GitHub 开源）', cmd: 'BBDown "链接"' },
        { re: /douyin\.com|iesdouyin\.com/, n: '抖音', t: '国内短视频', way: '抖音 App 分享到“保存本地” / 网页版右键另存 / 第三方无水印解析站', cmd: 'yt-dlp --no-playlist "链接"' },
        { re: /kuaishou\.com|gifshow\.com/, n: '快手', t: '国内短视频', way: '快手 App 内“保存本地” / 解析工具', cmd: 'yt-dlp --no-playlist "链接"' },
        { re: /ixigua\.com/, n: '西瓜视频', t: '国内中长视频', way: '西瓜视频网页播放器右键 / 解析工具', cmd: 'yt-dlp --no-playlist "链接"' },
        { re: /xiaohongshu\.com|xhslink\.com/, n: '小红书', t: '生活方式短视频', way: '小红书 App“保存到相册”（原声）', cmd: '—' },
        { re: /weibo\.com|weibo\.cn/, n: '微博', t: '社交媒体短视频', way: '微博 App 长按视频保存', cmd: '—' },
        { re: /youtube\.com|youtu\.be/, n: 'YouTube', t: '国际流媒体', way: 'yt-dlp / 在线解析站 / 浏览器插件（如 Video DownloadHelper）', cmd: 'yt-dlp -f "bv*+ba/b" "链接"' },
        { re: /twitter\.com|x\.com/, n: 'X / Twitter', t: '社交媒体视频', way: 'yt-dlp / 在线解析站', cmd: 'yt-dlp --no-playlist "链接"' },
        { re: /instagram\.com|instagr\.am/, n: 'Instagram', t: '社交短视频', way: 'yt-dlp / 在线解析站', cmd: 'yt-dlp "链接"' },
        { re: /facebook\.com|fb\.watch/, n: 'Facebook', t: '社交视频', way: 'yt-dlp / 在线解析站', cmd: 'yt-dlp "链接"' },
        { re: /tiktok\.com/, n: 'TikTok', t: '国际短视频', way: 'TikTok 水印可被多数解析站去除，注意版权', cmd: 'yt-dlp --no-playlist "链接"' },
        { re: /vimeo\.com/, n: 'Vimeo', t: '创作者视频', way: 'Vimeo 官方下载按钮（作者开启时）', cmd: 'yt-dlp "链接"' },
        { re: /mgtv\.com/, n: '芒果TV', t: '国内长视频', way: '芒果TV 客户端缓存 / 第三方工具', cmd: '—' },
        { re: /iqiyi\.com|iq\.com/, n: '爱奇艺', t: '国内长视频', way: '爱奇艺客户端“下载”按钮（VIP 支持）', cmd: '—' },
        { re: /v\.qq\.com/, n: '腾讯视频', t: '国内长视频', way: '腾讯视频客户端“缓存”/“下载”', cmd: '—' },
        { re: /youku\.com/, n: '优酷', t: '国内长视频', way: '优酷客户端下载', cmd: '—' }
      ];
      var h = '<div class="panel"><h3>' + L('视频提取下载器', 'Video Extractor') + '</h3>' +
        '<p class="note">粘贴视频页面链接，自动识别平台并给出对应的提取 / 下载方案（本地识别，不上传链接）。</p>' +
        '<div class="field"><input id="vgUrl" type="url" placeholder="粘贴视频链接，如 https://www.bilibili.com/video/BV1xx…" spellcheck="false"></div>' +
        '<div class="row"><div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="vgDetect">' + L('识别链接', 'Parse URL') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="vgCopyCmd">' + L('复制下载命令', 'Copy cmd') + '</button></div></div>' +
        '<div id="vgResult" class="note"></div>' +
        '<div class="set-sub" style="margin-top:16px">通用工具（支持多数平台）</div>' +
        '<div class="site-grid">' +
        '<a class="site-card" href="https://github.com/yt-dlp/yt-dlp" target="_blank" rel="noopener noreferrer"><b>yt-dlp <span class="badge off">国际</span></b><span>命令行下载器，支持 1000+ 站点</span><i>github.com/yt-dlp/yt-dlp</i></a>' +
        '<a class="site-card" href="https://github.com/nilaoda/BBDown" target="_blank" rel="noopener noreferrer"><b>BBDown <span class="badge off">国际</span></b><span>B 站视频一键下载（开源）</span><i>github.com/nilaoda/BBDown</i></a>' +
        '<a class="site-card" href="https://downloader.la/" target="_blank" rel="noopener noreferrer"><b>Downloader.la <span class="badge off">国际</span></b><span>YouTube 在线下载</span><i>downloader.la</i></a>' +
        '<a class="site-card" href="https://www.xiazai001.com/" target="_blank" rel="noopener noreferrer"><b>下载之家 <span class="badge net">国内</span></b><span>国内视频下载工具导航</span><i>xiazai001.com</i></a>' +
        '</div>' +
        '<p class="note">⚠️ 请仅下载你有权获取的内容，遵守平台规则与版权法规；网页抓取受浏览器安全策略限制，本工具提供方案与命令，不直接抓取视频流。</p>' +
        '</div>';
      host.innerHTML = h;
      var last = null;
      document.getElementById('vgDetect').addEventListener('click', function () {
        var url = document.getElementById('vgUrl').value.trim();
        var out = document.getElementById('vgResult');
        if (!url) { T.toast('请先粘贴视频链接'); return; }
        var hit = null;
        for (var i = 0; i < PLATS.length; i++) {
          if (PLATS[i].re.test(url)) { hit = PLATS[i]; break; }
        }
        if (!hit) {
          out.innerHTML = '<div class="msg">未能识别平台，试试通用工具：yt-dlp 支持 1000+ 站点。</div>';
          last = null;
          return;
        }
        last = hit;
        out.innerHTML =
          '<div class="msg ok">已识别：<b>' + esc(hit.n) + '</b>（' + esc(hit.t) + '）</div>' +
          '<div class="table-wrap" style="margin-top:10px"><table class="kv">' +
          '<tr><td style="width:30%">提取方案</td><td>' + esc(hit.way) + '</td></tr>' +
          '<tr><td>下载命令</td><td style="font-family:var(--mono)">' + esc(hit.cmd) + '</td></tr>' +
          '</table></div>';
      });
      document.getElementById('vgCopyCmd').addEventListener('click', function () {
        if (!last) { T.toast('请先识别链接'); return; }
        T.copyText(last.cmd.replace(/^—$/, 'yt-dlp "视频链接"'));
        T.toast('命令已复制');
      });
    }
  });
})();
