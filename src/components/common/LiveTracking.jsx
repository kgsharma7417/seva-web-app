import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, MessageCircle, Star, ShieldCheck, MapPin } from 'lucide-react';

// Custom icons
const workerIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 40px; height: 40px; 
    background: linear-gradient(135deg, #10B981, #059669); 
    border-radius: 50%; 
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    display: flex; align-items: center; justify-content: center;
    position: relative;
    z-index: 1000;
  ">
    <div style="
      width: 12px; height: 12px; background: white; border-radius: 50%;
    "></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const userIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 24px; height: 24px; 
    background: #3B82F6; 
    border-radius: 50%; 
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to smoothly pan and fit bounds
const MapController = ({ workerPos, userPos }) => {
  const map = useMap();
  
  useEffect(() => {
    if (workerPos && userPos) {
      const bounds = L.latLngBounds([workerPos, userPos]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [workerPos, userPos, map]);

  return null;
};

export default function LiveTracking({ booking, userLocation }) {
  // Mock route from a bit away to the user's location
  const uLoc = userLocation?.coordinates || { lat: 27.1767, lng: 78.0081 };
  
  const initialWorkerPos = {
    lat: uLoc.lat - 0.015,
    lng: uLoc.lng - 0.015
  };

  const [workerPos, setWorkerPos] = useState(initialWorkerPos);
  const [eta, setEta] = useState(15);
  
  // Simulated real-time movement
  useEffect(() => {
    let currentLat = initialWorkerPos.lat;
    let currentLng = initialWorkerPos.lng;
    
    const latStep = (uLoc.lat - initialWorkerPos.lat) / 100;
    const lngStep = (uLoc.lng - initialWorkerPos.lng) / 100;

    const interval = setInterval(() => {
      currentLat += latStep;
      currentLng += lngStep;
      
      // Calculate remaining distance roughly
      const dist = Math.sqrt(Math.pow(uLoc.lat - currentLat, 2) + Math.pow(uLoc.lng - currentLng, 2));
      
      if (dist < 0.001) {
        clearInterval(interval);
        setEta(0);
        setWorkerPos(uLoc);
      } else {
        setWorkerPos({ lat: currentLat, lng: currentLng });
        // Update ETA
        const progress = 1 - (dist / Math.sqrt(Math.pow(0.015, 2) + Math.pow(0.015, 2)));
        setEta(Math.max(1, Math.round(15 * (1 - progress))));
      }
    }, 1500); // update every 1.5s for smooth animation demo

    return () => clearInterval(interval);
  }, [uLoc.lat, uLoc.lng]);

  const routePath = [
    [workerPos.lat, workerPos.lng],
    [uLoc.lat, uLoc.lng]
  ];

  return (
    <div className="bg-white dark:bg-[#060D1F] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-fade-up my-6">
      {/* Map Section */}
      <div className="h-[400px] w-full relative z-0">
        <MapContainer 
          center={[uLoc.lat, uLoc.lng]} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap & CARTO'
          />
          <MapController workerPos={workerPos} userPos={uLoc} />
          
          <Marker position={[uLoc.lat, uLoc.lng]} icon={userIcon}>
            <Popup className="font-syne font-bold">Your Location</Popup>
          </Marker>
          
          <Marker position={[workerPos.lat, workerPos.lng]} icon={workerIcon}>
            <Popup className="font-syne font-bold">Worker En Route</Popup>
          </Marker>

          <Polyline 
            positions={routePath} 
            color="#10B981" 
            weight={4} 
            dashArray="10, 10" 
            opacity={0.7}
            className="animate-pulse"
          />
        </MapContainer>

        {/* ETA Overlay */}
        <div className="absolute top-4 left-4 z-[1000] glass-card bg-white/90 dark:bg-[#060D1F]/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Arriving In</p>
          <p className="text-3xl font-syne font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {eta > 0 ? eta + ' min' : 'Arrived!'}
            <span className="relative flex h-3 w-3">
              {eta > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${eta > 0 ? 'bg-[#10B981]' : 'bg-gray-400'}`}></span>
            </span>
          </p>
        </div>
      </div>

      {/* Worker Details Card Section */}
      <div className="p-6 md:p-8 relative z-10 bg-white dark:bg-[#060D1F]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full sm:w-auto">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#3B82F6]/20">
                {booking?.workerName ? booking.workerName.charAt(0) : 'W'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#10B981] text-white p-1 rounded-full border-2 border-white dark:border-[#060D1F]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-syne font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                {booking?.workerName || 'Assigned Worker'} 
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{booking?.service || 'Service Expert'}</p>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-900 dark:text-white">4.8</span>
                <span className="text-gray-400">(120+ jobs)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold transition-colors">
              <MessageCircle className="w-5 h-5" /> Message
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold shadow-lg shadow-[#10B981]/25 transition-all hover:scale-105">
              <Phone className="w-5 h-5" /> Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
