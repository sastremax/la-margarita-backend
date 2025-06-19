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
