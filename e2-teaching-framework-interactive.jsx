import React, { useState, useEffect } from 'react';

// E² Teaching Framework — Interactive Tool
// Every Student Has the Right to Understand
// Warm earthy palette: terracotta, dusty rose, soft sand

const COLORS = {
  terra: '#C1694F',
  clay: '#B7553B',
  rose: '#C9918F',
  sand: '#FAF0E6',
  gold: '#D4A843',
  brown: '#3D2B1F',
  cream: '#FFF8F0',
  peach: '#FFDAB9',
};

const MANIFESTO = [
  { n: '1', text: 'Every student has the right to understand.' },
  { n: '2', text: 'It is NEVER the student\'s problem — the teacher adapts first.' },
  { n: '3', text: 'Struggle is a signal, not a verdict.' },
  { n: '4', text: 'The teacher adapts materials and methods.' },
  { n: '5', text: 'No student is unteachable.' },
  { n: '6', text: 'Understanding is every student\'s birthright.' },
];

const PILLARS = [
  {
    id: 'p1',
    title: 'Pillar 1 — Lesson Design',
    subtitle: 'The 5-Part Blueprint',
    items: [
      { h: 'Hook (2 min)', d: 'Mystery question, surprising fact, video, real-world problem' },
      { h: 'Teach (10-15 min)', d: 'Chunked content, visuals, think-aloud modeling' },
      { h: 'Practice (15-20 min)', d: 'Guided then independent, partner work, hands-on' },
      { h: 'Connect (5 min)', d: 'Real-world relevance, cross-curricular links' },
      { h: 'Reflect (5 min)', d: 'Exit tickets, journals, 3-2-1 summary' },
      { h: 'Scaffolding', d: 'Break into steps, sentence starters, I Do/We Do/You Do' },
    ],
  },
  {
    id: 'p2',
    title: 'Pillar 2 — Differentiated Instruction',
    subtitle: 'Reaching Every Learner',
    items: [
      { h: 'Auditory', d: 'Discussions, read-alouds, songs, podcasts' },
      { h: 'Visual', d: 'Diagrams, color-coding, videos, mind maps' },
      { h: 'Kinesthetic', d: 'Hands-on, movement breaks, manipulatives, role-play' },
      { h: 'Tiered Tasks', d: 'Struggling / on-level / advanced versions' },
      { h: 'Cultural Sensitivity', d: 'Diverse examples, honor home languages' },
      { h: 'Student Choice', d: 'Menu boards, choice in how to demonstrate learning' },
    ],
  },
  {
    id: 'p3',
    title: 'Pillar 3 — Engagement & Motivation',
    subtitle: 'The 6 Levers',
    items: [
      { h: '1. Curiosity', d: 'Mysteries, "What if...?" questions' },
      { h: '2. Active Participation', d: 'Think-pair-share, mini whiteboards, polls' },
      { h: '3. Purpose', d: 'Explain the "why", connect to student goals' },
      { h: '4. Feedback', d: 'Immediate, specific, growth-oriented' },
      { h: '5. Gamification', d: 'Points, badges, challenges' },
      { h: '6. Routine & Novelty', d: 'Predictable structure + surprising elements' },
    ],
  },
  {
    id: 'p4',
    title: 'Pillar 4 — Classroom Culture',
    subtitle: 'Safe Learning Space',
    items: [
      { h: 'Relationships', d: 'Learn names fast, 2x10 strategy, greet at door' },
      { h: 'Co-Created Norms', d: 'Involve students, revisit regularly' },
      { h: 'Restorative Discipline', d: 'Repair over punishment, reflection circles' },
      { h: 'Physical Environment', d: 'Flexible seating, welcoming, organized' },
    ],
  },
];

const CHECKLIST = {
  p1: [
    'I start lessons with an engaging hook',
    'I chunk content into digestible parts',
    'I include guided AND independent practice',
    'I connect lessons to real life',
    'I end with reflection or exit tickets',
    'I scaffold complex tasks',
  ],
  p2: [
    'I address auditory learners',
    'I include visual supports',
    'I incorporate movement/hands-on',
    'I provide tiered support for struggling learners',
    'I challenge advanced learners',
    'I honor cultural diversity',
    'I offer student choice',
  ],
  p3: [
    'I spark curiosity',
    'ALL students participate actively',
    'I explain WHY this matters',
    'I give immediate, specific feedback',
    'I use gamification or rewards',
    'I balance routine with novelty',
  ],
  p4: [
    'I connect personally with students daily',
    'I reinforce co-created norms',
    'I use restorative practices over punishment',
    'My environment is welcoming and organized',
  ],
};

