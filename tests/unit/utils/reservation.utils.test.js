import { describe, expect, test } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'
import { calculateTotalPrice } from '../../../src/utils/reservation.utils.js'

describe('calculateTotalPrice', () => {
    const baseDate = '2025-01-01'

    test('should throw ApiError if stay is less than 1 night', () => {
        const pricing = new Map([['1', 100]])

        try {
            calculateTotalPrice(pricing, baseDate, baseDate)
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError)
            expect(error.message).toBe('Reservation must be at least 1 night')
            expect(error.statusCode).toBe(400)
        }
    })

    test('should throw ApiError if pricing map is empty', () => {
        const pricing = new Map()

        try {
            calculateTotalPrice(pricing, baseDate, '2025-01-02')
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError)
            expect(error.message).toBe('No pricing available for this lodging')
            expect(error.statusCode).toBe(400)
        }
    })

    test('should return exact price if nights match a pricing key', () => {
        const pricing = new Map([
            ['1', 100],
            ['2', 180],
            ['3', 250]
        ])

        const result = calculateTotalPrice(pricing, baseDate, '2025-01-04') // 3 nights
        expect(result).toBe(250)
    })

    test('should calculate extrapolated price if nights exceed max key', () => {
        const pricing = new Map([
            ['1', 100],
            ['2', 180]
        ])

        const result = calculateTotalPrice(pricing, baseDate, '2025-01-05') // 4 nights
        // maxKey = 2 → base = 180 → perNight = 90 → extraNights = 2 → total = 180 + 180 = 360
        expect(result).toBe(360)
    })
})
