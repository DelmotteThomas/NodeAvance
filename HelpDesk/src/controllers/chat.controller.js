const AppDataSource = require('../config/data-source');

exports.getGeneralHistory = async (req, res) => {
    try {
        const messageRepository = AppDataSource.getRepository('Message');
        
        // Récupération des 50 derniers messages [cite: 102]
        const messages = await messageRepository.find({
            where: { room: 'general' },
            order: { createdAt: 'ASC' }, 
            take: 50,
            relations: ['sender'] // On charge les infos du sender
        });

        res.json(messages);
    } catch (error) {
        console.error("Erreur Controller Chat:", error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'historique" });
    }
};