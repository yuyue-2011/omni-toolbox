/* APK 构建包装：cap sync android → gradlew assembleDebug
   PowerShell 禁止 .ps1，所有步骤直接用 node.exe / gradlew 调用 */
var { execFile } = require('child_process');
var fs = require('fs');
var root = require('path').join(__dirname, '..').replace(/\\/g, '/');
var NODE = process.execPath;
var log = fs.createWriteStream(root + '/_testlog/apk-build.log', { flags: 'w' });

function step(label, file, args, cwd, cb) {
  console.log('→ ' + label);
  log.write('=== ' + label + ' ===\n');
  var child = execFile(file, args, { cwd: cwd, encoding: 'utf8', maxBuffer: 1024 * 1024 * 64, windowsHide: true });
  child.stdout.on('data', function (d) { log.write(d); });
  child.stderr.on('data', function (d) { log.write(d); });
  child.on('close', function (code) {
    log.write('\n[exit ' + code + ']\n\n');
    if (code !== 0) { console.error('✗ ' + label + ' 失败 exit=' + code + '，详见 _testlog/apk-build.log'); process.exit(code || 1); }
    console.log('✓ ' + label);
    cb();
  });
}

step('cap sync android', NODE, [root + '/node_modules/@capacitor/cli/bin/capacitor', 'sync', 'android'], root, function () {
  step('gradlew assembleDebug', 'cmd.exe', ['/c', 'gradlew.bat', 'assembleDebug'], root + '/android', function () {
    console.log('✓ APK 构建完成，日志见 _testlog/apk-build.log');
  });
});