const BP_COLS = [
  { key: 'theme', label: 'Theme' },
  { key: 'obj1', label: 'Lesson 1 Objective' },
  { key: 'obj2', label: 'Lesson 2 Objective' },
  { key: 'links', label: 'Lesson Links' },
  { key: 'nearpod', label: 'Nearpod Version Links' },
  { key: 'flip', label: 'Flip Video' },
  { key: 'classwork', label: 'Classwork' },
  { key: 'homework', label: 'Homework' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'revised', label: 'Revised HW/CW/Quiz (Teacher Revision)' },
  { key: 'guide', label: 'Teachers Guide/Resources Per Unit' },
  { key: 'comments', label: 'Comments for Revised Comments' },
];

const emptyWeek = () => BP_COLS.reduce((a, c) => ({ ...a, [c.key]: '' }), {});

const LESSON_FIELDS = [
  { key: 'subject', label: 'Subject', placeholder: 'e.g., Mathematics' },
  { key: 'grade', label: 'Grade Level', placeholder: 'e.g., Grade 5' },
  { key: 'topic', label: 'Topic / Unit', placeholder: 'e.g., Fractions' },
  { key: 'duration', label: 'Duration', placeholder: 'e.g., 45 min' },
];

const BLUEPRINT_FIELDS = [
  { key: 'hook', label: 'Hook', hint: 'How will you grab attention?' },
  { key: 'teach', label: 'Teach', hint: 'How will you deliver content?' },
  { key: 'practice', label: 'Practice', hint: 'What will students do?' },
  { key: 'connect', label: 'Connect', hint: 'Real-world relevance?' },
  { key: 'reflect', label: 'Reflect', hint: 'How will they show understanding?' },
];

const DIFF_FIELDS = [
  { key: 'auditory', label: 'Auditory Strategies' },
  { key: 'visual', label: 'Visual Strategies' },
  { key: 'kinesthetic', label: 'Kinesthetic Strategies' },
  { key: 'struggling', label: 'Support for Struggling Learners' },
  { key: 'advanced', label: 'Extension for Advanced Learners' },
  { key: 'cultural', label: 'Cultural Connections' },
];

const ENG_FIELDS = [
  { key: 'curiosity', label: 'Curiosity' },
  { key: 'participation', label: 'Active Participation' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'gamification', label: 'Gamification' },
  { key: 'routine', label: 'Routine & Novelty' },
];

