'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  X,
  Save
} from 'lucide-react';

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface AvailabilityManagerProps {
  onSave: (slots: TimeSlot[]) => void;
  onClose: () => void;
}

export default function AvailabilityManager({ onSave, onClose }: AvailabilityManagerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: 1, startTime: '09:00', endTime: '17:00', available: true }
  ]);

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: timeSlots.length + 1,
      startTime: '09:00',
      endTime: '17:00',
      available: true
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: number, field: keyof TimeSlot, value: any) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSave = () => {
    onSave(timeSlots);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Manage Availability</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {timeSlots.map((slot) => (
            <div key={slot.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={slot.available}
                  onChange={(e) => updateTimeSlot(slot.id, 'available', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Available
                </label>
              </div>
              <button
                onClick={() => removeTimeSlot(slot.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={addTimeSlot}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 