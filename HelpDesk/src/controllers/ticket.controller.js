const TicketService = require('../services/ticket.service');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../errors/apiError');

class TicketController {

    /**
     * POST /api/tickets
     * Créer un ticket (assigné automatiquement à l'utilisateur connecté)
     */
    create = asyncHandler(async (req, res) => {
        // Le middleware `requireAuth` garantit que req.user existe,
        // mais une vérification explicite améliore la robustesse.
        if (!req.user) {
            throw new ApiError(401, 'Authentification invalide ou token manquant.');
        }
        const ticket = await TicketService.create(req.user, req.body);

        res.status(201).json({
            status: 'success',
            data: {
                ticket
            }
        });
    });

    /**
     * GET /api/tickets
     * Récupérer les tickets (RBAC : CLIENT vs SUPPORT)
     */
    findAll = asyncHandler(async (req, res) => {
        const tickets = await TicketService.findAll(req.user, req.query);

        res.status(200).json({
            status: 'success',
            results: tickets.length,
            data: {
                tickets
            }
        });
    });

    /**
     * PATCH /api/tickets/:id/status
     * Mettre à jour le statut d'un ticket (SUPPORT uniquement)
     */
    updateStatus = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        const ticket = await TicketService.updateStatus(id, status);

        res.status(200).json({
            status: 'success',
            data: {
                ticket
            }
        });
    });
}

module.exports = new TicketController();
