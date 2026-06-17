// api/crew.js — Vercel serverless function
// Handles AI calls (Gemini), Google Sheets writes, and Supabase sync

export const config = { maxDuration: 30 };

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

async function callGemini(apiKey, system, user, images = []) {
  const parts = [];
  for (const img of images) {
    parts.push({ inlineData: { mimeType: img.media_type, data: img.data } });
  }
  parts.push({ text: `${system}\n\n${user}` });
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts }] }) }
  );
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function sbGet(url, key, dataKey) {
  const r = await fetch(`${url}/rest/v1/jayden_gem?key=eq.${dataKey}&select=value`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const rows = await r.json();
  if (rows && rows[0]?.value) return JSON.parse(rows[0].value);
  return null;
}

async function sbSet(url, key, dataKey, value) {
  await fetch(`${url}/rest/v1/jayden_gem`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ key: dataKey, value: JSON.stringify(value), updated_at: new Date().toISOString() })
  });
}

export default async function handler(req, res) {
  // CORS headers so the Vercel app can call this from any device
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const { action, system, user, images, sheetTab, sheetValues, dataKey, value } = req.body;

    // AI call
    if (action === "ask") {
      if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set" });
      const text = await callGemini(GEMINI_KEY, system || "", user || "", images || []);
      return res.json({ text });
    }

    // Supabase get
    if (action === "db_get") {
      if (!SB_URL || !SB_KEY) return res.json({ value: null });
      const result = await sbGet(SB_URL, SB_KEY, dataKey);
      return res.json({ value: result });
    }

    // Supabase set
    if (action === "db_set") {
      if (!SB_URL || !SB_KEY) return res.json({ ok: false, error: "Supabase not configured" });
      await sbSet(SB_URL, SB_KEY, dataKey, value);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
