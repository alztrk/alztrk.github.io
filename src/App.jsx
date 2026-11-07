import React, { useEffect, useState } from 'react';
import { I18nProvider } from './I18nContext';
import { useI18n } from './useI18n';
import repoStats from './repos.json';
import './App.css';

function ThemeToggle() {
  const { t } = useI18n();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 't' || e.key === 'T') {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        setDark((prev) => !prev);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <button
      className="theme-btn"
      type="button"
      onClick={() => setDark(!dark)}
      aria-label={t('toggle_theme')}
      title={`${t('toggle_theme')} (t)`}
    >
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

function Header() {
  const { lang, setLang } = useI18n();

  return (
    <header className="page-header">
      <div className="header-inner">
        <a href="/" className="header-brand">
          alican öztürk
        </a>

        <div className="header-controls">
          <div className="lang-switch">
            <button
              type="button"
              className={`lang-link ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              en
            </button>
            <span className="lang-sep">/</span>
            <button
              type="button"
              className={`lang-link ${lang === 'tr' ? 'active' : ''}`}
              onClick={() => setLang('tr')}
            >
              tr
            </button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Intro() {
  const { t } = useI18n();

  return (
    <section className="intro-section">
      <h1 className="hero-name">Alican Öztürk</h1>
      <p className="hero-lead">
        <em>{t('intro_lead')}</em> {t('intro_desc')}
      </p>

      <div className="inline-links">
        <a href="https://github.com/alztrk" target="_blank" rel="noreferrer" className="link-item">
          github ↗
        </a>
        <a href="https://twitter.com/alz_trk" target="_blank" rel="noreferrer" className="link-item">
          x (twitter) ↗
        </a>
        <a href="https://huggingface.co/alztrk" target="_blank" rel="noreferrer" className="link-item">
          hugging face ↗
        </a>
        <a href="https://leetcode.com/u/alz_trk/" target="_blank" rel="noreferrer" className="link-item">
          leetcode ↗
        </a>
      </div>
    </section>
  );
}

function Projects() {
  const { t } = useI18n();
  const [projects, setProjects] = useState(repoStats);

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        const res = await fetch('https://api.github.com/users/alztrk/repos?per_page=100&sort=pushed');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data) || cancelled) return;

        const ignored = new Set(['alztrk', 'alztrk.github.io']);
        const mapped = data
          .filter((repo) => !repo.fork && !ignored.has(repo.name))
          .map((repo) => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            url: repo.html_url,
            homepage: repo.homepage || null,
            pushed_at: repo.pushed_at,
          }))
          .sort((a, b) => (b.stars - a.stars) || (new Date(b.pushed_at) - new Date(a.pushed_at)));

        if (!cancelled && mapped.length > 0) {
          setProjects(mapped);
        }
      } catch {
        // Keeps repoStats safely
      }
    }

    fetchRepos();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayList = projects.filter((p) => p.description || p.stars > 0).slice(0, 8);

  return (
    <section className="content-section">
      <h2 className="section-title">{t('projects_title')}</h2>
      <div className="project-list">
        {displayList.map((project) => (
          <article key={project.name} className="project-row">
            <div className="project-row-main">
              <a href={project.url} target="_blank" rel="noreferrer" className="project-name-link">
                <span className="project-title">{project.name}</span>
                <span className="external-arrow">↗</span>
              </a>
              {project.description && (
                <p className="project-summary">{project.description}</p>
              )}
            </div>
            <div className="project-meta-col">
              {project.language && (
                <span className="project-lang">{project.language}</span>
              )}
              {project.stars > 0 && (
                <span className="project-stars">★ {project.stars}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  const { t } = useI18n();

  return (
    <section className="content-section">
      <h2 className="section-title">{t('about_title')}</h2>
      <div className="prose">
        <p>{t('about_p1')}</p>
        <p>{t('about_p2')}</p>
      </div>
    </section>
  );
}

function Elsewhere() {
  const { t } = useI18n();

  const links = [
    { label: 'GitHub', desc: 'Code repositories and open source projects', href: 'https://github.com/alztrk', handle: 'alztrk' },
    { label: 'X (Twitter)', desc: 'Engineering notes and public updates', href: 'https://twitter.com/alz_trk', handle: '@alz_trk' },
    { label: 'Hugging Face', desc: 'Datasets, models, and machine learning experiments', href: 'https://huggingface.co/alztrk', handle: 'alztrk' },
    { label: 'LeetCode', desc: 'Algorithms and problem solving practice', href: 'https://leetcode.com/u/alz_trk/', handle: 'alz_trk' },
    { label: 'LinkedIn', desc: 'Professional background and contact', href: 'https://linkedin.com/in/alz-trk', handle: 'alz-trk' },
  ];

  return (
    <section className="content-section">
      <h2 className="section-title">{t('elsewhere_title')}</h2>
      <div className="elsewhere-list">
        {links.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="elsewhere-item">
            <span className="elsewhere-title">{item.label}</span>
            <span className="elsewhere-desc">{item.desc}</span>
            <span className="elsewhere-handle">{item.handle} ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="page-footer">
      <div className="footer-line">
        <span>&copy; {year} {t('footer_copy')}</span>
        <span className="footer-dot">·</span>
        <span>{t('footer_location')}</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <div className="page-wrapper">
        <Header />
        <main className="main-content">
          <Intro />
          <Projects />
          <About />
          <Elsewhere />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
