import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Star, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom green icon for online workers
const onlineIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 32px; height: 32px; 
    background: linear-gradient(135deg, #3B82F6, #06B6D4); 
    border-radius: 50% 50% 50% 0; 
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
  "><div style="
    transform: rotate(45deg); 
    color: white; font-weight: bold; font-size: 12px;
  ">W</div></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// User location icon
const userIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 16px; height: 16px; 
    background: #3B82F6; 
    border-radius: 50%; 
    border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Auto-fit bounds component
const FitBounds = ({ workers, userLocation }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (workers.length === 0 && userLocation?.coordinates) {
      map.setView([userLocation.coordinates.lat, userLocation.coordinates.lng], 13);
      return;
    }
    
    const bounds = [];
    if (userLocation?.coordinates) {
      bounds.push([userLocation.coordinates.lat, userLocation.coordinates.lng]);
    }
    workers.forEach(w => {
      if (w.coordinates) {
        bounds.push([w.coordinates.lat, w.coordinates.lng]);
      }
    });
    
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [workers, userLocation, map]);
  
  return null;
};

const WorkerMapView = ({ workers, userLocation, onWorkerClick }) => {
  const center = userLocation?.coordinates 
    ? [userLocation.coordinates.lat, userLocation.coordinates.lng] 
    : [27.1767, 78.0081];

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg" style={{ height: '600px' }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds workers={workers} userLocation={userLocation} />
        
        {/* User location marker */}
        {userLocation?.coordinates && (
          <Marker 
            position={[userLocation.coordinates.lat, userLocation.coordinates.lng]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold text-sm text-gray-900">📍 Your Location</p>
                <p className="text-xs text-gray-500">{userLocation.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Worker markers */}
        {workers.map((worker) => (
          worker.coordinates && (
            <Marker
              key={worker.id}
              position={[worker.coordinates.lat, worker.coordinates.lng]}
              icon={onlineIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {worker.image || 'W'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{worker.name}</h4>
                      <p className="text-xs text-gray-500">{worker.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{worker.rating}</span>
                      <span className="text-gray-400">({worker.reviews})</span>
                    </div>
                    <span className="font-bold text-[#06B6D4]">₹{worker.hourlyRate}/hr</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Navigation className="w-3 h-3 text-[#06B6D4]" />
                    <span>{worker.distanceKm?.toFixed(1)} km away</span>
                    {worker.isOnline && (
                      <span className="flex items-center gap-1 text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                        Online
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onWorkerClick(worker.id)}
                    className="w-full py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    View Profile & Book
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default WorkerMapView;
