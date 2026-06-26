import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  // Default to Agra
  const [userLocation, setUserLocation] = useState({
    type: 'predefined',
    name: 'Agra',
    coordinates: { lat: 27.1767, lng: 78.0081 } // Agra coordinates
  });

  // Load from localStorage if available
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setUserLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
    }
  }, []);

  const setLocation = (locationData) => {
    setUserLocation(locationData);
    localStorage.setItem('userLocation', JSON.stringify(locationData));
  };

  const value = {
    userLocation,
    setLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
