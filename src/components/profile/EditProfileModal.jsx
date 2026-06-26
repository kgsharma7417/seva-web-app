import React, { useState, useEffect } from 'react';
import { X, Camera, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MapSelector from '../common/MapSelector';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { userData, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    area: '',
    avatar: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        city: userData.city || '',
        area: userData.area || '',
        avatar: userData.avatar || ''
      });
    }
  }, [userData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (loc) => {
    // loc.name is likely "Area, City" or "City"
    const parts = loc.name.split(',');
    const city = parts[parts.length - 1].trim();
    const area = parts.length > 1 ? parts.slice(0, parts.length - 1).join(',').trim() : city;
    
    setFormData(prev => ({ ...prev, city, area }));
    setIsMapOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0A132D] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-syne">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] flex items-center justify-center font-bold text-white text-3xl shadow-lg">
                {formData.avatar || (formData.name ? formData.name.substring(0, 2).toUpperCase() : 'U')}
              </div>
              <button type="button" className="absolute -bottom-3 -right-3 p-2 bg-white dark:bg-[#060D1F] border border-gray-200 dark:border-white/10 rounded-xl text-[#3B82F6] hover:scale-110 transition-transform shadow-md">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Area / Suburb</label>
                <input 
                  type="text" 
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white transition-colors"
                  required
                />
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="text-[#3B82F6] text-sm font-medium hover:underline text-left"
            >
              Update Location via Map
            </button>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 glass-card rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-medium hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>

      <MapSelector 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelect={handleLocationSelect}
      />
    </div>
  );
};

export default EditProfileModal;
