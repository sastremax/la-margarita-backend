import ContactModel from '../models/contact.model.js'

const sendMessage = async ({ name, email, message }) => {
    const newMessage = await ContactModel.create({ name, email, message })
    return newMessage
}

const getAllMessages = async () => {
    return await ContactModel.find().sort({ createdAt: -1 })
}

const deleteMessage = async (id) => {
    const deleted = await ContactModel.findByIdAndDelete(id)
    if (!deleted) throw new Error('Message not found or delete failed')
    return deleted
}

export default {
    sendMessage,
    getAllMessages,
    deleteMessage
}
