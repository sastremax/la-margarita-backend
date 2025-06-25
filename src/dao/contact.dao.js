import ContactModel from '../models/contact.model.js'

class ContactDAO {
    async getAllContacts() {
        return await ContactModel.find()
    }

    async getContactById(id) {
        return await ContactModel.findById(id)
    }

    async createContact(contactData) {
        return await ContactModel.create(contactData)
    }

    async deleteContact(id) {
        return await ContactModel.findByIdAndDelete(id)
    }
}

export default ContactDAO
