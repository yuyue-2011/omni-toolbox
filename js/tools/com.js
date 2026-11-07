/* ============================================================
   万能工具箱 v2.1 · 通讯板块（5 款）
   国内区号 / 国际区号 / 运营商识别 / 常用号码 / 短信模板
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  var esc = T.esc;

  /* ================= 通讯：国内长途区号 ================= */
  T.register({
    id: 'com-code', cat: 'com', icon: '📞',
    name: '国内区号', desc: '国内主要城市长途区号速查',
    keywords: '区号 长途 电话 城市 号码 国内 查询 area code',
    render: function (host) {
      var rows = [
        ['北京', '010'], ['上海', '021'], ['天津', '022'], ['重庆', '023'],
        ['广州', '020'], ['深圳', '0755'], ['杭州', '0571'], ['南京', '025'],
        ['武汉', '027'], ['成都', '028'], ['西安', '029'], ['沈阳', '024'],
        ['大连', '0411'], ['青岛', '0532'], ['厦门', '0592'], ['长沙', '0731'],
        ['郑州', '0371'], ['济南', '0531'], ['合肥', '0551'], ['福州', '0591'],
        ['南昌', '0791'], ['昆明', '0871'], ['贵阳', '0851'], ['南宁', '0771'],
        ['海口', '0898'], ['三亚', '0898'], ['哈尔滨', '0451'], ['长春', '0431'],
        ['太原', '0351'], ['石家庄', '0311'], ['兰州', '0931'], ['西宁', '0971'],
        ['银川', '0951'], ['乌鲁木齐', '0991'], ['呼和浩特', '0471'], ['拉萨', '0891'],
        ['苏州', '0512'], ['无锡', '0510'], ['宁波', '0574'], ['东莞', '0769'],
        ['佛山', '0757'], ['珠海', '0756'], ['香港', '00852'], ['澳门', '00853']
      ];
      var h = '<div class="panel"><h3>' + L('国内主要城市区号', 'CN Area Codes') + '</h3><div class="table-wrap"><table class="kv"><tr><th>城市</th><th>区号</th></tr>';
      rows.forEach(function (r, i) {
        if (i % 2 === 0) h += '<tr>';
        h += '<td>' + r[0] + '</td><td class="mono">' + r[1] + '</td>';
        if (i % 2 === 1) h += '</tr>';
      });
      if (rows.length % 2 === 1) h += '<td></td><td></td></tr>';
      h += '</table></div><p class="note">国内拨打：区号+号码；手机拨打长途一般无需加 0。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 通讯：国际区号 ================= */
  T.register({
    id: 'com-intl', cat: 'com', icon: '🌍',
    name: '国际区号', desc: '主要国家/地区国际电话区号速查',
    keywords: '国际 区号 国家 电话 拨打 国外 calling code 国际长途',
    render: function (host) {
      var rows = [
        ['中国', '+86'], ['香港', '+852'], ['澳门', '+853'], ['台湾', '+886'],
        ['美国 / 加拿大', '+1'], ['英国', '+44'], ['日本', '+81'], ['韩国', '+82'],
        ['新加坡', '+65'], ['马来西亚', '+60'], ['泰国', '+66'], ['越南', '+84'],
        ['菲律宾', '+63'], ['印度尼西亚', '+62'], ['印度', '+91'], ['澳大利亚', '+61'],
        ['新西兰', '+64'], ['法国', '+33'], ['德国', '+49'], ['意大利', '+39'],
        ['西班牙', '+34'], ['荷兰', '+31'], ['瑞士', '+41'], ['俄罗斯', '+7'],
        ['巴西', '+55'], ['墨西哥', '+52'], ['阿联酋', '+971'], ['沙特', '+966'],
        ['南非', '+27'], ['埃及', '+20'], ['土耳其', '+90'], ['以色列', '+972']
      ];
      var h = '<div class="panel"><h3>' + L('国际电话区号', 'Intl Dialing') + '</h3><div class="table-wrap"><table class="kv"><tr><th>国家/地区</th><th>区号</th></tr>';
      rows.forEach(function (r, i) {
        if (i % 2 === 0) h += '<tr>';
        h += '<td>' + r[0] + '</td><td class="mono">' + r[1] + '</td>';
        if (i % 2 === 1) h += '</tr>';
      });
      if (rows.length % 2 === 1) h += '<td></td><td></td></tr>';
      h += '</table></div><p class="note">拨打格式：00（国际前缀）＋ 国家区号（去 +）＋ 当地号码。港澳台按国际长途计费。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 通讯：运营商识别 ================= */
  T.register({
    id: 'com-carrier', cat: 'com', icon: '📱',
    name: '运营商识别', desc: '手机号段识别移动 / 联通 / 电信',
    keywords: '运营商 手机号 移动 联通 电信 号段 识别 归属',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('手机运营商识别', 'Carrier Lookup') + '</h3>' +
        '<div class="row"><div class="field grow"><label>输入手机号</label><input id="carIn" placeholder="11 位手机号" maxlength="11" inputmode="numeric" spellcheck="false"></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="carBtn">' + L('识别', 'Identify') + '</button></div></div>' +
        '<div id="carOut" style="margin-top:12px"></div>' +
        '<div class="panel" style="margin-top:12px"><h3>' + L('常见号段参考', 'Number Prefixes') + '</h3><div class="table-wrap"><table class="kv"><tr><th>运营商</th><th>主要号段</th></tr>' +
        '<tr><td><b>中国移动</b></td><td>134-139、147、150-152、157-159、172、178、182-184、187-188、195、197-198</td></tr>' +
        '<tr><td><b>中国联通</b></td><td>130-132、145、155-156、166、167、171、175-176、185-186、196</td></tr>' +
        '<tr><td><b>中国电信</b></td><td>133、149、153、173、177、180-181、189、190-191、193、199</td></tr>' +
        '<tr><td><b>中国广电</b></td><td>192</td></tr>' +
        '</table></div><p class="note">携号转网后归属可能变化，结果仅供参考。</p></div>' +
      '</div>';
      function check() {
        var v = document.getElementById('carIn').value.trim();
        var out = document.getElementById('carOut');
        if (!/^1\d{10}$/.test(v)) { out.innerHTML = '<div class="msg err">请输入 11 位手机号</div>'; return; }
        var p3 = v.slice(0, 3);
        var p4 = v.slice(0, 4);
        var carrier = '未知';
        if (/^(134|135|136|137|138|139|147|150|151|152|157|158|159|172|178|182|183|184|187|188|195|197|198)/.test(v)) carrier = '中国移动';
        else if (/^(130|131|132|145|155|156|166|167|171|175|176|185|186|196)/.test(v)) carrier = '中国联通';
        else if (/^(133|149|153|173|177|180|181|189|190|191|193|199)/.test(v)) carrier = '中国电信';
        else if (/^192/.test(v)) carrier = '中国广电';
        var color = { '中国移动': '#3BC98A', '中国联通': '#E8A33D', '中国电信': '#4FA3FF', '中国广电': '#A06BF0', '未知': '#8A93A3' }[carrier];
        var hint = carrier === '未知' ? '该号段暂不在内置表内，可能为新号段' : '该号码大概率属于' + carrier + '（携号转网用户可能不符）';
        out.innerHTML = '<div class="stat-grid"><div class="stat-box" style="border-top:3px solid ' + color + '"><div class="k">号码</div><div class="v" style="font-size:15px">' + esc(v) + '</div></div>' +
          '<div class="stat-box" style="border-top:3px solid ' + color + '"><div class="k">运营商</div><div class="v" style="color:' + color + '">' + carrier + '</div></div>' +
          '<div class="stat-box" style="border-top:3px solid ' + color + '"><div class="k">号段</div><div class="v" style="font-size:15px">' + p3 + ' / ' + p4 + '</div></div></div>' +
          '<p class="note">' + hint + '</p>';
      }
      document.getElementById('carBtn').addEventListener('click', check);
      document.getElementById('carIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    }
  });

  /* ================= 通讯：常用号码 ================= */
  T.register({
    id: 'com-sos', cat: 'com', icon: '🚨',
    name: '常用号码', desc: '紧急与公共服务热线速查',
    keywords: '紧急 电话 110 120 热线 服务 号码 报警 急救',
    render: function (host) {
      var rows = [
        ['110', '报警服务台', '紧急'],
        ['119', '火警', '紧急'],
        ['120', '急救中心', '紧急'],
        ['122', '交通事故报警', '紧急'],
        ['12110', '短信报警（听障人士等）', '紧急'],
        ['12345', '政务服务便民热线', '综合'],
        ['12315', '市场监管 / 消费投诉', '维权'],
        ['12306', '铁路客服', '交通'],
        ['12333', '人力资源与社会保障', '社保'],
        ['12367', '移民局服务热线', '出入境'],
        ['12381', '工信部反诈中心', '反诈'],
        ['96110', '反电信网络诈骗专线', '反诈'],
        ['12339', '国家安全机关举报', '安全'],
        ['12320', '卫生健康热线', '健康'],
        ['12117', '报时服务', '便民'],
        ['114', '号码查询', '便民'],
        ['10086', '中国移动客服', '运营商'],
        ['10010', '中国联通客服', '运营商'],
        ['10000', '中国电信客服', '运营商']
      ];
      var h = '<div class="panel"><h3>' + L('紧急与常用热线', 'Hotlines') + '</h3><div class="table-wrap"><table class="kv"><tr><th>号码</th><th>服务</th><th>类型</th></tr>';
      rows.forEach(function (r) {
        h += '<tr><td class="mono" style="font-size:15px"><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + (r[2] === '紧急' ? '<span class="badge net">' + r[2] + '</span>' : r[2]) + '</td></tr>';
      });
      h += '</table></div><p class="note">紧急情况请优先拨打 110 / 119 / 120；短信报警 12110 需在特定地区开通。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 通讯：短信模板 ================= */
  T.register({
    id: 'com-msg', cat: 'com', icon: '💬',
    name: '短信模板', desc: '通知 / 祝福 / 请假等短信模板',
    keywords: '短信 模板 通知 祝福 请假 问候 消息 文案 sms',
    render: function (host) {
      var groups = [
        ['通知提醒', [
          ['会议通知', '【通知】请于【时间】在【地点】参加【会议名称】，请准时出席。'],
          ['活动通知', '【活动】邀请您参加【活动】，时间【日期】，地点【地点】，期待您的到来！'],
          ['物流提醒', '您的包裹【单号】正在派送中，请保持电话畅通。']
        ]],
        ['请假沟通', [
          ['向领导请假', '领导您好，因【原因】需请假【时间】，工作已安排【同事】代管，望批准。'],
          ['向老师请假', '老师您好，我是【班级】【姓名】，因【原因】需请假【时间】，请假条后补，谢谢老师！']
        ]],
        ['祝福问候', [
          ['节日祝福', '【节日】快乐！愿您【祝福语】，期待我们【约定】。'],
          ['生日祝福', '生日快乐！愿新的一岁【愿望】，平安喜乐常相伴！'],
          ['关心问候', '最近还好吗？天气转凉注意保暖，有空一起【活动】呀。']
        ]],
        ['致谢道歉', [
          ['表达感谢', '真的很感谢您的【帮助】，对我意义重大，改天一定当面致谢！'],
          ['表达歉意', '实在抱歉【过失】，是我的疏忽，已【补救】，请原谅！']
        ]]
      ];
      var h = '';
      groups.forEach(function (g) {
        h += '<div class="panel"><h3>' + g[0] + '</h3>';
        g[1].forEach(function (t) {
          h += '<div class="tpl-row"><b>' + t[0] + '</b><pre class="out">' + esc(t[1]) + '</pre>' +
            '<button class="btn btn-ghost copy-btn" data-tpl="' + esc(t[1]) + '">' + L('复制', 'Copy') + '</button></div>';
        });
        h += '</div>';
      });
      host.innerHTML = h;
      host.querySelectorAll('[data-tpl]').forEach(function (b) {
        b.addEventListener('click', function () { T.copyText(b.getAttribute('data-tpl')); });
      });
    }
  });
})();
