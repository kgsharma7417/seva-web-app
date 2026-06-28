import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronRight, ChevronDown, Navigation } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from '../../context/LocationContext';
import MapSelector from '../common/MapSelector';

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userLocation, setLocation } = useLocation();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setIsMapOpen(false);
  };

  const handleGetCurrentLocation = () => {
    setIsLocationDropdownOpen(false);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    // Quick loading state placeholder
    setLocation({ type: 'custom', name: 'Locating...', coordinates: userLocation.coordinates });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&accept-language=${t('hero_title_1') === 'आगरा में' || t('hero_title_1') === 'आगरा के' ? 'hi' : 'en'}`);
          const data = await response.json();
          
          let locationName = 'Current Location';
          if (data && data.display_name) {
            // Use the full exact display name for "exact location"
            const parts = data.display_name.split(',');
            // Take first 3 parts to be reasonably exact but not too long
            locationName = parts.slice(0, 3).join(',').trim();
          }

          setLocation({
            type: 'custom',
            name: locationName,
            coordinates: { lat, lng }
          });
        } catch (error) {
          console.error("Geocoding failed", error);
          setLocation({
            type: 'custom',
            name: 'Exact Location',
            coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude }
          });
        }
      },
      (err) => {
        console.error("Geolocation error", err);
        alert("Unable to retrieve your location");
        setLocation(userLocation); // revert
      }
    );
  };

  const getCityName = () => {
    if (!userLocation || !userLocation.name) return 'Agra';
    if (userLocation.type === 'predefined') return 'Agra';
    const parts = userLocation.name.split(',');
    return parts[parts.length - 1].trim();
  };

  const city = getCityName();
  const title1 = t('hero_title_1').replace('Agra', city).replace('आगरा', city);
  const title2 = t('hero_title_2').replace('Agra', city).replace('आगरा', city);
  const title3 = t('hero_title_3').replace('Agra', city).replace('आगरा', city);

  return (
    <section className="pt-24 pb-16 px-4 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
      <div className="animate-fade-up animate-delay-100 inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#2a55e5] animate-pulse"></span>
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Available in your city</span>
      </div>
      
      <h1 className="animate-fade-up animate-delay-200 font-inter text-4xl md:text-6xl font-bold leading-tight mb-8 text-gray-900 dark:text-white">
        {title1}<br />
        {title2} <span className="text-[#2a55e5]">{title3}</span>
      </h1>
      
      <p className="animate-fade-up animate-delay-300 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
        {t('hero_subtitle')}
      </p>

      {/* Search Bar */}
      <div className="animate-fade-up animate-delay-300 w-full max-w-2xl relative mb-8 group z-50">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#3B82F6] transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder={t('search_placeholder')} 
          className="w-full bg-white border border-gray-200 rounded-full py-4 md:py-4 pl-12 pr-28 md:pr-40 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#2a55e5] transition-colors shadow-sm"
        />
        <div className="absolute inset-y-0 right-2 flex items-center space-x-2">
          
          <div className="relative">
            <button 
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="hidden sm:flex items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 text-xs text-gray-700 mr-2 transition-colors"
            >
              <MapPin className="w-3 h-3 mr-1 text-[#2a55e5]" />
              <span className="max-w-[100px] truncate">{userLocation.name}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute right-2 top-full mt-2 w-56 bg-white dark:bg-[#060D1F] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
                <button 
                  onClick={() => {
                    setLocation({ type: 'predefined', name: 'Agra', coordinates: { lat: 27.1767, lng: 78.0081 } });
                    setIsLocationDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-white/5"
                >
                  Agra (Default City)
                </button>
                <button 
                  onClick={handleGetCurrentLocation}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-white/5"
                >
                  <Navigation className="w-4 h-4 inline mr-2 text-[#10B981]" />
                  Use Exact Location
                </button>
                <button 
                  onClick={() => {
                    setIsLocationDropdownOpen(false);
                    setIsMapOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5 text-[#3B82F6] font-medium"
                >
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Choose on Map
                </button>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/listing')} className="bg-[#2a55e5] hover:bg-[#1f42b3] text-white px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base rounded-full transition-colors shadow-sm flex items-center font-bold">
            {t('search_btn')}
          </button>
        </div>
      </div>
      
      {/* Quick Select Chips */}
      <div className="animate-fade-up animate-delay-400 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="text-gray-600 font-bold mr-2">Quick links:</span>
        {['AC Repair', 'Plumbing', 'Electrician', 'Cleaning'].map((chip) => (
          <button key={chip} onClick={() => navigate('/listing')} className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-medium">
            {chip}
          </button>
        ))}
      </div>

      <MapSelector 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelect={handleLocationSelect}
        initialPosition={userLocation.coordinates}
      />
    </section>
  );
};

export default Hero;
