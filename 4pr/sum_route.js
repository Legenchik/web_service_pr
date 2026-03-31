const http = require('http');

const port = process.argv[2];

if (!port) {
  console.error('Будь ласка, вкажіть порт як перший аргумент.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const fullUrl = new URL(req.url, `http://localhost:${port}`);
  const pathname = fullUrl.pathname;
  const searchParams = fullUrl.searchParams;

  if (pathname === '/sum' && req.method === 'GET') {
    const aStr = searchParams.get('a');
    const bStr = searchParams.get('b');

    const a = parseFloat(aStr);
    const b = parseFloat(bStr);

    if (aStr === null || bStr === null || isNaN(a) || isNaN(b)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Invalid numbers" }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ sum: a + b }));
    }
  } 
  else if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Manual HTTP Router');
  } 
  else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});