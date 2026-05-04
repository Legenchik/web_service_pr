const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/sequential') {
    const start = Date.now();

    try {
      const a = (await fs.readFile('a.txt', 'utf8')).trim();
      const b = (await fs.readFile('b.txt', 'utf8')).trim();
      const c = (await fs.readFile('c.txt', 'utf8')).trim();

      const combined = a + b + c;
      const elapsedMs = Date.now() - start;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        combined: combined,
        elapsedMs: elapsedMs
      }));

    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error reading files' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});