import mongoose from 'mongoose'
import ContactModel from '../models/contact.model.js'

export class ContactDAO {
    async getAllContacts() {
        return await ContactModel.find().sort({ createdAt: -1 })
    }

    async getContactById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid contact ID')
        }
        return await ContactModel.findById(id)
    }

    async createContact(contactData) {
        return await ContactModel.create(contactData)
    }

    async updateReplyStatus(id, { replied, replyNote }) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid contact ID')
        }
        return await ContactModel.findByIdAndUpdate(
            id,
            { replied, replyNote },
            { new: true }
        )
    }

    async deleteContact(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid contact ID')
        }
        return await ContactModel.findByIdAndDelete(id)
    }

    async deleteAllContacts() {
        return await ContactModel.deleteMany({})
    }
}
