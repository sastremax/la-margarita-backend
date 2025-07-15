import { expect } from 'chai'
import sinon from 'sinon'
import ContactService from '../../../src/services/contact.service.js'
import contactDTO from '../../../src/dto/contact.dto.js'
import getFactory from '../../../src/dao/factory.js'

describe('Contact Service', () => {
    let sandbox
    let mockDAO

    const fakeContact = {
        _id: 'abc123',
        name: 'Maxi',
        email: 'maxi@example.com',
        message: 'Quiero reservar una casa.',
        replied: false,
        replyNote: '',
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const fakeContactDTO = contactDTO.asPublicContact(fakeContact)

    before(async () => {
        sandbox = sinon.createSandbox()
        const daos = await getFactory()
        mockDAO = daos.ContactDAO

        sandbox.stub(mockDAO, 'createContact').resolves(fakeContact)
        sandbox.stub(mockDAO, 'getAllContacts').resolves([fakeContact])
        sandbox.stub(mockDAO, 'getContactById').resolves(fakeContact)
        sandbox.stub(mockDAO, 'updateReplyStatus').resolves(fakeContact)
        sandbox.stub(mockDAO, 'deleteContact').resolves(true)
    })

    after(() => {
        sandbox.restore()
    })

    describe('createContact', () => {
        it('debería crear un contacto correctamente', async () => {
            const result = await ContactService.createContact({
                name: 'Maxi',
                email: 'maxi@example.com',
                message: 'Quiero reservar una casa.'
            })

            expect(result).to.deep.equal(fakeContactDTO)
        })
    })

    describe('getAllContacts', () => {
        it('debería obtener todos los contactos con formato público', async () => {
            const result = await ContactService.getAllContacts()
            expect(result).to.deep.equal([fakeContactDTO])
        })
    })

    describe('getContactById', () => {
        it('debería obtener un contacto por ID', async () => {
            const result = await ContactService.getContactById('abc123')
            expect(result).to.deep.equal(fakeContactDTO)
        })
    })

    describe('updateReplyStatus', () => {
        it('debería actualizar el estado de respuesta de un contacto', async () => {
            const result = await ContactService.updateReplyStatus('abc123', {
                replied: true,
                replyNote: 'Respondido por correo'
            })
            expect(result).to.deep.equal(fakeContactDTO)
        })
    })

    describe('deleteContact', () => {
        it('debería eliminar un contacto correctamente', async () => {
            const result = await ContactService.deleteContact('abc123')
            expect(result).to.be.true
        })
    })
})
