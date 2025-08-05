import { beforeEach, describe, expect, test, vi, } from 'vitest'

let helmetMock

beforeEach(async () => {
    helmetMock = vi.fn(() => 'helmet middleware')
    vi.mock('helmet', () => ({ default: helmetMock }))
})

describe('securityMiddleware', () => {
    test('should include helmet middleware in the array', async () => {
        const { securityMiddleware } = await import('../../../src/middlewares/security.middleware.js')

        expect(helmetMock).toHaveBeenCalled()
        expect(securityMiddleware).toEqual(['helmet middleware'])
    })
})
