import ReservationModel from '../models/reservation.model.js'
import LodgingModel from '../models/lodging.model.js'

const createReservation = async ({ userId, lodgingId, startDate, endDate }) => {
    const lodging = await LodgingModel.findById(lodgingId)
    if (!lodging) throw new Error('Lodging not found')

    const reservation = await ReservationModel.create({
        user: userId,
        lodging: lodgingId,
        startDate,
        endDate
    })

    return reservation
}

const getAllReservations = async () => {
    return await ReservationModel.find().populate('user lodging')
}

const getReservationsByUser = async (userId) => {
    return await ReservationModel.find({ user: userId }).populate('lodging')
}

const cancelReservation = async (reservationId) => {
    const deleted = await ReservationModel.findByIdAndDelete(reservationId)
    if (!deleted) throw new Error('Reservation not found or delete failed')
    return deleted
}

export default {
    createReservation,
    getAllReservations,
    getReservationsByUser,
    cancelReservation
}
