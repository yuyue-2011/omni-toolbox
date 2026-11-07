# 万能工具箱 v3.4.1

[![CI](https://github.com/yuyue-2011/omni-toolbox/actions/workflows/ci.yml/badge.svg)](https://github.com/yuyue-2011/omni-toolbox/actions/workflows/ci.yml) [![Releases](https://img.shields.io/github/v/release/yuyue-2011/omni-toolbox?label=release)](https://github.com/yuyue-2011/omni-toolbox/releases/latest) [![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

跨平台超级工具合集：**一套代码，三端运行** —— 网页版（手机 / 电脑浏览器）、Windows 桌面版（EXE）、Android 版（APK）。

> **项目仓库**：<https://github.com/yuyue-2011/omni-toolbox> · 问题反馈与建议请提 [Issue](https://github.com/yuyue-2011/omni-toolbox/issues) · MIT 协议开源

> 🌐 **在线体验（免安装）**：<https://yuyue-2011.github.io/omni-toolbox/> —— 浏览器直接打开即用，手机可「添加到主屏幕」，联网一次后离线可用

包含 **224 款工具**，覆盖 **26 大分类**（含「视频平台」「图书」「学习」「文档」「购物」「通讯」板块），全站 **835 个官网直达站点**（含 83 个 AI 站点，国内 438 + 国际 397），**9 套主题**，所有资源直接打包进**单个 index.html**，可直接分发、双击即用、完全离线。

## 下载安装

成品全部在 [Releases](https://github.com/yuyue-2011/omni-toolbox/releases/latest)，按平台取一个即可：

> 只想试一下？直接用 [在线版](https://yuyue-2011.github.io/omni-toolbox/)，不必下载。

| 平台 | 文件 | 大小 | 用法 |
|---|---|---|---|
| 网页版（通用） | [`3.4.1-index.html`](https://github.com/yuyue-2011/omni-toolbox/releases/latest/download/3.4.1-index.html) | 1.2 MB | 双击即用；手机浏览器打开后可「添加到主屏幕」，联网一次后完全离线 |
| Windows 安装版 | [`Setup-3.4.1.exe`](https://github.com/yuyue-2011/omni-toolbox/releases/latest/download/Setup-3.4.1.exe) | 84.2 MB | 可选安装目录、建桌面快捷方式；被 SmartScreen 拦截时点「更多信息 → 仍要运行」 |
| Windows 绿色版 | [`Portable-3.4.1.exe`](https://github.com/yuyue-2011/omni-toolbox/releases/latest/download/Portable-3.4.1.exe) | 83.8 MB | 免安装、不写注册表，可放 U 盘 |
| Android | [`3.4.1-android.apk`](https://github.com/yuyue-2011/omni-toolbox/releases/latest/download/3.4.1-android.apk) | 5.3 MB | debug 签名，安装需允许「未知来源」 |

下载后建议核对 SHA256（完整清单见 [归档清单.txt](<归档清单.txt>)）：

```
7E3C71B1D09FDF61745F9AAE37435F93F9E65F6E12660287DB152172D99A745D  3.4.1-index.html
AF888E931103C063FD82CCBFEB8495F0652AD558C5629C30DDC8C29BA43A3949  Setup-3.4.1.exe
094B9D24AD8B09F6BCB8F574E52B6710ADCD3A5979193CB137ABB1B9FA079B7B  Portable-3.4.1.exe
DA98B6D8008C831248AF6D2E4AE53A28F4139B59DFBFC50982B64F10130538BC  3.4.1-android.apk
```

> Windows 版未做代码签名，首次运行可能被 SmartScreen 提示，属正常现象；自行编译可用下文「打包 Windows EXE」。

## 工具清单（224 款 / 26 类）

| 分类 | 数量 | 工具 |
|---|---|---|
| 搜索 | 4 | 镜像源导航、聚合搜索、搜索语法、网站导航 |
| 计算 | 16 | 百分比计算、车贷计算、单位换算、房贷计算器、复利计算、个人所得税、进制转换、科学计算器、利润率计算、罗马数字互转、年龄计算、日期计算、社保公积金、油耗费用、折扣计算、BMI 计算 |
| 文本 | 26 | 大小写转换、多语言翻译、高级字数统计、火星文转换、简繁转换、离线常用语、密码强度检测、密码生成器、批量替换、拼音转换、文本对比、文本反转、文本整理、文本重复、行排序去重、字数统计、Base64 编解码、HTML 转 Markdown、JSON 格式化、Lorem 占位文本、URL 编解码、URL Slug 生成、URL 参数解析、命名风格转换、中文数字互转、数字转英文 |
| 编码 | 13 | 二维码生成、凯撒密码、摩斯密码、Base64 文件转码、GZIP 压缩 / 解压、Hex 与文本互转、HTML 转义、JWT 解析、MD5 / SHA 哈希、条形码生成、Base32 编解码、维吉尼亚密码、栅栏密码 |
| 时间 | 8 | 倒计时、纪念日倒计时、节假日速查、秒表、时间戳批量转换、时间戳转换、世界时钟、ISO 周数计算 |
| 随机 | 6 | 抽签抽奖、抽签抽人、随机分组、随机数生成、选择助手、掷骰子 |
| 生活 | 6 | 汇率换算、金额大写、礼物灵感、身份证解析、生肖属相、星座查询 |
| AI | 11 | 标题生成、起名灵感、提示词变量填充、提示词生成器、文本智能处理、AI 工具导航、AI 绘图提示词、AI 模型速查、AI 提问技巧、Prompt 模板库、Token 计数器 |
| 网络 | 10 | 常用端口、代理出口检测、链接解析、网络状态、网速测试、网站状态、延迟检测、子网计算、DNS 解析、IP 信息 |
| 图片 | 7 | 色盲模拟、颜色对比度检测、图片压缩、图片主色、图片转 Base64、颜色拾取、渐变生成器 |
| 视频处理 | 8 | 本地视频播放、封面九宫格、片段截取、视频抽帧、视频截图、视频信息、视频转 GIF、音频提取 |
| 下载 | 4 | 磁力链接解析、批量下载、下载协议、直链下载 |
| 云盘 | 4 | 链接转二维码、提取码生成、网盘横评、网盘链接管理 |
| 数据 | 16 | 词频统计、集合运算、统计计算、文本差异对比、柱状图生成、CSV ↔ JSON 互转、CSV 预览、JSON ↔ YAML 互转、JSON 树查看、JSON 数组转表格、JSONPath 查询、JSON 转 TypeScript、XML ↔ JSON 互转、CRC32 校验、Properties 转 JSON、CSV 转 Markdown |
| 效率 | 6 | 便签、待办清单、番茄钟、记事本、密码保险箱、邮件模板 |
| 学习 | 5 | 国旗速查、记忆闪卡、学习打卡、学习方法库、学习平台导航 |
| 文档 | 4 | 图片转 PDF、文本文件合并、文档格式速查、Markdown 预览 |
| 视频平台 | 5 | 观影清单、类型速查、平台对比、视频平台导航、视频提取下载器 |
| 音乐 | 5 | 节拍器、万能格式转换、我的歌单、音调发生器、音乐平台导航 |
| 图书 | 4 | 书单灵感、图书检索导航、阅读记录本、ISBN 校验 |
| 游戏 | 15 | 2048、猜拳、猜数字、打砖块、打字测速、俄罗斯方块、反应测试、井字棋、记忆翻牌、抛硬币、扫雷、数独、数字华容道、贪吃蛇、桌游记分板 |
| 编程 | 12 | 编程速查表、代码格式化、颜色转换、正则测试、Cron 表达式、HTTP 调试、JS 运行、SQL 格式化、ULID 批量生成、Unicode 转换、UUID 生成、短 ID 生成 |
| GitHub | 5 | 仓库查询、用户查询、最新版本、GitHub 速查、README 预览 |
| 购物 | 6 | 尺码换算、防骗指南、购物清单、快递速查、省钱技巧、退换攻略 |
| 通讯 | 8 | 常用号码、短信模板、国际区号、国内区号、号码归属地、通讯录、消息模板、运营商识别 |
| 系统 | 10 | 特性检测、系统清理、系统信息、性能监视、硬件工具箱、字体检测、ADB 速查、UA 解析、Win 快捷键、Windows 命令 |

（合计 224 款 / 26 类）

## v2.6 新特性

- **新增中英双语（全站）**：设置 → 外观与主题 → 界面语言，一键切换 **中文 / English** 立即生效并持久化记忆；覆盖框架界面（首页 / 分类 / 帮助 / 设置 / 状态栏 / 侧栏 / 搜索）、149 款工具的名称与描述、25 个分类元数据、设置页 6 大区域、完整使用说明书（含 v2.6 更新内容、FAQ 中英双语）；高频工具内部界面同步双语（计算、文本、编码、随机、效率、网络、文档、视频、AI、系统等），英文模式下温度自动转 °F、日期星期用英文格式
- **通讯板块 5 → 8 款**：接入通讯录（联系人管理 / 搜索 / 一键拨号 / JSON 导入导出）、消息模板（短信 / 微信 / 邮件话术）、号码归属地（联网查询归属地与运营商）
- **搜索板块置顶**：搜索移入「日常工具」分组第一位（侧栏与首页分类卡片均置顶）
- **板块排序重排**：按使用频率排列（日常工具 → 网络与AI → 创作与媒体 → 学习与效率 → 影音图书游戏 → 搜索与开发 → 购物与通讯 → 系统工具），搜索置顶日常工具第一位
- **刷新与网络信息修复**：Service Worker 改为主文档网络优先（不再缓存旧页面）；IP 源按国内实测可达性重排（ipip.net 中文地址 → api.ip.sb → ipinfo.io）；代理识别 7 源重配（ipip.net / api.ip.sb / ipinfo.io / Cloudflare Trace / ipwho.is / ipify / ipapi.co）并改为多数一致票选，显著降低误报
- **版本号升级 2.6.0**（帮助页「v2.6 更新内容」章节同步更新）
- 延续 v2.5：146 款基础工具与 311 个官网直达、文档格式转换、视频提取下载器、123云盘、编程 / 系统官网扩量等全部保留

## v2.5 新特性（跳过 2.4，直接升级）

- **新增「文档」板块**：图片转 PDF（多图合成、内置极简 PDF 生成器）、Markdown 实时预览与 HTML/MD 导出、文本文件合并、文档格式速查（常见格式 / 转换路线 / 14 个办公官网直达）
- **视频工具 4 → 8 款**：新增 视频转 GIF（内置 256 色 LZW 编码器，本地逐帧生成）、音频提取（WebAudio 解码为 WAV）、片段截取（Canvas + MediaRecorder 录 WebM）、封面九宫格（平均切分拼图）
- **视频平台新增「视频提取下载器」**：粘贴链接自动识别 16+ 平台（B站 / 抖音 / 快手 / 小红书 / YouTube / TikTok / Netflix 等），给出对应提取方案与下载命令，可一键复制 yt-dlp / BBDown 命令；附通用工具导航
- **官网继续扩量（267 → 311 站）**：
  - 网盘：新增 **123云盘**（123pan.com）
  - 编程：新增 **15 个编程语言官网**（Python、Java/Oracle、Node.js、TypeScript、Go、Rust、C/C++ ISO、PHP、Ruby、Swift、Kotlin、.NET、Dart、R）
  - 系统：新增 **17 个操作系统官网**（Windows、macOS、Ubuntu、Debian、Fedora、Arch、openSUSE、Red Hat、Kali、Linux Mint、Manjaro、Deepin、Android、HarmonyOS 等）
  - 文档：新增分类 15 站（WPS、Microsoft 365、Adobe、福昕、iLovePDF、Smallpdf、LibreOffice、ONLYOFFICE、Calibre、CloudConvert、腾讯文档、语雀、Notion 等）
- **版本号整体升级 2.5.0**（帮助页新增「v2.5 更新内容」章节）
- 延续 v2.3：顶部状态栏/顶栏固定定位不消失、8 大板块分组、官网小窗排列、明暗主题、重置设置、代理识别（7 源）

## 更新日志

### 2026-11-07 — 仓库地址注入与三端重建

- **项目仓库落位**：<https://github.com/yuyue-2011/omni-toolbox>（public，MIT）。地址集中为 [js/core.js](<js/core.js>) 顶部常量 `REPO_URL` / `REPO_NAME`，界面两处引用不重复硬编码：
  - 设置 → ℹ️ 关于：版本信息后新增「· 项目仓库 yuyue-2011/omni-toolbox」外链（新键 `set.aboutRepo`，中英双语）
  - 使用说明书 → 应用简介：新增一段「项目仓库（MIT 协议开源，欢迎 Issue / PR）」外链（新键 `help.repoNote`）
- **元数据**：[package.json](<package.json>) 补 `repository` / `homepage` / `bugs` 三个字段，指向 GitHub 仓库与 Issues 页
- **文档**：README 顶部加仓库地址与 Issue 入口；《归档清单》「项目概况」新增「仓库」一行；两份清单保持字节一致
- **三端重建**：单文件 `index.html` → `www/` → `android/app/src/main/assets/public/` → Windows EXE（Setup + Portable）→ Android APK，产物 SHA256 与体积时间已在《归档清单》刷新
- **校验**：测试链 14 项 + 终检 91 项全过；三端页面哈希一致；工具 224 / 分类 26 / 站点 835 计数未变

### 2026-10-31 — 代码审查与维护修复

- **修复「跟随系统」语言的中英混排**：`isEn()` 由「仅 `lang === 'en'`」改为「`resolvedLang() !== 'zh'`」。此前默认 `auto`（跟随系统）或日 / 韩 / 法 / 德 / 西 / 俄 / 阿等非中文语言时，壳层与工具内部文案会「半中半英」混排；现在统一按实际语言回落英文，与 `t()` 一致
- **Electron 主框架导航加固**：[electron/main.js](<electron/main.js>) 新增 `will-navigate` 拦截，任何非 `file:` 的主框架跳转一律交给系统浏览器打开，应用内不再被站外链接“带走”
- **初始文案更正**：[src/index.html](<src/index.html>) 侧栏 `brandSub` 初始值 `125` → `224 款工具`，消除无 JS 或首屏瞬间显示错误数字（运行时本会纠正，现已从源头对齐）
- **国旗速查注释修正**：[js/tools/flags.js](<js/tools/flags.js>) 头部注释 `92` → `100` 个国家/地区（与实际数据一致，此前仅注释过期）
- **测试脚本完善**：`version-test.js` / `settings-test.js` / `i18n-coverage-test.js` 补齐 `window.scrollTo` 桩，消除 jsdom “Not implemented: scrollTo” 报错与 `version-test` 的 exit 1（断言全过却退出非 0）；`smoke-test.js` 将语言基线钉为中文（修正 `isEn` 后 jsdom 默认 `en-US` 会触发英文壳层的问题）
- **检查脚本清理**：[scripts/check.js](<scripts/check.js>) 排除 `android/`、`_release/`、`_testlog/` 构建产物目录（不再语法检查 `native-bridge.js` 等可再生文件）；[scripts/static-check.js](<scripts/static-check.js>) 删除从未使用的 `shell` 死代码
- **三端产物**：网页版 `index.html` 重建并同步到 `www/` 与 `android/app/src/main/assets/public/`；Windows EXE（Setup + Portable）与 Android APK 均按修复后的单文件重新编译，三端页面哈希完全一致（`0473F42F…`）

### 2026-10-25 — 界面修复与归档整理

- **布局修复**：主内容避开固定状态栏 + 顶栏；移动端顶栏 / 侧栏不再互相遮挡；窄屏状态栏自动隐藏溢出项；设置页语言选择器限制在面板内；工具页收藏 / 分享按钮移入标题行，窄屏与 140% 字号下不再压住面板
- **功能修复**：火星文转换补齐输入 / 输出占位、清空、只读结果、空输入提示与 Ctrl/Cmd+Enter 快捷键；修复字号 / 动效设置刷新后丢失
- **回归保障**：新增 `ui-fix-test.js`（23 项）并挂入测试链第 14 步；Chromium 320–1280px 十档宽度 + 140% 字号实测无重叠 / 无横向溢出
- **三端重打包**：网页版 / Windows EXE / Android APK 均按修复后的单文件重新构建；APK 内嵌页面哈希与 `index.html` 一致
- **归档整理**：清理 `_testlog/` 过期重复日志；`scripts/` 36 个脚本；根目录与 `_release/` 两份《归档清单》同步刷新，新增产物 SHA256 校验

### v3.4.1 — 全图标优化

- **工具图标全覆盖（126 → 224 个）**：为 98 款工具补齐专属图标（计算 / 文本 / 编码 / 时间 / 随机 / 图片 / 数据 / 生活 / 效率 / 网络 / AI / 系统 / 游戏 / 搜索 / 编程 / 视频 / 下载 / 云盘 / GitHub / 通讯共 20 个分类），工具卡片不再回落显示分类图标
- **图标优化去重 9 处**：维吉尼亚（🔐 → 🗝️）、高级字数统计（🔢 → 📊）、URL Slug（🔗 → 🐌）、短 ID（🆔 → 🎫）、ULID（🆔 → 🕰️）、CSV 转换（📊 → 🗃️）、拼音（拼写 → 🔤）、命名风格（🔤 → 🐫）、Lorem（📝 → ✒️），同分类内图标零重复
- **分类图标统一**：26 大分类 SVG 图标全部通过一致性校验（搜索图标补齐 `stroke-linejoin`），首页 / 侧栏 / 卡片逐级统一
- **应用图标重制**：1024 源图裁切为**全出血方形**（消除四角白块，Windows 任务栏 / 快捷方式不再露白边）；新增 `icon-32.png`（浏览器图标）与 `icon-180.png`（Apple Touch）；Windows `.ico` 升级为 **16 / 32 / 48 / 64 / 128 / 256 六帧多尺寸**；PWA 512 maskable 声明随之对齐
- **细节修复**：`sw.js` 中文注释乱码修复、预缓存清单纳入新图标（缓存号 `omnitool-v3.4.1`）；`css/app.css` 2 处残留 CRLF 行规范化
- **回归保障**：`smoke-test.js` 新增「224 款图标全覆盖 + 同分类无重复 + 26 分类 SVG 规范」断言；`release-check.js` 新增 6 项图标体系终检
- **版本号 3.4.1**：`package.json` / `sw.js` 缓存键 / EXE 与 APK 文件名三端同步

### v3.4.0 — 游戏专题（+8 款）

- **工具 216 → 224 款**，游戏分类 7 → **15 款**，新增 8 款游戏：
  - **俄罗斯方块**（Tetris）：10×20 棋盘、7 种方块、旋转 / 软降 / 直落、消行得分、随行数提速、最高分本地保存
  - **打砖块**（Breakout）：40 块砖 × 5 色、挡板反弹角度控制、3 球机会、破碎全部过关、最高分本地保存
  - **数字华容道**（15-Puzzle）：4×4 滑块拼图，随机合法移动打乱保证必定可解，点击 / 方向键均可滑动，最佳步数本地保存
  - **井字棋**（Tic-Tac-Toe）：人机对战，电脑会优先取胜 / 拦截 / 占中角，胜平负统计
  - **猜数字**（Guess the Number）：1-100 猜数，大小提示 + 次数统计 + 最佳成绩本地保存
  - **猜拳**（Rock-Paper-Scissors）：石头剪刀布人机对战，含胜 / 负 / 平统计与连胜
  - **抛硬币**（Coin Flip）：翻面动画 + 正反统计，适合决定谁先手
  - **桌游记分板**（Score Board）：多人计分板，±1 / ±5 快捷调整、删除玩家、重置全部，数据本地保存
- **已有游戏修复**：
  - **贪吃蛇**：修复开局即死（初始蛇身数组与移动方向错位导致的严重 bug）；碰撞检测排除蛇尾、食物吃完再生成、满屏保护
  - **2048**：修复每步生成两个方块（与经典规则不符）；「达成 2048」提示从每步重复变为只弹一次；最高分改为实时更新
  - **扫雷**：修复插旗计数（移除旗子后计数不还原）；新增首点安全（第一次点击永不踩雷）；兑现说明中的「长按插旗」（手机长按 450ms 插旗并拦截误开）
  - **反应测试**：修复第 5 轮后平均分立即被清空的问题（成绩保留到点击开始下一轮）；完成提示不再延迟弹出
  - **打字测速**：修复粘贴文本瞬间完成导致 WPM 为 Infinity 的异常；补上缺失的 `.gt-ok` / `.gt-err` 样式（打错字高亮此前不可见）
- **双语同步**：8 款新游戏全部补齐 `tool.<id>.name` / `.desc` 中英词条 + 日 / 韩 / 法 / 德 / 西 / 俄 / 阿 7 语名称；帮助页「更新内容」同步为 v3.4
- **回归测试**：新增 `game-test.js`（20 项断言）并挂入测试链第 13 步，覆盖 8 款新游戏渲染与交互 + 上述全部修复点
- **计数同步**：README / manifest / package.json / 页面 meta / i18n 帮助页 / 归档清单与全部测试断言同步为 224 款
- **版本号 3.4.0**：`package.json` / `sw.js` 缓存键 / EXE 与 APK 文件名三端同步

### v3.3.0 — 板块重构 + AI 官网补充

- **AI 官网新增 2 站**：**OpenCode**（开源 AI 编程智能体，opencode.ai）与 **OpenRouter**（大模型 API 聚合网关，openrouter.ai）——AI 板块 81 → **83 个站点**，全站 833 → **835 个站点**（国内 438 + 国际 397）
- **侧栏 8 → 9 大板块**，名称 / 归属 / 顺序全面细化：日常工具 → AI 与网络 → 图片与视频 → 资源与数据 → 效率与学习 → 影音 · 阅读 · 游戏 → 编程与开源 → 购物与通讯 → 系统工具
  - 「网络与 AI」更名「**AI 与网络**」并将 AI 分类置前；「创作与媒体」拆分并理顺为「**图片与视频**」「**资源与数据**」；「学习与效率」调整为「**效率与学习**」；「影音 · 音乐 · 图书 · 游戏」精简为「**影音 · 阅读 · 游戏**」；「搜索与开发」定为「**编程与开源**」
  - 分类「视频工具」更名「**视频处理**」（与「视频平台」区分）；同步校准网络 / AI / 数据 / 视频平台 / 音乐 / 游戏等分类描述
- **排序对齐**：`core.js` 的 CATS 注册顺序同步为新展示顺序（首页卡片 / 侧栏 / 分类页 / 归档清单同序）
- **九语同步**：9 大板块新增日 / 韩 / 法 / 德 / 西 / 俄 / 阿 7 语词条，多语言界面不再回落中文
- **计数同步**：README / manifest / package.json / 页面 meta / 帮助页 / 归档清单与全部测试断言同步为 835 站点 / 83 AI 站点 / 9 大板块
- **版本号 3.3.0**：`package.json` / `sw.js` 缓存键 / EXE 与 APK 文件名三端同步

### v3.2.0 — 工具续扩（+10 款）

- **工具 206 → 216 款**，新增 10 款实用工具：
  - **编码**：Base32 编解码（RFC 4648，UTF-8）、维吉尼亚密码（密钥位移）、栅栏密码（Rail Fence）
  - **文本**：中文数字互转（一二三 / 壹贰叁）、数字转英文（万亿级）
  - **数据**：CRC32 校验、Properties 转 JSON（.properties / .ini 双向）、CSV 转 Markdown 表格
  - **图片**：CSS 渐变生成器（线性 / 径向，一键复制）
  - **游戏**：数独（9×9 出题与一键求解）
- **双语同步**：10 款新工具全部补齐 `tool.<id>.name` / `.desc` 中英词条，帮助页「更新内容」同步为 v3.2
- **计数同步**：README / manifest / package.json / 页面 meta / i18n 帮助页 / 归档清单与全部测试断言同步为 216 款
- **版本号 3.2.0**：`package.json` / `sw.js` 缓存键 / EXE 与 APK 文件名三端同步

### v3.1.0 — 工具与站点扩充 + 双语全覆盖

- **工具 196 → 206 款**，新增 10 款实用工具：命名风格转换、URL Slug 生成、HTML 转 Markdown、XML ↔ JSON 互转、JSON 转 TypeScript、罗马数字互转、颜色对比度检测（WCAG）、条形码生成（Code 39，纯 SVG）、短 ID 生成（NanoID 风格）、ISO 周数计算
- **双语全覆盖**：为全部 206 款工具补齐 `tool.<id>.name` / `.desc` 中英词条（含 v2.9 起新增的 39 款），新增 `i18n-coverage-test.js` 并挂入测试链第 12 步，英文界面不再出现中文回退
- **官网 813 → 833 个站点**：为偏薄分类补充 20 个站点（随机 13 → 18、时间 17 → 22、编码 21 → 26、下载 21 → 26），全部落在小众区，保持「国内优先于国际」排序与 URL 去重
- **计数同步**：README / manifest / package.json / 页面 meta / i18n 帮助页 / 归档清单与全部测试断言同步为 206 款 / 833 站点；`make-archive.js` 改为动态读取工具数与脚本数
- **版本号 3.1.0**：`package.json` / `sw.js` 缓存键 / EXE 与 APK 文件名三端同步

### v3.0.1 — 站点整理 + 排序修复

- **AI 小众区加入 Atria Dawn**（https://atria-asi.ai/，国内站点）
- **站点排序修复**：`sitesHtml()` 小众区原先直接拼接「主流溢出 + 小众」，导致主流区放不下的国际站点压住小众区的国内站点；改为小众区整体再次按国内优先排序。现在 26 个分类的主流量与小众量都严格国内先于国际
- **站点去重**：删除 AI 重复的 SenseChat（与「商汤商量」同 URL，合并为「商汤商量 SenseChat」）、vplat 重复的「央视频」（主流区已有）
- **计数修正**：全站 815 → **813** 个站点（主流 284 + 小众 529，国内 429 + 国际 384），AI 板块 62 → **81** 个站点；`manifest.webmanifest` 描述由「80+ 款」改为真实数据
- **归档清单升级**：`make-archive.js` 生成详细版清单（229 行），含逐分类站点统计、AI 站点全名单、脚本一览与验证状态
- **质量**：新增 `sites-final-test.js` 并挂入测试链第 10 步，固化站点去重与「国内优先于国际」排序校验；测试链 11 项全绿、终检 42 项全过

### v3.0 — 竞品取长补短 + AI 大扩充 + 3 端交付

- **工具 185 → 196 款**，对标 DevToys / IT-Tools 补齐 11 款实用工具：
  - **7 款开发者工具**：JSON ↔ YAML 互转（纯本地实现，双向可往返）、GZIP 压缩/解压（浏览器 CompressionStream，输出 Base64）、色盲模拟（4 种色觉缺陷，LMS 矩阵换算 + 结果下载）、Lorem 占位文本（中英文 / 段落句子词）、ULID 批量生成（26 位 Crockford Base32，时间有序）、JSONPath 查询（支持 `$.a[*].b` / `$..key` 递归）、JSON 数组转表格（预览 + 下载 CSV）
  - **4 款 AI 工具**：Token 计数器（三种计数口径 + 128K 上下文占比估算）、AI 绘图提示词（8 风格 × 6 光线组合，自动生成 SD 与 Midjourney 两版提示词）、AI 模型速查（12 款主流大模型上下文与特点对比表）、提示词变量填充（自动解析 `【】` / `{{}}` 占位符并逐个填充）
- **官网 348 → 813 个站点**，每个分类改为「**3 行主流 + 一个「更多」按钮**」交互：
  - 主流站点（国内优先）默认平铺 12 个，小众站点默认折叠，点「还有 N 个小众网站」展开，可再次收起
  - AI 板块大扩充：18 个主流 + 63 个小众站点，覆盖国内国际大模型、AI 绘画/视频/音乐、AI 编程、本地部署、智能体平台与导航资讯
  - 26 个分类全面扩容：系统 12→50、AI 17→84、编程 12→49、学习 12→34、图书 12→33、文档 12→33 等
- **质量**：修复上一会话遗留的 3 处问题——`src/index.html` 中 `more7.js` 重复引用、帮助页声称 9 款新工具但 3 款 AI 工具从未实现（文案与代码不符）、smoke-test 期望值与注册表不一致；全部统一为注册表真实数据
- **交付 3 个版本**：网页单文件（index.html）/ 单文件 EXE（portable）/ 安装版 EXE（NSIS）/ Android APK

### v2.9.1 — 差异化新工具 + 新主题 + 全面美化

- **工具 181 → 185 款**，补回 4 款与既有工具**完全差异化**的新工具：
  - **时间戳批量转换**（时间）：一次粘贴多行时间戳（秒 / 毫秒自动识别），批量输出本地时间 + 星期表格，可一键复制全部日期
  - **密码强度检测**（文本）：评估密码熵值、字符集规模与暴力破解预估时间，4 格强度条 + 逐条改进建议，内置常见密码命中提示（本地计算不上传）
  - **Base64 文件转码**（编码）：拖入任意文件即转 Data URL，显示文件名 / 类型 / 大小；反向粘贴 Base64 解码并下载还原文件
  - **URL 参数解析**（文本）：拆解完整 URL 为协议 / 主机 / 路径 / 查询串 / 锚点，查询参数自动解码为键值对表格 + JSON，附示例
- **2 套新主题**：琥珀暖橙（暖色系）、海洋蓝（深青色系），主题总数 7 → **9 套**
- **界面全面美化**：定制滑块（轨道填充 + 圆形滑块 + 悬停放大）、表格行悬停高亮、面板标题左侧渐变装饰条、自定义滚动条、空状态 emoji 弹入动画、成功 / 失败提示框加底色与边框、输入框聚焦光环、统计卡片悬停微提升、分段按钮选中态增强、主题色卡悬停动效
- **质量**：新增 4 款工具专项实测（26 项断言）；全部 185 款工具通过逐工具交互测试、重名 / 重 id 扫描为 0、26 项设置实测全绿

### v2.9.0 — 新工具 + 新主题 + 美化设置

- **工具 157 → 181 款**，新增 24 款实用工具：
  - 数据：JSON 树查看、CSV ↔ JSON 互转、集合运算、柱状图生成、文本差异对比
  - 编码：Hex 与文本互转、HTML 转义、JWT 解析
  - 文本：拼音转换、简繁转换、火星文、高级字数统计、文本反转、文本重复
  - 计算：个税 / 社保 / 车贷 / 利润率 / 折扣计算器
  - 时间：纪念日倒计时；随机：抽签抽人
  - 编程：UUID 生成、Cron 表达式、SQL 格式化
- **官网导航 +45 站点**，全站达到 348 个官网直达（26 大类）
- **2 套新主题**：紫罗兰（紫金配色）、赛博朋克（霓虹青），主题总数 7 套
- **美化设置增强**：新增界面字号缩放滑块（80%–140%，实时生效）与动效开关（关闭后全局禁用动画，更省电）
- **质量**：新增重名 / 重 id 自检与质量扫描（scan.js），清理 4 款与既有工具功能重复的新工具、1 段死代码；全部 181 款工具通过逐工具交互测试

### v2.8.0 — 修复 + 美化 + 完善

**Bug 修复（4 个真实崩溃级 bug，全部由新增的深度交互测试发现）**

| 工具 | 问题 | 修复 |
|---|---|---|
| 节拍器 | 点“开始”必崩：`Cannot read properties of null (reading 'currentTime')`——`startMetro()` 从未创建 AudioContext | 点开始时先建音频上下文，`tick()` 内判空；不支持音频时提示而非崩溃 |
| 节拍器 / 音调发生器 | 切走工具后声音不停 | `render` 返回 cleanup，切换页面即停声 |
| 网速测试 | 切走后异步回调操作已移除的 DOM 报 null | 所有回调加 `guard()` 守卫，切走时中止下载 |
| 贪吃蛇 | 清理时报 `skKey is not defined`（命名函数表达式作用域） | 改为具名函数声明再注册 / 注销 |

**美化（CSS 视觉升级）**
- 卡片分层阴影，悬浮上移 + 主色描边 + 顶部渐隐光晕
- 主按钮渐变填充 + 投影，按压回弹；标题主色渐变文字
- 分区标题左侧渐变指示条；输入聚焦改用主题色光环（各主题独立调色）
- 页面切换 / 面板平滑入场动画，尊重 `prefers-reduced-motion`
- Logo 悬浮回弹旋转

**功能完善（延续“工具箱”意图）**
- **工具收藏**：工具页 ☆ 一键收藏，首页“我的收藏”分区直达，设置页可清空，持久化 localStorage
- **分享链接**：工具页复制直达链接（带 `execCommand` 降级）
- **回到顶部**：滚动超一屏后出现的悬浮按钮
- 新增三个自检脚本：`deep-test`（181 款工具逐个填输入 + 点按钮 + 堆栈级捕获）、`static-check`（注册一致性 / id 冲突 / 未转义注入扫描）、`fav-test`（收藏端到端）
- PWA 缓存版本同步至 v2.8.0

## 项目结构

```
万能工具箱/
├── index.html            单文件产物（1.2 MB，可直接分发，自带全部 CSS/JS）
├── src/index.html        多文件开发模板（修改后运行构建生成 index.html）
├── css/app.css           样式（主题 / 液态玻璃 / 状态栏 / 明暗 / 官网小窗等）
├── js/core.js            框架：路由 / 注册表 / 状态栏(7源代理识别) / 设置 / 帮助 / 官网导航 / 分组 / 分类元信息（CATS 内含 835 个官网站点）
├── js/i18n.js            中英双语文案（含帮助页更新日志）
├── js/i18n-more.js       多语言扩展词条
├── js/sites.js           官网站点镜像数据（仅核对参考，唯一数据源为 core.js 的 CATS）
├── js/tools/*.js         工具实现，共 40 个文件 / 224 款工具（26 个分类文件 + more1–more10 等增量补丁，含 comm.js）
├── js/vendor/qrcode.js   二维码库（MIT，qrcode-generator）
├── icons/                应用图标（png / ico）
├── manifest.webmanifest  PWA 清单（手机可“添加到主屏幕”）
├── sw.js                 Service Worker（离线缓存，缓存键随版本号更新）
├── electron/main.js      Electron 主进程（EXE）
├── capacitor.config.json Capacitor 配置（APK）
├── android/              Android 原生工程（Capacitor，含 gradle 配置）
├── www/                  Capacitor webDir（与 index.html 同步，APK 资源源）
├── scripts/              构建 / 测试 / 打包脚本（见下文「脚本一览」）
├── dist-exe/             EXE 打包输出目录（构建产物，不入库）
├── _release/             归档清单输出目录（根目录同名文件与之同步）
└── _testlog/             测试日志输出目录（构建产物，不入库）
```

## 使用方法

### 1. 网页版（手机 + 电脑通用）

直接双击 `index.html` 即可使用；或把文件放到任意静态服务器 / 网盘分享给他人。

- 手机浏览器（Chrome / Edge）打开后可「添加到主屏幕」，像 App 一样全屏使用
- 联网打开过一次后自动缓存，之后可完全离线使用
- 需要联网的工具（网络 / 天气 / GitHub / 部分下载）在卡片上有「联网」徽标，其余全部本地运行

### 2. 开发与重新构建单文件

```bash
npm install
node scripts/build-single.js                      # 将 src/index.html + css + js 打包为单文件 index.html
node scripts/run.js scripts/final-test.js final    # 完整测试链（14 项，见下表）
node scripts/run.js scripts/release-check.js release  # 终检（91 项）
```

> PowerShell 下直接跑 node 脚本会吞掉中文输出，统一用 `node scripts/run.js <脚本> <日志名>` 包装，输出写 `_testlog/<日志名>.log`。

### 3. 打包 Windows EXE

需要 Node.js ≥ 18，在项目目录执行：

```bash
npm install
node scripts/build-exe.js     # 推荐：输出重定向到 _testlog/electron-build.log，避开管道 EPIPE
# 或 npm run build:exe
```

产物在 `dist-exe/`：
- `万能工具箱-Setup-3.4.1.exe` —— 安装版（可自选安装目录、创建桌面快捷方式）
- `万能工具箱-Portable-3.4.1.exe` —— 绿色免安装版

> 国内网络下载 Electron 慢时：执行前设置 `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/` 与
> `ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/`。

> 若 `dist-exe/win-unpacked` 被外部进程占用（杀软扫描、资源管理器预览等）导致 `The process cannot access the file`，
> 可改道到临时输出目录构建，再把产物搬回 `dist-exe/`：
>
> ```bash
> node node_modules/electron-builder/out/cli/cli.js --dir --x64 --config.directories.output=dist-exe-build
> node scripts/patch-exe.js dist-exe-build/win-unpacked/万能工具箱.exe
> node node_modules/electron-builder/out/cli/cli.js --prepackaged "$(pwd)/dist-exe-build/win-unpacked" --win nsis portable --x64 --config.directories.output=dist-exe-build
> cp dist-exe-build/*.exe dist-exe/
> ```

### 4. 打包 Android APK

需要 Node.js + JDK 17（实测 JDK 21 亦可）+ Android SDK（需 `platforms;android-34` 与 `build-tools;34.0.0`）：

```bash
npm install
node scripts/sync-www.js   # 先把单文件产物同步到 www/（Capacitor webDir）
node scripts/build-apk.js   # cap sync android + gradlew assembleDebug，日志写 _testlog/apk-build.log
# 或 npm run apk:build
```

APK 输出在 `android/app/build/outputs/apk/debug/`。或用 Android Studio 直接打开 `android/` 目录，等待 Gradle 同步完成后点击 Run / Build APK。

> 改过网页后须重新执行 `node scripts/sync-www.js`（把单文件产物复制到 `www/`，即 Capacitor 的 webDir）。

**Windows 实战备忘（均已踩过并解决）**：
- 项目路径含中文时 AGP 8 会直接拒绝构建，在 `android/gradle.properties` 加 `android.overridePathCheck=true` 即可绕过
- SDK 未随 Android Studio 安装时，可单独下载 command-line tools 解压到无中文路径（如 `D:\AndroidSDK\cmdline-tools\latest`），再 `sdkmanager --licenses` + 安装组件，最后在 `android/local.properties` 写 `sdk.dir=D\:\\AndroidSDK`
- Capacitor 6 的 CLI 入口是 `node_modules/@capacitor/cli/bin/capacitor`（**无 `.js` 后缀**），引用 `bin/capacitor.js` 会报 MODULE_NOT_FOUND

## 开发说明

- 纯前端实现：HTML + CSS + 原生 JavaScript，无框架
- 状态栏 / 顶栏 / 侧栏使用 fixed 固定定位（`--sb-h` 状态栏高度 + `--topbar-h` 顶栏高度占位），滚动不消失
- 工具通过 `Toolbox.register({...})` 注册，hash 路由：`#/` 首页、`#/cat/<分类>`、`#/tool/<工具>`、`#/help` 说明书、`#/settings` 设置
- 每分类元信息（颜色 / SVG 图标 / 官网站点）集中在 `js/core.js` 的 `CATS` 数组；官网卡片样式由 `settings.sitesMode`（win 小窗 / card 标准卡片）控制
- 视频转 GIF / 图片转 PDF / 音频提取 / 片段截取均为**内置实现**（GIF 256 色 LZW 编码器、极简 PDF 生成器、PCM WAV 编码、Canvas+MediaRecorder），无第三方依赖
- 数据存储：待办 / 记事本 / 密码保险箱 / 观影清单 / 闪卡 / 打卡 / 设置等使用浏览器 localStorage，仅存本机
- 哈希算法（MD5/SHA-1/SHA-256）为内置纯 JS 实现；二维码使用 qrcode-generator（MIT）
- 网络类工具直连公开 API（ipapi.co / ipinfo.io / open-meteo / api.github.com 等），失败时自动降级或友好提示，不收集任何数据
- 代理识别为本地启发式判断（7 源对比出口 IP + 延迟），结果仅供参考
- 视频提取下载器仅做链接识别与方案速查（浏览器 CORS 限制，不直接抓取视频流），请遵守平台规则与版权法规
- **持续集成**：`.github/workflows/ci.yml` 在每次 push / PR 时跑两个任务——① **快速门禁**（零依赖，约 30 秒）：`check.js` 语法、`release-check.js` 交付终检、`sites-final-test.js` 站点去重与国内优先排序；② **渲染与交互测试**（需 jsdom，约 5 分钟）：`smoke-test` 224 款工具渲染、`static-check` 注入与注册一致性、`dup-check` 重名重 id、`i18n-coverage-test` 双语覆盖。本地等价命令：`npm run check`、`npm test`

## 常见问题

- **顶部状态栏会滚出屏幕？** v2.3 起已改为固定定位，滚动始终停靠顶部；若仍异常请刷新页面或升级到最新版本
- **EXE 打不开 / 被杀毒软件拦截**：未签名应用首次运行可能被 SmartScreen 拦截，点“更多信息 → 仍要运行”即可
- **APK 编译失败**：逐项检查 ① `JAVA_HOME` 指向 JDK 根目录（含 `bin/javac.exe`）；② `ANDROID_HOME` 或 `android/local.properties` 指向含 `platforms/android-34` 的 SDK；③ 项目路径含中文时须在 `android/gradle.properties` 加 `android.overridePathCheck=true`；④ 确认 `node_modules/@capacitor/cli` 已安装（入口为 `bin/capacitor`，无后缀）
- **状态栏 IP / 天气不显示**：需要联网；公网 IP 走 ipapi.co → ipinfo.io → ip-api.com 三通道自动降级，天气走 open-meteo，均带本地缓存
- **代理标记显示“无法检测”？**：已扩展为 7 个独立出口源（含国内可达的 ipip.net），任一成功即出结果；若仍提示，说明网络整体受限，可点 ⟳ 重试
- **视频转 GIF 很慢？** 建议总帧数 ≤ 120（如 10fps × 12 秒），输出宽度 320 即可满足表情包需求
- **音频提取只支持 WAV？** 是的，内置编码器输出无损 WAV（体积较大），需要 MP3 可用系统工具转换
- **图片转 PDF 中文正常吗？** 该工具以 JPEG 图片方式嵌入页面，文字以图片呈现，无字体问题
- **官网卡片想换样式？** 设置 → 官网导航 → 官网卡片样式，在小窗口 / 标准卡片之间切换
- **改乱了设置怎么办？** 设置 → 设置与数据 →「重置设置」一键恢复默认，不影响业务数据
- **换了电脑数据没了**：待办 / 记事本等数据存在浏览器本地，属预期行为，请勿存放重要机密

## 脚本一览（scripts/）

**构建类**

| 脚本 | 作用 |
|---|---|
| `build-single.js` | 将 `src/index.html` + `css` + `js` 内联为单文件 `index.html` |
| `sync-www.js` | 把单文件产物同步到 `www/`（Capacitor webDir），供 APK 打包 |
| `build-exe.js` | electron-builder 完整打包（`--dir` → patch-exe 注入图标/版本 → `--prepackaged`），日志写 `_testlog/electron-build.log` |
| `build-apk.js` | cap sync android + gradlew assembleDebug，日志写 `_testlog/apk-build.log` |
| `make-icons.js` | 由源图生成各尺寸图标 |
| `patch-exe.js` | electron-builder 产物改名 / rcedit 调整（可传入自定义 exe 路径作为第 1 个参数） |
| `make-archive.js` | 生成 `_release/归档清单.txt`（半归档用，见下节） |

**测试链（`final-test.js` 依次调用，任一失败即整体退出非 0）**

| # | 脚本 | 覆盖 |
|---|---|---|
| 1 | `check.js` | 全部 JS 语法检查 |
| 2 | `static-check.js` | 注入 / id 冲突 / 注册一致性 |
| 3 | `smoke-test.js` | 224 款工具渲染 + 26 分类 + 9 组 + 中英 + 明暗 + 重置 |
| 4 | `deep-test.js` | 逐工具填输入 + 点按钮 + 堆栈级报错捕获 |
| 5 | `settings-test.js` | 帮助页与设置项实测 |
| 6 | `new-tools-test.js` | v2.9.1 四款新工具 |
| 7 | `ai-tools-test.js` | 4 款 AI 工具（29 断言） |
| 8 | `v3-tools-test.js` | 11 款 v3.0 新工具（含 ULID 时间有序） |
| 9 | `sites-more-test.js` | 26 分类「3 行主流 + 更多」展开/收起（含 `getComputedStyle` 断言） |
| 10 | `sites-final-test.js` | 站点去重 / 国内优先于国际 / 计数与文档一致 |
| 11 | `dup-check.js` | 重名 / 重 id 扫描 |
| 12 | `i18n-coverage-test.js` | 224 款工具中英名称 / 描述键全覆盖 |
| 13 | `game-test.js` | 15 款游戏渲染 / 交互 + 修复回归（20 断言） |
| 14 | `ui-fix-test.js` | 布局 / 状态栏 / 按钮位置 / 火星文 / 设置持久化（23 断言） |

**终检与辅助**

| 脚本 | 作用 |
|---|---|
| `release-check.js` | 91 项交付前终检（版本号 / www 一致性 / README 数据 / 工具表 / 图标体系） |
| `run.js` | PowerShell 下统一包装，输出写 `_testlog/<名>.log`（解决中文输出被管道吞掉） |
| `run-tests.js` | 快速回归：smoke + deep + ui-fix 三个测试并归档日志（完整链路请用 `final-test.js`） |
| `dump-tools.js` | 从构建产物读取真实注册表，生成 README 工具表（轮询等待注册完成） |
| `fav-test.js` | 收藏功能端到端 |
| `test-vectors.js` | 哈希 / 二维码标准向量回归 |
| `version-test.js` | 版本号在界面各处正确显示 |
| `sites-count.js` / `sites-dump.js` | 站点统计与清单导出 |
| `state-check.js` / `list-ids.js` / `load-errors.js` | 版本与计数核查 / 工具 id 列表 / 加载错误捕获 |
| `sites-final-test.js` | 站点去重 / 国内优先 / 计数一致性（也挂在测试链第 10 步） |
| `diag-font.js` / `diag-yaml.js` | 字号缩放诊断 / json-yaml 转换诊断（开发期定位问题用） |

> `scripts/` 现存 36 个脚本，全部保留。

## 半归档说明

本次（2026-10-31）维护修复整理，已按「可交付源码」状态归档：

- **2026-10-31 维护修复归档**：修复「跟随系统」语言下中英混排（`isEn()` 改按 `resolvedLang()` 判定）、Electron 主框架导航拦截、侧栏初始工具数 224、国旗速查注释 92→100；`version-test` / `settings-test` / `i18n-coverage-test` 补齐滚动桩并消除 exit 1、`smoke-test` 固定中文基线、`check.js` 排除构建产物目录、`static-check.js` 清理死代码；网页版 `index.html`、Windows EXE（Setup + Portable）、Android APK 三端均按修复后的单文件重新构建（三端页面哈希一致，`0473F42F…`）；README、帮助页 i18n 更新日志、`make-archive.js` 验证状态、两份《归档清单》已同步
- 删除了 11 个一次性 / 已被覆盖的脚本（旧版包装 run-*、单次数据迁移 _*、调试专用 scan*），`scripts/` 现存 36 个
- 新增 `.gitignore`（忽略 `node_modules/`、`dist-exe/`、`_testlog/`、`_release/`、APK 与 EXE 产物、Android 构建目录与 `local.properties`）
- 新增 `scripts/make-archive.js`，生成 `_release/归档清单.txt`（详细版）：项目概况、四个分发产物及体积 / 时间 / SHA256、三端使用方法、逐分类工具与站点统计、AI 分类 83 个站点全名单、源码结构、36 个脚本一览、重新构建命令、Windows 实战备忘、验证状态
- `_testlog/` 内为历史测试日志，仅保留关键日志（final / release / smoke / deep / ui-fix / apk-build / electron-build / build-single / sync-www / v3-tools / sites-more）与 `tools.md`，可随时整体清空（脚本本身在 `scripts/`，重跑即重新生成）
- **v3.4.1 图标复检**：完整测试链 14 项 + 终检 91 项 + 三端页面/产物一致性全部复核通过；224 款工具图标全覆盖、26 分类 SVG 统一、应用图标全出血重制；`scripts/` 36 个；`_testlog/` 精简为关键日志；两份《归档清单》（根目录 + `_release/`）同步刷新且完全一致
- **2026-10-25 界面修复归档**：完整测试链 14 项 + 终检 91 项通过；网页 / EXE / APK 三端产物重新打包（APK 内嵌页面哈希与源码一致）；`scripts/` 36 个；`_testlog/` 精简为关键日志；两份《归档清单》同步刷新并新增产物 SHA256 校验

当前状态：**224 款工具 / 26 大类 / 835 个官网站点 / 224 个工具图标全覆盖**，测试链 14 项全绿、终检 91 项全过。
