<div align="center">

# 📚 LIBRELLO
### *The Next-Generation AI-Augmented Library Logistics & Circulation Platform*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <b>A unified, intelligent library management ecosystem blending physical book circulation with autonomous multi-provider AI agents, computer vision book intake, real-time logistics tracking, and enterprise-grade role-based access control.</b>
</p>

[✨ Key Features](#-key-features) • [🏛️ System Architecture](#️-system-architecture) • [🤖 Multi-Provider AI Engine](#-multi-provider-ai-engine) • [🚀 Quick Start](#-quick-start) • [📡 API Reference](#-api-reference) • [📊 Data Model](#-data-model) • [🚢 Deployment](#-deployment)

---

</div>

## 🌟 Executive Overview

**Librello** bridges the gap between traditional catalog management and modern intelligent web applications. Designed for public libraries, academic institutions, and modern private book clubs, Librello automates book discovery, physical circulation workflows, inventory tracking, and payment logistics through a hyper-responsive frontend and an AI-augmented backend cascade engine.

### Why Librello?

- **⚡ Blazing Fast Architecture**: Powered by Next.js 16 (App Router), React 19, Lenis smooth scrolling, and Tailwind CSS v4 + DaisyUI for cinematic performance and fluid interactions.
- **🧠 Autonomous Multi-Provider AI Cascade**: Resilient multi-LLM engine leveraging **Groq**, **Google Gemini**, **OpenRouter**, and **Mistral** with dynamic fallback, automated rate-limit recovery, and quota protection.
- **📷 Multimodal AI Cataloging**: Instant optical book recognition — scan cover art or spine images to automatically extract Title, Author, Genre, and Description.
- **🎭 Mood-Based Semantic Discovery**: Readers can discover literature by describing emotional states, story atmospheres, or nuanced thematic vibes rather than traditional keywords.
- **💳 Integrated Financial Rails**: Native **Stripe** checkout workflows for security deposits, membership tiers, and circulation fees.
- **🛡️ 3-Tier Enterprise RBAC**: Tailored command dashboards for **Admins**, **Librarians**, and **Readers**.

---

## 🏛️ System Architecture

Librello is engineered as a decoupled, high-throughput monorepo architecture connecting modern client-side rendering with serverless-ready microservices and relational data stores.

```mermaid
flowchart TB
    subgraph Clients ["Client Layer (Librello Frontend)"]
        A[Next.js 16 / React 19 Client] -->|Smooth Scroll & HeroUI| B[Reader Dashboard]
        A -->|Inventory & Deliveries| C[Librarian Studio]
        A -->|Platform Analytics & RBAC| D[Admin Command Center]
        A -->|Conversational Agent| E[BiblioBot Widget]
    end

    subgraph SecurityGateway ["Security & Identity Gateway"]
        F[Firebase Auth] <-->|OAuth / Identity Tokens| A
        G[JWT Session Verification & RBAC Middleware] <--> A
    end

    subgraph CoreBackend ["API Engine (Librello Backend)"]
        H[Express 4.21 TypeScript Server]
        G --> H
        H --> I[Circulation & Delivery State Machine]
        H --> J[Stripe Payment Engine]
        H --> K[Nodemailer Dispatcher]
    end

    subgraph IntelligenceLayer ["Multi-Provider AI Cascade Engine"]
        H --> L{AI Resilience Cascade Router}
        L -->|Tier 1: Ultra Fast| M[Groq LLaMA 3.3 / 3.1]
        L -->|Tier 2: Multimodal & Reasoning| N[Google Gemini 1.5 Pro / Flash]
        L -->|Tier 3: Multi-Model Gateway| O[OpenRouter API]
        L -->|Tier 4: European LLM High Availability| P[Mistral AI]
    end

    subgraph DataStore ["Data & Persistence Layer"]
        H --> Q[Prisma 5.22 ORM]
        Q --> R[(PostgreSQL Database)]
    end
```

---

## ✨ Key Features

### 1. 🤖 Intelligent AI Capabilities
* **BiblioBot AI Concierge**: Built-in 24/7 literary companion providing personalized recommendations, discussion points, and reading advice.
* **Smart OCR Cover Scanner**: Librarians upload book cover images; computer vision models extract title, author, synopsis, and suggested category in seconds.
* **Deep Book Insights Engine**: On-demand thematic breakdown, reading difficulty assessments, core motifs, and target audience identification for every cataloged title.
* **Semantic & Mood-Based Book Search**: Queries like *"a rainy autumn afternoon mystery with melancholy undertones"* yield semantically relevant titles using embedding-informed matching.

### 2. 👥 Role-Based Portals & Dashboards

| Role | Dedicated Capabilities |
| :--- | :--- |
| **👑 Administrator** | • Global analytics: circulation volume, active readers, category trends via Recharts<br>• User role governance (promote/demote user, librarian, admin)<br>• Book review & approval workflow (approve/reject catalog submissions)<br>• System-wide financial logs and Stripe transaction audits |
| **📖 Librarian** | • Catalog management with AI Cover Scanner auto-fill<br>• Inventory tracking (stock counter, status toggle, pricing)<br>• Circulation fulfillment pipeline: `Pending` ➔ `Delivered` ➔ `Returned`<br>• Real-time dispatch oversight with reader contact integration |
| **🎓 Reader / User** | • Faceted exploration: categories, availability, pricing, rating filters<br>• Book reservation with instant Stripe checkout<br>• Personal circulation ledger: active borrowings, return deadlines, payment slips<br>• Community reviews & 5-star rating submissions<br>• Interactive reading assistant (BiblioBot) |

### 3. 📦 Delivery & Circulation State Machine
Books transition through a deterministic lifecycle:
$$\text{Catalog Draft} \xrightarrow{\text{Admin Review}} \text{Published} \xrightarrow{\text{Reader Request + Payment}} \text{Pending Delivery} \xrightarrow{\text{Librarian Dispatch}} \text{Delivered} \xrightarrow{\text{Reader Return}} \text{Returned / Restocked}$$

---

## 🤖 Multi-Provider AI Engine

Librello features an enterprise-grade AI Cascade Router (`aiService.ts`) built to ensure 99.99% uptime for AI requests. If an API provider experiences rate limits, quota depletion, or latency spikes, the engine dynamically fails over to the next configured provider without interrupting user sessions.

```
       [ Incoming AI Request ]
                  │
         ┌────────▼────────┐
         │  Groq (Fast)   │───(Success)───► [ Return Response ]
         └────────┬────────┘
                  │ (429 Rate Limit / Quota Exhausted)
         ┌────────▼────────┐
         │  Google Gemini  │───(Success)───► [ Return Response ]
         └────────┬────────┘
                  │ (Provider Overload / Timeout)
         ┌────────▼────────┐
         │   OpenRouter    │───(Success)───► [ Return Response ]
         └────────┬────────┘
                  │ (Failed)
         ┌────────▼────────┐
         │   Mistral AI    │───(Success)───► [ Return Response ]
         └─────────────────┘
```

---

## 🛠️ Technology Stack Matrix

### Client Architecture (`Librello frontend`)
* **Framework**: Next.js 16 (App Router) with React 19
* **Styling**: Tailwind CSS v4, DaisyUI v5, HeroUI (`@heroui/react`)
* **Animations**: Framer Motion, Lenis Smooth Scroll, Swiper Carousel
* **Data Visualization**: Recharts (circulation, revenue, category trends)
* **Icons & Feedback**: Lucide React, Gravity UI, Sonner, React Toastify
* **Authentication & Payments**: Firebase Client SDK, Stripe Elements

### Server Architecture (`Librello backend`)
* **Runtime & Language**: Node.js 20+, TypeScript, TSX runtime
* **API Framework**: Express 4.21
* **ORM & Database**: Prisma 5.22, PostgreSQL (hosted on Supabase, Neon, or Docker)
* **Security & Tokens**: JWT (JSON Web Tokens), Cookie-Parser, CORS policies
* **Communications**: Nodemailer (Gmail SMTP integration)
* **Containerization**: Alpine-based Docker multi-stage containers

---

## 📁 Repository Directory Structure

```text
Librello/
├── README.md                          # 📘 Master Unified Documentation (Root)
│
├── Librello backend/                  # ⚙️ Express + TypeScript + Prisma Engine
│   ├── api/                           # Vercel serverless functions wrapper
│   ├── prisma/
│   │   ├── schema.prisma              # Data models: User, Session, Book, Comment, Payment
│   │   └── seed.ts                    # Database seeder with sample books & credentials
│   ├── aiService.ts                   # Multi-provider AI cascade router
│   ├── db.ts                          # Database connection pool & Prisma initialization
│   ├── index.ts                       # Main Express application & API route handlers
│   ├── Dockerfile                     # Containerization manifest for backend
│   ├── vercel.json                    # Vercel deployment configuration
│   ├── package.json                   # Backend dependencies & script definitions
│   └── .env.example                   # Backend environment template
│
└── Librello frontend/                 # 💻 Next.js 16 + React 19 + Tailwind Client
    ├── public/                        # Static assets, branding, and images
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/                # Signin & Signup pages
    │   │   ├── (dashboard)/           # Role-based dashboards: Admin, Librarian, User
    │   │   ├── (main)/                # Homepage, Book catalog, Book details ([id])
    │   │   ├── pricing/               # Checkout & Payment success callbacks
    │   │   └── api/                   # Next.js BFF endpoints (AI, Auth, Payments)
    │   ├── components/
    │   │   ├── auth/                  # Authentication modals & forms
    │   │   ├── layout/                # Navbar, Footer, Sidebar, Navigation
    │   │   └── modules/
    │   │       ├── ai/                # BiblioBot floating conversational agent
    │   │       ├── books/             # AllBooks, BookDetails, AIInsightsCard, Filters
    │   │       ├── dashboard/         # Analytics charts, tables, order tracking
    │   │       └── home/              # Banner, HeroMarquee, FeaturedBooks, TopLibrarians
    │   ├── lib/                       # Utility helpers, Stripe configs, Firebase client
    │   ├── providers/                 # Theme, Auth, and Context Providers
    │   └── types/                     # TypeScript definitions
    ├── Dockerfile                     # Containerization manifest for frontend
    ├── next.config.mjs                # Next.js runtime configurations
    ├── package.json                   # Frontend dependencies & script definitions
    └── .env.example                   # Frontend environment template
```

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm** or **pnpm**
* **PostgreSQL** instance (local, Supabase, Neon, or Docker)
* **Firebase Project** (for client authentication)
* **Stripe Account** (for test payment processing)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/nabilpwqz/Librello-backend.git "Librello backend"
git clone https://github.com/nabilpwqz/Librello-frontend.git "Librello frontend"
```

---

### Step 2: Configure & Start the Backend

1. **Navigate to the backend directory**:
   ```bash
   cd "Librello backend"
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file based on `.env.example`:
   ```ini
   PORT=8000
   NODE_ENV=development
   CLIENT_URI=http://localhost:3000

   # PostgreSQL connection string
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/librello?schema=public"

   # JWT secret for access tokens
   JWT_SECRET=super_secret_librello_jwt_key_2026

   # Nodemailer credentials for delivery notifications
   USER_EMAIL=notifications@librello.io
   USER_PASSWORD=your_app_password

   # Multi-Provider AI Cascade API Keys (Provide any or all)
   GROQ_API_KEY=gsk_...
   GEMINI_API_KEY=AIzaSy...
   OPENROUTER_API_KEY=sk-or-v1-...
   MISTRAL_API_KEY=...
   ```

3. **Initialize the Database**:
   ```bash
   # Push Prisma schema to your database
   npm run prisma:push

   # Generate Prisma client
   npm run prisma:generate

   # (Optional) Seed the database with demo users, librarians, and catalog books
   npm run prisma:seed
   ```

4. **Launch the Backend**:
   ```bash
   npm run dev
   ```
   > 📡 Backend server will be active at: `http://localhost:8000`  
   > 🩺 Health Check: `http://localhost:8000/health`

---

### Step 3: Configure & Start the Frontend

1. **Open a new terminal and navigate to the frontend**:
   ```bash
   cd "Librello frontend"
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file based on `.env.example`:
   ```ini
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Image Upload Hosting (Optional for book covers)
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key

   # Stripe Secret Key
   STRIPE_SECRET_KEY=sk_test_...

   # Firebase Client Credentials
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=librello-demo.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=librello-demo
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=librello-demo.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
   ```

3. **Launch the Frontend**:
   ```bash
   npm run dev
   ```
   > 🌐 Client application will be running at: `http://localhost:3000`

---

## 🔑 Demo Seed Accounts

When you run `npm run prisma:seed`, the database is pre-populated with initial accounts:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Master Admin** | `admin@librello.io` | *(Firebase Auth / OAuth)* | Full platform administration, approvals, user roles, revenue analytics |
| **Head Curator** | `librarian@librello.io` | *(Firebase Auth / OAuth)* | Book inventory management, AI cover scanning, dispatch workflows |
| **Reader** | `reader@librello.io` | *(Firebase Auth / OAuth)* | Borrowing, reviews, AI assistant, payment history |

> [!TIP]
> You can also register any new user through the frontend interface. Admins can elevate any user to `librarian` or `admin` directly in the Admin Command Center (`/dashboard/admin/users`).

---

## 🐳 Docker Deployment

Both services include optimized Dockerfiles for zero-friction containerized deployment.

### Run with Docker Compose
Create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: librello_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: librello
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./Librello backend
    container_name: librello_backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: "postgresql://postgres:password@db:5432/librello?schema=public"
      PORT: 8000
      CLIENT_URI: "http://localhost:3000"
      JWT_SECRET: "librello_docker_jwt_key_2026"
    depends_on:
      - db

  frontend:
    build: ./Librello frontend
    container_name: librello_frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Launch all services:
```bash
docker-compose up --build
```

---

## 📡 API Reference

### 🔐 Authentication & Users
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/sync` | Public | Upsert Firebase user session & generate JWT |
| `GET` | `/api/users` | Admin | Retrieve paginated system user directory |
| `PATCH` | `/api/users/updateRole/:id` | Admin | Update user role (`user`, `librarian`, `admin`) |
| `DELETE` | `/api/users/delete/:id` | Admin | Soft/Hard delete user profile from platform |

### 📚 Catalog & Book Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books/publishedBooks` | Public | Retrieve published catalog with filtering & search |
| `GET` | `/api/books/details/:id` | Public | Get in-depth book information & reader reviews |
| `POST` | `/api/books` | Librarian/Admin | Create new book entry in catalog |
| `GET` | `/api/books` | Librarian | Fetch books managed by the logged-in librarian |
| `PATCH` | `/api/books/edit/:id` | Librarian/Admin | Modify book metadata, stock level, or fees |
| `DELETE` | `/api/books/delete/:id` | Librarian/Admin | Remove a title from the catalog |
| `GET` | `/api/books/pendingBooks` | Admin | View books awaiting administrative approval |
| `PATCH` | `/api/books/approveStatus/:id`| Admin | Approve or reject a submitted catalog entry |

### 💳 Logistics & Circulation
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments` | User | Process borrow request, create transaction & decrement stock |
| `GET` | `/api/payments` | Admin | View all platform-wide transaction records |
| `GET` | `/api/payments/user/:email` | User | Retrieve current user's borrowing history |
| `GET` | `/api/payments/librarian/:email`| Librarian | View circulation requests for managed books |
| `PATCH` | `/api/payments/updateStatus/:id`| Librarian | Update delivery lifecycle (`Pending` ➔ `Delivered`) |
| `PATCH` | `/api/payments/return/:id` | User/Librarian | Mark book as returned and increment available stock |

### 🤖 Multimodal AI Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Public / User | Conversational interaction with BiblioBot |
| `POST` | `/api/ai/scan-cover` | Librarian | OCR vision scan of book cover to auto-fill metadata |
| `POST` | `/api/ai/book-insights` | Public / User | Synthesize literary summary, themes, & analysis |
| `POST` | `/api/ai/semantic-search` | Public / User | Semantic & mood-informed catalog search |

---

## 📊 Data Model (Prisma Schema)

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │      Book       │       │     Payment     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │1     *│ id (PK)         │1     *│ id (PK)         │
│ uid (Unique)    ├───────┤ title           ├───────┤ transactionId   │
│ email (Unique)  │       │ author          │       │ bookId (FK)     │
│ name            │       │ category        │       │ userId (FK)     │
│ role            │       │ fee             │       │ amount          │
│ status          │       │ status          │       │ status          │
│ image           │       │ stock           │       │ deliveryStatus  │
│ createdAt       │       │ librarianId     │       │ returnDate      │
└────────┬────────┘       └────────┬────────┘       └─────────────────┘
         │1                        │1
         │*                        │*
┌────────▼────────┐       ┌────────▼────────┐
│     Session     │       │     Comment     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ token (Unique)  │       │ bookId (FK)     │
│ userId (FK)     │       │ userId (FK)     │
│ expiresAt       │       │ rating          │
└─────────────────┘       │ comment         │
                          └─────────────────┘
```

---

## 🚢 Production Deployment

### 1. Deploying Backend to Vercel / Railway / Render
* Ensure `DATABASE_URL` is configured in environment variables.
* The backend contains `vercel.json` and `api/index.ts` allowing effortless deployment to Vercel Serverless Functions.
* Build Command: `npm run build`
* Start Command: `npm run start`

### 2. Deploying Frontend to Vercel
* Connect the `Librello frontend` repository to [Vercel](https://vercel.com/).
* Set Root Directory to `Librello frontend` (if hosted in a monorepo).
* Set `NEXT_PUBLIC_API_BASE_URL` to your production backend URL.
* Set all `NEXT_PUBLIC_FIREBASE_*` and `STRIPE_SECRET_KEY` variables.

---

## 🛡️ Security & Resilience Best Practices

* **Input Sanitization & Limits**: Request body size is strictly limited to prevent payload flooding; URL parameters and IDs are validated via ObjectId/CUID formats.
* **CORS Dynamic Origins**: Whitelisted origins with preflight `OPTIONS` fast-pathing to eliminate middleware latency.
* **Database Connection Pooling**: Optimized Prisma client connection reuse ensuring zero connection exhaustion in high-concurrency environments.
* **Multi-Provider AI Fallback**: Resilient cascading preventing downstream outages if an individual LLM provider is throttled.

---

## 🤝 Contributing

Contributions to Librello are warmly welcomed! Please adhere to the following workflow:

1. **Fork the Repository**
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Your Changes**:
   ```bash
   git commit -m "feat: add amazing new circulation feature"
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to use, modify, and distribute for commercial or non-commercial applications.

<div align="center">

---

Built with ❤️ by **[S Sindid Ahmed Nabil](https://github.com/nabilpwqz)** for modern readers and curators worldwide.

⭐ **If you find Librello inspiring, please consider starring the repository!**

</div>
