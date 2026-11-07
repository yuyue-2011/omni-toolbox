/* ============================================================
   万能工具箱 v2.7 · 核心框架
   分类注册 / 工具注册表 / hash 路由 / 主题与设置 / 实时状态栏
   含：代理智能识别、板块分组、官网导航（小窗模式）、记事本与保险箱支持、中英双语
   ============================================================ */
window.Toolbox = (function () {
  'use strict';

  /* 项目仓库（设置页 / 帮助页「关于」区域统一引用） */
  var REPO_URL = 'https://github.com/yuyue-2011/omni-toolbox';
  var REPO_NAME = 'yuyue-2011/omni-toolbox';

  /* ================= 分类（26 类，含官网导航 sites） ================= */
  var CATS = [
    { id: 'search', name: '搜索', color: '#3BC98A', desc: '聚合搜索 · 语法 · 导航',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/><path d="M8 11h6M11 8v6"/></svg>',
      sites: [
        { n: "百度", u: "https://www.baidu.com", g: "CN", h: 1 },
        { n: "360 搜索", u: "https://www.so.com", g: "CN", h: 1 },
        { n: "搜狗搜索", u: "https://www.sogou.com", g: "CN", h: 1 },
        { n: "夸克搜索", u: "https://quark.sm.cn", g: "CN", h: 1 },
        { n: "神马搜索", u: "https://m.sm.cn", g: "CN", h: 1 },
        { n: "Google", u: "https://www.google.com", g: "INT", h: 1 },
        { n: "Bing 必应", u: "https://www.bing.com", g: "CN", h: 1 },
        { n: "DuckDuckGo", u: "https://duckduckgo.com", g: "INT", h: 1 },
        { n: "Yandex", u: "https://yandex.com", g: "INT", h: 1 },
        { n: "Ecosia", u: "https://www.ecosia.org", g: "INT", h: 1 },
        { n: "Perplexity", u: "https://www.perplexity.ai", g: "INT", h: 1 },
        { n: "秘塔 AI 搜索", u: "https://metaso.cn", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "无追搜索", u: "https://www.wuzhuiso.com", g: "CN" },
        { n: "DogeDoge 多吉", u: "https://dogedoge.com", g: "INT" },
        { n: "Magi 搜索", u: "https://magi.com", g: "CN" },
        { n: "SearXNG 元搜索", u: "https://searx.be", g: "INT" },
        { n: "Presearch", u: "https://presearch.com", g: "INT" },
        { n: "Brave Search", u: "https://search.brave.com", g: "INT" },
        { n: "Mojeek", u: "https://www.mojeek.com", g: "INT" },
        { n: "Yep", u: "https://yep.com", g: "INT" },
        { n: "You.com", u: "https://you.com", g: "INT" },
        { n: "Kagi", u: "https://kagi.com", g: "INT" },
        { n: "Startpage", u: "https://www.startpage.com", g: "INT" },
        { n: "Marginalia", u: "https://search.marginalia.nu", g: "INT" },
        { n: "谷歌学术", u: "https://scholar.google.com", g: "INT" },
        { n: "百度学术", u: "https://xueshu.baidu.com", g: "CN" },
        { n: "Semantic Scholar", u: "https://www.semanticscholar.org", g: "INT" },
        { n: "中国知网", u: "https://www.cnki.net", g: "CN" },
        { n: "万方数据", u: "https://www.wanfangdata.com.cn", g: "CN" },
      ] },
    { id: 'calc', name: '计算', color: '#5B8DEF', desc: '计算器 · 换算 · 财务',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 19h1M12 19h1M16 19h1"/></svg>',
      sites: [
        { n: "Wolfram|Alpha", u: "https://www.wolframalpha.com", g: "INT", h: 1 },
        { n: "Desmos 图形计算器", u: "https://www.desmos.com/calculator", g: "INT", h: 1 },
        { n: "GeoGebra", u: "https://www.geogebra.org", g: "INT", h: 1 },
        { n: "Mathway", u: "https://www.mathway.com", g: "INT", h: 1 },
        { n: "Symbolab", u: "https://www.symbolab.com", g: "INT", h: 1 },
        { n: "微软数学求解器", u: "https://mathsolver.microsoft.com", g: "CN", h: 1 },
        { n: "Photomath", u: "https://photomath.com", g: "INT", h: 1 },
        { n: "数字帝国", u: "https://www.numberempire.com", g: "INT", h: 1 },
        { n: "卡西欧计算器", u: "https://www.casio.com.cn/calculators", g: "CN", h: 1 },
        { n: "得力计算器", u: "https://www.deli.cn", g: "CN", h: 1 },
        { n: "德州仪器", u: "https://education.ti.com/zh-hans", g: "CN", h: 1 },
        { n: "房贷计算器", u: "https://www.fangdaijisuanqi.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "Cymath", u: "https://www.cymath.com", g: "INT" },
        { n: "MathPapa", u: "https://www.mathpapa.com", g: "INT" },
        { n: "QuickMath", u: "https://www.quickmath.com", g: "INT" },
        { n: "Tiger Algebra", u: "https://www.tiger-algebra.com", g: "INT" },
        { n: "WebMath", u: "https://www.webmath.com", g: "INT" },
        { n: "Math is Fun", u: "https://www.mathsisfun.com", g: "INT" },
        { n: "OEIS 数列百科", u: "https://oeis.org", g: "INT" },
        { n: "Project Euler", u: "https://projecteuler.net", g: "INT" },
        { n: "NumPy", u: "https://numpy.org", g: "INT" },
        { n: "Khan Academy 数学", u: "https://www.khanacademy.org/math", g: "INT" },
        { n: "Mathematica", u: "https://www.wolfram.com/mathematica/", g: "INT" },
        { n: "国家税务总局", u: "https://www.chinatax.gov.cn", g: "CN" },
        { n: "Metacalculator", u: "https://www.metacalculator.com", g: "INT" },
      ] },
    { id: 'text', name: '文本', color: '#3BC98A', desc: '统计 · 格式化 · 转换',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M12 6v13M8.5 19h7"/></svg>',
      sites: [
        { n: "WPS 金山办公", u: "https://www.wps.cn", g: "CN", h: 1 },
        { n: "百度翻译", u: "https://fanyi.baidu.com", g: "CN", h: 1 },
        { n: "有道翻译", u: "https://fanyi.youdao.com", g: "CN", h: 1 },
        { n: "DeepL 翻译", u: "https://www.deepl.com/translator", g: "CN", h: 1 },
        { n: "谷歌翻译", u: "https://translate.google.com", g: "INT", h: 1 },
        { n: "腾讯翻译君", u: "https://fanyi.qq.com", g: "CN", h: 1 },
        { n: "阿里翻译", u: "https://translate.alibaba.com", g: "CN", h: 1 },
        { n: "金山词霸", u: "https://www.iciba.com", g: "CN", h: 1 },
        { n: "腾讯文档", u: "https://docs.qq.com", g: "CN", h: 1 },
        { n: "Grammarly", u: "https://www.grammarly.com", g: "INT", h: 1 },
        { n: "DeepL Write", u: "https://www.deepl.com/write", g: "INT", h: 1 },
        { n: "讯飞开放平台", u: "https://www.xfyun.cn", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "必应翻译", u: "https://www.bing.com/translator", g: "CN" },
        { n: "彩云小译", u: "https://fanyi.caiyunapp.com", g: "CN" },
        { n: "语智通纠错", u: "https://www.yuzhizt.com/jiaocuo", g: "CN" },
        { n: "秘塔写作猫", u: "https://xiezuocat.com", g: "CN" },
        { n: "火山写作", u: "https://www.writingo.net", g: "CN" },
        { n: "Effidit 腾讯智写", u: "https://effidit.qq.com", g: "CN" },
        { n: "LanguageTool", u: "https://languagetool.org", g: "INT" },
        { n: "ProWritingAid", u: "https://prowritingaid.com", g: "INT" },
        { n: "QuillBot", u: "https://quillbot.com", g: "INT" },
        { n: "Hemingway App", u: "https://hemingwayapp.com", g: "INT" },
        { n: "Ginger", u: "https://www.gingersoftware.com", g: "INT" },
        { n: "WordCounter", u: "https://wordcounter.net", g: "INT" },
        { n: "Diff Checker", u: "https://www.diffchecker.com", g: "INT" },
        { n: "Text Mechanic", u: "https://textmechanic.com", g: "INT" },
        { n: "AnyText 语言检测", u: "https://www.anytext.io", g: "INT" },
      ] },
    { id: 'codec', name: '编码', color: '#A06BF0', desc: '哈希 · 摩斯 · 二维码',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 4 7 20M17 4l-2.5 16M4 9.5h16M3.5 15h16"/></svg>',
      sites: [
        { n: "草料二维码", u: "https://cli.im", g: "CN", h: 1 },
        { n: "联图二维码", u: "https://www.liantu.com", g: "CN", h: 1 },
        { n: "QR Code Generator", u: "https://www.qr-code-generator.com", g: "INT", h: 1 },
        { n: "CyberChef", u: "https://gchq.github.io/CyberChef/", g: "INT", h: 1 },
        { n: "Base64 编解码", u: "https://www.base64encode.org", g: "INT", h: 1 },
        { n: "URL 编码在线", u: "https://www.urlencoder.org", g: "INT", h: 1 },
        { n: "DENSO WAVE（QR 码发明者）", u: "https://www.densowave.com", g: "INT", h: 1 },
        { n: "ZXing 在线解码", u: "https://zxing.org/w/decode.jspx", g: "INT", h: 1 },
        { n: "摩尔在线工具", u: "https://www.sojson.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "QRCode Monkey", u: "https://www.qrcode-monkey.com", g: "INT" },
        { n: "QR Tiger", u: "https://www.qrcode-tiger.com", g: "INT" },
        { n: "Bitly 短链", u: "https://bitly.com", g: "INT" },
        { n: "TinyURL", u: "https://tinyurl.com", g: "INT" },
        { n: "短链在线生成", u: "https://dwz.cn", g: "CN" },
        { n: "Base64 to Image", u: "https://base64-to-image.com", g: "INT" },
        { n: "URL Parser", u: "https://www.urlparser.com", g: "INT" },
        { n: "HTTP Status Codes", u: "https://httpstatuses.com", g: "INT" },
        { n: "Emoji 大全", u: "https://www.emojidaquan.com", g: "CN" },
        { n: "Unicode 查询", u: "https://www.compart.com/en/unicode", g: "INT" },
        { n: "MD5 在线", u: "https://www.md5online.org", g: "INT" },
        { n: "密云密码工具箱", u: "https://www.emn178.com/online-tools", g: "INT" },
        { n: "站长工具 · URL 编码", u: "https://tool.chinaz.com/Tools/URLEncode.aspx", g: "CN" },
        { n: "站长工具 · Base64", u: "https://tool.chinaz.com/Tools/Base64.aspx", g: "CN" },
        { n: "Base64 Decode", u: "https://www.base64decode.org", g: "INT" },
        { n: "Cryptii", u: "https://cryptii.com", g: "INT" },
        { n: "DenCode", u: "https://dencode.com", g: "INT" },
      ] },
    { id: 'time', name: '时间', color: '#F26D6D', desc: '计时 · 时钟 · 时间戳',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.2"/><path d="M12 8v4.2l2.8 1.6"/></svg>',
      sites: [
        { n: "国家授时中心", u: "https://www.time.ac.cn", g: "CN", h: 1 },
        { n: "Time.is", u: "https://time.is", g: "INT", h: 1 },
        { n: "Time and Date", u: "https://www.timeanddate.com", g: "INT", h: 1 },
        { n: "24Timezones", u: "https://24timezones.com", g: "INT", h: 1 },
        { n: "WorldTimeBuddy", u: "https://www.worldtimebuddy.com", g: "INT", h: 1 },
        { n: "Unix 时间戳", u: "https://unixtime.org", g: "CN", h: 1 },
        { n: "节假日安排", u: "https://www.gov.cn/zhuanti/2008-05/24/content_5267311.htm", g: "CN", h: 1 },
        { n: "中华农历网", u: "https://www.nongli.net", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "Epoch Converter", u: "https://www.epochconverter.com", g: "INT" },
        { n: "Every Time Zone", u: "https://everytimezone.com", g: "INT" },
        { n: "World Time Server", u: "https://www.worldtimeserver.com", g: "INT" },
        { n: "格林威治时间", u: "https://www.greenwichmeantime.com", g: "INT" },
        { n: "时区转换器", u: "https://www.timeanddate.com/worldclock/converter.html", g: "INT" },
        { n: "节日大全", u: "https://www.jieri.org.cn", g: "CN" },
        { n: "老黄历", u: "https://www.laohuangli.net", g: "CN" },
        { n: "中国天气网", u: "https://www.weather.com.cn", g: "CN" },
        { n: "历法查询", u: "https://wannianrili.51240.com", g: "CN" },
        { n: "北京时间", u: "https://www.beijing-time.org", g: "CN" },
        { n: "北京时间校准", u: "https://time.tianqi.com", g: "CN" },
        { n: "Unix Timestamp", u: "https://www.unixtimestamp.com", g: "INT" },
        { n: "Current Millis", u: "https://currentmillis.com", g: "INT" },
        { n: "DateTime.io", u: "https://datetime.io", g: "INT" },
      ] },
    { id: 'random', name: '随机', color: '#2ABFC4', desc: '随机数 · 抽签 · 分组',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/></svg>',
      sites: [
        { n: "中国体彩网", u: "https://www.lottery.gov.cn", g: "CN", h: 1 },
        { n: "中国福利彩票", u: "https://www.cwl.gov.cn", g: "CN", h: 1 },
        { n: "RANDOM.ORG", u: "https://www.random.org", g: "INT", h: 1 },
        { n: "ANU 量子随机数", u: "https://qrng.anu.edu.au", g: "INT", h: 1 },
        { n: "RAND 公司", u: "https://www.rand.org", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "NumberGenerator", u: "https://numbergenerator.org", g: "INT" },
        { n: "Random Lists", u: "https://www.randomlists.com", g: "INT" },
        { n: "Behind the Name", u: "https://www.behindthename.com/random", g: "INT" },
        { n: "Fake Person Generator", u: "https://www.fakepersongenerator.com", g: "INT" },
        { n: "Wheel of Names", u: "https://wheelofnames.com", g: "INT" },
        { n: "抽奖啦", u: "https://www.choujiangla.com", g: "CN" },
        { n: "随机密码生成", u: "https://www.random.org/passwords", g: "INT" },
        { n: "随机序列生成", u: "https://www.random.org/sequences/", g: "INT" },
        { n: "QQ 修齐 · 随机数", u: "https://www.qqxiuzi.cn/zh/suijishu/", g: "CN" },
        { n: "QQ 修齐 · 在线抽签", u: "https://www.qqxiuzi.cn/zh/chouqian/", g: "CN" },
        { n: "Picker Wheel", u: "https://pickerwheel.com", g: "INT" },
        { n: "Wheel Decide", u: "https://wheeldecide.com", g: "INT" },
        { n: "Comment Picker", u: "https://commentpicker.com", g: "INT" },
      ] },
    { id: 'life', name: '生活', color: '#E884A8', desc: '汇率 · 星座 · 身份证',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.2-4.6-9-9.2C1.8 7.9 3.9 4.6 7 4.6c2 0 3.6 1.2 5 3.1 1.4-1.9 3-3.1 5-3.1 3.1 0 5.2 3.3 4 6.2-1.8 4.6-9 9.2-9 9.2z"/></svg>',
      sites: [
        { n: "中国外汇交易中心", u: "https://www.chinamoney.com.cn", g: "CN", h: 1 },
        { n: "中国银行汇率", u: "https://www.boc.cn/sourcedb/whpj/", g: "CN", h: 1 },
        { n: "XE 汇率", u: "https://www.xe.com/currencyconverter", g: "INT", h: 1 },
        { n: "中国天气网", u: "https://www.weather.com.cn", g: "CN", h: 1 },
        { n: "高德地图", u: "https://www.amap.com", g: "CN", h: 1 },
        { n: "12306 购票", u: "https://www.12306.cn", g: "CN", h: 1 },
        { n: "中国邮政", u: "https://www.chinapost.gov.cn", g: "CN", h: 1 },
        { n: "美团", u: "https://www.meituan.com", g: "CN", h: 1 },
        { n: "支付宝", u: "https://www.alipay.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "和风天气", u: "https://www.qweather.com", g: "CN" },
        { n: "墨迹天气", u: "https://www.moji.com", g: "CN" },
        { n: "中国气象局", u: "http://www.cma.gov.cn", g: "CN" },
        { n: "汇率换算", u: "https://www.huilv.cc", g: "CN" },
        { n: "快递 100", u: "https://www.kuaidi100.com", g: "CN" },
        { n: "菜鸟裹裹", u: "https://www.cainiao.com", g: "CN" },
        { n: "顺丰速运", u: "https://www.sf-express.com", g: "CN" },
        { n: "挂号网", u: "https://www.guahao.com", g: "CN" },
        { n: "好大夫在线", u: "https://www.haodf.com", g: "CN" },
        { n: "丁香医生", u: "https://dxy.com", g: "CN" },
        { n: "链家", u: "https://www.lianjia.com", g: "CN" },
        { n: "贝壳找房", u: "https://www.ke.com", g: "CN" },
        { n: "星座屋", u: "https://www.xingzuowu.com", g: "CN" },
        { n: "第一星座网", u: "https://www.d1xz.net", g: "CN" },
        { n: "生肖运势", u: "https://www.sxwnl.com", g: "CN" },
      ] },
    { id: 'ai', name: 'AI', color: '#E884A8', desc: '提示词 · 模板 · 导航',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.9L19 9.8l-5.1 1.9L12 16.6l-1.9-4.9L5 9.8l5.1-1.9z"/><path d="M19 15l.9 2.3 2.3.9-2.3.9L19 21.4l-.9-2.3-2.3-.9 2.3-.9z"/></svg>',
      sites: [
        { n: "DeepSeek", u: "https://www.deepseek.com", g: "CN", h: 1 },
        { n: "智谱清言 GLM", u: "https://chatglm.cn", g: "CN", h: 1 },
        { n: "Kimi 月之暗面", u: "https://kimi.moonshot.cn", g: "CN", h: 1 },
        { n: "通义千问", u: "https://tongyi.aliyun.com", g: "CN", h: 1 },
        { n: "文心一言", u: "https://yiyan.baidu.com", g: "CN", h: 1 },
        { n: "豆包", u: "https://www.doubao.com", g: "CN", h: 1 },
        { n: "腾讯元宝", u: "https://yuanbao.tencent.com", g: "CN", h: 1 },
        { n: "MiniMax", u: "https://www.minimaxi.com", g: "CN", h: 1 },
        { n: "讯飞星火", u: "https://xinghuo.xfyun.cn", g: "CN", h: 1 },
        { n: "百川智能", u: "https://www.baichuan-ai.com", g: "CN", h: 1 },
        { n: "OpenAI ChatGPT", u: "https://chat.openai.com", g: "INT", h: 1 },
        { n: "Anthropic Claude", u: "https://claude.ai", g: "INT", h: 1 },
        { n: "Google Gemini", u: "https://gemini.google.com", g: "INT", h: 1 },
        { n: "微软 Copilot", u: "https://copilot.microsoft.com", g: "INT", h: 1 },
        { n: "Hugging Face", u: "https://huggingface.co", g: "INT", h: 1 },
        { n: "Cursor 编辑器", u: "https://www.cursor.com", g: "INT", h: 1 },
        { n: "Midjourney", u: "https://www.midjourney.com", g: "INT", h: 1 },
        { n: "Perplexity", u: "https://www.perplexity.ai", g: "INT", h: 1 },
        { n: "OpenRouter", u: "https://openrouter.ai", g: "INT", h: 1 },
        { n: "OpenCode", u: "https://opencode.ai", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "秘塔 AI 搜索", u: "https://metaso.cn", g: "CN" },
        { n: "天工 AI", u: "https://www.tiangong.cn", g: "CN" },
        { n: "阶跃星辰", u: "https://yuewen.cn", g: "CN" },
        { n: "商汤商量 SenseChat", u: "https://chat.sensetime.com", g: "CN" },
        { n: "澜舟科技孟夫子", u: "https://www.langboat.com", g: "CN" },
        { n: "Jasper AI", u: "https://www.jasper.ai", g: "INT" },
        { n: "Copy.ai", u: "https://www.copy.ai", g: "INT" },
        { n: "Writesonic", u: "https://writesonic.com", g: "INT" },
        { n: "Rytr", u: "https://rytr.me", g: "INT" },
        { n: "Notion AI", u: "https://www.notion.so/product/ai", g: "INT" },
        { n: "Stable Diffusion", u: "https://stability.ai", g: "INT" },
        { n: "Civitai 模型库", u: "https://civitai.com", g: "INT" },
        { n: "OpenArt", u: "https://openart.ai", g: "INT" },
        { n: "NightCafe", u: "https://creator.nightcafe.studio", g: "INT" },
        { n: "Lexica 灵感图", u: "https://lexica.art", g: "INT" },
        { n: "触站", u: "https://www.huashi6.com", g: "CN" },
        { n: "Photoroom 抠图", u: "https://www.photoroom.com", g: "INT" },
        { n: "Magnific 放大", u: "https://magnific.ai", g: "INT" },
        { n: "Upscayl", u: "https://upscayl.org", g: "INT" },
        { n: "Let's Enhance", u: "https://letsenhance.io", g: "INT" },
        { n: "Suno 音乐", u: "https://suno.com", g: "INT" },
        { n: "ElevenLabs 配音", u: "https://elevenlabs.io", g: "INT" },
        { n: "Murf 配音", u: "https://murf.ai", g: "INT" },
        { n: "Descript 音频", u: "https://www.descript.com", g: "INT" },
        { n: "Adobe Podcast", u: "https://podcast.adobe.com", g: "INT" },
        { n: "HeyGen 数字人", u: "https://www.heygen.com", g: "INT" },
        { n: "Synthesia 视频", u: "https://www.synthesia.io", g: "INT" },
        { n: "D-ID 数字人", u: "https://www.d-id.com", g: "INT" },
        { n: "Invideo AI", u: "https://invideo.io", g: "INT" },
        { n: "剪映", u: "https://www.jianying.com", g: "CN" },
        { n: "即梦 AI", u: "https://jimeng.jianying.com", g: "CN" },
        { n: "通义灵码", u: "https://tongyi.aliyun.com/lingma", g: "CN" },
        { n: "文心快码 Comate", u: "https://comate.baidu.com", g: "CN" },
        { n: "CodeGeeX", u: "https://codegeex.cn", g: "CN" },
        { n: "Codeium", u: "https://codeium.com", g: "INT" },
        { n: "Tabnine", u: "https://www.tabnine.com", g: "INT" },
        { n: "Replit", u: "https://replit.com", g: "INT" },
        { n: "v0 生成器", u: "https://v0.dev", g: "INT" },
        { n: "Bolt.new", u: "https://bolt.new", g: "INT" },
        { n: "Lovable", u: "https://lovable.dev", g: "INT" },
        { n: "Coze 智能体", u: "https://www.coze.cn", g: "CN" },
        { n: "Dify 平台", u: "https://dify.ai", g: "INT" },
        { n: "FastGPT", u: "https://fastgpt.in", g: "CN" },
        { n: "Ollama 本地模型", u: "https://ollama.com", g: "INT" },
        { n: "LM Studio", u: "https://lmstudio.ai", g: "INT" },
        { n: "NextChat 客户端", u: "https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web", g: "INT" },
        { n: "LobeChat", u: "https://lobehub.com", g: "INT" },
        { n: "Chatbox 客户端", u: "https://chatboxai.app", g: "CN" },
        { n: "GPT4All 离线", u: "https://gpt4all.io", g: "INT" },
        { n: "Jan 离线助手", u: "https://jan.ai", g: "INT" },
        { n: "GPTZero 检测", u: "https://gptzero.me", g: "INT" },
        { n: "Originality 检测", u: "https://originality.ai", g: "INT" },
        { n: "机器之心", u: "https://www.jiqizhixin.com", g: "CN" },
        { n: "量子位", u: "https://www.qbitai.com", g: "CN" },
        { n: "Atria Dawn", u: "https://atria-asi.ai/", g: "CN" },
        { n: "Phind 搜索", u: "https://www.phind.com", g: "INT" },
        { n: "Devv 搜索", u: "https://devv.ai", g: "INT" },
        { n: "Felo 搜索", u: "https://felo.ai", g: "INT" },
        { n: "Gamma PPT", u: "https://gamma.app", g: "INT" },
        { n: "美图 AI PPT", u: "https://www.aippt.cn", g: "CN" },
        { n: "讯飞智文", u: "https://zhiwen.xfyun.cn", g: "CN" },
        { n: "Motiff AI 设计", u: "https://www.motiff.com", g: "CN" },
        { n: "Galileo AI", u: "https://www.usegalileo.ai", g: "INT" },
      ] },
    { id: 'net', name: '网络', color: '#4FA3FF', desc: '测速 · 检测 · 解析',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 8.5a15 15 0 0 1 19 0M5.5 12a10 10 0 0 1 13 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/></svg>',
      sites: [
        { n: "华为官网", u: "https://www.huawei.com/cn", g: "CN", h: 1 },
        { n: "中国信通院", u: "http://www.caict.ac.cn", g: "CN", h: 1 },
        { n: "Cloudflare", u: "https://www.cloudflare.com", g: "INT", h: 1 },
        { n: "Speedtest 网速测试", u: "https://www.speedtest.net", g: "CN", h: 1 },
        { n: "Fast.com", u: "https://fast.com", g: "INT", h: 1 },
        { n: "IPIP.NET", u: "https://www.ipip.net", g: "CN", h: 1 },
        { n: "DNSPod", u: "https://www.dnspod.cn", g: "CN", h: 1 },
        { n: "UptimeRobot", u: "https://uptimerobot.com", g: "INT", h: 1 },
        { n: "CNNIC", u: "https://www.cnnic.cn", g: "CN", h: 1 },
        { n: "思科 Cisco", u: "https://www.cisco.com/c/zh_cn/", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "阿里云", u: "https://www.aliyun.com", g: "CN" },
        { n: "腾讯云", u: "https://cloud.tencent.com", g: "CN" },
        { n: "百度智能云", u: "https://cloud.baidu.com", g: "CN" },
        { n: "华为云", u: "https://www.huaweicloud.com", g: "CN" },
        { n: "AWS", u: "https://aws.amazon.com", g: "INT" },
        { n: "Google Cloud", u: "https://cloud.google.com", g: "INT" },
        { n: "Microsoft Azure", u: "https://azure.microsoft.com", g: "INT" },
        { n: "Oracle Cloud", u: "https://www.oracle.com/cloud", g: "INT" },
        { n: "Vultr", u: "https://www.vultr.com", g: "INT" },
        { n: "DigitalOcean", u: "https://www.digitalocean.com", g: "INT" },
        { n: "Hetzner", u: "https://www.hetzner.com", g: "INT" },
        { n: "1.1.1.1 DNS", u: "https://1.1.1.1", g: "INT" },
        { n: "114DNS", u: "https://www.114dns.com", g: "CN" },
        { n: "阿里云 DNS", u: "https://dns.aliyun.com", g: "CN" },
        { n: "IP138", u: "https://www.ip138.com", g: "CN" },
        { n: "站长工具", u: "https://www.chinaz.com", g: "CN" },
        { n: "爱站网", u: "https://www.aizhan.com", g: "CN" },
        { n: "安全联盟", u: "https://www.anquan.org", g: "CN" },
      ] },
    { id: 'image', name: '图片', color: '#F2A33B', desc: '压缩 · 转换 · 取色',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 15.5 16 10.5 7 19.5"/></svg>',
      sites: [
        { n: "美图秀秀", u: "https://www.meitu.com", g: "CN", h: 1 },
        { n: "稿定设计", u: "https://www.gaoding.com", g: "CN", h: 1 },
        { n: "Adobe Photoshop", u: "https://www.adobe.com/products/photoshop.html", g: "INT", h: 1 },
        { n: "Canva 可画", u: "https://www.canva.cn", g: "CN", h: 1 },
        { n: "Figma", u: "https://www.figma.com", g: "INT", h: 1 },
        { n: "remove.bg 抠图", u: "https://www.remove.bg", g: "INT", h: 1 },
        { n: "Squoosh 压缩", u: "https://squoosh.app", g: "INT", h: 1 },
        { n: "TinyPNG", u: "https://tinypng.com", g: "INT", h: 1 },
        { n: "Pixlr 编辑器", u: "https://pixlr.com", g: "INT", h: 1 },
        { n: "Photopea 在线 PS", u: "https://www.photopea.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "Compressor.io", u: "https://compressor.io", g: "INT" },
        { n: "Optimizilla", u: "https://optimizilla.com", g: "INT" },
        { n: "Convertio", u: "https://convertio.co", g: "INT" },
        { n: "Zamzar", u: "https://www.zamzar.com", g: "INT" },
        { n: "Bigjpg 放大", u: "https://bigjpg.com", g: "CN" },
        { n: "Adobe Color 配色", u: "https://color.adobe.com", g: "INT" },
        { n: "Coolors", u: "https://coolors.co", g: "INT" },
        { n: "ColorHunt", u: "https://colorhunt.co", g: "INT" },
        { n: "创客贴", u: "https://www.chuangkit.com", g: "CN" },
        { n: "即时设计", u: "https://js.design", g: "CN" },
        { n: "MasterGo", u: "https://mastergo.com", g: "CN" },
        { n: "Penpot", u: "https://penpot.app", g: "INT" },
        { n: "路过图床", u: "https://imgse.com", g: "CN" },
        { n: "SM.MS 图床", u: "https://sm.ms", g: "INT" },
        { n: "表情包制作", u: "https://www.diydoutu.com", g: "CN" },
        { n: "搞定拼图", u: "https://www.gaoding.com/pintu", g: "CN" },
      ] },
    { id: 'video', name: '视频处理', color: '#F26D6D', desc: '播放 · 转GIF · 截取 · 提取音轨',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M17 10l4-2.5v9L17 14"/></svg>',
      sites: [
        { n: "剪映", u: "https://www.jianying.com", g: "CN", h: 1 },
        { n: "必剪", u: "https://bcut.bilibili.cn", g: "CN", h: 1 },
        { n: "快影", u: "https://www.kuaiying.cn", g: "CN", h: 1 },
        { n: "会声会影", u: "https://www.huishenghuiying.com.cn", g: "CN", h: 1 },
        { n: "Adobe Premiere", u: "https://www.adobe.com/products/premiere.html", g: "INT", h: 1 },
        { n: "DaVinci Resolve", u: "https://www.blackmagicdesign.com/cn/products/davinciresolve", g: "CN", h: 1 },
        { n: "OBS 录屏", u: "https://obsproject.com/zh-cn", g: "CN", h: 1 },
        { n: "福昕视频剪辑", u: "https://www.foxitsoftware.cn", g: "CN", h: 1 },
        { n: "万兴喵影", u: "https://miao.wondershare.cn", g: "CN", h: 1 },
        { n: "EDIUS", u: "https://www.grassvalley.com.cn", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "Avid Media Composer", u: "https://www.avid.com/media-composer", g: "INT" },
        { n: "Vegas Pro", u: "https://www.vegas.com", g: "INT" },
        { n: "HitFilm", u: "https://fxhome.com", g: "INT" },
        { n: "Lightworks", u: "https://www.lwks.com", g: "INT" },
        { n: "Shotcut", u: "https://shotcut.org", g: "INT" },
        { n: "OpenShot", u: "https://www.openshot.org", g: "INT" },
        { n: "HandBrake 压制", u: "https://handbrake.fr", g: "INT" },
        { n: "小丸工具箱", u: "https://maruko.app", g: "INT" },
        { n: "Format Factory", u: "https://www.pcfreetime.com", g: "CN" },
        { n: "Online Video Cutter", u: "https://online-video-cutter.com", g: "INT" },
        { n: "FreeConvert", u: "https://www.freeconvert.com/video/compress", g: "INT" },
        { n: "EZGIF 转 GIF", u: "https://ezgif.com", g: "INT" },
        { n: "Gifski", u: "https://gif.ski", g: "INT" },
        { n: "Arctime 字幕", u: "https://arctime.org", g: "CN" },
        { n: "自动字幕", u: "https://www.2zimu.com", g: "CN" },
        { n: "新 CG儿素材", u: "https://www.newcger.com", g: "CN" },
        { n: "Pexels 视频", u: "https://www.pexels.com/videos/", g: "INT" },
        { n: "Pixabay 视频", u: "https://pixabay.com/videos/", g: "INT" },
        { n: "Coverr 素材", u: "https://coverr.co", g: "INT" },
      ] },
    { id: 'down', name: '下载', color: '#E88B4A', desc: '直链 · 批量 · 磁力',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11M8 10l4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
      sites: [
        { n: "迅雷", u: "https://www.xunlei.com", g: "CN", h: 1 },
        { n: "BitComet", u: "https://www.bitcomet.com", g: "INT", h: 1 },
        { n: "Motrix", u: "https://motrix.app", g: "INT", h: 1 },
        { n: "IDM 下载器", u: "https://www.internetdownloadmanager.com", g: "INT", h: 1 },
        { n: "qBittorrent", u: "https://www.qbittorrent.org", g: "INT", h: 1 },
        { n: "Free Download Manager", u: "https://www.freedownloadmanager.org", g: "INT", h: 1 },
        { n: "aria2", u: "https://aria2.github.io", g: "INT", h: 1 },
        { n: "Wget", u: "https://www.gnu.org/software/wget/", g: "INT", h: 1 },
        { n: "IDA 下载", u: "https://www.ida90.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "uTorrent", u: "https://www.utorrent.com", g: "INT" },
        { n: "Transmission", u: "https://transmissionbt.com", g: "INT" },
        { n: "Deluge", u: "https://deluge-torrent.org", g: "INT" },
        { n: "Vuze", u: "https://www.vuze.com", g: "INT" },
        { n: "Neat Download Manager", u: "https://neatdownloadmanager.com", g: "INT" },
        { n: "XDM 下载器", u: "https://xtremedownloadmanager.com", g: "INT" },
        { n: "JDownloader", u: "https://jdownloader.org", g: "INT" },
        { n: "curl", u: "https://curl.se", g: "INT" },
        { n: "腾讯软件中心", u: "https://pc.qq.com", g: "CN" },
        { n: "360 软件宝库", u: "https://baoku.360.cn", g: "CN" },
        { n: "Git for Windows", u: "https://gitforwindows.org", g: "INT" },
        { n: "离线下载", u: "https://pan.baidu.com", g: "CN" },
        { n: "BBDown（B 站下载）", u: "https://github.com/nilaoda/BBDown", g: "CN" },
        { n: "you-get", u: "https://github.com/soimort/you-get", g: "CN" },
        { n: "Lux", u: "https://github.com/iawia002/lux", g: "CN" },
        { n: "yt-dlp", u: "https://github.com/yt-dlp/yt-dlp", g: "INT" },
        { n: "pyLoad", u: "https://pyload.net", g: "INT" },
      ] },
    { id: 'cloud', name: '云盘', color: '#4EA5E0', desc: '链接管理 · 提取码 · 分享',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17 8.5a4 4 0 0 1 .5 7.97"/><path d="M12 13v5M9.5 15.5 12 18l2.5-2.5"/></svg>',
      sites: [
        { n: "百度网盘", u: "https://pan.baidu.com", g: "CN", h: 1 },
        { n: "阿里云盘", u: "https://www.alipan.com", g: "CN", h: 1 },
        { n: "腾讯微云", u: "https://www.weiyun.com", g: "CN", h: 1 },
        { n: "坚果云", u: "https://www.jianguoyun.com", g: "CN", h: 1 },
        { n: "天翼云盘", u: "https://cloud.189.cn", g: "CN", h: 1 },
        { n: "移动云盘", u: "https://yun.139.com", g: "CN", h: 1 },
        { n: "夸克网盘", u: "https://pan.quark.cn", g: "CN", h: 1 },
        { n: "OneDrive", u: "https://onedrive.live.com", g: "INT", h: 1 },
        { n: "Google Drive", u: "https://drive.google.com", g: "INT", h: 1 },
        { n: "Dropbox", u: "https://www.dropbox.com", g: "INT", h: 1 },
        { n: "iCloud", u: "https://www.icloud.com", g: "INT", h: 1 },
        { n: "MEGA", u: "https://mega.nz", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "蓝奏云", u: "https://www.lanzou.com", g: "CN" },
        { n: "123 云盘", u: "https://www.123pan.com", g: "CN" },
        { n: "115 网盘", u: "https://115.com", g: "CN" },
        { n: "迅雷云盘", u: "https://pan-xunlei.com", g: "CN" },
        { n: "UC 网盘", u: "https://drive.uc.cn", g: "CN" },
        { n: "城通网盘", u: "https://www.ctfile.com", g: "CN" },
        { n: "奶牛快传", u: "https://cowtransfer.com", g: "CN" },
        { n: "文叔叔", u: "https://www.wenshushu.cn", g: "CN" },
        { n: "pCloud", u: "https://www.pcloud.com", g: "INT" },
        { n: "Sync", u: "https://www.sync.com", g: "INT" },
        { n: "Proton Drive", u: "https://proton.me/drive", g: "INT" },
        { n: "Koofr", u: "https://koofr.eu", g: "INT" },
        { n: "TeraBox", u: "https://www.terabox.com", g: "INT" },
        { n: "Box", u: "https://www.box.com", g: "INT" },
        { n: "群晖 NAS", u: "https://www.synology.cn", g: "CN" },
        { n: "威联通 NAS", u: "https://www.qnap.com", g: "CN" },
      ] },
    { id: 'data', name: '数据', color: '#4EA5E0', desc: '统计 · 转换 · 图表',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20v-9M12 20V5M19 20v-6M3 20h18"/></svg>',
      sites: [
        { n: "帆软报表", u: "https://www.fanruan.com", g: "CN", h: 1 },
        { n: "阿里云 Quick BI", u: "https://www.aliyun.com/product/bigdata/bi", g: "CN", h: 1 },
        { n: "Excel 模板", u: "https://www.microsoft.com/zh-cn/microsoft-365/excel", g: "CN", h: 1 },
        { n: "Tableau", u: "https://www.tableau.com", g: "INT", h: 1 },
        { n: "Microsoft Power BI", u: "https://www.microsoft.com/zh-cn/power-bi", g: "CN", h: 1 },
        { n: "Apache Superset", u: "https://superset.apache.org", g: "INT", h: 1 },
        { n: "Looker Studio", u: "https://lookerstudio.google.com", g: "INT", h: 1 },
        { n: "JSON Editor Online", u: "https://jsoneditoronline.org", g: "INT", h: 1 },
        { n: "CSVJSON 工具集", u: "https://www.csvjson.com", g: "INT", h: 1 },
        { n: "Tables Generator", u: "https://www.tablesgenerator.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "数据观", u: "https://www.shujuguan.cn", g: "CN" },
        { n: "神策数据", u: "https://www.sensorsdata.cn", g: "CN" },
        { n: "GrowingIO", u: "https://www.growingio.com", g: "CN" },
        { n: "友盟+", u: "https://www.umeng.com", g: "CN" },
        { n: "JSON.cn", u: "https://www.json.cn", g: "CN" },
        { n: "JSON Formatter", u: "https://jsonformatter.org", g: "INT" },
        { n: "JSONPath 查询", u: "https://jsonpath.com", g: "INT" },
        { n: "Regex101", u: "https://regex101.com", g: "INT" },
        { n: "RegExr", u: "https://regexr.com", g: "INT" },
        { n: "ECharts 图表库", u: "https://echarts.apache.org", g: "INT" },
        { n: "AntV 蚂蚁可视化", u: "https://antv.vision", g: "CN" },
        { n: "D3.js", u: "https://d3js.org", g: "INT" },
        { n: "Chart.js", u: "https://www.chartjs.org", g: "INT" },
        { n: "Plotly", u: "https://plotly.com", g: "INT" },
        { n: "国家数据", u: "https://data.stats.gov.cn", g: "CN" },
      ] },
    { id: 'work', name: '效率', color: '#6FCB6F', desc: '待办 · 番茄钟 · 记事本',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.2"/><path d="M8.5 12.5l2.4 2.4 4.6-5"/></svg>',
      sites: [
        { n: "飞书", u: "https://www.feishu.cn", g: "CN", h: 1 },
        { n: "钉钉", u: "https://www.dingtalk.com", g: "CN", h: 1 },
        { n: "Notion", u: "https://www.notion.so", g: "INT", h: 1 },
        { n: "滴答清单", u: "https://www.dida365.com", g: "CN", h: 1 },
        { n: "印象笔记", u: "https://www.yinxiang.com", g: "CN", h: 1 },
        { n: "Todoist", u: "https://todoist.com", g: "INT", h: 1 },
        { n: "微软 To Do", u: "https://todo.microsoft.com", g: "CN", h: 1 },
        { n: "Google Keep", u: "https://keep.google.com", g: "INT", h: 1 },
        { n: "语雀", u: "https://www.yuque.com", g: "CN", h: 1 },
        { n: "腾讯文档", u: "https://docs.qq.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "有道云笔记", u: "https://note.youdao.com", g: "CN" },
        { n: "为知笔记", u: "https://www.wiz.cn", g: "CN" },
        { n: "石墨文档", u: "https://shimo.im", g: "CN" },
        { n: "金山文档", u: "https://www.kdocs.cn", g: "CN" },
        { n: "幕布", u: "https://mubu.com", g: "CN" },
        { n: "企业微信", u: "https://work.weixin.qq.com", g: "CN" },
        { n: "Trello", u: "https://trello.com", g: "INT" },
        { n: "Asana", u: "https://asana.com", g: "INT" },
        { n: "Monday.com", u: "https://monday.com", g: "INT" },
        { n: "Teambition", u: "https://www.teambition.com", g: "CN" },
        { n: "Tower", u: "https://tower.im", g: "CN" },
        { n: "Google 日历", u: "https://calendar.google.com", g: "INT" },
        { n: "番茄土豆", u: "https://www.pomotodo.com", g: "CN" },
        { n: "Forest 专注森林", u: "https://www.forestapp.cc", g: "INT" },
        { n: "Toggl 时间追踪", u: "https://toggl.com", g: "INT" },
        { n: "Bitwarden 密码箱", u: "https://bitwarden.com", g: "INT" },
      ] },
    { id: 'study', name: '学习', color: '#5BC8AF', desc: '平台导航 · 方法 · 记忆卡片 · 打卡',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19V6a1 1 0 0 1 1-1h5.5A2.5 2.5 0 0 1 12 7.5V19"/><path d="M3 19h18"/><path d="M21 19V6a1 1 0 0 0-1-1h-5.5A2.5 2.5 0 0 0 12 7.5V19"/><path d="M8 11h8"/></svg>',
      sites: [
        { n: "国家中小学智慧教育平台", u: "https://www.smartedu.cn", g: "CN", h: 1 },
        { n: "中国大学 MOOC", u: "https://www.icourse163.org", g: "CN", h: 1 },
        { n: "学堂在线", u: "https://www.xuetangx.com", g: "CN", h: 1 },
        { n: "网易公开课", u: "https://open.163.com", g: "CN", h: 1 },
        { n: "网易云课堂", u: "https://study.163.com", g: "CN", h: 1 },
        { n: "腾讯课堂", u: "https://ke.qq.com", g: "CN", h: 1 },
        { n: "慕课网", u: "https://www.imooc.com", g: "CN", h: 1 },
        { n: "极客时间", u: "https://time.geekbang.org", g: "CN", h: 1 },
        { n: "Coursera", u: "https://www.coursera.org", g: "INT", h: 1 },
        { n: "edX", u: "https://www.edx.org", g: "INT", h: 1 },
        { n: "Khan Academy", u: "https://www.khanacademy.org", g: "INT", h: 1 },
        { n: "Udemy", u: "https://www.udemy.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "智慧树", u: "https://www.zhihuishu.com", g: "CN" },
        { n: "超星学习通", u: "https://www.chaoxing.com", g: "CN" },
        { n: "雨课堂", u: "https://www.yuketang.cn", g: "CN" },
        { n: "好大学在线", u: "https://www.cnmooc.org", g: "CN" },
        { n: "多邻国", u: "https://www.duolingo.cn", g: "CN" },
        { n: "沪江网校", u: "https://www.hujiang.com", g: "CN" },
        { n: "扇贝单词", u: "https://www.shanbay.com", g: "CN" },
        { n: "百词斩", u: "https://www.baicizhan.com", g: "CN" },
        { n: "墨墨背单词", u: "https://www.maimemo.com", g: "CN" },
        { n: "不背单词", u: "https://bbdc.cn", g: "CN" },
        { n: "每日英语听力", u: "https://www.eudic.cn", g: "CN" },
        { n: "力扣", u: "https://leetcode.cn", g: "CN" },
        { n: "牛客网", u: "https://www.nowcoder.com", g: "CN" },
        { n: "freeCodeCamp", u: "https://www.freecodecamp.org/chinese/", g: "CN" },
        { n: "Codecademy", u: "https://www.codecademy.com", g: "INT" },
        { n: "考研网", u: "https://www.kaoyan.com", g: "CN" },
        { n: "中国教育在线", u: "https://www.eol.cn", g: "CN" },
        { n: "学信网", u: "https://www.chsi.com.cn", g: "CN" },
        { n: "研招网", u: "https://yz.chsi.com.cn", g: "CN" },
        { n: "Connected Papers", u: "https://www.connectedpapers.com", g: "INT" },
        { n: "Zotero 文献管理", u: "https://www.zotero.org", g: "INT" },
        { n: "Anki 记忆卡", u: "https://apps.ankiweb.net", g: "INT" },
        { n: "Quizlet", u: "https://quizlet.com", g: "INT" },
        { n: "XMind 思维导图", u: "https://www.xmind.cn", g: "CN" },
      ] },
    { id: 'doc', name: '文档', color: '#C9A35E', desc: '图片转PDF · Markdown · 格式转换',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/><path d="M9 12h6M9 16h6"/></svg>',
      sites: [
        { n: "WPS 办公", u: "https://www.wps.cn", g: "CN", h: 1 },
        { n: "Microsoft 365", u: "https://www.microsoft.com/zh-cn/microsoft-365/", g: "CN", h: 1 },
        { n: "Google Docs", u: "https://docs.google.com", g: "INT", h: 1 },
        { n: "Adobe Acrobat", u: "https://www.adobe.com/acrobat.html", g: "INT", h: 1 },
        { n: "福昕 PDF", u: "https://www.foxitsoftware.cn", g: "CN", h: 1 },
        { n: "iLovePDF", u: "https://www.ilovepdf.com/zh-cn", g: "CN", h: 1 },
        { n: "Smallpdf", u: "https://smallpdf.com/cn", g: "CN", h: 1 },
        { n: "PDF24 工具", u: "https://tools.pdf24.org/zh/", g: "CN", h: 1 },
        { n: "LibreOffice", u: "https://zh-cn.libreoffice.org", g: "CN", h: 1 },
        { n: "ONLYOFFICE", u: "https://www.onlyoffice.com/zh/", g: "CN", h: 1 },
        { n: "Calibre 电子书", u: "https://calibre-ebook.com", g: "INT", h: 1 },
        { n: "腾讯文档", u: "https://docs.qq.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "超级 PDF", u: "https://www.superpdf.cn", g: "CN" },
        { n: "Sejda PDF", u: "https://www.sejda.com/pdf/", g: "INT" },
        { n: "PDFescape", u: "https://www.pdfescape.com", g: "INT" },
        { n: "PDF Candy", u: "https://pdfcandy.com", g: "INT" },
        { n: "Soda PDF", u: "https://www.sodapdf.com", g: "INT" },
        { n: "Nitro PDF", u: "https://www.gonitro.com", g: "INT" },
        { n: "AvePDF", u: "https://avepdf.com", g: "INT" },
        { n: "Online2PDF", u: "https://online2pdf.com", g: "INT" },
        { n: "Convertio", u: "https://convertio.co", g: "INT" },
        { n: "Zamzar", u: "https://www.zamzar.com", g: "INT" },
        { n: "OCR Space", u: "https://ocr.space", g: "INT" },
        { n: "白描 OCR", u: "https://baimiao.app", g: "CN" },
        { n: "扫描全能王", u: "https://www.camscanner.com", g: "CN" },
        { n: "DocuSign 电子签名", u: "https://www.docusign.com", g: "INT" },
        { n: "法大大电子签", u: "https://www.fadada.com", g: "CN" },
        { n: "Overleaf LaTeX", u: "https://www.overleaf.com", g: "INT" },
        { n: "StackEdit Markdown", u: "https://stackedit.io", g: "INT" },
        { n: "Dillinger", u: "https://dillinger.io", g: "INT" },
        { n: "Typora", u: "https://typora.io", g: "INT" },
        { n: "Obsidian", u: "https://obsidian.md", g: "INT" },
        { n: "语雀", u: "https://www.yuque.com", g: "CN" },
        { n: "石墨文档", u: "https://shimo.im", g: "CN" },
      ] },
    { id: 'vplat', name: '视频平台', color: '#E0477C', desc: '平台导航 · 清单 · 提取下载',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="16" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z"/><path d="M2.5 9h19M2.5 15h19"/></svg>',
      sites: [
        { n: "哔哩哔哩", u: "https://www.bilibili.com", g: "CN", h: 1 },
        { n: "腾讯视频", u: "https://v.qq.com", g: "CN", h: 1 },
        { n: "爱奇艺", u: "https://www.iqiyi.com", g: "CN", h: 1 },
        { n: "优酷", u: "https://www.youku.com", g: "CN", h: 1 },
        { n: "芒果 TV", u: "https://www.mgtv.com", g: "CN", h: 1 },
        { n: "西瓜视频", u: "https://www.ixigua.com", g: "CN", h: 1 },
        { n: "央视频", u: "https://app.cctv.com", g: "CN", h: 1 },
        { n: "抖音", u: "https://www.douyin.com", g: "CN", h: 1 },
        { n: "快手", u: "https://www.kuaishou.com", g: "CN", h: 1 },
        { n: "YouTube", u: "https://www.youtube.com", g: "INT", h: 1 },
        { n: "Netflix", u: "https://www.netflix.com", g: "INT", h: 1 },
        { n: "Disney+", u: "https://www.disneyplus.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "咪咕视频", u: "https://www.miguvideo.com", g: "CN" },
        { n: "搜狐视频", u: "https://tv.sohu.com", g: "CN" },
        { n: "PP 视频", u: "https://www.pptv.com", g: "CN" },
        { n: "风行视频", u: "https://www.fun.tv", g: "CN" },
        { n: "人人视频", u: "https://www.rr.tv", g: "CN" },
        { n: "CCTV 官网", u: "https://tv.cctv.com", g: "CN" },
        { n: "电视猫", u: "https://www.tvmao.com", g: "CN" },
        { n: "樱花动漫", u: "https://www.yhdmp.cc", g: "CN" },
        { n: "Age 动漫", u: "https://www.agefans.net", g: "CN" },
        { n: "纪录片之家", u: "https://www.jlpzj.com", g: "CN" },
        { n: "中国纪录片网", u: "http://www.docuchina.cn", g: "CN" },
        { n: "小红书", u: "https://www.xiaohongshu.com", g: "CN" },
        { n: "视频号", u: "https://channels.weixin.qq.com", g: "CN" },
        { n: "虎牙直播", u: "https://www.huya.com", g: "CN" },
        { n: "斗鱼直播", u: "https://www.douyu.com", g: "CN" },
        { n: "Twitch", u: "https://www.twitch.tv", g: "INT" },
        { n: "HBO Max", u: "https://www.max.com", g: "INT" },
        { n: "Hulu", u: "https://www.hulu.com", g: "INT" },
        { n: "Apple TV+", u: "https://www.apple.com/apple-tv-plus/", g: "INT" },
      ] },
    { id: 'music', name: '音乐', color: '#E0759A', desc: '听歌导航 · 节拍器 · 音调发生器',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M9 9l10-2"/></svg>',
      sites: [
        { n: "网易云音乐", u: "https://music.163.com", g: "CN", h: 1 },
        { n: "QQ音乐", u: "https://y.qq.com", g: "CN", h: 1 },
        { n: "酷狗音乐", u: "https://www.kugou.com", g: "CN", h: 1 },
        { n: "酷我音乐", u: "https://www.kuwo.cn", g: "CN", h: 1 },
        { n: "咪咕音乐", u: "https://music.migu.cn", g: "CN", h: 1 },
        { n: "汽水音乐", u: "https://music.douyin.com", g: "CN", h: 1 },
        { n: "豆瓣音乐", u: "https://music.douban.com", g: "CN", h: 1 },
        { n: "Spotify", u: "https://www.spotify.com", g: "INT", h: 1 },
        { n: "Apple Music", u: "https://www.apple.com/apple-music/", g: "CN", h: 1 },
        { n: "YouTube Music", u: "https://music.youtube.com", g: "INT", h: 1 },
        { n: "SoundCloud", u: "https://soundcloud.com", g: "INT", h: 1 },
        { n: "Bandcamp", u: "https://bandcamp.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "千千音乐", u: "http://music.taihe.com", g: "CN" },
        { n: "MOO 音乐", u: "https://moo.music.qq.com", g: "CN" },
        { n: "5sing 原创音乐", u: "https://5sing.kugou.com", g: "CN" },
        { n: "Echo 回声", u: "https://www.app-echo.com", g: "CN" },
        { n: "看见音乐", u: "https://www.kanjian.com", g: "CN" },
        { n: "A8 音乐", u: "http://www.a8.com", g: "CN" },
        { n: "Deezer", u: "https://www.deezer.com", g: "INT" },
        { n: "Tidal", u: "https://tidal.com", g: "INT" },
        { n: "Amazon Music", u: "https://music.amazon.com", g: "INT" },
        { n: "Pandora", u: "https://www.pandora.com", g: "INT" },
        { n: "Last.fm", u: "https://www.last.fm", g: "INT" },
        { n: "Shazam 听歌识曲", u: "https://www.shazam.com", g: "INT" },
        { n: "Genius 歌词", u: "https://genius.com", g: "INT" },
        { n: "音乐谱", u: "https://www.yuepu.net", g: "CN" },
        { n: "吉他世界谱", u: "https://www.jita123.com", g: "CN" },
        { n: "MIDI 资源库", u: "https://www.midishow.com", g: "CN" },
      ] },
    { id: 'book', name: '图书', color: '#C9925E', desc: '书单 · 笔记 · 阅读速度 · ISBN',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h4v18H6a2 2 0 0 0-2 2z"/><path d="M20 5a2 2 0 0 0-2-2h-4v18h4a2 2 0 0 1 2 2z"/><path d="M10 6h4"/></svg>',
      sites: [
        { n: "微信读书", u: "https://weread.qq.com", g: "CN", h: 1 },
        { n: "豆瓣读书", u: "https://book.douban.com", g: "CN", h: 1 },
        { n: "京东图书", u: "https://book.jd.com", g: "CN", h: 1 },
        { n: "当当网", u: "http://www.dangdang.com", g: "CN", h: 1 },
        { n: "孔夫子旧书网", u: "https://www.kongfz.com", g: "CN", h: 1 },
        { n: "国家图书馆", u: "http://www.nlc.cn", g: "CN", h: 1 },
        { n: "谷歌图书", u: "https://books.google.com", g: "INT", h: 1 },
        { n: "Project Gutenberg", u: "https://www.gutenberg.org", g: "INT", h: 1 },
        { n: "Open Library", u: "https://openlibrary.org", g: "INT", h: 1 },
        { n: "Internet Archive", u: "https://archive.org", g: "INT", h: 1 },
        { n: "起点中文网", u: "https://www.qidian.com", g: "CN", h: 1 },
        { n: "番茄小说", u: "https://fanqienovel.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "晋江文学城", u: "https://www.jjwxc.net", g: "CN" },
        { n: "飞卢小说", u: "https://www.faloo.com", g: "CN" },
        { n: "纵横中文网", u: "https://www.zongheng.com", g: "CN" },
        { n: "17K 小说网", u: "https://www.17k.com", g: "CN" },
        { n: "塔读文学", u: "https://www.tadu.com", g: "CN" },
        { n: "起点女生网", u: "https://www.qdmm.com", g: "CN" },
        { n: "七猫小说", u: "https://www.qimao.com", g: "CN" },
        { n: "喜马拉雅听书", u: "https://www.ximalaya.com", g: "CN" },
        { n: "蜻蜓 FM", u: "https://www.qingting.fm", g: "CN" },
        { n: "荔枝 FM", u: "https://www.lizhi.fm", g: "CN" },
        { n: "得到听书", u: "https://www.dedao.cn", g: "CN" },
        { n: "樊登读书", u: "https://www.dushu.club", g: "CN" },
        { n: "上海图书馆", u: "https://www.library.sh.cn", g: "CN" },
        { n: "首都图书馆", u: "https://www.clcn.net.cn", g: "CN" },
        { n: "广州图书馆", u: "https://www.gzlib.gov.cn", g: "CN" },
        { n: "中国知网", u: "https://www.cnki.net", g: "CN" },
        { n: "维普资讯", u: "https://www.cqvip.com", g: "CN" },
        { n: "中国哲学书电子化计划", u: "https://ctext.org", g: "CN" },
        { n: "汉典古籍", u: "https://www.guoxue.com", g: "CN" },
        { n: "古诗文网", u: "https://www.gushiwen.cn", g: "CN" },
        { n: "Goodreads", u: "https://www.goodreads.com", g: "INT" },
        { n: "Amazon Kindle", u: "https://www.amazon.com/Kindle", g: "INT" },
      ] },
    { id: 'game', name: '游戏', color: '#2ABFC4', desc: '贪吃蛇 · 2048 · 俄罗斯方块 等 15 款',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6.5h10a5 5 0 0 1 0 10H7a5 5 0 0 1 0-10z"/><path d="M10 10v3M8.5 11.5h3"/><circle cx="16.2" cy="10" r=".8" fill="currentColor" stroke="none"/><circle cx="16.2" cy="13" r=".8" fill="currentColor" stroke="none"/></svg>',
      sites: [
        { n: "腾讯游戏", u: "https://games.qq.com", g: "CN", h: 1 },
        { n: "网易游戏", u: "https://www.163.com/game/", g: "CN", h: 1 },
        { n: "米哈游", u: "https://www.mihoyo.com", g: "CN", h: 1 },
        { n: "Steam", u: "https://store.steampowered.com", g: "INT", h: 1 },
        { n: "Epic Games", u: "https://store.epicgames.com", g: "INT", h: 1 },
        { n: "任天堂", u: "https://www.nintendo.com", g: "INT", h: 1 },
        { n: "PlayStation", u: "https://www.playstation.com", g: "INT", h: 1 },
        { n: "Xbox", u: "https://www.xbox.com", g: "INT", h: 1 },
        { n: "完美世界", u: "https://www.wanmei.com", g: "CN", h: 1 },
        { n: "心动网络", u: "https://www.xd.com", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "莉莉丝游戏", u: "https://www.lilith.com", g: "CN" },
        { n: "叠纸游戏", u: "https://www.papegames.com", g: "CN" },
        { n: "库洛游戏", u: "https://www.kurogame.com", g: "CN" },
        { n: "鹰角网络", u: "https://www.hypergryph.com", g: "CN" },
        { n: "祖龙娱乐", u: "https://www.archosaurgames.com", g: "CN" },
        { n: "吉比特", u: "https://www.g-bits.com", g: "CN" },
        { n: "三七互娱", u: "https://www.37.com", g: "CN" },
        { n: "巨人网络", u: "https://www.ga-me.com.cn", g: "CN" },
        { n: "盛趣游戏", u: "https://www.shengqugames.com", g: "CN" },
        { n: "搜狐畅游", u: "https://www.changyou.com", g: "CN" },
        { n: "WeGame", u: "https://www.wegame.com.cn", g: "CN" },
        { n: "GOG", u: "https://www.gog.com", g: "INT" },
        { n: "itch.io", u: "https://itch.io", g: "INT" },
        { n: "战网", u: "https://www.blizzard.com/zh-cn/", g: "CN" },
        { n: "Riot Games", u: "https://www.riotgames.com", g: "INT" },
        { n: "Ubisoft Connect", u: "https://www.ubisoft.com", g: "INT" },
        { n: "TapTap", u: "https://www.taptap.cn", g: "CN" },
        { n: "好游快爆", u: "https://www.3839.com", g: "CN" },
        { n: "4399 小游戏", u: "https://www.4399.com", g: "CN" },
        { n: "7k7k 小游戏", u: "https://www.7k7k.com", g: "CN" },
        { n: "游民星空", u: "https://www.gamersky.com", g: "CN" },
        { n: "3DM 游戏", u: "https://www.3dmgame.com", g: "CN" },
        { n: "A9VG", u: "https://www.a9vg.com", g: "CN" },
        { n: "游侠网", u: "https://www.ali213.net", g: "CN" },
        { n: "17173", u: "https://www.17173.com", g: "CN" },
        { n: "多玩游戏", u: "https://www.duowan.com", g: "CN" },
        { n: "虎牙直播", u: "https://www.huya.com", g: "CN" },
        { n: "斗鱼直播", u: "https://www.douyu.com", g: "CN" },
      ] },
    { id: 'code', name: '编程', color: '#5B8DEF', desc: '正则 · 格式化 · HTTP',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 6.5 3 12l5.5 5.5M15.5 6.5 21 12l-5.5 5.5M13.5 4l-3 16"/></svg>',
      sites: [
        { n: "GitHub", u: "https://github.com", g: "INT", h: 1 },
        { n: "Gitee 码云", u: "https://gitee.com", g: "CN", h: 1 },
        { n: "CSDN", u: "https://www.csdn.net", g: "CN", h: 1 },
        { n: "掘金", u: "https://juejin.cn", g: "CN", h: 1 },
        { n: "Stack Overflow", u: "https://stackoverflow.com", g: "INT", h: 1 },
        { n: "MDN 文档", u: "https://developer.mozilla.org/zh-CN/", g: "CN", h: 1 },
        { n: "npm", u: "https://www.npmjs.com", g: "INT", h: 1 },
        { n: "LeetCode 力扣", u: "https://leetcode.cn", g: "CN", h: 1 },
        { n: "CodePen", u: "https://codepen.io", g: "INT", h: 1 },
        { n: "JetBrains", u: "https://www.jetbrains.com/zh-cn/", g: "CN", h: 1 },
        { n: "Python", u: "https://www.python.org", g: "INT", h: 1 },
        { n: "Node.js", u: "https://nodejs.org/zh-cn/", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "DevDocs", u: "https://devdocs.io", g: "INT" },
        { n: "Can I Use", u: "https://caniuse.com", g: "INT" },
        { n: "Bundlephobia", u: "https://bundlephobia.com", g: "INT" },
        { n: "Roadmap.sh", u: "https://roadmap.sh", g: "INT" },
        { n: "Big-O 速查表", u: "https://www.bigocheatsheet.com", g: "INT" },
        { n: "菜鸟教程", u: "https://www.runoob.com", g: "CN" },
        { n: "W3School", u: "https://www.w3school.com.cn", g: "CN" },
        { n: "廖雪峰教程", u: "https://www.liaoxuefeng.com", g: "CN" },
        { n: "JavaGuide", u: "https://javaguide.cn", g: "CN" },
        { n: "小林 Coding", u: "https://www.xiaolincoding.com", g: "CN" },
        { n: "VS Code", u: "https://code.visualstudio.com", g: "INT" },
        { n: "Vim", u: "https://www.vim.org", g: "INT" },
        { n: "Zed 编辑器", u: "https://zed.dev", g: "INT" },
        { n: "Postman", u: "https://www.postman.com", g: "INT" },
        { n: "Apifox", u: "https://www.apifox.cn", g: "CN" },
        { n: "Hoppscotch", u: "https://hoppscotch.io", g: "INT" },
        { n: "Insomnia", u: "https://insomnia.rest", g: "INT" },
        { n: "CodeSandbox", u: "https://codesandbox.io", g: "INT" },
        { n: "StackBlitz", u: "https://stackblitz.com", g: "INT" },
        { n: "JSFiddle", u: "https://jsfiddle.net", g: "INT" },
        { n: "PlayCode", u: "https://playcode.io", g: "INT" },
        { n: "Vercel 部署", u: "https://vercel.com", g: "INT" },
        { n: "Netlify", u: "https://www.netlify.com", g: "INT" },
        { n: "Cloudflare Pages", u: "https://pages.cloudflare.com", g: "INT" },
        { n: "Railway", u: "https://railway.app", g: "INT" },
        { n: "Render", u: "https://render.com", g: "INT" },
        { n: "Jenkins", u: "https://www.jenkins.io", g: "INT" },
        { n: "pnpm", u: "https://pnpm.io", g: "INT" },
        { n: "npmmirror 镜像", u: "https://npmmirror.com", g: "CN" },
        { n: "PyPI", u: "https://pypi.org", g: "INT" },
        { n: "Maven", u: "https://maven.apache.org", g: "INT" },
        { n: "SegmentFault", u: "https://segmentfault.com", g: "CN" },
        { n: "V2EX", u: "https://www.v2ex.com", g: "CN" },
        { n: "开源中国", u: "https://www.oschina.net", g: "CN" },
        { n: "博客园", u: "https://www.cnblogs.com", g: "CN" },
        { n: "Hacker News", u: "https://news.ycombinator.com", g: "INT" },
        { n: "DEV Community", u: "https://dev.to", g: "INT" },
      ] },
    { id: 'github', name: 'GitHub', color: '#A7AFBB', desc: '仓库 · 用户 · README',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8a9.4 9.4 0 0 0-6.4 16.3c.5.1.6-.2.6-.5v-1.8c-2.6.6-3.2-1.2-3.2-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.3.3.6.9.6 1.9v2.8c0 .3.1.6.6.5A9.4 9.4 0 0 0 12 2.8z"/></svg>',
      sites: [
        { n: "GitHub", u: "https://github.com", g: "INT", h: 1 },
        { n: "GitLab", u: "https://about.gitlab.com", g: "INT", h: 1 },
        { n: "Gitee 码云", u: "https://gitee.com", g: "CN", h: 1 },
        { n: "Bitbucket", u: "https://bitbucket.org", g: "INT", h: 1 },
        { n: "极狐 GitLab", u: "https://gitlab.cn", g: "CN", h: 1 },
        { n: "腾讯 CODING", u: "https://coding.net", g: "CN", h: 1 },
        { n: "SourceForge", u: "https://sourceforge.net", g: "INT", h: 1 },
        { n: "Azure DevOps", u: "https://azure.microsoft.com/zh-cn/services/devops/", g: "CN", h: 1 },
        { n: "Gitea", u: "https://about.gitea.com", g: "INT", h: 1 },
        { n: "Sourcegraph", u: "https://about.sourcegraph.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "GitHub Desktop", u: "https://desktop.github.com", g: "INT" },
        { n: "GitKraken", u: "https://www.gitkraken.com", g: "INT" },
        { n: "Sourcetree", u: "https://www.sourcetreeapp.com", g: "INT" },
        { n: "SmartGit", u: "https://www.syntevo.com/smartgit/", g: "INT" },
        { n: "TortoiseGit", u: "https://tortoisegit.org", g: "INT" },
        { n: "Fork", u: "https://git-fork.com", g: "INT" },
        { n: "Sublime Merge", u: "https://www.sublimemerge.com", g: "INT" },
        { n: "Codeberg", u: "https://codeberg.org", g: "INT" },
        { n: "Forgejo", u: "https://forgejo.org", g: "INT" },
        { n: "OneDev", u: "https://onedev.io", g: "INT" },
        { n: "grep.app", u: "https://grep.app", g: "INT" },
        { n: "searchcode", u: "https://searchcode.com", g: "INT" },
        { n: "清华开源镜像", u: "https://mirrors.tuna.tsinghua.edu.cn", g: "CN" },
        { n: "阿里开源镜像", u: "https://mirrors.aliyun.com", g: "CN" },
        { n: "中科大镜像", u: "https://mirrors.ustc.edu.cn", g: "CN" },
      ] },
    { id: 'shop', name: '购物', color: '#FF8A5C', desc: '尺码 · 快递 · 防骗 · 省钱',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H6.6a1.8 1.8 0 0 1-1.8-1.8z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>',
      sites: [
        { n: "淘宝", u: "https://www.taobao.com", g: "CN", h: 1 },
        { n: "京东", u: "https://www.jd.com", g: "CN", h: 1 },
        { n: "拼多多", u: "https://www.pinduoduo.com", g: "CN", h: 1 },
        { n: "唯品会", u: "https://www.vipshop.com", g: "CN", h: 1 },
        { n: "苏宁易购", u: "https://www.suning.com", g: "CN", h: 1 },
        { n: "得物", u: "https://www.dewu.com", g: "CN", h: 1 },
        { n: "1688 批发", u: "https://www.1688.com", g: "CN", h: 1 },
        { n: "Amazon 亚马逊", u: "https://www.amazon.com", g: "INT", h: 1 },
        { n: "eBay", u: "https://www.ebay.com", g: "INT", h: 1 },
        { n: "闲鱼", u: "https://www.goofish.com", g: "CN", h: 1 },
        { n: "Costco", u: "https://www.costco.com", g: "INT", h: 1 },
        { n: "Walmart", u: "https://www.walmart.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "天猫", u: "https://www.tmall.com", g: "CN" },
        { n: "转转", u: "https://www.zhuanzhuan.com", g: "CN" },
        { n: "找靓机", u: "https://www.zhaoliangji.com", g: "CN" },
        { n: "多抓鱼", u: "https://www.duozhuayu.com", g: "CN" },
        { n: "中国图书网", u: "https://www.bookschina.com", g: "CN" },
        { n: "AliExpress 速卖通", u: "https://www.aliexpress.com", g: "INT" },
        { n: "Newegg", u: "https://www.newegg.com", g: "INT" },
        { n: "Etsy 手作", u: "https://www.etsy.com", g: "INT" },
        { n: "Target", u: "https://www.target.com", g: "INT" },
        { n: "Best Buy", u: "https://www.bestbuy.com", g: "INT" },
        { n: "什么值得买", u: "https://www.smzdm.com", g: "CN" },
        { n: "慢慢买比价", u: "https://www.manmanbuy.com", g: "CN" },
        { n: "快递 100", u: "https://www.kuaidi100.com", g: "CN" },
        { n: "17TRACK 国际物流", u: "https://www.17track.net", g: "INT" },
        { n: "12315 维权", u: "https://www.12315.cn", g: "CN" },
        { n: "黑猫投诉", u: "https://tousu.sina.com.cn", g: "CN" },
      ] },
    { id: 'com', name: '通讯', color: '#36B5E0', desc: '区号 · 运营商 · 常用号码',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.5h3l1.6 4.2-2 1.6a12 12 0 0 0 6.1 6.1l1.6-2 4.2 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2z"/></svg>',
      sites: [
        { n: "中国移动", u: "https://www.10086.cn", g: "CN", h: 1 },
        { n: "中国联通", u: "https://www.10010.com", g: "CN", h: 1 },
        { n: "中国电信", u: "https://www.189.cn", g: "CN", h: 1 },
        { n: "中国广电", u: "https://www.cbn.cn", g: "CN", h: 1 },
        { n: "微信", u: "https://weixin.qq.com", g: "CN", h: 1 },
        { n: "钉钉", u: "https://www.dingtalk.com", g: "CN", h: 1 },
        { n: "飞书", u: "https://www.feishu.cn", g: "CN", h: 1 },
        { n: "Zoom", u: "https://www.zoom.us", g: "INT", h: 1 },
        { n: "Skype", u: "https://www.skype.com", g: "INT", h: 1 },
        { n: "Telegram", u: "https://telegram.org", g: "INT", h: 1 },
        { n: "WhatsApp", u: "https://www.whatsapp.com", g: "INT", h: 1 },
        { n: "Microsoft Teams", u: "https://www.microsoft.com/zh-cn/microsoft-teams/", g: "CN", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "QQ", u: "https://www.qq.com", g: "CN" },
        { n: "企业微信", u: "https://work.weixin.qq.com", g: "CN" },
        { n: "Slack", u: "https://slack.com", g: "INT" },
        { n: "Discord", u: "https://discord.com", g: "INT" },
        { n: "Signal", u: "https://signal.org", g: "INT" },
        { n: "Element/Matrix", u: "https://element.io", g: "INT" },
        { n: "QQ 邮箱", u: "https://mail.qq.com", g: "CN" },
        { n: "163 邮箱", u: "https://mail.163.com", g: "CN" },
        { n: "Gmail", u: "https://mail.google.com", g: "INT" },
        { n: "Outlook 邮箱", u: "https://outlook.live.com", g: "INT" },
        { n: "ProtonMail", u: "https://proton.me/mail", g: "INT" },
        { n: "iCloud 邮箱", u: "https://www.icloud.com/mail", g: "INT" },
        { n: "腾讯会议", u: "https://meeting.tencent.com", g: "CN" },
        { n: "Google Meet", u: "https://meet.google.com", g: "INT" },
        { n: "Cisco Webex", u: "https://www.webex.com", g: "INT" },
        { n: "阿里云短信", u: "https://www.aliyun.com/product/sms", g: "CN" },
        { n: "网易云信", u: "https://netease.im", g: "CN" },
        { n: "极光推送", u: "https://www.jiguang.cn", g: "CN" },
        { n: "114 查号台", u: "https://www.114.com.cn", g: "CN" },
        { n: "百度号码认证", u: "https://haoma.baidu.com", g: "CN" },
      ] },
    { id: 'sys', name: '系统', color: '#9B6DF0', desc: '设备信息 · 性能 · Win/安卓工具',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>',
      sites: [
        { n: "联想", u: "https://www.lenovo.com.cn", g: "CN", h: 1 },
        { n: "华为", u: "https://www.huawei.com/cn", g: "CN", h: 1 },
        { n: "小米", u: "https://www.mi.com", g: "CN", h: 1 },
        { n: "Microsoft", u: "https://www.microsoft.com/zh-cn/", g: "CN", h: 1 },
        { n: "Intel", u: "https://www.intel.cn", g: "CN", h: 1 },
        { n: "AMD", u: "https://www.amd.com/zh-hans", g: "CN", h: 1 },
        { n: "NVIDIA", u: "https://www.nvidia.cn", g: "CN", h: 1 },
        { n: "苹果", u: "https://www.apple.com.cn", g: "CN", h: 1 },
        { n: "Windows", u: "https://www.microsoft.com/zh-cn/windows/", g: "CN", h: 1 },
        { n: "macOS", u: "https://www.apple.com.cn/macos/", g: "CN", h: 1 },
        { n: "Ubuntu", u: "https://ubuntu.com", g: "INT", h: 1 },
        { n: "Android", u: "https://www.android.com", g: "INT", h: 1 },
        /* ↓ 小众站点：默认折叠，点「更多」展开 ↓ */
        { n: "微星", u: "https://www.msi.com", g: "CN" },
        { n: "技嘉", u: "https://www.gigabyte.cn", g: "CN" },
        { n: "华硕", u: "https://www.asus.com.cn", g: "CN" },
        { n: "宏碁", u: "https://www.acer.com.cn", g: "CN" },
        { n: "神舟", u: "https://www.hasee.com", g: "CN" },
        { n: "机械革命", u: "https://www.mechrevo.com", g: "CN" },
        { n: "ROG 玩家国度", u: "https://rog.asus.com.cn", g: "CN" },
        { n: "七彩虹", u: "https://www.colorful.cn", g: "CN" },
        { n: "金士顿", u: "https://www.kingston.com", g: "CN" },
        { n: "海盗船", u: "https://www.corsair.com", g: "INT" },
        { n: "希捷", u: "https://www.seagate.com.cn", g: "CN" },
        { n: "西部数据", u: "https://www.westerndigital.com", g: "CN" },
        { n: "致钛", u: "https://www.zhi-tai.com", g: "CN" },
        { n: "戴尔显示器", u: "https://www.dell.com/zh-cn", g: "CN" },
        { n: "AOC", u: "https://www.aoc.com", g: "CN" },
        { n: "明基", u: "https://www.benq.com.cn", g: "CN" },
        { n: "罗技", u: "https://www.logitech.com.cn", g: "CN" },
        { n: "雷蛇", u: "https://www.razer.com", g: "INT" },
        { n: "Cherry 键盘", u: "https://www.cherry.de", g: "INT" },
        { n: "Deepin 深度", u: "https://www.deepin.org", g: "CN" },
        { n: "银河麒麟", u: "https://www.kylinos.cn", g: "CN" },
        { n: "统信 UOS", u: "https://www.uniontech.com", g: "CN" },
        { n: "Debian", u: "https://www.debian.org", g: "INT" },
        { n: "Fedora", u: "https://fedoraproject.org", g: "INT" },
        { n: "Kali Linux", u: "https://www.kali.org", g: "INT" },
        { n: "微 PE 工具箱", u: "https://www.wepe.com.cn", g: "CN" },
        { n: "Rufus 启动盘", u: "https://rufus.ie", g: "INT" },
        { n: "Ventoy", u: "https://www.ventoy.net", g: "INT" },
        { n: "DiskGenius", u: "https://www.diskgenius.cn", g: "CN" },
        { n: "傲梅分区助手", u: "https://www.disktool.cn", g: "CN" },
        { n: "CPU-Z", u: "https://www.cpuid.com", g: "INT" },
        { n: "GPU-Z", u: "https://www.techpowerup.com/gpuz/", g: "INT" },
        { n: "AIDA64", u: "https://www.aida64.com", g: "INT" },
        { n: "HWiNFO", u: "https://www.hwinfo.com", g: "INT" },
        { n: "鲁大师", u: "https://www.ludashi.com", g: "CN" },
        { n: "Dism++", u: "https://www.chuyu.me", g: "CN" },
        { n: "火绒安全", u: "https://www.huorong.cn", g: "CN" },
        { n: "Everything 搜索", u: "https://www.voidtools.com", g: "INT" },
        { n: "Geek 卸载", u: "https://geekuninstaller.com", g: "INT" },
        { n: "微软 PowerToys", u: "https://learn.microsoft.com/windows/powertoys/", g: "INT" },
        { n: "Windows Terminal", u: "https://github.com/microsoft/terminal", g: "INT" },
        { n: "Sysinternals", u: "https://learn.microsoft.com/sysinternals/", g: "INT" },
        { n: "NirSoft 工具集", u: "https://www.nirsoft.net", g: "INT" },
        { n: "驱动精灵", u: "https://www.drivergenius.com", g: "CN" },
        { n: "驱动人生", u: "https://www.160.com", g: "CN" },
        { n: "WSL 子系统", u: "https://learn.microsoft.com/windows/wsl/", g: "INT" },
      ] },
  ];

  /* ================= 侧栏板块分组（v3.3：9 大板块，按使用频率排序；搜索日常第一位） ================= */
  var CAT_GROUPS = [
    ['日常工具', ['search', 'calc', 'text', 'codec', 'time', 'random', 'life']],
    ['AI 与网络', ['ai', 'net']],
    ['图片与视频', ['image', 'video']],
    ['资源与数据', ['down', 'cloud', 'data']],
    ['效率与学习', ['work', 'study', 'doc']],
    ['影音 · 阅读 · 游戏', ['vplat', 'music', 'book', 'game']],
    ['编程与开源', ['code', 'github']],
    ['购物与通讯', ['shop', 'com']],
    ['系统工具', ['sys']]
  ];

  /* 按分组顺序返回分类（首页卡片 / 帮助页 / 侧栏平铺共用，保证全站顺序一致） */
  function orderedCats() {
    var out = [], seen = {};
    CAT_GROUPS.forEach(function (grp) {
      grp[1].forEach(function (cid) {
        var c = catMeta(cid);
        if (c && !seen[cid]) { seen[cid] = 1; out.push(c); }
      });
    });
    CATS.forEach(function (c) { if (!seen[c.id]) { seen[c.id] = 1; out.push(c); } });
    return out;
  }

  /* ================= 工具注册表 ================= */
  var tools = {};
  var order = [];
  var catCount = {};

  function register(t) {
    if (!t || !t.id || !t.name) return;
    if (tools[t.id]) return;
    tools[t.id] = t;
    order.push(t.id);
    catCount[t.cat] = (catCount[t.cat] || 0) + 1;
  }
  function byId(id) { return tools[id] || null; }
  function catTools(catId) {
    var arr = order.map(function (id) { return tools[id]; })
      .filter(function (t) { return t.cat === catId; });
    /* 离线工具在前、联网工具在后（稳定排序，保持各自注册顺序） */
    return arr.filter(function (t) { return !t.net; }).concat(arr.filter(function (t) { return !!t.net; }));
  }
  function allTools() { return order.map(function (id) { return tools[id]; }); }
  function catMeta(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return null;
  }
  function toolCount() { return order.length; }

  /* ================= 路由 ================= */
  var currentCleanup = null;
  var activeTimers = [];
  var viewEl, crumbEl;

  function setTimer(fn, ms) {
    var id = setTimeout(fn, ms);
    activeTimers.push(id);
    return id;
  }
  function setIntervalSafe(fn, ms) {
    var id = setInterval(fn, ms);
    activeTimers.push(id);
    return id;
  }
  function clearAllTimers() {
    activeTimers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
    activeTimers = [];
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  function copyText(text, done) {
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) { if (done) done(); else toast(t('ui.copied')); }
        else { toast(t('ui.copyFail')); }
      } catch (e) { toast(t('ui.copyFail')); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (done) done(); else toast(t('ui.copied'));
      }, fallback);
    } else fallback();
  }

  function mkCopyBtn(text) {
    var b = document.createElement('button');
    b.className = 'btn btn-ghost copy-btn';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a1 1 0 0 1 1-1h9"/></svg> ' + t('ui.copy');
    b.addEventListener('click', function () { copyText(text); });
    return b;
  }

  function fmtNum(n, digits) {
    if (n == null || isNaN(n)) return '-';
    if (digits != null) return Number(n).toFixed(digits);
    return String(Math.round(n * 1e6) / 1e6);
  }

  function readFile(file, cb) {
    var r = new FileReader();
    r.onload = function () { cb(r.result); };
    r.onerror = function () { toast(t('ui.readFail')); };
    r.readAsDataURL(file);
  }

  /* 网络请求（带超时，失败抛错） */
  function getJSON(url, timeout) {
    var ms = timeout || 8000;
    return new Promise(function (resolve, reject) {
      var ctrl = null;
      if (typeof AbortController !== 'undefined') ctrl = new AbortController();
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); reject(new Error('请求超时')); }, ms);
      var opt = { method: 'GET', cache: 'no-store', redirect: 'follow' };
      if (ctrl) opt.signal = ctrl.signal;
      fetch(url, opt).then(function (r) {
        if (!r.ok) { clearTimeout(timer); reject(new Error('HTTP ' + r.status)); return; }
        r.json().then(function (d) { clearTimeout(timer); resolve(d); }, function () { clearTimeout(timer); reject(new Error('解析失败')); });
      }).catch(function (e) { clearTimeout(timer); reject(e); });
    });
  }
  function fetchText(url, timeout) {
    var ms = timeout || 8000;
    return new Promise(function (resolve, reject) {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); reject(new Error('请求超时')); }, ms);
      var opt = { method: 'GET', cache: 'no-store', redirect: 'follow' };
      if (ctrl) opt.signal = ctrl.signal;
      fetch(url, opt).then(function (r) {
        if (!r.ok) { clearTimeout(timer); reject(new Error('HTTP ' + r.status)); return; }
        r.text().then(function (d) { clearTimeout(timer); resolve(d); }, function () { clearTimeout(timer); reject(new Error('解析失败')); });
      }).catch(function (e) { clearTimeout(timer); reject(e); });
    });
  }
  function blobDownload(data, filename) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(data);
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }, 800);
  }
  function getBlob(url, timeout) {
    var ms = timeout || 20000;
    return new Promise(function (resolve, reject) {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); reject(new Error('请求超时')); }, ms);
      var opt = { method: 'GET', cache: 'no-store', redirect: 'follow' };
      if (ctrl) opt.signal = ctrl.signal;
      fetch(url, opt).then(function (r) {
        if (!r.ok) { clearTimeout(timer); reject(new Error('HTTP ' + r.status)); return; }
        r.blob().then(function (b) { clearTimeout(timer); resolve(b); }, function () { clearTimeout(timer); reject(new Error('读取失败')); });
      }).catch(function (e) { clearTimeout(timer); reject(e); });
    });
  }

  /* ================= 存储 ================= */
  var store = {
    get: function (k, d) {
      try {
        var v = localStorage.getItem('omnitool.' + k);
        return v == null ? d : JSON.parse(v);
      } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem('omnitool.' + k, JSON.stringify(v)); }
      catch (e) { /* 静默 */ }
    },
    del: function (k) {
      try { localStorage.removeItem('omnitool.' + k); } catch (e) {}
    },
    clear: function () {
      try {
        var rm = [];
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key && key.indexOf('omnitool.') === 0) rm.push(key);
        }
        rm.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
    }
  };

  /* ================= 设置与主题 ================= */
  var settings = { theme: 'default', accent: '', glass: false, density: 'normal', radius: 14, statusbar: true, sidegroup: true, mode: 'dark', sitesMode: 'win', lang: 'auto', fontScale: 100, motion: true };
  var mediaDark = (typeof window.matchMedia === 'function') ? window.matchMedia('(prefers-color-scheme: light)') : null;

  /* ================= 多语言（字典 js/i18n.js + 扩展 js/i18n-more.js） ================= */
  var LANG_META = [
    { id: 'zh', label: '中文', bcp: ['zh', 'zh-CN', 'zh-TW', 'zh-HK', 'zh-SG', 'zh-MO'] },
    { id: 'en', label: 'English', bcp: ['en', 'en-US', 'en-GB', 'en-AU', 'en-CA'] },
    { id: 'ja', label: '日本語', bcp: ['ja', 'ja-JP'] },
    { id: 'ko', label: '한국어', bcp: ['ko', 'ko-KR'] },
    { id: 'fr', label: 'Français', bcp: ['fr', 'fr-FR', 'fr-CA'] },
    { id: 'de', label: 'Deutsch', bcp: ['de', 'de-DE', 'de-AT', 'de-CH'] },
    { id: 'es', label: 'Español', bcp: ['es', 'es-ES', 'es-MX'] },
    { id: 'ru', label: 'Русский', bcp: ['ru', 'ru-RU'] },
    { id: 'ar', label: 'العربية', bcp: ['ar', 'ar-SA'] }
  ];
  function resolvedLang() {
    var l = settings.lang;
    if (l && l !== 'auto') return l;
    var nav = String((navigator.language || 'zh')).toLowerCase();
    for (var i = 0; i < LANG_META.length; i++) {
      for (var j = 0; j < LANG_META[i].bcp.length; j++) {
        if (nav.indexOf(LANG_META[i].bcp[j].toLowerCase()) === 0) return LANG_META[i].id;
      }
    }
    return 'zh';
  }
  function t(key) {
    var d = window.I18N && window.I18N[key];
    if (!d) return null;
    if (Array.isArray(d) && d.length === 1 && Array.isArray(d[0])) d = d[0];
    var L = resolvedLang();
    if (L === 'zh') return d[0];
    if (L === 'en') return d[1] != null && d[1] !== '' ? d[1] : d[0];
    var ext = window.I18N_EXT && window.I18N_EXT[key];
    if (ext && ext[L]) return ext[L];
    return d[1] != null && d[1] !== '' ? d[1] : d[0];
  }
  function catName(c) { return t('cat.' + c.id + '.name') || c.name; }
  function catDesc(c) { return t('cat.' + c.id + '.desc') || c.desc || ''; }
  function groupName(gzh) { return t('grp.' + gzh) || gzh; }
  function toolName(tool) { return t('tool.' + tool.id + '.name') || tool.name; }
  function toolDesc(tool) { return t('tool.' + tool.id + '.desc') || tool.desc || ''; }
  function isEn() { return resolvedLang() !== 'zh'; }

  function resolveMode() {
    if (settings.mode === 'light') return 'light';
    if (settings.mode === 'auto') return (mediaDark && mediaDark.matches) ? 'light' : 'dark';
    return 'dark';
  }
  function loadSettings() {
    var s = store.get('settings', {});
    var keys = ['theme', 'accent', 'glass', 'density', 'radius', 'statusbar', 'sidegroup', 'mode', 'sitesMode', 'lang', 'fontScale', 'motion'];
    keys.forEach(function (k) {
      if (s[k] !== undefined) settings[k] = s[k];
    });
  }
  function saveSettings() { store.set('settings', settings); }
  function applySettings() {
    var root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-density', settings.density);
    /* 明暗：极简白主题固定为浅色，其余按 mode 解析 */
    root.setAttribute('data-mode', settings.theme === 'light' ? 'light' : resolveMode());
    if (settings.accent) root.style.setProperty('--accent', settings.accent);
    else root.style.removeProperty('--accent');
    root.style.setProperty('--radius', Math.max(6, Math.min(28, Number(settings.radius) || 14)) + 'px');
    document.body.classList.toggle('glass', !!settings.glass);
    document.body.classList.toggle('hide-statusbar', !settings.statusbar);
    document.body.classList.toggle('no-motion', settings.motion === false);
    var fs2 = Math.max(80, Math.min(140, Number(settings.fontScale) || 100));
    root.style.setProperty('--font-scale', fs2 + '%');
    var mt = document.querySelector('meta[name="theme-color"]');
    if (mt) mt.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim() || '#121417');
  }
  function updateSetting(key, val) {
    settings[key] = val;
    saveSettings();
    applySettings();
    if (key === 'sidegroup') buildNav();
  }

  /* ================= 实时状态栏 ================= */
  var WEEK_ZH = ['日', '一', '二', '三', '四', '五', '六'];
  var WEEK_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var WEEK_LANGS = {
    zh: ['日', '一', '二', '三', '四', '五', '六'], ja: ['日', '月', '火', '水', '木', '金', '土'],
    ko: ['일', '월', '화', '수', '목', '금', '토'], fr: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
    de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], es: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    ru: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'], ar: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']
  };
  var MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function weekName(d) {
    var L = resolvedLang();
    if (L === 'en') return WEEK_EN[d.getDay()];
    var w = WEEK_LANGS[L] || WEEK_ZH;
    return (L === 'zh' ? '星期' : '') + w[d.getDay()];
  }
  var WEATHER = {
    0: ['☀️', '晴'], 1: ['🌤️', '多云转晴'], 2: ['⛅', '多云'], 3: ['☁️', '阴'],
    45: ['🌫️', '雾'], 48: ['🌫️', '雾凇'], 51: ['🌦️', '毛毛雨'], 53: ['🌦️', '毛毛雨'], 55: ['🌦️', '毛毛雨'],
    61: ['🌧️', '小雨'], 63: ['🌧️', '中雨'], 65: ['🌧️', '大雨'], 66: ['🌧️', '冻雨'], 67: ['🌧️', '冻雨'],
    71: ['🌨️', '小雪'], 73: ['🌨️', '中雪'], 75: ['❄️', '大雪'], 77: ['🌨️', '雪粒'],
    80: ['🌦️', '阵雨'], 81: ['🌧️', '阵雨'], 82: ['⛈️', '强阵雨'], 85: ['🌨️', '阵雪'], 86: ['🌨️', '强阵雪'],
    95: ['⛈️', '雷阵雨'], 96: ['⛈️', '雷阵雨伴冰雹'], 99: ['⛈️', '强雷暴']
  };
  var WEATHER_EN = {
    0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Severe thunderstorm'
  };
  var statusData = { ip: '', city: '', region: '', country: '', countryCode: '', lat: null, lon: null, temp: null, code: null, loading: false, proxyTxt: '🛡️ 检测中…', proxyCls: 'off', proxyTip: '正在检测…' };
  /* 国家码 → 国旗 emoji（区域指示符对） */
    /* 常见国家/地区内联 SVG 国旗（Windows 不渲染国旗 emoji，统一用 SVG 保证可见） */
  var FLAG_SVG = {
    BY: '<rect width="30" height="20" fill="#D22730"/><rect y="8" width="30" height="4" fill="#fff"/><rect y="12" width="30" height="8" fill="#007C30"/>',
    YE: '<rect width="30" height="6.7" fill="#CE1126"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.4" width="30" height="6.6" fill="#000000"/>',
    BH: '<rect width="8" height="20" fill="#fff"/><polygon points="8,0 12,1.8 8,3.6 12,5.4 8,7.2 12,9 8,10.8 12,12.6 8,14.4 12,16.2 8,18 12,19.8 8,20 30,20 30,0" fill="#CE1126"/>',
    CY: '<rect width="30" height="20" fill="#fff"/><rect y="8.2" width="30" height="3.6" fill="#D57800"/>',
    GE: '<rect width="30" height="20" fill="#fff"/><rect x="14" width="2" height="20" fill="#FF0000"/><rect y="9" width="30" height="2" fill="#FF0000"/><rect x="3" y="4" width="2.2" height="2.2" fill="#FF0000"/><rect x="25" y="4" width="2.2" height="2.2" fill="#FF0000"/><rect x="3" y="14" width="2.2" height="2.2" fill="#FF0000"/><rect x="25" y="14" width="2.2" height="2.2" fill="#FF0000"/>',
    AM: '<rect width="30" height="6.7" fill="#D90012"/><rect y="6.7" width="30" height="6.7" fill="#0033A0"/><rect y="13.4" width="30" height="6.6" fill="#F2A800"/>',
    AZ: '<rect width="30" height="6.7" fill="#00B5E2"/><rect y="6.7" width="30" height="6.7" fill="#EF3340"/><rect y="13.4" width="30" height="6.6" fill="#509E2F"/><circle cx="17" cy="10" r="3.2" fill="#fff"/><polygon points="19,6.4 19.7,8.4 21.8,8.4 20.1,9.6 20.8,11.6 19,10.5 17.2,11.6 17.9,9.6 16.2,8.4 18.3,8.4" fill="#fff"/>',
    US: '<rect width="30" height="20" fill="#fff"/><g fill="#B22234"><rect y="0" width="30" height="1.43"/><rect y="2.86" width="30" height="1.43"/><rect y="5.72" width="30" height="1.43"/><rect y="8.58" width="30" height="1.43"/><rect y="11.44" width="30" height="1.43"/><rect y="14.3" width="30" height="1.43"/><rect y="17.16" width="30" height="1.43"/></g><rect width="13" height="10" fill="#3C3B6E"/>',
    JP: '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#BC002D"/>',
    KR: '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5" fill="#CD2E3A"/><path d="M15 5a5 5 0 0 1 0 10 2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 0 0-5z" fill="#0047A0"/>',
    GB: '<rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" stroke-width="2"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="4"/>',
    DE: '<rect width="30" height="6.7" fill="#000"/><rect y="6.7" width="30" height="6.7" fill="#DD0000"/><rect y="13.4" width="30" height="6.6" fill="#FFCE00"/>',
    FR: '<rect width="10" height="20" fill="#0055A4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#EF4135"/>',
    RU: '<rect width="30" height="6.7" fill="#fff"/><rect y="6.7" width="30" height="6.7" fill="#0039A6"/><rect y="13.4" width="30" height="6.6" fill="#D52B1E"/>',
    HK: '<rect width="30" height="20" fill="#DE2910"/><circle cx="15" cy="10" r="4" fill="#fff"/><circle cx="15" cy="10" r="1.4" fill="#DE2910"/>',
    TW: '<rect width="30" height="20" fill="#FE0000"/><rect width="15" height="10" fill="#000095"/><path d="M15 2.5l.8 1.7 1.9.2-1.4 1.3.4 1.9-1.7-.9-1.7.9.4-1.9-1.4-1.3 1.9-.2z" fill="#fff"/>',
    SG: '<rect width="30" height="10" fill="#ED2939"/><rect y="10" width="30" height="10" fill="#fff"/><circle cx="6" cy="5" r="3" fill="#fff"/><circle cx="7.2" cy="5" r="2.4" fill="#ED2939"/>',
    CA: '<rect width="8" height="20" fill="#FF0000"/><rect x="22" width="8" height="20" fill="#FF0000"/><polygon points="15,4 16.5,8 19,8 17,10 18,13 15,11 12,13 13,10 11,8 13.5,8" fill="#FF0000"/>',
    VN: '<rect width="30" height="20" fill="#DA251D"/><polygon points="15,4 16.5,9 21,9 17.5,11.5 18.5,16 15,13 11.5,16 12.5,11.5 9,9 13.5,9" fill="#FFFF00"/>',
    TH: '<rect width="30" height="20" fill="#A51931"/><rect y="2" width="30" height="3.2" fill="#fff"/><rect y="5.2" width="30" height="9.6" fill="#2D2A4A"/><rect y="14.8" width="30" height="3.2" fill="#fff"/>',
    AU: '<rect width="30" height="20" fill="#00247D"/><g fill="#fff"><circle cx="6" cy="5" r="1"/><circle cx="9" cy="9" r="1"/><circle cx="7" cy="13" r="1"/><circle cx="15" cy="6" r="1.6"/><circle cx="20" cy="4" r="1"/><circle cx="23" cy="9" r="1"/><circle cx="20" cy="14" r="1"/></g>',
    IN: '<rect width="30" height="6.7" fill="#FF9933"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.4" width="30" height="6.6" fill="#138808"/><circle cx="15" cy="10" r="2" fill="none" stroke="#000080" stroke-width="0.6"/>',
    MY: '<rect width="30" height="20" fill="#fff"/><g fill="#CC0001"><rect y="0" width="30" height="1.43"/><rect y="2.86" width="30" height="1.43"/><rect y="5.72" width="30" height="1.43"/><rect y="8.58" width="30" height="1.43"/></g><rect width="11" height="10" fill="#010066"/>',
    BR: '<rect width="30" height="20" fill="#009C3B"/><polygon points="15,3 27,10 15,17 3,10" fill="#FFDF00"/><circle cx="15" cy="10" r="3" fill="#002776"/>',
    IT: '<rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/>',
    ES: '<rect width="30" height="5" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/><rect y="15" width="30" height="5" fill="#AA151B"/>',
    NL: '<rect width="30" height="6.7" fill="#AE1C28"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.4" width="30" height="6.6" fill="#21468B"/>',
    CH: '<rect width="30" height="20" fill="#DA291C"/><rect x="13" y="6" width="4" height="8" fill="#fff"/><rect x="11" y="8" width="8" height="4" fill="#fff"/>',
    PH: '<rect width="30" height="10" fill="#0038A8"/><rect y="10" width="30" height="10" fill="#CE1126"/><polygon points="7,10 11,8.5 11,11.5" fill="#fff"/><circle cx="4" cy="10" r="1.6" fill="#FCD116"/>',
    ID: '<rect width="30" height="10" fill="#E70011"/><rect y="10" width="30" height="10" fill="#fff"/>',
    MO: '<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5.5" fill="#2F9E44"/>',
    KP: '<rect y="0.0" width="30" height="4.0" fill="#024FA2"/><rect y="4.0" width="30" height="2.0" fill="#fff"/><rect y="6.0" width="30" height="8.0" fill="#ED1C27"/><rect y="14.0" width="30" height="2.0" fill="#fff"/><rect y="16.0" width="30" height="4.0" fill="#024FA2"/><polygon points="15.0,6.6 15.8,8.9 18.2,8.9 16.3,10.4 17.0,12.8 15.0,11.4 13.0,12.8 13.7,10.4 11.8,8.9 14.2,8.9" fill="#ED1C27"/>',
    AE: '<rect x="0.0" width="30.0" height="20" fill="#DA291C"/><rect y="0.0" width="30" height="6.7" fill="#00843D"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#000000"/>',
    SA: '<rect y="0.0" width="30" height="3.0" fill="#fff"/><rect y="3.0" width="30" height="17.0" fill="#165D31"/>',
    IL: '<rect width="30" height="20" fill="#fff"/><rect width="30" height="3.6" fill="#0038B8"/><rect y="16.4" width="30" height="3.6" fill="#0038B8"/><polygon points="15,7.2 16.7,10.4 20.3,10.4 17.6,12.7 18.7,16.2 15,14 11.3,16.2 12.4,12.7 9.7,10.4 13.3,10.4" fill="#0038B8"/>',
    TR: '<rect width="30" height="20" fill="#E30A17"/><circle cx="13" cy="10" r="6.6" fill="#fff"/><circle cx="15.5" cy="10" r="6.6" fill="#E30A17"/><polygon points="16.6,7.0 17.3,9.0 19.5,9.1 17.7,10.4 18.4,12.4 16.6,11.2 14.8,12.4 15.5,10.4 13.7,9.1 15.9,9.0" fill="#fff"/>',
    IR: '<rect y="0.0" width="30" height="6.7" fill="#239F40"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#DA0000"/>',
    PK: '<rect x="0.0" width="6.0" height="20" fill="#fff"/><rect x="6.0" width="24.0" height="20" fill="#01411C"/><circle cx="19" cy="10" r="5" fill="#fff"/><circle cx="20" cy="9.5" r="5" fill="#01411C"/><polygon points="17.5,8.0 18.0,9.4 19.4,9.4 18.3,10.2 18.7,11.6 17.5,10.8 16.3,11.6 16.7,10.2 15.6,9.4 17.0,9.4" fill="#fff"/>',
    BD: '<rect width="30" height="20" fill="#006A4E"/><circle cx="14" cy="10" r="6.5" fill="#F42A41"/>',
    LK: '<rect x="0.0" width="15.0" height="20" fill="#FFB80C"/><rect x="15.0" width="15.0" height="20" fill="#F7BF2E"/><rect y="0.0" width="30" height="10.0" fill="#8D153A"/><rect y="10.0" width="30" height="10.0" fill="#00534E"/>',
    NP: '<rect y="0.0" width="30" height="10.0" fill="#DC143C"/><rect y="10.0" width="30" height="10.0" fill="#003893"/>',
    MM: '<rect y="0.0" width="30" height="6.7" fill="#FECB00"/><rect y="6.7" width="30" height="6.7" fill="#34B233"/><rect y="13.3" width="30" height="6.7" fill="#EA2839"/><polygon points="15.0,6.8 15.8,9.0 18.0,9.0 16.2,10.4 16.9,12.6 15.0,11.3 13.1,12.6 13.8,10.4 12.0,9.0 14.2,9.0" fill="#fff"/>',
    KH: '<rect y="0.0" width="30" height="6.7" fill="#032EA1"/><rect y="6.7" width="30" height="6.7" fill="#E00025"/><rect y="13.3" width="30" height="6.7" fill="#032EA1"/>',
    LA: '<rect y="0.0" width="30" height="6.7" fill="#CE1126"/><rect y="6.7" width="30" height="6.7" fill="#002868"/><rect y="13.3" width="30" height="6.7" fill="#CE1126"/><circle cx="15" cy="10" r="4" fill="#fff"/>',
    KZ: '<rect width="30" height="20" fill="#00AFCA"/><circle cx="15" cy="10" r="4.2" fill="#FEC50C"/>',
    UZ: '<rect y="0.0" width="30" height="6.0" fill="#1EB8FA"/><rect y="6.0" width="30" height="1.0" fill="#fff"/><rect y="7.0" width="30" height="6.0" fill="#1EB8FA"/><rect y="13.0" width="30" height="1.0" fill="#fff"/><rect y="14.0" width="30" height="6.0" fill="#1EB8FA"/><circle cx="7" cy="6" r="2.2" fill="#fff"/><circle cx="10.2" cy="6" r="2.2" fill="#1EB8FA"/>',
    QA: '<rect x="0.0" width="6.0" height="20" fill="#fff"/><rect x="6.0" width="24.0" height="20" fill="#8A1538"/>',
    KW: '<rect x="0.0" width="30.0" height="20" fill="#000000"/><rect y="0.0" width="30" height="6.7" fill="#007A3D"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#CE1126"/>',
    OM: '<rect x="0.0" width="30.0" height="20" fill="#DA291C"/><rect y="0.0" width="30" height="6.7" fill="#fff"/><rect y="6.7" width="30" height="6.7" fill="#DA291C"/><rect y="13.3" width="30" height="6.7" fill="#009A44"/>',
    JO: '<rect y="0.0" width="30" height="6.7" fill="#000000"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#007A3D"/><rect width="30" height="20" fill="#fff"/><polygon points="0,0 0,20 10,10" fill="#CE1126"/><polygon points="3.2,8.2 3.6,9.4 4.9,9.4 3.9,10.2 4.3,11.5 3.2,10.7 2.1,11.5 2.5,10.2 1.5,9.4 2.8,9.4" fill="#fff"/>',
    LB: '<rect y="0.0" width="30" height="6.7" fill="#EE161F"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#EE161F"/><polygon points="15,5 16.4,8.4 20,8.4 17.2,10.6 18.5,14 15,11.8 11.5,14 12.8,10.6 10,8.4 13.6,8.4" fill="#007A3D"/>',
    IQ: '<rect y="0.0" width="30" height="6.7" fill="#CE1126"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#000000"/><rect y="8" width="30" height="4" fill="#007A3D"/>',
    AF: '<rect x="0.0" width="10.0" height="20" fill="#000000"/><rect x="10.0" width="10.0" height="20" fill="#DA0000"/><rect x="20.0" width="10.0" height="20" fill="#007A36"/>',
    MN: '<rect x="0.0" width="10.0" height="20" fill="#DA2032"/><rect x="10.0" width="10.0" height="20" fill="#0066B3"/><rect x="20.0" width="10.0" height="20" fill="#DA2032"/>',
    SE: '<rect width="30" height="20" fill="#006AA7"/><rect x="13.3" width="3.4" height="20" fill="#FECC00"/><rect y="8.3" width="30" height="3.4" fill="#FECC00"/>',
    NO: '<rect width="30" height="20" fill="#BA0C2F"/><rect x="13.2" width="3.6" height="20" fill="#fff"/><rect y="8.3" width="30" height="3.4" fill="#fff"/><rect x="12.2" width="5.6" height="20" fill="#00205B"/><rect y="7.2" width="30" height="5.6" fill="#00205B"/>',
    FI: '<rect width="30" height="20" fill="#fff"/><rect x="13.3" width="3.4" height="20" fill="#002F6C"/><rect y="8.3" width="30" height="3.4" fill="#002F6C"/>',
    DK: '<rect width="30" height="20" fill="#C8102E"/><rect x="13.3" width="3.4" height="20" fill="#fff"/><rect y="8.3" width="30" height="3.4" fill="#fff"/><rect x="12.2" width="5.6" height="20" fill="#C8102E"/><rect y="7.2" width="30" height="5.6" fill="#C8102E"/>',
    IE: '<rect x="0.0" width="10.0" height="20" fill="#169B62"/><rect x="10.0" width="10.0" height="20" fill="#fff"/><rect x="20.0" width="10.0" height="20" fill="#FF883E"/>',
    AT: '<rect y="0.0" width="30" height="6.7" fill="#ED2939"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#ED2939"/>',
    PT: '<rect x="0.0" width="10.0" height="20" fill="#046A38"/><rect x="10.0" width="20.0" height="20" fill="#DA291C"/><circle cx="10" cy="10" r="4" fill="#FFCD00"/>',
    PL: '<rect y="0.0" width="30" height="10.0" fill="#fff"/><rect y="10.0" width="30" height="10.0" fill="#DC143C"/>',
    CZ: '<rect y="0.0" width="30" height="10.0" fill="#fff"/><rect y="10.0" width="30" height="10.0" fill="#D7141A"/><polygon points="0,0 0,20 15,10" fill="#11457E"/>',
    GR: '<rect width="30" height="20" fill="#0D5EAF"/><circle cx="15" cy="10" r="0" fill="#fff"/><rect x="12.5" width="5" height="20" fill="#fff"/><rect y="7.5" width="30" height="5" fill="#fff"/><rect x="12.5" y="0" width="5" height="7.5" fill="#0D5EAF"/><rect x="0" y="2.5" width="12.5" height="2.5" fill="#0D5EAF"/>',
    HU: '<rect y="0.0" width="30" height="6.7" fill="#CE2939"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#436F4D"/>',
    RO: '<rect x="0.0" width="10.0" height="20" fill="#002B7F"/><rect x="10.0" width="10.0" height="20" fill="#FCD116"/><rect x="20.0" width="10.0" height="20" fill="#CE1126"/>',
    UA: '<rect y="0.0" width="30" height="10.0" fill="#005BBB"/><rect y="10.0" width="30" height="10.0" fill="#FFD500"/>',
    BE: '<rect x="0.0" width="10.0" height="20" fill="#000000"/><rect x="10.0" width="10.0" height="20" fill="#FDDA24"/><rect x="20.0" width="10.0" height="20" fill="#EF3340"/>',
    LU: '<rect x="0.0" width="10.0" height="20" fill="#ED2939"/><rect x="10.0" width="10.0" height="20" fill="#fff"/><rect x="20.0" width="10.0" height="20" fill="#00A2E1"/>',
    IS: '<rect width="30" height="20" fill="#003897"/><rect x="13.3" width="3.4" height="20" fill="#fff"/><rect y="8.3" width="30" height="3.4" fill="#fff"/><rect x="12.2" width="5.6" height="20" fill="#D72828"/><rect y="7.2" width="30" height="5.6" fill="#D72828"/>',
    EE: '<rect y="0.0" width="30" height="6.7" fill="#0072CE"/><rect y="6.7" width="30" height="6.7" fill="#000000"/><rect y="13.3" width="30" height="6.7" fill="#fff"/>',
    LV: '<rect y="0.0" width="30" height="8.0" fill="#9E3039"/><rect y="8.0" width="30" height="4.0" fill="#fff"/><rect y="12.0" width="30" height="8.0" fill="#9E3039"/>',
    LT: '<rect y="0.0" width="30" height="6.7" fill="#FDB913"/><rect y="6.7" width="30" height="6.7" fill="#006A44"/><rect y="13.3" width="30" height="6.7" fill="#C1272D"/>',
    HR: '<rect y="0.0" width="30" height="6.7" fill="#FF0000"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#171796"/>',
    SK: '<rect y="0.0" width="30" height="6.7" fill="#fff"/><rect y="6.7" width="30" height="6.7" fill="#0B4EA2"/><rect y="13.3" width="30" height="6.7" fill="#EE1C25"/>',
    SI: '<rect y="0.0" width="30" height="6.7" fill="#fff"/><rect y="6.7" width="30" height="6.7" fill="#005CE6"/><rect y="13.3" width="30" height="6.7" fill="#ED1C24"/>',
    BG: '<rect y="0.0" width="30" height="6.7" fill="#fff"/><rect y="6.7" width="30" height="6.7" fill="#00966E"/><rect y="13.3" width="30" height="6.7" fill="#D62612"/>',
    RS: '<rect y="0.0" width="30" height="6.7" fill="#ED1C24"/><rect y="6.7" width="30" height="6.7" fill="#0B4EA2"/><rect y="13.3" width="30" height="6.7" fill="#fff"/>',
    MX: '<rect x="0.0" width="10.0" height="20" fill="#006847"/><rect x="10.0" width="10.0" height="20" fill="#fff"/><rect x="20.0" width="10.0" height="20" fill="#CE1126"/>',
    AR: '<rect y="0.0" width="30" height="6.7" fill="#74ACDF"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#74ACDF"/><circle cx="15" cy="10" r="3.4" fill="#F6B40E"/><polygon points="15.0,8.4 15.4,9.5 16.5,9.5 15.6,10.2 15.9,11.3 15.0,10.6 14.1,11.3 14.4,10.2 13.5,9.5 14.6,9.5" fill="#85340A"/>',
    CL: '<rect y="0.0" width="30" height="10.0" fill="#fff"/><rect y="10.0" width="30" height="10.0" fill="#D52B1E"/><rect width="10" height="10" fill="#0039A6"/><polygon points="5.0,3.0 5.5,4.4 6.9,4.4 5.8,5.2 6.2,6.6 5.0,5.8 3.8,6.6 4.2,5.2 3.1,4.4 4.5,4.4" fill="#fff"/>',
    CO: '<rect y="0.0" width="30" height="10.0" fill="#FCD116"/><rect y="10.0" width="30" height="5.0" fill="#003893"/><rect y="15.0" width="30" height="5.0" fill="#CE1126"/>',
    PE: '<rect x="0.0" width="10.0" height="20" fill="#D91023"/><rect x="10.0" width="10.0" height="20" fill="#fff"/><rect x="20.0" width="10.0" height="20" fill="#D91023"/>',
    VE: '<rect y="0.0" width="30" height="6.7" fill="#FCD116"/><rect y="6.7" width="30" height="6.7" fill="#00247D"/><rect y="13.3" width="30" height="6.7" fill="#CE1126"/><circle cx="15" cy="4" r="1.6" fill="#fff"/><polygon points="15.0,3.1 15.2,3.7 15.9,3.7 15.3,4.1 15.5,4.7 15.0,4.4 14.5,4.7 14.7,4.1 14.1,3.7 14.8,3.7" fill="#fff"/>',
    EC: '<rect y="0.0" width="30" height="10.0" fill="#FFD100"/><rect y="10.0" width="30" height="5.0" fill="#00529B"/><rect y="15.0" width="30" height="5.0" fill="#EF3340"/>',
    CU: '<rect width="30" height="20" fill="#fff"/><rect y="0.0" width="30" height="4.0" fill="#002A8F"/><rect y="4.0" width="30" height="4.0" fill="#fff"/><rect y="8.0" width="30" height="4.0" fill="#002A8F"/><rect y="12.0" width="30" height="4.0" fill="#fff"/><rect y="16.0" width="30" height="4.0" fill="#002A8F"/><polygon points="0,0 0,20 12,10" fill="#CF142B"/><polygon points="5.5,8.0 6.0,9.4 7.4,9.4 6.3,10.2 6.7,11.6 5.5,10.8 4.3,11.6 4.7,10.2 3.6,9.4 5.0,9.4" fill="#fff"/>',
    UY: '<rect y="0.0" width="30" height="4.0" fill="#fff"/><rect y="4.0" width="30" height="4.0" fill="#0038A8"/><rect y="8.0" width="30" height="4.0" fill="#fff"/><rect y="12.0" width="30" height="4.0" fill="#0038A8"/><rect y="16.0" width="30" height="4.0" fill="#fff"/><circle cx="15" cy="5.5" r="3.2" fill="#FCD116"/><polygon points="15.0,3.9 15.4,5.0 16.5,5.0 15.6,5.7 15.9,6.8 15.0,6.1 14.1,6.8 14.4,5.7 13.5,5.0 14.6,5.0" fill="#FCD116"/>',
    BO: '<rect y="0.0" width="30" height="6.7" fill="#D52B1E"/><rect y="6.7" width="30" height="6.7" fill="#F9E300"/><rect y="13.3" width="30" height="6.7" fill="#007934"/>',
    PA: '<rect width="30" height="20" fill="#fff"/><rect width="15" height="10" fill="#005293"/><rect x="15" y="10" width="15" height="10" fill="#D21034"/><polygon points="7.5,2.6 8.1,4.2 9.8,4.3 8.4,5.3 8.9,6.9 7.5,6.0 6.1,6.9 6.6,5.3 5.2,4.3 6.9,4.2" fill="#fff"/><polygon points="22.5,12.6 23.1,14.2 24.8,14.3 23.4,15.3 23.9,16.9 22.5,16.0 21.1,16.9 21.6,15.3 20.2,14.3 21.9,14.2" fill="#D21034"/>',
    CR: '<rect y="0.0" width="30" height="4.0" fill="#002B7F"/><rect y="4.0" width="30" height="4.0" fill="#fff"/><rect y="8.0" width="30" height="4.0" fill="#CE1126"/><rect y="12.0" width="30" height="4.0" fill="#fff"/><rect y="16.0" width="30" height="4.0" fill="#002B7F"/>',
    NZ: '<rect width="30" height="20" fill="#012169"/><rect x="13.3" width="3.4" height="20" fill="#fff"/><rect y="8.3" width="30" height="3.4" fill="#fff"/><circle cx="22" cy="6" r="1.4" fill="#CC142B"/><circle cx="26" cy="10" r="1.4" fill="#fff"/><circle cx="23" cy="15" r="1.4" fill="#CC142B"/><circle cx="27" cy="4" r="1" fill="#CC142B"/>',
    EG: '<rect y="0.0" width="30" height="6.7" fill="#CE1126"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#000000"/><rect y="8.5" width="30" height="3" fill="#C09300"/>',
    ZA: '<rect width="30" height="20" fill="#fff"/><rect y="0.0" width="30" height="6.7" fill="#DE3831"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#002395"/><polygon points="0,0 0,20 14,10" fill="#000000"/><polygon points="0,0 0,20 9,10" fill="#007749"/><polygon points="9,0 12,0 16,10 12,20 9,20 14,10" fill="#FFB612"/>',
    NG: '<rect x="0.0" width="10.0" height="20" fill="#008751"/><rect x="10.0" width="10.0" height="20" fill="#fff"/><rect x="20.0" width="10.0" height="20" fill="#008751"/>',
    KE: '<rect y="0.0" width="30" height="6.7" fill="#000000"/><rect y="6.7" width="30" height="6.7" fill="#BB0000"/><rect y="13.3" width="30" height="6.7" fill="#006600"/><rect y="9" width="30" height="2" fill="#fff"/>',
    MA: '<rect width="30" height="20" fill="#C1272D"/><polygon points="15.0,5.4 16.1,8.5 19.4,8.6 16.7,10.6 17.7,13.7 15.0,11.8 12.3,13.7 13.3,10.6 10.6,8.6 13.9,8.5" fill="#006233"/>',
    DZ: '<rect x="0.0" width="15.0" height="20" fill="#006233"/><rect x="15.0" width="15.0" height="20" fill="#fff"/><circle cx="20" cy="10" r="5.4" fill="#D21034"/><circle cx="21.6" cy="9.6" r="5.4" fill="#fff"/><polygon points="19.0,7.8 19.5,9.3 21.1,9.3 19.8,10.3 20.3,11.8 19.0,10.9 17.7,11.8 18.2,10.3 16.9,9.3 18.5,9.3" fill="#D21034"/>',
    ET: '<rect y="0.0" width="30" height="6.7" fill="#0F47AF"/><rect y="6.7" width="30" height="6.7" fill="#FCDD09"/><rect y="13.3" width="30" height="6.7" fill="#DA121A"/><circle cx="15" cy="10" r="3" fill="#0F47AF"/>',
    GH: '<rect y="0.0" width="30" height="6.7" fill="#CE1126"/><rect y="6.7" width="30" height="6.7" fill="#FCD116"/><rect y="13.3" width="30" height="6.7" fill="#006B3F"/><polygon points="15.0,6.8 15.8,9.0 18.0,9.0 16.2,10.4 16.9,12.6 15.0,11.3 13.1,12.6 13.8,10.4 12.0,9.0 14.2,9.0" fill="#000000"/>'
  };

  function flagEmoji(cc) { if (!cc || cc.length !== 2) return ''; var c = cc.toUpperCase(); return String.fromCodePoint(127397 + c.charCodeAt(0), 127397 + c.charCodeAt(1)); }
  /* 地区标识：中国用内联 SVG（Windows 不渲染国旗 emoji），其它国家用 emoji */
  function flagFor(cc) {
    if (!cc) return '';
    cc = cc.toUpperCase();
    var inner = cc === 'CN' ? "<rect width=\"30\" height=\"20\" fill=\"#DE2910\"/><polygon points=\"5,3.5 6.43,4.54 5.88,6.21 4.12,6.21 3.57,4.54\" fill=\"#FFDE00\"/><polygon points=\"10,1.5 10.48,1.84 10.29,2.41 9.71,2.41 9.52,1.84\" fill=\"#FFDE00\"/><polygon points=\"12,3.5 12.48,3.84 12.29,4.41 11.71,4.41 11.52,3.84\" fill=\"#FFDE00\"/><polygon points=\"12,6.5 12.48,6.84 12.29,7.41 11.71,7.41 11.52,6.84\" fill=\"#FFDE00\"/><polygon points=\"10,8.5 10.48,8.84 10.29,9.41 9.71,9.41 9.52,8.84\" fill=\"#FFDE00\"/>" : (typeof FLAG_SVG !== 'undefined' ? FLAG_SVG[cc] : '');
    if (inner) return '<svg width="18" height="12" viewBox="0 0 30 20" style="vertical-align:-2px;border-radius:2px;overflow:hidden" title="'+cc+'">' + inner + '</svg>';
    return flagEmoji(cc);
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function initClock() {
    function tick() {
      var d = new Date();
      var el = document.getElementById('sbTime');
      var de = document.getElementById('sbDate');
      if (el) el.textContent = pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
      if (de) {
        if (isEn()) de.textContent = MONTH_EN[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' · ' + weekName(d);
        else de.textContent = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 星期' + WEEK_ZH[d.getDay()];
      }
    }
    tick();
    setIntervalSafe(tick, 1000);
    var on = document.getElementById('sbOnline');
    if (on) {
      function upd() {
        var online = navigator.onLine;
        on.className = 'sb-online ' + (online ? 'on' : 'off');
        on.innerHTML = '<i></i><b>' + (online ? t('sb.online') : t('sb.offline')) + '</b>';
      }
      upd();
      window.addEventListener('online', upd);
      window.addEventListener('offline', upd);
    }
  }

  /* 根据国家码切换 body class：国外 → 国际站点徽标点亮（与国内对称） */
  function applyGeoClass() {
    var abroad = statusData.countryCode && statusData.countryCode !== 'CN';
    document.body.classList.toggle('geo-abroad', !!abroad);
    document.body.classList.toggle('geo-cn', !abroad);
  }
  function renderStatus() {
    var geo = document.getElementById('sbGeo');
    var wea = document.getElementById('sbWeather');
    var ip = document.getElementById('sbIp');
    var px = document.getElementById('sbProxy');
    if (geo) {
      var flag = flagFor(statusData.countryCode);
      geo.innerHTML = statusData.city
        ? '<span>' + (flag || '📍') + '</span><span>' + esc(statusData.city) + (statusData.region && statusData.region !== statusData.city ? ' · ' + esc(statusData.region) : '') + '</span>'
        : (statusData.loading ? '<span>' + t('sb.locating') + '</span>' : '<span>' + t('sb.none') + '</span>');
    }
    if (wea) {
      if (statusData.temp != null && statusData.code != null) {
        var w = WEATHER[statusData.code] || ['🌡️', t('sb.weather')];
        var wl = w[1];
        if (isEn()) wl = WEATHER_EN[statusData.code] || wl;
        wea.innerHTML = '<span>' + w[0] + '</span><b>' + (isEn() ? Math.round(statusData.temp * 9 / 5 + 32) + '°F' : Math.round(statusData.temp) + '°C') + '</b><span class="sb-weather">' + wl + '</span>';
      } else {
        wea.innerHTML = '<span>🌡️</span><span>' + (statusData.loading ? t('sb.querying') : '--°C') + '</span>';
      }
    }
    if (ip) ip.innerHTML = '<span>🛜</span><b>' + (statusData.ip || '--') + '</b>';
    if (px) {
      px.textContent = statusData.proxyTxt;
      px.className = 'sb-item sb-proxy ' + statusData.proxyCls;
      px.title = statusData.proxyTip;
    }
  }

  /* ================= 代理智能识别 =================
     启发式判断：并行查询 7 个独立出口（ip-api.com / ipapi.co / ipinfo.io /
     Cloudflare Trace / ipify / ip.sb / ipip.net 中文文本源）
     按“多数一致”票选出口 IP，再分级给出结论，降低误报：
     - 单一出口 → 直连（延迟偏高仅中性提示，国内访问境外接口延迟高属常态）
     - 多个出口：出现 ≥2 个各自被 ≥2 源确认的不同 IP → 疑似代理/多出口；
       仅单一多数派 + 个别孤源 → 基本一致（直连）；
       全部孤源 → 出口不一致，无法确认。
     仅供参考。 */
  function proxyDetect() {
    var px = document.getElementById('sbProxy');
    if (px) { px.textContent = t('sb.detect'); px.className = 'sb-item sb-proxy off'; px.title = t('sb.detectTip') || '正在对比多个出口与延迟'; }
    if (navigator.onLine === false) {
      statusData.proxyTxt = t('sb.offline2');
      statusData.proxyCls = 'off';
      statusData.proxyTip = t('sb.offlineTip') || '当前处于离线状态';
      renderStatus();
      return;
    }
    var t0 = Date.now();
    var votes = {};
    var rtts = [];
    var done = 0, total = 7, finished = false;
    function finish() {
      if (finished) return;
      /* 至少拿到 1 个出口且过了 2 秒、或全部完成、或 9 秒兜底 */
      if (done < total && !(done >= 1 && Date.now() - t0 >= 2000) && Date.now() - t0 < 9000) return;
      finished = true;
      /* 兜底：接口全部失败但状态栏已取得出口 IP */
      if (!Object.keys(votes).length && statusData.ip) votes[String(statusData.ip)] = 1;
      var avg = rtts.length ? Math.round(rtts.reduce(function (a, b) { return a + b; }, 0) / rtts.length) : null;
      var entries = Object.keys(votes)
        .filter(function (k) { return k && k !== 'undefined'; })
        .map(function (k) { return { ip: k, n: votes[k] }; })
        .sort(function (a, b) { return b.n - a.n; });
      var uniq = entries.length;
      /* 用多数一致出口刷新状态栏 IP */
      if (uniq && entries[0].ip !== statusData.ip) {
        statusData.ip = entries[0].ip;
        renderStatus();
      }
      /* 运营商 CGNAT 多线路常返回同 /16 段的不同 IP，合并为同一出口，避免误报代理 */
      function net16(ip) { var p = String(ip).split('.'); return p.length === 4 ? p[0] + '.' + p[1] : ip; }
      var group = {};
      entries.forEach(function (e) { var k = net16(e.ip); group[k] = (group[k] || 0) + e.n; });
      var groups = Object.keys(group).map(function (k) { return { ip: k, n: group[k] }; }).sort(function (a, b) { return b.n - a.n; });
      var gCount = groups.length;
      var detail = entries.map(function (e) { return e.ip + (e.n > 1 ? '×' + e.n : ''); }).join(' / ');
      if (!uniq) {
        statusData.proxyTxt = t('sb.undetect');
        statusData.proxyCls = 'off';
        statusData.proxyTip = isEn() ? 'All 7 endpoints failed (restricted network, DNS pollution or blocked APIs). If you are online, tap ⟳ to retry or change network.' : '7 个出口查询接口均不可用（网络受限、DNS 污染或全部接口被拦截）。若当前有网，请点 ⟳ 重试，或更换网络环境后再检测';
      } else if (gCount === 1) {
        if (avg != null && avg > 800) {
          statusData.proxyTxt = t('sb.latency');
          statusData.proxyCls = 'warn';
          statusData.proxyTip = (isEn() ? 'Single exit confirmed; latency high (avg ' + avg + ' ms) — for reference only' : '单一出口已确认；延迟偏高（平均 ' + avg + ' ms），仅供参考，不代表代理') + ' [' + detail + ']';
        } else {
          statusData.proxyTxt = t('sb.direct');
          statusData.proxyCls = 'ok';
          statusData.proxyTip = (isEn() ? 'Exit IP confirmed; no proxy detected (avg ' + avg + ' ms)' : '出口 IP 已确认，未检测到代理（平均 ' + avg + ' ms）') + ' [' + detail + ']';
        }
      } else {
        var strong = groups.filter(function (e) { return e.n >= 2; });
        if (gCount >= 2) {
          statusData.proxyTxt = t('sb.proxy');
          statusData.proxyCls = 'warn';
          statusData.proxyTip = (isEn() ? 'Detected ' + strong.length + ' distinct exit IPs (each confirmed by 2+ sources) — likely proxy / multi-exit' : '检测到 ' + strong.length + ' 个不同出口 IP（各被 2+ 源确认），可能经代理或运营商多出口') + ' [' + detail + ']';
        } else if (entries[0].n >= 2) {
          statusData.proxyTxt = t('sb.mostly');
          statusData.proxyCls = 'ok';
          statusData.proxyTip = (isEn() ? 'Most exits consistent; a few sources returned different IPs — for reference only' : '多数出口一致，个别源返回不同出口（可能运营商多线路/个别接口异常），仅供参考') + ' [' + detail + ']';
        } else {
          statusData.proxyTxt = t('sb.mixed');
          statusData.proxyCls = 'off';
          statusData.proxyTip = (isEn() ? 'Exits disagree; cannot confirm (possible proxy, NAT or multi-line) — tap ⟳ to re-check' : '各出口 IP 不一致，无法确认是否代理（可能代理、运营商 NAT 或多线路）——点 ⟳ 可重新检测') + ' [' + detail + ']';
        }
      }
      renderStatus();
    }
    function hit(ip) { votes[String(ip)] = (votes[String(ip)] || 0) + 1; rtts.push(Date.now() - t0); done++; finish(); }
    function miss() { done++; finish(); }
    /* 7 个出口源（按实测国内可达性 + CORS 配置：ipip.net / api.ip.sb / ipinfo /
       Cloudflare trace / ipwho.is / ipify / ipapi.co；失效源自动 miss 不影响结论） */
    fetchText('http://myip.ipip.net', 3500).then(function (txt) {
      var m = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/.exec(txt || '');
      if (m && m[1]) hit(m[1]); else miss();
    }, miss);
    getJSON('https://api.ip.sb/geoip', 3500).then(function (d) { if (d && d.ip) hit(d.ip); else miss(); }, miss);
    getJSON('https://ipinfo.io/json', 3500).then(function (d) { if (d && d.ip) hit(d.ip); else miss(); }, miss);
    fetchText('https://www.cloudflare.com/cdn-cgi/trace', 3500).then(function (txt) {
      var m = /^ip=([0-9a-fA-F:.]+)$/m.exec(txt || '');
      if (m && m[1]) hit(m[1]); else miss();
    }, miss);
    getJSON('https://ipwho.is/', 3500).then(function (d) { if (d && d.ip && d.success !== false) hit(d.ip); else miss(); }, miss);
    getJSON('https://api.ipify.org?format=json', 3500).then(function (d) { if (d && d.ip) hit(d.ip); else miss(); }, miss);
    getJSON('https://ipapi.co/json/', 3500).then(function (d) { if (d && d.ip) hit(d.ip); else miss(); }, miss);
    setTimeout(finish, 9000);
  }

  function refreshStatus(silent) {
    var sbRefresh = document.getElementById('sbRefresh');
    if (sbRefresh) sbRefresh.style.opacity = '.5';
    if (silent) {
      /* 手动点 ⟳：清掉 30 分钟缓存与旧结果，强制重新拉取 */
      store.del('status');
      statusData.ip = ''; statusData.city = ''; statusData.region = ''; statusData.country = '';
      statusData.lat = null; statusData.lon = null; statusData.temp = null; statusData.code = null;
      statusData.proxyTxt = t('sb.detect'); statusData.proxyCls = 'off'; statusData.proxyTip = '';
    }
    statusData.loading = true;
    renderStatus();

    var cache = silent ? null : store.get('status', null);
    if (cache && cache.ts && Date.now() - cache.ts < 30 * 60 * 1000) {
      statusData.ip = cache.ip || '';
      statusData.city = cache.city || '';
      statusData.region = cache.region || '';
      statusData.country = cache.country || '';
      statusData.countryCode = cache.countryCode || '';
      statusData.lat = cache.lat; statusData.lon = cache.lon;
      statusData.temp = cache.temp; statusData.code = cache.code;
      statusData.loading = false;
      applyGeoClass();
      if (cache.proxyTxt) { statusData.proxyTxt = cache.proxyTxt; statusData.proxyCls = cache.proxyCls || 'off'; statusData.proxyTip = cache.proxyTip || ''; }
      renderStatus();
      if (sbRefresh) sbRefresh.style.opacity = '1';
      /* 缓存命中但没有代理检测结果（旧缓存）→ 补一次检测 */
      if (!cache.proxyTxt) proxyDetect();
      return;
    }

    /* 1) 公网 IP + 地理信息（多级后备；实测国内可达性排序：
       myip.ipip.net（中文地址）→ api.ip.sb/geoip → ipinfo.io → 无） */
    var ISP_RE = /(电信|联通|移动|铁通|长城|鹏博士|教育网|广电|网通|电信通|方正宽带)/;
    /* 中文/英文国家名 → ISO 国家码（用于国旗与国际点亮） */
    var COUNTRY_MAP = [
      ['白俄罗斯', 'BY'], ['Belarus', 'BY'],
      ['也门', 'YE'], ['Yemen', 'YE'],
      ['巴林', 'BH'], ['Bahrain', 'BH'],
      ['塞浦路斯', 'CY'], ['Cyprus', 'CY'],
      ['格鲁吉亚', 'GE'], ['Georgia', 'GE'],
      ['亚美尼亚', 'AM'], ['Armenia', 'AM'],
      ['阿塞拜疆', 'AZ'], ['Azerbaijan', 'AZ'],
      ['中国', 'CN'], ['中华人民', 'CN'], ['China', 'CN'],
      ['香港', 'HK'], ['Hong Kong', 'HK'], ['台湾', 'TW'], ['Taiwan', 'TW'], ['澳门', 'MO'], ['Macao', 'MO'],
      ['日本', 'JP'], ['Japan', 'JP'], ['韩国', 'KR'], ['Korea', 'KR'], ['朝鲜', 'KP'],
      ['美国', 'US'], ['United States', 'US'], ['USA', 'US'],
      ['英国', 'GB'], ['United Kingdom', 'GB'], ['Britain', 'GB'],
      ['德国', 'DE'], ['Germany', 'DE'], ['法国', 'FR'], ['France', 'FR'],
      ['俄罗斯', 'RU'], ['Russia', 'RU'], ['新加坡', 'SG'], ['Singapore', 'SG'],
      ['加拿大', 'CA'], ['Canada', 'CA'], ['澳大利亚', 'AU'], ['Australia', 'AU'],
      ['印度', 'IN'], ['India', 'IN'], ['泰国', 'TH'], ['Thailand', 'TH'],
      ['越南', 'VN'], ['Vietnam', 'VN'], ['马来西亚', 'MY'], ['Malaysia', 'MY'],
      ['菲律宾', 'PH'], ['Philippines', 'PH'], ['印度尼西亚', 'ID'], ['Indonesia', 'ID'],
      ['巴西', 'BR'], ['Brazil', 'BR'], ['意大利', 'IT'], ['Italy', 'IT'],
      ['西班牙', 'ES'], ['Spain', 'ES'], ['荷兰', 'NL'], ['Netherlands', 'NL']
    ,
      ['澳门', 'MO'],
      ['Macao', 'MO'],
      ['朝鲜', 'KP'],
      ['North Korea', 'KP'],
      ['阿联酋', 'AE'],
      ['United Arab Emirates', 'AE'],
      ['沙特阿拉伯', 'SA'],
      ['Saudi Arabia', 'SA'],
      ['以色列', 'IL'],
      ['Israel', 'IL'],
      ['土耳其', 'TR'],
      ['Turkey', 'TR'],
      ['伊朗', 'IR'],
      ['Iran', 'IR'],
      ['巴基斯坦', 'PK'],
      ['Pakistan', 'PK'],
      ['孟加拉国', 'BD'],
      ['Bangladesh', 'BD'],
      ['斯里兰卡', 'LK'],
      ['Sri Lanka', 'LK'],
      ['尼泊尔', 'NP'],
      ['Nepal', 'NP'],
      ['缅甸', 'MM'],
      ['Myanmar', 'MM'],
      ['柬埔寨', 'KH'],
      ['Cambodia', 'KH'],
      ['老挝', 'LA'],
      ['Laos', 'LA'],
      ['哈萨克斯坦', 'KZ'],
      ['Kazakhstan', 'KZ'],
      ['乌兹别克斯坦', 'UZ'],
      ['Uzbekistan', 'UZ'],
      ['卡塔尔', 'QA'],
      ['Qatar', 'QA'],
      ['科威特', 'KW'],
      ['Kuwait', 'KW'],
      ['阿曼', 'OM'],
      ['Oman', 'OM'],
      ['约旦', 'JO'],
      ['Jordan', 'JO'],
      ['黎巴嫩', 'LB'],
      ['Lebanon', 'LB'],
      ['伊拉克', 'IQ'],
      ['Iraq', 'IQ'],
      ['阿富汗', 'AF'],
      ['Afghanistan', 'AF'],
      ['蒙古', 'MN'],
      ['Mongolia', 'MN'],
      ['瑞典', 'SE'],
      ['Sweden', 'SE'],
      ['挪威', 'NO'],
      ['Norway', 'NO'],
      ['芬兰', 'FI'],
      ['Finland', 'FI'],
      ['丹麦', 'DK'],
      ['Denmark', 'DK'],
      ['爱尔兰', 'IE'],
      ['Ireland', 'IE'],
      ['奥地利', 'AT'],
      ['Austria', 'AT'],
      ['葡萄牙', 'PT'],
      ['Portugal', 'PT'],
      ['波兰', 'PL'],
      ['Poland', 'PL'],
      ['捷克', 'CZ'],
      ['Czechia', 'CZ'],
      ['希腊', 'GR'],
      ['Greece', 'GR'],
      ['匈牙利', 'HU'],
      ['Hungary', 'HU'],
      ['罗马尼亚', 'RO'],
      ['Romania', 'RO'],
      ['乌克兰', 'UA'],
      ['Ukraine', 'UA'],
      ['比利时', 'BE'],
      ['Belgium', 'BE'],
      ['卢森堡', 'LU'],
      ['Luxembourg', 'LU'],
      ['冰岛', 'IS'],
      ['Iceland', 'IS'],
      ['爱沙尼亚', 'EE'],
      ['Estonia', 'EE'],
      ['拉脱维亚', 'LV'],
      ['Latvia', 'LV'],
      ['立陶宛', 'LT'],
      ['Lithuania', 'LT'],
      ['克罗地亚', 'HR'],
      ['Croatia', 'HR'],
      ['斯洛伐克', 'SK'],
      ['Slovakia', 'SK'],
      ['斯洛文尼亚', 'SI'],
      ['Slovenia', 'SI'],
      ['保加利亚', 'BG'],
      ['Bulgaria', 'BG'],
      ['塞尔维亚', 'RS'],
      ['Serbia', 'RS'],
      ['墨西哥', 'MX'],
      ['Mexico', 'MX'],
      ['阿根廷', 'AR'],
      ['Argentina', 'AR'],
      ['智利', 'CL'],
      ['Chile', 'CL'],
      ['哥伦比亚', 'CO'],
      ['Colombia', 'CO'],
      ['秘鲁', 'PE'],
      ['Peru', 'PE'],
      ['委内瑞拉', 'VE'],
      ['Venezuela', 'VE'],
      ['厄瓜多尔', 'EC'],
      ['Ecuador', 'EC'],
      ['古巴', 'CU'],
      ['Cuba', 'CU'],
      ['乌拉圭', 'UY'],
      ['Uruguay', 'UY'],
      ['玻利维亚', 'BO'],
      ['Bolivia', 'BO'],
      ['巴拿马', 'PA'],
      ['Panama', 'PA'],
      ['哥斯达黎加', 'CR'],
      ['Costa Rica', 'CR'],
      ['新西兰', 'NZ'],
      ['New Zealand', 'NZ'],
      ['埃及', 'EG'],
      ['Egypt', 'EG'],
      ['南非', 'ZA'],
      ['South Africa', 'ZA'],
      ['尼日利亚', 'NG'],
      ['Nigeria', 'NG'],
      ['肯尼亚', 'KE'],
      ['Kenya', 'KE'],
      ['摩洛哥', 'MA'],
      ['Morocco', 'MA'],
      ['阿尔及利亚', 'DZ'],
      ['Algeria', 'DZ'],
      ['埃塞俄比亚', 'ET'],
      ['Ethiopia', 'ET'],
      ['加纳', 'GH'],
      ['Ghana', 'GH']
    ,
      ['澳门', 'MO'],
      ['Macao', 'MO'],
      ['朝鲜', 'KP'],
      ['North Korea', 'KP'],
      ['阿联酋', 'AE'],
      ['United Arab Emirates', 'AE'],
      ['沙特阿拉伯', 'SA'],
      ['Saudi Arabia', 'SA'],
      ['以色列', 'IL'],
      ['Israel', 'IL'],
      ['土耳其', 'TR'],
      ['Turkey', 'TR'],
      ['伊朗', 'IR'],
      ['Iran', 'IR'],
      ['巴基斯坦', 'PK'],
      ['Pakistan', 'PK'],
      ['孟加拉国', 'BD'],
      ['Bangladesh', 'BD'],
      ['斯里兰卡', 'LK'],
      ['Sri Lanka', 'LK'],
      ['尼泊尔', 'NP'],
      ['Nepal', 'NP'],
      ['缅甸', 'MM'],
      ['Myanmar', 'MM'],
      ['柬埔寨', 'KH'],
      ['Cambodia', 'KH'],
      ['老挝', 'LA'],
      ['Laos', 'LA'],
      ['哈萨克斯坦', 'KZ'],
      ['Kazakhstan', 'KZ'],
      ['乌兹别克斯坦', 'UZ'],
      ['Uzbekistan', 'UZ'],
      ['卡塔尔', 'QA'],
      ['Qatar', 'QA'],
      ['科威特', 'KW'],
      ['Kuwait', 'KW'],
      ['阿曼', 'OM'],
      ['Oman', 'OM'],
      ['约旦', 'JO'],
      ['Jordan', 'JO'],
      ['黎巴嫩', 'LB'],
      ['Lebanon', 'LB'],
      ['伊拉克', 'IQ'],
      ['Iraq', 'IQ'],
      ['阿富汗', 'AF'],
      ['Afghanistan', 'AF'],
      ['蒙古', 'MN'],
      ['Mongolia', 'MN'],
      ['瑞典', 'SE'],
      ['Sweden', 'SE'],
      ['挪威', 'NO'],
      ['Norway', 'NO'],
      ['芬兰', 'FI'],
      ['Finland', 'FI'],
      ['丹麦', 'DK'],
      ['Denmark', 'DK'],
      ['爱尔兰', 'IE'],
      ['Ireland', 'IE'],
      ['奥地利', 'AT'],
      ['Austria', 'AT'],
      ['葡萄牙', 'PT'],
      ['Portugal', 'PT'],
      ['波兰', 'PL'],
      ['Poland', 'PL'],
      ['捷克', 'CZ'],
      ['Czechia', 'CZ'],
      ['希腊', 'GR'],
      ['Greece', 'GR'],
      ['匈牙利', 'HU'],
      ['Hungary', 'HU'],
      ['罗马尼亚', 'RO'],
      ['Romania', 'RO'],
      ['乌克兰', 'UA'],
      ['Ukraine', 'UA'],
      ['比利时', 'BE'],
      ['Belgium', 'BE'],
      ['卢森堡', 'LU'],
      ['Luxembourg', 'LU'],
      ['冰岛', 'IS'],
      ['Iceland', 'IS'],
      ['爱沙尼亚', 'EE'],
      ['Estonia', 'EE'],
      ['拉脱维亚', 'LV'],
      ['Latvia', 'LV'],
      ['立陶宛', 'LT'],
      ['Lithuania', 'LT'],
      ['克罗地亚', 'HR'],
      ['Croatia', 'HR'],
      ['斯洛伐克', 'SK'],
      ['Slovakia', 'SK'],
      ['斯洛文尼亚', 'SI'],
      ['Slovenia', 'SI'],
      ['保加利亚', 'BG'],
      ['Bulgaria', 'BG'],
      ['塞尔维亚', 'RS'],
      ['Serbia', 'RS'],
      ['墨西哥', 'MX'],
      ['Mexico', 'MX'],
      ['阿根廷', 'AR'],
      ['Argentina', 'AR'],
      ['智利', 'CL'],
      ['Chile', 'CL'],
      ['哥伦比亚', 'CO'],
      ['Colombia', 'CO'],
      ['秘鲁', 'PE'],
      ['Peru', 'PE'],
      ['委内瑞拉', 'VE'],
      ['Venezuela', 'VE'],
      ['厄瓜多尔', 'EC'],
      ['Ecuador', 'EC'],
      ['古巴', 'CU'],
      ['Cuba', 'CU'],
      ['乌拉圭', 'UY'],
      ['Uruguay', 'UY'],
      ['玻利维亚', 'BO'],
      ['Bolivia', 'BO'],
      ['巴拿马', 'PA'],
      ['Panama', 'PA'],
      ['哥斯达黎加', 'CR'],
      ['Costa Rica', 'CR'],
      ['新西兰', 'NZ'],
      ['New Zealand', 'NZ'],
      ['埃及', 'EG'],
      ['Egypt', 'EG'],
      ['南非', 'ZA'],
      ['South Africa', 'ZA'],
      ['尼日利亚', 'NG'],
      ['Nigeria', 'NG'],
      ['肯尼亚', 'KE'],
      ['Kenya', 'KE'],
      ['摩洛哥', 'MA'],
      ['Morocco', 'MA'],
      ['阿尔及利亚', 'DZ'],
      ['Algeria', 'DZ'],
      ['埃塞俄比亚', 'ET'],
      ['Ethiopia', 'ET'],
      ['加纳', 'GH'],
      ['Ghana', 'GH']
    ,
      ['澳门', 'MO'],
      ['Macao', 'MO'],
      ['朝鲜', 'KP'],
      ['North Korea', 'KP'],
      ['阿联酋', 'AE'],
      ['United Arab Emirates', 'AE'],
      ['沙特阿拉伯', 'SA'],
      ['Saudi Arabia', 'SA'],
      ['以色列', 'IL'],
      ['Israel', 'IL'],
      ['土耳其', 'TR'],
      ['Turkey', 'TR'],
      ['伊朗', 'IR'],
      ['Iran', 'IR'],
      ['巴基斯坦', 'PK'],
      ['Pakistan', 'PK'],
      ['孟加拉国', 'BD'],
      ['Bangladesh', 'BD'],
      ['斯里兰卡', 'LK'],
      ['Sri Lanka', 'LK'],
      ['尼泊尔', 'NP'],
      ['Nepal', 'NP'],
      ['缅甸', 'MM'],
      ['Myanmar', 'MM'],
      ['柬埔寨', 'KH'],
      ['Cambodia', 'KH'],
      ['老挝', 'LA'],
      ['Laos', 'LA'],
      ['哈萨克斯坦', 'KZ'],
      ['Kazakhstan', 'KZ'],
      ['乌兹别克斯坦', 'UZ'],
      ['Uzbekistan', 'UZ'],
      ['卡塔尔', 'QA'],
      ['Qatar', 'QA'],
      ['科威特', 'KW'],
      ['Kuwait', 'KW'],
      ['阿曼', 'OM'],
      ['Oman', 'OM'],
      ['约旦', 'JO'],
      ['Jordan', 'JO'],
      ['黎巴嫩', 'LB'],
      ['Lebanon', 'LB'],
      ['伊拉克', 'IQ'],
      ['Iraq', 'IQ'],
      ['阿富汗', 'AF'],
      ['Afghanistan', 'AF'],
      ['蒙古', 'MN'],
      ['Mongolia', 'MN'],
      ['瑞典', 'SE'],
      ['Sweden', 'SE'],
      ['挪威', 'NO'],
      ['Norway', 'NO'],
      ['芬兰', 'FI'],
      ['Finland', 'FI'],
      ['丹麦', 'DK'],
      ['Denmark', 'DK'],
      ['爱尔兰', 'IE'],
      ['Ireland', 'IE'],
      ['奥地利', 'AT'],
      ['Austria', 'AT'],
      ['葡萄牙', 'PT'],
      ['Portugal', 'PT'],
      ['波兰', 'PL'],
      ['Poland', 'PL'],
      ['捷克', 'CZ'],
      ['Czechia', 'CZ'],
      ['希腊', 'GR'],
      ['Greece', 'GR'],
      ['匈牙利', 'HU'],
      ['Hungary', 'HU'],
      ['罗马尼亚', 'RO'],
      ['Romania', 'RO'],
      ['乌克兰', 'UA'],
      ['Ukraine', 'UA'],
      ['比利时', 'BE'],
      ['Belgium', 'BE'],
      ['卢森堡', 'LU'],
      ['Luxembourg', 'LU'],
      ['冰岛', 'IS'],
      ['Iceland', 'IS'],
      ['爱沙尼亚', 'EE'],
      ['Estonia', 'EE'],
      ['拉脱维亚', 'LV'],
      ['Latvia', 'LV'],
      ['立陶宛', 'LT'],
      ['Lithuania', 'LT'],
      ['克罗地亚', 'HR'],
      ['Croatia', 'HR'],
      ['斯洛伐克', 'SK'],
      ['Slovakia', 'SK'],
      ['斯洛文尼亚', 'SI'],
      ['Slovenia', 'SI'],
      ['保加利亚', 'BG'],
      ['Bulgaria', 'BG'],
      ['塞尔维亚', 'RS'],
      ['Serbia', 'RS'],
      ['墨西哥', 'MX'],
      ['Mexico', 'MX'],
      ['阿根廷', 'AR'],
      ['Argentina', 'AR'],
      ['智利', 'CL'],
      ['Chile', 'CL'],
      ['哥伦比亚', 'CO'],
      ['Colombia', 'CO'],
      ['秘鲁', 'PE'],
      ['Peru', 'PE'],
      ['委内瑞拉', 'VE'],
      ['Venezuela', 'VE'],
      ['厄瓜多尔', 'EC'],
      ['Ecuador', 'EC'],
      ['古巴', 'CU'],
      ['Cuba', 'CU'],
      ['乌拉圭', 'UY'],
      ['Uruguay', 'UY'],
      ['玻利维亚', 'BO'],
      ['Bolivia', 'BO'],
      ['巴拿马', 'PA'],
      ['Panama', 'PA'],
      ['哥斯达黎加', 'CR'],
      ['Costa Rica', 'CR'],
      ['新西兰', 'NZ'],
      ['New Zealand', 'NZ'],
      ['埃及', 'EG'],
      ['Egypt', 'EG'],
      ['南非', 'ZA'],
      ['South Africa', 'ZA'],
      ['尼日利亚', 'NG'],
      ['Nigeria', 'NG'],
      ['肯尼亚', 'KE'],
      ['Kenya', 'KE'],
      ['摩洛哥', 'MA'],
      ['Morocco', 'MA'],
      ['阿尔及利亚', 'DZ'],
      ['Algeria', 'DZ'],
      ['埃塞俄比亚', 'ET'],
      ['Ethiopia', 'ET'],
      ['加纳', 'GH'],
      ['Ghana', 'GH']
    ];
    function countryCodeFromText(txt) {
      for (var i = 0; i < COUNTRY_MAP.length; i++) {
        if (txt.indexOf(COUNTRY_MAP[i][0]) >= 0) return COUNTRY_MAP[i][1];
      }
      return '';
    }
    function parseIpip(txt) {
      var m = /当前 IP[：:]\s*([0-9.]+)/.exec(txt || '');
      if (!m) return null;
      var am = /来自于[：:]\s*(.+)/.exec(txt || '');
      var region = '', city = '', cc = countryCodeFromText(txt || '');
      if (am) {
        var parts = am[1].split(/\s+/).filter(function (x) { return x && x !== '中国' && !ISP_RE.test(x); });
        if (parts.length) region = parts[0];
        city = parts.length > 1 ? parts[1] : region;
      }
      return { ip: m[1], region: region, city: city, country: cc === 'CN' ? '中国' : (am ? am[1].split(/\s+/)[0] : ''), countryCode: cc || 'CN' };
    }
    function ipDone(d) {
      statusData.ip = d.ip || '';
      statusData.city = d.city || '';
      statusData.region = d.region || d.regionName || '';
      statusData.country = d.country_name || d.country || '';
      statusData.countryCode = d.countryCode || d.country_code || countryCodeFromText((d.country || '') + ' ' + (d.country_name || '')) || (d.country === '中国' || d.country === 'China' ? 'CN' : d.country || '');
      if (d.latitude != null) { statusData.lat = d.latitude; statusData.lon = d.longitude; }
      else if (d.lat != null) { statusData.lat = d.lat; statusData.lon = d.lon; }
      statusData.loading = false;
      applyGeoClass();
      renderStatus();
      proxyDetect();
      fetchWeather();
      /* 主源无经纬度（如 ipip.net 文本）→ 用 ipinfo 补坐标，仅供天气，不覆盖地址 */
      if (statusData.lat == null) {
        getJSON('https://ipinfo.io/json', 5000).then(function (i) {
          var ll = ((i && i.loc) || '').split(',');
          if (ll.length === 2 && statusData.lat == null) {
            statusData.lat = parseFloat(ll[0]); statusData.lon = parseFloat(ll[1]);
            fetchWeather();
          }
        }, function () {});
      }
    }
    function ipFallback() {
      getJSON('https://api.ip.sb/geoip', 6000).then(function (d) {
        if (d && d.ip) ipDone({ ip: d.ip, city: d.city, region: d.region, country: d.country, countryCode: d.country_code, lat: d.latitude, lon: d.longitude });
        else ipFallback2();
      }, ipFallback2);
    }
    function ipFallback2() {
      getJSON('https://ipinfo.io/json', 6000).then(function (d) {
        ipDone(d);
      }, function () {
        statusData.loading = false;
        renderStatus();
        proxyDetect();
        var sbRefresh = document.getElementById('sbRefresh');
        if (sbRefresh) sbRefresh.style.opacity = '1';
      });
    }
    fetchText('http://myip.ipip.net', 7000).then(function (txt) {
      var d = parseIpip(txt);
      if (d && d.ip) ipDone(d); else ipFallback();
    }, ipFallback);
  }

  function fetchWeather() {
    var wea = document.getElementById('sbWeather');
    if (statusData.lat == null || statusData.lon == null) {
      if (wea) wea.innerHTML = '<span>🌡️</span><span>--°C</span>';
      return;
    }
    getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + statusData.lat + '&longitude=' + statusData.lon +
      '&current_weather=true&timezone=auto', 8000).then(function (d) {
      var cw = d.current_weather || {};
      statusData.temp = cw.temperature;
      statusData.code = cw.weathercode;
      renderStatus();
      store.set('status', {
        ts: Date.now(), ip: statusData.ip, city: statusData.city, region: statusData.region,
        country: statusData.country, countryCode: statusData.countryCode, lat: statusData.lat, lon: statusData.lon,
        temp: statusData.temp, code: statusData.code,
        proxyTxt: statusData.proxyTxt, proxyCls: statusData.proxyCls, proxyTip: statusData.proxyTip
      });
      var sbRefresh = document.getElementById('sbRefresh');
      if (sbRefresh) sbRefresh.style.opacity = '1';
    }, function () {
      renderStatus();
      var sbRefresh = document.getElementById('sbRefresh');
      if (sbRefresh) sbRefresh.style.opacity = '1';
    });
  }

  /* ================= 收藏 ================= */
  function isFav(id) {
    var fav = store.get('favs', []);
    return fav.indexOf(id) >= 0;
  }
  function toggleFav(id) {
    var fav = store.get('favs', []);
    var i = fav.indexOf(id);
    if (i >= 0) fav.splice(i, 1); else fav.push(id);
    store.set('favs', fav);
    return i < 0;
  }

  /* ================= 视图渲染 ================= */
  function tileHtml(t) {
    var m = catMeta(t.cat);
    var c = m ? m.color : '#8A93A3';
    if (t.icon) return '<span class="tile tile-emoji" style="background:' + c + '1f;color:' + c + '">' + t.icon + '</span>';
    return '<span class="tile" style="background:' + c + '1f;color:' + c + '">' + (m ? m.icon : '') + '</span>';
  }

  function renderToolCard(tool) {
    return '<button class="tool-card" data-tool="' + tool.id + '">' +
      tileHtml(tool) +
      '<span><span class="tc-name">' + esc(toolName(tool)) + (tool.net ? ' <span class="badge net">' + t('ui.online') + '</span>' : '') + '</span><br><span class="tc-desc">' + esc(toolDesc(tool)) + '</span></span></button>';
  }

  function renderHome() {
    var h = '';
    h += '<section class="hero">';
    h += '<div class="eyebrow">Omni Toolbox · v' + (window.APP_VERSION || '3.0.0') + '</div>';
    h += '<h1>' + t('home.title1') + '<br>' + t('home.title2') + '</h1>';
    h += '<p>' + order.length + t('home.sub') + CATS.length + t('home.sub2') + '</p>';
    h += '<div class="hero-stats">' +
      '<div class="hstat"><b>' + order.length + '</b><span>' + t('home.statTools') + '</span></div>' +
      '<div class="hstat"><b>' + CATS.length + '</b><span>' + t('home.statCats') + '</span></div>' +
      '<div class="hstat"><b>100%</b><span>' + t('home.statLocal') + '</span></div>' +
      '</div>';
    h += '<div class="hero-actions">' +
      '<a class="btn btn-primary" href="#/help">📖 ' + t('home.helpBtn') + '</a>' +
      '<a class="btn btn-ghost" href="#/settings">🎨 ' + t('home.appearanceBtn') + '</a>' +
      '</div>';
    h += '</section>';

    h += '<div class="section-title"><h2>' + t('home.catSection') + '</h2><span>' + CATS.length + t('home.catSub') + '</span></div>';
    h += '<div class="grid">';
    orderedCats().forEach(function (c) {
      var n = catCount[c.id] || 0;
      h += '<button class="cat-card" data-cat="' + c.id + '">' +
        '<span class="tile tile-grad" style="--c:' + c.color + '">' + c.icon + '</span>' +
        '<span><span class="cc-name">' + catName(c) + '</span><br><span class="cc-desc">' + catDesc(c) + '</span><br><span class="cc-count">' + n + t('home.catCount') + '</span></span></button>';
    });
    h += '</div>';

    h += '<div class="section-title"><h2>' + t('home.fav') + '</h2><span>' + t('home.favSub') + '</span></div>';
    var favs = store.get('favs', []);
    if (!favs.length) {
      h += '<div class="empty"><b>' + t('home.noFav') + '</b>' + t('home.noFavSub') + '</div>';
    } else {
      h += '<div class="grid">';
      favs.forEach(function (id) {
        var tf = tools[id];
        if (tf) h += renderToolCard(tf);
      });
      h += '</div>';
    }

    h += '<div class="section-title"><h2>' + t('home.recent') + '</h2><span>' + t('home.recentSub') + '</span></div>';
    var rec = store.get('recent', []);
    if (!rec.length) {
      h += '<div class="empty"><b>' + t('home.noRecent') + '</b>' + t('home.noRecentSub') + '</div>';
    } else {
      h += '<div class="grid">';
      rec.forEach(function (id) {
        var t2 = tools[id];
        if (t2) h += renderToolCard(t2);
      });
      h += '</div>';
    }
    viewEl.innerHTML = h;
    crumbEl.innerHTML = t('ui.home');
    bindViewClicks(viewEl);
    document.getElementById('searchInput').value = '';
    setActiveCat(null);
  }

  function totalSites() {
    var n = 0;
    CATS.forEach(function (c) { if (c.sites) n += c.sites.length; });
    return n;
  }

  function sitesHtml(sites) {
    var win = settings.sitesMode !== 'card';
    var cnFirst = sites.filter(function (s) { return s.g === 'CN'; }).concat(sites.filter(function (s) { return s.g !== 'CN'; }));
    /* 主流站点（h:1）在前，无标记时按原顺序取前 12 个作为主流 */
    var hot = cnFirst.filter(function (s) { return s.h; });
    if (!hot.length) hot = cnFirst.slice(0, Math.min(12, cnFirst.length));
    var hotIds = {};
    hot.forEach(function (s) { hotIds[s.u] = 1; });
    var more = cnFirst.filter(function (s) { return !hotIds[s.u]; });
    var MAX_HOT = 12; /* 3 行 × 4 列 */
    var shown = hot.slice(0, MAX_HOT);
    /* 小众区 = 主流溢出 + 小众站点，整体再次按「国内优先」排序，
       否则主流溢出的 INT 会压住小众的 CN（v3.0.1 修复排序） */
    var restRaw = hot.slice(MAX_HOT).concat(more);
    var rest = restRaw.filter(function (s) { return s.g === 'CN'; })
      .concat(restRaw.filter(function (s) { return s.g !== 'CN'; }));

    function card(s) {
      return '<a class="site-card" href="' + esc(s.u) + '" target="_blank" rel="noopener noreferrer">' +
        '<b>' + esc(s.n) + ' <span class="badge ' + (s.g === 'CN' ? 'net' : 'off') + '">' + (s.g === 'CN' ? t('cat.cn') : t('cat.int')) + '</span></b>' +
        '<i>' + esc(s.u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
    }

    var h = '<div class="section-title"><h2>' + t('cat.sitesTitle') + '</h2><span>' + t('cat.sitesSub') + shown.length + t('cat.sitesSub2') + (win ? t('cat.win') : t('cat.card')) + '</span></div>';
    h += '<div class="site-grid' + (win ? ' win' : '') + '">';
    shown.forEach(function (s) { h += card(s); });
    h += '</div>';
    if (rest.length) {
      h += '<div class="sites-more-wrap">';
      h += '<button class="btn btn-ghost sites-more-btn" id="sitesMoreBtn" data-open="0">';
      h += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="sm-ico"><path d="M12 5v14M5 12h14"/></svg>';
      h += '<span class="sm-label">' + t('cat.moreSites').replace('{n}', rest.length) + '</span></button>';
      h += '</div>';
      h += '<div class="site-grid' + (win ? ' win' : '') + ' site-grid-more" id="siteGridMore" hidden>'; /* 小众站点默认折叠 */
      rest.forEach(function (s) { h += card(s); });
      h += '</div>';
      h += '<div class="sites-more-wrap"><button class="btn btn-ghost sites-less-btn" id="sitesLessBtn" hidden>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="sm-ico"><path d="M5 12h14"/></svg>' +
        '<span>' + t('cat.lessSites') + '</span></button></div>';
    }
    return h;
  }

  function renderCategory(catId) {
    var c = catMeta(catId);
    if (!c) { location.hash = '#/'; return; }
    var list = catTools(catId);
    var h = '';
    h += '<div class="tool-head">';
    h += '<a class="back-link" href="#/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg> ' + t('ui.backHome') + '</a>';
    h += '<div class="tool-title-row">' + tileHtml({ cat: catId }) +
      '<div><h1>' + catName(c) + '</h1><p>' + catDesc(c) + ' · ' + t('cat.count') + list.length + t('cat.count2') +
      (list.some(function (tl) { return tl.net; }) ? t('cat.network') : '') + '</p></div></div>';
    h += '<div class="ruler"><i></i></div></div>';
    h += '<div class="grid">' + list.map(renderToolCard).join('') + '</div>';
    if (!list.length) h = '<div class="empty"><b>' + t('cat.empty') + '</b></div>';
    if (c.sites && c.sites.length) h += sitesHtml(c.sites);
    viewEl.innerHTML = h;
    crumbEl.innerHTML = '<a href="#/" class="link-dim">' + t('ui.home') + '</a><span class="sep">/</span><b>' + catName(c) + '</b>';
    bindViewClicks(viewEl);
    setActiveCat(catId);
    /* 「更多网站」展开/收起 */
    var moreBtn = document.getElementById('sitesMoreBtn');
    var lessBtn = document.getElementById('sitesLessBtn');
    var moreGrid = document.getElementById('siteGridMore');
    if (moreBtn && moreGrid) {
      moreBtn.addEventListener('click', function () {
        moreGrid.hidden = false;
        moreBtn.hidden = true;
        if (lessBtn) lessBtn.hidden = false;
        moreGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      if (lessBtn) lessBtn.addEventListener('click', function () {
        moreGrid.hidden = true;
        lessBtn.hidden = true;
        moreBtn.hidden = false;
        moreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  function renderTool(toolId) {
    var tool = tools[toolId];
    if (!tool) { location.hash = '#/'; return; }
    var c = catMeta(tool.cat);
    var h = '';
    h += '<div class="tool-page">';
    h += '<div class="tool-head">';
    h += '<a class="back-link" href="#/cat/' + tool.cat + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg> ' + t('ui.back') + (c ? ' · ' + catName(c) : '') + '</a>';
    h += '<div class="tool-title-row">' + tileHtml(tool) +
      '<div class="tool-title-main"><h1>' + esc(toolName(tool)) + (tool.net ? ' <span class="badge net">' + t('ui.network') + '</span>' : ' <span class="badge off">' + t('ui.local') + '</span>') +
      '</h1><p>' + esc(toolDesc(tool)) + '</p></div>' +
      '<div class="tool-actions">' +
      '<button class="fav-btn' + (isFav(toolId) ? ' on' : '') + '" id="favBtn" title="' + (isEn() ? 'Add to favorites' : '收藏 / 取消收藏') + '" aria-label="' + (isEn() ? 'Favorite' : '收藏') + '">' + (isFav(toolId) ? '★' : '☆') + '</button>' +
      '<button class="fav-btn" id="shareBtn" title="' + t('tool.share') + '" aria-label="' + t('tool.share') + '">⇪</button>' +
      '</div></div>';
    h += '<div id="toolHost"></div>';
    h += '</div>';
    viewEl.innerHTML = h;
    crumbEl.innerHTML = '<a href="#/" class="link-dim">' + t('ui.home') + '</a><span class="sep">/</span>' +
      (c ? '<a href="#/cat/' + tool.cat + '" class="link-dim">' + catName(c) + '</a><span class="sep">/</span>' : '') +
      '<b>' + esc(toolName(tool)) + '</b>';
    var host = document.getElementById('toolHost');
    var favBtn = document.getElementById('favBtn');
    if (favBtn) favBtn.addEventListener('click', function () {
      var on = toggleFav(toolId);
      favBtn.classList.toggle('on', on);
      favBtn.textContent = on ? '★' : '☆';
      toast(on ? t('home.favAdd') : t('home.favDel'));
    });
    var shareBtn = document.getElementById('shareBtn');
    if (shareBtn) shareBtn.addEventListener('click', function () {
      var url = location.href;
      function done() { toast(t('tool.shareOk')); }
      function fail() { toast(t('tool.shareFail')); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, fail);
      } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var ta = document.createElement('textarea');
        ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { fail(); }
        document.body.removeChild(ta);
      } else fail();
    });
    var cleanup = null;
    try { cleanup = tool.render(host); }
    catch (e) {
      host.innerHTML = '<div class="empty"><b>' + t('ui.loadErr') + '</b>' + esc(e && e.message ? e.message : String(e)) + '</div>';
    }
    currentCleanup = (typeof cleanup === 'function') ? cleanup : null;
    setActiveCat(tool.cat);
    markRecent(toolId);
  }

  function renderSearch(q) {
    q = (q || '').trim().toLowerCase();
    var list = allTools().filter(function (tool) {
      return (tool.name + ' ' + (tool.desc || '') + ' ' + (tool.keywords || '')).toLowerCase().indexOf(q) >= 0;
    });
    var h = '<div class="tool-head"><div class="tool-title-row"><div><h1>' + t('search.title') + '</h1><p>' + t('search.sub') + esc(q) + t('search.sub2') + list.length + t('search.sub3') + '</p></div></div><div class="ruler"><i></i></div></div>';
    if (!list.length) h += '<div class="empty"><b>' + t('search.none') + '</b>' + t('search.hint') + '</div>';
    else h += '<div class="grid">' + list.map(renderToolCard).join('') + '</div>';
    viewEl.innerHTML = h;
    crumbEl.innerHTML = (isEn() ? 'Search: ' : '搜索：') + esc(q);
    bindViewClicks(viewEl);
    setActiveCat(null);
  }

  /* ================= 使用说明书 ================= */
  function renderHelp() {
    var h = '';
    h += '<div class="tool-page help">';
    h += '<div class="tool-head">';
    h += '<a class="back-link" href="#/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg> ' + t('ui.backHome') + '</a>';
    h += '<div class="tool-title-row">' + tileHtml({ cat: 'sys' }) +
      '<div><h1>' + t('help.title') + '</h1><p>' + t('help.sub') + '</p></div></div>';
    h += '<div class="ruler"><i></i></div></div>';

    h += '<div class="panel"><h3>' + t('help.toc') + '</h3><div class="toc">' +
      ['#hl-update', '#hl-about', '#hl-quick', '#hl-tools', '#hl-sites', '#hl-proxy', '#hl-net', '#hl-data', '#hl-platform', '#hl-faq', '#hl-legal'].map(function (a, i) {
        var tocAll = (window.I18N && window.I18N['help.tocItems']) || [];
        var label = (tocAll[i] && tocAll[i][isEn() ? 1 : 0]) || a;
        return '<a href="' + a + '">' + label + '</a>';
      }).join('') + '</div></div>';

    h += '<div class="panel" id="hl-update"><h3>' + t('help.update') + '</h3>';
    h += '<ul>' + t('help.updateBody') + '</ul></div>';

    h += '<div class="panel" id="hl-about"><h3>' + t('help.about') + '</h3>';
    h += '<p>' + t('help.aboutBody').replace('{n}', order.length).replace('{c}', CATS.length) + '</p>';
    h += '<p>' + t('help.repoNote') + '：<a class="link-dim" href="' + REPO_URL + '" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">' + REPO_NAME + '</a></p>';
    h += '<ul><li><b>Web</b>：' + (isEn() ? 'Open index.html in any browser; PWA offline cache supported' : '双击 index.html 即用，手机/电脑浏览器通用，支持 PWA 离线缓存') + '；</li>' +
      '<li><b>Windows EXE</b>：' + (isEn() ? 'Installer & portable builds (Electron)' : '安装版与便携版，Electron 封装') + '；</li>' +
      '<li><b>Android APK</b>：' + (isEn() ? 'Capacitor build; Android project included in source zip' : 'Capacitor 封装，源码包内已含安卓工程') + '。</li></ul>';
    h += '<p>' + (isEn() ? 'Core tools compute 100% locally; data stays in your own browser/device (localStorage). Only some tools (forex, IP, weather, GitHub…) fetch public data and show a clear notice when offline.' : '核心工具全部在本地完成计算，数据只保存在你自己的浏览器/设备中（localStorage），不经过任何服务器。仅部分工具（汇率、IP、天气、GitHub 等）需要联网获取公开数据，断网时会给出明确提示。') + '</p></div>';

    h += '<div class="panel" id="hl-quick"><h3>' + t('help.quick') + '</h3>';
    h += '<ul>' + t('help.quickBody').replace('{n}', totalSites()) + '</ul></div>';

    h += '<div class="panel" id="hl-tools"><h3>' + t('help.tools').replace('{n}', order.length) + '</h3>';
    orderedCats().forEach(function (c) {
      var list = catTools(c.id);
      if (!list.length) return;
      h += '<div class="cat-block"><div class="cb-title">' + tileHtml({ cat: c.id }) + '<b>' + catName(c) + '</b><span>' + list.length + ' 款</span></div>';
      h += '<div class="tool-tags">' + list.map(function (tl) {
        return '<span title="' + esc(toolDesc(tl)) + '">' + esc(toolName(tl)) + (tl.net ? ' ⚡' : '') + '</span>';
      }).join('') + '</div></div>';
    });
    h += '<p class="note">' + t('help.toolsNote') + '</p></div>';

    h += '<div class="panel" id="hl-sites"><h3>' + t('help.sites') + '</h3>';
    h += '<p>' + t('help.sitesBody').replace('{s}', totalSites()) + '</p>';
    h += '<ul>' +
      '<li><b>' + (isEn() ? 'Compact mode (default)' : '小窗口模式（默认）') + '</b>：' + (isEn() ? 'small multi-column cards — see more at a glance' : '官网以小卡片多列紧凑排列，一屏可浏览更多站点') + '；</li>' +
      '<li><b>' + (isEn() ? 'Standard mode' : '标准卡片模式') + '</b>：' + (isEn() ? 'full name & domain, more detail' : '显示完整名称与域名，信息更详尽') + '；</li>' +
      '<li>' + (isEn() ? 'Switch: Settings → Official Sites → Card style.' : '切换位置：设置 → 官网导航 → 官网卡片样式。') + '</li>' +
      '</ul>';
    h += '<p class="note">' + (isEn() ? 'Cards are external links, opened in a new tab without proxying.' : '卡片为站外链接，点击后将在新窗口打开，不经过本工具中转。') + '</p></div>';

    h += '<div class="panel" id="hl-proxy"><h3>' + t('help.proxy') + '</h3>';
    h += '<p>' + (isEn() ? 'A shield badge next to the IP shows whether traffic may be proxied:' : '状态栏 IP 旁会显示盾牌标记，智能判断当前网络是否经代理转发：') + '</p>';
    h += '<ul>' + t('help.proxyBody') + '</ul>';
    h += '<p class="note">' + t('help.proxyNote') + '</p></div>';

    h += '<div class="panel"><h3>' + t('help.geoTitle') + '</h3>';
    h += '<p>' + t('help.geoBody') + '</p></div>';

    h += '<div class="panel" id="hl-net"><h3>' + t('help.net') + '</h3>';
    h += '<p>' + (isEn() ? 'These tools work fully online and degrade gracefully offline:' : '以下工具在联网时功能完整，断网时自动降级或给出提示：') + '</p>';
    h += '<ul>';
    allTools().forEach(function (tl) {
      if (!tl.net) return;
      h += '<li><b>' + esc(toolName(tl)) + '</b>：' + esc(tl.netNote || (isEn() ? 'Uses free public APIs, subject to rate limits' : '使用免费公开接口，受接口限流影响')) + '</li>';
    });
    h += '</ul>';
    h += '<p class="note">' + t('help.netNote') + '</p></div>';

    h += '<div class="panel" id="hl-data"><h3>' + t('help.data') + '</h3>';
    h += '<ul>' + t('help.dataBody') + '</ul></div>';

    h += '<div class="panel" id="hl-platform"><h3>' + t('help.platform') + '</h3>';
    var ptRows = (window.I18N && window.I18N['help.platformTable']) || [];
    h += '<table class="kv">' + ptRows.map(function (row, ri) {
      return '<tr>' + row.map(function (cell) { return '<' + (ri === 0 ? 'th' : 'td') + '>' + cell + '</' + (ri === 0 ? 'th' : 'td') + '>'; }).join('') + '</tr>';
    }).join('') + '</table></div>';

    h += '<div class="panel" id="hl-faq"><h3>' + t('help.faq') + '</h3>';
    h += '<ol>' + t('help.faqBody') + '</ol></div>';

    h += '<div class="panel" id="hl-legal"><h3>' + t('help.legal') + '</h3>';
    h += '<p>' + t('help.legalBody') + '</p></div>';

    h += '</div>';
    viewEl.innerHTML = h;
    crumbEl.innerHTML = '<a href="#/" class="link-dim">' + t('ui.home') + '</a><span class="sep">/</span><b>' + t('ui.help') + '</b>';
    bindViewClicks(viewEl);
    setActiveCat(null);
  }

  /* ================= 设置页 ================= */
  function renderSettings() {
    var themes = [
      { id: 'default', name: t('set.theme1'), bg: '#121417', ac: '#E8A33D' },
      { id: 'midnight', name: t('set.theme2'), bg: '#0A1020', ac: '#4FA3FF' },
      { id: 'green', name: t('set.theme3'), bg: '#0F140D', ac: '#9CCC65' },
      { id: 'light', name: t('set.theme4'), bg: '#F2F4F7', ac: '#D98E16' },
      { id: 'contrast', name: t('set.theme5'), bg: '#000000', ac: '#FFD23F' },
      { id: 'violet', name: t('set.theme6'), bg: '#160F26', ac: '#B388FF' },
      { id: 'cyber', name: t('set.theme7'), bg: '#0A0E1A', ac: '#00E5C0' },
      { id: 'amber', name: t('set.theme8'), bg: '#1A1206', ac: '#FFB347' },
      { id: 'ocean', name: t('set.theme9'), bg: '#04202C', ac: '#2FC4D9' }
    ];
    var h = '';
    h += '<div class="tool-page">';
    h += '<div class="tool-head">';
    h += '<a class="back-link" href="#/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg> ' + t('ui.backHome') + '</a>';
    h += '<div class="tool-title-row">' + tileHtml({ cat: 'sys' }) +
      '<div><h1>' + t('set.title') + '</h1><p>' + t('set.sub') + '</p></div></div>';
    h += '<div class="ruler"><i></i></div></div>';

    /* 语言 */
    h += '<div class="panel"><h3>' + t('set.lang') + '</h3><div class="set-group">' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.lang') + '</b><span>' + t('set.langSub') + '</span></div>' +
      '<div class="seg lang-seg" id="setLang">' +
      [['auto', t('set.autoLang')], ['zh', t('set.zh')], ['en', 'English'], ['ja', '日本語'], ['ko', '한국어'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'], ['ru', 'Русский'], ['ar', 'العربية']].map(function (m) {
        return '<button data-act="lang" data-val="' + m[0] + '" class="' + (settings.lang === m[0] ? 'active' : '') + '">' + m[1] + '</button>';
      }).join('') + '</div></div>' +
      '<p class="note">' + t('set.langNote') + '</p></div></div>';

    h += '<div class="panel"><h3>' + t('set.appearance') + '</h3><div class="set-group">' +
      '<div class="set-sub">' + t('set.theme') + '</div><div class="theme-swatches">';
    themes.forEach(function (th) {
      h += '<button class="theme-swatch' + (settings.theme === th.id ? ' active' : '') + '" data-act="theme" data-val="' + th.id + '">' +
        '<span class="sw" style="background:' + th.bg + '"><i style="background:' + th.ac + '"></i></span><span>' + th.name + '</span></button>';
    });
    h += '</div>';
    h += '<div class="set-sub">' + t('set.mode') + '</div>' +
      '<div class="seg" id="setMode">' +
      [['dark', t('set.dark')], ['light', t('set.light')], ['auto', t('set.auto')]].map(function (m) {
        return '<button data-act="mode" data-val="' + m[0] + '" class="' + (settings.mode === m[0] ? 'active' : '') + '">' + m[1] + '</button>';
      }).join('') + '</div>' +
      '<p class="note">' + t('set.modeNote') + '</p>' +
      '<div class="set-sub">' + t('set.accent') + '</div>' +
      '<div class="color-hex-row">' +
      '<input type="color" id="setAccentColor" value="' + (settings.accent || '#E8A33D') + '">' +
      '<input type="text" id="setAccentHex" value="' + (settings.accent || '#E8A33D') + '" style="width:110px" maxlength="7" spellcheck="false">' +
      '<button class="btn btn-ghost" id="setAccentReset">' + t('set.accentReset') + '</button>' +
      '</div><p class="note">' + t('set.accentNote') + '</p></div></div>';

    h += '<div class="panel"><h3>' + t('set.glassPanel') + '</h3><div class="set-group">' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.glass') + '</b><span>' + t('set.glassDesc') + '</span></div>' +
      '<button class="switch' + (settings.glass ? ' on' : '') + '" id="setGlass" role="switch" aria-checked="' + settings.glass + '"></button></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.statusbar') + '</b><span>' + t('set.statusbarDesc') + '</span></div>' +
      '<button class="switch' + (settings.statusbar ? ' on' : '') + '" id="setStatusbar" role="switch" aria-checked="' + settings.statusbar + '"></button></div>' +
      '</div></div>';

    h += '<div class="panel"><h3>' + t('set.displayPanel') + '</h3><div class="set-group">' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.fontScale') + '</b><span>' + settings.fontScale + '% · ' + t('set.fontScaleDesc') + '</span></div>' +
      '<input type="range" id="setFontScale" min="80" max="140" step="5" value="' + settings.fontScale + '" style="width:160px"></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.motion') + '</b><span>' + t('set.motionDesc') + '</span></div>' +
      '<button class="switch' + (settings.motion ? ' on' : '') + '" id="setMotion" role="switch" aria-checked="' + settings.motion + '"></button></div>' +
      '</div></div>';

    h += '<div class="panel"><h3>' + t('set.sitesPanel') + '</h3><div class="set-group">' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.sitesCard') + '</b><span>' + t('set.sitesCardDesc') + '</span></div>' +
      '<div class="seg" id="setSitesMode">' +
      [['win', t('set.sitesWin')], ['card', t('set.sitesCard2')]].map(function (m) {
        return '<button data-act="sitesmode" data-val="' + m[0] + '" class="' + ((settings.sitesMode !== 'card') === (m[0] === 'win') ? 'active' : '') + '">' + m[1] + '</button>';
      }).join('') + '</div></div>' +
      '<p class="note">' + t('set.sitesNote') + totalSites() + t('set.sitesNote2') + '</p>' +
      '</div></div>';

    h += '<div class="panel"><h3>' + t('set.layout') + '</h3><div class="set-group">' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.density') + '</b><span>' + t('set.densityDesc') + '</span></div>' +
      '<div class="seg" id="setDensity">' +
      [['compact', t('set.compact')], ['normal', t('set.normal')], ['comfort', t('set.comfort')]].map(function (d) {
        return '<button data-act="density" data-val="' + d[0] + '" class="' + (settings.density === d[0] ? 'active' : '') + '">' + d[1] + '</button>';
      }).join('') + '</div></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.radius') + '</b><span>' + settings.radius + 'px</span></div>' +
      '<input type="range" id="setRadius" min="8" max="24" value="' + settings.radius + '" style="width:160px"></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.sidegroup') + '</b><span>' + t('set.sidegroupDesc') + '</span></div>' +
      '<button class="switch' + (settings.sidegroup ? ' on' : '') + '" id="setSidegroup" role="switch" aria-checked="' + settings.sidegroup + '"></button></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.order') + '</b><span>' + t('set.orderDesc') + '</span></div></div>' +
      '</div></div>';

    h += '<div class="panel"><h3>' + t('set.data') + '</h3><div class="set-group">' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.reset') + '</b><span>' + t('set.resetDesc') + '</span></div>' +
      '<button class="btn btn-ghost" id="setReset">' + t('set.resetBtn') + '</button></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.clearRecent') + '</b><span>' + t('set.clearRecentDesc') + '</span></div>' +
      '<button class="btn btn-ghost" id="setClearRecent">' + t('set.clearBtn') + '</button></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.clearFav') + '</b><span>' + t('set.clearFavDesc') + ' <b id="favCount">' + store.get('favs', []).length + '</b></span></div>' +
      '<button class="btn btn-ghost" id="setClearFav">' + t('set.clearBtn') + '</button></div>' +
      '<div class="set-row"><div class="set-label"><b>' + t('set.clearAll') + '</b><span>' + t('set.clearAllDesc') + '</span></div>' +
      '<button class="btn btn-danger" id="setClearAll">' + t('set.clearAllBtn') + '</button></div>' +
      '</div></div>';

    h += '<div class="panel"><h3>' + t('set.about') + '</h3>';
    h += '<p>Omni Toolbox v' + (window.APP_VERSION || '3.0.0') + ' ' + t('set.aboutText') + order.length + t('set.aboutText2') + CATS.length + t('set.aboutText3') + totalSites() + t('set.aboutText4') + '<a class="link-dim" href="#/help" style="color:var(--accent)">' + t('set.aboutHelp') + '</a>。' + t('set.aboutRepo') + '<a class="link-dim" href="' + REPO_URL + '" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">' + REPO_NAME + '</a></p></div>';

    h += '</div>';
    viewEl.innerHTML = h;
    crumbEl.innerHTML = '<a href="#/" class="link-dim">' + t('ui.home') + '</a><span class="sep">/</span><b>' + t('ui.settings') + '</b>';
    bindViewClicks(viewEl);
    setActiveCat(null);

    /* 绑定设置事件 */
    viewEl.addEventListener('click', function (e) {
      var sw = e.target.closest('[data-act="theme"]');
      if (sw) {
        updateSetting('theme', sw.getAttribute('data-val'));
        viewEl.querySelectorAll('[data-act="theme"]').forEach(function (b) { b.classList.toggle('active', b === sw); });
        return;
      }
      var lg = e.target.closest('[data-act="lang"]');
      if (lg) {
        var langVal = lg.getAttribute('data-val');
        if (langVal !== settings.lang) {
          settings.lang = langVal;
          saveSettings();
          var rl = resolvedLang();
          document.documentElement.lang = rl === 'zh' ? 'zh-CN' : (rl === 'en' ? 'en' : rl);
          renderSettings();
          buildNav();
          applyStaticLang();
          var nm = {};
          LANG_META.forEach(function (m) { nm[m.id] = m.label; });
          toast((langVal === 'auto' ? (t('set.autoLang') + ' · ' + nm[rl]) : nm[langVal] || langVal) + (rl === 'zh' ? ' 已生效' : rl === 'en' ? ' applied' : ' ✓'));
        }
        return;
      }
      var md = e.target.closest('[data-act="mode"]');
      if (md) {
        updateSetting('mode', md.getAttribute('data-val'));
        viewEl.querySelectorAll('[data-act="mode"]').forEach(function (b) { b.classList.toggle('active', b === md); });
        toast(t('set.modeToast') + (md.getAttribute('data-val') === 'light' ? t('set.modeLight') : md.getAttribute('data-val') === 'auto' ? t('set.modeAuto') : t('set.modeDark')) + (isEn() ? ' mode' : '模式'));
        return;
      }
      if (e.target.id === 'setReset') {
        if (confirm(t('set.confirmReset'))) {
          settings.theme = 'default';
          settings.accent = '';
          settings.glass = false;
          settings.density = 'normal';
          settings.radius = 14;
          settings.statusbar = true;
          settings.sidegroup = true;
          settings.mode = 'dark';
          settings.sitesMode = 'win';
          settings.fontScale = 100;
          settings.motion = true;
          saveSettings();
          applySettings();
          buildNav();
          renderSettings();
          toast(t('set.doneReset'));
        }
        return;
      }
      var sm = e.target.closest('[data-act="sitesmode"]');
      if (sm) {
        updateSetting('sitesMode', sm.getAttribute('data-val'));
        viewEl.querySelectorAll('[data-act="sitesmode"]').forEach(function (b) { b.classList.toggle('active', b === sm); });
        toast(t('set.sitesToast') + (sm.getAttribute('data-val') === 'win' ? t('set.sitesWin') : t('set.sitesCard2')) + (isEn() ? ' mode' : '模式'));
        return;
      }
      var dn = e.target.closest('[data-act="density"]');
      if (dn) {
        updateSetting('density', dn.getAttribute('data-val'));
        viewEl.querySelectorAll('[data-act="density"]').forEach(function (b) { b.classList.toggle('active', b === dn); });
        return;
      }
      if (e.target.id === 'setGlass') {
        var g = !settings.glass;
        updateSetting('glass', g);
        e.target.classList.toggle('on', g);
        e.target.setAttribute('aria-checked', g);
      }
      if (e.target.id === 'setStatusbar') {
        var sb = !settings.statusbar;
        updateSetting('statusbar', sb);
        e.target.classList.toggle('on', sb);
        e.target.setAttribute('aria-checked', sb);
      }
      if (e.target.id === 'setMotion') {
        var mt2 = !settings.motion;
        updateSetting('motion', mt2);
        e.target.classList.toggle('on', mt2);
        e.target.setAttribute('aria-checked', mt2);
      }
      if (e.target.id === 'setSidegroup') {
        var sg = !settings.sidegroup;
        updateSetting('sidegroup', sg);
        e.target.classList.toggle('on', sg);
        e.target.setAttribute('aria-checked', sg);
      }
      if (e.target.id === 'setAccentReset') {
        updateSetting('accent', '');
        document.getElementById('setAccentColor').value = '#E8A33D';
        document.getElementById('setAccentHex').value = '#E8A33D';
      }
      if (e.target.id === 'setClearRecent') {
        store.set('recent', []);
        toast(t('set.doneRecent'));
      }
      if (e.target.id === 'setClearFav') {
        store.set('favs', []);
        var fc = document.getElementById('favCount');
        if (fc) fc.textContent = '0';
        toast(t('set.doneFav'));
      }
      if (e.target.id === 'setClearAll') {
        if (confirm(t('set.confirmClear'))) {
          store.clear();
          toast(t('set.doneClear'));
          location.hash = '#/';
        }
      }
    });
    var acc = document.getElementById('setAccentColor');
    var accHex = document.getElementById('setAccentHex');
    if (acc) acc.addEventListener('input', function () {
      var v = acc.value;
      accHex.value = v;
      updateSetting('accent', v);
    });
    if (accHex) accHex.addEventListener('change', function () {
      var v = accHex.value.trim();
      if (!/^#[0-9a-fA-F]{6}$/.test(v)) { toast(t('set.hexErr')); accHex.value = settings.accent || '#E8A33D'; return; }
      acc.value = v;
      updateSetting('accent', v);
    });
    function syncRangeFill(el) {
      var pct = ((el.value - el.min) / (el.max - el.min)) * 100;
      el.style.setProperty('--fill', (isNaN(pct) ? 50 : pct) + '%');
    }
    var rk = document.getElementById('setRadius');
    if (rk) rk.addEventListener('input', function () {
      updateSetting('radius', Number(rk.value));
      var lbl = rk.closest('.set-row').querySelector('.set-label span');
      if (lbl) lbl.textContent = rk.value + 'px';
      syncRangeFill(rk);
    });
    if (rk) syncRangeFill(rk);
    var fsl = document.getElementById('setFontScale');
    if (fsl) fsl.addEventListener('input', function () {
      updateSetting('fontScale', Number(fsl.value));
      var flbl = fsl.closest('.set-row').querySelector('.set-label span');
      if (flbl) flbl.textContent = fsl.value + '% · ' + t('set.fontScaleDesc');
      syncRangeFill(fsl);
    });
    if (fsl) syncRangeFill(fsl);
  }

  function markRecent(id) {
    var rec = store.get('recent', []);
    rec = rec.filter(function (x) { return x !== id; });
    rec.unshift(id);
    store.set('recent', rec.slice(0, 8));
  }

  function setActiveCat(catId) {
    var items = document.querySelectorAll('.cat-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', items[i].getAttribute('data-cat') === catId);
    }
  }

  function bindViewClicks(root) {
    root.addEventListener('click', function (e) {
      var card = e.target.closest('[data-tool]');
      if (card) { location.hash = '#/tool/' + card.getAttribute('data-tool'); closeDrawer(); return; }
      var cat = e.target.closest('[data-cat]');
      if (cat) { location.hash = '#/cat/' + cat.getAttribute('data-cat'); closeDrawer(); }
    });
  }

  function route() {
    var hash = location.hash || '#/';
    var parts = hash.replace(/^#\/?/, '').split('/');
    var page = parts[0] || '';
    if (currentCleanup) { try { currentCleanup(); } catch (e) {} currentCleanup = null; }
    clearAllTimers();
    if (page === 'cat' && parts[1]) renderCategory(parts[1]);
    else if (page === 'tool' && parts[1]) renderTool(parts[1]);
    else if (page === 'help') renderHelp();
    else if (page === 'settings') renderSettings();
    else renderHome();
    window.scrollTo(0, 0);
  }

  /* ================= 侧栏导航 ================= */
  function buildNav() {
    var nav = document.getElementById('catNav');
    var h = '';
    if (settings.sidegroup) {
      CAT_GROUPS.forEach(function (grp) {
        h += '<div class="nav-group"><span class="nav-group-label">' + groupName(grp[0]) + '</span>';
        grp[1].forEach(function (cid) {
          var c = catMeta(cid);
          if (!c) return;
          h += '<button class="cat-item" data-cat="' + cid + '">' +
            '<span style="color:' + c.color + '">' + c.icon + '</span>' +
            '<span class="cat-name">' + catName(c) + '</span>' +
            '<span class="cat-count"><b>' + (catCount[cid] || 0) + '</b></span></button>';
        });
        h += '</div>';
      });
    } else {
      orderedCats().forEach(function (c) {
        h += '<button class="cat-item" data-cat="' + c.id + '">' +
          '<span style="color:' + c.color + '">' + c.icon + '</span>' +
          '<span class="cat-name">' + catName(c) + '</span>' +
          '<span class="cat-count"><b>' + (catCount[c.id] || 0) + '</b></span></button>';
      });
    }
    nav.innerHTML = h;
    nav.addEventListener('click', function (e) {
      var item = e.target.closest('.cat-item');
      if (item) {
        location.hash = '#/cat/' + item.getAttribute('data-cat');
        closeDrawer();
      }
    });
  }

  function openDrawer() { document.getElementById('sidebar').classList.add('open'); document.getElementById('mask').hidden = false; }
  function closeDrawer() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('mask').hidden = true; }

  /* 静态文案（src/index.html 中的固定元素） */
  function applyStaticLang() {
    document.documentElement.lang = resolvedLang() === 'zh' ? 'zh-CN' : resolvedLang();
    document.title = isEn() ? 'Omni Toolbox - Cross-platform Tool Suite' : '万能工具箱 - 跨平台超级工具合集';
    var brandT = document.querySelector('.brand-text b');
    if (brandT) brandT.textContent = isEn() ? 'Omni Toolbox' : '万能工具箱';
    var bs = document.getElementById('brandSub');
    if (bs) {
      bs.textContent = order.length + (isEn() ? ' tools · 3 platforms' : ' 款工具 · 三端可用');
      bs.setAttribute('title', order.length + (isEn() ? ' tools · ' : ' 款工具 · ') + CATS.length + (isEn() ? ' categories' : ' 类'));
    }
    var si = document.getElementById('searchInput');
    if (si) si.setAttribute('placeholder', t('ui.searchPh'));
    var crumb = document.getElementById('crumb');
    if (crumb && (!crumb.textContent.trim() || crumb.textContent.trim() === t('ui.home') || crumb.textContent.trim() === (isEn() ? '首页' : 'Home'))) {
      crumb.textContent = t('ui.home');
    }
    var ver = document.querySelector('.side-foot .ver');
    if (ver) ver.textContent = 'v' + (window.APP_VERSION || '3.0.0') + ' · ' + t('ui.ver');
    var inst = document.getElementById('installBtn');
    if (inst) inst.textContent = t('ui.install');
    var sbItems = {
      'sbGeo': { title: t('sb.geoTitle') },
      'sbWeather': { title: t('sb.weatherTitle') },
      'sbIp': { title: t('sb.ipTitle') },
      'sbProxy': { title: t('sb.proxyTitle') },
      'sbHelp': { title: t('sb.helpTitle') },
      'sbRefresh': { title: t('sb.refreshTitle') },
      'sbGear': { title: t('sb.settingsTitle'), text: isEn() ? '⚙ Settings' : '⚙ 设置' }
    };
    Object.keys(sbItems).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('title', sbItems[id].title);
      if (sbItems[id].text) el.textContent = sbItems[id].text;
    });
  }

  /* ================= 启动 ================= */
  function boot() {
    viewEl = document.getElementById('view');
    crumbEl = document.getElementById('crumb');
    loadSettings();
    applySettings();
    buildNav();
    applyStaticLang();

    window.addEventListener('hashchange', route);
    route();

    var menuBtn = document.getElementById('menuBtn');
    var mask = document.getElementById('mask');
    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (mask) mask.addEventListener('click', closeDrawer);

    /* v2.8：回到顶部悬浮按钮（外壳级，路由切换时控制显隐） */
    var backTop = document.getElementById('backTop');
    if (!backTop) {
      backTop = document.createElement('button');
      backTop.id = 'backTop';
      backTop.className = 'back-top';
      backTop.title = t('tool.backTop');
      backTop.setAttribute('aria-label', t('tool.backTop'));
      backTop.innerHTML = '↑';
      document.body.appendChild(backTop);
      backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    window.addEventListener('scroll', function () {
      if (!backTop) return;
      backTop.classList.toggle('show', window.pageYOffset > 420);
    }, { passive: true });
    document.getElementById('brandBtn').addEventListener('click', function () {
      location.hash = '#/';
      closeDrawer();
    });

    var search = document.getElementById('searchInput');
    var searchMode = false;
    search.addEventListener('input', function () {
      var q = search.value.trim();
      if (q) {
        searchMode = true;
        renderSearch(q);
      } else if (searchMode) {
        searchMode = false;
        route();
      }
    });
    window.addEventListener('hashchange', function () {
      searchMode = false;
      var s = document.getElementById('searchInput');
      if (s && s.value.trim() && !s.value.trim().length) s.value = '';
      if (s && location.hash !== '#/' && s.value.trim()) s.value = '';
    });

    /* 状态栏 */
    initClock();
    var sbRefresh = document.getElementById('sbRefresh');
    if (sbRefresh) sbRefresh.addEventListener('click', function () {
      refreshStatus(true);
      toast(isEn() ? 'Refreshing network info…' : '正在刷新网络信息…');
    });
    var sbIp = document.getElementById('sbIp');
    if (sbIp) sbIp.addEventListener('click', function () {
      if (statusData.ip) copyText(statusData.ip, function () { toast(t('sb.copied')); });
    });
    var sbProxy = document.getElementById('sbProxy');
    if (sbProxy) sbProxy.addEventListener('click', function () {
      toast(statusData.proxyTip || t('sb.clickRefresh'));
    });
    var sbGear = document.getElementById('sbGear');
    if (sbGear) sbGear.addEventListener('click', function () { location.hash = '#/settings'; });
    var sbHelp = document.getElementById('sbHelp');
    if (sbHelp) sbHelp.addEventListener('click', function () { location.hash = '#/help'; });
    refreshStatus();

    /* PWA 安装 */
    var installBtn = document.getElementById('installBtn');
    var deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.hidden = false;
    });
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        installBtn.hidden = true;
      });
    });

    /* 离线缓存（仅 http/https 环境，file:// 下自动跳过） */
    if (location.protocol === 'https:' || location.protocol === 'http:') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(function () {});
      }
    }
  }

  return {
    CATS: CATS,
    CAT_GROUPS: CAT_GROUPS,
    totalSites: totalSites,
    register: register,
    byId: byId,
    catTools: catTools,
    allTools: allTools,
    catMeta: catMeta,
    toolCount: toolCount,
    boot: boot,
    esc: esc,
    toast: toast,
    copyText: copyText,
    mkCopyBtn: mkCopyBtn,
    fmtNum: fmtNum,
    readFile: readFile,
    store: store,
    setTimer: setTimer,
    setIntervalSafe: setIntervalSafe,
    getJSON: getJSON,
    fetchText: fetchText,
    getBlob: getBlob,
    blobDownload: blobDownload,
    tileHtml: tileHtml,
    renderToolCard: renderToolCard,
    settings: settings,
    updateSetting: updateSetting,
    refreshStatus: refreshStatus,
    t: t,
    tn: toolName,
    td: toolDesc,
    cn: catName,
    gn: groupName,
    isEn: isEn,
    flagSvg: flagFor,
    resolvedLang: resolvedLang
  };
})();
