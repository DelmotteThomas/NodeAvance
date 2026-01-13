# Backend Boilerplate – Clean Architecture (Express)

Boilerplate backend Node.js basé sur **Clean Architecture**, avec
**Dependency Injection**, **TypeORM**, **Passport**, **Redis** et une
séparation claire des responsabilités.

Ce projet sert de base générique réutilisable pour des projets API
sécurisés.

---

## 🚀 Features

- Clean Architecture (Controller / Service / Repository)
- Dependency Injection via container
- TypeORM (DataSource centralisé)
- Authentification (Passport + Session + Redis)
- Middleware de sécurité (rate limit, sanitizer, auth)
- Cache Redis (middleware)
- Gestion centralisée des erreurs
- Boilerplate testable et extensible
- Docker-ready

---

## 🧱 Architecture

src/
├── app.js
├── server.js
├── container.js
│
├── config/
│ ├── data-source.js
│ ├── passport.js
│ └── redis.js
│
├── core/
│ ├── base-controller.js
│ ├── base-repository.js
│ └── base-service.js
│
├── controllers/
│ ├── auth.controller.js
│ └── user.controller.js
│
├── services/
│ ├── auth.service.js
│ └── user.service.js
│
├── repositories/
│ └── user.repository.js
│
├── models/
│ └── user.model.js
│
├── middlewares/
│ ├── auth.middleware.js
│ ├── cache.middleware.js
│ ├── logger.middleware.js
│ ├── rate-limit.middleware.js
│ ├── sanitizer.middleware.js
│ ├── session.middleware.js
│ ├── validate.middleware.js
│ └── not-found.middleware.js
│
├── routes/
│ ├── auth.routes.js
│ ├── user.routes.js
│ └── index.routes.js
│
├── errors/
│ ├── api-error.js
│ └── error-handler.js
│
└── tests/


---

## 🔌 Dependency Injection (DI)

- Aucune classe métier ne crée ses dépendances
- Toutes les dépendances sont instanciées dans `container.js`
- Les middlewares dépendant d’une infra (Redis, session) utilisent une factory

---

## 🔐 Authentification

- Passport Local (login)
- Passport Session + Redis
- Séparation AuthController / UserController
- AuthService isolé (hash, validation)

---

## 🧪 Tests

Les tests sont pensés pour :
- valider le container
- tester les services sans DB réelle
- éviter les tests e2e lourds pour un boiler

---

## ▶️ Lancer le projet

```bash
docker-compose up --build
npm install
npm run dev

```
## ▶️ CMD Docker

```bash
docker-compose down -v 
docker compose logs -f app
                                                     
```
