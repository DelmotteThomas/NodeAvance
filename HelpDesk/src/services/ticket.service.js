const AppDataSource = require('../config/data-source');
const Ticket = require('../models/ticket.entity');
const Tag = require('../models/tag.entity');
const {ApiError} = require('../errors/apiError');
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
        // Recharger le ticket avec les sélections spécifiques pour éviter le mot de passe
        const createdTicket = await ticketRepository.findOne({
            where: { id: ticket.id },
            relations: ['user', 'tags'],
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                user: { id: true, email: true, role: true },
                tags: { id: true, label: true }
            }
        });
        return createdTicket;
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
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                user: { id: true, email: true, role: true },
                tags: { id: true, label: true }
            }
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
        return ticket; // Le mot de passe n'est pas chargé ici par défaut, donc c'est sûr.
    }
}

module.exports = new TicketService();
