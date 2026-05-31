// ─────────────────────────────────────────────────
//  Red Isle Relay — Training Widget for Scriptable
//  Works as Small, Medium, or Large widget
//  Tap widget to open the full training PWA
// ─────────────────────────────────────────────────

const APP_URL = 'https://b4pgqbnwjt-creator.github.io/training-pwa/';

// ── COLORS ───────────────────────────────────────
const C = {
  bg:      new Color('#0a0a0f'),
  bg2:     new Color('#14141e'),
  bg3:     new Color('#1e1e2c'),
  border:  new Color('#ffffff', 0.07),
  accent:  new Color('#e8ff3c'),
  text:    new Color('#f0f0f5'),
  text2:   new Color('#8888a0'),
  text3:   new Color('#44445a'),
  easy:    new Color('#22c55e'),
  tempo:   new Color('#f59e0b'),
  inter:   new Color('#ef4444'),
  rest:    new Color('#6366f1'),
  sharp:   new Color('#00d4ff'),
  prog:    new Color('#f97316'),
  trial:   new Color('#ec4899'),
  race:    new Color('#e8ff3c'),
};

// ── SCHEDULE ─────────────────────────────────────
const SCHEDULE = {
  '2026-05-25': { name:'Rest Day',           type:'rest',        km:0,  pace:null,              week:1 },
  '2026-05-26': { name:'Tempo Run',          type:'tempo',       km:12, pace:'4:25–4:30/km',    week:1 },
  '2026-05-27': { name:'Easy Run',           type:'easy',        km:10, pace:'5:30–6:00/km',    week:1 },
  '2026-05-28': { name:'Intervals',          type:'intervals',   km:12, pace:'4:00–4:05/km',    week:1 },
  '2026-05-29': { name:'Easy Run',           type:'easy',        km:8,  pace:'5:30–6:00/km',    week:1 },
  '2026-05-30': { name:'Easy Run',           type:'easy',        km:8,  pace:'5:30–6:00/km',    week:1 },
  '2026-05-31': { name:'Long Run',           type:'easy',        km:16, pace:'5:30→4:20/km',    week:1 },
  '2026-06-01': { name:'Rest Day',           type:'rest',        km:0,  pace:null,              week:2 },
  '2026-06-02': { name:'Tempo Run',          type:'tempo',       km:14, pace:'4:25/km',          week:2 },
  '2026-06-03': { name:'Easy Run',           type:'easy',        km:10, pace:'5:30–6:00/km',    week:2 },
  '2026-06-04': { name:'Intervals',          type:'intervals',   km:13, pace:'4:00/km',          week:2 },
  '2026-06-05': { name:'Easy Run',           type:'easy',        km:8,  pace:'5:30–6:00/km',    week:2 },
  '2026-06-06': { name:'Progression Run',    type:'progression', km:10, pace:'5:30→4:20/km',    week:2 },
  '2026-06-07': { name:'Long Run',           type:'easy',        km:16, pace:'5:30→4:20/km',    week:2 },
  '2026-06-08': { name:'Rest Day',           type:'rest',        km:0,  pace:null,              week:3 },
  '2026-06-09': { name:'Tempo Run',          type:'tempo',       km:14, pace:'4:25/km',          week:3 },
  '2026-06-10': { name:'Easy Run',           type:'easy',        km:10, pace:'5:30–6:00/km',    week:3 },
  '2026-06-11': { name:'Intervals',          type:'intervals',   km:13, pace:'3:55–4:00/km',    week:3 },
  '2026-06-12': { name:'Easy Run',           type:'easy',        km:8,  pace:'5:30–6:00/km',    week:3 },
  '2026-06-13': { name:'10km Time Trial',    type:'timetrial',   km:13, pace:'All out',          week:3 },
  '2026-06-14': { name:'Easy Shakeout',      type:'easy',        km:8,  pace:'6:00+/km',         week:3 },
  '2026-06-15': { name:'Rest Day',           type:'rest',        km:0,  pace:null,              week:4 },
  '2026-06-16': { name:'Sharpener',          type:'sharpener',   km:12, pace:'4:05/km',          week:4 },
  '2026-06-17': { name:'Easy Run',           type:'easy',        km:8,  pace:'5:30–6:00/km',    week:4 },
  '2026-06-18': { name:'Easy Run',           type:'easy',        km:6,  pace:'5:30–6:00/km',    week:4 },
  '2026-06-19': { name:'Pre-Race Activation',type:'activation',  km:5,  pace:'Easy + strides',  week:4 },
  '2026-06-20': { name:'Rest — Travel Day',  type:'rest',        km:0,  pace:null,              week:4 },
  '2026-06-21': { name:'Rest — Race Eve',    type:'rest',        km:0,  pace:null,              week:4 },
  '2026-06-22': { name:'RACE DAY',           type:'race',        km:21, pace:'4:20/km',          week:4 },
};

