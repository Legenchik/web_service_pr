const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('/');

  if (req.method === 'PUT' && urlParts.length === 3 && urlParts[1] === 'items') {
    const requestedId = urlParts[2];
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const updates = JSON.parse(body);

        let fileData;
        try {
          fileData = await fs.readFile('data.json', 'utf8');
        } catch (err) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Item not found' }));
        }

        const items = JSON.parse(fileData);

        const itemIndex = items.findIndex(i => String(i.id) === requestedId);

        if (itemIndex !== -1) {
          items[itemIndex] = { ...items[itemIndex], ...updates };

          await fs.writeFile('data.json', JSON.stringify(items, null, 2), 'utf8');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(items[itemIndex]));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Item not found' }));
        }

      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request' }));
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});