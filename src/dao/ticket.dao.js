import TicketModel from '../models/ticket.model.js'

export class TicketDAO {
    async createTicket({ purchaser, amount, products }) {
        const ticket = await TicketModel.create({
            purchaser,
            amount,
            products
        })
        return ticket
    }

    async getTicketByCode(code) {
        return await TicketModel.findOne({ code })
    }

    async getAllTickets() {
        return await TicketModel.find().sort({ createdAt: -1 })
    }

    async getTicketsByPurchaser(email) {
        return await TicketModel.find({ purchaser: email }).sort({ createdAt: -1 })
    }
}
