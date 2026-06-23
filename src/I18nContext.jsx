import { createContext, useContext, useState, useEffect } from 'react';
import { en, tr } from './i18n';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('lang');
    if (stored) return stored;
    return navigator.language?.startsWith('tr') ? 'tr' : 'en';
  });

  const texts = lang === 'tr' ? tr : en;

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => texts[key] || key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
