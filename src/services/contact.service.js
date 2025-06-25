import ContactDAO from '../dao/contact.dao.js'

const contactDAO = new ContactDAO()

const createContact = async (contactData) => {
    return await contactDAO.createContact(contactData)
}

const getAllContacts = async () => {
    return await contactDAO.getAllContacts()
}

const getContactById = async (id) => {
    return await contactDAO.getContactById(id)
}

const deleteContact = async (id) => {
    return await contactDAO.deleteContact(id)
}

export default {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
}
