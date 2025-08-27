import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import http from 'node:http'
import request from 'supertest'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../../../src/docs/swagger/index.js'

describe('apidocs', () => {
    let server
    beforeAll(async () => {
        process.env.NODE_ENV = 'development'
        const app = express()
        app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))
        server = http.createServer(app)
        await new Promise(r => server.listen(0, r))
    })
    afterAll(async () => {
        await new Promise(r => server.close(r))
    })
    it('debería responder en /apidocs en development', async () => {
        const address = server.address()
        const base = `http://127.0.0.1:${address.port}`
        const res = await request(base).get('/apidocs')
        expect([200, 301, 302]).toContain(res.status)
    })
})
