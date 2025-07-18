import { useState, useEffect } from 'react';

interface TimeSlot {
  time: string;
  datetime: string;
}

export const useAvailableSlots = (businessId: number, date: string, serviceId: number) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId || !date || !serviceId) {
      setSlots([]);
      return;
    }

    const fetchAvailableSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          date: date,
          service_id: serviceId.toString()
        });

        const response = await fetch(`/api/business/${businessId}/available-slots?${params}`);
        const data = await response.json();

        if (response.ok) {
          setSlots(data.slots);
        } else {
          setError(data.error || 'Failed to fetch available slots');
          setSlots([]);
        }
      } catch (err) {
        // For demo purposes, generate mock available slots
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay();
        
        // Don't show slots for weekends (demo business is closed)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setSlots([]);
          setError(null);
          setLoading(false);
          return;
        }

        // Generate time slots from 9 AM to 5 PM, every 30 minutes
        const mockSlots: TimeSlot[] = [];
        const startHour = 9;
        const endHour = 17;

        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const datetime = `${date}T${timeString}:00`;
            
            mockSlots.push({
              time: timeString,
              datetime: datetime
            });
          }
        }

        // Remove some random slots to simulate bookings
        const availableSlots = mockSlots.filter((_, index) => {
          // Remove about 30% of slots randomly to simulate existing bookings
          return Math.random() > 0.3;
        });

        setSlots(availableSlots);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [businessId, date, serviceId]);

  return { slots, loading, error };
};