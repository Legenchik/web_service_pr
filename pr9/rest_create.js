const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/items') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const newItem = JSON.parse(body);

        let fileData;
        try {
          fileData = await fs.readFile('data.json', 'utf8');
        } catch (err) {
          if (err.code === 'ENOENT') {
            fileData = '[]';
          } else {
            throw err;
          }
        }

        const items = JSON.parse(fileData);

        items.push(newItem);

        await fs.writeFile('data.json', JSON.stringify(items, null, 2), 'utf8');

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newItem));

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