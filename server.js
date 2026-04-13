const express = require('express');
const https = require('https');
const querystring = require('querystring');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PROXY_SECRET = process.env.PROXY_SECRET || 'nikito2026';

app.use((req, res, next) => {
  const secret = req.headers['x-proxy-secret'];
  if (secret !== PROXY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

app.post('/roller/token', async (req, res) => {
  try {
    console.log('Token request for client_id:', req.body.client_id);
    const body = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: req.body.client_id,
      client_secret: req.body.client_secret
    });
    const result = await httpsRequest({
      hostname: 'auth.roller.software',
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    }, body);
    console.log('Token response status:', result.status);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Token error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/roller/revenues', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const token = req.headers['x-roller-token'];
    console.log('Revenue request:', startDate, endDate);
    const result = await httpsRequest({
      hostname: 'data.roller.software',
      path: `/v1/revenues?startDate=${startDate}&endDate=${endDate}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Revenue response status:', result.status);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Revenue error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'NIKITO Proxy', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NIKITO Proxy running on port ${PORT}`));
