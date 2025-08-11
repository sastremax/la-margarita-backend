import { z } from 'zod'

export const reservationSchema = z
    .object({
        lodgingId: z.string().min(1, { message: 'Lodging ID is required' }),
        checkIn: z.string().refine((date) => !Number.isNaN(Date.parse(date)), { message: 'Invalid check-in date' }),
        checkOut: z.string().refine((date) => !Number.isNaN(Date.parse(date)), { message: 'Invalid check-out date' }),
        guests: z.coerce.number().int().positive().max(20).default(1),
        status: z.enum(['confirmed', 'cancelled']).optional()
    })
    .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
        message: 'Check-out must be after check-in',
        path: ['checkOut']
    })

export const reservationQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    userId: z.string().optional(),
    lodgingId: z.string().optional(),
    status: z.enum(['confirmed', 'cancelled']).optional()
})

export function asPublicReservation(reservation) {
    if (!reservation) return null
    const id = reservation._id?.toString?.() || reservation.id || null
    const userId =
        reservation.user?._id?.toString?.() ||
        reservation.user?.toString?.() ||
        reservation.user?.id ||
        null
    const lodgingId =
        reservation.lodging?._id?.toString?.() ||
        reservation.lodging?.toString?.() ||
        reservation.lodging?.id ||
        null
    const checkIn =
        reservation.checkIn?.toISOString?.() ||
        (typeof reservation.checkIn === 'string' ? reservation.checkIn : null)
    const checkOut =
        reservation.checkOut?.toISOString?.() ||
        (typeof reservation.checkOut === 'string' ? reservation.checkOut : null)
    const guests = typeof reservation.guests === 'number' ? reservation.guests : null
    const totalPrice = typeof reservation.totalPrice === 'number' ? reservation.totalPrice : 0
    const status = reservation.status || null
    return { id, userId, lodgingId, checkIn, checkOut, guests, totalPrice, status }
}
