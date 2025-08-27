import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../../src/appExpress.js'

describe('apidocs', () => {
    it('no debería montarse en entorno test', async () => {
        const res = await request(app).get('/apidocs')
        expect(res.status).toBe(404)
    })
})
