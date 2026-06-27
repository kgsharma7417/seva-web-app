import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LogOut, User, Sun, Moon, Globe, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto animate-fade-up relative">
      <button onClick={() => navigate('/')} className="text-xl sm:text-2xl font-syne font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-80 transition-opacity focus:outline-none">
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
        <button onClick={() => navigate('/listing')} className="hidden sm:block text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-white/10 transition-all rounded-lg px-5 py-2.5 hover:scale-105">
          {t('nav_book')}
        </button>
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#060D1F] border-b border-gray-200 dark:border-white/10 shadow-lg md:hidden z-40 animate-fade-down">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <a href="#" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">Services</a>
            <a href="#" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">Cities</a>
            <a href="#" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">Workers</a>
            <a href="#" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">About</a>
            
            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/listing'); }} className="mt-4 w-full text-center text-sm font-medium text-white bg-[#3B82F6] rounded-xl px-5 py-3 shadow-lg">
              {t('nav_book')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
