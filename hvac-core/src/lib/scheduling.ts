import { ScheduleTemplate, ScheduleRule, TimeSlot, AvailabilityCheck, DayOfWeek } from '@/types/scheduling'

export function checkAvailability(
  template: ScheduleTemplate,
  requestedDate: Date,
  requestedTime: string,
  duration: number
): AvailabilityCheck {
  const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' }) as DayOfWeek
  const dailySchedule = template.dailySchedules.find(schedule => schedule.day === dayOfWeek)

  if (!dailySchedule || !dailySchedule.isAvailable) {
    return {
      isAvailable: false,
      requiresApproval: false,
      reason: 'Service not available on this day',
      nextAvailableSlot: findNextAvailableSlot(template, requestedDate)
    }
  }

  // Check if the requested time falls within any available time slots
  const isWithinTimeSlot = dailySchedule.timeSlots.some(slot => {
    return isTimeBetween(requestedTime, slot.start, slot.end)
  })

  if (!isWithinTimeSlot) {
    return {
      isAvailable: false,
      requiresApproval: false,
      reason: 'Requested time is outside of available hours',
      nextAvailableSlot: findNextAvailableSlot(template, requestedDate)
    }
  }

  // Check if the requested time falls within any breaks
  const isDuringBreak = dailySchedule.breaks.some(breakSlot => {
    return isTimeBetween(requestedTime, breakSlot.start, breakSlot.end)
  })

  if (isDuringBreak) {
    return {
      isAvailable: false,
      requiresApproval: false,
      reason: 'Requested time falls during a break period',
      nextAvailableSlot: findNextAvailableSlot(template, requestedDate)
    }
  }

  // Check scheduling rules
  for (const rule of template.rules) {
    const ruleResult = checkRule(rule, requestedDate, requestedTime)
    if (!ruleResult.isAvailable) {
      return {
        isAvailable: false,
        requiresApproval: ruleResult.requiresApproval,
        reason: ruleResult.reason,
        nextAvailableSlot: findNextAvailableSlot(template, requestedDate)
      }
    }
  }

  return {
    isAvailable: true,
    requiresApproval: false
  }
}

function checkRule(
  rule: ScheduleRule,
  requestedDate: Date,
  requestedTime: string
): { isAvailable: boolean; requiresApproval: boolean; reason?: string } {
  switch (rule.type) {
    case 'timeOfDay':
      const [start, end] = rule.value.split('-')
      if (isTimeBetween(requestedTime, start, end)) {
        return {
          isAvailable: rule.action !== 'block',
          requiresApproval: rule.action === 'requireApproval',
          reason: rule.description
        }
      }
      break
    case 'dayOfWeek':
      const day = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' })
      if (day === rule.value.toLowerCase()) {
        return {
          isAvailable: rule.action !== 'block',
          requiresApproval: rule.action === 'requireApproval',
          reason: rule.description
        }
      }
      break
    case 'leadTime':
      const leadTimeHours = parseInt(rule.value)
      const now = new Date()
      const hoursUntilAppointment = (requestedDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      if (hoursUntilAppointment < leadTimeHours) {
        return {
          isAvailable: rule.action !== 'block',
          requiresApproval: rule.action === 'requireApproval',
          reason: rule.description
        }
      }
      break
    case 'blackout':
      const [startDate, endDate] = rule.value.split('-').map(date => new Date(date))
      if (requestedDate >= startDate && requestedDate <= endDate) {
        return {
          isAvailable: rule.action !== 'block',
          requiresApproval: rule.action === 'requireApproval',
          reason: rule.description
        }
      }
      break
  }
  return { isAvailable: true, requiresApproval: false }
}

function findNextAvailableSlot(template: ScheduleTemplate, fromDate: Date): Date {
  let currentDate = new Date(fromDate)
  let attempts = 0
  const maxAttempts = 30 // Look up to 30 days ahead

  while (attempts < maxAttempts) {
    currentDate.setDate(currentDate.getDate() + 1)
    const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'lowercase' }) as DayOfWeek
    const dailySchedule = template.dailySchedules.find(schedule => schedule.day === dayOfWeek)

    if (dailySchedule && dailySchedule.isAvailable && dailySchedule.timeSlots.length > 0) {
      // Return the first available time slot of the day
      const firstSlot = dailySchedule.timeSlots[0]
      const [hours, minutes] = firstSlot.start.split(':').map(Number)
      currentDate.setHours(hours, minutes, 0, 0)
      return currentDate
    }

    attempts++
  }

  return fromDate // Return original date if no slot found
}

function isTimeBetween(time: string, start: string, end: string): boolean {
  const [timeHours, timeMinutes] = time.split(':').map(Number)
  const [startHours, startMinutes] = start.split(':').map(Number)
  const [endHours, endMinutes] = end.split(':').map(Number)

  const timeValue = timeHours * 60 + timeMinutes
  const startValue = startHours * 60 + startMinutes
  const endValue = endHours * 60 + endMinutes

  return timeValue >= startValue && timeValue <= endValue
} 