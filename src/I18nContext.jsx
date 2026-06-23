import { useCallback, useEffect, useState } from 'react';
import { en, tr } from './i18n';
import { I18nContext } from './i18n-context';

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('lang');
    if (stored) return stored;
    return navigator.language?.startsWith('tr') ? 'tr' : 'en';
  });

  const texts = lang === 'tr' ? tr : en;
  const t = useCallback((key) => texts[key] || key, [texts]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.title = t('title');
  }, [lang, t]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}
