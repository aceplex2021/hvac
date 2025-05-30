# PROJECT RULES — HVAC SaaS Platform

This file defines non-negotiable development rules to be followed by all contributors, including AI coding assistants (e.g. Cursor, Copilot, ChatGPT). These rules exist to ensure structural consistency, efficiency, and codebase integrity.

---

## 🧠 Philosophy

- Do not "improve" or "refactor" code unless explicitly asked.
- Only perform **what is specifically requested**. Nothing more.
- Always reference existing code before suggesting new code.
- Never change folder or file structure unless explicitly told to.

---

## 🔧 Project Architecture

- Use **modular monorepo** structure.
- Folders: `apps/`, `packages/`, `modules/`, `shared/`
- Code separation:
  - **UI** in `apps/web`
  - **API** in `apps/api`
  - **Core services** in `modules/`
  - **Reusable logic** in `shared/`

### Folder Rules
| Folder | Purpose |
|--------|---------|
| `apps/web` | Next.js frontend |
| `apps/api` | REST or GraphQL backend |
| `modules/` | Business domains (e.g. scheduling, billing, dispatch) |
| `shared/` | Utilities, types, reusable services |

---

## 🧱 Coding Conventions

- Language: **TypeScript only**
- Styling: **TailwindCSS only**
- API: Prefer REST unless told otherwise
- Frameworks:
  - **Next.js (frontend)**
  - **Node + Express / tRPC (backend)**

---

## 🔍 AI-Specific Instructions (Cursor, etc.)

> These apply to every code suggestion, file, function, or modification made using Cursor or other AI assistants.

### ✅ Always

- Read and respect existing file and folder context.
- Maintain current architecture and naming conventions.
- Follow the prompt literally, do not add features unless requested.
- Ask for missing requirements rather than assuming.
- Comment major logic with JSDoc or inline comments if complex.

### 🚫 Never

- Refactor other functions without request.
- Move files or change folders unless asked.
- Convert class-based to functional (or vice versa) unless asked.
- Assume new libraries are allowed.
- Add abstraction unless explicitly requested.

---

## 📦 Component Patterns

### UI Components
- Use functional React with hooks
- Tailwind only — no external component libraries
- Keep components atomic and reusable

### Backend Services
- Service layer goes in `modules/[domain]/services`
- No database access in controllers or routes
- Use DTO pattern to transfer validated data

---

## 🧪 Testing

- All `modules` should include `__tests__` folder with unit tests.
- Use `Jest` for logic; `Playwright` for E2E.
- Never skip tests on PRs unless hotfix is approved.

---

## 🗃️ Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Files | kebab-case | `job-scheduler.ts` |
| Variables | camelCase | `serviceList` |
| Functions | camelCase | `assignTechnician()` |
| Classes | PascalCase | `ServiceRouteManager` |

---

## ✅ Prompt Templates for Cursor

> Use these when asking Cursor for help:

- `"Using existing logic only, add functionality to [file path] without changing structure."`
- `"Extend [module name] with a new function that does XYZ. Do not refactor existing code."`
- `"Review this service for compliance with PROJECT_RULES.md and report violations only."`
- `"Create a new controller in [path], following the pattern in [file]. Use only what's necessary."`

---

## 🔐 Final Notes

- This file MUST remain visible during AI code generation.
- If a change violates these rules, it must be manually reverted or rewritten.

