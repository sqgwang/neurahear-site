const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Handle static files in tools/digit-in-noise-test
      if (pathname.startsWith('/tools/digit-in-noise-test/')) {
        // Set proper headers for static files
        if (pathname.endsWith('.html')) {
          res.setHeader('Content-Type', 'text/html')
        } else if (pathname.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript')
        } else if (pathname.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css')
        } else if (pathname.endsWith('.wav')) {
          res.setHeader('Content-Type', 'audio/wav')
        }
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})