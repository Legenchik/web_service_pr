const http = require('http');
const fs = require('fs');

const port = process.argv[2];

if (!port) {
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Перевірка на PUT та наявність /data/ у шляху
  if (req.method === 'PUT' && req.url.startsWith('/data/')) {
    // Витягуємо ID з URL (наприклад, з "/data/2" отримуємо "2")
    const id = parseInt(req.url.split('/')[2]);

    let body = '';
    req.on('data', (chunk) => body += chunk);

    req.on('end', () => {
      let updateData;
      
      // 1. Перевірка на валідність JSON в тілі запиту (400)
      try {
        updateData = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Malformed JSON" }));
      }

      // 2. Читання файлу (500)
      fs.readFile('data.json', 'utf8', (err, fileData) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "File error" }));
        }

        let items;
        try {
          items = JSON.parse(fileData);
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Invalid file content" }));
        }

        // 3. Пошук елемента
        const index = items.findIndex(item => item.id === id);

        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: "Not found" }));
        }

        // 4. Оновлення об'єкта (зберігаємо старі дані + додаємо нові)
        items[index] = { ...items[index], ...updateData };

        // 5. Запис оновлених даних назад у файл
        fs.writeFile('data.json', JSON.stringify(items, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Write error" }));
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(items[index]));
        });
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(port, () => {
  console.log(`Update server listening on port ${port}`);
});