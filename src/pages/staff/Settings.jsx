import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../stores/languageStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Sun, Moon, Globe } from 'lucide-react';

const StaffSettings = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('settings.appearance')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                {t('settings.theme')}
              </label>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Button
                  variant={theme === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className="flex items-center"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  {t('settings.lightMode')}
                </Button>
                <Button
                  variant={theme === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => theme === 'light' && toggleTheme()}
                  className="flex items-center"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  {t('settings.darkMode')}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('settings.language')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Select Language
              </label>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Button
                  variant={language === 'en' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('en')}
                  className="flex items-center"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  English
                </Button>
                <Button
                  variant={language === 'ar' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('ar')}
                  className="flex items-center"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  العربية
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StaffSettings;