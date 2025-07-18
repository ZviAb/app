import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBusinessHours } from '../hooks/useBusinessHours';

interface BusinessHoursProps {
  businessId: number;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ businessId }) => {
  const { t, isRTL } = useLanguage();
  const { hours, loading, error } = useBusinessHours(businessId);

  const dayNames = [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), t('day.thursday'), 
    t('day.friday'), t('day.saturday'), t('day.sunday')
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
        <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
          <span className="text-gray-600">{t('hours.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
        <div className={`flex items-center text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <AlertCircle className={`h-6 w-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <span>{t('hours.error')}: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className={`flex items-center text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className={`h-8 w-8 ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <div>
            <h2 className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('hours.title')}
            </h2>
            <p className={`text-blue-100 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('hours.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {dayNames.map((dayName, index) => {
            const dayHours = hours.find(h => h.day_of_week === index);
            const isOpen = dayHours && dayHours.available_ranges.length > 0;

            return (
              <div
                key={dayName}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    {isOpen ? (
                      <CheckCircle className={`h-5 w-5 text-green-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    ) : (
                      <div className={`h-5 w-5 bg-gray-300 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    )}
                    <span className="font-medium text-gray-900">{dayName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isOpen ? (
                    dayHours!.available_ranges.map((range, rangeIndex) => (
                      <span
                        key={rangeIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {range.start_time} - {range.end_time}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {t('hours.closed')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className={`font-medium text-blue-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('hours.notes')}
          </h3>
          <ul className={`text-sm text-blue-800 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <li>• {t('hours.timezone')}</li>
            <li>• {t('hours.availability')}</li>
            <li>• {t('hours.holidays')}</li>
            <li>• {t('hours.bookAdvance')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BusinessHours;