/* 将网页版文件同步到 www/（Capacitor 打包 APK 的静态资源目录） */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');

const FILES = [
  'index.html',
  'manifest.webmanifest',
  'sw.js'
];
/* 单文件版 index.html 自带全部 CSS/JS，只需同步图标 */
const DIRS = [
  'icons'
];

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dst, ent.name);
    if (ent.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

rmrf(www);
fs.mkdirSync(www, { recursive: true });
FILES.forEach(f => fs.copyFileSync(path.join(root, f), path.join(www, f)));
DIRS.forEach(d => copyDir(path.join(root, d), path.join(www, d)));
console.log('www/ 已同步，文件清单：');
function walk(p, pre) {
  for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(p, ent.name);
    if (ent.isDirectory()) { console.log(pre + ent.name + '/'); walk(full, pre + '  '); }
    else console.log(pre + ent.name);
  }
}
walk(www, '  ');
