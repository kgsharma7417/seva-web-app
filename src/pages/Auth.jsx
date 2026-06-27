import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isWorker, setIsWorker] = useState(false);
  const [workerService, setWorkerService] = useState('ac-repair');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle, currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  React.useEffect(() => {
    // Only auto-redirect if user visits /auth while already logged in
    // and not actively submitting a form
    if (currentUser && userRole && !loading) {
      if (userRole === 'worker') {
        navigate('/worker-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, userRole, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password, isWorker);
        navigate(isWorker ? '/worker-dashboard' : '/dashboard');
      } else {
        await signup(email, password, name, isWorker, workerService);
        navigate(isWorker ? '/worker-dashboard' : '/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle(isWorker);
      navigate(isWorker ? '/worker-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to authenticate with Google');
    }
    setLoading(false);
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] flex items-center justify-center p-4 relative overflow-hidden font-inter transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="bg-grid absolute inset-0 opacity-20 dark:opacity-10"></div>
        <div className="orb bg-[#3B82F6]/20 w-[500px] h-[500px] top-[-250px] right-[-250px]"></div>
        <div className="orb bg-[#06B6D4]/20 w-[400px] h-[400px] bottom-[-200px] left-[-200px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="text-4xl font-syne font-bold tracking-tight text-gray-900 dark:text-white mb-2 cursor-pointer" onClick={() => navigate('/')}>
            Seva<span className="text-[#06B6D4]">.</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Your trusted hyperlocal service marketplace</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl border-gray-200 dark:border-white/5 animate-fade-up animate-delay-100 bg-white/90 dark:bg-white/5">
          
          {/* User Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-6">
            <button
              onClick={() => setIsWorker(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isWorker ? 'bg-white dark:bg-[#3B82F6] text-[#3B82F6] dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Customer
            </button>
            <button
              onClick={() => setIsWorker(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isWorker ? 'bg-white dark:bg-[#10B981] text-[#10B981] dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Worker
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isLogin 
              ? (isWorker ? 'Worker Login' : t('auth_welcome')) 
              : (isWorker ? 'Register as Worker' : t('auth_create'))}
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{t('auth_fullname')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {!isLogin && isWorker && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Your Service Area</label>
                <div className="relative">
                  <select
                    value={workerService}
                    onChange={(e) => setWorkerService(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all appearance-none"
                  >
                    <option value="ac-repair">AC Repair</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{t('auth_email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{t('auth_password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* The checkbox is replaced by the tabs above */}

            <button 
              disabled={loading}
              type="submit" 
              className="w-full mt-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-medium rounded-xl py-4 hover:scale-[1.02] transition-transform shadow-lg shadow-[#3B82F6]/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? t('auth_processing') : (isLogin ? t('auth_signin') : t('auth_signup_btn'))}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">{t('auth_or_continue')}</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4 bg-white dark:bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl py-3.5 px-4 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 border border-gray-200 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('auth_google')}
          </button>

          <button 
            onClick={handleGuestLogin}
            className="w-full mb-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium rounded-xl py-3.5 px-4 transition-colors flex items-center justify-center gap-3"
          >
            {t('auth_guest')}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? t('auth_no_account') + " " : t('auth_has_account') + " "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[#3B82F6] hover:text-blue-700 dark:hover:text-white font-medium transition-colors"
            >
              {isLogin ? t('auth_signup_link') : t('auth_login_link')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
