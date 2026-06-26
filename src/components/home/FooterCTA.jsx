import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const FooterCTA = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="max-w-4xl mx-auto px-4 py-20 pb-32">
      <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6]/10 to-transparent opacity-50"></div>
        <h3 className="font-syne text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">{t('cta_title')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 relative z-10">{t('cta_subtitle')}</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button onClick={() => navigate('/listing')} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-colors shadow-lg shadow-[#3B82F6]/25 hover:scale-105 transform">
            {t('cta_book')}
          </button>
          <button onClick={() => navigate('/auth')} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
            {t('cta_worker')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
