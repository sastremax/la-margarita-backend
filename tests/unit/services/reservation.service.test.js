import sinon from 'sinon'
import ReservationService from '../../../src/services/reservation.service.js'
import ReservationDAO from '../../../src/dao/reservation.dao.js'

describe('Reservation Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería crear una reserva', async () => {
        const data = { user: 'u1', lodging: 'l1', startDate: '2025-06-01', endDate: '2025-06-05' }
        const created = { id: 'r1', ...data }

        sinon.stub(ReservationDAO, 'createReservation').resolves(created)

        const result = await ReservationService.createReservation(data)
        expect(result).to.deep.equal(created)
    })

    it('debería obtener reservas con filtros', async () => {
        const filtered = { data: [], total: 0, page: 1, pages: 1 }
        sinon.stub(ReservationDAO, 'getReservationsWithFilters').resolves(filtered)

        const result = await ReservationService.getReservationsWithFilters({})
        expect(result).to.deep.equal(filtered)
    })

    it('debería obtener una reserva por ID', async () => {
        const reservation = { id: 'r123' }
        sinon.stub(ReservationDAO, 'getReservationById').resolves(reservation)

        const result = await ReservationService.getReservationById('r123')
        expect(result).to.deep.equal(reservation)
    })

    it('debería cancelar una reserva', async () => {
        const updated = { id: 'r123', status: 'cancelled' }
        sinon.stub(ReservationDAO, 'cancelReservation').resolves(updated)

        const result = await ReservationService.cancelReservation('r123')
        expect(result).to.deep.equal(updated)
    })

    it('debería confirmar una reserva', async () => {
        const updated = { id: 'r123', status: 'confirmed' }
        sinon.stub(ReservationDAO, 'confirmReservation').resolves(updated)

        const result = await ReservationService.confirmReservation('r123')
        expect(result).to.deep.equal(updated)
    })
})
