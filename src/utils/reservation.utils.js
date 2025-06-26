import dayjs from 'dayjs'

function calculateTotalPrice(pricingMap, checkIn, checkOut) {
    const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')
    if (nights < 1) {
        const error = new Error('Reservation must be at least 1 night')
        error.statusCode = 400
        throw error
    }

    if (!pricingMap || pricingMap.size === 0) {
        const error = new Error('No pricing available for this lodging')
        error.statusCode = 400
        throw error
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

export default calculateTotalPrice