/* 打包包装：electron-builder 完整三步（与 npm run build:exe 等价）
   1) --dir 生成 win-unpacked  2) patch-exe.js 注入图标与版本  3) --prepackaged 生成 Setup/Portable
   输出重定向到 _testlog/electron-build.log，避免 PowerShell 管道 EPIPE */
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..').replace(/\\/g, '/');
const NODE = process.execPath;
try { fs.mkdirSync(root + '/_testlog', { recursive: true }); } catch (e) {}
const log = fs.openSync(root + '/_testlog/electron-build.log', 'w');
const cli = root + '/node_modules/electron-builder/out/cli/cli.js';

function run(args, label) {
  const r = spawnSync(NODE, args, { cwd: root, stdio: ['ignore', log, log], windowsHide: true });
  if (r.status !== 0) {
    console.error('打包失败（' + label + '）exit=' + r.status + '，日志见 _testlog/electron-build.log');
    fs.closeSync(log);
    process.exit(r.status || 1);
  }
}

run([cli, '--dir', '--x64'], '构建 win-unpacked');
run([root + '/scripts/patch-exe.js'], '注入图标与版本');
run([cli, '--prepackaged', root + '/dist-exe/win-unpacked', '--win', 'nsis', 'portable', '--x64'], '生成 Setup / Portable');
fs.closeSync(log);
console.log('打包完成（三步：--dir → patch-exe → --prepackaged），日志见 _testlog/electron-build.log');
