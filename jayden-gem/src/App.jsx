import React, { useState, useRef, useEffect } from "react";

/* ============================================================
   JAYDEN GEM — AI MARKETING CREW
   A One Piece crew that researches, debates, writes, plans
   and learns. Navy + gold, every member a gem.
   ============================================================ */

// ---------- CREW ----------
const CREW = {
  robin:    { name: "Nico Robin", role: "Trend Researcher", gem: "#9B6BD6", facet: "#C9A4F0", icon: "🔮",
              blurb: "Digs up viral celebrity jewelry trends — global + Myanmar FYP." },
  usopp:    { name: "Usopp", role: "Script Writer", gem: "#E0556B", facet: "#F2929F", icon: "✍️",
              blurb: "Writes scripts, shoot guides & CapCut edits in the right voice per account." },
  nami:     { name: "Nami", role: "Analytics Analyst", gem: "#3FA37A", facet: "#7FD3AE", icon: "📊",
              blurb: "Reads the numbers cold. Finds what's working and briefs the crew." },
  luffy:    { name: "Luffy", role: "Creative Director", gem: "#D4AF37", facet: "#F0D27A", icon: "👑",
              blurb: "The captain. Breaks deadlocks and gives the final call before you." },
  franky:   { name: "Franky", role: "Sheets Updater", gem: "#3E86C4", facet: "#84B8E6", icon: "🔧",
              blurb: "Builds & keeps the records — logs everything to Google Sheets." },
};

// ---------- ACCOUNTS ----------
const ACCOUNTS = {
  jaydenTT: {
    label: "Jayden Gem", platform: "TikTok", who: "You",
    voice: "Casual, relatable, high-dopamine YOUR voice. One thought per line, heavy emoji (😭👀💎😳👇), lead with a shock number, cliffhangers, end on a question (comment-bait) OR a DM keyword. Personality + jewelry mixed — girls follow for Jayden, not just the gems.",
    color: "#D4AF37",
  },
  jaydenFB: {
    label: "Jayden (Facebook)", platform: "Facebook", who: "You",
    voice: "Same Jayden personality, adapted for Facebook: a little longer, more storytelling, still keep the protected English terms. Personal + jewelry. Build the cult following.",
    color: "#C99B2E",
  },
  shpTT: {
    label: "Saung Htee Phyu", platform: "TikTok", who: "Father / teachers / staff",
    voice: "Mostly Academy (educational, prestigious, gemstone authentication, course previews, founder authority). Sometimes Workshop (custom pieces). NOT Jayden's sarcastic voice — calm, trustworthy, academic.",
    color: "#3FA37A",
  },
  academyFB: {
    label: "SHP Academy (Facebook)", platform: "Facebook", who: "Father / teachers",
    voice: "Educational and prestigious. Sells gem / diamond / gold / goldsmith courses. Longer, informative, builds multi-generational legacy trust.",
    color: "#3E86C4",
  },
  goldsmithFB: {
    label: "SHP Goldsmith (Facebook)", platform: "Facebook", who: "Workshop / staff",
    voice: "Premium workshop: custom jewelry, remodeling before/after, behind-the-scenes craft. Reassuring, Smart Budget + Premium Look messaging. Drives DM orders.",
    color: "#9B6BD6",
  },
};

const PROTECTED = ["Meme","Ridiculous","Everyday Wear","Smart Budget","Pinterest","Red Carpet","Real Life","Push-back","Screw-back","Custom","Hype","Hook","B-Roll","CTA","Toi et Moi","Statement Ring","Premium Look","Quiet luxury","Double-Prong"];

// ---------- BRAND BIBLE (editable, exportable) ----------
const DEFAULT_BIBLE = `# JAYDEN GEM — BRAND BIBLE
(Hand this to any AI as context.)

## THE EMPIRE
A Burmese-language jewelry & gemology content business in Yangon. Three brands, five accounts.

## GOALS
- Build a CULT FOLLOWING around Jayden's personal brand (girls follow for Jayden himself, not only the jewelry).
- Drive DM inquiries to the Goldsmith workshop (custom, remodeling, big & small orders, Yangon).
- Sell Academy courses (gem, diamond, gold, goldsmith / how to build a goldsmith shop).
- Make the family the most trusted jewelry authority in Myanmar.
- Funnel: Jayden Gem catches the crowd → personality keeps them loyal → Academy = authority → Workshop = sales.

## ACCOUNTS & VOICE
- Jayden Gem (TikTok) + Jayden (Facebook): casual, relatable, funny, personal. Show everything — daily life, opinions, humor. Three layers: jewelry / personality / parasocial bridge.
- Saung Htee Phyu (TikTok): mostly Academy (education), sometimes Workshop. Father/teachers/staff voice — calm, academic, trustworthy.
- SHP Academy (Facebook): course selling, prestige.
- SHP Goldsmith (Facebook): premium workshop, custom & remodeling, DM orders.

## LINGUISTIC RULE
Snappy conversational Burmese. Keep these English terms VERBATIM & uppercase: ${PROTECTED.join(", ")}.

## GUARDRAILS
Never attack the celebrity's taste. Never devalue the gem itself (hurts our showroom). Praise the beauty, "blame" the lifestyle mismatch or engineering flaw. Weave in real manufacturing facts (metal density, setting tension, cleavage risk) to show mastery.

## WINNING VOICE (from real posts)
One thought per line. Heavy emoji as rhythm. Lead with the shock number (carats / price). Cliffhangers ("ဒါပေမယ့်…", "part 2 မှာ"). End on a question + 👇 for reach, or a DM keyword for conversion. Formats that work: head-to-head VS, ranking countdowns, single-piece deep dives, the "blame" series, personal/controversy.

## DATA SNAPSHOT (Jun 2026)
JAYDEN GEM TikTok — 14.3K followers, 476K likes. 88% For-You traffic, 97-99% non-followers.
  Best: Jisoo Met Gala 804K (2,108 new followers), J.Lo 5 husbands 554K (2,126 shares), "Am I copying Jimmy?" best watch time 19.9s.
  Lesson: K-pop = fastest follower growth; multi-part storytelling = most shares; PERSONAL/controversy = longest watch time.
  Audience: ~Myanmar 40-80%, 18-34, female-leaning on jewelry, male-leaning on K-pop/drama. Best time: Sat 12am.
SAUNG HTEE PHYU TikTok — 6,160 followers, GROWING (+87% views). Search traffic 16% (people search the brand + courses). Audience older 25-44, 90%+ Myanmar, female-leaning. One video pulled 300 new followers. Pinned 243K.
  Lesson: highest-intent audience; people already search "ဆောင်းထီးဖြူစိန်ရွေကောက်သင်တန်း".

## COMPETITORS / NEIGHBORS
Sein Nan Daw (4.8M), ZweHtet Gold & Jewellery, Pyae Gyi (4.7M), 97 Media (2.2M).

## CONTACTS
Academy course line: 095060182 / 09443939440. Yangon.
`;

const HOOK_TYPES = ["Engineering Flaw", "Lifestyle Mismatch", "Comfort Trap", "Price Shock", "VS / Head-to-head", "Ranking", "Personal / Story"];

// ---------- API ----------
async function ask(system, user, json = false, maxTokens = 1000) {
  const doCall = async () => {
    const r = await fetch("/api/crew", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }),
    });
    const d = await r.json();
    if (!d.content) {
      // Log the full error so we can see what's actually wrong
      const errMsg = d.error?.message || JSON.stringify(d).slice(0,200);
      throw new Error(errMsg);
    }
    return d.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  };
  // First attempt
  let t = await doCall();
  if (json) {
    try { return parseLoose(t); }
    catch (e) {
      // Auto-retry once on parse failure — often fixes garbled JSON
      t = await doCall();
      return parseLoose(t);
    }
  }
  return t;
}

// Vision call: images = [{media_type, data(base64)}], read alongside the text prompt.
async function askVision(system, user, images, json = false, maxTokens = 1000) {
  // Validate images before sending
  const validImages = images.filter(im => im.data && im.data.length > 0 && im.media_type);
  if (validImages.length === 0) throw new Error("No valid images to read");

  // Normalise media_type — API only accepts these four
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const normalised = validImages.map(im => ({
    ...im,
    media_type: allowed.includes(im.media_type) ? im.media_type : "image/jpeg"
  }));

  const content = [
    ...normalised.map(im => ({ type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } })),
    { type: "text", text: user },
  ];
  const r = await fetch("/api/crew", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, system, messages: [{ role: "user", content }] }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message || "Invalid response format");
  if (!d.content) throw new Error("API returned no content — try again");
  let t = d.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  if (json) return parseLoose(t);
  return t;
}

// Forgiving JSON reader: handles ```fences```, surrounding prose, and the
// common failure where the model puts real line breaks / stray quotes inside
// string values (frequent with multi-line Burmese scripts).
function parseLoose(raw) {
  if (!raw) throw new Error("Empty response");
  let t = raw.replace(/```json|```/g, "").trim();
  const s = t.indexOf("{"), sa = t.indexOf("[");
  const start = sa !== -1 && (sa < s || s === -1) ? sa : s;
  const end = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  // Attempt 1 — clean JSON
  try { return JSON.parse(t); } catch (e) {}
  // Attempt 2 — fix raw newlines/tabs inside strings
  let out = "", inStr = false, prev = "";
  for (const ch of t) {
    if (ch === '"' && prev !== "\\") inStr = !inStr;
    if (inStr && ch === "\n") { out += "\\n"; prev = ch; continue; }
    if (inStr && ch === "\r") { prev = ch; continue; }
    if (inStr && ch === "\t") { out += "\\t"; prev = ch; continue; }
    out += ch; prev = ch;
  }
  try { return JSON.parse(out); } catch (e) {}
  // Attempt 3 — strip trailing commas (common LLM mistake)
  try { return JSON.parse(out.replace(/,\s*([}\]])/g, "$1")); } catch (e) {
    throw new Error("The crew's reply came back garbled. Tap the button again — it usually works on a second try.");
  }
}

const ctx = (bible) => bible + "\nProtected English terms (keep verbatim, uppercase): " + PROTECTED.join(", ") + "\n\nCRITICAL: Respond in plain, clear, professional language. Do NOT use One Piece references, pirate terms, anime phrases, or fictional world names (no 'Grand Line', 'East Blue', 'nakama', 'Straw Hat', 'Devil Fruit', 'All Blue', 'New World', 'sea' metaphors, etc.) in your responses. You are a real marketing professional. Speak directly and clearly.";

// ---------- Text to Speech — Character Voices ----------
const VOICE_PROFILES = {
  luffy:   { rate:1.3,  pitch:1.5, preferFemale:false, preferMale:true  },
  robin:   { rate:0.82, pitch:0.75, preferFemale:true,  preferMale:false },
  nami:    { rate:1.05, pitch:1.3,  preferFemale:true,  preferMale:false },
  usopp:   { rate:1.2,  pitch:1.15, preferFemale:false, preferMale:true  },
  franky:  { rate:0.78, pitch:0.55, preferFemale:false, preferMale:true  },
  default: { rate:1.0,  pitch:1.0,  preferFemale:false, preferMale:false },
};

// Global speed — read fresh on every speak call
window._jaydenSpeed = window._jaydenSpeed || 1.0;

function stopSpeaking() { window.speechSynthesis?.cancel(); }

function doSpeak(text, crewKey, onEnd) {
  if (!window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const profile = VOICE_PROFILES[crewKey] || VOICE_PROFILES.default;
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return null;
  const utt = new SpeechSynthesisUtterance(cleaned);
  // Read speed from window so it always uses the latest value
  const speed = window._jaydenSpeed || 1.0;
  utt.rate = Math.min(2.0, Math.max(0.5, profile.rate * speed));
  utt.pitch = profile.pitch;
  utt.volume = 1;
  const voice = pickVoice(profile);
  if (voice) utt.voice = voice;
  if (onEnd) { utt.onend = onEnd; utt.onerror = onEnd; }
  window.speechSynthesis.speak(utt);
  return utt;
}

function getVoices() {
  if (_voiceCache && _voiceCache.length > 0) return _voiceCache;
  _voiceCache = window.speechSynthesis?.getVoices() || [];
  return _voiceCache;
}

// Load voices — they load async on some browsers
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { _voiceCache = window.speechSynthesis.getVoices(); };
}

function pickVoice(profile) {
  const voices = getVoices();
  if (!voices.length) return null;
  const eng = voices.filter(v => v.lang.startsWith("en"));
  if (!eng.length) return voices[0];
  if (profile.preferFemale) {
    const f = eng.filter(v => /female|woman|girl|samantha|victoria|karen|moira|fiona|veena|tessa|zira/i.test(v.name));
    if (f.length) return f[0];
  }
  if (profile.preferMale) {
    const m = eng.filter(v => /male|man|daniel|thomas|lee|alex|fred|bruce|ralph|junior/i.test(v.name));
    if (m.length) return m[0];
  }
  return eng[0];
}

// Strip character names and One Piece themed words from speech
function cleanForSpeech(text) {
  return text
    .replace(/Nico Robin|Usopp|Nami|Luffy|Franky|BLACKPINK|K-pop/g, m => {
      const map = {"Nico Robin":"The researcher","Usopp":"The writer","Nami":"The analyst","Luffy":"The captain","Franky":"The logger"};
      return map[m] || m;
    })
    .replace(/[#*`🔊⏹👑🔮✍️📊🔧📜💎⚓🎙️📸💡⚔️🗺️📅💬🔄🏴‍☠️☠️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}


function SpeakBtn({ text, crewKey, small }) {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  function toggle() {
    if (speaking) { stopSpeaking(); setSpeaking(false); return; }
    const utt = doSpeak(text, crewKey || "default", () => setSpeaking(false));
    if (utt) setSpeaking(true);
  }
  return (
    <button onClick={toggle} title={speaking ? "Stop" : "Read aloud"}
      style={{ background:"none", border:"none", cursor:"pointer", fontSize:small?13:15, padding:"2px 5px", color:speaking?"#E0556B":"#7E8AAC", transition:"color 0.15s", flexShrink:0 }}>
      {speaking ? "⏹" : "🔊"}
    </button>
  );
}

function SpeedControl() {
  const [speed, setSpeed] = useState(1.0);
  const [manual, setManual] = useState("");
  const update = (v) => { const n = Math.min(2.0, Math.max(0.5, v)); setSpeed(n); window._jaydenSpeed = n; };
  return (
    <div style={{ background:"#1C2650", border:"1px solid #2A335C", borderRadius:10, padding:"10px 14px", marginBottom:12 }}>
      <div style={{ fontSize:11, color:"#D4AF37", fontWeight:700, letterSpacing:1.5, marginBottom:8, textTransform:"uppercase" }}>🔊 Voice speed — {speed.toFixed(2)}x</div>
      <input type="range" min="0.5" max="2.0" step="0.05" value={speed}
        style={{ width:"100%", accentColor:"#D4AF37", marginBottom:8, display:"block" }}
        onChange={e=>update(parseFloat(e.target.value))}
      />
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
        {[0.75, 1.0, 1.25, 1.5, 2.0].map(s=>(
          <button key={s} onClick={()=>update(s)}
            style={{ fontSize:11, padding:"5px 8px", borderRadius:6, cursor:"pointer",
              background: Math.abs(speed-s)<0.03 ? "linear-gradient(135deg,#D4AF37,#C8922A)" : "transparent",
              color: Math.abs(speed-s)<0.03 ? "#0A0E1F" : "#9298BC",
              border:`1px solid ${Math.abs(speed-s)<0.03 ? "#C8922A" : "#2A335C"}`,
              fontWeight: Math.abs(speed-s)<0.03 ? 700 : 400 }}>
            {s}x
          </button>
        ))}
        <div style={{ display:"flex", alignItems:"center", gap:5, marginLeft:"auto" }}>
          <span style={{ fontSize:11, color:"#9298BC" }}>Custom:</span>
          <input
            type="number" min="0.5" max="2.0" step="0.05"
            placeholder="1.3"
            value={manual}
            onChange={e=>setManual(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"){ const n=parseFloat(manual); if(!isNaN(n)){ update(n); setManual(""); }}}}
            onBlur={()=>{ const n=parseFloat(manual); if(!isNaN(n)){ update(n); setManual(""); }}}
            style={{ background:"#1C2650", border:"1px solid #2A335C", borderRadius:9, color:"#F3EEE2", fontSize:12, padding:"5px 8px", width:70, outline:"none" }}
          />
        </div>
      </div>
    </div>
  );
}
// ---------- Storage — Supabase via /api/crew (Vercel) with localStorage fallback ----------
const LIMITS = { jg_videoLog: 300, jg_finalScripts: 400, jg_insights: 100, jg_ideas: 200 };

function trimData(key, value) {
  const limit = LIMITS[key];
  if (limit && Array.isArray(value) && value.length > limit) return value.slice(0, limit);
  return value;
}

function getSizeKB(value) {
  try { return Math.round(JSON.stringify(value).length / 1024); } catch(e) { return 0; }
}

async function loadKey(key, fallback) {
  // Try Supabase via server API first
  try {
    const r = await fetch("/api/crew", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "db_get", dataKey: key })
    });
    const d = await r.json();
    if (d.value != null) return d.value;
  } catch(e) {}
  // Fall back to localStorage
  try { const v = localStorage.getItem(key); return v != null ? JSON.parse(v) : fallback; }
  catch(e) { return fallback; }
}

async function saveKey(key, value) {
  const trimmed = trimData(key, value);
  // Save to localStorage immediately
  try { localStorage.setItem(key, JSON.stringify(trimmed)); } catch(e) {}
  // Sync to Supabase via server API
  try {
    fetch("/api/crew", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "db_set", dataKey: key, value: trimmed })
    });
  } catch(e) {}
}

