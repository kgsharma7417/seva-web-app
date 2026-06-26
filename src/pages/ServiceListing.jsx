import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Heart, MessageCircle, Search, Filter, Zap, Wrench, Droplets, Sparkles, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const mockWorkers = [
  { id: '1', name: 'Ramesh Kumar', service: 'ac-repair', specialty: 'AC Technician', rating: 4.9, reviews: 142, experience: '7 yrs', hourlyRate: 299, responseTime: '~12 min', responseTimeMinutes: 12, verified: true, image: 'RK', area: 'Agra City' },
  { id: '2', name: 'Suresh Plumber', service: 'plumbing', specialty: 'Plumber', rating: 4.8, reviews: 89, experience: '11 yrs', hourlyRate: 249, responseTime: '~8 min', responseTimeMinutes: 8, verified: true, image: 'SP', area: 'Taj Ganj' },
  { id: '3', name: 'Arjun Electrician', service: 'electrical', specialty: 'Electrician', rating: 4.7, reviews: 156, experience: '9 yrs', hourlyRate: 279, responseTime: '~15 min', responseTimeMinutes: 15, verified: true, image: 'AE', area: 'Sadar Bazar' },
  { id: '4', name: 'Priya Cleaning', service: 'cleaning', specialty: 'House Cleaning', rating: 4.6, reviews: 203, experience: '5 yrs', hourlyRate: 199, responseTime: '~10 min', responseTimeMinutes: 10, verified: true, image: 'PC', area: 'Fatehpur Sikri Road' },
  { id: '5', name: 'Vikram Carpenter', service: 'carpentry', specialty: 'Carpenter', rating: 4.8, reviews: 78, experience: '13 yrs', hourlyRate: 329, responseTime: '~20 min', responseTimeMinutes: 20, verified: true, image: 'VC', area: 'Civil Lines' },
  { id: '6', name: 'Deepak Painter', service: 'painting', specialty: 'Painter', rating: 4.5, reviews: 112, experience: '8 yrs', hourlyRate: 259, responseTime: '~18 min', responseTimeMinutes: 18, verified: true, image: 'DP', area: 'Shilpgram' },
];

const AREAS = ['All Areas', 'Agra City', 'Taj Ganj', 'Sadar Bazar', 'Civil Lines', 'Fatehpur Sikri Road', 'Shilpgram'];
const PRICE_RANGES = [
  { label: 'Under ₹250', min: 0, max: 250 },
  { label: '₹250 - ₹350', min: 250, max: 350 },
  { label: '₹350 - ₹500', min: 350, max: 500 },
  { label: 'Above ₹500', min: 500, max: 9999 },
];

