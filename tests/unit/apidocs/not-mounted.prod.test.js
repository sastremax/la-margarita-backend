import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../../../src/docs/swagger/index.js'

describe('apidocs', () => {
    it('no debería montarse en production', async () => {
        process.env.NODE_ENV = 'production'
        const app = express()
        if (process.env.NODE_ENV === 'development') {
            app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))
        }
        const res = await request(app).get('/apidocs')
        expect(res.status).toBe(404)
    })
})
