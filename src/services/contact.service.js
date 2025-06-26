import ContactDAO from '../dao/contact.dao.js'
import asContactPublic from '../dto/contact.dto.js'

const contactDAO = new ContactDAO()

class ContactService {
    static async createContact(contactData) {
        const contact = await contactDAO.createContact(contactData)
        return asContactPublic(contact)
    }

    static async getAllContacts() {
        const contacts = await contactDAO.getAllContacts()
        return contacts.map(asContactPublic)
    }

    static async getContactById(id) {
        const contact = await contactDAO.getContactById(id)
        return asContactPublic(contact)
    }

    static async deleteContact(id) {
        return await contactDAO.deleteContact(id)
    }
}

export default ContactService