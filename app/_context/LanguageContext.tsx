"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type LanguageContextType = {
  language: "en" | "am";
  switchLanguage: (lang: "en" | "am") => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: { [key: string]: { [key: string]: string } } = {
  en: require("@/app/_locales/en.json"),
  am: require("@/app/_locales/am.json"),
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<"en" | "am">("en");

  const switchLanguage = (lang: "en" | "am") => {
    setLanguage(lang);
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
