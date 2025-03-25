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

![image](https://github.com/user-attachments/assets/46f80654-795a-4359-8477-37e5233ed763)


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

## **How to Run**

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```



3. Configure `.env` file as the .env.example.
4. Start the server (main server and mock ingestion micro-service):
   ```bash
   npm run start:dev
   npm run start:ingestion
   ```
5. Access Swagger docs at `http://localhost:3000/api`.


## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Document Management System


## **Project Setup & Basic Configuration**

- **NestJS Project Setup**:
  Initialized a TypeScript-based NestJS project using `@nestjs/cli`.
- **PostgreSQL & TypeORM Configuration**:
  Integrated PostgreSQL with TypeORM for database management. Configured entities, repositories, and database connections.
- **JWT Authentication**:
  Implemented JWT-based authentication using `@nestjs/jwt` and `passport-jwt`. Configured role-based access control (RBAC) via guards.


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



## **Document Management APIs**

- **CRUD Operations**:
  - `POST /documents`: Upload documents and store metadata (title, owner, file path).
  - `GET /documents`: Retrieve all documents (filtered by user role).
  - `GET /documents/:id`: Fetch a single document.
  - `PATCH /documents/:id`: Update document metadata (Editors/Admins only).
  - `DELETE /documents/:id`: Delete documents (Admins only).
- **Database Integration**:
  Stored document metadata in PostgreSQL (neonDB) using TypeORM `Document` entity.



# Document Ingestion System with NestJS Microservice

## Overview

This project implements a document ingestion system using NestJS with a microservice architecture to simulate Python backend functionality. The system allows users to upload documents, process them through a simulated ingestion pipeline, and track the status of the ingestion process.

## Architecture

The application consists of two main components:

1. **Main NestJS Application** - Handles HTTP requests, document uploads, and user authentication
2. **Ingestion Microservice** - Simulates a Python backend for document processing

## Communication Flow

### Main NestJS Application to Ingestion Microservice

The system uses NestJS's built-in microservice capabilities with TCP transport to facilitate communication between the main application and the ingestion service.


┌─────────────────────┐         ┌─────────────────────┐
│                     │         │                     │
│     Main NestJS     │ ◄─────► │      Ingestion      │
│     Application     │   TCP   │    Microservice     │
│                     │         │                     │
└─────────────────────┘         └─────────────────────┘


## How It Works

### 1. Document Upload and Storage

- Users upload documents through the `/documents` endpoint
- Files are stored on disk using Multer
- Document metadata is saved in a PostgreSQL database

### 2. Triggering Document Ingestion

When a user triggers ingestion through the `/documents/:id/ingest` endpoint:

1. `DocumentsService` marks the document as "PROCESSING" in the database
2. It sends a message to the Ingestion Microservice using the ClientProxy
   ```typescript
   this.client.send({ cmd: 'start_ingestion' }, document);
   ```

### 3. Microservice Processing Simulation

The Ingestion Microservice:

1. Receives the document data
2. Adds it to an in-memory processing queue
3. Uses `setTimeout` to simulate processing time (5-10 seconds)
4. Randomly succeeds (80% chance) or fails (20% chance)
5. Updates the document status in its internal storage

```typescript
const processingTime = 5000 + Math.random() * 5000;
const willSucceed = Math.random() < 0.8;


### 4. Status Checking

- Users can check ingestion status via `/documents/:id/status` endpoint
- The main application queries the microservice for status updates
- The microservice returns the current status from its in-memory store
- When processing completes, the main application updates the database with the final status

```typescript
async getIngestionStatus(id: number) {
  const response = await firstValueFrom(
    this.client.send({ cmd: 'get_status' }, id),
  );
  if (response.status === 'completed' || response.status === 'failed') {
  }
  return response;
}
```

### 5. Retry Mechanism

- Failed ingestions can be retried via `/documents/:id/retry` endpoint
- The system resets the retry count and triggers ingestion again

## Key Components

### Microservice Registration

Both the main application and the microservice register the TCP connection:

```typescript
ClientsModule.register([
  {
    name: INGESTION_SERVICE,
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: INGESTION_PORT,
    },
  },
]),
```

### Microservice Message Patterns

The ingestion microservice listens for specific message patterns:

```typescript
@MessagePattern({ cmd: 'start_ingestion' })
async handleIngestion(@Payload() document: Document) {
  await this.ingestionService.startIngestion(document);
  return { received: true };
}

@MessagePattern({ cmd: 'get_status' })
async handleStatusCheck(@Payload() documentId: number) {
  return this.ingestionService.getStatus(documentId);
}
```

### In-Memory Status Tracking

The microservice uses Maps to track processing jobs and status:

```typescript
private processingQueue = new Map<number, NodeJS.Timeout>();
private statusStore = new Map<number, any>();
```

## Running the Application

The system requires two separate processes:

1. The main NestJS application:

   ```
   npm run start
   ```

2. The ingestion microservice:
   ```
   npm run start:ingestion
   ```

## Simulating Python Backend

This implementation effectively simulates a Python backend by:

1. **Decoupling Processing Logic**: The document processing is completely separated from the main application
2. **Asynchronous Communication**: Using message-based communication similar to how you would call a Python service
3. **Realistic Timing**: Adding randomized processing times to simulate real-world behavior
4. **Error Simulation**: Randomly generating failures to test error handling
5. **Stateful Processing**: Maintaining processing state across separate services

## Security Considerations

The system implements:

- JWT Authentication
- Role-based access control
- File type validation
- Size limits for uploads

## Additional Notes

## This mocking approach allows for complete testing of the document ingestion workflow without implementing actual document parsing, vectorization, or embedding generation that would typically be handled by a Python service.

## **Testing & API Documentation**

- **Unit Tests**:
  Wrote tests for auth, document, and ingestion APIs using Jest and `@nestjs/testing`.
- **Swagger Documentation**:
  Integrated Swagger/OpenAPI with `@nestjs/swagger` for auto-generated API docs.
  Added decorators (`@ApiTags`, `@ApiResponse`) and security definitions.
- **Load Testing**:
  Optional: Used tools like Artillery or Postman Runner for basic performance testing.


**Technologies Used**: NestJS, TypeORM, PostgreSQL, JWT, Swagger, Jest.

