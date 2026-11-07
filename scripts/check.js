/* 语法检查：node --check 所有 js 文件 */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let failed = 0;
let count = 0;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { if (ent.name !== 'node_modules' && ent.name !== 'www' && ent.name !== 'dist-exe' && ent.name !== 'android' && ent.name !== '_release' && ent.name !== '_testlog') walk(full); }
    else if (ent.name.endsWith('.js')) {
      count++;
      try {
        execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' });
        console.log('OK  ' + path.relative(root, full));
      } catch (e) {
        failed++;
        console.log('ERR ' + path.relative(root, full));
        console.log(String(e.stderr || e.message));
      }
    }
  }
}
walk(root);
console.log('\n检查 ' + count + ' 个文件，失败 ' + failed + ' 个');
process.exit(failed ? 1 : 0);
