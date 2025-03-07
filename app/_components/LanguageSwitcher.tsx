"use client";

import { useLanguage } from "@/app/_context/LanguageContext";

const LanguageSwitcher = () => {
  const languageContext = useLanguage();
  const switchLanguage = languageContext?.switchLanguage;
  const selectedLanguage = languageContext?.language;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switchLanguage(event.target.value as "en" | "am");
  };

  return (
    <div className="relative inline-block">
      <select
        value={selectedLanguage}
        onChange={(e) => handleChange(e)}
        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        <option value="en">English</option>
        <option value="am">አማርኛ</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
