const express = require('express');

// Middlewares techniques
const logger = require('./middlewares/logger.middleware');
const sanitizer = require('./middlewares/sanitizer.middleware');
const { globalLimiter } = require('./middlewares/rate-limit.middleware');

// Routes
const createRoutes = require('./routes/index.routes');

// Error handling
const errorHandler = require('./errors/error-handler');
const notFound = require('./middlewares/not-found.middleware');

module.exports = (container) => {
  const app = express();

  // ---------- GLOBAL MIDDLEWARES ----------
  app.use(express.json());
  app.use(logger);
  app.use(globalLimiter);
  app.use(sanitizer);

  // ---------- AUTH / SESSION ----------
  app.use(container.sessionMiddleware);
  app.use(container.passport.initialize());
  app.use(container.passport.session());

  // ---------- ROUTES ----------
  app.use(
    '/',
    createRoutes(container)
  );

  // ---------- 404 ----------
  app.use(notFound);

  // ---------- ERROR HANDLER ----------
  app.use(errorHandler);

  return app;
};
