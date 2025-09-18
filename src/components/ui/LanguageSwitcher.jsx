import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../stores/languageStore';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {language.toUpperCase()}
      </span>
    </motion.button>
  );
};

export default LanguageSwitcher;