import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, FileText, CheckCircle2, ChevronRight, Menu, X, Bell, LogOut, Wallet, Shield, AlertCircle, Camera, Upload, Calendar as CalendarIcon, Zap, TrendingUp, IndianRupee, Check, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import MapSelector from '../components/common/MapSelector';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { currentUser, userData, updateUserProfile } = useAuth();
  const db = getFirestore(app);
  const storage = getStorage(app);
  const [allBookings, setAllBookings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isIDModalOpen, setIsIDModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    // Listen to bookings assigned to the current user's UID
    const q = query(
      collection(db, 'bookings'),
      where('workerId', '==', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      bList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setAllBookings(bList);
    });

    return () => unsubscribe();
  }, [currentUser, navigate, db]);

  // Derived Data
  const pendingRequests = allBookings.filter(b => b.status === 'pending');
  const schedule = allBookings.filter(b => b.status === 'accepted' || b.status === 'active');
  
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // Derived Data for Worker Profile
  const workerProfile = {
    name: userData?.name || "New Worker",
    skill: userData?.specialty || "Setup your profile",
    rating: userData?.rating || 5.0,
    avatar: userData?.avatar || (userData?.name ? userData.name.substring(0, 2).toUpperCase() : "W"),
    completeness: userData?.hourlyRate ? 100 : 40,
    responseRate: "98%",
    location: userData?.area || "Agra City"
  };

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [workerLocation, setWorkerLocation] = useState(userData?.coordinates || { lat: 27.1767, lng: 78.0081 });

  const handleUpdateLocation = async (loc) => {
    try {
      await updateUserProfile({ coordinates: loc.coordinates, area: loc.name });
    } catch (err) {
      console.error("Failed to save location", err);
    } finally {
      setIsMapOpen(false);
    }
  };

  const handleIDUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please upload an image or PDF file.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `idProofs/${currentUser.uid}_${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        }, 
        (error) => {
          console.error("Upload failed", error);
          alert("Failed to upload document. Try again.");
          setUploading(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateUserProfile({ 
            idProof: true,
            idProofUrl: downloadURL
          });
          setUploading(false);
          setIsIDModalOpen(false);
          alert("ID uploaded successfully!");
        }
      );
    } catch (error) {
      console.error("Upload error", error);
      setUploading(false);
    }
  };

  const completedJobs = allBookings.filter(b => b.status === 'completed');
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfDay - (now.getDay() * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let daily = 0;
  let weekly = 0;
  let monthly = 0;

  completedJobs.forEach(b => {
    const amount = Number(b.totalAmount) || 0;
    const time = b.createdAt?.seconds * 1000 || 0; 
    
    if (time >= startOfDay) daily += amount;
    if (time >= startOfWeek) weekly += amount;
    if (time >= startOfMonth) monthly += amount;
  });

  const walletBalance = userData?.walletBalance || daily + weekly; // Fallback to simulated balance if not in DB
  
  const earnings = { daily, weekly, monthly, walletBalance };

  const handleToggleOnline = async () => {
    try {
      const isCurrentlyOnline = !!userData?.isOnline;
      await updateUserProfile({ isOnline: !isCurrentlyOnline });
      showToast(!isCurrentlyOnline ? "You are now ONLINE" : "You are now OFFLINE");
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  // Play notification sound if pending requests increase
  React.useEffect(() => {
    const pendingCount = allBookings.filter(b => b.status === 'pending').length;
    if (pendingCount > 0) {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Audio play blocked by browser", e));
      } catch (e) {
        console.error(e);
      }
    }
  }, [allBookings]);

  const handleRequestPayout = async () => {
    if (earnings.walletBalance < 500) return;
    try {
      await updateUserProfile({
        walletBalance: 0,
        transactions: [{
          id: 'P' + Date.now(),
          type: 'debit',
          title: 'Payout Request',
          description: 'Bank Transfer (Processing)',
          amount: earnings.walletBalance,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }, ...(userData?.transactions || [])]
      });
      alert(`Payout of ₹${earnings.walletBalance} requested successfully! Money will be credited in 24-48 hours.`);
    } catch (e) {
      console.error(e);
      alert("Failed to process payout.");
    }
  };

  const CircularProgress = ({ value, label, sublabel, colorClass }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:glass-card border border-gray-200 dark:border-white/5 rounded-3xl relative overflow-hidden group shadow-sm dark:shadow-none">
      <div className="absolute inset-0 bg-gray-50 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-gray-200 dark:text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
          <path className={colorClass} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${value}, 100`} />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-syne font-bold text-gray-900 dark:text-white">{value}%</span>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 font-medium mt-4">{label}</p>
      <p className="text-gray-500 text-xs mt-1">{sublabel}</p>
    </div>
  );

  const navConfig = [
    { id: 'overview', label: t('dash_overview'), icon: TrendingUp },
    { id: 'requests', label: t('dash_requests'), icon: Bell, badge: pendingRequests.length },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'earnings', label: t('dash_earnings'), icon: IndianRupee },
    { id: 'profile', label: t('dash_profile'), icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter flex flex-col md:flex-row overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="bg-grid absolute inset-0 opacity-20 dark:opacity-10"></div>
        <div className="orb bg-[#10B981]/5 w-[600px] h-[600px] top-[-100px] right-[-100px]"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#060D1F]/50 backdrop-blur-xl flex-shrink-0 relative z-10 flex flex-col h-auto md:h-screen shadow-sm dark:shadow-none">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#060D1F]/90 backdrop-blur-xl z-20 flex items-center justify-between md:block">
          <div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-syne font-bold text-xl">
              Seva<span className="text-[#10B981]">.</span> Pro
            </div>
            <p className="text-gray-500 text-xs mt-1 hidden md:block">Worker Dashboard</p>
          </div>
        </div>
        
        <div className="p-4 space-y-2 flex md:block overflow-x-auto no-scrollbar gap-2 md:overflow-y-auto">
          {navConfig.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-[#10B981]/10 dark:bg-gradient-to-r dark:from-[#10B981]/20 dark:to-transparent text-[#10B981] md:border-l-2 border-[#10B981]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 md:border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 bg-[#10B981] text-white dark:text-black text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 h-[calc(100vh-140px)] md:h-screen overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
        
        {/* Welcome Profile Bar */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-up">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#10B981]/20">
              {workerProfile.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-syne font-bold text-gray-900 dark:text-white">{workerProfile.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>{workerProfile.skill}</span>
                <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"/> {workerProfile.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
            <button 
              onClick={handleToggleOnline}
              className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition-colors ${
                userData?.isOnline 
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-[#10B981]/25' 
                : 'bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/20'
              }`}
            >
              {userData?.isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
            <div className="bg-gray-50 border border-gray-200 dark:border-white/5 dark:glass-card px-5 py-3 rounded-2xl min-w-[120px] shadow-sm dark:shadow-none">
              <p className="text-gray-500 text-xs mb-1 font-medium">Daily Earnings</p>
              <p className="text-gray-900 dark:text-white font-syne font-bold text-lg">₹{earnings.daily}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 dark:border-white/5 dark:glass-card px-5 py-3 rounded-2xl min-w-[120px] shadow-sm dark:shadow-none">
              <p className="text-gray-500 text-xs mb-1 font-medium">Completed Jobs</p>
              <p className="text-gray-900 dark:text-white font-syne font-bold text-lg">{completedJobs.length} Total</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-white/5 mb-8 overflow-x-auto no-scrollbar hidden md:block">
          <div className="flex gap-2 min-w-max pb-2">
            {navConfig.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-[#10B981]/20'
                      : 'bg-white border border-gray-200 dark:border-transparent dark:glass-card text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none'
                  }`}
                >
                  <tab.icon className="w-4 h-4"/> {tab.label}
                  {tab.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-md text-xs ml-1 ${isActive ? 'bg-white/20' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Quick Actions & Pending Requests */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Pending Requests Alert */}
                {pendingRequests.length > 0 && (
                  <div className="bg-[#10B981]/5 dark:bg-[#10B981]/10 border border-[#10B981]/20 dark:border-[#10B981]/30 rounded-3xl p-6 flex items-start sm:items-center justify-between gap-4 animate-fade-up">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#10B981]/10 dark:bg-[#10B981]/20 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#10B981]">
                        <Bell className="w-6 h-6 animate-bounce" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 dark:text-white font-syne font-bold text-lg">You have {pendingRequests.length} new requests!</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Respond quickly to maintain your 98% response rate.</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('requests')} className="hidden sm:block px-5 py-2.5 bg-[#10B981] text-white dark:text-[#060D1F] font-bold rounded-xl hover:bg-[#059669] hover:text-white transition-colors">
                      View All
                    </button>
                  </div>
                )}

                {/* Today's Schedule Preview */}
                <div className="glass-card rounded-3xl p-6 md:p-8 flex-1 animate-fade-up animate-delay-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-900 dark:text-white font-syne font-bold text-xl flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-[#3B82F6]"/> Today's Schedule
                    </h3>
                    <button onClick={() => setActiveTab('schedule')} className="text-sm text-[#3B82F6] hover:text-[#2563EB] dark:hover:text-white transition-colors font-medium">Full Schedule</button>
                  </div>

                  <div className="space-y-4">
                    {schedule.length === 0 ? (
                      <p className="text-sm text-gray-500 py-4">No accepted jobs yet.</p>
                    ) : schedule.map(job => (
                      <div key={job.id} className="bg-gray-50 border border-gray-200 dark:glass-card dark:border-white/5 rounded-2xl p-5 hover:border-[#3B82F6]/50 dark:hover:border-white/10 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="glass-card rounded-2xl p-4 flex items-center justify-between group">
                            {job.time}
                          </div>
                          <div>
                            <h4 className="text-gray-900 dark:text-white font-bold">{job.service}</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{job.customerName} • {job.address}</p>
                            <span className="inline-block mt-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                              {job.status === 'accepted' ? 'Upcoming' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                           <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 dark:glass-card text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm font-medium shadow-sm dark:shadow-none">Navigate</button>
                           <button onClick={() => handleUpdateStatus(job.id, 'completed')} className="flex-1 md:flex-none px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium">Complete Job</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Stats */}
              <div className="space-y-6 animate-fade-up animate-delay-200">
                <div className="bg-white border border-gray-200 dark:border-transparent dark:glass-card rounded-3xl p-6 border-t-4 border-t-[#10B981] dark:border-t-4 dark:border-t-[#10B981] shadow-sm dark:shadow-none">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Weekly Earnings</p>
                  <h3 className="text-3xl font-syne font-bold text-gray-900 dark:text-white mb-4">₹{earnings.weekly}</h3>
                  
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#10B981] w-[60%]"></div>
                  </div>
                  <p className="text-xs text-gray-500">60% of your ₹14,000 weekly goal</p>
                </div>

                <div className="bg-white border border-gray-200 dark:border-transparent dark:glass-card rounded-3xl p-6 shadow-sm dark:shadow-none">
                  <h3 className="text-gray-900 dark:text-white font-syne font-bold mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Response Rate</span>
                        <span className="text-[#10B981] font-bold">{workerProfile.responseRate}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10B981] w-[98%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Profile Completeness</span>
                        <span className="text-yellow-500 dark:text-yellow-400 font-bold">{workerProfile.completeness}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-[85%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-syne font-bold text-gray-900 dark:text-white">Booking Requests</h3>
                <span className="px-3 py-1 bg-white border border-gray-200 dark:border-transparent dark:bg-white/5 rounded-lg text-sm text-gray-500 dark:text-gray-400 font-medium">{pendingRequests.length} Pending</span>
              </div>
              
              {pendingRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="bg-white border border-gray-200 dark:border-transparent dark:glass-card rounded-3xl p-6 dark:border-white/10 hover:border-[#10B981]/50 dark:hover:border-[#10B981]/50 transition-colors relative overflow-hidden shadow-sm dark:shadow-none">
                      <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-bl-xl border-b border-l border-red-200 dark:border-red-500/20">
                        Expires in {req.expires}
                      </div>
                      
                      <div className="flex justify-between items-start mb-6 mt-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{req.service}</h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {req.time}</p>
                        </div>
                        <p className="text-2xl font-syne font-bold text-[#10B981]">₹{req.amount}</p>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 dark:border-transparent dark:bg-white/5 rounded-2xl p-4 mb-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500 text-xs">Customer</span>
                          <span className="text-gray-900 dark:text-white text-sm font-medium">{req.customerName}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500 text-xs">Location</span>
                          <span className="text-gray-900 dark:text-white text-sm font-medium">{req.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => handleUpdateStatus(req.id, 'cancelled')} className="flex-1 py-3.5 bg-white border border-gray-200 dark:glass-card text-gray-700 dark:text-gray-300 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:border-red-500/30 transition-colors font-bold text-sm flex items-center justify-center gap-2 shadow-sm dark:shadow-none">
                          <X className="w-4 h-4"/> Decline
                        </button>
                        <button onClick={() => handleUpdateStatus(req.id, 'accepted')} className="flex-1 py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:scale-[1.02] transition-transform font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/25">
                          <Check className="w-4 h-4"/> Accept Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-gray-200 dark:border-transparent dark:glass-card rounded-3xl shadow-sm dark:shadow-none">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="text-gray-900 dark:text-white text-lg font-bold">You're all caught up!</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">No pending booking requests right now.</p>
                </div>
              )}
            </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <div className="space-y-8 animate-fade-up">
              {/* Wallet Hero */}
              <div className="bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 dark:from-[#10B981]/20 dark:to-[#059669]/20 rounded-3xl p-8 md:p-10 text-gray-900 dark:text-white relative overflow-hidden bg-white border border-gray-200 dark:glass-card dark:border-[#10B981]/30 shadow-sm dark:shadow-none">
                <div className="absolute right-0 top-0 opacity-10 blur-xl">
                  <IndianRupee className="w-64 h-64 text-[#10B981]" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium tracking-wide">Wallet Balance</p>
                    <h2 className="text-5xl font-syne font-bold tracking-tight text-gray-900 dark:text-white">₹{earnings.walletBalance}</h2>
                  </div>
                  <button 
                    disabled={earnings.walletBalance < 500}
                    onClick={handleRequestPayout}
                    className="px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-[#060D1F] rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-bold text-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Request Payout
                  </button>
                </div>
                {earnings.walletBalance < 500 && (
                  <p className="text-xs text-[#10B981] mt-4 relative z-10">* Minimum ₹500 required for payout request.</p>
                )}
              </div>

              {/* Earnings Breakdown */}
              <div>
                <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-6">Earnings Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:glass-card border border-gray-200 dark:border-transparent rounded-2xl p-6 border-t-2 border-t-[#3B82F6] dark:border-t-2 dark:border-t-[#3B82F6] shadow-sm dark:shadow-none">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Today</p>
                    <p className="text-3xl font-syne font-bold text-gray-900 dark:text-white">₹{earnings.daily}</p>
                    <p className="text-[#10B981] text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% vs yesterday</p>
                  </div>
                  <div className="bg-white dark:glass-card border border-gray-200 dark:border-transparent rounded-2xl p-6 border-t-2 border-t-[#8B5CF6] dark:border-t-2 dark:border-t-[#8B5CF6] shadow-sm dark:shadow-none">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">This Week</p>
                    <p className="text-3xl font-syne font-bold text-gray-900 dark:text-white">₹{earnings.weekly}</p>
                    <p className="text-gray-500 text-xs mt-2">14 Jobs completed</p>
                  </div>
                  <div className="bg-white dark:glass-card border border-gray-200 dark:border-transparent rounded-2xl p-6 border-t-2 border-t-[#10B981] dark:border-t-2 dark:border-t-[#10B981] shadow-sm dark:shadow-none">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">This Month</p>
                    <p className="text-3xl font-syne font-bold text-gray-900 dark:text-white">₹{earnings.monthly}</p>
                    <p className="text-[#10B981] text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Top 10% earner</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE / PERFORMANCE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white">Performance & Profile</h3>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-[#3B82F6]/10 text-[#3B82F6] font-bold rounded-xl hover:bg-[#3B82F6]/20 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <CircularProgress value={85} label="Completeness" sublabel="Add ID proof to reach 100%" colorClass="text-yellow-500 dark:text-yellow-400" />
                  <CircularProgress value={98} label="Response Rate" sublabel="Excellent performance!" colorClass="text-[#10B981]" />
                  
                  <div className="col-span-2 bg-white dark:glass-card border border-gray-200 dark:border-transparent rounded-3xl p-6 flex items-center justify-between shadow-sm dark:shadow-none">
                    <div>
                      <p className="text-gray-900 dark:text-white font-bold mb-1">Average Response Time</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Fast response = Better ranking</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-syne font-bold text-[#3B82F6]">{workerProfile.avgResponseTime}</p>
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="bg-white dark:glass-card border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-none">
                  <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-lg">Profile Checklist</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Basic Details', done: true },
                      { label: 'Profile Picture', done: true },
                      { label: 'Bank Account Linked', done: true },
                      { label: 'Aadhar / ID Verification', done: false },
                      { label: 'Vaccination Certificate', done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#10B981] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-600'}`}>
                          {item.done && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-sm ${item.done ? 'text-gray-500 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>{item.label}</span>
                      </div>
                    ))}
                    {/* ID Proof Entry */}
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${userData?.idProof ? 'bg-[#10B981] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-600'}`}>
                        {userData?.idProof && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">ID Proof</p>
                        <p className="text-xs text-gray-500">{userData?.idProof ? 'Verified' : 'Pending Verification'}</p>
                      </div>
                      <button 
                        onClick={() => setIsIDModalOpen(true)} 
                        className="ml-auto text-xs text-[#3B82F6] hover:text-[#2563EB] dark:hover:text-white font-bold"
                      >
                        {userData?.idProof ? 'View' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location Settings */}
                <div className="bg-white dark:glass-card border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-none col-span-1 md:col-span-2 mt-2">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#3B82F6]" />
                        Service Location
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">Set your operating base so customers can find you</p>
                    </div>
                    <button onClick={() => setIsMapOpen(true)} className="text-sm font-bold text-[#3B82F6]">Change</button>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#060D1F] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#06B6D4]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{workerProfile.location}</p>
                      <p className="text-xs text-gray-500">Lat: {workerLocation.lat.toFixed(4)}, Lng: {workerLocation.lng.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="bg-white dark:glass-card border border-gray-200 dark:border-transparent rounded-3xl p-8 text-center animate-fade-up shadow-sm dark:shadow-none">
              <CalendarIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Calendar View Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">You will soon be able to manage your weekly availability here.</p>
            </div>
          )}

        </div>
        </div>
      </main>

      <MapSelector 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelect={(loc) => { handleUpdateLocation(loc); setIsMapOpen(false); }}
        initialPosition={workerLocation}
      />
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      
      {isIDModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-[#0A132D] p-6 rounded-3xl max-w-sm w-full relative">
            <button onClick={() => setIsIDModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-syne font-bold text-xl mb-2 text-gray-900 dark:text-white">Upload ID Proof</h3>
            <p className="text-gray-500 text-sm mb-6">Please upload your Aadhar Card, PAN Card or Driver's License.</p>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative cursor-pointer group">
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={handleIDUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Upload className="w-10 h-10 text-[#10B981] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-gray-900 dark:text-white font-medium mb-1">
                {uploading ? 'Uploading...' : 'Click or drag file here'}
              </p>
              <p className="text-xs text-gray-500">Supports JPG, PNG, PDF (Max 5MB)</p>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#10B981] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
