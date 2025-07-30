import { getFactory } from '../dao/factory.js'
import { contactDTO } from '../dto/contact.dto.js'

let contactDAO

const init = async () => {
    if (!contactDAO) {
        const daos = await getFactory()
        contactDAO = daos.ContactDAO
    }
}

class ContactService {
    async createContact(contactData) {
        await init()
        const contact = await contactDAO.createContact(contactData)
        return contactDTO.asPublicContact(contact)
    }

    async getAllContacts() {
        await init()
        const contacts = await contactDAO.getAllContacts()
        return contacts.map(contactDTO.asPublicContact)
    }

    async getContactById(id) {
        await init()
        const contact = await contactDAO.getContactById(id)
        return contact ? contactDTO.asPublicContact(contact) : null
    }

    async updateReplyStatus(id, updateData) {
        await init()
        const contact = await contactDAO.updateReplyStatus(id, updateData)
        return contact ? contactDTO.asPublicContact(contact) : null
    }

    async deleteContact(id) {
        await init()
        return await contactDAO.deleteContact(id)
    }
}

export const contactService = new ContactService()