// ── HELPERS ───────────────────────────────────────
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function daysToRace() {
  const now = new Date(); now.setHours(0,0,0,0);
  const race = new Date('2026-06-22'); race.setHours(0,0,0,0);
  return Math.max(0, Math.round((race - now) / 86400000));
}

function typeColor(type) {
  return { easy:C.easy, tempo:C.tempo, intervals:C.inter, rest:C.rest,
           race:C.race, sharpener:C.sharp, progression:C.prog,
           timetrial:C.trial, activation:C.easy }[type] || C.text2;
}

function typeLabel(type) {
  return { easy:'EASY RUN', tempo:'TEMPO', intervals:'INTERVALS', rest:'REST DAY',
           race:'RACE DAY 🏁', sharpener:'SHARPENER', progression:'PROGRESSION',
           timetrial:'TIME TRIAL', activation:'ACTIVATION' }[type] || type.toUpperCase();
}

function weekDays(week) {
  const starts = {1:'2026-05-25',2:'2026-06-01',3:'2026-06-08',4:'2026-06-15'};
  const start = new Date(starts[week]+'T00:00:00');
  return Array.from({length:7}, (_, i) => { const d=new Date(start); d.setDate(d.getDate()+i); return d; });
}

// ── BUILD WIDGET ──────────────────────────────────
const today = new Date();
const key = dateKey(today);
const session = SCHEDULE[key];
const days = daysToRace();
const family = config.widgetFamily || 'medium';

const w = new ListWidget();
w.backgroundColor = C.bg;
w.url = APP_URL;

const grad = new LinearGradient();
grad.locations = [0, 1];
if (session && session.type !== 'rest') {
  const tc = typeColor(session.type);
  grad.colors = [new Color(tc.hex, 0.08), new Color('#0a0a0f', 0)];
} else {
  grad.colors = [new Color('#6366f1', 0.06), new Color('#0a0a0f', 0)];
}
grad.startPoint = new Point(0, 0);
grad.endPoint   = new Point(0, 1);
w.backgroundGradient = grad;

