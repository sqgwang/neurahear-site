const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

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
});