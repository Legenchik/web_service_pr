const http = require('http');

const port = process.env.PORT || 3000;

const applyProductionHeaders = (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  
  res.setHeader('Access-Control-Allow-Origin', '*'); 
};

const server = http.createServer((req, res) => {
  try {
    applyProductionHeaders(res);

    if (req.method === 'OPTIONS' && req.url === '/health') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.writeHead(204);
      return res.end();
    }

    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }

    if (req.method === 'GET' && req.url === '/boom') {
      throw new Error('Simulated catastrophic failure!');
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');

  } catch (error) {
    console.error('Caught error to keep server alive:', error.message);
    
    if (!res.headersSent) {
      applyProductionHeaders(res);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});