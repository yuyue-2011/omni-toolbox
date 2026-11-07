/* ============================================================
   万能工具箱 · 单文件构建脚本
   读取 src/index.html，将 css/app.css 与全部 js 内联，
   生成可直接分发、双击即用的单文件 index.html
   用法：node scripts/build-single.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcFile = path.join(root, 'src', 'index.html');
const outFile = path.join(root, 'index.html');

function read(p) {
  return fs.readFileSync(path.join(root, p), 'utf8');
}

let html = read('src/index.html');

/* 1) 内联 CSS */
html = html.replace(/<link rel="stylesheet" href="css\/app\.css">/, function () {
  const css = read('css/app.css');
  return '<style>\n' + css + '\n</style>';
});

/* 2) 内联全部本地脚本 */
html = html.replace(/<script src="([^"]+)"><\/script>/g, function (m, src) {
  const file = path.join(root, src);
  if (!fs.existsSync(file)) {
    console.error('缺少文件: ' + src);
    process.exit(1);
  }
  let code = fs.readFileSync(file, 'utf8');
  /* 转义会提前终结 script 块的序列：<\/script 等价于 </script，<!-- 同理 */
  code = code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
  return '<script>\n' + code + '\n</script>';
});

/* 3.5) 版本号自动注入：从 package.json 读取，替换 {{VERSION}} 占位符 */
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const VER = pkg.version || '0.0.0';
html = html.split('{{VERSION}}').join(VER);
if (html.indexOf('{{VERSION}}') >= 0) console.warn('警告：仍有未替换的版本占位符');

/* 4) 校验：不应残留任何指向本地 js/css 的外链引用 */
const leftover = html.match(/src="(?:js|css)\//g) || [];
if (leftover.length) {
  console.error('仍有未内联的本地资源: ' + leftover.join(', '));
  process.exit(1);
}

fs.writeFileSync(outFile, html, 'utf8');
const sizeKb = (fs.statSync(outFile).size / 1024).toFixed(1);
console.log('已生成单文件: index.html (' + sizeKb + ' KB)');
