const http = require('http');
const fs = require('fs');
const { Transform } = require('stream');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && parsedUrl.pathname === '/upper') {
    const fileName = parsedUrl.searchParams.get('fileName');

    if (!fileName) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Bad Request: Missing fileName parameter');
    }

    const upperCaseTransform = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
      }
    });

    const readStream = fs.createReadStream(fileName);

    readStream.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: File does not exist or cannot be read');
      }
    });

    readStream.on('open', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      
      readStream
        .pipe(upperCaseTransform)
        .pipe(res);
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});