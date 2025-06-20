import { z } from 'zod'

export const reservationSchema = z.object({
    user: z.string().min(1),
    lodging: z.string().min(1),
    startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid start date'
    }),
    endDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid end date'
    }),
    guests: z.number().int().positive(),
    totalPrice: z.number().positive(),
    status: z.enum(['pending', 'confirmed', 'cancelled']).optional()
})

export function asPublicReservation(reservation) {
    return {
        id: reservation._id,
        userId: reservation.user?._id || null,
        lodgingId: reservation.lodging?._id || null,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        guests: reservation.guests,
        totalPrice: reservation.totalPrice,
        status: reservation.status
    }
}

export default asPublicReservation