export function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key não fornecida (Header: x-api-key)' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'API Key inválida' });
  }

  next();
}
