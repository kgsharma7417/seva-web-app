import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle, Navigation } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getFirestore, collection, query, where, limit, getDocs } from 'firebase/firestore';
import app from '../../firebase';

const WorkerCards = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [topWorkers, setTopWorkers] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchTopWorkers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'worker'), limit(2));
        const snapshot = await getDocs(q);
        const workers = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unknown',
            skill: data.specialty || 'General Service',
            exp: data.experience || '1 yr',
            rating: data.rating || '5.0',
            reviews: data.reviews || '0',
            price: `₹${data.hourlyRate || 250}/hr`,
            response: `${data.responseTimeMinutes || 15} min`,
            initials: data.name ? data.name.substring(0, 2).toUpperCase() : 'W'
          };
        });
        
        // If database is empty, provide fallback
        if (workers.length === 0) {
          setTopWorkers([
            { initials: 'RK', name: 'Ramesh Kumar', skill: t('cat_ac'), exp: '7 yrs', rating: '4.9', reviews: '142', price: '₹299/hr', response: '12 min' },
            { initials: 'SP', name: 'Suresh Plumber', skill: t('cat_plumbing'), exp: '11 yrs', rating: '4.8', reviews: '89', price: '₹249/hr', response: '8 min' }
          ]);
        } else {
          setTopWorkers(workers);
        }
      } catch (err) {
        console.error("Error fetching workers:", err);
      }
    };
    fetchTopWorkers();
  }, [db, t]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">Top Rated</h2>
      <h3 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('workers_title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topWorkers.map((worker, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-lg font-bold text-white shadow-lg">
                {worker.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{worker.name}</h4>
                  <div className="flex items-center gap-1 bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded text-[10px] font-medium border border-[#10B981]/20">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{worker.skill} • {worker.exp}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{worker.rating}</span>
                    <span className="text-gray-500">({worker.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-2">
              <div className="flex flex-col sm:items-end">
                 <div className="text-lg font-bold text-[#06B6D4]">{worker.price}</div>
                 <div className="text-[10px] text-gray-500 flex items-center gap-1">
                   <Navigation className="w-3 h-3" /> Responds in ~{worker.response}
                 </div>
              </div>
              <button onClick={() => navigate(worker.id ? `/worker/${worker.id}` : '/worker')} className="px-6 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium hover:bg-[#3B82F6] hover:text-white dark:hover:bg-[#3B82F6] dark:hover:border-[#3B82F6] transition-all shadow-sm dark:shadow-none w-full sm:w-auto">
                {t('workers_book_btn')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkerCards;
