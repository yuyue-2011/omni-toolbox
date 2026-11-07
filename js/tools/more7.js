/* ============================================================
   万能工具箱 v2.9.2 · AI 板块增强（4 款）
   Token 计数器 / AI 绘图提示词 / AI 模型速查 / 提示词变量填充
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }

  /* ============ Token 计数器 ============ */
  T.register({
    id: 'token-count', cat: 'ai', icon: '🧩',
    name: 'Token 计数器',
    desc: '估算文本的 Token 数与对话成本',
    keywords: 'token 计数 gpt 大模型 上下文 成本 字符',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('Token 计数器（估算）', 'Token Counter (estimate)') + '</h3>' +
        '<div class="field"><label>' + L('输入文本（提示词 / 文章 / 代码）', 'Enter text (prompt / article / code)') + '</label>' +
        '<textarea id="tcIn" placeholder="粘贴文本，自动估算 Token…" style="min-height:140px"></textarea></div>' +
        '<div class="row"><div class="field grow"><label>' + L('Token 计数口径', 'Counting rule') + '</label>' +
        '<select id="tcRule"><option value="gpt35">GPT-3.5 / GPT-4（≈4 字符 1 token）</option>' +
        '<option value="gpt4o">GPT-4o / GPT-6（≈3.5 字符 1 token）</option>' +
        '<option value="zh">中文优化（≈1.5 字符 1 token）</option></select></div></div>' +
        '<div class="stat-grid" style="margin-top:14px">' +
          '<div class="stat-box"><div class="k">' + L('估算 Token', 'Est. tokens') + '</div><div class="v" id="tcToken">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('字符数', 'Characters') + '</div><div class="v" id="tcChar">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('单词数', 'Words') + '</div><div class="v" id="tcWord">-</div></div>' +
          '<div class="stat-box"><div class="k">' + L('行数', 'Lines') + '</div><div class="v" id="tcLine">-</div></div>' +
        '</div>' +
        '<div class="field" style="margin-top:14px"><label>' + L('上下文占比（按 128K 窗口估算）', 'Context share (128K window)') + '</label><div class="out" id="tcCtx"><span class="muted">' + L('结果将显示在这里', 'Result appears here') + '</span></div></div>' +
        '<p class="note">' + L('说明：Token 数依赖各模型分词器，本工具按经验规则估算，与官方接口计数可能有 5%–15% 偏差，供预估上下文与成本参考。', 'Note: token counts depend on each model tokenizer; this tool uses heuristic rules and may differ 5–15% from official API counts.') + '</p>' +
      '</div>';
      var RULES = {
        gpt35: { cjk: 1.0, other: 0.25 },
        gpt4o: { cjk: 0.75, other: 0.29 },
        zh: { cjk: 0.67, other: 0.25 }
      };
      function count() {
        var s = $('tcIn').value;
        var r = RULES[$('tcRule').value] || RULES.gpt35;
        if (!s) {
          ['tcToken', 'tcChar', 'tcWord', 'tcLine'].forEach(function (id) { $(id).textContent = '-'; });
          out('tcCtx', '<span class="muted">' + L('结果将显示在这里', 'Result appears here') + '</span>');
          return;
        }
        var cjk = (s.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
        var otherLen = s.length - cjk;
        var tok = Math.ceil(cjk * r.cjk + otherLen * r.other);
        var words = (s.match(/[a-zA-Z0-9']+/g) || []).length + Math.ceil(cjk / 2);
        $('tcToken').textContent = tok.toLocaleString();
        $('tcChar').textContent = s.length.toLocaleString();
        $('tcWord').textContent = words.toLocaleString();
        $('tcLine').textContent = s.split('\n').length;
        var pct = tok / 128000 * 100;
        var bar = '<div style="height:8px;border-radius:4px;background:var(--card-2);margin-top:8px;overflow:hidden"><div style="height:100%;width:' + Math.min(100, pct).toFixed(1) + '%;background:var(--ac-grad);border-radius:4px;transition:width .3s"></div></div>';
        out('tcCtx', '<b>' + pct.toFixed(2) + '%</b> ' + L('（约 ', '(approx. ') + Math.floor(128000 / Math.max(1, tok)) + L(' 次完整对话）', ' full conversations)') + bar);
      }
      $('tcIn').addEventListener('input', count);
      $('tcRule').addEventListener('change', count);
    }
  });

  /* ============ AI 绘图提示词生成器 ============ */
  T.register({
    id: 'img-prompt', cat: 'ai', icon: '🎨',
    name: 'AI 绘图提示词',
    desc: '中文描述自动生成英文绘图提示词',
    keywords: '提示词 绘图 midjourney stable diffusion 出图 prompt',
    render: function (host) {
      var STYLES = [
        ['写实摄影', 'photorealistic, hyperrealistic, 8k'], ['动漫风格', 'anime style, cel shading, studio anime'],
        ['油画质感', 'oil painting, classical art, visible brushstrokes'], ['水彩插画', 'watercolor illustration, soft colors'],
        ['赛博朋克', 'cyberpunk, neon lights, futuristic, blade runner'], ['极简线条', 'minimalist, line art, clean lines'],
        ['3D 渲染', '3D render, octane render, ray tracing'], ['像素风格', 'pixel art, 16-bit, retro game style']
      ];
      var LIGHTS = [
        ['柔和日光', 'soft natural lighting'], ['黄金时刻', 'golden hour, warm sunlight'],
        ['霓虹光效', 'neon glow, vibrant lighting'], ['逆光剪影', 'backlight, silhouette, rim light'],
        ['影棚布光', 'studio lighting, professional lighting'], ['月光夜色', 'moonlight, night atmosphere']
      ];
      var QUAL = ['masterpiece', 'best quality', 'ultra-detailed', 'highly detailed', '8k resolution', 'sharp focus'];
      host.innerHTML =
      '<div class="panel"><h3>' + L('AI 绘图提示词生成器', 'AI Image Prompt Builder') + '</h3>' +
        '<div class="field"><label>' + L('画面主体（中文或英文描述）', 'Subject (Chinese or English)') + '</label>' +
        '<textarea id="ipIn" placeholder="例如：一只橘猫坐在窗台上看雨" style="min-height:70px"></textarea></div>' +
        '<div class="field"><label>' + L('艺术风格', 'Style') + '</label><div class="seg" id="ipStyle">' +
          STYLES.map(function (s, i) { return '<button type="button" data-i="' + i + '"' + (i === 0 ? ' class="active"' : '') + '>' + L(s[0], s[0]) + '</button>'; }).join('') +
        '</div></div>' +
        '<div class="field"><label>' + L('光线氛围', 'Lighting') + '</label><div class="seg" id="ipLight">' +
          LIGHTS.map(function (s, i) { return '<button type="button" data-i="' + i + '"' + (i === 0 ? ' class="active"' : '') + '>' + L(s[0], s[0]) + '</button>'; }).join('') +
        '</div></div>' +
        '<div class="row"><div class="field grow"><label>' + L('画面比例', 'Aspect ratio') + '</label>' +
        '<select id="ipAr"><option value="1:1">1:1 方形</option><option value="16:9" selected>16:9 横屏</option><option value="9:16">9:16 竖屏</option><option value="4:3">4:3</option><option value="3:2">3:2</option></select></div>' +
        '<div class="field grow"><label>' + L('画风质量词', 'Quality boosters') + '</label>' +
        '<select id="ipQual"><option value="1">' + L('完整（6 个质量词）', 'Full (6 boosters)') + '</option><option value="0">' + L('精简（仅 2 个）', 'Minimal (2 boosters)') + '</option></select></div></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="ipGen">' + L('生成提示词', 'Generate prompt') + '</button></div></div>' +
        '<div class="field" style="margin-top:14px"><label>' + L('英文提示词（Stable Diffusion / 通用）', 'English prompt (SD / general)') + '</label><div class="out" id="ipOut"><span class="muted">' + L('点击「生成提示词」', 'Click "Generate prompt"') + '</span></div></div>' +
        '<div class="field"><label>Midjourney 参数版</label><div class="out" id="ipMj"><span class="muted">--ar --v --q</span></div></div>' +
      '</div>';
      var curStyle = 0, curLight = 0;
      function pick(btn, fn) {
        btn.querySelectorAll('button').forEach(function (b) {
          b.addEventListener('click', function () {
            btn.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
            fn(Number(b.dataset.i));
          });
        });
      }
      pick($('ipStyle'), function (i) { curStyle = i; });
      pick($('ipLight'), function (i) { curLight = i; });
      function Zh2En() { return null; }
      $('ipGen').addEventListener('click', function () {
        var sub = $('ipIn').value.trim();
        if (!sub) { T.toast(L('请先输入画面主体', 'Enter the subject first')); return; }
        /* 中文主体走简单音译占位 + 保留英文原文；多数模型支持中英混合，这里保留原文并提示 */
        var q = Number($('ipQual').value) ? QUAL.join(', ') : QUAL.slice(0, 2).join(', ');
        var style = STYLES[curStyle][1], light = LIGHTS[curLight][1];
        var ar = $('ipAr').value;
        var isZh = /[\u4e00-\u9fff]/.test(sub);
        var note = isZh ? '<p class="note">' + L('提示：主体含中文，Midjourney / SD 建议先翻译成英文；可配合「文本翻译」工具。', 'Tip: subject contains Chinese — translate it first for best results (use the translate tool).') + '</p>' : '';
        var p = sub.replace(/[\\,\\n]+/g, ' ').trim() + ', ' + style + ', ' + light + ', ' + q;
        out('ipOut', '<div class="mono" style="font-size:13px;line-height:1.7">' + esc(p) + '</div>' + note);
        $('ipOut').appendChild(T.mkCopyBtn(p));
        var mjp = p + ' --ar ' + ar + ' --v 6 --q 2 --style raw';
        out('ipMj', '<div class="mono" style="font-size:13px;line-height:1.7">' + esc(mjp) + '</div>');
        $('ipMj').appendChild(T.mkCopyBtn(mjp));
      });
    }
  });

  /* ============ AI 模型速查 ============ */
  T.register({
    id: 'ai-models', cat: 'ai', icon: '📊',
    name: 'AI 模型速查',
    desc: '主流大模型上下文长度与特点对比',
    keywords: '大模型 对比 gpt claude gemini deepseek 上下文 价格',
    render: function (host) {
      var MODELS = [
        ['DeepSeek-V3', '128K', L('国产顶尖开源', 'Top open-source'), L('编程 / 推理强，API 极便宜', 'Great at coding/reasoning, cheap API')],
        ['DeepSeek-R1', '128K', L('推理模型', 'Reasoning model'), L('数学与逻辑对标 o1，开源可本地部署', 'Math/logic on par with o1, open weights')],
        ['Kimi K2', '128K', L('长文之王', 'Long-context king'), L('200 万字超长上下文，文档分析首选', '2M-token context, best for documents')],
        ['GPT-6', '400K', L('OpenAI 旗舰', 'OpenAI flagship'), L('全能标杆，Intelligent UI，多模态强', 'All-round flagship, strong multimodal')],
        ['Claude 4.5', '200K', L('Anthropic 旗舰', 'Anthropic flagship'), L('长文写作与代码质量极高', 'Excellent writing and code quality')],
        ['Gemini 2.5 Pro', '1M', L('Google 旗舰', 'Google flagship'), L('原生多模态，视频理解与搜索整合', 'Native multimodal, video & search')],
        ['通义千问 Max', '32K', L('阿里旗舰', 'Alibaba flagship'), L('中文理解强，企业应用生态完整', 'Strong Chinese, enterprise ecosystem')],
        ['文心 4.5', '128K', L('百度旗舰', 'Baidu flagship'), L('中文知识问答与插件生态', 'Chinese knowledge & plugins')],
        ['豆包 1.5 Pro', '32K', L('字节旗舰', 'ByteDance flagship'), L('响应快、价格低，App 体验好', 'Fast and cheap, great app UX')],
        ['Llama 3.3 70B', '128K', L('开源标杆', 'Open-source standard'), L('可本地部署，社区生态最丰富', 'Self-hostable, huge community')],
        ['Mistral Large', '128K', L('欧洲之光', 'European leader'), L('多语言强，合规与隐私友好', 'Multilingual, GDPR-friendly')],
        ['Grok-3', '131K', L('xAI 旗舰', 'xAI flagship'), L('实时联网，风格幽默直接', 'Real-time web access, witty tone')]
      ];
      host.innerHTML =
      '<div class="panel"><h3>' + L('主流大模型速查（2026）', 'LLM Quick Reference (2026)') + '</h3>' +
        '<div class="table-wrap"><table class="kv"><thead><tr><th>' + L('模型', 'Model') + '</th><th>' + L('上下文', 'Context') + '</th><th>' + L('定位', 'Position') + '</th><th>' + L('特点与适用场景', 'Strength') + '</th></tr></thead><tbody>' +
        MODELS.map(function (m) {
          return '<tr><td class="mono"><b>' + esc(m[0]) + '</b></td><td class="mono">' + esc(m[1]) + '</td><td>' + esc(m[2]) + '</td><td>' + esc(m[3]) + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="note">' + L('上下文长度为官方公布的最大值；实际可用长度受账户等级与接口限制。价格变动频繁，请以各平台官网为准。', 'Context sizes are official maxima; effective limits depend on account tier. Prices change often — verify on official sites.') + '</p>' +
      '</div>';
    }
  });

  /* ============ 提示词变量填充 ============ */
  T.register({
    id: 'prompt-fill', cat: 'ai', icon: '🧵',
    name: '提示词变量填充',
    desc: '模板中的占位符自动填入变量值',
    keywords: '提示词 模板 变量 占位符 填充 prompt template',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('提示词变量填充', 'Prompt Variable Filler') + '</h3>' +
        '<div class="field"><label>' + L('提示词模板（用 【】 或 {{}} 标记变量）', 'Template (mark vars with 【】 or {{}})') + '</label>' +
        '<textarea id="pfTmpl" placeholder="例如：请以【风格】的语气，为【产品】写一段【字数】字的文案" style="min-height:90px">请以【语气】的语气，为【产品】写一段【字数】字的推广文案，目标用户是【人群】。</textarea></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="pfParse">' + L('解析变量', 'Parse variables') + '</button></div>' +
        '<div class="field grow"><label>&nbsp;</label><button class="btn btn-ghost" id="pfSample">' + L('载入示例', 'Load sample') + '</button></div></div>' +
        '<div id="pfVars" style="margin-top:14px"></div>' +
        '<div class="field" style="margin-top:14px"><label>' + L('最终提示词', 'Final prompt') + '</label><div class="out" id="pfOut"><span class="muted">' + L('解析并填写变量后自动生成', 'Auto-generated after filling variables') + '</span></div></div>' +
      '</div>';
      var RE = /[【{]{1,2}([^】}]{1,30})[】}]{1,2}/g;
      function parse() {
        var tmpl = $('pfTmpl').value;
        var names = [], seen = {};
        var m;
        RE.lastIndex = 0;
        while ((m = RE.exec(tmpl)) !== null) {
          var key = m[1].trim();
          if (key && !seen[key]) { seen[key] = 1; names.push(key); }
        }
        if (!names.length) {
          out('pfVars', '<div class="empty"><b>' + L('未发现变量占位符', 'No placeholders found') + '</b></div>');
          out('pfOut', '<span class="muted">' + L('模板中没有变量', 'No variables in template') + '</span>');
          return;
        }
        var h = '<div class="field"><label>' + L('变量值（', 'Variable values (') + names.length + L(' 个）', ')') + '</label>';
        names.forEach(function (n, i) {
          h += '<div style="margin-bottom:8px"><label class="muted" style="font-size:12px">' + esc(n) + '</label>' +
            '<input id="pfV' + i + '" placeholder="' + esc(n) + '" style="font-size:13px"></div>';
        });
        out('pfVars', h + '</div>');
        names.forEach(function (n, i) {
          $('pfV' + i).addEventListener('input', build);
        });
        build();
      }
      function build() {
        var tmpl = $('pfTmpl').value;
        var i = 0;
        var result = tmpl.replace(RE, function () {
          var el = $('pfV' + i++);
          return el && el.value.trim() ? el.value.trim() : arguments[0];
        });
        out('pfOut', '<div style="font-size:13px;line-height:1.7">' + esc(result) + '</div>');
        var btn = T.mkCopyBtn(result);
        btn.style.marginTop = '8px';
        $('pfOut').appendChild(btn);
      }
      $('pfParse').addEventListener('click', parse);
      $('pfSample').addEventListener('click', function () {
        $('pfTmpl').value = '你是一位【角色】。请用【语言】为【主题】生成一份【格式】，要求：1. 【要求1】；2. 面向【人群】；输出控制在【字数】字以内。';
        parse();
      });
    }
  });
})();
