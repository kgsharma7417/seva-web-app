import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProfileHeader from '../components/profile/ProfileHeader';
import AboutSection from '../components/profile/AboutSection';
import ReviewsList from '../components/profile/ReviewsList';
import BookingPanel from '../components/profile/BookingPanel';
import { useLanguage } from '../context/LanguageContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const db = getFirestore(app);
  
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackData = {
    id: 'dummy_worker_id',
    initials: 'RK',
    name: 'Ramesh Kumar',
    skill: t('cat_ac') + ' Expert',
    experience: '7+ Years',
    rating: 4.9,
    reviews: 142,
    location: 'Taj Ganj, Agra',
    jobsCompleted: '850+',
    price: '₹299',
    responseTime: '12 min',
    bio: 'Professional AC technician with over 7 years of experience in repairing all types of air conditioners including split, window, and central ACs. Certified by major brands. Punctual, clean working style, and guarantees 100% satisfaction.',
    skills: [
      'AC Servicing & Cleaning',
      'Gas Refilling & Leak Repair',
      'PCB Repair & Replacement',
      'Compressor Issues',
      'Installation & Uninstallation'
    ],
    languages: ['Hindi', 'English', 'Braj'],
    reviewsList: [
      {
        author: 'Priya Sharma',
        date: '2 days ago',
        rating: 5,
        text: 'Ramesh was extremely professional. He diagnosed the cooling issue in my Split AC within 5 minutes and fixed it quickly. Highly recommended!'
      },
      {
        author: 'Vikram Singh',
        date: '1 week ago',
        rating: 5,
        text: 'Very clean work. He made sure not to mess up the room while servicing. The AC is working like new now.'
      }
    ]
  };

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        if (!id) throw new Error("No ID");
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'worker') {
          const data = docSnap.data();
          setWorkerData({
            id: docSnap.id,
            initials: data.name ? data.name.substring(0, 2).toUpperCase() : 'W',
            name: data.name || 'Unknown',
            skill: data.specialty || 'Service Expert',
            experience: data.experience || '1 Year',
            rating: data.rating || 5.0,
            reviews: data.reviews || 0,
            location: data.area || 'Unknown Location',
            jobsCompleted: '0+',
            price: `₹${data.hourlyRate || 250}`,
            responseTime: `${data.responseTimeMinutes || 15} min`,
            bio: data.bio || 'Professional service provider.',
            skills: ['General Service'],
            languages: ['Hindi', 'English'],
            reviewsList: []
          });
        }
      } catch (err) {
        console.error("Worker not found or error fetching", err);
      }
      setLoading(false);
    };
    fetchWorker();
  }, [id, db, t]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#060D1F] text-white">Loading...</div>;
  }

  // Use fallback data if no ID was provided or fetch failed
  const activeWorkerData = workerData || fallbackData;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter overflow-x-hidden pb-20 transition-colors duration-300">
      {/* Reused animated background for consistency */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-20 dark:opacity-10"></div>
        <div className="orb bg-[#3B82F6]/10 w-[600px] h-[600px] top-[-200px] right-[-200px]"></div>
      </div>

      {/* Simplified Top Navigation / Header for Profile Page */}
      <nav className="relative z-10 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#060D1F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="text-2xl font-syne font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate('/')}>
            Seva<span className="text-[#06B6D4]">.</span>
          </div>
          <button onClick={() => navigate('/listing')} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 shadow-sm dark:shadow-none">
            <ChevronLeft className="w-4 h-4" />
            {t('btn_back')}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Profile Details) */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileHeader worker={activeWorkerData} />
            <AboutSection bio={activeWorkerData.bio} skills={activeWorkerData.skills} languages={activeWorkerData.languages} />
            <ReviewsList reviews={activeWorkerData.reviewsList} />
          </div>

          {/* Right Column (Sticky Booking Widget) */}
          <div className="lg:col-span-1">
            <BookingPanel workerId={activeWorkerData.id} price={activeWorkerData.price} responseTime={activeWorkerData.responseTime} />
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default WorkerProfile;
