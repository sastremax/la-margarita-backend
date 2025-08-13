import { describe, expect, it, vi } from 'vitest'

vi.mock('express-mongo-sanitize', () => {
    const f = vi.fn(() => 'mongoSanitize-mw')
    return { default: f }
})

vi.mock('xss-clean', () => {
    const f = vi.fn(() => 'xss-mw')
    return { default: f }
})

import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import { sanitizeMiddleware } from '../../../src/middlewares/sanitize.middleware.js'

describe('sanitize.middleware', () => {
    it('debería exportar arreglo [mongoSanitize, xss]', () => {
        expect(sanitizeMiddleware).toEqual(['mongoSanitize-mw', 'xss-mw'])
        expect(mongoSanitize).toHaveBeenCalled()
        expect(xss).toHaveBeenCalled()
    })
})
