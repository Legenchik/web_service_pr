const http = require('http');
const fs = require('fs');

const port = process.argv[2];

if (!port) {
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.url === '/data' && req.method === 'GET') {
    // Зчитуємо файл data.json
    fs.readFile('data.json', 'utf8', (err, data) => {
      // Якщо сталася помилка зчитування (наприклад, файлу немає)
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Cannot read file" }));
      }

      try {
        // Перевіряємо, чи вміст файлу є коректним JSON
        const parsedData = JSON.parse(data);
        
        // Відправляємо успішну відповідь
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsedData));
      } catch (e) {
        // Якщо JSON некоректний
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    // Обробка 404 для інших маршрутів
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
