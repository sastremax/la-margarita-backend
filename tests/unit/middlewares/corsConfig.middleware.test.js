import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('cors', () => {
    const corsMock = vi.fn(() => 'cors-mw')
    return { default: corsMock }
})

vi.mock('../../../src/middlewares/originChecker.js', () => ({ originChecker: vi.fn() }))

import { corsMiddleware } from '../../../src/middlewares/corsConfig.middleware.js'

describe('corsConfig.middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('debería exponer el middleware configurado', () => {
        expect(corsMiddleware).toBe('cors-mw')
    })
})
