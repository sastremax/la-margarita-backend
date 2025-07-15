import { expect } from 'chai'
import sinon from 'sinon'
import dayjs from 'dayjs'
import ReservationService from '../../../src/services/reservation.service.js'
import ReservationDAO from '../../../src/dao/reservation.dao.js'
import LodgingDAO from '../../../src/dao/lodging.dao.js'
import reservationDTO from '../../../src/dto/reservation.dto.js'

const dto = { asReservationPublic: reservationDTO.asPublicReservation }

const fakeReservation = {
    _id: '1',
    user: 'u1',
    lodging: 'l1',
    checkIn: '2025-07-01',
    checkOut: '2025-07-03',
    guests: 2,
    totalPrice: 300,
    status: 'confirmed'
}

const publicReservation = {
    id: '1',
    userId: 'u1',
    lodgingId: 'l1',
    checkIn: '2025-07-01',
    checkOut: '2025-07-03',
    guests: 2,
    totalPrice: 300,
    status: 'confirmed'
}

describe('Reservation Service', () => {
    beforeEach(() => {
        sinon.restore()
    })

    it('should get reservation by ID', async () => {
        sinon.stub(ReservationDAO.prototype, 'getReservationById').resolves(fakeReservation)
        sinon.stub(dto, 'asReservationPublic').returns(publicReservation)

        const result = await ReservationService.getReservationById('1')
        expect(result).to.deep.equal(publicReservation)
    })

    it('should get reservations by user ID', async () => {
        sinon.stub(ReservationDAO.prototype, 'getReservationsByUserId').resolves([fakeReservation])
        sinon.stub(dto, 'asReservationPublic').returns(publicReservation)

        const result = await ReservationService.getReservationsByUserId('u1')
        expect(result).to.deep.equal([publicReservation])
    })

    it('should create a reservation successfully', async () => {
        const pricing = new Map()
        pricing.set('2', 300)

        sinon.stub(LodgingDAO.prototype, 'getLodgingById').resolves({ isActive: true, pricing })
        sinon.stub(ReservationDAO.prototype, 'isLodgingAvailable').resolves(false)
        sinon.stub(ReservationDAO.prototype, 'createReservation').resolves(fakeReservation)
        sinon.stub(dto, 'asReservationPublic').returns(publicReservation)

        const result = await ReservationService.createReservation({
            userId: 'u1',
            lodgingId: 'l1',
            checkIn: '2025-07-01',
            checkOut: '2025-07-03'
        })

        expect(result).to.deep.equal(publicReservation)
    })

    it('should throw if reservation is less than 1 night', async () => {
        const pricing = new Map()
        pricing.set('1', 150)

        sinon.stub(LodgingDAO.prototype, 'getLodgingById').resolves({ isActive: true, pricing })
        sinon.stub(ReservationDAO.prototype, 'isLodgingAvailable').resolves(false)

        try {
            await ReservationService.createReservation({
                userId: 'u1',
                lodgingId: 'l1',
                checkIn: '2025-07-01',
                checkOut: '2025-07-01'
            })
        } catch (error) {
            expect(error.message).to.equal('Reservation must be at least 1 night')
        }
    })

    it('should update a reservation', async () => {
        sinon.stub(ReservationDAO.prototype, 'updateReservation').resolves(fakeReservation)
        sinon.stub(dto, 'asReservationPublic').returns(publicReservation)

        const result = await ReservationService.updateReservation('1', { guests: 3 })
        expect(result).to.deep.equal(publicReservation)
    })

    it('should cancel a reservation with valid user', async () => {
        const resv = { ...fakeReservation, status: 'confirmed' }
        sinon.stub(ReservationDAO.prototype, 'getReservationById').resolves(resv)
        sinon.stub(ReservationDAO.prototype, 'updateReservation').resolves(resv)
        sinon.stub(dto, 'asReservationPublic').returns(publicReservation)

        const result = await ReservationService.cancelReservation('1', 'u1')
        expect(result).to.deep.equal(publicReservation)
    })

    it('should get reservations with filters', async () => {
        const paginated = {
            total: 1,
            page: 1,
            pages: 1,
            data: [fakeReservation]
        }

        sinon.stub(ReservationDAO.prototype, 'getReservations').resolves(paginated)
        sinon.stub(dto, 'asReservationPublic').returns(publicReservation)

        const result = await ReservationService.getReservationsWithFilters({ page: 1, limit: 10 })
        expect(result.data).to.deep.equal([publicReservation])
    })

    it('should get reservation summary', async () => {
        const summary = {
            lodgingId: 'l1',
            totalReservations: 10,
            totalNights: 30,
            totalRevenue: 3000,
            averageDuration: 3
        }

        sinon.stub(ReservationDAO.prototype, 'getReservationSummaryByLodging').resolves(summary)

        const result = await ReservationService.getReservationSummary('l1')
        expect(result).to.deep.equal(summary)
    })
})