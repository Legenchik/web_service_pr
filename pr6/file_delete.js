const http = require('http');
const fs = require('fs');

const port = process.argv[2];

if (!port) {
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Перевірка на DELETE /data/:id
  if (req.method === 'DELETE' && req.url.startsWith('/data/')) {
    const id = parseInt(req.url.split('/')[2]);

    fs.readFile('data.json', 'utf8', (err, data) => {
      // 1. Якщо файл не існує або помилка читання -> 500
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "File not found or cannot be read" }));
      }

      let items;
      try {
        // 2. Якщо вміст файлу "ламаний" -> 400
        items = JSON.parse(data);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Malformed JSON" }));
      }

      // 3. Спроба видалення
      const initialLength = items.length;
      const filteredItems = items.filter(item => item.id !== id);

      // Якщо довжина масиву не змінилася, значить об'єкта з таким ID не було -> 404
      if (filteredItems.length === initialLength) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Not found" }));
      }

      // 4. Запис оновленого масиву
      fs.writeFile('data.json', JSON.stringify(filteredItems, null, 2), (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Cannot write file" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "deleted" }));
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(port, () => {
  console.log(`Delete server running on port ${port}`);
});