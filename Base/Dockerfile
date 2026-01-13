# 1️⃣ Image de base (Node LTS, légère)
FROM node:20-alpine

# 2️⃣ Dossier de travail dans le conteneur
WORKDIR /app

# 3️⃣ Copier uniquement les fichiers nécessaires à l'installation
COPY package*.json ./

# 4️⃣ Installer les dépendances
RUN npm install

# 5️⃣ Copier le reste du projet
COPY . .

# 6️⃣ Exposer le port utilisé par l'app
EXPOSE 3000

# 7️⃣ Commande de démarrage
CMD ["npm", "run", "dev"]
