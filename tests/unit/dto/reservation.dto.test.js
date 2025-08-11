import { describe, expect, it } from 'vitest'
import { asPublicReservation, reservationQuerySchema, reservationSchema } from '../../../src/dto/reservation.dto.js'

describe('reservationSchema', () => {
    it('debería validar payload correcto y coerces guests', () => {
        const data = {
            lodgingId: 'L1',
            checkIn: '2025-08-10',
            checkOut: '2025-08-12',
            guests: '2',
            status: 'confirmed'
        }
        const parsed = reservationSchema.parse(data)
        expect(parsed.guests).toBe(2)
        expect(parsed.status).toBe('confirmed')
    })

    it('debería rechazar fechas inválidas', () => {
        const data = {
            lodgingId: 'L1',
            checkIn: 'fecha-mala',
            checkOut: '2025-08-12',
            guests: 2
        }
        expect(() => reservationSchema.parse(data)).toThrow()
    })

    it('debería rechazar checkOut <= checkIn', () => {
        const data = {
            lodgingId: 'L1',
            checkIn: '2025-08-12',
            checkOut: '2025-08-12',
            guests: 2
        }
        expect(() => reservationSchema.parse(data)).toThrow()
    })

    it('debería aceptar solo status del modelo', () => {
        const ok = { lodgingId: 'L1', checkIn: '2025-08-10', checkOut: '2025-08-11', guests: 1, status: 'cancelled' }
        const parsed = reservationSchema.parse(ok)
        expect(parsed.status).toBe('cancelled')
        const bad = { lodgingId: 'L1', checkIn: '2025-08-10', checkOut: '2025-08-11', guests: 1, status: 'pending' }
        expect(() => reservationSchema.parse(bad)).toThrow()
    })
})

describe('reservationQuerySchema', () => {
    it('debería transformar page y limit a número', () => {
        const parsed = reservationQuerySchema.parse({ page: '3', limit: '50', status: 'confirmed' })
        expect(parsed.page).toBe(3)
        expect(parsed.limit).toBe(50)
        expect(parsed.status).toBe('confirmed')
    })

    it('debería rechazar status inválido', () => {
        expect(() => reservationQuerySchema.parse({ status: 'pending' })).toThrow()
    })
})

describe('asPublicReservation', () => {
    it('debería devolver null si reservation es falsy', () => {
        expect(asPublicReservation(null)).toBeNull()
        expect(asPublicReservation(undefined)).toBeNull()
    })

    it('debería normalizar ids y serializar fechas ISO cuando vienen como Date', () => {
        const res = {
            _id: { toString: () => 'r1' },
            user: { _id: { toString: () => 'u1' } },
            lodging: { _id: { toString: () => 'l1' } },
            checkIn: new Date('2025-08-10T00:00:00.000Z'),
            checkOut: new Date('2025-08-12T00:00:00.000Z'),
            guests: 2,
            totalPrice: 300,
            status: 'confirmed'
        }
        const dto = asPublicReservation(res)
        expect(dto).toEqual({
            id: 'r1',
            userId: 'u1',
            lodgingId: 'l1',
            checkIn: '2025-08-10T00:00:00.000Z',
            checkOut: '2025-08-12T00:00:00.000Z',
            guests: 2,
            totalPrice: 300,
            status: 'confirmed'
        })
    })

    it('debería aceptar ids como string o documento poblado', () => {
        const a = {
            _id: 'r2',
            user: 'u2',
            lodging: 'l2',
            checkIn: '2025-08-10',
            checkOut: '2025-08-11',
            guests: 1,
            totalPrice: 100,
            status: 'cancelled'
        }
        const b = {
            _id: { toString: () => 'r3' },
            user: { _id: { toString: () => 'u3' } },
            lodging: { _id: { toString: () => 'l3' } },
            checkIn: '2025-08-10',
            checkOut: '2025-08-11',
            guests: 1,
            totalPrice: 100,
            status: 'confirmed'
        }
        const da = asPublicReservation(a)
        const db = asPublicReservation(b)
        expect(da.id).toBe('r2')
        expect(da.userId).toBe('u2')
        expect(da.lodgingId).toBe('l2')
        expect(db.id).toBe('r3')
        expect(db.userId).toBe('u3')
        expect(db.lodgingId).toBe('l3')
    })
})
