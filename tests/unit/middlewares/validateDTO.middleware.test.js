
import { expect } from 'chai'
import sinon from 'sinon'
import validateDTO from '../../../src/middlewares/validateDTO.middleware.js'

describe('validateDTO.middleware', () => {
    let schema
    let req, res, next

    beforeEach(() => {
        req = { body: {} }
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        }
        next = sinon.stub()

        schema = {
            safeParse: sinon.stub()
        }
    })

    it('debería lanzar un error si el schema no es válido', () => {
        expect(() => validateDTO(null)).to.throw('Invalid schema provided to validateDTO middleware')
        expect(() => validateDTO({})).to.throw('Invalid schema provided to validateDTO middleware')
    })

    it('debería llamar a next si los datos son válidos', () => {
        const parsedData = { name: 'John' }

        schema.safeParse.returns({ success: true, data: parsedData })

        const middleware = validateDTO(schema)
        req.body = { name: 'John' }
        middleware(req, res, next)

        expect(req.body).to.deep.equal(parsedData)
        expect(next.calledOnce).to.be.true
    })

    it('debería responder con 400 si los datos son inválidos', () => {
        const errors = [
            { path: ['email'], message: 'Required' },
            { path: ['password'], message: 'Too short' }
        ]

        schema.safeParse.returns({ success: false, error: { errors } })

        const middleware = validateDTO(schema)
        req.body = {}
        middleware(req, res, next)

        expect(res.status.calledWith(400)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.args[0][0].status).to.equal('error')
        expect(res.json.args[0][0].errors).to.deep.equal([
            { path: 'email', message: 'Required' },
            { path: 'password', message: 'Too short' }
        ])
        expect(next.notCalled).to.be.true
    })
})
