<div align="center">

# 🛡️ Smart Compliance Deviation Tracking System 🛡️

**A modern, robust, full-stack compliance and quality management platform designed for scale. Seamlessly track deviations, manage CAPAs, oversee SOPs, and execute audits with precision.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---
</div>

## ✨ Key Features

- **🚀 Modern Tech Stack:** Built with a high-performance React + Vite frontend and a blazing fast Node.js + Express backend.
- **🔐 Role-Based Access Control:** Granular permissions and secure JWT-based authentication to manage Admin, Manager, and User roles safely.
- **📄 Comprehensive SOP Management:** Centralize your standard operating procedures with built-in versioning and acknowledgment tracking.
- **⚠️ Deviation Tracking:** Log, document, and manage operational deviations in real-time.
- **✅ CAPA Workflows:** Native Support for Corrective and Preventive Actions ensuring continuous process improvement.
- **🔍 Audit Ready:** Full audit trail logging for all critical operations to maintain impeccable compliance records.
- **📊 Premium Visual Analytics:** Beautiful, responsive dashboards built with Tailwind CSS, ShadCN, and Recharts.

## 📂 Architecture & Workspaces

The application utilizes a clean **NPM Workspaces** monorepo structure:

```text
📦 Smart-Compliance-Deviation-Tracking-System
 ┣ 📂 frontend         # React, Vite, Tailwind CSS, Zustand, React Query
 ┣ 📂 backend          # Node.js, Express, Prisma ORM, PostgreSQL, Zod
 ┣ 📂 shared           # Shared types, Zod schemas, and common utilities
 ┣ 📜 package.json     # Monorepo configuration
 ┗ 📜 README.md        # You are here!
```

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (Running and accessible)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abizer007/Smart-Compliance-Deviation-Tracking-System.git
   cd Smart-Compliance-Deviation-Tracking-System
   ```

2. **Install all dependencies:**
   This command installs dependencies for the root, frontend, backend, and shared workspaces.
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Navigate to the `backend` workspace and set up your `.env` file:
   ```bash
   cd backend
   cp .env.example .env
   # Ensure DATABASE_URL and JWT_SECRET are correctly configured
   ```

4. **Initialize Database:**
   Apply Prisma migrations and optionally seed the database.
   ```bash
   cd backend
   npx prisma migrate dev
   npm run seed
   ```

### 🚀 Running the Application

Start both the frontend and backend servers simultaneously from the root directory:

```bash
# In the root directory
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`

## 🎨 UI/UX Highlights

We heavily rely on [Tailwind CSS](https://tailwindcss.com/) combined with [ShadCN UI](https://ui.shadcn.com/) to build highly accessible, meticulously crafted, and visually spectacular interfaces. The UI incorporates dark mode support, fluid interactions, and detailed data typography to prevent cognitive overload.

---

<div align="center">
  <i>Engineered for Quality, Built for Compliance.</i>
</div>