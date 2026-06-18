import React, { useState, useRef, useEffect } from "react";

/* ============================================================
   JAYDEN GEM — AI MARKETING CREW (Vercel hosted version)
   Powers: Gemini API (server-side via /api/crew)
   Storage: localStorage (persists in browser, syncs via login)
   Sheets: real auto-write via Franky → /api/crew → Google Sheets
   ============================================================ */
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


// ---------- API (calls /api/crew serverless function on Vercel) ----------
async function ask(system, user, json = false, maxTokens = 1000) {
  const r = await fetch("/api/crew", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "ask", system, user }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  if (json) return parseLoose(d.text);
  return d.text;
}

async function askVision(system, user, images, json = false, maxTokens = 1000) {
  const r = await fetch("/api/crew", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "ask", system, user, images }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error);
  if (json) return parseLoose(d.text);
  return d.text;
}

// Franky's real Sheets write — posts to /api/crew which writes to Google Sheets
async function frankyLog(sheetTab, sheetValues) {
  try {
    const r = await fetch("/api/crew", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sheets", sheetTab, sheetValues }),
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    return true;
  } catch (e) {
    console.warn("Franky Sheets write failed:", e.message);
    return false;
  }
}

// Forgiving JSON reader
function parseLoose(raw) {
  let t = (raw||"").replace(/```json|```/g, "").trim();
  const s = t.indexOf("{"), sa = t.indexOf("[");
  const start = sa !== -1 && (sa < s || s === -1) ? sa : s;
  const end = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  try { return JSON.parse(t); } catch (e) {}
  let out = "", inStr = false, prev = "";
  for (const ch of t) {
    if (ch === '"' && prev !== "\\") inStr = !inStr;
    if (inStr && ch === "\n") { out += "\\n"; prev = ch; continue; }
    if (inStr && ch === "\r") { prev = ch; continue; }
    if (inStr && ch === "\t") { out += "\\t"; prev = ch; continue; }
    out += ch; prev = ch;
  }
  try { return JSON.parse(out); } catch (e) {
    throw new Error("The crew's reply came back garbled. Tap the button again.");
  }
}

const ctx = (bible) => bible + "\nProtected English terms (keep verbatim, uppercase): " + PROTECTED.join(", ");

// ---------- Supabase sync via /api/crew ----------
const LIMITS = { jg_videoLog: 300, jg_finalScripts: 400, jg_insights: 100, jg_ideas: 200 };
function trimData(key, value) {
  const limit = LIMITS[key];
  if (limit && Array.isArray(value) && value.length > limit) return value.slice(0, limit);
  return value;
}

async function loadKey(key, fallback) {
  // Try Supabase first via API
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
  // Save to localStorage immediately (fast, works offline)
  try { localStorage.setItem(key, JSON.stringify(trimmed)); } catch(e) {}
  // Also sync to Supabase via API (async, cross-device)
  try {
    await fetch("/api/crew", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "db_set", dataKey: key, value: trimmed })
    });
  } catch(e) {} // silent fail — localStorage still saved it
}

