<div align="center">

<br/>

<img src="https://img.shields.io/badge/-%F0%9F%9B%A1%EF%B8%8F%20Smart%20Compliance%20Tracking-6366f1?style=for-the-badge&labelColor=0f172a" alt="Smart Compliance" height="40"/>

# Smart Compliance Deviation Tracking System

**An enterprise-grade, full-stack compliance and quality management platform. Track deviations, manage CAPAs, version SOPs, and schedule audits — all in one beautifully designed system.**

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_5-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express_4-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma_5-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup & Seeding](#database-setup--seeding)
- [Running the Application](#-running-the-application)
  - [Backend Server](#backend-server)
  - [Frontend Server](#frontend-server)
  - [Running Both Simultaneously](#running-both-simultaneously)
- [Viewing the Database](#-viewing-the-database)
  - [Prisma Studio (Recommended)](#prisma-studio-recommended)
  - [DB Browser for SQLite](#db-browser-for-sqlite)
  - [SQLite CLI](#sqlite-cli)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [Demo Credentials](#-demo-credentials)
- [UI Screens](#-ui-screens)
- [Modules](#-modules)

---

## 🌐 Overview

The **Smart Compliance Deviation Tracking System** solves the critical problem of tracking compliance deviations, corrective actions (CAPAs), standard operating procedures (SOPs), and internal audits in regulated industries. Built as a full-stack TypeScript monorepo, it provides real-time dashboards, role-based workflows, and a fully versioned document management system.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login with token-based sessions; all API routes are protected |
| 👥 **Role-Based Access Control** | 5 distinct roles — Admin, Compliance Manager, Process Owner, Auditor, Employee |
| 📄 **SOP Management** | Create, version, edit, and delete Standard Operating Procedures |
| ⚠️ **Deviation Tracking** | Log and monitor compliance deviations with severity levels (Low/Medium/High/Critical) |
| ✅ **CAPA Workflows** | Assign Corrective & Preventive Actions with deadlines, owners, and status tracking |
| 🔍 **Audit Management** | Schedule and track internal audits with department-level assignment |
| 📊 **Live Dashboard** | Real-time compliance score gauge, severity distribution charts, open deviation counts |
| 🎨 **Premium UI** | Dark sidebar, gradient accents, card-based layouts, color-coded status pills |
| 💾 **Data Persistence** | All data stored in SQLite via Prisma ORM — no external database required to run locally |
| 🧰 **Prisma Studio** | Built-in visual database browser at `localhost:5555` |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component library |
| Vite | 5 | Build tool & dev server |
| TypeScript | 5.9 | Type-safe development |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 7 | Client-side routing |
| TanStack Query | 5 | Server state, caching, mutations |
| Zustand | 5 | Global auth state management |
| Axios | 1.x | HTTP client with interceptors |
| Recharts | 3 | Dashboard charts and graphs |
| Lucide React | 0.577 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 4 | HTTP server framework |
| TypeScript | 5.4 | Type-safe server code |
| Prisma ORM | 5 | Database access layer |
| SQLite | — | Embedded database (file-based, zero setup) |
| JSON Web Tokens | 9 | Auth token issuance and verification |
| bcryptjs | 2 | Password hashing |
| Zod | 3 | Request body validation |
| Helmet | 7 | HTTP security headers |
| CORS | 2 | Cross-origin policy management |
| tsx | 4 | TypeScript execution (dev mode) |

---

## 📂 Project Architecture

```text
📦 Smart-Compliance-Deviation-Tracking-System/
 ┣ 📂 backend/
 ┃ ┣ 📂 prisma/
 ┃ ┃ ┣ 📜 schema.prisma          # All model definitions
 ┃ ┃ ┗ 📜 dev.db                 # SQLite database file (auto-generated)
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 controllers/           # Business logic per module
 ┃ ┃ ┃ ┣ 📜 auth.controller.ts
 ┃ ┃ ┃ ┣ 📜 sop.controller.ts
 ┃ ┃ ┃ ┣ 📜 deviation.controller.ts
 ┃ ┃ ┃ ┣ 📜 capa.controller.ts
 ┃ ┃ ┃ ┗ 📜 audit.controller.ts
 ┃ ┃ ┣ 📂 routes/                # Express routers per module
 ┃ ┃ ┣ 📂 middleware/
 ┃ ┃ ┃ ┗ 📜 auth.ts              # JWT verification + role guards
 ┃ ┃ ┣ 📜 prisma.ts              # Singleton Prisma client
 ┃ ┃ ┣ 📜 app.ts                 # Express app entry point
 ┃ ┃ ┗ 📜 seed.ts                # Database seeding script
 ┃ ┣ 📜 .env                     # Environment variables (local only)
 ┃ ┣ 📜 package.json
 ┃ ┗ 📜 tsconfig.json
 ┣ 📂 frontend/
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 components/ui/         # Reusable UI components (Button, Card, Modal, Badge…)
 ┃ ┃ ┣ 📂 layouts/
 ┃ ┃ ┃ ┣ 📜 AppLayout.tsx        # Main app shell (topbar + sidebar + outlet)
 ┃ ┃ ┃ ┗ 📜 Sidebar.tsx          # Dark navigation sidebar with role badge
 ┃ ┃ ┣ 📂 pages/
 ┃ ┃ ┃ ┣ 📜 Login.tsx            # Split-panel login with demo credentials
 ┃ ┃ ┃ ┣ 📜 Register.tsx
 ┃ ┃ ┃ ┣ 📜 Dashboard.tsx        # Analytics, charts, compliance score
 ┃ ┃ ┃ ┣ 📜 SOPs.tsx             # SOP document list with versioning
 ┃ ┃ ┃ ┣ 📜 Deviations.tsx       # Issue tracker view
 ┃ ┃ ┃ ┣ 📜 CAPAs.tsx            # Corrective action cards
 ┃ ┃ ┃ ┗ 📜 Audits.tsx           # Audit table with status
 ┃ ┃ ┣ 📂 store/
 ┃ ┃ ┃ ┗ 📜 authStore.ts         # Zustand auth store (token + user)
 ┃ ┃ ┣ 📂 lib/
 ┃ ┃ ┃ ┗ 📜 axios.ts             # Axios instance with JWT interceptor + 401 handler
 ┃ ┃ ┣ 📜 App.tsx                # Route definitions
 ┃ ┃ ┣ 📜 main.tsx               # React app entry point
 ┃ ┃ ┗ 📜 index.css              # Global styles + design tokens
 ┃ ┣ 📜 vite.config.ts           # Vite config with /api proxy to :3001
 ┃ ┗ 📜 package.json
 ┗ 📜 README.md
```

---

## 🗄️ Database Schema

The application uses **SQLite** (a single file `backend/prisma/dev.db`) managed by **Prisma ORM**.

```
User ──────┬──── SOP (via createdById)
           ├──── Deviation (via reportedById)
           ├──── CAPA (via ownerId)
           ├──── Audit (via auditorId)
           ├──── Comment (via authorId)
           └──── ActivityLog (via userId)

SOP ───────┬──── SOPVersion (1:many — content versions)
           └──── Deviation (1:many — linked deviations)

Deviation ─┬──── CAPA (1:many)
           └──── AuditFinding (1:many)

Audit ─────└──── AuditFinding (1:many)
```

### Models Summary

| Model | Description |
|---|---|
| `User` | System users with role assignment |
| `SOP` | Standard Operating Procedure header |
| `SOPVersion` | Versioned content for each SOP |
| `Deviation` | Compliance deviation report |
| `Capa` | Corrective/Preventive Action for a deviation |
| `Audit` | Internal audit session |
| `AuditFinding` | Finding linked to an audit and/or deviation |
| `Comment` | Comments on any entity (deviation, CAPA, audit) |
| `Notification` | Per-user notification records |
| `ActivityLog` | Full audit trail of all user actions |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/en/download)
- **npm** v9 or later (bundled with Node.js)
- No database server required — SQLite runs as an embedded file

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abizer007/Smart-Compliance-Deviation-Tracking-System.git
   cd Smart-Compliance-Deviation-Tracking-System
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

The backend requires a `.env` file at `backend/.env`. This file is already included in the repository with default local values:

```env
# backend/.env
PORT=3001
JWT_SECRET=super_secret_jwt_key_for_compliance_dev
DATABASE_URL="file:./dev.db"
```

> ⚠️ **Production note:** Change `JWT_SECRET` to a long, random string before deploying.

### Database Setup & Seeding

From inside the `backend/` directory:

**Step 1 — Push the schema to create the SQLite database:**
```bash
cd backend
npx prisma db push
```
This creates `backend/prisma/dev.db` from `schema.prisma`.

**Step 2 — Seed with demo users and sample data:**
```bash
npm run seed
```

The seed script creates the following data:

| Type | Details |
|---|---|
| Users | `admin@compliance.com`, `manager@compliance.com`, `employee@compliance.com`, `auditor@compliance.com` — all with password `password123` |
| SOPs | 1 sample SOP: "Safety Data Handling" (IT department) |
| Deviations | 2 deviations — one with CAPA assigned, one freshly reported |
| CAPAs | 1 CAPA linked to the encrypted backup drive deviation |
| Audits | 1 "Q4 Annual IT Audit" in progress |

> ⚠️ The seed script **clears all existing data** before inserting. Only run it on a fresh or development database.

---

## ▶️ Running the Application

### Backend Server

```bash
cd backend
npm run dev
```

- Starts **Express + TypeScript** backend using `tsx watch` (auto-restarts on file changes)
- Runs on: **http://localhost:3001**
- Logs: `Server listening on port 3001`

### Frontend Server

```bash
cd frontend
npm run dev
```

- Starts the **Vite** dev server with HMR (Hot Module Replacement)
- Runs on: **http://localhost:5173**
- All `/api/*` requests are **automatically proxied** to `http://localhost:3001` — no CORS issues

### Running Both Simultaneously

Open two separate terminal windows/tabs:

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

Then open your browser at **http://localhost:5173** 🎉

---

## 🗃️ Viewing the Database

### Prisma Studio (Recommended)

Prisma Studio is a visual database browser built into Prisma. It requires no installation beyond the project's existing dependencies.

```bash
cd backend
.\node_modules\.bin\prisma studio --schema=./prisma/schema.prisma
```

Then open: **http://localhost:5555**

You will see a full table browser with all models. You can:
- Browse all records across every table
- Filter, sort, and paginate rows
- Edit cell values directly in the browser
- Add or delete records

> 💡 Keep the backend server running alongside Prisma Studio — they can run on different ports simultaneously.

### DB Browser for SQLite

A free, open-source GUI for SQLite:

1. Download from **https://sqlitebrowser.org/dl/**
2. Install and open the application
3. Click **"Open Database"** and browse to:
   ```
   d:\Smart-Compliance-Deviation-Tracking-System\backend\prisma\dev.db
   ```
4. Use the **"Browse Data"** tab to view all tables

### SQLite CLI

For terminal-based inspection:

```bash
sqlite3 backend\prisma\dev.db
```

Useful commands:
```sql
.tables                    -- list all tables
.schema User               -- view the User table schema
SELECT * FROM User;        -- view all users
SELECT * FROM Deviation;   -- view all deviations
SELECT * FROM CAPA;        -- view all CAPAs
.quit                      -- exit
```

---

## 📡 API Reference

All API routes are prefixed with `/api` (via Vite proxy) or accessible at `http://localhost:3001` directly.

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | None | Register a new user |
| `POST` | `/auth/login` | None | Login and receive JWT |
| `GET` | `/auth/users` | ✅ JWT | List all users (for dropdowns) |

### SOPs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/sop` | ✅ JWT | List all SOPs with latest version |
| `GET` | `/sop/:id` | ✅ JWT | Get a single SOP with all versions |
| `POST` | `/sop` | ✅ Manager+ | Create a new SOP |
| `POST` | `/sop/:id/versions` | ✅ Manager+ | Add a new version to an SOP |
| `DELETE` | `/sop/:id` | ✅ Manager+ | Delete an SOP and all its versions |

### Deviations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/deviation` | ✅ JWT | List all deviations |
| `GET` | `/deviation/:id` | ✅ JWT | Get single deviation |
| `POST` | `/deviation` | ✅ JWT | Report a new deviation |
| `PATCH` | `/deviation/:id/status` | ✅ JWT | Update deviation status |

### CAPAs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/capa` | ✅ JWT | List all CAPAs with deviation info |
| `GET` | `/capa/:id` | ✅ JWT | Get a single CAPA |
| `POST` | `/capa` | ✅ JWT | Create a new CAPA (auto-updates deviation status) |
| `PATCH` | `/capa/:id/status` | ✅ JWT | Update CAPA status |

### Audits
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/audit` | ✅ JWT | List all audits |
| `POST` | `/audit` | ✅ Auditor+ | Schedule a new audit |
| `PATCH` | `/audit/:id/status` | ✅ Auditor+ | Update audit status |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/analytics` | ✅ JWT | Dashboard summary: compliance score, open deviations, pending CAPAs, audit count, severity breakdown |

---

## 🔑 Role-Based Access Control

| Role | Description | Permissions |
|---|---|---|
| `EMPLOYEE` | Regular staff members | Report deviations, view SOPs |
| `PROCESS_OWNER` | Owns specific processes | All employee rights + create/manage SOPs |
| `COMPLIANCE_MANAGER` | Manages the compliance program | All process owner rights + manage CAPAs |
| `AUDITOR` | Performs internal audits | View everything + schedule/manage audits |
| `ADMIN` | Full system access | All rights across all modules |

JWT tokens are issued at login and verified by the `authenticateToken` middleware on every protected route. Role enforcement uses the `requireRole([...])` middleware.

---

## 🎭 Demo Credentials

After running `npm run seed`, the following accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@compliance.com` | `password123` |
| Compliance Manager | `manager@compliance.com` | `password123` |
| Employee | `employee@compliance.com` | `password123` |
| Auditor | `auditor@compliance.com` | `password123` |

> 💡 On the **Login page**, click any email address in the **Demo Credentials** box to auto-fill the form.

---

## 🎨 UI Screens

The application features a premium, enterprise-grade UI built with Tailwind CSS:

```
Login          → Split-panel: dark branding panel + form with icon inputs + demo credentials
Dashboard      → Stat cards (compliance score gauge, deviations, CAPAs, audits) + bar/donut charts
SOPs           → GitHub-style document list with dept chips, version badges, edit/delete actions
Deviations     → Issue tracker with open/closed tabs, severity pills, monospaced ID chips
CAPAs          → Card grid with status icons, overdue date highlights, owner avatars
Audits         → Data table with dept chips, auditor avatars, status pills
```

### Design Highlights
- **Dark sidebar** with gradient shield logo and role badge
- **Personalized topbar** with greeting, live date, and notification bell
- **Color-coded severity** system: Critical (purple), High (red), Medium (amber), Low (green)
- **Status pills** with icons indicating workflow state
- **Shimmer loading** states while data is fetching
- **Fade-slide-up** animation on page entry

---

## 📦 Modules

### SOP Management
Standard Operating Procedures are the foundation of compliance. Each SOP supports:
- Creating with an initial content version (Markdown)
- Editing — each edit creates a new **versioned snapshot** (v1, v2, v3…)
- Deleting — safely removes all versions first
- Linking to reported deviations

### Deviation Tracking
Log compliance deviations with:
- **Severity levels:** Low → Medium → High → Critical
- **Status lifecycle:** `REPORTED` → `UNDER_REVIEW` → `CAPA_ASSIGNED` → `RESOLVED` → `CLOSED`
- **Optional SOP link** to trace which procedure was violated
- Timestamps and reporter attribution

### CAPA Workflows
Each CAPA is linked to a deviation and includes:
- **Action description** — what corrective step must be taken
- **Owner assignment** — which user is responsible
- **Deadline** — with overdue highlighting in the UI
- Automatically updates parent deviation status to `CAPA_ASSIGNED`
- Date validation on both frontend and backend to prevent `500` errors

### Audit Management
Internal audits include:
- **Department scope** — which department is being audited
- **Assigned auditor** — a user with `AUDITOR` or `ADMIN` role
- **Status:** `SCHEDULED` → `IN_PROGRESS` → `COMPLETED`
- **Audit Findings** — linkable to specific deviations

### Analytics Dashboard
The dashboard computes in real-time:
- **Compliance Score** — derived from ratio of resolved vs. open deviations
- **Open Deviations** count vs. total
- **Pending CAPAs** count
- **Total Audits** count
- **Deviation breakdown by severity** (bar chart + donut chart)

---

<div align="center">

---

**Engineered for Quality, Built for Compliance.**

*Smart Compliance Deviation Tracking System — © 2026 abizer007*

</div>