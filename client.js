const WebSocket = require('ws');
const readline = require('readline');

const SERVER_IP = '10.232.111.189'; // ← 电脑的局域网 IP
const PORT = 8080;

const ws = new WebSocket(`ws://${SERVER_IP}:${PORT}`);

const ts = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '  平板> '
});

console.log('┌──────────────────────────┐');
console.log('│   LAN Chat  ·  平板端     │');
console.log('└──────────────────────────┘');
console.log(`  连接至 ${SERVER_IP}:${PORT} ...\n`);

ws.on('open', () => {
  console.log(`  [${ts()}] + 已连接到电脑\n`);
  rl.prompt();
});

ws.on('message', (data) => {
  process.stdout.write('\r\x1b[K');
  console.log(`  [${ts()}] 电脑  ${data}`);
  rl.prompt();
});

ws.on('close', () => {
  console.log(`\n  [${ts()}] - 连接已断开`);
  process.exit(0);
});

ws.on('error', (err) => {
  console.error(`\n  连接失败: ${err.message}`);
  process.exit(1);
});

rl.on('line', (input) => {
  const msg = input.trim();
  if (!msg) { rl.prompt(); return; }
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
  }
  rl.prompt();
});