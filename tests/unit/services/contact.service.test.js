import { expect } from 'chai'
import sinon from 'sinon'
import ContactService from '../../../src/services/contact.service.js'
import ContactDAO from '../../../src/dao/contact.dao.js'
import contactDTO from '../../../src/dto/contact.dto.js'

describe('Contact Service', () => {
    const fakeContact = {
        _id: 'contact123',
        name: 'Juan',
        email: 'juan@example.com',
        message: 'Hola, quiero más info',
        replied: false
    }

    const fakePublicContact = {
        id: 'contact123',
        name: 'Juan',
        email: 'juan@example.com',
        message: 'Hola, quiero más info',
        replied: false
    }

    beforeEach(() => {
        sinon.restore()
    })

    describe('createContact', () => {
        it('debería crear un contacto y devolverlo en formato público', async () => {
            sinon.stub(ContactDAO.prototype, 'createContact').resolves(fakeContact)
            sinon.stub(contactDTO, 'asPublicContact').returns(fakePublicContact)

            const result = await ContactService.createContact({
                name: 'Juan',
                email: 'juan@example.com',
                message: 'Hola'
            })

            expect(result).to.deep.equal(fakePublicContact)
        })
    })

    describe('getAllContacts', () => {
        it('debería devolver todos los contactos en formato público', async () => {
            sinon.stub(ContactDAO.prototype, 'getAllContacts').resolves([fakeContact])
            sinon.stub(contactDTO, 'asPublicContact').callsFake((c) => ({ id: c._id, name: c.name }))

            const result = await ContactService.getAllContacts()

            expect(result).to.deep.equal([{ id: 'contact123', name: 'Juan' }])
        })
    })

    describe('getContactById', () => {
        it('debería devolver un contacto por ID', async () => {
            sinon.stub(ContactDAO.prototype, 'getContactById').resolves(fakeContact)
            sinon.stub(contactDTO, 'asPublicContact').returns(fakePublicContact)

            const result = await ContactService.getContactById('contact123')

            expect(result).to.deep.equal(fakePublicContact)
        })

        it('debería devolver null si el ID no existe', async () => {
            sinon.stub(ContactDAO.prototype, 'getContactById').resolves(null)

            const result = await ContactService.getContactById('noexistente')

            expect(result).to.be.null
        })
    })

    describe('updateReplyStatus', () => {
        it('debería actualizar el estado replied y devolver el contacto actualizado', async () => {
            const updated = { ...fakeContact, replied: true }

            sinon.stub(ContactDAO.prototype, 'updateReplyStatus').resolves(updated)
            sinon.stub(contactDTO, 'asPublicContact').returns({ ...fakePublicContact, replied: true })

            const result = await ContactService.updateReplyStatus('contact123', { replied: true })

            expect(result.replied).to.be.true
        })

        it('debería devolver null si el ID no existe', async () => {
            sinon.stub(ContactDAO.prototype, 'updateReplyStatus').resolves(null)

            const result = await ContactService.updateReplyStatus('noexistente', { replied: true })

            expect(result).to.be.null
        })
    })

    describe('deleteContact', () => {
        it('debería eliminar el contacto por ID', async () => {
            const stub = sinon.stub(ContactDAO.prototype, 'deleteContact').resolves()

            await ContactService.deleteContact('contact123')

            expect(stub.calledOnceWith('contact123')).to.be.true
        })
    })
})
