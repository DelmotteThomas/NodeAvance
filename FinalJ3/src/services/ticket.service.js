const AppDataSource = require('../config/data-source');
const Ticket = require('../entities/Ticket');
const Tag = require('../entities/Tag');
const ApiError = require('../utils/ApiError');
const { In } = require('typeorm');

const ticketRepository = AppDataSource.getRepository(Ticket);
const tagRepository = AppDataSource.getRepository(Tag);

class TicketService {
    async create(user, data) {
        const { title, description, priority, tags } = data;

        let tagEntities = [];
        if (tags && tags.length > 0) {
            const existingTags = await tagRepository.findBy({ label: In(tags) });
            const existingTagLabels = existingTags.map((t) => t.label);

            const newTagLabels = tags.filter((t) => !existingTagLabels.includes(t));
            const newTags = newTagLabels.map((label) => tagRepository.create({ label }));
            await tagRepository.save(newTags);

            tagEntities = [...existingTags, ...newTags];
        }

        const ticket = ticketRepository.create({
            title,
            description,
            priority,
            user,
            tags: tagEntities,
            status: 'OPEN',
        });

        await ticketRepository.save(ticket);
        return ticket;
    }

    async findAll(user, query) {
        const { status } = query;
        const where = {};

        if (user.role === 'CLIENT') {
            where.user = { id: user.id };
        }

        if (status) {
            where.status = status;
        }

        const tickets = await ticketRepository.find({
            where,
            relations: ['user', 'tags'],
            order: { id: 'DESC' },
        });

        return tickets;
    }

    async updateStatus(id, status) {
        const ticket = await ticketRepository.findOneBy({ id });
        if (!ticket) {
            throw new ApiError(404, 'Ticket not found');
        }

        ticket.status = status;
        await ticketRepository.save(ticket);
        return ticket;
    }
}

module.exports = new TicketService();