export default function App() {
  const [tab, setTab] = useState("crew");
  const [bible, setBible] = useState(DEFAULT_BIBLE);
  const [insights, setInsights] = useState([]);  // Nami's learned briefs
  const [videoLog, setVideoLog] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [finalScripts, setFinalScripts] = useState([]);  // boss's own final edited scripts
  const [err, setErr] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Load saved data on open — tries Supabase first then localStorage fallback
  useEffect(() => {
    (async () => {
      setBible(await loadKey("jg_bible", DEFAULT_BIBLE));
      setInsights(await loadKey("jg_insights", []));
      setVideoLog(await loadKey("jg_videoLog", []));
      setIdeas(await loadKey("jg_ideas", []));
      setFinalScripts(await loadKey("jg_finalScripts", []));
      setHydrated(true);
    })();
  }, []);

  // Save whenever data changes (only after first load, so we never wipe stored data)
  useEffect(() => { if (hydrated) saveKey("jg_bible", bible); }, [bible, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_insights", insights); }, [insights, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_videoLog", videoLog); }, [videoLog, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_ideas", ideas); }, [ideas, hydrated]);
  useEffect(() => { if (hydrated) saveKey("jg_finalScripts", finalScripts); }, [finalScripts, hydrated]);

  return (
    <div style={S.app}>
      <Style />
      <Header tab={tab} setTab={setTab} />
      {err && <div style={S.err}><b>Something went wrong:</b> {err} <button style={S.linkBtn} onClick={() => setErr(null)}>dismiss</button></div>}
      <div style={S.main}>
        {tab === "crew" && <CrewView />}
        {tab === "studio" && <Studio bible={bible} insights={insights} finalScripts={finalScripts} setErr={setErr} />}
        {tab === "calendar" && <Calendar bible={bible} insights={insights} setErr={setErr} />}
        {tab === "ideas" && <Ideas ideas={ideas} setIdeas={setIdeas} bible={bible} setErr={setErr} />}
        {tab === "analytics" && <Analytics videoLog={videoLog} setVideoLog={setVideoLog} insights={insights} setInsights={setInsights} bible={bible} setErr={setErr} />}
        {tab === "scripts" && <Scripts finalScripts={finalScripts} setFinalScripts={setFinalScripts} />}
        {tab === "bible" && <Bible bible={bible} setBible={setBible} />}
      </div>
    </div>
  );
}

// ---------- Header / Nav ----------
function Header({ tab, setTab }) {
  const tabs = [["crew","The Crew"],["studio","Content Studio"],["calendar","Calendar"],["ideas","Idea Board"],["analytics","Analytics"],["scripts","My Scripts"],["bible","Brand Bible"]];
  return (
    <div style={S.header}>
      <div style={S.brandRow}>
        <Diamond size={26} color="#E8C77E" />
        <div>
          <div style={S.wordmark}>Jayden Gem</div>
          <div style={S.tagline}>AI marketing crew · 5 hands on deck</div>
        </div>
      </div>
      <nav style={S.nav}>
        {tabs.map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...S.navBtn, ...(tab===k ? S.navOn : {}) }}>{l}</button>
        ))}
      </nav>
    </div>
  );
}

