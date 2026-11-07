/* ============================================================
   万能工具箱 v2.7 · 国旗速查（离线）
   100 个国家/地区：国旗 SVG + 中英文名 + 洲 + 搜索过滤
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var esc = T.esc;

  /* [code, 中文名, English, 洲] */
  var COUNTRIES = [
    ['YE', '也门', 'Yemen', '亚洲'], ['BH', '巴林', 'Bahrain', '亚洲'], ['GE', '格鲁吉亚', 'Georgia', '亚洲'], ['AM', '亚美尼亚', 'Armenia', '亚洲'], ['AZ', '阿塞拜疆', 'Azerbaijan', '亚洲'],
    ['CY', '塞浦路斯', 'Cyprus', '欧洲'], ['BY', '白俄罗斯', 'Belarus', '欧洲'],
    ['CN', '中国', 'China', '亚洲'], ['HK', '中国香港', 'Hong Kong', '亚洲'], ['MO', '中国澳门', 'Macao', '亚洲'], ['TW', '中国台湾', 'Taiwan', '亚洲'],
    ['JP', '日本', 'Japan', '亚洲'], ['KR', '韩国', 'South Korea', '亚洲'], ['KP', '朝鲜', 'North Korea', '亚洲'],
    ['MN', '蒙古', 'Mongolia', '亚洲'], ['KZ', '哈萨克斯坦', 'Kazakhstan', '亚洲'], ['UZ', '乌兹别克斯坦', 'Uzbekistan', '亚洲'],
    ['AF', '阿富汗', 'Afghanistan', '亚洲'], ['PK', '巴基斯坦', 'Pakistan', '亚洲'], ['BD', '孟加拉国', 'Bangladesh', '亚洲'],
    ['IN', '印度', 'India', '亚洲'], ['NP', '尼泊尔', 'Nepal', '亚洲'], ['LK', '斯里兰卡', 'Sri Lanka', '亚洲'],
    ['MM', '缅甸', 'Myanmar', '亚洲'], ['TH', '泰国', 'Thailand', '亚洲'], ['VN', '越南', 'Vietnam', '亚洲'],
    ['KH', '柬埔寨', 'Cambodia', '亚洲'], ['LA', '老挝', 'Laos', '亚洲'], ['MY', '马来西亚', 'Malaysia', '亚洲'],
    ['SG', '新加坡', 'Singapore', '亚洲'], ['PH', '菲律宾', 'Philippines', '亚洲'], ['ID', '印度尼西亚', 'Indonesia', '亚洲'],
    ['AE', '阿联酋', 'United Arab Emirates', '亚洲'], ['SA', '沙特阿拉伯', 'Saudi Arabia', '亚洲'], ['QA', '卡塔尔', 'Qatar', '亚洲'],
    ['KW', '科威特', 'Kuwait', '亚洲'], ['OM', '阿曼', 'Oman', '亚洲'], ['IL', '以色列', 'Israel', '亚洲'],
    ['JO', '约旦', 'Jordan', '亚洲'], ['LB', '黎巴嫩', 'Lebanon', '亚洲'], ['IQ', '伊拉克', 'Iraq', '亚洲'],
    ['IR', '伊朗', 'Iran', '亚洲'], ['TR', '土耳其', 'Turkey', '亚洲'],
    ['GB', '英国', 'United Kingdom', '欧洲'], ['FR', '法国', 'France', '欧洲'], ['DE', '德国', 'Germany', '欧洲'],
    ['IT', '意大利', 'Italy', '欧洲'], ['ES', '西班牙', 'Spain', '欧洲'], ['PT', '葡萄牙', 'Portugal', '欧洲'],
    ['NL', '荷兰', 'Netherlands', '欧洲'], ['BE', '比利时', 'Belgium', '欧洲'], ['LU', '卢森堡', 'Luxembourg', '欧洲'],
    ['CH', '瑞士', 'Switzerland', '欧洲'], ['AT', '奥地利', 'Austria', '欧洲'], ['IE', '爱尔兰', 'Ireland', '欧洲'],
    ['SE', '瑞典', 'Sweden', '欧洲'], ['NO', '挪威', 'Norway', '欧洲'], ['FI', '芬兰', 'Finland', '欧洲'],
    ['DK', '丹麦', 'Denmark', '欧洲'], ['IS', '冰岛', 'Iceland', '欧洲'], ['PL', '波兰', 'Poland', '欧洲'],
    ['CZ', '捷克', 'Czechia', '欧洲'], ['SK', '斯洛伐克', 'Slovakia', '欧洲'], ['HU', '匈牙利', 'Hungary', '欧洲'],
    ['RO', '罗马尼亚', 'Romania', '欧洲'], ['BG', '保加利亚', 'Bulgaria', '欧洲'], ['GR', '希腊', 'Greece', '欧洲'],
    ['HR', '克罗地亚', 'Croatia', '欧洲'], ['SI', '斯洛文尼亚', 'Slovenia', '欧洲'], ['RS', '塞尔维亚', 'Serbia', '欧洲'],
    ['UA', '乌克兰', 'Ukraine', '欧洲'], ['RU', '俄罗斯', 'Russia', '欧洲'], ['EE', '爱沙尼亚', 'Estonia', '欧洲'],
    ['LV', '拉脱维亚', 'Latvia', '欧洲'], ['LT', '立陶宛', 'Lithuania', '欧洲'],
    ['US', '美国', 'United States', '美洲'], ['CA', '加拿大', 'Canada', '美洲'], ['MX', '墨西哥', 'Mexico', '美洲'],
    ['BR', '巴西', 'Brazil', '美洲'], ['AR', '阿根廷', 'Argentina', '美洲'], ['CL', '智利', 'Chile', '美洲'],
    ['CO', '哥伦比亚', 'Colombia', '美洲'], ['PE', '秘鲁', 'Peru', '美洲'], ['VE', '委内瑞拉', 'Venezuela', '美洲'],
    ['EC', '厄瓜多尔', 'Ecuador', '美洲'], ['CU', '古巴', 'Cuba', '美洲'], ['UY', '乌拉圭', 'Uruguay', '美洲'],
    ['BO', '玻利维亚', 'Bolivia', '美洲'], ['PA', '巴拿马', 'Panama', '美洲'], ['CR', '哥斯达黎加', 'Costa Rica', '美洲'],
    ['AU', '澳大利亚', 'Australia', '大洋洲'], ['NZ', '新西兰', 'New Zealand', '大洋洲'],
    ['EG', '埃及', 'Egypt', '非洲'], ['MA', '摩洛哥', 'Morocco', '非洲'], ['DZ', '阿尔及利亚', 'Algeria', '非洲'],
    ['ZA', '南非', 'South Africa', '非洲'], ['NG', '尼日利亚', 'Nigeria', '非洲'], ['KE', '肯尼亚', 'Kenya', '非洲'],
    ['ET', '埃塞俄比亚', 'Ethiopia', '非洲'], ['GH', '加纳', 'Ghana', '非洲']
  ];

  T.register({
    id: 'flags', cat: 'study', icon: '🏳️',
    name: '国旗速查', desc: '100 个国家/地区国旗 · 名称 · 大洲',
    keywords: '国旗 国家 地区 世界 旗子 flag country world 洲 大陆 名称 大全 速查',
    render: function (host) {
      var lang = T.isEn() ? 'en' : 'zh';
      function svgOf(code) {
        var svg = T.flagSvg(code);
        return svg || '';
      }
      function paint(q) {
        q = (q || '').trim().toLowerCase();
        var list = COUNTRIES.filter(function (c) {
          if (!q) return true;
          return c[0].toLowerCase().indexOf(q) >= 0 || c[1].toLowerCase().indexOf(q) >= 0 || c[2].toLowerCase().indexOf(q) >= 0 || c[3].indexOf(q) >= 0;
        });
        var h = '<div class="panel"><h3>' + L('国旗速查', 'World Flags') + '</h3>' +
          '<p class="note">' + L('共 ' + COUNTRIES.length + ' 个国家 / 地区 · 全部离线展示 · 点击卡片复制国家名', COUNTRIES.length + ' countries/regions · fully offline · click to copy name') + '</p>' +
          '<div class="row"><input id="flgQ" class="grow" placeholder="' + L('搜索国家 / 代码 / 大洲…', 'Search name / code / continent…') + '" spellcheck="false" style="min-width:140px"></div>' +
          '<div class="flag-grid">';
        list.forEach(function (c) {
          h += '<div class="flag-card" data-copy="' + esc(c[1] + ' ' + c[2]) + '" title="' + esc(c[0]) + '">' +
            '<span class="fc-svg">' + svgOf(c[0]) + '</span>' +
            '<b>' + esc(c[lang === 'en' ? 2 : 1]) + '</b>' +
            '<span class="fc-code">' + esc(c[0]) + ' · ' + esc(c[3]) + '</span></div>';
        });
        h += '</div><p class="note">' + L('已显示 ' + list.length + ' / ' + COUNTRIES.length + '，点击卡片复制国家名称。', 'Showing ' + list.length + ' / ' + COUNTRIES.length + '. Click a card to copy its name.') + '</p></div>';
        host.innerHTML = h;
        host.querySelector('#flgQ').addEventListener('input', function () { paint(this.value); });
        host.querySelectorAll('.flag-card[data-copy]').forEach(function (card) {
          card.addEventListener('click', function () { T.copyText(card.getAttribute('data-copy')); });
        });
      }
      paint('');
    }
  });
})();
