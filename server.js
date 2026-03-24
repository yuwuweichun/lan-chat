const { WebSocketServer } = require('ws');
const readline = require('readline');

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });
const clients = new Set();

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

const logo = [
  `${c.cyan}${c.bold}  ██╗      █████╗  ███╗   ██╗     ██████╗ ██╗  ██╗  █████╗  ████████╗${c.reset}`,
  `${c.cyan}${c.bold}  ██║     ██╔══██╗ ████╗  ██║    ██╔════╝ ██║  ██║ ██╔══██╗ ╚══██╔══╝${c.reset}`,
  `${c.cyan}${c.bold}  ██║     ███████║ ██╔██╗ ██║    ██║      ███████║ ███████║    ██║    ${c.reset}`,
  `${c.cyan}${c.bold}  ██║     ██╔══██║ ██║╚██╗██║    ██║      ██╔══██║ ██╔══██║    ██║    ${c.reset}`,
  `${c.cyan}${c.bold}  ███████╗██║  ██║ ██║ ╚████║    ╚██████╗ ██║  ██║ ██║  ██║    ██║    ${c.reset}`,
  `${c.cyan}${c.bold}  ╚══════╝╚═╝  ╚═╝ ╚═╝  ╚═══╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝   ${c.reset}`,
  `${c.gray}                         local-area-network chat${c.reset}`,
  '',
  `${c.gray}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠶⠛⠋⠉⠐⠻⣷⣊⠉⠀⠀⠯⣔⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠈⠙⢤⣶⣋⣀⣀⠁⠀⠙⠢⣄⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣄⣀⡀⠀⠀⠁⠢⢄⠑⣤⡀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠋⠀⡀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠄⠀⠀⠀⠙⣄⠈⣙⠲⢤⡀⠀⠑⢌⣻⣄⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⢠⠎⠀⡠⡾⠀⠀⠀⠀⠀⢀⣤⠖⠉⠀⠀⠀⠀⣠⠖⠉⠣⠈⠑⠀⠈⠑⠄⠀⠉⢿⣦⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⣞⣠⠞⡰⠁⠀⠀⡀⣠⣾⠟⠁⠀⠀⠀⠀⢰⠞⠀⠀⡄⠀⡀⠘⣄⠀⠀⠢⡀⢀⠢⠙⣧⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⢸⣿⢇⡴⠁⠀⡆⠈⢠⡿⠛⢳⡄⢀⠇⠀⢠⠞⠀⠀⢰⠁⠀⢧⠀⢻⠱⣦⢰⡞⢧⣀⠀⠘⣧⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⡼⢡⣿⠃⠀⢠⡇⣰⠋⠀⢰⠏⢠⠏⠀⣰⠋⠀⠀⢠⡟⠀⠘⠀⠇⢸⠀⠈⢻⡳⡤⣈⣷⠀⠸⣆${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⢸⣷⣏⡇⠀⠀⢸⢠⢿⠟⠀⣏⡴⢃⡄⢠⠃⠀⠀⠀⢸⠃⠀⠀⠀⠀⢸⡇⠘⡇⠹⣼⠀⢻⠀⡄⢸${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠈⡟⢸⠁⣰⡇⣸⠘⢦⠤⢶⡏⢀⡼⡇⢸⠀⠀⠀⢀⡏⠀⠀⠀⠀⡀⣼⣧⠀⡇⠀⠈⣦⡼⠀⣇⢸${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⡇⠈⣰⠋⡇⡟⠀⠀⢰⣿⣁⡾⠁⢹⣼⣧⡇⠀⡜⠀⠀⣠⠆⣼⣰⢿⣿⢰⠇⠀⣸⠏⣰⢀⣿⣿${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⢣⣰⣿⡀⢹⣿⠀⠀⣾⣿⣿⣟⣒⣺⣿⢼⣧⣼⠁⣠⣶⠏⣰⣿⣯⣼⣿⣿⠀⣴⣯⣴⡿⣼⠹⡿${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⢻⣿⣧⢠⣿⡀⣸⡏⠿⢿⣿⣿⠙⠻⠆⣿⣧⣾⣿⣯⣴⣿⣿⡟⠻⣿⣷⣾⣿⣿⢿⣿⠃⢰⠇${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣧⡻⣇⣿⣿⣄⠀⠈⠁⠀⠀⣸⡿⢋⠟⣹⡿⠋⠛⠛⠁⢠⣿⣿⣿⣿⡇⣸⠃⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣮⡻⣷⢤⣀⠀⠸⠟⠁⠀⠜⠁⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⡇⠁⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⠿⠮⢽⣿⣦⡀⠁⠀⠀⠀⠀⣰⠄⠀⠈⢉⣡⣾⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠾⠉⠀⠀⠀⠀⠀⠉⢻⡶⠦⠀⠀⠄⠅⠀⠐⠚⣻⣿⣿⣿⣿⣿⢛⡏⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⠀⠀⢀⡴⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡒⠀⠀⠀⢀⣠⣶⣿⣿⣿⡿⠋⣿⠋⠘⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⠀⠀⢀⣠⠎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣦⡤⠖⠉⠉⠟⣹⠟⠋⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⢀⠴⠊⣹⡟⠀⠀⣰⢾⣿⣷⣆⠀⠀⠀⠀⠀⢀⡿⠛⠃⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⢠⠎⠀⣰⣿⡇⠀⡷⣿⠿⠿⣟⣿⠀⠀⠀⠀⠀⣼⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠀⠀⠀⣠⣿⣿⡇⠀⢿⣮⣗⠒⠛⠁⠀⠀⠀⠀⠸⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⠘⠛⠛⣿⣿⣿⡇⠀⠈⠣⠀⠀⠀⠀⠀⠀⢀⣄⣴⢿⣿⣿⡌⠑⠢⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
  `${c.gray}      ⢸⡆⢸⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⡏⠀⠻⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀${c.reset}`,
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '  server> ',
});

logo.forEach(line => console.log(line));
console.log(`\n  ${c.gray}[ SERVER ]  port ${PORT}  ·  waiting for client...${c.reset}\n`);

wss.on('connection', (ws) => {
  clients.add(ws);
  process.stdout.write('\r\x1b[K');
  console.log(`\n  ${c.green}${c.bold}[${ts()}]  ●  client connected${c.reset}\n`);
  rl.prompt();

  ws.on('message', (data) => {
    process.stdout.write('\r\x1b[K');
    console.log(`  ${c.gray}[${ts()}]${c.reset}  ${c.cyan}client${c.reset}  ${data}`);
    rl.prompt();
  });

  ws.on('close', () => {
    clients.delete(ws);
    process.stdout.write('\r\x1b[K');
    console.log(`\n  ${c.red}${c.bold}[${ts()}]  ○  client disconnected${c.reset}\n`);
    rl.prompt();
  });
});

rl.prompt();

rl.on('line', (input) => {
  const msg = input.trim();
  if (!msg) { rl.prompt(); return; }
  clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
  console.log(`  ${c.gray}[${ts()}]${c.reset}  ${c.gold}you${c.reset}     ${msg}`);
  rl.prompt();
});
