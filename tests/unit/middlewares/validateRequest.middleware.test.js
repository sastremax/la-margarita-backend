import { beforeEach, describe, expect, test, vi } from 'vitest'
import { _setValidator, validateRequest } from '../../../src/middlewares/validateRequest.middleware.js'
import { ApiError } from '../../../src/utils/apiError.js'

describe('validateRequest middleware', () => {
    const mockReq = {}
    const mockRes = {}
    const next = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        _setValidator(null)
    })

    test('should call next if there are no validation errors', () => {
        const mockValidator = () => ({
            isEmpty: () => true
        })

        _setValidator(mockValidator)

        validateRequest(mockReq, mockRes, next)

        expect(next).toHaveBeenCalledWith()
    })

    test('should call next with ApiError if there are validation errors', () => {
        const mockErrors = [
            { param: 'pid', msg: 'Invalid product ID', location: 'params' }
        ]

        const mockValidator = () => ({
            isEmpty: () => false,
            array: () => mockErrors
        })

        _setValidator(mockValidator)

        validateRequest(mockReq, mockRes, next)

        expect(next).toHaveBeenCalledWith(expect.any(ApiError))

        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
        expect(err.message).toBe(JSON.stringify(mockErrors))
    })
})
