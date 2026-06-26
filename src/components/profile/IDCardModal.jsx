import React from 'react';
import { X, QrCode, ShieldCheck, MapPin } from 'lucide-react';

const IDCardModal = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="relative animate-fade-up w-full max-w-sm">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ID Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#3B82F6]/20 border border-white/20 bg-[#0A132D]">
          
          {/* Card Header Background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] opacity-90" />
          
          {/* Subtle patterns/glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#3B82F6]/20 rounded-full blur-3xl -ml-20 -mb-20" />

          <div className="relative pt-6 px-6 pb-8">
            
            {/* Header Text */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-white">
                <p className="text-xs font-medium uppercase tracking-widest text-white/80">Digital</p>
                <p className="text-lg font-syne font-bold tracking-wider">Member ID</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-white/90" />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-28 h-28 rounded-full border-4 border-[#0A132D] bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] shadow-xl flex items-center justify-center text-white font-bold text-4xl mb-4 z-10 relative">
                {profile.avatar}
              </div>
              <h2 className="text-2xl font-syne font-bold text-white mb-1 text-center">{profile.name}</h2>
              <p className="text-[#06B6D4] font-medium text-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {profile.city}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Member Since</p>
                <p className="text-white font-medium">{profile.memberSince}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Bookings</p>
                <p className="text-white font-medium">{profile.totalBookings || 0}</p>
              </div>
            </div>

            {/* Footer / QR */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-left">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Card ID Number</p>
                <p className="text-white font-mono font-medium tracking-widest text-sm">
                  {profile.id?.substring(0, 8).toUpperCase() || 'MEMBER-492X'}
                </p>
              </div>
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <QrCode className="w-8 h-8 text-[#0A132D]" />
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default IDCardModal;
