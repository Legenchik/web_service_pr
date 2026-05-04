const http = require('http');
const fs = require('fs');

// Read port from command line arguments, default to 3000
const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  // Parse the URL to get the pathname and query parameters
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  // Check if the route is /file and the method is GET
  if (req.method === 'GET' && parsedUrl.pathname === '/file') {
    const fileName = parsedUrl.searchParams.get('fileName');

    // If no fileName parameter is provided, return 400
    if (!fileName) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Bad Request: Missing fileName parameter');
    }

    // Create a read stream for the requested file
    const readStream = fs.createReadStream(fileName);

    // Handle stream errors (e.g., file not found, permission denied)
    readStream.on('error', (err) => {
      // Ensure we haven't already started sending the response
      if (!res.headersSent) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Bad Request: File does not exist or cannot be read');
      }
    });

    // Once the file is successfully opened, write headers and pipe to response
    readStream.on('open', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      readStream.pipe(res);
    });

  } else {
    // Return 404 for unknown routes or incorrect methods
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});