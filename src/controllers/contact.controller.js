import contactService from '../services/contact.service.js'

export async function submitContactForm(req, res, next) {
    try {
        const result = await contactService.submitContactForm(req.body)
        res.status(201).json({ status: 'success', data: result })
    } catch (error) {
        next(error)
    }
}
