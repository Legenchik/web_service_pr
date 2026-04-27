const http = require('http');
const fs = require('fs');

const port = process.argv[2];

if (!port) {
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Обробка POST /data
  if (req.url === '/data' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Перевіряємо, чи є тіло валідним JSON
        const parsed = JSON.parse(body);
        
        // Записуємо у файл (використовуємо stringify, щоб файл був гарно відформатований)
        fs.writeFile('data.json', JSON.stringify(parsed, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Cannot write file" }));
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: "ok" }));
        });

      } catch (e) {
        // Якщо JSON некоректний
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