export default function handler(req, res) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
      return res.status(204).end();
    }
  
    // SFMC calls this to verify configuration (return 200 if valid)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
  
    // Return an empty array for "no errors"
    return res.status(200).json({ status: 'ok', step: 'validate', errors: [] });
  }
  