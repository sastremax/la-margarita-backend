import sinon from 'sinon'
import LodgingService from '../../../src/services/lodging.service.js'
import getFactory from '../../../src/dao/factory.js'

let factory

before(async () => {
    factory = await getFactory()
})

describe('Lodging Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería crear un alojamiento', async () => {
        const data = { title: 'Casa 1', price: 100 }
        const lodgingCreated = { id: '1', ...data }

        sinon.stub(factory.LodgingDAO, 'createLodging').resolves(lodgingCreated)

        const result = await LodgingService.createLodging(data)
        expect(result).to.deep.equal(lodgingCreated)
    })

    it('debería obtener todos los alojamientos', async () => {
        const lodgings = [{ id: '1' }, { id: '2' }]
        sinon.stub(factory.LodgingDAO, 'getAllLodgings').resolves(lodgings)

        const result = await LodgingService.getAllLodgings()
        expect(result).to.deep.equal(lodgings)
    })

    it('debería obtener un alojamiento por ID', async () => {
        const lodging = { id: 'abc' }
        sinon.stub(factory.LodgingDAO, 'getLodgingById').resolves(lodging)

        const result = await LodgingService.getLodgingById('abc')
        expect(result).to.deep.equal(lodging)
    })

    it('debería obtener alojamientos con filtros', async () => {
        const filtered = { data: [], total: 0, page: 1, pages: 1 }
        sinon.stub(factory.LodgingDAO, 'getLodgingsWithFilters').resolves(filtered)

        const result = await LodgingService.getLodgingsWithFilters({})
        expect(result).to.deep.equal(filtered)
    })

    it('debería actualizar un alojamiento', async () => {
        const updated = { id: '123', title: 'Nuevo título' }
        sinon.stub(factory.LodgingDAO, 'updateLodging').resolves(updated)

        const result = await LodgingService.updateLodging('123', { title: 'Nuevo título' })
        expect(result).to.deep.equal(updated)
    })

    it('debería eliminar un alojamiento', async () => {
        sinon.stub(factory.LodgingDAO, 'deleteLodging').resolves(true)

        const result = await LodgingService.deleteLodging('123')
        expect(result).to.be.true
    })
})
