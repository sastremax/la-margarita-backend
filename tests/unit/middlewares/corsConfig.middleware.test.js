import { beforeEach, describe, expect, test, vi } from 'vitest'

let corsMock
let corsMiddlewareModule

vi.mock('cors', async () => {
    corsMock = vi.fn(() => 'mocked cors middleware')
    return { default: corsMock }
})

vi.mock('../../../src/middlewares/originChecker.js', async () => ({
    originChecker: vi.fn()
}))

beforeEach(async () => {
    vi.clearAllMocks()
    corsMiddlewareModule = await import('../../../src/middlewares/corsConfig.middleware.js')
})

describe('corsMiddleware', () => {
    test('should call cors with correct options', () => {
        expect(corsMock).toHaveBeenCalledWith({
            origin: expect.any(Function),
            credentials: true
        })
    })

    test('should return mocked cors middleware', () => {
        expect(corsMiddlewareModule.corsMiddleware).toBe('mocked cors middleware')
    })
})
