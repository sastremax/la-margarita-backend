import ContactModel from '../models/contact.model.js'

class ContactDAO {
    static async getAllContacts() {
        return await ContactModel.find()
    }

    static async getContactById(id) {
        return await ContactModel.findById(id)
    }

    static async createContact(contactData) {
        return await ContactModel.create(contactData)
    }

    static async deleteContact(id) {
        return await ContactModel.findByIdAndDelete(id)
    }
}

export default ContactDAO
