import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogOut, User, Sun, Moon, Globe } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto animate-fade-up">
      <button onClick={() => navigate('/')} className="text-2xl font-syne font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-80 transition-opacity focus:outline-none">
        Seva<span className="text-[#06B6D4]">.</span>
      </button>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Services</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cities</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Workers</a>
        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Language Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition-colors">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline uppercase">{lang}</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-[#060D1F] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            <button onClick={() => setLang('en')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${lang === 'en' ? 'text-[#3B82F6] font-bold' : 'text-gray-700 dark:text-gray-300'}`}>English</button>
            <button onClick={() => setLang('hi')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${lang === 'hi' ? 'text-[#3B82F6] font-bold' : 'text-gray-700 dark:text-gray-300'}`}>हिंदी</button>
            <button onClick={() => setLang('br')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${lang === 'br' ? 'text-[#3B82F6] font-bold' : 'text-gray-700 dark:text-gray-300'}`}>ब्रज भाषा</button>
          </div>
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition-colors">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {currentUser ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (userRole === 'admin') navigate('/admin');
                else if (userRole === 'worker') navigate('/worker-dashboard');
                else navigate('/dashboard');
              }}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-white/20">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              )}
              <span className="hidden sm:inline">{currentUser.displayName || 'Profile'}</span>
            </button>
            <button onClick={async () => { await logout(); navigate('/'); }} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/auth')} className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors px-4 py-2">
            {t('nav_login')}
          </button>
        )}
        <button onClick={() => navigate('/listing')} className="text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-white/10 transition-all rounded-lg px-5 py-2.5 hover:scale-105">
          {t('nav_book')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