export default function ServiceListing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 9999 });
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState(new Set());

  const SERVICES = [
    { id: 'ac-repair', name: t('cat_ac'), icon: Zap, count: 320 },
    { id: 'plumbing', name: t('cat_plumbing'), icon: Droplets, count: 210 },
    { id: 'electrical', name: t('cat_electrical'), icon: Wrench, count: 180 },
    { id: 'cleaning', name: t('cat_cleaning'), icon: Sparkles, count: 95 },
    { id: 'carpentry', name: t('cat_carpentry'), icon: Wrench, count: 67 },
    { id: 'painting', name: t('cat_painting'), icon: Sparkles, count: 143 },
  ];

  const filteredWorkers = useMemo(() => {
    let filtered = mockWorkers;
    if (selectedService) filtered = filtered.filter(w => w.service === selectedService);
    if (selectedArea !== 'All Areas') filtered = filtered.filter(w => w.area === selectedArea);
    filtered = filtered.filter(w => w.hourlyRate >= priceRange.min && w.hourlyRate <= priceRange.max);

    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'response') filtered.sort((a, b) => a.responseTimeMinutes - b.responseTimeMinutes);
    else if (sortBy === 'price') filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);

    return filtered;
  }, [selectedService, selectedArea, priceRange, sortBy]);

  const toggleFavorite = (workerId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(workerId)) newFavorites.delete(workerId);
    else newFavorites.add(workerId);
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter overflow-x-hidden pb-20 transition-colors duration-300">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-20 dark:opacity-10"></div>
        <div className="orb bg-[#3B82F6]/10 w-[500px] h-[500px] top-[-100px] left-[-100px]"></div>
        <div className="orb bg-[#06B6D4]/10 w-[400px] h-[400px] bottom-[20%] right-[-150px]" style={{animationDelay: '-2s'}}></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#060D1F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-syne font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate('/')}>
              Seva<span className="text-[#06B6D4]">.</span>
            </h1>
            <button onClick={() => navigate('/')} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors font-medium">
              <ChevronLeft className="w-4 h-4" /> {t('btn_back')}
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-[240px] relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3B82F6] transition-colors" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0A132D] text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#3B82F6]/50 focus:ring-4 focus:ring-[#3B82F6]/10 transition-all text-sm placeholder-gray-400 dark:placeholder-gray-500 glass-card"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-3 glass-card rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-sm text-gray-600 dark:text-gray-300">
                <Filter className="w-4 h-4" />
                {t('sl_filters')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar (Filters) */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="sticky top-40 space-y-8">
              {/* Service Filter */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Service Type</h3>
                <div className="space-y-2">
                  {SERVICES.map(service => {
                    const Icon = service.icon;
                    const isSelected = selectedService === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(isSelected ? '' : service.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm border ${
                          isSelected
                            ? 'bg-[#3B82F6] border-transparent text-white shadow-lg shadow-[#3B82F6]/25'
                            : 'glass-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white text-[#3B82F6]' : 'bg-gray-100 dark:bg-white/5'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="flex-1 font-medium">{service.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">{service.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Area Filter */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Area</h3>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-4 py-3 glass-card text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6]/50 focus:ring-4 focus:ring-[#3B82F6]/10 transition-all text-sm appearance-none cursor-pointer"
                >
                  {AREAS.map(area => (
                    <option key={area} value={area} className="bg-white dark:bg-[#060D1F]">{area}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">{t('sl_price_range')}</h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => {
                    const isSelected = priceRange.min === range.min && priceRange.max === range.max;
                    return (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange({ min: range.min, max: range.max })}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                          isSelected
                            ? 'bg-[#3B82F6] border-transparent text-white shadow-lg shadow-[#3B82F6]/25'
                            : 'glass-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">{t('sl_sort_by')}</h3>
                <div className="space-y-2">
                  {[
                    { id: 'rating', label: 'Highest Rating' },
                    { id: 'response', label: 'Fastest Response' },
                    { id: 'price', label: 'Lowest Price' },
                  ].map(option => {
                    const isSelected = sortBy === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                           isSelected
                            ? 'bg-[#3B82F6] border-transparent text-white shadow-lg shadow-[#3B82F6]/25'
                            : 'glass-card text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 w-full">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredWorkers.length}</span> {t('nav_workers')}
                {selectedService && ` for ${SERVICES.find(s => s.id === selectedService)?.name}`}
              </p>
            </div>

            <div className="space-y-4">
              {filteredWorkers.map((worker, i) => (
                <div
                  key={worker.id}
                  className="glass-card rounded-2xl p-6 hover:border-[#3B82F6]/50 dark:hover:border-[#3B82F6]/50 transition-all group animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-6">
                    {/* Avatar & Info */}
                    <div className="flex gap-4 sm:col-span-1">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center flex-shrink-0 font-bold text-white text-lg shadow-lg">
                        {worker.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-syne font-bold text-lg text-gray-900 dark:text-white truncate">{worker.name}</h4>
                          {worker.verified && (
                            <div className="px-2 py-0.5 bg-[#10B981]/10 border border-[#10B981]/20 rounded text-[10px] text-[#10B981] flex-shrink-0 font-medium">
                              Verified
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{worker.specialty} • {worker.experience}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
                            {worker.area}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                            {worker.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="text-right flex flex-col items-end">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-900 dark:text-white">{worker.rating}</span>
                          </div>
                          <p className="text-gray-500 text-xs">({worker.reviews} reviews)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="text-right flex-1 sm:flex-none">
                          <p className="font-bold text-[#06B6D4] text-lg">₹{worker.hourlyRate}</p>
                          <p className="text-gray-500 text-xs">per hour</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(worker.id)}
                          className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-[#3B82F6]/10 dark:hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/30 transition-all"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${favorites.has(worker.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                    <button className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#3B82F6]" />
                      Message
                    </button>
                    <button onClick={() => navigate('/worker')} className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-[#3B82F6]/20">
                      {t('workers_book_btn')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredWorkers.length === 0 && (
              <div className="text-center py-16 glass-card rounded-2xl border-transparent">
                <p className="text-gray-900 dark:text-gray-300 font-medium mb-2">No workers found matching your criteria</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or area</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
