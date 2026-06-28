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
    <div className="w-full bg-white text-gray-900 shadow-sm border-b border-gray-200 z-50 relative">
      <nav className="flex items-center justify-between px-4 sm:px-8 py-3 max-w-7xl mx-auto relative">
        <button onClick={() => navigate('/')} className="text-xl sm:text-2xl font-bold tracking-tight text-[#2a55e5] hover:opacity-90 transition-opacity focus:outline-none flex items-center">
          <span className="italic">Seva</span><span className="text-[#ff9f00]">.</span>
        </button>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-[#2a55e5] hover:underline transition-all">Services</a>
          <a href="#" className="hover:text-[#2a55e5] hover:underline transition-all">Cities</a>
          <a href="#" className="hover:text-[#2a55e5] hover:underline transition-all">Workers</a>
          <a href="#" className="hover:text-[#2a55e5] hover:underline transition-all">About</a>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Language Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline uppercase">{lang}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white text-gray-800 border border-gray-200 rounded-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <button onClick={() => setLang('en')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${lang === 'en' ? 'text-[#2874f0] font-bold' : 'text-gray-700'}`}>English</button>
              <button onClick={() => setLang('hi')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${lang === 'hi' ? 'text-[#2874f0] font-bold' : 'text-gray-700'}`}>हिंदी</button>
              <button onClick={() => setLang('br')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${lang === 'br' ? 'text-[#2874f0] font-bold' : 'text-gray-700'}`}>ब्रज भाषा</button>
            </div>
          </div>

          {/* Theme Toggle (Kept for functionality, but stylized to fit Flipkart) */}
          <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
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
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#2a55e5] transition-colors"
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <span className="hidden sm:inline">{currentUser.displayName || 'Profile'}</span>
              </button>
              <button onClick={async () => { await logout(); navigate('/'); }} className="text-gray-500 hover:text-red-500 p-2 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} className="text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-sm transition-colors px-4 py-2">
              {t('nav_login')}
            </button>
          )}
          <button onClick={() => navigate('/listing')} className="hidden sm:block text-sm font-bold text-white bg-[#2a55e5] hover:bg-[#1f42b3] transition-colors rounded-xl px-5 py-2 shadow-sm">
            {t('nav_book')}
          </button>
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg md:hidden z-40">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col text-gray-800">
              <a href="#" className="block px-4 py-3 rounded-sm text-base font-medium hover:bg-gray-50">Services</a>
              <a href="#" className="block px-4 py-3 rounded-sm text-base font-medium hover:bg-gray-50">Cities</a>
              <a href="#" className="block px-4 py-3 rounded-sm text-base font-medium hover:bg-gray-50">Workers</a>
              <a href="#" className="block px-4 py-3 rounded-sm text-base font-medium hover:bg-gray-50">About</a>
              
              <button onClick={() => { setIsMobileMenuOpen(false); navigate('/listing'); }} className="mt-4 w-full text-center text-sm font-bold text-white bg-[#ff9f00] rounded-sm px-5 py-3 shadow-sm">
                {t('nav_book')}
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
