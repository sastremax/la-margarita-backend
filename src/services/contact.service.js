import ContactDAO from '../dao/contact.dao.js'

class ContactService {
    static async getAllContacts() {
        return await ContactDAO.getAllContacts()
    }

    static async getContactById(id) {
        return await ContactDAO.getContactById(id)
    }

    static async createContact(contactData) {
        return await ContactDAO.createContact(contactData)
    }

    static async deleteContact(id) {
        return await ContactDAO.deleteContact(id)
    }
}

export default ContactService
