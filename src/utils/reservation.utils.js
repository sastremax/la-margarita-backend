import dayjs from 'dayjs'
import { ApiError } from './apiError.js'

export function calculateTotalPrice(pricingMap, checkIn, checkOut) {
    const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')
    if (nights < 1) {
        throw new ApiError(400, 'Reservation must be at least 1 night')
    }

    if (!pricingMap || pricingMap.size === 0) {
        throw new ApiError(400, 'No pricing available for this lodging')
    }

    if (pricingMap.has(String(nights))) {
        return pricingMap.get(String(nights))
    } else {
        const maxKey = Math.max(...Array.from(pricingMap.keys()).map(Number))
        const basePrice = pricingMap.get(String(maxKey))
        const extraNights = nights - maxKey
        const pricePerNight = basePrice / maxKey
        return basePrice + (extraNights * pricePerNight)
    }
}