// ── SMALL ─────────────────────────────────────────
if (family === 'small') {
  w.setPadding(14, 14, 14, 14);

  // Top: type label + countdown
  const top = w.addStack();
  top.layoutHorizontally();
  const tl = top.addText(session ? typeLabel(session.type) : 'OFF PLAN');
  tl.font = Font.boldSystemFont(8.5);
  tl.textColor = session ? typeColor(session.type) : C.text3;
  tl.lineLimit = 1;
  top.addSpacer();
  const cd = top.addText(`${days}d`);
  cd.font = Font.boldSystemFont(10);
  cd.textColor = C.accent;

  w.addSpacer(5);

  if (!session) {
    const nt = w.addText('No session');
    nt.font = Font.mediumSystemFont(13);
    nt.textColor = C.text2;
    w.addSpacer();
  } else if (session.type === 'rest') {
    const rt = w.addText(session.name);
    rt.font = Font.boldSystemFont(16);
    rt.textColor = C.rest;
    rt.lineLimit = 2;
    w.addSpacer();
    const sub = w.addText('Recover & sleep well');
    sub.font = Font.mediumSystemFont(11);
    sub.textColor = C.text2;
  } else {
    const nm = w.addText(session.name);
    nm.font = Font.boldSystemFont(session.name.length > 12 ? 14 : 17);
    nm.textColor = session.type === 'race' ? C.accent : C.text;
    nm.lineLimit = 2;
    w.addSpacer();
    const kv = w.addText(`${session.km} km`);
    kv.font = Font.boldSystemFont(26);
    kv.textColor = typeColor(session.type);
    if (session.pace) {
      const pv = w.addText(session.pace);
      pv.font = Font.mediumSystemFont(10);
      pv.textColor = C.text2;
    }
  }

  // ── MEDIUM ───────────────────────────────────────
} else if (family === 'medium') {
  w.setPadding(14, 16, 14, 16);

  // ── Header row ──
  const hdr = w.addStack();
  hdr.layoutHorizontally();

  const hl = hdr.addText('RED ISLE RELAY');
  hl.font    = Font.boldSystemFont(9);
  hl.textColor = C.text3;
  hdr.addSpacer();

  const cds = hdr.addStack();
  cds.layoutHorizontally();
  cds.spacing = 1;
  const cn = cds.addText(`${days}`);
  cn.font = Font.boldSystemFont(13);
  cn.textColor = C.accent;
  const cl = cds.addText(days === 1 ? ' DAY TO RACE' : ' DAYS TO RACE');
  cl.font = Font.boldSystemFont(9);
  cl.textColor = C.text3;

  w.addSpacer(10);

  if (!session) {
    const nt = w.addText('No training today');
    nt.font = Font.mediumSystemFont(14);
    nt.textColor = C.text2;
  } else {
    // Type label
    const color = typeColor(session.type);
    const tl = w.addText(typeLabel(session.type));
    tl.font = Font.boldSystemFont(9.5);
    tl.textColor = color;

    w.addSpacer(3);

    // Session name
    const nm = w.addText(session.name);
    nm.font = Font.boldSystemFont(session.name.length > 14 ? 17 : 20);
    nm.textColor = session.type === 'race' ? C.accent : C.text;
    nm.lineLimit = 1;

    w.addSpacer(10);

    if (session.type === 'rest') {
      const rb = w.addStack();
      rb.backgroundColor = new Color('#6366f1', 0.12);
      rb.cornerRadius = 8;
      rb.setPadding(9, 12, 9, 12);
      const rt = rb.addText('Recovery day — rest, hydrate, sleep well');
      rt.font = Font.mediumSystemFont(12);
      rt.textColor = C.rest;
      rt.lineLimit = 1;
    } else {
      // Stats row
      const sr = w.addStack();
      sr.layoutHorizontally();
      sr.spacing = 8;

      function statBox(parent, label, value, valColor) {
        const box = parent.addStack();
        box.layoutVertically();
        box.backgroundColor = C.bg3;
        box.cornerRadius = 9;
        box.setPadding(9, 11, 9, 11);
        const lbl = box.addText(label);
        lbl.font = Font.boldSystemFont(7.5);
        lbl.textColor = C.text3;
        box.addSpacer(2);
        const val = box.addText(value);
        val.font = Font.boldSystemFont(value.length > 9 ? 12 : 15);
        val.textColor = valColor || C.text;
        val.lineLimit = 1;
      }

      statBox(sr, 'DISTANCE', `${session.km} km`);
      if (session.pace) statBox(sr, 'PACE', session.pace, color);
      statBox(sr, 'WEEK', `${session.week} of 4`);
      sr.addSpacer();
    }
  }

  // ── LARGE ────────────────────────────────────────
} else {
  w.setPadding(16, 18, 16, 18);

  // ── Header ──
  const hdr = w.addStack();
  hdr.layoutHorizontally();
  const hl = hdr.addText('RED ISLE RELAY · JUNE 22');
  hl.font = Font.boldSystemFont(9);
  hl.textColor = C.text3;
  hdr.addSpacer();
  const cn = hdr.addText(`${days} DAYS`);
  cn.font = Font.boldSystemFont(11);
  cn.textColor = C.accent;

  w.addSpacer(12);

  if (!session) {
    const nt = w.addText('No training today');
    nt.font = Font.mediumSystemFont(14);
    nt.textColor = C.text2;
  } else {
    const color = typeColor(session.type);

    // Type badge
    const tl = w.addText(typeLabel(session.type));
    tl.font = Font.boldSystemFont(10);
    tl.textColor = color;

    w.addSpacer(3);

    // Session name
    const nm = w.addText(session.name);
    nm.font = Font.boldSystemFont(session.name.length > 14 ? 20 : 24);
    nm.textColor = session.type === 'race' ? C.accent : C.text;
    nm.lineLimit = 1;

    w.addSpacer(12);

    if (session.type !== 'rest') {
      // Stats row
      const sr = w.addStack();
      sr.layoutHorizontally();
      sr.spacing = 8;

      function statBoxL(parent, label, value, valColor) {
        const box = parent.addStack();
        box.layoutVertically();
        box.backgroundColor = C.bg3;
        box.cornerRadius = 10;
        box.setPadding(10, 13, 10, 13);
        const lbl = box.addText(label);
        lbl.font = Font.boldSystemFont(8);
        lbl.textColor = C.text3;
        box.addSpacer(3);
        const val = box.addText(value);
        val.font = Font.boldSystemFont(value.length > 9 ? 13 : 17);
        val.textColor = valColor || C.text;
        val.lineLimit = 1;
        return box;
      }

      statBoxL(sr, 'DISTANCE', `${session.km} km`);
      if (session.pace) statBoxL(sr, 'TARGET PACE', session.pace, color);
      statBoxL(sr, 'WEEK', `${session.week} of 4`);
      sr.addSpacer();

      w.addSpacer(14);
    } else {
      const rb = w.addStack();
      rb.backgroundColor = new Color('#6366f1', 0.12);
      rb.cornerRadius = 10;
      rb.setPadding(12, 14, 12, 14);
      const rt = rb.addText('Rest day — recovery is part of training');
      rt.font = Font.mediumSystemFont(13);
      rt.textColor = C.rest;
      w.addSpacer(14);
    }

    // ── Week progress ──
    if (session.week) {
      const wlbl = w.addText(`WEEK ${session.week} PROGRESS`);
      wlbl.font = Font.boldSystemFont(8);
      wlbl.textColor = C.text3;

      w.addSpacer(7);

      const wd = weekDays(session.week);
      const dayLabels = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
      const todayKey = key;
      const now2 = new Date(); now2.setHours(0,0,0,0);

      const weekRow = w.addStack();
      weekRow.layoutHorizontally();
      weekRow.spacing = 5;

      wd.forEach((d, i) => {
        const k = dateKey(d);
        const s = SCHEDULE[k];
        const isToday = k === todayKey;
        d.setHours(0,0,0,0);
        const isPast = d < now2;
        const isRest = s && s.type === 'rest';

        const col = weekRow.addStack();
        col.layoutVertically();
        col.spacing = 4;

        const dl = col.addText(dayLabels[i]);
        dl.font = Font.boldSystemFont(7);
        dl.textColor = isToday ? C.accent : C.text3;

        const kmStr = s ? (s.km > 0 ? `${s.km}k` : '–') : '–';
        const kmT = col.addText(kmStr);
        kmT.font = Font.boldSystemFont(9);
        if (isToday)       kmT.textColor = C.accent;
        else if (isPast && !isRest) kmT.textColor = C.easy;
        else if (isRest)   kmT.textColor = new Color('#6366f1', 0.6);
        else               kmT.textColor = C.text3;

        weekRow.addSpacer();
      });

      w.addSpacer(12);

      // ── Supplement reminder ──
      const divider = w.addStack();
      divider.backgroundColor = new Color('#ffffff', 0.06);
      divider.setPadding(0,0,0,0);
      const div = divider.addStack();
      div.size = new Size(0, 1);

      w.addSpacer(10);

      const subHdr = w.addText('SUPPLEMENT REMINDER');
      subHdr.font = Font.boldSystemFont(8);
      subHdr.textColor = C.text3;

      w.addSpacer(6);

      const isTraining = session.type !== 'rest';
      const suppRow = w.addStack();
      suppRow.layoutHorizontally();
      suppRow.spacing = 6;

      const suppItems = isTraining
        ? ['Collagen 15g — pre-run', 'Creatine 5g — post-run']
        : ['Collagen 15g — morning', 'Vitamin D — with meal'];
      suppItems.push('Magnesium 400mg — bed');

      suppItems.slice(0,3).forEach(item => {
        const sb = suppRow.addStack();
        sb.backgroundColor = C.bg3;
        sb.cornerRadius = 7;
        sb.setPadding(7, 9, 7, 9);
        const st = sb.addText(item);
        st.font = Font.mediumSystemFont(9);
        st.textColor = new Color('#00d4ff');
        st.lineLimit = 2;
        suppRow.addSpacer();
      });
    }
  }
}

Script.setWidget(w);

// Preview when running in-app
if (!config.runsInWidget) {
  if (family === 'small')       await w.presentSmall();
  else if (family === 'large')  await w.presentLarge();
  else                          await w.presentMedium();
}
