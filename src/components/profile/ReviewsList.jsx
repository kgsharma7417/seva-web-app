import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const ReviewsList = memo(({ reviews }) => {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-3xl p-8 animate-fade-up animate-delay-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-syne font-bold text-white">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-gray-400 text-sm">4.9 from 142 reviews</span>
          </div>
        </div>
        <button onClick={() => navigate('/review')} className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg">
          Write Review
        </button>
      </div>
      
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-white">{review.author}</h4>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

ReviewsList.displayName = 'ReviewsList';
export default ReviewsList;
