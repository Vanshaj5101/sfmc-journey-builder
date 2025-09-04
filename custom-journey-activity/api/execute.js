export default function handler(req, res) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
      return res.status(204).end();
    }
  
    // This is called DURING journey execution per contact
    // Keep it fast; respond 200 quickly
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
  
    const payload = (req.body && typeof req.body === 'object') ? req.body : {};
    // Do your processing here (e.g., call SF, write logs, etc.)
  
    return res.status(200).json({
      status: 'ok',
      step: 'execute',
      received: payload
    });
  }
  