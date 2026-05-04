const http = require('http');
const fs = require('fs');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && parsedUrl.pathname === '/missing-file') {
    const fileName = parsedUrl.searchParams.get('fileName');

    if (!fileName) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Bad Request: Missing fileName parameter');
    }

    const readStream = fs.createReadStream(fileName);

    readStream.on('error', (err) => {
      console.error(`Error streaming file "${fileName}":`, err.message);

      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: Unable to stream the requested file.');
      }
    });

    readStream.on('open', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      readStream.pipe(res);
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});