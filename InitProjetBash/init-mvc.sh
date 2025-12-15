#!/bin/bash

echo "📁 Création de la structure MVC..."

# Dossiers principaux
mkdir -p public/assets
mkdir -p src/{config,controllers,errors,middlewares,models,routes,services,utils}

# Fichiers racine
touch server.js

touch .env
touch .gitignore
touch readme.md

# Fichiers src
touch src/routes.js
touch src/config/index.js
touch src/app.js

# Exemples de fichiers MVC (vides mais prêts)
touch src/controllers/example.controller.js
touch src/services/example.service.js
touch src/models/example.model.js
touch src/routes/example.routes.js
touch src/middlewares/logger.middleware.js
touch src/errors/error.handler.js
touch src/utils/helpers.js

echo "✅ Structure MVC créée avec succès !"