// ---------- Crew view ----------
function CrewView() {
  return (
    <div>
      <Eyebrow>Your crew</Eyebrow>
      <h2 style={S.h2}>Five hands, one ship</h2>
      <p style={S.lede}>Robin scouts the trend, the crew argues it out, Luffy makes the call, you have the final say, Usopp writes it, Franky logs it. Nami studies every result so the crew gets sharper each week.</p>
      <div style={S.crewGrid}>
        {Object.entries(CREW).map(([k,m]) => (
          <div key={k} style={S.crewCard}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <GemAvatar color={m.gem} facet={m.facet} icon={m.icon} />
              <div>
                <div style={S.crewName}>{m.name}</div>
                <div style={{ ...S.crewRole, color:m.facet }}>({m.role})</div>
              </div>
            </div>
            <p style={S.crewBlurb}>{m.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== STUDIO =====================
function Studio({ bible, insights, finalScripts = [], setErr }) {
  const [seed, setSeed] = useState("");
  const [phase, setPhase] = useState("idle");
  const [trends, setTrends] = useState([]);
  const [debate, setDebate] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [picked, setPicked] = useState({ jaydenTT:true, jaydenFB:true, shpTT:false, academyFB:false, goldsmithFB:false });
  const [briefs, setBriefs] = useState([]);
  const [scriptDebate, setScriptDebate] = useState([]);
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [debate, scriptDebate]);

  const learned = insights.length ? insights.map(i => i.summary).filter(Boolean).join(" | ") : "No past performance data logged yet.";

  async function research() {
    setErr(null); setBusy(true); setPhase("researching");
    setTrends([]); setDebate([]); setVerdict(null); setBriefs([]); setScriptDebate([]);
    try {
      const sys = ctx(bible) + "\nYou are Nico Robin, Trend Researcher. Search global celebrity jewelry moments AND Myanmar/SE-Asia relevant angles. Remember Jayden's growth lessons (K-pop = followers, multi-part = shares, personal/controversy = watch time).";
      const usr = `Learned so far: ${learned}\nBoss's direction: "${seed || "open — surprise me with what's hot now"}".\nPropose 4 topics. Return ONLY a JSON array, each: {"celebrity":"","piece":"","platform":"TikTok|Facebook|Both","trendScore":0-100,"reason":"one sentence, Myanmar audience","hookType":"one of: ${HOOK_TYPES.join(', ')}"}.`;
      const r = await ask(sys, usr, true);
      setTrends(Array.isArray(r) ? r : (r.topics||[])); setPhase("trends");
    } catch (e) { setErr(e.message); setPhase("idle"); }
    setBusy(false);
  }

  async function debateTopic(topic) {
    setErr(null); setBusy(true); setPhase("debating"); setDebate([]); setVerdict(null);
    const t = [];
    const speakers = [
      { k:"robin", who:"Nico Robin (Trend Researcher)", line:"Argue for trend timing & reach. Push your pick but stay open." },
      { k:"nami",  who:"Nami (Analytics Analyst)", line:`Use cold data to support or push back. Known: ${learned}. Cite watch time, shares, follower conversion.` },
      { k:"usopp", who:"Usopp (Script Writer)", line:"Argue from hook & story angle — which gives the strongest opening and the best personal/cult-following moment. Offer compromises." },
    ];
    try {
      for (let round=1; round<=5; round++) {
        for (const sp of speakers) {
          const sys = ctx(bible) + `\nYou are ${sp.who} in a crew debate. ${sp.line} 2-3 punchy sentences. Disagree when you have reason. Debate round ${round} of 5.`;
          const usr = `Topic: ${topic.celebrity} — ${topic.piece} (${topic.platform}), trend ${topic.trendScore}.\nDebate so far:\n${t.map(x=>`${x.who}: ${x.text}`).join("\n")||"(open)"}\nYour round ${round} argument:`;
          const text = await ask(sys, usr, false);
          t.push({ round, k:sp.k, who:sp.who, text:text.trim() }); setDebate([...t]);
        }
      }
      setPhase("verdict");
      const vsys = ctx(bible) + "\nYou are Luffy, the Captain / Creative Director. You watched silently. Give the final call: best topic, lead account, hook type, one directive to Usopp. Decisive and short.";
      const vusr = `Topic: ${topic.celebrity} — ${topic.piece}.\nFull debate:\n${t.map(x=>`[R${x.round}] ${x.who}: ${x.text}`).join("\n")}\nReturn ONLY JSON: {"verdict":"2-3 sentences","finalTopic":"","leadAccount":"","hookType":"","directive":""}.`;
      const v = await ask(vsys, vusr, true);
      setVerdict({ ...v, topic });
    } catch (e) { setErr(e.message); setPhase("trends"); }
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
          <div style={S.cardTitle}>Pick a topic to put to the crew</div>
          {trends.map((t,i)=>(
            <div key={i} style={S.trendRow}>
              <div style={{ flex:1 }}>
                <div style={S.trendName}>{t.celebrity} — {t.piece}</div>
                <div style={S.trendReason}>{t.reason}</div>
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                  <Tag>{t.platform}</Tag><Tag>{t.hookType}</Tag><Tag gold>Trend {t.trendScore}</Tag>
                </div>
              </div>
              <button style={S.ghost} disabled={busy} onClick={()=>debateTopic(t)}>Debate →</button>
            </div>
          ))}
        </Card>
      )}

      {debate.length>0 && (
        <Card>
          <Step n="2" label="Crew debate — 5 rounds" />
          <div ref={logRef} style={S.thread}>
            {debate.map((d,i)=><Bubble key={i} d={d} />)}
            {phase==="debating" && <Typing />}
          </div>
        </Card>
      )}

      {verdict && (
        <Card accent>
          <Step n="3" crew="luffy" label="Luffy's verdict" />
          <div style={S.verdictBox}>
            <p style={S.verdictText}>{verdict.verdict}</p>
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
function Calendar({ bible, insights, setErr }) {
  const [view, setView] = useState("month");
  const [busy, setBusy] = useState(false);
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);
  const learned = insights.length ? insights.map(i=>i.summary).join(" | ") : "no logged data yet";

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
      const sys = ctx(bible) + "\nYou are the crew planning ONE WEEK, day by day, across the 5 accounts. Keep each post SHORT (one line each field). Return ONLY valid JSON, escape any line breaks as \\n, no double-quotes inside strings.";
      const usr = `Learned: ${learned}\nPlan 7 days (Mon..Sun). Put ~2-3 posts per day spread across the accounts (not all 5 every day) so the week feels realistic. Shape: {"days":[{"day":"Mon","posts":[{"account":"","platform":"","idea":"short","format":"talking-head/VS/ranking/story/BTS","whatToFilm":"short","caption":"short"}]}, ...Sun]}.`;
      setWeek(await ask(sys, usr, true, 3000));
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
        <Card>
          {!month ? (
            <Empty text="No month planned yet." action={<button style={S.gold} disabled={busy} onClick={planMonth}>{busy?"Planning…":"Plan this month"}</button>} />
          ) : (
            <div>
              <div style={S.cardTitle}>{month.theme}</div>
              {(month.weeks||[]).map((w,i)=>(
                <div key={i} style={S.weekRow}>
                  <div style={S.weekNum}>W{w.week}</div>
                  <div style={{ flex:1 }}>
                    <div style={S.weekFocus}>{w.focus}</div>
                    <ul style={S.ul}>{(w.highlights||[]).map((h,j)=><li key={j}>{h}</li>)}</ul>
                  </div>
                </div>
              ))}
              <button style={S.ghost} disabled={busy} onClick={planMonth}>Re-plan</button>
            </div>
          )}
        </Card>
      )}

      {view==="week" && (
        <Card>
          {!week ? (
            <Empty text="No week planned yet." action={<button style={S.gold} disabled={busy} onClick={planWeek}>{busy?"Planning…":"Plan this week"}</button>} />
          ) : (
            <div>
              {(week.days||[]).map((d,i)=>(
                <div key={i} style={S.dayBlock}>
                  <div style={S.dayName}>{d.day}</div>
                  {(d.posts||[]).map((p,j)=>(
                    <div key={j} style={S.postRow}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:4 }}>
                        <Tag gold>{p.account}</Tag><Tag>{p.platform}</Tag><Tag>{p.format}</Tag>
                      </div>
                      <div style={S.postIdea}>{p.idea}</div>
                      <div style={S.postFilm}>🎬 {p.whatToFilm}</div>
                      <div style={S.postCap}>📝 {p.caption}</div>
                    </div>
                  ))}
                </div>
              ))}
              <button style={S.ghost} disabled={busy} onClick={planWeek}>Re-plan week</button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ===================== IDEAS =====================
function Ideas({ ideas, setIdeas, bible, setErr }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function drop() {
    if (!note.trim()) return;
    setIdeas([{ id:Date.now(), text:note.trim(), plan:null }, ...ideas]); setNote("");
  }
  async function debateNow(id) {
    const idea = ideas.find(x=>x.id===id); if (!idea) return;
    setErr(null); setBusy(true);
    try {
      const sys = ctx(bible) + "\nThe crew (Robin, Nami, Usopp) reacts to the boss's idea, then Luffy turns it into a plan. Be specific.";
      const usr = `Boss idea: "${idea.text}".\nReturn ONLY JSON: {"reactions":[{"who":"Nico Robin","text":""},{"who":"Nami","text":""},{"who":"Usopp","text":""}],"verdict":"Luffy's call","bestAccount":"","hook":"","action":"one next step"}.`;
      const plan = await ask(sys, usr, true);
      setIdeas(ideas.map(x=>x.id===id?{ ...x, plan }:x));
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  return (
    <div>
      <Eyebrow>Idea board</Eyebrow>
      <h2 style={S.h2}>Throw the crew an idea</h2>
      <p style={S.lede}>Drop a quick note for the crew to pick up later, or hit “Debate now” to put it to the council on the spot.</p>
      <Card>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <input style={S.input} placeholder="e.g. Something about Sabrina Carpenter's ring" value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&drop()} />
          <button style={S.gold} onClick={drop}>Add idea</button>
        </div>
      </Card>
      {ideas.length===0 && <Empty text="No ideas yet. The board is yours." />}
      {ideas.map(idea=>(
        <Card key={idea.id}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"start" }}>
            <div style={S.ideaText}>💡 {idea.text}</div>
            {!idea.plan && <button style={S.ghost} disabled={busy} onClick={()=>debateNow(idea.id)}>{busy?"…":"Debate now"}</button>}
          </div>
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
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ===================== ANALYTICS =====================
function Analytics({ videoLog, setVideoLog, insights, setInsights, bible, setErr }) {
  const today = new Date().toISOString().slice(0,10);
  const blank = { title:"", account:"Jayden Gem", platform:"TikTok", views:"", watch:"", completion:"", likes:"", comments:"", dms:"", shares:"", saves:"", celebrity:"", hookType:HOOK_TYPES[0], date:today };
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [editId, setEditId] = useState(null); // when updating an existing logged video
  const set = (k,v) => setF({ ...f,[k]:v });

  function fileToImage(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res({ media_type: file.type || "image/png", data: String(r.result).split(",")[1] });
      r.onerror = () => rej(new Error("Could not read that image."));
      r.readAsDataURL(file);
    });
  }

  async function readShots(fileList) {
    const files = Array.from(fileList || []).slice(0, 4);
    if (!files.length) return;
    setErr(null); setReading(true);
    try {
      const images = await Promise.all(files.map(fileToImage));
      const sys = ctx(bible) + "\nYou are Nami, Analytics Analyst. Read these TikTok/Facebook analytics screenshots and pull out the numbers. If a value isn't shown, leave it empty. Convert shorthand like 804K to 804000, 1.2M to 1200000.";
      const usr = `Extract this video's stats from the screenshot(s). Return ONLY JSON with whatever you can see: {"title":"","account":"","platform":"TikTok|Facebook","views":"","watch":"","completion":"","likes":"","comments":"","dms":"","shares":"","saves":"","celebrity":"","date":""}. Numbers only (no commas or letters) for numeric fields.`;
      const got = await askVision(sys, usr, images, true, 1000);
      setF(prev => ({ ...prev, ...Object.fromEntries(Object.entries(got||{}).filter(([k,v]) => v !== "" && v != null)) }));
    } catch(e){ setErr("Couldn't read the screenshot — you can still type the numbers in. ("+e.message+")"); }
    setReading(false);
  }

  async function analyze() {
    if (!f.title || !f.views) return;
    setErr(null); setBusy(true);
    try {
      const hist = videoLog.slice(0,5).map(v=>`${v.title}: ${v.views}v ${v.completion}% ${v.dms}DM`).join(" | ")||"none";
      const sys = ctx(bible) + "\nYou are Nami, Analytics Analyst. Read this video against history. Cold and specific with numbers.";
      const usr = `New: ${JSON.stringify(f)}\nLast 5: ${hist}\nReturn ONLY JSON: {"score":0-100,"viral":"Low|Medium|High|Explosive","dmConv":"x%","trend":"Improving|Declining|Stable","worked":["",""],"improve":["",""],"nextTopic":"","toRobin":"brief for researcher","toUsopp":"brief for writer","summary":"one-line pattern learned"}`;
      const ai = await ask(sys, usr, true, 1200);
      if (editId) {
        setVideoLog(videoLog.map(v => v.id===editId ? { ...f, ai, id:editId, updated:today } : v));
        setEditId(null);
        // Franky updates the sheet row note
        frankyLog("Video Log", [[today, f.account, f.platform, f.celebrity||"", f.title, f.format||"", f.views, f.watch||"", f.completion||"", f.likes||"", f.shares||"", f.saves||"", ai.score, ai.viral, ai.trend, "(updated)"]]);
      } else {
        setVideoLog([{ ...f, ai, id:Date.now() }, ...videoLog]);
        setInsights([ai, ...insights]);
        // Franky logs to Google Sheets automatically 🔧
        frankyLog("Video Log", [[today, f.account, f.platform, f.celebrity||"", f.title, f.format||"", f.views, f.watch||"", f.completion||"", f.likes||"", f.shares||"", f.saves||"", ai.score, ai.viral, ai.trend, ai.summary||""]]);
      }
      setF(blank);
    } catch(e){ setErr(e.message); }
    setBusy(false);
  }

  function editEntry(v) {
    setEditId(v.id);
    setF({ title:v.title, account:v.account, platform:v.platform, views:v.views, watch:v.watch, completion:v.completion, likes:v.likes, comments:v.comments, dms:v.dms, shares:v.shares, saves:v.saves, celebrity:v.celebrity, hookType:v.hookType||HOOK_TYPES[0], date:v.date||today });
    if (typeof window !== "undefined") window.scrollTo({ top:0, behavior:"smooth" });
  }
  function cancelEdit() { setEditId(null); setF(blank); }

  return (
    <div>
      <Eyebrow>Analytics</Eyebrow>
      <h2 style={S.h2}>Nami reads the numbers</h2>

      <Card>
        <Step crew="nami" label={editId ? "Update this video's stats" : "Log a video"} />

        <div style={S.shotBox}>
          <div style={{ fontSize:13.5, fontWeight:600, color:"#F3EEE2", marginBottom:4 }}>📸 Drop a screenshot — Nami fills it in for you</div>
          <div style={S.subtle}>Upload your TikTok/Facebook analytics screenshot(s) and Nami reads the numbers. Glance to confirm before logging. You can also just type below.</div>
          <input type="file" accept="image/*" multiple style={{ marginTop:8, color:"#C9D2F0", fontSize:13 }} disabled={reading}
                 onChange={e=>readShots(e.target.files)} />
          {reading && <div style={{ ...S.subtle, marginTop:6 }}>Nami is reading the screenshot…</div>}
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
          <Field label="Date"><input style={S.input} type="date" value={f.date} onChange={e=>set("date",e.target.value)} /></Field>
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
            <div style={{ textAlign:"center", minWidth:64 }}>
              <div style={{ fontSize:26, fontWeight:700, color: v.ai.score>=70?"#7FD3AE":v.ai.score>=45?"#F0D27A":"#F2929F" }}>{v.ai.score}</div>
              <div style={S.scoreLbl}>SCORE</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
            <Tag gold>{v.ai.viral}</Tag><Tag>DM {v.ai.dmConv}</Tag><Tag>{v.ai.trend}</Tag>
          </div>
          <div style={{ marginTop:10, fontSize:13.5, lineHeight:1.6 }}>
            <div style={{ color:"#7FD3AE" }}><b>✓ Worked:</b> {(v.ai.worked||[]).join("; ")}</div>
            <div style={{ color:"#F2929F", marginTop:3 }}><b>△ Improve:</b> {(v.ai.improve||[]).join("; ")}</div>
            <div style={{ color:"#F0D27A", marginTop:3 }}><b>→ Next:</b> {v.ai.nextTopic}</div>
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
    const entry = { id: Date.now(), account, topic: topic.trim(), text: text.trim(), date: new Date().toISOString().slice(0,10) };
    setFinalScripts([entry, ...finalScripts]);
    // Franky logs the final script to Google Sheets automatically 🔧
    frankyLog("Final Scripts", [[entry.date, entry.account, entry.topic||"(no topic)", entry.text]]);
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

// ===================== BRAND BIBLE =====================
function Bible({ bible, setBible }) {
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard?.writeText(bible).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1500); }); }
  return (
    <div>
      <Eyebrow>Brand bible</Eyebrow>
      <h2 style={S.h2}>Everything the crew knows</h2>
      <p style={S.lede}>Edit anything here and the whole crew uses it. Copy it to hand your brand to any other AI.</p>
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
function Bubble({ d }) {
  const m = CREW[d.k] || CREW.robin;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
        <span>{m.icon}</span>
        <span style={{ fontWeight:600, fontSize:13, color:m.facet }}>{m.name} <span style={{ color:"#7E84A3", fontWeight:400 }}>({m.role})</span></span>
        {d.round>0 && <span style={{ fontSize:11, color:"#5A6080" }}>· R{d.round}</span>}
      </div>
      <div style={{ fontSize:13.5, lineHeight:1.55, color:"#E8E6F0", paddingLeft:24, borderLeft:`2px solid ${m.gem}55`, marginLeft:7 }}>{d.text}</div>
    </div>
  );
}
const Typing = () => <div style={{ display:"flex", gap:5, padding:"4px 24px" }}>{[0,1,2].map(i=><span key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#E8C77E", animation:`pulse 1.1s ${i*0.18}s infinite` }} />)}</div>;
const Card = ({ children, accent }) => <div style={{ ...S.card, ...(accent?{ borderColor:"#D4AF37", boxShadow:"0 0 0 1px #D4AF3733" }:{}) }}>{children}</div>;
const Eyebrow = ({ children }) => <div style={S.eyebrow}>{children}</div>;
const Tag = ({ children, gold }) => <span style={{ ...S.tag, ...(gold?{ background:"#3A2E10", color:"#F0D27A", borderColor:"#6B5418" }:{}) }}>{children}</span>;
const Label = ({ children }) => <div style={S.miniLabel}>{children}</div>;
const Field = ({ label, children, full }) => <div style={{ gridColumn: full?"1 / -1":"auto" }}><label style={S.fieldLbl}>{label}</label>{children}</div>;
const Empty = ({ text, action }) => <div style={S.empty}><div>{text}</div>{action && <div style={{ marginTop:12 }}>{action}</div>}</div>;
function Step({ n, crew, label }) {
  const m = crew ? CREW[crew] : null;
  return <div style={{ display:"flex", alignItems:"center", gap:9 }}>
    {n && <span style={S.stepNum}>{n}</span>}
    {m && <span style={{ fontSize:16 }}>{m.icon}</span>}
    <span style={S.stepLabel}>{label}</span>
  </div>;
}
function Style() {
  return <style>{`
    @keyframes pulse{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
    *{box-sizing:border-box}
    textarea,input,select,button{font-family:inherit}
    button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid #E8C77E;outline-offset:1px}
    ::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-thumb{background:#2A335C;border-radius:8px}
  `}</style>;
}

/* ---------- styles ---------- */
const navy = "#0E1430", panel = "#161E40", panel2 = "#1C2650", line = "#2A335C", gold = "#E8C77E", goldDeep = "#D4AF37", cream = "#F3EEE2", mute = "#9298BC";
const S = {
  app: { minHeight:"100vh", background:`radial-gradient(1200px 600px at 80% -10%, #1A2350 0%, ${navy} 55%)`, color:cream, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", paddingBottom:40 },
  header: { padding:"18px 18px 10px", borderBottom:`1px solid ${line}`, position:"sticky", top:0, background:`${navy}E8`, backdropFilter:"blur(10px)", zIndex:5 },
  brandRow: { display:"flex", alignItems:"center", gap:12, marginBottom:12 },
  wordmark: { fontFamily:"Georgia, 'Times New Roman', serif", fontSize:22, letterSpacing:0.3, color:cream, lineHeight:1 },
  tagline: { fontSize:11.5, color:mute, marginTop:3, letterSpacing:0.4 },
  nav: { display:"flex", gap:4, flexWrap:"wrap" },
  navBtn: { background:"none", border:"none", color:mute, fontSize:13.5, padding:"7px 11px", borderRadius:8, cursor:"pointer", fontWeight:500 },
  navOn: { color:navy, background:gold },
  main: { maxWidth:780, margin:"0 auto", padding:"22px 16px" },
  eyebrow: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:goldDeep, fontWeight:600, marginBottom:6 },
  h2: { fontFamily:"Georgia, serif", fontSize:25, fontWeight:400, margin:"0 0 8px", color:cream, lineHeight:1.15 },
  lede: { fontSize:14, color:mute, lineHeight:1.6, margin:"0 0 18px", maxWidth:560 },
  card: { background:panel, border:`1px solid ${line}`, borderRadius:16, padding:"18px 18px", marginBottom:14 },
  cardTitle: { fontWeight:600, fontSize:15, marginBottom:6, color:cream },
  crewGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:12 },
  crewCard: { background:panel, border:`1px solid ${line}`, borderRadius:16, padding:16 },
  crewName: { fontWeight:600, fontSize:16, color:cream },
  crewRole: { fontSize:12.5, fontWeight:600, marginTop:1 },
  crewBlurb: { fontSize:13, color:mute, lineHeight:1.55, margin:"10px 0 0" },
  input: { flex:1, minWidth:120, padding:"10px 13px", background:panel2, border:`1px solid ${line}`, borderRadius:9, color:cream, fontSize:13.5 },
  textarea: { width:"100%", padding:"12px 14px", background:panel2, border:`1px solid ${line}`, borderRadius:10, color:cream, fontSize:13.5, lineHeight:1.65, resize:"vertical" },
  gold: { background:gold, color:navy, border:"none", padding:"10px 18px", borderRadius:9, fontWeight:700, fontSize:13.5, cursor:"pointer", whiteSpace:"nowrap" },
  ghost: { background:"transparent", color:cream, border:`1px solid ${line}`, padding:"9px 15px", borderRadius:9, fontSize:13, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap" },
  linkBtn: { background:"none", border:"none", color:"#F2929F", textDecoration:"underline", cursor:"pointer", fontSize:12 },
  chip: { background:"transparent", border:`1px solid ${line}`, color:mute, padding:"7px 14px", borderRadius:20, fontSize:12.5, fontWeight:600, cursor:"pointer" },
  seg: { background:panel, border:`1px solid ${line}`, color:mute, padding:"9px 16px", borderRadius:10, fontSize:13.5, fontWeight:600, cursor:"pointer" },
  segOn: { background:gold, color:navy, borderColor:gold },
  trendRow: { display:"flex", gap:12, alignItems:"center", padding:"13px 0", borderTop:`1px solid ${line}` },
  trendName: { fontWeight:600, fontSize:14.5, color:cream },
  trendReason: { fontSize:12.5, color:mute, marginTop:3, lineHeight:1.5 },
  thread: { maxHeight:380, overflowY:"auto", marginTop:12, paddingRight:4 },
  verdictBox: { background:"linear-gradient(180deg,#241D08,#1B1606)", border:`1px solid #6B541855`, borderRadius:12, padding:14, marginTop:8 },
  verdictText: { margin:0, fontSize:14, lineHeight:1.6, color:gold },
  directive: { fontSize:12.5, color:"#E8C77ECC", marginTop:9 },
  yourCall: { fontWeight:700, fontSize:14, color:cream, marginBottom:4 },
  subtle: { fontSize:12.5, color:mute, marginBottom:4 },
  stepNum: { width:24, height:24, borderRadius:"50%", background:gold, color:navy, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" },
  stepLabel: { fontWeight:600, fontSize:14.5, color:cream },
  briefBox: { background:panel2, border:`1px solid ${line}`, borderRadius:12, padding:14, marginTop:12 },
  miniLabel: { fontSize:11, letterSpacing:1, textTransform:"uppercase", color:goldDeep, fontWeight:600, margin:"12px 0 5px" },
  ul: { margin:"0", paddingLeft:18, fontSize:13, color:"#D5D3E0", lineHeight:1.7 },
  caption: { fontSize:13, color:"#D5D3E0", lineHeight:1.6, background:navy, borderRadius:8, padding:"9px 11px", whiteSpace:"pre-wrap" },
  logged: { fontSize:12.5, color:"#7FD3AE", marginTop:12 },
  formGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginTop:12 },
  fieldLbl: { fontSize:11, color:mute, display:"block", marginBottom:4 },
  scoreLbl: { fontSize:9.5, color:mute, letterSpacing:1 },
  briefBack: { background:navy, borderRadius:10, padding:11, marginTop:10, fontSize:12.5, lineHeight:1.55 },
  shotBox: { background:navy, border:"1px dashed #3a4577", borderRadius:10, padding:12, marginTop:6, marginBottom:4 },
  weekRow: { display:"flex", gap:12, padding:"13px 0", borderTop:`1px solid ${line}` },
  weekNum: { width:34, height:34, borderRadius:9, background:panel2, border:`1px solid ${line}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:gold, fontSize:13 },
  weekFocus: { fontWeight:600, fontSize:14, color:cream, marginBottom:5 },
  dayBlock: { padding:"12px 0", borderTop:`1px solid ${line}` },
  dayName: { fontFamily:"Georgia,serif", fontSize:16, color:gold, marginBottom:8 },
  postRow: { background:panel2, border:`1px solid ${line}`, borderRadius:10, padding:11, marginBottom:8 },
  postIdea: { fontSize:13.5, color:cream, fontWeight:500, lineHeight:1.5 },
  postFilm: { fontSize:12.5, color:mute, marginTop:5 },
  postCap: { fontSize:12.5, color:"#9DBCE0", marginTop:4 },
  ideaText: { fontSize:14.5, color:cream, lineHeight:1.5, flex:1 },
  ideaReact: { fontSize:13, color:"#D5D3E0", lineHeight:1.55, paddingLeft:22 },
  tag: { fontSize:11, padding:"3px 9px", borderRadius:7, background:panel2, color:mute, border:`1px solid ${line}`, fontWeight:600 },
  empty: { textAlign:"center", color:mute, fontSize:13.5, padding:"26px 10px" },
  err: { maxWidth:780, margin:"14px auto 0", background:"#3A1620", color:"#F2929F", padding:"11px 15px", borderRadius:10, fontSize:13 },
};
