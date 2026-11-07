/* ============================================================
   万能工具箱 v2.6 · 通讯类补充工具（3 款：通讯录 / 消息模板 / 号码归属地）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 通讯录管理 ============ */
  T.register({
    id: 'contacts', icon: '📇', cat: 'com', name: '通讯录', net: false,
    desc: '本地通讯录：联系人管理、搜索、一键拨号',
    keywords: '通讯录 联系人 电话 号码 通讯 管理 名片 contacts',
    render: function (host) {
      var KEY = 'contacts';
      var GROUPS = [L('家人', 'Family'), L('朋友', 'Friends'), L('同事', 'Colleagues'), L('同学', 'Classmates'), L('其他', 'Other')];
      function load() { return T.store.get(KEY, []); }
      function save(l) { T.store.set(KEY, l); }
      function render(q) {
        q = (q || '').trim().toLowerCase();
        var list = load().filter(function (c) {
          return !q || (c.name + ' ' + c.phone + ' ' + (c.group || '') + ' ' + (c.note || '')).toLowerCase().indexOf(q) >= 0;
        });
        var h = '<div class="row">' +
          '<div class="field grow"><label>' + L('搜索', 'Search') + '</label><input id="ctSearch" placeholder="' + L('姓名 / 号码 / 分组', 'Name / number / group') + '" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="ctAdd">+ ' + L('新建联系人', 'New contact') + '</button></div>' +
          '</div><div id="ctForm"></div><div id="ctList" style="margin-top:10px"></div>';
        host.innerHTML = h;
        document.getElementById('ctAdd').addEventListener('click', function () {
          document.getElementById('ctForm').innerHTML =
          '<div class="panel"><h3>' + L('新建联系人', 'New contact') + '</h3><div class="row">' +
            '<div class="field"><label>' + L('姓名 *', 'Name *') + '</label><input id="cfName" placeholder="' + L('张三', 'e.g. Zhang San') + '" spellcheck="false"></div>' +
            '<div class="field"><label>' + L('手机号', 'Phone') + '</label><input id="cfPhone" placeholder="138****1234" spellcheck="false"></div>' +
          '</div><div class="row">' +
            '<div class="field"><label>' + L('分组', 'Group') + '</label><select id="cfGroup">' + GROUPS.map(function (g) { return '<option>' + g + '</option>'; }).join('') + '</select></div>' +
            '<div class="field grow"><label>' + L('备注', 'Note') + '</label><input id="cfNote" placeholder="' + L('选填', 'Optional') + '" spellcheck="false"></div>' +
          '</div><div class="row"><button class="btn btn-primary" id="cfSave">' + L('保存', 'Save') + '</button><button class="btn btn-ghost" id="cfCancel">' + L('取消', 'Cancel') + '</button></div></div>';
          document.getElementById('cfSave').addEventListener('click', function () {
            var n = document.getElementById('cfName').value.trim();
            if (!n) { T.toast(L('请输入姓名', 'Please enter a name')); return; }
            var l = load();
            l.push({ name: n, phone: document.getElementById('cfPhone').value.trim(), group: document.getElementById('cfGroup').value, note: document.getElementById('cfNote').value.trim(), ts: Date.now() });
            save(l);
            document.getElementById('ctForm').innerHTML = '';
            render(document.getElementById('ctSearch').value);
          });
          document.getElementById('cfCancel').addEventListener('click', function () { document.getElementById('ctForm').innerHTML = ''; });
        });
        var listEl = document.getElementById('ctList');
        if (!list.length) {
          listEl.innerHTML = '<div class="empty"><b>' + L('暂无联系人', 'No contacts yet') + '</b>' + L('点击“新建联系人”添加', 'Click “New contact” to add') + '</div>';
        } else {
          var h2 = '<div class="list-group">';
          list.forEach(function (c, i) {
            h2 += '<div class="list-item">' +
              '<span class="avatar" style="background:' + (['#5B8DEF', '#3BC98A', '#E884A8', '#F2A33B', '#A06BF0'][GROUPS.indexOf(c.group) >= 0 ? GROUPS.indexOf(c.group) : 4]) + '">' + T.esc((c.name || '?').slice(0, 1)) + '</span>' +
              '<div class="grow"><b>' + T.esc(c.name) + '</b><span class="muted">' + T.esc(c.phone || L('无号码', 'No number')) + (c.group ? ' · ' + T.esc(c.group) : '') + (c.note ? ' · ' + T.esc(c.note) : '') + '</span></div>' +
              (c.phone ? '<a class="btn btn-ghost" href="tel:' + encodeURIComponent(c.phone) + '">📞</a>' : '') +
              '<button class="icon-btn sm" data-del="' + i + '" title="' + L('删除', 'Delete') + '">✕</button></div>';
          });
          h2 += '</div>';
          h2 += '<div class="row" style="margin-top:10px"><button class="btn btn-ghost" id="ctExport">' + L('导出 JSON', 'Export JSON') + '</button><button class="btn btn-ghost" id="ctImport">' + L('导入 JSON', 'Import JSON') + '</button><input type="file" id="ctFile" accept=".json,application/json" hidden></div>';
          listEl.innerHTML = h2;
          listEl.querySelectorAll('[data-del]').forEach(function (b) {
            b.addEventListener('click', function () {
              var l = load();
              l.splice(Number(b.getAttribute('data-del')), 1);
              save(l);
              render(document.getElementById('ctSearch').value);
            });
          });
          document.getElementById('ctExport').addEventListener('click', function () {
            T.blobDownload(new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' }), L('通讯录备份.json', 'contacts-backup.json'));
          });
          document.getElementById('ctImport').addEventListener('click', function () { document.getElementById('ctFile').click(); });
          document.getElementById('ctFile').addEventListener('change', function (e) {
            var f = e.target.files[0];
            if (!f) return;
            var r = new FileReader();
            r.onload = function () {
              try {
                var arr = JSON.parse(r.result);
                if (!Array.isArray(arr)) throw new Error('format');
                save(load().concat(arr.filter(function (x) { return x && x.name; })));
                T.toast(L('导入成功 ', 'Imported ') + arr.length + (isEn() ? ' entries' : ' 条'));
                render(document.getElementById('ctSearch').value);
              } catch (err) { T.toast(L('文件解析失败', 'Failed to parse file')); }
            };
            r.readAsText(f);
          });
        }
        document.getElementById('ctSearch').addEventListener('input', function () {
          render(document.getElementById('ctSearch').value);
        });
      }
      render('');
    }
  });

  /* ============ 消息模板 ============ */
  T.register({
    id: 'sms-templates', icon: '📨', cat: 'com', name: '消息模板', net: false,
    desc: '短信/微信/邮件常用话术模板，一键复制',
    keywords: '短信 微信 模板 话术 祝福 通知 邮件 消息 通讯 templates',
    render: function (host) {
      var groups = [
        [L('问候祝福', 'Greetings'), [
          '新年快乐！愿新的一年万事顺意、身体健康、阖家幸福！🎉',
          '生日快乐！祝你新的一岁心想事成，天天开心！🎂',
          '周末愉快！忙碌了一周，好好休息一下~',
          '中秋快乐，阖家团圆，月圆人更圆！🌕'
        ]],
        [L('工作通知', 'Work Notice'), [
          '【通知】请各位同事于明天上午 10:00 到会议室参加项目周会，请提前准备上周进展与本周计划。',
          '【提醒】今天下午 3 点有客户拜访，请提前整理好会议室与资料。',
          '【通知】公司将于本周五 18:00 进行系统维护，预计 2 小时，期间请勿提交重要数据。',
          '【会议纪要】本次会议达成三点结论：1. …；2. …；3. …。如有异议请今天内回复。'
        ]],
        [L('商务沟通', 'Business'), [
          '您好，我是XX公司的XXX。冒昧打扰，想就【合作方向】与贵方沟通一下，不知您方便时可否约个时间详谈？',
          '关于上周提到的报价方案，我们已按您的要求调整完毕，附件是更新版，请查收。',
          '感谢贵方的信任！合同已收到，我们审阅后会尽快回复，预计 X 个工作日内给到意见。',
          '抱歉打扰！想确认一下发票是否已寄出？如已寄出请告知单号，谢谢！'
        ]],
        [L('生活场景', 'Daily'), [
          '不好意思，路上堵车了，预计晚到 15 分钟，你们先点菜不用等我~',
          '东西我收到了，质量很好，谢谢推荐！',
          '今天临时有事，明晚的聚餐我能改到周三吗？',
          '快递到了，我放在门口鞋柜上，记得取一下。'
        ]],
        [L('关怀客套', 'Care'), [
          '最近降温明显，记得添衣保暖，别感冒了~',
          '看到你朋友圈说感冒了，多喝热水好好休息，早日康复！',
          '听说你最近项目很忙，注意劳逸结合，别太拼了。'
        ]]
      ];
      var h = '';
      groups.forEach(function (g, gi) {
        h += '<div class="panel"><h3>' + g[0] + '</h3><div class="list-group">';
        g[1].forEach(function (tpl, ti) {
          h += '<div class="list-item"><div class="grow">' + T.esc(tpl) + '</div><button class="btn btn-ghost" data-copy="' + gi + '-' + ti + '">' + L('复制', 'Copy') + '</button></div>';
        });
        h += '</div></div>';
      });
      host.innerHTML = h;
      host.querySelectorAll('[data-copy]').forEach(function (b) {
        b.addEventListener('click', function () {
          var p = b.getAttribute('data-copy').split('-');
          T.copyText(groups[Number(p[0])][1][Number(p[1])]);
        });
      });
    }
  });

  /* ============ 号码归属地查询（联网） ============ */
  T.register({
    id: 'phone-lookup', icon: '📍', cat: 'com', name: '号码归属地', net: true,
    netNote: '通过公开接口查询手机号归属地与运营商，接口限流时提示稍后再试。',
    desc: '查询手机号归属地、运营商与号段信息',
    keywords: '手机号 归属地 查询 运营商 号段 通讯 lookup',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('手机号归属地查询', 'Phone Lookup') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>' + L('手机号', 'Phone') + '</label><input id="plInput" placeholder="' + L('11 位手机号', '11-digit phone') + '" maxlength="11" inputmode="numeric" spellcheck="false"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="plBtn">' + L('查询', 'Look up') + '</button></div>' +
        '</div>' +
        '<div id="plOut" style="margin-top:10px"></div>' +
        '<p class="note">' + L('自动校验号段合法性；归属地数据来自公开接口，仅供参考，运营商携号转网后可能有偏差。', 'Validates prefixes; data from public APIs for reference only, may drift after number portability.') + '</p>' +
      '</div>';
      document.getElementById('plBtn').addEventListener('click', go);
      document.getElementById('plInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
      function go() {
        var phone = (document.getElementById('plInput').value || '').trim();
        var out = document.getElementById('plOut');
        if (!/^1[3-9]\d{9}$/.test(phone)) { T.toast(L('请输入正确的 11 位手机号', 'Enter a valid 11-digit phone')); return; }
        out.innerHTML = '<div class="msg">' + L('查询中…', 'Fetching…') + '</div>';
        T.getJSON('https://tenapi.cn/v2/phonelocation?phone=' + phone, 9000).then(function (d) {
          var out2 = document.getElementById('plOut');
          if (!out2) return;
          if (d && d.code === 200 && d.data) {
            var dd = d.data;
            out2.innerHTML = '<div class="stat-grid">' +
              '<div class="stat-box"><div class="k">' + L('归属地', 'Location') + '</div><div class="v" style="font-size:15px">' + T.esc(dd.province || dd.location || '-') + '</div></div>' +
              '<div class="stat-box"><div class="k">' + L('运营商', 'Carrier') + '</div><div class="v" style="font-size:15px">' + T.esc(dd.sp || dd.carrier || '-') + '</div></div>' +
              '<div class="stat-box"><div class="k">' + L('号段', 'Prefix') + '</div><div class="v" style="font-size:15px">' + T.esc(phone.slice(0, 3)) + '****' + T.esc(phone.slice(-4)) + '</div></div>' +
              '</div>';
          } else {
            out2.innerHTML = '<div class="msg err">' + T.esc((d && d.msg) || L('查询失败，请稍后再试', 'Lookup failed, try later')) + '</div>';
          }
        }, function (e) {
          var out3 = document.getElementById('plOut');
          if (!out3) return;
          out3.innerHTML = '<div class="msg err">' + L('查询失败：', 'Lookup failed: ') + T.esc((e && e.message) || L('网络不可达', 'Network unreachable')) + '</div>';
        });
      }
    }
  });
})();
