// ls /etc/nginx/sites-enabled/
const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

// Keep a generous payload limit for proxied API requests.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Manual proxy for /api requests using http module
app.all('/api/*', (req, res) => {
  const apiPath = req.path;  // e.g., /api/auth/login
  
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: apiPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : ''),
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': req.headers.cookie || ''
    }
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    // Forward status code
    res.status(proxyRes.statusCode);
    
    // Forward headers (including set-cookie)
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });
    
    // Forward response body
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (error) => {
    console.error('[Proxy Error]', error.message);
    res.status(502).json({ error: 'Backend unavailable' });
  });
  
  // Forward request body if present
  if (req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
});

// Serve static files from the out directory
app.use(express.static(path.join(__dirname, 'out')));

// Specific route for digit-in-noise-test
app.use('/tools/digit-in-noise-test', express.static(path.join(__dirname, 'out/tools/digit-in-noise-test')));

// For any other routes, serve the generated not-found page.
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'out/404.html'));
});

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
  console.log(`Proxying /api/* to http://localhost:4000/api/*`);
});
