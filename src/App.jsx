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
    <div className="fixed bottom-4 right-4 z-[999] flex flex-wrap gap-2 bg-white p-2 rounded-sm shadow-md border border-gray-200 max-w-[90vw]">
      <Link to="/" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/' ? 'bg-[#2874f0] text-white' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>Home</Link>
      <Link to="/listing" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/listing' ? 'bg-[#2874f0] text-white' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>Listing</Link>
      <Link to="/worker" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/worker' ? 'bg-[#2874f0] text-white' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>Worker Profile</Link>
      <Link to="/dashboard" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/dashboard' ? 'bg-[#2874f0] text-white' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>User Dash</Link>
      <Link to="/worker-dashboard" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/worker-dashboard' ? 'bg-[#10B981] text-white' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>Worker Dash</Link>
      <Link to="/admin" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/admin' ? 'bg-[#8B5CF6] text-white' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>Admin Panel</Link>
      <Link to="/review" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/review' ? 'bg-yellow-500 text-black' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>Rate Service</Link>
      <Link to="/booking" className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${currentPath === '/booking' ? 'bg-[#2874f0] text-white' : 'text-gray-600 hover:text-white hover:bg-[#2874f0]'}`}>Booking Flow</Link>
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
import { LocationProvider } from './context/LocationContext';
import AuthPage from './pages/Auth';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LocationProvider>
          <AuthProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/listing" element={<ServiceListing />} />
                <Route path="/worker" element={<WorkerProfile />} />
                <Route path="/worker/:id" element={<WorkerProfile />} />
                <Route path="/review" element={<ReviewForm />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['customer', 'user', 'worker']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/worker-dashboard" element={
                  <ProtectedRoute allowedRoles={['worker']}>
                    <WorkerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/booking" element={
                  <ProtectedRoute>
                    <BookingFlow />
                  </ProtectedRoute>
                } />
                
                <Route path="/booking/:id" element={
                  <ProtectedRoute>
                    <BookingFlow />
                  </ProtectedRoute>
                } />
              </Routes>
              <FloatingNav />
            </Router>
          </AuthProvider>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
