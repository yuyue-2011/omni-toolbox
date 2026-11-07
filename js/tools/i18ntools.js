/* ============================================================
   万能工具箱 v2.7 · 语言工具（2 款）
   translate-多语言翻译（联网，多引擎国内外可用）
   phrasebook-离线常用语（本地，9 语言）
   ============================================================ */
(function () {
  var T = window.Toolbox;
  if (!T) return;
  function L(zh, en) { return T.isEn() ? en : zh; }
  var isEn = function () { return T.isEn(); };
  var esc = T.esc;

  /* ============ 多语言翻译（多引擎：有道→Google→MyMemory 自动切换） ============ */
  T.register({
    id: 'translate', cat: 'text', icon: '🌐',
    name: '多语言翻译', desc: '有道 / Google / MyMemory 多引擎互备，国内外可用',
    keywords: '翻译 语言 英文 日文 韩文 法文 德文 西文 俄文 translate translator 互译 词典 引擎',
    net: true,
    netNote: '按 有道 → Google → MyMemory 顺序自动切换翻译引擎：国内网络优先走有道，海外网络自动转 Google，均不可用时提示。',
    render: function (host) {
      var LANGS = [
        ['auto', L('自动检测', 'Auto detect')], ['zh', L('中文', 'Chinese')], ['en', L('英语', 'English')],
        ['ja', L('日语', 'Japanese')], ['ko', L('韩语', 'Korean')], ['fr', L('法语', 'French')],
        ['de', L('德语', 'German')], ['es', L('西班牙语', 'Spanish')], ['ru', L('俄语', 'Russian')],
        ['pt', L('葡萄牙语', 'Portuguese')], ['it', L('意大利语', 'Italian')], ['ar', L('阿拉伯语', 'Arabic')],
        ['hi', L('印地语', 'Hindi')], ['id', L('印尼语', 'Indonesian')], ['th', L('泰语', 'Thai')],
        ['vi', L('越南语', 'Vietnamese')], ['tr', L('土耳其语', 'Turkish')], ['pl', L('波兰语', 'Polish')],
        ['nl', L('荷兰语', 'Dutch')], ['sv', L('瑞典语', 'Swedish')], ['el', L('希腊语', 'Greek')],
        ['he', L('希伯来语', 'Hebrew')], ['uk', L('乌克兰语', 'Ukrainian')], ['ms', L('马来语', 'Malay')],
        ['fa', L('波斯语', 'Persian')]
      ];
      function opts(sel) {
        return LANGS.map(function (l) {
          return '<option value="' + l[0] + '"' + (l[0] === sel ? ' selected' : '') + '>' + esc(l[1]) + '</option>';
        }).join('');
      }
      host.innerHTML =
      '<div class="panel"><h3>' + L('多语言翻译', 'Translate') + '</h3>' +
        '<div class="row">' +
          '<div class="field"><label>' + L('源语言', 'From') + '</label><select id="trFrom">' + opts('auto') + '</select></div>' +
          '<div class="field"><label>' + L('目标语言', 'To') + '</label><select id="trTo">' + opts('zh') + '</select></div>' +
        '</div>' +
        '<div class="field"><label>' + L('原文', 'Source text') + '</label><textarea id="trSrc" rows="4" placeholder="' + L('输入要翻译的文字…', 'Type text to translate…') + '" spellcheck="false"></textarea></div>' +
        '<div class="row"><button class="btn btn-primary" id="trBtn">' + L('翻译', 'Translate') + '</button>' +
        '<button class="btn btn-ghost" id="trSwap">⇄ ' + L('交换语言', 'Swap') + '</button>' +
        '<span class="note" id="trEng" style="margin-left:auto;align-self:center">' + L('引擎：自动', 'Engine: auto') + '</span></div>' +
        '<div class="field" style="margin-top:12px"><label>' + L('译文', 'Result') + '</label><div class="tr-out" id="trOut">' + L('翻译结果将显示在这里', 'Translation will appear here') + '</div></div>' +
        '<p class="note">' + L('多引擎互备：国内网络优先使用有道，海外网络自动切换 Google / MyMemory，全程无 Key 免费接口。', 'Multi-engine fallback: Youdao first (CN-friendly), then Google / MyMemory abroad — free, no API key.') + '</p>' +
      '</div>';
      function curEng() { return document.getElementById('trEng'); }
      function setEng(n) { var e = curEng(); if (e) e.textContent = L('引擎', 'Engine') + '：' + n; }
      function doTranslate() {
        var src = document.getElementById('trSrc').value.trim();
        var from = document.getElementById('trFrom').value;
        var to = document.getElementById('trTo').value;
        if (!src) { T.toast(L('请输入原文', 'Type some text first')); return; }
        var btn = document.getElementById('trBtn');
        btn.disabled = true;
        var out = document.getElementById('trOut');
        out.innerHTML = '<div class="msg">' + L('翻译中…', 'Translating…') + '</div>';
        var q = encodeURIComponent(src);
        /* 引擎 1：有道（国内可达，支持自动检测） */
        T.getJSON('https://fanyi.youdao.com/translate?&i=' + q + '&doctype=json&type=AUTO&from=' + (from === 'auto' ? 'AUTO' : from) + '&to=' + to, 8000)
          .then(function (d) {
            var t0 = d && d.translateResult && d.translateResult[0];
            if (t0 && t0.length) {
              setEng(L('有道', 'Youdao'));
              out.innerHTML = '<div class="tr-out-box">' + esc(t0.map(function (x) { return x.tgt; }).join('')) + '</div>' +
                '<button class="btn btn-ghost copy-btn" style="margin-top:10px">' + L('复制', 'Copy') + '</button>';
              var cp = out.querySelector('.copy-btn');
              if (cp) cp.addEventListener('click', function () { T.copyText(out.querySelector('.tr-out-box').textContent); });
              return;
            }
            throw new Error('empty');
          }, function () { throw new Error('net'); })
          .catch(function () {
            /* 引擎 2：Google（海外可达） */
            return T.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + (from === 'auto' ? 'auto' : from) + '&tl=' + to + '&dt=t&q=' + q, 8000)
              .then(function (d) {
                var txt = '';
                if (d && d[0]) d[0].forEach(function (seg) { if (seg && seg[0]) txt += seg[0]; });
                if (txt) {
                  setEng('Google');
                  out.innerHTML = '<div class="tr-out-box">' + esc(txt) + '</div><button class="btn btn-ghost copy-btn" style="margin-top:10px">' + L('复制', 'Copy') + '</button>';
                  var cp2 = out.querySelector('.copy-btn');
                  if (cp2) cp2.addEventListener('click', function () { T.copyText(out.querySelector('.tr-out-box').textContent); });
                  return;
                }
                throw new Error('empty');
              }, function () { throw new Error('net'); });
          })
          .catch(function () {
            /* 引擎 3：MyMemory（需具体源语言） */
            var f = from === 'auto' ? (to === 'en' ? 'zh' : 'en') : from;
            return T.getJSON('https://api.mymemory.translated.net/get?q=' + q + '&langpair=' + f + '|' + to, 8000)
              .then(function (d) {
                var txt = d && d.responseData && d.responseData.translatedText;
                if (txt && txt !== 'NO QUERY SPECIFIED') {
                  setEng('MyMemory');
                  out.innerHTML = '<div class="tr-out-box">' + esc(txt) + '</div><button class="btn btn-ghost copy-btn" style="margin-top:10px">' + L('复制', 'Copy') + '</button>';
                  var cp3 = out.querySelector('.copy-btn');
                  if (cp3) cp3.addEventListener('click', function () { T.copyText(out.querySelector('.tr-out-box').textContent); });
                  return;
                }
                throw new Error('empty');
              }, function () { throw new Error('net'); });
          })
          .catch(function (e) {
            out.innerHTML = '<div class="msg err">' + L('翻译失败：三个引擎均不可达（请检查网络后重试）', 'All 3 engines unreachable — check network and retry.') + '</div>';
            setEng('-');
          })
          .then(function () { btn.disabled = false; });
      }
      document.getElementById('trBtn').addEventListener('click', doTranslate);
      document.getElementById('trSwap').addEventListener('click', function () {
        var f = document.getElementById('trFrom'), t2 = document.getElementById('trTo');
        var fv = f.value, tv = t2.value;
        if (fv === 'auto') { T.toast(L('请先选择源语言再交换', 'Pick a source language before swapping')); return; }
        f.value = tv; t2.value = fv;
      });
      document.getElementById('trSrc').addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') document.getElementById('trBtn').click();
      });
    }
  });

  /* ============ 离线常用语（9 语言，本地） ============ */
  T.register({
    id: 'phrasebook', cat: 'text', icon: '💬',
    name: '离线常用语', desc: '9 语言日常短语速查，100% 本地运行',
    keywords: '常用语 短语 问候 旅行 语言 英语 日语 韩语 法语 德语 西语 俄语 阿语 口语 phrasebook travel',
    render: function (host) {
      /* 顺序：中文, English, 日本語, 한국어, Français, Deutsch, Español, Русский, العربية */
      var LANG_NAMES = ['中文', 'English', '日本語', '한국어', 'Français', 'Deutsch', 'Español', 'Русский', 'العربية'];
      var PHRASES = [
        ['问候', ['你好', 'Hello', 'こんにちは', '안녕하세요', 'Bonjour', 'Hallo', 'Hola', 'Здравствуйте', 'مرحبا']],
        ['早上好', ['早上好', 'Good morning', 'おはようございます', '좋은 아침', 'Bonjour', 'Guten Morgen', 'Buenos días', 'Доброе утро', 'صباح الخير']],
        ['晚上好', ['晚上好', 'Good evening', 'こんばんは', '좋은 저녁', 'Bonsoir', 'Guten Abend', 'Buenas noches', 'Добрый вечер', 'مساء الخير']],
        ['再见', ['再见', 'Goodbye', 'さようなら', '안녕히 가세요', 'Au revoir', 'Auf Wiedersehen', 'Adiós', 'До свидания', 'وداعا']],
        ['谢谢', ['谢谢', 'Thank you', 'ありがとう', '감사합니다', 'Merci', 'Danke', 'Gracias', 'Спасибо', 'شكرا']],
        ['不客气', ['不客气', 'You’re welcome', 'どういたしまして', '천만에요', 'De rien', 'Gern geschehen', 'De nada', 'Пожалуйста', 'عفوا']],
        ['对不起', ['对不起', 'Sorry', 'ごめんなさい', '죄송합니다', 'Désolé', 'Entschuldigung', 'Lo siento', 'Извините', 'آسف']],
        ['请', ['请', 'Please', 'お願いします', '부탁합니다', 'S’il vous plaît', 'Bitte', 'Por favor', 'Пожалуйста', 'من فضلك']],
        ['是', ['是', 'Yes', 'はい', '네', 'Oui', 'Ja', 'Sí', 'Да', 'نعم']],
        ['不是', ['不是', 'No', 'いいえ', '아니요', 'Non', 'Nein', 'No', 'Нет', 'لا']],
        ['多少钱？', ['多少钱？', 'How much?', 'いくらですか？', '얼마예요?', 'Combien ?', 'Wie viel?', '¿Cuánto cuesta?', 'Сколько стоит?', 'كم الثمن؟']],
        ['太贵了', ['太贵了', 'Too expensive', '高すぎます', '너무 비싸요', 'Trop cher', 'Zu teuer', 'Muy caro', 'Слишком дорого', 'غالي جدا']],
        ['可以便宜点吗？', ['可以便宜点吗？', 'Can you make it cheaper?', '安くしてもらえますか？', '좀 깎아 주세요', 'Pouvez-vous baisser le prix ?', 'Können Sie den Preis senken?', '¿Puede rebajar el precio?', 'Можно дешевле?', 'هل يمكن التخفيض؟']],
        ['洗手间在哪里？', ['洗手间在哪里？', 'Where is the toilet?', 'トイレはどこですか？', '화장실이 어디예요?', 'Où sont les toilettes ?', 'Wo ist die Toilette?', '¿Dónde está el baño?', 'Где туалет?', 'أين الحمام؟']],
        ['我迷路了', ['我迷路了', 'I’m lost', '道に迷いました', '길을 잃었어요', 'Je suis perdu', 'Ich habe mich verirrt', 'Estoy perdido', 'Я заблудился', 'أنا تائه']],
        ['救命！', ['救命！', 'Help!', '助けて！', '도와주세요!', 'Au secours !', 'Hilfe!', '¡Socorro!', 'Помогите!', 'النجدة!']],
        ['我生病了', ['我生病了', 'I’m sick', '体調が悪いです', '아파요', 'Je suis malade', 'Ich bin krank', 'Estoy enfermo', 'Я болен', 'أنا مريض']],
        ['请叫医生', ['请叫医生', 'Please call a doctor', '医者を呼んでください', '의사를 불러 주세요', 'Appelez un médecin', 'Rufen Sie einen Arzt', 'Llame a un médico', 'Вызовите врача', 'اتصل بطبيب']],
        ['请叫警察', ['请叫警察', 'Please call the police', '警察を呼んでください', '경찰을 불러 주세요', 'Appelez la police', 'Rufen Sie die Polizei', 'Llame a la policía', 'Вызовите полицию', 'اتصل بالشرطة']],
        ['我不明白', ['我不明白', 'I don’t understand', 'わかりません', '이해가 안 돼요', 'Je ne comprends pas', 'Ich verstehe nicht', 'No entiendo', 'Я не понимаю', 'لا أفهم']],
        ['你会说英语吗？', ['你会说英语吗？', 'Do you speak English?', '英語を話せますか？', '영어 할 줄 아세요?', 'Parlez-vous anglais ?', 'Sprechen Sie Englisch?', '¿Habla inglés?', 'Вы говорите по-английски?', 'هل تتحدث الإنجليزية؟']],
        ['我想点这个', ['我想点这个', 'I’d like to order this', 'これをください', '이걸로 주세요', 'Je voudrais ceci', 'Ich hätte gern das', 'Quiero esto', 'Я хочу заказать это', 'أريد طلب هذا']],
        ['菜单', ['菜单', 'Menu', 'メニュー', '메뉴', 'La carte', 'Speisekarte', 'El menú', 'Меню', 'قائمة الطعام']],
        ['水', ['水', 'Water', '水', '물', 'De l’eau', 'Wasser', 'Agua', 'Вода', 'ماء']],
        ['机场怎么走？', ['机场怎么走？', 'How do I get to the airport?', '空港へはどう行きますか？', '공항에 어떻게 가요?', 'Comment aller à l’aéroport ?', 'Wie komme ich zum Flughafen?', '¿Cómo llego al aeropuerto?', 'Как добраться до аэропорта?', 'كيف أصل إلى المطار؟']],
        ['几点开车？', ['几点开车？', 'What time does it leave?', '何時に出発しますか？', '몇 시에 출발해요?', 'À quelle heure part-il ?', 'Wann fährt es ab?', '¿A qué hora sale?', 'Когда отправление?', 'متى يغادر؟']],
        ['我叫…', ['我叫…', 'My name is…', '私の名前は…', '제 이름은…', 'Je m’appelle…', 'Ich heiße…', 'Me llamo…', 'Меня зовут…', 'اسمي…']],
        ['很高兴认识你', ['很高兴认识你', 'Nice to meet you', 'お会いできて嬉しいです', '만나서 반가워요', 'Enchanté', 'Freut mich', 'Mucho gusto', 'Очень приятно', 'سعيد بلقائك']]
      ];
      var cur = 0; /* 显示列：0=中文,1=English,2..8 */
      function paint(q) {
        q = (q || '').trim().toLowerCase();
        var list = PHRASES.filter(function (p) {
          if (!q) return true;
          for (var i = 0; i < p[1].length; i++) {
            if (p[1][i].toLowerCase().indexOf(q) >= 0) return true;
          }
          return false;
        });
        var h = '<div class="panel"><h3>' + L('离线常用语', 'Phrasebook') + '</h3>' +
          '<p class="note">' + L('9 种语言 · 28 条日常用语 · 100% 本地运行', '9 languages · 28 phrases · 100% offline') + '</p>' +
          '<div class="row"><input id="phQ" class="grow" placeholder="' + L('搜索任意语言的关键词…', 'Search any language…') + '" spellcheck="false" style="min-width:140px">' +
          '<select id="phLang" class="ph-lang">' + LANG_NAMES.map(function (n, i) {
            return '<option value="' + i + '"' + (i === cur ? ' selected' : '') + '>' + n + '</option>';
          }).join('') + '</select></div>' +
          '<div class="ph-list">';
        list.forEach(function (p) {
          h += '<div class="ph-item" data-copy="' + esc(p[1].join(' | ')) + '">' +
            '<b>' + esc(p[0]) + '</b>' +
            '<span>' + esc(p[1][0]) + '</span>' +
            '<i>' + esc(p[1][1]) + '</i>' +
            '<em>' + esc(p[1][cur]) + '</em></div>';
        });
        h += '</div><p class="note">' + L('点击任意一行可复制全部语言版本。', 'Click a row to copy all language versions.') + '</p></div>';
        host.innerHTML = h;
        host.querySelector('#phQ').addEventListener('input', function () { paint(this.value); });
        host.querySelector('#phLang').addEventListener('change', function () {
          cur = Number(this.value);
          paint(host.querySelector('#phQ').value);
        });
        host.querySelectorAll('.ph-item[data-copy]').forEach(function (it) {
          it.addEventListener('click', function () { T.copyText(it.getAttribute('data-copy')); });
        });
      }
      paint('');
    }
  });
})();
