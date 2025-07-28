import ContactModel from '../models/contact.model.js'

export class ContactDAO {
    async getAllContacts() {
        return await ContactModel.find().sort({ createdAt: -1 })
    }

    async getContactById(id) {
        return await ContactModel.findById(id)
    }

    async createContact(contactData) {
        return await ContactModel.create(contactData)
    }

    async updateReplyStatus(id, { replied, replyNote }) {
        return await ContactModel.findByIdAndUpdate(
            id,
            { replied, replyNote },
            { new: true }
        )
    }

    async deleteContact(id) {
        return await ContactModel.findByIdAndDelete(id)
    }

    async deleteAllContacts() {
        return await ContactModel.deleteMany({})
    }
}
