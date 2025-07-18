import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { getCsrfToken } from '../utils/auth';

const BookingFlow: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [step, setStep] = useState(1);
  const [businessId] = useState(1); // Demo business ID
  const [serviceId] = useState(1); // Demo service ID
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { slots, loading: slotsLoading, error: slotsError } = useAvailableSlots(
    businessId,
    selectedDate,
    serviceId
  );

  // Get today's date as minimum selectable date
  const today = new Date().toISOString().split('T')[0];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
    setStep(2);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setBookingError(t('booking.selectTimeSlot'));
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const formData = new FormData();
      formData.append('appointment_datetime', selectedSlot);
      formData.append('csrf_token', getCsrfToken());

      const response = await fetch(`/client/book/${businessId}/service/${serviceId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.redirected || response.ok) {
        setBookingSuccess(true);
        setStep(4);
      } else {
        setBookingError('Failed to book appointment. Please try again.');
      }
    } catch (err) {
      setBookingError('Network error. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBooking = () => {
    setSelectedDate('');
    setSelectedSlot('');
    setStep(1);
    setBookingSuccess(false);
    setBookingError('');
  };

  const formatSlotTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className={`flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  step >= stepNumber
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {stepNumber === 4 && bookingSuccess ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 4 && (
                <ArrowRight className={`h-5 w-5 ${step > stepNumber ? 'text-blue-600' : 'text-gray-300'} ${
                  isRTL ? 'rotate-180' : ''
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <div className="text-center">
            <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'text-right' : 'text-center'}`}>
              {step === 1 && t('booking.selectDate')}
              {step === 2 && t('booking.chooseTime')}
              {step === 3 && t('booking.confirmBooking')}
              {step === 4 && t('booking.bookingComplete')}
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Date Selection */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
          <div className="text-center mb-6">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('booking.selectDateTitle')}
            </h2>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('booking.selectDateDesc')}
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => handleDateSelect(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200 ${
                isRTL ? 'text-right' : 'text-center'
              }`}
            />
          </div>
        </div>
      )}

      {/* Step 2: Time Selection */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
          <div className="text-center mb-6">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('booking.availableTimes')}
            </h2>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-center'}`}>
              {selectedDate && `${t('booking.availableSlotsFor')} ${formatDate(selectedDate)}`}
            </p>
          </div>

          {slotsLoading ? (
            <div className={`flex items-center justify-center py-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
              <span className="text-gray-600">{t('booking.loadingTimes')}</span>
            </div>
          ) : slotsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-700">{slotsError}</p>
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {slots.map((slot) => (
                <button
                  key={slot.datetime}
                  onClick={() => handleSlotSelect(slot.datetime)}
                  className="px-4 py-3 text-center border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium text-blue-700"
                >
                  {formatSlotTime(slot.datetime)}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <p className="text-yellow-700">{t('booking.noSlots')}</p>
              <button
                onClick={() => setStep(1)}
                className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('booking.chooseDifferentDate')}
              </button>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('booking.backToDate')}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
          <div className="text-center mb-6">
            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('booking.confirmTitle')}
            </h2>
            <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('booking.reviewDetails')}
            </p>
          </div>

          <div className="max-w-md mx-auto bg-blue-50 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-600">{t('booking.date')}:</span>
                <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-600">{t('booking.time')}:</span>
                <span className="font-medium text-gray-900">{formatSlotTime(selectedSlot)}</span>
              </div>
              <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-600">{t('booking.service')}:</span>
                <span className="font-medium text-gray-900">{t('booking.demoService')}</span>
              </div>
            </div>
          </div>

          {bookingError && (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center max-w-md mx-auto ${
              isRTL ? 'flex-row-reverse' : ''
            }`}>
              <AlertCircle className={`h-5 w-5 text-red-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span className="text-red-700">{bookingError}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {t('booking.backToTime')}
            </button>
            <button
              onClick={handleBookAppointment}
              disabled={bookingLoading}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {bookingLoading ? (
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                  {t('booking.booking')}
                </div>
              ) : (
                t('booking.confirmButton')
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && bookingSuccess && (
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('booking.confirmed')}
            </h2>
            <p className={`text-gray-600 mb-6 ${isRTL ? 'text-right' : 'text-center'}`}>
              {t('booking.successMessage')} {formatDate(selectedDate)} {t('common.at')} {formatSlotTime(selectedSlot)}.
            </p>
            
            <div className="bg-green-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <h3 className={`font-medium text-green-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('booking.whatsNext')}
              </h3>
              <ul className={`text-sm text-green-800 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <li>• {t('booking.confirmationEmail')}</li>
                <li>• {t('booking.addToCalendar')}</li>
                <li>• {t('booking.manageDashboard')}</li>
              </ul>
            </div>

            <button
              onClick={resetBooking}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              {t('booking.bookAnother')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;