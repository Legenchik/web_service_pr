const http = require('http');
const crypto = require('crypto');
const { promisify } = require('util');

// Promisify the callback-based pbkdf2 function so we can use it with async/await
const pbkdf2Async = promisify(crypto.pbkdf2);

const port = process.argv[2] || 3000;

const server = http.createServer(async (req, res) => {
  // Check if the route is /threadpool-limit and the method is GET
  if (req.method === 'GET' && req.url === '/threadpool-limit') {
    const start = Date.now();
    const numTasks = 8;
    const promises = [];

    // Start 8 heavy cryptographic operations in parallel
    for (let i = 0; i < numTasks; i++) {
      // standard heavy operation parameters: password, salt, iterations, keylen, digest
      promises.push(pbkdf2Async('secret', 'salt', 100000, 64, 'sha512'));
    }

    try {
      // Wait for all 8 operations to finish
      await Promise.all(promises);
      
      const durationMs = Date.now() - start;

      // Return successful JSON response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        tasks: numTasks,
        durationMs: durationMs
      }));

    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to process tasks' }));
    }
  } else {
    // Return 404 for unknown routes or wrong HTTP methods
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});