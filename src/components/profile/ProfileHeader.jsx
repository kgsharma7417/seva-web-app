import React, { memo } from 'react';
import { Star, CheckCircle, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ProfileHeader = memo(({ worker }) => {
  const { t } = useLanguage();
  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden animate-fade-up animate-delay-100">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-xl shadow-[#3B82F6]/20 shrink-0">
          {worker.initials}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-syne font-bold text-gray-900 dark:text-white">{worker.name}</h1>
            <div className="inline-flex items-center gap-1.5 bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-medium border border-[#10B981]/20 w-fit">
              <CheckCircle className="w-3.5 h-3.5" /> Verified
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{worker.skill} • {worker.experience} Experience</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white">{worker.rating}</span>
              <span className="text-gray-500">({worker.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#06B6D4]" />
              {worker.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#3B82F6]" />
              {worker.jobsCompleted} Jobs Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';
export default ProfileHeader;
