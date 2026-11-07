/* ============================================================
   万能工具箱 · Electron 主进程
   作用：把网页版包装为 Windows 桌面应用（EXE）
   ============================================================ */
'use strict';

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 360,
    minHeight: 560,
    icon: path.join(__dirname, '..', 'icons', 'icon.png'),
    backgroundColor: '#121417',
    autoHideMenuBar: true,
    title: '万能工具箱',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));

  /* 外部链接用系统浏览器打开，不在应用内跳转 */
  win.webContents.setWindowOpenHandler(function ({ url }) {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  /* 阻止主框架导航离开本地页面：非 file: 地址改由系统浏览器打开 */
  win.webContents.on('will-navigate', function (e, url) {
    if (!/^file:/i.test(url)) {
      e.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });
}

app.whenReady().then(function () {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
