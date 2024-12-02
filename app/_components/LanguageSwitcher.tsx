"use client";

import { useLanguage } from "@/app/_context/LanguageContext";

const LanguageSwitcher = () => {
  const languageContext = useLanguage();
  const switchLanguage = languageContext?.switchLanguage;
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => switchLanguage("en")}
        className="text-blue-600 hover:underline"
      >
        English
      </button>
      <button
        onClick={() => switchLanguage("am")}
        className="text-blue-600 hover:underline"
      >
        አማርኛ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
