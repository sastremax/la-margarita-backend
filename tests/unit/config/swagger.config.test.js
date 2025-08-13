import { describe, expect, it } from 'vitest'
import { specs, swaggerUiInstance } from '../../../src/config/swagger.config.js'

describe('swagger.config', () => {
    it('debería exponer specs y ui instance', () => {
        expect(specs).toBeTruthy()
        expect(swaggerUiInstance).toBeTruthy()
    })
})
