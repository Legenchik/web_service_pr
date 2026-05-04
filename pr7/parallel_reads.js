const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/parallel') {
    const start = Date.now();

    try {
      const readA = fs.readFile('a.txt', 'utf8');
      const readB = fs.readFile('b.txt', 'utf8');
      const readC = fs.readFile('c.txt', 'utf8');

      const results = await Promise.all([readA, readB, readC]);

      const combined = results[0].trim() + results[1].trim() + results[2].trim();
      
      const elapsedMs = Date.now() - start;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        combined: combined,
        elapsedMs: elapsedMs
      }));

    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read files' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});2