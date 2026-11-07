/* ============================================================
   万能工具箱 v2.9 · 计算类增强（5 款）
   个税 / 社保公积金 / 车贷 / 利润率 / 折扣
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  var esc = T.esc;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  function $(id) { return document.getElementById(id); }
  function out(id, html) { var el = $(id); if (el) el.innerHTML = html; }
  function num(id) { return parseFloat($(id).value); }
  function money(n) {
    if (isNaN(n)) return '--';
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /* ============ 个人所得税 ============ */
  T.register({
    id: 'calc-tax', cat: 'calc', icon: '🧾',
    name: '个人所得税',
    desc: '综合所得年度个税（新税率表）',
    keywords: '个税 所得税 个人所得税 计算 税率',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('个人所得税计算器', 'Income Tax Calculator') + '</h3>' +
        '<div class="row">' +
        '<div class="field"><label>' + L('税前年薪', 'Annual salary') + '</label><input id="txGross" type="number" placeholder="120000"></div>' +
        '<div class="field"><label>' + L('起征点', 'Threshold') + '</label><input id="txBase" type="number" value="60000"></div>' +
        '<div class="field"><label>' + L('专项扣除', 'Special deductions') + '</label><input id="txSpec" type="number" placeholder="0" value="0"></div></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="txBtn">' + L('计算', 'Calculate') + '</button></div></div>' +
        '<div id="txOut"></div>' +
      '</div>';
      /* 综合所得年度税率表（2024 速算扣除） */
      var BRACKETS = [
        [0, 36000, 0.03, 0],
        [36000, 144000, 0.1, 2520],
        [144000, 300000, 0.2, 16920],
        [300000, 420000, 0.25, 31920],
        [420000, 660000, 0.3, 52920],
        [660000, 960000, 0.35, 85920],
        [960000, Infinity, 0.45, 181920]
      ];
      $('txBtn').addEventListener('click', function () {
        var gross = num('txGross'), base = num('txBase'), spec = num('txSpec');
        if (isNaN(gross) || isNaN(base)) { out('txOut', '<div class="empty"><b>' + L('请输入金额', 'Please enter amounts') + '</b></div>'); return; }
        var taxable = Math.max(0, gross - base - (isNaN(spec) ? 0 : spec));
        var tax = 0, rate = 0, deduct = 0;
        for (var i = 0; i < BRACKETS.length; i++) {
          if (taxable <= BRACKETS[i][1]) { rate = BRACKETS[i][2]; deduct = BRACKETS[i][3]; break; }
        }
        tax = taxable * rate - deduct;
        if (tax < 0) tax = 0;
        var net = gross - tax;
        out('txOut',
          '<div class="stat-grid">' +
            '<div class="stat-box"><span class="stat-num">' + money(taxable) + '</span><span class="stat-label">' + L('应纳税所得额', 'Taxable income') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + money(tax) + '</span><span class="stat-label">' + L('应缴个税', 'Tax payable') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + money(net) + '</span><span class="stat-label">' + L('税后年收入', 'Net annual income') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + (rate * 100) + '%</span><span class="stat-label">' + L('适用税率', 'Tax rate') + '</span></div>' +
          '</div>' +
          '<p class="note" style="margin-top:10px">' + L('按综合所得年度税率表计算，速算扣除数一次性扣除；不含年终奖优惠计税与经营所得。', 'Annual comprehensive-income table; excludes year-end bonus and business income.') + '</p>'
        );
      });
    }
  });

  /* ============ 社保与公积金 ============ */
  T.register({
    id: 'calc-social', cat: 'calc', icon: '🛡️',
    name: '社保公积金',
    desc: '五险一金个人 / 单位缴纳明细',
    keywords: '社保 公积金 五险一金 计算 缴纳',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('社保与公积金计算器', 'Social Insurance Calculator') + '</h3>' +
        '<div class="row">' +
        '<div class="field"><label>' + L('税前月薪', 'Monthly salary') + '</label><input id="scBase" type="number" placeholder="10000"></div>' +
        '<div class="field"><label>' + L('公积金比例', 'Housing fund %') + '</label><input id="scHf" type="number" value="12"></div></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="scBtn">' + L('计算', 'Calculate') + '</button></div></div>' +
        '<div id="scOut"></div>' +
      '</div>';
      /* 默认比例（个人/单位），可按地区调整 */
      var RATES = [
        ['养老', 0.08, 0.16],
        ['医疗', 0.02, 0.09],
        ['失业', 0.005, 0.005],
        ['工伤', 0, 0.0026],
        ['生育', 0, 0.008],
        ['公积金', null, null]
      ];
      $('scBtn').addEventListener('click', function () {
        var base = num('scBase'), hfPct = num('scHf');
        if (isNaN(base)) { out('scOut', '<div class="empty"><b>' + L('请输入月薪', 'Please enter salary') + '</b></div>'); return; }
        if (isNaN(hfPct) || hfPct < 0) hfPct = 12;
        hfPct = hfPct / 100;
        var rows = '', sumP = 0, sumC = 0;
        RATES.forEach(function (r) {
          var p = r[1], c = r[2];
          if (r[0] === '公积金') { p = hfPct; c = hfPct; }
          var pv = base * p, cv = base * c;
          sumP += pv; sumC += cv;
          rows += '<tr><td>' + L(r[0], r[0]) + '</td><td>' + money(pv) + '</td><td>' + money(cv) + '</td></tr>';
        });
        out('scOut',
          '<table class="tbl" style="margin-top:12px"><thead><tr><th>' + L('险种', 'Item') + '</th><th>' + L('个人', 'Personal') + '</th><th>' + L('单位', 'Company') + '</th></tr></thead>' +
          '<tbody>' + rows +
          '<tr style="font-weight:600"><td>' + L('合计', 'Total') + '</td><td>' + money(sumP) + '</td><td>' + money(sumC) + '</td></tr></tbody></table>' +
          '<p class="note" style="margin-top:10px">' + L('比例为常见默认值，实际以参保地政策为准；工伤与生育个人不缴费。', 'Default rates for reference only; work injury and maternity are paid by the company only.') + '</p>'
        );
      });
    }
  });

  /* ============ 车贷计算 ============ */
  T.register({
    id: 'calc-car', cat: 'calc', icon: '🚗',
    name: '车贷计算',
    desc: '等额本息 / 等额本金月供明细',
    keywords: '车贷 贷款 月供 计算 等额本息 等额本金',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('车贷计算器', 'Car Loan Calculator') + '</h3>' +
        '<div class="row">' +
        '<div class="field"><label>' + L('贷款金额', 'Loan amount') + '</label><input id="ccAmt" type="number" placeholder="100000"></div>' +
        '<div class="field"><label>' + L('年利率 %', 'Annual rate %') + '</label><input id="ccRate" type="number" placeholder="4.8"></div>' +
        '<div class="field"><label>' + L('期数（月）', 'Terms (months)') + '</label><input id="ccN" type="number" placeholder="36"></div></div>' +
        '<div class="row">' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-primary" id="ccEq">' + L('等额本息', 'Equal payment') + '</button></div>' +
        '<div class="field"><label>&nbsp;</label><button class="btn btn-ghost" id="ccDec">' + L('等额本金', 'Decreasing') + '</button></div></div>' +
        '<div id="ccOut"></div>' +
      '</div>';
      function header(title, monthly, total, interest) {
        return '<h4 style="margin:14px 0 8px">' + title + '</h4>' +
          '<div class="stat-grid">' +
          '<div class="stat-box"><span class="stat-num">' + money(monthly) + '</span><span class="stat-label">' + L('首月/每月', 'Monthly') + '</span></div>' +
          '<div class="stat-box"><span class="stat-num">' + money(total) + '</span><span class="stat-label">' + L('还款总额', 'Total payment') + '</span></div>' +
          '<div class="stat-box"><span class="stat-num">' + money(interest) + '</span><span class="stat-label">' + L('总利息', 'Total interest') + '</span></div></div>';
      }
      function rowsHtml(rows) {
        return '<table class="tbl" style="margin-top:12px"><thead><tr><th>#</th><th>' + L('本金', 'Principal') + '</th><th>' + L('利息', 'Interest') + '</th><th>' + L('月供', 'Payment') + '</th></tr></thead><tbody>' +
          rows.map(function (r, i) {
            return '<tr><td>' + (i + 1) + '</td><td>' + money(r[0]) + '</td><td>' + money(r[1]) + '</div></td><td>' + money(r[2]) + '</td></tr>';
          }).join('') + '</tbody></table>';
      }
      $('ccEq').addEventListener('click', function () {
        var A = num('ccAmt'), R = num('ccRate'), N = num('ccN');
        if (isNaN(A) || isNaN(R) || isNaN(N) || A <= 0 || N <= 0) { out('ccOut', '<div class="empty"><b>' + L('请输入完整参数', 'Enter all values') + '</b></div>'); return; }
        var r = R / 100 / 12;
        var m = A * r * Math.pow(1 + r, N) / (Math.pow(1 + r, N) - 1);
        var rows = [], bal = A, total = 0;
        for (var i = 0; i < N; i++) {
          var it = bal * r, pr = m - it;
          rows.push([pr, it, m]);
          bal -= pr; total += m;
        }
        out('ccOut', header(L('等额本息', 'Equal payment'), m, total, total - A) + rowsHtml(rows));
      });
      $('ccDec').addEventListener('click', function () {
        var A = num('ccAmt'), R = num('ccRate'), N = num('ccN');
        if (isNaN(A) || isNaN(R) || isNaN(N) || A <= 0 || N <= 0) { out('ccOut', '<div class="empty"><b>' + L('请输入完整参数', 'Enter all values') + '</b></div>'); return; }
        var r = R / 100 / 12;
        var pr = A / N;
        var rows = [], total = 0, m0 = 0;
        for (var i = 0; i < N; i++) {
          var it = (A - pr * i) * r;
          var pay = pr + it;
          rows.push([pr, it, pay]);
          total += pay;
          if (i === 0) m0 = pay;
        }
        out('ccOut', header(L('等额本金', 'Decreasing'), m0, total, total - A) + rowsHtml(rows));
      });
    }
  });

  /* ============ 利润率计算 ============ */
  T.register({
    id: 'calc-profit', cat: 'calc', icon: '📈',
    name: '利润率计算',
    desc: '成本 / 售价 / 毛利率 / 加价率互算',
    'keywords': '利润 毛利 利润率 成本 售价 加价',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('利润率计算器', 'Profit Margin Calculator') + '</h3>' +
        '<div class="row">' +
        '<div class="field"><label>' + L('成本', 'Cost') + '</label><input id="pfCost" type="number" placeholder="80"></div>' +
        '<div class="field"><label>' + L('售价', 'Price') + '</label><input id="pfPrice" type="number" placeholder="100"></div></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="pfBtn">' + L('计算', 'Calculate') + '</button></div></div>' +
        '<div id="pfOut"></div>' +
      '</div>';
      $('pfBtn').addEventListener('click', function () {
        var cost = num('pfCost'), price = num('pfPrice');
        if (isNaN(cost) || isNaN(price) || cost <= 0 || price <= 0) { out('pfOut', '<div class="empty"><b>' + L('请输入成本与售价', 'Enter cost and price') + '</b></div>'); return; }
        var profit = price - cost;
        var margin = profit / price * 100;
        var markup = profit / cost * 100;
        out('pfOut',
          '<div class="stat-grid">' +
            '<div class="stat-box"><span class="stat-num">' + money(profit) + '</span><span class="stat-label">' + L('利润', 'Profit') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + margin.toFixed(2) + '%</span><span class="stat-label">' + L('毛利率', 'Gross margin') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + markup.toFixed(2) + '%</span><span class="stat-label">' + L('成本加价率', 'Markup') + '</span></div>' +
          '</div>' +
          '<p class="note" style="margin-top:10px">' + L('毛利率 = 利润 ÷ 售价；加价率 = 利润 ÷ 成本。', 'Margin = profit / price; markup = profit / cost.') + '</p>'
        );
      });
    }
  });

  /* ============ 折扣计算 ============ */
  T.register({
    id: 'calc-discount', cat: 'calc', icon: '🏷️',
    name: '折扣计算',
    desc: '原价 / 折扣 / 实付 / 省了多少',
    keywords: '折扣 打折 计算 原价 实付 优惠',
    render: function (host) {
      host.innerHTML =
      '<div class="panel"><h3>' + L('折扣计算器', 'Discount Calculator') + '</h3>' +
        '<div class="row">' +
        '<div class="field"><label>' + L('原价', 'Original price') + '</label><input id="dcP" type="number" placeholder="199"></div>' +
        '<div class="field"><label>' + L('折扣（如 8 = 8 折）', 'Discount (8 = 20% off)') + '</label><input id="dcD" type="number" placeholder="8"></div></div>' +
        '<div class="row"><div class="field grow"><label>&nbsp;</label><button class="btn btn-primary" id="dcBtn">' + L('计算', 'Calculate') + '</button></div></div>' +
        '<div id="dcOut"></div>' +
      '</div>';
      $('dcBtn').addEventListener('click', function () {
        var p = num('dcP'), d = num('dcD');
        if (isNaN(p) || isNaN(d) || p <= 0) { out('dcOut', '<div class="empty"><b>' + L('请输入原价与折扣', 'Enter price and discount') + '</b></div>'); return; }
        var rate = d / 10;
        if (rate < 0) rate = 0;
        if (rate > 1) rate = rate / 100;
        var pay = p * rate, save = p - pay;
        out('dcOut',
          '<div class="stat-grid">' +
            '<div class="stat-box"><span class="stat-num">' + money(pay) + '</span><span class="stat-label">' + L('实付金额', 'You pay') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + money(save) + '</span><span class="stat-label">' + L('节省金额', 'You save') + '</span></div>' +
            '<div class="stat-box"><span class="stat-num">' + Math.round((1 - rate) * 100) + '%</span><span class="stat-label">' + L('优惠幅度', 'Off') + '</span></div>' +
          '</div>'
        );
      });
    }
  });
})();
