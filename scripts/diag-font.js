/* 诊断：各 rem/em/px 字号在缩放后的计算值，定位为何 font-size 未跟随 --fs-base */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var html = fs.readFileSync(root + '/index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
var w = dom.window;
setTimeout(function () {
  var T = w.Toolbox;
  T.settings.fontScale = 140;
  if (typeof T.applySettings === 'function') T.applySettings();
  else console.log('applySettings 未导出，改用 updateSetting');
  if (typeof T.updateSetting === 'function') T.updateSetting('fontScale', 140);
  var doc = w.document;
  function cs(sel, prop) {
    var el = doc.querySelector(sel);
    if (!el) return sel + ': MISSING';
    return sel + ' {' + prop + '=' + w.getComputedStyle(el)[prop] + '}';
  }
  console.log('--fs-base = ' + w.getComputedStyle(doc.documentElement).getPropertyValue('--fs-base'));
  console.log('html font-size = ' + w.getComputedStyle(doc.documentElement).fontSize);
  console.log(cs('body', 'fontSize'));
  console.log(cs('body', 'lineHeight'));
  console.log(cs('.tool-card', 'fontSize'));
  console.log(cs('.tool-card', 'lineHeight'));
  console.log(cs('.panel h3', 'fontSize'));
  console.log(cs('h1', 'fontSize'));
  console.log(cs('.cat-card', 'fontSize'));
  console.log(cs('.sb-time', 'fontSize'));
  console.log(cs('.btn', 'fontSize'));
  /* 是否有 CSS 规则直接覆盖 body font-size */
  var sheets = doc.styleSheets;
  for (var i = 0; i < sheets.length; i++) {
    try {
      var rules = sheets[i].cssRules;
      for (var j = 0; j < rules.length; j++) {
        var r = rules[j];
        if (r.style && r.style.fontSize && r.selectorText && r.selectorText.indexOf('body') >= 0) {
          console.log('CSS body rule: ' + r.selectorText + ' { font-size:' + r.style.fontSize + ' }');
        }
      }
    } catch (e) { console.log('sheet ' + i + ' unreadable: ' + e.message); }
  }
  process.exit(0);
}, 1500);
