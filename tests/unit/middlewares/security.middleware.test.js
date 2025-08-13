import { describe, expect, it, vi } from 'vitest'

vi.mock('helmet', () => ({ default: vi.fn(() => 'helmet-mw') }))
import helmet from 'helmet'
import { securityMiddleware } from '../../../src/middlewares/security.middleware.js'

describe('security.middleware', () => {
    it('debería exportar arreglo con helmet()', () => {
        expect(securityMiddleware).toEqual(['helmet-mw'])
        expect(helmet).toHaveBeenCalled()
    })
})
