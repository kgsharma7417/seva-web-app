import React, { useState, useEffect } from 'react';
import { X, Camera, Save, MapPin, Briefcase, IndianRupee, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MapSelector from '../common/MapSelector';

const SERVICE_OPTIONS = [
  { id: 'ac-repair', label: 'AC Repair' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'carpentry', label: 'Carpentry' },
  { id: 'painting', label: 'Painting' }
];

const EditProfileModal = ({ isOpen, onClose }) => {
  const { userData, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    area: '',
    avatar: '',
    coordinates: null,
    // Worker fields
    services: ['ac-repair'], // Multi-select array
    specialty: '',
    hourlyRate: 250,
    visitingCharge: 150,
    travelRadius: 10,
    experience: '',
    bio: '',
    skills: '',
    languages: '',
    responseTimeMinutes: 15,
    // Checklist/Verification fields
    bankName: '',
    bankAccount: '',
    ifsc: '',
    upiId: '',
    vaccinationDate: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        city: userData.city || '',
        area: userData.area || '',
        avatar: userData.avatar || '',
        coordinates: userData.coordinates || null,
        // Worker details
        services: userData.services || (userData.service ? [userData.service] : ['ac-repair']),
        specialty: userData.specialty || '',
        hourlyRate: userData.hourlyRate || 250,
        visitingCharge: userData.visitingCharge || 150,
        travelRadius: userData.travelRadius || 10,
        experience: userData.experience || '',
        bio: userData.bio || '',
        skills: userData.skills ? userData.skills.join(', ') : '',
        languages: userData.languages ? userData.languages.join(', ') : '',
        responseTimeMinutes: userData.responseTimeMinutes || 15,
        // Bank details
        bankName: userData.bankName || '',
        bankAccount: userData.bankAccount || '',
        ifsc: userData.ifsc || '',
        upiId: userData.upiId || '',
        vaccinationDate: userData.vaccinationDate || '',
      });
    }
  }, [userData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const isSelected = prev.services.includes(serviceId);
      const newServices = isSelected
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId];
      // Prevent unselecting all (must have at least one)
      return { ...prev, services: newServices.length > 0 ? newServices : prev.services };
    });
  };

  const handleLocationSelect = (loc) => {
    const parts = loc.name.split(',');
    const city = parts[parts.length - 1].trim();
    const area = parts.length > 1 ? parts.slice(0, parts.length - 1).join(',').trim() : city;
    
    setFormData(prev => ({ 
      ...prev, 
      city, 
      area,
      coordinates: loc.coordinates 
    }));
    setIsMapOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (userData?.role === 'worker') {
        payload.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
        payload.languages = formData.languages.split(',').map(s => s.trim()).filter(s => s);
        payload.hourlyRate = Number(formData.hourlyRate) || 250;
        payload.visitingCharge = Number(formData.visitingCharge) || 150;
        payload.travelRadius = Number(formData.travelRadius) || 10;
        payload.responseTimeMinutes = Number(formData.responseTimeMinutes) || 15;
      }
      if (!payload.coordinates) delete payload.coordinates;
      
      await updateUserProfile(payload);
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const locationLabel = formData.area && formData.city 
    ? `${formData.area}, ${formData.city}` 
    : formData.coordinates 
      ? `${formData.coordinates.lat.toFixed(4)}, ${formData.coordinates.lng.toFixed(4)}`
      : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0A132D] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-syne">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* Basic Details Section */}
          <div className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Area / Suburb</label>
                <input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" required />
              </div>
            </div>

            <button type="button" onClick={() => setIsMapOpen(true)} className="flex items-center gap-2 text-[#3B82F6] text-sm font-medium hover:underline text-left">
              <MapPin className="w-4 h-4" />
              {locationLabel ? `📍 ${locationLabel} — Change Location` : 'Set Location on Map'}
            </button>
          </div>

          {userData?.role === 'worker' && (
            <>
              {/* Worker Professional Details */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-6">
                <h3 className="font-syne font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#3B82F6]" /> Professional Details
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Categories (Multi-select)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SERVICE_OPTIONS.map(opt => (
                      <label key={opt.id} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.services.includes(opt.id) ? 'border-[#3B82F6] bg-[#3B82F6]/5 text-[#3B82F6]' : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        <input type="checkbox" className="hidden" checked={formData.services.includes(opt.id)} onChange={() => handleServiceToggle(opt.id)} />
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.services.includes(opt.id) ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-gray-300 dark:border-gray-600'}`}>
                          {formData.services.includes(opt.id) && <X className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialty (e.g. Master Plumber)</label>
                    <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Experience (e.g. 5 yrs)</label>
                    <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hourly Rate (₹)</label>
                    <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Visiting Charge (₹)</label>
                    <input type="number" name="visitingCharge" value={formData.visitingCharge} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Radius (km)</label>
                    <input type="number" name="travelRadius" value={formData.travelRadius} onChange={handleChange} min="1" max="50" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Response (min)</label>
                    <input type="number" name="responseTimeMinutes" value={formData.responseTimeMinutes} onChange={handleChange} min="1" max="120" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Skills (comma separated)</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. PCB Repair, Gas Refill" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Languages (comma separated)</label>
                    <input type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="e.g. Hindi, English" className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#3B82F6] text-gray-900 dark:text-white" />
                  </div>
                </div>
              </div>

              {/* Bank & Verification Details */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-6">
                <h3 className="font-syne font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" /> Verification & Bank Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bank Name</label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#10B981] text-gray-900 dark:text-white" placeholder="e.g. State Bank of India" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Account Number</label>
                    <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#10B981] text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">IFSC Code</label>
                    <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#10B981] text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">UPI ID (Optional)</label>
                    <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#10B981] text-gray-900 dark:text-white" placeholder="e.g. 9876543210@ybl" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Vaccination Date (For COVID/Tetanus)</label>
                  <input type="date" name="vaccinationDate" value={formData.vaccinationDate} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#10B981] text-gray-900 dark:text-white" />
                </div>
              </div>
            </>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 glass-card-static rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-medium hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
              {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>

      <MapSelector isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} onSelect={handleLocationSelect} initialPosition={formData.coordinates} />
    </div>
  );
};

export default EditProfileModal;
