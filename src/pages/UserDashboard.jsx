import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, MessageCircle, Heart, Share2, Settings, LogOut, Bell, Wallet, History, Award, TrendingUp, ChevronRight, AlertCircle, CheckCircle2, Clock3, MapPinIcon, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ============================================================================
// TYPES
// ============================================================================

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUserProfile = {
  name: 'Raj Kumar',
  phone: '+91 9876543210',
  email: 'raj.kumar@example.com',
  city: 'Agra',
  area: 'Taj Ganj',
  avatar: 'RK',
  memberSince: 'Jan 2024',
  totalBookings: 12,
  averageRating: 4.6,
};

const mockBookings = [
  {
    id: 'B001',
    workerId: '1',
    workerName: 'Ramesh Kumar',
    service: 'AC Repair',
    serviceIcon: '❄️',
    status: 'active',
    scheduledAt: '15 Mar 2024, 10:00 AM',
    amount: 599,
    workerImage: 'RK',
    location: 'Taj Ganj, Agra',
    duration: '1-2 hours',
  },
  {
    id: 'B002',
    workerId: '2',
    workerName: 'Suresh Plumber',
    service: 'Plumbing',
    serviceIcon: '🔧',
    status: 'completed',
    scheduledAt: '10 Mar 2024, 2:30 PM',
    completedAt: '10 Mar 2024, 3:45 PM',
    amount: 499,
    rating: 4.5,
    reviewed: true,
    workerImage: 'SP',
    location: 'Sadar Bazar, Agra',
    duration: '1.5 hours',
    notes: 'Fixed water leakage in bathroom. Very professional work.',
  },
  {
    id: 'B003',
    workerId: '3',
    workerName: 'Arjun Electrician',
    service: 'Electrical',
    serviceIcon: '⚡',
    status: 'completed',
    scheduledAt: '5 Mar 2024, 11:00 AM',
    completedAt: '5 Mar 2024, 12:15 PM',
    amount: 559,
    rating: 5,
    reviewed: true,
    workerImage: 'AE',
    location: 'Civil Lines, Agra',
    duration: '1.5 hours',
    notes: 'Installed new switch boards. Quick and reliable.',
  },
  {
    id: 'B004',
    workerId: '4',
    workerName: 'Priya Cleaning',
    service: 'House Cleaning',
    serviceIcon: '🧹',
    status: 'completed',
    scheduledAt: '28 Feb 2024, 9:00 AM',
    completedAt: '28 Feb 2024, 11:30 AM',
    amount: 399,
    rating: 4,
    reviewed: false,
    workerImage: 'PC',
    location: 'Shilpgram, Agra',
    duration: '2.5 hours',
  },
];

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
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const activeBookings = mockBookings.filter(b => b.status === 'active');
  const completedBookings = mockBookings.filter(b => b.status === 'completed');
  const totalSpent = mockBookings.reduce((sum, b) => sum + b.amount, 0);
  const walletBalance = 2500;
  const unreadNotifications = 3;

  // ========== PROFILE SECTION ==========
  const ProfileSection = () => (
    <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden animate-fade-up">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-6 flex-1 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0 text-white font-bold text-3xl shadow-xl shadow-[#3B82F6]/20">
            {mockUserProfile.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-syne font-bold text-gray-900 dark:text-white mb-1">{mockUserProfile.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Member since {mockUserProfile.memberSince}</p>
            
            <div className="flex gap-8 text-sm mb-5">
              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Location</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#06B6D4]" />
                  {mockUserProfile.area}, {mockUserProfile.city}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Contact</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{mockUserProfile.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-[#3B82F6]/25 text-sm font-medium">
                Edit Profile
              </button>
              <button className="px-5 py-2.5 glass-card text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                View ID
              </button>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right glass-card px-6 py-4 rounded-2xl">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(mockUserProfile.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
          </div>
          <p className="text-gray-900 dark:text-white font-syne font-bold text-2xl">{mockUserProfile.averageRating}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{mockUserProfile.totalBookings} total bookings</p>
        </div>
      </div>
    </div>
  );

  // ========== OVERVIEW TAB ==========
  const OverviewTab = () => (
    <div className="space-y-8">
      <ProfileSection />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up animate-delay-100">
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
              <div className={`absolute -right-6 -bottom-6 opacity-[0.03] ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-24 h-24" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Bookings Section */}
      {activeBookings.length > 0 && (
        <div className="animate-fade-up animate-delay-200">
          <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#3B82F6]" /> Active Bookings
          </h3>
          <div className="space-y-4">
            {activeBookings.map(booking => (
              <div key={booking.id} className="glass-card rounded-2xl p-6 border-l-4 border-l-[#3B82F6] hover:border-[#3B82F6]/50 transition-colors">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl bg-gray-50 dark:bg-white/5 w-14 h-14 flex items-center justify-center rounded-xl">{booking.serviceIcon}</div>
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-syne font-bold text-lg">{booking.workerName}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{booking.service} • {booking.scheduledAt}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-bold text-[#06B6D4] text-xl">₹{booking.amount}</p>
                    <span className="inline-block px-3 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-[10px] uppercase tracking-wider font-medium rounded-md mt-1">
                      On the way
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-gray-100 dark:border-white/5 pt-5">
                  <button className="px-3 py-2.5 glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-[#3B82F6]" /> Call
                  </button>
                  <button className="px-3 py-2.5 glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-[#10B981]" /> Track
                  </button>
                  <button className="px-3 py-2.5 glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#8B5CF6]" /> Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          { label: 'All Bookings', count: mockBookings.length },
          { label: 'Active', count: activeBookings.length },
          { label: 'Completed', count: completedBookings.length },
        ].map(tab => (
          <button key={tab.label} className="px-5 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium whitespace-nowrap rounded-t-lg">
            {tab.label} <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-md ml-1 text-xs text-gray-700 dark:text-gray-300">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {mockBookings.map(booking => (
          <div key={booking.id} className="glass-card rounded-3xl overflow-hidden hover:border-[#3B82F6]/40 dark:hover:border-[#3B82F6]/40 transition-all">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0 font-bold text-white text-xl shadow-lg">
                  {booking.workerImage}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-syne font-bold text-xl text-gray-900 dark:text-white">{booking.workerName}</h4>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider flex-shrink-0 ${
                      booking.status === 'active' 
                        ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]' 
                        : 'bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]'
                    }`}>
                      {booking.status === 'active' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{booking.serviceIcon} {booking.service}</p>
                  <p className="text-gray-500 text-xs flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {booking.scheduledAt}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-bold text-[#06B6D4] text-2xl mb-1">₹{booking.amount}</p>
                  {booking.duration && <p className="text-gray-500 text-xs flex items-center gap-1 md:justify-end"><Clock3 className="w-3 h-3" /> {booking.duration}</p>}
                </div>
              </div>

              {booking.notes && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-[#3B82F6] mr-2">"</span>{booking.notes}<span className="text-[#3B82F6] ml-2">"</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                {booking.status === 'active' && (
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
            <button className="flex-1 px-5 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-[#060D1F] rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-bold text-sm min-w-[140px] shadow-lg dark:shadow-xl">
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
          {mockTransactions.map((transaction, i) => {
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
              {booking.workerImage}
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 dark:text-white font-syne font-bold text-lg">{booking.workerName}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{booking.serviceIcon} {booking.service}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1.5"><Clock className="w-3 h-3 inline mr-1" />{booking.completedAt}</p>
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
              <p className="text-gray-500 text-sm">{mockUserProfile.email}</p>
            </div>
            <button className="text-[#06B6D4] text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors glass-card px-4 py-2 rounded-lg">Change</button>
          </div>
          <div className="pb-6 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Phone Number</p>
              <p className="text-gray-500 text-sm">{mockUserProfile.phone}</p>
            </div>
            <button className="text-[#06B6D4] text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors glass-card px-4 py-2 rounded-lg">Change</button>
          </div>
          <div className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Password</p>
              <p className="text-gray-500 text-sm">Last changed 3 months ago</p>
            </div>
            <button className="text-[#06B6D4] text-sm font-medium hover:text-gray-900 dark:hover:text-white transition-colors glass-card px-4 py-2 rounded-lg">Update</button>
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
        <h3 className="font-syne font-bold text-xl text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
        <p className="text-gray-600 dark:text-gray-500 text-sm mb-6">Permanently remove your account and all data. This action is not reversible.</p>
        <button className="px-6 py-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-colors font-medium">
          Delete Account
        </button>
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

            <button className="p-2.5 rounded-xl glass-card text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl glass-card text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 transition-colors hidden sm:block">
              <LogOut className="w-5 h-5" />
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
    </div>
  );
}
