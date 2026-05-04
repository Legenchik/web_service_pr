const http = require('http');
const fs = require('fs');

// Read port from command line arguments, default to 3000
const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  // Check if the method is POST and the route is /upload
  if (req.method === 'POST' && req.url === '/upload') {
    
    // Create a writable stream directed to 'upload.txt'
    const writeStream = fs.createWriteStream('upload.txt');

    // Handle any file system errors during the write process
    writeStream.on('error', (err) => {
      console.error('Error writing file:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });

    // Pipe the incoming request stream directly into the file write stream
    req.pipe(writeStream);

    // Wait for the writable stream to finish writing all piped data to disk
    writeStream.on('finish', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File successfully uploaded');
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