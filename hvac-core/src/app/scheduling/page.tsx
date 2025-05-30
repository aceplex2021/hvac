'use client'

import { useState } from 'react'
import { SchedulingCalendar } from '@/components/scheduling/Calendar'
import { BookingForm } from '@/components/scheduling/BookingForm'
import { SchedulingRulesManager } from '@/components/scheduling/SchedulingRulesManager'
import { ScheduleTemplate, TimeSlot, Appointment, ScheduleRule } from '@/types/scheduling'
import { supabase } from '@/lib/supabase'

// Example schedule template
const defaultTemplate: ScheduleTemplate = {
  id: 'default',
  name: 'Standard Schedule',
  description: 'Standard business hours schedule',
  defaultDuration: 60, // 60 minutes
  dailySchedules: [
    {
      day: 'monday',
      isAvailable: true,
      timeSlots: [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' }
      ],
      breaks: [
        { start: '12:00', end: '13:00' }
      ]
    },
    {
      day: 'tuesday',
      isAvailable: true,
      timeSlots: [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' }
      ],
      breaks: [
        { start: '12:00', end: '13:00' }
      ]
    },
    {
      day: 'wednesday',
      isAvailable: true,
      timeSlots: [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' }
      ],
      breaks: [
        { start: '12:00', end: '13:00' }
      ]
    },
    {
      day: 'thursday',
      isAvailable: true,
      timeSlots: [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' }
      ],
      breaks: [
        { start: '12:00', end: '13:00' }
      ]
    },
    {
      day: 'friday',
      isAvailable: true,
      timeSlots: [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' }
      ],
      breaks: [
        { start: '12:00', end: '13:00' }
      ]
    },
    {
      day: 'saturday',
      isAvailable: false,
      timeSlots: [],
      breaks: []
    },
    {
      day: 'sunday',
      isAvailable: false,
      timeSlots: [],
      breaks: []
    }
  ],
  rules: [
    {
      id: 'lead-time',
      type: 'leadTime',
      value: '24',
      action: 'block',
      description: 'Requires 24 hours lead time'
    }
  ],
  bufferTime: 15, // 15 minutes between appointments
  maxBookingsPerSlot: 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function SchedulingPage() {
  const [template, setTemplate] = useState<ScheduleTemplate>(defaultTemplate)
  const [selectedAppointment, setSelectedAppointment] = useState<{
    date: Date
    timeSlot: TimeSlot
  } | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [conflicts, setConflicts] = useState<Appointment[]>([])

  const handleTimeSlotSelect = async (date: Date, timeSlot: TimeSlot) => {
    // Check for conflicts
    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('startTime', date.toISOString())
      .lte('endTime', new Date(date.getTime() + 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('Error checking conflicts:', error)
      return
    }

    if (existingAppointments && existingAppointments.length > 0) {
      setConflicts(existingAppointments)
      alert('This time slot has conflicts with existing appointments.')
      return
    }

    setSelectedAppointment({ date, timeSlot })
    setIsBooking(true)
  }

  const handleBookingSubmit = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single()

      if (error) throw error

      // Reset the form
      setSelectedAppointment(null)
      setIsBooking(false)
      setConflicts([])
      
      // Show success message
      alert('Appointment booked successfully!')
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment. Please try again.')
    }
  }

  const handleBookingCancel = () => {
    setSelectedAppointment(null)
    setIsBooking(false)
    setConflicts([])
  }

  const handleRulesUpdate = (newRules: ScheduleRule[]) => {
    setTemplate(prev => ({
      ...prev,
      rules: newRules
    }))
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Schedule an Appointment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <SchedulingCalendar
              template={template}
              onTimeSlotSelect={handleTimeSlotSelect}
              className="mb-6"
            />

            {isBooking && selectedAppointment && (
              <div className="mt-6 p-4 bg-white border rounded-lg">
                <BookingForm
                  date={selectedAppointment.date}
                  timeSlot={selectedAppointment.timeSlot}
                  serviceTypeId="default-service" // TODO: Get from service selection
                  onSubmit={handleBookingSubmit}
                  onCancel={handleBookingCancel}
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <SchedulingRulesManager
              template={template}
              onUpdate={handleRulesUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 