import React from 'react';

// Skeleton building blocks
const Pulse = ({ className = '' }) => (
  <div className={`skeleton ${className}`}></div>
);

// Worker Card Skeleton
export const WorkerCardSkeleton = () => (
  <div className="glass-card-static rounded-2xl p-6 animate-fade-in">
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-6">
      <div className="flex gap-4">
        <Pulse className="w-16 h-16 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Pulse className="h-5 w-36" />
          <Pulse className="h-4 w-48" />
          <Pulse className="h-3 w-28" />
          <Pulse className="h-3 w-20" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between sm:col-span-2">
        <div className="space-y-2">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-3">
          <Pulse className="h-6 w-16" />
          <Pulse className="w-10 h-10 rounded-xl" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
      <Pulse className="h-11 rounded-xl" />
      <Pulse className="h-11 rounded-xl" />
    </div>
  </div>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <div className="glass-card-static rounded-3xl p-8 animate-fade-in">
    <div className="flex flex-col md:flex-row items-start gap-6">
      <Pulse className="w-24 h-24 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Pulse className="h-7 w-48" />
        <Pulse className="h-4 w-32" />
        <div className="flex gap-8 mt-4">
          <div className="space-y-2">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-4 w-28" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Pulse className="h-10 w-28 rounded-xl" />
          <Pulse className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

// Dashboard Stats Skeleton
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="glass-card-static rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Pulse className="h-4 w-24" />
          <Pulse className="w-5 h-5 rounded" />
        </div>
        <Pulse className="h-8 w-20" />
      </div>
    ))}
  </div>
);

// Booking Card Skeleton
export const BookingCardSkeleton = () => (
  <div className="glass-card-static rounded-3xl p-6 animate-fade-in">
    <div className="flex flex-col md:flex-row justify-between gap-6">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Pulse className="h-6 w-16 rounded-full" />
          <Pulse className="h-4 w-24" />
        </div>
        <Pulse className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-4 w-28" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Pulse className="h-8 w-20" />
        <Pulse className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

// Page Loading Skeleton (Full page)
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center animate-float">
        <span className="text-white font-syne font-bold text-lg">S</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            className="w-2 h-2 rounded-full bg-[#3B82F6]"
            style={{ 
              animation: 'pulseGlow 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Inline Skeleton helper
export const SkeletonLine = ({ width = 'w-full', height = 'h-4' }) => (
  <Pulse className={`${width} ${height}`} />
);

export default {
  WorkerCardSkeleton,
  ProfileSkeleton,
  StatsSkeleton,
  BookingCardSkeleton,
  PageLoadingSkeleton,
  SkeletonLine,
};
