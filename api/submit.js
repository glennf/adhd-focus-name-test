const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'Responses!A:N';
const TOKEN_URI = process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token';

const allowedOrigins = new Set([
  'https://navnetest.datasmie.no',
  'https://adhd-focus-name-test.vercel.app',
]);

function corsHeaders(origin) {
  const allowOrigin = allowedOrigins.has(origin) ? origin : 'https://navnetest.datasmie.no';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function clean(value, maxLength = 2000) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, maxLength);
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

async function getAccessToken() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
    grant_type: 'refresh_token',
  });

  const response = await fetch(TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token refresh failed: ${response.status} ${text.slice(0, 300)}`);
  }

  const data = await response.json();
  if (!data.access_token) throw new Error('Google token response did not include access_token');
  return data.access_token;
}

async function appendToSheet(payload) {
  if (!SHEET_ID) throw new Error('Missing GOOGLE_SHEET_ID');
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('Missing Google OAuth environment variables');
  }

  const accessToken = await getAccessToken();
  const row = [[
    new Date().toISOString(),
    clean(payload.favorite, 120),
    clean(payload.understanding, 4000),
    clean(payload.feeling, 1000),
    clean(payload.variant, 120),
    clean(payload.pageUrl, 1000),
    clean(payload.referrer, 1000),
    clean(payload.userAgent, 1000),
    clean(payload.language, 80),
    clean(payload.timezone, 120),
    clean(payload.screen, 80),
    clean(payload.utm_source, 200),
    clean(payload.utm_medium, 200),
    clean(payload.utm_campaign, 200),
  ]];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SHEET_ID)}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: row }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${text.slice(0, 300)}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  const headers = corsHeaders(req.headers.origin || '');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const payload = await readJson(req);
    if (!payload.favorite) {
      return res.status(400).json({ ok: false, error: 'favorite is required' });
    }

    const result = await appendToSheet(payload);
    return res.status(200).json({ ok: true, updatedRange: result.updates?.updatedRange || null });
  } catch (error) {
    console.error('submit failed', error);
    const debugMessage = process.env.DEBUG_SUBMIT === '1' ? String(error?.message || error).slice(0, 500) : undefined;
    return res.status(500).json({ ok: false, error: 'Could not save response', debug: debugMessage });
  }
}
