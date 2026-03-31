const http = require('http');

const port = process.argv[2];

if (!port) {
  console.error('Будь ласка, вкажіть порт');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const fullUrl = new URL(req.url, `http://localhost:${port}`);
  
  const pathname = fullUrl.pathname;
  const msg = fullUrl.searchParams.get('msg') || ''; 

  if (pathname === '/echo' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(msg);
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