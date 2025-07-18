import { useState, useEffect } from 'react';

interface BusinessHours {
  day_of_week: number;
  available_ranges: Array<{
    start_time: string;
    end_time: string;
  }>;
  is_fragmented: boolean;
  original_start_time: string;
  original_end_time: string;
}

export const useBusinessHours = (businessId: number) => {
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;

    const fetchBusinessHours = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/business/${businessId}/hours`);
        const data = await response.json();

        if (response.ok) {
          setHours(data.hours);
        } else {
          setError(data.error || 'Failed to fetch business hours');
        }
      } catch (err) {
        // For demo purposes, return mock data
        const mockHours: BusinessHours[] = [
          {
            day_of_week: 0, // Monday
            available_ranges: [{ start_time: '09:00', end_time: '17:00' }],
            is_fragmented: false,
            original_start_time: '09:00',
            original_end_time: '17:00'
          },
          {
            day_of_week: 1, // Tuesday
            available_ranges: [
              { start_time: '09:00', end_time: '12:00' },
              { start_time: '13:00', end_time: '17:00' }
            ],
            is_fragmented: true,
            original_start_time: '09:00',
            original_end_time: '17:00'
          },
          {
            day_of_week: 2, // Wednesday
            available_ranges: [{ start_time: '09:00', end_time: '17:00' }],
            is_fragmented: false,
            original_start_time: '09:00',
            original_end_time: '17:00'
          },
          {
            day_of_week: 3, // Thursday
            available_ranges: [{ start_time: '09:00', end_time: '17:00' }],
            is_fragmented: false,
            original_start_time: '09:00',
            original_end_time: '17:00'
          },
          {
            day_of_week: 4, // Friday
            available_ranges: [{ start_time: '09:00', end_time: '15:00' }],
            is_fragmented: false,
            original_start_time: '09:00',
            original_end_time: '15:00'
          },
          {
            day_of_week: 5, // Saturday
            available_ranges: [],
            is_fragmented: false,
            original_start_time: '',
            original_end_time: ''
          },
          {
            day_of_week: 6, // Sunday
            available_ranges: [],
            is_fragmented: false,
            original_start_time: '',
            original_end_time: ''
          }
        ];
        setHours(mockHours);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessHours();
  }, [businessId]);

  return { hours, loading, error };
};