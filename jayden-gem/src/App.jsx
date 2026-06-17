import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

// ── Protected English terms — never translate ──
const PROTECTED = [
  'Meme','Ridiculous','Everyday Wear','Smart Budget','Pinterest','Red Carpet',
  'Real Life','Push-back','Screw-back','Custom','Hype','Hook','B-Roll','CTA',
  'Toi et Moi','Statement Ring','Premium Look','Quiet luxury','Double-Prong',
  'Hook','Script','Trend','Analytics','Content','Brand Bible'
]

const CREW = {
  robin:  { name: 'Nico Robin',  role: 'Trend Researcher',    color: 'var(--purple)',   glow: 'var(--purple-glow)',  emoji: '📚' },
  usopp:  { name: 'Usopp',       role: 'Script Writer',       color: 'var(--ruby)',     glow: 'var(--ruby-glow)',    emoji: '✍️' },
  nami:   { name: 'Nami',        role: 'Analytics Analyst',   color: 'var(--emerald)',  glow: 'var(--emerald-glow)', emoji: '📊' },
  luffy:  { name: 'Luffy',       role: 'Creative Director',   color: 'var(--gold)',     glow: 'var(--gold-glow)',    emoji: '👑' },
  franky: { name: 'Franky',      role: 'Export & Logger',     color: 'var(--sapphire)', glow: 'var(--sapphire-glow)',emoji: '⚙️' },
}

const TABS = ['Studio', 'Ideas', 'Scripts', 'Analytics', 'Calendar', 'Strategy', 'Chat', 'Bible']

const API_KEY  = import.meta.env.VITE_ANTHROPIC_KEY
const SUPA_URL = import.meta.env.VITE_SUPABASE_URL

