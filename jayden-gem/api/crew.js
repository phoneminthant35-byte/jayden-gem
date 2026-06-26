// api/crew.js — single handler for all Vercel serverless calls
export const config = { maxDuration: 60 };

async function callClaude(apiKey, body) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function sbGet(url, key, dataKey) {
  const r = await fetch(
    `${url}/rest/v1/jayden_gem?key=eq.${encodeURIComponent(dataKey)}&select=value`,
    { headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } }
  );
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Supabase GET failed: ${r.status} ${err}`);
  }
  const rows = await r.json();
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const raw = rows[0]?.value;
  if (raw == null) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}

async function sbSet(url, key, dataKey, value) {
  const r = await fetch(`${url}/rest/v1/jayden_gem`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify({
      key: dataKey,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    })
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Supabase SET failed: ${r.status} ${err}`);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const CLAUDE_KEY = process.env.ANTHROPIC_API_KEY;
  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const body = req.body;
    const action = body?.action;

    if (action === "db_get") {
      if (!SB_URL || !SB_KEY) return res.json({ value: null, error: "Supabase env vars not set" });
      const result = await sbGet(SB_URL, SB_KEY, body.dataKey);
      return res.json({ value: result });
    }

    if (action === "db_set") {
      if (!SB_URL || !SB_KEY) return res.json({ ok: false, error: "Supabase env vars not set" });
      await sbSet(SB_URL, SB_KEY, body.dataKey, body.value);
      return res.json({ ok: true });
    }

    if (!CLAUDE_KEY) return res.status(500).json({ error: { message: "ANTHROPIC_API_KEY not set" } });
    const data = await callClaude(CLAUDE_KEY, body);
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: { message: e.message } });
  }
}
