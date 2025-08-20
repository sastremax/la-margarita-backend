import dayjs from 'dayjs'
import { ApiError } from './apiError.js'

export function calculateTotalPrice(pricingMap, checkIn, checkOut) {
    const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')
    if (nights < 1) {
        throw new ApiError(400, 'Reservation must be at least 1 night')
    }

    if (pricingMap instanceof Map) {
        if (pricingMap.size === 0) {
            throw new ApiError(400, 'No pricing available for this lodging')
        }
        if (pricingMap.has(String(nights))) {
            return pricingMap.get(String(nights))
        } else {
            const maxKey = Math.max(...Array.from(pricingMap.keys()).map(Number))
            const basePrice = pricingMap.get(String(maxKey))
            const extraNights = nights - maxKey
            const pricePerNight = basePrice / maxKey
            return basePrice + extraNights * pricePerNight
        }
    }

    const weekdayRate = Number(pricingMap?.weekday)
    const weekendRate = Number(pricingMap?.weekend)
    if (!Number.isFinite(weekdayRate) || !Number.isFinite(weekendRate)) {
        throw new ApiError(400, 'No pricing available for this lodging')
    }

    const start = dayjs(checkIn).startOf('day')
    let total = 0
    for (let i = 0; i < nights; i++) {
        const d = start.add(i, 'day').day()
        const isWeekend = d === 0 || d === 6
        total += isWeekend ? weekendRate : weekdayRate
    }
    return total
}
