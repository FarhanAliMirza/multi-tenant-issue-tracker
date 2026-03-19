# Multi-Tenant Issue Tracker Backend

## Overview

This backend provides a secure, multi-tenant issue tracking API built with Node.js, Express, TypeScript, Prisma (Postgres), Zod, JWT, and bcrypt. It enforces strict tenant isolation and robust authentication.

---

## API Endpoints

### Auth

#### POST `/auth/register`

- **Description:** Register a new user (and tenant).
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword123",
    "tenant": "tenant-name"
  }
  ```
- **Response:**
  - `201 Created` with `{ token: <JWT> }`

#### POST `/auth/login`

- **Description:** Login as an existing user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword123"
  }
  ```
- **Response:**
  - `200 OK` with `{ token: <JWT> }`

---

### Issues (Protected, requires `Authorization: Bearer <token>` header)

#### POST `/issues`

- **Description:** Create a new issue for the current tenant.
- **Request Body:**
  ```json
  {
    "title": "Bug: Cannot login",
    "description": "Login fails with 500 error"
  }
  ```
- **Response:**
  - `201 Created` with the created issue object

#### GET `/issues`

- **Description:** List all issues for the current tenant.
- **Response:**
  - `200 OK` with array of issues

#### GET `/issues/:id`

- **Description:** Get a specific issue by ID (must belong to your tenant).
- **Response:**
  - `200 OK` with issue object, or `404 Not Found`

#### PATCH `/issues/:id`

- **Description:** Update an issue (must belong to your tenant).
- **Request Body:** (any subset of fields)
  ```json
  {
    "title": "Updated title",
    "description": "Updated description"
  }
  ```
- **Response:**
  - `200 OK` with updated issue, or `404 Not Found`

#### DELETE `/issues/:id`

- **Description:** Delete an issue (must belong to your tenant).
- **Response:**
  - `204 No Content` or `404 Not Found`

---

### Health

#### GET `/health`

- **Description:** Health check endpoint.
- **Response:**
  - `200 OK` with `{ status: "ok" }`

---

## Demo Data

To demo the API, use the following sample data:

### Register Tenant A

```json
{
  "email": "alice@a.com",
  "password": "password123",
  "tenant": "tenant-a"
}
```

### Register Tenant B

```json
{
  "email": "bob@b.com",
  "password": "password123",
  "tenant": "tenant-b"
}
```

### Create Issue (as Tenant A)

```json
{
  "title": "First Issue",
  "description": "This is a test issue."
}
```

---

## Notes

- All `/issues` endpoints require a valid JWT in the `Authorization` header.
- Users can only access issues belonging to their own tenant.
- Passwords are securely hashed.
- All request bodies are validated with Zod schemas.

---

## Quickstart

1. Install dependencies: `npm install`
2. Set up `.env` with your Postgres connection and JWT secret.
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm run build && npm start`
5. Use the above demo data with Postman, curl, or the provided checklist script.

---

## Contact

For questions or issues, contact the maintainer.
