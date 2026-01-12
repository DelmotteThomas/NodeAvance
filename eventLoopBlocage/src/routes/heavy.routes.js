const express = require("express");
const router = express.Router();
const HeavyComputationController = require("../controllers/heavyComputation.controller");

// Route qui va bloquer le serveur

router.get("/heavy-task-blocking", HeavyComputationController.blockingTask);
router.get("/heavy-task-worker", HeavyComputationController.heavyTaskWorker);
router.get("/heavy-task-pool", HeavyComputationController.heavyTaskPool);

module.exports = router;