// ── API call helper ──
async function askCrew(member, prompt, bible = '') {
  const m = CREW[member]
  const sys = `You are ${m.name}, ${m.role} for Jayden — a Burmese jewelry & gemology TikTok creator.
Respond in natural conversational Burmese. Never mix English unnecessarily.
Do NOT use any One Piece references, sailing language, or crew jargon in your actual advice.
Protected English terms (keep verbatim, uppercase): ${PROTECTED.join(', ')}.
${bible ? 'Brand Bible context:\n' + bible : ''}
Be direct, warm, and practical. Keep responses under 300 words.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system: sys, messages: [{ role: 'user', content: prompt }] })
  })
  const data = await res.json()
  return data.content?.[0]?.text || 'Error — check API key in Vercel env vars.'
}

// ── Supabase helpers ──
async function dbGet(table) {
  if (!SUPA_URL) return []
  const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false })
  return data || []
}
async function dbInsert(table, row) {
  if (!SUPA_URL) return null
  const { data } = await supabase.from(table).insert(row).select().single()
  return data
}
async function dbDelete(table, id) {
  if (!SUPA_URL) return
  await supabase.from(table).delete().eq('id', id)
}
async function dbUpdate(table, id, updates) {
  if (!SUPA_URL) return
  await supabase.from(table).update(updates).eq('id', id)
}

// ── Spinner ──
const Spin = () => (
  <span style={{ display:'inline-block', width:16, height:16, border:'2px solid #fff3', borderTop:'2px solid #fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
)

// ════════════════════════════════════════════
//  STUDIO TAB
// ════════════════════════════════════════════
function StudioTab({ bible }) {
  const [topic, setTopic]       = useState('')
  const [stage, setStage]       = useState('idle') // idle | research | debate | script | done
  const [research, setResearch] = useState('')
  const [debate, setDebate]     = useState([])
  const [script, setScript]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [userJump, setUserJump] = useState('')

  async function startResearch() {
    if (!topic.trim()) return
    setLoading(true); setStage('research'); setDebate([]); setScript('')
    const r = await askCrew('robin', `Research this jewelry/celebrity topic for a TikTok video: "${topic}". Give 5 key interesting facts or angles. Focus on what would shock or excite a Myanmar female audience aged 18-34.`, bible)
    setResearch(r); setLoading(false)
  }

  async function startDebate() {
    setLoading(true); setStage('debate')
    const rounds = []
    // Round 1: Luffy direction
    const r1 = await askCrew('luffy', `Topic: "${topic}". Research: ${research}. Give your creative direction — what angle makes this video unmissable?`, bible)
    rounds.push({ member: 'luffy', text: r1 })
    // Round 2: Usopp pushback
    const r2 = await askCrew('usopp', `Luffy suggested: "${r1}". Topic: "${topic}". As script writer, give your honest reaction. What works, what doesn't? Suggest a Hook.`, bible)
    rounds.push({ member: 'usopp', text: r2 })
    setDebate(rounds); setLoading(false); setStage('debate-jump')
  }

  async function continueDebate() {
    setLoading(true); setStage('debate')
    const rounds = [...debate]
    // Round 3: Nami data angle
    const r3 = await askCrew('nami', `Topic: "${topic}". Debate so far: ${rounds.map(r=>r.text).join(' | ')}. User input: "${userJump}". What does the data say? What performs best for this type of content?`, bible)
    rounds.push({ member: 'nami', text: r3 })
    // Final verdict: Luffy
    const r4 = await askCrew('luffy', `Final verdict for "${topic}". All inputs: ${rounds.map(r=>r.text).join(' | ')}. Give the final creative direction in 3 bullet points.`, bible)
    rounds.push({ member: 'luffy', text: r4 })
    setDebate(rounds); setLoading(false); setStage('verdict')
  }

  async function writeScript() {
    setLoading(true); setStage('script')
    const verdict = debate[debate.length-1]?.text || ''
    const s = await askCrew('usopp', `Write a complete TikTok script for "${topic}". Direction: ${verdict}. Format: Hook (first 3 seconds) → Body (facts, story) → CTA. Write in natural Burmese. Make it feel like Jayden is talking directly to a friend.`, bible)
    setScript(s); setLoading(false); setStage('done')
  }

  async function saveScript() {
    await dbInsert('scripts', { topic, content: script, created_at: new Date().toISOString() })
    alert('Script saved to My Scripts!')
  }

  const m = (key) => CREW[key]

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>💡 Content Studio</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Celebrity + one jewelry piece → full script</p>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Jisoo's Met Gala necklace" onKeyDown={e=>e.key==='Enter'&&startResearch()} />
        <button style={{...styles.btn, background:'var(--purple)', minWidth:100}} onClick={startResearch} disabled={loading}>
          {loading && stage==='research' ? <Spin/> : 'Research'}
        </button>
      </div>

      {research && (
        <div style={styles.card}>
          <div style={styles.crewHeader(m('robin').color)}>
            {m('robin').emoji} {m('robin').name} — {m('robin').role}
          </div>
          <p style={{ whiteSpace:'pre-wrap' }}>{research}</p>
          {stage==='research' && (
            <button style={{...styles.btn, background:'var(--gold)', marginTop:14}} onClick={startDebate} disabled={loading}>
              {loading ? <Spin/> : '⚔️ Start Crew Debate'}
            </button>
          )}
        </div>
      )}

      {debate.map((d,i) => (
        <div key={i} style={styles.card}>
          <div style={styles.crewHeader(CREW[d.member].color)}>
            {CREW[d.member].emoji} {CREW[d.member].name}
          </div>
          <p style={{ whiteSpace:'pre-wrap' }}>{d.text}</p>
        </div>
      ))}

      {stage==='debate-jump' && (
        <div style={styles.card}>
          <div style={styles.crewHeader('var(--gold)')}>👤 Your input (optional)</div>
          <textarea value={userJump} onChange={e=>setUserJump(e.target.value)} placeholder="Add your thoughts before Nami & Luffy finish..." style={{ marginBottom:10 }} />
          <button style={{...styles.btn, background:'var(--emerald)'}} onClick={continueDebate} disabled={loading}>
            {loading ? <Spin/> : '📊 Get Final Verdict'}
          </button>
        </div>
      )}

      {stage==='verdict' && (
        <button style={{...styles.btn, background:'var(--ruby)', marginTop:10}} onClick={writeScript} disabled={loading}>
          {loading ? <Spin/> : '✍️ Write Full Script'}
        </button>
      )}

      {script && (
        <div style={styles.card}>
          <div style={styles.crewHeader(m('usopp').color)}>
            {m('usopp').emoji} {m('usopp').name} — Final Script
          </div>
          <p style={{ whiteSpace:'pre-wrap' }}>{script}</p>
          <button style={{...styles.btn, background:'var(--gold)', marginTop:14}} onClick={saveScript}>
            💾 Save to My Scripts
          </button>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════
//  IDEAS TAB
// ════════════════════════════════════════════
function IdeasTab() {
  const [ideas, setIdeas]   = useState([])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { dbGet('ideas').then(setIdeas) }, [])

  async function addIdea() {
    if (!input.trim()) return
    const row = await dbInsert('ideas', { title: input, created_at: new Date().toISOString() })
    if (row) setIdeas(prev => [row, ...prev])
    else setIdeas(prev => [{ id: Date.now(), title: input, created_at: new Date().toISOString() }, ...prev])
    setInput('')
  }

  async function removeIdea(id) {
    await dbDelete('ideas', id)
    setIdeas(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>💭 Ideas Board</h2>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="New video idea..." onKeyDown={e=>e.key==='Enter'&&addIdea()} />
        <button style={{...styles.btn, background:'var(--purple)', minWidth:80}} onClick={addIdea}>Add</button>
      </div>
      {ideas.length === 0 && <p style={{ color:'var(--muted)' }}>No ideas yet. Add your first one!</p>}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {ideas.map(idea => (
          <div key={idea.id} style={{ ...styles.card, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>{idea.title}</span>
            <button onClick={() => removeIdea(idea.id)} style={{ background:'none', color:'var(--muted)', fontSize:18, padding:'0 6px' }}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
//  SCRIPTS TAB
// ════════════════════════════════════════════
function ScriptsTab() {
  const [scripts, setScripts] = useState([])
  const [open, setOpen]       = useState(null)

  useEffect(() => { dbGet('scripts').then(setScripts) }, [])

  async function remove(id) {
    await dbDelete('scripts', id)
    setScripts(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>📜 My Scripts</h2>
      {scripts.length === 0 && <p style={{ color:'var(--muted)' }}>No saved scripts yet. Finish a Studio session to save one!</p>}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {scripts.map(s => (
          <div key={s.id} style={styles.card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: open===s.id ? 12 : 0 }}>
              <strong onClick={() => setOpen(open===s.id ? null : s.id)} style={{ cursor:'pointer' }}>
                {open===s.id ? '▼' : '▶'} {s.topic}
              </strong>
              <button onClick={() => remove(s.id)} style={{ background:'none', color:'var(--muted)', fontSize:18 }}>×</button>
            </div>
            {open===s.id && <p style={{ whiteSpace:'pre-wrap', marginTop:8 }}>{s.content}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
//  ANALYTICS TAB
// ════════════════════════════════════════════
function AnalyticsTab({ bible }) {
  const [input, setInput]   = useState('')
  const [reply, setReply]   = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs]     = useState([])

  useEffect(() => { dbGet('analytics').then(setLogs) }, [])

  const PRESETS = [
    'Jisoo Met Gala — 804K views, 2,108 followers gained',
    'J.Lo rings — 554K views, 2,126 shares',
    'Megan Fox — 65,655 views in 3 days, 148 saves',
  ]

  async function analyze() {
    if (!input.trim()) return
    setLoading(true)
    const r = await askCrew('nami', `Analyze these video stats and give me 3 specific improvement tips: ${input}`, bible)
    setReply(r)
    const row = await dbInsert('analytics', { stats: input, analysis: r, created_at: new Date().toISOString() })
    if (row) setLogs(prev => [row, ...prev])
    setLoading(false)
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>📊 Analytics</h2>
      <div style={styles.crewHeader(CREW.nami.color)} >{CREW.nami.emoji} Nami — Stats Analyst</div>

      <p style={{ color:'var(--muted)', margin:'10px 0' }}>Paste your video stats or pick a preset:</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:12 }}>
        {PRESETS.map(p => (
          <button key={p} onClick={() => setInput(p)} style={{ ...styles.btn, background:'var(--surface)', border:'1px solid var(--border)', fontSize:12 }}>
            {p.split('—')[0].trim()}
          </button>
        ))}
      </div>

      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g. Video: Taylor Swift ring — 120K views, 800 likes, 45 comments, 12s avg watch time, 3% follow rate" style={{ marginBottom:10 }} />
      <button style={{...styles.btn, background:'var(--emerald)'}} onClick={analyze} disabled={loading}>
        {loading ? <Spin/> : '📊 Analyze'}
      </button>

      {reply && (
        <div style={{ ...styles.card, marginTop:16 }}>
          <p style={{ whiteSpace:'pre-wrap' }}>{reply}</p>
        </div>
      )}

      {logs.length > 0 && (
        <>
          <h3 style={{ margin:'20px 0 10px', color:'var(--muted)' }}>Past analyses</h3>
          {logs.map(l => (
            <div key={l.id} style={{ ...styles.card, fontSize:13, color:'var(--muted)' }}>
              <strong style={{ color:'var(--text)' }}>{l.stats}</strong>
              <p style={{ marginTop:6, whiteSpace:'pre-wrap' }}>{l.analysis}</p>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ════════════════════════════════════════════
//  CALENDAR TAB
// ════════════════════════════════════════════
function CalendarTab() {
  const DAYS = ['Wed','Thu','Fri','Sat','Sun','Mon','Tue']
  const [posts, setPosts]   = useState([])
  const [form, setForm]     = useState({ day:'Wed', topic:'', note:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { dbGet('calendar_posts').then(setPosts) }, [])

  async function addPost() {
    if (!form.topic.trim()) return
    const row = await dbInsert('calendar_posts', { ...form, created_at: new Date().toISOString() })
    if (row) setPosts(prev => [row, ...prev])
    else setPosts(prev => [{ id: Date.now(), ...form }, ...prev])
    setForm({ day:'Wed', topic:'', note:'' })
  }

  async function removePost(id) {
    await dbDelete('calendar_posts', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>📅 Content Calendar</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:20 }}>
        {DAYS.map(d => (
          <div key={d} style={{ ...styles.card, padding:8, textAlign:'center' }}>
            <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4 }}>{d}</div>
            {posts.filter(p=>p.day===d).map(p => (
              <div key={p.id} style={{ fontSize:11, background:'var(--ruby)', borderRadius:4, padding:'2px 4px', marginBottom:2, cursor:'pointer' }} onClick={() => removePost(p.id)}>
                {p.topic}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ ...styles.card }}>
        <h3 style={{ marginBottom:12, color:'var(--gold)' }}>Add post</h3>
        <select value={form.day} onChange={e=>setForm({...form,day:e.target.value})} style={{ marginBottom:8 }}>
          {DAYS.map(d=><option key={d}>{d}</option>)}
        </select>
        <input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="Topic / celebrity" style={{ marginBottom:8 }} />
        <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Note (optional)" style={{ marginBottom:10 }} />
        <button style={{...styles.btn, background:'var(--gold)', color:'#000'}} onClick={addPost}>Add to Calendar</button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
//  STRATEGY TAB
// ════════════════════════════════════════════
function StrategyTab({ bible }) {
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState('')

  async function getStrategy() {
    setLoading(true)
    const r = await askCrew('luffy',
      `Give Jayden a concrete weekly content strategy for his jewelry TikTok channel. Include: best posting days/times for Myanmar audience, content mix (celebrity vs educational vs personal), Hook formulas that work, engagement tips. Be specific and actionable.`,
      bible)
    setStrategy(r)
    setLoading(false)
  }

  const STATS = [
    { label: 'Primary audience', value: 'Female, 18–34, Myanmar' },
    { label: 'Peak activity',    value: 'Late night' },
    { label: 'Best performers',  value: 'Angelina Jolie, Hailey Bieber, Ronaldo vs Taylor' },
    { label: 'Best watch time',  value: '"Am I copying Jimmy?" — 19.9s avg' },
    { label: 'Top video',        value: 'Jisoo Met Gala — 804K views' },
  ]

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>🗺 Grand Strategy</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        {STATS.map(s => (
          <div key={s.label} style={styles.card}>
            <div style={{ color:'var(--muted)', fontSize:12 }}>{s.label}</div>
            <div style={{ fontWeight:600 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <button style={{...styles.btn, background:'var(--gold)', color:'#000', marginBottom:16}} onClick={getStrategy} disabled={loading}>
        {loading ? <Spin/> : '👑 Get Strategy from Luffy'}
      </button>
      {strategy && (
        <div style={styles.card}>
          <div style={styles.crewHeader(CREW.luffy.color)}>{CREW.luffy.emoji} {CREW.luffy.name}</div>
          <p style={{ whiteSpace:'pre-wrap', marginTop:8 }}>{strategy}</p>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════
//  CREW CHAT TAB
// ════════════════════════════════════════════
function ChatTab({ bible }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [member, setMember]     = useState('luffy')
  const [loading, setLoading]   = useState(false)
  const bottomRef               = useRef(null)

  useEffect(() => { dbGet('crew_chat').then(m => setMessages(m.reverse())) }, [])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function send() {
    if (!input.trim()) return
    const userMsg = { role:'user', text: input, member: null }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    const r = await askCrew(member, input, bible)
    const botMsg = { role:'bot', text: r, member }
    setMessages(prev => [...prev, botMsg])
    await dbInsert('crew_chat', { role:'bot', text: r, member, created_at: new Date().toISOString() })
    setLoading(false)
  }

  return (
    <div style={{ ...styles.panel, display:'flex', flexDirection:'column', height:'70vh' }}>
      <h2 style={styles.panelTitle}>💬 Crew Chat</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {Object.entries(CREW).map(([k,v]) => (
          <button key={k} onClick={() => setMember(k)} style={{ ...styles.btn, background: member===k ? v.color : 'var(--surface)', border: `1px solid ${v.color}`, fontSize:12 }}>
            {v.emoji} {v.name.split(' ')[0]}
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
        {messages.map((m,i) => (
          <div key={i} style={{ alignSelf: m.role==='user' ? 'flex-end' : 'flex-start', maxWidth:'80%' }}>
            {m.role==='bot' && <div style={{ fontSize:11, color: CREW[m.member]?.glow, marginBottom:3 }}>{CREW[m.member]?.emoji} {CREW[m.member]?.name}</div>}
            <div style={{ background: m.role==='user' ? 'var(--ruby)' : 'var(--surface)', border: m.role==='bot' ? `1px solid ${CREW[m.member]?.color||'var(--border)'}` : 'none', borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding:'10px 14px', fontSize:14, whiteSpace:'pre-wrap' }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ alignSelf:'flex-start' }}><Spin /></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder={`Chat with ${CREW[member].name}...`} onKeyDown={e=>e.key==='Enter'&&!loading&&send()} />
        <button style={{...styles.btn, background:'var(--ruby)', minWidth:70}} onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
//  BRAND BIBLE TAB
// ════════════════════════════════════════════
function BibleTab({ bible, setBible }) {
  const [local, setLocal] = useState(bible)
  const [saved, setSaved] = useState(false)

  async function save() {
    setBible(local)
    await dbInsert('brand_bible', { content: local, created_at: new Date().toISOString() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const DEFAULT = `Jayden Gem — Brand Bible

Voice: Natural, warm, confident. Talk like a friend who knows jewelry.
Language: Burmese. No unnecessary English mixing.
Style: Personal opinions welcome. Never lecture-style.
Audience: Myanmar females 18–34, late night viewers.
Formula: 1 celebrity + 1 jewelry piece + price shock or surprising fact → story → opinion → CTA.
Top formats: Celebrity spotlight, VS comparison, countdown ranking, personal story.
Avoid: One Piece language, formal tone, overly long intros.`

  return (
    <div style={styles.panel}>
      <h2 style={styles.panelTitle}>📖 Brand Bible</h2>
      <p style={{ color:'var(--muted)', marginBottom:12 }}>This context is passed to all crew members when they generate content.</p>
      {!local && <button style={{...styles.btn, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:10}} onClick={() => setLocal(DEFAULT)}>Load default template</button>}
      <textarea value={local} onChange={e=>setLocal(e.target.value)} style={{ minHeight:300, marginBottom:10 }} placeholder="Write your brand guidelines here..." />
      <button style={{...styles.btn, background: saved ? 'var(--emerald)' : 'var(--gold)', color:'#000'}} onClick={save}>
        {saved ? '✓ Saved!' : '💾 Save Bible'}
      </button>
    </div>
  )
}

// ════════════════════════════════════════════
//  STYLES
// ════════════════════════════════════════════
const styles = {
  panel: { padding: '24px 20px', maxWidth: 800, margin: '0 auto' },
  panelTitle: { fontSize: 22, fontWeight: 700, marginBottom: 6, fontFamily: "'Cinzel', serif", color: 'var(--gold)' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 0 },
  crewHeader: (color) => ({ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, color, marginBottom:8, paddingBottom:8, borderBottom:'1px solid var(--border)' }),
  btn: { padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 14, color: '#fff', transition: 'opacity 0.2s', display:'flex', alignItems:'center', gap:6 },
}

// ════════════════════════════════════════════
//  ROOT APP
// ════════════════════════════════════════════
export default function App() {
  const [tab, setTab]     = useState('Studio')
  const [bible, setBible] = useState('')

  useEffect(() => {
    dbGet('brand_bible').then(rows => {
      if (rows[0]) setBible(rows[0].content)
    })
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Header */}
      <header style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'14px 20px', display:'flex', alignItems:'center', gap:16 }}>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:700, color:'var(--gold)', letterSpacing:1 }}>💎 JAYDEN GEM</span>
        <span style={{ color:'var(--muted)', fontSize:13 }}>AI Marketing Crew</span>
      </header>

      {/* Nav */}
      <nav style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', display:'flex', gap:2, overflowX:'auto', padding:'0 12px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'12px 16px', background:'none', color: tab===t ? 'var(--gold)' : 'var(--muted)',
            borderBottom: tab===t ? '2px solid var(--gold)' : '2px solid transparent',
            fontWeight: tab===t ? 600 : 400, fontSize:14, whiteSpace:'nowrap', transition:'color 0.2s'
          }}>
            {t}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main>
        {tab === 'Studio'    && <StudioTab bible={bible} />}
        {tab === 'Ideas'     && <IdeasTab />}
        {tab === 'Scripts'   && <ScriptsTab />}
        {tab === 'Analytics' && <AnalyticsTab bible={bible} />}
        {tab === 'Calendar'  && <CalendarTab />}
        {tab === 'Strategy'  && <StrategyTab bible={bible} />}
        {tab === 'Chat'      && <ChatTab bible={bible} />}
        {tab === 'Bible'     && <BibleTab bible={bible} setBible={setBible} />}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover { opacity: 0.85; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
