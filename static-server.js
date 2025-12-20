const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');
const app = express();
const port = 3000;

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Persistent Storage Setup ---
const STORAGE_DIR = path.join(__dirname, 'server-storage');
const UPLOADS_DIR = path.join(STORAGE_DIR, 'uploads');
const DATA_DIR = path.join(STORAGE_DIR, 'data');
const DB_FILE = path.join(DATA_DIR, 'zhanan-records.json');

// Ensure directories exist
[STORAGE_DIR, UPLOADS_DIR, DATA_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Initialize DB file if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// --- API Routes for Zhanan Page ---

// Get all records
app.get('/api/zhanan/records', (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read database' });
    }
});

// Add a new record
app.post('/api/zhanan/records', (req, res) => {
    try {
        const newRecord = req.body;
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        
        // Handle Image Upload (Base64 -> File)
        if (newRecord.image && newRecord.image.startsWith('data:image')) {
            const matches = newRecord.image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1];
                const buffer = Buffer.from(matches[2], 'base64');
                const filename = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
                const filePath = path.join(UPLOADS_DIR, filename);
                
                fs.writeFileSync(filePath, buffer);
                
                // Replace base64 with URL path
                newRecord.image = `/uploads/${filename}`;
            }
        }

        const updatedData = [newRecord, ...data];
        fs.writeFileSync(DB_FILE, JSON.stringify(updatedData, null, 2));
        res.json({ success: true, record: newRecord });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save record' });
    }
});

// Delete a record
app.delete('/api/zhanan/records/:id', (req, res) => {
    try {
        const { id } = req.params;
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        
        // Find record to delete image if exists
        const recordToDelete = data.find(r => r.id === id);
        if (recordToDelete && recordToDelete.image && recordToDelete.image.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, 'server-storage', recordToDelete.image); // path is relative to root in url, but absolute on disk
            // Fix path construction: record.image is like "/uploads/filename.png"
            // We need "server-storage/uploads/filename.png"
            // Actually, let's just use the filename
            const filename = path.basename(recordToDelete.image);
            const fullPath = path.join(UPLOADS_DIR, filename);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        const updatedData = data.filter(r => r.id !== id);
        fs.writeFileSync(DB_FILE, JSON.stringify(updatedData, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

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

// For any other routes, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out/index.html'));
});

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
  console.log(`Proxying /api/* to http://localhost:4000/api/*`);
});