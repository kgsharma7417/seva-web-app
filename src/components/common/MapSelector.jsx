import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { X, Search, Navigation } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks and set marker
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapSelector = ({ isOpen, onClose, onSelect, initialPosition }) => {
  const { lang } = useLanguage();
  const [position, setPosition] = useState(initialPosition || { lat: 27.1767, lng: 78.0081 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update internal position if initialPosition changes when opening modal
  useEffect(() => {
    if (isOpen && initialPosition) {
      setPosition(initialPosition);
    }
  }, [isOpen, initialPosition]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Reverse geocoding using OpenStreetMap Nominatim with language support
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=10&accept-language=${lang === 'br' ? 'hi' : lang}`);
      const data = await response.json();
      
      let locationName = 'Custom Location';
      if (data && data.address) {
        const addr = data.address;
        const localArea = addr.village || addr.suburb || addr.neighbourhood || addr.town || addr.city_district;
        const city = addr.city || addr.county || addr.state_district;
        
        if (localArea && city && localArea !== city) {
          locationName = `${localArea}, ${city}`;
        } else if (city) {
          locationName = city;
        } else if (localArea) {
          locationName = localArea;
        } else {
          locationName = addr.state || 'Custom Location';
        }
      }

      onSelect({
        type: 'custom',
        name: locationName,
        coordinates: position
      });
    } catch (error) {
      console.error("Geocoding failed", error);
      onSelect({
        type: 'custom',
        name: 'Custom Location',
        coordinates: position
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&accept-language=${lang === 'br' ? 'hi' : lang}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setPosition({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        console.error("Geolocation error", err);
        alert("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0A132D] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-syne">Select Your Location</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search city, area or village..." 
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#3B82F6]"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-colors">
            Search
          </button>
          <button 
            onClick={handleCurrentLocation} 
            title="Use Current Location"
            className="p-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {/* Map */}
        <div className="h-[400px] w-full relative z-0">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-[#060D1F]">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Click on the map to place a pin
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={loading} className="px-6 py-2.5 rounded-xl bg-[#3B82F6] text-white font-medium hover:bg-[#2563EB] transition-colors flex items-center gap-2">
              {loading ? 'Confirming...' : 'Confirm Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
