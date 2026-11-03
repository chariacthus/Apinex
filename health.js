export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    return res.end(JSON.stringify({ ready: false, error: 'Use GET.' }));
  }
  res.statusCode = 200;
  return res.end(JSON.stringify({
    ready: Boolean(process.env.APINEX_API_KEY),
    model: process.env.APINEX_MODEL || 'free/gpt-6-luna'
  }));
}