/* ===================== APP ===================== */
export default function App() {
  const [tab, setTab] = useState("crew");
  const [studioSeed, setStudioSeed] = useState("");
  const [bible, setBible] = useState(DEFAULT_BIBLE);
  const [insights, setInsights] = useState([]);
  const [videoLog, setVideoLog] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [finalScripts, setFinalScripts] = useState([]);
  const [pageInsights, setPageInsights] = useState([]);
  const [calMonth, setCalMonth] = useState(null);
  const [calWeek, setCalWeek] = useState(null);
  const [pendingLogs, setPendingLogs] = useState([]);
  // Studio state — lifted so nothing disappears on tab switch
  const [studioPhase, setStudioPhase] = useState("idle");
  const [studioTrends, setStudioTrends] = useState([]);
  const [studioDebate, setStudioDebate] = useState([]);
  const [studioVerdict, setStudioVerdict] = useState(null);
  const [studioBriefs, setStudioBriefs] = useState([]);
  const [studioScriptDebate, setStudioScriptDebate] = useState([]);
  const [studioPicked, setStudioPicked] = useState({ jaydenTT:true, jaydenFB:true, shpTT:false, academyFB:false, goldsmithFB:false });
  const [studioPendingTopic, setStudioPendingTopic] = useState(null);
  const [err, setErr] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Storage health — warn when approaching auto-trim limits
  const storageWarning = hydrated && (
    videoLog.length > 250 || finalScripts.length > 350 || insights.length > 80 || ideas.length > 170
  );

  // Load saved data once on open (syncs across PC + phone on the same account)
  useEffect(() => {
    (async () => {
      setBible(await loadKey("jg_bible", DEFAULT_BIBLE));
      setInsights(await loadKey("jg_insights", []));
      setVideoLog(await loadKey("jg_videoLog", []));
      setIdeas(await loadKey("jg_ideas", []));
      setFinalScripts(await loadKey("jg_finalScripts", []));
      setPageInsights(await loadKey("jg_pageInsights", []));
      setCalMonth(await loadKey("jg_calMonth", null));
      setCalWeek(await loadKey("jg_calWeek", null));
      setPendingLogs(await loadKey("jg_pendingLogs", []));
      setHydrated(true);
    })();
  }, []);

  // Save whenever data changes (only after first load, so we never wipe stored data)
  useEffect(() => { if (hydrated) saveKey("jg_bible", bible); }, [bible, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_insights", insights); }, [insights, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_videoLog", videoLog); }, [videoLog, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_ideas", ideas); }, [ideas, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_finalScripts", finalScripts); }, [finalScripts, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_pageInsights", pageInsights); }, [pageInsights, hydrated]);
  useEffect(() => { if (hydrated && calMonth) saveKey("jg_calMonth", calMonth); }, [calMonth, hydrated]);
  useEffect(() => { if (hydrated && calWeek) saveKey("jg_calWeek", calWeek); }, [calWeek, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_pendingLogs", pendingLogs); }, [pendingLogs, hydrated]);

  return (
    <div style={S.app}>
      <Style />
      {/* Ocean waves at bottom */}
      <div className="wave-container">
        <div className="wave"/>
        <div className="wave wave2"/>
      </div>
      <Header tab={tab} setTab={setTab} />
      {err && <div style={S.err}>⚠️ <b>Something went wrong:</b> {err} <button style={S.linkBtn} onClick={() => setErr(null)}>dismiss</button></div>}
      {storageWarning && (
        <div style={{ maxWidth:800, margin:"10px auto 0", background:"#1A1400", color:"#F0D27A", padding:"10px 15px", borderRadius:10, fontSize:13, border:"1px solid #6B541888", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span>🔧 <b>Franky says:</b> Storage getting full — run your weekly export and old entries will auto-trim to stay healthy.</span>
          <button style={{ ...S.linkBtn, color:"#F0D27A" }} onClick={() => setTab("franky")}>Go to Export →</button>
        </div>
      )}
      <div style={S.main}>
        {tab === "crew" && <CrewView />}
        {tab === "strategy" && <Strategy bible={bible} insights={insights} videoLog={videoLog} setErr={setErr} />}
        {tab === "studio" && <Studio bible={bible} insights={insights} finalScripts={finalScripts}
          studioSeed={studioSeed} setStudioSeed={setStudioSeed}
          ideas={ideas} setIdeas={setIdeas} setTab={setTab}
          phase={studioPhase} setPhase={setStudioPhase}
          trends={studioTrends} setTrends={setStudioTrends}
          debate={studioDebate} setDebate={setStudioDebate}
          verdict={studioVerdict} setVerdict={setStudioVerdict}
          briefs={studioBriefs} setBriefs={setStudioBriefs}
          scriptDebate={studioScriptDebate} setScriptDebate={setStudioScriptDebate}
          picked={studioPicked} setPicked={setStudioPicked}
          pendingTopic={studioPendingTopic} setPendingTopic={setStudioPendingTopic}
          setErr={setErr} />}
        {tab === "calendar" && <Calendar bible={bible} insights={insights} calMonth={calMonth} setCalMonth={setCalMonth} calWeek={calWeek} setCalWeek={setCalWeek} setStudioSeed={setStudioSeed} setTab={setTab} setIdeas={setIdeas} setErr={setErr} />}
        {tab === "ideas" && <Ideas ideas={ideas} setIdeas={setIdeas} bible={bible} setStudioSeed={setStudioSeed} setTab={setTab} setErr={setErr} />}
        {tab === "chat" && <CrewChat bible={bible} insights={insights} videoLog={videoLog} finalScripts={finalScripts} setIdeas={setIdeas} setTab={setTab} setErr={setErr} />}
        {tab === "analytics" && <Analytics videoLog={videoLog} setVideoLog={setVideoLog} insights={insights} setInsights={setInsights} bible={bible} finalScripts={finalScripts} pendingLogs={pendingLogs} setPendingLogs={setPendingLogs} setErr={setErr} />}
        {tab === "insights" && <PageInsights pageInsights={pageInsights} setPageInsights={setPageInsights} bible={bible} setErr={setErr} />}
        {tab === "scripts" && <Scripts finalScripts={finalScripts} setFinalScripts={setFinalScripts} />}
        {tab === "franky" && <FrankyExport videoLog={videoLog} finalScripts={finalScripts} ideas={ideas} bible={bible} pageInsights={pageInsights} />}
        {tab === "bible" && <Bible bible={bible} setBible={setBible} />}
      </div>
    </div>
  );
}

// ---------- Jolly Roger SVG ----------
function JollyRoger({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="jolly-roger">
      {/* Skull */}
      <ellipse cx="40" cy="30" rx="18" ry="16" fill="#F3EEE2" />
      {/* Eyes */}
      <ellipse cx="33" cy="27" rx="4.5" ry="5" fill="#0A0E1F" />
      <ellipse cx="47" cy="27" rx="4.5" ry="5" fill="#0A0E1F" />
      {/* Eye shine */}
      <circle cx="35" cy="25.5" r="1.2" fill="#D4AF37" opacity="0.8"/>
      <circle cx="49" cy="25.5" r="1.2" fill="#D4AF37" opacity="0.8"/>
      {/* Nose */}
      <ellipse cx="40" cy="33" rx="2.5" ry="2" fill="#C8BBA8" />
      {/* Mouth / teeth */}
      <rect x="32" y="38" width="16" height="5" rx="2" fill="#F3EEE2" />
      <line x1="36" y1="38" x2="36" y2="43" stroke="#0A0E1F" strokeWidth="1"/>
      <line x1="40" y1="38" x2="40" y2="43" stroke="#0A0E1F" strokeWidth="1"/>
      <line x1="44" y1="38" x2="44" y2="43" stroke="#0A0E1F" strokeWidth="1"/>
      {/* Crossed bones */}
      <line x1="12" y1="55" x2="68" y2="70" stroke="#F3EEE2" strokeWidth="7" strokeLinecap="round"/>
      <line x1="68" y1="55" x2="12" y2="70" stroke="#F3EEE2" strokeWidth="7" strokeLinecap="round"/>
      {/* Bone ends */}
      <circle cx="12" cy="55" r="5" fill="#F3EEE2"/><circle cx="68" cy="55" r="5" fill="#F3EEE2"/>
      <circle cx="12" cy="70" r="5" fill="#F3EEE2"/><circle cx="68" cy="70" r="5" fill="#F3EEE2"/>
      {/* Straw hat brim */}
      <ellipse cx="40" cy="16" rx="24" ry="5" fill="#D4AF37" opacity="0.9"/>
      <ellipse cx="40" cy="13" rx="14" ry="7" fill="#C8922A" />
      <rect x="26" y="13" width="28" height="3" fill="#C8922A"/>
      {/* Hat band */}
      <rect x="27" y="15" width="26" height="3" rx="1" fill="#E05555" opacity="0.85"/>
    </svg>
  );
}

// ---------- Header / Nav ----------
function Header({ tab, setTab }) {
  const tabs = [
    ["crew","⚓ Crew"],
    ["strategy","🗺️ Strategy"],
    ["studio","✍️ Studio"],
    ["calendar","📅 Calendar"],
    ["ideas","💡 Ideas"],
    ["chat","💬 Crew Chat"],
    ["analytics","📊 Analytics"],
    ["insights","📈 Page Insights"],
    ["scripts","📜 Scripts"],
    ["franky","🔧 Export"],
    ["bible","📖 Bible"]
  ];
  return (
    <div style={S.header}>
      {/* Top brand row */}
      <div style={S.brandRow}>
        <JollyRoger size={44} />
        <div style={{ flex:1 }}>
          <div style={S.wordmark} className="gold-shimmer">JAYDEN GEM</div>
          <div style={S.tagline}>⚓ Grand Line Marketing Crew · 5 Pirates on Deck</div>
        </div>
      </div>
      {/* Nav — wraps into multiple rows so all tabs visible at once */}
      <nav style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        {tabs.map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ ...S.navBtn, ...(tab===k ? S.navOn : {}) }}>
            {l}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ---------- Character portrait SVGs ----------
const PORTRAITS = {
  robin: ({ size=54 }) => (
    <svg width={size} height={size} viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="26" fill="#1C1040" stroke="#9B6BD6" strokeWidth="1.5"/>
      <ellipse cx="27" cy="18" rx="14" ry="12" fill="#1a0a2e"/>
      <path d="M13 22 Q10 35 14 44" stroke="#1a0a2e" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M41 22 Q44 35 40 44" stroke="#1a0a2e" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <ellipse cx="27" cy="28" rx="11" ry="12" fill="#F5CBA7"/>
      <ellipse cx="23" cy="26" rx="2.5" ry="2.8" fill="#2C0A5E"/>
      <ellipse cx="31" cy="26" rx="2.5" ry="2.8" fill="#2C0A5E"/>
      <circle cx="24" cy="25" r="0.8" fill="white"/>
      <circle cx="32" cy="25" r="0.8" fill="white"/>
      <ellipse cx="27" cy="30" rx="1" ry="0.7" fill="#E8A882"/>
      <path d="M24 33 Q27 35.5 30 33" stroke="#C07A5A" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <circle cx="38" cy="18" r="4" fill="#9B6BD6" opacity="0.8"/>
      <text x="38" y="21" textAnchor="middle" fontSize="5" fill="white">✿</text>
    </svg>
  ),
  usopp: ({ size=54 }) => (
    <svg width={size} height={size} viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="26" fill="#1A0A08" stroke="#E0556B" strokeWidth="1.5"/>
      <ellipse cx="27" cy="17" rx="13" ry="11" fill="#2C1A06"/>
      <circle cx="16" cy="20" r="5" fill="#2C1A06"/>
      <circle cx="38" cy="20" r="5" fill="#2C1A06"/>
      <ellipse cx="27" cy="29" rx="11" ry="12" fill="#D4956A"/>
      <ellipse cx="27" cy="32" rx="1.5" ry="1" fill="#B87050"/>
      <path d="M27 33 Q32 37 35 35" stroke="#B87050" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="23" cy="27" r="3" fill="white"/><circle cx="23" cy="27" r="2" fill="#4A3000"/>
      <circle cx="31" cy="27" r="3" fill="white"/><circle cx="31" cy="27" r="2" fill="#4A3000"/>
      <circle cx="24" cy="26" r="0.8" fill="white"/>
      <rect x="16" y="14" width="22" height="7" rx="3" fill="none" stroke="#8B6914" strokeWidth="1.5"/>
    </svg>
  ),
  nami: ({ size=54 }) => (
    <svg width={size} height={size} viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="26" fill="#0E1A08" stroke="#3FA37A" strokeWidth="1.5"/>
      <ellipse cx="27" cy="17" rx="14" ry="11" fill="#E8650A"/>
      <path d="M15 22 Q12 32 16 42" stroke="#E8650A" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M39 20 Q43 28 41 36" stroke="#E8650A" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <ellipse cx="27" cy="29" rx="11" ry="12" fill="#F5CBA7"/>
      <ellipse cx="23" cy="27" rx="2.8" ry="2.2" fill="#6B3A00"/>
      <ellipse cx="31" cy="27" rx="2.8" ry="2.2" fill="#6B3A00"/>
      <circle cx="24" cy="26" r="0.9" fill="white"/>
      <circle cx="32" cy="26" r="0.9" fill="white"/>
      <path d="M23 33 Q27 36 31 33" stroke="#C07A5A" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <circle cx="39" cy="18" r="4" fill="#3FA37A" opacity="0.9"/>
      <circle cx="39" cy="18" r="2" fill="#0E1A08"/>
      <line x1="39" y1="15" x2="41" y2="17" stroke="#7FD3AE" strokeWidth="1"/>
    </svg>
  ),
  luffy: ({ size=54 }) => (
    <svg width={size} height={size} viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="26" fill="#1A0A00" stroke="#D4AF37" strokeWidth="2"/>
      <ellipse cx="27" cy="13" rx="20" ry="5" fill="#D4AF37"/>
      <ellipse cx="27" cy="10" rx="11" ry="7" fill="#C8922A"/>
      <rect x="16" y="12" width="22" height="3" fill="#E05555" opacity="0.9"/>
      <ellipse cx="27" cy="22" rx="12" ry="9" fill="#0A0A0A"/>
      <ellipse cx="27" cy="30" rx="11" ry="11" fill="#F5CBA7"/>
      <path d="M30 28 L33 31" stroke="#E05555" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 33 Q27 40 34 33" stroke="#C07A5A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="22" y1="34" x2="22" y2="37" stroke="#C07A5A" strokeWidth="1"/>
      <line x1="26" y1="35" x2="26" y2="38" stroke="#C07A5A" strokeWidth="1"/>
      <line x1="30" y1="35" x2="30" y2="38" stroke="#C07A5A" strokeWidth="1"/>
      <line x1="34" y1="34" x2="34" y2="37" stroke="#C07A5A" strokeWidth="1"/>
      <ellipse cx="23" cy="27" rx="3" ry="2.5" fill="#3A1A00"/>
      <ellipse cx="31" cy="27" rx="3" ry="2.5" fill="#3A1A00"/>
      <circle cx="24" cy="26" r="1" fill="white"/>
    </svg>
  ),
  franky: ({ size=54 }) => (
    <svg width={size} height={size} viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="26" fill="#060E1A" stroke="#3E86C4" strokeWidth="1.5"/>
      <rect x="13" y="14" width="28" height="8" rx="4" fill="#3E86C4"/>
      <circle cx="22" cy="18" r="4" fill="#0A1830" stroke="#84B8E6" strokeWidth="1"/>
      <circle cx="32" cy="18" r="4" fill="#0A1830" stroke="#84B8E6" strokeWidth="1"/>
      <line x1="26" y1="18" x2="28" y2="18" stroke="#84B8E6" strokeWidth="1"/>
      <path d="M16 14 Q27 4 38 14" fill="#3E86C4" stroke="#84B8E6" strokeWidth="0.5"/>
      <ellipse cx="27" cy="31" rx="12" ry="12" fill="#C8956A"/>
      <rect x="22" y="39" width="10" height="4" rx="2" fill="#A07040" opacity="0.6"/>
      <path d="M21 34 Q27 40 33 34" stroke="#7A4A20" strokeWidth="1.5" fill="#F5E0B0" strokeLinecap="round"/>
      <rect x="41" y="24" width="5" height="10" rx="2" fill="#3E86C4" opacity="0.7"/>
    </svg>
  ),
};

// ---------- Crew view ----------
function CrewView() {
  return (
    <div>
      <div style={{ textAlign:"center", padding:"24px 0 20px" }}>
        <div style={{ fontSize:12, letterSpacing:3, textTransform:"uppercase", color:"#D4AF37", fontFamily:"'DM Sans',system-ui,sans-serif", marginBottom:8 }}>⚓ Grand Line Marketing Crew ⚓</div>
        <h1 style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:26, fontWeight:900, color:"#F3EEE2", margin:"0 0 6px", lineHeight:1.1 }}>MUGIWARA<br/><span style={{ fontSize:18, color:"#D4AF37" }}>JEWELRY PIRATES</span></h1>
        <p style={{ fontSize:13.5, color:"#9298BC", lineHeight:1.6, maxWidth:460, margin:"8px auto 0" }}>Five nakama. One mission: dominate the Myanmar jewelry FYP and make <b style={{ color:"#F3EEE2" }}>Jayden Gem</b> the most legendary piece on the Grand Line.</p>
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px auto 0", maxWidth:400 }}>
          <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,#D4AF3766,transparent)" }}/>
          <span style={{ color:"#D4AF37", fontSize:18 }}>☠</span>
          <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,#D4AF3766,transparent)" }}/>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:14 }}>
        {Object.entries(CREW).map(([k, m]) => {
          const Portrait = PORTRAITS[k];
          const badges = { luffy:"👑 CAPTAIN", robin:"🔮 ARCHAEOLOGIST", usopp:"✍️ SNIPER", nami:"📊 NAVIGATOR", franky:"🔧 SHIPWRIGHT" };
          const badgeColors = { luffy:["#3A2E10","#F0D27A","#6B5418"], robin:["#1C0A3A","#C9A4F0","#6B4AB8"], usopp:["#2A0A0A","#F2929F","#882040"], nami:["#0A1A0A","#7FD3AE","#206040"], franky:["#0A1020","#84B8E6","#204080"] };
          const [bg, fg, border] = badgeColors[k];
          return (
            <div key={k} className="crew-card-inner" style={{ background:`linear-gradient(145deg,#161E40,#0E1430)`, border:`1.5px solid ${m.gem}44`, borderRadius:18, padding:18, position:"relative", overflow:"hidden", transition:"transform 0.2s ease" }}>
              <div style={{ position:"absolute", top:0, right:0, width:60, height:60, background:`radial-gradient(circle at top right,${m.gem}22,transparent)`, borderRadius:"0 18px 0 0" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                <Portrait size={54} />
                <div>
                  <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fontSize:14, color:"#F3EEE2", letterSpacing:0.3 }}>{m.name}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:m.facet, marginTop:2, letterSpacing:0.5 }}>{m.role.toUpperCase()}</div>
                  <span style={{ display:"inline-block", marginTop:5, fontSize:10, background:bg, color:fg, border:`1px solid ${border}`, borderRadius:5, padding:"1px 6px", fontWeight:700 }}>{badges[k]}</span>
                </div>
              </div>
              <div style={{ fontSize:13, color:"#9298BC", lineHeight:1.55, borderTop:`1px solid ${m.gem}33`, paddingTop:10 }}>{m.blurb}</div>
              <div style={{ height:2, background:`linear-gradient(90deg,transparent,${m.gem},transparent)`, borderRadius:2, marginTop:12, opacity:0.5 }}/>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:22, background:"linear-gradient(135deg,#161E40,#0E1430)", border:"1px solid #D4AF3733", borderRadius:16, padding:20 }}>
        <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:12, color:"#D4AF37", letterSpacing:2, marginBottom:12 }}>📋 SHIP'S LOG — HOW THE CREW OPERATES</div>
        {[["🔮 Robin scouts","Finds hot celebrity jewelry trends — global + Myanmar FYP"],["⚔️ Crew debates","5 rounds of Robin vs Nami vs Usopp — best angle wins"],["👑 Luffy decides","Captain breaks deadlocks and gives the final directive"],["✋ You approve","Boss has final say — approve or send back with notes"],["✍️ Usopp writes","Scripts, shoot guide, CapCut guide, caption — all 5 accounts"],["📊 Nami analyzes","Reads your video stats cold — teaches the crew what works"],["🔧 Franky logs","Exports everything to your master Excel twice a week"]].map(([step,desc])=>(
          <div key={step} style={{ display:"flex", gap:12, alignItems:"start", padding:"8px 0", borderTop:"1px solid #2A335C44" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#F3EEE2", minWidth:130, flexShrink:0 }}>{step}</div>
            <div style={{ fontSize:13, color:"#9298BC", lineHeight:1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== GRAND LINE STRATEGY =====================
const STATIC_STRATEGY = {
  audiences: [
    {
      icon: "💎", label: "Females 18–34", color: "#E0556B",
      what: "Jewelry obsession, styling fantasy, aspirational taste, girl-math logic",
      hooks: ["Would you actually wear this?", "This is giving everything 💎", "Girl math: why this ring makes sense", "POV: you're about to spend rent on a ring"],
      formats: ["Single-piece deep dive", "Before/after styling", "Price shock reveal", "Smart Budget vs Red Carpet"],
      avoid: "Never talk down about budget choices — make every price point feel like a win",
    },
    {
      icon: "🌈", label: "Gay Male Audience", color: "#9B6BD6",
      what: "Celebrity taste wars, aesthetic authority, drama + shade, fashion intelligence",
      hooks: ["The audacity of this necklace 😭", "We need to talk about what she wore", "Rating every ring from that wedding", "He said this was luxury... I—"],
      formats: ["Celebrity VS head-to-head", "Ranking + countdown", "Shade/commentary tone", "Drama reaction"],
      avoid: "Don't be neutral — they want your OPINION. Be bold, be specific, take a side",
    },
    {
      icon: "🔥", label: "Cult Following (Both)", color: "#D4AF37",
      what: "Parasocial connection to Jayden specifically — they follow YOU, not just jewelry",
      hooks: ["I need to be honest with you", "Unpopular opinion:", "Am I the only one who thinks...", "Real talk —", "Nobody talks about this but"],
      formats: ["Personal/controversy", "Day-in-my-life moments", "Opinions nobody asked for", "Behind the scenes"],
      avoid: "Don't perform — be genuinely yourself. Cult following dies the moment it feels scripted",
    },
  ],
  weeklyPlan: [
    { day:"MON", emoji:"💎", theme:"Jewelry Deep Dive", audience:"Females", goal:"Educate + flex", hook:"Engineering flaw / price shock", example:"Why Hailey's ring costs $1.2M (and why that's actually cheap)" },
    { day:"TUE", emoji:"☕", theme:"Celebrity Tea", audience:"Gay + General FYP", goal:"Shares + comments", hook:"VS / ranking / shade", example:"Ranking every Blackpink engagement ring from worst to best 💅" },
    { day:"WED", emoji:"🎭", theme:"Personal Opinion", audience:"Cult building", goal:"Watch time + saves", hook:"Controversy / unpopular opinion", example:"Unpopular opinion: Beyoncé's ring is actually mid and here's why" },
    { day:"THU", emoji:"🎤", theme:"K-pop Spotlight", audience:"K-pop fans → new followers", goal:"Fastest follower growth", hook:"Price shock + fandom bait", example:"JISOO spent MORE on this necklace than on her apartment 😭" },
    { day:"FRI", emoji:"👁️", theme:"Parasocial Bridge", audience:"Existing followers", goal:"Loyalty + DMs", hook:"Personal story / real life", example:"I rejected a custom order today and here's why (storytime)" },
    { day:"SAT", emoji:"💣", theme:"BIG SWING", audience:"Whole FYP", goal:"Viral reach — post at 12AM", hook:"Your most controversial or emotional topic this week", example:"The ring that ended 3 relationships (and the gem science behind it)" },
    { day:"SUN", emoji:"🌊", theme:"Soft Story", audience:"Loyal followers", goal:"Retention + brand love", hook:"Behind the scenes / family / workshop", example:"Sunday at the workshop — what a real custom order looks like" },
  ],
  storyTypes: [
    { type:"Cult Builder", icon:"🔥", trigger:"3+ times/week on Stories", desc:"Daily presence that makes followers feel like insiders. Show your face, your mood, your real opinion on something. Ask questions. React to their DMs on Stories.", examples:["'Rate this piece I'm working on'","'Am I the only one who...'","Quick poll: which setting is better","Behind the counter moment"] },
    { type:"Female Magnet", icon:"💎", trigger:"Mon + any styling moment", desc:"Make jewelry feel personal and attainable at every level. Smart Budget framing, 'would you wear this', styling logic, aspirational but never alienating.", examples:["'This ring works on a Myanmar budget'","'The Everyday Wear version of this'","'Here's what I'd actually buy if I had her money'"] },
    { type:"Gay FYP Bait", icon:"✨", trigger:"Tue + anytime celebrity drama hits", desc:"Aesthetic authority + hot takes. Rate things. Rank things. Shade things (gently — never mean). They want to know what YOU think, specifically.", examples:["'I'm sorry but this is giving costume jewelry'","'The best dressed at [event] was actually...'","'Rating [group]'s jewelry from worst to best'"] },
    { type:"Parasocial Bomb", icon:"🎭", trigger:"Wed or whenever you have a real moment", desc:"The most powerful format you have. Real story, real opinion, real Jayden. This is what gets 19.9s watch time. Don't overthink it — just be honest.", examples:["'I need to tell you what happened today'","'Unpopular opinion that'll get me unfollowed'","'Can I be honest about something?'"] },
    { type:"K-pop Rocket", icon:"🚀", trigger:"Thu — when a K-pop moment is current", desc:"Your fastest follower growth engine. Lead with fandom bait, hit the price shock, tie to your expertise. K-pop fans move in groups — one video can cascade.", examples:["'[IDOL]'s [piece] cost HOW MUCH'","'Which [group] member has the best jewelry taste'","'The [comeback] stage jewelry breakdown'"] },
  ],
};

function Strategy({ bible, insights, videoLog, setErr }) {
  const [playbook, setPlaybook] = useState(null);
  const [busy, setBusy] = useState(false);
  const [activeAudience, setActiveAudience] = useState(0);
  const [activeDay, setActiveDay] = useState(null);

  const learned = insights.length
    ? insights.slice(0, 8).map(i => i.summary).filter(Boolean).join(" | ")
    : null;

  async function generatePlaybook() {
    setErr(null); setBusy(true);
    try {
      const topVideos = videoLog.slice(0, 6).map(v =>
        `${v.title}: ${v.views} views, watch ${v.watch}s, ${v.shares} shares, ${v.ai?.viral} viral, lesson: ${v.ai?.summary}`
      ).join("\n") || "No videos logged yet";
      const sys = ctx(bible) + `\nYou are a Creative Director named Luffy giving a personal strategy briefing based on Jayden's real data. IMPORTANT: Use ZERO One Piece or anime references. No Grand Line, East Blue, nakama, pirate, captain, stones, sea, or any fictional world terms whatsoever. Speak like a real marketing director — direct, specific, bold, professional.`;
      const usr = `Jayden's real video data:\n${topVideos}\n\nLessons Nami learned: ${learned || "none yet"}\n\nGive Jayden a PERSONAL strategy for building a cult following and attracting both female and gay male audiences in Myanmar. Cover:\n1. What's working vs what to do more of (cite the real videos)\n2. The 3 content layers (jewelry / personality / parasocial) and how to balance them THIS month\n3. One bold move Jayden hasn't tried yet that could 10x the following\n4. Which audience (female vs gay male) to prioritize right now based on the data\n5. A personal directive for this week — 2-3 bold clear sentences, NO anime or pirate references\n\nReturn ONLY JSON: {"topPattern":"one data insight","doMoreOf":"what is working","tryThis":"bold new move","prioritizeAudience":"who to focus on and why","captainOrder":"2-3 bold professional sentences — directive for this week, zero One Piece references","weekHighlight":"which day and format to go hardest on this week and why"}`;
      const result = await ask(sys, usr, true, 1500);
      setPlaybook(result);
    } catch(e) { setErr(e.message); }
    setBusy(false);
  }

  const P = STATIC_STRATEGY;

  return (
    <div>
      <Eyebrow>Grand Line Strategy</Eyebrow>
      <h2 style={S.h2}>🗺️ Your cult-building playbook</h2>
      <p style={S.lede}>How to build a fanbase that follows Jayden — not just jewelry. Which stories to post, which days, and how to pull in female and gay audiences on every FYP.</p>
      <SpeedControl />

      {/* Luffy's Personal Briefing */}
      <Card accent>
        <Step crew="luffy" label="Luffy's personal briefing — based on your real data" />
        <p style={{ ...S.subtle, marginTop:8 }}>
          {videoLog.length > 0
            ? `Luffy has ${videoLog.length} of your real videos to study. Hit the button for a personal strategy call.`
            : "Log some videos in Analytics first so Luffy can study your real numbers. Or get a general playbook now."}
        </p>
        <button style={{ ...S.gold, marginTop:10 }} disabled={busy} onClick={generatePlaybook}>
          {busy ? "Luffy is studying your numbers…" : "⚓ Get my personal strategy from Luffy"}
        </button>
        {playbook && (
          <div style={{ marginTop:16 }}>
            <div style={S.verdictBox}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:11, color:gold, letterSpacing:2 }}>👑 CAPTAIN'S ORDER</div>
                <SpeakBtn text={`Captain's order: ${playbook.captainOrder}. ${playbook.doMoreOf ? "Do more of: "+playbook.doMoreOf+"." : ""} ${playbook.tryThis ? "Bold move to try: "+playbook.tryThis+"." : ""} ${playbook.weekHighlight ? "This week: "+playbook.weekHighlight : ""}`} />
              </div>
              <p style={S.verdictText}>{playbook.captainOrder}</p>
            </div>
            {[
              ["📊 Top pattern from your data", playbook.topPattern, "#7FD3AE"],
              ["✅ Do more of this", playbook.doMoreOf, "#7FD3AE"],
              ["🚀 Bold move to try", playbook.tryThis, "#D4AF37"],
              ["🎯 Prioritize this audience", playbook.prioritizeAudience, "#C9A4F0"],
              ["💣 This week's big swing", playbook.weekHighlight, "#F2929F"],
            ].map(([label, value, color]) => value && (
              <div key={label} style={{ marginTop:12, padding:"10px 14px", background:panel2, borderRadius:10, borderLeft:`3px solid ${color}` }}>
                <div style={{ fontSize:11, fontWeight:700, color, letterSpacing:1, marginBottom:4, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{label}</div>
                <div style={{ fontSize:13.5, color:cream, lineHeight:1.6 }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Audience breakdown */}
      <Card>
        <div style={S.cardTitle}>🎯 Your three audiences — how to attract each one</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          {P.audiences.map((a, i) => (
            <button key={i} onClick={() => setActiveAudience(i)}
              style={{ ...S.seg, ...(activeAudience===i ? { ...S.segOn, background:a.color, borderColor:a.color } : {}) }}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>
        {(() => {
          const a = P.audiences[activeAudience];
          return (
            <div>
              <div style={{ fontSize:13.5, color:cream, lineHeight:1.6, marginBottom:12 }}><b style={{ color:a.color }}>What they want:</b> {a.what}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                <div style={{ background:panel2, borderRadius:10, padding:12, border:`1px solid ${a.color}33` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:a.color, letterSpacing:1, marginBottom:8, fontFamily:"'DM Sans',system-ui,sans-serif" }}>🪝 HOOKS THAT PULL THEM</div>
                  {a.hooks.map(h => <div key={h} style={{ fontSize:12.5, color:"#D5D3E0", marginBottom:5, paddingLeft:10, borderLeft:`2px solid ${a.color}55` }}>"{h}"</div>)}
                </div>
                <div style={{ background:panel2, borderRadius:10, padding:12, border:`1px solid ${a.color}33` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:a.color, letterSpacing:1, marginBottom:8, fontFamily:"'DM Sans',system-ui,sans-serif" }}>📹 BEST FORMATS</div>
                  {a.formats.map(f => <div key={f} style={{ fontSize:12.5, color:"#D5D3E0", marginBottom:5, paddingLeft:10, borderLeft:`2px solid ${a.color}55` }}>{f}</div>)}
                </div>
              </div>
              <div style={{ background:"#2A0A0A", borderRadius:10, padding:10, border:"1px solid #882040" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#F2929F", letterSpacing:1 }}>⚠️ AVOID: </span>
                <span style={{ fontSize:13, color:"#F2929F" }}>{a.avoid}</span>
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Weekly rhythm */}
      <Card>
        <div style={S.cardTitle}>📅 Weekly content rhythm — what to post each day</div>
        <p style={{ ...S.subtle, marginBottom:12 }}>Based on your real performance data. Sat 12AM is your best slot — save your biggest swing for then.</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {P.weeklyPlan.map((d, i) => (
            <button key={d.day} onClick={() => setActiveDay(activeDay===i ? null : i)}
              style={{ ...S.seg, ...(activeDay===i ? S.segOn : {}), padding:"7px 12px", fontSize:12 }}>
              {d.emoji} {d.day}
            </button>
          ))}
        </div>
        {activeDay !== null && (() => {
          const d = P.weeklyPlan[activeDay];
          return (
            <div style={{ background:panel2, borderRadius:12, padding:14, border:`1px solid ${line}`, animation:"none" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:28 }}>{d.emoji}</span>
                <div>
                  <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fontSize:16, color:gold }}>{d.day} — {d.theme}</div>
                  <div style={{ fontSize:12, color:mute, marginTop:2 }}>Audience: {d.audience} · Goal: {d.goal}</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <div style={{ background:navy, borderRadius:8, padding:10 }}>
                  <div style={{ fontSize:10.5, color:gold, fontWeight:700, letterSpacing:1, marginBottom:5 }}>🪝 HOOK TYPE</div>
                  <div style={{ fontSize:13, color:cream }}>{d.hook}</div>
                </div>
                <div style={{ background:navy, borderRadius:8, padding:10 }}>
                  <div style={{ fontSize:10.5, color:gold, fontWeight:700, letterSpacing:1, marginBottom:5 }}>📝 EXAMPLE</div>
                  <div style={{ fontSize:13, color:cream, fontStyle:"italic" }}>"{d.example}"</div>
                </div>
              </div>
            </div>
          );
        })()}
        {activeDay === null && (
          <div style={{ fontSize:13, color:mute, textAlign:"center", padding:"10px 0" }}>Tap a day to see what to post</div>
        )}
      </Card>

      {/* Story types */}
      <Card>
        <div style={S.cardTitle}>📖 Story types — what kind of content builds what</div>
        <p style={{ ...S.subtle, marginBottom:14 }}>Every video you make fits one of these. Know which you're posting and why.</p>
        {P.storyTypes.map(st => (
          <div key={st.type} style={{ borderTop:`1px solid ${line}`, padding:"14px 0" }}>
            <div style={{ display:"flex", gap:10, alignItems:"start", marginBottom:8 }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{st.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                  <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fontSize:14, color:cream }}>{st.type}</div>
                  <span style={{ fontSize:10.5, background:"#1A2035", color:gold, border:"1px solid #D4AF3744", borderRadius:5, padding:"2px 8px", fontWeight:700 }}>{st.trigger}</span>
                </div>
                <div style={{ fontSize:13.5, color:"#C9D2F0", lineHeight:1.6, marginBottom:8 }}>{st.desc}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {st.examples.map(e => (
                    <span key={e} style={{ fontSize:12, background:panel2, color:"#9DBCE0", border:`1px solid ${line}`, borderRadius:8, padding:"4px 10px", fontStyle:"italic" }}>"{e}"</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* The 3 layers */}
      <Card>
        <div style={S.cardTitle}>🔮 The 3 content layers — your cult-building formula</div>
        <p style={{ ...S.subtle, marginBottom:14 }}>Every week should have content from all three. If you only post jewelry, you have an account. If you mix all three, you build a cult.</p>
        {[
          { n:"1", title:"Jewelry Layer", color:"#D4AF37", pct:"40%", desc:"The expertise that makes you credible. Price shocks, gem knowledge, celebrity pieces, engineering facts. This is why people trust you.", signal:"High saves, female audience, search traffic" },
          { n:"2", title:"Personality Layer", color:"#E0556B", pct:"35%", desc:"The real Jayden. Opinions, humor, reactions, hot takes. This is what makes people stay after the first video. No personality = no cult.", signal:"High watch time, comments, controversy shares" },
          { n:"3", title:"Parasocial Bridge", color:"#9B6BD6", pct:"25%", desc:"The connection that makes them loyal. Day in your life, behind the scenes, DM them back on Stories. This converts followers into fans.", signal:"DMs, story replies, 'feel like I know you' comments" },
        ].map(l => (
          <div key={l.n} style={{ display:"flex", gap:14, padding:"14px 0", borderTop:`1px solid ${line}`, alignItems:"start" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${l.color}44,${l.color}22)`, border:`2px solid ${l.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:900, fontSize:18, color:l.color, flexShrink:0 }}>{l.n}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:4 }}>
                <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fontSize:14, color:cream }}>{l.title}</div>
                <span style={{ fontSize:11, background:`${l.color}22`, color:l.color, borderRadius:5, padding:"1px 7px", fontWeight:700 }}>{l.pct} of posts</span>
              </div>
              <div style={{ fontSize:13.5, color:"#C9D2F0", lineHeight:1.6, marginBottom:6 }}>{l.desc}</div>
              <div style={{ fontSize:12, color:mute }}><b style={{ color:l.color }}>Success signal:</b> {l.signal}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ===================== STUDIO =====================
function Studio({ bible, insights, finalScripts = [], studioSeed = "", setStudioSeed, ideas = [], setIdeas, setTab,
  phase, setPhase, trends, setTrends, debate, setDebate, verdict, setVerdict,
  briefs, setBriefs, scriptDebate, setScriptDebate, picked, setPicked,
  pendingTopic, setPendingTopic, setErr }) {
  const [seed, setSeed] = useState(studioSeed);
  const [feedback, setFeedback] = useState("");
  const [userInput, setUserInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);
  // Sync seed when Ideas pushes a topic in
  useEffect(() => { if (studioSeed) { setSeed(studioSeed); setStudioSeed && setStudioSeed(""); } }, [studioSeed]);
  const [debateLog, setDebateLog] = useState([]);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [debate, scriptDebate]);

  const learned = insights.length ? insights.map(i => i.summary).filter(Boolean).join(" | ") : "No past performance data logged yet.";

  async function research() {
    setErr(null); setBusy(true); setPhase("researching");
    setTrends([]); setDebate([]); setVerdict(null); setBriefs([]); setScriptDebate([]);
    try {
      const sys = ctx(bible) + "\nYou are Nico Robin, Trend Researcher. Search global celebrity jewelry moments AND Myanmar/SE-Asia relevant angles. Remember Jayden's growth lessons (K-pop = followers, multi-part = shares, personal/controversy = watch time).";
      const usr = `Learned so far: ${learned}\nBoss's direction: "${seed || "open — surprise me with what's hot now"}".\nPropose 4 topics. Return ONLY a JSON array, each: {"celebrity":"","piece":"","platform":"TikTok|Facebook|Both","trendScore":0-100,"reason":"one sentence, Myanmar audience","hookType":"one of: ${HOOK_TYPES.join(', ')}"}.`;
      const r = await ask(sys, usr, true);
      const arr = Array.isArray(r) ? r : (r?.topics || []);
      setTrends(arr.filter(t => t && t.celebrity)); setPhase("trends");
    } catch (e) { setErr(e.message); setPhase("idle"); }
    setBusy(false);
  }

  async function debateTopic(topic) {
    setErr(null); setBusy(true); setPhase("debating"); setDebate([]); setVerdict(null); setDebateLog([]); setPendingTopic(topic); setUserInput("");
    const t = [];
    const speakers = [
      { k:"robin", who:"Nico Robin (Trend Researcher)", line:"Argue for trend timing & reach. Push your pick but stay open." },
      { k:"nami",  who:"Nami (Analytics Analyst)", line:`Use cold data to support or push back. Known: ${learned}. Cite watch time, shares, follower conversion.` },
      { k:"usopp", who:"Usopp (Script Writer)", line:"Argue from hook & story angle — which gives the strongest opening and the best personal/cult-following moment. Offer compromises." },
    ];
    try {
      // Rounds 1-2 automatically
      for (let round=1; round<=2; round++) {
        for (const sp of speakers) {
          const sys = ctx(bible) + `\nYou are ${sp.who} in a crew debate. ${sp.line} 2-3 punchy sentences. Disagree when you have reason. Debate round ${round} of 5.`;
          const usr = `Topic: ${topic.celebrity} — ${topic.piece} (${topic.platform}), trend ${topic.trendScore}.\nDebate so far:\n${t.map(x=>`${x.who}: ${x.text}`).join("\n")||"(open)"}\nYour round ${round} argument:`;
          const text = await ask(sys, usr, false);
          t.push({ round, k:sp.k, who:sp.who, text:text.trim() }); setDebate([...t]);
        }
      }
      // Pause — boss can jump in now
      setPhase("bossInput");
    } catch (e) { setErr(e.message); setPhase("trends"); }
    setBusy(false);
  }

  async function continueDebate(bossNote) {
    if (!pendingTopic) return;
    setErr(null); setBusy(true); setPhase("debating");
    const t = [...debate];
    // Add boss entry to the log
    if (bossNote.trim()) {
      t.push({ round:"boss", k:"boss", who:"👑 You (Boss)", text:bossNote.trim() });
      setDebate([...t]);
    }
    const speakers = [
      { k:"robin", who:"Nico Robin (Trend Researcher)", line:"Argue for trend timing & reach. The boss just weighed in — factor their note in." },
      { k:"nami",  who:"Nami (Analytics Analyst)", line:`Use cold data. Known: ${learned}. The boss just spoke — address their point.` },
      { k:"usopp", who:"Usopp (Script Writer)", line:"Respond to the boss's note and the crew. Find the strongest angle." },
    ];
    try {
      for (let round=3; round<=5; round++) {
        for (const sp of speakers) {
          const sys = ctx(bible) + `\nYou are ${sp.who} in a crew debate. ${sp.line} 2-3 punchy sentences. Round ${round} of 5.`;
          const usr = `Topic: ${pendingTopic.celebrity} — ${pendingTopic.piece}.\nDebate so far (including boss's input):\n${t.map(x=>`${x.who}: ${x.text}`).join("\n")}\nYour round ${round} argument:`;
          const text = await ask(sys, usr, false);
          t.push({ round, k:sp.k, who:sp.who, text:text.trim() }); setDebate([...t]);
        }
      }
      setPhase("verdict");
      const vsys = ctx(bible) + "\nYou are Luffy, the Captain. The boss jumped into the debate with their own opinion. Give the final call honoring what the boss said. Decisive and short.";
      const vusr = `Topic: ${pendingTopic.celebrity} — ${pendingTopic.piece}.\nFull debate (including boss input):\n${t.map(x=>`[R${x.round}] ${x.who}: ${x.text}`).join("\n")}\nReturn ONLY JSON: {"verdict":"2-3 sentences","finalTopic":"","leadAccount":"","hookType":"","directive":""}.`;
      const v = await ask(vsys, vusr, true);
      setVerdict({ ...v, topic: pendingTopic });
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  async function sendBack() {
    if (!verdict) return; setErr(null); setBusy(true);
    try {
      const sys = ctx(bible) + "\nYou are Luffy, Creative Director. The boss reviewed your call and sent it back with a note. Revise the verdict to honor it. Decisive.";
      const usr = `Previous: ${verdict.verdict}\nBoss note: "${feedback}"\nReturn ONLY JSON: {"verdict":"","finalTopic":"","leadAccount":"","hookType":"","directive":""}.`;
      const v = await ask(sys, usr, true); setVerdict({ ...v, topic: verdict.topic }); setFeedback("");
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  async function approveWrite() {
    if (!verdict) return; setErr(null); setBusy(true); setPhase("writing"); setBriefs([]);
    const chosen = Object.keys(picked).filter(k => picked[k]);
    const out = [];
    try {
      for (const acc of chosen) {
        const A = ACCOUNTS[acc];
        // Use the boss's own final edited scripts for THIS account as voice examples (most recent 2)
        const examples = finalScripts.filter(s => s.account === A.label).slice(0, 2);
        const voiceBlock = examples.length
          ? "\n\nVOICE EXAMPLES — these are the boss's OWN final edited scripts. Match this rhythm, line length, emoji use and personality closely:\n" +
            examples.map((s, i) => `Example ${i+1}${s.topic ? " ("+s.topic+")" : ""}:\n${(s.text||"").slice(0, 900)}`).join("\n---\n")
          : "";
        const sys = ctx(bible) + `\nYou are Usopp, Script Writer, writing for ${A.label} (${A.platform}). Made by: ${A.who}. VOICE: ${A.voice}\nDirector's directive: ${verdict.directive}. Hook type: ${verdict.hookType}.` + voiceBlock;
        const usr = `Topic: ${verdict.finalTopic || (verdict.topic.celebrity+" — "+verdict.topic.piece)}.\nReturn ONLY valid JSON. Inside string values, write line breaks as \\n (escaped), never real newlines, and avoid double-quotes inside strings. Shape: {"script":"full Burmese script using \\n between lines","shoot":["3-5 shoot directions: what to film, angle, what to wear/show"],"capcut":["4-6 CapCut edit steps: text overlays w/ timing, transitions, effects, caption style, sound suggestion, color mood"],"caption":"post caption + hashtags","bestTime":"when to post"}.`;
        const b = await ask(sys, usr, true, 2000);
        out.push({ account: A.label, platform: A.platform, ...b, edited: b.script });
        setBriefs([...out]);
      }
      // script debate (3 rounds, lighter — crew critiques the drafts)
      setPhase("scriptDebate"); const sd = [];
      const speakers = [
        { k:"nami", who:"Nami (Analytics Analyst)", line:"Critique whether the hook will hold past 0:02 (most drop-off point) and whether it drives the right goal (followers vs shares vs DMs)." },
        { k:"usopp", who:"Usopp (Script Writer)", line:"Defend or improve the writing — punch up the opening line and the cult-following personal beat." },
      ];
      for (let round=1; round<=3; round++) {
        for (const sp of speakers) {
          const sys = ctx(bible) + `\nYou are ${sp.who} reviewing the DRAFT scripts. ${sp.line} 1-2 sentences. Round ${round} of 3.`;
          const usr = `Drafts:\n${out.map(o=>`[${o.account}] ${o.script.slice(0,300)}`).join("\n---\n")}\nDebate so far:\n${sd.map(x=>`${x.who}: ${x.text}`).join("\n")||"(open)"}\nYour round ${round} note:`;
          const text = await ask(sys, usr, false);
          sd.push({ round, k:sp.k, who:sp.who, text:text.trim() }); setScriptDebate([...sd]);
        }
      }
      // Luffy script verdict appended as last item
      const lv = await ask(ctx(bible)+"\nYou are Luffy. One short final note on the scripts before the boss edits.", `Notes:\n${sd.map(x=>x.who+": "+x.text).join("\n")}`, false);
      sd.push({ round:0, k:"luffy", who:"Luffy (Creative Director)", text: lv.trim() }); setScriptDebate([...sd]);
      setPhase("edit");
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  function editBrief(i, val) { const c=[...briefs]; c[i].edited=val; setBriefs(c); }

  return (
    <div>
      <Eyebrow>Content studio</Eyebrow>
      <h2 style={S.h2}>Research → debate → your call → write</h2>
      <SpeedControl />

      {/* Step 1 */}
      <Card>
        <Step n="1" crew="robin" label="Nico Robin finds trends" />
        <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
          <input style={S.input} placeholder="Direction (optional) — e.g. K-pop jewelry, or leave blank" value={seed} onChange={e=>setSeed(e.target.value)} />
          <button style={S.gold} disabled={busy} onClick={research}>{phase==="researching"?"Searching…":"Find trends"}</button>
        </div>
      </Card>

      {trends.length>0 && (
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4, flexWrap:"wrap", gap:8 }}>
            <div style={S.cardTitle}>Pick a topic to put to the crew</div>
            <button style={{ ...S.ghost, fontSize:12, padding:"5px 11px" }} disabled={busy} onClick={research}>
              🔄 New suggestions
            </button>
          </div>
          {trends.map((t,i)=>(
            <div key={i} style={S.trendRow}>
              <div style={{ flex:1 }}>
                <div style={S.trendName}>{t.celebrity} — {t.piece}</div>
                <div style={S.trendReason}>{t.reason}</div>
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                  <Tag>{t.platform}</Tag><Tag>{t.hookType}</Tag><Tag gold>Trend {t.trendScore}</Tag>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                <button style={S.ghost} disabled={busy} onClick={()=>debateTopic(t)}>Debate →</button>
                <button style={{ ...S.ghost, fontSize:11.5, padding:"5px 10px", color:"#F0D27A", borderColor:"#6B541888" }}
                  onClick={()=>{
                    const ideaText = `${t.celebrity} — ${t.piece} (${t.hookType})`;
                    setIdeas([{ id:Date.now(), text:ideaText, plan:null, date:new Date().toISOString().slice(0,10) }, ...ideas]);
                  }}>
                  💡 Save idea
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {debate.length>0 && (
        <Card>
          <Step n="2" label="Crew debate — 5 rounds" />
          <div ref={logRef} style={S.thread}>
            {debate.map((d,i) => (
              <Bubble key={i} d={d.k === "boss"
                ? { ...d, k:"luffy" }  // render boss entry in gold
                : d
              } bossEntry={d.k==="boss"} />
            ))}
            {phase==="debating" && <Typing />}
          </div>
        </Card>
      )}

      {phase==="bossInput" && (
        <Card accent>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <span style={{ fontSize:24 }}>👑</span>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:cream }}>Your turn — jump into the debate</div>
              <div style={{ fontSize:13, color:mute, marginTop:2 }}>The crew heard 2 rounds. What do you think? Push them in a direction, disagree, or just say "keep going" to let them finish.</div>
            </div>
          </div>
          <textarea style={{ ...S.textarea, minHeight:80 }}
            placeholder='e.g. "Focus on BLACKPINK specifically — which member has the most expensive piece" or "keep going"'
            value={userInput} onChange={e=>setUserInput(e.target.value)} />
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button style={S.gold} disabled={busy} onClick={()=>continueDebate(userInput)}>
              {busy ? "Crew continuing…" : "⚔️ Send & continue debate"}
            </button>
            <button style={S.ghost} disabled={busy} onClick={()=>continueDebate("")}>
              Skip — let crew finish
            </button>
          </div>
        </Card>
      )}

      {verdict && (
        <Card accent>
          <Step n="3" crew="luffy" label="Luffy's verdict" />
          <div style={S.verdictBox}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:4 }}>
              <p style={{ ...S.verdictText, flex:1, margin:0 }}>{verdict.verdict}</p>
              <SpeakBtn text={`Luffy says: ${verdict.verdict}. Directive to Usopp: ${verdict.directive}`} />
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
              <Tag>Topic: {verdict.finalTopic}</Tag><Tag>Lead: {verdict.leadAccount}</Tag><Tag>{verdict.hookType}</Tag>
            </div>
            <div style={S.directive}><b>To Usopp:</b> {verdict.directive}</div>
          </div>

          <div style={{ marginTop:16 }}>
            <div style={S.yourCall}>Your call 👑</div>
            <div style={S.subtle}>Which accounts should Usopp write for?</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"10px 0 14px" }}>
              {Object.entries(ACCOUNTS).map(([k,a])=>(
                <button key={k} onClick={()=>setPicked({ ...picked,[k]:!picked[k] })}
                  style={{ ...S.chip, ...(picked[k]?{ background:a.color, color:"#0E1430", borderColor:a.color }:{}) }}>{a.label}</button>
              ))}
            </div>
            <button style={S.gold} disabled={busy} onClick={approveWrite}>
              {phase==="writing"?"Usopp is writing…":phase==="scriptDebate"?"Crew reviewing scripts…":"Approve & write"}
            </button>
            <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
              <input style={S.input} placeholder="Or send back with a note…" value={feedback} onChange={e=>setFeedback(e.target.value)} />
              <button style={S.ghost} disabled={busy||!feedback} onClick={sendBack}>Send back</button>
            </div>
            {/* Save to Ideas — for when you like it but aren't ready to shoot */}
            <div style={{ marginTop:10 }}>
              <button style={{ ...S.ghost, fontSize:12.5, color:"#F0D27A", borderColor:"#6B541888" }} onClick={() => {
                if (!verdict || !setIdeas) return;
                const ideaText = `${verdict.finalTopic || (verdict.topic?.celebrity+" — "+verdict.topic?.piece)} · ${verdict.hookType} · Luffy: "${verdict.directive}"`;
                setIdeas([{ id:Date.now(), text:ideaText, plan:null, date:new Date().toISOString().slice(0,10) }, ...(ideas||[])]);
                setTab && setTab("ideas");
              }}>💡 Save to Ideas (not ready to shoot yet)</button>
            </div>
          </div>
        </Card>
      )}

      {scriptDebate.length>0 && (
        <Card>
          <Step n="4" label="Crew reviews the scripts — 3 rounds" />
          <div style={S.thread}>
            {scriptDebate.map((d,i)=><Bubble key={i} d={d} />)}
            {phase==="scriptDebate" && <Typing />}
          </div>
        </Card>
      )}

      {briefs.length>0 && phase==="edit" && (
        <Card>
          <Step n="5" crew="usopp" label="Your scripts — edit, then they're ready" />
          <div style={S.subtle}>Edit any script below. What you keep is the final version.</div>
          {briefs.map((b,i)=>(
            <div key={i} style={S.briefBox}>
              <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                <Tag gold>{b.account}</Tag><Tag>{b.platform}</Tag><Tag>⏰ {b.bestTime}</Tag>
              </div>
              <Label>Script (editable)</Label>
              <textarea style={S.textarea} value={b.edited} onChange={e=>editBrief(i,e.target.value)} rows={Math.min(14, (b.edited||"").split("\n").length+2)} />
              <Label>🎬 What to film</Label>
              <ul style={S.ul}>{(b.shoot||[]).map((s,j)=><li key={j}>{s}</li>)}</ul>
              <Label>✂️ CapCut edit</Label>
              <ul style={S.ul}>{(b.capcut||[]).map((s,j)=><li key={j}>{s}</li>)}</ul>
              <Label>📝 Caption</Label>
              <div style={S.caption}>{b.caption}</div>
            </div>
          ))}
          <div style={S.logged}>🔧 Franky logged these to your Google Sheet (Scripts tab).</div>
        </Card>
      )}
    </div>
  );
}

// ===================== CALENDAR =====================
function Calendar({ bible, insights, calMonth, setCalMonth, calWeek, setCalWeek, setStudioSeed, setTab, setIdeas, setErr }) {
  const [view, setView] = useState("month");
  const [busy, setBusy] = useState(false);
  const [monthNote, setMonthNote] = useState("");
  const [weekNote, setWeekNote] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [savedPosts, setSavedPosts] = useState({}); // tracks which posts were saved to Ideas
  const month = calMonth;
  const setMonth = setCalMonth;
  const week = calWeek;
  const setWeek = setCalWeek;
  const learned = insights.length ? insights.map(i=>i.summary).join(" | ") : "no logged data yet";

  function sendPostToStudio(p) {
    if (!setStudioSeed || !setTab) return;
    setStudioSeed(`${p.account} — ${p.idea} (${p.format})`);
    setTab("studio");
  }

  async function discussPost(p, note) {
    if (!note.trim()) return;
    setBusy(true);
    try {
      const sys = ctx(bible) + "\nYou are Luffy + the crew discussing a specific planned post. Give sharp, specific feedback. 3-4 sentences max.";
      const usr = `Post: ${p.account} on ${p.platform} — "${p.idea}" (${p.format})\nShoot: ${p.whatToFilm}\nCaption: ${p.caption}\nBoss says: "${note}"\nRespond directly to the boss's note about this specific post.`;
      const reply = await ask(sys, usr, false, 800);
      setActivePost(prev => ({ ...prev, reply, note:"" }));
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  async function refineMonth() {
    if (!monthNote.trim() || !month) return;
    setErr(null); setBusy(true);
    try {
      const sys = ctx(bible) + "\nYou are Luffy + the crew refining an existing month plan based on the boss's feedback. Keep what works, change only what's asked. Return ONLY valid JSON, escape line breaks as \\n.";
      const usr = `Current plan: ${JSON.stringify(month)}\nBoss feedback: "${monthNote}"\nReturn updated JSON same shape: {"theme":"","weeks":[{"week":1,"focus":"","highlights":[]},...]}.`;
      setMonth(await ask(sys, usr, true, 2000));
      setMonthNote("");
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  async function refineWeek() {
    if (!weekNote.trim() || !week) return;
    setErr(null); setBusy(true);
    try {
      const sys = ctx(bible) + "\nYou are the crew refining a week plan. Keep what works, change only what the boss asks. Return ONLY valid JSON same shape: {\"days\":[{\"day\":\"\",\"posts\":[{\"account\":\"\",\"platform\":\"\",\"idea\":\"\",\"format\":\"\",\"whatToFilm\":\"\",\"caption\":\"\"}]}]}. Escape line breaks as \\n.";
      const usr = `Current week (summarised): ${JSON.stringify((week.days||[]).map(d=>({day:d.day,posts:(d.posts||[]).map(p=>p.idea)})))}\nBoss feedback: "${weekNote}"\nReturn the full updated week JSON.`;
      setWeek(await ask(sys, usr, true, 3000));
      setWeekNote("");
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  async function planMonth() {
    setErr(null); setBusy(true);
    try {
      const sys = ctx(bible) + "\nYou are Luffy + the crew planning a 1-MONTH content overview across 5 accounts (Jayden Gem TikTok, Jayden Facebook, Saung Htee Phyu TikTok, SHP Academy Facebook, SHP Goldsmith Facebook). 7 posts/account/week. Mix Jayden's 3 layers (jewelry/personality/parasocial). Use best time Sat 12am for Jayden. Return ONLY valid JSON, escape any line breaks as \\n.";
      const usr = `Learned: ${learned}\nShape: {"theme":"month theme","weeks":[{"week":1,"focus":"","highlights":["3-4 marquee posts across accounts"]},{"week":2,...},{"week":3,...},{"week":4,...}]}.`;
      setMonth(await ask(sys, usr, true, 2000));
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }
  async function planWeek() {
    setErr(null); setBusy(true);
    try {
      const sys = ctx(bible) + "\nYou are the crew planning content days. Keep each post SHORT (one line each field). Return ONLY valid JSON array of day objects, escape line breaks as \\n, no double-quotes inside strings. Shape: [{\"day\":\"Mon\",\"posts\":[{\"account\":\"\",\"platform\":\"\",\"idea\":\"short\",\"format\":\"talking-head/VS/ranking/story/BTS\",\"whatToFilm\":\"short\",\"caption\":\"short\"}]}]";
      // Split into two calls to keep responses small and reliable
      const usr1 = `Learned: ${learned}\nPlan Mon, Tue, Wed only. 1-2 posts per day across the 5 accounts. Return ONLY a JSON array for these 3 days.`;
      const usr2 = `Learned: ${learned}\nPlan Thu, Fri, Sat (post at 12AM), Sun only. 1-2 posts per day. Sat is the biggest swing of the week. Return ONLY a JSON array for these 4 days.`;
      const [days1, days2] = await Promise.all([
        ask(sys, usr1, true, 1500),
        ask(sys, usr2, true, 1500),
      ]);
      const allDays = [...(Array.isArray(days1) ? days1 : []), ...(Array.isArray(days2) ? days2 : [])];
      setWeek({ days: allDays });
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  return (
    <div>
      <Eyebrow>Content calendar</Eyebrow>
      <h2 style={S.h2}>Plan the month, run the week</h2>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <button style={{ ...S.seg, ...(view==="month"?S.segOn:{}) }} onClick={()=>setView("month")}>Monthly overview</button>
        <button style={{ ...S.seg, ...(view==="week"?S.segOn:{}) }} onClick={()=>setView("week")}>Weekly breakdown</button>
      </div>

      {view==="month" && (
        <div>
          <Card>
            {!month ? (
              <Empty text="No month planned yet." action={<button style={S.gold} disabled={busy} onClick={planMonth}>{busy?"Planning…":"Plan this month"}</button>} />
            ) : (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                  <div style={S.cardTitle}>{month.theme}</div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={{ ...S.gold, fontSize:12, padding:"6px 12px" }} disabled={busy} onClick={planMonth}>🔄 Refresh plan</button>
                  </div>
                </div>
                {(month.weeks||[]).map((w,i)=>(
                  <div key={i} style={S.weekRow}>
                    <div style={S.weekNum}>W{w.week}</div>
                    <div style={{ flex:1 }}>
                      <div style={S.weekFocus}>{w.focus}</div>
                      <ul style={S.ul}>{(w.highlights||[]).map((h,j)=><li key={j}>{h}</li>)}</ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          {month && (
            <Card>
              <Step crew="luffy" label="Keep discussing the month plan" />
              <p style={{ ...S.subtle, marginTop:6 }}>Tell Luffy what to change — shift a week's focus, add a theme, push harder on K-pop, anything.</p>
              <textarea style={{ ...S.textarea, minHeight:70, marginTop:8 }}
                placeholder='e.g. "Week 2 should focus more on K-pop comebacks" or "Add a personal story week"'
                value={monthNote} onChange={e=>setMonthNote(e.target.value)} />
              <button style={{ ...S.gold, marginTop:8 }} disabled={busy||!monthNote.trim()} onClick={refineMonth}>
                {busy?"Refining…":"✍️ Refine this plan"}
              </button>
            </Card>
          )}
        </div>
      )}

      {view==="week" && (
        <div>
          <Card>
            {!week ? (
              <Empty text="No week planned yet." action={<button style={S.gold} disabled={busy} onClick={planWeek}>{busy?"Planning…":"Plan this week"}</button>} />
            ) : (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:cream }}>This week</div>
                  <button style={{ ...S.gold, fontSize:12, padding:"6px 12px" }} disabled={busy} onClick={planWeek}>🔄 Refresh plan</button>
                </div>
                {(week.days||[]).map((d,i)=>(
                  <div key={i} style={S.dayBlock}>
                    <div style={S.dayName}>{d.day}</div>
                    {(d.posts||[]).map((p,j)=>{
                      const key = `${i}-${j}`;
                      const isActive = activePost?.key === key;
                      return (
                        <div key={j} style={{ ...S.postRow, border: isActive ? `1px solid ${gold}` : `1px solid ${line}` }}>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:4 }}>
                            <Tag gold>{p.account}</Tag><Tag>{p.platform}</Tag><Tag>{p.format}</Tag>
                          </div>
                          <div style={S.postIdea}>{p.idea}</div>
                          <div style={S.postFilm}>🎬 {p.whatToFilm}</div>
                          <div style={S.postCap}>📝 {p.caption}</div>
                          {/* Action buttons */}
                          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                            <button style={{ ...S.gold, fontSize:11.5, padding:"5px 11px" }}
                              onClick={()=>sendPostToStudio(p)}>
                              ✍️ Write full script
                            </button>
                            <button style={{ ...S.ghost, fontSize:11.5, padding:"5px 11px",
                              color: isActive ? gold : cream,
                              borderColor: isActive ? "#6B5418" : line,
                              background: isActive ? "#1A1400" : "transparent" }}
                              onClick={()=>setActivePost(isActive ? null : { key, p, note:"", reply:null })}>
                              {isActive ? "💬 Discussing ✕" : "💬 Discuss"}
                            </button>
                            <button style={{ ...S.ghost, fontSize:11.5, padding:"5px 11px",
                                color: savedPosts[key] ? "#7FD3AE" : "#F0D27A",
                                borderColor: savedPosts[key] ? "#206040" : "#6B541866",
                                background: savedPosts[key] ? "#0A1A0A" : "transparent" }}
                              onClick={()=>{
                                if (savedPosts[key]) return;
                                setIdeas(prev => [{ id:Date.now(), text:`${p.account} — ${p.idea} (${p.format}, ${d.day})`, plan:null, date:new Date().toISOString().slice(0,10) }, ...prev]);
                                setSavedPosts(prev => ({ ...prev, [key]: true }));
                              }}>
                              {savedPosts[key] ? "✓ Saved to Ideas" : "💡 Save to Ideas"}
                            </button>
                          </div>
                          {/* Discuss panel */}
                          {isActive && (
                            <div style={{ marginTop:10, borderTop:`1px solid ${line}`, paddingTop:10 }}>
                              {activePost.reply && (
                                <div style={{ ...S.verdictBox, marginBottom:10 }}>
                                  <div style={{ fontSize:11, color:gold, fontWeight:700, marginBottom:6 }}>👑 CREW RESPONSE</div>
                                  <p style={{ ...S.verdictText, fontSize:13.5 }}>{activePost.reply}</p>
                                </div>
                              )}
                              <textarea style={{ ...S.textarea, minHeight:60 }}
                                placeholder='e.g. "Can we make this more personal?" or "Wrong account — this should be Saung Htee Phyu"'
                                value={activePost.note||""}
                                onChange={e=>setActivePost(prev=>({...prev, note:e.target.value}))} />
                              <button style={{ ...S.gold, marginTop:6, fontSize:12 }} disabled={busy}
                                onClick={()=>discussPost(p, activePost.note||"")}>
                                {busy?"…":"Send to crew"}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </Card>
          {week && (
            <Card>
              <Step crew="luffy" label="Keep discussing the week plan" />
              <p style={{ ...S.subtle, marginTop:6 }}>Push back on any day or post — swap an account, change a format, move Saturday's slot, anything.</p>
              <textarea style={{ ...S.textarea, minHeight:70, marginTop:8 }}
                placeholder='e.g. "Move the K-pop post to Thursday" or "Wednesday needs a personal story instead"'
                value={weekNote} onChange={e=>setWeekNote(e.target.value)} />
              <button style={{ ...S.gold, marginTop:8 }} disabled={busy||!weekNote.trim()} onClick={refineWeek}>
                {busy?"Refining…":"✍️ Refine this plan"}
              </button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ===================== IDEAS =====================
function Ideas({ ideas, setIdeas, bible, setStudioSeed, setTab, setErr }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeIdea, setActiveIdea] = useState(null);
  const [sentToStudio, setSentToStudio] = useState({}); // tracks which ideas were sent to Studio

  function drop() {
    if (!note.trim()) return;
    setIdeas([{ id:Date.now(), text:note.trim(), plan:null, date:new Date().toISOString().slice(0,10) }, ...ideas]); setNote("");
  }

  function sendToStudio(idea) {
    if (!setStudioSeed || !setTab) return;
    setStudioSeed(idea.text);
    setSentToStudio(prev => ({ ...prev, [idea.id]: true }));
    setTab("studio");
  }

  async function debateNow(id) {
    const idea = ideas.find(x=>x.id===id); if (!idea) return;
    setErr(null); setBusy(true);
    try {
      const sys = ctx(bible) + "\nThe crew (Robin, Nami, Usopp) reacts to the boss idea, then Luffy turns it into a plan. Be specific.";
      const usr = `Boss idea: "${idea.text}".\nReturn ONLY JSON: {"reactions":[{"who":"Nico Robin","text":""},{"who":"Nami","text":""},{"who":"Usopp","text":""}],"verdict":"Luffy call","bestAccount":"","hook":"","action":"one next step"}.`;
      const plan = await ask(sys, usr, true);
      setIdeas(ideas.map(x=>x.id===id?{ ...x, plan }:x));
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  async function discussIdea(idea, note) {
    if (!note.trim()) return;
    setBusy(true);
    try {
      const sys = ctx(bible) + "\nYou are Luffy + the crew discussing a saved idea with the boss. Be specific and direct. 3-4 sentences max.";
      const usr = `Idea: "${idea.text}"\nBoss says: "${note}"\nRespond directly to the boss's note about this idea.`;
      const reply = await ask(sys, usr, false, 600);
      setActiveIdea(prev => ({ ...prev, reply, note:"" }));
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  function saveToScripts(idea) {
    // Save the idea text as a starting point in My Scripts
    alert("Go to My Scripts tab and paste this idea as your starting script.");
  }

  return (
    <div>
      <Eyebrow>Idea board</Eyebrow>
      <h2 style={S.h2}>Throw the crew an idea</h2>
      <p style={S.lede}>Save ideas for later, get a quick crew reaction, discuss with the crew, or send any idea straight to Studio for the full research → debate → script flow.</p>
      <Card>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <input style={S.input} placeholder="e.g. Sabrina Carpenter ring" value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&drop()} />
          <button style={S.gold} onClick={drop}>Add idea</button>
        </div>
      </Card>
      {ideas.length===0 && <Empty text="No ideas yet. The board is yours." />}
      {ideas.map(idea=>{
        const isActive = activeIdea?.id === idea.id;
        return (
          <Card key={idea.id}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"start" }}>
              <div style={S.ideaText}>💡 {idea.text}{idea.date && <span style={{ fontSize:11, color:mute, display:"block", marginTop:3 }}>{idea.date}</span>}</div>
              <div style={{ display:"flex", gap:6, flexDirection:"column", alignItems:"flex-end", flexShrink:0 }}>
                <button style={{ ...S.gold, fontSize:12, padding:"6px 12px",
                  background: sentToStudio[idea.id] ? "linear-gradient(135deg,#206040,#0E3020)" : undefined,
                  color: sentToStudio[idea.id] ? "#7FD3AE" : undefined }}
                  onClick={()=>sendToStudio(idea)}>
                  {sentToStudio[idea.id] ? "✓ Sent to Studio" : "✍️ Write full script"}
                </button>
                {!idea.plan && (
                  <button style={{ ...S.ghost, fontSize:12, padding:"6px 12px",
                    color: busy ? mute : cream,
                    borderColor: busy ? line : undefined }}
                    disabled={busy} onClick={()=>debateNow(idea.id)}>
                    {busy ? "Debating…" : "⚔️ Quick debate"}
                  </button>
                )}
                {idea.plan && (
                  <button style={{ ...S.ghost, fontSize:12, padding:"6px 12px", color:"#7FD3AE", borderColor:"#206040", background:"#0A1A0A" }} disabled>
                    ✓ Debated
                  </button>
                )}
                <button style={{ ...S.ghost, fontSize:12, padding:"6px 12px",
                  color: isActive ? gold : cream,
                  borderColor: isActive ? "#6B5418" : line,
                  background: isActive ? "#1A1400" : "transparent" }}
                  onClick={()=>setActiveIdea(isActive ? null : { id:idea.id, note:"", reply:null })}>
                  {isActive ? "💬 Discussing ✕" : "💬 Discuss"}
                </button>
                <button style={S.linkBtn} onClick={()=>setIdeas(ideas.filter(x=>x.id!==idea.id))}>delete</button>
              </div>
            </div>

            {/* Discuss panel */}
            {isActive && (
              <div style={{ marginTop:10, borderTop:`1px solid ${line}`, paddingTop:10 }}>
                {activeIdea.reply && (
                  <div style={{ ...S.verdictBox, marginBottom:10 }}>
                    <div style={{ fontSize:11, color:gold, fontWeight:700, marginBottom:6 }}>👑 CREW RESPONSE</div>
                    <p style={{ ...S.verdictText, fontSize:13.5 }}>{activeIdea.reply}</p>
                  </div>
                )}
                <textarea style={{ ...S.textarea, minHeight:60 }}
                  placeholder='e.g. "Which account should this go on?" or "What hook should I use?"'
                  value={activeIdea.note||""}
                  onChange={e=>setActiveIdea(prev=>({...prev, note:e.target.value}))} />
                <button style={{ ...S.gold, marginTop:6, fontSize:12 }} disabled={busy}
                  onClick={()=>discussIdea(idea, activeIdea.note||"")}>
                  {busy?"…":"Send to crew"}
                </button>
              </div>
            )}

            {idea.plan && (
              <div style={{ marginTop:10 }}>
                {(idea.plan.reactions||[]).map((r,i)=>{
                  const m = Object.values(CREW).find(c=>c.name===r.who) || CREW.robin;
                  return <div key={i} style={{ marginBottom:8 }}>
                    <span style={{ color:m.facet, fontWeight:600, fontSize:13 }}>{m.icon} {r.who}</span>
                    <div style={S.ideaReact}>{r.text}</div>
                  </div>;
                })}
                <div style={S.verdictBox}>
                  <p style={S.verdictText}>{idea.plan.verdict}</p>
                  <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                    <Tag gold>{idea.plan.bestAccount}</Tag><Tag>{idea.plan.hook}</Tag>
                  </div>
                  <div style={S.directive}><b>Next step:</b> {idea.plan.action}</div>
                  <button style={{ ...S.ghost, marginTop:10, fontSize:12, padding:"6px 12px", color:"#F0D27A", borderColor:"#6B541888" }} onClick={()=>sendToStudio(idea)}>✍️ Take to Studio — full script</button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}


// ===================== ANALYTICS =====================
function Analytics({ videoLog, setVideoLog, insights, setInsights, bible, finalScripts = [], pendingLogs = [], setPendingLogs, setErr }) {
  const today = new Date().toISOString().slice(0,10);
  const blank = { title:"", account:"Jayden Gem", platform:"TikTok", views:"", watch:"", completion:"", likes:"", comments:"", dms:"", shares:"", saves:"", celebrity:"", hookType:HOOK_TYPES[0], date:today, nonFollowers:"", female:"", male:"", age1824:"", age2534:"", topCountry:"Myanmar", fyp:"", daysOld:"1", script:"" };
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [namiInput, setNamiInput] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [pastedImgs, setPastedImgs] = useState([]);
  const [analyticsView, setAnalyticsView] = useState("log"); // "log" | "recent"
  const [editId, setEditId] = useState(null); // when updating an existing logged video
  const set = (k,v) => setF({ ...f,[k]:v });

  function fileToImage(file) {
    return new Promise((res, rej) => {
      if (!file || !(file instanceof Blob)) {
        rej(new Error("Not a valid image file"));
        return;
      }
      const r = new FileReader();
      r.onload = () => {
        const result = String(r.result);
        const comma = result.indexOf(",");
        const data = comma !== -1 ? result.slice(comma + 1) : result;
        const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const raw = file.type || "image/png";
        const media_type = allowed.includes(raw) ? raw : "image/png";
        res({ media_type, data });
      };
      r.onerror = () => rej(new Error("Could not read that image"));
      r.readAsDataURL(file);
    });
  }

  async function readShots(input) {
    setErr(null); setReading(true);
    try {
      let images;
      // Accept pre-built image array {media_type, data} or a FileList
      if (Array.isArray(input) && input.length > 0 && input[0]?.data) {
        images = input;
      } else {
        const files = Array.from(input || []).slice(0, 4).filter(f => f instanceof Blob);
        if (!files.length) { setReading(false); return; }
        const results = await Promise.allSettled(files.map(fileToImage));
        images = results.filter(r => r.status === "fulfilled").map(r => r.value);
      }
      if (!images.length) throw new Error("No valid images found");
      const sys = ctx(bible) + "\nYou are Nami. Read these TikTok/Facebook analytics screenshots carefully. Multiple screenshots may show Overview, Viewers, and Engagement tabs of the same video — combine all numbers. Convert 804K→804000. Watch time like '15.1s' becomes 15.1. 'Watched full video' = completion. Leave empty string for anything not visible.";
      const usr = `Extract all stats combined. Return ONLY JSON: {"title":"","account":"","platform":"TikTok|Facebook","views":"","watch":"","completion":"","likes":"","comments":"","dms":"","shares":"","saves":"","celebrity":"","date":"","nonFollowers":"","female":"","male":"","age1824":"","age2534":"","topCountry":"","fyp":"","daysOld":""}. Numbers only.`;
      const got = await askVision(sys, usr, images, true, 1500);
      if (got && typeof got === "object") {
        setF(prev => ({ ...prev, ...Object.fromEntries(Object.entries(got).filter(([,v]) => v !== "" && v != null)) }));
      }
    } catch(e){
      setErr("Couldn't read screenshot: " + e.message);
    }
    setReading(false);
  }

  async function analyze() {
    if (!f.title || !f.views) return;
    setErr(null); setBusy(true);
    try {
      const hist = videoLog.slice(0,5).map(v=>`${v.title}: ${v.views}v ${v.completion}% ${v.dms}DM female${v.female||"?"}% fyp${v.fyp||"?"}% age${v.daysOld||"?"}d`).join(" | ")||"none";
      const scriptBlock = f.script?.trim() ? `\nSCRIPT/CONTENT:\n${f.script.slice(0,800)}` : "";
      const sys = ctx(bible) + "\nYou are Nami, Analytics Analyst. Read this video against history. Cold and specific with numbers. Factor in how old the video is. If a script is provided, connect specific content decisions (hook, structure, topic, tone) to the performance numbers — what lines or moments likely drove saves/shares/drop-offs.";
      const usr = `New video (${f.daysOld||"?"} days since posted): ${JSON.stringify({...f, script:undefined})}${scriptBlock}\nLast 5: ${hist}\nReturn ONLY JSON: {"score":0-100,"viral":"Low|Medium|High|Explosive","dmConv":"x%","trend":"Improving|Declining|Stable","worked":["",""],"improve":["",""],"nextTopic":"","toRobin":"brief for researcher","toUsopp":"brief for writer — include specific script notes if script was provided","summary":"one-line pattern learned","audienceNote":"one insight from gender/age/location/FYP data","momentumNote":"is this video still growing peaked or slowing based on age vs views","scriptNote":"one specific insight connecting script content to a performance number — empty string if no script provided"}`;
      const ai = await ask(sys, usr, true, 1200);
      if (editId) {
        setVideoLog(videoLog.map(v => v.id===editId ? { ...f, ai, id:editId, updated:today } : v));
        setInsights([ai, ...insights]); // learn from updated stats too
        setEditId(null);
      } else {
        setVideoLog([{ ...f, ai, id:Date.now(), loggedAt:new Date().toISOString() }, ...videoLog]);
        setInsights([ai, ...insights]);
      }
      setF(blank);
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  function editEntry(v) {
    setEditId(v.id);
    setF({
      title:v.title, account:v.account, platform:v.platform,
      views:v.views, watch:v.watch, completion:v.completion,
      likes:v.likes, comments:v.comments, dms:v.dms,
      shares:v.shares, saves:v.saves, celebrity:v.celebrity,
      hookType:v.hookType||HOOK_TYPES[0], date:v.date||today,
      nonFollowers:v.nonFollowers||"", female:v.female||"", male:v.male||"",
      age1824:v.age1824||"", age2534:v.age2534||"", topCountry:v.topCountry||"Myanmar",
      fyp:v.fyp||"", daysOld:v.daysOld||"1",
      script:v.script||"" // carry over the original script automatically
    });
    if (typeof window !== "undefined") window.scrollTo({ top:0, behavior:"smooth" });
  }
  function cancelEdit() { setEditId(null); setF(blank); }

  return (
    <div>
      <Eyebrow>Analytics</Eyebrow>
      <h2 style={S.h2}>Nami reads the numbers</h2>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <button style={{ ...S.seg, ...(analyticsView==="log"?S.segOn:{}) }} onClick={()=>{ setAnalyticsView("log"); setEditId(null); setF(blank); }}>
          ➕ Log new video
        </button>
        <button style={{ ...S.seg, ...(analyticsView==="recent"?S.segOn:{}), position:"relative" }} onClick={()=>setAnalyticsView("recent")}>
          🕐 Update recent
          {(() => {
            const cutoff = Date.now() - 8*24*60*60*1000;
            const count = videoLog.filter(v => new Date(v.date||v.loggedAt||0).getTime() >= cutoff).length;
            return count > 0 ? <span style={{ position:"absolute", top:-6, right:-6, background:"#E0556B", color:"white", borderRadius:"50%", width:18, height:18, fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{count}</span> : null;
          })()}
        </button>
      </div>

      {/* Recent videos panel — last 8 days */}
      {analyticsView==="recent" && (() => {
        const cutoff = Date.now() - 8*24*60*60*1000;
        const recent = videoLog.filter(v => new Date(v.date||v.loggedAt||0).getTime() >= cutoff);
        return (
          <div style={{ marginBottom:16 }}>
            {recent.length === 0 && <Empty text="No videos logged in the last 8 days." />}
            {recent.map(v => {
              const daysAgo = Math.floor((Date.now() - new Date(v.date||v.loggedAt||0).getTime()) / (24*60*60*1000));
              const needsUpdate = !v.updated && daysAgo >= 3;
              return (
                <div key={v.id} style={{ ...S.card, border:`1.5px solid ${needsUpdate?CREW.nami.gem+"66":line}`, marginBottom:10, cursor:"pointer" }}
                  onClick={()=>{ editEntry(v); setAnalyticsView("log"); }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:cream, marginBottom:4 }}>{v.title||"(untitled)"}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                        <Tag gold>{v.account}</Tag>
                        <Tag>{v.platform}</Tag>
                        <Tag>{v.date}</Tag>
                        {v.updated && <Tag>updated {v.updated}</Tag>}
                        {needsUpdate && <span style={{ fontSize:11, background:"#2A0A0A", color:"#F2929F", border:"1px solid #882040", borderRadius:5, padding:"2px 8px", fontWeight:700 }}>⚠️ Due for day 3 update</span>}
                      </div>
                      <div style={{ fontSize:12.5, color:mute }}>
                        👁 {Number(v.views||0).toLocaleString()} views · ⏱ {v.watch}s · ✅ {v.completion}% · ❤️ {v.likes} · ↗️ {v.shares} shares
                      </div>
                    </div>
                    <div style={{ textAlign:"center", minWidth:54 }}>
                      <div style={{ fontSize:22, fontWeight:700, color: v.ai?.score>=70?"#7FD3AE":v.ai?.score>=45?"#F0D27A":"#F2929F" }}>{v.ai?.score||"—"}</div>
                      <div style={{ fontSize:9.5, color:mute }}>SCORE</div>
                    </div>
                  </div>
                  <div style={{ marginTop:8, fontSize:12, color:"#84B8E6", fontWeight:600 }}>
                    Tap to update stats →
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
      {pendingLogs.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:gold, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>📬 From Claude — ready to log</div>
          {pendingLogs.map((p, i) => (
            <div key={p.id} style={{ ...S.card, border:`1.5px solid ${gold}66`, marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", gap:10, flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14.5, color:cream, marginBottom:4 }}>{p.title}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                    <Tag gold>{p.account}</Tag><Tag>{p.platform}</Tag><Tag>{p.date}</Tag><Tag>{p.daysOld||"1"} day old</Tag>
                  </div>
                  <div style={{ fontSize:12.5, color:mute, lineHeight:1.8 }}>
                    {p.views&&<span>👁 {Number(p.views).toLocaleString()} views · </span>}
                    {p.watch&&<span>⏱ {p.watch}s · </span>}
                    {p.completion&&<span>✅ {p.completion}% · </span>}
                    {p.likes&&<span>❤️ {p.likes} · </span>}
                    {p.shares&&<span>↗️ {p.shares} shares · </span>}
                    {p.saves&&<span>🔖 {p.saves} saves · </span>}
                    {p.newFollowers!==undefined&&<span>👤 {p.newFollowers} new followers</span>}
                  </div>
                  {p.claudeNote&&<div style={{ fontSize:12.5, color:"#C9A4F0", marginTop:6, fontStyle:"italic" }}>💬 {p.claudeNote}</div>}
                </div>
                <div style={{ display:"flex", gap:6, flexDirection:"column", flexShrink:0 }}>
                  <button style={{ ...S.gold, fontSize:12, padding:"7px 14px" }} onClick={()=>{
                    setF(prev=>({ ...prev, ...p }));
                    setPendingLogs(pendingLogs.filter((_,j)=>j!==i));
                  }}>✓ Review & Log</button>
                  <button style={S.linkBtn} onClick={()=>setPendingLogs(pendingLogs.filter((_,j)=>j!==i))}>dismiss</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claude import — paste the code Claude gives you to add an entry instantly */}
      {(() => {
        const [importCode, setImportCode] = useState("");
        const [importMsg, setImportMsg] = useState("");
        return (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:mute, fontWeight:600, letterSpacing:1, marginBottom:6 }}>📥 PASTE CLAUDE'S LOG CODE</div>
            <div style={{ display:"flex", gap:8 }}>
              <input style={{ ...S.input, flex:1, fontSize:12.5 }}
                placeholder="Paste the code Claude gives you after reading your screenshots…"
                value={importCode}
                onChange={e=>setImportCode(e.target.value)} />
              <button style={S.gold} onClick={()=>{
                try {
                  const entry = JSON.parse(importCode.trim());
                  if (!entry.title) throw new Error("Invalid");
                  setPendingLogs(prev=>[{ ...entry, id: Date.now() }, ...prev]);
                  setImportCode("");
                  setImportMsg("✓ Added to inbox above!");
                  setTimeout(()=>setImportMsg(""), 3000);
                } catch(e){ setImportMsg("Invalid code — copy it exactly from Claude"); setTimeout(()=>setImportMsg(""), 3000); }
              }}>Add</button>
            </div>
            {importMsg && <div style={{ fontSize:12.5, color: importMsg.startsWith("✓") ? "#7FD3AE" : "#F2929F", marginTop:5 }}>{importMsg}</div>}
          </div>
        );
      })()}

      {videoLog.length > 0 && (() => {
        const last = videoLog[0];
        const loggedAt = last.loggedAt ? new Date(last.loggedAt).toLocaleString() : last.date;
        return (
          <div style={{ background:"#0A1A0A", border:"1px solid #206040", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6 }}>
            <div>
              <div style={{ fontSize:11, color:"#7FD3AE", fontWeight:700, letterSpacing:1, marginBottom:2 }}>✓ LAST LOGGED</div>
              <div style={{ fontSize:13.5, color:cream, fontWeight:600 }}>{last.title || "(untitled)"}</div>
              <div style={{ fontSize:12, color:mute, marginTop:2 }}>{last.account} · {last.views ? Number(last.views).toLocaleString()+" views" : ""} · {loggedAt}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:22, fontWeight:700, color: last.ai?.score>=70?"#7FD3AE":last.ai?.score>=45?"#F0D27A":"#F2929F" }}>{last.ai?.score}</div>
              <div style={{ fontSize:10, color:mute }}>SCORE</div>
            </div>
          </div>
        );
      })()}

      <Card>
        <Step crew="nami" label={editId ? "Update this video's stats" : "Log a video"} />

        <div style={S.shotBox}>
          <div style={{ fontSize:13.5, fontWeight:600, color:"#F3EEE2", marginBottom:4 }}>
            📸 Upload screenshots — Nami reads them for you
          </div>
          <div style={{ fontSize:12.5, color:mute, marginBottom:10, lineHeight:1.6 }}>
            Select up to 4 screenshots at once (Overview + Viewers + Engagement tabs). Works on both phone and PC. Nami reads all of them together and fills every field automatically.
          </div>

          {/* File picker — works on phone AND PC */}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={reading}
            style={{ color:"#C9D2F0", fontSize:13, width:"100%", marginBottom:10 }}
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              await readShots(files);
              e.target.value = "";
            }}
          />

          {/* PC bonus: paste with Ctrl+V */}
          <div style={{ fontSize:12, color:mute, marginBottom:6 }}>💻 On PC you can also paste (Ctrl+V):</div>
          <div tabIndex={0}
            style={{ ...S.textarea, minHeight:40, cursor:"text", display:"flex", justifyContent:"center", alignItems:"center", color:mute, fontSize:13, outline:"none" }}
            onPaste={async (e)=>{
              e.preventDefault();
              const items = Array.from(e.clipboardData?.items||[]).filter(i=>i.type.startsWith("image/"));
              if (!items.length) return;
              setReading(true); setErr(null);
              try {
                const images = [];
                for (const item of items) {
                  const file = item.getAsFile();
                  if (!file) continue;
                  try {
                    const img = await fileToImage(file);
                    images.push(img);
                  } catch(e) { console.warn("skip image:", e.message); }
                }
                if (images.length) await readShots(images);
              } catch(err){ setErr("Paste failed: "+err.message); }
              setReading(false);
            }}>
            <span>{reading ? "Nami is reading…" : "Click here then Ctrl+V"}</span>
          </div>

          {reading && <div style={{ color:gold, fontSize:13, marginTop:8 }}>📊 Nami is reading your screenshots…</div>}

          {/* Text/voice fallback */}
          <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${line}` }}>
            <div style={{ fontSize:12, color:mute, marginBottom:6 }}>Or speak/type your stats:</div>
            <textarea style={{ ...S.textarea, minHeight:56 }}
              placeholder='e.g. "14705 views, 12s watch time, 11.59% completion, 856 likes, 68 shares, Jayden Gem TikTok, June 16, 1 day old"'
              value={namiInput||""}
              onChange={e=>setNamiInput(e.target.value)}
            />
            <button style={{ ...S.gold, marginTop:6, fontSize:12 }} disabled={reading||!namiInput?.trim()} onClick={async ()=>{
              setReading(true); setErr(null);
              try {
                const sys = "You are Nami, a data analyst. Extract video stats from plain text. Convert 65K→65000, 804K→804000. Watch time like 15.1s becomes 15.1. Completion may say 'watched full video'. Return ONLY valid JSON.";
                const usr = `Extract from: "${namiInput}"\nReturn JSON (numbers only, empty string if missing): {"title":"","account":"","platform":"","views":"","watch":"","completion":"","likes":"","comments":"","dms":"","shares":"","saves":"","celebrity":"","date":"","nonFollowers":"","female":"","male":"","age1824":"","age2534":"","topCountry":"","fyp":"","daysOld":""}`;
                const got = await ask(sys, usr, true, 800);
                if (got && typeof got === "object") { setF(prev=>({...prev,...Object.fromEntries(Object.entries(got).filter(([,v])=>v!==""&&v!=null))})); setNamiInput(""); }
              } catch(err){ setErr("Nami couldn't parse: "+err.message); }
              setReading(false);
            }}>
              {reading ? "Reading…" : "📊 Let Nami fill it in"}
            </button>
          </div>
        </div>

        <div style={S.formGrid}>
          <Field label="Title" full><input style={S.input} value={f.title} onChange={e=>set("title",e.target.value)} /></Field>
          <Field label="Account"><select style={S.input} value={f.account} onChange={e=>set("account",e.target.value)}>{Object.values(ACCOUNTS).map(a=><option key={a.label}>{a.label}</option>)}</select></Field>
          <Field label="Platform"><select style={S.input} value={f.platform} onChange={e=>set("platform",e.target.value)}><option>TikTok</option><option>Facebook</option></select></Field>
          <Field label="Views"><input style={S.input} type="number" value={f.views} onChange={e=>set("views",e.target.value)} /></Field>
          <Field label="Avg watch (s)"><input style={S.input} type="number" value={f.watch} onChange={e=>set("watch",e.target.value)} /></Field>
          <Field label="Completion %"><input style={S.input} type="number" value={f.completion} onChange={e=>set("completion",e.target.value)} /></Field>
          <Field label="Likes"><input style={S.input} type="number" value={f.likes} onChange={e=>set("likes",e.target.value)} /></Field>
          <Field label="Comments"><input style={S.input} type="number" value={f.comments} onChange={e=>set("comments",e.target.value)} /></Field>
          <Field label="DM replies"><input style={S.input} type="number" value={f.dms} onChange={e=>set("dms",e.target.value)} /></Field>
          <Field label="Shares"><input style={S.input} type="number" value={f.shares} onChange={e=>set("shares",e.target.value)} /></Field>
          <Field label="Saves"><input style={S.input} type="number" value={f.saves} onChange={e=>set("saves",e.target.value)} /></Field>
          <Field label="Celebrity"><input style={S.input} value={f.celebrity} onChange={e=>set("celebrity",e.target.value)} /></Field>
          <Field label="Hook type"><select style={S.input} value={f.hookType} onChange={e=>set("hookType",e.target.value)}>{HOOK_TYPES.map(h=><option key={h}>{h}</option>)}</select></Field>
          <Field label="Date posted"><input style={S.input} type="date" value={f.date} onChange={e=>set("date",e.target.value)} /></Field>
          <Field label="Days since posted"><input style={S.input} type="number" min="1" placeholder="e.g. 1" value={f.daysOld} onChange={e=>set("daysOld",e.target.value)} /></Field>
        </div>

        {/* Script field — pick from My Scripts or paste manually */}
        {!editId && (
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:11, color:gold, fontWeight:700, letterSpacing:1.5, marginBottom:6, textTransform:"uppercase" }}>
              📜 Script for this video
            </div>
            <div style={{ fontSize:12, color:mute, marginBottom:8 }}>Pick from your saved scripts or paste manually. Only needed on first log — carried over automatically on updates.</div>

            {/* Pick from My Scripts dropdown */}
            {finalScripts.length > 0 && (
              <div style={{ marginBottom:8 }}>
                <select style={{ ...S.input, width:"100%" }}
                  onChange={e=>{
                    const picked = finalScripts.find(s=>s.id===Number(e.target.value));
                    if (picked) set("script", picked.text);
                  }}
                  defaultValue="">
                  <option value="" disabled>📜 Pick from My Scripts…</option>
                  {finalScripts
                    .filter(s => !f.account || s.account === f.account)
                    .slice(0, 15)
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.account} — {s.topic||"(no topic)"} · {s.date}
                      </option>
                    ))
                  }
                  {finalScripts.filter(s => !f.account || s.account !== f.account).length > 0 && (
                    <>
                      <option disabled>── other accounts ──</option>
                      {finalScripts
                        .filter(s => f.account && s.account !== f.account)
                        .slice(0, 10)
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.account} — {s.topic||"(no topic)"} · {s.date}
                          </option>
                        ))
                      }
                    </>
                  )}
                </select>
                {f.script && <div style={{ fontSize:11, color:"#7FD3AE", marginTop:4 }}>✓ Script loaded — you can edit below if needed</div>}
              </div>
            )}

            {/* Manual paste fallback */}
            <textarea style={{ ...S.textarea, minHeight:80 }}
              placeholder={finalScripts.length > 0 ? "Or paste manually if the script isn't saved yet…" : "Paste your script here, or describe: e.g. 'VS video comparing Ronaldo vs Messi rings, opened with price shock'"}
              value={f.script||""}
              onChange={e=>set("script",e.target.value)}
            />
          </div>
        )}

        {/* When updating — show locked script from day 1 */}
        {editId && f.script && (
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:11, color:gold, fontWeight:700, letterSpacing:1.5, marginBottom:4, textTransform:"uppercase" }}>
              📜 Script <span style={{ color:"#7FD3AE", fontWeight:400, fontSize:10, textTransform:"none" }}>✓ from day 1 — no changes needed</span>
            </div>
            <div style={{ ...S.briefBox, fontSize:12.5, color:mute, lineHeight:1.5, maxHeight:80, overflow:"hidden", opacity:0.7 }}>
              {f.script.slice(0,200)}{f.script.length>200?"…":""}
            </div>
          </div>
        )}

        {/* Audience fields */}
        <div style={{ fontSize:11, color:gold, fontWeight:700, letterSpacing:1.5, margin:"14px 0 8px", textTransform:"uppercase" }}>👥 Audience data (from Viewers tab)</div>
        <div style={S.formGrid}>
          <Field label="Non-followers %"><input style={S.input} type="number" placeholder="e.g. 82" value={f.nonFollowers} onChange={e=>set("nonFollowers",e.target.value)} /></Field>
          <Field label="Female %"><input style={S.input} type="number" placeholder="e.g. 60" value={f.female} onChange={e=>set("female",e.target.value)} /></Field>
          <Field label="Male %"><input style={S.input} type="number" placeholder="e.g. 38" value={f.male} onChange={e=>set("male",e.target.value)} /></Field>
          <Field label="Age 18-24 %"><input style={S.input} type="number" placeholder="e.g. 49" value={f.age1824} onChange={e=>set("age1824",e.target.value)} /></Field>
          <Field label="Age 25-34 %"><input style={S.input} type="number" placeholder="e.g. 39" value={f.age2534} onChange={e=>set("age2534",e.target.value)} /></Field>
          <Field label="Top country"><input style={S.input} placeholder="e.g. Myanmar" value={f.topCountry} onChange={e=>set("topCountry",e.target.value)} /></Field>
          <Field label="FYP traffic %"><input style={S.input} type="number" placeholder="e.g. 94" value={f.fyp} onChange={e=>set("fyp",e.target.value)} /></Field>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
          <button style={S.gold} disabled={busy} onClick={analyze}>{busy?"Nami is analyzing…":editId?"Update & re-analyze":"Analyze & log"}</button>
          {editId && <button style={S.ghost} disabled={busy} onClick={cancelEdit}>Cancel</button>}
        </div>
      </Card>

      {videoLog.map(v=>(
        <Card key={v.id}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"start" }}>
            <div>
              <div style={S.trendName}>{v.title}</div>
              <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
                <Tag>{v.account}</Tag><Tag>{v.platform}</Tag><Tag>{Number(v.views).toLocaleString()} views</Tag>
                {v.updated && <Tag>updated {v.updated}</Tag>}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <SpeakBtn text={`${v.title}. Score ${v.ai.score} out of 100. ${v.ai.viral} viral. What worked: ${(v.ai.worked||[]).join(", ")}. Improve: ${(v.ai.improve||[]).join(", ")}. Next topic: ${v.ai.nextTopic}. ${v.ai.audienceNote||""} ${v.ai.momentumNote||""} ${v.ai.scriptNote||""}`} />
              <div style={{ textAlign:"center", minWidth:54 }}>
                <div style={{ fontSize:26, fontWeight:700, color: v.ai.score>=70?"#7FD3AE":v.ai.score>=45?"#F0D27A":"#F2929F" }}>{v.ai.score}</div>
                <div style={S.scoreLbl}>SCORE</div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
            <Tag gold>{v.ai.viral}</Tag><Tag>DM {v.ai.dmConv}</Tag><Tag>{v.ai.trend}</Tag>
          </div>
          <div style={{ marginTop:10, fontSize:13.5, lineHeight:1.6 }}>
            <div style={{ color:"#7FD3AE" }}><b>✓ Worked:</b> {(v.ai.worked||[]).join("; ")}</div>
            <div style={{ color:"#F2929F", marginTop:3 }}><b>△ Improve:</b> {(v.ai.improve||[]).join("; ")}</div>
            <div style={{ color:"#F0D27A", marginTop:3 }}><b>→ Next:</b> {v.ai.nextTopic}</div>
            {v.ai.audienceNote && <div style={{ color:"#C9A4F0", marginTop:3 }}><b>👥 Audience:</b> {v.ai.audienceNote}</div>}
            {v.ai.momentumNote && <div style={{ color:"#84B8E6", marginTop:3 }}><b>📈 Momentum:</b> {v.ai.momentumNote}</div>}
            {v.ai.scriptNote && <div style={{ color:"#F0D27A", marginTop:3 }}><b>📜 Script insight:</b> {v.ai.scriptNote}</div>}
          </div>
          <div style={S.briefBack}>
            <div style={{ color:CREW.robin.facet }}><b>Brief → Nico Robin:</b> {v.ai.toRobin}</div>
            <div style={{ color:CREW.usopp.facet, marginTop:4 }}><b>Brief → Usopp:</b> {v.ai.toUsopp}</div>
          </div>
          <div style={{ marginTop:10 }}>
            <button style={S.ghost} onClick={()=>editEntry(v)}>Update stats (numbers changed)</button>
          </div>
        </Card>
      ))}
      {videoLog.length===0 && <Empty text="No videos logged yet. Drop a screenshot above and Nami breaks it down — and the crew learns from it." />}
    </div>
  );
}

// ===================== MY SCRIPTS =====================
// ===================== PAGE INSIGHTS =====================
const PAGE_ACCOUNTS = ["Jayden Gem TikTok","Jayden Facebook","Saung Htee Phyu TikTok","SHP Academy Facebook","SHP Goldsmith Facebook"];

function PageInsights({ pageInsights, setPageInsights, bible, setErr }) {
  const today = new Date().toISOString().slice(0,10);
  const blankP = { date:today, account:PAGE_ACCOUNTS[0], followers:"", followerGrowth:"", profileViews:"", totalLikes:"", reach:"", impressions:"", notes:"" };
  const [f, setF] = useState(blankP);
  const [busy, setBusy] = useState(false);
  const [namiInput, setNamiInput] = useState("");
  const [reading, setReading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const set = (k,v) => setF(prev=>({...prev,[k]:v}));

  async function logInsight() {
    if (!f.followers) return;
    setBusy(true);
    try {
      // Find previous entry for same account to calculate growth
      const prev = pageInsights.filter(p=>p.account===f.account).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
      const sys = ctx(bible) + "\nYou are Nami. Analyze this social media page's weekly stats vs previous week. Be specific about growth rate and what it means.";
      const usr = `Account: ${f.account}\nThis week: ${JSON.stringify(f)}\nPrevious entry: ${prev ? JSON.stringify(prev) : "none"}\nReturn ONLY JSON: {"trend":"Growing|Stable|Declining","weeklyGrowthRate":"x%","insight":"one sharp observation","action":"one specific thing to do next week","score":0-100}`;
      const ai = await ask(sys, usr, true, 600);
      const entry = { ...f, ai, id:Date.now() };
      setPageInsights(prev=>[entry,...prev]);
      setAnalysis(ai);
      setF(blankP);
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  async function readFromText() {
    if (!namiInput.trim()) return;
    setReading(true);
    try {
      const sys = "You are Nami. Extract social media page stats from plain text. Convert 10K→10000. Return ONLY valid JSON.";
      const usr = `Extract from: "${namiInput}"\nReturn JSON: {"account":"","followers":"","followerGrowth":"","profileViews":"","totalLikes":"","reach":"","impressions":"","date":""}. Numbers only.`;
      const got = await ask(sys, usr, true, 600);
      if (got && typeof got === "object") { setF(prev=>({...prev,...Object.fromEntries(Object.entries(got).filter(([,v])=>v!==""&&v!=null))})); setNamiInput(""); }
    } catch(e){ setErr(e.message); }
    setReading(false);
  }

  function fileToImage(file) {
    return new Promise((res, rej) => {
      if (!file || !(file instanceof Blob)) { rej(new Error("Not a valid image")); return; }
      const r = new FileReader();
      r.onload = () => {
        const result = String(r.result);
        const comma = result.indexOf(",");
        const data = comma !== -1 ? result.slice(comma+1) : result;
        const allowed = ["image/jpeg","image/png","image/gif","image/webp"];
        const media_type = allowed.includes(file.type) ? file.type : "image/png";
        res({ media_type, data });
      };
      r.onerror = () => rej(new Error("Could not read image"));
      r.readAsDataURL(file);
    });
  }

  async function readScreenshots(fileListOrImages) {
    setErr(null); setReading(true);
    try {
      let images;
      if (Array.isArray(fileListOrImages) && fileListOrImages[0]?.data) {
        images = fileListOrImages;
      } else {
        const files = Array.from(fileListOrImages||[]).slice(0,4).filter(f=>f instanceof Blob);
        if (!files.length) { setReading(false); return; }
        const results = await Promise.allSettled(files.map(fileToImage));
        images = results.filter(r=>r.status==="fulfilled").map(r=>r.value);
      }
      if (!images.length) throw new Error("No valid images");
      const sys = "You are Nami. Read this social media page insights/analytics screenshot (TikTok or Facebook page overview, not a single video). Pull out total followers, profile views, total likes, reach, impressions, and follower growth this period. Convert 10K→10000, 1.2M→1200000. Leave empty string for anything not visible.";
      const usr = `Extract page-level stats. Return ONLY JSON: {"account":"","followers":"","followerGrowth":"","profileViews":"","totalLikes":"","reach":"","impressions":"","date":""}. Numbers only.`;
      const got = await askVision(sys, usr, images, true, 1000);
      if (got && typeof got === "object") {
        setF(prev=>({...prev,...Object.fromEntries(Object.entries(got).filter(([,v])=>v!==""&&v!=null))}));
      }
    } catch(e){ setErr("Couldn't read screenshot: "+e.message); }
    setReading(false);
  }

  // Group by account for sparkline display
  const byAccount = PAGE_ACCOUNTS.map(acc=>({
    account: acc,
    entries: pageInsights.filter(p=>p.account===acc).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-8)
  }));

  return (
    <div>
      <Eyebrow>Page Insights</Eyebrow>
      <h2 style={S.h2}>📈 Track your account growth</h2>
      <p style={S.lede}>Log your weekly page stats for each account. Nami tracks follower growth, reach, and tells you what's working week by week.</p>

      {/* Account growth overview */}
      {pageInsights.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10, marginBottom:16 }}>
          {byAccount.filter(a=>a.entries.length>0).map(a=>{
            const latest = a.entries[a.entries.length-1];
            const prev = a.entries[a.entries.length-2];
            const growth = prev && latest.followers && prev.followers ? ((Number(latest.followers)-Number(prev.followers))/Number(prev.followers)*100).toFixed(1) : null;
            return (
              <div key={a.account} style={{ background:panel2, border:`1px solid ${line}`, borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:mute, marginBottom:2 }}>{a.account.replace(" TikTok","").replace(" Facebook","")}</div>
                <div style={{ fontSize:22, fontWeight:700, color:cream }}>{latest.followers ? Number(latest.followers).toLocaleString() : "—"}</div>
                <div style={{ fontSize:11, color: gold, marginTop:2 }}>followers</div>
                {growth && <div style={{ fontSize:12, color: Number(growth)>=0?"#7FD3AE":"#F2929F", marginTop:4, fontWeight:600 }}>{Number(growth)>=0?"+":""}{growth}% this week</div>}
                {latest.ai?.trend && <div style={{ fontSize:11, color:mute, marginTop:2 }}>{latest.ai.trend}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Log form */}
      <Card accent>
        <div style={S.cardTitle}>Log this week's page stats</div>

        {/* Screenshot upload */}
        <div style={S.shotBox}>
          <div style={{ fontSize:12.5, color:cream, fontWeight:600, marginBottom:4 }}>📸 Upload page insights screenshot</div>
          <div style={{ fontSize:12, color:mute, marginBottom:8 }}>Screenshot your TikTok/Facebook page analytics (followers, profile views, reach). Up to 4 at once. Works on phone and PC.</div>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={reading}
            style={{ color:"#C9D2F0", fontSize:13, width:"100%", marginBottom:10 }}
            onChange={async (e)=>{
              const files = Array.from(e.target.files||[]).slice(0,4);
              if (!files.length) return;
              await readScreenshots(files);
              e.target.value = "";
            }}
          />
          <div style={{ fontSize:11.5, color:mute, marginBottom:6 }}>💻 On PC you can also paste (Ctrl+V):</div>
          <div tabIndex={0}
            style={{ ...S.textarea, minHeight:36, cursor:"text", display:"flex", justifyContent:"center", alignItems:"center", color:mute, fontSize:12.5, outline:"none" }}
            onPaste={async (e)=>{
              e.preventDefault();
              const items = Array.from(e.clipboardData?.items||[]).filter(i=>i.type.startsWith("image/"));
              if (!items.length) return;
              const images = [];
              for (const item of items) {
                const file = item.getAsFile();
                if (!file) continue;
                try { images.push(await fileToImage(file)); } catch(e){}
              }
              if (images.length) await readScreenshots(images);
            }}>
            <span>{reading ? "Nami is reading…" : "Click here then Ctrl+V"}</span>
          </div>
          {reading && <div style={{ color:gold, fontSize:12.5, marginTop:6 }}>📊 Nami is reading your screenshot…</div>}
        </div>

        {/* Nami text input */}
        <div style={S.shotBox}>
          <div style={{ fontSize:12.5, color:cream, fontWeight:600, marginBottom:4 }}>🎙️ Or speak/type your page stats</div>
          <div style={{ fontSize:12, color:mute, marginBottom:6 }}>e.g. "Jayden Gem TikTok, 12,450 followers, gained 234 this week, 8,900 profile views, reach 45,000"</div>
          <textarea style={{ ...S.textarea, minHeight:56 }} value={namiInput} onChange={e=>setNamiInput(e.target.value)} placeholder="Speak or type your page stats…" />
          <button style={{ ...S.gold, marginTop:6, fontSize:12 }} disabled={reading||!namiInput.trim()} onClick={readFromText}>
            {reading?"Reading…":"📊 Let Nami fill it in"}
          </button>
        </div>

        <div style={S.formGrid}>
          <Field label="Account" full>
            <select style={S.input} value={f.account} onChange={e=>set("account",e.target.value)}>
              {PAGE_ACCOUNTS.map(a=><option key={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Date"><input style={S.input} type="date" value={f.date} onChange={e=>set("date",e.target.value)} /></Field>
          <Field label="Total Followers"><input style={S.input} type="number" placeholder="e.g. 12450" value={f.followers} onChange={e=>set("followers",e.target.value)} /></Field>
          <Field label="New Followers (week)"><input style={S.input} type="number" placeholder="e.g. 234" value={f.followerGrowth} onChange={e=>set("followerGrowth",e.target.value)} /></Field>
          <Field label="Profile Views"><input style={S.input} type="number" placeholder="e.g. 8900" value={f.profileViews} onChange={e=>set("profileViews",e.target.value)} /></Field>
          <Field label="Total Likes"><input style={S.input} type="number" placeholder="e.g. 45000" value={f.totalLikes} onChange={e=>set("totalLikes",e.target.value)} /></Field>
          <Field label="Reach"><input style={S.input} type="number" placeholder="e.g. 120000" value={f.reach} onChange={e=>set("reach",e.target.value)} /></Field>
          <Field label="Impressions"><input style={S.input} type="number" placeholder="e.g. 200000" value={f.impressions} onChange={e=>set("impressions",e.target.value)} /></Field>
          <Field label="Notes" full><input style={S.input} placeholder="e.g. posted 5 videos, best week for saves" value={f.notes} onChange={e=>set("notes",e.target.value)} /></Field>
        </div>

        <button style={{ ...S.gold, marginTop:12 }} disabled={busy||!f.followers} onClick={logInsight}>
          {busy?"Nami is analyzing…":"📊 Log & analyze"}
        </button>

        {analysis && (
          <div style={{ ...S.verdictBox, marginTop:12 }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:22, fontWeight:700, color:analysis.trend==="Growing"?"#7FD3AE":analysis.trend==="Declining"?"#F2929F":gold }}>{analysis.score}</span>
              <span style={{ fontSize:13, color:analysis.trend==="Growing"?"#7FD3AE":analysis.trend==="Declining"?"#F2929F":gold, fontWeight:700 }}>{analysis.trend} · {analysis.weeklyGrowthRate}</span>
            </div>
            <p style={S.verdictText}>{analysis.insight}</p>
            <div style={S.directive}><b>Next week:</b> {analysis.action}</div>
          </div>
        )}
      </Card>

      {/* History */}
      {pageInsights.length > 0 && (
        <Card>
          <div style={S.cardTitle}>Recent entries</div>
          {pageInsights.slice(0,10).map(p=>(
            <div key={p.id} style={{ borderBottom:`1px solid ${line}`, paddingBottom:10, marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start" }}>
                <div>
                  <Tag gold>{p.account}</Tag>
                  <span style={{ fontSize:12, color:mute, marginLeft:8 }}>{p.date}</span>
                </div>
                <div style={{ fontSize:18, fontWeight:700, color: p.ai?.trend==="Growing"?"#7FD3AE":p.ai?.trend==="Declining"?"#F2929F":gold }}>{p.ai?.score||"—"}</div>
              </div>
              <div style={{ fontSize:13, color:cream, marginTop:6 }}>
                👥 {Number(p.followers||0).toLocaleString()} followers
                {p.followerGrowth && <span style={{ color:"#7FD3AE", marginLeft:8 }}>+{p.followerGrowth} this week</span>}
                {p.profileViews && <span style={{ color:mute, marginLeft:8 }}>👁 {Number(p.profileViews).toLocaleString()} views</span>}
              </div>
              {p.ai?.insight && <div style={{ fontSize:12.5, color:"#C9A4F0", marginTop:4 }}>💡 {p.ai.insight}</div>}
            </div>
          ))}
        </Card>
      )}

      {pageInsights.length === 0 && <Empty text="No page stats logged yet. Log your first week above." />}
    </div>
  );
}

function Scripts({ finalScripts, setFinalScripts }) {
  const accountOptions = Object.values(ACCOUNTS).map(a => a.label);
  const [account, setAccount] = useState(accountOptions[0]);
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(null);
  const [reveal, setReveal] = useState(null); // {id, text} shown for manual copy when clipboard is blocked

  async function copyText(t) {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(t); return true; }
    } catch (e) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
    } catch (e) { return false; }
  }

  function save() {
    if (!text.trim()) return;
    setFinalScripts([{ id: Date.now(), account, topic: topic.trim(), text: text.trim(), date: new Date().toISOString().slice(0,10) }, ...finalScripts]);
    setTopic(""); setText("");
  }
  function remove(id) { setFinalScripts(finalScripts.filter(s => s.id !== id)); }

  async function copy(s) {
    const ok = await copyText(s.text);
    if (ok) { setCopied(s.id); setTimeout(()=>setCopied(null), 1500); }
    else { setReveal({ id: s.id, text: s.text }); }
  }
  function sheetInstruction(s) {
    return `In my Google Sheet called "Gem Crew Master Log", find or create a tab named "Final Scripts" with columns Date, Account, Topic, Script. Then add a new row — Date: ${s.date}, Account: ${s.account}, Topic: ${s.topic || "(none)"}, Script:\n\n${s.text}`;
  }
  async function copyForSheets(s) {
    const instruction = sheetInstruction(s);
    const ok = await copyText(instruction);
    // Always reveal it too, so you can see exactly what's going to Cowork (and copy by hand if needed)
    setReveal({ id: "sheet-"+s.id, text: instruction });
    if (ok) { setCopied("sheet-"+s.id); setTimeout(()=>setCopied(null), 1500); }
  }

  return (
    <div>
      <Eyebrow>My scripts</Eyebrow>
      <h2 style={S.h2}>Your final scripts — the crew learns from these</h2>
      <p style={S.lede}>After you edit a script into your own voice, save the final version here. Usopp reads your latest finals for each account as voice examples, so the more you save, the more the crew writes like the real you. Use “Copy for Sheets” to send any script to Cowork and into your Google Sheet.</p>

      <Card>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
          <select style={S.input} value={account} onChange={e=>setAccount(e.target.value)}>
            {accountOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input style={{ ...S.input, flex:2 }} placeholder="Topic (e.g. Ambani necklace)" value={topic} onChange={e=>setTopic(e.target.value)} />
        </div>
        <textarea style={{ ...S.textarea, minHeight:200 }} placeholder="Paste your final, edited Burmese script here…" value={text} onChange={e=>setText(e.target.value)} />
        <button style={{ ...S.gold, marginTop:10 }} onClick={save}>Save to my scripts</button>
      </Card>

      {finalScripts.length === 0 && <Empty text="No saved scripts yet. Save your first final version above." />}
      {finalScripts.map(s => (
        <Card key={s.id}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"start", marginBottom:8 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <Tag gold>{s.account}</Tag>{s.topic && <Tag>{s.topic}</Tag>}<Tag>{s.date}</Tag>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button style={S.ghost} onClick={()=>copy(s)}>{copied===s.id?"Copied ✓":"Copy"}</button>
              <button style={S.ghost} onClick={()=>copyForSheets(s)}>{copied==="sheet-"+s.id?"Copied ✓":"Copy for Sheets"}</button>
              <button style={S.linkBtn} onClick={()=>remove(s.id)}>Delete</button>
            </div>
          </div>
          <div style={{ ...S.briefBox, whiteSpace:"pre-wrap", fontSize:14, lineHeight:1.6 }}>{s.text}</div>
          {reveal && (reveal.id===s.id || reveal.id==="sheet-"+s.id) && (
            <div style={{ marginTop:10 }}>
              <div style={S.subtle}>{reveal.id==="sheet-"+s.id ? "Paste this into Cowork (select all → copy):" : "Select all → copy:"}</div>
              <textarea readOnly style={{ ...S.textarea, minHeight:120, marginTop:6 }} value={reveal.text} onFocus={e=>e.target.select()} onClick={e=>e.target.select()} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ===================== FRANKY EXPORT =====================
function FrankyExport({ videoLog, finalScripts, ideas, bible, pageInsights = [] }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const isExportDay = day === 0 || day === 3;
  // Next export: from any day, find nearest Wed(3) or Sun(0)
  const daysToWed = (3 - day + 7) % 7 || 7;
  const daysToSun = (7 - day) % 7 || 7;
  const daysUntil = Math.min(daysToWed, daysToSun);
  const nextExportDay = daysToWed <= daysToSun ? "Wednesday" : "Sunday";

  async function buildExcel() {
    setBusy(true); setMsg(null);
    try {
      const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
      const wb = XLSX.utils.book_new();

      // Tab 1: Video Log
      const vlRows = [["Date","Account","Platform","Celebrity","Title","Format","Views","New Followers","Shares","Avg Watch (s)","Completion %","Likes","DM Replies","Saves","Non-followers %","Female %","Male %","Age 18-24 %","Age 25-34 %","Top Country","FYP %","Score","Viral","Trend","Lesson"]];
      for (const v of videoLog) {
        vlRows.push([v.date||"",v.account||"",v.platform||"",v.celebrity||"",v.title||"",v.format||"",v.views||"",v.newFollowers||"",v.shares||"",v.watch||"",v.completion||"",v.likes||"",v.dms||"",v.saves||"",v.nonFollowers||"",v.female||"",v.male||"",v.age1824||"",v.age2534||"",v.topCountry||"",v.fyp||"",v.ai?.score||"",v.ai?.viral||"",v.ai?.trend||"",v.ai?.summary||""]);
      }
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(vlRows), "Video Log");

      // Tab 2: Page Insights
      const piRows = [["Date","Account","Total Followers","New Followers (week)","Profile Views","Total Likes","Reach","Impressions","Notes","Trend","Growth Rate","Score","Insight","Next Action"]];
      for (const p of pageInsights) {
        piRows.push([p.date||"",p.account||"",p.followers||"",p.followerGrowth||"",p.profileViews||"",p.totalLikes||"",p.reach||"",p.impressions||"",p.notes||"",p.ai?.trend||"",p.ai?.weeklyGrowthRate||"",p.ai?.score||"",p.ai?.insight||"",p.ai?.action||""]);
      }
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(piRows), "Page Insights");

      // Tab 3: Final Scripts
      const fsRows = [["Date","Account","Topic","Script"]];
      for (const s of finalScripts) {
        fsRows.push([s.date||"",s.account||"",s.topic||"",s.text||""]);
      }
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(fsRows), "Final Scripts");

      // Tab 4: Ideas
      const idRows = [["Date","Idea","Account","Source","Status"]];
      for (const i of ideas) {
        idRows.push([i.date||"",i.text||"",i.account||"",i.source||"",i.status||"New"]);
      }
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(idRows), "Ideas");

      // Tab 5: Brand Bible
      const bbRows = [["Brand Bible"]];
      for (const line of (bible||"").split("\n")) bbRows.push([line]);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bbRows), "Brand Bible");

      // Download
      XLSX.writeFile(wb, "Gem-Crew-Master-Log.xlsx");
      setMsg("✓ Downloaded! Drag into Google Drive and click Replace to update your master log.");

      // Try push to Google Sheets if webhook is configured
      const webhookUrl = localStorage.getItem("jg_sheets_webhook");
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoLog, pageInsights, finalScripts, ideas, exportedAt: new Date().toISOString() })
          });
          setMsg("✓ Downloaded + pushed to Google Sheets automatically!");
        } catch(e) { /* webhook failed silently, Excel still downloaded */ }
      }
    } catch(e) {
      setMsg("Something went wrong: " + e.message);
    }
    setBusy(false);
  }

  return (
    <div>
      <Eyebrow>Franky Export</Eyebrow>
      <h2 style={S.h2}>🔧 Franky updates your master log</h2>
      <p style={S.lede}>Franky packages everything — video log, page insights, scripts, ideas, and Brand Bible — into one Excel file. Set up the Google Sheets webhook once and Franky pushes everything there automatically.</p>

      {/* Google Sheets auto-push setup */}
      <Card accent>
        <div style={{ fontWeight:700, fontSize:14, color:cream, marginBottom:4 }}>
          📊 Google Sheets auto-push
          {localStorage.getItem("jg_sheets_webhook") && <span style={{ color:"#7FD3AE", fontSize:12, fontWeight:400, marginLeft:8 }}>✓ Connected</span>}
        </div>
        <p style={{ ...S.subtle, marginBottom:10 }}>Set this up once and Franky automatically pushes all your data to Google Sheets every time you export. No manual upload needed.</p>
        {!localStorage.getItem("jg_sheets_webhook") ? (
          <div>
            <div style={{ fontSize:12.5, color:cream, lineHeight:1.8, marginBottom:10 }}>
              <b style={{ color:gold }}>Step 1</b> — Open your Google Sheet: <a href="https://docs.google.com/spreadsheets/d/1fe0691PyR7bN4B6LpFS6AshyZt35LjQpWRWdRV6efoU/edit" target="_blank" rel="noreferrer" style={{ color:"#84B8E6" }}>Jayden Gem Master Log</a><br/>
              <b style={{ color:gold }}>Step 2</b> — Click <b style={{ color:cream }}>Extensions → Apps Script</b><br/>
              <b style={{ color:gold }}>Step 3</b> — Delete everything and paste the script below<br/>
              <b style={{ color:gold }}>Step 4</b> — Click Deploy → New deployment → Web App → Anyone can access → Deploy<br/>
              <b style={{ color:gold }}>Step 5</b> — Copy the Web App URL and paste below
            </div>
            <div style={{ background:navy, borderRadius:8, padding:10, marginBottom:10, fontSize:11.5, fontFamily:"monospace", color:"#84B8E6", lineHeight:1.6, overflowX:"auto" }}>
              {`function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Video Log
  const vl = ss.getSheetByName("Video Log") || ss.insertSheet("Video Log");
  vl.clearContents();
  vl.appendRow(["Date","Account","Title","Views","Watch","Completion","Likes","Shares","Saves","Score","Trend"]);
  data.videoLog.forEach(v => vl.appendRow([v.date,v.account,v.title,v.views,v.watch,v.completion,v.likes,v.shares,v.saves,v.ai?.score,v.ai?.trend]));
  
  // Page Insights
  const pi = ss.getSheetByName("Page Insights") || ss.insertSheet("Page Insights");
  pi.clearContents();
  pi.appendRow(["Date","Account","Followers","New Followers","Profile Views","Reach","Score","Trend"]);
  data.pageInsights.forEach(p => pi.appendRow([p.date,p.account,p.followers,p.followerGrowth,p.profileViews,p.reach,p.ai?.score,p.ai?.trend]));
  
  // Ideas
  const id = ss.getSheetByName("Ideas") || ss.insertSheet("Ideas");
  id.clearContents();
  id.appendRow(["Date","Idea"]);
  data.ideas.forEach(i => id.appendRow([i.date,i.text]));
  
  return ContentService.createTextOutput("ok");
}`}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <input style={{ ...S.input, flex:1 }} id="webhook-input" placeholder="Paste your Apps Script Web App URL here…" />
              <button style={S.gold} onClick={()=>{
                const url = document.getElementById("webhook-input")?.value?.trim();
                if (url) { localStorage.setItem("jg_sheets_webhook", url); window.location.reload(); }
              }}>Connect</button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize:13, color:"#7FD3AE", marginBottom:8 }}>✓ Every time Franky exports, your Google Sheet updates automatically.</div>
            <button style={{ ...S.ghost, fontSize:12 }} onClick={()=>{ localStorage.removeItem("jg_sheets_webhook"); window.location.reload(); }}>Disconnect</button>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔧</div>
          {isExportDay ? (
            <>
              <div style={{ color:"#7FD3AE", fontWeight:700, fontSize:15, marginBottom:6 }}>Today is export day — Franky is ready!</div>
              <div style={S.subtle}>Your log has {videoLog.length} videos, {finalScripts.length} scripts, {ideas.length} ideas.</div>
              <button style={{ ...S.gold, marginTop:16, fontSize:15, padding:"12px 32px" }} disabled={busy} onClick={buildExcel}>
                {busy ? "Franky is building your file…" : "Download Gem-Crew-Master-Log.xlsx"}
              </button>
            </>
          ) : (
            <>
              <div style={{ color:"#F0D27A", fontWeight:700, fontSize:15, marginBottom:6 }}>Next export: {nextExportDay} ({daysUntil} day{daysUntil!==1?"s":""} away)</div>
              <div style={S.subtle}>Franky exports on Wednesdays and Sundays to keep your Drive clean.</div>
              <button style={{ ...S.ghost, marginTop:16 }} onClick={buildExcel} disabled={busy}>
                {busy ? "Building…" : "Export anyway"}
              </button>
            </>
          )}
          {msg && <div style={{ marginTop:14, fontSize:13.5, color:"#7FD3AE", lineHeight:1.6 }}>{msg}</div>}
        </div>
      </Card>

      <Card>
        <Step crew="franky" label="Storage health — how full is each category" />
        <div style={{ marginTop:12 }}>
          {[
            ["Video Log", videoLog.length, 300, getSizeKB(videoLog)],
            ["Final Scripts", finalScripts.length, 400, getSizeKB(finalScripts)],
            ["Ideas", ideas.length, 200, getSizeKB(ideas)],
          ].map(([label, count, max, kb]) => {
            const pct = Math.min(100, Math.round(count / max * 100));
            const color = pct > 80 ? "#F2929F" : pct > 60 ? "#F0D27A" : "#7FD3AE";
            return (
              <div key={label} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12.5 }}>
                  <span style={{ color:cream, fontWeight:600 }}>{label}</span>
                  <span style={{ color:mute }}>{count} / {max} entries · {kb}KB</span>
                </div>
                <div style={{ height:6, background:panel2, borderRadius:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:4, transition:"width 0.3s" }}/>
                </div>
                {pct > 80 && <div style={{ fontSize:11.5, color:"#F2929F", marginTop:3 }}>Getting full — export now and oldest entries will auto-trim</div>}
              </div>
            );
          })}
          <div style={{ fontSize:12, color:mute, marginTop:4 }}>Auto-trim keeps the newest entries when limits are reached. Nothing is lost permanently — it's already in your Excel export.</div>
        </div>
      </Card>

      <Card>
        <Step crew="franky" label="How to replace your file in Google Drive" />
        <div style={{ marginTop:10, fontSize:13.5, lineHeight:1.9, color:"#C9D2F0" }}>
          1. Click Download above — saves as <b>Gem-Crew-Master-Log.xlsx</b><br/>
          2. Open <b>drive.google.com</b><br/>
          3. Find your existing <b>Gem-Crew-Master-Log</b> file<br/>
          4. Right click it → <b>Manage versions → Upload new version</b><br/>
          5. Select the file you just downloaded — done ✓<br/>
          <br/>
          <span style={{ color:mute }}>One file, always current, no clutter.</span>
        </div>
      </Card>
    </div>
  );
}

// ===================== CREW CHAT =====================
function CrewChat({ bible, insights, videoLog, finalScripts, setIdeas, setTab, setErr }) {
  const WELCOME = { id:0, from:"luffy", text:"Oi! The whole crew is here. What do you want to talk about? Ask anything — strategy, scripts, what to post, what's working, anything.", ts: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}), savedAt: Date.now() };

  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeCrew, setActiveCrew] = useState("all");
  const [savedMsgs, setSavedMsgs] = useState({});
  const bottomRef = useRef(null);

  // Load saved messages on mount, clear if older than 24 hours
  useEffect(() => {
    (async () => {
      try {
        const saved = await loadKey("jg_chatMessages", null);
        if (saved && Array.isArray(saved) && saved.length > 0) {
          const age = Date.now() - (saved[saved.length-1]?.savedAt || 0);
          const oneDayMs = 24 * 60 * 60 * 1000;
          if (age < oneDayMs) {
            setMessages(saved);
            return;
          }
        }
      } catch(e) {}
      setMessages([WELCOME]);
    })();
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 1) {
      const toSave = messages.slice(-50).map(m => ({ ...m, savedAt: Date.now() }));
      saveKey("jg_chatMessages", toSave);
    }
  }, [messages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const learned = insights.length ? insights.slice(0,5).map(i=>i.summary).filter(Boolean).join(" | ") : "no video data yet";
  const scriptSamples = finalScripts.slice(0,2).map(s=>`${s.account}: ${s.text?.slice(0,200)}`).join("\n") || "no scripts saved yet";

  async function send() {
    if (!input.trim() || busy) return;
    const userMsg = { id:Date.now(), from:"you", text:input.trim(), ts:new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setBusy(true);

    try {
      const speakers = activeCrew === "all"
        ? Object.entries(CREW).filter(([k]) => k !== "franky") // Franky stays quiet unless asked
        : [[activeCrew, CREW[activeCrew]]];

      const chatHistory = history.slice(-10).map(m =>
        m.from === "you" ? `Boss: ${m.text}` : `${CREW[m.from]?.name || m.from}: ${m.text}`
      ).join("\n");

      const newMsgs = [...history];
      for (const [k, m] of speakers) {
        const sys = ctx(bible) + `\nYou are ${m.name} (${m.role}) in a group chat with Jayden (the boss) and the crew.
Your personality: ${m.blurb}
What Nami knows: ${learned}
Boss's recent scripts: ${scriptSamples}
Be yourself — short, punchy, in character. 2-4 sentences max. This is a chat, not an essay.
If you have nothing to add to this specific question, stay quiet (return empty string).`;
        const usr = `Chat history:\n${chatHistory}\n\nBoss just said: "${userMsg.text}"\n\nYour response as ${m.name} (or empty string if nothing to add):`;
        const reply = await ask(sys, usr, false, 400);
        if (reply.trim() && reply.trim() !== '""') {
          const msg = { id:Date.now()+Math.random(), from:k, text:reply.trim(), ts:new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) };
          newMsgs.push(msg);
          setMessages([...newMsgs]);
        }
      }
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  return (
    <div>
      <Eyebrow>Crew Chat</Eyebrow>
      <h2 style={S.h2}>💬 Talk to the whole crew</h2>
      <p style={S.lede}>Ask anything — strategy, what to post, script feedback, what's working. Chat saves for 24 hours then resets fresh.</p>
      <SpeedControl />
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}>
        <button style={{ ...S.linkBtn, color:mute, fontSize:12 }} onClick={()=>{
          setMessages([WELCOME]);
          saveKey("jg_chatMessages", []);
        }}>Clear chat</button>
      </div>

      {/* Who to talk to */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        <button style={{ ...S.seg, ...(activeCrew==="all"?S.segOn:{}) }} onClick={()=>setActiveCrew("all")}>
          👥 All crew
        </button>
        {Object.entries(CREW).map(([k,m])=>(
          <button key={k} style={{ ...S.seg, ...(activeCrew===k?{ ...S.segOn, background:m.gem, borderColor:m.gem }:{}) }}
            onClick={()=>setActiveCrew(k)}>
            {m.icon} {m.name}
          </button>
        ))}
      </div>

      {/* Chat thread */}
      <div style={{ background:navy, borderRadius:16, border:`1px solid ${line}`, overflow:"hidden", marginBottom:12 }}>
        <div style={{ maxHeight:480, overflowY:"auto", padding:"16px 14px" }}>
          {messages.map(msg => {
            const isYou = msg.from === "you";
            const m = isYou ? null : CREW[msg.from];
            return (
              <div key={msg.id} style={{ display:"flex", gap:10, marginBottom:14, flexDirection: isYou?"row-reverse":"row", alignItems:"flex-end" }}>
                {!isYou && (
                  <div style={{ width:32, height:32, borderRadius:"50%", background:m?.gem+"33", border:`1.5px solid ${m?.gem}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                    {m?.icon}
                  </div>
                )}
                <div style={{ maxWidth:"72%", background: isYou ? `linear-gradient(135deg,#D4AF37,#C8922A)` : panel2, borderRadius: isYou?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 13px", border: isYou?"none":`1px solid ${line}` }}>
                  {!isYou && (
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:m?.facet, letterSpacing:0.3 }}>{m?.name}</div>
                      <SpeakBtn text={msg.text} crewKey={msg.from} small />
                    </div>
                  )}
                  <div style={{ fontSize:13.5, color: isYou?navy:cream, lineHeight:1.55 }}>{msg.text}</div>
                  <div style={{ fontSize:10.5, color: isYou?"#8B6914":mute, marginTop:4, textAlign:"right" }}>{msg.ts}</div>
                  {!isYou && (
                    <div style={{ marginTop:6, textAlign:"right" }}>
                      <button
                        style={{ fontSize:11, background:"none", border:"none", cursor:"pointer", color: savedMsgs[msg.id] ? "#7FD3AE" : "#7E8AAC", padding:0 }}
                        onClick={()=>{
                          if (savedMsgs[msg.id] || !setIdeas) return;
                          const ideaText = `${m?.name||"Crew"}: ${msg.text.slice(0,200)}${msg.text.length>200?"…":""}`;
                          setIdeas(prev=>[{ id:Date.now(), text:ideaText, plan:null, date:new Date().toISOString().slice(0,10) }, ...prev]);
                          setSavedMsgs(prev=>({...prev,[msg.id]:true}));
                        }}>
                        {savedMsgs[msg.id] ? "✓ Saved to Ideas" : "💡 Save idea"}
                      </button>
                    </div>
                  )}
                </div>
                {isYou && (
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#D4AF37,#C8922A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:navy, flexShrink:0 }}>
                    👑
                  </div>
                )}
              </div>
            );
          })}
          {busy && (
            <div style={{ display:"flex", gap:10, alignItems:"flex-end", marginBottom:14 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"#2A335C", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💭</div>
              <div style={{ background:panel2, borderRadius:"16px 16px 16px 4px", padding:"12px 16px", border:`1px solid ${line}` }}>
                <Typing />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ borderTop:`1px solid ${line}`, padding:"10px 12px", display:"flex", gap:8, background:panel }}>
          <input
            style={{ ...S.input, flex:1, borderRadius:20, padding:"9px 16px" }}
            placeholder={activeCrew==="all" ? "Ask the whole crew…" : `Talk to ${CREW[activeCrew]?.name}…`}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            disabled={busy}
          />
          <button style={{ ...S.gold, borderRadius:20, padding:"9px 18px" }} disabled={busy||!input.trim()} onClick={send}>
            Send
          </button>
        </div>
      </div>

      {/* Suggested questions */}
      <Card>
        <div style={{ fontSize:12.5, color:mute, marginBottom:10, fontWeight:600 }}>Try asking:</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[
            "What should I post this Saturday?",
            "Which of my videos performed best and why?",
            "How do I attract more K-pop fans?",
            "Give me 3 hook ideas for a BLACKPINK video",
            "Is my content too jewelry-focused?",
            "What's missing from my content mix?",
            "How do I build a cult following faster?",
            "Roast my current strategy",
          ].map(q=>(
            <button key={q} style={{ ...S.chip, fontSize:12, padding:"6px 12px" }} onClick={()=>{ setInput(q); }}>
              {q}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===================== BRAND BIBLE =====================
function Bible({ bible, setBible }) {
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard?.writeText(bible).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1500); }); }

  return (
    <div>
      <Eyebrow>Brand bible</Eyebrow>
      <h2 style={S.h2}>Everything the crew knows</h2>

      <Card accent>
        <div style={{ fontWeight:700, fontSize:14, color:"#7FD3AE", marginBottom:4 }}>✓ Cross-device sync active</div>
        <p style={{ ...S.subtle }}>Your data syncs automatically across laptop and phone via Supabase. Scripts, ideas, video logs — all synced.</p>
      </Card>

      <Card>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <button style={S.gold} onClick={copy}>{copied?"Copied ✓":"Copy for another AI"}</button>
        </div>
        <textarea style={{ ...S.textarea, minHeight:420, fontFamily:"ui-monospace, monospace", fontSize:12.5 }} value={bible} onChange={e=>setBible(e.target.value)} />
      </Card>
    </div>
  );
}

/* ---------- shared UI bits ---------- */
function Style() {
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    @keyframes pulse{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
    @keyframes wave{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    *{box-sizing:border-box}
    textarea,input,select,button{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
    button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid #D4AF37;outline-offset:2px}
    ::-webkit-scrollbar{width:7px;height:7px}
    ::-webkit-scrollbar-track{background:#0A0E1F}
    ::-webkit-scrollbar-thumb{background:#2A335C;border-radius:8px}
    ::-webkit-scrollbar-thumb:hover{background:#D4AF3766}
    .wave-container{position:fixed;bottom:0;left:0;width:100%;height:100px;overflow:hidden;pointer-events:none;z-index:0;opacity:0.12}
    .wave{position:absolute;bottom:0;left:0;width:200%;height:100%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100'%3E%3Cpath fill='%23D4AF37' d='M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 L1440,100 L0,100 Z'/%3E%3C/svg%3E") repeat-x;animation:wave 8s linear infinite}
    .wave2{animation-delay:-4s;opacity:0.5}
    .jolly-roger{animation:float 4s ease-in-out infinite}
    .crew-card-inner:hover{transform:translateY(-3px)}
    .gold-shimmer{background:linear-gradient(90deg,#D4AF37,#F5E17A,#D4AF37,#A07C20,#D4AF37);background-size:200% auto;animation:shimmer 3s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .nav-scroll{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
    .nav-scroll::-webkit-scrollbar{display:none}
  `}</style>;
}
function Diamond({ size=20, color="#E8C77E" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden><path d="M5 3h14l3 6-10 12L2 9z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/><path d="M2 9h20M9 3 7 9l5 12M15 3l2 6-5 12" fill="none" stroke={color} strokeWidth="0.8" opacity="0.7"/></svg>;
}
function GemAvatar({ color, facet, icon }) {
  return (
    <div style={{ position:"relative", width:46, height:46 }}>
      <svg width="46" height="46" viewBox="0 0 46 46"><path d="M9 6h28l6 12-20 22L3 18z" fill={color} opacity="0.22"/><path d="M9 6h28l6 12-20 22L3 18z" fill="none" stroke={facet} strokeWidth="1.3" strokeLinejoin="round"/><path d="M3 18h40M16 6 12 18l11 22M30 6l4 12-11 22" fill="none" stroke={facet} strokeWidth="0.6" opacity="0.6"/></svg>
      <span style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{icon}</span>
    </div>
  );
}
function Bubble({ d, bossEntry }) {
  if (bossEntry || d.k === "boss") {
    return (
      <div style={{ marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
          <span style={{ fontSize:15 }}>👑</span>
          <span style={{ fontWeight:700, fontSize:12.5, color:"#F0D27A" }}>You (Boss)</span>
          <span style={{ color:"#5A6080", fontSize:11 }}>jumped in</span>
        </div>
        <div style={{ fontSize:13.5, lineHeight:1.6, color:"#F3EEE2", paddingLeft:26, borderLeft:"2px solid #D4AF37", marginLeft:8, fontStyle:"italic" }}>{d.text}</div>
      </div>
    );
  }
  const m = CREW[d.k] || CREW.robin;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
        <span>{m.icon}</span>
        <span style={{ fontWeight:600, fontSize:13, color:m.facet }}>{m.name} <span style={{ color:"#7E84A3", fontWeight:400 }}>({m.role})</span></span>
        {d.round>0 && <span style={{ fontSize:11, color:"#5A6080" }}>· R{d.round}</span>}
        <SpeakBtn text={`${m.name} says: ${d.text}`} crewKey={d.k} small />
      </div>
      <div style={{ fontSize:13.5, lineHeight:1.55, color:"#E8E6F0", paddingLeft:24, borderLeft:`2px solid ${m.gem}55`, marginLeft:7 }}>{d.text}</div>
    </div>
  );
}
const Typing = () => <div style={{ display:"flex", gap:5, padding:"4px 24px" }}>{[0,1,2].map(i=><span key={i} style={{ width:6, height:6, borderRadius:"50%", background:gold, animation:`pulse 1.1s ${i*0.18}s infinite` }} />)}</div>;
const Card = ({ children, accent }) => <div style={{ ...S.card, ...(accent?{ borderColor:gold, boxShadow:`0 0 16px ${gold}22` }:{}) }}>{children}</div>;
const Eyebrow = ({ children }) => <div style={S.eyebrow}>{children}</div>;
const Tag = ({ children, gold: isGold }) => <span style={{ ...S.tag, ...(isGold?{ background:"#2A1E00", color:"#F0D27A", borderColor:"#6B5418" }:{}) }}>{children}</span>;
const Label = ({ children }) => <div style={S.miniLabel}>{children}</div>;
const Field = ({ label, children, full }) => <div style={{ gridColumn: full?"1 / -1":"auto" }}><label style={S.fieldLbl}>{label}</label>{children}</div>;
const Empty = ({ text, action }) => <div style={S.empty}><div style={{ fontSize:28, marginBottom:8 }}>🏴‍☠️</div><div>{text}</div>{action && <div style={{ marginTop:12 }}>{action}</div>}</div>;
function Step({ n, crew, label }) {
  const m = crew ? CREW[crew] : null;
  return <div style={{ display:"flex", alignItems:"center", gap:9 }}>
    {n && <span style={S.stepNum}>{n}</span>}
    {m && <span style={{ fontSize:16 }}>{m.icon}</span>}
    <span style={S.stepLabel}>{label}</span>
  </div>;
}

/* ---------- styles ---------- */
const navy = "#0A0E1F", panel = "#111827", panel2 = "#1a2035", line = "#2A335C", gold = "#D4AF37", goldLight = "#E8C77E", goldDeep = "#C8922A", cream = "#F3EEE2", mute = "#7E8AAC";
const S = {
  app: { minHeight:"100vh", background:`radial-gradient(ellipse 120% 60% at 60% -10%,#1A2350 0%,#0A0E1F 60%),repeating-linear-gradient(45deg,#0D1228 0px,#0D1228 2px,transparent 2px,transparent 20px)`, color:cream, fontFamily:"'DM Sans',system-ui,-apple-system,sans-serif", paddingBottom:60, position:"relative" },
  header: { padding:"16px 18px 10px", borderBottom:`1px solid #D4AF3733`, position:"sticky", top:0, background:`${navy}F0`, backdropFilter:"blur(16px)", zIndex:10 },
  brandRow: { display:"flex", alignItems:"center", gap:14, marginBottom:12 },
  wordmark: { fontFamily:"'DM Sans',system-ui,-apple-system,sans-serif", fontSize:24, fontWeight:900, letterSpacing:2, lineHeight:1, display:"block" },
  tagline: { fontSize:11, color:"#D4AF3788", marginTop:3, letterSpacing:1, fontFamily:"'DM Sans',system-ui,sans-serif" },
  nav: { display:"flex", gap:4, flexWrap:"wrap" },
  navBtn: { background:"none", border:"1px solid transparent", color:mute, fontSize:12, padding:"5px 9px", borderRadius:7, cursor:"pointer", fontWeight:500, whiteSpace:"nowrap", transition:"all 0.15s" },
  navOn: { color:navy, background:`linear-gradient(135deg,${gold},${goldDeep})`, border:"1px solid #C8922A", fontWeight:700 },
  main: { maxWidth:800, margin:"0 auto", padding:"22px 16px", position:"relative", zIndex:1 },
  eyebrow: { fontSize:10.5, letterSpacing:2.5, textTransform:"uppercase", color:gold, fontWeight:700, marginBottom:6, fontFamily:"'DM Sans',system-ui,sans-serif" },
  h2: { fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:24, fontWeight:700, margin:"0 0 8px", color:cream, lineHeight:1.2 },
  lede: { fontSize:13.5, color:mute, lineHeight:1.65, margin:"0 0 18px", maxWidth:560 },
  card: { background:`linear-gradient(145deg,${panel},${navy})`, border:`1px solid #2A335C`, borderRadius:16, padding:"18px 18px", marginBottom:14, position:"relative", overflow:"hidden" },
  cardTitle: { fontWeight:700, fontSize:15, marginBottom:8, color:cream, fontFamily:"'DM Sans',system-ui,sans-serif" },
  crewGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:12 },
  crewCard: { background:`linear-gradient(145deg,${panel},${navy})`, border:`1px solid ${line}`, borderRadius:16, padding:16 },
  crewName: { fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fontSize:15, color:cream },
  crewRole: { fontSize:12, fontWeight:600, marginTop:2, letterSpacing:0.5 },
  crewBlurb: { fontSize:13, color:mute, lineHeight:1.55, margin:"10px 0 0" },
  input: { flex:1, minWidth:120, padding:"10px 13px", background:panel2, border:`1px solid ${line}`, borderRadius:9, color:cream, fontSize:13.5, outline:"none" },
  textarea: { width:"100%", padding:"12px 14px", background:panel2, border:`1px solid ${line}`, borderRadius:10, color:cream, fontSize:13.5, lineHeight:1.65, resize:"vertical", outline:"none" },
  gold: { background:`linear-gradient(135deg,${gold},${goldDeep})`, color:navy, border:"none", padding:"10px 20px", borderRadius:9, fontWeight:800, fontSize:13.5, cursor:"pointer", whiteSpace:"nowrap", letterSpacing:0.3, fontFamily:"'DM Sans',system-ui,sans-serif", boxShadow:"0 2px 12px #D4AF3733" },
  ghost: { background:"transparent", color:cream, border:`1px solid ${line}`, padding:"9px 15px", borderRadius:9, fontSize:13, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", transition:"border-color 0.15s" },
  linkBtn: { background:"none", border:"none", color:"#F2929F", textDecoration:"underline", cursor:"pointer", fontSize:12 },
  chip: { background:"transparent", border:`1px solid ${line}`, color:mute, padding:"7px 14px", borderRadius:20, fontSize:12.5, fontWeight:600, cursor:"pointer" },
  seg: { background:panel, border:`1px solid ${line}`, color:mute, padding:"9px 16px", borderRadius:10, fontSize:13.5, fontWeight:600, cursor:"pointer" },
  segOn: { background:`linear-gradient(135deg,${gold},${goldDeep})`, color:navy, borderColor:gold },
  trendRow: { display:"flex", gap:12, alignItems:"center", padding:"13px 0", borderTop:`1px solid ${line}` },
  trendName: { fontWeight:700, fontSize:14.5, color:cream, fontFamily:"'DM Sans',system-ui,sans-serif" },
  trendReason: { fontSize:12.5, color:mute, marginTop:3, lineHeight:1.5 },
  thread: { marginTop:12, paddingRight:4 },
  verdictBox: { background:`linear-gradient(180deg,#1A1400,#120E00)`, border:`1px solid ${gold}55`, borderRadius:12, padding:16, marginTop:8, boxShadow:`0 0 20px ${gold}22` },
  verdictText: { margin:0, fontSize:14, lineHeight:1.65, color:goldLight },
  directive: { fontSize:12.5, color:"#E8C77ECC", marginTop:9 },
  yourCall: { fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:700, fontSize:14, color:cream, marginBottom:4 },
  subtle: { fontSize:12.5, color:mute, marginBottom:4 },
  stepNum: { width:26, height:26, borderRadius:"50%", background:`linear-gradient(135deg,${gold},${goldDeep})`, color:navy, fontSize:13, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" },
  stepLabel: { fontWeight:700, fontSize:14.5, color:cream, fontFamily:"'DM Sans',system-ui,sans-serif" },
  briefBox: { background:panel2, border:`1px solid ${line}`, borderRadius:12, padding:14, marginTop:12 },
  miniLabel: { fontSize:10.5, letterSpacing:1.5, textTransform:"uppercase", color:gold, fontWeight:700, margin:"12px 0 5px", fontFamily:"'DM Sans',system-ui,sans-serif" },
  ul: { margin:"0", paddingLeft:18, fontSize:13, color:"#D5D3E0", lineHeight:1.7 },
  caption: { fontSize:13, color:"#D5D3E0", lineHeight:1.6, background:navy, borderRadius:8, padding:"9px 11px", whiteSpace:"pre-wrap", border:`1px solid ${line}` },
  logged: { fontSize:12.5, color:"#7FD3AE", marginTop:12 },
  formGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginTop:12 },
  fieldLbl: { fontSize:11, color:mute, display:"block", marginBottom:4, letterSpacing:0.5 },
  scoreLbl: { fontSize:9.5, color:mute, letterSpacing:1, fontFamily:"'DM Sans',system-ui,sans-serif" },
  briefBack: { background:navy, borderRadius:10, padding:12, marginTop:10, fontSize:12.5, lineHeight:1.55, border:`1px solid ${line}` },
  shotBox: { background:navy, border:`1px dashed ${gold}55`, borderRadius:10, padding:12, marginTop:6, marginBottom:4 },
  weekRow: { display:"flex", gap:12, padding:"13px 0", borderTop:`1px solid ${line}` },
  weekNum: { width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${gold},${goldDeep})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:navy, fontSize:13, fontFamily:"'DM Sans',system-ui,sans-serif" },
  weekFocus: { fontWeight:700, fontSize:14, color:cream, marginBottom:5, fontFamily:"'DM Sans',system-ui,sans-serif" },
  dayBlock: { padding:"12px 0", borderTop:`1px solid ${line}` },
  dayName: { fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:16, color:gold, marginBottom:8, fontWeight:700 },
  postRow: { background:panel2, border:`1px solid ${line}`, borderRadius:10, padding:11, marginBottom:8 },
  postIdea: { fontSize:13.5, color:cream, fontWeight:600, lineHeight:1.5 },
  postFilm: { fontSize:12.5, color:mute, marginTop:5 },
  postCap: { fontSize:12.5, color:"#9DBCE0", marginTop:4 },
  ideaText: { fontSize:14.5, color:cream, lineHeight:1.5, flex:1 },
  ideaReact: { fontSize:13, color:"#D5D3E0", lineHeight:1.55, paddingLeft:22 },
  tag: { fontSize:11, padding:"3px 9px", borderRadius:7, background:panel2, color:mute, border:`1px solid ${line}`, fontWeight:600 },
  empty: { textAlign:"center", color:mute, fontSize:13.5, padding:"32px 10px", fontFamily:"'DM Sans',system-ui,sans-serif" },
  err: { maxWidth:800, margin:"14px auto 0", background:"#3A1620", color:"#F2929F", padding:"11px 15px", borderRadius:10, fontSize:13, border:"1px solid #882040" },
};
