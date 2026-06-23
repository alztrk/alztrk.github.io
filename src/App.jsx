import React, { useEffect, useMemo, useRef, useState } from 'react';
import { I18nProvider } from './I18nContext';
import { useI18n } from './useI18n';
import contribData from './contribs.json';
import repoStats from './repos.json';
import userStats from './user.json';
import huggingFaceLogo from './assets/huggingface.svg';
import './App.css';

function ThemeToggle() {
  const { t } = useI18n();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <button className="theme-toggle" type="button" onClick={() => setDark(!dark)} aria-label={t('toggle_theme')}>
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
  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          <p className="hero-label">{t('hero_label')}</p>
          <h1><span className="gradient-text">Alican Öztürk</span></h1>
          <p className="hero-kicker">{t('hero_kicker')}</p>
          <p className="hero-role">{t('hero_sub')}</p>
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
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const langRef = useRef();
  const mobileMenuId = 'mobile-nav-menu';

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangMenuOpen(false);
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [lang]);

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
          <button
            className={`mobile-menu-toggle${mobileMenuOpen ? ' open' : ''}`}
            type="button"
            aria-label={mobileMenuOpen ? t('close_menu') : t('open_menu')}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="nav-links">
            {links.map(l => (
              <a key={l.id} href={'#' + l.id} className={active === l.id ? 'active' : ''}>{l.label}</a>
            ))}
          </div>
          <div className="nav-actions">
            <div className="lang-dropdown" ref={langRef}>
              <button className="lang-btn" type="button" onClick={() => setLangMenuOpen(!langMenuOpen)}>
                {lang.toUpperCase()} ▾
              </button>
              {langMenuOpen && (
                <div className="lang-menu open">
                  <button className={'lang-option' + (lang === 'en' ? ' active' : '')} type="button" onClick={() => { setLang('en'); setLangMenuOpen(false); }}>EN</button>
                  <button className={'lang-option' + (lang === 'tr' ? ' active' : '')} type="button" onClick={() => { setLang('tr'); setLangMenuOpen(false); }}>TR</button>
                </div>
              )}
            </div>
            <ThemeToggle />
          </div>
        </nav>
        <div id={mobileMenuId} className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
          {links.map(l => (
            <a
              key={l.id}
              href={'#' + l.id}
              className={active === l.id ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

function CopilotIcon() {
  return (
    <svg className="tool-logo tool-logo-copilot" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="copilotGradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8534F3" />
          <stop offset="0.5" stopColor="#C898FD" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="6" fill="url(#copilotGradient)" />
      <path d="M8.5 14.5c0-2.5 1.6-4.5 3.5-4.5s3.5 2 3.5 4.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="10" r="1.2" fill="#fff" />
      <circle cx="14" cy="10" r="1.2" fill="#fff" />
      <path d="M9.5 15.5c.7.7 1.6 1 2.5 1s1.8-.3 2.5-1" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
          <div className="about-group">
          <p className="about-group-label">{t('about_techs')}</p>
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
          </div>
          <div className="about-group">
          <p className="about-group-label">{t('about_tools')}</p>
          <ul className="skills">
            <li><i className="devicon-vscode-plain colored"></i> VS Code</li>
            <li><CopilotIcon /> GitHub Copilot</li>
            <li><img src="https://raw.githubusercontent.com/TengraStudio/tengra/main/assets/antigravity.svg" alt="" style={{width: 16, height: 16, marginRight: 8, verticalAlign: 'middle'}} /> Antigravity</li>
            <li><img src="https://raw.githubusercontent.com/TengraStudio/tengra/main/assets/opencode.svg" alt="" style={{width: 16, height: 16, marginRight: 8, verticalAlign: 'middle'}} /> opencode</li>
          </ul>
          </div>
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

function LeetCodeIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0Z"
        fill="#FFA116"
      />
      <path d="M10.617 12.815H20.79a1.38 1.38 0 0 1 0 2.764H10.617a1.38 1.38 0 0 1 0-2.764Z" fill="currentColor" />
    </svg>
  );
}

function Stats() {
  const { t } = useI18n();
  const weeks = useMemo(() => contribData.weeks || [], []);
  const total = contribData.totalContributions || 0;
  const allDays = weeks.flatMap(w => w.contributionDays);
  const activeDays = allDays.filter(d => d.contributionCount > 0).length;
  const activeWeeks = weeks.filter((week) => week.contributionDays.some((day) => day.contributionCount > 0)).length;
  const streakRatio = allDays.length ? Math.round((activeDays / allDays.length) * 100) : 0;
  const busiestDay = allDays.reduce(
    (best, day) => (day.contributionCount > best.contributionCount ? day : best),
    { contributionCount: 0, date: '' }
  );
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }),
    []
  );

  const cells = [];
  const maxCount = Math.max(1, ...weeks.flatMap(w => w.contributionDays.map(d => d.contributionCount)));
  weeks.forEach(w => w.contributionDays.forEach(d => {
    const level = d.contributionCount > 0 ? Math.min(Math.ceil((d.contributionCount / maxCount) * 4), 4) : 0;
    cells.push({ date: d.date, count: d.contributionCount, level });
  }));

  return (
    <Section id="stats" num="02" title={t('stats_title')}>
      <div className="stats-highlights">
        <div className="stats-highlight-card">
          <span className="stats-highlight-value">{total}</span>
          <span className="stats-highlight-label">{t('stats_total_contribs')}</span>
        </div>
        <div className="stats-highlight-card">
          <span className="stats-highlight-value">{activeDays}</span>
          <span className="stats-highlight-label">{t('stats_active_days')}</span>
        </div>
        <div className="stats-highlight-card">
          <span className="stats-highlight-value">{busiestDay.contributionCount}</span>
          <span className="stats-highlight-label">{t('stats_best_day')}</span>
        </div>
      </div>

      <div className="stats-block">
        <p className="stats-block-title">{t('stats_contribs')}</p>
        <div className="stats-inline-strip">
          <div className="stats-inline-metric">
            <span className="stats-inline-value">{activeWeeks}</span>
            <span className="stats-inline-label">{t('stats_active_weeks')}</span>
          </div>
          <div className="stats-inline-metric">
            <span className="stats-inline-value">%{streakRatio}</span>
            <span className="stats-inline-label">{t('stats_consistency_rate')}</span>
          </div>
          <div className="stats-inline-metric">
            <span className="stats-inline-value">
              {busiestDay.date ? monthFormatter.format(new Date(busiestDay.date)) : '-'}
            </span>
            <span className="stats-inline-label">{t('stats_peak_date')}</span>
          </div>
        </div>
        <div className="contrib-grid" aria-hidden="true">
          {cells.map((c, i) => (
            <div key={i} className={`contrib-cell${c.level > 0 ? ' l' + c.level : ''}`} title={c.date + ': ' + c.count + ' commits'} />
          ))}
        </div>
        <p className="stats-summary">{total} {t('contrib_total')}</p>
      </div>

      <div className="stats-block">
        <p className="stats-block-title">{t('recent_commits_title')}</p>
        <RecentCommits />
      </div>
    </Section>
  );
}

function Projects() {
  const { t } = useI18n();
  const tengraStars = repoStats[0]?.stars ?? '?';
  const tengraForks = repoStats[0]?.forks ?? '?';
  const xfilterStars = repoStats[1]?.stars ?? '?';
  const projects = [
    {
      title: 'XFilter',
      desc: t('xfilter_desc'),
      tech: ['JavaScript', 'Chrome API'],
      metric: xfilterStars,
      metricLabel: t('project_stars'),
      href: 'https://github.com/alztrk/xfilter',
    },
    {
      title: 'Tengra Marketplace',
      desc: t('market_desc'),
      tech: ['JavaScript', 'GitHub Actions', 'JSON'],
      metric: t('project_live_registry'),
      metricLabel: t('project_role'),
      href: 'https://github.com/TengraStudio/tengra-market',
    },
    {
      title: 'Job Finder Plugin',
      desc: t('jobfinder_desc'),
      tech: ['TypeScript', 'AI', 'Plugin SDK'],
      metric: t('project_ai_plugin'),
      metricLabel: t('project_role'),
      href: 'https://github.com/TengraStudio/job-finder-plugin',
    },
  ];

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
            <a href="https://github.com/TengraStudio/tengra" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://github.com/TengraStudio/tengra/releases" target="_blank" rel="noreferrer" className="btn-link">{t('download')}</a>
          </div>
        </div>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article key={project.title} className="project-card project-card-secondary">
            <div className="project-content">
              <div className="project-card-topline">
                <span className="project-mini-label">{project.metricLabel}</span>
                <span className="project-mini-metric">{project.metric}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <div className="project-tech">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
              <div className="project-links">
                <a href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href={project.href} target="_blank" rel="noreferrer" className="btn-link">{t('project_open')}</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function RecentCommits() {
  const { t, lang } = useI18n();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCommits() {
      try {
        const eventsResponse = await fetch('https://api.github.com/users/alztrk/events/public?per_page=100');
        const events = await eventsResponse.json();
        const pushEvents = (Array.isArray(events) ? events : [])
          .filter((event) => event.type === 'PushEvent' && event.repo?.name && event.payload?.head)
          .slice(0, 10);

        const commitResults = await Promise.all(
          pushEvents.map(async (event) => {
            const repo = event.repo.name;
            const sha = event.payload.head;
            const branch = event.payload.ref?.replace('refs/heads/', '') || 'main';
            const commitResponse = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`);
            const commitData = await commitResponse.json();
            const message = commitData.commit?.message || t('recent_commits_fallback');
            const [title, ...rest] = message.split('\n');

            return {
              sha,
              shortSha: sha.slice(0, 7),
              repo,
              branch,
              title,
              body: rest.join(' ').trim(),
              url: commitData.html_url || `https://github.com/${repo}/commit/${sha}`,
              date: commitData.commit?.author?.date || event.created_at,
            };
          })
        );

        if (!cancelled) setCommits(commitResults);
      } catch {
        if (!cancelled) setCommits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCommits();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [lang]
  );

  if (loading) {
    return <p className="activity-empty">{t('loading')}</p>;
  }

  if (!commits.length) {
    return <p className="activity-empty">{t('activity_empty')}</p>;
  }

  return (
    <div className="commit-list">
      {commits.map((commit, index) => (
        <a key={`${commit.sha}-${index}`} href={commit.url} target="_blank" rel="noreferrer" className="commit-card">
          <div className="commit-card-head">
            <span className="commit-repo">{commit.repo}</span>
            <span className="commit-sha">{commit.shortSha}</span>
          </div>
          <p className="commit-title">{commit.title}</p>
          {commit.body ? <p className="commit-body">{commit.body}</p> : null}
          <div className="commit-meta">
            <span>{commit.branch}</span>
            <span>{formatter.format(new Date(commit.date))}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function Writing() {
  const { t } = useI18n();
  const [lcData, setLcData] = useState({ rank: '-', solved: '-' });

  useEffect(() => {
    fetch('https://alfa-leetcode-api.onrender.com/alz_trk').then(r => r.json()).then(d => {
      if (d.ranking) setLcData({ rank: '#' + d.ranking.toLocaleString(), solved: t('lc_active_label') });
    }).catch(() => {});
  }, [t]);

  return (
    <Section id="posts" num="04" title={t('posts_title')}>
      <p className="section-intro">{t('posts_intro')}</p>
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
        <a href="https://huggingface.co/alztrk" target="_blank" className="writing-card" rel="noreferrer">
          <div className="writing-icon brand-icon-wrap"><img src={huggingFaceLogo} alt="" className="brand-icon brand-icon-hf" /></div>
          <h3>Hugging Face</h3>
          <p>{t('huggingface_desc')}</p>
          <span className="writing-link">alztrk</span>
        </a>
        <a href="https://leetcode.com/u/alz_trk/" target="_blank" className="writing-card" rel="noreferrer">
          <div className="writing-icon brand-icon-wrap"><LeetCodeIcon className="brand-icon brand-icon-lc" /></div>
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
        <a href="https://twitter.com/alz_trk" target="_blank" rel="noreferrer" className="btn btn-primary">{t('contact_btn')}</a>
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
          <a href="https://huggingface.co/alztrk" target="_blank" rel="noreferrer" aria-label="Hugging Face">
            <img src={huggingFaceLogo} alt="" className="footer-brand-icon footer-brand-icon-hf" />
          </a>
          <a href="https://leetcode.com/u/alz_trk/" target="_blank" rel="noreferrer" aria-label="LeetCode">
            <LeetCodeIcon className="footer-brand-icon footer-brand-icon-lc" />
          </a>
        </div>
        <p className="footer-text">{t('footer_made')}</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <I18nProvider>
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
        <Writing />
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
      <ProgressBar />
      <BackToTop />
    </I18nProvider>
  );
}

function ProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const fn = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    fn();
    window.addEventListener('scroll', fn);
    window.addEventListener('resize', fn);
    return () => {
      window.removeEventListener('scroll', fn);
      window.removeEventListener('resize', fn);
    };
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

