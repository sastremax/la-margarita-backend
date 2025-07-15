import ContactDAO from '../dao/contact.dao.js'
import contactDTO from '../dto/contact.dto.js'

const contactDAO = new ContactDAO()

class ContactService {
    static async createContact(contactData) {
        const contact = await contactDAO.createContact(contactData)
        return contactDTO.asPublicContact(contact)
    }

    static async getAllContacts() {
        const contacts = await contactDAO.getAllContacts()
        return contacts.map(contactDTO.asPublicContact)
    }

    static async getContactById(id) {
        const contact = await contactDAO.getContactById(id)
        return contact ? contactDTO.asPublicContact(contact) : null
    }

    static async updateReplyStatus(id, updateData) {
        const contact = await contactDAO.updateReplyStatus(id, updateData)
        return contact ? contactDTO.asPublicContact(contact) : null
    }

    static async deleteContact(id) {
        return await contactDAO.deleteContact(id)
    }
}

export default ContactService