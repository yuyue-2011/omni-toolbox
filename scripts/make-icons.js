/* 由 icon.png 生成 PWA 多尺寸图标与 Windows EXE 用 .ico
   v3.4.1：源图裁掉四角圆弧区 → 全出血方形（消除白角）；输出压缩 PNG；
   .ico 由单帧升级为 16/32/48/64/128/256 六帧多尺寸。 */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const root = path.join(__dirname, '..');
const icons = path.join(root, 'icons');
const src = path.join(icons, 'icon.png');

/* 源图 1024 圆角方形，四角为白色圆弧（半径约 170），实名白像素只出现在
   边距 <40px 的角落。向内容裁入 64px 可完全裁净白角并保留完整图形。 */
const INSET = 64;

async function main() {
  if (!fs.existsSync(src)) {
    console.error('缺少 icons/icon.png，请先生成图标');
    process.exit(1);
  }
  const meta = await sharp(src).metadata();
  const inset = Math.round(Math.min(INSET, meta.width * 0.1));
  const side = meta.width - inset * 2;
  const master = await sharp(src)
    .extract({ left: inset, top: inset, width: side, height: side })
    .png()
    .toBuffer();

  const outs = [
    ['icon-32.png', 32],
    ['icon-180.png', 180],
    ['icon-192.png', 192],
    ['icon-256.png', 256],
    ['icon-512.png', 512]
  ];
  for (const o of outs) {
    await sharp(master).resize(o[1], o[1]).png({ compressionLevel: 9, palette: true }).toFile(path.join(icons, o[0]));
  }

  const frames = [];
  for (const s of [16, 32, 48, 64, 128, 256]) {
    frames.push(await sharp(master).resize(s, s).png().toBuffer());
  }
  fs.writeFileSync(path.join(icons, 'icon.ico'), await pngToIco(frames));

  console.log('图标已生成：icon-32 / icon-180 / icon-192 / icon-256 / icon-512.png（全出血）+ icon.ico（6 帧多尺寸）');
}
main().catch(e => { console.error(e); process.exit(1); });
