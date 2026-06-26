import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BookingPanel = ({ workerId, price, responseTime }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 sticky top-24 animate-fade-up animate-delay-400">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Starting from</p>
          <div className="text-3xl font-syne font-bold text-gray-900 dark:text-white">{price}</div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Per hour</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-xl p-4 mb-8">
        <Zap className="w-5 h-5 text-[#3B82F6]" />
        <div>
          <p className="text-gray-900 dark:text-white text-sm font-medium">Fast Response</p>
          <p className="text-[#3B82F6] text-xs">Usually replies in ~{responseTime}</p>
        </div>
      </div>
      
      <button onClick={() => navigate(`/booking/${workerId}`)} className="w-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-medium rounded-xl py-4 hover:scale-[1.02] transition-transform shadow-lg shadow-[#3B82F6]/25 flex items-center justify-center gap-2 mb-4">
        {t('workers_book_btn')} <Zap className="w-4 h-4 fill-white" />
      </button>
      
      <button className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium rounded-xl py-4 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
        Send Message
      </button>
      
      <p className="text-center text-xs text-gray-500 mt-6">
        You won't be charged until the booking is confirmed.
      </p>
    </div>
  );
};

export default BookingPanel;
