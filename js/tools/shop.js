/* ============================================================
   万能工具箱 v2.1 · 购物板块（6 款）
   尺码换算 / 快递速查 / 防骗指南 / 退换攻略 / 省钱技巧 / 购物清单
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  var esc = T.esc;

  /* ================= 购物：尺码换算 ================= */
  T.register({
    id: 'shop-size', cat: 'shop', icon: '👕',
    name: '尺码换算', desc: '服装鞋帽中欧美尺码对照换算',
    keywords: '尺码 衣服 鞋子 换算 对照 码数 网购 大小 size',
    render: function (host) {
      var women = [
        ['XS', '150-155', '32', '34', '2-4'],
        ['S', '155-160', '34-36', '36-38', '6'],
        ['M', '160-165', '38', '40', '8-10'],
        ['L', '165-170', '40', '42', '12'],
        ['XL', '170-175', '42', '44', '14'],
        ['XXL', '175-180', '44', '46', '16']
      ];
      var men = [
        ['S', '165', '165', '44-46'],
        ['M', '170', '170', '48'],
        ['L', '175', '175', '50-52'],
        ['XL', '180', '180', '54'],
        ['XXL', '185', '185', '56-58'],
        ['XXXL', '190', '190', '60']
      ];
      var shoes = [
        ['36', '3.5', '5', '22.5'],
        ['37', '4', '5.5', '23'],
        ['38', '5', '6', '23.5'],
        ['39', '5.5', '7', '24'],
        ['40', '6', '7.5', '24.5'],
        ['41', '7', '8', '25'],
        ['42', '7.5', '8.5', '25.5'],
        ['43', '8.5', '9.5', '26.5'],
        ['44', '9.5', '10.5', '27'],
        ['45', '10', '11', '27.5']
      ];
      var h = '<div class="panel"><h3>' + L('女装尺码对照', 'Women Sizes') + '</h3><div class="table-wrap"><table class="kv"><tr><th>中国</th><th>身高(cm)</th><th>欧码 EU</th><th>美码 US</th><th>英码 UK</th></tr>';
      women.forEach(function (r) { h += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>'; });
      h += '</table></div><p class="note">不同品牌版型差异较大，建议参考详情页尺码表。</p></div>';
      h += '<div class="panel"><h3>' + L('男装尺码对照', 'Men Sizes') + '</h3><div class="table-wrap"><table class="kv"><tr><th>中国</th><th>身高(cm)</th><th>欧码</th><th>美码</th></tr>';
      men.forEach(function (r) { h += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; });
      h += '</table></div></div>';
      h += '<div class="panel"><h3>' + L('鞋子尺码对照（女）', 'Shoe Sizes (W)') + '</h3><div class="table-wrap"><table class="kv"><tr><th>中国(欧码)</th><th>美码 US</th><th>英码 UK</th><th>脚长(cm)</th></tr>';
      shoes.forEach(function (r) { h += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; });
      h += '</table></div><p class="note">男鞋码数普遍比女鞋大 1-1.5 码；运动鞋建议按脚长选购。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 购物：快递速查 ================= */
  T.register({
    id: 'shop-express', cat: 'shop', icon: '📦',
    name: '快递速查', desc: '主流快递单号特征与客服电话',
    keywords: '快递 物流 单号 顺丰 中通 圆通 韵达 查询 速查 express',
    render: function (host) {
      var rows = [
        ['顺丰速运', 'SF 开头 + 12-13 位数字', '95338', 'sf-express.com', '高端/急件'],
        ['邮政 EMS', '数字（13 位）或以 E 开头', '11183', 'ems.com.cn', '政企/全国覆盖'],
        ['中通快递', '数字（12-15 位）', '95311', 'zto.com', '电商件'],
        ['圆通速递', '数字（12 位）或 YT 开头', '95554', 'yto.net.cn', '电商件'],
        ['申通快递', '数字（12-15 位）', '95543', 'sto.cn', '电商件'],
        ['韵达快递', '数字（12-13 位）', '95546', 'yundaex.com', '电商件'],
        ['极兔速递', 'JT 开头 + 数字', '956025', 'jtexpress.cn', '电商件/低价'],
        ['京东物流', 'JD 开头 + 数字', '950616', 'jd-ex.com', '京东自营'],
        ['德邦快递', '数字（10-12 位）', '95353', 'deppon.com', '大件物流'],
        ['菜鸟裹裹', '通用查询入口', '—', 'cainiao.com', '聚合查件']
      ];
      var h = '<div class="panel"><h3>' + L('主流快递速查', 'Couriers') + '</h3><div class="table-wrap"><table class="kv"><tr><th>快递</th><th>单号特征</th><th>客服</th><th>官网</th><th>特点</th></tr>';
      rows.forEach(function (r) {
        h += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td class="mono">' + r[2] + '</td><td><a href="https://' + r[3] + '" target="_blank" rel="noopener" style="color:var(--accent)">' + r[3] + '</a></td><td>' + r[4] + '</td></tr>';
      });
      h += '</table></div><p class="note">单号规则仅供参考，实际以快递公司为准；查件可用菜鸟裹裹等聚合平台。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 购物：防骗指南 ================= */
  T.register({
    id: 'shop-safe', cat: 'shop', icon: '🛡️',
    name: '防骗指南', desc: '常见网购骗局识别与应对清单',
    keywords: '防骗 诈骗 网购 安全 识别 骗局 维权 上当 刷单',
    render: function (host) {
      var rows = [
        ['假冒客服退款', '“商品有质量问题要退款/理赔”并要求转账、开启屏幕共享', '一律拒绝，通过官方 App 内客服核实'],
        ['刷单兼职', '“动动手指日入几百”，先给小额返利再诱导大额垫付', '刷单本身违法，垫付必被骗'],
        ['钓鱼链接/二维码', '短信或私聊发“订单异常”链接，仿冒登录页盗账号', '只在官方 App 操作，不点不明链接'],
        ['代购/私下交易', '以“走平台有手续费”为由诱导微信/QQ 转账', '坚持平台内交易，拒绝私下转账'],
        ['二手钓鱼', '闲鱼等平台低价“手机”，要求先款后货或货到付款', '平台担保交易，当面验货，不先款'],
        ['虚假发货', '商家迟迟不更新物流，或发空包到错误地址', '超时未揽收可投诉，物流异常及时申请退款'],
        ['好评返现骗局', '好评返现是诱导，可能后续以“操作失误”骗押金', '直接举报，不参与'],
        ['“中奖”诈骗', '“恭喜您中奖，需先交税费/保证金”', '中奖不需要先交钱，直接拉黑举报']
      ];
      var h = '<div class="panel"><h3>' + L('常见网购骗局', 'Shopping Scams') + '</h3><div class="table-wrap"><table class="kv"><tr><th>骗局</th><th>特征</th><th>应对</th></tr>';
      rows.forEach(function (r) { h += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; });
      h += '</table></div><p class="note">牢记：任何要求先转账、开启屏幕共享、私下交易的都高度可疑。发现被骗立即拨打 110 或 96110 反诈专线。</p></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 购物：退换攻略 ================= */
  T.register({
    id: 'shop-return', cat: 'shop', icon: '🔄',
    name: '退换攻略', desc: '七天无理由退货流程与沟通话术',
    keywords: '退货 换货 退款 七天无理由 维权 话术 客服 攻略',
    render: function (host) {
      var tips = [
        ['七天无理由', '多数平台支持签收后 7 天内无理由退货（定制/生鲜/贴身衣物等除外），运费规则以平台为准'],
        ['质量问题退货', '质量问题（破损/错发/功能故障）由卖家承担运费，保留开箱视频与照片证据'],
        ['退货流程', '订单页申请 → 卖家同意 → 寄回（保留快递单号）→ 卖家签收 → 退款到账'],
        ['超时未处理', '卖家超过平台时限未处理，可申请平台介入'],
        ['大件退换', '大件商品质量问题退换，卖家应承担上门取件或运费'],
        ['维权渠道', '平台官方客服 → 12315 平台（全国12315 网站/App）→ 12345 热线'],
        ['沟通要点', '话术冷静、证据清晰（截图+订单号）、明确诉求（退款/换货/补偿）']
      ];
      var scripts = [
        ['质量问题沟通', '您好，我在贵店购买的【商品】（订单号【】）收到后发现【问题描述】，附上照片/视频。该问题属于质量问题，请按平台规则安排退换并承担运费，谢谢。'],
        ['催退款', '您好，退货已被签收【X】天，目前仍未收到退款，麻烦尽快处理，谢谢。'],
        ['投诉商家', '客服您好，商家【问题描述】且多次沟通无果，请平台介入处理并按规定赔付运费/违约金。']
      ];
      var h = '<div class="panel"><h3>' + L('退换货要点', 'Returns Tips') + '</h3><div class="table-wrap"><table class="kv"><tr><th>情形</th><th>说明</th></tr>';
      tips.forEach(function (r) { h += '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>'; });
      h += '</table></div></div>';
      h += '<div class="panel"><h3>' + L('沟通话术模板', 'Chat Templates') + '</h3>';
      scripts.forEach(function (s) {
        h += '<div class="tpl-row"><b>' + s[0] + '</b><pre class="out">' + esc(s[1]) + '</pre>' +
          '<button class="btn btn-ghost copy-btn" data-tpl="' + esc(s[1]) + '">' + L('复制', 'Copy') + '</button></div>';
      });
      h += '</div>';
      host.innerHTML = h;
      host.querySelectorAll('[data-tpl]').forEach(function (b) {
        b.addEventListener('click', function () { T.copyText(b.getAttribute('data-tpl')); });
      });
    }
  });

  /* ================= 购物：省钱技巧 ================= */
  T.register({
    id: 'shop-coupon', cat: 'shop', icon: '💰',
    name: '省钱技巧', desc: '大促节点与比价返利平台导航',
    keywords: '省钱 优惠 大促 双11 618 比价 返利 技巧 攻略 coupon',
    render: function (host) {
      var sales = [
        ['1月', '年货节', '囤年货、家电'],
        ['3月', '38 焕新周', '美妆、家居'],
        ['4-5月', '五一/520', '出游、礼物'],
        ['6月', '618 年中大促', '数码、家电、全品类'],
        ['8月', '88 会员节', '淘宝天猫大促'],
        ['9月', '99 划算节', '日用品'],
        ['10-11月', '双 11 预售', '全年最大力度，11.11 当天'],
        ['12月', '双 12 / 年货节', '服饰、年货'],
        ['海外', '黑五（11月底）/ 会员日', '海淘折扣']
      ];
      var sites = [
        { n: '什么值得买', u: 'https://www.smzdm.com', d: '全网优惠信息聚合与好价爆料' },
        { n: '慢慢买', u: 'https://www.manmanbuy.com', d: '历史价格查询，识别涨价再降价' },
        { n: '一淘', u: 'https://www.etao.com', d: '阿里系返利与比价' },
        { n: '京东比价', u: 'https://www.jd.com', d: '京粉返利与凑单满减' },
        { n: '淘宝联盟', u: 'https://pub.alimama.com', d: '淘宝官方推广返利平台' },
        { n: '返利网', u: 'https://www.fanli.com', d: '老牌返利导航' },
        { n: '比价网站', u: 'https://www.biaduojia.com', d: '多平台同款比价' }
      ];
      var h = '<div class="panel"><h3>' + L('大促节点参考', 'Sales Calendar') + '</h3><div class="table-wrap"><table class="kv"><tr><th>时间</th><th>节点</th><th>适合买</th></tr>';
      sales.forEach(function (r) { h += '<tr><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td><td>' + r[2] + '</td></tr>'; });
      h += '</table></div><p class="note">技巧：大促前先加购物车关注价格；叠加平台券+店铺券+满减；凌晨/首小时常有额外折扣。</p></div>';
      h += '<div class="panel"><h3>' + L('比价与返利平台', 'Price & Cashback') + '</h3><div class="site-grid">';
      sites.forEach(function (s) {
        h += '<a class="site-card" href="' + s.u + '" target="_blank" rel="noopener noreferrer"><b>' + esc(s.n) + '</b><span>' + esc(s.d) + '</span><i>' + esc(s.u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</i></a>';
      });
      h += '</div></div>';
      host.innerHTML = h;
    }
  });

  /* ================= 购物：购物清单 ================= */
  T.register({
    id: 'shop-list', cat: 'shop', icon: '🛒',
    name: '购物清单', desc: '列出采购清单，自动统计预算与花费',
    keywords: '购物 清单 采购 预算 花费 记账 买菜 列表 shopping list',
    render: function (host) {
      var KEY = 'omnitool.shoplist';
      var items = [];
      try { items = T.store.get('shoplist', []); } catch (e) {}
      function save() { T.store.set('shoplist', items); }
      function fmt(y) { return '¥' + (Math.round(y * 100) / 100).toFixed(2); }
      function render() {
        var done = items.filter(function (i) { return i.done; });
        var total = items.reduce(function (a, i) { return a + (Number(i.price) || 0); }, 0);
        var doneTotal = done.reduce(function (a, i) { return a + (Number(i.price) || 0); }, 0);
        var h = '<div class="panel"><h3>' + L('购物清单', 'Shopping List') + '</h3>' +
          '<div class="stat-grid" style="margin-bottom:12px">' +
          '<div class="stat-box"><div class="k">项目</div><div class="v">' + items.length + '<small>件</small></div></div>' +
          '<div class="stat-box"><div class="k">预算总额</div><div class="v" style="font-size:17px">' + fmt(total) + '</div></div>' +
          '<div class="stat-box"><div class="k">已花费</div><div class="v" style="font-size:17px;color:var(--ok)">' + fmt(doneTotal) + '</div></div>' +
          '<div class="stat-box"><div class="k">待花费</div><div class="v" style="font-size:17px;color:var(--warn)">' + fmt(total - doneTotal) + '</div></div>' +
          '</div>' +
          '<div class="row">' +
          '<div class="field grow" style="margin-bottom:8px"><input id="slName" placeholder="要买什么，如：牛奶" spellcheck="false"></div>' +
          '<div class="field" style="margin-bottom:8px"><input id="slPrice" placeholder="价格" style="width:90px" inputmode="decimal" spellcheck="false"></div>' +
          '<div class="field" style="margin-bottom:8px"><button class="btn btn-primary" id="slAdd">＋ 添加</button></div>' +
          '</div><p class="note">数据保存在本机，刷新页面不丢失；勾选即计入“已花费”。</p></div>';
        if (!items.length) {
          h += '<div class="empty"><b>清单是空的</b>输入要买的商品和价格后点“添加”</div>';
        } else {
          h += '<div class="list">';
          items.forEach(function (it, i) {
            h += '<div class="list-item' + (it.done ? ' done' : '') + '" style="flex-wrap:wrap">' +
              '<label class="chk"><input type="checkbox" data-tog="' + i + '"' + (it.done ? ' checked' : '') + '></label>' +
              '<span class="li-text">' + esc(it.name) + (it.price ? ' <span class="badge" style="font-family:var(--mono)">' + fmt(it.price) + '</span>' : '') + '</span>' +
              '<span style="flex:1"></span>' +
              '<button class="btn btn-ghost copy-btn" data-cp="' + esc(it.name) + '" title="复制品名">' + L('复制', 'Copy') + '</button>' +
              '<button class="btn btn-ghost" data-del="' + i + '" title="删除">🗑</button></div>';
          });
          h += '</div>';
        }
        host.innerHTML = h;
        var add = document.getElementById('slAdd');
        if (add) add.addEventListener('click', function () { doAdd(); });
        var ni = document.getElementById('slName');
        if (ni) ni.addEventListener('keydown', function (e) { if (e.key === 'Enter') doAdd(); });
        host.querySelectorAll('[data-tog]').forEach(function (c) {
          c.addEventListener('change', function () {
            items[Number(c.getAttribute('data-tog'))].done = c.checked;
            save();
            render();
          });
        });
        host.querySelectorAll('[data-del]').forEach(function (b) {
          b.addEventListener('click', function () {
            items.splice(Number(b.getAttribute('data-del')), 1);
            save();
            render();
          });
        });
        host.querySelectorAll('[data-cp]').forEach(function (b) {
          b.addEventListener('click', function () { T.copyText(b.getAttribute('data-cp')); });
        });
      }
      function doAdd() {
        var n = document.getElementById('slName').value.trim();
        if (!n) { T.toast('请输入商品名'); return; }
        var p = parseFloat(document.getElementById('slPrice').value);
        items.push({ name: n, price: isNaN(p) || p < 0 ? 0 : p, done: false });
        save();
        render();
      }
      render();
    }
  });
})();
