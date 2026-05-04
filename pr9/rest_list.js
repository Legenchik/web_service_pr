const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/items') {
    try {
      const data = await fs.readFile('data.json', 'utf8');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
      
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read data.json' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});