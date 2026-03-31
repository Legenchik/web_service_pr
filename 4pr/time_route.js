const http = require('http');

const port = process.argv[2];

if (!port) {
  console.error('Будь ласка, вкажіть порт');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/time' && method === 'GET') {
    const responseData = {
      now: new Date().toISOString()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseData));
  }else if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Manual HTTP Router');
  } 
  else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});