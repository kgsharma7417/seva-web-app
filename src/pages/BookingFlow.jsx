import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, CreditCard, Camera, CheckCircle2, Shield, Info, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import app from '../firebase';

export default function BookingFlow() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 12 Oct');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [bookingId, setBookingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = getFirestore(app);

  const worker = {
    name: 'Ramesh Kumar',
    service: t('cat_ac'),
    rating: 4.9,
    price: 299,
    avatar: 'RK'
  };

  const nextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (!currentUser) {
        alert("Please log in to confirm your booking!");
        navigate('/auth');
        return;
      }

      setIsSubmitting(true);
      try {
        const bookingData = {
          customerId: currentUser.uid,
          customerName: currentUser.displayName || 'Customer',
          // Dummy worker for testing worker dashboard
          workerId: 'dummy_worker_id', 
          workerName: worker.name,
          service: worker.service,
          status: 'pending',
          date: selectedDate,
          time: selectedTime,
          address: 'Flat 402, Taj Residency, Fatehabad Road, Agra',
          price: worker.price,
          totalAmount: worker.price + 45,
          paymentMethod: paymentMethod,
          createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'bookings'), bookingData);
        setBookingId(docRef.id);
        setIsSuccess(true);
      } catch (error) {
        console.error("Error creating booking: ", error);
        alert("Failed to confirm booking. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <div className="glass-card bg-white dark:bg-white/5 border border-gray-200 dark:border-[#10B981]/30 max-w-md w-full p-8 rounded-3xl text-center shadow-lg dark:shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-fade-up">
          <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#10B981]/25">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-syne font-bold text-gray-900 dark:text-white mb-2">{t('bf_success')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your booking ID is #{bookingId.slice(-6).toUpperCase()}.</p>
          
          <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4 text-left mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Worker</span>
              <span className="text-gray-900 dark:text-white text-sm font-bold">{worker.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Schedule</span>
              <span className="text-gray-900 dark:text-white text-sm font-bold">{selectedDate}, {selectedTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-xl p-4 mb-8 text-left">
            <Smartphone className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
            <p className="text-xs text-[#3B82F6]">Booking details have been sent via SMS & Email. You can cancel or reschedule for free within the next 2 hours.</p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-white border border-gray-200 dark:glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm font-bold shadow-sm dark:shadow-none">Reschedule</button>
            <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-colors text-sm font-bold shadow-md">View Status</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-white font-inter transition-colors duration-300 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="bg-grid absolute inset-0 opacity-20 dark:opacity-10"></div>
        <div className="orb bg-[#3B82F6]/5 w-[500px] h-[500px] top-[-100px] right-[-100px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#060D1F]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/worker')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-syne font-bold">Book Service</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20' : 
                  step > s ? 'bg-[#10B981] text-white' : 'bg-gray-200 text-gray-500 dark:bg-white/5 dark:text-gray-500'
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4"/> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 transition-colors ${step > s ? 'bg-[#10B981]' : 'bg-gray-200 dark:bg-white/5'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column - Forms */}
          <div className="flex-1 w-full space-y-6">
            
            {/* STEP 1: Details */}
            {step === 1 && (
              <div className="glass-card bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 animate-fade-up shadow-sm dark:shadow-none">
                <h2 className="text-xl font-syne font-bold mb-6">{t('bf_step1')}</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Describe your problem (Optional)</label>
                    <textarea 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] transition-all resize-none h-32"
                      placeholder="E.g. AC is not cooling properly, makes a weird noise..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Upload Photos</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-[#3B82F6]/50 dark:hover:border-[#3B82F6]/50 transition-colors cursor-pointer bg-gray-50 dark:bg-white/[0.02]">
                      <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mb-3 shadow-sm dark:shadow-none">
                        <Camera className="w-5 h-5 text-[#3B82F6]" />
                      </div>
                      <p className="text-gray-900 dark:text-white text-sm font-bold mb-1">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Date & Time */}
            {step === 2 && (
              <div className="glass-card bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 animate-fade-up shadow-sm dark:shadow-none">
                <h2 className="text-xl font-syne font-bold mb-6">{t('bf_step2')}</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4"/> Date
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {['Today, 11 Oct', 'Tomorrow, 12 Oct', 'Sat, 13 Oct', 'Sun, 14 Oct'].map(date => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`px-5 py-3 rounded-xl whitespace-nowrap text-sm font-bold transition-all border ${
                            selectedDate === date 
                              ? 'bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6] dark:text-white shadow-sm dark:shadow-none' 
                              : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-white/5 dark:border-white/5 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4"/> Time Slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 rounded-xl text-sm font-bold transition-all border text-center ${
                            selectedTime === time 
                              ? 'bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6] dark:text-white shadow-sm dark:shadow-none' 
                              : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-white/5 dark:border-white/5 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Address & Payment */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-up">
                {/* Address */}
                <div className="glass-card bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none">
                  <h2 className="text-xl font-syne font-bold mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#3B82F6]"/> Service Address</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-2xl p-4 flex gap-4 cursor-pointer">
                      <div className="mt-1">
                        <div className="w-4 h-4 rounded-full border-2 border-[#3B82F6] flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-bold text-sm">Home</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 leading-relaxed">Flat 402, Taj Residency, Fatehabad Road<br/>Agra, Uttar Pradesh 282001</p>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gray-50 dark:glass-card border border-dashed border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-sm font-bold">
                      + Add New Address
                    </button>
                  </div>
                </div>

                {/* Payment */}
                <div className="glass-card bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none">
                  <h2 className="text-xl font-syne font-bold mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#10B981]"/> Payment Method</h2>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'upi', name: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
                      { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
                      { id: 'cash', name: 'Pay after service (Cash)', icon: '💵' }
                    ].map(method => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                          paymentMethod === method.id 
                            ? 'bg-gray-50 border-gray-300 dark:bg-white/10 dark:border-white/30' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{method.icon}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{method.name}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#10B981]' : 'border-gray-300 dark:border-gray-500'}`}>
                          {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-gray-400" />
                    Payments are securely processed by Razorpay.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="glass-card bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-3xl p-6 sticky top-24 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-syne font-bold mb-4">Order Summary</h3>
              
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-white/5 mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                  {worker.avatar}
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold">{worker.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{worker.service}</p>
                </div>
              </div>

              {(step >= 2) && (
                <div className="pb-4 border-b border-gray-200 dark:border-white/5 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Date</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedDate.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Clock className="w-4 h-4"/> Time</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedTime}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Service Fee</span>
                  <span className="text-gray-900 dark:text-white">₹{worker.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Taxes & Fees <Info className="inline w-3 h-3 text-gray-400 dark:text-gray-500 ml-1"/></span>
                  <span className="text-gray-900 dark:text-white">₹45</span>
                </div>
                <div className="border-t border-gray-200 dark:border-white/5 pt-3 flex justify-between">
                  <span className="text-gray-900 dark:text-white font-bold">Total Amount</span>
                  <span className="text-2xl font-syne font-bold text-[#3B82F6]">₹{worker.price + 45}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {step > 1 && (
                  <button onClick={prevStep} className="px-5 py-3.5 bg-gray-100 border border-gray-200 dark:glass-card text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors font-bold text-sm shadow-sm dark:shadow-none">
                    {t('btn_back')}
                  </button>
                )}
                <button 
                  onClick={nextStep} 
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl hover:scale-[1.02] transition-transform font-bold text-sm shadow-lg shadow-[#3B82F6]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Confirming...' : (step === 3 ? t('bf_confirm_pay') : t('btn_continue'))} {!isSubmitting && <ChevronRight className="w-4 h-4"/>}
                </button>
              </div>

              <p className="text-[10px] text-gray-500 text-center mt-4 px-4 leading-relaxed">
                By proceeding, you agree to our Terms of Service & Cancellation Policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
