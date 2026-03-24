# Multi-Tenant Issue Tracker

A modern, secure, and scalable issue tracking application designed for multi-tenant SaaS environments. Each company (tenant) has complete data isolation, ensuring privacy and compliance.

## 🚀 Live Links

- **Frontend**: [https://multi-tenant-issue-tracker-nine.vercel.app](https://multi-tenant-issue-tracker-nine.vercel.app)
- **Backend API**: [https://multi-tenant-issue-tracker-production.up.railway.app](https://multi-tenant-issue-tracker-production.up.railway.app)

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Demo Credentials](#demo-credentials)
- [API Documentation](#api-documentation)
- [Development](#development)

---

## 🎯 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your DATABASE_URL and JWT_SECRET
npm run db:push
npm run seed
npm run dev
```

#### Frontend

```bash
cd next-app
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

---

## ✨ Features

### User Management

- ✅ User registration with tenant slug
- ✅ Secure login/logout with JWT
- ✅ Password hashing with bcrypt
- ✅ httpOnly cookie-based sessions

### Issue Tracking

- ✅ Create issues with title, description, and priority
- ✅ Update issue status (OPEN, IN_PROGRESS, CLOSED)
- ✅ Filter issues by priority (LOW, MEDIUM, HIGH)
- ✅ View issue details with creator information
- ✅ Delete issues (with authorization)

### Multi-Tenancy

- ✅ Complete data isolation by tenant
- ✅ Multiple demo tenants (Acme, Globex, Initech)
- ✅ No data leakage between tenants
- ✅ Tenant-aware database queries

### UI/UX

- ✅ Modern, responsive design
- ✅ Dark mode support
- ✅ Accessible components (shadcn/ui)
- ✅ Form validation and error handling

---
## 🛠️ Tech Stack
### Frontend

| Technology         | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| **Next.js 16**     | React framework with SSR and file-based routing |
| **React 19**       | UI library                                      |
| **TypeScript**     | Type-safe JavaScript                            |
| **Tailwind CSS 4** | Utility-first CSS framework                     |
| **shadcn/ui**      | Pre-built, accessible UI components             |
| **Lucide React**   | Icon library                                    |
| **next-themes**    | Dark mode support                               |

### Backend

| Technology             | Purpose                           |
| ---------------------- | --------------------------------- |
| **Node.js**            | JavaScript runtime                |
| **Express.js**         | Web application framework         |
| **TypeScript**         | Type-safe JavaScript              |
| **Prisma ORM**         | Database ORM with type generation |
| **PostgreSQL**         | Relational database               |
| **JWT (jsonwebtoken)** | Stateless authentication          |
| **bcrypt**             | Password hashing                  |
| **CORS**               | Cross-origin request handling     |

---
## 🔧 How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              Frontend (Next.js 16)                   │
│  - React 19, TypeScript, Tailwind CSS, shadcn UI    │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS Request
                     ↓
┌─────────────────────────────────────────────────────┐
│            Backend API (Express.js)                  │
│  - TypeScript, Prisma ORM, PostgreSQL               │
│  - JWT Authentication (httpOnly cookies)             │
└────────────────────┬────────────────────────────────┘
                     │ SQL Query
                     ↓
┌─────────────────────────────────────────────────────┐
│              PostgreSQL Database                     │
│  - Multi-tenant data model with tenant isolation    │
└─────────────────────────────────────────────────────┘
```

### Multi-Tenant Isolation

The core security model ensures complete data isolation:

1. **User Registration**: A user registers with an email, password, and **tenant slug** (company identifier)
2. **JWT Authentication**: Upon login, the server creates a JWT containing the user's `userId` and `tenantId`
3. **Cookie-Based Sessions**: The JWT is stored as an `httpOnly` cookie, automatically sent with each request
4. **Middleware Verification**: Every protected route verifies the JWT and attaches `req.user` to the request
5. **Database Filtering**: Every database query for issues is filtered by `tenantId` — users can **only see issues from their own tenant**

### Authentication Flow

```
1. User Registration
   └─> Register(email, password, tenantSlug)
       └─> Verify tenant exists → Hash password with bcrypt
           └─> Create user & tenant association
               └─> Return success

2. User Login
   └─> Login(email, password)
       └─> Verify credentials → Generate JWT with userId & tenantId
           └─> Set httpOnly cookie with JWT
               └─> Return user info

3. Protected Requests
   └─> Request with JWT cookie
       └─> Middleware verifies JWT → Attaches req.user
           └─> Route handler uses req.user.tenantId to filter data
               └─> Respond with tenant-isolated data
```

---


## 📁 Project Structure

```
multi-tenant-issue-tracker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema (Tenant, User, Issue)
│   │   ├── seed.ts            # Seed script with demo data
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── server.ts          # Express server setup
│   │   ├── lib/
│   │   │   └── prisma.ts      # Shared PrismaClient instance
│   │   ├── middleware/
│   │   │   └── auth.ts        # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── auth.ts        # Authentication endpoints
│   │   │   └── issues.ts      # Issue CRUD endpoints
│   │   ├── types/
│   │   │   └── express.d.ts   # Express request type extensions
│   │   └── generated/
│   │       └── prisma/        # Auto-generated Prisma types
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── next-app/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── issues/
│   │       ├── page.tsx       # Issues list
│   │       └── [id]/page.tsx  # Issue detail
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── issues/
│   │   │   ├── issue-detail.tsx
│   │   │   └── issues-page.tsx
│   │   ├── ui/                # shadcn UI components
│   │   └── theme-provider.tsx # Dark mode provider
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts            # Auth utilities
│   │   └── utils.ts           # Helper functions
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.mjs
│
└── README.md (this file)
```



---

## 🔐 Demo Credentials

Three demo tenants are pre-seeded with sample users and issues:

### Acme Corp

- **Tenant Slug**: `acme`
- **Email**: `alice@acme.com`
- **Password**: `password123`

### Globex Inc

- **Tenant Slug**: `globex`
- **Email**: `bob@globex.com`
- **Password**: `password123`

### Initech LLC

- **Tenant Slug**: `initech`
- **Email**: `carol@initech.com`
- **Password**: `password123`

Each tenant comes with sample issues at different statuses and priorities.

---

## 📚 API Documentation

For detailed API documentation including endpoint specifications, request/response examples, and database schema, see [Backend API Documentation](./backend/README.md).

### Quick API Overview

| Method     | Endpoint             | Description                      |
| ---------- | -------------------- | -------------------------------- |
| **POST**   | `/api/auth/register` | Register a new user              |
| **POST**   | `/api/auth/login`    | Login user                       |
| **POST**   | `/api/auth/logout`   | Logout user                      |
| **GET**    | `/api/issues`        | Get all issues (tenant-filtered) |
| **POST**   | `/api/issues`        | Create a new issue               |
| **PATCH**  | `/api/issues/:id`    | Update an issue                  |
| **DELETE** | `/api/issues/:id`    | Delete an issue                  |

All issue endpoints require JWT authentication.

---

## 💻 Development

### Running Locally

#### Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

#### Start Frontend

```bash
cd next-app
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Build for Production

#### Backend

```bash
cd backend
npm run build
```

#### Frontend

```bash
cd next-app
npm run build
npm start
```

### Database Management

#### Reset Database (Development Only)

```bash
cd backend
npx prisma migrate reset
```

#### View Database GUI

```bash
cd backend
npx prisma studio
```

### Type Generation

Generate TypeScript types from Prisma schema:

```bash
cd backend
npx prisma generate
```

---

## 🔒 Security Features

- **JWT Authentication**: Stateless, secure token-based authentication
- **httpOnly Cookies**: Prevents XSS attacks from accessing authentication tokens
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **CORS**: Properly configured to allow frontend requests
- **Tenant Isolation**: Every database query enforces tenant-based filtering
- **Type Safety**: Full TypeScript coverage prevents runtime errors

---

## 📊 Database Schema

```
Tenant
├─ id (String, UUID)
├─ name (String)
├─ slug (String, Unique)
└─ createdAt (DateTime)

User
├─ id (String, UUID)
├─ email (String, Unique)
├─ password (String, Hashed)
├─ tenantId (String, Foreign Key → Tenant)
└─ createdAt (DateTime)

Issue
├─ id (String, UUID)
├─ tenantId (String, Foreign Key → Tenant)
├─ createdById (String, Foreign Key → User)
├─ title (String)
├─ description (String)
├─ status (Enum: OPEN, IN_PROGRESS, CLOSED)
├─ priority (Enum: LOW, MEDIUM, HIGH)
├─ createdAt (DateTime)
└─ updatedAt (DateTime)
```

---

## 🚀 Deployment

### Frontend

Deployed on **Vercel**: [https://multi-tenant-issue-tracker-nine.vercel.app](https://multi-tenant-issue-tracker-nine.vercel.app)

### Backend

Deployed on **Railway**: [https://multi-tenant-issue-tracker-production.up.railway.app](https://multi-tenant-issue-tracker-production.up.railway.app)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

---

## 📧 Support

For issues or questions, please open an issue in the GitHub repository.
