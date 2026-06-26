import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Homepage from './pages/Homepage';
import WorkerProfile from './pages/WorkerProfile';
import ServiceListing from './pages/ServiceListing';
import UserDashboard from './pages/UserDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReviewForm from './pages/ReviewForm';
import BookingFlow from './pages/BookingFlow';
import './index.css';

// Floating Navigation Helper (useful for development/prototyping)
const FloatingNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-4 right-4 z-[999] flex flex-wrap gap-2 glass-card p-2 rounded-2xl shadow-xl border-[#3B82F6]/30 bg-[#060D1F]/90 backdrop-blur-xl max-w-[90vw]">
      <Link to="/" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>Home</Link>
      <Link to="/listing" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/listing' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>Listing</Link>
      <Link to="/worker" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/worker' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>Worker Profile</Link>
      <Link to="/dashboard" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/dashboard' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>User Dash</Link>
      <Link to="/worker-dashboard" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/worker-dashboard' ? 'bg-[#10B981] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>Worker Dash</Link>
      <Link to="/admin" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/admin' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>Admin Panel</Link>
      <Link to="/review" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/review' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>Rate Service</Link>
      <Link to="/booking" className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${currentPath === '/booking' ? 'bg-[#3B82F6] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>Booking Flow</Link>
    </div>
  );
};

// ScrollToTop Component to handle scrolling to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import AuthPage from './pages/Auth';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/listing" element={<ServiceListing />} />
              <Route path="/worker" element={<WorkerProfile />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/worker-dashboard" element={<WorkerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/review" element={<ReviewForm />} />
              <Route path="/booking" element={<BookingFlow />} />
            </Routes>
            <FloatingNav />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
