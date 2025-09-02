// api/submit.js
const { createClient } = require('@supabase/supabase-js');

const US = new Set([
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN',
  'MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA',
  'WA','WV','WI','WY','DC'
]);

const validName = (s) => !!s && /^[A-Za-z][A-Za-z '\-]{0,49}$/.test(String(s).trim());
const validEmail = (e) => !!e && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e).trim());

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, state } = req.body || {};
    if (!validName(firstName) || !validName(lastName)) {
      return res.status(400).json({ error: 'Invalid first/last name' });
    }
    if (!validEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const st = String(state || '').toUpperCase();
    if (!US.has(st)) {
      return res.status(400).json({ error: 'Invalid US state' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // server-only secret
    );

    const { error } = await supabase.from('contacts').insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      state: st
    });

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error('Bad request:', e);
    return res.status(400).json({ error: 'Bad request' });
  }
};
