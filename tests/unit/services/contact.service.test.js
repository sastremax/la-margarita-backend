import sinon from 'sinon'
import ContactService from '../../../src/services/contact.service.js'
import ContactDAO from '../../../src/dao/contact.dao.js'

describe('Contact Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería crear un contacto', async () => {
        const contactData = { name: 'John', email: 'john@example.com', message: 'Hello' }
        const createdContact = { id: '1', ...contactData }

        sinon.stub(ContactDAO, 'createContact').resolves(createdContact)

        const result = await ContactService.createContact(contactData)
        expect(result).to.deep.equal(createdContact)
    })

    it('debería obtener todos los contactos', async () => {
        const fakeContacts = [{ id: '1' }, { id: '2' }]
        sinon.stub(ContactDAO, 'getAllContacts').resolves(fakeContacts)

        const result = await ContactService.getAllContacts()
        expect(result).to.deep.equal(fakeContacts)
    })

    it('debería eliminar un contacto por ID', async () => {
        sinon.stub(ContactDAO, 'deleteContact').resolves(true)

        const result = await ContactService.deleteContact('contact123')
        expect(result).to.be.true
    })
})
