# Repository Public Release & SWE Portfolio Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the `intelligent-voicemail` repository into a pristine, production-grade open-source clinical triage portfolio project (**PulseTriage**) ready to feature prominently on a Software Engineer (SWE) resume.

**Architecture:** Purge binary bloat and generated files from Git; fix silent data mapping and query parameter bugs; harden environment validation and file upload actions; introduce Docker Compose and GitHub Actions CI; and replace the company take-home interview brief with a high-impact product README and architecture documentation.

**Tech Stack:** Next.js 15 (App Router), TypeScript, tRPC v11, Prisma ORM, PostgreSQL, Google Gemini 2.5 Flash, Vercel Blob, Docker Compose, GitHub Actions.

**Spec:** [repo-audit-report.md](file:///C:/Users/caleb/.gemini/antigravity-cli/brain/c2db53aa-c992-482b-a7b0-dfe4e42ebdf9/repo-audit-report.md)

## Global Constraints
- Keep all existing user features working (audio recording, Gemini multimodal transcription, inbox filtering, voicemail detail editing).
- Maintain documentation integrity and preserve functional code comments.
- Zero TypeScript (`tsc --noEmit`) errors.
- Zero ESLint warnings or errors (`next lint`).
- Successful production build (`next build`).
- No native binaries or credentials in Git.

---

### Task 1: Git Hygiene & Binary Bloat Purge

**Files:**
- Modify: `.gitignore`
- Untrack: `generated/`

- [ ] **Step 1: Update `.gitignore`**
Add `/generated/` and `*.tmp*` to `.gitignore` so Prisma build artifacts and temporary files are permanently ignored.

- [ ] **Step 2: Untrack `generated/` from Git cache**
Run `git rm -r --cached generated/` to remove the ~110 MB of Windows binaries (`.dll.node`) and temp files from Git tracking without deleting local files needed for running.

- [ ] **Step 3: Clean up dangling `.tmp*` files**
Delete local `query_engine-windows.dll.node.tmp*` files in `generated/prisma/`.

- [ ] **Step 4: Verify Git status**
Run `git status` to verify `generated/` files are untracked and `.gitignore` changes are staged or ready.

---

### Task 2: Code Bug Fixes & Schema Cleanliness

**Files:**
- Modify: `src/server/api/routers/voicemail.ts`
- Modify: `src/app/_components/dashboardChart.tsx`
- Modify: `src/app/inbox/_components/inboxWrapper.tsx`
- Modify: `src/app/_components/dashboardWrapper.tsx`
- Modify: `src/app/_components/navbar.tsx`
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Fix `doctorName` data persistence bug**
In `src/server/api/routers/voicemail.ts`: line 45, change `doctorName: input.processedData.patient_name ?? 'unknown'` to `doctorName: input.processedData.doctor_name ?? 'unknown'`. Clean up commented-out dummy procedures.

- [ ] **Step 2: Fix query param mismatch and unused variables in `dashboardChart.tsx`**
Align `handlePriorityClick` to use `/inbox?urgency=${priority}` (matching `inbox/page.tsx` and doughnut click). Remove unused `useEffect` and unused `handleLegendClick`.

- [ ] **Step 3: Fix HTML nesting violations & unused variables in `inboxWrapper.tsx`**
Remove outer `<button>` wrapping MUI `<FormControl>`/`<Select>`. Fix nested interactive button inside `<Link>`. Remove unused `Filter` import.

- [ ] **Step 4: Fix unused variables in `dashboardWrapper.tsx` and `navbar.tsx`**
Remove unused destructured `data`, `isPending` in `dashboardWrapper.tsx`. In `navbar.tsx`, remove unused icons (`Bell`, `HelpCircle`, `Search`) and replace raw `<img>` with Next.js `<Image />` or inline SVG.

- [ ] **Step 5: Remove leftover `Post` boilerplate from Prisma schema & seed**
Remove `model Post` from `prisma/schema.prisma` and remove `prisma.post.deleteMany()` / `prisma.post.create()` from `prisma/seed.ts`. Regenerate prisma client.

---

### Task 3: Environment Variable & Action Hardening

**Files:**
- Modify: `src/env.js`
- Modify: `.env.example`
- Modify: `src/app/actions.tsx`
- Modify: `src/server/api/routers/voicemail.ts`

- [ ] **Step 1: Update `src/env.js` schema**
Add `GEMINI_API_KEY: z.string().min(1)` and optional `BLOB_READ_WRITE_TOKEN: z.string().optional()` to the server environment schema and runtimeEnv destructing.

- [ ] **Step 2: Update `src/server/api/routers/voicemail.ts`**
Import `env` from `~/env` and initialize `new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })` safely.

- [ ] **Step 3: Update `.env.example`**
Include `DATABASE_URL`, `GEMINI_API_KEY`, and `BLOB_READ_WRITE_TOKEN` with clear documentation.

- [ ] **Step 4: Harden `src/app/actions.tsx` upload endpoint**
Add file size check (max 25MB) and type validation (`file.type.startsWith('audio/')`). Remove commented-out dead code.

---

### Task 4: Cross-Platform DevOps & OSS Scaffolding

**Files:**
- Create: `LICENSE`
- Create: `docker-compose.yml`
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create MIT `LICENSE`**
Standard MIT license with Caleb's copyright.

- [ ] **Step 2: Create `docker-compose.yml`**
Multiplatform PostgreSQL 16 container definition matching `.env.example` credentials for one-command dev setup (`docker compose up -d`).

- [ ] **Step 3: Create `.github/workflows/ci.yml`**
GitHub Actions workflow executing on pull requests and pushes to `main`: runs Node.js setup, npm install, Prisma generate, TypeScript typecheck (`tsc --noEmit`), and Next.js lint (`next lint`).

---

### Task 5: Production-Grade Portfolio README Rebranding

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write comprehensive, impressive `README.md`**
Rebrand as **PulseTriage — AI-Powered Clinical Voicemail & Triage Platform**.
Sections:
- Hero header with badges (Next.js, TypeScript, tRPC, Prisma, Gemini, Docker, Tailwind).
- System Architecture diagram (Mermaid sequence/flowchart).
- Problem & Clinical Workflow Overview.
- Core Engineering Features (Multimodal AI Extraction, 12-Department Clinical Routing, Dynamic Triage Inbox, Type-Safe Architecture).
- Quickstart & Docker Setup Guide.
- Environment Configuration.
- SWE Portfolio & Engineering Decisions highlights.

---

### Task 6: End-to-End Verification

- [ ] **Step 1: Run TypeScript typecheck**
`cmd /c "npm run typecheck"` -> Expect 0 errors.

- [ ] **Step 2: Run ESLint**
`cmd /c "npm run lint"` -> Expect 0 errors and 0 warnings.

- [ ] **Step 3: Run Next.js production build**
`cmd /c "npm run build"` -> Expect successful compile and page generation.

- [ ] **Step 4: Verify Git cleanliness**
Run `git status` to ensure all files are cleanly tracked with no leftover binaries or temporary artifacts.
