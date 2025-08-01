import { describe, test, expect, vi, beforeEach } from 'vitest'

const mongoSanitizeMock = vi.fn(() => 'mongoSanitizeMocked')
const xssMock = vi.fn(() => 'xssMocked')

vi.mock('express-mongo-sanitize', () => ({
    default: mongoSanitizeMock
}))

vi.mock('xss-clean', () => ({
    default: xssMock
}))

let sanitizeMiddleware

beforeEach(async () => {
    mongoSanitizeMock.mockClear()
    xssMock.mockClear()
    const module = await import('../../../src/middlewares/sanitize.middleware.js')
    sanitizeMiddleware = module.sanitizeMiddleware
})

describe('sanitizeMiddleware', () => {
    test('should call mongoSanitize and xss', () => {
        expect(mongoSanitizeMock).toHaveBeenCalledWith({
            replaceWith: '_',
            onSanitize: expect.any(Function)
        })
        expect(xssMock).toHaveBeenCalled()
    })

    test('should return expected array', () => {
        expect(sanitizeMiddleware).toEqual(['mongoSanitizeMocked', 'xssMocked'])
    })
})
