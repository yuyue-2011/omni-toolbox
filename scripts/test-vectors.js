/* 开发自检：验证哈希算法与二维码库（用标准测试向量） */
'use strict';
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'tools', 'codec.js'), 'utf8');
/* 提取 codec.js 中哈希函数部分（utf8Bytes 到摩斯密码工具之前） */
const part = src.slice(src.indexOf('function utf8Bytes'), src.indexOf('/* ============ 哈希工具'));
(0, eval)(part);

const cases = [
  ['md5', md5, '', 'd41d8cd98f00b204e9800998ecf8427e'],
  ['md5', md5, 'abc', '900150983cd24fb0d6963f7d28e17f72'],
  ['md5', md5, 'The quick brown fox jumps over the lazy dog', '9e107d9d372bb6826bd81d3542a419d6'],
  ['sha1', sha1, '', 'da39a3ee5e6b4b0d3255bfef95601890afd80709'],
  ['sha1', sha1, 'abc', 'a9993e364706816aba3e25717850c26c9cd0d89d'],
  ['sha256', sha256, '', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['sha256', sha256, 'abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
  ['sha256', sha256, '你好世界', '84d6b3a021a60fd02eec18d01d4b7e1d1f2b0d5eea1e4e7ec2c6d9ba3b0c1f9e'.slice(0, 64)] /* 占位：下面用 node crypto 对照 */
];

let failed = 0;
for (const [name, fn, input, expected] of cases) {
  const got = fn(input);
  const crypto = require('crypto');
  const ref = crypto.createHash(name === 'md5' ? 'md5' : name === 'sha1' ? 'sha1' : 'sha256')
    .update(Buffer.from(input, 'utf8')).digest('hex');
  const ok = got === ref;
  if (!ok) failed++;
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + '(' + JSON.stringify(input.slice(0, 20)) + ') = ' + got + (ok ? '' : ' 期望 ' + ref));
}

/* 二维码库 */
try {
  const qrlib = require(path.join(__dirname, '..', 'js', 'vendor', 'qrcode.js'));
  const qr = qrlib(0, 'M');
  qr.addData('https://example.com', 'Byte');
  qr.make();
  const size = qr.getModuleCount();
  let dark = 0;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (qr.isDark(r, c)) dark++;
  console.log(dark > 100 && size >= 21 ? 'PASS qrcode 生成成功 (' + size + 'x' + size + ', 暗模块 ' + dark + ')' : 'FAIL qrcode 生成异常');
  if (!(dark > 100 && size >= 21)) failed++;
} catch (e) {
  console.log('FAIL qrcode: ' + e.message);
  failed++;
}

console.log(failed ? ('\n共 ' + failed + ' 项失败') : '\n全部通过');
process.exit(failed ? 1 : 0);
