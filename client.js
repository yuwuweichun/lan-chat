const WebSocket = require('ws');
const readline = require('readline');
const { greet } = require('./greeter');

const SERVER_IP = '10.232.111.189'; // ← server LAN IP
const PORT = 8080;

const ws = new WebSocket(`ws://${SERVER_IP}:${PORT}`);

const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });

const c = {
  reset: '\x1b[0m',
  bold:  '\x1b[1m',
  cyan:  '\x1b[96m',
  green: '\x1b[92m',
  red:   '\x1b[91m',
  gold:  '\x1b[33m',
  gray:  '\x1b[90m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '  client> ',
});

greet(`[ CLIENT ]  connecting to ${SERVER_IP}:${PORT}...`);

ws.on('open', () => {
  process.stdout.write('\r\x1b[K');
  console.log(`\n  ${c.green}${c.bold}[${ts()}]  ●  connected to server${c.reset}\n`);
  rl.prompt();
});

ws.on('message', (data) => {
  process.stdout.write('\r\x1b[K');
  console.log(`  ${c.gray}[${ts()}]${c.reset}  ${c.cyan}server${c.reset}  ${data}`);
  rl.prompt();
});

ws.on('close', () => {
  console.log(`\n  ${c.red}${c.bold}[${ts()}]  ○  disconnected${c.reset}`);
  process.exit(0);
});

ws.on('error', (err) => {
  console.error(`\n  ${c.red}connection failed: ${err.message}${c.reset}`);
  process.exit(1);
});

rl.on('line', (input) => {
  const msg = input.trim();
  if (!msg) { rl.prompt(); return; }
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
    process.stdout.write('\x1b[1A\x1b[2K');
    console.log(`  ${c.gray}[${ts()}]${c.reset}  ${c.gold}you${c.reset}     ${msg}`);
  }
  rl.prompt();
});
