import { expect } from 'chai'
import sinon from 'sinon'
import trimBody from '../../../src/middlewares/trimBody.middleware.js'

describe('trimBody.middleware', () => {
    let req, res, next

    beforeEach(() => {
        res = {}
        next = sinon.spy()
    })

    it('should trim all string fields in req.body', () => {
        req = {
            body: {
                name: '  John  ',
                email: ' test@example.com ',
                age: 25
            }
        }

        trimBody(req, res, next)

        expect(req.body.name).to.equal('John')
        expect(req.body.email).to.equal('test@example.com')
        expect(req.body.age).to.equal(25)
        expect(next.calledOnce).to.be.true
    })

    it('should call next if body is not present', () => {
        req = {}

        trimBody(req, res, next)

        expect(next.calledOnce).to.be.true
    })

    it('should call next with error if an exception occurs', () => {
        req = {
            get body() {
                throw new Error('forced error')
            }
        }

        trimBody(req, res, next)

        expect(next.calledOnce).to.be.true
        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('forced error')
    })
})