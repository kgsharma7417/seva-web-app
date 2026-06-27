import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, IdCard, Gavel, CalendarCheck, BarChart3, Users, 
  Ban, BellRing, Star, Filter, FileText, Award, Camera, 
  Download, Plus, Send, X, Check, Bell, LogOut
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getFirestore, collection, query, onSnapshot, doc, updateDoc, where, addDoc } from 'firebase/firestore';
import app from '../firebase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('kyc');
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [suspendUser, setSuspendUser] = useState('');
  const [notifForm, setNotifForm] = useState({ title: '', body: '' });
  const { t } = useLanguage();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (e) {
      console.error(e);
      showToast("Failed to log out");
    }
  };

  // Show toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Switch Tab
  const handleTabChange = (id) => setActiveTab(id);

  // Firestore Data States
  const [allUsers, setAllUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    // Fetch all users
    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllUsers(usersData);
    });

    // Fetch all bookings
    const bookingsUnsub = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllBookings(bookingsData);
    });

    return () => {
      usersUnsub();
      bookingsUnsub();
    };
  }, [db]);

  // Derived Data
  const kycQueue = allUsers.filter(u => u.role === 'worker' && u.idProof && !u.verified);
  const totalRevenue = allBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const platformFee = totalRevenue * 0.15; // Assuming 15% platform fee
  const activeUsersCount = allUsers.filter(u => u.role === 'customer').length;
  const activeWorkersCount = allUsers.filter(u => u.role === 'worker').length;

  const handleApproveKYC = async (workerId, name) => {
    try {
      await updateDoc(doc(db, 'users', workerId), { verified: true });
      showToast(`${name} approved ✓`);
    } catch (e) {
      console.error(e);
      showToast("Error approving worker");
    }
  };

  const handleRejectKYC = async (workerId, name) => {
    try {
      await updateDoc(doc(db, 'users', workerId), { idProof: false, idProofUrl: null });
      showToast(`${name} rejected`);
    } catch (e) {
      console.error(e);
      showToast("Error rejecting worker");
    }
  };

  const handleSuspendUser = async (userId, name, isCurrentlyBanned) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isBanned: !isCurrentlyBanned });
      showToast(`${name} ${!isCurrentlyBanned ? 'suspended' : 'unsuspended'} ✓`);
    } catch (e) {
      console.error(e);
      showToast("Error updating user status");
    }
  };

  const handleSendNotification = async () => {
    if (!notifForm.title || !notifForm.body) {
      showToast('Title and message are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'notifications'), {
        title: notifForm.title,
        body: notifForm.body,
        createdAt: new Date()
      });
      showToast('Notification sent to all users!');
      setNotifForm({ title: '', body: '' });
    } catch (e) {
      showToast('Error sending notification');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
      showToast(`Booking cancelled`);
    } catch (e) {
      showToast('Error cancelling booking');
    }
  };

  const handleResolveDispute = async (bookingId) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { hasDispute: false, status: 'completed' });
      showToast('Dispute resolved');
    } catch (e) {
      showToast('Error resolving dispute');
    }
  };

  // ============================================================================
  // SIDEBAR NAVIGATION CONFIG
  // ============================================================================
  const navConfig = [
    { section: 'Verification' },
    { id: 'kyc', icon: IdCard, label: 'KYC Queue', badge: '7', badgeColor: 'bg-[#3B82F6]/10 text-[#3B82F6] dark:bg-[#3B82F6]/20' },
    { section: 'Operations' },
    { id: 'disputes', icon: Gavel, label: 'Disputes', badge: '3', badgeColor: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' },
    { id: 'bookings', icon: CalendarCheck, label: 'All bookings' },
    { section: 'Finance' },
    { id: 'revenue', icon: BarChart3, label: 'Revenue & commission' },
    { section: 'Users' },
    { id: 'users', icon: Users, label: 'User management' },
    { id: 'blacklist', icon: Ban, label: 'Blacklist / suspend' },
    { section: 'Engagement' },
    { id: 'push', icon: BellRing, label: 'Push notifications' },
    { id: 'featured', icon: Star, label: 'Featured listings' },
  ];

  // ============================================================================
  // RENDER TABS
  // ============================================================================

  const renderKYC = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><IdCard className="w-5 h-5"/> Worker verification queue</h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-md text-xs font-bold">{kycQueue.length} pending</span>
          <button className="px-4 py-2 glass-card text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg flex items-center gap-2 text-sm"><Filter className="w-4 h-4"/> Filter</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', val: '7', sub: 'awaiting review' },
          { label: 'Approved today', val: '12', sub: '+3 from yesterday' },
          { label: 'Rejected', val: '2', sub: 'this week' },
          { label: 'Avg review time', val: '4h', sub: 'target: 6h' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1 font-medium">{stat.label}</p>
            <p className="text-gray-900 dark:text-white font-syne font-bold text-2xl">{stat.val}</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {kycQueue.length === 0 ? (
          <div className="text-center py-10 glass-card rounded-2xl w-full">
            <p className="text-gray-500">No pending verification requests.</p>
          </div>
        ) : kycQueue.map((worker) => (
          <div key={worker.id} className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
              {worker.name ? worker.name.substring(0,2).toUpperCase() : 'W'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{worker.name || 'Worker'}</h3>
                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-[10px] uppercase font-bold rounded-md">Pending</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{worker.specialty || 'Service'} • {worker.phone || 'No phone'}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {worker.idProofUrl && (
                  <a href={worker.idProofUrl} target="_blank" rel="noreferrer" className="px-3 py-1 glass-card text-blue-600 dark:text-blue-400 text-xs rounded-lg flex items-center gap-1.5 hover:underline hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                    <FileText className="w-3.5 h-3.5"/> View ID Proof
                  </a>
                )}
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => handleApproveKYC(worker.id, worker.name || 'Worker')} className="px-4 py-2 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981] hover:text-white dark:hover:text-[#060D1F] transition-all rounded-lg text-sm font-bold">Approve</button>
                <button onClick={() => handleRejectKYC(worker.id, worker.name || 'Worker')} className="px-4 py-2 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-500 hover:text-white transition-all rounded-lg text-sm font-bold">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDisputes = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><Gavel className="w-5 h-5"/> Dispute resolution center</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Open', val: '3' },
          { label: 'Resolved this week', val: '11' },
          { label: 'Refunds issued', val: '₹8,400' },
          { label: 'Avg resolution', val: '1.2d' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1 font-medium">{stat.label}</p>
            <p className="text-gray-900 dark:text-white font-syne font-bold text-2xl">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {allBookings.filter(b => b.hasDispute).length === 0 ? (
          <div className="text-center py-10 glass-card rounded-2xl w-full">
            <p className="text-gray-500">No active disputes.</p>
          </div>
        ) : allBookings.filter(b => b.hasDispute).map((d) => (
          <div key={d.id} className="glass-card rounded-2xl p-6 relative overflow-hidden border-red-500/20 border">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 text-xs font-bold rounded-bl-xl border-b border-l border-red-200 dark:border-red-500/20">
              Disputed
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">#BK-{d.id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-500">Service: {d.service}</p>
              </div>
              <span className="text-red-500 font-bold text-sm mr-16">₹{d.totalAmount} at stake</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="flex-1 glass-card rounded-xl p-4 w-full border border-gray-100 dark:border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Customer</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{d.customerName || 'Unknown'}</p>
              </div>
              <div className="text-gray-400 dark:text-gray-600 font-syne font-bold italic">VS</div>
              <div className="flex-1 glass-card rounded-xl p-4 w-full border border-gray-100 dark:border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Worker</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{d.workerName || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button onClick={() => handleCancelBooking(d.id)} className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-all">Cancel Booking</button>
              <button onClick={() => handleResolveDispute(d.id)} className="px-4 py-2 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981] hover:text-white rounded-lg text-sm font-medium transition-all">Force Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><CalendarCheck className="w-5 h-5"/> All bookings</h2>
        <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-[#060D1F] hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg dark:shadow-sm"><Download className="w-4 h-4"/> Export CSV</button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Worker</th>
                <th className="p-4">Service</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {allBookings.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No bookings found.</td></tr>
              ) : allBookings.map((row) => {
                let color = 'text-gray-500 bg-gray-100 dark:bg-white/5';
                if (row.status === 'completed') color = 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
                else if (row.status === 'cancelled') color = 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-500/20';
                else color = 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20';

                return (
                  <tr key={row.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">#BK-{row.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{row.customerName || 'Unknown'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{row.workerName || 'Unknown'}</td>
                    <td className="p-4 text-gray-500">{row.service}</td>
                    <td className="p-4 text-gray-900 dark:text-white font-medium">₹{row.totalAmount || 0}</td>
                    <td className="p-4"><span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md border ${color}`}>{row.status}</span></td>
                    <td className="p-4 flex gap-2">
                      {row.status !== 'cancelled' && row.status !== 'completed' && (
                        <button onClick={() => handleCancelBooking(row.id)} className="text-red-500 hover:text-red-600 text-xs font-bold transition-colors">Cancel</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><BarChart3 className="w-5 h-5"/> Revenue & commission reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross revenue', val: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'Lifetime total' },
          { label: 'Commission earned', val: `₹${platformFee.toLocaleString('en-IN')}`, sub: '15% avg rate' },
          { label: 'Active Users', val: activeUsersCount.toString(), sub: 'Customers on platform' },
          { label: 'Active Workers', val: activeWorkersCount.toString(), sub: 'Workers on platform' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5">
            <p className="text-gray-500 text-xs mb-1 font-medium">{stat.label}</p>
            <p className="text-gray-900 dark:text-white font-syne font-bold text-2xl">{stat.val}</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">Revenue by category</h3>
          <div className="space-y-4">
            {[
              { name: 'Electrical', pct: 85, val: '₹1.4L' },
              { name: 'Plumbing', pct: 62, val: '₹1.1L' },
              { name: 'Carpentry', pct: 48, val: '₹82K' },
              { name: 'Cleaning', pct: 35, val: '₹60K' },
              { name: 'Painting', pct: 28, val: '₹48K' },
            ].map(b => (
              <div key={b.name} className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400 w-20">{b.name}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]" style={{ width: `${b.pct}%` }}></div>
                </div>
                <span className="text-gray-900 dark:text-white font-bold w-12 text-right">{b.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">Commission by city</h3>
          <div className="space-y-4">
            {[
              { name: 'Delhi', pct: 90, val: '₹28K' },
              { name: 'Mumbai', pct: 70, val: '₹22K' },
              { name: 'Bangalore', pct: 55, val: '₹14K' },
              { name: 'Hyderabad', pct: 30, val: '₹8K' },
            ].map(b => (
              <div key={b.name} className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400 w-20">{b.name}</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#10B981] to-[#059669]" style={{ width: `${b.pct}%` }}></div>
                </div>
                <span className="text-gray-900 dark:text-white font-bold w-12 text-right">{b.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><Users className="w-5 h-5"/> User & worker management</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-lg flex items-center gap-2 text-sm shadow-lg shadow-[#3B82F6]/20">
          <Plus className="w-4 h-4"/> Add user
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5 text-gray-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Phone</th>
              <th className="p-4">Bookings</th><th className="p-4">Status</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {allUsers.map((u) => {
              const bookingsCount = allBookings.filter(b => b.workerId === u.id || b.customerId === u.id).length;
              const isBanned = !!u.isBanned;
              return (
              <tr key={u.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-gray-900 dark:text-white font-bold">{u.name || 'Unknown'}</td>
                <td className="p-4 text-gray-500 dark:text-gray-400 capitalize">{u.role || 'user'}</td>
                <td className="p-4 text-gray-500 dark:text-gray-400">{u.phone || 'N/A'}</td>
                <td className="p-4 text-gray-900 dark:text-white">{bookingsCount}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md border ${isBanned ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20'}`}>
                    {isBanned ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => handleSuspendUser(u.id, u.name || 'User', isBanned)} className={`${isBanned ? 'text-[#10B981] hover:text-[#059669]' : 'text-red-500 hover:text-red-600'} transition-colors text-xs font-bold`}>
                    {isBanned ? 'Reinstate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBlacklist = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><Ban className="w-5 h-5"/> Blacklist / suspend accounts</h2>
      </div>
      <div className="glass-card rounded-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/5 text-gray-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Status</th>
              <th className="p-4">Reason</th><th className="p-4">Date</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {allUsers.filter(u => u.isBanned).length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No banned users found.</td></tr>
            ) : allUsers.filter(u => u.isBanned).map((u) => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-gray-900 dark:text-white font-bold">{u.name || 'Unknown'}</td>
                <td className="p-4 text-gray-500 dark:text-gray-400 capitalize">{u.role}</td>
                <td className="p-4"><span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-md border text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20">Suspended</span></td>
                <td className="p-4 text-gray-500 dark:text-gray-400">Admin action</td>
                <td className="p-4 text-gray-400 dark:text-gray-500">-</td>
                <td className="p-4"><button onClick={() => handleSuspendUser(u.id, u.name, true)} className="text-[#10B981] hover:text-[#059669] dark:hover:text-white transition-colors text-xs font-bold">Reinstate</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPush = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><BellRing className="w-5 h-5"/> Push notification sender</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Title</label>
              <input 
                type="text" 
                className="w-full glass-card rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                placeholder="e.g. Special offer today!"
                value={notifForm.title}
                onChange={e => setNotifForm({...notifForm, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</label>
              <textarea 
                className="w-full glass-card rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-colors h-24 resize-none"
                placeholder="e.g. Book any service and get ₹100 off."
                value={notifForm.body}
                onChange={e => setNotifForm({...notifForm, body: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Send To</label>
              <select className="w-full glass-card rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none">
                <option className="bg-white dark:bg-[#060D1F]">All Users</option>
                <option className="bg-white dark:bg-[#060D1F]">All Workers</option>
                <option className="bg-white dark:bg-[#060D1F]">Customers Only</option>
              </select>
            </div>
            <button onClick={handleSendNotification} className="w-full py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl hover:scale-[1.02] transition-transform font-bold flex justify-center items-center gap-2 shadow-lg shadow-[#3B82F6]/20">
              <Send className="w-4 h-4"/> Send Notification
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Live Preview (iOS)</label>
          <div className="bg-gray-900 dark:bg-black/50 border border-gray-800 dark:border-white/10 rounded-[2.5rem] p-4 w-full max-w-[320px] h-[600px] mx-auto relative shadow-2xl flex flex-col items-center">
            {/* Notch */}
            <div className="w-32 h-6 bg-black rounded-b-3xl absolute top-0"></div>
            {/* Notification Bubble */}
            <div className="mt-12 w-full bg-white/90 dark:bg-[#1A1A1A]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex gap-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className="text-gray-900 dark:text-white font-bold text-sm leading-tight">{notifForm.title || 'Title will appear here'}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 leading-snug">{notifForm.body || 'Message will appear here'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatured = () => (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2"><Star className="w-5 h-5"/> Featured listing management</h2>
        <button className="px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 dark:text-black dark:hover:bg-yellow-400 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-yellow-500/20"><Plus className="w-4 h-4"/> Add slot</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Ravi Agarwal', skill: 'Electrician', rating: 4.9, jobs: 120, tag: 'Featured since Jun 10', featured: true },
          { name: 'Priya Sharma', skill: 'Plumber', rating: 4.7, jobs: 85, tag: 'Featured since Jun 15', featured: true },
          { name: 'Santosh Das', skill: 'Painter', rating: 4.6, jobs: 54, tag: 'Not featured', featured: false },
          { name: 'Mohit Kumar', skill: 'Carpenter', rating: 4.5, jobs: 37, tag: 'Not featured', featured: false }
        ].map((w, i) => (
          <div key={i} className={`glass-card rounded-3xl p-6 relative ${w.featured ? 'border-yellow-400 dark:border-yellow-500/50 shadow-md dark:shadow-[0_0_15px_rgba(234,179,8,0.1)]' : ''}`}>
            {w.featured && <Star className="absolute top-6 right-6 w-5 h-5 text-yellow-500 fill-yellow-500" />}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{w.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{w.skill} • {w.rating}★ • {w.jobs} jobs</p>
            <div className="mt-4 mb-6">
              <span className={`px-2 py-1 text-xs rounded-md ${w.featured ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-transparent' : 'glass-card text-gray-500 border-transparent'}`}>{w.tag}</span>
            </div>
            <div className="flex gap-3">
              {w.featured ? (
                <button onClick={() => showToast(`${w.name} removed from featured`)} className="px-4 py-2 glass-card text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg text-sm font-bold">Remove Featured</button>
              ) : (
                <button onClick={() => showToast(`${w.name} added to featured!`)} className="px-4 py-2 bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/30 hover:bg-yellow-500 hover:text-white dark:hover:text-black transition-colors rounded-lg text-sm font-bold flex items-center gap-2"><Star className="w-3.5 h-3.5"/> Add to Featured</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter flex flex-col md:flex-row overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="bg-grid absolute inset-0 opacity-20 dark:opacity-10"></div>
        <div className="orb bg-[#3B82F6]/5 w-[600px] h-[600px] top-[-100px] right-[-100px]"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/5 glass-card !bg-white/50 dark:!bg-[#060D1F]/50 flex-shrink-0 relative z-10 flex flex-col h-auto md:h-screen">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#060D1F]/90 backdrop-blur-xl z-20 flex justify-between items-center md:block">
          <div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-syne font-bold text-xl">
              <ShieldCheck className="w-6 h-6 text-[#3B82F6]" /> Admin Panel
            </div>
            <p className="text-gray-500 text-xs mt-1 hidden md:block">Full control dashboard</p>
          </div>
        </div>
        
        <div className="p-4 space-y-1 flex md:block overflow-x-auto no-scrollbar gap-2 md:overflow-y-auto">
          {navConfig.map((item, i) => {
            if (item.section) {
              return <div key={i} className="px-4 pt-6 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-600">{item.section}</div>;
            }
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-[#3B82F6]/10 dark:bg-gradient-to-r dark:from-[#3B82F6]/20 dark:to-transparent text-[#3B82F6] md:border-l-2 border-[#3B82F6]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 md:border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#3B82F6]' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="p-4 md:mt-auto border-t border-gray-200 dark:border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 h-[calc(100vh-140px)] md:h-screen overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
          {activeTab === 'kyc' && renderKYC()}
          {activeTab === 'disputes' && renderDisputes()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'revenue' && renderRevenue()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'blacklist' && renderBlacklist()}
          {activeTab === 'push' && renderPush()}
          {activeTab === 'featured' && renderFeatured()}
        </div>
      </main>

      {/* Suspend Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-card !bg-white dark:!bg-[#060D1F] rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-syne font-bold text-gray-900 dark:text-white mb-2">Suspend account</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">You're about to suspend <strong className="text-gray-900 dark:text-white">{suspendUser}</strong>. They won't be able to log in or take bookings until reinstated.</p>
            
            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reason</label>
              <select className="w-full glass-card rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#3B82F6] appearance-none">
                <option className="bg-white dark:bg-[#060D1F]">Fraudulent activity</option>
                <option className="bg-white dark:bg-[#060D1F]">Repeat policy violations</option>
                <option className="bg-white dark:bg-[#060D1F]">Customer complaints</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 glass-card text-gray-700 dark:text-gray-300 rounded-xl hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white transition-colors font-bold text-sm">Cancel</button>
              <button onClick={() => {setModalOpen(false); showToast(`${suspendUser} suspended`);}} className="flex-1 py-3 bg-red-600 dark:bg-red-500 text-white rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-bold text-sm shadow-md">Suspend Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#3B82F6] text-white px-6 py-3 rounded-xl shadow-lg shadow-[#3B82F6]/20 font-medium text-sm flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

    </div>
  );
}
