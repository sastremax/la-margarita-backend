import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/services/user.service.js', () => ({
    userService: {
        getAllUsers: vi.fn(),
        getUserById: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
        updateUserRole: vi.fn()
    }
}))

vi.mock('../../../src/services/reservation.service.js', () => ({
    reservationService: {
        getReservationsByUserId: vi.fn()
    }
}))

vi.mock('../../../src/services/cart.service.js', () => ({
    cartService: {
        getCartByUserId: vi.fn()
    }
}))

vi.mock('../../../src/services/audit.service.js', () => ({
    AuditService: {
        logEvent: vi.fn()
    }
}))

const resMock = () => {
    const res = {}
    res.status = vi.fn(() => res)
    res.json = vi.fn(() => res)
    res.end = vi.fn(() => res)
    return res
}

describe('user.controller', () => {
    let controller
    let userService
    let reservationService
    let cartService
    let AuditService

    beforeEach(async () => {
        vi.resetModules()
            ; ({ userService } = await import('../../../src/services/user.service.js'))
            ; ({ reservationService } = await import('../../../src/services/reservation.service.js'))
            ; ({ cartService } = await import('../../../src/services/cart.service.js'))
            ; ({ AuditService } = await import('../../../src/services/audit.service.js'))
        controller = await import('../../../src/controllers/user.controller.js')
    })

    it('debería devolver todos los usuarios', async () => {
        userService.getAllUsers.mockResolvedValueOnce([{ id: 'u1' }])
        const req = {}
        const res = resMock()
        const next = vi.fn()
        await controller.getAllUsers(req, res, next)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [{ id: 'u1' }] })
    })

    it('debería usar req.params.uid en getUserById', async () => {
        userService.getUserById.mockResolvedValueOnce({ id: 'u1' })
        const req = { params: { uid: 'u1' } }
        const res = resMock()
        const next = vi.fn()
        await controller.getUserById(req, res, next)
        expect(userService.getUserById).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
    })

    it('debería usar req.params.uid en updateUser y retornar 200', async () => {
        userService.updateUser.mockResolvedValueOnce({ id: 'u1', role: 'user' })
        const req = { params: { uid: 'u1' }, body: { role: 'user' } }
        const res = resMock()
        const next = vi.fn()
        await controller.updateUser(req, res, next)
        expect(userService.updateUser).toHaveBeenCalledWith('u1', { role: 'user' })
        expect(res.status).toHaveBeenCalledWith(200)
    })

    it('debería usar req.params.uid en deleteUser y retornar 204', async () => {
        userService.deleteUser.mockResolvedValueOnce(true)
        const req = { params: { uid: 'u1' } }
        const res = resMock()
        const next = vi.fn()
        await controller.deleteUser(req, res, next)
        expect(userService.deleteUser).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    it('debería validar rol en updateUserRole y registrar auditoría con req.user.id', async () => {
        const reqBad = { params: { uid: 'u1' }, body: { role: 'guest' }, ip: '1.1.1.1', headers: { 'user-agent': 'x' }, user: { id: 'admin1' } }
        const resBad = resMock()
        const nextBad = vi.fn()
        await controller.updateUserRole(reqBad, resBad, nextBad)
        expect(resBad.status).toHaveBeenCalledWith(400)

        userService.updateUserRole.mockResolvedValueOnce({ id: 'u1', role: 'admin' })
        const reqOk = { params: { uid: 'u1' }, body: { role: 'admin' }, ip: '1.1.1.1', headers: { 'user-agent': 'x' }, user: { id: 'admin1' } }
        const resOk = resMock()
        const nextOk = vi.fn()
        await controller.updateUserRole(reqOk, resOk, nextOk)
        expect(userService.updateUserRole).toHaveBeenCalledWith('u1', 'admin')
        expect(AuditService.logEvent).toHaveBeenCalledWith(expect.objectContaining({ userId: 'admin1', event: 'update_user_role', success: true }))
        expect(resOk.status).toHaveBeenCalledWith(200)
    })

    it('debería devolver el usuario actual con asUserPublic', async () => {
        const req = { user: { id: 'u1', role: 'user', firstName: 'A', lastName: 'B', email: 'e' } }
        const res = resMock()
        await controller.getCurrentUser(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalled()
        const payload = res.json.mock.calls[0][0]
        expect(payload.status).toBe('success')
        expect(payload.data.id).toBe('u1')
        expect(payload.data.role).toBe('user')
    })

    it('debería usar reservationService y no remapear en getCurrentUserReservations', async () => {
        reservationService.getReservationsByUserId.mockResolvedValueOnce([{ id: 'r1', userId: 'u1' }])
        const req = { user: { id: 'u1' } }
        const res = resMock()
        const next = vi.fn()
        await controller.getCurrentUserReservations(req, res, next)
        expect(reservationService.getReservationsByUserId).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [{ id: 'r1', userId: 'u1' }] })
    })

    it('debería usar cartService y no remapear en getCurrentUserCart', async () => {
        cartService.getCartByUserId.mockResolvedValueOnce({ id: 'c1', userId: 'u1', products: [] })
        const req = { user: { id: 'u1' } }
        const res = resMock()
        const next = vi.fn()
        await controller.getCurrentUserCart(req, res, next)
        expect(cartService.getCartByUserId).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'c1', userId: 'u1', products: [] } })
    })
})
