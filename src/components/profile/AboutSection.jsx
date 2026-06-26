import React, { memo } from 'react';
import { Check } from 'lucide-react';

const AboutSection = memo(({ bio, skills, languages }) => {
  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-up animate-delay-200">
      <h2 className="text-xl font-syne font-bold text-white mb-4">About</h2>
      <p className="text-gray-400 leading-relaxed mb-8">{bio}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Core Skills</h3>
          <ul className="space-y-3">
            {skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-300">
                <div className="w-5 h-5 rounded-full bg-[#3B82F6]/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#3B82F6]" />
                </div>
                {skill}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang, index) => (
              <span key={index} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

AboutSection.displayName = 'AboutSection';
export default AboutSection;
