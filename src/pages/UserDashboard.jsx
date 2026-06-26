import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, MessageCircle, Heart, Share2, Settings, LogOut, Bell, Wallet, History, Award, TrendingUp, ChevronRight, AlertCircle, CheckCircle2, Clock3, MapPinIcon, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/profile/EditProfileModal';
import IDCardModal from '../components/profile/IDCardModal';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import app from '../firebase';

// ============================================================================
// TYPES
// ============================================================================

// ============================================================================
// MOCK DATA
// ============================================================================

// Removed static mockUserProfile as we now use real data from AuthContext



const mockTransactions = [
  { id: 'T001', type: 'debit', title: 'AC Repair - Ramesh Kumar', description: 'Active booking', amount: 599, date: '15 Mar 2024', bookingId: 'B001' },
  { id: 'T002', type: 'debit', title: 'Plumbing - Suresh', description: 'Completed', amount: 499, date: '10 Mar 2024', bookingId: 'B002' },
  { id: 'T003', type: 'credit', title: 'Referral Bonus', description: 'Friend booking', amount: 100, date: '8 Mar 2024' },
  { id: 'T004', type: 'debit', title: 'Electrical - Arjun', description: 'Completed', amount: 559, date: '5 Mar 2024', bookingId: 'B003' },
  { id: 'T005', type: 'refund', title: 'Cancellation Refund', description: 'Booking cancelled', amount: 299, date: '1 Mar 2024' },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userData, currentUser, userRole, logout, resetPassword } = useAuth();
  
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  const db = getFirestore(app);

  React.useEffect(() => {
    if (currentUser) {
      const q = query(collection(db, 'bookings'), where('customerId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookingsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by most recent
        bookingsList.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        setMyBookings(bookingsList);
      });
      return () => unsubscribe();
    }
  }, [currentUser, db]);

  // Fallback profile if userData is still loading or incomplete
  const profile = {
    name: userData?.name || currentUser?.displayName || 'User',
    phone: userData?.phone || 'Not provided',
    email: userData?.email || currentUser?.email || '',
    city: userData?.city || 'Agra',
    area: userData?.area || 'Taj Ganj',
    avatar: userData?.avatar || (userData?.name ? userData.name.substring(0, 2).toUpperCase() : 'U'),
    memberSince: userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
    totalBookings: 12, // Mocked for now
    averageRating: 4.6, // Mocked for now
  };

  const activeBookings = myBookings.filter(b => b.status === 'active' || b.status === 'pending' || b.status === 'accepted');
  const completedBookings = myBookings.filter(b => b.status === 'completed');
  const totalSpent = myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const walletBalance = userData?.walletBalance || 0;
  const transactions = userData?.transactions || mockTransactions;
  const unreadNotifications = 3;

  const { updateUserProfile } = useAuth();
  
  const handleAddMoney = async () => {
    const amount = prompt("Enter amount to add to wallet (₹):");
    if (amount && !isNaN(amount) && Number(amount) > 0) {
      const numAmount = Number(amount);
      const newTransaction = {
        id: 'T' + Date.now(),
        type: 'credit',
        title: 'Added to Wallet',
        description: 'Self Deposit',
        amount: numAmount,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      
      const newBalance = walletBalance + numAmount;
      const newTransactions = [newTransaction, ...transactions];
      
      try {
        await updateUserProfile({
          walletBalance: newBalance,
          transactions: newTransactions
        });
        alert(`Successfully added ₹${numAmount} to your wallet!`);
      } catch (err) {
        alert("Failed to add money. Please try again.");
      }
    }
  };

  const ProfileSection = () => (
    <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden animate-fade-up">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-6 flex-1 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0 text-white font-bold text-3xl shadow-xl shadow-[#3B82F6]/20">
            {profile.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-syne font-bold text-gray-900 dark:text-white mb-1">{profile.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Member since {profile.memberSince}</p>
            
            <div className="flex gap-8 text-sm mb-5">
              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Location</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#06B6D4]" />
                  {profile.area}, {profile.city}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Contact</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{profile.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-[#3B82F6]/25 text-sm font-medium"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => setIsIdModalOpen(true)}
                className="px-5 py-2.5 glass-card text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium"
              >
                View ID
              </button>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right glass-card px-6 py-4 rounded-2xl">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(profile.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
          </div>
          <p className="text-gray-900 dark:text-white font-syne font-bold text-2xl">{profile.averageRating}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{myBookings.length} total bookings</p>
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      <ProfileSection />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Active Bookings', value: activeBookings.length, icon: Clock3, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border-[#3B82F6]/20' },
              { label: 'Total Spent', value: `₹${totalSpent}`, icon: TrendingUp, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/5 dark:bg-[#06B6D4]/10 border-[#06B6D4]/20' },
              { label: 'Wallet Balance', value: `₹${walletBalance}`, icon: Wallet, color: 'text-[#10B981]', bg: 'bg-[#10B981]/5 dark:bg-[#10B981]/10 border-[#10B981]/20' },
              { label: 'Jobs Completed', value: completedBookings.length, icon: Award, color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 border-[#8B5CF6]/20' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`glass-card rounded-2xl p-6 border ${stat.bg} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-syne font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="animate-fade-up">
            <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3B82F6]" /> Active Bookings
            </h3>
            <div className="space-y-4">
              {activeBookings.length === 0 ? (
                <div className="glass-card p-8 rounded-3xl text-center">
                  <p className="text-gray-500">You have no active bookings.</p>
                </div>
              ) : activeBookings.map((booking, i) => (
                <div key={booking.id || i} className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B82F6]/10 to-[#06B6D4]/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-[#3B82F6]/10 text-[#3B82F6]'}`}>
                          {booking.status}
                        </span>
                        <span className="text-gray-400 text-sm">ID: #{booking.id?.slice(-6).toUpperCase()}</span>
                      </div>
                      
                      <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-4">{booking.service}</h3>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Date & Time</p>
                          <p className="text-gray-900 dark:text-white font-medium flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-[#3B82F6]" /> {booking.date}, {booking.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Worker</p>
                          <p className="text-gray-900 dark:text-white font-medium flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] text-[10px] text-white flex items-center justify-center font-bold">{booking.workerName?.charAt(0) || 'W'}</div>
                            {booking.workerName}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Total Amount</p>
                          <p className="text-[#10B981] font-bold text-lg">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-syne font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
            <button onClick={() => setActiveTab('bookings')} className="text-[#3B82F6] text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {myBookings.slice(0, 3).map((booking, i) => (
              <div key={booking.id || i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-[#3B82F6]/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center flex-shrink-0 font-bold">
                  {booking.workerName?.charAt(0) || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{booking.service}</h4>
                    <span className="text-[#10B981] font-bold text-sm whitespace-nowrap">₹{booking.totalAmount}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-1 truncate">with {booking.workerName}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-400 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {booking.date || 'Soon'}</span>
                    <span className={`px-2 py-0.5 rounded-full capitalize ${booking.status === 'completed' ? 'bg-[#10B981]/10 text-[#10B981]' : (booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-[#3B82F6]/10 text-[#3B82F6]')}`}>{booking.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {myBookings.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Completed Bookings */}
      <div className="animate-fade-up animate-delay-300">
        <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-[#06B6D4]" /> Recent Completed Jobs
        </h3>
        <div className="space-y-4">
          {completedBookings.slice(0, 3).map(booking => (
            <div key={booking.id} className="glass-card rounded-2xl p-5 hover:border-gray-300 dark:hover:border-white/20 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl bg-gray-50 dark:bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl">{booking.serviceIcon}</div>
                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white font-syne font-bold">{booking.workerName}</h4>
                    <p className="text-gray-500 text-xs">{booking.service} • {booking.completedAt}</p>
                  </div>
                  {booking.reviewed && (
                    <div className="hidden sm:flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(booking.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                  )}
                  {!booking.reviewed && (
                    <button className="hidden sm:block px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg text-xs font-medium hover:scale-105 transition-transform">
                      Review
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto">
                   <p className="font-bold text-[#06B6D4]">₹{booking.amount}</p>
                   {!booking.reviewed && (
                    <button className="sm:hidden px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg text-xs font-medium hover:scale-105 transition-transform">
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ========== BOOKINGS TAB ==========
  const BookingsTab = () => (
    <div className="space-y-8 animate-fade-up">
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/5 overflow-x-auto no-scrollbar pb-2">
        {[
          { label: 'All Bookings', count: myBookings.length },
          { label: 'Active', count: activeBookings.length },
          { label: 'Completed', count: completedBookings.length },
        ].map(tab => (
          <button key={tab.label} className="px-5 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium whitespace-nowrap rounded-t-lg">
            {tab.label} <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-md ml-1 text-xs text-gray-700 dark:text-gray-300">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {myBookings.map(booking => (
          <div key={booking.id} className="glass-card rounded-3xl overflow-hidden hover:border-[#3B82F6]/40 dark:hover:border-[#3B82F6]/40 transition-all">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0 font-bold text-white text-xl shadow-lg">
                  {booking.workerName ? booking.workerName.substring(0, 2).toUpperCase() : 'W'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-syne font-bold text-xl text-gray-900 dark:text-white">{booking.workerName || 'Worker'}</h4>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider flex-shrink-0 ${
                      booking.status !== 'completed' 
                        ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]' 
                        : 'bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]'
                    }`}>
                      {booking.status === 'pending' || booking.status === 'accepted' ? 'In Progress' : booking.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{booking.service}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {booking.date}, {booking.time}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-bold text-[#06B6D4] text-2xl mb-1">₹{booking.totalAmount}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                {(booking.status === 'pending' || booking.status === 'accepted') && (
                  <>
                    <button className="flex-1 px-4 py-3 glass-card border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors text-sm font-medium min-w-[140px]">
                      Cancel Booking
                    </button>
                    <button className="flex-1 px-4 py-3 glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium min-w-[140px]">
                      Contact Support
                    </button>
                  </>
                )}
                {booking.status === 'completed' && !booking.reviewed && (
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-[#3B82F6]/25 text-sm font-medium min-w-[140px]">
                    Rate & Review
                  </button>
                )}
                {booking.status === 'completed' && booking.reviewed && (
                  <div className="flex-1 px-4 py-3 glass-card text-gray-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-default min-w-[140px]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Reviewed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== WALLET TAB ==========
  const WalletTab = () => (
    <div className="space-y-8 animate-fade-up">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 rounded-3xl p-8 md:p-10 text-gray-900 dark:text-white relative overflow-hidden glass-card">
        <div className="absolute -right-10 -bottom-10 opacity-10 blur-xl">
          <Wallet className="w-64 h-64 text-[#06B6D4]" />
        </div>
        <div className="relative z-10">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium tracking-wide">Available Balance</p>
          <h2 className="text-5xl font-syne font-bold mb-10 tracking-tight text-gray-900 dark:text-white">₹{walletBalance}</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleAddMoney}
              className="flex-1 px-5 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-[#060D1F] rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-bold text-sm min-w-[140px] shadow-lg dark:shadow-xl"
            >
              Add Money
            </button>
            <button className="flex-1 px-5 py-3.5 glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium text-sm min-w-[140px]">
              Withdraw
            </button>
            <button className="flex-1 px-5 py-3.5 glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium text-sm min-w-[140px]">
              Send to Friend
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-6">Transaction History</h3>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No recent transactions.</p>
          ) : transactions.map((transaction, i) => {
            const isDebit = transaction.type === 'debit';
            const isCredit = transaction.type === 'credit';
            const isRefund = transaction.type === 'refund';

            return (
              <div key={transaction.id} className="glass-card rounded-2xl p-5 hover:border-gray-300 dark:hover:border-white/20 transition-colors animate-fade-up" style={{animationDelay: `${i*50}ms`}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDebit ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20' : isCredit ? 'bg-[#10B981]/10 border border-[#10B981]/20' : 'bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20'
                    }`}>
                      {isDebit && <AlertCircle className="w-5 h-5 text-red-500" />}
                      {isCredit && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                      {isRefund && <Wallet className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{transaction.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{transaction.description}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-1 uppercase tracking-wider">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg whitespace-nowrap ml-4 font-syne ${
                    isDebit ? 'text-red-500 dark:text-red-400' : isCredit ? 'text-[#10B981]' : 'text-yellow-500 dark:text-yellow-400'
                  }`}>
                    {isDebit ? '-' : '+'} ₹{transaction.amount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ========== REVIEWS TAB ==========
  const ReviewsTab = () => (
    <div className="space-y-6 animate-fade-up">
      <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-2">Your Reviews</h3>
      
      {completedBookings.filter(b => b.reviewed).map(booking => (
        <div key={booking.id} className="glass-card rounded-2xl p-6 hover:border-[#3B82F6]/30 dark:hover:border-[#3B82F6]/30 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0 font-bold text-white text-lg shadow-lg">
              {booking.workerName ? booking.workerName.substring(0, 2).toUpperCase() : 'W'}
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 dark:text-white font-syne font-bold text-lg">{booking.workerName}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{booking.service}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1.5"><Clock className="w-3 h-3 inline mr-1" />{booking.date || 'Recent'}</p>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0 glass-card px-4 py-2 rounded-xl w-fit sm:w-auto">
              <div className="flex gap-1 mb-1 justify-start sm:justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(booking.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
              <p className="text-gray-900 dark:text-white font-syne font-bold text-xl">{booking.rating}.0</p>
            </div>
          </div>
          
          {booking.notes && (
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                "{booking.notes}"
              </p>
            </div>
          )}
        </div>
      ))}

      {completedBookings.filter(b => !b.reviewed).length > 0 && (
        <div className="bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-2xl p-6 mt-8">
          <p className="text-[#3B82F6] text-sm font-semibold tracking-wider uppercase mb-4">Pending Reviews</p>
          <div className="space-y-3">
            {completedBookings.filter(b => !b.reviewed).map(booking => (
              <div key={booking.id} className="p-4 glass-card rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{booking.workerName}</p>
                  <p className="text-[#3B82F6] text-xs">{booking.service}</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg text-xs font-medium hover:scale-[1.05] transition-transform">
                  Review Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ========== SETTINGS TAB ==========
  const SettingsTab = () => (
    <div className="space-y-8 max-w-3xl animate-fade-up">
      {/* Account Settings */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-6">Account Settings</h3>
        <div className="space-y-6">
          <div className="pb-6 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Email Address</p>
              <p className="text-gray-500 text-sm">{profile.email}</p>
            </div>
            <button className="text-[#06B6D4] text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors glass-card px-4 py-2 rounded-lg" onClick={() => setIsEditModalOpen(true)}>Change</button>
          </div>
          <div className="pb-6 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Phone Number</p>
              <p className="text-gray-500 text-sm">{profile.phone}</p>
            </div>
            <button className="text-[#06B6D4] text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors glass-card px-4 py-2 rounded-lg" onClick={() => setIsEditModalOpen(true)}>Change</button>
          </div>
          <div className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Password</p>
              <p className="text-gray-500 text-sm">Last changed 3 months ago</p>
            </div>
            <button 
              onClick={async () => {
                if (profile.email) {
                  try {
                    await resetPassword(profile.email);
                    alert("Password reset link sent to your email!");
                  } catch (e) {
                    alert("Failed to send reset email.");
                  }
                }
              }}
              className="text-[#06B6D4] text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors glass-card px-4 py-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-6">Notifications</h3>
        <div className="space-y-5">
          {[
            { label: 'Booking Updates', enabled: true },
            { label: 'Promotions & Offers', enabled: true },
            { label: 'SMS Notifications', enabled: false },
            { label: 'Email Newsletter', enabled: true },
          ].map((pref, i) => (
            <label key={i} className="flex items-center justify-between cursor-pointer p-4 glass-card rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{pref.label}</span>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${pref.enabled ? 'bg-[#3B82F6]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${pref.enabled ? 'left-7' : 'left-1'}`}></div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-3xl p-8">
        <h3 className="font-syne font-bold text-xl text-red-600 dark:text-red-400 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Danger Zone</h3>
        <p className="text-gray-600 dark:text-gray-500 text-sm mb-6">Log out of your account or permanently delete your data.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={async () => {
              await logout();
              navigate('/auth');
            }}
            className="flex-1 px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4"/> Log Out
          </button>
          
          <button className="flex-1 px-6 py-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-colors font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter pb-24 overflow-x-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-20 dark:opacity-10"></div>
        <div className="orb bg-[#3B82F6]/10 w-[600px] h-[600px] top-[-200px] left-[-200px]"></div>
        <div className="orb bg-[#06B6D4]/5 w-[500px] h-[500px] bottom-[10%] right-[-100px]" style={{animationDelay: '-3s'}}></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#060D1F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-2xl font-syne font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            Seva<span className="text-[#06B6D4]">.</span>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl glass-card text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#06B6D4] rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl p-4 z-50 animate-fade-up">
                  <h4 className="text-gray-900 dark:text-white font-syne font-bold mb-4">Notifications</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
                    {[
                      { title: 'Booking confirmed', desc: 'Your AC repair with Ramesh is confirmed', time: '5 min ago', unread: true },
                      { title: 'Payment received', desc: 'Payment of ₹499 from Plumbing job', time: '2 hours ago', unread: true },
                      { title: 'New offer', desc: 'Get ₹100 off on next 3 bookings', time: '1 day ago', unread: true },
                    ].map((notif, i) => (
                      <div key={i} className={`p-4 rounded-xl border transition-colors ${notif.unread ? 'bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border-[#3B82F6]/20 dark:border-[#3B82F6]/30' : 'glass-card border-transparent hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                        <p className={`text-sm font-medium ${notif.unread ? 'text-[#06B6D4]' : 'text-gray-900 dark:text-white'}`}>{notif.title}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">{notif.desc}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest mt-3">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2.5 rounded-xl glass-card text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={async () => {
                await logout();
                navigate('/auth');
              }}
              className="px-4 py-2.5 rounded-xl glass-card text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 transition-colors hidden sm:flex items-center gap-2 text-sm font-bold"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-syne font-bold text-gray-900 dark:text-white mb-2">नमस्ते, Rajesh! 👋</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Welcome back to your {t('dash_overview').toLowerCase()}</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-white/5 mb-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max pb-2">
            {[
              { id: 'overview', label: t('dash_overview'), icon: <User className="w-4 h-4"/> },
              { id: 'bookings', label: 'Bookings', icon: <Clock3 className="w-4 h-4"/> },
              { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4"/> },
              { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4"/> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4"/> },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white shadow-lg shadow-[#3B82F6]/20'
                      : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'wallet' && <WalletTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <IDCardModal isOpen={isIdModalOpen} onClose={() => setIsIdModalOpen(false)} profile={profile} />
    </div>
  );
}
