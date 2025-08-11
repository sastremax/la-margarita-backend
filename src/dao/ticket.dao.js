import TicketModel from '../models/ticket.model.js'

export class TicketDAO {
    async createTicket({ purchaser, amount, products }) {
        if (typeof purchaser !== 'string' || purchaser.trim().length === 0) {
            throw new Error('Invalid purchaser')
        }
        if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
            throw new Error('Invalid amount')
        }
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('Invalid products')
        }
        for (const p of products) {
            if (!p || typeof p !== 'object') {
                throw new Error('Invalid product entry')
            }
            if (!Number.isInteger(p.quantity) || p.quantity < 1) {
                throw new Error('Invalid product quantity')
            }
        }
        const ticket = await TicketModel.create({ purchaser, amount, products })
        return ticket
    }

    async getTicketByCode(code) {
        if (typeof code !== 'string' || code.trim().length === 0) {
            throw new Error('Invalid code')
        }
        return await TicketModel.findOne({ code }).lean()
    }

    async getAllTickets(options = {}) {
        const { page, limit } = options
        const hasPagination = Number.isInteger(page) && Number.isInteger(limit) && page > 0 && limit > 0
        if (!hasPagination) {
            return await TicketModel.find().sort({ createdAt: -1 }).lean()
        }
        const skip = (page - 1) * limit
        const [total, data] = await Promise.all([
            TicketModel.countDocuments(),
            TicketModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
        ])
        const pages = Math.ceil(total / limit)
        return { total, page, pages, data }
    }

    async getTicketsByPurchaser(email, options = {}) {
        if (typeof email !== 'string' || email.trim().length === 0) {
            throw new Error('Invalid purchaser email')
        }
        const { page, limit } = options
        const hasPagination = Number.isInteger(page) && Number.isInteger(limit) && page > 0 && limit > 0
        if (!hasPagination) {
            return await TicketModel.find({ purchaser: email }).sort({ createdAt: -1 }).lean()
        }
        const skip = (page - 1) * limit
        const query = { purchaser: email }
        const [total, data] = await Promise.all([
            TicketModel.countDocuments(query),
            TicketModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
        ])
        const pages = Math.ceil(total / limit)
        return { total, page, pages, data }
    }
}