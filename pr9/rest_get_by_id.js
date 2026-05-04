const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('/');

  if (req.method === 'GET' && urlParts.length === 3 && urlParts[1] === 'items') {
    const requestedId = urlParts[2];

    try {
      const fileData = await fs.readFile('data.json', 'utf8');
      const items = JSON.parse(fileData);

      const item = items.find(i => String(i.id) === requestedId);

      if (item) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(item));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
      }

    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});