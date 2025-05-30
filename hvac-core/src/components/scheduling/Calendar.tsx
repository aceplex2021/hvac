'use client'

import { useState, useCallback } from 'react'
import Calendar from 'react-calendar'
import { ScheduleTemplate, TimeSlot, DayOfWeek } from '@/types/scheduling'
import { checkAvailability } from '@/lib/scheduling'
import { cn } from '@/lib/utils'

interface SchedulingCalendarProps {
  template: ScheduleTemplate
  onTimeSlotSelect?: (date: Date, timeSlot: TimeSlot) => void
  className?: string
}

export function SchedulingCalendar({ template, onTimeSlotSelect, className }: SchedulingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>({})

  const getAvailableTimeSlots = useCallback((date: Date) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' }) as DayOfWeek
    const dailySchedule = template.dailySchedules.find(schedule => schedule.day === dayOfWeek)

    if (!dailySchedule || !dailySchedule.isAvailable) {
      return []
    }

    return dailySchedule.timeSlots.filter(slot => {
      const result = checkAvailability(template, date, slot.start, template.defaultDuration)
      return result.isAvailable && !result.requiresApproval
    })
  }, [template])

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null)
    const slots = getAvailableTimeSlots(date)
    setAvailability(prev => ({
      ...prev,
      [date.toISOString()]: slots
    }))
  }

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    if (onTimeSlotSelect) {
      const appointmentDate = new Date(selectedDate)
      const [hours, minutes] = slot.start.split(':').map(Number)
      appointmentDate.setHours(hours, minutes, 0, 0)
      onTimeSlotSelect(appointmentDate, slot)
    }
  }

  const tileClassName = ({ date }: { date: Date }) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' }) as DayOfWeek
    const dailySchedule = template.dailySchedules.find(schedule => schedule.day === dayOfWeek)
    const hasAvailableSlots = dailySchedule?.isAvailable && dailySchedule.timeSlots.length > 0

    return cn(
      'rounded-md p-2',
      hasAvailableSlots ? 'hover:bg-blue-50' : 'text-gray-400',
      date.toDateString() === selectedDate.toDateString() ? 'bg-blue-100' : ''
    )
  }

  const tileDisabled = ({ date }: { date: Date }) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' }) as DayOfWeek
    const dailySchedule = template.dailySchedules.find(schedule => schedule.day === dayOfWeek)
    return !dailySchedule?.isAvailable || dailySchedule.timeSlots.length === 0
  }

  return (
    <div className={cn('flex flex-col md:flex-row gap-6', className)}>
      <div className="w-full md:w-1/2">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          className="rounded-lg border p-4"
        />
      </div>
      
      <div className="w-full md:w-1/2">
        <h3 className="text-lg font-semibold mb-4">
          Available Time Slots for {selectedDate.toLocaleDateString()}
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {availability[selectedDate.toISOString()]?.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleTimeSlotSelect(slot)}
              className={cn(
                'p-3 rounded-md border text-sm',
                selectedTimeSlot?.start === slot.start
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'hover:bg-blue-50 border-gray-200'
              )}
            >
              {slot.start} - {slot.end}
            </button>
          ))}
        </div>

        {!availability[selectedDate.toISOString()]?.length && (
          <p className="text-gray-500 text-sm">
            No available time slots for this date
          </p>
        )}
      </div>
    </div>
  )
} 