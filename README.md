<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

## **How to Run**

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

````

3. Configure `.env` file as the .env.example.
4. Start the server:
   ```bash
   npm run start:dev
   ```
5. Access Swagger docs at `http://localhost:3000/api`.
````

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

````markdown
# Document Management System

---

## **Project Setup & Basic Configuration**

- **NestJS Project Setup**:
  Initialized a TypeScript-based NestJS project using `@nestjs/cli`.
- **PostgreSQL & TypeORM Configuration**:
  Integrated PostgreSQL with TypeORM for database management. Configured entities, repositories, and database connections.
- **JWT Authentication**:
  Implemented JWT-based authentication using `@nestjs/jwt` and `passport-jwt`. Configured role-based access control (RBAC) via guards.

---

## **User & Authentication APIs**

- **Endpoints**:
  - `POST /auth/register`: Register users with email, password, and role (Admin/Editor/Viewer).
  - `POST /auth/login`: Generate JWT tokens after validating credentials.
  - `POST /auth/logout`: Token invalidation logic (optional).
- **Security Features**:
  - Password hashing using `bcrypt`.
  - Role-based route protection (e.g., Admins can delete documents).
- **Database Models**:
  Created `User` entity with TypeORM, including `id`, `email`, `password`, `role`, and timestamps.

---

## **Document Management APIs**

- **CRUD Operations**:
  - `POST /documents`: Upload documents and store metadata (title, owner, file path).
  - `GET /documents`: Retrieve all documents (filtered by user role).
  - `GET /documents/:id`: Fetch a single document.
  - `PATCH /documents/:id`: Update document metadata (Editors/Admins only).
  - `DELETE /documents/:id`: Delete documents (Admins only).
- **Database Integration**:
  Stored document metadata in PostgreSQL (neonDB) using TypeORM `Document` entity.

---

## **Ingestion Control & Python Communication**

- **Ingestion Trigger API**:
  Implemented `POST /ingest/:documentId` to call a Python API/mock service for document processing.
- **Status Tracking**:
  Created `IngestionLog` entity to track progress (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`).
- **Management API**:
  Added `GET /ingest/status/:documentId` to check ingestion status.
- **Error Handling**:
  Implemented retry logic for failed ingestions and stored error messages.

---

## **Testing & API Documentation (3-4 hours)**

- **Unit Tests**:
  Wrote tests for auth, document, and ingestion APIs using Jest and `@nestjs/testing`.
- **Swagger Documentation**:
  Integrated Swagger/OpenAPI with `@nestjs/swagger` for auto-generated API docs.
  Added decorators (`@ApiTags`, `@ApiResponse`) and security definitions.
- **Load Testing**:
  Optional: Used tools like Artillery or Postman Runner for basic performance testing.

---

---

**Technologies Used**: NestJS, TypeORM, PostgreSQL, JWT, Swagger, Jest.
