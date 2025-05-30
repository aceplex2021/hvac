'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, X } from 'lucide-react';

interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

interface CalendarIntegrationProps {
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  onClose: () => void;
}

export default function CalendarIntegration({ 
  selectedDate, 
  onTimeSelect,
  onClose 
}: CalendarIntegrationProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        // TODO: Replace with actual API call
        const mockTimeSlots: TimeSlot[] = [
          { id: 1, time: '9:00 AM', available: true },
          { id: 2, time: '10:00 AM', available: true },
          { id: 3, time: '11:00 AM', available: false },
          { id: 4, time: '1:00 PM', available: true },
          { id: 5, time: '2:00 PM', available: true },
          { id: 6, time: '3:00 PM', available: true },
          { id: 7, time: '4:00 PM', available: false },
        ];
        
        setTimeSlots(mockTimeSlots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              {formatDate(selectedDate)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.available && onTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`p-4 border rounded-lg text-center ${
                  slot.available
                    ? 'hover:border-blue-500 hover:bg-blue-50 text-gray-900'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {slot.time}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 