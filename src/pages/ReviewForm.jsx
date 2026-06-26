import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Camera } from 'lucide-react';

export default function ReviewForm() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Chip selection state
  const [selectedChips, setSelectedChips] = useState(new Set(['punctual', 'quality']));
  
  const toggleChip = (id) => {
    const newChips = new Set(selectedChips);
    if (newChips.has(id)) {
      newChips.delete(id);
    } else {
      newChips.add(id);
    }
    setSelectedChips(newChips);
  };

  const chips = [
    { id: 'punctual', label: 'Punctual' },
    { id: 'quality', label: 'Quality work' },
    { id: 'polite', label: 'Polite' },
    { id: 'pricing', label: 'Fair pricing' },
    { id: 'clean', label: 'Clean work' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter flex flex-col max-w-md mx-auto relative border-x border-gray-200 dark:border-white/5 shadow-2xl transition-colors duration-300">
      
      {/* Background Orbs to match our theme slightly */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="bg-[#3B82F6]/10 dark:bg-[#3B82F6]/5 w-[400px] h-[400px] rounded-full blur-[100px] absolute -top-[100px] -left-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-gray-200 dark:border-white/5 glass-card !bg-white/80 dark:!bg-[#060D1F]/80 backdrop-blur-xl">
          <button onClick={() => navigate('/worker')} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-syne font-medium text-gray-900 dark:text-white">Rate your service</h1>
        </div>

        {/* Worker Info */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 font-syne text-2xl font-bold mb-4 shadow-lg">
            RK
          </div>
          <h2 className="text-xl font-syne font-bold text-gray-900 dark:text-white">Ramesh Kumar</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">AC repair · completed today, 4:30 pm</p>
        </div>

        {/* Rating Section */}
        <div className="px-6 pb-8 flex flex-col items-center">
          <h3 className="text-gray-900 dark:text-white text-[15px] mb-4">How was the service?</h3>
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  className={`w-10 h-10 transition-colors ${
                    (hoverRating || rating) >= star 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`} 
                />
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-sm font-medium">
            {rating > 0 ? `${rating} out of 5` : 'Tap to rate'}
          </p>
        </div>

        {/* Chips Section */}
        <div className="px-6 pb-8">
          <h3 className="text-gray-900 dark:text-white text-[15px] mb-4">What went well?</h3>
          <div className="flex flex-wrap gap-3">
            {chips.map(chip => {
              const isSelected = selectedChips.has(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => toggleChip(chip.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isSelected 
                      ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]' 
                      : 'glass-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment Section */}
        <div className="px-6 pb-6">
          <h3 className="text-gray-900 dark:text-white text-[15px] mb-4">Add a comment (optional)</h3>
          <textarea 
            className="w-full glass-card rounded-2xl p-4 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-all resize-none h-32"
            placeholder="Tell others about your experience..."
          ></textarea>
        </div>

        {/* Add Photos */}
        <div className="px-6 pb-8">
          <button className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">Add photos</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto p-6 flex flex-col items-center border-t border-gray-200 dark:border-white/5 glass-card !bg-white/80 dark:!bg-[#060D1F]/80 backdrop-blur-xl">
          <button onClick={() => navigate('/worker')} className="w-full py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-xl transition-colors text-[15px] mb-4 shadow-lg shadow-[#3B82F6]/20">
            Submit review
          </button>
          <p className="text-xs text-gray-500 text-center font-medium">
            Visible on Ramesh's public profile
          </p>
        </div>
      </div>
    </div>
  );
}
