const http = require('http')
function parseTime(time) {
  return {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds()
  }
}
function unixTime(time) {
  return { unixtime: time.getTime() }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const time = new Date(url.searchParams.get('iso'))
  let result

  // Роутинг: перевіряємо шлях (pathname)
  if (url.pathname === '/api/parsetime') {
    result = parseTime(time)
  } else if (url.pathname === '/api/unixtime') {
    result = unixTime(time)
  }
  if (result) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  } else {
    res.writeHead(404)
    res.end()
  }
})

const port = process.argv[2]
server.listen(Number(port))