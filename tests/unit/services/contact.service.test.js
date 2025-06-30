import sinon from 'sinon'
import ContactService from '../../../src/services/contact.service.js'
import getFactory from '../../../src/dao/factory.js'

let factory

before(async () => {
    factory = await getFactory()
})

describe('Contact Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería crear un contacto', async () => {
        const contactData = { name: 'John', email: 'john@example.com', message: 'Hello' }
        const createdContact = { id: '1', ...contactData }

        sinon.stub(factory.ContactDAO, 'createContact').resolves(createdContact)

        const result = await ContactService.createContact(contactData)
        expect(result).to.deep.equal(createdContact)
    })

    it('debería obtener todos los contactos', async () => {
        const fakeContacts = [{ id: '1' }, { id: '2' }]
        sinon.stub(factory.ContactDAO, 'getAllContacts').resolves(fakeContacts)

        const result = await ContactService.getAllContacts()
        expect(result).to.deep.equal(fakeContacts)
    })

    it('debería eliminar un contacto por ID', async () => {
        sinon.stub(factory.ContactDAO, 'deleteContact').resolves(true)

        const result = await ContactService.deleteContact('contact123')
        expect(result).to.be.true
    })
})
