const express = require('express');
const TicketController = require('../controllers/ticket.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.post('/', TicketController.create);
router.get('/', TicketController.findAll);
router.patch('/:id/status', requireRole('SUPPORT'), TicketController.updateStatus);

module.exports = router;
