/* ============================================================
   万能工具箱 · GitHub 类工具（4 款：仓库 / 用户 / README / 命令速查）
   使用 GitHub 公开 API（无 key 每小时限 60 次）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  function fmtCount(n) {
    if (n == null) return '-';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
    return String(n);
  }
  function ghErr(e) {
    if (e && e.message && /403|rate limit|限流/i.test(e.message)) {
      return '请求被限流（GitHub 无 key 每小时限 60 次），请稍后再试。';
    }
    if (e && e.message && /404/.test(e.message)) return '未找到该资源，请检查名称拼写。';
    return (e && e.message) || '请求失败，请检查网络。';
  }

  /* ============ 仓库信息查询 ============ */
  T.register({
    id: 'gh-repo', icon: '🐙', cat: 'github', name: '仓库查询', net: true,
    netNote: '通过 GitHub 官方 API 查询仓库信息，无 token 每小时限 60 次。',
    desc: '查询 GitHub 仓库：Star / Fork / 语言 / 许可证',
    keywords: 'github 仓库 查询 repo star fork 语言 项目',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('GitHub 仓库查询', 'Repo Lookup') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>仓库（owner/repo）</label><input id="grInput" placeholder="例如：microsoft/vscode" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="grBtn">' + L('查询', 'Look up') + '</button></div>' +
        '</div>' +
        '<div id="grOut" style="margin-top:12px"></div>' +
        '<p class="note">数据来自 GitHub 公开 API，点击卡片可跳转仓库页面。</p>' +
      '</div>';
      function query() {
        var raw = document.getElementById('grInput').value.trim();
        if (!raw) { T.toast('请输入 owner/repo'); return; }
        var parts = raw.replace(/^https?:\/\/github\.com\//i, '').split('/');
        if (parts.length < 2) { T.toast('格式应为 owner/repo'); return; }
        var owner = parts[0], repo = parts[1].replace(/\.git$/, '');
        var out = document.getElementById('grOut');
        out.innerHTML = '<div class="msg">查询中…</div>';
        T.getJSON('https://api.github.com/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo), 10000).then(function (d) {
          var topics = (d.topics || []).slice(0, 8);
          var rows = [
            ['完整名称', d.full_name],
            ['描述', d.description || '-'],
            ['Star', fmtCount(d.stargazers_count)],
            ['Fork', fmtCount(d.forks_count)],
            ['Watch', fmtCount(d.subscribers_count)],
            ['主要语言', d.language || '-'],
            ['许可证', (d.license && d.license.spdx_id) || '无'],
            ['开放问题', d.open_issues_count],
            ['默认分支', d.default_branch],
            ['创建时间', (d.created_at || '').slice(0, 10)],
            ['最近更新', (d.updated_at || '').slice(0, 10)],
            ['首页', d.homepage || '-']
          ];
          var h = '<div class="stat-grid" style="margin-bottom:12px">' +
            '<div class="stat-box"><div class="k">Star</div><div class="v">' + fmtCount(d.stargazers_count) + '</div></div>' +
            '<div class="stat-box"><div class="k">Fork</div><div class="v">' + fmtCount(d.forks_count) + '</div></div>' +
            '<div class="stat-box"><div class="k">语言</div><div class="v" style="font-size:15px">' + T.esc(d.language || '-') + '</div></div>' +
            '<div class="stat-box"><div class="k">许可证</div><div class="v" style="font-size:15px">' + T.esc((d.license && d.license.spdx_id) || '-') + '</div></div>' +
            '</div>';
          if (topics.length) h += '<div class="chips" style="margin-bottom:12px">' + topics.map(function (t) { return '<span class="chip">' + T.esc(t) + '</span>'; }).join('') + '</div>';
          h += '<div class="table-wrap"><table class="kv">';
          rows.slice(0, 6).forEach(function (r) {
            h += '<tr><th>' + r[0] + '</th><td>' + T.esc(r[1]) + '</td></tr>';
          });
          h += '</table></div>';
          h += '<div class="row" style="margin-top:12px"><a class="btn btn-primary" href="' + d.html_url + '" target="_blank" rel="noopener noreferrer">打开仓库 ↗</a>' +
            (d.homepage ? '<a class="btn btn-ghost" href="' + d.homepage + '" target="_blank" rel="noopener noreferrer">访问主页 ↗</a>' : '') +
            '</div>';
          out.innerHTML = h;
        }, function (e) {
          out.innerHTML = '<div class="msg err">' + T.esc(ghErr(e)) + '</div>';
        });
      }
      document.getElementById('grBtn').addEventListener('click', query);
      document.getElementById('grInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') query();
      });
    }
  });

  /* ============ 用户信息查询 ============ */
  T.register({
    id: 'gh-user', icon: '👤', cat: 'github', name: '用户查询', net: true,
    netNote: '通过 GitHub 官方 API 查询用户公开信息。',
    desc: '查询 GitHub 用户：粉丝 / 仓库 / 个人简介',
    keywords: 'github 用户 查询 粉丝 following 个人资料 profile',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('GitHub 用户查询', 'User Lookup') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>用户名</label><input id="guInput" placeholder="例如：torvalds" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="guBtn">' + L('查询', 'Look up') + '</button></div>' +
        '</div>' +
        '<div id="guOut" style="margin-top:12px"></div>' +
        '<p class="note">数据来自 GitHub 公开 API。</p>' +
      '</div>';
      function query() {
        var u = document.getElementById('guInput').value.trim();
        if (!u) { T.toast('请输入用户名'); return; }
        var out = document.getElementById('guOut');
        out.innerHTML = '<div class="msg">查询中…</div>';
        T.getJSON('https://api.github.com/users/' + encodeURIComponent(u), 10000).then(function (d) {
          var h = '<div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">' +
            '<img src="' + d.avatar_url + '&s=160" alt="头像" style="width:88px;height:88px;border-radius:18px;border:1px solid var(--line)">' +
            '<div style="flex:1;min-width:200px">' +
              '<div style="font-size:20px;font-weight:700">' + T.esc(d.name || d.login) + ' <span class="muted" style="font-size:14px">@' + T.esc(d.login) + '</span></div>' +
              (d.bio ? '<p class="muted" style="margin-top:4px">' + T.esc(d.bio) + '</p>' : '') +
              (d.location ? '<p class="muted">📍 ' + T.esc(d.location) + '</p>' : '') +
              (d.company ? '<p class="muted">🏢 ' + T.esc(d.company) + '</p>' : '') +
              (d.blog ? '<p class="muted">🔗 <a href="' + T.esc(d.blog) + '" target="_blank" rel="noopener" style="color:var(--accent)">' + T.esc(d.blog) + '</a></p>' : '') +
            '</div></div>';
          h += '<div class="stat-grid" style="margin-top:16px">' +
            '<div class="stat-box"><div class="k">公开仓库</div><div class="v">' + fmtCount(d.public_repos) + '</div></div>' +
            '<div class="stat-box"><div class="k">粉丝</div><div class="v">' + fmtCount(d.followers) + '</div></div>' +
            '<div class="stat-box"><div class="k">关注</div><div class="v">' + fmtCount(d.following) + '</div></div>' +
            '<div class="stat-box"><div class="k">加入时间</div><div class="v" style="font-size:15px">' + (d.created_at || '').slice(0, 10) + '</div></div>' +
            '</div>';
          h += '<div class="row" style="margin-top:12px"><a class="btn btn-primary" href="' + d.html_url + '" target="_blank" rel="noopener noreferrer">打开主页 ↗</a></div>';
          out.innerHTML = h;
        }, function (e) {
          out.innerHTML = '<div class="msg err">' + T.esc(ghErr(e)) + '</div>';
        });
      }
      document.getElementById('guBtn').addEventListener('click', query);
      document.getElementById('guInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') query();
      });
    }
  });

  /* ============ README 预览 ============ */
  T.register({
    id: 'gh-readme', icon: '📃', cat: 'github', name: 'README 预览', net: true,
    netNote: '获取仓库 README 原始内容并本地渲染为简易预览。',
    desc: '获取并预览任意 GitHub 仓库的 README',
    keywords: 'github readme 预览 文档 渲染 markdown 说明',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('README 预览', 'README Preview') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>仓库（owner/repo）</label><input id="gr2Input" placeholder="例如：vuejs/core" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="gr2Btn">' + L('获取', 'Fetch') + '</button></div>' +
        '</div>' +
        '<div id="gr2Out" style="margin-top:12px"></div>' +
        '<p class="note">使用 GitHub raw 接口获取原文，简易渲染（标题/列表/代码/链接/图片）。图片与链接指向原仓库。</p>' +
      '</div>';
      function mdRender(md, base) {
        var lines = md.replace(/\r\n/g, '\n').split('\n');
        var html = '', inCode = false, codeBuf = [];
        function flushCode() {
          if (!codeBuf.length) return;
          html += '<pre class="out" style="white-space:pre;overflow:auto;max-height:260px">' + T.esc(codeBuf.join('\n')) + '</pre>';
          codeBuf = [];
        }
        lines.forEach(function (line) {
          if (/^```/.test(line)) {
            if (inCode) { flushCode(); inCode = false; }
            else { inCode = true; }
            return;
          }
          if (inCode) { codeBuf.push(line); return; }
          if (/^#{1,4} /.test(line)) {
            var lv = line.match(/^#+/)[0].length;
            html += '<h' + Math.min(lv + 1, 5) + ' style="margin:14px 0 6px;font-size:' + [0, 19, 16, 15, 14][lv] + 'px">' + T.esc(line.replace(/^#+\s*/, '')) + '</h' + Math.min(lv + 1, 5) + '>';
          } else if (/^\s*[-*] /.test(line)) {
            html += '<li style="margin-left:18px">' + inline(line.replace(/^\s*[-*]\s*/, ''), base) + '</li>';
          } else if (/^\s*\d+\. /.test(line)) {
            html += '<li style="margin-left:18px">' + inline(line.replace(/^\s*\d+\.\s*/, ''), base) + '</li>';
          } else if (/^\s*\|/.test(line)) {
            html += '<div class="muted" style="font-family:var(--mono);font-size:12px">' + T.esc(line) + '</div>';
          } else if (!line.trim()) {
            html += '<div style="height:8px"></div>';
          } else {
            html += '<p>' + inline(line, base) + '</p>';
          }
        });
        flushCode();
        return html;
      }
      function inline(s, base) {
        return T.esc(s)
          .replace(/`([^`]+)`/g, '<code style="background:var(--card-2);padding:1px 6px;border-radius:5px;font-family:var(--mono);font-size:12.5px">$1</code>')
          .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (m, a, u) {
            var full = /^https?:/i.test(u) ? u : base + u;
            return '<img src="' + full + '" alt="' + a + '" style="max-width:100%;border-radius:8px;border:1px solid var(--line)">';
          })
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, a, u) {
            var full = /^https?:/i.test(u) ? u : base + u;
            return '<a href="' + full + '" target="_blank" rel="noopener" style="color:var(--accent)">' + a + '</a>';
          })
          .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
          .replace(/\*([^*]+)\*/g, '<i>$1</i>');
      }
      document.getElementById('gr2Btn').addEventListener('click', function () {
        var raw = document.getElementById('gr2Input').value.trim();
        if (!raw) { T.toast('请输入 owner/repo'); return; }
        var parts = raw.replace(/^https?:\/\/github\.com\//i, '').split('/');
        if (parts.length < 2) { T.toast('格式应为 owner/repo'); return; }
        var out = document.getElementById('gr2Out');
        out.innerHTML = '<div class="msg">获取中…</div>';
        var repo = encodeURIComponent(parts[0]) + '/' + encodeURIComponent(parts[1].replace(/\.git$/, ''));
        T.fetchText('https://api.github.com/repos/' + repo + '/readme', 10000).then(function (txt) {
          var base = 'https://raw.githubusercontent.com/' + parts[0] + '/' + parts[1].replace(/\.git$/, '') + '/HEAD/';
          out.innerHTML = '<div class="panel" style="background:var(--bg-soft)">' + mdRender(txt, base) + '</div>' +
            '<div class="row" style="margin-top:10px"><button class="btn btn-ghost" id="gr2Raw">' + L('查看原文', 'View raw') + '</button></div>';
          document.getElementById('gr2Raw').addEventListener('click', function () {
            T.copyText(txt.slice(0, 50000));
          });
        }, function (e) {
          out.innerHTML = '<div class="msg err">' + T.esc(ghErr(e)) + '</div>';
        });
      });
      document.getElementById('gr2Input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('gr2Btn').click();
      });
    }
  });

  /* ============ GitHub 命令速查 ============ */
  T.register({
    id: 'gh-cheatsheet', icon: '📗', cat: 'github', name: 'GitHub 速查', net: false,
    desc: 'Git 与 GitHub 常用操作命令速查',
    keywords: 'github git 命令 速查 教程 常用 操作',
    render: function (host) {
      var groups = [
        ['本地仓库', [
          ['git init', '初始化仓库'],
          ['git status', '查看状态'],
          ['git add .', '暂存全部'],
          ['git commit -m "说明"', '提交'],
          ['git log --oneline -10', '查看最近提交'],
          ['git diff', '查看未暂存改动'],
          ['git diff --staged', '查看已暂存改动'],
          ['git reset HEAD <file>', '取消暂存'],
          ['git checkout -- <file>', '丢弃改动（慎用）']
        ]],
        ['分支操作', [
          ['git branch', '列出分支'],
          ['git branch <name>', '新建分支'],
          ['git checkout -b <name>', '新建并切换'],
          ['git switch <name>', '切换分支'],
          ['git merge <branch>', '合并分支'],
          ['git branch -d <name>', '删除分支'],
          ['git stash', '暂存现场'],
          ['git stash pop', '恢复现场']
        ]],
        ['远程协作', [
          ['git remote add origin <url>', '关联远程'],
          ['git clone <url>', '克隆仓库'],
          ['git pull', '拉取并合并'],
          ['git fetch', '拉取不合并'],
          ['git push', '推送'],
          ['git push -u origin main', '首次推送并关联'],
          ['git remote -v', '查看远程地址']
        ]],
        ['GitHub 流程', [
          ['Fork → Clone', '复制他人仓库到自己的账号'],
          ['git checkout -b feature', '新建功能分支'],
          ['git push origin feature', '推送功能分支'],
          ['Pull Request', '在 GitHub 网页发起合并请求'],
          ['Code Review', '在 PR 中审查与评论代码'],
          ['git pull origin main', '合并上游更新'],
          ['Issues / Projects', '任务与项目管理']
        ]],
        ['撤销与修复', [
          ['git commit --amend', '修改最后一次提交'],
          ['git reset --soft HEAD~1', '撤销提交保留改动'],
          ['git reset --hard HEAD~1', '撤销提交并丢弃改动（慎用）'],
          ['git revert <hash>', '生成反向提交（推荐）'],
          ['git rebase -i HEAD~3', '交互式整理提交'],
          ['git clean -fd', '清理未跟踪文件（慎用）']
        ]]
      ];
      var h = '';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g[0] + '</h3><div class="table-wrap"><table class="kv"><tr><th>命令</th><th>作用</th></tr>';
        g[1].forEach(function (r) {
          h += '<tr><td><span class="mono">' + T.esc(r[0]) + '</span></td><td>' + r[1] + '</td></tr>';
        });
        h += '</table></div></div>';
      });
      host.innerHTML = h;
    }
  });
})();
