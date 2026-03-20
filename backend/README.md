# Multi-Tenant Issue Tracker API Documentation

## Tech Stack
- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **TypeScript**
- **JWT Authentication (httpOnly cookies)**
- **bcrypt** (password hashing)
- **cookie-parser, cors** (middleware)

---

## Authentication Endpoints

### Register
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "email": "alice@acme.com",
    "password": "password123",
    "tenantSlug": "acme"
  }
  ```
- **Response:**
  - Sets JWT cookie
  - `{ message: 'Registered', user: { id, email } }`

### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "alice@acme.com",
    "password": "password123"
  }
  ```
- **Response:**
  - Sets JWT cookie
  - `{ message: 'Logged in', user: { id, email, tenantId } }`

### Logout
- **POST** `/api/auth/logout`
- **Response:**
  - Clears JWT cookie
  - `{ message: 'Logged out' }`

---

## Issue Endpoints (Protected)
> All requests require authentication (JWT cookie)

### Get All Issues
- **GET** `/api/issues`
- **Response:**
  ```json
  [
    {
      "id": "...",
      "tenantId": "...",
      "createdById": "...",
      "title": "Fix login bug",
      "description": "Users cannot log in.",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "...",
      "updatedAt": "...",
      "createdBy": { "email": "alice@acme.com" }
    },
    // ...
  ]
  ```

### Create Issue
- **POST** `/api/issues`
- **Body:**
  ```json
  {
    "title": "Broken dashboard",
    "description": "Graphs not loading.",
    "priority": "HIGH"
  }
  ```
- **Response:**
  - Status 201
  - Issue object

### Update Issue
- **PATCH** `/api/issues/:id`
- **Body:** (any fields to update)
  ```json
  {
    "title": "Update docs",
    "status": "IN_PROGRESS"
  }
  ```
- **Response:**
  - Updated issue object

### Delete Issue
- **DELETE** `/api/issues/:id`
- **Response:**
  - Status 204 (no content)

---

## Demo Data

### Tenants
- Acme Corp (`acme`)
- Globex Inc (`globex`)
- Initech LLC (`initech`)

### Users
- `alice@acme.com` / `password123` (Acme)
- `bob@globex.com` / `password123` (Globex)
- `carol@initech.com` / `password123` (Initech)

### Issues (examples)
- Acme:
  - Fix login bug (OPEN, HIGH)
  - Update docs (IN_PROGRESS, MEDIUM)
  - Refactor code (CLOSED, LOW)
- Globex:
  - Broken dashboard (OPEN, HIGH)
  - Add dark mode (IN_PROGRESS, MEDIUM)
  - Fix typo (CLOSED, LOW)
- Initech:
  - Performance lag (OPEN, HIGH)
  - UI polish (IN_PROGRESS, MEDIUM)
  - Remove unused code (CLOSED, LOW)

---

## Notes
- All data is tenant-isolated: users can only see and modify issues for their own tenant.
- JWT is sent as an httpOnly cookie for all authentication.
- All endpoints return errors in JSON format.
