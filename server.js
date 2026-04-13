const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clé secrète pour sécuriser le proxy
const PROXY_SECRET = process.env.PROXY_SECRET || 'nikito2026';

// Middleware auth
app.use((req, res, next) => {
  const secret = req.headers['x-proxy-secret'];
  if (secret !== PROXY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Route token Roller
app.post('/roller/token', async (req, res) => {
  try {
    const { client_id, client_secret } = req.body;
    const response = await fetch('https://auth.roller.software/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route revenues Roller
app.get('/roller/revenues', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const token = req.headers['x-roller-token'];
    const response = await fetch(`https://data.roller.software/v1/revenues?startDate=${startDate}&endDate=${endDate}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'NIKITO Proxy' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NIKITO Proxy running on port ${PORT}`));
