import contactService from '../services/contact.service.js'

async function submitContactForm(req, res, next) {
    try {
        const result = await contactService.createContact(req.body)
        res.status(201).json({ status: 'success', data: result })
    } catch (error) {
        next(error)
    }
}

const contactController = {
    submitContactForm
}

export default contactController
