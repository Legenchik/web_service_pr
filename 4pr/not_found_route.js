const http = require('http');

const port = process.argv[2];

if (!port) {
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Manual HTTP Router');
  } 
  else if (url.pathname === '/time' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ now: new Date().toISOString() }));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(port, () => {
  console.log(`Сервер слухає на порту ${port}`);
});