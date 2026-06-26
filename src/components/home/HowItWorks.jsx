import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">Process</h2>
      <h3 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-12">{t('hiw_title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Arrows for large screens */}
        <div className="hidden md:block absolute top-12 left-[25%] w-[16%] h-[2px] bg-gradient-to-r from-[#3B82F6]/50 to-transparent"></div>
        <div className="hidden md:block absolute top-12 left-[58%] w-[16%] h-[2px] bg-gradient-to-r from-[#3B82F6]/50 to-transparent"></div>
        
        {[
          { num: '01', title: t('hiw_step1_title'), desc: t('hiw_step1_desc') },
          { num: '02', title: t('hiw_step2_title'), desc: t('hiw_step2_desc') },
          { num: '03', title: t('hiw_step3_title'), desc: t('hiw_step3_desc') }
        ].map((step, i) => (
          <div key={i} className="glass-card rounded-2xl p-8 relative overflow-hidden group">
            <div className="text-6xl font-syne font-bold text-gray-100 dark:text-white/5 absolute -top-4 -right-4 group-hover:scale-110 transition-transform">
              {step.num}
            </div>
            <div className="text-4xl font-syne font-bold text-[#3B82F6] mb-4 relative z-10">{step.num}</div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 relative z-10">{step.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
