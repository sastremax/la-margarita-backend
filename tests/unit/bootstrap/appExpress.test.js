import { beforeEach, describe, expect, it, vi } from 'vitest'

const use = vi.fn()
const appMock = { use }
const cookieParserFn = vi.fn(() => 'cookieParser-mw')
const jsonMw = 'json-mw'
const urlencodedMw = 'urlencoded-mw'
const routerMw = 'router-mw'
const loggerMw = 'logger-mw'
const auditMw = 'audit-mw'
const securityMw = 'security-mw'
const corsMw = 'cors-mw'
const trimMw = 'trim-mw'
const sanitizeMw = 'sanitize-mw'
const limiterMw = 'limiter-mw'
const notFoundMw = 'notfound-mw'
const errorMw = 'error-mw'
const serveMw = 'swagger-serve'
const setupFn = vi.fn(() => 'swagger-setup')

const expressFn = vi.fn(() => appMock)
expressFn.json = vi.fn(() => jsonMw)
expressFn.urlencoded = vi.fn(() => urlencodedMw)

vi.mock('express', () => ({ default: expressFn }))
vi.mock('cookie-parser', () => ({ default: cookieParserFn }))
vi.mock('../../../src/middlewares/logger.middleware.js', () => ({ loggerMiddleware: loggerMw }))
vi.mock('../../../src/middlewares/auditLogger.js', () => ({ auditLogger: auditMw }))
vi.mock('../../../src/middlewares/security.middleware.js', () => ({ securityMiddleware: securityMw }))
vi.mock('../../../src/middlewares/corsConfig.middleware.js', () => ({ corsMiddleware: corsMw }))
vi.mock('../../../src/middlewares/trimBody.middleware.js', () => ({ trimBody: trimMw }))
vi.mock('../../../src/middlewares/sanitize.middleware.js', () => ({ sanitizeMiddleware: sanitizeMw }))
vi.mock('../../../src/middlewares/envRateLimiter.js', () => ({ limiter: limiterMw }))
vi.mock('../../../src/middlewares/notFound.middleware.js', () => ({ notFound: notFoundMw }))
vi.mock('../../../src/middlewares/errorHandler.middleware.js', () => ({ errorHandler: errorMw }))
vi.mock('../../../src/routes/index.js', () => ({ router: routerMw }))
vi.mock('../../../src/config/swagger.config.js', () => ({
    swaggerUiInstance: { serve: serveMw, setup: setupFn },
    specs: { info: { title: 'x' } }
}))

describe('appExpress', () => {
    beforeEach(() => {
        vi.resetModules()
        use.mockClear()
        cookieParserFn.mockClear()
        expressFn.mockClear()
        expressFn.json.mockClear()
        expressFn.urlencoded.mockClear()
        setupFn.mockClear()
    })

    it('debería construir la app con middlewares en orden y sin /apidocs en test', async () => {
        vi.doMock('../../../src/config/index.js', () => ({ config: { mode: 'test' } }))
        const mod = await import('../../../src/appExpress.js')
        expect(mod.app).toBe(appMock)
        const calls = use.mock.calls

        expect(expressFn.json).toHaveBeenCalled()
        expect(expressFn.urlencoded).toHaveBeenCalledWith({ extended: true })

        const seq = calls.map(c => c[0])
        expect(seq.slice(0, 10)).toEqual([
            'cookieParser-mw',
            loggerMw,
            auditMw,
            securityMw,
            corsMw,
            jsonMw,
            urlencodedMw,
            trimMw,
            sanitizeMw,
            limiterMw
        ])

        expect(calls.find(c => c[0] === '/api')[1]).toBe(routerMw)
        expect(seq.at(-2)).toBe(notFoundMw)
        expect(seq.at(-1)).toBe(errorMw)
        expect(calls.find(c => c[0] === '/apidocs')).toBeUndefined()
    })

    it('debería montar /apidocs fuera de test', async () => {
        vi.doMock('../../../src/config/index.js', () => ({ config: { mode: 'development' } }))
        await import('../../../src/appExpress.js')
        const apidocsCall = use.mock.calls.find(c => c[0] === '/apidocs')
        expect(apidocsCall[1]).toBe(serveMw)
        expect(apidocsCall[2]).toBe('swagger-setup')
        expect(setupFn).toHaveBeenCalledWith({ info: { title: 'x' } })
    })
})
