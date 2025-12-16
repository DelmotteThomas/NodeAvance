# TP 1 : Mission Persistance  
## (Connexion BDD)

---

## 🧩 Le Problème

À chaque fois que vous redémarrez le serveur (`rs` avec `nodemon`), tous vos utilisateurs et
vos tâches disparaissent.  
C'est **inacceptable pour une mise en production**.

### 🎯 Votre mission
Connecter votre API à une **vraie base de données SQL** afin que les informations
**survivent au redémarrage du serveur**.

---

## 🎯 Objectifs Techniques

1. Installer les dépendances nécessaires (**TypeORM** et le pilote **SQLite**).
2. Créer un fichier de configuration centralisé pour la base de données (**DataSource**).
3. Modifier le point d'entrée du serveur (`server.js`) pour **attendre la connexion BDD**
   avant d'accepter des requêtes HTTP.

---

## 🛠️ Étapes de Réalisation

### Étape 1 : L'Arsenal (Installation)

Nous allons utiliser **SQLite**.  
C'est une base de données SQL complète qui tient dans **un seul fichier**.

👉 Pas besoin d'installer un serveur lourd (comme Postgres) pour l'instant, mais le code sera
**100 % compatible** avec des bases SQL plus avancées.

Dans votre terminal, installez les paquets suivants :

```bash
npm install typeorm sqlite3 reflect-metadata
