import contactService from '../services/contact.service.js'
import contactDTO from '../dto/contact.dto.js'

const submitContactForm = async (req, res, next) => {
    try {
        const result = await contactService.createContact(req.body)
        res.status(201).json({ status: 'success', data: contactDTO.asPublicContact(result) })
    } catch (error) {
        next(error)
    }
}

export default {
    submitContactForm
}