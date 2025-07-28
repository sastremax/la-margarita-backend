import z from 'zod'

export const reservationSchema = z.object({
    lodgingId: z.string().min(1, { message: 'Lodging ID is required' }),
    checkIn: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid check-in date'
    }),
    checkOut: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid check-out date'
    }).refine((checkOut, ctx) => {
        const checkIn = ctx.parent.checkIn
        return new Date(checkOut) > new Date(checkIn)
    }, {
        message: 'Check-out must be after check-in'
    }),
    guests: z.number().int().positive().max(20).default(1),
    status: z.enum(['pending', 'confirmed', 'cancelled']).optional()
})

export const reservationQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    userId: z.string().optional(),
    lodgingId: z.string().optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled']).optional()
})

export function asPublicReservation(reservation) {
    return {
        id: reservation._id,
        userId: reservation.user?._id || reservation.user || null,
        lodgingId: reservation.lodging?._id || reservation.lodging || null,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        totalPrice: reservation.totalPrice,
        status: reservation.status
    }
}
