# Intelligent Voicemail

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-25c2a0?logo=trpc)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Intelligent Voicemail** is an intelligent after-hours voicemail processing and triage system engineered for medical clinics. It bridges the gap between unstructured voice recordings and administrative workflows by using multimodal AI to transcribe audio, classify clinical urgency, extract patient and provider entities, and route requests to appropriate clinical departments.

---

## Architecture Overview

```mermaid
flowchart LR
    subgraph Client ["Client Layer (Next.js 15 App Router)"]
        REC["Audio Recorder (MediaRecorder API)"]
        DASH["Triage Dashboard (React / Chart.js)"]
        INBOX["Clinical Inbox & Detail Editor"]
    end

    subgraph Storage ["Blob Storage"]
        BLOB["Vercel Blob Storage"]
    end

    subgraph Backend ["Server & Processing Layer"]
        TRPC["tRPC v11 Router"]
        GEMINI["Google Gemini 2.5 Flash (Multimodal Audio API)"]
    end

    subgraph Persistence ["Data Layer"]
        PRISMA["Prisma ORM"]
        DB[(PostgreSQL 16)]
    end

    REC -->|1. Stream audio payload| BLOB
    REC -->|2. Send audio URL| TRPC
    TRPC -->|3. Pass audio bytes + prompt| GEMINI
    GEMINI -->|4. Return structured JSON| TRPC
    TRPC -->|5. Persist triage record| PRISMA
    PRISMA --> DB
    DASH & INBOX <-->|End-to-end type safety| TRPC
```

---

## Key Engineering Features

- **Multimodal Audio Processing**: Directly ingests audio streams (`audio/webm`, `audio/mp4`, `audio/mp3`) and utilizes Google Gemini 2.5 Flash inline audio parsing without relying on intermediate external speech-to-text APIs.
- **Strict Clinical Schema Enforcement**: Employs Gemini's response schema constraints (`Type.OBJECT`) to guarantee reliable JSON outputs containing summary, clinical priority level, extracted entities, and medical classification tags.
- **Automated Urgency Triage**: Evaluates patient complaints against four standardized clinical urgency tiers:
  - `EMERGENCY`: Immediate acute risks requiring emergency intervention.
  - `HIGH`: Urgent symptoms requiring prompt same-day physician callbacks.
  - `MEDIUM`: Standard consultations, prescription refills, or subacute questions.
  - `LOW`: Routine scheduling adjustments or administrative queries.
- **12-Department Medical Classification**: Routes voicemails into specific clinical bodies including *Cardiovascular, Respiratory, Nervous, Muscular, Skeletal, Immune, Endocrine, Digestive, Urinary, Integumentary, Reproductive*, or *General*.
- **End-to-End Type Safety**: Leverages tRPC v11 and Prisma ORM to guarantee compile-time type safety across database queries, server mutations, and client views.
- **Cross-Platform Containerization**: Includes Docker Compose configuration for local PostgreSQL instances.

---

## Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | React Server Components & client-side dashboard |
| **Language** | TypeScript 5.8 | End-to-end strict type checking |
| **API Layer** | tRPC v11 | Typesafe client-server remote procedure calls |
| **AI / NLP** | Google Gemini 2.5 Flash | Multimodal audio transcription & structured extraction |
| **Database** | PostgreSQL 16 & Prisma ORM | Relational schema, indices, migrations, and seeding |
| **Storage** | Vercel Blob Storage | Cloud storage for voicemail audio files |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons | Responsive modern dashboard interface |
| **DevOps & CI** | Docker Compose & GitHub Actions | Automated CI pipeline (lint, typecheck, build) |

---

## Getting Started

### Prerequisites
- Node.js 20+ and npm 10+
- Docker and Docker Compose (or a running PostgreSQL 15+ database)
- Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/CalebWu1/intelligent-voicemail.git
cd intelligent-voicemail
npm install
```

### 2. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Populate the required environment variables:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/intelligent-voicemail"
GEMINI_API_KEY="your-gemini-api-key"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 3. Start Local Database
Launch a local PostgreSQL container using Docker Compose:
```bash
docker compose up -d
```

### 4. Push Schema & Seed Data
Initialize the database tables and populate sample clinical voicemails:
```bash
npx prisma db push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run check`: Executes ESLint and TypeScript checks in one command.
- `npm run typecheck`: Runs `tsc --noEmit` to verify type safety.
- `npm run lint`: Runs Next.js ESLint checks.
- `npm run build`: Generates optimized production build.
- `npm run db:seed`: Seeds database with realistic after-hours voicemail triage cases.

---

## License

This project is open-source and licensed under the [MIT License](LICENSE).
