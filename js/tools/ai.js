/* ============================================================
   万能工具箱 · AI 类工具（5 款：提示词库/生成器/文本助手/导航/技巧）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  var PROMPT_LIB = [
    { c: '写作', t: '公众号文章', p: '你是一位资深公众号编辑。请围绕【主题】写一篇 1200 字左右的文章，要求：标题吸引人、开头有钩子、段落清晰、结尾有行动号召。输出完整成稿。' },
    { c: '写作', t: '小红书笔记', p: '你是小红书爆款笔记写手。请为【产品/主题】写一篇种草笔记：标题带 emoji、正文口语化、包含 3 个以上痛点共鸣点、结尾引导互动，并给出 5 个备选标题。' },
    { c: '写作', t: '工作总结', p: '请把我的工作内容整理成结构化总结：分为【工作概述】【主要成果】【问题与反思】【下月计划】四个部分，语言正式简洁，量化成果尽量用数字。' },
    { c: '写作', t: '邮件撰写', p: '帮我写一封【邮件类型】邮件，收件人是【对象】，要点包括：【要点】。语气【正式/亲切】。' },
    { c: '写作', t: '演讲稿', p: '请写一篇 3 分钟的演讲稿，主题是【主题】，面向【听众】，要求有开场白、核心观点（3 个）、金句结尾，语言有感染力。' },
    { c: '编程', t: '代码审查', p: '请审查以下代码：指出 Bug、安全隐患、性能问题与可读性问题，按严重程度排序，并给出修改后的代码。' },
    { c: '编程', t: '代码解释', p: '请逐段解释以下代码的作用与逻辑，并说明每行的关键点，用初学者能听懂的语言。' },
    { c: '编程', t: 'Debug 助手', p: '我遇到了这个报错：【报错信息】。相关代码：【代码】。请分析可能原因并给出修复方案，按可能性排序。' },
    { c: '编程', t: 'SQL 生成', p: '我有一个数据表，结构是：【表结构】。请帮我写出满足以下需求的 SQL：【需求】。' },
    { c: '编程', t: '代码注释', p: '请为以下代码添加中文注释：解释函数用途、参数含义、关键逻辑与边界情况。' },
    { c: '学习', t: '概念解释', p: '请用简单易懂的语言解释【概念】，并用一个生活中的类比帮助理解，最后给出 3 个自测问题。' },
    { c: '学习', t: '知识总结', p: '请将以下内容总结为要点式笔记：提取核心观点、关键数据、行动建议，保留原意不遗漏重要信息。' },
    { c: '学习', t: '费曼学习', p: '假设我要给一个完全不懂的人讲【主题】，请把它拆解成 5 个递进步骤，每步给出通俗解释和例子。' },
    { c: '学习', t: '错题解析', p: '请解析这道题：【题目】。我的答案是：【答案】。请指出错误原因、正确解法，并给一道同类练习题。' },
    { c: '职场', t: '面试模拟', p: '请模拟【岗位】面试官，依次问我 8 个高频问题，每问完一题等我回答后给出点评和改进建议。' },
    { c: '职场', t: '简历优化', p: '请优化这段简历描述：【原文】。要求：用 STAR 法则改写、量化成果、突出技能与影响，控制在 3 行以内。' },
    { c: '职场', t: '会议纪要', p: '请将以下会议内容整理成纪要：【内容】。输出：会议主题、时间、参会人、决议事项、待办（含负责人与截止时间）。' },
    { c: '职场', t: '向上汇报', p: '请把以下进展改写成一条 30 秒的向上汇报：先说结论、再列关键数据、最后给出需要的支持。【内容】' },
    { c: '营销', t: '产品卖点', p: '请为【产品】提炼 5 个差异化卖点，每个卖点给出一句用户视角的利益表达（说明对用户的好处）。' },
    { c: '营销', t: '广告文案', p: '请为【产品/活动】写 3 组广告文案（标题+正文），分别适合：公众号、短视频口播、朋友圈，语气各有侧重。' },
    { c: '营销', t: '用户画像', p: '请根据【产品/行业】构建 3 类典型用户画像：基本信息、痛点、目标、触媒习惯、购买决策因素。' },
    { c: '生活', t: '健康建议', p: '我最近【症状/状况】。请给我一些一般性的生活与饮食建议（仅科普，不替代就医），并提示什么情况应去看医生。' },
    { c: '生活', t: '旅游规划', p: '我计划去【目的地】玩【天数】天，预算【金额】。请给出每日行程安排、住宿建议、美食推荐与注意事项。' },
    { c: '生活', t: '礼物推荐', p: '我要送【对象/关系】一件【预算】元左右的礼物，对方喜欢【喜好】。请推荐 5 个具体选项并说明理由。' },
    { c: '角色', t: '英语老师', p: '请扮演一名耐心的英语老师。我会说一句中文，请给我：英文翻译、发音提示、两个同义表达，并用英文例句展示用法。' },
    { c: '角色', t: '私人教练', p: '请扮演健身私教。我的目标是【目标】，当前水平【水平】。请给我一份每周训练计划、动作要点与饮食建议。' },
    { c: '角色', t: '生涯顾问', p: '请扮演职业规划顾问。我的背景：【背景】。请帮我分析 3 条可能的职业路径，各列出优劣与准备建议。' },
    { c: '角色', t: '心理咨询师', p: '请以温和专业的心理咨询师口吻回应我的困扰：【困扰】。先共情，再帮我梳理情绪和可行的小步骤。' },
    { c: '通用', t: '翻译润色', p: '请将以下内容翻译成【目标语言】，保持原文语气与风格，并给出一个更自然的润色版本：【内容】' },
    { c: '通用', t: '头脑风暴', p: '请针对【主题】进行头脑风暴，给出 15 个不同角度的创意，每个一句话，尽量发散、避免常规答案。' },
    { c: '通用', t: '决策分析', p: '我需要做决定：【问题】。我的选项是：【选项】。请按：目标拆解、各选项利弊、风险评估、推荐方案四个层次帮我分析。' },
    { c: '通用', t: '长文摘要', p: '请用 3 句话概括以下长文的核心内容，再用 5 个要点列出关键信息：【内容】' }
  ];

  /* ============ Prompt 模板库 ============ */
  T.register({
    id: 'prompt-lib', icon: '📚', cat: 'ai', name: 'Prompt 模板库', net: false,
    desc: '内置 30+ 精选提示词模板，可搜索复制与自定义',
    keywords: 'prompt 提示词 模板 AI 提问 指令 咒语',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('提示词模板库', 'Prompt Library') + '</h3>' +
        '<input id="plSearch" placeholder="' + L('搜索模板（如：写作、代码、面试）…', 'Search prompts (writing, code, interview…)…') + '" spellcheck="false">' +
        '<div id="plCat" class="chips"></div>' +
        '<div id="plOut" style="margin-top:12px"></div>' +
      '</div>';
      var cats = ['全部'].concat(PROMPT_LIB.map(function (p) { return p.c; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      var curCat = '全部';
      function renderChips() {
        var el = document.getElementById('plCat');
        el.innerHTML = cats.map(function (c) {
          return '<button class="chip' + (c === curCat ? '' : ' dim') + '" data-c="' + c + '">' + c + '</button>';
        }).join('');
      }
      function render() {
        var q = (document.getElementById('plSearch').value || '').trim().toLowerCase();
        var list = PROMPT_LIB.filter(function (p) {
          return (curCat === '全部' || p.c === curCat) &&
            (!q || (p.c + p.t + p.p).toLowerCase().indexOf(q) >= 0);
        });
        var h = '<div class="list">';
        list.forEach(function (p) {
          h += '<div class="list-item" style="flex-direction:column;align-items:stretch;gap:8px">' +
            '<div style="display:flex;align-items:center;gap:8px"><span class="chip">' + p.c + '</span><b style="font-size:14px">' + T.esc(p.t) + '</b>' +
            '<button class="btn btn-ghost copy-btn" style="margin-left:auto;min-height:30px;height:30px;padding:0 12px;font-size:12px">' + L('复制', 'Copy') + '</button></div>' +
            '<div class="muted" style="margin:0;white-space:pre-wrap">' + T.esc(p.p) + '</div>' +
          '</div>';
        });
        h += '</div>';
        if (!list.length) h = '<div class="empty"><b>没有匹配的模板</b></div>';
        document.getElementById('plOut').innerHTML = h;
        document.getElementById('plOut').querySelectorAll('.copy-btn').forEach(function (b, i) {
          b.addEventListener('click', function () { T.copyText(list[i].p); });
        });
      }
      document.getElementById('plSearch').addEventListener('input', render);
      document.getElementById('plCat').addEventListener('click', function (e) {
        var c = e.target.closest('[data-c]');
        if (c) { curCat = c.getAttribute('data-c'); renderChips(); render(); }
      });
      renderChips();
      render();
    }
  });

  /* ============ 提示词生成器 ============ */
  T.register({
    id: 'prompt-builder', icon: '🧱', cat: 'ai', name: '提示词生成器', net: false,
    desc: '按角色 / 任务 / 要求组装结构化提示词',
    keywords: '提示词 生成 组装 prompt 结构化 角色 任务',
    render: function (host) {
      var roles = ['资深专家', '写作编辑', '程序员', '数据分析师', '营销策划', '老师', '翻译', '设计师'];
      var tasks = ['撰写', '改写润色', '总结提炼', '分析解读', '头脑风暴', '翻译', '生成代码', '制定计划', '解答问题', '模拟对话'];
      var reqs = ['条理清晰，分点输出', '语言简洁，去掉废话', '给出 3 个备选方案', '附上具体例子', '标注重要与风险', '结尾给出下一步建议'];
      host.innerHTML =
      '<div class="panel"><h3>' + L('结构化提示词生成', 'Prompt Builder') + '</h3>' +
        '<div class="row">' +
          '<div class="field"><label>角色</label><select id="pbRole">' + roles.map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select></div>' +
          '<div class="field"><label>任务</label><select id="pbTask">' + tasks.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select></div>' +
        '</div>' +
        '<div class="field"><label>' + L('主题 / 对象（必填）', 'Topic (required)') + '</label><input id="pbTopic" placeholder="' + L('例如：夏日防晒霜产品介绍', 'e.g. summer sunscreen product intro') + '" spellcheck="false"></div>' +
        '<div class="field"><label>' + L('背景补充（可选）', 'Context (optional)') + '</label><textarea id="pbCtx" class="short" placeholder="' + L('目标读者、使用场景、风格偏好等', 'Audience, use case, style preferences…') + '"></textarea></div>' +
        '<div class="field"><label>附加要求</label><div id="pbReqs" class="chips">' + reqs.map(function (r, i) {
          return '<button class="chip' + (i < 2 ? '' : ' dim') + '" data-i="' + i + '">' + r + '</button>';
        }).join('') + '</div></div>' +
        '<div class="row"><button class="btn btn-primary" id="pbGen">' + L('生成提示词', 'Generate') + '</button>' +
        '<button class="btn btn-ghost" id="pbCopy">' + L('复制结果', 'Copy') + '</button></div>' +
        '<div class="out" id="pbOut" style="margin-top:14px;min-height:90px">点击“生成提示词”后在此显示完整提示词。</div>' +
      '</div>';
      var selected = {};
      document.getElementById('pbReqs').addEventListener('click', function (e) {
        var c = e.target.closest('[data-i]');
        if (!c) return;
        var i = c.getAttribute('data-i');
        if (selected[i]) { delete selected[i]; c.classList.add('dim'); }
        else { selected[i] = true; c.classList.remove('dim'); }
      });
      function build() {
        var role = document.getElementById('pbRole').value;
        var task = document.getElementById('pbTask').value;
        var topic = document.getElementById('pbTopic').value.trim();
        if (!topic) { T.toast('请填写主题 / 对象'); return ''; }
        var lines = [];
        lines.push('你是一名' + role + '。请【' + task + '】「' + topic + '」。');
        var ctx = document.getElementById('pbCtx').value.trim();
        if (ctx) lines.push('背景信息：' + ctx);
        var sel = Object.keys(selected).map(Number).sort(function (a, b) { return a - b; }).map(function (i) { return reqs[i]; });
        if (sel.length) lines.push('要求：' + sel.join('；') + '。');
        return lines.join('\n');
      }
      document.getElementById('pbGen').addEventListener('click', function () {
        var p = build();
        if (p) document.getElementById('pbOut').textContent = p;
      });
      document.getElementById('pbCopy').addEventListener('click', function () {
        var p = document.getElementById('pbOut').textContent;
        if (!p || p.indexOf('生成提示词') >= 0) { T.toast('请先生成'); return; }
        T.copyText(p);
      });
    }
  });

  /* ============ AI 文本助手（本地规则引擎） ============ */
  T.register({
    id: 'ai-rewrite', icon: '✍️', cat: 'ai', name: '文本智能处理', net: false,
    desc: '本地规则引擎：摘要 / 关键词 / 句子清洗整理',
    keywords: '文本处理 摘要 关键词 提取 清洗 润色 改写',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('文本智能处理（本地规则引擎）', 'Smart Text (local rules)') + '</h3>' +
        '<div class="field"><textarea id="awIn" placeholder="' + L('粘贴一段文字…', 'Paste some text…') + '" style="min-height:160px"></textarea></div>' +
        '<div class="row">' +
          '<button class="btn btn-primary" id="awSum">智能摘要</button>' +
          '<button class="btn btn-ghost" id="awKw">关键词提取</button>' +
          '<button class="btn btn-ghost" id="awClean">清洗整理</button>' +
          '<button class="btn btn-ghost" id="awStat">句子统计</button>' +
        '</div>' +
        '<div id="awOut" class="out" style="margin-top:14px;min-height:80px">选择上方操作，结果在此显示。全部在本机完成，不会上传文本。</div>' +
      '</div>';
      function getText() {
        var s = document.getElementById('awIn').value;
        if (!s.trim()) { T.toast('请先输入文本'); return null; }
        return s;
      }
      function sentences(s) {
        return s.replace(/\s+/g, ' ').split(/(?<=[。！？!?；;])/).map(function (x) { return x.trim(); }).filter(function (x) { return x.length > 1; });
      }
      function freqMap(arr) {
        var m = {};
        arr.forEach(function (w) { m[w] = (m[w] || 0) + 1; });
        return m;
      }
      document.getElementById('awSum').addEventListener('click', function () {
        var s = getText(); if (!s) return;
        var sents = sentences(s);
        var words = s.toLowerCase().match(/[\u4e00-\u9fa5]{2,}|[a-z0-9]{3,}/g) || [];
        var f = freqMap(words);
        var scored = sents.map(function (st) {
          var w = st.toLowerCase().match(/[\u4e00-\u9fa5]{2,}|[a-z0-9]{3,}/g) || [];
          var score = 0;
          w.forEach(function (x) { if (f[x] > 1) score += f[x]; });
          return { st: st, score: score, pos: sents.indexOf(st) };
        });
        scored.sort(function (a, b) { return b.score - a.score || a.pos - b.pos; });
        var top = scored.slice(0, Math.min(3, scored.length)).sort(function (a, b) { return a.pos - b.pos; });
        document.getElementById('awOut').innerHTML = top.length
          ? top.map(function (t) { return '▸ ' + T.esc(t.st); }).join('<br><br>')
          : '<span class="muted">文本太短，无法提取摘要。</span>';
      });
      document.getElementById('awKw').addEventListener('click', function () {
        var s = getText(); if (!s) return;
        var words = s.toLowerCase().match(/[\u4e00-\u9fa5]{2,4}|[a-z0-9]{3,}/g) || [];
        var f = freqMap(words);
        var arr = Object.keys(f).map(function (k) { return { w: k, c: f[k] }; })
          .sort(function (a, b) { return b.c - a.c; }).slice(0, 20);
        var max = arr.length ? arr[0].c : 1;
        document.getElementById('awOut').innerHTML = arr.length
          ? arr.map(function (a) {
              var pct = Math.round(a.c / max * 100);
              return '<div style="display:flex;align-items:center;gap:10px;margin:4px 0;font-size:13.5px"><span style="width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink-faint)">' + T.esc(a.w) + '</span>' +
                '<span style="flex:1;height:14px;background:var(--card-2);border-radius:4px;overflow:hidden"><i style="display:block;height:100%;width:' + pct + '%;background:var(--accent)"></i></span>' +
                '<span style="width:28px;color:var(--ink-dim);font-family:var(--mono)">' + a.c + '</span></div>';
            }).join('')
          : '<span class="muted">未提取到关键词。</span>';
      });
      document.getElementById('awClean').addEventListener('click', function () {
        var s = getText(); if (!s) return;
        var out = s
          .replace(/[ \t]+/g, ' ')
          .replace(/ *\n{3,}/g, '\n\n')
          .replace(/[，,]+(?=[，,])/g, '')
          .replace(/[。．](?=[”"』」』])/g, '。')
          .replace(/[ \t]+(?=[，。！？；：,.!?;:])/g, '')
          .replace(/[ \t]+$/gm, '')
          .replace(/^\s+/gm, '')
          .trim();
        document.getElementById('awOut').textContent = out;
      });
      document.getElementById('awStat').addEventListener('click', function () {
        var s = getText(); if (!s) return;
        var sents = sentences(s);
        var paras = s.split(/\n+/).filter(function (x) { return x.trim(); });
        var cjk = (s.match(/[\u4e00-\u9fa5]/g) || []).length;
        var words = (s.match(/[a-z0-9]+/gi) || []).length;
        var chars = s.replace(/\s/g, '').length;
        document.getElementById('awOut').innerHTML =
          '<div class="stat-grid">' +
          '<div class="stat-box"><div class="k">句子数</div><div class="v">' + sents.length + '</div></div>' +
          '<div class="stat-box"><div class="k">段落数</div><div class="v">' + paras.length + '</div></div>' +
          '<div class="stat-box"><div class="k">中文字数</div><div class="v">' + cjk + '</div></div>' +
          '<div class="stat-box"><div class="k">英文单词</div><div class="v">' + words + '</div></div>' +
          '<div class="stat-box"><div class="k">总字符</div><div class="v">' + chars + '</div></div>' +
          '</div>';
      });
    }
  });

  /* ============ AI 工具导航 ============ */
  T.register({
    id: 'ai-nav', icon: '🧭', cat: 'ai', name: 'AI 工具导航', net: false,
    desc: '精选主流 AI 工具网站导航（点击跳转）',
    keywords: 'AI 导航 网站 工具 ChatGPT Claude 豆包 文心 通义 网址',
    render: function (host) {
      var groups = [
        { name: '对话助手', items: [
          ['💬', 'ChatGPT', 'OpenAI 对话助手', 'https://chat.openai.com'],
          ['💬', 'Claude', 'Anthropic 对话助手', 'https://claude.ai'],
          ['💬', 'Gemini', 'Google 多模态助手', 'https://gemini.google.com'],
          ['💬', '豆包', '字节跳动 AI 助手', 'https://www.doubao.com'],
          ['💬', 'DeepSeek', '深度求索对话模型', 'https://chat.deepseek.com'],
          ['💬', 'Kimi', '月之暗面长文本助手', 'https://kimi.moonshot.cn'],
          ['💬', '文心一言', '百度大模型助手', 'https://yiyan.baidu.com'],
          ['💬', '通义千问', '阿里大模型助手', 'https://tongyi.aliyun.com'],
          ['💬', '讯飞星火', '科大讯飞对话助手', 'https://xinghuo.xfyun.cn']
        ]},
        { name: '图像创作', items: [
          ['🎨', 'Midjourney', 'AI 绘画', 'https://www.midjourney.com'],
          ['🎨', '即梦', '字节 AI 图像视频创作', 'https://jimeng.jianying.com'],
          ['🎨', '可灵', '快手 AI 视频创作', 'https://klingai.com'],
          ['🎨', 'Stable Diffusion', '开源图像生成', 'https://stability.ai'],
          ['🎨', 'Leonardo.ai', '游戏美术生成', 'https://leonardo.ai']
        ]},
        { name: '编程开发', items: [
          ['💻', 'GitHub Copilot', 'AI 代码助手', 'https://github.com/features/copilot'],
          ['💻', 'Cursor', 'AI 代码编辑器', 'https://cursor.com'],
          ['💻', 'Codeium', '免费代码补全', 'https://codeium.com'],
          ['💻', 'Replit', '云端 AI 开发环境', 'https://replit.com']
        ]},
        { name: '效率办公', items: [
          ['📊', 'Notion AI', 'AI 笔记协作', 'https://www.notion.so'],
          ['📊', 'Gamma', 'AI 生成演示文稿', 'https://gamma.app'],
          ['📊', '通义听悟', 'AI 音视频转写', 'https://tingwu.aliyun.com'],
          ['📊', '腾讯会议·智能纪要', '会议纪要 AI', 'https://meeting.tencent.com']
        ]}
      ];
      var h = '';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g.name + '</h3><div class="nav-grid">';
        g.items.forEach(function (it) {
          h += '<a class="link-card" href="' + it[3] + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="lc-logo">' + it[0] + '</span>' +
            '<span><span class="lc-name">' + T.esc(it[1]) + '</span><br><span class="lc-desc">' + T.esc(it[2]) + '</span></span>' +
            '<span class="lc-arrow">↗</span></a>';
        });
        h += '</div></div>';
      });
      host.innerHTML = h;
    }
  });

  /* ============ AI 提问技巧 ============ */
  T.register({
    id: 'ai-tips', icon: '📌', cat: 'ai', name: 'AI 提问技巧', net: false,
    desc: '写出高质量提示词的技巧与正反例对照',
    keywords: 'AI 提问 技巧 prompt 提示词 教程 方法论 例子',
    render: function (host) {
      var tips = [
        ['明确目标', '告诉 AI 你要什么结果，而不是只给主题。', '✗ 写一篇关于咖啡的文章\n✓ 写一篇 800 字的咖啡科普文，面向新手，说明 3 种常见冲煮方式的区别与适合场景。'],
        ['补充背景', '给足上下文，AI 才能给出贴合的答案。', '✗ 帮我规划行程\n✓ 我计划 3 月去成都 4 天 3 晚，预算 4000 元，喜欢美食和博物馆，请给出每日行程。'],
        ['指定格式', '约定输出结构，结果更易读可用。', '✗ 分析这个数据\n✓ 请用表格输出：指标、数值、同比变化、解读，并给出 3 条结论。'],
        ['分步拆解', '复杂任务让 AI 一步步来，质量更高。', '✗ 帮我做一个营销方案\n✓ 请分四步：1) 目标人群分析 2) 渠道选择 3) 预算分配 4) 效果指标，逐步输出。'],
        ['给出示例', '提供一个好例子，AI 会模仿其风格和结构。', '✗ 写几个标题\n✓ 参照这个风格写 5 个标题：【示例标题】。要求 20 字以内、带数字。'],
        ['设定角色', '角色设定让 AI 使用对应领域的专业视角。', '✗ 看看这段代码\n✓ 你是一名有 10 年经验的安全工程师，请从安全角度审查这段代码并给出修复建议。'],
        ['明确约束', '说清不能做什么，避免跑偏。', '✗ 翻译这段话\n✓ 翻译成英文，保持口语化，不要直译，不使用生僻词。'],
        ['追问迭代', '一次不满意就继续追问，不要重开话题。', '✗ （直接换问题重问）\n✓ 第二版比第一版好，但第三段再口语化一点，字数压缩到 200 字。']
      ];
      var h = '<div class="panel"><h3>' + L('高质量提问的 8 个技巧', '8 Tips for Better Prompts') + '</h3>';
      tips.forEach(function (t, i) {
        h += '<div style="margin-bottom:16px">' +
          '<div style="display:flex;align-items:center;gap:8px"><span class="chip" style="background:var(--accent);color:var(--accent-ink);border:none">' + (i + 1) + '</span><b style="font-size:14.5px">' + t[0] + '</b></div>' +
          '<p class="muted" style="margin:6px 0">' + t[1] + '</p>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" class="tips-ex">' +
            '<div class="out" style="white-space:pre-wrap;border-color:rgba(242,109,109,.35)">' + T.esc(t[2].split('\n')[0]) + '\n' + T.esc(t[2].split('\n')[1]) + '</div>' +
          '</div></div>';
      });
      h += '<p class="note">口诀：<b>角色 + 任务 + 背景 + 要求 + 示例</b>。写提示词时把这五要素尽量补齐，输出质量会明显提升。</p></div>';
      host.innerHTML = h;
    }
  });
})();
