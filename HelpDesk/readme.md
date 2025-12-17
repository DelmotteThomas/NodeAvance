# 🛠️ PROJET FINAL : L'API "HELPDESK"

Ce projet consiste à concevoir une API de gestion de tickets de support technique, en mettant l'accent sur l'architecture, la sécurité et les relations de données complexes.

---

## 🚀 Objectifs Techniques

1.  **Architecture** : MVC Propre (`Routes` -> `Controllers` -> `Services`).
2.  **Data** : **TypeORM** avec **SQLite** (Relations `1:N` et `N:N`).
3.  **Sécurité** : Auth complète (**Passport Local + JWT**) et **RBAC** (Rôles).
4.  **Logique** : **QueryBuilder** pour des filtres avancés.

---

## 🗄️ 1. La Base de Données (Schéma)

Utilisez `EntitySchema` pour définir les 3 entités suivantes :

### A. User (L'utilisateur)
* **Colonnes** : `id`, `email` (unique), `password` (hashé), `role`.
* **Rôles** : `'CLIENT'` (celui qui a un problème) ou `'SUPPORT'` (celui qui répare).
* **Relation** : Un User a plusieurs Tickets.

### B. Ticket (Le problème)
* **Colonnes** : `id`, `title`, `description`, `status` (`OPEN`, `IN_PROGRESS`, `DONE`), `priority` (`LOW`, `HIGH`).
* **Relation 1** : Appartient à un User (l'auteur).
* **Relation 2** : Possède plusieurs Tags.

### C. Tag (La catégorie)
* **Colonnes** : `id`, `label` (ex: "Hardware", "Network", "Bug").
* **Relation** : Est lié à plusieurs Tickets.

> 💡 **Défi Day 2** : Configurez bien le `joinTable` pour la relation **Many-to-Many** entre Ticket et Tag !

---

## 🔐 2. L'Authentification (Sécurité)

Implémentez le système complet vu au Jour 3 :

* **`POST /auth/register`** : Créer un compte (Sécurité : Hachage du mot de passe).
* **`POST /auth/login`** : Se connecter (Mécanique : Passport Local).
    * *Retour* : `{ accessToken, refreshToken }`.
* **`POST /auth/refresh`** : Rafraîchir le token.

---

## 🎫 3. Les Fonctionnalités (Tickets)

Toutes les routes doivent être protégées par Passport JWT (`requireAuth`).

### A. Création (`POST /tickets`)
* **Qui** : Tout le monde (`CLIENT` ou `SUPPORT`).
* **Body** : 
    ```json
    { 
      "title": "PC cassé", 
      "description": "...", 
      "priority": "HIGH", 
      "tags": ["Hardware"] 
    }
    ```
* **Logique** :
    * Lier le ticket à l'utilisateur connecté (`req.user.id`).
    * Statut par défaut : `OPEN`.
    * Gestion des tags : créer le tag s'il n'existe pas, ou le récupérer.

### B. Lecture (`GET /tickets`)
*Logique RBAC (Rôles) cruciale :*
* **CLIENT** : Ne voit **QUE** ses propres tickets.
    * *Indice* : `where("ticket.user.id = :id", { id: req.user.id })`
* **SUPPORT** : Voit **TOUS** les tickets de l'entreprise.
* **Bonus QueryBuilder** : Ajoutez un filtre `?status=OPEN` dans l'URL.

### C. Mise à jour (`PATCH /tickets/:id/status`)
* **Qui** : Uniquement le rôle `SUPPORT` (Utilisez le middleware `requireRole`).
* **Action** : Changer le statut (ex: passer de `OPEN` à `DONE`).
* **Sécurité** : Un `CLIENT` n'a pas le droit de fermer son ticket lui-même.