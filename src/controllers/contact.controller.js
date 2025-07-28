import { contactService } from '../services/contact.service.js'
import { contactDTO } from '../dto/contact.dto.js'

export const submitContactForm = async (req, res, next) => {
    try {
        const result = await contactService.createContact(req.body)
        res.status(201).json({ status: 'success', data: contactDTO.asPublicContact(result) })
    } catch (error) {
        next(error)
    }
}

export const replyToContact = async (req, res, next) => {
    try {
        const { id } = req.params
        const { replied, replyNote } = req.body
        const updatedContact = await contactService.updateReplyStatus(id, { replied, replyNote })
        res.status(200).json({ status: 'success', data: updatedContact })
    } catch (error) {
        next(error)
    }
}
