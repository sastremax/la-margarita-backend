import { beforeEach, describe, expect, test, vi } from 'vitest'
import { postRefresh } from '../../../src/controllers/refresh.controller.js'
import { refreshService } from '../../../src/services/refresh.service.js'
import { ApiError } from '../../../src/utils/apiError.js'

vi.mock('../../../src/services/refresh.service.js')

const mockRes = () => {
    const res = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    res.cookie = vi.fn().mockReturnValue(res)
    return res
}

const next = vi.fn()

beforeEach(() => {
    vi.clearAllMocks()
})

describe('refresh.controller', () => {
    test('postRefresh - should set new tokens in cookies and return success', () => {
        const req = {
            cookies: {
                refreshToken: 'valid.refresh.token'
            }
        }
        const res = mockRes()

        refreshService.rotateRefreshToken.mockReturnValue({
            newAccessToken: 'new.access.token',
            newRefreshToken: 'new.refresh.token'
        })

        postRefresh(req, res, next)

        expect(refreshService.rotateRefreshToken).toHaveBeenCalledWith('valid.refresh.token')
        expect(res.cookie).toHaveBeenCalledWith('token', 'new.access.token', expect.any(Object))
        expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'new.refresh.token', expect.any(Object))
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Token refreshed' })
    })

    test('postRefresh - should throw 401 if refreshToken is missing', () => {
        const req = { cookies: {} }
        const res = mockRes()

        postRefresh(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(401, 'Refresh token missing'))
    })

    test('postRefresh - should forward service error to next()', () => {
        const req = {
            cookies: {
                refreshToken: 'expired.token'
            }
        }
        const res = mockRes()
        const serviceError = new ApiError(403, 'Refresh token is invalid or expired')

        refreshService.rotateRefreshToken.mockImplementation(() => {
            throw serviceError
        })

        postRefresh(req, res, next)

        expect(next).toHaveBeenCalledWith(serviceError)
    })
})
