/* 为打包后的 EXE 嵌入图标与版本信息（替代 electron-builder 内置的资源编辑，规避 winCodeSign 符号链接问题） */
'use strict';
const path = require('path');
const { rcedit } = require('rcedit');

const root = path.join(__dirname, '..');
/* 支持传入自定义 exe 路径（默认 dist-exe/win-unpacked），便于输出目录被占用时改道构建 */
const exe = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'dist-exe', 'win-unpacked', '万能工具箱.exe');

async function main() {
  await rcedit(exe, {
    icon: path.join(root, 'icons', 'icon.ico'),
    'version-string': {
      CompanyName: 'OmniToolbox',
      FileDescription: '万能工具箱 - 224 款离线工具合集',
      FileVersion: '3.4.1.0',
      ProductName: '万能工具箱',
      ProductVersion: '3.4.1.0',
      InternalName: 'omni-toolbox',
      OriginalFilename: '万能工具箱.exe'
    },
    'file-version': '3.4.1.0',
    'product-version': '3.4.1.0'
  });
  console.log('已为 EXE 嵌入图标与版本信息: ' + exe);
}
main().catch(e => { console.error('rcedit 失败: ' + e.message); process.exit(1); });
