import { describe, expect, it, vi } from 'vitest'

describe('factory', () => {
    it('debería crear e inicializar DAOs para mongodb', async () => {
        vi.doMock('../../../src/config/index.js', () => ({ config: { persistence: 'mongodb' } }))
        vi.doMock('../../../src/config/logger.js', () => ({ logger: { error: vi.fn() } }))
        const { getFactory } = await import('../../../src/dao/factory.js')
        const daos = await getFactory()
        expect(daos).toBeTruthy()
        expect(Object.keys(daos).sort((a, b) => a.localeCompare(b))).toEqual([
            'CartDAO',
            'ContactDAO',
            'ImageDAO',
            'LodgingDAO',
            'ProductDAO',
            'ReservationDAO',
            'ReviewDAO',
            'UserDAO'
        ])
    })

    it('debería memoizar y devolver siempre las mismas instancias', async () => {
        const { getFactory } = await import('../../../src/dao/factory.js')
        const a = await getFactory()
        const b = await getFactory()
        expect(a).toBe(b)
        expect(a.UserDAO).toBe(b.UserDAO)
        expect(a.ProductDAO).toBe(b.ProductDAO)
        expect(a.CartDAO).toBe(b.CartDAO)
        expect(a.ReservationDAO).toBe(b.ReservationDAO)
        expect(a.ReviewDAO).toBe(b.ReviewDAO)
        expect(a.ImageDAO).toBe(b.ImageDAO)
        expect(a.LodgingDAO).toBe(b.LodgingDAO)
        expect(a.ContactDAO).toBe(b.ContactDAO)
    })

    it('debería fallar con persistencia no soportada y loggear error', async () => {
        vi.resetModules()
        vi.doMock('../../../src/config/index.js', () => ({ config: { persistence: 'memory' } }))
        vi.doMock('../../../src/config/logger.js', () => ({ logger: { error: vi.fn() } }))
        const { getFactory } = await import('../../../src/dao/factory.js')
        await expect(getFactory()).rejects.toThrow('Unsupported persistence source: memory')
        const { logger } = await import('../../../src/config/logger.js')
        expect(logger.error).toHaveBeenCalledTimes(1)
    })
})
