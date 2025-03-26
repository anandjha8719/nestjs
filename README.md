<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>



![image](https://github.com/user-attachments/assets/46f80654-795a-4359-8477-37e5233ed763)

# **NestJS Backend – User & Document Management**  

This project is a **NestJS-based backend service** that manages **user authentication, document management, and ingestion controls**. It includes role-based access control and integrates with a Python backend (or a mock service) for document ingestion.  

## **Features**  

### **Authentication & User Management**  
- **JWT-based authentication**: Register, login, and logout users securely.  
- **Role-based access control (RBAC)**: Supports **Admin, Editor, and Viewer** roles.  
- **User management APIs**: Admins can manage users, roles, and permissions.  

### **Document Management**  
- **CRUD operations**: Upload, update, delete, and retrieve documents.  
- **Metadata storage**: Document details are stored in a PostgreSQL database.  

### **Ingestion Management & Python Integration**  
- **Ingestion Trigger API**: Initiates document ingestion via a Python backend (or a mock service).  
- **Ingestion Status API**: Tracks and retrieves ingestion progress.  
- **Mock Python Service (Optional)**: Simulates ingestion behavior for testing without a real Python backend.  

### **Additional Features**  
- **Swagger** for API reference.  
- **Unit tests** for key APIs to ensure reliability.  
---

## **Tech Stack**
- **Backend**: NestJS (TypeScript)  
- **Database**: PostgreSQL with Prisma/TypeORM  
- **Authentication**: JWT & bcrypt  
- **Storage**: Local or cloud-based document storage  
- **Testing**: Jest (for unit testing)  
- **API Documentation**: Swagger  

---
## **Project Setup**  

### **Prerequisites**  
Ensure you have the following installed:  
- [Node.js](https://nodejs.org/) (v22.14.0)  
- [Npm](https://www.npmjs.com/) (v10.9.2)  
- [PostgreSQL](https://www.postgresql.org/) (Local or cloud)

## **Installation**  

1. **Clone the repository**  
   ```sh
   git clone git@github.com:anandjha8719/nestjs.git
   cd nestjs

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

## Run tests with coverage report

```bash
# unit tests
$ npm run test

```

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
  - `POST /documents/:id/ingest`: Start document Ingestion (Admins/Editors only).
  - `POST /documents/:id/retry`: Retry document Ingestion (Admins/Editors only).
  - `GET /documents/:id/status`: Get document Ingestion status.
- **Database Integration**:
  Stored document metadata in PostgreSQL (neonDB) using TypeORM `Document` entity.

## Document Ingestion System with NestJS Microservice



This project implements a document ingestion system using NestJS with a microservice architecture to simulate Python backend functionality. The system allows users to upload documents, process them through a simulated ingestion pipeline, and track the status of the ingestion process.

## Architecture

The application consists of two main components:

1. **Main NestJS Application** - Handles HTTP requests, document uploads, and user authentication
2. **Ingestion Microservice** - Simulates a Python backend for document processing

## Communication Flow

### Main NestJS Application to Ingestion Microservice

The system uses NestJS's built-in microservice capabilities with TCP transport to facilitate communication between the main application and the ingestion service.

```
┌─────────────────────┐         ┌─────────────────────┐
│                     │         │                     │
│     Main NestJS     │ ◄─────► │      Ingestion      │
│     Application     │   TCP   │    Microservice     │
│                     │         │                     │
└─────────────────────┘         └─────────────────────┘
```

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
    
    ````typescript
    const processingTime = 5000 + Math.random() * 5000;
    const willSucceed = Math.random() < 0.8;
    ````
5. Updates the document status in its internal storage


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
````

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

**Technologies Used**: NestJS, TypeORM, PostgreSQL, JWT, Swagger, Jest.

# **Improvement Areas & Future Enhancements**  

Here are some obvious improvements that this project should have:  

### **1. Implement Cursor-Based Pagination**  
- Implementing cursor-based pagination will reduce the performance overhead of fetching records.  

### **2. Enhanced Role-Based Access Control (RBAC)**  
- Introduce **custom permissions** beyond predefined roles (Admin, Editor, Viewer).  

### **3. Real-Time Ingestion Status Updates**  
- Use **WebSockets** or **Server-Sent Events (SSE)** to provide real-time updates on document ingestion.  
- This will remove the need for frequent polling and improve UX.  

### **4. Rate Limiting & Throttling**  
- Implement **rate limiting** using **NestJS Throttler** to prevent API abuse.  
- Introduce **IP-based** or **user-based throttling** for better security.  

### **5. Improved Logging & Monitoring**  
- Integrate a logging system for structured logging.  
- Add **Prometheus & Grafana** for real-time API monitoring.  
- Store logs in a centralized service.  

### **6. Background Job Processing for Ingestion**  
- Move ingestion triggers to a **queue-based system** like **BullMQ (Redis-backed)**.  
- Helps in handling **high workloads** efficiently.  

### **7. Cloud Storage Integration**  
- Instead of local storage, use a cloud based storage for files **AWS S3, Google Cloud Storage, or Azure Blob Storage**.  
- Enhance document retrieval performance and scalability.  

### **8. CI/CD Integration**  
- Setup CI/CD for automated deployment and testing.  
- Ensure **zero-downtime deployments** with proper rollback strategies. 
