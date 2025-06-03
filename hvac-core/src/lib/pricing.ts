// import { ServiceTemplate, PricingRule } from '@/types/services'

interface PricingContext {
  timeOfDay?: string // e.g., "09:00", "17:30"
  dayOfWeek?: string // e.g., "monday", "saturday"
  isEmergency?: boolean
  isHoliday?: boolean
  customerType?: string // e.g., "residential", "commercial"
  location?: {
    zipCode: string
    distance: number // in miles
  }
}

export function calculatePrice(
  template: ServiceTemplate,
  context: PricingContext,
  hours?: number // Required for hourly pricing
): number {
  let basePrice = template.basePrice

  // Apply hourly rate if applicable
  if (template.pricingModel === 'hourly' && hours) {
    basePrice = basePrice * hours
  }

  // Apply pricing rules
  const finalPrice = template.pricingRules.reduce((price, rule) => {
    if (shouldApplyRule(rule, context)) {
      return applyRuleModifier(price, rule)
    }
    return price
  }, basePrice)

  return Math.max(0, finalPrice) // Ensure price is never negative
}

function shouldApplyRule(rule: PricingRule, context: PricingContext): boolean {
  const condition = rule.condition.toLowerCase()
  
  if (condition.includes('timeofday') && context.timeOfDay) {
    const [start, end] = rule.value.split('-')
    return isTimeBetween(context.timeOfDay, start, end)
  }
  
  if (condition.includes('dayofweek') && context.dayOfWeek) {
    return context.dayOfWeek.toLowerCase() === rule.value.toLowerCase()
  }
  
  if (condition.includes('emergency') && context.isEmergency) {
    return context.isEmergency
  }
  
  if (condition.includes('holiday') && context.isHoliday) {
    return context.isHoliday
  }
  
  if (condition.includes('customertype') && context.customerType) {
    return context.customerType.toLowerCase() === rule.value.toLowerCase()
  }
  
  if (condition.includes('distance') && context.location?.distance) {
    const maxDistance = parseFloat(rule.value)
    return context.location.distance > maxDistance
  }
  
  return false
}

function applyRuleModifier(price: number, rule: PricingRule): number {
  // If modifier is a percentage (between -1 and 1)
  if (Math.abs(rule.modifier) <= 1) {
    return price * (1 + rule.modifier)
  }
  // If modifier is a fixed amount
  return price + rule.modifier
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