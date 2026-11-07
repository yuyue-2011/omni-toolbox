/* 临时诊断：输出 json-yaml 的实际转换结果 */
var fs = require('fs');
var { JSDOM } = require('jsdom');
var html = fs.readFileSync('index.html', 'utf8');
var dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
var w = dom.window;
setTimeout(function () {
  w.location.hash = '#/tool/json-yaml';
  setTimeout(function () {
    var doc = w.document;
    doc.getElementById('jyIn').value = '{"name":"Tom","age":30,"tags":["a","b"]}';
    doc.getElementById('jy2y').click();
    console.log('=== YAML 输出 START ===');
    console.log(doc.getElementById('jyOut').value);
    console.log('=== YAML 输出 END ===');
    process.exit(0);
  }, 100);
}, 400);
