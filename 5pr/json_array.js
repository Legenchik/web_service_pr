const http = require('http');

const port = process.argv[2];

if (!port) {
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.url === '/json-array' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (!body) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Missing body" }));
        }

        const data = JSON.parse(body);

        if (!data.numbers || !Array.isArray(data.numbers)) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Missing numbers array" }));
        }

        const nums = data.numbers;

        const allNumbers = nums.every(n => typeof n === 'number');
        if (!allNumbers) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Non-numeric values in array" }));
        }

        const count = nums.length;
        const sum = nums.reduce((acc, curr) => acc + curr, 0);
        const average = count === 0 ? 0 : sum / count;

        const response = {
          count: count,
          sum: sum,
          average: average
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));

      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});