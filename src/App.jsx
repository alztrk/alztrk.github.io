import React, { useState, useEffect, useRef } from 'react';
import { useI18n, I18nProvider } from './I18nContext';
import contribData from './contribs.json';
import eventsData from './events.json';
import repoStats from './repos.json';
import userStats from './user.json';
import './App.css';

function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function Hero() {
  const { t } = useI18n();
  const [text, setText] = useState('');

  const phrases = [
    t('hero_sub'),
    t('tw_phrase1'),
    t('tw_phrase2'),
    t('tw_phrase3'),
    t('tw_phrase4'),
  ];
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    const fn = () => {
      const current = phrases[phraseIdx.current];
      if (!isDeleting.current) {
        charIdx.current++;
        setText(current.substring(0, charIdx.current));
        if (charIdx.current === current.length) {
          isDeleting.current = true;
          setTimeout(fn, 2000); return;
        }
        setTimeout(fn, 50 + Math.random() * 60);
      } else {
        charIdx.current--;
        setText(current.substring(0, charIdx.current));
        if (charIdx.current === 0) {
          isDeleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
          setTimeout(fn, 400); return;
        }
        setTimeout(fn, 30 + Math.random() * 30);
      }
    };
    const timer = setTimeout(fn, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          <p className="hero-label">{t('hero_label')}</p>
          <h1><span className="gradient-text">Alican Öztürk</span></h1>
          <h2>{text}<span className="tw-cursor">|</span></h2>
          <p className="hero-desc">{t('hero_desc')}</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{userStats.repos || 15}</span>
              <span className="hero-stat-label">{t('projects_label')}</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">18+</span>
              <span className="hero-stat-label">{t('stars_label')}</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{userStats.followers || 18}</span>
              <span className="hero-stat-label">{t('followers_label')}</span>
            </div>
          </div>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">{t('cta_work')}</a>
            <a href="#contact" className="btn btn-ghost"><span>{t('cta_contact')}</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const ob = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { threshold: 0.3, rootMargin: '-64px 0px 0px 0px' });
    sections.forEach(s => ob.observe(s));
    return () => ob.disconnect();
  }, []);

  const links = [
    { id: 'about', label: t('nav_about') },
    { id: 'projects', label: t('nav_work') },
    { id: 'posts', label: t('nav_posts') },
    { id: 'contact', label: t('nav_contact') },
  ];

  return (
    <header>
      <div className="container">
        <nav>
          <a href="#" className="logo">&lt;alztrk /&gt;</a>
          <div className="nav-links">
            {links.map(l => (
              <a key={l.id} href={'#' + l.id} className={active === l.id ? 'active' : ''}>{l.label}</a>
            ))}
          </div>
          <div className="nav-actions">
            <div className="lang-dropdown" ref={ref}>
              <button className="lang-btn" onClick={() => setMenuOpen(!menuOpen)}>
                {lang.toUpperCase()} ▾
              </button>
              {menuOpen && (
                <div className="lang-menu">
                  <button className={'lang-option' + (lang === 'en' ? ' active' : '')} onClick={() => { setLang('en'); setMenuOpen(false); }}>EN</button>
                  <button className={'lang-option' + (lang === 'tr' ? ' active' : '')} onClick={() => { setLang('tr'); setMenuOpen(false); }}>TR</button>
                </div>
              )}
            </div>
            <span className="hireable-badge">{t('available')}</span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

function Section({ id, num, title, children, className = '' }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); ob.disconnect(); } }, { threshold: 0.05 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} className={`section ${className} ${revealed ? 'revealed' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-number">{num}.</span>
          <h2>{title}</h2>
          <div className="section-line"></div>
        </div>
        {children}
      </div>
    </section>
  );
}

function About() {
  const { t } = useI18n();
  return (
    <Section id="about" num="01" title={t('about_title')}>
      <div className="about-grid">
        <div className="about-text">
          <p>{t('about_p1')}</p>
          <p>{t('about_p2')}</p>
          <p>{t('about_techs')}</p>
          <ul className="skills">
            <li><i className="devicon-typescript-plain colored"></i> TypeScript</li>
            <li><i className="devicon-react-original colored"></i> React Native</li>
            <li><i className="devicon-nodejs-plain colored"></i> Node.js</li>
            <li><i className="devicon-javascript-plain colored"></i> JavaScript</li>
            <li><i className="devicon-electron-original colored"></i> Electron</li>
            <li><i className="devicon-rust-plain"></i> Rust (learning)</li>
            <li><i className="devicon-html5-plain colored"></i> HTML & CSS</li>
            <li><i className="devicon-github-original colored"></i> Git & CI/CD</li>
          </ul>
          <p style={{marginTop: 20}}>{t('about_tools')}</p>
          <ul className="skills">
            <li><i className="devicon-vscode-plain colored"></i> VS Code</li>
            <li><img src="https://raw.githubusercontent.com/TengraStudio/tengra/main/assets/copilot.svg" alt="" style={{width: 16, height: 16, marginRight: 8, verticalAlign: 'middle'}} /> GitHub Copilot</li>
            <li><img src="https://raw.githubusercontent.com/TengraStudio/tengra/main/assets/antigravity.svg" alt="" style={{width: 16, height: 16, marginRight: 8, verticalAlign: 'middle'}} /> Antigravity</li>
            <li><img src="https://raw.githubusercontent.com/TengraStudio/tengra/main/assets/opencode.svg" alt="" style={{width: 16, height: 16, marginRight: 8, verticalAlign: 'middle'}} /> opencode</li>
          </ul>
        </div>
        <div className="avatar-col">
          <div className="avatar-frame">
            <img src="https://avatars.githubusercontent.com/u/139810055?v=4" alt="Alican Öztürk" className="avatar-img" />
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContributionChart() {
  const canvasRef = useRef();
  const weeks = contribData.weeks || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !weeks.length) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const days = weeks.flatMap(w => w.contributionDays);
    const max = Math.max(1, ...days.map(d => d.contributionCount));
    const pad = { t: 10, r: 10, b: 20, l: 30 };
    const cw = w - pad.l - pad.r;
    const ch = h - pad.t - pad.b;

    ctx.clearRect(0, 0, w, h);
    const isDark = document.body.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#8a8a9a' : '#4a4a5a';
    const barColor = isDark ? '#22c55e' : '#16a34a';
    const barHover = isDark ? '#2ee075' : '#1db85a';

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(max - (max / 4) * i), pad.l - 6, y + 4);
    }

    // Bars
    const barW = cw / days.length - 1;
    days.forEach((d, i) => {
      const x = pad.l + (cw / days.length) * i;
      const barH = (d.contributionCount / max) * ch;
      const y = pad.t + ch - barH;
      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, Math.max(barW, 2), Math.max(barH, 1));
    });

    // Month labels
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let lastM = -1;
    days.forEach((d, i) => {
      const m = new Date(d.date).getMonth();
      if (m !== lastM) {
        lastM = m;
        ctx.fillStyle = textColor;
        ctx.font = '9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(months[m], pad.l + (cw / days.length) * i, h - 2);
      }
    });
  }, [weeks]);

  return <canvas ref={canvasRef} style={{width: '100%', height: 160, borderRadius: 8}} />;
}

function Stats() {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState(null);
  const rawEvents = eventsData || [];
  const weeks = contribData.weeks || [];

  const cells = [];
  const maxCount = Math.max(1, ...weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount)));
  weeks.forEach(w => w.contributionDays.forEach(d => {
    const level = d.contributionCount > 0 ? Math.min(Math.ceil((d.contributionCount / maxCount) * 4), 4) : 0;
    cells.push({ date: d.date, count: d.contributionCount, level });
  }));

  const items = rawEvents.map(e => {
    const ago = Math.floor((Date.now() - new Date(e.created_at).getTime()) / 3600000);
    const time = ago < 1 ? t('act_just') : ago < 24 ? ago + t('act_h') : Math.floor(ago / 24) + t('act_d');
    return { id: e.id, type: e.type, repo: e.repo, time };
  });

  const icon = (type) => {
    switch (type) {
      case 'PushEvent': return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a.75.75 0 01.75.75v7.19l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06L7.25 9.44V2.25A.75.75 0 018 1.5zM2.5 12.5a.75.75 0 00-1.5 0v1a1.75 1.75 0 001.75 1.75h10.5A1.75 1.75 0 0015 13.5v-1a.75.75 0 00-1.5 0v1a.25.25 0 01-.25.25H3.75a.25.25 0 01-.25-.25v-1z"/></svg>;
      case 'CreateEvent': return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a.75.75 0 01.75.75V7h4.75a.75.75 0 010 1.5H8.75v4.75a.75.75 0 01-1.5 0V8.5H2.5a.75.75 0 010-1.5h4.75V2.25A.75.75 0 018 1.5z"/></svg>;
      case 'WatchEvent': return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2.5a5.5 5.5 0 00-5.5 5.5A5.5 5.5 0 008 13.5 5.5 5.5 0 0013.5 8 5.5 5.5 0 008 2.5zM8 1a7 7 0 100 14A7 7 0 008 1zm0 4a3 3 0 100 6 3 3 0 000-6z"/></svg>;
      default: return null;
    }
  };

  const label = (item) => {
    switch (item.type) {
      case 'PushEvent': return t('act_push') + ' ' + item.repo;
      case 'CreateEvent': return t('act_create') + ' ' + t('act_in') + ' ' + item.repo;
      case 'WatchEvent': return t('act_star');
      default: return item.type + ' ' + t('act_in') + ' ' + item.repo;
    }
  };

  return (
    <Section id="stats" num="02" title={t('stats_title')}>
      <p className="contrib-label">{t('contrib_desc')} &middot; {contribData.totalContributions} {t('contrib_total')}</p>
      <ContributionChart />
      <div className="contrib-grid">
        {cells.map((c, i) => (
          <div key={i} className={`contrib-cell${c.level > 0 ? ' l' + c.level : ''}`} title={c.date + ': ' + c.count + ' commits'} />
        ))}
      </div>
      <div style={{marginTop: 32}}>
        <ActivityChart />
      </div>
      <div className="activity-feed" style={{marginTop: 16}}>
        {items.map((item, i) => (
          <div key={item.id} className="activity-item">
            <div className="activity-header" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span className="activity-icon">{icon(item.type)}</span>
              <span className="activity-label">{label(item)}</span>
              <span className="activity-time">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Projects() {
  const { t } = useI18n();
  const tengraStars = repoStats[0]?.stars ?? '?';
  const tengraForks = repoStats[0]?.forks ?? '?';
  const xfilterStars = repoStats[1]?.stars ?? '?';

  return (
    <Section id="projects" num="03" title={t('projects_title')}>
        <div className="project-card featured">
          <div className="project-content">
          <p className="project-label">{t('featured_label')}</p>
          <div className="project-header-with-logo">
            <img src="https://raw.githubusercontent.com/TengraStudio/tengra/main/assets/tengra_white_bg_black.png" alt="Tengra" className="project-logo" />
            <h3>Tengra</h3>
          </div>
          <div className="project-description"><p>{t('tengra_desc')}</p></div>
          <div className="project-tech"><span>TypeScript</span><span>Electron</span><span>Rust</span><span>React</span><span>Vite</span></div>
          <div className="project-meta">
            <span className="project-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>{tengraStars}</span>
            </span>
            <span className="project-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              <span>{tengraForks}</span>
            </span>
          </div>
          <div className="project-links">
            <a href="https://github.com/TengraStudio/tengra" target="_blank" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://github.com/TengraStudio/tengra/releases" target="_blank" className="btn-link">{t('download')}</a>
          </div>
        </div>
      </div>

      <div className="project-grid">
          <div className="project-card">
            <div className="project-content">
              <h3>XFilter</h3>
            <p>{t('xfilter_desc')}</p>
            <div className="project-tech"><span>JavaScript</span><span>Chrome API</span></div>
            <div className="project-meta">
              <span className="project-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span>{xfilterStars}</span>
              </span>
            </div>
            <div className="project-links">
              <a href="https://github.com/alztrk/xfilter" target="_blank" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>

          <div className="project-card">
            <div className="project-content">
              <h3>Tengra Marketplace</h3>
            <p>{t('market_desc')}</p>
            <div className="project-tech"><span>JavaScript</span><span>GitHub Actions</span><span>JSON</span></div>
            <div className="project-links">
              <a href="https://github.com/TengraStudio/tengra-market" target="_blank" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>

          <div className="project-card">
            <div className="project-content">
              <h3>Job Finder Plugin</h3>
            <p>{t('jobfinder_desc')}</p>
            <div className="project-tech"><span>TypeScript</span><span>AI</span><span>Plugin SDK</span></div>
            <div className="project-links">
              <a href="https://github.com/TengraStudio/job-finder-plugin" target="_blank" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ActivityChart() {
  const canvasRef = useRef();
  const rawEvents = eventsData || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rawEvents.length) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isDark = document.body.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#8a8a9a' : '#4a4a5a';
    const colors = { PushEvent: '#22c55e', CreateEvent: '#06b6d4', WatchEvent: '#eab308' };
    const pad = { t: 10, r: 10, b: 20, l: 40 };
    const cw = w - pad.l - pad.r;
    const ch = h - pad.t - pad.b;

    const typeCount = {};
    rawEvents.forEach(e => { typeCount[e.type] = (typeCount[e.type] || 0) + 1; });
    const types = Object.keys(typeCount);
    const max = Math.max(1, ...Object.values(typeCount));
    const barW = Math.min((cw - (types.length - 1) * 8) / types.length, 60);

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(max - (max / 4) * i), pad.l - 6, y + 4);
    }

    // Bars
    const labels = { PushEvent: 'Push', CreateEvent: 'Create', WatchEvent: 'Star' };
    types.forEach((type, i) => {
      const x = pad.l + (cw - types.length * barW - (types.length - 1) * 8) / 2 + i * (barW + 8);
      const barH = (typeCount[type] / max) * ch;
      const y = pad.t + ch - barH;
      ctx.fillStyle = colors[type] || '#888';
      ctx.beginPath();
      ctx.roundRect(x, y, barW, Math.max(barH, 2), 4);
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(labels[type] || type, x + barW / 2, h - 4);
      ctx.fillText(typeCount[type], x + barW / 2, y - 6);
    });
  }, [rawEvents]);

  return <canvas ref={canvasRef} style={{width: '100%', height: 180, borderRadius: 8}} />;
}

function Writing() {
  const { t } = useI18n();
  const [lcData, setLcData] = useState({ rank: '-', solved: '-' });

  useEffect(() => {
    fetch('https://alfa-leetcode-api.onrender.com/alz_trk').then(r => r.json()).then(d => {
      if (d.ranking) setLcData({ rank: '#' + d.ranking.toLocaleString(), solved: 'active' });
    }).catch(() => {});
  }, []);

  return (
    <Section id="posts" num="04" title={t('posts_title')}>
      <div className="writing-grid">
        <a href="https://twitter.com/alz_trk" target="_blank" className="writing-card" rel="noreferrer">
          <div className="writing-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></div>
          <h3>X / Twitter</h3>
          <p>{t('twitter_desc')}</p>
          <span className="writing-link">@alz_trk</span>
        </a>
        <a href="https://github.com/alztrk" target="_blank" className="writing-card" rel="noreferrer">
          <div className="writing-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></div>
          <h3>GitHub</h3>
          <p>{t('github_desc')}</p>
          <span className="writing-link">alztrk</span>
        </a>
        <a href="https://leetcode.com/u/alz_trk/" target="_blank" className="writing-card" rel="noreferrer">
          <div className="writing-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125.513 5.527 5.527 0 00.062 2.362 5.83 5.83 0 00.349 1.017 5.938 5.938 0 001.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 00-1.951-.003l-2.396 2.392a3.021 3.021 0 01-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.47-.948-2.263a2.68 2.68 0 01.066-.523 2.545 2.545 0 01.619-1.164L9.13 8.114c1.058-1.134 3.204-1.027 4.43.174l1.5 1.453c.54.54 1.414.54 1.955 0s.54-1.414 0-1.955L15.578 6.34c-.615-.602-1.33-1.003-2.095-1.203a5.442 5.442 0 00-1.007-.136c-.288-.012-.613 0-.613 0l3.394-3.394A1.378 1.378 0 0013.483 0zm-3.705 7.302h.004c.476.002.942.148 1.304.479l4.422 4.353c.541.54.541 1.414.003 1.955a1.378 1.378 0 01-1.952.003l-4.422-4.353a1.45 1.45 0 01-.005-2.038 1.38 1.38 0 011.024-.418l.622-.38z"/></svg></div>
          <h3>LeetCode</h3>
          <p>{t('leetcode_desc')}</p>
          <div className="leetcode-stats">
            <span className="leetcode-stat"><span className="lc-num">{lcData.rank}</span><span className="lc-label">{t('lc_rank')}</span></span>
            <span className="leetcode-stat"><span className="lc-num">{lcData.solved}</span><span className="lc-label">{t('lc_solved')}</span></span>
          </div>
          <span className="writing-link">{t('lc_link')}</span>
        </a>
      </div>
    </Section>
  );
}

function Contact() {
  const { t } = useI18n();
  return (
    <Section id="contact" num="05" title={t('contact_title')} className="centered">
      <div className="contact-content">
        <p>{t('contact_desc')}</p>
        <a href="https://twitter.com/alz_trk" className="btn btn-primary">{t('contact_btn')}</a>
      </div>
    </Section>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer>
      <div className="container">
        <div className="footer-social">
          <a href="https://github.com/alztrk" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://twitter.com/alz_trk" target="_blank" rel="noreferrer" aria-label="X / Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://instagram.com/alz_trk" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://linkedin.com/in/alz-trk" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://leetcode.com/u/alz_trk/" target="_blank" rel="noreferrer" aria-label="LeetCode">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125.513 5.527 5.527 0 00.062 2.362 5.83 5.83 0 00.349 1.017 5.938 5.938 0 001.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 00-1.951-.003l-2.396 2.392a3.021 3.021 0 01-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.47-.948-2.263a2.68 2.68 0 01.066-.523 2.545 2.545 0 01.619-1.164L9.13 8.114c1.058-1.134 3.204-1.027 4.43.174l1.5 1.453c.54.54 1.414.54 1.955 0s.54-1.414 0-1.955L15.578 6.34c-.615-.602-1.33-1.003-2.095-1.203a5.442 5.442 0 00-1.007-.136c-.288-.012-.613 0-.613 0l3.394-3.394A1.378 1.378 0 0013.483 0zm-3.705 7.302h.004c.476.002.942.148 1.304.479l4.422 4.353c.541.54.541 1.414.003 1.955a1.378 1.378 0 01-1.952.003l-4.422-4.353a1.45 1.45 0 01-.005-2.038 1.38 1.38 0 011.024-.418l.622-.38z"/></svg>
          </a>
        </div>
        <p className="footer-text">{t('footer_made')} Alican Öztürk <span className="visitor-count">&middot; <VisitorCount /> {t('visitors')}</span></p>
      </div>
    </footer>
  );
}

function VisitorCount() {
  const [count] = useState(() => {
    const c = parseInt(localStorage.getItem('visitor_count') || '0') + 1;
    localStorage.setItem('visitor_count', c);
    return c;
  });
  return <span id="visitor-count">{count}</span>;
}

export default function App() {
  return (
    <I18nProvider>
      <div className="cursor" id="cursor" />
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Stats />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <Activity />
        <div className="section-divider" />
        <Writing />
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
      <ProgressBar />
      <BackToTop />
      <Particles />
    </I18nProvider>
  );
}

function ProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const fn = () => setWidth(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return <div id="progress-bar" style={{ transform: `scaleX(${width})` }} />;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <button id="back-top" className={visible ? 'visible' : ''} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  );
}

function Particles() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['#22c55e', '#06b6d4', '#10b981'];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    let id;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = (1 - dist / 150) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      id = requestAnimationFrame(animate);
    }
    animate();

    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} id="particles" />;
}
