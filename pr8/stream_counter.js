const http = require('http');

// Read port from command line arguments, default to 3000
const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  // Check if the method is POST and the route is /count
  if (req.method === 'POST' && req.url === '/count') {
    let bytes = 0;
    let chunks = 0;

    // Listen for incoming data chunks
    req.on('data', (chunk) => {
      bytes += chunk.length; // chunk.length gives the number of bytes in the Buffer
      chunks++;              // Increment the chunk counter
    });

    // When the stream finishes sending data, return the JSON response
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        bytes: bytes,
        chunks: chunks
      }));
    });

    // Handle potential stream errors
    req.on('error', (err) => {
      console.error('Stream error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });

  } else {
    // Return 404 for unknown routes or incorrect methods
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});