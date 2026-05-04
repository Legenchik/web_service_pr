const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('/');

  if (req.method === 'DELETE' && urlParts.length === 3 && urlParts[1] === 'items') {
    const requestedId = urlParts[2];

    try {
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
        items.splice(itemIndex, 1);

        await fs.writeFile('data.json', JSON.stringify(items, null, 2), 'utf8');

        // 3. Return 200 OK
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
      }

    } catch (error) {
      console.error('Error processing request:', error);
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