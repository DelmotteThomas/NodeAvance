const TicketService = require('../services/ticket.service');
const asyncHandler = require('../utils/asyncHandler');

class TicketController {
    create = asyncHandler(async (req, res) => {
        const ticket = await TicketService.create(req.user, req.body);
        res.status(201).json({ status: 'success', data: { ticket } });
    });

    findAll = asyncHandler(async (req, res) => {
        const tickets = await TicketService.findAll(req.user, req.query);
        res.status(200).json({ status: 'success', results: tickets.length, data: { tickets } });
    });

    updateStatus = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const ticket = await TicketService.updateStatus(id, status);
        res.status(200).json({ status: 'success', data: { ticket } });
    });
}

module.exports = new TicketController();
