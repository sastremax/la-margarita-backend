import { beforeEach, describe, expect, test, vi } from 'vitest'

const mockGetAllUsers = vi.fn()
const mockGetUserById = vi.fn()
const mockUpdateUser = vi.fn()
const mockDeleteUser = vi.fn()
const mockUpdateUserRole = vi.fn()
const mockGetReservationsByUserId = vi.fn()
const mockGetCartByUserId = vi.fn()
const mockLogEvent = vi.fn()

vi.mock('../../../src/services/user.service.js', () => ({
    userService: {
        getAllUsers: mockGetAllUsers,
        getUserById: mockGetUserById,
        updateUser: mockUpdateUser,
        deleteUser: mockDeleteUser,
        updateUserRole: mockUpdateUserRole
    }
}))

vi.mock('../../../src/services/reservation.service.js', () => ({
    reservationService: {
        getReservationsByUserId: mockGetReservationsByUserId
    }
}))

vi.mock('../../../src/services/cart.service.js', () => ({
    cartService: {
        getCartByUserId: mockGetCartByUserId
    }
}))

vi.mock('../../../src/services/audit.service.js', () => ({
    AuditService: {
        logEvent: mockLogEvent
    }
}))

// DTOs
vi.mock('../../../src/dto/user.dto.js', async () => {
    const actual = await vi.importActual('../../../src/dto/user.dto.js')
    return {
        ...actual,
        asUserPublic: vi.fn(actual.asUserPublic)
    }
})

vi.mock('../../../src/dto/reservation.dto.js', async () => {
    const actual = await vi.importActual('../../../src/dto/reservation.dto.js')
    return {
        ...actual,
        asPublicReservation: vi.fn(actual.asPublicReservation)
    }
})

vi.mock('../../../src/dto/cart.dto.js', async () => {
    const actual = await vi.importActual('../../../src/dto/cart.dto.js')
    return {
        ...actual,
        asPublicCart: vi.fn(actual.asPublicCart)
    }
})

// Importar el controller después de los mocks
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole,
    getCurrentUser,
    getCurrentUserReservations,
    getCurrentUserCart
} = await import('../../../src/controllers/user.controller.js')

describe('user.controller', () => {
    const mockRes = () => {
        const res = {}
        res.status = vi.fn().mockReturnValue(res)
        res.json = vi.fn().mockReturnValue(res)
        res.end = vi.fn()
        return res
    }

    const next = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getAllUsers - success', async () => {
        const req = {}
        const res = mockRes()
        mockGetAllUsers.mockResolvedValue([{ _id: '1' }])

        await getAllUsers(req, res, next)

        expect(mockGetAllUsers).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalled()
    })

    test('getUserById - success', async () => {
        const req = { params: { id: '123' } }
        const res = mockRes()
        mockGetUserById.mockResolvedValue({ _id: '123' })

        await getUserById(req, res, next)

        expect(mockGetUserById).toHaveBeenCalledWith('123')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalled()
    })

    test('updateUser - success', async () => {
        const req = { params: { id: '123' }, body: { email: 'a@a.com' } }
        const res = mockRes()
        mockUpdateUser.mockResolvedValue({ _id: '123', email: 'a@a.com' })

        await updateUser(req, res, next)

        expect(mockUpdateUser).toHaveBeenCalledWith('123', { email: 'a@a.com' })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalled()
    })

    test('deleteUser - success', async () => {
        const req = { params: { id: '123' } }
        const res = mockRes()
        mockDeleteUser.mockResolvedValue()

        await deleteUser(req, res, next)

        expect(mockDeleteUser).toHaveBeenCalledWith('123')
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    test('updateUserRole - success', async () => {
        const req = {
            params: { uid: '123' },
            body: { role: 'admin' },
            user: { _id: 'adminUser' },
            ip: '127.0.0.1',
            headers: { 'user-agent': 'agent' }
        }
        const res = mockRes()
        mockUpdateUserRole.mockResolvedValue({ _id: '123', role: 'admin' })

        await updateUserRole(req, res, next)

        expect(mockUpdateUserRole).toHaveBeenCalledWith('123', 'admin')
        expect(mockLogEvent).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalled()
    })

    test('getCurrentUser - success', () => {
        const req = {
            user: {
                _id: 'u1',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                role: 'user',
                cart: { _id: 'cart1' }
            }
        }
        const res = mockRes()

        getCurrentUser(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                id: 'u1',
                fullName: 'Test User',
                email: 'test@example.com',
                role: 'user',
                cartId: 'cart1'
            }
        })
    })

    test('getCurrentUserReservations - success', async () => {
        const req = { user: { id: 'u1' } }
        const res = mockRes()
        mockGetReservationsByUserId.mockResolvedValue([{ _id: 'r1' }])

        await getCurrentUserReservations(req, res, next)

        expect(mockGetReservationsByUserId).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalled()
    })

    test('getCurrentUserCart - success', async () => {
        const req = { user: { id: 'u1' } }
        const res = mockRes()
        mockGetCartByUserId.mockResolvedValue({ _id: 'cart1' })

        await getCurrentUserCart(req, res, next)

        expect(mockGetCartByUserId).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalled()
    })
})
