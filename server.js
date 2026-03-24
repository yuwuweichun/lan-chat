const { WebSocketServer } = require('ws');
const readline = require('readline');

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
const clients = new Set();

const ts = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '  电脑> '
});

console.log('┌──────────────────────────┐');
console.log('│   LAN Chat  ·  电脑端     │');
console.log('└──────────────────────────┘');
console.log(`  端口 ${PORT} · 等待平板连接...\n`);

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`  [${ts()}] + 平板已连接\n`);
  rl.prompt();

  ws.on('message', (data) => {
    process.stdout.write('\r\x1b[K');
    console.log(`  [${ts()}] 平板  ${data}`);
    rl.prompt();
  });

  ws.on('close', () => {
    process.stdout.write('\r\x1b[K');
    console.log(`  [${ts()}] - 平板已断开\n`);
  });
});

rl.prompt();

rl.on('line', (input) => {
  const msg = input.trim();
  if (!msg) { rl.prompt(); return; }
  clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
  rl.prompt();
});