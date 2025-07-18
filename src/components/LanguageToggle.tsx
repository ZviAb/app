import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 ${
        isRTL ? 'flex-row-reverse' : ''
      }`}
      title={language === 'en' ? 'Switch to Hebrew' : 'עבור לאנגלית'}
    >
      <Globe className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
      <span className="font-semibold">
        {language === 'en' ? 'עב' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;