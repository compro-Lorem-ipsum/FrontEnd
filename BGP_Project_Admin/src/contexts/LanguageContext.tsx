import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'id' | 'en';

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact Us'
  },
  id: {
    'nav.home': 'Beranda',
    'nav.about': 'Tentang Kami',
    'nav.services': 'Layanan',
    'nav.projects': 'Proyek',
    'nav.faq': 'FAQ',
    'nav.contact': 'Hubungi Kami'
  }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
