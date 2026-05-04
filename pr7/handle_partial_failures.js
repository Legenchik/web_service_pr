const http = require('http');
const fs = require('fs/promises');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/error-handling') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const files = JSON.parse(body);

        if (!Array.isArray(files)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Request body must be a JSON array of filenames' }));
        }

        const promises = files.map(file => fs.readFile(file, 'utf8'));

        const results = await Promise.allSettled(promises);

        const successes = [];
        const failures = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successes.push(result.value.trim());
          } else {
            failures.push(files[index]);
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          successes: successes,
          failures: failures,
          total: files.length
        }));

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
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