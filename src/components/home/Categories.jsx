import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">Browse</h2>
      <h3 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('cat_title')}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: t('cat_ac'), icon: '❄️', workers: '320' },
          { title: t('cat_electrical'), icon: '⚡', workers: '180' },
          { title: t('cat_plumbing'), icon: '🔧', workers: '210' },
          { title: t('cat_cleaning'), icon: '🧹', workers: '95' },
        ].map((category, i) => (
          <div 
            key={i} 
            onClick={() => navigate('/listing')}
            className="glass-card category-card rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
            <div className="font-medium text-gray-900 dark:text-white mb-1">{category.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{category.workers} {t('nav_workers')}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
