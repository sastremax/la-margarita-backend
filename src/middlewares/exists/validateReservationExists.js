import { reservationService } from '../../services/reservation.service.js'
import { ApiError } from '../../utils/apiError.js'

export const validateReservationExists = async (req, res, next) => {
    try {
        if (!req.params?.rid) {
            return next(new ApiError(400, 'Missing reservation ID'))
        }
        const reservation = await reservationService.getReservationById(req.params.rid)
        if (!reservation) throw new ApiError(404, 'Reservation not found')
        req.reservation = reservation
        next()
    } catch (error) {
        next(error)
    }
}