export default function E2TeachingFramework() {
  const [activeTab, setActiveTab] = useState('belief');
  const [lessonPlan, setLessonPlan] = useState({});
  const [blueprintWeeks, setBlueprintWeeks] = useState(() => Array.from({ length: 8 }, emptyWeek));
  const [checklist, setChecklist] = useState({});
  const [expandedPillar, setExpandedPillar] = useState('p1');

  useEffect(() => {
    try {
      const lp = localStorage.getItem('e2_react_lp');
      if (lp) setLessonPlan(JSON.parse(lp));
      const bp = localStorage.getItem('e2_react_bp');
      if (bp) setBlueprintWeeks(JSON.parse(bp));
      const ch = localStorage.getItem('e2_react_chk');
      if (ch) setChecklist(JSON.parse(ch));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('e2_react_lp', JSON.stringify(lessonPlan)); } catch (e) {}
  }, [lessonPlan]);

  useEffect(() => {
    try { localStorage.setItem('e2_react_bp', JSON.stringify(blueprintWeeks)); } catch (e) {}
  }, [blueprintWeeks]);

  useEffect(() => {
    try { localStorage.setItem('e2_react_chk', JSON.stringify(checklist)); } catch (e) {}
  }, [checklist]);

  const updateLP = (key, val) => setLessonPlan((p) => ({ ...p, [key]: val }));
  const updateWeek = (i, key, val) => {
    setBlueprintWeeks((weeks) => weeks.map((w, idx) => (idx === i ? { ...w, [key]: val } : w)));
  };
  const addWeek = () => setBlueprintWeeks((w) => [...w, emptyWeek()]);
  const removeWeek = () => setBlueprintWeeks((w) => (w.length > 1 ? w.slice(0, -1) : w));
  const toggleCheck = (id) => setChecklist((c) => ({ ...c, [id]: !c[id] }));

  const pillarProgress = (p) => {
    const items = CHECKLIST[p];
    const checked = items.filter((_, i) => checklist[`${p}_${i}`]).length;
    return Math.round((checked / items.length) * 100);
  };

  const totalProgress = () => {
    const all = Object.keys(CHECKLIST).flatMap((p) => CHECKLIST[p].map((_, i) => `${p}_${i}`));
    const c = all.filter((k) => checklist[k]).length;
    return Math.round((c / all.length) * 100);
  };

  const exportLessonPlan = () => {
    let t = 'E² LESSON PLAN\n' + '='.repeat(40) + '\n\n';
    Object.keys(lessonPlan).forEach((k) => {
      if (lessonPlan[k]) t += `${k.toUpperCase()}: ${lessonPlan[k]}\n\n`;
    });
    t += '\n---\nE² Teaching Framework — Every Student Has the Right to Understand';
    try {
      navigator.clipboard.writeText(t);
      alert('Lesson plan copied to clipboard!');
    } catch (e) {
      const w = window.open('', '_blank');
      if (w) w.document.write('<pre>' + t + '</pre>');
    }
  };

  const exportBlueprintCSV = () => {
    let csv = '\uFEFFWeek,' + BP_COLS.map((c) => `"${c.label}"`).join(',') + '\n';
    blueprintWeeks.forEach((w, i) => {
      csv += (i + 1) + ',' + BP_COLS.map((c) => `"${(w[c.key] || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'e2_blueprint.csv';
    a.click();
  };

  return (
    <div style={styles.app}>
      <header style={styles.hero}>
        <div style={styles.badge}>E² Teaching Framework</div>
        <h1 style={styles.h1}>Every Student Has the Right to Understand</h1>
        <p style={styles.subtitle}>Your complete teaching companion</p>
      </header>

      <nav style={styles.nav}>
        {[
          { id: 'belief', label: 'Our Belief' },
          { id: 'planner', label: 'Lesson Planner' },
          { id: 'blueprint', label: 'Blueprint / LMS' },
          { id: 'framework', label: 'Framework' },
          { id: 'checklist', label: 'Checklist' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.navBtn,
              ...(activeTab === tab.id ? styles.navBtnActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {activeTab === 'belief' && (
          <section>
            <div style={styles.manifesto}>
              <h2 style={styles.manifestoTitle}>Our Belief</h2>
              <div style={styles.mfGrid}>
                {MANIFESTO.map((m) => (
                  <div key={m.n} style={styles.mfItem}>
                    <strong style={{ color: COLORS.clay }}>{m.n}.</strong> {m.text}
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardH2}>Welcome</h2>
              <p style={{ fontSize: '.9rem' }}>
                This interactive tool has everything you need to plan lessons, build term blueprints,
                reference the 4 pillars, and track your growth — all grounded in the belief that every
                student deserves to understand.
              </p>
              <div style={styles.quickGrid}>
                {[
                  { id: 'planner', icon: '📝', h: 'Lesson Planner', p: 'Build complete lessons' },
                  { id: 'blueprint', icon: '📅', h: 'Blueprint', p: 'Plan your whole term' },
                  { id: 'framework', icon: '🎓', h: 'Framework', p: 'Reference the 4 pillars' },
                  { id: 'checklist', icon: '✅', h: 'Checklist', p: 'Track your practice' },
                ].map((q) => (
                  <div key={q.id} style={styles.quickCard} onClick={() => setActiveTab(q.id)}>
                    <div style={{ fontSize: '1.8rem' }}>{q.icon}</div>
                    <h4 style={{ color: COLORS.terra, fontSize: '.9rem', margin: '6px 0 4px' }}>{q.h}</h4>
                    <p style={{ fontSize: '.78rem', color: '#7a5f52' }}>{q.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'planner' && (
          <section>
            <div style={styles.card}>
              <h2 style={styles.cardH2}>Lesson Information</h2>
              <div style={styles.row2}>
                {LESSON_FIELDS.map((f) => (
                  <div key={f.key} style={styles.field}>
                    <label style={styles.label}>{f.label}</label>
                    <input
                      type="text"
                      value={lessonPlan[f.key] || ''}
                      onChange={(e) => updateLP(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={styles.input}
                    />
                  </div>
                ))}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Learning Objectives</label>
                <textarea
                  value={lessonPlan.objectives || ''}
                  onChange={(e) => updateLP('objectives', e.target.value)}
                  placeholder="SWBAT..."
                  style={styles.textarea}
                />
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardH2}>5-Part Blueprint (Pillar 1)</h2>
              {BLUEPRINT_FIELDS.map((f) => (
                <div key={f.key} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <div style={styles.hint}>{f.hint}</div>
                  <textarea
                    value={lessonPlan[f.key] || ''}
                    onChange={(e) => updateLP(f.key, e.target.value)}
                    style={styles.textarea}
                  />
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardH2}>Differentiation (Pillar 2)</h2>
              {DIFF_FIELDS.map((f) => (
                <div key={f.key} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <textarea
                    value={lessonPlan[f.key] || ''}
                    onChange={(e) => updateLP(f.key, e.target.value)}
                    style={styles.textarea}
                  />
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardH2}>Engagement — 6 Levers (Pillar 3)</h2>
              {ENG_FIELDS.map((f) => (
                <div key={f.key} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <textarea
                    value={lessonPlan[f.key] || ''}
                    onChange={(e) => updateLP(f.key, e.target.value)}
                    style={styles.textarea}
                  />
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardH2}>Classroom Culture (Pillar 4)</h2>
              <div style={styles.field}>
                <label style={styles.label}>Relationship Moment</label>
                <textarea
                  value={lessonPlan.relationship || ''}
                  onChange={(e) => updateLP('relationship', e.target.value)}
                  style={styles.textarea}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Norms Reinforcement</label>
                <textarea
                  value={lessonPlan.norms || ''}
                  onChange={(e) => updateLP('norms', e.target.value)}
                  style={styles.textarea}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Restorative Approach</label>
                <textarea
                  value={lessonPlan.restorative || ''}
                  onChange={(e) => updateLP('restorative', e.target.value)}
                  style={styles.textarea}
                />
              </div>
              <button onClick={exportLessonPlan} style={styles.btnPrimary}>
                Copy Lesson Plan as Text
              </button>
            </div>
          </section>
        )}

        {activeTab === 'blueprint' && (
          <section>
            <div style={styles.card}>
              <h2 style={styles.cardH2}>Weekly Blueprint / LMS Planner</h2>
              <p style={{ fontSize: '.88rem', color: COLORS.rose, marginBottom: 12 }}>
                Plan your entire term — each row is a week with all the details you need.
              </p>
              <div style={styles.btnRow}>
                <button onClick={addWeek} style={styles.btnPrimary}>+ Add Week</button>
                <button onClick={removeWeek} style={styles.btnOutline}>- Remove Last</button>
                <button onClick={exportBlueprintCSV} style={styles.btnSecondary}>Export CSV</button>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.bpTable}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, ...styles.thSticky }}>Week</th>
                      {BP_COLS.map((c) => (
                        <th key={c.key} style={styles.th}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {blueprintWeeks.map((w, i) => (
                      <tr key={i}>
                        <td style={{ ...styles.td, ...styles.tdWeek }}>{i + 1}</td>
                        {BP_COLS.map((c) => (
                          <td key={c.key} style={styles.td}>
                            <textarea
                              value={w[c.key] || ''}
                              onChange={(e) => updateWeek(i, c.key, e.target.value)}
                              style={styles.cellArea}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'framework' && (
          <section>
            {PILLARS.map((p) => (
              <div key={p.id} style={styles.pillar}>
                <div
                  style={styles.pillarHead}
                  onClick={() => setExpandedPillar(expandedPillar === p.id ? null : p.id)}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontFamily: 'Playfair Display, serif', margin: 0 }}>{p.title}</h3>
                    <div style={{ fontSize: '.78rem', opacity: 0.85 }}>{p.subtitle}</div>
                  </div>
                  <span style={{ fontSize: '1.2rem' }}>{expandedPillar === p.id ? '−' : '+'}</span>
                </div>
                {expandedPillar === p.id && (
                  <div style={styles.pillarBody}>
                    {p.items.map((it, i) => (
                      <div key={i} style={styles.pillarItem}>
                        <strong style={{ color: COLORS.clay }}>{it.h}:</strong> {it.d}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {activeTab === 'checklist' && (
          <section>
            <div style={styles.card}>
              <h2 style={styles.cardH2}>Implementation Checklist</h2>
              <div style={styles.progRow}>
                <strong style={{ fontSize: '.82rem', color: COLORS.terra }}>Overall:</strong>
                <div style={styles.progTrack}>
                  <div style={{ ...styles.progFill, width: `${totalProgress()}%` }} />
                </div>
                <span style={{ fontSize: '.82rem', fontWeight: 600, minWidth: 36 }}>{totalProgress()}%</span>
              </div>

              {PILLARS.map((p) => (
                <div key={p.id} style={styles.chkGroup}>
                  <h3 style={styles.chkH3}>{p.title}</h3>
                  <div style={styles.progRow}>
                    <div style={styles.progTrack}>
                      <div style={{ ...styles.progFill, width: `${pillarProgress(p.id)}%` }} />
                    </div>
                    <span style={{ fontSize: '.78rem', fontWeight: 600, minWidth: 36 }}>
                      {pillarProgress(p.id)}%
                    </span>
                  </div>
                  {CHECKLIST[p.id].map((item, i) => {
                    const id = `${p.id}_${i}`;
                    return (
                      <label key={id} style={styles.chkItem}>
                        <input
                          type="checkbox"
                          checked={!!checklist[id]}
                          onChange={() => toggleCheck(id)}
                          style={styles.checkbox}
                        />
                        <span
                          style={{
                            fontSize: '.87rem',
                            textDecoration: checklist[id] ? 'line-through' : 'none',
                            color: checklist[id] ? COLORS.rose : COLORS.brown,
                          }}
                        >
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={styles.footer}>
        <strong style={{ color: COLORS.gold }}>E² Teaching Framework</strong>
        <br />
        Every Student Has the Right to Understand
      </footer>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: 'Inter, system-ui, sans-serif',
    background: COLORS.sand,
    color: COLORS.brown,
    minHeight: '100vh',
    lineHeight: 1.6,
  },
  hero: {
    background: `linear-gradient(135deg, ${COLORS.terra}, ${COLORS.clay} 50%, ${COLORS.rose})`,
    color: COLORS.cream,
    textAlign: 'center',
    padding: '36px 20px 26px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 30,
    padding: '6px 22px',
    fontSize: '.75rem',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  h1: {
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)',
    margin: '0 0 6px',
    fontWeight: 700,
  },
  subtitle: { fontSize: '.92rem', opacity: 0.92, margin: 0 },
  nav: {
    background: COLORS.cream,
    borderBottom: `2px solid ${COLORS.peach}`,
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    padding: 8,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
  },
  navBtn: {
    padding: '9px 18px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '.82rem',
    fontWeight: 500,
    background: 'transparent',
    color: COLORS.brown,
    transition: 'all .2s',
  },
  navBtnActive: { background: COLORS.terra, color: '#fff' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '24px 16px 60px' },
  manifesto: {
    background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.peach} 80%)`,
    border: `2px solid ${COLORS.rose}`,
    borderRadius: 14,
    padding: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  manifestoTitle: {
    fontFamily: 'Playfair Display, Georgia, serif',
    color: COLORS.clay,
    fontSize: '1.4rem',
    marginBottom: 14,
  },
  mfGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: 10,
    textAlign: 'left',
  },
  mfItem: {
    background: COLORS.cream,
    borderLeft: `4px solid ${COLORS.terra}`,
    borderRadius: 7,
    padding: '12px 14px',
    fontSize: '.88rem',
  },
  card: {
    background: COLORS.cream,
    borderRadius: 12,
    padding: '22px 24px',
    marginBottom: 16,
    boxShadow: '0 2px 10px rgba(0,0,0,.04)',
    border: `1px solid rgba(201,145,143,.15)`,
  },
  cardH2: {
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: '1.2rem',
    color: COLORS.clay,
    marginBottom: 14,
    paddingBottom: 8,
    borderBottom: `2px solid ${COLORS.peach}`,
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginTop: 16,
  },
  quickCard: {
    background: COLORS.cream,
    borderRadius: 10,
    padding: 18,
    textAlign: 'center',
    cursor: 'pointer',
    border: '2px solid transparent',
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  },
  row2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontWeight: 600, fontSize: '.84rem', marginBottom: 4 },
  hint: { fontSize: '.76rem', color: COLORS.rose, marginBottom: 4, fontStyle: 'italic' },
  input: {
    width: '100%',
    padding: '9px 13px',
    border: `1px solid ${COLORS.peach}`,
    borderRadius: 7,
    fontFamily: 'inherit',
    fontSize: '.88rem',
    background: '#fff',
    color: COLORS.brown,
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '9px 13px',
    border: `1px solid ${COLORS.peach}`,
    borderRadius: 7,
    fontFamily: 'inherit',
    fontSize: '.88rem',
    background: '#fff',
    color: COLORS.brown,
    minHeight: 70,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  btnRow: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  btnPrimary: {
    padding: '9px 20px',
    border: 'none',
    borderRadius: 7,
    cursor: 'pointer',
    fontSize: '.83rem',
    fontWeight: 500,
    background: COLORS.terra,
    color: '#fff',
    marginRight: 4,
  },
  btnSecondary: {
    padding: '9px 20px',
    border: 'none',
    borderRadius: 7,
    cursor: 'pointer',
    fontSize: '.83rem',
    fontWeight: 500,
    background: COLORS.rose,
    color: '#fff',
    marginRight: 4,
  },
  btnOutline: {
    padding: '9px 20px',
    border: `1.5px solid ${COLORS.terra}`,
    borderRadius: 7,
    cursor: 'pointer',
    fontSize: '.83rem',
    fontWeight: 500,
    background: 'transparent',
    color: COLORS.terra,
    marginRight: 4,
  },
  tableWrap: { overflowX: 'auto' },
  bpTable: {
    borderCollapse: 'collapse',
    width: '100%',
    minWidth: 1400,
    background: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  th: {
    background: COLORS.terra,
    color: '#fff',
    padding: '9px 7px',
    fontSize: '.72rem',
    textAlign: 'left',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  thSticky: { position: 'sticky', left: 0, background: COLORS.clay, zIndex: 2 },
  td: {
    padding: 3,
    borderBottom: `1px solid ${COLORS.peach}`,
    verticalAlign: 'top',
  },
  tdWeek: {
    position: 'sticky',
    left: 0,
    background: COLORS.cream,
    fontWeight: 600,
    textAlign: 'center',
    color: COLORS.terra,
    minWidth: 50,
  },
  cellArea: {
    width: '100%',
    minHeight: 56,
    border: '1px solid transparent',
    borderRadius: 4,
    padding: '5px 7px',
    fontSize: '.78rem',
    fontFamily: 'inherit',
    background: 'transparent',
    resize: 'vertical',
  },
  pillar: {
    background: COLORS.cream,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  },
  pillarHead: {
    background: COLORS.terra,
    color: '#fff',
    padding: '14px 20px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pillarBody: { padding: '16px 20px' },
  pillarItem: {
    padding: '8px 0',
    borderBottom: `1px solid ${COLORS.peach}`,
    fontSize: '.88rem',
  },
  chkGroup: { marginBottom: 18 },
  chkH3: {
    fontSize: '.95rem',
    color: COLORS.terra,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: `1px solid ${COLORS.peach}`,
  },
  chkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '6px 0',
    cursor: 'pointer',
  },
  checkbox: { accentColor: COLORS.terra, width: 17, height: 17, marginTop: 2, cursor: 'pointer' },
  progRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  progTrack: {
    flex: 1,
    height: 8,
    background: COLORS.peach,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${COLORS.terra}, ${COLORS.gold})`,
    borderRadius: 4,
    transition: 'width .3s',
  },
  footer: {
    textAlign: 'center',
    padding: 24,
    background: COLORS.brown,
    color: COLORS.peach,
    fontSize: '.82rem',
  },
};
