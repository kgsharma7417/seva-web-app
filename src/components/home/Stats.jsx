import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Stats = () => {
  const { t } = useLanguage();
  return (
    <section className="animate-fade-up animate-delay-500 max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 glass-card rounded-3xl p-8">
        {[
          { label: t('stat_users'), value: '1,200+' },
          { label: t('stat_services'), value: '18K+' },
          { label: t('stat_rating'), value: '4.8★' },
          { label: t('lbl_price'), value: '₹149+' }
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl md:text-3xl font-syne font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
