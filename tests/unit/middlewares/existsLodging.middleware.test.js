import { expect } from 'chai'
import sinon from 'sinon'
import existsLodging from '../../../src/middlewares/existsLodging.middleware.js'
import LodgingDAO from '../../../src/dao/lodging.dao.js'

describe('existsLodging.middleware', () => {
    let req, res, next, lodgingMock

    beforeEach(() => {
        req = { params: { lid: 'abc123' } }
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        }
        next = sinon.spy()
        lodgingMock = { _id: 'abc123', name: 'Test Lodge' }
        sinon.stub(LodgingDAO.prototype, 'getLodgingById')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should attach lodging and call next if found', async () => {
        LodgingDAO.prototype.getLodgingById.resolves(lodgingMock)

        await existsLodging(req, res, next)

        expect(req.lodging).to.deep.equal(lodgingMock)
        expect(next.calledOnce).to.be.true
    })

    it('should return 404 if lodging is not found', async () => {
        LodgingDAO.prototype.getLodgingById.resolves(null)

        await existsLodging(req, res, next)

        expect(res.status.calledWith(404)).to.be.true
        expect(res.json.calledWith({ status: 'error', error: 'Lodging not found' })).to.be.true
    })
})