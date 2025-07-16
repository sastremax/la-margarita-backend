import { expect } from 'chai'
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
        const data = {
            title: 'Casa 1',
            description: 'Casa equipada para descansar en familia.',
            images: ['http://example.com/img1.jpg'],
            location: { province: 'Buenos Aires', city: 'Tandil' },
            capacity: 6,
            pricing: { weekday: 100, weekend: 150 },
            owner: '64ff0e6b9e1a6b2fd7d77777'
        }

        const lodgingCreated = {
            _id: '64ff0e6b9e1a6b2fd7d77777',
            ...data,
            isActive: true
        }

        sinon.stub(factory.LodgingDAO, 'createLodging').resolves(lodgingCreated)

        const result = await LodgingService.createLodging(data)
        expect(result).to.deep.equal({
            id: lodgingCreated._id,
            title: data.title,
            description: data.description,
            images: data.images,
            location: data.location,
            capacity: data.capacity,
            pricing: data.pricing,
            ownerId: data.owner,
            isActive: true
        })
    })

    it('debería obtener todos los alojamientos', async () => {
        const lodgings = [
            { _id: '1', title: 'A', description: 'D', images: [], location: { city: '', province: '' }, capacity: 1, pricing: {}, owner: '1', isActive: true }
        ]

        sinon.stub(factory.LodgingDAO, 'getAllLodgings').resolves(lodgings)

        const result = await LodgingService.getAllLodgings()
        expect(result).to.be.an('array')
        expect(result[0]).to.have.property('id')
    })

    it('debería obtener un alojamiento por ID', async () => {
        const lodging = {
            _id: '64ff0e6b9e1a6b2fd7d77777',
            title: 'Casa',
            description: 'Hermosa',
            images: [],
            location: { province: 'Córdoba', city: 'Villa Gral Belgrano' },
            capacity: 4,
            pricing: { weekday: 100, weekend: 150 },
            owner: '64ff0e6b9e1a6b2fd7d77777',
            isActive: true
        }

        sinon.stub(factory.LodgingDAO, 'getLodgingById').resolves(lodging)

        const result = await LodgingService.getLodgingById(lodging._id)
        expect(result).to.include({ id: lodging._id })
    })

    it('debería actualizar un alojamiento', async () => {
        const updated = {
            _id: '64ff0e6b9e1a6b2fd7d77777',
            title: 'Nuevo título',
            description: 'Casa actualizada',
            images: [],
            location: { province: 'Santa Fe', city: 'Rosario' },
            capacity: 5,
            pricing: { weekday: 120, weekend: 160 },
            owner: '64ff0e6b9e1a6b2fd7d77777',
            isActive: true
        }

        sinon.stub(factory.LodgingDAO, 'updateLodging').resolves(updated)

        const result = await LodgingService.updateLodging(updated._id, { title: 'Nuevo título' })
        expect(result).to.include({ id: updated._id })
    })

    it('debería eliminar un alojamiento', async () => {
        sinon.stub(factory.LodgingDAO, 'deleteLodging').resolves(true)

        const result = await LodgingService.deleteLodging('64ff0e6b9e1a6b2fd7d77777')
        expect(result).to.be.true
    })
})