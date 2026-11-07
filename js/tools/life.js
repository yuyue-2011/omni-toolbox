/* ============================================================
   万能工具箱 · 生活类工具（5 款）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };

  /* ============ 汇率换算 ============ */
  T.register({
    id: 'forex', icon: '💱', cat: 'life', name: '汇率换算',
    desc: '常用货币互转，联网自动更新，离线可参考',
    keywords: '汇率 forex 货币 exchange 换算',
    render: function (host) {
      var CURR = [
        { code: 'CNY', name: '人民币', sym: '¥' }, { code: 'USD', name: '美元', sym: '$' },
        { code: 'EUR', name: '欧元', sym: '€' }, { code: 'JPY', name: '日元', sym: 'JP¥' },
        { code: 'GBP', name: '英镑', sym: '£' }, { code: 'HKD', name: '港币', sym: 'HK$' },
        { code: 'AUD', name: '澳元', sym: 'A$' }, { code: 'CAD', name: '加元', sym: 'C$' },
        { code: 'KRW', name: '韩元', sym: '₩' }, { code: 'SGD', name: '新加坡元', sym: 'S$' },
        { code: 'THB', name: '泰铢', sym: '฿' }, { code: 'MYR', name: '林吉特', sym: 'RM' },
        { code: 'RUB', name: '卢布', sym: '₽' }, { code: 'INR', name: '卢比', sym: '₹' }
      ];
      /* 离线参考价：1 单位人民币可兑换的数额（仅作断网兜底） */
      var OFFLINE = { CNY: 1, USD: 0.139, EUR: 0.128, JPY: 21.5, GBP: 0.110, HKD: 1.09, AUD: 0.213, CAD: 0.19, KRW: 188, SGD: 0.188, THB: 4.85, MYR: 0.655, RUB: 12.9, INR: 11.7 };
      function opts(sel) {
        return CURR.map(function (c) {
          return '<option value="' + c.code + '"' + (c.code === sel ? ' selected' : '') + '>' + c.code + ' ' + c.name + '</option>';
        }).join('');
      }
      host.innerHTML =
      '<div class="panel"><h3>' + L('汇率换算', 'Currency') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>金额</label><input id="fxAmt" inputmode="decimal" value="100"></div>' +
          '<div class="field grow"><label>从</label><select id="fxFrom">' + opts('CNY') + '</select></div>' +
          '<div class="field grow"><label>到</label><select id="fxTo">' + opts('USD') + '</select></div>' +
        '</div>' +
        '<div class="field"><label>结果</label><div class="out big-out" id="fxOut">-</div></div>' +
        '<div class="out" id="fxList" style="margin-top:6px"><span class="muted">输入金额查看多币种对照</span></div>' +
        '<p class="muted" id="fxMeta">参考汇率 · 联网后自动更新</p>' +
      '</div>';
      var rates = T.store.get('fxRates', null);
      var online = false;
      function rateOf(code) { return rates && rates[code] != null ? rates[code] : OFFLINE[code]; }
      function convert(from, to, amt) { return amt * rateOf(to) / rateOf(from); }
      function render() {
        var amt = parseFloat(document.getElementById('fxAmt').value);
        var from = document.getElementById('fxFrom').value;
        var to = document.getElementById('fxTo').value;
        var out = document.getElementById('fxOut');
        if (isNaN(amt)) { out.textContent = '请输入金额'; return; }
        var v = convert(from, to, amt);
        out.textContent = T.fmtNum(v, 4);
        var h = '';
        CURR.forEach(function (c) {
          if (c.code === from) return;
          h += '<div style="display:flex;justify-content:space-between;padding:7px 2px;border-bottom:1px solid var(--line-soft);font-size:13.5px">' +
            '<span>' + c.code + ' ' + c.name + '</span>' +
            '<span style="font-family:var(--mono)">' + c.sym + ' ' + T.fmtNum(convert(from, c.code, amt), 4) + '</span></div>';
        });
        document.getElementById('fxList').innerHTML = h;
        var meta = document.getElementById('fxMeta');
        var when = T.store.get('fxTime', null);
        if (online) meta.textContent = '汇率来自在线数据' + (when ? '，更新于 ' + new Date(when).toLocaleString() : '');
        else meta.textContent = '当前为离线参考汇率，联网后自动更新（实际汇率以银行报价为准）';
      }
      ['fxAmt', 'fxFrom', 'fxTo'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', render);
      });
      /* 尝试联网更新 */
      function refresh() {
        if (typeof fetch !== 'function' || typeof AbortController !== 'function') return;
        var ac = new AbortController();
        var to = setTimeout(function () { ac.abort(); }, 8000);
        fetch('https://open.er-api.com/v6/latest/CNY', { signal: ac.signal })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            clearTimeout(to);
            if (d && d.result === 'success' && d.rates) {
              rates = d.rates;
              online = true;
              T.store.set('fxRates', rates);
              T.store.set('fxTime', Date.now());
              render();
            }
          })
          .catch(function () { clearTimeout(to); /* 保持离线参考 */ });
      }
      render();
      refresh();
    }
  });

  /* ============ 星座查询 ============ */
  T.register({
    id: 'zodiac', icon: '🔮', cat: 'life', name: '星座查询',
    desc: '出生日期对应星座、元素与守护星',
    keywords: '星座 zodiac 生日 运势 查询',
    render: function (host) {
      var SIGNS = [
        { n: '摩羯座', s: '12.22-01.19', e: '土', p: '土星' }, { n: '水瓶座', s: '01.20-02.18', e: '风', p: '天王星' },
        { n: '双鱼座', s: '02.19-03.20', e: '水', p: '海王星' }, { n: '白羊座', s: '03.21-04.19', e: '火', p: '火星' },
        { n: '金牛座', s: '04.20-05.20', e: '土', p: '金星' }, { n: '双子座', s: '05.21-06.21', e: '风', p: '水星' },
        { n: '巨蟹座', s: '06.22-07.22', e: '水', p: '月亮' }, { n: '狮子座', s: '07.23-08.22', e: '火', p: '太阳' },
        { n: '处女座', s: '08.23-09.22', e: '土', p: '水星' }, { n: '天秤座', s: '09.23-10.23', e: '风', p: '金星' },
        { n: '天蝎座', s: '10.24-11.22', e: '水', p: '冥王星' }, { n: '射手座', s: '11.23-12.21', e: '火', p: '木星' }
      ];
      function findSign(m, d) {
        if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 1;
        if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return 2;
        if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 3;
        if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 4;
        if ((m === 5 && d >= 21) || (m === 6 && d <= 21)) return 5;
        if ((m === 6 && d >= 22) || (m === 7 && d <= 22)) return 6;
        if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 7;
        if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 8;
        if ((m === 9 && d >= 23) || (m === 10 && d <= 23)) return 9;
        if ((m === 10 && d >= 24) || (m === 11 && d <= 22)) return 10;
        if ((m === 11 && d >= 23) || (m === 12 && d <= 21)) return 11;
        return 0; /* 12.22 - 01.19 摩羯 */
      }
      host.innerHTML =
      '<div class="panel"><h3>' + L('星座查询', 'Zodiac') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>出生日期</label><input type="date" id="zoDate"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="zoBtn">' + L('查询', 'Look up') + '</button></div>' +
        '</div>' +
        '<div class="stat-grid" id="zoOut" style="display:none">' +
          '<div class="stat-box"><div class="k">星座</div><div class="v" id="zoSign">-</div></div>' +
          '<div class="stat-box"><div class="k">日期范围</div><div class="v" style="font-size:15px" id="zoRange">-</div></div>' +
          '<div class="stat-box"><div class="k">元素</div><div class="v" id="zoElem">-</div></div>' +
          '<div class="stat-box"><div class="k">守护星</div><div class="v" style="font-size:15px" id="zoPlanet">-</div></div>' +
        '</div>' +
      '</div>';
      document.getElementById('zoBtn').addEventListener('click', function () {
        var v = document.getElementById('zoDate').value;
        if (!v) { T.toast('请选择出生日期'); return; }
        var d = new Date(v + 'T00:00:00');
        var s = SIGNS[findSign(d.getMonth() + 1, d.getDate())];
        document.getElementById('zoOut').style.display = 'grid';
        document.getElementById('zoSign').textContent = s.n;
        document.getElementById('zoRange').textContent = s.s;
        document.getElementById('zoElem').textContent = s.e + '象';
        document.getElementById('zoPlanet').textContent = s.p;
      });
    }
  });

  /* ============ 生肖属相 ============ */
  T.register({
    id: 'shengxiao', icon: '🐉', cat: 'life', name: '生肖属相',
    desc: '年份对应生肖与干支（天干地支）',
    keywords: '生肖 属相 干支 天干地支 年份',
    render: function (host) {
      var ANIMALS = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
      var STEMS = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
      var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      var ELEM = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
      host.innerHTML =
      '<div class="panel"><h3>' + L('生肖属相', 'Chinese Zodiac') + '</h3>' +
        '<div class="row">' +
          '<div class="field grow"><label>年份</label><input id="sxYear" inputmode="numeric" value="1996"></div>' +
          '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="sxBtn">' + L('查询', 'Look up') + '</button></div>' +
        '</div>' +
        '<div class="stat-grid" id="sxOut" style="display:none">' +
          '<div class="stat-box"><div class="k">生肖</div><div class="v" id="sxAnimal">-</div></div>' +
          '<div class="stat-box"><div class="k">干支</div><div class="v" id="sxGz">-</div></div>' +
          '<div class="stat-box"><div class="k">天干五行</div><div class="v" style="font-size:15px" id="sxElem">-</div></div>' +
          '<div class="stat-box"><div class="k">年龄（今年）</div><div class="v" style="font-size:15px" id="sxAge">-</div></div>' +
        '</div>' +
        '<p class="muted">干支按公历年份对应（立春前后略有差异，此处以 1 月 1 日起算）。</p>' +
      '</div>';
      document.getElementById('sxBtn').addEventListener('click', function () {
        var y = parseInt(document.getElementById('sxYear').value, 10);
        if (isNaN(y) || y < 1900 || y > 2100) { T.toast('请输入 1900~2100 之间的年份'); return; }
        var mod = ((y % 12) + 12) % 12;
        var stem = STEMS[((y % 10) + 10) % 10];
        var branch = BRANCHES[mod];
        document.getElementById('sxOut').style.display = 'grid';
        document.getElementById('sxAnimal').textContent = ANIMALS[mod];
        document.getElementById('sxGz').textContent = stem + branch + '年';
        document.getElementById('sxElem').textContent = ELEM[STEMS.indexOf(stem)] + '（' + stem + '）';
        var age = new Date().getFullYear() - y;
        document.getElementById('sxAge').textContent = age >= 0 ? age + ' 岁（虚岁 ' + (age + 1) + '）' : '-';
      });
    }
  });

  /* ============ 身份证解析 ============ */
  T.register({
    id: 'idcard', icon: '🪪', cat: 'life', name: '身份证解析',
    desc: '校验 18 位身份证并解析地区、出生、性别',
    keywords: '身份证 id card 校验 解析 号码',
    render: function (host) {
      var PROV = {
        '11': '北京', '12': '天津', '13': '河北', '14': '山西', '15': '内蒙古',
        '21': '辽宁', '22': '吉林', '23': '黑龙江',
        '31': '上海', '32': '江苏', '33': '浙江', '34': '安徽', '35': '福建', '36': '江西', '37': '山东',
        '41': '河南', '42': '湖北', '43': '湖南', '44': '广东', '45': '广西', '46': '海南',
        '50': '重庆', '51': '四川', '52': '贵州', '53': '云南', '54': '西藏',
        '61': '陕西', '62': '甘肃', '63': '青海', '64': '宁夏', '65': '新疆',
        '71': '台湾', '81': '香港', '82': '澳门'
      };
      var WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      var CHECKS = '10X98765432';
      host.innerHTML =
      '<div class="panel"><h3>' + L('身份证解析', 'ID Card') + '</h3>' +
        '<div class="field"><input id="idIn" placeholder="输入 18 位身份证号码" spellcheck="false" style="font-family:var(--mono)"></div>' +
        '<button class="btn btn-primary" id="idBtn">' + L('解析', 'Parse') + '</button>' +
        '<div class="stat-grid" id="idOut" style="display:none;margin-top:16px">' +
          '<div class="stat-box"><div class="k">校验结果</div><div class="v" style="font-size:15px" id="idValid">-</div></div>' +
          '<div class="stat-box"><div class="k">所属省份</div><div class="v" style="font-size:16px" id="idProv">-</div></div>' +
          '<div class="stat-box"><div class="k">出生日期</div><div class="v" style="font-size:16px" id="idBirth">-</div></div>' +
          '<div class="stat-box"><div class="k">性别</div><div class="v" id="idGender">-</div></div>' +
        '</div>' +
        '<p class="muted">解析与校验全部在本地完成，号码不会上传。仅支持 18 位号码。</p>' +
      '</div>';
      document.getElementById('idBtn').addEventListener('click', function () {
        var s = document.getElementById('idIn').value.trim().toUpperCase();
        var out = document.getElementById('idOut');
        if (!/^\d{17}[\dX]$/.test(s)) {
          T.toast('请输入有效的 18 位身份证号码');
          out.style.display = 'none';
          return;
        }
        var sum = 0;
        for (var i = 0; i < 17; i++) sum += parseInt(s[i], 10) * WEIGHTS[i];
        var check = CHECKS[sum % 11];
        var ok = check === s[17];
        var prov = PROV[s.slice(0, 2)] || '未知';
        var birth = s.slice(6, 10) + '-' + s.slice(10, 12) + '-' + s.slice(12, 14);
        var gender = parseInt(s[16], 10) % 2 ? '男' : '女';
        var age = new Date().getFullYear() - parseInt(s.slice(6, 10), 10);
        out.style.display = 'grid';
        var v = document.getElementById('idValid');
        v.textContent = ok ? '校验通过' : '校验失败';
        v.style.color = ok ? 'var(--ok)' : 'var(--err)';
        document.getElementById('idProv').textContent = prov;
        document.getElementById('idBirth').textContent = birth + '（' + age + ' 岁）';
        document.getElementById('idGender').textContent = gender;
      });
    }
  });

  /* ============ 金额大写 ============ */
  T.register({
    id: 'rmb-upper', icon: '💴', cat: 'life', name: '金额大写',
    desc: '数字金额转人民币大写（财务报销用）',
    keywords: '大写 金额 rmb 人民币 财务 报销',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('金额大写', 'RMB Uppercase') + '</h3>' +
        '<div class="field"><input id="rmbIn" inputmode="decimal" placeholder="例如 12345.67"></div>' +
        '<button class="btn btn-primary" id="rmbBtn">' + L('转换', 'Convert') + '</button>' +
        '<div class="field" style="margin-top:14px"><label>人民币大写</label><div class="out" id="rmbOut" style="font-size:16px;line-height:1.8"><span class="muted">结果将显示在这里</span></div></div>' +
      '</div>';
      var NUM = '零壹贰叁肆伍陆柒捌玖';
      var UNIT = ['', '拾', '佰', '仟'];
      var GROUP = ['', '万', '亿', '兆'];
      function intCn(str) {
        var out = '';
        var len = str.length;
        for (var i = 0; i < len; i++) {
          var d = parseInt(str[i], 10);
          var pos = len - 1 - i;
          if (d === 0) {
            if (out && out.charAt(out.length - 1) !== '零') out += '零';
            continue;
          }
          out += NUM[d] + UNIT[pos % 4];
          if (pos % 4 === 0) out += GROUP[Math.floor(pos / 4)];
        }
        return out.replace(/零+$/, '');
      }
      document.getElementById('rmbBtn').addEventListener('click', function () {
        var v = parseFloat(document.getElementById('rmbIn').value);
        if (isNaN(v) || v < 0) { T.toast('请输入有效金额'); return; }
        if (v > 99999999999999.99) { T.toast('金额过大，超出万亿范围'); return; }
        var neg = v < 0;
        v = Math.abs(v);
        var intPart = Math.floor(v);
        var cents = Math.round((v - intPart) * 100);
        var jiao = Math.floor(cents / 10), fen = cents % 10;
        var intStr = intPart ? intCn(String(intPart)) : '零';
        var out = (neg ? '负' : '') + '人民币' + intStr + '元';
        if (jiao === 0 && fen === 0) out += '整';
        else if (jiao === 0) out += '零' + NUM[fen] + '分';
        else if (fen === 0) out += NUM[jiao] + '角整';
        else out += NUM[jiao] + '角' + NUM[fen] + '分';
        var box = document.getElementById('rmbOut');
        box.textContent = out;
        box.appendChild(T.mkCopyBtn(out));
      });
    }
  });
})();
