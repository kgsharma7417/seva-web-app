import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="pt-24 pb-16 px-4 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
      <div className="animate-fade-up animate-delay-100 inline-flex items-center space-x-2 bg-gray-100 border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-full px-4 py-1.5 mb-8">
        <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse"></span>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Available in your city</span>
      </div>
      
      <h1 className="animate-fade-up animate-delay-200 font-syne text-5xl md:text-7xl font-bold leading-tight mb-8 text-gray-900 dark:text-white">
        {t('hero_title_1')}<br />
        {t('hero_title_2')} <span className="text-gradient">{t('hero_title_3')}</span>
      </h1>
      
      <p className="animate-fade-up animate-delay-300 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
        {t('hero_subtitle')}
      </p>

      {/* Search Bar */}
      <div className="animate-fade-up animate-delay-300 w-full max-w-2xl relative mb-8 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#3B82F6] transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder={t('search_placeholder')} 
          className="w-full bg-white dark:bg-[#0A132D] border border-gray-200 dark:border-white/10 rounded-2xl py-5 pl-12 pr-40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]/50 focus:ring-4 focus:ring-[#3B82F6]/10 transition-all shadow-lg dark:shadow-none"
        />
        <div className="absolute inset-y-0 right-2 flex items-center space-x-2">
          <div className="hidden sm:flex items-center px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 text-xs text-gray-600 dark:text-gray-400 mr-2">
            <MapPin className="w-3 h-3 mr-1" />
            Agra
          </div>
          <button onClick={() => navigate('/listing')} className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-[#3B82F6]/25 flex items-center font-bold">
            {t('search_btn')}
          </button>
        </div>
      </div>
      
      {/* Quick Select Chips */}
      <div className="animate-fade-up animate-delay-400 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium mr-2">Quick links:</span>
        {['AC Repair', 'Plumbing', 'Electrician', 'Cleaning'].map((chip) => (
          <button key={chip} onClick={() => navigate('/listing')} className="px-4 py-2 rounded-full bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:text-white transition-colors shadow-sm dark:shadow-none">
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
