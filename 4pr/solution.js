const http = require('http');

const port = process.argv[2];

if (!port) {
  console.error('Будь ласка, вкажіть порт як перший аргумент.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Manual HTTP Router');
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});